const convertHexToRgba = (hex) => {
  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return [(c >> 16) & 255, (c >> 8) & 255, c & 255, 1];
  }
}

const convertRgbToHex = (rgb) => {
  rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
  return (rgb && rgb.length === 4) ? "#" +
    ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
}

const pen = (e, x, y, frame, colors) => {
  e.nativeEvent.buttons === 1 ? frame[x][y] = convertHexToRgba(colors.main) : frame[x][y] = convertHexToRgba(colors.extra);
}

const eraser = (x, y, frame) => {
  frame[x][y] = [0, 0, 0, 0];
}

const mirror = (e, x, y, frame, colors) => {
  const x1 = frame.length - x - 1;
  const y1 = frame.length - y - 1;
  if (e.ctrlKey) {
    e.nativeEvent.buttons === 1 ? frame[x][y] = convertHexToRgba(colors.main) : frame[x][y] = convertHexToRgba(colors.extra);
    e.nativeEvent.buttons === 1 ? frame[x][y1] = convertHexToRgba(colors.main) : frame[x][y1] = convertHexToRgba(colors.extra);
  } else if (e.shiftKey) {
    e.nativeEvent.buttons === 1 ? frame[x][y] = convertHexToRgba(colors.main) : frame[x][y] = convertHexToRgba(colors.extra);
    e.nativeEvent.buttons === 1 ? frame[x1][y] = convertHexToRgba(colors.main) : frame[x1][y] = convertHexToRgba(colors.extra);
    e.nativeEvent.buttons === 1 ? frame[x][y1] = convertHexToRgba(colors.main) : frame[x][y1] = convertHexToRgba(colors.extra);
    e.nativeEvent.buttons === 1 ? frame[x1][y1] = convertHexToRgba(colors.main) : frame[x1][y1] = convertHexToRgba(colors.extra);
  } else {
    e.nativeEvent.buttons === 1 ? frame[x][y] = convertHexToRgba(colors.main) : frame[x][y] = convertHexToRgba(colors.extra);
    e.nativeEvent.buttons === 1 ? frame[x1][y] = convertHexToRgba(colors.main) : frame[x1][y] = convertHexToRgba(colors.extra);
  }
}

const bucket = (e, frame, x, y, size, colors) => {
  const colorsMatch = (a, b) => a.toString() === b.toString();
  let fillColor = convertHexToRgba(colors.main);
  if (e.shiftKey) fillColor = convertHexToRgba(colors.extra);
  const targetColor = frame[x][y];
  if (!colorsMatch(targetColor, fillColor)) {
    const pixelsToCheck = [x, y];
    while (pixelsToCheck.length > 0) {
      const y = pixelsToCheck.pop();
      const x = pixelsToCheck.pop();
      let curColor = null;
      if (x >= 0 && x < size && y >= 0 && y < size) curColor = frame[x][y];
      if (curColor && colorsMatch(curColor, targetColor)) {
        frame[x][y] = fillColor;
        pixelsToCheck.push(x + 1, y);
        pixelsToCheck.push(x - 1, y);
        pixelsToCheck.push(x, y + 1);
        pixelsToCheck.push(x, y - 1);
      }
    }
  }
}

const brush = (e, frame, colors) => {
  if (e.shiftKey) {
    frame.layers.forEach((layer) => {
      layer.forEach((item, i) => {
        item.forEach((item, j) => {
          layer[i][j] = convertHexToRgba(colors.main);
        });
      });
    });
  }
  frame.layers[frame.currentLayer].forEach((item, i) => {
    item.forEach((item, j) => {
      frame.layers[frame.currentLayer][i][j] = convertHexToRgba(colors.main);
    });
  });
}

const horizontalReverse = (frame) => {
  frame.reverse();
}

const verticalReverse = (frame) => {
  frame.map(item => item.reverse());
}

