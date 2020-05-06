module.exports = {
    presets: [
        [
            '@babel/env',
            {
                modules: process.env.MODULE ? false : 'commonjs',
                targets: ['last 2 versions', 'not dead'],
            },
        ],
        '@babel/preset-react',
        '@babel/preset-typescript',
    ],
    plugins: ['@babel/plugin-proposal-class-properties'],
};
