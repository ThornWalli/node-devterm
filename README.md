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

### Get Temperatur or Battery

```js
import { getBattery, getTemperature } from 'devterm';

console.log(await getBattery()); // 0-100
console.log(await getTemperature()); // °C
```

### Use Printer

The printer uses the virtual SerialPort `/tmp/DEVTERM_PRINTER_IN` and supports the included actions.

https://github.com/clockworkpi/DevTerm/blob/main/Code/thermal_printer/devterm_thermal_printer.c

```js
import { createPrinter } from 'devterm';

// Create Printer instance
const printer = createPrinter()

// write Text
printer.writeLine('Hello World');

// write a image from filesystem or Url
await printer.writeImage('<filePath|Url>');

// write a qrcode
await printer.writeQRCode('Hello World');

// write a barcode
await printer.writeBarcode('Hello World');

```

## Printer Functions (Package)


### write
### writeBuffer
### reset
### writeLine
### writeCanvas
### writeImage
### writeQRCode
### writeBarcode
## Printer Functions (SerialPort)
### setAlign
### setMargin
### feedPitchByPixel
### feedPitchByFont
### setDensity
### setWordgap
### setUnderLine
### setLineSpace
### addCutline
### testPage