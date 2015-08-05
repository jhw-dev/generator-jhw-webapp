'use strict';
var generators = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var wiredep = require('wiredep');
var mkdirp = require('mkdirp');
var _s = require('underscore.string');

module.exports = generators.Base.extend({
  constructor: function() {

    generators.Base.apply(this, arguments);

    this.option('skip-welcome-message', {
      desc: 'Skips the welcome message',
      type: Boolean
    });

    this.option('skip-install-message', {
      desc: 'Skips the message after the installation of dependencies',
      type: Boolean
    });

    this.option('babel', {
      desc: 'Use Babel',
      type: Boolean,
      defaults: true
    });

  },

  initializing: function() {
    this.pkg = require('../package.json');
  },

  askFor: function() {
    var done = this.async();

    if (!this.options['skip-welcome-message']) {
      this.log(yosay('\'Allo \'allo! Out of the box I include HTML5 Boilerplate, jQuery, and a Gruntfile to build your app.'));
    }

    var prompts = [{
      type: 'checkbox',
      name: 'features',
      message: 'What more would you like?',
      choices: [{
        name: 'Modernizr',
        value: 'includeModernizr',
        checked: true
      }, {
        name: 'jQuery',
        value: 'includeJQuery',
        checked: true
      }, {
        name: 'Cache Manifest',
        value: 'includeCache',
        checked: false
      }, {
        name: 'Mustache',
        value: 'includeMustache',
        checked: false

      }]
    }];

    this.prompt(prompts, function(answers) {
      var features = answers.features;

      function hasFeature(feat) {
        return features && features.indexOf(feat) !== -1;
      }

      this.includeModernizr = hasFeature('includeModernizr');
      this.includeJQuery = hasFeature('includeJQuery');
      this.includeCache = hasFeature('includeCache');
      this.includeMustache = hasFeature('includeMustache');

      done();
    }.bind(this));
  },

  writing: {
    gruntfile: function() {
      this.fs.copyTpl(
        this.templatePath('Gruntfile.js'),
        this.destinationPath('Gruntfile.js'), {
          pkg: this.pkg,
          includeModernizr: this.includeModernizr,
          includeJQuery: this.includeJQuery,
          includeCache: this.includeCache,
          includeMustache: this.includeMustache,
          useBabel: this.options['babel']
        }
      );
    },

    packageJSON: function() {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'), {
          includeModernizr: this.includeModernizr,
          includeJQuery: this.includeJQuery,
          includeCache: this.includeCache,
          includeMustache: this.includeMustache,
          useBabel: this.options['babel']
        }
      )
    },

    git: function() {
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore')
      );

      this.fs.copy(
        this.templatePath('gitattributes'),
        this.destinationPath('.gitattributes')
      );
    },

    bower: function() {
      var bowerJson = {
        name: _s.slugify(this.appname),
        private: true,
        dependencies: {}
      };

      if (this.includeJQuery) {
        bowerJson.dependencies['jquery'] = '~2.1.4';
      } else {
        bowerJson.dependencies['zepto'] = '~1.1.6';
      }

      if (this.includeModernizr) {
        bowerJson.dependencies['modernizr'] = '~2.8.3';
      }

      this.fs.writeJSON('bower.json', bowerJson);
      this.fs.copy(
        this.templatePath('bowerrc'),
        this.destinationPath('.bowerrc')
      );
    },

    editorConfig: function() {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
    },

    scripts: function() {
      this.fs.copy(
        this.templatePath('scripts/main.js'),
        this.destinationPath('app/scripts/main.js')
      );
    },

    styles: function() {
      var stylesheet;

      stylesheet = 'main.scss';

      this.fs.copyTpl(
        this.templatePath(stylesheet),
        this.destinationPath('app/styles/' + stylesheet))
    },

    html: function() {
      this.fs.copyTpl(
        this.templatePath('index.html'),
        this.destinationPath('app/index.html'), {
          appname: this.appname,
          includeModernizr: this.includeModernizr,
          includeJQuery: this.includeJQuery,
          includeCache: this.includeCache,
          includeMustache: this.includeMustache,
          useBabel: this.options['babel']
        }
      );
    },

    icons: function() {
      this.fs.copy(
        this.templatePath('app/favicon.ico'),
        this.destinationPath('app/favicon.ico')
      );

      // this.fs.copy(
        // this.templatePath('apple-touch-icon.png'),
        // this.destinationPath('app/apple-touch-icon.png')
      // );
    },

    robots: function() {
      this.fs.copy(
        this.templatePath('app/robots.txt'),
        this.destinationPath('app/robots.txt')
      );
    },

    misc: function() {
      mkdirp('app/images');
      mkdirp('app/fonts');
    }
  },

  install: function() {
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      skipMessage: this.options['skip-install-message']
    });
  },

  end: function() {
    var bowerJson = this.fs.readJSON(this.destinationPath('bower.json'));
    var howToInstall =
      '\nAfter running ' +
      chalk.yellow.bold('npm install & bower install') +
      ', inject your' +
      '\nfront end dependencies by running ' +
      chalk.yellow.bold('grunt wiredep') +
      '.';

    if (this.options['skip-install']) {
      this.log(howToInstall);
      return;
    }

    // wire Bower packages to .html
    wiredep({
      bowerJson: bowerJson,
      src: 'app/index.html',
      ignorePath: /^(\.\.\/)*\.\./
    });

    // wire Bower packages to .scss
    wiredep({
      bowerJson: bowerJson,
      src: 'app/styles/*.scss',
      ignorePath: /^(\.\.\/)+/
    });
  }
});
