const { Board, Servo } = require("johnny-five");
const board = new Board();

var isConnected = false;

var servoBase = null;
var servoLowerArm = null;

board.on("ready", () => {
  servoBase = new Servo({
    id: "servoBase", // User defined id
    pin: 10, // Which pin is it attached to?
    type: "standard", // Default: "standard". Use "continuous" for continuous rotation servos
    range: [0, 180], // Default: 0-180
    fps: 100, // Used to calculate rate of movement between positions
    invert: false, // Invert all specified positions
    startAt: 90, // Immediately move to a degree
    center: true, // overrides startAt if true and moves the servo to the center of the range
  });

  // Servo alternate constructor with options

  servoLowerArm = new Servo({
    id: "servoLowerArm", // User defined id
    pin: 0, // Which pin is it attached to?
    type: "standard", // Default: "standard". Use "continuous" for continuous rotation servos
    range: [0, 180], // Default: 0-180
    fps: 100, // Used to calculate rate of movement between positions
    invert: false, // Invert all specified positions
    startAt: 90, // Immediately move to a degree
    center: true, // overrides startAt if true and moves the servo to the center of the range
  });

  // Add servo to REPL (optional)
  board.repl.inject({
    servoBase,
    servoLowerArm,
  });

  isConnected = true;
});

const moveBaseMax = ({ input }) => {
  if (isConnected) {
    servoBase.to(180);
  }
};

const moveBaseMin = ({ input }) => {
  if (isConnected) {
    servoBase.to(0);
  }
};

module.exports = { moveBaseMax, moveBaseMin };
