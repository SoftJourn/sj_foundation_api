'use strict';
const opt = require('../datasources.json');
module.exports = function(File) {
    File.uploadFile = function (ctx, options, cb) {
        options = opt;

        File.app.models.container.upload(ctx.req, ctx.result, options, function (err, fileObj) {
            if (err) cb(err);
            else {
                // Here myFile is the field name associated with upload. You should change it to something else if you
                var fileInfo = fileObj.files.myFile[0];
                File.create({
                    name: fileInfo.name,
                    type: fileInfo.type,
                    container: fileInfo.container,
                    userId: ctx.req.accessToken.userId,
                    url: CONTAINERS_URL + fileInfo.container + '/download/' + fileInfo.name // This is a hack for creating links
                }, function (err, obj) {
                    if (err) {
                        console.log('Error in uploading' + err);
                        cb(err);
                    }
                    else {
                        cb(null, obj);
                    }
                });
            }
        });
    };

    File.remoteMethod(
        'uploadFile',
        {
            description: 'Uploads a file',
            accepts: [
                {arg: 'ctx', type: 'object', http: {source: 'context'}},
                {arg: 'options', type: 'object', http: {source: 'query'}}
            ],
            returns: {
                arg: 'fileObject', type: 'object', root: true
            },
            http: {verb: 'post'}
        }
    )
};