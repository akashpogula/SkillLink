const http = require('http');
const fs = require('fs');
const path = require('path');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

function resolveFilePath(reqUrl) {
  const cleanPath = reqUrl.split('?')[0].split('#')[0];
  
  if (cleanPath === '/' || cleanPath === '') {
    return path.join(process.cwd(), 'index.html');
  }

  // Direct mapping aliases
  if (cleanPath === '/client') {
    return path.join(process.cwd(), 'pages', 'client.html');
  }
  if (cleanPath === '/provider') {
    return path.join(process.cwd(), 'pages', 'provider.html');
  }

  let fullPath = path.join(process.cwd(), cleanPath);

  // If exists directly as a file
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
    return fullPath;
  }

  // Try appending .html (clean URL support)
  if (fs.existsSync(fullPath + '.html') && fs.statSync(fullPath + '.html').isFile()) {
    return fullPath + '.html';
  }

  // Try inside pages/
  const inPages = path.join(process.cwd(), 'pages', cleanPath);
  if (fs.existsSync(inPages) && fs.statSync(inPages).isFile()) {
    return inPages;
  }
  if (fs.existsSync(inPages + '.html') && fs.statSync(inPages + '.html').isFile()) {
    return inPages + '.html';
  }

  return null;
}

function handleRequest(req, res) {
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  const filePath = resolveFilePath(req.url);

  if (!filePath) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<!DOCTYPE html><html><head><title>404 Not Found</title></head><body style="font-family:sans-serif;background:#07090f;color:#fff;text-align:center;padding:10vh;"><h1>Page Not Found</h1><p><a href="/" style="color:#6366f1;">Return to Home</a></p></body></html>');
    return;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Server Error: ' + err.code);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    res.end(content);
  });
}

function startServer(port) {
  const server = http.createServer(handleRequest);
  server.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
  return server;
}

startServer(3000);
startServer(8080);
