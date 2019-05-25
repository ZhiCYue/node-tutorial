/**
 * Module dependencies:
 */

var fs = require('fs'), stdin = process.stdin, stdout = process.stdout;
var stats = [];

fs.readdir(process.cwd(), function (err, files) {
  console.log('');

  if (!files.length) {
    return console.log(' \033[31m No files to show!\033[39m\n');
  }

  console.log('  Select which file or directory you want to see\n');

  function file(i) {
    let filename = files[i];

    fs.stat(__dirname + '/' + filename, function (err, stat) {
      stats[i] = stat;

      if (stat.isDirectory) {
        console.log('  ' + i + ' \033[36m' + filename + '/\033[39m');
      } else {
        console.log('  ' + i + ' \033[90m' + filename + '/\033[39m');
      }

      i += 1;
      if (i == files.length) {
        read();
      } else {
        file(i);
      }

    })

    // read user input when files are shown
    function read () {
      console.log('');
      stdout.write(' \033[33mEnter your choice: \033[39m');
      stdin.resume();
      stdin.setEncoding('utf8');

      stdin.on('data', option);
    }

    function option (data) {
      if (!files[Number(data)]) {
        stdout.write(' \033[33mEnter your choice: \033[39m');
      } else {
        stdin.pause();
        
        filename = files[Number(data)]

        if (stats[Number(data)].isDirectory()) {
          fs.readdir(__dirname + '/' + filename, function (err, _files) {
            console.log('');
            console.log(' (' + _files.length + ' files)');
            _files.forEach(function (file) {
              console.log(' - ' + file);
            })
          });
        } else {
          console.log('xxx:', filename)
          fs.readFile(__dirname + '/' + filename, 'utf8', function (err, data) {
            console.log('');
            console.log('\033[90m' + data.replace(/(.*)/g, '  $1') + '\033[39m');
          });
        }
      }
    }
  }

  file(0);
});

