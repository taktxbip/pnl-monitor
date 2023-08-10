function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

function shortenNumber(num) {
  let absNum = Math.abs(num);
  let sign = Math.sign(num);
  let unit = "";

  if (absNum >= 1000000) {
    absNum = absNum / 1000000;
    unit = "M";
  } else if (absNum >= 1000) {
    absNum = absNum / 1000;
    unit = "k";
  } else {
    return num.toFixed(1);
  }

  return (sign * absNum).toFixed(1) + unit;
}


export {
  isJson,
  shortenNumber
}