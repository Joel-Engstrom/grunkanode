const http = require("http").createServer();
const { moveBase, moveLowerArm } = require("./j5");

const io = require("socket.io")(http, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  socket.on("input", (data) => {
    console.log(data);

    if (data.stick === "left_stick" && data.axis === 0) {
      handleBaseTurn(data.value);
    }

    if (data.stick === "left_stick" && data.axis === 1) {
      handleLowerArm(data.value);
    }
  });
});

const handleBaseTurn = (value) => {
  moveBase(value);
};

const handleLowerArm = (value) => {
  moveLowerArm(value);
};

http.listen(8000, () => console.log("listening on http://localhost:8000"));
