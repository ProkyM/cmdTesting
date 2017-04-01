/**
 * Created by Martin on 28.03.2017.
 */
const fs = require('fs');
const spawn = require('child_process').spawn;
//console.log()
const path = require('path');


let configPath = path.join(__dirname,'..','config.json');

var configParser = require('../configParser')(configPath);
configParser.then((configs,err)=> {
    if(err){
        console.log('err');
    }
    var len = configs.length;
    var promises = configs.map(config => {
        return new Promise(function(resolve, reject) {
            var cmds = config.split(' ');
            var cmd = cmds[0];
            cmds.shift();
            const cmdSpawn = spawn(cmd, cmds);
            cmdSpawn.stdout.on('data', (data)=>{
                console.log('cmd = '+cmds+' data : '+ data);
            });
            cmdSpawn.stderr.on('data', data => {
                console.log('error')
                reject(data);
            });
            cmdSpawn.on('close', code => {
                resolve(code);
            })
        });

    });
    Promise.all(promises)
        .then(function() { console.log('all finished'); })
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
