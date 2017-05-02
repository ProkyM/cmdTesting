/**
 * Created by Martin on 28.03.2017.
 */
const fs = require('fs');
const spawn = require('child_process').spawn;
const path = require('path');
let configPath = path.join(__dirname,'..','config.json');
let totalErrorsCount = 0;
let totalWarningsCount = 0;

/*--------SET SDK path and working directory path here ----------------
* Both dirs should exist
* */
let SDKPath = '/home/martin/extJS65/';
let workingDirectoryPath = '/home/martin/apps/';

const configParser = require('../configParser')(configPath);
configParser.then((configs,err)=> {
    if(err){
        console.error(err);
    }
    var promises = configs.map(config => {
        return () => {
            return new Promise(function (resolve, reject) {
                var cmds = config.split(' ');
                var cmd = cmds.shift();
                for(var i=0,n=cmds.length;i<n;i++){
                    cmds[i] = cmds[i].replace('{SDK}',SDKPath);
                    cmds[i] = cmds[i].replace('{CWD}', workingDirectoryPath);
                }

                const cmdSpawn = spawn(cmd, cmds);
                let command = cmdSpawn.spawnargs.join(' ');
                let warnings = [], errors = [];
                console.log('running command : ', command);
                const logData = (data)=> {
                    if (data.indexOf('[ERR]') >= 0) {
                        errors.push({ cmd: command, msg :data.toString()});
                        //console.log('Error when running cmd :', command, '\nError = ', data.toString());
                        //cmdSpawn.stdout.removeListener('data', logData);
                        cmdSpawn.kill();
                        return resolve();
                    }
                    if (data.indexOf('[WRN]') >= 0) {
                        warnings.push({ cmd: command, msg :data.toString()});
                        //console.log('Warning when running cmd :', command, '\nWarning = ', data.toString());
                    }
                };
                cmdSpawn.stdout.on('data', logData);
                cmdSpawn.stderr.on('data', data => {
                    console.log('error');
                    return reject(data);
                });
                cmdSpawn.on('close', code => {
                    totalWarningsCount += warnings.length;
                    totalErrorsCount += errors.length;
                    console.log('Warnings count = ' + warnings.length);
                    console.log('Errors count = ' + errors.length);
                    return resolve(code);
                })
            });
        }

    });

    // serialize our fns
    function serialize(fns) {
        var result = Promise.resolve();
        fns.forEach((f)=>{
            result = result.then(f);
        });
        return result;
    }


    var res = serialize(promises);

    res.then(function (done,err) {
        console.log('all tests done');
        console.log('Total errors = ' + totalErrorsCount);
        console.log('Total warnings = ' + totalWarningsCount);

    }, console.error);

});
