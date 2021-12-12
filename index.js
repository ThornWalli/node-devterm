import { getThermalPrinterPort } from './utils/devterm.js';
import Printer from './classes/Printer.js';

export { default as Printer } from './classes/Printer.js';
export { default as Table, TableColumn } from './classes/Table.js';

export const createPrinter = () => {
  return new Printer(getThermalPrinterPort());
};
