const { Board, Servo, Motor, Pin } = require("johnny-five");
var SerialPort = require("serialport").SerialPort;

const board = new Board({
  port: new SerialPort({
    path: 'COM4',
    baudRate: 57600,
  })
});

const SERVO_SENSITIVITY = 0.8;
const CLAW_SENSITIVITY = 1.2;

var isConnected = false;

var leftBrow = false;
var rightBrow = false;

var hatchPos = 60;

// Arm servos
var servoBase = null;
var servoLowerArm = null;
var servoUpperArm = null;
var servoClaw = null;
var servoClawSpinner = null;
var clawSpinnerAngle = 90;
var servoHatch = null;
// Motors for moving
var motorLeft = null;
var motorRight = null;
// Head servos
var servoNeck = null;
var servoEyeBrowRight = null;

board.on("ready", () => {

  servoBase = new Servo({
    id: "servoBase", // User defined id
    pin: 8, // Which pin is it attached to?
    type: "standard", // Default: "standard". Use "continuous" for continuous rotation servos
    range: [0, 180], // Default: 0-180
    fps: 100, // Used to calculate rate of movement between positions
    invert: false, // Invert all specified positions
    center: true, // overrides startAt if true and moves the servo to the center of the range
  });

  // Servo alternate constructor with options

  servoLowerArm = new Servo({
    id: "servoLowerArm", // User defined id
    pin: 9, // Which pin is it attached to?
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
    pin: 2, // Which pin is it attached to?
    type: "standard", // Default: "standard". Use "continuous" for continuous rotation servos
    range: [0, 180], // Default: 0-180
    fps: 100, // Used to calculate rate of movement between positions
    invert: false, // Invert all specified positions
    center: false, // overrides startAt if true and moves the servo to the center of the range
  });

  servoClawSpinner = new Servo({
    id: "servoClawSpinner", // User defined id
    pin: 7, // Which pin is it attached to?
    type: "standard", // Default: "standard". Use "continuous" for continuous rotation servos
    range: [0, 180], // Default: 0-180
    fps: 100, // Used to calculate rate of movement between positions
    invert: false, // Invert all specified positions
    center: true, // overrides startAt if true and moves the servo to the center of the range
  });

  servoHatch = new Servo({
    id: "servoHatch", // User defined id
    pin: 12, // Which pin is it attached to?
    type: "standard", // Default: "standard". Use "continuous" for continuous rotation servos
    range: [60, 170], // Default: 0-180
    fps: 100, // Used to calculate rate of movement between positions
    invert: false, // Invert all specified positions
    center: false, // overrides startAt if true and moves the servo to the center of the range
    startAt: 60,
  });

  servoNeck = new Servo({
    id: "servoNeck", // User defined id
    pin: 13, // Which pin is it attached to?
    type: "continuous", // Default: "standard". Use "continuous" for continuous rotation servos
    //range: [0, 360], // Default: 0-180
    fps: 100, // Used to calculate rate of movement between positions
    invert: false, // Invert all specified positions
    center: true, // overrides startAt if true and moves the servo to the center of the range
  });

  servoEyeBrowRight = new Servo({
    id: "servoEyeBrowRight", // User defined id
    pin: 4, // Which pin is it attached to?
    type: "standard", // Default: "standard". Use "continuous" for continuous rotation servos
    range: [116, 140], // Default: 0-180
    fps: 100, // Used to calculate rate of movement between positions
    invert: false, // Invert all specified positions
    center: false, // overrides startAt if true and moves the servo to the center of the range
    startAt: 140,
  });

  servoEyeBrowLeft = new Servo({
    id: "servoEyeBrowLeft", // User defined id
    pin: 5, // Which pin is it attached to?
    type: "standard", // Default: "standard". Use "continuous" for continuous rotation servos
    range: [116, 140], // Default: 0-180
    fps: 100, // Used to calculate rate of movement between positions
    invert: true, // Invert all specified positions
    center: false, // overrides startAt if true and moves the servo to the center of the range
    startAt: 140,
  });

  motorLeft = new Motor({
    pins: {
      pwm: 6,
      dir: 18,
      cdir: 19,
    },
  });

  motorRight = new Motor({
    pins: {
      pwm: 11,
      dir: 17,
      cdir: 16,
    },
  });

  // Add servo to REPL (optional)
  board.repl.inject({
    servoBase,
    servoLowerArm,
    servoUpperArm,
    servoClaw,
    servoClawSpinner,
    servoHatch,
    servoNeck,
    servoEyeBrowRight,
    servoEyeBrowLeft,
    motorLeft,
    motorRight,
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

const clawSpin = (value) => {
  prevAngle = clawSpinnerAngle;
  servoClawSpinner.to(prevAngle + value);
  clawSpinnerAngle += value;
  console.log("Spinner at: " + clawSpinnerAngle)
}

const moveClaw = (input) => {
  if (isConnected) {
    console.log(
      `Moving claw to: ${servoClaw.position + input * CLAW_SENSITIVITY}`
    );
    servoClaw.to(servoClaw.position + input * CLAW_SENSITIVITY);
    return servoClaw.position + input * CLAW_SENSITIVITY;
  }
};

const increaseHatch = () => {
  if (hatchPos >= 170) return;
  servoHatch.to(hatchPos + 55);
  hatchPos += 55;
}

const lowerHatch = () => {
  if (hatchPos <= 60) return;
  servoHatch.to(hatchPos - 55);
  hatchPos -= 55;
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const moveRobot = (Axes) => {
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
  const speed = dist * 200;

  if (x > 0.8) {
    console.log("Svänger höger framåt")
    motorLeft.forward(255);
    motorRight.forward(255);
    return;
  }

  if (x < -0.8) {
    console.log("Svänger vänster framåt")
    motorLeft.reverse(255);
    motorRight.reverse(255);
    return;
  }

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
  const speed = dist * 200;

  if (x > 0.8) {
    console.log("Svänger vänster bakåt")
    motorLeft.reverse(255);
    motorRight.reverse(255);
    return;
  }

  if (x < -0.8) {
    console.log("Svänger höger bakåt")
    motorLeft.forward(255);
    motorRight.forward(255);
    return;
  }

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
  servoLowerArm.to(120, 1000);
  await delay(100);
  servoUpperArm.to(120, 1000);
  await delay(100);
  servoBase.to(140, 1000);
  await delay(100);
  servoUpperArm.to(110, 1000);
  servoLowerArm.to(95, 1000);
  servoClawSpinner.to(140, 1000);
};

const moveAwayFromButton = async () => {
  servoLowerArm.to(100, 1000);
  servoUpperArm.to(100, 1000);
  await delay(200);
  servoBase.to(35, 1000);
  await delay(400);
  servoLowerArm.to(155, 1000);
  servoUpperArm.to(120, 1000);
};

const moveArmBack = async () => {
  servoLowerArm.to(120, 1000);
  servoUpperArm.to(50, 1000);
  await delay(200);
  servoBase.to(175, 1000);
  await delay(400);
  servoLowerArm.to(65, 1000);
  servoUpperArm.to(30, 1000);
}

const headLeft = async () => {
  servoNeck.cw(0.1);
  await delay(250);
  servoNeck.stop();
}

const headRight = async () => {
  servoNeck.ccw(0.2);
  await delay(250);
  servoNeck.stop();
}

const headLeftBig = async () => {
  servoNeck.cw(0.8);
  await delay(250);
  servoNeck.stop();
}

const headRightBig = async () => {
  servoNeck.ccw(0.8);
  await delay(250);
  servoNeck.stop();
}

const toggleEyeBrows = async () => {
  servoEyeBrowRight.min();
  servoEyeBrowLeft.min();
  await delay(1500);
  servoEyeBrowRight.max();
  servoEyeBrowLeft.max();
}

const toggleLeftBrow = () => {
  if (leftBrow) {
    servoEyeBrowLeft.max();
  } else {
    servoEyeBrowLeft.min();
  }
  leftBrow = !leftBrow
}

const toggleRightBrow = () => {
  if (rightBrow) {
    servoEyeBrowRight.max();
  } else {
    servoEyeBrowRight.min();
  }
  rightBrow = !rightBrow
}

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
  moveArmBack,
  moveRobot,
  motorStop,
  increaseHatch,
  lowerHatch,
  headRight,
  headLeft,
  headLeftBig,
  headRightBig,
  toggleEyeBrows,
  toggleLeftBrow,
  toggleRightBrow,
  clawSpin
};
