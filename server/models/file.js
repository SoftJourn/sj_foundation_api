'use strict';

module.exports = (File) => {
    File.uploadFile = (ctx, cb) => {
        const datasources = require('../datasources.json');
        const options = datasources.storage;

        //TODO temporary options values, need to be changed
        options.container = "newContainer";
        ctx.req.accessToken = {};
        ctx.req.accessToken.userId = 1;

        File.app.models.container.upload(ctx.req, ctx.result, options, function (err, fileObj) {
            if (err) {
                cb(err)
            }
            // TODO Here myFile is the field name associated with upload. Possibly we should change it to something else
            const fileInfo = fileObj.files.myFile[0];
            const newFileParams = {
                name: fileInfo.name,
                type: fileInfo.type,
                container: fileInfo.container,
                userId: ctx.req.accessToken.userId,
                url: options.root + fileInfo.container + '/download/' + fileInfo.name // This is a hack for creating links
            };

            File.create(newFileParams, (err, obj) => {
                if (err) {
                    console.log('Error in uploading' + err);
                    cb(err);
                }
                else {
                    cb(null, obj);
                }
            });
        });
    };

    File.remoteMethod(
        'uploadFile',
        {
            description: 'Uploads a file',
            accepts: [
                {arg: 'ctx', type: 'object', http: {source: 'context'}}
                ],
            returns: {
                arg: 'fileObject', type: 'object', root: true
            },
            http: {verb: 'post'}
        }
    )
};