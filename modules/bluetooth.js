/**
 * bluetooth.js โ€” Leica Disto BLE Connection Module
 *
 * เธฃเธญเธเธฃเธฑเธ 2 mode เธเธฒเธฃเธฃเธฑเธเธเนเธฒเธเธฒเธเน€เธเธฃเธทเนเธญเธ Disto:
 *  1. App Mode (BLE GATT): เน€เธเธทเนเธญเธกเธ•เนเธญเนเธ”เธขเธ•เธฃเธเธเนเธฒเธ Web Bluetooth API
 *  2. Keyboard Mode (HID): เธฃเธฑเธเธเนเธฒเน€เธซเธกเธทเธญเธ keyboard input เธฅเธเนเธ hidden input field
 */

// Known Leica Disto BLE Service/Characteristic UUIDs
// (เธ•เนเธญเธเธขเธทเธเธขเธฑเธเธ”เนเธงเธข nRF Connect เนเธฅเนเธงเธญเธฑเธเน€เธ”เธ•เธเนเธฒเธเธตเนเธ•เธฒเธกเน€เธเธฃเธทเนเธญเธเธเธฃเธดเธ)
const DISTO_BLE = {
  SERVICE_UUID:         '3ab10100-f831-4395-b29d-570977d5bf94',
  CHAR_MEASUREMENT:     '3ab10101-f831-4395-b29d-570977d5bf94',  // Notification characteristic
  CHAR_COMMAND:         '3ab10102-f831-4395-b29d-570977d5bf94',  // Write characteristic
  // Alternative generic services (some models use standard)
  ALT_SERVICE:          '00001800-0000-1000-8000-00805f9b34fb',
};

/**
 * Class เธชเธณเธซเธฃเธฑเธเธเธฑเธ”เธเธฒเธฃเธเธฒเธฃเน€เธเธทเนเธญเธกเธ•เนเธญ Bluetooth เธเธฑเธ Leica Disto
 */
export class LeicaDistoBluetooth {
  constructor(onMeasurement, onStatusChange) {
    this.device = null;
    this.server = null;
    this.characteristic = null;
    this.connected = false;
    this.onMeasurement = onMeasurement;       // callback(data: {distance, tilt})
    this.onStatusChange = onStatusChange;     // callback(status: string, type: 'info'|'success'|'error'|'warning')
    this.mode = 'ble'; // 'ble' or 'keyboard'
    this._keyboardBuffer = '';
    this._keyboardHandler = null;
  }

  /**
   * เธ•เธฃเธงเธเธชเธญเธเธงเนเธฒเน€เธเธฃเธฒเธงเนเน€เธเธญเธฃเนเธฃเธญเธเธฃเธฑเธ Web Bluetooth เธซเธฃเธทเธญเนเธกเน
   */
  static isSupported() {
    return !!(navigator.bluetooth);
  }

