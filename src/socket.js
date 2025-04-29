import { io } from "socket.io-client";

const BACKEND_API = import.meta.VITE_BACKEND_URL || 'http://localhost:8000';


const socket = io(BACKEND_API, {
    transports: ['websocket']
})



export default socket