/*
|--------------------------------------------------------------------------
| App helper functions
|--------------------------------------------------------------------------
|
| Contains all custom functions used in this app
|
*/

var fs = require('fs');


/**
* Convert string to slug
*
* @params string
* @return string
*/
function convertToSlug(string)
{
  return string
  .toLowerCase()
  .replace(/[^\w ]+/g,'')
  .replace(/ +/g,'-');
}

module.exports.convertToSlug = convertToSlug;


/**
* Delete folder recursivly
*
* @param path
* @return void
*/
var deleteFolderRecursive = function(path) {

  if( fs.existsSync(path) ) {

    fs.readdirSync(path).forEach(function(file,index){

      var curPath = path + "/" + file;

      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });

    fs.rmdirSync(path);
  }
};

module.exports.deleteFolderRecursive = deleteFolderRecursive;
