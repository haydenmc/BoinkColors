/*
This file in the main entry point for defining grunt tasks and using grunt plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkID=513275&clcid=0x409
*/
module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        ts: {
            default: {
                src: ["src/Scripts/**/*.ts"],
                options: {
                    declaration: true
                },
                out: 'out/application.js'
            }
        },
        copy: {
            target: {
                files: [
                    { src: 'node_modules/webcomponents.js/webcomponents.min.js', dest: 'out/webcomponents.js' },
                    { expand: true, flatten: true, src: 'src/Scripts/Libraries/**', dest: 'out/', filter: 'isFile'},
                    { src: 'src/index.html', dest: 'out/index.html' }
                ]
            }
        },
        watch: {
            html: {
                files: 'src/index.html',
                tasks: ['copy'],
            },
            src: {
                files: ['src/Scripts/**/*.ts'],
                tasks: ['ts'],
            },
            libs: {
                files: ['src/Scripts/Libraries/*.js'],
                tasks: ['copy'],
            },
        },
    });

    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    grunt.registerTask('default', ['ts', 'copy']);
};