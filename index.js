const http = require("http").createServer();
const { moveBase, moveLowerArm } = require("./j5");

const io = require("socket.io")(http, {
  cors: { origin: "*" },
});

var previousBase = 0;
var currentBase = 0;

var previousLowerArm = 0;
var currentLowerArm = 0;

const updateState = setInterval(() => {}, 1000);

io.on("connection", (socket) => {
  sock = socket;
  socket.on("input", (data) => {
    console.log(data);

    if (data.stick === "left_stick" && data.axis === 0) {
      currentBase = handleBaseTurn(data.value).toFixed(0);
      if (Math.abs(previousBase - currentBase) >= 5) {
        sendToSocket({ base: currentBase, lowerArm: currentLowerArm });
        previousBase = currentBase;
      }
    }

    if (data.stick === "left_stick" && data.axis === 1) {
      currentLowerArm = handleLowerArm(data.value).toFixed(0);
      if (Math.abs(previousLowerArm - currentLowerArm) >= 5) {
        sendToSocket({ base: currentBase, lowerArm: currentLowerArm });
        previousLowerArm = currentLowerArm;
      }
    }
  });

  const handleBaseTurn = (value) => {
    return moveBase(value);
  };

  const handleLowerArm = (value) => {
    return moveLowerArm(value);
  };

  const sendToSocket = (state) => {
    socket.emit("state", state);
  };
});

http.listen(8000, () => console.log("listening on http://localhost:8000"));
