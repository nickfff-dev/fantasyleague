import io from 'Socket.IO-client'


const URL = "http://localhost:5000";

const socket = io(URL, { autoConnect: false });

export default socket;
