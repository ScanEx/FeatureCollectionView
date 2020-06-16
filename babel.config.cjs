const presets = [
    [
        "@babel/env", {    
            "useBuiltIns": "usage",
            "corejs": {
                "version": "3.6.5",
                "proposals": false
            },
            "targets": "ie 10"
        }
    ]
];

const plugins = [];

module.exports = { presets, plugins };