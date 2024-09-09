const URL = import.meta.env.VITE_API_WS_URL;

const createWebSocket = (userId: string, token: string) => {
  const socket = new WebSocket(`${URL}/${userId}?token=${token}`);
  return socket;
};

export default createWebSocket;
