"use strict";
const fs = require('fs');
const util = require('util');
const uuid = require("uuid");

module.exports.fs_read_file_async = util.promisify(fs.readFile);

module.exports.context_res_done = function (context, status, body) {
    context.res = {
        status: status,
        body: body,
        headers: {
            "Content-Type": "application/json"
        },
    };
    context.done();
}

module.exports.is_undefined_or_null_or_empty = function (value) {
    if (value === undefined) {
        return true;
    }

    if (value === null) {
        return true;
    }

    if (value === "") {
        return true;
    }

    return false;
}

module.exports.create_uuid = function () {
    let res = uuid.v4();
    return res;
}