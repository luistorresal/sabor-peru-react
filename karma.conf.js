module.exports = function (config) {
  config.set({
    // Framework a usar
    frameworks: ['jasmine'],

    // Archivos a incluir en los tests
    files: [
      'src/tests/**/*.spec.js'
    ],

    // Archivos a excluir
    exclude: [
      'src/index.js',
      'src/reportWebVitals.js',
      'src/setupTests.js',
      'src/test-setup.js'
    ],

    // Preprocesadores - SOLO medir cobertura de archivos específicos
    preprocessors: {
      // Archivos de prueba
      'src/tests/**/*.spec.js': ['webpack'],
      // Archivos fuente a medir cobertura
      'src/components/**/*.jsx': ['webpack', 'coverage'],
      'src/context/**/*.jsx': ['webpack', 'coverage'],
      'src/App.js': ['webpack', 'coverage']
    },

    // Configuración de webpack para Karma
    webpack: {
      mode: 'development',
      module: {
        rules: [
          {
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
            test: /\.(png|jpe?g|gif|svg)$/i,
            type: 'asset/resource'
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
      // Umbrales de cobertura requeridos
      check: {
        global: {
          statements: 70,
          branches: 25,
          functions: 70,
          lines: 70
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
