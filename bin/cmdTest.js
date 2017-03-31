/**
 * Created by Martin on 28.03.2017.
 */
const fs = require('fs');
var configParser = require('../configParser')('config.json');
const spawn = require('child_process').spawn;
const path = require('path');
//let content;

let fwDir = path.normalize('C:\\Users\\Martin\\Downloads\\frameworks');
let cwDir = path.join(fwDir , '..', 'test');

configParser.then((configs)=> {

    var len = configs.length;
    for(var i = 0; i<len;i++){
        var cmds = configs[i].split(' ');
        var cmd = cmds[0];
        cmds.shift();
        const cmdSpawn = spawn(cmd, cmds);
        cmdSpawn.stdout.on('data', (data)=>{
            console.log('cmd = '+cmds+' data : '+ data);
        });
    }
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

console.log('here');