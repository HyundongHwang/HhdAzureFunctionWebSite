"use strict";

const mnu = require("../util/my_node_util");
const asu = require("../util/azure_storage_util");

module.exports = async function (context, req) {
    switch (req.query.cmd) {
        case "register":
            await _register_async(context);
            break;
        default:
            mnu.context_res_done(context, 400, {
                msg: `cmd:${req.query.cmd} 를 처리할 수 없습니다.`
            });
            break;
    }
}

async function _register_async(context) {
    let new_user = {
        id : context.req.query["id"],
        pw : context.req.query["pw"],
        name : context.req.query["name"],
        phone_number : context.req.query["phone_number"],
        email : context.req.query["email"],
    }

    await asu.upsert_async("user", new_user["id"], new_user);
    mnu.context_res_done(context, 200, new_user);
}