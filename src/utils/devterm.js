import fs from 'fs';
import glob from 'glob';
import { join } from 'path';
import SerialPort from 'serialport';

export const SERIAL_PORT_IN = '/tmp/DEVTERM_PRINTER_IN';
export const ADC_FILE_PATH = '/tmp/devterm_adc';
export const BATTERY_PATH = '/sys/class/power_supply/axp20x-battery/capacity';
export const TEMP_MAX = 64;

const NumSamples = 1;
const ADCResolution = 1024;
const SeriesResistor = 30000;
const RthNominal = 30000;
const BCoefficent = 3950;
const TempNominal = 25;

/**
 * @returns SerialPort
 */
export const getThermalPrinterPort = (autoOpen = false) => {
  return new SerialPort(SERIAL_PORT_IN, {
    baudRate: 115200,
    dataBits: 8,
    autoOpen
  });
};

export const readAdc = async (path) => {
  let data = await fs.promises.readFile(path);
  data = Number(String(data).replace('\n', ''));
  return data;
};

export const getBattery = async () => {
  try {
    return await readAdc(BATTERY_PATH);
  } catch (error) {
    throw new Error('Battery File cannot be opened');
  }
};

/**
 * Get temperature from thermal printer.
 * @returns Promise
 */
export const getThermalPrinterTemperature = async () => {
  let Rthermistor = 0; let TempThermistor = 0;
  let ADCSamples = 0;
  let Sample = 1;

  while (Sample <= NumSamples) {
    ADCSamples += await readAdc(ADC_FILE_PATH);
    Sample++;
  }
  // Thermistor Resistance at x Kelvin
  const ADCConvertedValue = ADCSamples / NumSamples;
  Rthermistor = (ADCResolution / ADCConvertedValue) - 1;
  Rthermistor = SeriesResistor / Rthermistor;
  // Thermistor temperature in Kelvin
  TempThermistor = Rthermistor / RthNominal;
  TempThermistor = Math.log(Math.abs(TempThermistor));
  TempThermistor /= BCoefficent;
  TempThermistor += (1 / (TempNominal + 273.15));
  TempThermistor = 1 / TempThermistor;

  return (TempThermistor - 273.15);
};

/**
 * Get temperatures from DevTerm.
 * CM3 is missing
 * @returns Promise
 */
export const getTemperatures = async () => {
  if (isDevTermA06()) {
    return Promise.all((await getThermalZoneDirs()).map(async (file) => Number(await fs.promises.readFile(join(file, 'temp'), 'utf-8')) / 1000));
  } else {
    return [];
  }
};

const getThermalZoneDirs = () => {
  return new Promise(resolve => {
    glob('/sys/class/thermal/thermal_zone[0-9]/', function (err, files) {
      if (err) {
        console.error(err);
        resolve([]);
      }
      files.sort();
      resolve(files);
    });
  });
};

/**
 * Checks if it is a DevTerm A06.
 * @returns Promise
 */
export const isDevTermA06 = async () => {
  return (await getThermalZoneDirs()).length > 0;
};
