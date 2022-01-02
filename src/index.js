import { getThermalPrinterPort } from 'node-devterm/utils/devterm';
import Printer from 'node-devterm/classes/Printer';

export { default as Printer } from 'node-devterm/classes/Printer';
export { getBattery, getThermalPrinterTemperature, getTemperatures, isDevTermA06 } from 'node-devterm/utils/devterm';
export { default as Table, TableColumn } from 'node-devterm/classes/Table';

export const createPrinter = () => {
  return new Printer(getThermalPrinterPort());
};
