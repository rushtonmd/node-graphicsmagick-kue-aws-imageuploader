var config = require('../config'),
  fs = require('fs'),
  gm = require('gm'),
  kue = require('kue'),
  AWS = require('aws-sdk'),
  mime = require('mime'),
  path = require('path');

console.log(config.aws.accessKeyId);
var jobs = kue.createQueue();

AWS.config.update({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey
});

var ep = new AWS.Endpoint(config.aws.endpoint);
var s3 = new AWS.S3({
  endpoint: ep
});

exports.uploadImages = function(req, res) {
  var fileName = req.files.imageFile.name;
  var filePath = req.files.imageFile.path;

  if (req.body.size600x600) {
    jobs.create('create image', {
      title: 'converting ' + fileName + ' to 600x600',
      fileName: fileName,
      filePath: filePath,
      width: 600,
      height: 600
    }).save();
  }
  if (req.body.size100x100) {
    jobs.create('create image', {
      title: 'converting ' + fileName + ' to 100x100',
      fileName: fileName,
      filePath: filePath,
      width: 100,
      height: 100
    }).save();
  }
  if (req.body.size50x50) {
    jobs.create('create image', {
      title: 'converting ' + fileName + ' to 50x50',
      fileName: fileName,
      filePath: filePath,
      width: 50,
      height: 50
    }).save();
  }

  res.redirect("back");
};

jobs.process('create image', 3, function(job, done) {
  var width = job.data.width;
  var height = job.data.height;
  var fileName = job.data.fileName;
  var filePath = job.data.filePath;
  var awsKey = "uploads-bucket/" + Date.now() + "/img" + width + "x" + height + "_" + fileName;

  gm(filePath)
    .resize(width, height + "^")
    .gravity('Center')
    .extent(width, height)
    .quality(90)
    .stream(function(err, stdout, stderr) {

    var i = [];

    stdout.on('data', function(data) {
      i.push(data);
    });

    stdout.on('close', function() {
      var image = Buffer.concat(i);

      var data = {
        Bucket: "sample-bucket-name3",
        Key: awsKey,
        Body: image,
        ContentType: mime.lookup(fileName),
        ContentLength: image.length,
        ACL: 'public-read'
      };
      s3.client.putObject(data, function(err, res) {
        if (err)
          console.log(err)
        else
          console.log("Successfully uploaded data to " + awsKey);
        done();
      });

    });
  });

});