const stroke = (e, x1, y1, x2, y2, frame, colors) => {
  let deltaX = Math.abs(x2 - x1);
  let deltaY = Math.abs(y2 - y1);
  let signX = x1 < x2 ? 1 : -1;
  let signY = y1 < y2 ? 1 : -1;
  let error = deltaX - deltaY;
  e.nativeEvent.buttons === 1 ? frame[x2][y2] = convertHexToRgba(colors.main) : frame[x2][y2] = convertHexToRgba(colors.extra);
  while (x1 !== x2 || y1 !== y2) {
    frame[x1][y1] = e.nativeEvent.buttons === 1 ? frame[x1][y1] = convertHexToRgba(colors.main) : frame[x1][y1] = convertHexToRgba(colors.extra);
    let error2 = error * 2;
    if (error2 > -deltaY) {
      error -= deltaY;
      x1 += signX;
    }
    if (error2 < deltaX) {
      error += deltaX;
      y1 += signY;
    }
  }
  return frame;
}

const rectangle = (e, startCoords, x1, y1, frame, colors) => {
  let x = startCoords.x;
  let y = startCoords.y;
  while (x !== x1) {
    e.nativeEvent.buttons === 1 ? frame[x][startCoords.y] = convertHexToRgba(colors.main) : frame[x][startCoords.y] = convertHexToRgba(colors.extra);
    if (startCoords.x < x1) x = x += 1;
    else x = x -= 1
  }
  while (y !== y1) {
    e.nativeEvent.buttons === 1 ? frame[startCoords.x][y] = convertHexToRgba(colors.main) : frame[startCoords.x][y] = convertHexToRgba(colors.extra);
    e.nativeEvent.buttons === 1 ? frame[x][y] = convertHexToRgba(colors.main) : frame[x][y] = convertHexToRgba(colors.extra);
    if (startCoords.y < y1) y++;
    else y--;
  }
  while (x !== startCoords.x) {
    e.nativeEvent.buttons === 1 ? frame[x][y] = convertHexToRgba(colors.main) : frame[x][y] = convertHexToRgba(colors.extra);
    if (startCoords.x < x) x--;
    else x++;
    e.nativeEvent.buttons === 1 ? frame[x][y] = convertHexToRgba(colors.main) : frame[x][y] = convertHexToRgba(colors.extra);
  }
  return frame;
}

const drawCircle = (e, frame, startCoords, x, y, colors, size) => {
  let radius = Math.floor(Math.sqrt(Math.pow(startCoords.x - x, 2) + Math.pow(startCoords.y - y, 2), 2));
  let x0 = 0, y0 = radius, gap = 0, delta = (2 - 2 * radius);
  while (y0 >= 0) {
    if (startCoords.x + x0 >= 0 && startCoords.x + x0 <= size - 1
      && startCoords.y - y0 >= 0 && startCoords.y - y0 <= size - 1) e.nativeEvent.buttons === 1 ? frame[startCoords.x + x0][startCoords.y - y0] = convertHexToRgba(colors.main) : frame[startCoords.x + x0][startCoords.y - y0] = convertHexToRgba(colors.extra);
    if (startCoords.x - x0 >= 0 && startCoords.x - x0 <= size - 1
      && startCoords.y - y0 >= 0 && startCoords.y - y0 <= size - 1) e.nativeEvent.buttons === 1 ? frame[startCoords.x - x0][startCoords.y - y0] = convertHexToRgba(colors.main) : frame[startCoords.x - x0][startCoords.y - y0] = convertHexToRgba(colors.extra);
    if (startCoords.x - x0 >= 0 && startCoords.x - x0 <= size - 1
      && startCoords.y + y0 >= 0 && startCoords.y + y0 <= size - 1) e.nativeEvent.buttons === 1 ? frame[startCoords.x - x0][startCoords.y + y0] = convertHexToRgba(colors.main) : frame[startCoords.x - x0][startCoords.y + y0] = convertHexToRgba(colors.extra);
    if (startCoords.x + x0 >= 0 && startCoords.x + x0 <= size - 1
      && startCoords.y + y0 >= 0 && startCoords.y + y0 <= size - 1) e.nativeEvent.buttons === 1 ? frame[startCoords.x + x0][startCoords.y + y0] = convertHexToRgba(colors.main) : frame[startCoords.x + x0][startCoords.y + y0] = convertHexToRgba(colors.extra);
    gap = 2 * (delta + y0) - 1;
    if (delta < 0 && gap <= 0) {
      x0++;
      delta += 2 * x0 + 1;
      continue;
    }
    if (delta > 0 && gap > 0) {
      y0--;
      delta -= 2 * y0 + 1;
      continue;
    }
    x0++;
    delta += 2 * (x0 - y0);
    y0--;
  }
  return frame;
}

