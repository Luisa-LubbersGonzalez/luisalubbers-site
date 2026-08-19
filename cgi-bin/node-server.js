const http = require('http');
const url = require('url');
const crypto = require('crypto');
const fs = require('fs');

function respondWithStatePage(res, sessionFile, sessionId, newSession) {
    let currentUsername = '';
    try {
        currentUsername = fs.readFileSync(sessionFile, 'utf8');
    } catch (err) {}

    const headers = { 'Content-Type': 'text/html' };
    if (newSession) {
        headers['Set-Cookie'] = `NODESESSID=${sessionId}; Path=/`;
    }
    res.writeHead(200, headers);

    res.write('<!DOCTYPE html><html><head><title>Node State Page 1</title></head><body>');
    res.write('<h1>Node State Page 1</h1>');

    if (currentUsername) {
        res.write('<p><b>Name:</b> ' + escapeHtml(currentUsername) + '</p>');
    } else {
        res.write('<p><b>Name:</b> You do not have a name set</p>');
    }

    res.write('<form method="POST" action="/node/state1-node"><label>Name: <input type="text" name="name"></label><button type="submit">Save</button></form>');
    res.write('<br/><a href="/node/state2-node">Go to Page 2</a><br/>');
    res.write('<a href="/node/state-clear-node">Clear Session</a>');
    res.write('</body></html>');
    res.end();
}

function parseCookies(req) {
    const cookieHeader = req.headers['cookie'] || '';
    const cookies = {};
    cookieHeader.split(';').forEach(pair => {
        const [key, value] = pair.trim().split('=');
        if (key) cookies[key] = value;
    });
    return cookies;
}

function escapeHtml(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function sendEchoResponse(res, req, method, data) {
    const hostname = req.headers['host'];
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const datetime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    const userAgent = req.headers['user-agent'];
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<!DOCTYPE html><html><body>');
    res.write('<p>Host name: ' + hostname + '</p>');
    res.write('<p>Time &amp; Date: ' + datetime + '</p>');
    res.write('<p>UserAgent: ' + escapeHtml(userAgent) + '</p>');
    res.write('<p>IP Address: ' + ip + '</p>');
    res.write('<p><b>Method used:</b> ' + method + '</p>');
    res.write('<p><b>Received data:</b></p><ul>');
    for (const key in data) {
        res.write('<li>' + escapeHtml(key) + ' = ' + escapeHtml(data[key]) + '</li>');
    }
    res.write('</ul></body></html>');
    res.end();
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    if (pathname === '/hello-world-NodeJS') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<!DOCTYPE html><html><head><title>Hello World</title></head><body><h1 align="center">Greetings HTML World!</h1><p>Hello World!</p><p>This page was generated with Node.js</p><p>This program was generated at: ' + new Date().toISOString() + '</p><p>Your IP Address is: ' + (req.headers['x-forwarded-for'] || req.socket.remoteAddress) + '</p></body></html>');
        res.end();
    }
    else if (pathname === '/hello-json-NodeJS') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({
            title: 'Hello JSON!',
            heading: 'Hello, JSON!',
            message: 'This page was generated with Node.js',
            time: new Date().toISOString(),
            IP: req.headers['x-forwarded-for'] || req.socket.remoteAddress
        }));
        res.end();
    }
    else if (pathname === '/environment-NodeJS') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<!DOCTYPE html><html><head><title>Environment Variables</title></head><body>');
        res.write('<h1 align="center">Environment Variables</h1>');
        res.write('<p><b>Request Method:</b> ' + req.method + '</p>');
        res.write('<p><b>Request URL:</b> ' + req.url + '</p>');
        res.write('<p><b>HTTP Version:</b> ' + req.httpVersion + '</p>');
        res.write('<p><b>IP Address:</b> ' + (req.headers['x-forwarded-for'] || req.socket.remoteAddress) + '</p>');
        res.write('<hr><h3>Request Headers:</h3>');
        for (const key in req.headers) {
            res.write('<b>' + key + ':</b> ' + req.headers[key] + '<br/>');
        }
        res.write('<hr><h3>Node.js Runtime Info:</h3>');
        res.write('<p>Node.js Version: ' + process.version + '</p>');
        res.write('<p>OS Platform: ' + process.platform + '</p>');
        res.write('<p>OS Architecture: ' + process.arch + '</p>');
        res.write('</body></html>');
        res.end();
    }
    else if (pathname === '/echo-NodeJS') {
        const method = req.method;

        if (method === 'GET') {
            const query = parsedUrl.query;
            sendEchoResponse(res, req, method, query);
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
                sendEchoResponse(res, req, method, data);
            });
        }
    }
    else if (pathname === '/state1-node') {
        const cookies = parseCookies(req);
        let sessionId = cookies['NODESESSID'];
        let newSession = false;

        if (!sessionId) {
            sessionId = crypto.randomUUID();
            newSession = true;
        }

        const sessionFile = `/tmp/nodesession_${sessionId}.txt`;

        if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                const parsedBody = new url.URLSearchParams(body);
                const name = parsedBody.get('name');
                if (name) {
                    fs.writeFileSync(sessionFile, name, 'utf8');
                }
                respondWithStatePage(res, sessionFile, sessionId, newSession);
            });
        }
        else {
            respondWithStatePage(res, sessionFile, sessionId, newSession);
        }
    }
    else if (pathname === '/state2-node') {
        const cookies = parseCookies(req);
        const sessionId = cookies['NODESESSID'];
        let currentName = '';

        if (sessionId) {
            const sessionFile = `/tmp/nodesession_${sessionId}.txt`;
            try {
                currentName = fs.readFileSync(sessionFile, 'utf8');
            } catch (err) {}
        }

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<!DOCTYPE html><html><head><title>Node State Page 2</title></head><body>');
        res.write('<h1>Node State Page 2</h1>');

        if (currentName) {
            res.write('<p><b>Name:</b> ' + escapeHtml(currentName) + '</p>');
        } else {
            res.write('<p><b>Name:</b> You do not have a name set</p>');
        }

        res.write('<br/><a href="/node/state1-node">Go to Page 1</a><br/>');
        res.write('<a href="/node/state-clear-node">Clear Session</a>');
        res.write('</body></html>');
        res.end();
    }
    else if (pathname === '/state-clear-node') {
        const cookies = parseCookies(req);
        const sessionId = cookies['NODESESSID'];

        if (sessionId) {
            const sessionFile = `/tmp/nodesession_${sessionId}.txt`;
            try {
                fs.unlinkSync(sessionFile);
            } catch (err) {}
        }
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'Set-Cookie': 'NODESESSID=; Path=/; Max-Age=0'
        });
        res.write('<!DOCTYPE html><html><head><title>Session Cleared</title></head><body>');
        res.write('<h1>Session Cleared</h1>');
        res.write('<p>Your saved data has been removed.</p>');
        res.write('<br/><a href="/node/state1-node">Back to Page 1</a><br/>');
        res.write('<a href="/node/state2-node">Back to Page 2</a>');
        res.write('</body></html>');
        res.end();
    }
    else { 
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
    }
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});