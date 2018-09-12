var fs = require('fs');

const FILE_N = 100;
const srcFile = __dirname + "/test.jpg"

const namegen = (count) => {
    var name = `0000${count}`;
    return name.slice(name.length - 4, name.length) + ".jpg";
}

var createFile = function(idx){
  return new Promise((resolve, reject) => {
    fs.createReadStream(srcFile).pipe(fs.createWriteStream("Pictures/" + namegen(idx))).on('close', () => {
      console.log('done', idx);
      resolve();
    });
  }) 
};
function genFiles(start, nums) {
  const listPromises = [];
  for (var idx = start; idx < start + nums; idx++) {
    const downloadFile = createFile(idx, namegen(idx));
    listPromises.push(downloadFile);
  }
  Promise.all(listPromises).then(() => {
    if(start + nums < FILE_N) {
      console.log('done', start + nums)
      genFiles(start + nums, nums)
    }
  })
}

genFiles(0, 1); // 10 files once request
