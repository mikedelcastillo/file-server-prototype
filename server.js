const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const ip = require("ip");
const ipAddress = ip.address();
const path = require('path');
const fs = require('fs');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/pug'));

// app.use (function(req, res, next) {
//     var data='';
//     req.setEncoding('utf8');
//     req.on('data', function(chunk) {
//        data += chunk;
//     });
//
//     req.on('end', function() {
//         req.body = data;
//         next();
//     });
// });

app.get('*', (req, res) => {
  const viewPath = req.path;
  console.log("GET", viewPath);
  fs.exists(viewPath, exists => {
    if(!exists) return res.send('404');
    fs.lstat(viewPath, (err, stats) => {
      if(stats.isFile()){
        res.sendFile(viewPath);
      } else{
        fs.readdir(viewPath, (err, readdir) => {
          res.render('list', {
            readdir,
            viewPath,
            path
          });
        });
      }
    });
  });
});

app.post('*', fileUpload(), (req, res) => {
  const viewPath = req.path;
  console.log("POST", viewPath);
  let files = [];
  if(req.files.files) files = req.files.files;
  else files = req.files;
  for(let i in files){
    const file = files[i];
    const p = path.join(viewPath, file.name);
    console.log(p);
    file.mv(p, console.log)
  }
  res.redirect(req.get('referer'));
});

const port = 3000;
console.log(`Server on ${ipAddress}:${port}`);
app.listen(port);
