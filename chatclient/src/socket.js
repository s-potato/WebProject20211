import io from 'socket.io-client';

const socket = io(process.env.VUE_APP_SERVER_ADDRESS+"");

export default socket;