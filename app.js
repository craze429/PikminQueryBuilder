// app.js
const express = require('express');
const path = require('path');
const https = require('https'); // 引入 https 模組
const fs = require('fs');     // 引入 fs 模組來讀取憑證檔案

const app = express();
const httpPort = 3000; // 你可以選擇任何未被佔用的埠號給 HTTP (如果需要)
const httpsPort = 3443; // 常用的 HTTPS 埠號

// 設定 Express 來提供靜態檔案
// 'public' 是你存放 HTML, CSS, JS, 圖片等檔案的資料夾名稱
app.use(express.static(path.join(__dirname, 'public')));

// 由於 index.html 位於 public/pikmin/index.html
// 當使用者訪問根路徑 '/' 時，將其重定向到 '/pikmin/'
app.get('/', (req, res) => {
    res.redirect('/pikmin/');
});

// --- HTTPS 設定 ---
// 確保你有 server.key 和 server.crt 檔案在專案根目錄下
// 如果檔案在其他位置，請相應地修改路徑
let options;
try {
    options = {
        key: fs.readFileSync(path.join(__dirname, 'server.key')), // 你的私鑰
        cert: fs.readFileSync(path.join(__dirname, 'server.crt')) // 你的憑證
    };
} catch (error) {
    console.error('錯誤：找不到 SSL 憑證檔案 (server.key 和 server.crt)。');
    console.error('請執行以下指令產生憑證：');
    console.error('  npm run generate-certs');
    process.exit(1); // 找不到憑證則退出
}

// 安全性 Headers
app.use((_req, res, next) => {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'no-referrer');
    next();
});

// 建立 HTTPS 伺服器
const httpsServer = https.createServer(options, app);

httpsServer.listen(httpsPort, () => {
    console.log(`HTTPS 伺服器正在 https://localhost:${httpsPort} 上運行`);
    console.log('請在瀏覽器中開啟此網址。');
    console.log(`你的靜態檔案在 ${path.join(__dirname, 'public')} 資料夾中。`);
    console.log('注意：如果使用自簽名憑證，瀏覽器可能會顯示安全警告。');
});

// 你也可以選擇保留 HTTP 伺服器，例如用於將 HTTP 重定向到 HTTPS
// app.listen(httpPort, () => {
//     console.log(`HTTP 伺服器正在 http://localhost:${httpPort} 上運行 (建議重定向到 HTTPS)`);
// });

// 如果你想將所有 HTTP 請求重定向到 HTTPS，可以這樣做 (需要額外引入 http 模組):

const http = require('http');
const httpServer = http.createServer((req, res) => {
    const host = req.headers.host.split(':')[0];
    const redirectTo = `https://${host}:${httpsPort}${req.url}`;
    res.writeHead(301, { "Location": redirectTo });
    res.end();
});
httpServer.listen(httpPort, () => {
    console.log(`HTTP 伺服器正在 http://localhost:${httpPort} 上運行，並將所有請求重定向到 HTTPS (https://localhost:${httpsPort})`);
});
