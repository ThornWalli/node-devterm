import fs from 'fs';
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
export const getThermalPrinterPort = () => {
  return new SerialPort(SERIAL_PORT_IN, {
    baudRate: 115200,
    dataBits: 8
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

export const getTemperature = async () => {
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