const lighten = (e, frame, pikselSize) => {
  const opacityValues = ['1', '.9', '.8', '.7', '.6', '.5', '.4', '.3', '.2', '.1']
  const x = Math.floor(e.nativeEvent.offsetX / pikselSize);
  const y = Math.floor(e.nativeEvent.offsetY / pikselSize);
  let color = frame[x][y];
  if (!color) return;
  let currentOpacity = color[3];
  if (e.shiftKey) {
    const newOpacity = opacityValues[opacityValues.indexOf(currentOpacity) - 1];
    color[3] = newOpacity;
    frame[x][y] = color;
  } else {
    const newOpacity = opacityValues[opacityValues.indexOf(currentOpacity) + 1];
    color[3] = newOpacity;
    frame[x][y] = color;
  }
}

const dithering = (e, x, y, frame, colors, size) => {
  const checkAround = (frame, x, y, top, left, bot, right) => {
    let t, l, b, r;
    if (top) t = frame[x][y - 1].toString() === frame[x][y].toString();
    if (left) l = frame[x - 1][y].toString() === frame[x][y].toString();
    if (bot) b = frame[x][y + 1].toString() === frame[x][y].toString();
    if (right) r = frame[x + 1][y].toString() === frame[x][y].toString();
    return r || l || t || b;
  }
  const currentColor = frame[x][y];
  frame[x][y] = convertHexToRgba(colors.main);
  let checked = null;
  if (x > 0 && x < size - 1 && y > 0 && y < size - 1) checked = checkAround(frame, x, y, true, true, true, true);
  if (x === 0 && y !== 0 && y !== size - 1) checked = checkAround(frame, x, y, true, false, true, true);
  if (y === 0 && x !== 0 && x !== size - 1) checked = checkAround(frame, x, y, false, true, true, true);
  if (x === size - 1 && y !== size - 1 && y !== 0) checked = checkAround(frame, x, y, true, true, true, false);
  if (y === size - 1 && x !== size - 1 && x !== 0) checked = checkAround(frame, x, y, true, true, false, true);
  if (x === 0 && y === 0) checked = checkAround(frame, x, y, false, false, true, true);
  if (x === size - 1 && y === size - 1) checked = checkAround(frame, x, y, true, true, false, false);
  if (x === size - 1 && y === 0) checked = checkAround(frame, x, y, false, true, true, false);
  if (x === 0 && y === size - 1) checked = checkAround(frame, x, y, true, false, false, true);
  if (e.shiftKey) {
    if (checked) frame[x][y] = convertHexToRgba(colors.extra);
    else frame[x][y] = convertHexToRgba(colors.main);
  } else {
    if (checked) frame[x][y] = currentColor;
    else frame[x][y] = convertHexToRgba(colors.main);
  }
}


const colorPicker = (e, frame, startCoords, callback) => {
  let pixel = frame[startCoords.x][startCoords.y];
  if (!pixel) return;
  e.shiftKey ? callback(convertRgbToHex(`rgba(${pixel.join()})`)) : callback(convertRgbToHex(`rgba(${pixel.join()})`), true);
}

const move = (x1, y1, startCoords, frame, size) => {
  let y = startCoords.y - y1;
  let x = startCoords.x - x1;
  if (x > 0) {
    while (x !== 0) {
      frame.shift();
      frame.push(new Array(size).fill([0, 0, 0, 0]));
      x--;
    }
  }
  if (x < 0) {
    while (x !== 0) {
      frame.unshift(new Array(size).fill([0, 0, 0, 0]));
      frame.pop();
      x++;
    }
  }
  if (y > 0) {
    while (y !== 0) {
      frame.forEach((item) => {
        item.shift();
        item.push([0, 0, 0, 0]);
      });
      y--;
    }
  }
  if (y < 0) {
    while (y !== 0) {
      frame.forEach((item) => {
        item.unshift([0, 0, 0, 0]);
        item.pop();
      });
      y++;
    }
  }
  startCoords.y = y1;
  startCoords.x = x1;
}

export {
  pen,
  eraser,
  stroke,
  mirror,
  bucket,
  rectangle,
  drawCircle,
  lighten,
  dithering,
  colorPicker,
  move,
  convertHexToRgba,
  brush,
  verticalReverse,
  horizontalReverse,
}






