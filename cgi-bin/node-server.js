const http = require('http');

const server = http.createServer((req, res) => {
    const url = req.url;

    if (url === '/hello-world-NodeJS') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<!DOCTYPE html><html><head><title>Hello World</title></head><body><h1>Hello World!</h1><p>Generated with Node.js</p></body></html>');
    }
    else if (url === '/hello-json-NodeJS') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            title: 'Hello JSON',
            heading: 'Hello JSON!',
            message: 'Generated with Node.js',
            time: new Date().toISOString(),
            ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
        }));
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
    }
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});