// Generated on <%= (new Date).toISOString().split('T')[0] %> using
// <%= pkg.name %> <%= pkg.version %>
'use strict';

module.exports = function(grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Automatically load required grunt tasks
  require('jit-grunt')(grunt, {
    useminPrepare: 'grunt-usemin'
  });

  // Configurable paths
  var config = {
    app: 'app',
    dist: 'dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    config: config,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      <% if(useBabel) { %>
      babel: {
        files: ['<%%= config.app %>/scripts/{,*/}*.js'],
        tasks: ['babel:dist']
      },
      <% } else {%>
      js: {
        files: ['<%%= config.app %>/scripts/{,*/}*.js'],
        tasks: ['eslint'],
      },
      <% } %>
      gruntfile: {
        files: ['Gruntfile.js']
      },
      sass: {
        files: ['<%%= config.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['sass', 'postcss']
      },
      styles: {
        files: ['<%%= config.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'postcss']
      }
    },
    browserSync: {
      options: {
        notify: false,
        background: true
      },
      livereload: {
        options: {
          files: [
            '<%%= config.app %>/{,*/}*.html',
            '.tmp/styles/{,*/}*.css',
            '<%%= config.app %>/images/{,*/}*', <% if (useBabel) { %>
            '.tmp/scripts/{,*/}*.js'
            <% } else { %>
            '<%%= config.app %>/scripts/{,*/}*.js'
            <% } %>
          ],
          port: 9000,
          server: {
            baseDir: ['.tmp', config.app],
            routes: {
              '/bower_components': './bower_components'
            }
          }
        }
      },
      dist: {
        options: {
          background: false,
          server: '<%%= config.dist %>'
        }
      }
    },
    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%%= config.dist %>/*',
            '!<%%= config.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    eshint: {
      target: [
        'Gruntfile.js',
        '<%%= config.app %>/scripts/{,*/}*.js',
        '!<%%= config.app %>/scripts/vendor/*',
        'test/spec/{,*/}*.js'
      ]
    },
    babel: {
      options: {
        sourceMap: true
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= config.app %>/scripts',
          src: '{,*/}*.js',
          dest: '.tmp/scripts',
          ext: '.js'
        }]
      },
      test: {
        files: [{
          expand: true,
          cwd: 'test/spec',
          src: '{,*/}*.js',
          dest: '.tmp/spec',
          ext: '.js'
        }]
      }
    },
    // Compiles Sass to CSS and generates necessary files if requested
    sass: {
      options: {
        sourceMap: true,
        sourceMapEmbed: true,
        sourceMapContents: true,
        includePaths: ['.']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= config.app %>/styles',
          src: ['*.{scss,sass}'],
          dest: '.tmp/styles',
          ext: '.css'
        }]
      }
    },
    postcss: {
      options: {
        map: true,
        processors: [
          // Add vendor prefixed styles
          require('autoprefixer-core')({
            browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1', 'Android 2.3']
          })
        ]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },
    // Automatically inject Bower components into the HTML file
    wiredep: {
      app: {
        src: ['<%%= config.app %>/index.html'],
        ignorePath: /^(\.\.\/)*\.\./
      },
      sass: {
        src: ['<%%= config.app %>/styles/{,*/}*.{scss,sass}'],
        ignorePath: /^(\.\.\/)+/
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%%= config.dist %>/scripts/{,*/}*.js',
          '<%%= config.dist %>/styles/{,*/}*.css',
          '<%%= config.dist %>/images/{,*/}*.*',
          '<%%= config.dist %>/styles/fonts/{,*/}*.*',
          '<%%= config.dist %>/*.{ico,png}'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      options: {
        dest: '<%%= config.dist %>'
      },
      <% if (includeMustache) { %>
      html: ['<%%= config.app %>/index.html', '<%%= config.app %>/template/{,*/}*.mst']
      <% } else { %>
      html: '<%%= config.app %>/*.html'
      <% } %>
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      options: {
        assetsDirs: [
          '<%%= config.dist %>',
          '<%%= config.dist %>/images',
          '<%%= config.dist %>/styles'
        ]
      },
      <% if (includeMustache) { %>
      html: ['<%%= config.dist %>/{,*/}*.html', '<%%= config.dist %>/template/{,*/}*.mst'],
      <% } else { %>
      html: ['<%%= config.dist %>/{,*/}*.html'],
      <% } %>
      css: ['<%%= config.dist %>/styles/{,*/}*.css']
    },

    // The following *-min tasks produce minified files in the dist folder
    <% if (includeImagemin) { %>
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= config.app %>/images',
          src: '{,*/}*.{gif,jpeg,jpg,png}',
          dest: '<%%= config.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= config.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%%= config.dist %>/images'
        }]
      }
    },
    <% } %>

    htmlmin: {
      dist: {
        options: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          conservativeCollapse: true,
          removeAttributeQuotes: true,
          removeCommentsFromCDATA: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true,
          removeRedundantAttributes: true,
          useShortDoctype: true
        },
        files: [{
          expand: true,
          cwd: '<%%= config.dist %>',
          src: '{,*/}*.html',
          dest: '<%%= config.dist %>'
        }]
      }
    },

    // By default, your `index.html`'s <!-- Usemin block --> will take care
    // of minification. These next options are pre-configured if you do not
    // wish to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%%= config.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css',
    //         '<%%= config.app %>/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%%= config.dist %>/scripts/scripts.js': [
    //         '<%%= config.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%%= config.app %>',
          dest: '<%%= config.dist %>',
          src: [
            <% if (includeMustache) { %>
            'template/*.mst',
            <% } %>
            '*.{ico,png,txt}',
            <% if (includeImagemin) { %>
            'images/{,*/}*.webp',
            <% } else { %>
            'images/{,*/}*.*',
            <% } %>
            '{,*/}*.html',
            'styles/fonts/{,*/}*.*'
          ]
        }, {
          src: 'node_modules/apache-server-configs/dist/.htaccess',
          dest: '<%%= config.dist %>/.htaccess'
        }]
      },
      styles: {
        expand: true,
        dot: true,
        cwd: '<%%= config.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },
    <% if (includeModernizr) { %>
    // reference in your app
    modernizr: {
      dist: {
        devFile: 'bower_components/modernizr/modernizr.js',
        outputFile: '<%%= config.dist %>/scripts/vendor/modernizr.js',
        files: {
          src: [
            '<%%= config.dist %>/scripts/{,*/}*.js',
            '<%%= config.dist %>/styles/{,*/}*.css',
            '!<%%= config.dist %>/scripts/vendor/*'
          ]
        },
        uglify: true
      }
    },
    <% } %>
    <% if (includeCache) { %>
    manifest: {
      generate: {
        options: {
          basePath: "<%%= config.dist %>",
          network: ["*"],
          preferOnline: false,
          timestamp: true
        },
        src: [
          // Put HTML, CSS and JS first (not sure if it makes a difference)
          "**/*.html",
          "**/*.css",
          "**/*.js",
          // Then include everything else...
          "**/*.*",
          // .. but exclude these
          "!apple-touch-*",
          "!favicon.ico",
          "!cache.manifest",
          "!robots.txt"
        ],
        dest: "<%%= config.dist %>/cache.manifest"
      }
    },
    <% } %>
    // Run some tasks in parallel to speed up build process
    concurrent: {
      server: [
        <% if (useBabel) { %>
        'babel:dist',
        <% } %>
        'sass',
        'copy:styles'
      ],
      dist: [
        <% if (useBabel) { %>
        'babel', <% } %>
        'sass',
        <% if (includeImagemin) { %>
        'imagemin',
        'svgmin',
        <% } %>
        'copy:styles'
      ]
    }
  });


  grunt.registerTask('serve', 'start the server and preview your app, --allow-remote for remote access', function(target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'browserSync:dist']);
    }

    grunt.task.run([
      'clean:server',
      'wiredep',
      'concurrent:server',
      'postcss',
      'browserSync:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function(target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run([target ? ('serve:' + target) : 'serve']);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'postcss',
    'concat',
    'cssmin',
    'uglify',
    'copy:dist', <% if (includeModernizr) { %>
    'modernizr', <% } %>
    'filerev',
    'usemin',
    'htmlmin'
    <% if (includeCache) { %>,
    'manifest:generate'
    <% } %>
  ]);

  grunt.registerTask('default', [
    'newer:eshint',
    'build'
  ]);
};
