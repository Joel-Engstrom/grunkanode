const http = require("http").createServer();
const {
  moveBase,
  moveLowerArm,
  moveUpperArm,
  moveClaw,
  moveToButton,
  moveAwayFromButton,
  moveRobot,
  motorStop,
} = require("./j5");

const io = require("socket.io")(http, {
  cors: { origin: "*" },
});

var previousBase = 0;
var currentBase = 0;

var previousLowerArm = 0;
var currentLowerArm = 0;

var previousUpperArm = 0;
var currentUpperArm = 0;

var previousClaw = 0;
var currentClaw = 0;

io.on("connection", (socket) => {
  sock = socket;
  socket.on("input", (data) => {
    console.log(data);

    if (data === "button_7") {
      motorForward();
    }

    if (data === "button_6") {
      motorReverse();
    }

    if (data === "button_9") {
      motorStop();
    }

    if (data === "button_6") {
      moveToButton();
    }

    if (data === "button_7") {
      moveAwayFromButton();
    }

    if (data === "button_12") {
      currentLowerArm = handleLowerArm(-2).toFixed(0);
      currentUpperArm = handleUpperArm(-2).toFixed(0);

      sendToSocket({
        base: currentBase,
        lowerArm: currentLowerArm,
        upperArm: currentUpperArm,
        claw: currentClaw,
      });
      previousLowerArm = currentLowerArm;
      previousUpperArm = currentUpperArm;
    }

    if (data === "button_13") {
      currentLowerArm = handleLowerArm(2).toFixed(0);
      currentUpperArm = handleUpperArm(2).toFixed(0);

      sendToSocket({
        base: currentBase,
        lowerArm: currentLowerArm,
        upperArm: currentUpperArm,
        claw: currentClaw,
      });
      previousLowerArm = currentLowerArm;
      previousUpperArm = currentUpperArm;
    }

    if (data === "button_14") {
      currentBase = handleBaseTurn(-1).toFixed(0);
      sendToSocket({
        base: currentBase,
        lowerArm: currentLowerArm,
        upperArm: currentUpperArm,
        claw: currentClaw,
      });
      previousBase = currentBase;
    }

    if (data === "button_15") {
      currentBase = handleBaseTurn(1).toFixed(0);
      sendToSocket({
        base: currentBase,
        lowerArm: currentLowerArm,
        upperArm: currentUpperArm,
        claw: currentClaw,
      });
      previousBase = currentBase;
    }

    /*===================================================
              Claw Controls
    =====================================================*/
    if (data.stick === "left_stick" && data.axis === 0 && data.controller === 1) {
      currentBase = handleBaseTurn(data.value).toFixed(0);
      if (Math.abs(previousBase - currentBase) >= 5) {
        sendToSocket({
          base: currentBase,
          lowerArm: currentLowerArm,
          upperArm: currentUpperArm,
          claw: currentClaw,
        });
        previousBase = currentBase;
      }
    }

    if (data.stick === "left_stick" && data.axis === 1 && data.controller === 1) {
      currentLowerArm = handleLowerArm(data.value).toFixed(0);
      if (Math.abs(previousLowerArm - currentLowerArm) >= 5) {
        sendToSocket({
          base: currentBase,
          lowerArm: currentLowerArm,
          upperArm: currentUpperArm,
          claw: currentClaw,
        });
        previousLowerArm = currentLowerArm;
      }
    }

    if (data.stick === "right_stick" && data.axis === 3 && data.controller === 1) {
      currentUpperArm = handleUpperArm(data.value).toFixed(0);
      if (Math.abs(previousUpperArm - currentUpperArm) >= 5) {
        sendToSocket({
          base: currentBase,
          lowerArm: currentLowerArm,
          upperArm: currentUpperArm,
          claw: currentClaw,
        });
        previousUpperArm = currentUpperArm;
      }
    }

    if (data.stick === "right_stick" && data.axis === 2 && data.controller === 1) {
      currentClaw = handleClaw(data.value).toFixed(0);
      if (Math.abs(previousClaw - currentClaw) >= 5) {
        sendToSocket({
          base: currentBase,
          lowerArm: currentLowerArm,
          upperArm: currentUpperArm,
          claw: currentClaw,
        });
        previousClaw = currentClaw;
      }
    }

    /*===================================================
              Driver Controls
    =====================================================*/

    if (data.stick === "left_stick" && data.controller === 0) {
      moveRobot(data.axes);
    }

    if (data.stick === "right_stick" && data.controller === 0) {
      //moveHead(data.value);
    }
  });

  const handleBaseTurn = (value) => {
    return moveBase(value * -1);
  };

  const handleLowerArm = (value) => {
    return moveLowerArm(value);
  };

  const handleUpperArm = (value) => {
    return moveUpperArm(value);
  };

  const handleClaw = (value) => {
    return moveClaw(value);
  };

  const sendToSocket = (state) => {
    socket.emit("state", state);
  };
});

http.listen(8000, () => console.log("listening on http://localhost:8000"));
