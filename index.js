'use strict';
let fs   = require('fs');
let path = require('path');
let rl   = require('linebyline');
let dateFormat = require('./date-format');

const data = path.join(__dirname, 'data');
const xls  = 'pings.xls';

let writeStream = fs.createWriteStream(path.join(__dirname, xls));

// Sets and the header
let header = `Host \t E-Commerce \t Horario \t Resposta (em ms) \n`;
writeStream.write(header);

fs.readdirSync(data)
  .forEach(folder => {

    console.log(`Iniciando leitura dos logs do ${folder}:`);

    fs.readdirSync(path.join(data, folder))
    .forEach(file => {

      let rd = rl(path.join(data, folder, file));

      let name = file.substring(file.indexOf('_') + 1);
      let site = name.substring(0, name.indexOf('.'));

      console.log(`Log: ${site}`);

      rd.on('line', (line, index) => {
        let log = line.split(' ');
        let row;

        if(path.extname(file) !== '.txt') {
          let ms    = log[log.length - 2].substring(log[log.length - 2].indexOf('=') + 1 )
          let date  = dateFormat(new Date(`${log[1]} ${log[2]} ${log[3]} 2016`));

          if (log[8] == 'timeout')
            ms = 'timeout';

          row = `${folder} \t ${site} \t ${date} ${log[4]} \t ${ms} \n`;

        } else {
          let ms = log[log.length - 1].substring(0, log[log.length - 1].indexOf('m'));
          row = `${folder} \t ${site} \t ${log[0]} ${log[2]} \t ${ms} \n`;
        }

        if(index <= 2000)
          writeStream.write(row);
      });
    })
  });
