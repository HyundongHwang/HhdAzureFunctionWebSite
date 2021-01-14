"use strict";

const mwu = {
    fetch_async: function (url) {
        return fetch(url).then(function (response) {
            if (response.ok === true) {
                return response.json();
            } else {
                return response;
            }
        })
    },

    get_query_param_value: function (localtion_search, param_name) {
        let param_value = new URLSearchParams(location.search).get(param_name);
        return param_value;
    },

    log: function (pre_el, log) {
        let new_log = `${pre_el.html()}\n${log}`;
        pre_el.html(new_log);
    },

    set_time_out_async: async function (timeout) {
        return new Promise(async (resolve, reject) => {
            let timer_handler = function () {
                resolve();
            };
            setTimeout(timer_handler, timeout);
        });
    }
}