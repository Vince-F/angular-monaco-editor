module.exports = function(grunt) {
	
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-ngdocs');
	
	grunt.initConfig({
		concat: {
            options: {
                separator: ";\n"
            },
            dist: {
                src: ["src/modules/**/*.js","src/controllers/**/*.js","src/directives/**/*.js"],
                dest: 'dist/angularMonacoEditor.js'
            }
		},
		jshint: {
			files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
			options: {
			}
		},
		uglify: {
			options: {
				screwIE8: true,
			},
			release:{
				files: {
					'dist/angularMonacoEditor.min.js':['dist/angularMonacoEditor.js']
				}
			}
		},
		ngdocs: {
			all: ['src/**/*.js']
		}
	});
	

	grunt.registerTask('default', ['concat','uglify']);
};