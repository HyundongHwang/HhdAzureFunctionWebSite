"use strict";

const mnu = require("../util/my_node_util");

module.exports = async function (context, req) {
    mnu.context_res_done(context, 200, {
        msg: `hello cmd:${req.query.cmd} !!!`
    });
}