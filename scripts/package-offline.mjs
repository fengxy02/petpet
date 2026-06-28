import childProcess from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import url from "node:url";

const root = process.cwd();
const releaseRoot = path.join(root, "release");
const packageDir = path.join(releaseRoot, "petpet-offline");
const gameDir = path.join(packageDir, "petpet");
const zipPath = path.join(releaseRoot, "petpet-offline.zip");

const launcherBat = `@echo off
setlocal
for %%I in ("%~f0") do set "LAUNCH_DIR=%%~dpI"
cd /d "%LAUNCH_DIR%"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%LAUNCH_DIR%start-petpet.ps1"
if errorlevel 1 (
  echo.
  echo Failed to start petpet.
  echo Please keep this folder extracted, then run this file again.
  echo Online URL: https://fengxy02.github.io/petpet/
  echo.
  pause
)
`;

const launcherPs1 = `$ErrorActionPreference = "Stop"
$Root = $PSScriptRoot
$StartPort = 8787
$Ip = [System.Net.IPAddress]::Parse("127.0.0.1")

$MimeTypes = @{
  ".html" = "text/html; charset=utf-8"
  ".js" = "text/javascript; charset=utf-8"
  ".css" = "text/css; charset=utf-8"
  ".png" = "image/png"
  ".jpg" = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".svg" = "image/svg+xml; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".ico" = "image/x-icon"
  ".txt" = "text/plain; charset=utf-8"
}

function Test-FreePort([int]$Port) {
  $Probe = $null
  try {
    $Probe = [System.Net.Sockets.TcpListener]::new($Ip, $Port)
    $Probe.Start()
    return $true
  } catch {
    return $false
  } finally {
    if ($Probe) { $Probe.Stop() }
  }
}

function Find-FreePort([int]$Port) {
  while (-not (Test-FreePort $Port)) {
    $Port += 1
  }
  return $Port
}

function Write-Response($Stream, [int]$Status, [string]$Reason, [byte[]]$Body, [string]$ContentType) {
  $Header = "HTTP/1.1 $Status $Reason\`r\`nContent-Type: $ContentType\`r\`nContent-Length: $($Body.Length)\`r\`nConnection: close\`r\`n\`r\`n"
  $HeaderBytes = [System.Text.Encoding]::ASCII.GetBytes($Header)
  $Stream.Write($HeaderBytes, 0, $HeaderBytes.Length)
  if ($Body.Length -gt 0) {
    $Stream.Write($Body, 0, $Body.Length)
  }
}

function Write-Redirect($Stream, [string]$Location) {
  $Header = "HTTP/1.1 302 Found\`r\`nLocation: $Location\`r\`nContent-Length: 0\`r\`nConnection: close\`r\`n\`r\`n"
  $HeaderBytes = [System.Text.Encoding]::ASCII.GetBytes($Header)
  $Stream.Write($HeaderBytes, 0, $HeaderBytes.Length)
}

function Resolve-RequestPath([string]$UrlPath) {
  if ($UrlPath -eq "/") {
    return $null
  }
  $CleanPath = [System.Uri]::UnescapeDataString(($UrlPath -split "\\?")[0])
  $RelativePath = $CleanPath.TrimStart("/").Replace("/", [System.IO.Path]::DirectorySeparatorChar)
  $FullPath = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($Root, $RelativePath))
  $RootFullPath = [System.IO.Path]::GetFullPath($Root)
  if (-not $FullPath.StartsWith($RootFullPath, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Forbidden path"
  }
  if ([System.IO.Directory]::Exists($FullPath)) {
    return [System.IO.Path]::Combine($FullPath, "index.html")
  }
  return $FullPath
}

$Port = Find-FreePort $StartPort
$Listener = [System.Net.Sockets.TcpListener]::new($Ip, $Port)
$Listener.Start()
$GameUrl = "http://127.0.0.1:$Port/petpet/"

Write-Host ""
Write-Host "petpet started:"
Write-Host $GameUrl
Write-Host ""
Write-Host "Keep this window open while playing. Close it to stop."
Start-Process $GameUrl

while ($true) {
  $Client = $Listener.AcceptTcpClient()
  try {
    $Stream = $Client.GetStream()
    $Buffer = New-Object byte[] 8192
    $Read = $Stream.Read($Buffer, 0, $Buffer.Length)
    if ($Read -le 0) {
      continue
    }
    $Request = [System.Text.Encoding]::ASCII.GetString($Buffer, 0, $Read)
    $FirstLine = ($Request -split "\`r?\`n")[0]
    $Parts = $FirstLine -split " "
    if ($Parts.Length -lt 2) {
      $Body = [System.Text.Encoding]::UTF8.GetBytes("Bad request")
      Write-Response $Stream 400 "Bad Request" $Body "text/plain; charset=utf-8"
      continue
    }
    if ($Parts[1] -eq "/") {
      Write-Redirect $Stream "/petpet/"
      continue
    }
    try {
      $FilePath = Resolve-RequestPath $Parts[1]
      if ($null -eq $FilePath -or -not [System.IO.File]::Exists($FilePath)) {
        $Body = [System.Text.Encoding]::UTF8.GetBytes("Not found")
        Write-Response $Stream 404 "Not Found" $Body "text/plain; charset=utf-8"
        continue
      }
      $Bytes = [System.IO.File]::ReadAllBytes($FilePath)
      $Ext = [System.IO.Path]::GetExtension($FilePath).ToLowerInvariant()
      $ContentType = $MimeTypes[$Ext]
      if (-not $ContentType) {
        $ContentType = "application/octet-stream"
      }
      Write-Response $Stream 200 "OK" $Bytes $ContentType
    } catch {
      $Body = [System.Text.Encoding]::UTF8.GetBytes("Forbidden")
      Write-Response $Stream 403 "Forbidden" $Body "text/plain; charset=utf-8"
    }
  } finally {
    $Client.Close()
  }
}
`;

