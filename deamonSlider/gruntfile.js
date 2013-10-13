module.exports = function(grunt) {

    // PROJECT PATH CONFIGURATION
    var projectConfig = {
        staticPath      :'',
        sassPath        :'sass',
        cssPath         :'css',
        JsLibPath       :'scripts/lib',
        JsSourcePath    :'scripts/src',
        JsMinPath       :'scripts/min',
        imagesPath      :'images',
        useLiveReload   :false, //enable realtime feedback on the browser ?
        HttpPortNumber  :'8000'
      };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        projectConfig: projectConfig,
        watch: {
            css: { // watch and compile scss files
                files: ['<%= projectConfig.staticPath %>/<%= projectConfig.sassPath %>/**/*.scss'],
                tasks: ['compass'],
                options: {
                    // Start a live reload server on the default port 35729
                    livereload: '<%= projectConfig.useLiveReload %>',
                    spawn: false,
                },
            },
            scripts: { // watch and optimise scripts
                files: ['<%= projectConfig.staticPath %>/<%= projectConfig.JsSourcePath %>/**/*.js'],
                tasks: ['jshint', 'uglify'],
                options: {
                    spawn: false,
                    livereload: '<%= projectConfig.useLiveReload %>',
                    livereload: 1337
                },
            },
        },
        jshint: {
            all: ['js/**/*.js'],
            options: {
                // jshint black list
                ignores: ['js/lib/**',
                          'js/min/**',
                          'node_modules',
                          'config.rb'],
                // all options
                bitwise: false, // OR IS not allowed
                // camelcase: true, // use camelCase => todo: assign global variables to local variables.
                curly: true, // use curly braces always !
                eqeqeq: true, // use === not ==
                indent: 4, // indent using 4 spaces
                newcap: true, // Caps for new objects (constructors)
                noempty: true, // dont put empty blocks
                quotmark: "double", // always use dbl quote
                undef: true, // dont use undefined variables
                unused: true, // unused variables
                trailing: true,
                maxparams: 5, // max params 4 per function
                maxlen: 100, // maximum lenght of the line
                devel: true, // don't put console.log for production
                passfail: false,
                //white: true // test the code against Douglas Crockford linter @ jslint.com
                globals: {
                    DEBUG_STATUS: true, // exclude DEBUG variable From undefined
                    jQuery: true, // exclude $ from undefined
                    $: true, // exclude jquery from undefined var list
                    window: true, // exclude window from undefined
                    document: true, // exclude document from undefined
                    Modernizr: true,
                }
            }
        },
        compass: {
            dist: {
                options: {
                    config:'<%= projectConfig.staticPath %>config.rb',
                    cssDir  : '<%= projectConfig.staticPath %><%= projectConfig.cssPath %>',
                    sassDir: '<%= projectConfig.staticPath %><%= projectConfig.sassPath %>',
                    imagesDir: '<%= projectConfig.staticPath %><%= projectConfig.imagePath %>',
                }
            }
        },
        uglify: {
            options: {
                // Either do not report anything, report only minification result,
                // or report minification and gzip results. This is useful to 
                // see exactly how well Uglify is performing,
                // but using 'gzip' can add 5-10x runtime task execution
                report: 'gzip', 
                mangle: {
                    // Exeption for Jquery and Modernizr
                    except: ["$", "jQuery", "Modernizr"]
                },
                beautify: false,
                compress: {
                    // Compression rules uglifyJs
                    sequences     : true,  // join consecutive statements with the “comma operator”
                    properties    : true,  // optimize property access: a["foo"] → a.foo
                    dead_code     : true,  // discard unreachable code
                    drop_debugger : true,  // discard “debugger” statements
                    unsafe        : false, // some unsafe optimizations (see below)
                    conditionals  : true,  // optimize if-s and conditional expressions
                    comparisons   : true,  // optimize comparisons
                    evaluate      : true,  // evaluate constant expressions
                    booleans      : true,  // optimize boolean expressions
                    loops         : true,  // optimize loops
                    unused        : true,  // drop unused variables/functions
                    hoist_funs    : true,  // hoist function declarations
                    hoist_vars    : false, // hoist variable declarations
                    if_return     : true,  // optimize if-s followed by return/continue
                    join_vars     : true,  // join var declarations
                    cascade       : true,  // try to cascade `right` into `left` in sequences
                    side_effects  : true,  // drop side-effect-free statements
                    warnings      : true,  // warn about potentially dangerous optimizations/code
                }
            },
            // Generate uglified files
            my_target: {
                files: [{
                    expand: true, // enable dynamic expansion
                    src: ['*.js', '**/*.js'], // extension pattern to match
                    ext: '.min.js', //extension of minified files
                    cwd: '<%= projectConfig.staticPath %><%= projectConfig.JsSourcePath %>/',
                    dest: '<%= projectConfig.staticPath %><%= projectConfig.JsMinPath %>/',
                }],
                options: {
                    banner: '/*! deamon slider <%= pkg.name %> build - v<%= pkg.version %> - ' +
                          'created on <%= grunt.template.today("yyyy-mm-dd") %> */' + "\n",
                }
            },
        }
    });
    // Loading dependencies automatically
    for (var key in grunt.file.readJSON("package.json").devDependencies) {
        if (key !== "grunt" && key.indexOf("grunt") === 0) grunt.loadNpmTasks(key);
    }
    // configure task watch
    grunt.event.on('watch', function(action, filepath) {
      grunt.config(['jshint', 'all'], filepath);
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');    

    grunt.registerTask('default', ['compass', 'uglify', 'jshint', 'watch']);
};
