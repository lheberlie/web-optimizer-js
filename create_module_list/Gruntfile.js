/* ---------------------------------------------------------------------
 * http://gruntjs.com/getting-started
 * http://gruntjs.com/sample-gruntfile
 *
 * https://www.npmjs.org/package/grunt
 * https://www.npmjs.org/package/grunt-contrib-clean
 * https://www.npmjs.org/package/load-grunt-tasks
 * https://www.npmjs.org/package/time-grunt
 * https://github.com/lheberlie/grunt-esrijso-modulelist
 *
 * ---------------------------------------------------------------------
 */

(function (){
  "use strict";
}());

module.exports = function (grunt){

  // ---------------------------------------------------------------------
  // show elapsed time at the end
  // ---------------------------------------------------------------------
  require("time-grunt")(grunt);

  // ---------------------------------------------------------------------
  // load all grunt tasks
  // ---------------------------------------------------------------------
  require("load-grunt-tasks")(grunt);

  grunt.initConfig(
    {

      pkg: grunt.file.readJSON("package.json"),
      // ---------------------------------------------------------------------
      // banner
      // ---------------------------------------------------------------------
      banner: "/*! <%= pkg.name %> - v<%= pkg.version %> - " +
      "<%= grunt.template.today(\"yyyy-mm-dd\") %>\n" +
      "<%= pkg.homepage ? \"* \" + pkg.homepage + \"\\n\" : \"\" %>" +
      "* Copyright (c) <%= grunt.template.today(\"yyyy\") %> <%= pkg.author.name %>;" +
      " Licensed <%= _.pluck(pkg.licenses, \"type\").join(\", \") %> */\n",
      // ---------------------------------------------------------------------
      // grunt-contrib-clean
      // ---------------------------------------------------------------------
      clean: {
        jso_modules_list: {
          src: ["jso_modules"]
        }
      },
      // ---------------------------------------------------------------------
      //
      // ---------------------------------------------------------------------
      esrijso_modulelist: {
        generate: {
          options: {
            basePath: "src/",
            matchPatterns: ["!*.css", "*.js", "*.html"]
          },
          src: [
            "**/*.*"
          ],
          dest: {
            moduleList: "jso_modules/esrijso-modulelist.txt",
            moduleByFileList: "jso_modules/esrijso-modulebyfilelist.txt"
          }
        }
      }
    });

  // ---------------------------------------------------------------------
  // Grunt registered tasks
  // ---------------------------------------------------------------------
  grunt.registerTask("default", ["clean", "esrijso_modulelist"]);
};