"use strict";

const mnu = require("../util/my_node_util");
const asu = require("../util/azure_storage_util");

module.exports = async function (context, req) {
    switch (req.query.cmd) {
        case "register":
            await _register_async(context);
            break;
        case "login":
            await _login_async(context);
            break;
        case "me":
            await _me_async(context);
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
        id: context.req.query["id"],
        pw: context.req.query["pw"],
        name: context.req.query["name"],
        phone_number: context.req.query["phone_number"],
        email: context.req.query["email"],
    }

    await asu.upsert_async("user", new_user["id"], new_user);
    mnu.context_res_done(context, 200, new_user);
}

async function _login_async(context) {
    let id = context.req.query["id"];
    let pw = context.req.query["pw"];
    let user = await asu.get_entity_async("user", id);

    if (user["id"] !== id) {
        mnu.context_res_done(context, 200, {
            msg: `${id} 님은 존재하지 않는 사용자 입니다!!!`
        });
        return;
    }

    if (user["pw"] !== pw) {
        mnu.context_res_done(context, 200, {
            msg: `${id} 님, 잘못된 패스워드 입니다!!!`
        });
        return;
    }

    let session_key = mnu.create_uuid();
    user["session_key"] = session_key;

    await asu.upsert_async("user", id, user);

    mnu.context_res_done(context, 200, {
        redirect_url: `/home.html?session_key=${session_key}`,
        user: user
    });
}

async function _me_async(context) {
    let session_key = context.req.query.session_key;
    let me;
    let user_list = await asu.query_entities_async("user", "session_key", "eq", session_key);
    if (user_list.length === 0) {
        mnu.context_res_done(context, 200, {
            redirect_url: `/`
        });
        return;
    } else {
        me = user_list[0];
    }

    mnu.context_res_done(context, 200, me);
}
