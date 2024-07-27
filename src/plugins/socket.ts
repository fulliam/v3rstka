const URL = 'ws://localhost:3000/ws';

const createWebSocket = (userId: string) => {
  const socket = new WebSocket(`${URL}/${userId}`);

  return socket;
};

export default createWebSocket;