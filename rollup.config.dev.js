import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';

export default {
    input: './src/js/index.js',
    watch: {
        include: './src/js/**'
    },
    output: {
        file: './src/script.js',
        format: 'iife',
        name: 'version',
    },
    plugins: [
        babel(
            {
                babelHelpers: 'bundled'
            }
        ),
        replace({
            __route__: '/src/',
        })
    ]
};