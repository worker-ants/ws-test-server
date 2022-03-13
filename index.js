import 'dotenv/config';
import express from 'express';
import http from 'http';
import {Server as SocketServer} from 'socket.io';

const env = {
    PORT: parseInt(process.env?.PORT ?? '80', 10),
};

const app = express();
const httpServer = http.createServer(app);
const io = new SocketServer(httpServer);

app.use(express.static('public'));
app.get('/test', function (req, res) {
    setTimeout(() => {
        res.status(200);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({result: true, message: 'success'}));
    }, 100);
});

function getTimeString() {
    return new Date().toLocaleString();
}
async function getSocketCount() {
    return (await io.allSockets()).size ?? 0;
}

io.on('connection', async (socket) => {
    console.log(`ws connect: ${socket.id}`);
    console.log(`[${getTimeString()}] ${await getSocketCount()}`);

    socket.on('disconnect', async (reason) => {
        console.log(`ws disconnect: ${socket.id} - ${reason}`);
        console.log(`[${getTimeString()}] ${await getSocketCount()}`);
    });
});


httpServer.listen(env.PORT, () => {
    console.log(`sever running (port: ${env.PORT})`);

    const broadCaster = setInterval(async () => {
        const now = new Date();
        const summary = {
            timestamp: now.getTime(),
            socketCount: await getSocketCount(),
        };

        io.emit('broadcast', JSON.stringify(summary));
    }, 1000);

    httpServer.on('close', () => {
        clearInterval(broadCaster);
    });
});