/**
 * Created by Martin on 28.03.2017.
 */
const fs = require('fs');
function configParser (configFilePath){
    return new Promise((resolve, reject) => {
        fs.readFile(configFilePath,'utf-8', (err,data) => {
            if(err) {
                console.log('chybicka');
                reject(err);
            }
            var config = JSON.parse(data);
            var commands = [];
            var counter = 0;
            function parseConfig(data,path){
                path = path || '';
                if(data.hasOwnProperty('command')){
                    var hasChild = data.hasOwnProperty('cmds');
                    path += data['command'];
                    path += hasChild?' ':'' ;
                    if(hasChild){
                        data['cmds'].forEach(obj =>  {
                            parseConfig(obj,path);
                        });
                    }else{
                        commands[counter++]=path;
                    }
                }
                return commands;
            }
            var toRet = parseConfig(config);
            resolve(toRet);
        });
    });
}
module.exports = configParser;