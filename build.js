import { build } from 'esbuild';
import babel from 'esbuild-plugin-babel';

const inputs = [
  { src: './src/index.js', name: 'devterm' },
  { src: './src/config.js', name: 'devterm.config' },
  { src: './src/classes/Printer.js', name: 'devterm.classes.printer' },
  { src: './src/classes/Table.js', name: 'devterm.classes.table' },
  { src: './src/utils/buffer.js', name: 'devterm.utils.buffer' },
  { src: './src/utils/canvas.js', name: 'devterm.utils.canvas' },
  { src: './src/utils/devterm.js', name: 'devterm.utils.devterm' },
  { src: './src/utils/image.js', name: 'devterm.utils.image' },
  { src: './src/utils/string.js', name: 'devterm.utils.string' },
  { src: './src/utils/stuff.js', name: 'devterm.utils.stuff' },
  { src: './src/charFonts/3x5.js', name: 'devterm.charfonts._3x5' }
];

const defaultOptions = {
  bundle: false,
  minify: false,
  sourcemap: true,
  treeShaking: true,
  platform: 'node',
  outbase: 'src',
  // external: ['canvas', 'serialport', 'fs', 'path']
};

const onCatch = (err) => { console.error(err); global.process.exit(1); };

inputs.forEach((item) => {
  build({
    ...defaultOptions,
    entryPoints: [item.src],
    format: 'iife',
    globalName: item.name,
    outdir: './build/iife'
  }).catch(onCatch);

  build({
    ...defaultOptions,
    entryPoints: [item.src],
    format: 'esm',
    splitting: true,
    outdir: './build/esm/',
    outExtension: { '.js': '.js' }
  }).catch(onCatch);

  build({
    ...defaultOptions,
    entryPoints: [item.src],
    format: 'cjs',
    outdir: './build/cjs/',
    plugins: [babel()],
    outExtension: { '.js': '.cjs' }
  }).catch(onCatch);
});
