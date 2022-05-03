function randomColor(opacity = false) {
  let colors = [];
  for (let x = 0; x < 3; x++) {
    colors.push(Math.floor(Math.random() * 70) + 70);
  }
  if (opacity) {
    return `rgb(${colors}, 0.4)`;
  } else {
    return `rgb(${colors})`;
  }
}

export default randomColor;