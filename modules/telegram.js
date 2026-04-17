/**
 * Telegram Bot API Integration
 */
export const TelegramBot = {
  async sendMessage(config, text) {
    if (!config.chatId) throw new Error('Telegram chat ID missing');

    if (config.useProxy) {
      return this._sendViaProxy('message', { text, chatId: config.chatId });
    }

    if (!config.token) throw new Error('Telegram bot token missing');
    const url = `https://api.telegram.org/bot${config.token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: config.chatId, text, parse_mode: 'HTML' })
    });
    return response.json();
  },

  async sendDocument(config, blob, filename, caption = '') {
    if (!config.chatId) throw new Error('Telegram chat ID missing');

    const formData = new FormData();
    formData.append('type', 'document');
    formData.append('chatId', config.chatId);
    formData.append('document', blob, filename);
    if (caption) formData.append('caption', caption);

    if (config.useProxy) {
      return this._sendViaProxy('document', formData);
    }

    if (!config.token) throw new Error('Telegram bot token missing');
    const telegramData = new FormData();
    telegramData.append('chat_id', config.chatId);
    telegramData.append('document', blob, filename);
    if (caption) telegramData.append('caption', caption);

    const url = `https://api.telegram.org/bot${config.token}/sendDocument`;
    const response = await fetch(url, {
      method: 'POST',
      body: telegramData
    });
    return response.json();
  },

  async _sendViaProxy(type, data) {
    const options = { method: 'POST' };

    if (data instanceof FormData) {
      options.body = data;
    } else {
      options.headers = { 'Content-Type': 'application/json' };
      options.body = JSON.stringify({ type, ...data });
    }

    const response = await fetch('send_telegram.php', options);
    return response.json();
  }
};
