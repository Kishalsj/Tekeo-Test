import { io } from 'socket.io-client';

const socket = io('http://localhost:4000'); // Replace with your backend URL

export default socket;

