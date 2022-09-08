import io from 'Socket.IO-client'


const URL = "/api/socket";

const socket = io(URL, { autoConnect: false });

export default socket;
