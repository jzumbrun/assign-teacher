module.exports = function() {
  return {
    basePath: '../',
    frameworks: ['mocha'],
    reporters: ['progress'],
    browsers: ['Chrome'],
    autoWatch: true,

    // these are default values anyway
    singleRun: false,
    colors: true,
    
    files : [

      //App-specific Code
      'app/app.js',
      'app/modules/app_module.js',
      'app/models/**/*.js',
      'app/libraries/**/*.js',
      'app/directives/**/*.js',
      'app/controllers/**/*.js',
      'app/filters/**/*.js',

      //Test-Specific Code
      'node_modules/chai/chai.js',
      'test/lib/chai-should.js',
      'test/lib/chai-expect.js'
    ]
  };
};
