// View your website at your own local server
// for example http://vite-php-setup.test

// http://localhost:3000 is serving Vite on development
// but accessing it directly will be empty

// IMPORTANT image urls in CSS works fine
// BUT you need to create a symlink on dev server to map this folder during dev:
// ln -s {path_to_vite}/src/assets {path_to_public_html}/assets
// on production everything will work just fine
import liveReload from 'vite-plugin-live-reload';
import {splitVendorChunkPlugin} from 'vite'
import ViteRestart from 'vite-plugin-restart'
import {nodeResolve} from '@rollup/plugin-node-resolve';
import path from 'path';

// const { resolve } = require('path');
// import svgSpritePlugin from "vite-plugin-svg-sprite-component"

// import { config } from './gulpfile.esm.js/config';

export default {
    // root: 'src/scripts/',
    // base: process.env.NODE_ENV === 'development' ? '/' : '/dist/',
    // base: process.env.NODE_ENV === 'development' ? '/' : '/site/templates/assets/js/',

    plugins: [
        splitVendorChunkPlugin(),
        nodeResolve({
            moduleDirectories: [
                path.resolve('./node_modules'),
            ],
        }),
        liveReload(__dirname + '*.(php|tpl|html)'),

        ViteRestart({
            reload: [
                'vite.config.js',
            ],
        }),
        // edit according to your source code
    ],
    resolve: {
        alias: {
            '@': '/src',
        },
    },
    server: {
        port: 3000,
        cors: true,
        host: 'localhost',
        // we need a strict port to match on PHP side
        // change freely, but update on PHP to match the same port
        strictPort: true,
        https: true,
    },
    build: {
      outDir: './dist',
      emptyOutDir: true,
      assetsDir: './',
      lib: {
        entry: path.resolve(__dirname, 'src/googleMapsAutocomplete.js'),
        name: 'address-autocomplete'
      },
      // generate manifest.json in outDir
      manifest: true,
      rollupOptions: {
        // overwrite default .html entry
        input: ['src/googleMapsAutocomplete.js'],
        output: {
          exports: "default",
          format: "es",
          // entryFileNames: 'entry-[name].js'
        }
        // plugins: [
        //   strip()
        // ]
      }
    }
};
