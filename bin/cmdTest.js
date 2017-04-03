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
        return new Promise(function(resolve, reject) {
            var cmds = config.split(' ');
            var cmd = cmds[0];
            cmds.shift();
            const cmdSpawn = spawn(cmd, cmds);
            const logData =  (data)=>{
                console.log(data.toString());
                if(data.indexOf('[ERR]')>=0){
                    let command = cmdSpawn.spawnargs.join(' ');
                    console.log('Error when running cmd :', command, '\nError = ', data.toString());
                    cmdSpawn.stdout.removeListener('data',logData);
                    return resolve(command);
                }
            };
            cmdSpawn.stdout.on('data', logData /*(data)=>{
                //console.log('cmd = '+cmds+' data : '+ data);
                /!*console.log(data.toString());
                if(data.indexOf('[ERR]')>=0){
                    let command = cmdSpawn.spawnargs.join(' ');
                    console.log('Error when running cmd :', command, '\nError = ', data.toString());
                    cmdSpawn.stdout.removeListener('data');
                    return resolve(command);
                }*!/
            }*/);
            cmdSpawn.stderr.on('data', data => {
                console.log('error');
                return reject(data);
            });
            cmdSpawn.on('close', code => {
                resolve(code);
            })
        });

    });
    Promise.all(promises)
        .then(function(exitCodes) { console.log('all finished'); console.log(exitCodes); })
        .catch(console.error);
});

/*
const sencha = spawn('sencha',['-cwd',cwDir,'-sdk',fwDir+'\\ext-6.2.2.113','generate','app','myApp','myApp']);
sencha.stdout.on('data', (data)=>{
    if(data.indexOf('[ERR]')>=0){
        console.log('following command failed : ' , sencha.spawnargs.join(' '));
        console.log(`with error  : ${data}`);
        sencha.kill();
    }

});
sencha.stdout.on('close', (code)=>{
    console.log('exit code : ', code);
});*/
