"use strict";

const path = require('path');
const mime_types = require('mime-types');
const mnu = require("../util/my_node_util");

module.exports = async function (context, req) {
    let file_path = "index.html";

    if (req.query.file_path) {
        file_path = req.query.file_path;
    }

    file_path = path.join(__dirname, "../static", file_path);
    let file_data;

    try {
        file_data = await mnu.fs_read_file_async(file_path);
    } catch (err) {
        context.log.error(err);
        mnu.context_res_done(context, 404, err);
        return;
    }

    let content_type = mime_types.lookup(file_path);

    context.res = {
        status: 200,
        body: file_data,
        isRaw: true,
        headers: {
            'Content-Type': content_type
        }
    };

    context.done();
}