  /**
   * เน€เธเธทเนเธญเธกเธ•เนเธญ BLE เธเธฑเธ Leica Disto (App Mode)
   */
  async connectBLE() {
    if (!LeicaDistoBluetooth.isSupported()) {
      this.onStatusChange('iPhone/Safari เนเธกเนเธฃเธญเธเธฃเธฑเธ BLE เนเธ”เธขเธ•เธฃเธ\nเนเธเธฐเธเธณเนเธซเนเนเธเน Keyboard Mode (HID)', 'warning');
      return false;
    }

    try {
      this.onStatusChange('เธเธณเธฅเธฑเธเธเนเธเธซเธฒเธญเธธเธเธเธฃเธ“เน Leica Disto...', 'info');

      this.device = await navigator.bluetooth.requestDevice({
        filters: [
          { namePrefix: 'Disto' },
          { namePrefix: 'DISTO' },
          { namePrefix: 'Leica' },
        ],
        optionalServices: [
          DISTO_BLE.SERVICE_UUID,
          DISTO_BLE.ALT_SERVICE,
          'battery_service',
          'device_information',
        ]
      });

      this.device.addEventListener('gattserverdisconnected', () => this._onDisconnected());
      this.onStatusChange(`เธเธเธญเธธเธเธเธฃเธ“เน: ${this.device.name} โ€” เธเธณเธฅเธฑเธเน€เธเธทเนเธญเธกเธ•เนเธญ...`, 'info');

      this.server = await this.device.gatt.connect();
      this.onStatusChange('เน€เธเธทเนเธญเธกเธ•เนเธญ GATT เธชเธณเน€เธฃเนเธ โ€” เธเธณเธฅเธฑเธเธเนเธเธซเธฒ service...', 'info');

      // เธฅเธญเธเธซเธฒ Service UUID เธเธญเธ Leica
      let service = null;
      try {
        service = await this.server.getPrimaryService(DISTO_BLE.SERVICE_UUID);
      } catch (e) {
        // เธฅเธญเธเธเนเธเธซเธฒ service เธ—เธฑเนเธเธซเธกเธ”
        this.onStatusChange('เนเธกเนเธเธ Leica service UUID เธกเธฒเธ•เธฃเธเธฒเธ โ€” เธเธณเธฅเธฑเธเธชเนเธเธ services เธ—เธฑเนเธเธซเธกเธ”...', 'warning');
        const services = await this.server.getPrimaryServices();
        if (services.length > 0) {
          service = services[0];
          this.onStatusChange(`เธเธ service: ${service.uuid}`, 'info');
        } else {
          throw new Error('เนเธกเนเธเธ GATT Service เธเธเธญเธธเธเธเธฃเธ“เนเธเธตเน');
        }
      }

      // เธเนเธเธซเธฒ Characteristic เธชเธณเธซเธฃเธฑเธเธฃเธฑเธเธเนเธฒ
      let measureChar = null;
      const characteristics = await service.getCharacteristics();
      for (const char of characteristics) {
        if (char.properties.notify || char.properties.indicate) {
          measureChar = char;
          break;
        }
      }

      if (!measureChar) {
        throw new Error('เนเธกเนเธเธ Measurement Characteristic (notify/indicate)');
      }

      this.characteristic = measureChar;
      await this.characteristic.startNotifications();
      this.characteristic.addEventListener('characteristicvaluechanged', (event) => {
        this._parseBLEData(event.target.value);
      });

      this.connected = true;
      this.mode = 'ble';
      this.onStatusChange(`โ“ เน€เธเธทเนเธญเธกเธ•เนเธญ ${this.device.name} เธชเธณเน€เธฃเนเธ! เธเธ”เธเธธเนเธก Measure เธเธเน€เธเธฃเธทเนเธญเธเนเธ”เนเน€เธฅเธข`, 'success');
      return true;

    } catch (err) {
      this.onStatusChange(`เน€เธเธทเนเธญเธกเธ•เนเธญเธฅเนเธกเน€เธซเธฅเธง: ${err.message}`, 'error');
      return false;
    }
  }

  /**
   * Parse เธเนเธญเธกเธนเธฅ BLE เธ—เธตเนเธฃเธฑเธเธกเธฒเธเธฒเธเน€เธเธฃเธทเนเธญเธ Disto
   * Format เธเธถเนเธเธเธฑเธเธฃเธธเนเธ โ€” เธเธฃเธฑเธเธเนเธฒ byte offset เนเธเธเธตเนเธ•เธฒเธกเน€เธเธฃเธทเนเธญเธเธเธฃเธดเธ
   */
  _parseBLEData(dataView) {
    try {
      // Common Leica Disto format: Little-endian 32-bit float at offset 0 or 4
      const rawBytes = new Uint8Array(dataView.buffer);
      console.log('[BLE RAW]', rawBytes);

      // เธฅเธญเธเธญเนเธฒเธเธเนเธฒเธฃเธฐเธขเธฐเธ—เธฒเธเนเธเธฃเธนเธเนเธเธเธ•เนเธฒเธเน
      let distance = null;
      let tilt = null;

      // Format 1: 4-byte float, distance in mm
      if (rawBytes.length >= 4) {
        const mm = dataView.getInt32(0, true); // little-endian
        if (mm > 0 && mm < 120000) {
          distance = mm / 1000; // เนเธเธฅเธ mm โ’ m
        }
      }

      // Format 2: distance as float32 (เน€เธกเธ•เธฃ)
      if (distance === null && rawBytes.length >= 4) {
        const d = dataView.getFloat32(0, true);
        if (d > 0 && d < 120) {
          distance = d;
        }
      }

      // Format 3: เธฅเธญเธ byte เธญเธทเนเธ
      if (distance === null && rawBytes.length >= 8) {
        const mm2 = dataView.getInt32(4, true);
        if (mm2 > 0 && mm2 < 120000) {
          distance = mm2 / 1000;
        }
      }

      // Tilt: int16 in 0.01 degree units
      if (rawBytes.length >= 6) {
        const tiltRaw = dataView.getInt16(4, true);
        if (Math.abs(tiltRaw) <= 9000) {
          tilt = tiltRaw / 100; // เนเธเธฅเธเน€เธเนเธเธญเธเธจเธฒ
        }
      }

      if (distance !== null) {
        console.log('[BLE PARSED] Distance:', distance, 'm, Tilt:', tilt, 'ยฐ');
        this.onMeasurement({ distance, tilt, source: 'ble' });
      } else {
        console.log('[BLE] เนเธกเนเธชเธฒเธกเธฒเธฃเธ– parse เธเนเธญเธกเธนเธฅเนเธ”เน raw:', rawBytes);
      }
    } catch (err) {
      console.error('[BLE PARSE ERROR]', err);
    }
  }

