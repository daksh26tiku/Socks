// index.js
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketIO = require('socket.io');
const chatRoutes = require('./src/routes/chatRoutes');
const socketHandler = require('./src/handlers/socketHandler');
const { consume } = require('./src/kafka/consumer');
const { startServer, handleShutdown } = require('./src/handlers/serverHandler');

const app = express();
const server = http.createServer(app);

// Configure CORS for Socket.io
const io = socketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// CORS middleware for REST API
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Allow specific origins for development
  const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'https://socks-zz58.onrender.com'
  ];
  
  if (allowedOrigins.includes(origin) || !origin) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Static files served by Vercel in production
if (process.env.NODE_ENV !== 'production') {
  app.use(express.static('./client'));
}

app.use('/api', chatRoutes);
// Static files served by Vercel in production
if (process.env.NODE_ENV !== 'production') {
  app.use(express.static('../client'));
}

// Use the socketHandler
socketHandler(io);

// Initialize kafka consumer
consume(io).then(r => {
    console.log("------------Working consumer, waiting for server to start-----------")
}).catch(err => {
    console.log("Occurred error ", err)
});

// Synchronize Sequelize models with the database
(async () => {
    const srv = await startServer(PORT, server);
    await handleShutdown(srv);
})();
