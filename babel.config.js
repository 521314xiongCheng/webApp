module.exports = {
  "env": {
    "node": {
      "presets": [
        [
          "@babel/preset-env",
          {
            "modules": false,
            "targets": {
              "node": "current"
            }
          }
        ]
      ],
      "plugins": [
        [
          "component",
          {
            "libraryName": "element-ui",
            "styleLibraryName": "theme-chalk"
          }
        ],
        "@babel/plugin-syntax-dynamic-import"
      ]
    },
    "web": {
      "presets": [
        [
          "@babel/preset-env",
          {
            "modules": false,
            "targets": {
              "browsers": [
                "last 2 versions",
                "safari >= 7"
              ]
            }
          }
        ]
      ],
      "plugins": [
        [
          "import",
          {
            "libraryName": "vant",
            "libraryDirectory": "es",
            "style": true
          }
        ],
        "@babel/plugin-transform-runtime",
        "@babel/plugin-proposal-object-rest-spread",
        "@babel/plugin-syntax-dynamic-import",
        "@babel/plugin-transform-object-assign"
      ]
    }
  }
}
