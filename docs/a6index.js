// Set BAUD Rate
const baudRate = 9600;

// Declare global variables
let port, connectBtn;

// Variables to store the joystick position on screen
let dotX, dotY;

function setup() {
  // Create a canvas the size of browser window
  createCanvas(windowWidth, windowHeight);

  // Run serial setup function
  setupSerial();
}

function draw() {
  const portIsOpen = checkPort(); // Check whether the port is open
  if (!portIsOpen) return; // If the port is not open, exit the draw loop

  let str = port.readUntil("\n"); // Read from the port until the newline
  if (str.length == 0) return; // If we didn't read anything, return.

  let arr = str.trim().split(","); // Trim whitespace and split on commas

  // Convert each element to a number and map it to the desired range
  dotX = map(Number(arr[0]), 0, 1023, 0, width);
  dotY = map(Number(arr[1]), 0, 1023, 0, height);

  background(255, 204, 0); // Draw a gold background each frame to clear the previous dot
  fill(75, 0, 130); // Color the dot purple
  circle(dotX, dotY, 50); // Draw circle using readings
}

function setupSerial() {
  port = createSerial(); // Create a new serial port object

  // Check to see if there are any ports we have used previously
  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    // If there are ports we've used, open the first one
    port.open(usedPorts[0], baudRate);
  }

  // create a connect button
  connectBtn = createButton("Connect to Arduino");
  connectBtn.position(5, 5); // Position the button in the top left of the screen.
  connectBtn.mouseClicked(onConnectButtonClicked); // When the button is clicked, run the onConnectButtonClicked function
}

function checkPort() {
  if (!port.opened()) {
    // If the port is not open, change button text
    connectBtn.html("Connect to Arduino");
    // Set background to gray
    background("gray");
    return false;
  } else {
    // Otherwise we are connected
    connectBtn.html("Disconnect");
    return true;
  }
}

function onConnectButtonClicked() {
  // When the connect button is clicked
  if (!port.opened()) {
    // If the port is not opened, we open it
    port.open(baudRate);
  } else {
    // Otherwise, we close it!
    port.close();
  }
}
