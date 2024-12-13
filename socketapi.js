const io = require("socket.io")();
const Gpio = require("onoff").Gpio;
const isPi = require("detect-rpi");
const readline = require("readline");

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

if (isPi()) {
  // https://stackoverflow.com/questions/78173749/use-raspberry-pi-4-gpio-with-node-js/78184108#78184108
  // GPIO18 -> 530
  // GPIO23 -> 535
  const leftBasket = new Gpio(530, "in", "rising", { debounceTimeout: 10 });
  const rightBasket = new Gpio(535, "in", "rising", { debounceTimeout: 10 });

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
