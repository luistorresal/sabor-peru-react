module.exports = function (config) {
  config.set({
    // Framework a usar
    frameworks: ['jasmine'],

    // Archivos a incluir en los tests
    files: [
      'src/**/*.spec.js',
      'src/**/*.js',
      'src/**/*.jsx'
    ],

    // Archivos a excluir
    exclude: [
      'src/index.js',
      'src/reportWebVitals.js'
    ],

    // Preprocesadores
    preprocessors: {
      'src/**/*.js': ['webpack', 'coverage'],
      'src/**/*.jsx': ['webpack', 'coverage'],
      'src/**/*.spec.js': ['webpack']
    },

    // Configuración de webpack para Karma
    webpack: {
      mode: 'development',
      module: {
        rules: [

          {
            test: /\.(png|jpe?g|gif|svg)$/i,
            type: 'asset/resource',
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/preset-env',
                  '@babel/preset-react'
                ],
                plugins: [
                  'istanbul'
                ]
              }
            }
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
          }
        ]
      },
      resolve: {
        extensions: ['.js', '.jsx']
      }
    },

    webpackMiddleware: {
      noInfo: true,
      stats: 'errors-only'
    },

    // Reporteros de test
    reporters: ['progress', 'coverage'],

    // Configuración del reporte de cobertura
    coverageReporter: {
      dir: 'coverage',
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'lcov', subdir: 'lcov' },
        { type: 'text-summary' },
        { type: 'cobertura', subdir: '.', file: 'cobertura.xml' }
      ],
      check: {
        global: {
          statements: 80,
          branches: 50,
          functions: 80,
          lines: 80
        }
      }
    },

    // Puerto del servidor
    port: 9876,

    // Habilitar colores en el output
    colors: true,

    // Nivel de logging
    logLevel: config.LOG_INFO,

    // Habilitar watching de archivos
    autoWatch: true,

    // Navegadores para ejecutar tests
    browsers: ['ChromeHeadless'],

    // Configuración personalizada para Chrome Headless
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu']
      }
    },

    // Ejecución continua
    singleRun: false,

    // Timeout
    browserNoActivityTimeout: 30000,
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 3,

    // Concurrencia
    concurrency: Infinity
  });
};
