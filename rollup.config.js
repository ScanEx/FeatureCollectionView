import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import css from 'rollup-plugin-css-porter';
import json from 'rollup-plugin-json';
import pkg from './package.json';
import svelte from 'rollup-plugin-svelte';

export default [
    {
        input: 'example/App.svelte',
        output: { 
            file: pkg.browser,
            format: 'iife',
            sourcemap: true,
            name: 'Example'
        },
        plugins: [            
            svelte(),
            json(),
            resolve(),            
            commonjs(),
            css({dest: 'public/main.css', minified: false}),            
            babel({                
                extensions: ['.js', '.mjs', '.svelte'],
                exclude: ['node_modules/@babel/**', 'node_modules/core-js/**'],
                include: ['example/App.svelte', 'src/**','node_modules/svelte/**']
            }),
        ],
    },
    {
        input: 'src/Tree.svelte',
        output: { 
            file: pkg.main,
            format: 'cjs',
            sourcemap: true
        },
        plugins: [            
            svelte(),
	        json(),
            resolve(),
            commonjs(),
            css({dest: 'dist/scanex-feature-collection-view.css', minified: false}),
            babel({                
                extensions: ['.js', '.mjs', '.svelte'],
                exclude: ['node_modules/@babel/**', 'node_modules/core-js/**'],
                include: ['src/**','node_modules/svelte/**']
            }),
        ],
    },   
];