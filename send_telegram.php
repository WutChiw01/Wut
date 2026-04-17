<?php
/**
 * send_telegram.php
 * - Proxy for sending Telegram messages/documents from the web app
 * - Telegram webhook/state machine endpoint for bot mode
 */

declare(strict_types=1);

// CONFIGURATION: Set this to your production domain for security.
$ALLOWED_ORIGIN = 'https://distro.yourdomain.com';

header("Access-Control-Allow-Origin: $ALLOWED_ORIGIN"); 
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    exit;
}

$BOT_TOKEN = getenv('DISTO_TELEGRAM_BOT_TOKEN') ?: 'PUT_YOUR_BOT_TOKEN_HERE';
$DATA_DIR  = __DIR__ . '/projects';
if (!is_dir($DATA_DIR)) {
    if (!@mkdir($DATA_DIR, 0775, true)) {
        error_log("CRITICAL: Failed to create data directory: " . $DATA_DIR);
        jsonResponse(['ok' => false, 'description' => 'Server Configuration Error: Cannot create storage directory'], 500);
    }
}

function jsonResponse(array $data, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function getStateFile(string $chatId): string {
    global $DATA_DIR;
    $safe = preg_replace('/[^0-9\-]/', '', $chatId);
    return $DATA_DIR . '/state_' . $safe . '.json';
}

function loadState(string $chatId): array {
    $file = getStateFile($chatId);
    if (!is_file($file)) {
        return ['step' => 'START', 'history' => [], 'data' => []];
    }
    $data = json_decode((string) file_get_contents($file), true);
    return is_array($data) ? $data : ['step' => 'START', 'history' => [], 'data' => []];
}

function saveState(string $chatId, array $state): bool {
    global $DATA_DIR;
    $file = getStateFile($chatId);
    $data = json_encode($state, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    $res = file_put_contents($file, $data);
    if ($res === false) {
        error_log("CRITICAL: Failed to write state file: " . $file);
        return false;
    }
    return true;
}

function apiRequest(string $method, array $data): array {
    global $BOT_TOKEN;
    if (!$BOT_TOKEN || $BOT_TOKEN === 'PUT_YOUR_BOT_TOKEN_HERE') {
        return ['ok' => false, 'description' => 'Telegram bot token is not configured on the server'];
    }

    $url = "https://api.telegram.org/bot{$BOT_TOKEN}/{$method}";
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    $raw = curl_exec($ch);
    $error = curl_error($ch);
    curl_close($ch);

    if ($raw === false) {
        return ['ok' => false, 'description' => $error ?: 'cURL request failed'];
    }

    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : ['ok' => false, 'description' => 'Invalid Telegram response'];
}

function getBaseUrl(): string {
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (($_SERVER['SERVER_PORT'] ?? '') === '443');
    $scheme = $https ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
    $script = $_SERVER['SCRIPT_NAME'] ?? '/send_telegram.php';
    $dir = rtrim(str_replace('\\', '/', dirname($script)), '/');
    return $scheme . '://' . $host . ($dir ? $dir : '');
}

function getLaserLink(string $chatId, string $step): string {
    return getBaseUrl() . '/index.html?chatId=' . rawurlencode($chatId) . '&step=' . rawurlencode($step);
}

function sendNextMeasurementPrompt(string $chatId, string $next, string $label): array {
    $laserLink = getLaserLink($chatId, $next);
    $keyboard = ['inline_keyboard' => [[['text' => '↩️ แก้ไขค่าล่าสุด (Undo)', 'callback_data' => 'undo_last']]]];
    return apiRequest('sendMessage', [
        'chat_id' => $chatId,
        'text' => "บันทึกค่าเรียบร้อย ✅\n\n📍 ต่อไป: <b>{$label}</b>\n\n👉 พิมพ์ตอบกลับหรือใช้ Laser:\n<a href=\"{$laserLink}\">🔗 เปิดโหมดยิงเลเซอร์</a>",
        'parse_mode' => 'HTML',
        'reply_markup' => json_encode($keyboard, JSON_UNESCAPED_UNICODE)
    ]);
}

function finalizeSurvey(string $chatId, array $state): array {
    $d = $state['data'];
    $summary = "📊 <b>สรุปการสำรวจโครงการ: " . ($d['projectName'] ?? '-') . "</b>\n";
    $summary .= "- ชนิดโครง: " . ($d['trussType'] ?? '-') . "\n";
    $summary .= "- ความกว้าง: " . ($d['MEASURE_SPAN'] ?? '-') . " ม.\n";
    $summary .= "- ความสูง: " . ($d['MEASURE_HEIGHT'] ?? '-') . " ม.\n";
    $summary .= "- ความหน้าแป: " . ($d['MEASURE_PURLIN_DEPTH'] ?? '-') . " ม.\n";
    $summary .= "- ระยะแป: " . ($d['MEASURE_PURLIN_SPACING'] ?? '-') . " ม.";

    return apiRequest('sendMessage', [
        'chat_id' => $chatId,
        'text' => $summary . "\n\n✅ <b>การสำรวจเสร็จสิ้น!</b>\nกรุณากดปุ่มด้านล่างเพื่อตรวจสอบผลลัพธ์และสร้างรายงาน PDF",
        'parse_mode' => 'HTML',
        'reply_markup' => json_encode([
            'inline_keyboard' => [[['text' => '📄 เปิดดูรายงาน & สร้าง PDF', 'url' => getLaserLink($chatId, 'REVIEW')]]]
        ], JSON_UNESCAPED_UNICODE)
    ]);
}

function processMeasurementValue(string $chatId, string $text): array {
    if (!is_numeric($text)) {
        return ['ok' => false, 'description' => 'Value must be numeric'];
    }

    $state = loadState($chatId);
    $val = (float) $text;
    $step = $state['step'] ?? 'START';
    $warning = '';

    if ($step === 'MEASURE_PURLIN_DEPTH' && $val > 0.25) {
        $warning = '⚠️ <b>คำเตือน:</b> แปหนากว่า 25 ซม. ซึ่งผิดปกติมาก โปรดตรวจสอบอีกครั้ง';
    }
    if ($step === 'MEASURE_PURLIN_SPACING' && $val > 1.5) {
        $warning = '⚠️ <b>คำเตือน:</b> ระยะห่างแปเกิน 1.5 ม. เสี่ยงต่อแผ่นหลังคาแอ่นตัวเมื่อรับน้ำหนักเพิ่ม';
    }

    $state['data'][$step] = $val;
    $state['history'] = $state['history'] ?? [];
    $state['history'][] = $step;

    if ($step === 'MEASURE_SPAN') {
        $state['step'] = 'MEASURE_HEIGHT';
        if (!saveState($chatId, $state)) {
            return ['ok' => false, 'description' => 'Failed to save state to server'];
        }
        if ($warning) apiRequest('sendMessage', ['chat_id' => $chatId, 'text' => $warning, 'parse_mode' => 'HTML']);
        sendNextMeasurementPrompt($chatId, 'MEASURE_HEIGHT', 'ความสูงจั่ว (Apex Height)');
        return ['ok' => true];
    }
    if ($step === 'MEASURE_HEIGHT') {
        $state['step'] = 'MEASURE_PURLIN_DEPTH';
        if (!saveState($chatId, $state)) {
            return ['ok' => false, 'description' => 'Failed to save state to server'];
        }
        if ($warning) apiRequest('sendMessage', ['chat_id' => $chatId, 'text' => $warning, 'parse_mode' => 'HTML']);
        sendNextMeasurementPrompt($chatId, 'MEASURE_PURLIN_DEPTH', 'ความหน้าแป (Purlin Depth)');
        return ['ok' => true];
    }
    if ($step === 'MEASURE_PURLIN_DEPTH') {
        $state['step'] = 'MEASURE_PURLIN_SPACING';
        if (!saveState($chatId, $state)) {
            return ['ok' => false, 'description' => 'Failed to save state to server'];
        }
        if ($warning) apiRequest('sendMessage', ['chat_id' => $chatId, 'text' => $warning, 'parse_mode' => 'HTML']);
        sendNextMeasurementPrompt($chatId, 'MEASURE_PURLIN_SPACING', 'ระยะห่างแป (Purlin Spacing)');
        return ['ok' => true];
    }

    $state['step'] = 'FINALIZE';
    if (!saveState($chatId, $state)) {
        return ['ok' => false, 'description' => 'Failed to save state to server'];
    }
    if ($warning) apiRequest('sendMessage', ['chat_id' => $chatId, 'text' => $warning, 'parse_mode' => 'HTML']);
    finalizeSurvey($chatId, $state);
    return ['ok' => true];
}

// GET: state lookup for bot mode
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'GET' && isset($_GET['chatId'])) {
    $chatId = (string) $_GET['chatId'];
    $state = loadState($chatId);
    $state['ok'] = true;
    jsonResponse($state);
}

// POST
$rawInput = file_get_contents('php://input');
$contentType = $_SERVER['CONTENT_TYPE'] ?? $_SERVER['HTTP_CONTENT_TYPE'] ?? '';
$jsonInput = (strpos($contentType, 'application/json') !== false) ? json_decode($rawInput ?: 'null', true) : null;
if ($rawInput && !$jsonInput && strpos($contentType, 'application/json') !== false) {
    error_log("Failed to decode JSON input: " . substr($rawInput, 0, 100));
}

// 1) Web app proxy: send message
if (is_array($jsonInput) && (($jsonInput['type'] ?? '') === 'message')) {
    $chatId = trim((string) ($jsonInput['chatId'] ?? ''));
    $text = (string) ($jsonInput['text'] ?? '');
    if ($chatId === '' || $text === '') {
        jsonResponse(['ok' => false, 'description' => 'chatId and text are required'], 400);
    }
    $res = apiRequest('sendMessage', [
        'chat_id' => $chatId,
        'text' => $text,
        'parse_mode' => 'HTML'
    ]);
    jsonResponse($res, !empty($res['ok']) ? 200 : 500);
}

// 2) Web app proxy: send document
if (($_POST['type'] ?? '') === 'document' && isset($_POST['chatId'])) {
    $chatId = trim((string) $_POST['chatId']);
    if ($chatId === '' || !isset($_FILES['document'])) {
        jsonResponse(['ok' => false, 'description' => 'chatId and document are required'], 400);
    }
    $payload = [
        'chat_id' => $chatId,
        'caption' => (string) ($_POST['caption'] ?? ''),
        'parse_mode' => 'HTML',
        'document' => new CURLFile($_FILES['document']['tmp_name'], $_FILES['document']['type'] ?: 'application/pdf', $_FILES['document']['name'] ?: 'report.pdf')
    ];
    $res = apiRequest('sendDocument', $payload);
    jsonResponse($res, !empty($res['ok']) ? 200 : 500);
}

// 3) Bot mode: browser sends measured value back to Telegram flow
if (is_array($jsonInput) && isset($jsonInput['chatId'], $jsonInput['text']) && !isset($jsonInput['type'])) {
    $result = processMeasurementValue((string) $jsonInput['chatId'], (string) $jsonInput['text']);
    jsonResponse($result, !empty($result['ok']) ? 200 : 400);
}

// 4) Telegram webhook update
$update = json_decode($rawInput ?: 'null', true);
if (!is_array($update)) {
    jsonResponse(['ok' => false, 'description' => 'Unsupported request'], 400);
}

$message = $update['message'] ?? ($update['callback_query']['message'] ?? null);
if (!$message) {
    jsonResponse(['ok' => true]);
}

$chatId = (string) ($message['chat']['id'] ?? '');
$text = trim((string) ($update['message']['text'] ?? ''));
$data = (string) ($update['callback_query']['data'] ?? '');
$state = loadState($chatId);

if ($data === 'undo_last') {
    $lastStep = array_pop($state['history']);
    if ($lastStep) {
        unset($state['data'][$lastStep]);
        $state['step'] = $lastStep;
        if (!saveState($chatId, $state)) {
             apiRequest('sendMessage', ['chat_id' => $chatId, 'text' => '❌ เกิดข้อผิดพลาดในการบันทึกข้อมูล (Server Write Error)']);
             jsonResponse(['ok' => false]);
        }
        apiRequest('sendMessage', [
            'chat_id' => $chatId,
            'text' => "↩️ ยกเลิกค่าล่าสุดแล้ว กลับไปที่ขั้นตอน: <b>{$lastStep}</b>",
            'parse_mode' => 'HTML'
        ]);
    }
    jsonResponse(['ok' => true]);
}

if (strpos($text, '/new') === 0 || strpos($text, '/start') === 0) {
    $state = ['step' => 'ASK_NAME', 'history' => [], 'data' => []];
    if (!saveState($chatId, $state)) {
         apiRequest('sendMessage', ['chat_id' => $chatId, 'text' => '❌ เกิดข้อผิดพลาดในการเริ่มต้น (Server Write Error)']);
         jsonResponse(['ok' => false]);
    }
    $res = apiRequest('sendMessage', [
        'chat_id' => $chatId,
        'text' => '🚀 <b>ยินดีต้อนรับสู่ระบบสำรวจอัจฉริยะ</b>' . "\nกรุณาพิมพ์ <b>ชื่อลูกค้าหรือชื่อโครงการ</b> เพื่อเริ่มต้นครับ",
        'parse_mode' => 'HTML'
    ]);
    jsonResponse($res, !empty($res['ok']) ? 200 : 500);
}

if (($state['step'] ?? '') === 'ASK_NAME') {
    $state['data']['projectName'] = $text;
    $state['step'] = 'ASK_TRUSS_TYPE';
    if (!saveState($chatId, $state)) {
         apiRequest('sendMessage', ['chat_id' => $chatId, 'text' => '❌ เกิดข้อผิดพลาดในการบันทึกชื่อ (Server Write Error)']);
         jsonResponse(['ok' => false]);
    }
    $keyboard = [
        'inline_keyboard' => [
            [['text' => 'โครงหลัก (Main)', 'callback_data' => 'truss_main']],
            [['text' => 'โครงรอง (Sub)', 'callback_data' => 'truss_sub']],
            [['text' => 'โครงค้ำ (Support)', 'callback_data' => 'truss_support']]
        ]
    ];
    $res = apiRequest('sendMessage', [
        'chat_id' => $chatId,
        'text' => "รับทราบครับ โครงการ: <b>{$text}</b>\n\nกรุณาเลือก <b>ชนิดของโครงถัก</b> ที่ต้องการสำรวจครับ",
        'parse_mode' => 'HTML',
        'reply_markup' => json_encode($keyboard, JSON_UNESCAPED_UNICODE)
    ]);
    jsonResponse($res, !empty($res['ok']) ? 200 : 500);
}

if ($data !== '' && str_starts_with($data, 'truss_')) {
    $type = str_replace('truss_', '', $data);
    $state['data']['trussType'] = $type;
    $state['step'] = 'MEASURE_SPAN';
    saveState($chatId, $state);
    $laserLink = getLaserLink($chatId, 'MEASURE_SPAN');
    $res = apiRequest('sendMessage', [
        'chat_id' => $chatId,
        'text' => "📍 ขั้นตอนที่ 1: <b>วัดความกว้าง (Span)</b>\n\n👉 พิมพ์ตัวเลขตอบกลับ (เมตร)\n👉 หรือใช้โหมด Laser ที่นี่:\n<a href=\"{$laserLink}\">🔗 เปิดโหมดยิงเลเซอร์</a>",
        'parse_mode' => 'HTML'
    ]);
    jsonResponse($res, !empty($res['ok']) ? 200 : 500);
}

if (is_numeric($text)) {
    $result = processMeasurementValue($chatId, $text);
    jsonResponse($result, !empty($result['ok']) ? 200 : 400);
}

jsonResponse(['ok' => true]);
