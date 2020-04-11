module.exports = {
    presets: [
        [
            '@babel/env',
            {
                modules: process.env.MODULE ? false : 'commonjs',
                targets: ['>0.25%', 'not ie 11', 'not op_mini all'],
            },
        ],
        '@babel/preset-react',
    ],
    plugins: ['@babel/plugin-proposal-class-properties'],
};
