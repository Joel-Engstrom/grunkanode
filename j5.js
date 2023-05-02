const { Board, Servo, Motor } = require("johnny-five");
var SerialPort = require("serialport").SerialPort;
/* const myPort = new SerialPort({
  path:"COM4",
  baudRate:19200,
  buffersize: 1,
}); */

const board = new Board({
  port: new SerialPort({
    path: 'COM4',
    baudRate: 19200,
  })
});

const SERVO_SENSITIVITY = 0.8;
const CLAW_SENSITIVITY = 1.2;

var isConnected = false;
var servoBase = null;
var servoLowerArm = null;
var servoUpperArm = null;
var servoClaw = null;
var motorLeft = null;
var motorRight = null;

board.on("ready", () => {
  servoBase = new Servo({
    id: "servoBase", // User defined id
    pin: 2, // Which pin is it attached to?
    type: "standard", // Default: "standard". Use "continuous" for continuous rotation servos
    range: [0, 200], // Default: 0-180
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
    range: [0, 110], // Default: 0-180
    fps: 100, // Used to calculate rate of movement between positions
    invert: false, // Invert all specified positions
    center: true, // overrides startAt if true and moves the servo to the center of the range
  });

  motorLeft = new Motor({
    pins: {
      pwm: 6,
      dir: 4,
      cdir: 5,
    },
  });

  motorRight = new Motor({
    pins: {
      pwm: 11,
      dir: 12,
      cdir: 13,
    },
  });

  // Add servo to REPL (optional)
  board.repl.inject({
    /*servoBase,
    servoLowerArm,
    servoUpperArm,
    servoClaw,*/
    motorLeft,
    motorRight,
  });

  motorLeft.on("start", () => {
    console.log(`Motorn startades: ${Date.now()}`);
  });

  motorLeft.on("stop", () => {
    console.log(`automated stop on timer: ${Date.now()}`);
  });

  motorLeft.on("forward", () => {
    console.log(`forward: ${Date.now()}`);
  });

  motorLeft.on("reverse", () => {
    console.log(`reverse: ${Date.now()}`);
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
      `Moving claw to: ${servoClaw.position + input * CLAW_SENSITIVITY}`
    );
    servoClaw.to(servoClaw.position + input * CLAW_SENSITIVITY);
    return servoClaw.position + input * CLAW_SENSITIVITY;
  }
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const moveRobot = async (Axes) => {
  let distance = Math.sqrt(Math.pow(Axes[0], 2) + Math.pow(Axes[1], 2));

  const x = Axes[0];
  const y = Axes[1] * -1;

  if (y > 0) {
    moveForward(x, distance);
  } else {
    moveReverse(x, distance);
  }
};

const moveForward = (x, dist) => {
  let rightMotor = 0;
  let leftMotor = 0;
  const speed = dist * 255;

  if (x < 0) {
    rightMotor = speed * (1 + x);
  } else {
    rightMotor = speed;
  }

  if (x > 0) {
    leftMotor = speed * (1 - x);
  } else {
    leftMotor = speed;
  }

  motorLeft.reverse(leftMotor);
  motorRight.forward(rightMotor);
};

const moveReverse = (x, dist) => {
  let rightMotor = 0;
  let leftMotor = 0;
  const speed = dist * 255;

  if (x < 0) {
    rightMotor = speed * (1 + x);
  } else {
    rightMotor = speed;
  }

  if (x > 0) {
    leftMotor = speed * (1 - x);
  } else {
    leftMotor = speed;
  }

  motorLeft.forward(leftMotor);
  motorRight.reverse(rightMotor);
};

const motorStop = async () => {
  motorLeft.stop();
  motorRight.stop();
};

const moveToButton = async () => {
  servoLowerArm.to(120);
  await delay(100);
  servoUpperArm.to(120);
  await delay(100);
  servoBase.to(150);
  await delay(100);
  servoUpperArm.to(40);
  servoLowerArm.to(35);
};

const moveAwayFromButton = async () => {
  servoLowerArm.to(100);
  servoUpperArm.to(140);
  await delay(200);
  servoBase.to(20);
  await delay(400);
  servoLowerArm.to(50);
  servoUpperArm.to(50);
};

board.on("exit", () => {
  motorLeft.stop();
  motorRight.stop();
});

module.exports = {
  moveBase,
  moveLowerArm,
  moveUpperArm,
  moveClaw,
  moveToButton,
  moveAwayFromButton,
  moveRobot,
  motorStop,
};
