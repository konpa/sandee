/*
|--------------------------------------------------------------------------
| API Controller
|--------------------------------------------------------------------------
|
| Serve JSON to our AngularJS client
|
*/


// Require modules
var express = require('express'),
    spawn = require('child_process').spawn,
    openDB = require('json-file-db'),
    ncp = require('ncp').ncp,
    fs = require('fs'),
    helpers = require('../helpers.js'),
    config = require('../sandee.json');

// Configure ncp
ncp.limit = 16;

// Create router
var router = express.Router();

// Initialize JSON DB
var db = openDB('sandboxes/sandboxes.json');

// Detect OS
var os = process.platform;
var isWindows = (process.platform == "win32" || process.platform == "win64") ? true : false;


/**
* Return all sandboxes in JSON DB
*
* @return json
*/
router.get('/sandboxes', function(req, res) {

    db.get(function(err, data) {
        return res.json(data);
    });
});

/**
* Return a specific sandbox from JSON DB
*
* @params name, id
* @return json
*/
router.get('/sandboxes/:name', function(req, res) {

    // Store params
    var name = req.params.name;

    db.get({name: name}, function(err, data){
        return res.json(data[0]);
    });
});


/**
* Create sandbox
*
* @param name
* @return json
*/
router.get('/sandboxes/add/:name', function(req, res) {

    // Store params
    var name = req.params.name;

    // Clean name
    name = helpers.convertToSlug(name);

    db.get(function(err, data){

        // Check if name is already taken
        if (JSON.stringify(data).indexOf("name\":\"" + name) > -1) {

            return res.json('Sandbox name already taken');
        }

        // Get id from json length
        var id = data.length + 1;

        // template path
        var source = 'sandboxes/_template';

        // destination path
        var destination = 'sandboxes/' + name;

        // Copy and rename template folder
        ncp(source, destination, function (err) {

            if (err) { return console.error(err); }

            // Write config file
            var config = {
                "port": 5000 + id
            };

            fs.writeFile(destination + '/config.json', JSON.stringify(config, null, 4), function(err) {
                if (err) { return console.error(err); }
            });

            // Insert newly created sandbox in json db
            db.put({id:id, name:name, port:5000 + id}, function(err) {
                if (err) { return console.error(err); }
            });

            return res.json('Sandbox created');
        });
    });
});


/**
* Delete sandbox
*
* @param name
* @return json
*/
router.get('/sandboxes/delete/:name', function(req, res) {

    // Store params
    var name = req.params.name;

    // folder path
    var path = 'sandboxes/' + name;

    // delete folder
    helpers.deleteFolderRecursive(path);

    // delete in db
    db.delete({name: name}, function(err, data) {

        if (err) { return console.error(err); }

        return res.json('Sandbox deleted');
    });
});


/**
* Return session containing all running gulp processes
*
* @return json
*/
router.get('/gulp/session', function(req, res) {

    return res.json(req.session.gulpProcesses);
});


/**
* Start/Stop gulp for sandboxes
*
* @params name, action, pid (optional)
* @return json
*/
router.get('/gulp/:name/:action/:pid?', function(req, res) {

    // Store params
    var name = req.params.name;
    var action = req.params.action;
    var pid = parseInt(req.params.pid);
    var sandboxPath = './sandboxes/' + name + '/';

    // Start gulp process
    if (action == "start") {

        // Start gulp process
        var cmd = isWindows ? 'gulp.cmd' : 'gulp';
        var gulp = spawn(cmd, ['--gulpfile', sandboxPath + 'gulpfile.js']);

        // Print gulp messages on console
        gulp.stdout.pipe(process.stdout);
        gulp.stderr.pipe(process.stderr);

        // Add gulp process to session
        if (typeof req.session.gulpProcesses !== 'undefined') {
            req.session.gulpProcesses = req.session.gulpProcesses + name + ':' + gulp.pid + ';';
        } else {
            req.session.gulpProcesses = name + ':' + gulp.pid + ';';
        }

        // Return session
        return res.json(req.session.gulpProcesses);
    }

    // Stop gulp process
    else if (action == "stop") {

        // Kill process (two methods because process.kill(pid) is not working on Windows)
        if (isWindows) {
            var kill = spawn('taskkill', ['/pid', pid, '/T', '/F']);
        } else {
            process.kill(pid);
        }

        // Remove gulp process from session
        req.session.gulpProcesses = req.session.gulpProcesses.replace(name + ':' + pid + ';', '');

        // Return session
        return res.json(req.session.gulpProcesses);
    }
});


/**
* Launch editor
*
* @param name
* @return void
*/
router.get('/editor/:name', function(req, res) {

    // Store params
    var name = req.params.name;
    var sandboxPath = './sandboxes/' + name + '/';

    // Launch editor
    return spawn(config.editor, [sandboxPath]);
});



module.exports = router;
