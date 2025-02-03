const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000'], 
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

// Hardcoded pictures list
const pictures = [
  {
    id: 1,
    name: 'Multi-Colored Painting',
    artist: 'Geordanna Cordero',
    description: 'Created in 2024',
    image: 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?q=80&w=1968&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
  },
  {
    id: 2,
    name: 'The Starry Night',
    artist: 'Vincent van Gogh',
    description: 'Created in 1889',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1200px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
  },
  {
    id: 3,
    name: 'War In Heaven',
    artist: 'Adrianna Geo',
    description: 'Created in 2020',
    image: 'https://images.unsplash.com/flagged/photo-1572392640988-ba48d1a74457?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
  },
  {
    id: 4,
    name: 'Sky or Sea',
    artist: 'Hank Standfot',
    description: 'Created in 1990',
    image: 'https://images.unsplash.com/photo-1515405295579-ba7b45403062?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 
  },
  // Add more pictures if you want
];


app.get('/api/pictures', (req, res) => {
  res.json(pictures); 
});


io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('send_message', (data) => {
    console.log('Message received:', data);
    io.emit('receive_message', data); 
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start the server
server.listen(4000, () => {
  console.log('Server running on port 4000');
});
