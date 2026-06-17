import { defineConfig } from 'vitest/config'

export default defineConfig({

  // esbuild 0.28+ no longer downlevels some syntax (e.g. destructuring) to Vite's
  // default browser target. These browser tests run in modern headless Chromium,
  // so use a modern target for dependency optimization and source transforms.
  esbuild: {
    target: 'es2022',
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2022',
    },
  },

  test: {
    browser: {
      enabled: true,
      headless: true,
      screenshotFailures: false,
      name: 'chromium',
      provider: 'playwright',
      testerScripts: [
        {
          src: './node_modules/dayjs/dayjs.min.js',
          type: 'text/javascript',
        },
        {
          src: './node_modules/dayjs/plugin/customParseFormat.js',
          type: 'text/javascript',
        },
        {
          src: './thirdParty/big.js/big.min.js',
          type: 'text/javascript',
        },
        {
          src: './thirdParty/toFormat/toFormat.min.js',
          type: 'text/javascript',
        },
        {
          src: './thirdParty/regression/regression.min.js', //our regression uses big.js
          type: 'text/javascript',
        },
        {
          src: './thirdParty/papaparse/papaparse.umd.js',
          type: 'text/javascript',
        },
        {
          src: './csvEditorHtml/util.ts',
          type: 'text/javascript',
        },
        {
          src: './csvEditorHtml/io.ts',
          type: 'text/javascript',
        },
        {
          src: './csvEditorHtml/autoFill.ts',
          type: 'text/javascript',
        },
        //could also be moved to init...
        {
          content: `
          window.numbersStyleEnRadio = {
            checked: true
          }
          //add toFormat to big numbers
          toFormat(Big)
          //for custom formatted dates
          dayjs.extend(dayjs_plugin_customParseFormat);
          
          `,
          type: 'text/javascript',
        },
        {
          src: './csvEditorHtml/test/init.ts',
          type: 'text/javascript',
        },

      ],
    },
    include: ['csvEditorHtml/test/**/*.test.ts'],
  },
})