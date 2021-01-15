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

## Introduction

- 웹서버와 DB를 사용한 간단한(회원가입, 로그인, 개인정보조회...) 등이 되는 간단한 웹사이트, 그 스켈레톤 코드
- 구성
    - 웹서버 : Azure Function HTTP Trigger 
    - DB : Azure Storage Table Service
    - 웹서버 기술 : node.js
    - 프론트엔드 기술 : HTML, javascript, CSS, jQuery, BootStrap
    - IDE : WebStorm

## Worries & Solutions

- 매우 간단한 웹사이트의 스켈레톤 코드 필요
    - 이번 프로젝트 개발로 스켈레톤 샘플코드와 바닥부터 배포까지 필요한 문서 정리
- 웹사이트 운영비용 고민
    - Azure Function HTTP Trigger는 서버리스방식이라 요청횟수를 기준으로 과금하므로
    - Azure에서 가장작은 웹서버 리소스(1만원/월 정도)보다도 적게 과금함.
    - 운영초기에는 거의 0원에 가까운 과금.
- DB 운영비용 고민
    - Azure Storage Table Service는 NoSQL 방식의 DB로 기본사용료가 없으며
    - 운영초기에는 거의 0원에 가까운 과금.
    - Azure SQL SERVER를 사용하면 가장 작은 리소스라도 (1만원/월 정도)는 발생함.
- 웹서버 스케일링 고민
    - Azure Function HTTP Trigger는 서버리스방식이라 기본적으로 트래픽에 따른 스케일링 고민없음.
- DB 스케일링 고민
    - Azure Storage Table Service는 용량제한이 없고, 오히려 데이타 용량이 많아질수록 더 가격효율적임.
- DB 설계, 관리고민
    - Azure Storage Table Service는 NoSQL 방식이라 RDBMS방식과 달리 스키마가 별도로 지정되지 않으며,
    - 테이블이름, RowKey 만을 이용하여 비교적 간단히 설계하고,
    - 간단한 filter식을 이용해서 쿼리하여 사용/관리
- 백엔드/프론트엔드에 사용되는 다양한 기술들 고민
    - 어쩔수 없이 프론트엔드에는 Javascript가 사용되기 때문에 백엔드도 node.js를 사용해서 기술종류를 단순하게 유지.
- Javascript의 콜백지옥 고민
    - Javascript ES2017버전의 Promise, async/await 사용으로 콜백지옥 해결.
    - 자주사용하는 비동기 HTTP 요청, 비동기 DB 쿼리/관리 작업들은 모두 Promise, async/await 를 사용하여 쉬운 동기함수처럼 변환함.
    - 관련코드들을 재사용 가능하게 유틸리티로 만들어둠.   
- 편리한 디버깅, 강력한 리펙토링 고민
    - VsCode, Sublime 같은 단순 텍스트 편집기 대신, WebStorm 사용으로 편리한 디버깅, 강력한 리펙토링.
    - Azure Function HTTP Trigger의 공식문서들은 VsCode를 기본으로 가이드하지만,
    - VsCode의 Azure Function 플러그인 문제로 소스코드를 편집하면 디버깅세션이 끊어지고, 새로 시작되는데 이 시간이 엄청 길다.
    - VsCode의 Azure Function 플러그인을 아예 사용하지 않고 명령행에서 func를 시작해서 WebStorm으로 디버깅하면 소스코드 편집과 디버깅을 중단없이 계속 할 수 있음.
    - WebStorm으로 Azure Function 디버깅 하는 설정이 비교적 단순한데 공식문서에는 소개되지 않아서 아래글에서 쉽게 소개한다.
- 개발과정, 설정세부사항 기록에 대한 고민
    - 개발과정, 설정세부사항을 대부분 명령행에서 진행.
    - 명령행에서 진행하면 결과메시지가 자세해서 오류찾기도 쉽고, 과정을 기록하기도 용이함.
    - 이 스켈레톤 샘플코드는 전부 Windows, Linux에서 사용가능한데, 특히 전과정을 명령행에서 진행하면 Linux에서 진행하기 용이함.
    - az(Azure 관리), func(Azure Function 관리), npm(node.js 관리) 등 명령행 도구들이 잘 준비되어 있음.

## DEMO

- https://hhdazurefunctionwebsite.azurewebsites.net/
- 기능
    - 회원가입 
    - 로그인
    - 회원정보확인
