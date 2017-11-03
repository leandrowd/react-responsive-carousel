const path = require('path');

module.exports = (baseConfig, configType) => {
    baseConfig.module.rules.push({
        test: /.scss$/,
        loaders: ["style-loader", "css-loader", "sass-loader"],
        include: path.resolve(__dirname, '../')
    })
    return baseConfig
}
