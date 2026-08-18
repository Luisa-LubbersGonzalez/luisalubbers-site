const http = require('http');
const url = require('url');

function escapeHtml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function sendEchoResponse(res, method, data) {
    let html = '<!DOCTYPE html><html><body>';
    html += '<p><b>Method used:</b> ' + method + '</p>';
    html += '<p><b>Received data:</b></p><ul>';
    for (const key in data) {
        html += '<li>' + escapeHtml(key) + ' = ' + escapeHtml(data[key]) + '</li>';
    }
    html += '</ul></body></html>';
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    if (pathname === '/hello-world-NodeJS') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<!DOCTYPE html><html><head><title>Hello World</title></head><body><h1 align="center">Greetings HTML World!</h1><p>Hello World!</p><p>This page was generated with Node.js</p><p>This program was generated at: ' + new Date().toISOString() + '</p><p>Your IP Address is: ' + (req.headers['x-forwarded-for'] || req.socket.remoteAddress) + '</p></body></html>');
    }
    else if (pathname === '/hello-json-NodeJS') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            title: 'Hello JSON!',
            heading: 'Hello, JSON!',
            message: 'This page was generated with Node.js',
            time: new Date().toISOString(),
            IP: req.headers['x-forwarded-for'] || req.socket.remoteAddress
        }));
    }
    else if (pathname === '/environment-NodeJS') {
        let html = '<!DOCTYPE html><html><head><title>Environment Variables</title></head><body>';
        html += '<h1 align="center">Environment Variables</h1>';

        html += '<p><b>Request Method:</b> ' + req.method + '</p>';
        html += '<p><b>Request URL:</b> ' + req.url + '</p>';
        html += '<p><b>HTTP Version:</b> ' + req.httpVersion + '</p>';
        html += '<p><b>IP Address:</b> ' + (req.headers['x-forwarded-for'] || req.socket.remoteAddress) + '</p>';

        html += '<hr><h3>Request Headers:</h3>';
        for (const key in req.headers) {
            html += '<b>' + key + ':</b> ' + req.headers[key] + '<br/>';
        }

        html += '<hr><h3>Node.js Runtime Info:</h3>';
        html += '<p>Node.js Version: ' + process.version + '</p>';
        html += '<p>OS Platform: ' + process.platform + '</p>';
        html += '<p>OS Architecture: ' + process.arch + '</p>';

        html += '</body></html>';
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
    }
    else if (pathname === '/echo-NodeJS') {
        const method = req.method;

        if (method === 'GET') {
            const query = parsedUrl.query;
            sendEchoResponse(res, method, query);
        }
        else {
            let body = '';

            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', () => {
                const contentType = req.headers['content-type'] || '';
                let data;

                if (contentType.includes('application/json')) {
                    data = JSON.parse(body);
                } else {
                    const parsedBody = new url.URLSearchParams(body);
                    data = {};
                    for (const [key, value] of parsedBody) {
                        data[key] = value;
                    }
                }
                sendEchoResponse(res, method, data);
            });
        }
    }
    else { 
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
    }
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});