const io = require("socket.io")();
const Gpio = require("onoff").Gpio;
const readline = require("readline");
const fs = require("fs");

function isRaspberryPi() {
  try {
    const model = fs
      .readFileSync("/sys/firmware/devicetree/base/model", "utf8")
      .toLowerCase();
    return model.includes("raspberry pi");
  } catch (err) {
    return false;
  }
}

const socketapi = {
  io: io,
};

// Add your socket.io logic here!
io.on("connection", function (socket) {
  console.log("User connected");

  socket.on("end", () => {
    console.log("User left");
  });
});

function broadcast(message) {
  if (message) {
    console.log("Broadcasting Basket " + message);
    io.emit("basket", { num: message });
  }
}
module.exports = socketapi;

if (isRaspberryPi()) {
  console.log("Yup, this is a Raspberry Pi");
  // https://github.com/fivdi/onoff
  // https://stackoverflow.com/questions/78173749/use-raspberry-pi-4-gpio-with-node-js/78184108#78184108
  // GPIO17 -> ??? (pin 11)
  // GPIO18 -> ??? (pin 12)
  const leftBasket = new Gpio(528, "in", "falling", { debounceTimeout: 100 });
  const rightBasket = new Gpio(534, "in", "falling", { debounceTimeout: 100 });

  process.on("SIGINT", (_) => {
    leftBasket.unexport();
    rightBasket.unexport();
  });

  leftBasket.watch((err, value) => {
    if (err) {
      throw err;
    }
    broadcast(1);
  });

  rightBasket.watch((err, value) => {
    if (err) {
      throw err;
    }
    broadcast(2);
  });
} else {
  console.log("Not a Pi, using keyboard input");
  readline.emitKeypressEvents(process.stdin);

  if (process.stdin.setRawMode != null) {
    process.stdin.setRawMode(true);
  }

  process.stdin.on("keypress", (str, key) => {
    if (key.name === "1") {
      broadcast(1);
    }
    if (key.name === "2") {
      broadcast(2);
    }
    if (key.ctrl && key.name === "c") {
      process.exit();
    }
  });
}

console.log("Ready!");