  /**
   * Mode เธชเธณเธฃเธญเธ: เธฃเธฑเธเธเนเธฒเธเธฒเธ Leica Disto เนเธเนเธซเธกเธ” Keyboard (HID)
   * เน€เธเธฃเธทเนเธญเธเธเธฐเธชเนเธเธเนเธฒเน€เธเนเธ text เน€เธเนเธ "2.345\n" เธซเธฃเธทเธญ "2.345 m\n"
   */
  enableKeyboardMode(targetInputId = 'keyboard-intercept') {
    this.mode = 'keyboard';
    this.disconnectBLE();

    this._keyboardBuffer = '';
    this._keyboardHandler = (e) => {
      const key = e.key;
      if (/^[0-9.]$/.test(key)) {
        this._keyboardBuffer += key;
      } else if (key === 'Enter' || key === 'Tab') {
        const val = parseFloat(this._keyboardBuffer);
        if (!isNaN(val) && val > 0 && val < 200) {
          this.onMeasurement({ distance: val, tilt: null, source: 'keyboard' });
        }
        this._keyboardBuffer = '';
      }
    };

    window.addEventListener('keydown', this._keyboardHandler);
    this.onStatusChange('Keyboard Mode: เน€เธเธดเธ”เนเธเนเธเธฒเธเนเธฅเนเธง เธเธ”เธขเธดเธเธเธเน€เธเธฃเธทเนเธญเธเน€เธเธทเนเธญเธชเนเธเธเนเธฒ', 'success');
  }

  /**
   * เธ•เธฑเธ”เธเธฒเธฃเน€เธเธทเนเธญเธกเธ•เนเธญ BLE
   */
  async disconnectBLE() {
    if (this._keyboardHandler) {
      window.removeEventListener('keydown', this._keyboardHandler);
      this._keyboardHandler = null;
    }
    if (this.characteristic) {
      try { await this.characteristic.stopNotifications(); } catch {}
    }
    if (this.device && this.device.gatt.connected) {
      this.device.gatt.disconnect();
    }
    this.connected = false;
    this.device = null;
    this.server = null;
    this.characteristic = null;
  }

  _onDisconnected() {
    this.connected = false;
    this.onStatusChange('เธซเธฅเธธเธ”เธเธฒเธฃเน€เธเธทเนเธญเธกเธ•เนเธญเธเธฑเธ Leica Disto', 'warning');
  }

  /**
   * เธชเนเธเธเธณเธชเธฑเนเธเนเธเน€เธเธฃเธทเนเธญเธ (เน€เธเนเธ trigger measurement)
   */
  async sendCommand(hexCmd) {
    if (!this.characteristic || !this.connected) return;
    try {
      const bytes = hexCmd.match(/../g).map(h => parseInt(h, 16));
      await this.characteristic.writeValue(new Uint8Array(bytes));
    } catch (err) {
      console.error('[BLE CMD]', err);
    }
  }
}
