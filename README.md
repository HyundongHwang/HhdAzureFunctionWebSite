# HhdAzureFunctionWebSite
HhdAzureFunctionWebSite

## func node 웹사이트 처음 생성

- https://docs.microsoft.com/ko-kr/azure/azure-functions/functions-reference-node?tabs=v2#environment-variables

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
[2021-01-14T03:47:13.494] File 'C:\Program Files\dotnet\dotnet.exe' is not found, 'dotnet' invocation will rely on the PATH environment variable.
[2021-01-14T03:47:13.875] File 'C:\Program Files\dotnet\dotnet.exe' is not found, 'dotnet' invocation will rely on the PATH environment variable.
[2021-01-14T03:47:13.932] No job functions found. Try making your job classes and methods public. If you're using binding extensions (e.g. Azure Storage, ServiceBus, Timers, etc.) make sure you've called the registrati
on method for the extension(s) in your startup code (e.g. builder.AddAzureStorage(), builder.AddServiceBus(), builder.AddTimers(), etc.).
Hosting environment: Production
Content root path: C:\project\HhdAzureFunctionWebSite
Now listening on: http://0.0.0.0:7071
Application started. Press Ctrl+C to shut down.
For detailed output, run func with --verbose flag.
[2021-01-14T03:48:58.079] File 'C:\Program Files\dotnet\dotnet.exe' is not found, 'dotnet' invocation will rely on the PATH environment variable.
[2021-01-14T03:48:58.326] File 'C:\Program Files\dotnet\dotnet.exe' is not found, 'dotnet' invocation will rely on the PATH environment variable.
[2021-01-14T03:48:58.967] Worker process started and initialized.
```

- http://localhost:7071/ 요청
![image](https://user-images.githubusercontent.com/5696570/104542850-a2ed1a00-5667-11eb-9425-8104b1927bf1.png)