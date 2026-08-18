const http = require('http');
const url = require('url');
const crypto = require('crypto');
const fs = require('fs');

function respondWithStatePage(res, sessionFile, sessionId, newSession) {
    let currentUsername = '';
    try {
        currentUsername = fs.readFileSync(sessionFile, 'utf8');
    } catch (err) {
        // file doesn't exist yet — currentUsername stays empty
    }

    let html = '<!DOCTYPE html><html><head><title>Node State Page 1</title></head><body>';
    html += '<h1>Node State Page 1</h1>';

    if (currentUsername) {
        html += '<p>Current username: ' + escapeHtml(currentUsername) + '</p>';
    } else {
        html += '<p>No name set yet.</p>';
    }

    html += '<form method="POST" action="/node/state1-node"><label>Name: <input type="text" name="username"></label><button type="submit">Save</button></form>';
    html += '<br/><a href="/node/state2-node">Go to Page 2</a><br/>';
    html += '<a href="/node/state-clear-node">Clear Session</a>';
    html += '</body></html>';

    const headers = { 'Content-Type': 'text/html' };
    if (newSession) {
        headers['Set-Cookie'] = `NODESESSID=${sessionId}; Path=/`;
    }
    res.writeHead(200, headers);
    res.end(html);
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

    let html = '<!DOCTYPE html><html><body>';
    html += '<p>Host name: ' + hostname + '</p>';
    html += '<p>Time &amp; Date: ' + datetime + '</p>';
    html += '<p>UserAgent: ' + escapeHtml(userAgent) + '</p>';
    html += '<p>IP Address: ' + ip + '</p>';
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
                const username = parsedBody.get('username');

                if (username) {
                    fs.writeFileSync(sessionFile, username, 'utf8');
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
        let currentUsername = '';

        if (sessionId) {
            const sessionFile = `/tmp/nodesession_${sessionId}.txt`;
            try {
                currentUsername = fs.readFileSync(sessionFile, 'utf8');
            } catch (err) {}
        }

        let html = '<!DOCTYPE html><html><head><title>Node State Page 2</title></head><body>';
        html += '<h1>Node State Page 2</h1>';

        if (currentUsername) {
            html += '<p>Current username: ' + escapeHtml(currentUsername) + '</p>';
        } else {
            html += '<p>No name set yet.</p>';
        }

        html += '<br/><a href="/node/state1-node">Go to Page 1</a><br/>';
        html += '<a href="/node/state-clear-node">Clear Session</a>';
        html += '</body></html>';

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
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

        let html = '<!DOCTYPE html><html><head><title>Session Cleared</title></head><body>';
        html += '<h1>Session Cleared</h1>';
        html += '<p>Your saved data has been removed.</p>';
        html += '<br/><a href="/node/state1-node">Back to Page 1</a><br/>';
        html += '<a href="/node/state2-node">Back to Page 2</a>';
        html += '</body></html>';

        res.writeHead(200, {
            'Content-Type': 'text/html',
            'Set-Cookie': 'NODESESSID=; Path=/; Max-Age=0'
        });
        res.end(html);
    }
    else { 
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
    }
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});