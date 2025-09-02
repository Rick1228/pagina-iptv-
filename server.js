const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const server = http.createServer((req, res) => {
  console.log('Request:', req.url);
  
  // Parse URL to remove query parameters
  const parsedUrl = url.parse(req.url);
  let pathname = parsedUrl.pathname;
  
  // Handle root path and serve index.html
  let filePath;
  if (pathname === '/' || pathname === '') {
    filePath = './index.html';
  } else {
    filePath = '.' + pathname;
  }
  
  const extname = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml'
  };
  
  const contentType = mimeTypes[extname] || 'application/octet-stream';
  
  fs.readFile(filePath, (error, content) => {
    if (error) {
      console.log('Error reading file:', filePath, error.code);
      // If file not found and it's not a static asset, serve index.html
      if (error.code === 'ENOENT' && !extname) {
        fs.readFile('./index.html', (htmlError, htmlContent) => {
          if (htmlError) {
            res.writeHead(404);
            res.end('404 Not Found');
          } else {
            console.log('Serving index.html for:', pathname);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(htmlContent, 'utf-8');
          }
        });
      } else {
        res.writeHead(404);
        res.end('404 Not Found');
      }
    } else {
      console.log('Serving file:', filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(8000, () => {
  console.log('Server running at http://localhost:8000');
});