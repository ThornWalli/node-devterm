# node-devterm

> Written on a DevTerm.

Package for using the DevTerm with Node.

- Usage Printer
- Get Battery or Temperature

## Install

```bash

# Required for installing node-canvas on a DevTerm.
# https://github.com/Automattic/node-canvas#compiling 

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
### printer.write(value)
- `value` `<Buffer>` | `<String>`
- **Returns** `<Promise>`

Print `Buffer` or `String`.
### printer.writeLine(value)
- `value` `<String>`
- **Returns** `<Promise>`

Print a multiline text. For line breaks use `\n`.
### printer.writeCanvas(canvas, [options])
- `canvas` `<Canvas>`
- `options` `<Object>` [Options](#canvas-options)
- **Returns** `<Promise>`

Print canvas from package [`node-canvas`](https://github.com/Automattic/node-canvas).
### printer.writeQRCode(text, [qrCodeOptions, options])
- `text` `<String>`
- `qrCodeOptions` `<Object>` [QRCode Options](https://github.com/soldair/node-qrcode#qr-code-options)
- `options` `<Object>` [Options](#canvas-options)

Print a QRCode. 

Uses [`node-qrcode`](https://github.com/soldair/node-qrcode) for generating.
### printer.writeBarcode(text, [barcodeOptions, options])
- `text` `<String>`
- `barcodeOptions` `<Object>` [Barcode Options](https://github.com/lindell/JsBarcode/wiki/Options)
- `options` `<Object>` [Options](#canvas-options)

Print a Barcode. 

Uses [`jsbarcode`](https://github.com/lindell/JsBarcode) for generating.
## Printer Functions (SerialPort)

### printer.reset()
Reset printer options.

https://github.com/clockworkpi/DevTerm/blob/ed9ab854c551e2002c9240eaa68bf91a108d3355/Code/thermal_printer/devterm_thermal_printer.c#L429

### printer.setAlign(value)
- `value` `<Number>`
- **Return** `<Promise>`

Sets print alignment.

| Align  | `value` |
| ------ | ------- |
| Left   | `0`     |
| Center | `1`     |
| Right  | `2`     |

https://github.com/clockworkpi/DevTerm/blob/ed9ab854c551e2002c9240eaa68bf91a108d3355/Code/thermal_printer/devterm_thermal_printer.c#L482

### printer.setMargin(value)
- `value` `<Number>`
- **Return** `<Promise>`

Sets Margin by percentage in `float` number.

Example: `25%` => `0.25`

https://github.com/clockworkpi/DevTerm/blob/ed9ab854c551e2002c9240eaa68bf91a108d3355/Code/thermal_printer/devterm_thermal_printer.c#L546

### printer.setFont(value)
- `value` `<Number>`
- **Return** `<Promise>`

Sets print font.

| Align  | `value` |
| ------ | ------- |
| 8x16 A | `0`     |
| 8x16 B | `4`     |
| 5x7    | `1`     |
| 6x12   | `2`     |
| 7x14   | `3`     |

https://github.com/clockworkpi/DevTerm/blob/ed9ab854c551e2002c9240eaa68bf91a108d3355/Code/thermal_printer/devterm_thermal_printer.c#L456

### printer.setDensity(value)
- `value` `<Number>`
- **Return** `<Promise>`

Sets print density from 0 to 15 for Dark.

https://github.com/clockworkpi/DevTerm/blob/ed9ab854c551e2002c9240eaa68bf91a108d3355/Code/thermal_printer/devterm_thermal_printer.c#L524
### printer.setWordGap(value)
- `value` `<Number>`
- **Return** `<Promise>`

Sets word gap.

https://github.com/clockworkpi/DevTerm/blob/ed9ab854c551e2002c9240eaa68bf91a108d3355/Code/thermal_printer/devterm_thermal_printer.c#L514
### printer.setUnderLine(value)
- `value` `<Number>`
- **Return** `<Promise>`

> Benefit still unknown.

https://github.com/clockworkpi/DevTerm/blob/ed9ab854c551e2002c9240eaa68bf91a108d3355/Code/thermal_printer/devterm_thermal_printer.c#L497
### printer.setLineSpace(value)
- `value` `<Number>`
- **Return** `<Promise>`

Sets print line space.

https://github.com/clockworkpi/DevTerm/blob/ed9ab854c551e2002c9240eaa68bf91a108d3355/Code/thermal_printer/devterm_thermal_printer.c#L423

### printer.writeImage(url, [options])
- `url` `<String>` | `<Buffer>`
- `options` `<Object>` [Options](#canvas-options)
- **Return** `<Promise>`

Print a image from path, url or `Buffer`.

https://github.com/clockworkpi/DevTerm/blob/ed9ab854c551e2002c9240eaa68bf91a108d3355/Code/thermal_printer/devterm_thermal_printer.c#L578

### printer.feedPitchByPixel(value)
- `value` `<Number>`
- **Return** `<Promise>`

Feed pitch by pixel.

https://github.com/clockworkpi/DevTerm/blob/ed9ab854c551e2002c9240eaa68bf91a108d3355/Code/thermal_printer/devterm_thermal_printer.c#L444
### printer.feedPitchByFont(value)
- `value` `<Number>`
- **Return** `<Promise>`

Feed pitch by current font size.

https://github.com/clockworkpi/DevTerm/blob/ed9ab854c551e2002c9240eaa68bf91a108d3355/Code/thermal_printer/devterm_thermal_printer.c#L450

### printer.addCutLine()
- **Return** `<Promise>`

Add cut line.

https://github.com/clockworkpi/DevTerm/blob/ed9ab854c551e2002c9240eaa68bf91a108d3355/Code/thermal_printer/devterm_thermal_printer.c#L532

### printer.testPage()
- **Return** `<Promise>`

Print internal test page

https://github.com/clockworkpi/DevTerm/blob/ed9ab854c551e2002c9240eaa68bf91a108d3355/Code/thermal_printer/devterm_thermal_printer.c#L435


## Utils

### printer.getBattery()
- **Return** <Promise>

Gets the battery status
### printer.getTemperatures()
- **Return** <Promise>

Gets temperatures from DevTerm.

> Currently only the DevTerm A06 is supported.
### printer.getThermalPrinterTemperature()
- **Return** <Promise>

Gets temperature from thermal printer.
### printer.isDevTermA06()
- **Return** <Promise>

Gets if it is a DevTerm A06.

## Canvas Options

| Name      | Type      | Description                                                                                                             | Default |
| --------- | --------- | ----------------------------------------------------------------------------------------------------------------------- | ------- |
| width     | `Number`  | Sets image width. Max width is `384`                                                                                    | `null`  |
| rotate    | `Boolean` | When set, image is rotated 90 degrees.                                                                                  | `false` |
| flipX     | `Boolean` | When set, image is flipped horizontally.                                                                                | `false` |
| flipY     | `Boolean` | When set, image is flipped vertically.                                                                                  | `false` |
| grayscale | `Boolean` | When set, the image is processed with the [`Floyd Steinberg`](https://www.npmjs.com/package/floyd-steinberg) algorithm. | `false` |


