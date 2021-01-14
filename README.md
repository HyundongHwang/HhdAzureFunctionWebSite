# HhdAzureFunctionWebSite
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