'use strict';
module.exports = function(grunt) {

  // Load all grunt tasks
  // require('load-grunt-tasks')(grunt);
  // Show elapsed time at the end
  // require('time-grunt')(grunt);

  // https://www.npmjs.com/package/imagemin-mozjpeg
  var mozjpeg = require('imagemin-mozjpeg');

  // https://www.npmjs.com/package/imagemin-webp
  var webp = require('imagemin-webp');

  // Project configuration.
  grunt.initConfig({

    // Project settings
    project: {
        name: 'christmas',  //项目目录名称
        app: 'app',
        dist: 'dist',
        src: 'src'
    },

    pkg: grunt.file.readJSON('package.json'),

    // https://www.npmjs.com/package/grunt-contrib-clean
    // 删除目录及其下文件 /**等同不加
    clean: {
      main: ['dist/<%= project.name %>', 'publish/<%= project.name %>'],
      release: ['publish/<%= project.name %>'],
      css: ['dist/<%= project.name %>/css/**', '!publish/<%= project.name %>/css/**'],
      js: ['dist/<%= project.name %>/js/**', '!publish/<%= project.name %>/js/**']
    },

    // https://www.npmjs.com/package/grunt-contrib-compass
    // This task requires you to have Ruby, Sass, and Compass >=0.12.2 installed
    // When you've confirmed you have Ruby installed, run gem update --system && gem install compass to install Compass and Sass.
    compass: {
      dist: {                   // Target 
        options: {              // Target options 
          config: './config.rb',
          sassDir: 'src/<%= project.name %>/sass',
          cssDir: 'dist/<%= project.name %>/css',
          environment: 'production',
          outputStyle: 'compressed', //default expanded
          force: true
        }
      },
      dev: {                    // Another target 
        options: {
          config: './config.rb',
          environment: 'development',
          sassDir: 'src/<%= project.name %>/sass',  // Override setting in external config file
          cssDir: 'src/<%= project.name %>/css',
        }
      }
    },

    // https://www.npmjs.com/package/grunt-contrib-compress
    compress: {
      main: {
        options: {
          mode: 'zip',
          archive: 'zip/<%= project.name %>_<%= grunt.template.today("yyyymmddHHMM") %>' + '.zip'
        },
        files: [
          {expand: true, cwd: 'publish/<%= project.name %>/', src: ['**'], dest: '<%= project.name %>/'}
        ]
      }
    },

    // https://www.npmjs.com/package/grunt-contrib-concat
    concat: {    
      options: {
        separator: '\n\n',
        stripBanners: true, // /* ... */ block comments are stripped, but NOT /*! ... */ comments.
      },
      js: {
        src: ['src/<%= project.name %>/js/*.js'],
        dest: 'dist/<%= project.name %>/js/main.js',
        nonull: true
      },
      somejs: {
        src: [
          'src/<%= project.name %>/js/script.js',
          'src/<%= project.name %>/js/slot.js'
        ],
        dest: 'dist/<%= project.name %>/js/target.js',
        nonull: true //warn if a given file is missing or invalid be sure to set nonull to true
      },
      css: {
        src: ['src/<%= project.name %>/css/*.css'],
        dest: 'dist/<%= project.name %>/css/style.css',
        nonull: true
      },
      somecss: {
        src: [
          'src/<%= project.name %>/css/reset.css',
          'src/<%= project.name %>/css/style.css'
        ],
        dest: 'dist/<%= project.name %>/js/target.css',
        nonull: true
      }
    },

    // https://www.npmjs.com/package/grunt-contrib-connect
    // https://github.com/intesso/connect-livereload
    // http://www.bluesdream.com/blog/grunt-plugin-livereload-wysiwyg-editor.html
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost', //默认为0.0.0.0值，可配置为本机某个 IP，localhost 或域名,*
        livereload: 35729  //声明给 watch 监听的端口
      },

      server: {
        options: {
            open: true, //自动打开网页 http://
            base: [
                'src'  //主目录
            ]
        }
      }
    },

    // https://www.npmjs.com/package/grunt-contrib-copy
    copy: {
      somecss: {
        nonull: true,
        src: 'dist/<%= project.name %>/css/style.css',
        dest: 'publish/<%= project.name %>/css/style.css'
      },
      somejs: {
        nonull: true,
        src: 'dist/<%= project.name %>/js/<%= project.name %>.beautify.js',
        dest: 'publish/<%= project.name %>/js/<%= project.name %>.beautify.js'
        
      },
      cssmin: {
        files : [
          {expand: true, cwd: 'dist/<%= project.name %>/css/', src: ['style.min.css'], dest: 'publish/<%= project.name %>/css/', filter: 'isFile'}
        ]
      },
      html:{
        files : [
          {expand: true, cwd: 'src/<%= project.name %>/', src: ['*.{html,htm}'], dest: 'dist/<%= project.name %>/', filter: 'isFile'},
          {expand: true, cwd: 'src/<%= project.name %>/', src: ['*.{html,htm}'], dest: 'publish/<%= project.name %>/', filter: 'isFile'}
        ]
      },
      main: {
        files: [
          {expand: true, src: ['path/*'], dest: 'dist/<%= project.name %>/', filter: 'isFile'}, // 复制path目录下的所有文件
          {expand: true, src: ['path/**'], dest: 'publish/<%= project.name %>/'}, // 复制path及其目录下的所有目录和文件
          {expand: true, cwd: 'dist/<%= project.name %>/', src: ['**'], dest: 'publish/<%= project.name %>/'}, // 复制相对dist项目目录下的所有目录和文件
          
        ]
      },
      css: {
        files : [
          {expand: true, cwd: 'dist/<%= project.name %>/css/', src: ['**'], dest: 'publish/<%= project.name %>/css/'},
        ]
      },
      image: {
        files : [
          {expand: true, cwd: 'dist/<%= project.name %>/images/', src: ['**'], dest: 'publish/<%= project.name %>/images/'}
        ]
      },
      js: {
        files : [
          {expand: true, cwd: 'dist/<%= project.name %>/js/', src: ['**'], dest: 'publish/<%= project.name %>/js/'},
        ]
      },
      jslib: {
        files : [
          {expand: true, cwd: 'src/<%= project.name %>/js/libs/', src: ['**'], dest: 'dist/<%= project.name %>/js/libs/'},
          {expand: true, cwd: 'src/<%= project.name %>/js/plugins/', src: ['**'], dest: 'dist/<%= project.name %>/js/plugins/'},
          {expand: true, cwd: 'src/<%= project.name %>/js/libs/', src: ['**'], dest: 'publish/<%= project.name %>/js/libs/'},
          {expand: true, cwd: 'src/<%= project.name %>/js/plugins/', src: ['**'], dest: 'publish/<%= project.name %>/js/plugins/'}
        ]
      }

    },

    // https://www.npmjs.com/package/grunt-contrib-cssmin
    cssmin: {
      some: {
        options:{
          report: 'gzip'
        },
        files: {
          'dist/<%= project.name %>/css/style.min.css': ['dist/<%= project.name %>/css/style.css']
        }
      },
      all: {
        options: {
          shorthandCompacting: true, // set to false to skip shorthand compacting (default is true unless sourceMap is set when it's false)
          roundingPrecision: -1, // rounding precision; defaults to 2; -1 disables rounding
          report: 'min',  //default
          aggressiveMerging: false,
          advanced: false,  //合并，排序等
        },
        files: [{
          expand: true,
          cwd: 'dist/<%= project.name %>/css',
          src: ['*.css', '!*.min.css'],
          dest: 'dist/<%= project.name %>/css',
          ext: '.min.css'
        }]
      }
    },

    // https://www.npmjs.com/package/grunt-contrib-htmlmin
    // https://github.com/kangax/html-minifier#options-quick-reference
    htmlmin:{
      dist: {                                      // Target 
        options: {                                 // Target options 
          removeComments: true,
          collapseWhitespace: true,
          // preserveLineBreaks: true
        },
        files: {                                   // Dictionary of files 
          'dist/<%= project.name %>/index.html': 'src/<%= project.name %>/index.html',     // 'destination': 'source' 
          'dist/<%= project.name %>/christmas.html': 'src/<%= project.name %>/christmas.html',
          'dist/<%= project.name %>/slot.html': 'src/<%= project.name %>/slot.html',
          'dist/<%= project.name %>/backpack.htm': 'src/<%= project.name %>/backpack.htm',
          'dist/<%= project.name %>/backpack_empty.html': 'src/<%= project.name %>/backpack_empty.html',
          'dist/<%= project.name %>/test.html': 'src/<%= project.name %>/test.html'
        }
      },
      release: {                                      // Target 
        options: {                                 // Target options 
          removeComments: true,
          collapseWhitespace: true,
          useShortDoctype: true,
          minifyJS: true,                          // Minify Javascript in script elements and on* attributes (uses UglifyJS)
          minifyCSS: true                          // Minify CSS in style elements and style attributes (uses clean-css)
        },
        files: {                                   // Dictionary of files 
          'publish/<%= project.name %>/index.html': 'publish/<%= project.name %>/index.html',     // 'destination': 'source' 
          'publish/<%= project.name %>/christmas.html': 'publish/<%= project.name %>/christmas.html',
          'publish/<%= project.name %>/slot.html': 'publish/<%= project.name %>/slot.html',
          'publish/<%= project.name %>/backpack.htm': 'publish/<%= project.name %>/backpack.htm',
          'publish/<%= project.name %>/backpack_empty.html': 'publish/<%= project.name %>/backpack_empty.html',
          'publish/<%= project.name %>/test.html': 'publish/<%= project.name %>/test.html'
        }
      },
      /*
      dev: {                                       // Another target 
        files: {
        }
      }
      */
    },


    // https://www.npmjs.com/package/grunt-contrib-imagemin
    // https://github.com/imagemin/imagemin
    /*    
    Comes bundled with the following optimizers:

    gifsicle — Compress GIF images
    jpegtran — Compress JPEG images
    optipng — Compress PNG images 无损压缩
    svgo — Compress SVG images
    */
    //如需png8格式图片，建议登录http://tinypng.com压缩

    imagemin: {                          // Task 
      static: {                          // Target 自定义
        options: {                       // Target options 
          optimizationLevel: 3,          // default: 3, ranges 0-7
          svgoPlugins: [{ removeViewBox: false }],
          use: [mozjpeg()]
        },
        files: {                         // Dictionary of files 
          'dist/<%= project.name %>/images/test.png': 'src/<%= project.name %>/images/test.png', // 'destination': 'source' 
          'dist/<%= project.name %>/images/test.jpg': 'src/<%= project.name %>/images/test.jpg',
          'dist/<%= project.name %>/images/test.gif': 'src/<%= project.name %>/images/test.gif'
        }
      },
      somewebp: {                          // Target 自定义
        options: {
          optimizationLevel: 3,
          svgoPlugins: [{ removeViewBox: false }],
          use: [webp()]
        },
        files: {                         // Dictionary of files 
          'dist/<%= project.name %>/images/img.webp': 'src/<%= project.name %>/images/img.png'
        }
      },
      dynamic: {                         // Another target 动态生成
        options: {  
          optimizationLevel: 7,
          use: [mozjpeg()],
          interlaced: true
        },  
        files: [{
          expand: true,                  // Enable dynamic expansion 
          cwd: 'src/<%= project.name %>/images/',                   // Src matches are relative to this path 
          src: ['**/*.{png,jpg,jpeg,gif,webp,svg}'],               // Actual patterns to match 
          dest: 'dist/<%= project.name %>/images/'                 // Destination path prefix 
        }]
      },
      jpg: {                         // Another target 
        options: {                   // Lossless conversion to progressive for .jpg by default.
          optimizationLevel: 7,
          use: [mozjpeg()],
          progressive : true
        },  
        files: [{
          expand: true,                  // Enable dynamic expansion 
          cwd: 'src/<%= project.name %>/images/',                   // Src matches are relative to this path 
          src: ['*.jpg'],               // Actual patterns to match 
          dest: 'dist/<%= project.name %>/images/'                 // Destination path prefix 
        }]
      },
      webp: {                        // Another target 
        options: {
          use: [webp()]
        },  
        files: [{
          expand: true,                  // Enable dynamic expansion 
          cwd: 'src/<%= project.name %>/images/',                   // Src matches are relative to this path 
          src: ['*.png'],               // Actual patterns to match 
          dest: 'dist/<%= project.name %>/images/'                 // Destination path prefix 
        }]
      }
    },


    // https://github.com/gruntjs/grunt-contrib-jshint
    // http://www.cnblogs.com/code/articles/4103070.html
    // http://jshint.com/docs/
    /*设置 JS 执行环境为浏览器"browser": true,
      加载 jQuery 的全局变量（jQuery、$）"jquery": true,
      行尾不要分号"asi": true,
      In jshit options the devel option allow you to use console.log and alerts without warnings
    */
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')   //one of the built-in JSHint reporters: jslint or checkstyle or any other plugins
      },
      all: [
        'Gruntfile.js',
        'src/<%= project.name %>/js/**/*.js'
      ],
      usr: [
        'Gruntfile.js',
        'src/<%= project.name %>/js/*.js'
      ],
      dev: {
        options: {
          'devel' : false,
        },
        src: ['Gruntfile.js','src/<%= project.name %>/js/*.js']
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/{,*/}*.js']
      }
    },


    // https://www.npmjs.com/package/grunt-contrib-less
    // http://less.bootcss.com/
    // http://lesscss.org/usage/
    // 如果变量需要镶嵌在字符串之中，就必须需要写在@{}之中，外层引号不能少。

    less: {
      dev: {
        options: {
          compress: false,
          modifyVars: {
            imagepath: '"../images"'
          },
        },
        files: {
          'src/<%= project.name %>/css/style.css': 'src/<%= project.name %>/less/style.less',
          // 'src/<%= project.name %>/css/index.css': 'src/<%= project.name %>/less/index.less',
          'src/<%= project.name %>/css/base.css': 'src/<%= project.name %>/less/base.less'
        }
      },
      production: {
        options: {
          modifyVars: { //浏览器less情形下：生产环境图片cdn地址替换
            imagepath: '"//game.feiliu.com/protest/christmas/images"'
          },
          compress: true,
          optimization: 2
        },
        files: {
          'dist/<%= project.name %>/css/style.css': 'src/<%= project.name %>/less/style.less',
          // 'src/<%= project.name %>/css/index.css': 'src/<%= project.name %>/less/index.less',
          'dist/<%= project.name %>/css/base.css': 'src/<%= project.name %>/less/base.less'
        }
      }
    },

    // https://www.npmjs.com/package/grunt-contrib-sass
    // This task requires you to have Ruby(http://rubyinstaller.org/downloads/) and Sass installed(gem install sass).   
    // 如果变量需要镶嵌在字符串之中，就必须需要写在#{}之中。 如#{$variable}，若为文件路径则外层引号可有可无
    sass: {
      some: {   //自定义若干文件
        options: {
          style : 'expanded',  // nested(default), compact, compressed, expanded. 
        },
        files: {    // 'destination': 'source'
          'src/<%= project.name %>/css/style.css': 'src/<%= project.name %>/sass/style.scss',
          'src/<%= project.name %>/css/base.css': 'src/<%= project.name %>/sass/base.scss'
        }
      },
      dist: {   //目录文件全部动态编译
        options: {
          lineNumbers : true,
          // unixNewlines Default: false on Windows, otherwise true
        },
        files: [{
          expand: true,
          cwd: 'src/<%= project.name %>/sass',
          src: ['*.scss'],
          dest: 'src/<%= project.name %>/css',
          ext: '.css'
        }]
      }
    },

    // https://www.npmjs.com/package/grunt-contrib-uglify
    uglify: {
      main:{
        options: {
          banner: '/*! <%= pkg.name %> - <%= project.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */\n'
        },
        files: {
          'dist/<%= project.name %>/js/<%= project.name %>.min.js': '<%= concat.js.dest %>'
        }
      },
      beautify:{
        options: {
          beautify: true,
          mangle: false, //不混淆变量名
          preserveComments: 'some', //仅保留以叹号!开头的注释 /*! ... */ comments
          report: 'min'
        },
        files: {
          'dist/<%= project.name %>/js/<%= project.name %>.beautify.js': '<%= concat.js.dest %>'
        }
      },
      target:{
        options: {
          preserveComments: 'some'
        },
        files: {
          'dist/<%= project.name %>/js/target.min.js': '<%= concat.somejs.dest %>'
        }
      }

    },

    // https://www.npmjs.com/package/grunt-contrib-watch
    // https://github.com/isaacs/minimatch#options
    // http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions-
    // http://www.bluesdream.com/blog/grunt-plugin-livereload-wysiwyg-editor.html
    // 通配符http://gruntjs.cn/configuring-tasks/#globbing-patterns

    watch: {
      less: {
        files: ['src/<%= project.name %>/less/**/*.less'],
        tasks: ['less:dev', 'autoprefixer'],
        options: {
            spawn: false,
            livereload: true
        },
      },
      sass: {
        files: ['src/<%= project.name %>/sass/**/*.scss'],
        tasks: ['sass:dev', 'autoprefixer'],
        options: {
            spawn: false,
            livereload: true
        },
      },
      css: {
        files: ['src/<%= project.name %>/css/**/*.css'],
        tasks: ['cssmin:dev', 'autoprefixer'],
        options: {
            spawn: false,
            livereload: true
        }     
      },
      js: {
        files: [
            'src/<%= project.name %>/js/**/*.js',
            '!src/<%= project.name %>/js/libs/**/*.js',
            '!src/<%= project.name %>/js/plugins/**/*.js'
        ],
        options: {
            livereload: true
        }
      },
      livereload: {
        //文件改变会实时刷新网页 /{,*/}*.
        files: [
          'src/<%= project.name %>/less/**/*.less',
          'src/<%= project.name %>/sass/**/*.scss',
          'src/<%= project.name %>/css/**/*.css',
          'src/<%= project.name %>/*.{html,htm}',
          'src/<%= project.name %>/js/**/*.{js,css}',
          'src/<%= project.name %>/images/**/*.{ico,gif,jpeg,jpg,png,svg,webp}'
        ],
        // tasks: ["htmlmin"],
        options: {
          // livereload: true,
          // spawn: false,
          livereload: '<%=connect.options.livereload%>'  // 监听前面声明的端口  35729
        },
      },
    },


  });

  // Load the tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  // grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  // grunt.loadNpmTasks('grunt-html-build');
  // grunt.loadNpmTasks('grunt-usemin');


  // Default task(s). 需要后台继续开发，为便于后台开发嵌套数据，不进行重度压缩
  grunt.registerTask('default', ['jshint:dev', 'clean:main', 'compass:dev', 'concat:js', 'concat:css', 'cssmin:all', 'uglify:beautify', 'imagemin:dynamic', 'copy:cssmin', 'copy:jslib', 'copy:somejs', 'copy:html', 'copy:image', 'compress:main']);

  // 静态任务适用于:html，js无动态数据，或已用Ajax实现，不需要后台继续开发
  grunt.registerTask('statictask', ['jshint:dev', 'clean:main', 'compass:dev', 'concat:js', 'concat:css', 'cssmin:all', 'uglify:beautify', 'imagemin:dynamic', 'copy:cssmin', 'copy:jslib', 'copy:somejs', 'copy:html', 'htmlmin:release', 'copy:image', 'compress:main']);
  
  //监视实时刷新
  grunt.registerTask('mylivedev', ['connect:server', 'watch:livereload']);
  
  //重新发布
  grunt.registerTask('pubdev', ['clean:release', 'copy:cssmin', 'copy:jslib', 'copy:somejs', 'copy:html', 'copy:image', 'compress:main']);


};