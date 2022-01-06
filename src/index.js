import { getThermalPrinterPort } from 'devterm/utils/devterm';
import Printer from 'devterm/classes/Printer';

export { default as Printer } from 'devterm/classes/Printer';
export { getBattery, getThermalPrinterTemperature, getTemperatures, isDevTermA06 } from 'devterm/utils/devterm';
export { default as Table, TableColumn } from 'devterm/classes/Table';

export const createPrinter = () => {
  return new Printer(getThermalPrinterPort());
};
