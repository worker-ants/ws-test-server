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

io.on('connection', (socket) => {
    console.log(`ws connect: ${socket.id}`);

    socket.on('disconnect', (reason) => {
        console.log(`ws disconnect: ${socket.id} - ${reason}`);
    });
});

httpServer.listen(env.PORT, () => {
    console.log(`sever running (port: ${env.PORT})`);

    const broadCaster = setInterval(async () => {
        const now = new Date();
        const sockets = await io.allSockets();
        const summary = {
            timestamp: now.getTime(),
            socketCount: sockets.size,
        };

        io.emit('broadcast', JSON.stringify(summary));
        console.log(`[${now.toLocaleString()}] ${summary.socketCount}`);
    }, 1000);

    httpServer.on('close', () => {
        clearInterval(broadCaster);
    });
});