const path = require('path');

// Export a function. Accept the base config as the only param.
module.exports = {
    stories: ['../stories/*.js'],
    addons: [
        '@storybook/addon-actions',
        '@storybook/addon-viewport/register',
        '@storybook/addon-knobs',
        '@storybook/addon-storysource',
    ],
    webpackFinal: async (config, { configType }) => {
        config.module.rules.push({
            test: /\.scss$/,
            use: ['style-loader', 'css-loader', 'sass-loader'],
            include: path.resolve(__dirname, '../src'),
        });

        config.module.rules.push({
            test: /stories\/(.+).js?$/,
            loaders: [require.resolve('@storybook/addon-storysource/loader')],
            enforce: 'pre',
        });

        return config;
    },
};
