# HhdAzureFunctionWebSite

- [HhdAzureFunctionWebSite](#hhdazurefunctionwebsite)
  * [Introduction](#introduction)
  * [Worries & Solutions](#worries---solutions)
  * [DEMO](#demo)
  * [How to run](#how-to-run)
    + [1. git clone](#1-git-clone)
    + [2. Create Azure Function](#2-create-azure-function)
    + [3. Create Azure Storage Service](#3-create-azure-storage-service)
    + [4. Install node.js](#4-install-nodejs)
    + [5. Install Azure CLI](#5-install-azure-cli)
    + [6. Install Azure Function Runtime](#6-install-azure-function-runtime)
    + [7. Create Azure Storage Service's key file](#7-create-azure-storage-service-s-key-file)
    + [8. Install node.js's libraries](#8-install-nodejs-s-libraries)
    + [9. Test in local environment](#9-test-in-local-environment)
    + [10. Configure debug environment](#10-configure-debug-environment)
    + [11. Deploy Azure Function](#11-deploy-azure-function)
  * [Detailed code explanation](#detailed-code-explanation)
    + [Create Azure Function node.js empty project](#create-azure-function-nodejs-empty-project)
    + [Create new function](#create-new-function)
    + [About design](#about-design)
    + [Create proxy file](#create-proxy-file)
    + [node.js utility](#nodejs-utility)
    + [front-end utility](#front-end-utility)
    + [func_static](#func_static)
    + [func_api](#func_api)

<br/>
<br/>
<br/>

## Introduction

- Simple website using web server and DB (member registration, login, personal information inquiry...), and its skeleton code
- Composition
    - WebServer : Azure Function HTTP Trigger 
    - DB : Azure Storage Table Service
    - WebServer technology : node.js
    - Front-end technology : HTML, javascript, CSS, jQuery, BootStrap
    - IDE : WebStorm

<br/>
<br/>
<br/>

## Worries & Solutions

- Very simple website skeleton code required.
    - With this project development, skeleton sample code and necessary documents from floor to distribution are organized.
- Worried about the cost of operating the website.
    - Azure Function HTTP Trigger is a serverless method, so it charges based on the number of requests,
    - It costs less than the smallest web server(around $10/month) resource in Azure.
    - At the beginning of operation, the billing is almost $0.
- Worried about the cost of operating the DB.
    - Azure Storage Table Service is a NoSQL-style DB, and there is no basic usage fee.
    - At the beginning of operation, the billing is almost $0.
    - It costs less than the smallest SQL server(around $10/month) resource in Azure.
- Worried about the scaling of WebServer.
    - Azure Function HTTP Trigger is a serverless method, so there is basically no worry about scaling according to traffic.
- Worried about the scaling of DB.
    - Azure Storage Table Service has no capacity limit, but rather, it is more cost-effective as data capacity increases.
- Worried about the scaling of DB schema design, DB maintenance.
    - Azure Storage Table Service is a NoSQL method, so unlike RDBMS method, schema is not specified separately,
    - Relatively simple design using only the table name and RowKey,
    - You can create a query by using a simple filter expression, and use and manage only through it.
- Worried about the scaling of various many techniques.
    - Inevitably, Javascript is used for the front end, so the backend also uses node.js to keep the technology type simple.
- Worried about javascript callback hell.
    - Resolve callback hell by using Javascript ES2017 version Promise, async/await.
    - All frequently used asynchronous HTTP requests and asynchronous DB query/management tasks are converted like easy synchronous functions using Promise and async/await.
    - I have made the related code into a utility that can be reused.   
- Worried about convenient debugging, powerful refactoring.
    - Convenient debugging and powerful refactoring using WebStorm instead of simple text editors like VsCode and Sublime.
    - The official documents of Azure Function HTTP Trigger guide VsCode by default,
    - Due to VsCode's Azure Function plugin problem, when you edit the source code, the debugging session is disconnected and the session starts anew, which takes a very long time.
    - If you do not use VsCode's Azure Function plugin at all, start func from the command line and debug with WebStorm, you can continue editing and debugging source code without interruption.
    - The setting to debug Azure Function with WebStorm is relatively simple, but it is not introduced in the official document, so it is easily introduced in the following article.
- Worried about record the development process and configuration details
    - Most of the development process and configuration details are done from the command line.
    - If you proceed from the command line, the result message is detailed so it is easy to find errors and record the process.
    - All of this skeleton sample code can be used on Windows and Linux, especially if the entire process is done from the command line, it is easy to proceed on Linux.
    - Command line tools such as az (Azure management), func (Azure Function management), and npm (node.js management) are well prepared.

<br/>
<br/>
<br/>

## DEMO

- https://hhdazurefunctionwebsite.azurewebsites.net/
- functions
    - registeration 
    - login
    - check my user information
- ![demo](https://user-images.githubusercontent.com/5696570/104704182-ab268180-575b-11eb-90ae-d1cf5f8360fd.gif) 

<br/>
<br/>
<br/>
    
## How to run

### 1. git clone
- Started by cloning the source code of this repository.
```shell script
PS C:\project> git clone git@github.com:HyundongHwang/HhdAzureFunctionWebSite.git
```

<br/>
<br/>
<br/>

### 2. Create Azure Function
- Create a new Azure Function object to act as a web server.
- Create a new Azure Function in `https://portal.azure.com/#create/hub`
- Of course, `hhdazurefunctionwebsite` is already used by me, so readers should use a different name.
- ![image](https://user-images.githubusercontent.com/5696570/104558149-ae4f3e00-5685-11eb-92c9-81a61fa9fd7b.png)
- ![image](https://user-images.githubusercontent.com/5696570/104558434-2158b480-5686-11eb-843f-0e1b8cf08e78.png)

<br/>
<br/>
<br/>

### 3. Create Azure Storage Service
- Create a new Azure Storage Service object to act as a DB.
- Create a new Azure Storage Service at `https://portal.azure.com/#create/hub`.
- Of course, `hhdazurefunctionwebsite` is already used by me, so readers should use a different name.
- ![image](https://user-images.githubusercontent.com/5696570/104558536-4ea56280-5686-11eb-8b82-6247124fed2e.png)
- ![image](https://user-images.githubusercontent.com/5696570/104558734-9cba6600-5686-11eb-9986-3ecbbe5374c1.png)

<br/>
<br/>
<br/>

### 4. Install node.js
- Install node.js locally.
- Installed from `https://nodejs.org/en/download/`.

```shell script
PS C:\project\HhdAzureFunctionWebSite> node --version
v12.19.0

PS C:\project\HhdAzureFunctionWebSite> npm --version
6.14.8
```

<br/>
<br/>
<br/>

### 5. Install Azure CLI
- Deployment/management for Azure can be done from the local command line. 
- download : https://aka.ms/installazurecliwindows
- reference : https://docs.microsoft.com/ko-kr/cli/azure/install-azure-cli-windows

```shell script
PS C:\project\HhdAzureFunctionWebSite> az --version
azure-cli                         2.17.1
core                              2.17.1
telemetry                          1.0.6
Python location 'C:\Program Files (x86)\Microsoft SDKs\Azure\CLI2\python.exe'
Extensions directory 'C:\Users\hhd20\.azure\cliextensions'
Python (Windows) 3.6.8 (tags/v3.6.8:3c6b436a57, Dec 23 2018, 23:31:17) [MSC v.1916 32 bit (Intel)]
Legal docs and information: aka.ms/AzureCliLegal
Your CLI is up-to-date.
Please let us know how we are doing: https://aka.ms/azureclihats
and let us know if you're interested in trying out our newest features: https://aka.ms/CLIUXstudy
```

<br/>
<br/>
<br/>

### 6. Install Azure Function Runtime
- Management/execution/debugging of Azure Functions can be performed from the local command line.
- download : https://go.microsoft.com/fwlink/?linkid=2135274
- reference : https://docs.microsoft.com/ko-kr/azure/azure-functions/functions-run-local

```shell script
PS C:\project\HhdAzureFunctionWebSite> func --version
3.0.2931
```

<br/>
<br/>
<br/>

### 7. Create Azure Storage Service's key file
- Setting a key for access to Azure Storage Service in node.js.
- In the Azure portal, copy the Azure Storage Service key created above and create a `/.key.json` file as shown below.
- ![image](https://user-images.githubusercontent.com/5696570/104559033-210ce900-5687-11eb-8429-b17bef32e3b5.png)
- `/.key.json`
    ```json
    {
        "storage_account_name": "hhdazurefunctionwebsite",
        "storage_account_key": "TYTH1IuwZm2xxxxxxxG0j5vrbkfLasxQ=="
    }
    ```
 
 <br/>
 <br/>
 <br/>
 
### 8. Install node.js's libraries
- Install all external libraries used in node.js at once with `npm install`
```shell script
PS C:\project\HhdAzureFunctionWebSite> npm install
npm WARN HhdAzureFunctionWebSite No repository field.
npm WARN HhdAzureFunctionWebSite No license field.
added 69 packages from 96 contributors and audited 70 packages in 2.86s
2 packages are looking for funding
  run `npm fund` for details
found 0 vulnerabilities
``` 

<br/>
<br/>
<br/>

### 9. Test in local environment
- Run web server locally with Azure Function Runtime with `func start`

```shell script
PS C:\project\HhdAzureFunctionWebSite> func start
Azure Functions Core Tools (3.0.2931 Commit hash: d552c6741a37422684f0efab41d541ebad2b2bd2)
Function Runtime Version: 3.0.14492.0
[2021-01-15T09:08:02.084] File 'C:\Program Files\dotnet\dotnet.exe' is not found, 'dotnet' invocation will rely on the PATH environment variable.
[2021-01-15T09:08:07.354] Debugger listening on ws://127.0.0.1:5858/a5f88cc7-51fd-4134-b5e2-1ffa1ba37f73
[2021-01-15T09:08:07.355] For help, see: https://nodejs.org/en/docs/inspector
Hosting environment: Production
Content root path: C:\project\HhdAzureFunctionWebSite
Now listening on: http://0.0.0.0:7071
Application started. Press Ctrl+C to shut down.
Functions:
        func_api: [GET,POST] http://localhost:7071/api/func_api
        func_static: [GET,POST] http://localhost:7071/api/func_static
        api_rule: [GET,POST,HEAD,PUT,DELETE,OPTIONS,PATCH,TRACE] http://localhost:7071/api/{*restOfPath}
        static_rule: [GET,POST,HEAD,PUT,DELETE,OPTIONS,PATCH,TRACE] http://localhost:7071/{*restOfPath}
For detailed output, run func with --verbose flag.
[2021-01-15T09:08:07.634] Worker process started and initialized.
```

- Local test
      - http://localhost:7071/

<br/>
<br/>
<br/>

### 10. Configure debug environment

- Setting the debugging port for WebStorm debugging
    - `local.settings.json` 편집
    ```json
    {
      "Values": {
        "languageWorkers:node:arguments": "--inspect=5858"
    ```
- Add WebStorm debug settings
    - ![image](https://user-images.githubusercontent.com/5696570/104556574-341dba00-5683-11eb-9383-e4cd6dc2d5a2.png)
- Run WebStrom debug (Ctrl+F9) with Azure Function Runtime running with `func start`
    - ![image](https://user-images.githubusercontent.com/5696570/104705841-be3a5100-575d-11eb-82ba-4dd8369899ad.png)

<br/>
<br/>
<br/>

### 11. Deploy Azure Function

- Deploy the website tested in detail in the local environment above to Azure Function
- Login to Azure.
    ```shell script
    (base) PS C:\project\HhdAzureFunctionWebSite> az login
    The default web browser has been opened at https://login.microsoftonline.com/common/oauth2/authorize. Please continue the login in the web browser. If no web browser is available or if the web browser fails to open, us
    e device code flow with `az login --use-device-code`.
    You have logged in. Now let us find all the subscriptions to which you have access...
    [
      {
        "cloudName": "AzureCloud",
        "homeTenantId": "a0abba16-6e89-470b-ab6b-xxx",
        "id": "089fc2ec-4266-456e-b9b1-xxx",
        "isDefault": true,
        "managedByTenants": [],
        "name": "종량제",
        "state": "Enabled",
        "tenantId": "a0abba16-6e89-470b-ab6b-xxx",
        "user": {
          "name": "hhd2002@hotmail.com",
          "type": "user"
        }
      }
    ]
    ```
- Deploy to Azure Function.
    ```shell script
    (base) PS C:\project\HhdAzureFunctionWebSite> func azure functionapp publish hhdazurefunctionwebsite
    Getting site publishing info...
    Creating archive for current directory...
    Uploading 2.14 MB [###############################################################################]
    Upload completed successfully.
    Deployment completed successfully.
    Syncing triggers...
    Syncing triggers...
    Syncing triggers...
    Syncing triggers...
    Syncing triggers...
    Syncing triggers...
    Error calling sync triggers (NotFound). Request ID = '0f3031c2-5b19-4ec4-9c8a-xxx'.
    ```
- Check deployment.
    - https://hhdazurefunctionwebsite.azurewebsites.net/

<br/>
<br/>
<br/>

## Detailed code explanation

### Create Azure Function node.js empty project

- For the first time, you can create and start Azure Function basic code through `func init`.
    - worker:node, language:javascript를 선택함.
    - Since Azure Function is an MS technology, C# seems to be the best, but there was no big problem until the end even with node.js, and it worked well on Linux.
    ```shell script
    PS C:\project> func init HhdAzureFunctionWebSite
    Use the up/down arrow keys to select a worker runtime:node
    Use the up/down arrow keys to select a language:javascript
    Writing package.json
    .gitignore already exists. Skipped!
    Writing host.json
    Writing local.settings.json
    Writing C:\project\HhdAzureFunctionWebSite\.vscode\extensions.json
    ```

- After creation, execute `func start` to run the local web server and check if the project is well created.
    - Request `http://localhost:7071/` 
    - ![image](https://user-images.githubusercontent.com/5696570/104542850-a2ed1a00-5667-11eb-9425-8104b1927bf1.png)
  
- reference : https://docs.microsoft.com/ko-kr/azure/azure-functions/functions-run-local
- reference : https://docs.microsoft.com/ko-kr/azure/azure-functions/create-first-function-cli-node

<br/>
<br/>
<br/>

### Create new function
- Now we will create a function in node.js.
    - If you create a web server in node.js, you will use express almost like a standard, but you cannot use it in Azure Function.
    - If you think about it well, Azure Function is not a standalone web server, but serverless, so you can't put a daemon-like standalone process inside the web server code. 
    - If there is a request, all codes should be written in a structure that returns the result after performing the operation in the shortest time, so standalone middleware such as express is not suitable for its structure.
    - The important role of this sample code and this article is to provide a guide that can be used without lacking in functionality just by configuring `Azure Function + node.js` without using express.
- We will create 2 functions in the project. 
    - func_api : A function that handles various REST API requests such as register, login, and me.
    - func_static : A function that handles static file requests such as /index.html, /home.html, /my.css.

```shell script
(base) PS C:\project\HhdAzureFunctionWebSite> func new --name func_api --template "HTTP trigger" --authlevel "anonymous"
Use the up/down arrow keys to select a template:HTTP trigger
Function name: [HttpTrigger] Writing C:\project\HhdAzureFunctionWebSite\func_api\index.js
Writing C:\project\HhdAzureFunctionWebSite\func_api\function.json
The function "func_api" was created successfully from the "HTTP trigger" template.

(base) PS C:\project\HhdAzureFunctionWebSite> func new --name func_static --template "HTTP trigger" --authlevel "anonymous"
Use the up/down arrow keys to select a template:HTTP trigger
Function name: [HttpTrigger] Writing C:\project\HhdAzureFunctionWebSite\func_static\index.js
Writing C:\project\HhdAzureFunctionWebSite\func_static\function.json
The function "func_static" was created successfully from the "HTTP trigger" template.
```

- reference : https://docs.microsoft.com/ko-kr/azure/azure-functions/create-first-function-cli-csharp

<br/>
<br/>
<br/>

### About design
- The function should make three simple things
    - register : /api/register?id={}&pw={}&name={}&phone_number={}&email={}
    - login : /api/login?id={}&pw={}
    - check my user information : /api/me?session_key={}
- In the DB, only the user table exists.
    - user
        - id
        - pw
        - name
        - phone_number
        - email
        - session_key
- The front page consists of three screens.
    - first page & login : /index.html
    - login : /register.html
    - check my user information : /home.html

<br/>
<br/>
<br/>

### Create proxy file
- Necessity
    - REST API (`/api/me` ...) is handled by `func_api`,
    - Static file requests should be handled by `func_static`.
    - To do this, you need a branching function according to a request at the front of the web server, and you can create and process `proxies.json`.

- `/proxies.json`
    ```json
    {
      "$schema": "http://json.schemastore.org/proxies",
      "proxies": {
        "static_rule": {
          "matchCondition": {
            "route": "/{*restOfPath}"
          },
          "backendUri": "https://localhost/api/func_static?file_path={restOfPath}"
        },
        "api_rule": {
          "matchCondition": {
            "route": "/api/{*restOfPath}"
          },
          "backendUri": "https://localhost/api/{restOfPath}"
        }
      }
    }
    ```    

<br/>
<br/>
<br/>

### node.js utility
- As I mentioned above, in order to easily use Promise and async/await, and to reuse them, asynchronous functions that are often used are converted like synchronous functions (async function conversion) and made into utilities.
- `/util/my_node_util.js`
    ```javascript
    "use strict";
    const fs = require('fs');
    const util = require('util');
    const uuid = require("uuid");
    
    // fs.readFile is an asynchronous function, and can be converted to async function through util.promisify.
    module.exports.fs_read_file_async = util.promisify(fs.readFile);
    
    // Utility function to answer the calculated result in json
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
    
    ...
    ```
- `/util/azure_storage_util.js`
    - Implementing the Azure Storage Table Service table creation, item insertion/deletion/change/retrieval function with async function using Promise
    ```javascript
    // https://docs.microsoft.com/ko-kr/azure/cosmos-db/table-storage-how-to-use-nodejs
    "use strict";
    const path = require('path');
    const azure_storage = require('azure-storage');
    const mnu = require("./my_node_util")
  
    let _table_svc
    async function _get_table_svc_async() { 
    
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
                    resolve(result);
                }
            });
        });
    }
    
    module.exports.upsert_async = function (table_name, row_key, item) {
    module.exports.query_entities_async = function (table_name, filter_col, filter_op, filter_value, select_col_list, res_num) {
    module.exports.is_table_exist_async = function (table_name) {
    ```

<br/>
<br/>
<br/>

### front-end utility
- Like the utility of node.js, asynchronous functions are made utility with async functions.
    - `/static/util/my_web_util.js`
    ```javascript
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
    
    ...
    }
    ``` 

<br/>
<br/>
<br/>

### func_static
- All files in `/static/*` read the file and respond when requesting a static file with `/*`.
    - Hosts *.html, *.js, *.css files that make up the front end.
    - It is an implementation that hardly ever changes, so it can be used in other projects. 
- `/func_static/index.js`
    ```javascript
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
            // Asynchronous functions can be used easily and simply without implementing a callback.
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
    ```  

<br/>
<br/>
<br/>

### func_api
- `/api/register`, `/api/login`, `/api/me` 요청에 대한 구현.
- `/func_api/index.js`
    ```javascript
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
        // Create a new user and upsert.
        // Information is updated if there is an existing user.
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
    
        // A new session key is generated every time you log in.
        let session_key = mnu.create_uuid();
        user["session_key"] = session_key;
    
        await asu.upsert_async("user", id, user);
    
        // If login is successful, it will be redirected with the session key created in /home.html.
        mnu.context_res_done(context, 200, {
            redirect_url: `/home.html?session_key=${session_key}`,
            user: user
        });
    }
    
    async function _me_async(context) {
        // User information is retrieved by acquiring the session key from the current url.
        let session_key = context.req.query.session_key;
        let me;
        let user_list = await asu.query_entities_async("user", "session_key", "eq", session_key);
        if (user_list.length === 0) {
            // If user information is not viewed, login is canceled due to fraudulent request and redirected to /index.html.
            mnu.context_res_done(context, 200, {
                redirect_url: `/`
            });
            return;
        } else {
            me = user_list[0];
        }
    
        mnu.context_res_done(context, 200, me);
    }
    ```
  
<br/>
<br/>
<br/>
  
### front-end
- The front-end codes are not difficult and are similar, so take a look at my information inquiry page `/static/home.html` as a representative.

```html
<head>
    <script src="/util/my_web_util.js"></script>
    <script>
        $(async function () {
            let session_key = mwu.get_query_param_value(location.search, "session_key");
            let url = `/api/func_api?cmd=me&session_key=${session_key}`;
            // Also, the code is neat as it is processed synchronously using the async function.
            let res = await mwu.fetch_async(url);
            alert(JSON.stringify(res, null, 2));

            // In case of abnormal user access, login is unlocked and redirected to /index.html.
            if (res["redirect_url"] !== undefined) {
                window.location.href = res["redirect_url"];
                return;
            }

            $("#pre_user").text(JSON.stringify(res, null, 2));
        });
``` 