- ![demo](https://user-images.githubusercontent.com/5696570/104704182-ab268180-575b-11eb-90ae-d1cf5f8360fd.gif) 
    
## How to run

### 1. git clone
- 이 리파지토리의 소스코드를 clone 하고 시작함.
```shell script
PS C:\project> git clone git@github.com:HyundongHwang/HhdAzureFunctionWebSite.git
```

### 2. Create Azure Function
- 웹서버 역할을 할 Azure Function 새 객체를 생성함.
- https://portal.azure.com/#create/hub 에서 Azure Function 을 새로 생성함.
- 당연하지만 `hhdazurefunctionwebsite` 는 필자가 이미 사용해서 독자들은 다른이름을 사용해야 함.
- ![image](https://user-images.githubusercontent.com/5696570/104558149-ae4f3e00-5685-11eb-92c9-81a61fa9fd7b.png)
- ![image](https://user-images.githubusercontent.com/5696570/104558434-2158b480-5686-11eb-843f-0e1b8cf08e78.png)


### 3. Create Azure Storage Service
- DB 역할을 할 Azure Storage Service 새 객체를 생성함.
- https://portal.azure.com/#create/hub 에서 Azure Storage Service 을 새로 생성함.
- 당연하지만 `hhdazurefunctionwebsite` 는 필자가 이미 사용해서 독자들은 다른이름을 사용해야 함.
- ![image](https://user-images.githubusercontent.com/5696570/104558536-4ea56280-5686-11eb-8b82-6247124fed2e.png)
- ![image](https://user-images.githubusercontent.com/5696570/104558734-9cba6600-5686-11eb-9986-3ecbbe5374c1.png)

### 4. Install node.js
- node.js를 로컬에 설치함.
- https://nodejs.org/ko/download/ 에서 설치함.

```shell script
PS C:\project\HhdAzureFunctionWebSite> node --version
v12.19.0

PS C:\project\HhdAzureFunctionWebSite> npm --version
6.14.8
```

### 5. Install Azure CLI
- Azure에 대한 배포/관리를 로컬 명령행에서 진행할 수 있음. 
- 다운로드 : https://aka.ms/installazurecliwindows
- 참고 : https://docs.microsoft.com/ko-kr/cli/azure/install-azure-cli-windows

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

### 6. Install Azure Function Runtime
- Azure Function 에 대한 관리/실행/디버깅을 로컬 명령행에서 진행할 수 있음.
- 다운로드 : https://go.microsoft.com/fwlink/?linkid=2135274
- 참고 : https://docs.microsoft.com/ko-kr/azure/azure-functions/functions-run-local

```shell script
PS C:\project\HhdAzureFunctionWebSite> func --version
3.0.2931
```

### 7. Create Azure Storage Service's key file
- node.js에서 Azure Storage Service 에 대한 접근을 위한 키 설정.
- Azure Portal에서 위에서 생성한 Azure Storage Service 키를 복사해서 `/.key.json` 파일을 아래와 같이 생성함.
- ![image](https://user-images.githubusercontent.com/5696570/104559033-210ce900-5687-11eb-8429-b17bef32e3b5.png)
- `/.key.json`
    ```json
    {
        "storage_account_name": "hhdazurefunctionwebsite",
        "storage_account_key": "TYTH1IuwZm2xxxxxxxG0j5vrbkfLasxQ=="
    }
    ```
 
### 8. Install node.js's libraries
- `npm install` 로 node.js에서 사용한 외부 라이브러리 한번에 모두 설치
```shell script
PS C:\project\HhdAzureFunctionWebSite> npm install
npm WARN HhdAzureFunctionWebSite No repository field.
npm WARN HhdAzureFunctionWebSite No license field.
added 69 packages from 96 contributors and audited 70 packages in 2.86s
2 packages are looking for funding
  run `npm fund` for details
found 0 vulnerabilities
``` 

### 9. Test in local environment
- `func start` 로 Azure Function Runtime으로 로컬에서 웹서버 실행

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

- 로컬 테스트
      - http://localhost:7071/

### 10. Configure debug environment

- WebStorm 디버깅을 위해 디버깅 포트 설정
    - `local.settings.json` 편집
    ```json
    {
      "Values": {
        "languageWorkers:node:arguments": "--inspect=5858"
    ```
- WebStorm 디버그 설정 추가
    - ![image](https://user-images.githubusercontent.com/5696570/104556574-341dba00-5683-11eb-9383-e4cd6dc2d5a2.png)
- `func start`로 Azure Function Runtime 실행해둔 상태로 WebStrom 디버그(Ctrl+F9) 실행
    - ![image](https://user-images.githubusercontent.com/5696570/104705841-be3a5100-575d-11eb-82ba-4dd8369899ad.png)

### 11. Deploy Azure Function

- 위에서 로컬환경에서 상세히 테스트된 웹사이트를 Azure Function에 배포
- Azure에 로그인
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
- Azure Function 에 배포
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
- 배포결과확인
    - https://hhdazurefunctionwebsite.azurewebsites.net/

## Detailed code explanation

### Create Azure Function node.js empty project

- 가장 처음으로 Azure Function 기초코드를 `func init`을 통해서 생성하고 시작할 수 있음.
    - worker:node, language:javascript를 선택함.
    - Azure Function이 MS기술이라 C#이 가장 무난할 것 같지만, node.js를 사용해도 끝까지 큰 문제가 없고, Linux에서도 잘 동작함.
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

- 생성후 `func start`를 수행하여 로컬 웹서버를 실행하고 프로젝트가 잘 생성되었는지 확인함.
    - http://localhost:7071/ 요청
    - ![image](https://user-images.githubusercontent.com/5696570/104542850-a2ed1a00-5667-11eb-9425-8104b1927bf1.png)
  
- 참고 : https://docs.microsoft.com/ko-kr/azure/azure-functions/functions-run-local
- 참고 : https://docs.microsoft.com/ko-kr/azure/azure-functions/create-first-function-cli-node

### Create new function
- 이제 node.js 에서 함수를 만들것임.
    - node.js에서 웹서버를 만든다면 거의 표준처럼 express를 사용하게 되는데, Azure Function에서는 사용할 수 없음.
    - 잘 생각해보면 당연한게, Azure Function은 독립형 웹서버가 아닌 서버리스라서 웹서버코드 내부에 데몬같은 독립실행되는 프로세스를 둘 수 없으며, 
    - 요청이 있으면 최단시간에 계산후 결과를 리턴하는 구조로만 모든 코드가 작성되야 하기 때문에, express 같은 독립실행형 미들웨어는 구조상 맞지 않음.
    - 이 샘플코드의 중요한 역할중 하나로 express를 쓰지 않고도 `Azure Function + node.js` 구성으로 기능상 부족하지 않게 하는 것임.
- 프로젝트 내의 함수는 2개를 만들것임. 
    - func_api : register, login, me 등 각종 REST API 요청을 처리하는 기능.
    - func_static : /index.html, /home.html, /my.css 등 정적파일요청을 처리하는 기능.

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

- 참고 : https://docs.microsoft.com/ko-kr/azure/azure-functions/create-first-function-cli-csharp

### About design
- 기능은 간단하게 3가지를 만들것
    - 회원가입 : /api/register?id={}&pw={}&name={}&phone_number={}&email={}
    - 로그인 : /api/login?id={}&pw={}
    - 자기정보조회 : /api/me?session_key={}
- DB는 일단 user테이블만 존재함.
    - user
        - id
        - pw
        - name
        - phone_number
        - email
        - session_key
- 프론트페이지는 3화면
    - 첫화면&로그인 : /index.html
    - 회원가입 : /register.html
    - 자기정보조회 : /home.html

### Create proxy file
- 필요성
    - REST API (`/api/me` ...)는 `func_api` 가 처리하고,
    - 정적파일요청은 `func_static` 가 처리해야 함.
    - 이렇게 하기 위해선 웹서버 앞단에서 요청에 따른 분기기능이 필요하고 이를 `proxies.json` 을 생성하여 처리할 수 있음.

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

### node.js utility
- 필자가 상술했듯, Promise, async/await을 쉽게 사용하고 또 이를 재사용 하기 위해 자주 사용하는 비동기기능들을 동기함수처럼 변환(async 함수 변환)해서 유틸리티로 만들었음.
- `/util/my_node_util.js`
    ```javascript
    "use strict";
    const fs = require('fs');
    const util = require('util');
    const uuid = require("uuid");
    
    // fs.readFile은 비동기함수인데 util.promisify 를 통해 async함수로 변환할 수 있음.
    module.exports.fs_read_file_async = util.promisify(fs.readFile);
    
    // 계산된 결과를 json 응답하는 유틸리티 함수
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
    - Promise를 이용하여 Azure Storage Table Service의 테이블 생성, 항목 삽입/삭제/변경/조회 기능을 async함수로 구현
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

### front-end utility
- node.js 의 유틸리티와 마찬가지로 비동기 함수들을 async함수로 유틸리티화 했음.
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

### func_static
- `/static/*` 의 모든 파일들은 `/*` 로 정적파일 요청시 파일을 읽어서 응답하도록 함.
    - 프론트엔드를 구성하는 *.html, *.js, *.css 파일들을 호스팅함.
    - 거의 변경될 일이 없는 구현으로 다른 프로젝트에서도 그대로 써도 무방함. 
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
            // 비동기함수를 콜백구현없이 쉽고 단순하게 사용가능함.
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
        // 새로운 사용자를 생성하여 upsert 함.
        // 기존에 존재하는 사용자라면 정보가 업데이트 됨.
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
    
        // 로그인 할때마다 새로운 세션키가 생성됨.    
        let session_key = mnu.create_uuid();
        user["session_key"] = session_key;
    
        await asu.upsert_async("user", id, user);
    
        // 로그인 성공하면 /home.html로 생성된 세션키와 함께 리다이렉트됨.
        mnu.context_res_done(context, 200, {
            redirect_url: `/home.html?session_key=${session_key}`,
            user: user
        });
    }
    
    async function _me_async(context) {
        // 현재 url에서 세션키를 획득하여 사용자정보를 조회함.
        let session_key = context.req.query.session_key;
        let me;
        let user_list = await asu.query_entities_async("user", "session_key", "eq", session_key);
        if (user_list.length === 0) {
            // 사용자정보가 조회되지 않으면 부정요청으로 로그인이 해제되고 /index.html 로 리다이렉트됨.
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