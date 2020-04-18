function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomHex() {
  const options = "1234567890abcdef";
  let s = "0x";

  for (let i = 0; i < 6; i++) {
    s += options.charAt(getRandomInt(0, options.length - 1));
  }

  return s;
}
