import {terser} from 'rollup-plugin-terser'
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';

export default {
    input: './src/js/index.js',
    watch: {
        include: './src/js/**'
    },
    output: {
        file: './public/script.js',
        format: 'iife',
        name: 'version',
        plugins: [
            terser()
        ]
    },
    plugins: [
        babel(
            {
                babelHelpers: 'bundled'
            }
        ),
        replace({
            __route__: '/',
        })
    ]
};