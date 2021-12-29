# node-devterm
ToolBox für die Verwendung des DevTerms in Node.

- Usage Printer
- Get Battery or Temperature

## Install

```bash

# Required for installing node-canvas on a DevTerm.
# https://github.com/Automattic/node-canvas/issues/1662

$ sudo apt-get update 
$ sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

npm i devterm --save

```

## Usage

### Utils

```js
import { getBattery, getTemperature } from 'devterm';

/**
 * Get current battery load (0-100)
 */
console.log(await getBattery());

/**
 * Gets a Array with temperatues in celsius.
 */
console.log(await getTemperatures());

/**
 * Get thermalprinter temperature in celsius.
 */
console.log(await getThermalPrinterTemperature());

/**
 * Checks if devterm is A06.
 */
console.log(await isDevTermA06());
```

### Printer

The printer uses the virtual SerialPort `/tmp/DEVTERM_PRINTER_IN` and supports the included actions.

https://github.com/clockworkpi/DevTerm/blob/main/Code/thermal_printer/devterm_thermal_printer.c



```js
import { createPrinter } from 'devterm';

// Create Printer instance
const printer = createPrinter()

// write Text
printer.writeLine('Hello World');

// write a image from filepath, url, buffer
await printer.writeImage('<filePath|Url|Blob|Buffer>');

// write a qrcode
await printer.writeQRCode('Hello World');

// write a barcode
await printer.writeBarcode('Hello World');

```

## Printer Functions (Package)


### write
### writeBuffer
### writeLine
Prints a String.
### writeCanvas



Prints canvas from package [`node-canvas`](https://github.com/Automattic/node-canvas).
### writeQRCode
Prints a QRCode. Uses [`node-qrcode`](https://github.com/soldair/node-qrcode) for generating.
### writeBarcode
Prints a Barcode. Uses [`jsbarcode`](https://github.com/lindell/JsBarcode) for generating.
## Printer Functions (SerialPort)


### reset
https://github.com/clockworkpi/DevTerm/blob/ed9ab854c551e2002c9240eaa68bf91a108d3355/Code/thermal_printer/devterm_thermal_printer.c#L429

### setAlign
https://github.com/clockworkpi/DevTerm/blob/ed9ab854c551e2002c9240eaa68bf91a108d3355/Code/thermal_printer/devterm_thermal_printer.c#L482

### setMargin
https://github.com/clockworkpi/DevTerm/blob/ed9ab854c551e2002c9240eaa68bf91a108d3355/Code/thermal_printer/devterm_thermal_printer.c#L546

### setFont
https://github.com/clockworkpi/DevTerm/blob/ed9ab854c551e2002c9240eaa68bf91a108d3355/Code/thermal_printer/devterm_thermal_printer.c#L456

### setDensity
https://github.com/clockworkpi/DevTerm/blob/ed9ab854c551e2002c9240eaa68bf91a108d3355/Code/thermal_printer/devterm_thermal_printer.c#L524
### setWordGap
https://github.com/clockworkpi/DevTerm/blob/ed9ab854c551e2002c9240eaa68bf91a108d3355/Code/thermal_printer/devterm_thermal_printer.c#L514
### setUnderLine
https://github.com/clockworkpi/DevTerm/blob/ed9ab854c551e2002c9240eaa68bf91a108d3355/Code/thermal_printer/devterm_thermal_printer.c#L497
### setLineSpace
https://github.com/clockworkpi/DevTerm/blob/ed9ab854c551e2002c9240eaa68bf91a108d3355/Code/thermal_printer/devterm_thermal_printer.c#L423

### writeImage
https://github.com/clockworkpi/DevTerm/blob/ed9ab854c551e2002c9240eaa68bf91a108d3355/Code/thermal_printer/devterm_thermal_printer.c#L578

### feedPitchByPixel
https://github.com/clockworkpi/DevTerm/blob/ed9ab854c551e2002c9240eaa68bf91a108d3355/Code/thermal_printer/devterm_thermal_printer.c#L444
### feedPitchByFont
https://github.com/clockworkpi/DevTerm/blob/ed9ab854c551e2002c9240eaa68bf91a108d3355/Code/thermal_printer/devterm_thermal_printer.c#L450

### addCutLine
https://github.com/clockworkpi/DevTerm/blob/ed9ab854c551e2002c9240eaa68bf91a108d3355/Code/thermal_printer/devterm_thermal_printer.c#L532

### testPage
https://github.com/clockworkpi/DevTerm/blob/ed9ab854c551e2002c9240eaa68bf91a108d3355/Code/thermal_printer/devterm_thermal_printer.c#L435
