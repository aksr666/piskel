const createFrame = (size) => {
    const frame = {};
    frame.layers = [Array.from(Array(size).fill([0, 0, 0, 0]), () => new Array(size).fill([0, 0, 0, 0]))];
    frame.currentLayer = 0;
    return frame;
};

const createLayer = (size) => Array.from(Array(size).fill([0, 0, 0, 0]), () => new Array(size).fill([0, 0, 0, 0]));

const renderLayers = (canvas, layers, currentLayer, pikselSize) => {
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    layers.forEach((layer, index) => {
        if (index === currentLayer) {
            layer.forEach((item, i) => {
                item.forEach((item, j) => {
                    if (item.toString() === [0, 0, 0, 0].toString()) return;
                    context.fillStyle = item;
                    context.fillStyle = `rgba(${item.join()})`;
                    context.fillRect(pikselSize * i, pikselSize * j, pikselSize, pikselSize);
                });
            });
        } else {
            layer.forEach((item, i) => {
                item.forEach((item, j) => {
                    if (item.toString() === [0, 0, 0, 0].toString()) return;
                    item.splice(item.length - 1, 1, '.5');
                    const fill = `rgba(${item.join()})`;
                    context.fillStyle = item;
                    context.fillStyle = fill;
                    context.fillRect(pikselSize * i, pikselSize * j, pikselSize, pikselSize);
                });
            });
        }
    });
}

const createFrameCopy = (copy) => JSON.parse(JSON.stringify(copy));

const createFramesCopy = (frames) => JSON.parse(JSON.stringify(frames)).map((frame) => JSON.parse(JSON.stringify(frame)));

const renderCanvas = (canvas, frame, pikselSize, layers) => {
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (layers) {
        frame.forEach((layer) => {
            layer.forEach((item, i) => {
                item.forEach((item, j) => {
                    if (item.toString() === [0, 0, 0, 0].toString()) return;
                    context.fillStyle = item;
                    context.fillStyle = `rgba(${item.join()})`;
                    context.fillRect(pikselSize * i, pikselSize * j, pikselSize, pikselSize);
                });
            });
        });
    }
    else {
        frame.forEach((item, i) => {
            item.forEach((item, j) => {
                if (item.toString() === [0, 0, 0, 0].toString()) return;
                context.fillStyle = item;
                context.fillStyle = `rgba(${item.join()})`;
                context.fillRect(pikselSize * i, pikselSize * j, pikselSize, pikselSize);
            });
        });
    }
}

const resize = (frames, currentSize, size) => {
    const addCells = (frame) => {
        let length = frame.length;
        while (length !== size) {
            frame.push(new Array(size).fill([0, 0, 0, 0]));
            frame.unshift(new Array(size).fill([0, 0, 0, 0]));
            length = frame.length;
        }
        frame.forEach((item) => {
            let letngth = item.length;
            while (letngth !== size) {
                item.push([0, 0, 0, 0]);
                item.unshift([0, 0, 0, 0]);
                letngth = item.length;
            }
        });
        return frame;
    }

    const removeCells = (frame) => {
        let length = frame.length;
        while (length !== size) {
            frame.pop();
            frame.shift();
            length = frame.length;
        }
        frame.forEach((item) => {
            let length = item.length;
            while (length !== size) {
                item.pop();
                item.shift();
                length = item.length;
            }
        });
        return frame;
    }
    if (currentSize < size) frames.forEach((item) => item.layers.forEach((layer) => addCells(layer)));
    else frames.forEach((item) => item.layers.forEach((layer) => removeCells(layer)));
    return frames;
}

const createStateCopy = (state, frames) => {
    const framesCopy = createFramesCopy(frames);
    const stateCopy = Object.assign({}, state, { framesToSaveAsApng: null }, { framesToSaveAsGif: null }, { stateHistory: null });
    stateCopy.frames = framesCopy;
    return stateCopy;
}

const saveToGoogleDrive = (fileContent) => {
    const file = new Blob([fileContent], { type: 'image/apng' });
    const metadata = {
        'name': 'newPiskel.apng',
        'mimeType': 'apng',
    };
    const accessToken = window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);
    fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
        name: 'piskel.jpg',
        method: 'POST',
        headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
        body: form,
    });
}

const saveAsPiskel = (animationSpeed, size, framesCount, images) => {
    return `{"modelVersion":2,"piskel":{"name":"piskel","description":"","fps":${animationSpeed},"height":${size},"width":${size},"layers":["{"name":"Layer 1","opacity":1,"frameCount":${framesCount},"chunks":[{"layout":[[0]],"base64PNG":"data: ${images}}]"hiddenFrames":[]}"]}}`;
}

const uploadProject = (cb) => {
    const file = window.URL.createObjectURL(document.querySelector('input[type=file]').files[0]);
    const rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) cb(rawFile.responseText);      
    }
    rawFile.send(null);
};

export {
    createFrame,
    createFrameCopy,
    renderCanvas,
    resize,
    createFramesCopy,
    createStateCopy,
    renderLayers,
    createLayer,
    saveToGoogleDrive,
    saveAsPiskel,
    uploadProject
}
