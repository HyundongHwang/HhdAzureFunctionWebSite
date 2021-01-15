# HhdAzureFunctionWebSite

## 소개

- 웹서버와 DB를 사용한 간단한(회원가입, 로그인, 개인정보조회...) 등이 되는 간단한 웹사이트, 그 스켈레톤 코드
- 구성
    - 웹서버 : Azure Function HTTP Trigger 
    - DB : Azure Storage Table Service
    - 웹서버 기술 : node.js
    - 프론트엔드 기술 : HTML, javascript, CSS, jQuery, BootStrap

## 고민 & 해결방안
## 데모
## 실행 테스트
## 상세 구현 소개



HhdAzureFunctionWebSite

## func node 웹사이트 처음 생성

- https://docs.microsoft.com/ko-kr/azure/azure-functions/functions-run-local
- https://docs.microsoft.com/ko-kr/azure/azure-functions/create-first-function-cli-node


```
PS C:\project> func init HhdAzureFunctionWebSite
Use the up/down arrow keys to select a worker runtime:node
Use the up/down arrow keys to select a language:javascript
Writing package.json
.gitignore already exists. Skipped!
Writing host.json
Writing local.settings.json
Writing C:\project\HhdAzureFunctionWebSite\.vscode\extensions.json
```

```
(base) PS C:\project\HhdAzureFunctionWebSite> func start
Azure Functions Core Tools (3.0.2931 Commit hash: d552c6741a37422684f0efab41d541ebad2b2bd2)
Function Runtime Version: 3.0.14492.0
[2021-01-14T03:47:12.199] File 'C:\Program Files\dotnet\dotnet.exe' is not found, 'dotnet' invocation will rely on the PATH environment variable.
[2021-01-14T03:47:13.932] No job functions found. Try making your job classes and methods public. If you're using binding extensions (e.g. Azure Storage, ServiceBus, Timers, etc.) make sure you've called the registrati
on method for the extension(s) in your startup code (e.g. builder.AddAzureStorage(), builder.AddServiceBus(), builder.AddTimers(), etc.).
Hosting environment: Production
Content root path: C:\project\HhdAzureFunctionWebSite
Now listening on: http://0.0.0.0:7071
Application started. Press Ctrl+C to shut down.
For detailed output, run func with --verbose flag.
[2021-01-14T03:48:58.967] Worker process started and initialized.
```

- http://localhost:7071/ 요청
![image](https://user-images.githubusercontent.com/5696570/104542850-a2ed1a00-5667-11eb-9425-8104b1927bf1.png)



## 첫함수 만들기


- https://docs.microsoft.com/ko-kr/azure/azure-functions/create-first-function-cli-csharp


```
(base) PS C:\project\HhdAzureFunctionWebSite> func --version
3.0.2931
(base) PS C:\project\HhdAzureFunctionWebSite> az --version
azure-cli                         2.17.1
core                              2.17.1
telemetry                          1.0.6
```

- 함수 만들기
```
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

- 필요한 종속성 설치하기
```
npm install --save mime-types
npm install --save node-fetch
```

- 테스트
    - http://localhost:7071/
    - http://localhost:7071/api/func_api?cmd=hhd
    
- WebStorm에서 디버깅 설정
    - `local.settings.json` 편집
    ```
    {
      "Values": {
        "languageWorkers:node:arguments": "--inspect=5858"
    ```
    - 디버그 설정 추가
    ![image](https://user-images.githubusercontent.com/5696570/104556574-341dba00-5683-11eb-9383-e4cd6dc2d5a2.png)
    
 
 ## azure storage객체와 연동    
- azure에 function객체 storage객체 생성
    - https://portal.azure.com/#create/hub
    - function객체 생성
    ![image](https://user-images.githubusercontent.com/5696570/104558149-ae4f3e00-5685-11eb-92c9-81a61fa9fd7b.png)
    ![image](https://user-images.githubusercontent.com/5696570/104558434-2158b480-5686-11eb-843f-0e1b8cf08e78.png)
    - storage객체 생성
    ![image](https://user-images.githubusercontent.com/5696570/104558536-4ea56280-5686-11eb-8b82-6247124fed2e.png)
    ![image](https://user-images.githubusercontent.com/5696570/104558734-9cba6600-5686-11eb-9986-3ecbbe5374c1.png)
    
- storage객체 키획득
    ![image](https://user-images.githubusercontent.com/5696570/104559033-210ce900-5687-11eb-8429-b17bef32e3b5.png)

- https://docs.microsoft.com/ko-kr/azure/cosmos-db/table-storage-how-to-use-nodejs

- 필요한 종속성 설치하기
```
npm install --save azure-storage
```

- 테스트
    - http://localhost:7071/
    ![image](https://user-images.githubusercontent.com/5696570/104569993-b9f63100-5694-11eb-9c37-b58745837ed3.png)
    - http://localhost:7071/register.html
    ![image](https://user-images.githubusercontent.com/5696570/104570104-dbefb380-5694-11eb-907b-8cd4858ce420.png)

    
## 로그인 세션보안 구현

## 배포 

```
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

- https://hhdazurefunctionwebsite.azurewebsites.net/