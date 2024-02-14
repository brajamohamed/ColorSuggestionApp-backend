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
