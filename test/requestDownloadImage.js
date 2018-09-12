var fs = require('fs');
var request = require('request');
const FILE_N = 1000;

const API_DOWNLOAD = 'http://192.168.56.1:3000/api/photo/download/'

const namegen = (count) => {
    var name = `0000${count}`;
    return name.slice(name.length - 4, name.length) + ".jpg";
}

const numbergen = (count) => {
  var name = `0000${count}`;
  return name.slice(name.length - 4, name.length);
}
var download = function(uri, filename,){
  return new Promise((resolve, reject) => {
    request.head(uri, function(err, res, body){
      console.log('content-type:', res.headers['content-type']);
      console.log('content-length:', res.headers['content-length']);
  
      request(uri).pipe(fs.createWriteStream("dist/" + filename)).on('close', resolve);
    });
  }) 
};
function downFiles(start, nums) {
  const listPromises = [];
  for (var idx = start; idx < start + nums; idx++) {
    const downloadFile = download(`${API_DOWNLOAD}${numbergen(idx)}`, namegen(idx));
    listPromises.push(downloadFile);
  }
  Promise.all(listPromises).then(() => {
    if(start + nums < FILE_N) {
      console.log('done', start + nums)
      downFiles(start + nums, nums)
    }
  })
}

downFiles(0, 10); // 10 files once request