import pkg from './package.json';
import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import css from 'rollup-plugin-css-porter';

export default [
    {
        input: 'example/App.js',
        output: {
            file: 'public/main.js',
            format: 'iife',
            sourcemap: true,
            name: 'Example',
        },
        plugins: [
            json(),
            resolve({
                dedupe: [
                    '@scanex/event-target',
                    'core-js',
                ]
            }),
            commonjs(),
            css({dest: 'public/main.css', minified: false}),
            babel({                
                extensions: ['.js', '.mjs'],
                exclude: ['node_modules/@babel/**', 'node_modules/core-js/**'],
                include: ['example/App.js', 'src/**']
            }),
        ],
    },
    {
        input: pkg.module,
        output: { 
            file: pkg.main,
            format: 'cjs',
            sourcemap: true,
        },
        plugins: [
	        json(),
            resolve({
                dedupe: [
                    '@scanex/event-target',
                    'core-js',
                ]
            }),
            commonjs(),
            css({dest: 'dist/scanex-layer-tree-view.css', minified: false}),
            babel({                
                extensions: ['.js', '.mjs'],
                exclude: ['node_modules/@babel/**', 'node_modules/core-js/**'],
                include: ['src/**']
            }),
        ],
    },   
];