// eslint-disable-next-line @typescript-eslint/no-require-imports
const io = require("socket.io-client");

const socket1 = io(`http://localhost:3000/chat`, {
  auth: {
    token:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNjN2VvMFNReXNYMCIsIm5hbWUiOiLslYjqtJHsmrEiLCJyb2xlIjoibWFuYWdlciIsImlhdCI6MTczNzM2MTc5MiwiZXhwIjo2MTczNzM2MTc5MiwiaXNzIjoiYW5kZXYifQ.e9hAYMObPAu3k2nb73fgWI81PjVBHkuZSZ2ROx6Xg34",
  },
});
//const socket2 = io(`http://localhost:3000/` , {auth : {token : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjgzaUFTNkRkR0NoWCIsIm5hbWUiOiLquYDslYzrsJQiLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE3MzczNjIxMzEsImV4cCI6NjE3MzczNjIxMzEsImlzcyI6ImFuZGV2In0.SmRLEn7R_V86fAgBuYbF1o1QDUGOK785qGtHh_84nwM"}});
// console.log(1);


socket1.on("connect", () => {
  console.log("Connected to server with id:", socket1.id);

  
});
// socket1.emit("joinRoom", { roomId: "CbAnflTw" }, (response) => {
//     console.log("Join room response:", response);})

// socket1.emit("broadcast", { content: "hello room2222 CbAnflTw!", roomId: "CbAnflTw" }, (response) => {
//     console.log("Send message response:", response);
// });
socket1.on("initialize", (response) => {
  console.log(response);
});

socket1.on("chatLists", (response) => {
  console.log(response);
});