const serverSource = `const fs = require("fs");
const http = require("http");
const net = require("net");
const path = require("path");
const childProcess = require("child_process");

const root = __dirname;
const startPort = 8787;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8"
};

function findPort(port) {
  return new Promise((resolve) => {
    const tester = net.createServer();
    tester.once("error", () => resolve(findPort(port + 1)));
    tester.once("listening", () => {
      tester.close(() => resolve(port));
    });
    tester.listen(port, "127.0.0.1");
  });
}

function openBrowser(targetUrl) {
  if (process.platform === "win32") {
    childProcess.exec('start "" "' + targetUrl + '"');
    return;
  }
  if (process.platform === "darwin") {
    childProcess.exec('open "' + targetUrl + '"');
    return;
  }
  childProcess.exec('xdg-open "' + targetUrl + '"');
}

function sendFile(response, filePath) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }
    response.writeHead(200, { "Content-Type": mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream" });
    response.end(data);
  });
}

findPort(startPort).then((port) => {
  const server = http.createServer((request, response) => {
    const parsed = new URL(request.url || "/", "http://127.0.0.1:" + port);
    if (parsed.pathname === "/") {
      response.writeHead(302, { Location: "/petpet/" });
      response.end();
      return;
    }

    const decoded = decodeURIComponent(parsed.pathname);
    const cleanPath = path.normalize(decoded).replace(/^([\\\\/])+/, "");
    const filePath = path.join(root, cleanPath);
    if (!filePath.startsWith(root)) {
      response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Forbidden");
      return;
    }

    fs.stat(filePath, (error, stat) => {
      if (error) {
        response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("Not found");
        return;
      }
      if (stat.isDirectory()) {
        sendFile(response, path.join(filePath, "index.html"));
        return;
      }
      sendFile(response, filePath);
    });
  });

  server.listen(port, "127.0.0.1", () => {
    const targetUrl = "http://127.0.0.1:" + port + "/petpet/";
    console.log("petpet 已启动：" + targetUrl);
    console.log("关闭这个窗口即可停止游戏服务。");
    openBrowser(targetUrl);
  });
});
`;

const readme = `petpet offline package

How to play:
1. Extract this zip first.
2. Double-click "Launch petpet.bat".
3. The browser will open automatically.
4. Keep the startup window open while playing. Close it to stop the local game server.

Online URL:
https://fengxy02.github.io/petpet/
`;

function copyDir(source, target) {
  fs.mkdirSync(target, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);
    if (entry.isDirectory()) {
      copyDir(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

function ensureBuildExists() {
  const indexPath = path.join(root, "dist", "index.html");
  if (!fs.existsSync(indexPath)) {
    throw new Error("dist/index.html not found. Run npm run build before packaging.");
  }
}

function zipPackage() {
  if (os.platform() !== "win32") return;
  fs.rmSync(zipPath, { force: true });
  const command = [
    "$ErrorActionPreference = 'Stop'",
    `$source = '${packageDir.replaceAll("'", "''")}\\*'`,
    `$target = '${zipPath.replaceAll("'", "''")}'`,
    "Compress-Archive -Path $source -DestinationPath $target -Force"
  ].join("; ");
  childProcess.execFileSync("powershell.exe", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", command], { stdio: "inherit" });
}

ensureBuildExists();
fs.rmSync(packageDir, { recursive: true, force: true });
fs.mkdirSync(packageDir, { recursive: true });
copyDir(path.join(root, "dist"), gameDir);
fs.writeFileSync(path.join(packageDir, "server.cjs"), serverSource, "utf8");
fs.writeFileSync(path.join(packageDir, "start-petpet.ps1"), launcherPs1.replace(/\n/g, "\r\n"), "utf8");
fs.writeFileSync(path.join(packageDir, "启动游戏.bat"), launcherBat.replace(/\n/g, "\r\n"), "ascii");
fs.writeFileSync(path.join(packageDir, "Launch petpet.bat"), launcherBat.replace(/\n/g, "\r\n"), "ascii");
fs.writeFileSync(path.join(packageDir, "README_开始游戏.txt"), readme, "utf8");
zipPackage();

console.log(`Offline package folder: ${packageDir}`);
if (fs.existsSync(zipPath)) console.log(`Offline package zip: ${zipPath}`);
