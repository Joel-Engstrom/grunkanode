const http = require("http").createServer();
const { moveBaseMax, moveBaseMin } = require("./j5");

const io = require("socket.io")(http, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  socket.on("input", (data) => {
    console.log(data);
    if (data === "button_0") {
      moveBaseMax(1);
    } else if (data === "button_1") {
      moveBaseMin(1);
    }
  });
});

http.listen(8000, () => console.log("listening on http://localhost:8000"));
