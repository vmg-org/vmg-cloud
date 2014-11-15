/** @module */
var AWS = require('aws-sdk');
var arrStorage = require('./index');
// Use APIs, developed before this date
AWS.config.apiVersions = {
  elastictranscoder: '2012-09-25',
  s3: '2006-03-01'
};

//var etr = new AWS.ElasticTranscoder({
//  region: 'eu-west-1'
//});

var s3 = new AWS.S3();

var handleCreateBucket = function(err, data) {
  if (err) {
    if (err.code === 'BucketAlreadyOwnedByYou') {
      console.log('BucketAlreadyOwnedByYou');
      return;
    }
    console.log(err, err.stack);
    return;
  }
  console.log(data);
};

var buildJob = function(bucketName, regionKey) {
  var params = {
    Bucket: bucketName,
    ACL: 'private',
    CreateBucketConfiguration: {
      LocationConstraint: regionKey
    }
  };

  s3.createBucket(params, handleCreateBucket);
};

var buildParams = function(name, inputBucket, outputBucket, thumbnailBucket) {
  return {
    InputBucket: inputBucket,
    /* required */
    /* The name of the pipeline. We recommend that the name be unique within the AWS account, but uniqueness is not enforced.
    	    Constraints: Maximum 40 characters.*/
    Name: name,
    /* required */
    Role: process.env.AWS_DEFAULT_ROLE,
    /* required */
    ContentConfig: {
      Bucket: outputBucket,
      Permissions: [{
          Access: [
            'Read',
            /* more items */
          ],
          Grantee: 'AllUsers',
          GranteeType: 'Group'
        },
        /* more items */
      ],
      StorageClass: 'ReducedRedundancy'
    },
    ThumbnailConfig: {
      Bucket: thumbnailBucket,
      Permissions: [{
          Access: [
            'Read',
            /* more items */
          ],
          Grantee: 'AllUsers',
          GranteeType: 'Group'
        },
        /* more items */
      ],
      StorageClass: 'ReducedRedundancy'
    }
  };
};

var handleCreatePipeline = function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else console.log(data); // successful response
};

var handleStorage = function(strg) {
  //  buildJob(strg.srcBucket, strg.regionKey);
  //  buildJob(strg.dstBucket, strg.regionKey);
  //  buildJob(strg.preBucket, strg.regionKey);
  //  buildJob(strg.frameBucket, strg.regionKey);
  //  buildJob(strg.thmbBucket, strg.regionKey);
  var etr = new AWS.ElasticTranscoder({
    region: strg.regionKey
  });

  //  var srcPreParams = buildParams(strg.coderSrcPreName, strg.srcBucket, strg.preBucket, strg.frameBucket);
  //  etr.createPipeline(srcPreParams, handleCreatePipeline);
  //  var srcDstParams = buildParams(strg.coderSrcDstName, strg.srcBucket, strg.dstBucket, strg.thmbBucket);
  //  etr.createPipeline(srcDstParams, handleCreatePipeline);
};

arrStorage.forEach(handleStorage);
