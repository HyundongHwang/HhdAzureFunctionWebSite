# HhdAzureFunctionWebSite

## 소개

- 웹서버와 DB를 사용한 간단한(회원가입, 로그인, 개인정보조회...) 등이 되는 간단한 웹사이트, 그 스켈레톤 코드
- 구성
    - 웹서버 : Azure Function HTTP Trigger 
    - DB : Azure Storage Table Service
    - 웹서버 기술 : node.js
    - 프론트엔드 기술 : HTML, javascript, CSS, jQuery, BootStrap
    - IDE : WebStorm

## 고민 & 해결방안

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

## 데모

- https://hhdazurefunctionwebsite.azurewebsites.net/
- 기능
    - 회원가입 
    - 로그인
    - 회원정보확인
- ![demo](https://user-images.githubusercontent.com/5696570/104704182-ab268180-575b-11eb-90ae-d1cf5f8360fd.gif) 
    
## 실행 테스트

### 1. git clone
- 이 리파지토리의 소스코드를 clone 하고 시작함.
```
PS C:\project> git clone git@github.com:HyundongHwang/HhdAzureFunctionWebSite.git
```

### 2. Azure Function 생성
- 웹서버 역할을 할 Azure Function 새 객체를 생성함.
- https://portal.azure.com/#create/hub 에서 Azure Function 을 새로 생성함.
- 당연하지만 `hhdazurefunctionwebsite` 는 필자가 이미 사용해서 독자들은 다른이름을 사용해야 함.
- ![image](https://user-images.githubusercontent.com/5696570/104558149-ae4f3e00-5685-11eb-92c9-81a61fa9fd7b.png)
- ![image](https://user-images.githubusercontent.com/5696570/104558434-2158b480-5686-11eb-843f-0e1b8cf08e78.png)


### 3. Azure Storage Service 생성
- DB 역할을 할 Azure Storage Service 새 객체를 생성함.
- https://portal.azure.com/#create/hub 에서 Azure Storage Service 을 새로 생성함.
- 당연하지만 `hhdazurefunctionwebsite` 는 필자가 이미 사용해서 독자들은 다른이름을 사용해야 함.
- ![image](https://user-images.githubusercontent.com/5696570/104558536-4ea56280-5686-11eb-8b82-6247124fed2e.png)
- ![image](https://user-images.githubusercontent.com/5696570/104558734-9cba6600-5686-11eb-9986-3ecbbe5374c1.png)

### 4. node.js 설치
- node.js를 로컬에 설치함.
- https://nodejs.org/ko/download/ 에서 설치함.

```
PS C:\project\HhdAzureFunctionWebSite> node --version
v12.19.0

PS C:\project\HhdAzureFunctionWebSite> npm --version
6.14.8
```

### 5. Azure CLI 설치
- Azure에 대한 배포/관리를 로컬 명령행에서 진행할 수 있음. 
- 다운로드 : https://aka.ms/installazurecliwindows
- 참고 : https://docs.microsoft.com/ko-kr/cli/azure/install-azure-cli-windows

```
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

### 6. Azure Function Runtime 설치
- Azure Function 에 대한 관리/실행/디버깅을 로컬 명령행에서 진행할 수 있음.
- 다운로드 : https://go.microsoft.com/fwlink/?linkid=2135274
- 참고 : https://docs.microsoft.com/ko-kr/azure/azure-functions/functions-run-local

```
PS C:\project\HhdAzureFunctionWebSite> func --version
3.0.2931
```

### 7. Azure Storage Service 키 설정
- node.js에서 Azure Storage Service 에 대한 접근을 위한 키 설정.
- Azure Portal에서 위에서 생성한 Azure Storage Service 키를 복사해서 `/.key.json` 파일을 아래와 같이 생성함.
- ![image](https://user-images.githubusercontent.com/5696570/104559033-210ce900-5687-11eb-8429-b17bef32e3b5.png)
- `/.key.json`
    ```
    {
        "storage_account_name": "hhdazurefunctionwebsite",
        "storage_account_key": "TYTH1IuwZm2xxxxxxxG0j5vrbkfLasxQ=="
    }
    ```
 
### 8. node.js 라이브러리 설치
- `npm install` 로 node.js에서 사용한 외부 라이브러리 한번에 모두 설치
```
PS C:\project\HhdAzureFunctionWebSite> npm install
npm WARN HhdAzureFunctionWebSite No repository field.
npm WARN HhdAzureFunctionWebSite No license field.
added 69 packages from 96 contributors and audited 70 packages in 2.86s
2 packages are looking for funding
  run `npm fund` for details
found 0 vulnerabilities
``` 

### 9. 로컬환경에서 테스트
- `func start` 로 Azure Function Runtime으로 로컬에서 웹서버 실행

```
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

### 10. 디버깅 환경설정

- WebStorm 디버깅을 위해 디버깅 포트 설정
    - `local.settings.json` 편집
    ```
    {
      "Values": {
        "languageWorkers:node:arguments": "--inspect=5858"
    ```
- WebStorm 디버그 설정 추가
    - ![image](https://user-images.githubusercontent.com/5696570/104556574-341dba00-5683-11eb-9383-e4cd6dc2d5a2.png)
- `func start`로 Azure Function Runtime 실행해둔 상태로 WebStrom 디버그(Ctrl+F9) 실행
    - ![image](https://user-images.githubusercontent.com/5696570/104705841-be3a5100-575d-11eb-82ba-4dd8369899ad.png)

### 11. Azure Function 배포

- 위에서 로컬환경에서 상세히 테스트된 웹사이트를 Azure Function에 배포
- Azure에 로그인
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
    ```
- Azure Function 에 배포
    ```
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

## 상세 구현 소개


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

- 테스트
    - http://localhost:7071/
    ![image](https://user-images.githubusercontent.com/5696570/104569993-b9f63100-5694-11eb-9c37-b58745837ed3.png)
    - http://localhost:7071/register.html
    ![image](https://user-images.githubusercontent.com/5696570/104570104-dbefb380-5694-11eb-907b-8cd4858ce420.png)

    
## 로그인 세션보안 구현

## 배포 