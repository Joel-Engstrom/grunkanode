const { Board, Servo } = require("johnny-five");
const board = new Board();

const SERVO_SENSITIVITY = 1.2;

var isConnected = false;
var servoBase = null;
var servoLowerArm = null;
var servoUpperArm = null;
var servoClaw = null;

board.on("ready", () => {
  servoBase = new Servo({
    id: "servoBase", // User defined id
    pin: 3, // Which pin is it attached to?
    type: "standard", // Default: "standard". Use "continuous" for continuous rotation servos
    range: [0, 180], // Default: 0-180
    fps: 100, // Used to calculate rate of movement between positions
    invert: false, // Invert all specified positions
    center: true, // overrides startAt if true and moves the servo to the center of the range
  });

  // Servo alternate constructor with options

  servoLowerArm = new Servo({
    id: "servoLowerArm", // User defined id
    pin: 7, // Which pin is it attached to?
    type: "standard", // Default: "standard". Use "continuous" for continuous rotation servos
    range: [0, 180], // Default: 0-180
    fps: 100, // Used to calculate rate of movement between positions
    invert: false, // Invert all specified positions
    center: true, // overrides startAt if true and moves the servo to the center of the range
  });

  servoUpperArm = new Servo({
    id: "servoUpperArm", // User defined id
    pin: 10, // Which pin is it attached to?
    type: "standard", // Default: "standard". Use "continuous" for continuous rotation servos
    range: [0, 180], // Default: 0-180
    fps: 100, // Used to calculate rate of movement between positions
    invert: false, // Invert all specified positions
    center: true, // overrides startAt if true and moves the servo to the center of the range
  });

  servoClaw = new Servo({
    id: "servoClaw", // User defined id
    pin: 13, // Which pin is it attached to?
    type: "standard", // Default: "standard". Use "continuous" for continuous rotation servos
    range: [5, 105], // Default: 0-180
    fps: 100, // Used to calculate rate of movement between positions
    invert: false, // Invert all specified positions
    center: true, // overrides startAt if true and moves the servo to the center of the range
  });

  // Add servo to REPL (optional)
  board.repl.inject({
    servoBase,
    servoLowerArm,
    servoUpperArm,
    servoClaw
  });

  isConnected = true;
});

const moveBase = (input) => {
  if (isConnected) {
    console.log(
      `Moving base to: ${servoBase.position + input * SERVO_SENSITIVITY}`
    );
    servoBase.to(servoBase.position + input * SERVO_SENSITIVITY);
    return servoBase.position + input * SERVO_SENSITIVITY;
  }
};

const moveLowerArm = (input) => {
  if (isConnected) {
    console.log(
      `Moving lower arm to: ${
        servoLowerArm.position + input * SERVO_SENSITIVITY
      }`
    );
    servoLowerArm.to(servoLowerArm.position + input * SERVO_SENSITIVITY);
    return servoLowerArm.position + input * SERVO_SENSITIVITY;
  }
};

const moveUpperArm = (input) => {
  if (isConnected) {
    console.log(
      `Moving upper arm to: ${
        servoUpperArm.position + input * SERVO_SENSITIVITY
      }`
    );
    servoUpperArm.to(servoUpperArm.position + input * SERVO_SENSITIVITY);
    return servoUpperArm.position + input * SERVO_SENSITIVITY;
  }
};

const moveClaw = (input) => {
  if (isConnected) {
    console.log(
      `Moving claw to: ${
        servoClaw.position + input * SERVO_SENSITIVITY
      }`
    );
    servoClaw.to(servoClaw.position + input * SERVO_SENSITIVITY);
    return servoClaw.position + input * SERVO_SENSITIVITY;
  }
};

module.exports = { moveBase, moveLowerArm, moveUpperArm, moveClaw };
