const parse = require("color-2-name");

const colorNature = (value) => {
  const color = parse.closest(value, undefined, { info: true });
  const hsl = color.hsl;
  const trim = hsl.replace("hsl(", "").replace(")", "");
  const colorValue = trim.split(",");
  const saturation = parseFloat(colorValue[1]);

  const colorValues = {
    name: color.name,
    isDark: parse.isDark(value),
    isVibrant: saturation > 60 ? true : false,
  };
  return colorValues;
};
module.exports = colorNature;
// PORT = 4000
// DB=mongodb+srv://brajamohamed:helloworld123@nodejs-task3.pgjnwxt.mongodb.net/capstone?retryWrites=true&w=majority
// JWT=GUVI*123
// EMAIL: b.rajamohamed@gmail.com
// PASS: dzbvjstoohyitonh
