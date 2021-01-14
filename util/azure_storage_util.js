// https://docs.microsoft.com/ko-kr/azure/cosmos-db/table-storage-how-to-use-nodejs
"use strict";
const path = require('path');
const azure_storage = require('azure-storage');
const mnu = require("./my_node_util")

let _table_svc

async function _get_table_svc_async() {
    if (_table_svc === undefined) {
        let file_path = path.join(__dirname, "../.key.json");
        let file_data = await mnu.fs_read_file_async(file_path);
        let j_root = JSON.parse(file_data);

        _table_svc = azure_storage.createTableService(
            j_root.storage_account_name,
            j_root.storage_account_key
        );
    }

    return _table_svc;
}

function _standadize_azure_res(azure_res) {
    let std_map = {}

    for (let k in azure_res) {
        if (k.startsWith(".") || k.startsWith("_") || k === "RowKey" || k === "PartitionKey" || k === "Timestamp") {
            continue;
        }

        std_map[k] = azure_res[k]._;
    }

    return std_map;
}

module.exports.get_entity_async = function (table_name, row_key) {
    return new Promise(async (resolve, reject) => {
        let table_svc = await _get_table_svc_async();
        table_svc.retrieveEntity(table_name, "PartitionKey", row_key, function (error, result, response) {
            if (result === undefined) {
                reject(error);
            } else {
                let std_map = _standadize_azure_res(result);
                resolve(std_map);
            }
        });
    })
}

module.exports.create_table_async = function (table_name) {
    return new Promise(async (resolve, reject) => {
        let table_svc = await _get_table_svc_async();
        table_svc.createTableIfNotExists(table_name, function (error, result, response) {
            if (error) {
                reject(error);
            } else {
                // {isSuccessful: true, statusCode: 200, TableName: 'test', created: false}
                resolve(result);
            }
        });
    });
}

module.exports.upsert_async = function (table_name, row_key, item) {
    return new Promise(async (resolve, reject) => {
        let table_svc = await _get_table_svc_async();

        table_svc.createTableIfNotExists(table_name, function (error, result, response) {
            if (error) {
                reject(error);
            } else {
                let entity = {
                    PartitionKey: {
                        _: "PartitionKey"
                    },
                    RowKey: {
                        _: row_key
                    },
                };

                for (const k in item) {
                    if (k.startsWith(".") || k.startsWith("_") || k === "RowKey" || k === "PartitionKey" || k === "Timestamp") {
                        continue;
                    }

                    entity[k] = {
                        _: item[k]
                    };
                }

                table_svc.insertOrMergeEntity(table_name, entity, function (error2, result2, response2) {
                    if (error2) {
                        reject(error2);
                    } else {
                        resolve(result2);
                    }
                });
            }
        });
    });
}

function _query_entities_async(table_name, query, continuationToken) {
    return new Promise(async (resolve, reject) => {
        let table_svc = await _get_table_svc_async();
        table_svc.queryEntities(table_name, query, continuationToken, function (error, result, response) {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

module.exports.query_entities_async = function (table_name, filter_col, filter_op, filter_value, select_col_list, res_num) {
    return new Promise(async (resolve, reject) => {
        let table_svc = await _get_table_svc_async();
        let continuationToken = null;
        let query = new azure_storage.TableQuery();

        if (!mnu.is_undefined_or_null_or_empty(filter_col)) {
            query = query.where(`${filter_col} ${filter_op} ?`, filter_value);
        }

        if (!mnu.is_undefined_or_null_or_empty(select_col_list)) {
            query = query.select(select_col_list);
        }

        if (!mnu.is_undefined_or_null_or_empty(res_num)) {
            query = query.top(res_num);
        }

        let result_entries_list = []

        while (true) {
            try {
                let result = await _query_entities_async(table_name, query, continuationToken);
                //result.entries
                //result.continuationToken
                result_entries_list = result_entries_list.concat(result.entries)
                continuationToken = result.continuationToken

                if (continuationToken === null) {
                    break
                }
            } catch (error) {
                reject(error);
                return
            }
        }

        let result_std_entries_list = []

        for (const k in result_entries_list) {
            let std_map = _standadize_azure_res(result_entries_list[k]);
            result_std_entries_list.push(std_map);
        }

        resolve(result_std_entries_list);
    })
}

module.exports.is_table_exist_async = function (table_name) {
    return new Promise(async (resolve, reject) => {
        let table_svc = await _get_table_svc_async();
        table_svc.doesTableExist(table_name, function (error, result, response) {
            if (error !== null) {
                reject(error);
                return;
            }
            resolve(result.exists);
        });
    })
}