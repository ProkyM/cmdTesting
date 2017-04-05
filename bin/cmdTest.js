/**
 * Created by Martin on 28.03.2017.
 */
const fs = require('fs');
const spawn = require('child_process').spawn;
//console.log()
const path = require('path');
let configPath = path.join(__dirname,'..','config.json');

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
                const cmdSpawn = spawn(cmd, cmds);
                let command = cmdSpawn.spawnargs.join(' ');
                console.log('running command : ', command);
                const logData = (data)=> {
                    if (data.indexOf('[ERR]') >= 0) {
                        console.log('Error when running cmd :', command, '\nError = ', data.toString());
                        //cmdSpawn.stdout.removeListener('data', logData);
                        cmdSpawn.kill();
                        return resolve();
                    }
                };
                cmdSpawn.stdout.on('data', logData);
                cmdSpawn.stderr.on('data', data => {
                    console.log('error');
                    return reject(data);
                });
                cmdSpawn.on('close', code => {
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
    }, console.error);

});
