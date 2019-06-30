import React from 'react';
import CanvasInfo from './CanvasInfo';
import Layers from './Layers';
import { renderCanvas, createFrameCopy, createFramesCopy, renderLayers, createLayer } from '../Piskel/utils';
import { drawCircle, pen, eraser, stroke, mirror, bucket, rectangle, lighten, dithering, colorPicker, move, brush, verticalReverse, horizontalReverse } from './Tools';

export default class Canvas extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mousePosition: { x: 0, y: 0 },
            showLayers: false,
        }
        this.layersToSwap = {
            firstLayer: null,
            secondLayer: null,
        }
        this.isDrawing = false;
        this.canvasSize = 640;
        this.startCoords = {};
        this.frameCopy = null;
    }

    setMousePosition(value) {
        const mousePosition = Object.assign({}, this.state.mousePosition);
        mousePosition.x = value.x;
        mousePosition.y = value.y;
        this.setState({ mousePosition });
    }

    componentDidMount() {
        const { frame, canvasSize } = this.props;
        const { canvas } = this.refs;
        this.pikselSize = Math.floor(this.canvasSize / canvasSize);
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        renderCanvas(canvas, frame.layers[frame.currentLayer], this.pikselSize);
    }

    componentDidUpdate() {
        const { frame, canvasSize } = this.props;
        this.pikselSize = this.canvasSize / canvasSize;
        const { showLayers } = this.state;
        const { canvas, pikselSize, frameCopy } = this;
        if (frameCopy) return;
        if (showLayers) renderLayers(canvas, createFramesCopy(frame.layers), frame.currentLayer, pikselSize);
        else renderCanvas(canvas, frame.layers[frame.currentLayer], pikselSize);
    }

    mouseDownHandler(e) {
        e.preventDefault();
        this.isDrawing = true;
        const { tools, frame, colors } = this.props;
        const { showLayers } = this.state;
        let { startCoords, pikselSize, canvas } = this;
        this.startCoords.x = Math.floor(e.nativeEvent.offsetX / pikselSize);
        this.startCoords.y = Math.floor(e.nativeEvent.offsetY / pikselSize);
        if (tools.Stroke.value || tools.Rectangle.value || tools.Circle.value) this.frameCopy = createFrameCopy(frame);
        if (tools.Pen.value) pen(e, startCoords.x, startCoords.y, frame.layers[frame.currentLayer], colors);
        showLayers ? renderLayers(canvas, createFramesCopy(frame.layers), frame.currentLayer, pikselSize)
            : renderCanvas(canvas, frame.layers[frame.currentLayer], pikselSize);
    }

    mouseMoveHandler(e) {
        const { tools, frame, colors, canvasSize } = this.props;
        const { showLayers } = this.state;
        const { frameCopy, startCoords, pikselSize, canvas, isDrawing } = this;
        let x = Math.floor(e.nativeEvent.offsetX / pikselSize);
        let y = Math.floor(e.nativeEvent.offsetY / pikselSize);
        if (x <= 0) x = 0;
        if (x > canvasSize - 1) x = canvasSize - 1;
        if (y <= 0) y = 0;
        if (y > canvasSize - 1) y = canvasSize - 1;
        if (tools.Pen.value && isDrawing) pen(e, x, y, frame.layers[frame.currentLayer], colors);
        if (tools.Mirror.value && isDrawing) mirror(e, x, y, frame.layers[frame.currentLayer], colors);
        if (tools.Dithering.value && isDrawing) dithering(e, x, y, frame.layers[frame.currentLayer], colors, canvasSize);
        if (tools.Move.value && isDrawing) move(x, y, startCoords, frame.layers[frame.currentLayer], canvasSize);
        if (tools.Eraser.value && isDrawing) eraser(x, y, frame.layers[frame.currentLayer]);
        if (tools.Stroke.value && isDrawing) {
            const clone = createFrameCopy(frame);
            frameCopy.layers[frameCopy.currentLayer] = stroke(e, startCoords.x, startCoords.y, x, y, clone.layers[clone.currentLayer], colors);
            showLayers ? renderLayers(canvas, createFramesCopy(frameCopy.layers), frame.currentLayer, pikselSize)
                : renderCanvas(canvas, frameCopy.layers[frameCopy.currentLayer], pikselSize);
        }
        if (tools.Rectangle.value && isDrawing) {
            const clone = createFrameCopy(frame);
            frameCopy.layers[frameCopy.currentLayer] = rectangle(e, startCoords, x, y, clone.layers[clone.currentLayer], colors);
            showLayers ? renderLayers(canvas, createFramesCopy(frameCopy.layers), frame.currentLayer, pikselSize)
                : renderCanvas(canvas, frameCopy.layers[frameCopy.currentLayer], pikselSize);
        }
        if (tools.Circle.value && isDrawing) {
            const clone = createFrameCopy(frame);
            frameCopy.layers[frameCopy.currentLayer] = drawCircle(e, clone.layers[clone.currentLayer], startCoords, x, y, colors, canvasSize);
            showLayers ? renderLayers(canvas, createFramesCopy(frameCopy.layers), frame.currentLayer, pikselSize)
                : renderCanvas(canvas, frameCopy.layers[frameCopy.currentLayer], pikselSize);
        }
        this.setMousePosition({ x, y });
    }

    mouseUpHandler() {
        this.isDrawing = false;
        const { tools, frame, updateFrames } = this.props;
        const { frameCopy } = this;
        if (frameCopy) {
            updateFrames(frameCopy);
            this.frameCopy = null;
        }
        else if (!tools.Bucket.value && !tools.ColorPicker.value && !tools.Lighten.value
            && !tools.Brush.value && !tools.VerticalReverse.value && !tools.HorizontalReverse.value) updateFrames(frame);
    }

    mouseClickHandler(e) {
        e.preventDefault();
        const { tools, frame, colors, canvasSize, setColor, updateFrames } = this.props;
        const { showLayers } = this.state;
        const { startCoords, pikselSize, canvas } = this;
        if (tools.Bucket.value) bucket(e, frame.layers[frame.currentLayer], startCoords.x, startCoords.y, canvasSize, colors);
        if (tools.ColorPicker.value) colorPicker(e, frame.layers[frame.currentLayer], startCoords, setColor);
        if (tools.Lighten.value) lighten(e, frame.layers[frame.currentLayer], pikselSize);
        if (tools.Brush.value) brush(e, frame, colors);
        if (tools.VerticalReverse.value) verticalReverse(frame.layers[frame.currentLayer]);
        if (tools.HorizontalReverse.value) horizontalReverse(frame.layers[frame.currentLayer]);
        showLayers ? renderLayers(canvas, createFramesCopy(frame.layers), frame.currentLayer, pikselSize)
            : renderCanvas(canvas, frame.layers[frame.currentLayer], pikselSize);
        if (tools.Bucket.value
            || tools.ColorPicker.value
            || tools.Lighten.value
            || tools.Brush.value
            || tools.VerticalReverse.value
            || tools.HorizontalReverse.value) updateFrames(frame);
    }

    mouseLeaveHandler() {
        const { frame, updateFrames } = this.props;
        const { frameCopy, pikselSize, canvas, isDrawing } = this;
        if (isDrawing) {
            if (frameCopy) {
                renderCanvas(canvas, frameCopy.layers[frameCopy.currentLayer], pikselSize);
                frame.layers[frame.currentLayer] = frameCopy.layers[frameCopy.currentLayer];
                updateFrames(frame);
                this.frameCopy = null;
            } else {
                updateFrames(frame);
            }
        }
        this.isDrawing = false;
    }

    mouseWheelHandler(e) {
        const { canvas } = this;
        e = window.event;
        let delta = Math.max(-1, Math.min(1, e.wheelDelta));
        canvas.style.width = Math.max(640, Math.min(900, canvas.offsetWidth + (32 * delta))) + "px";
        canvas.style.height = Math.max(640, Math.min(900, canvas.offsetHeight + (32 * delta))) + "px";
    }

    setCurrentLayer(value) {
        const { frame, updateFrames } = this.props;
        frame.currentLayer = value;
        updateFrames(frame);
    }

    addLayer() {
        const { frame, canvasSize, updateFrames } = this.props;
        frame.layers.push(createLayer(canvasSize));
        frame.currentLayer++;
        updateFrames(frame);
    }

    deleteLayer() {
        const { frame, updateFrames } = this.props;
        frame.layers.splice(frame.currentLayer, 1);
        if (frame.currentLayer !== 0) frame.currentLayer -= 1;
        updateFrames(frame);
    }

    toggleShowLayers() {
        this.setState((state) => {
            return { showLayers: !state.showLayers };
        });
    }

    setNextLayer() {
        const { frame, updateFrames } = this.props;
        if (frame.currentLayer !== frame.layers.length - 1) {
            frame.currentLayer++;
            updateFrames(frame);
        }
    }

    setPreviousLayer() {
        const { frame, updateFrames } = this.props;
        if (frame.currentLayer !== 0) {
            frame.currentLayer--;
            updateFrames(frame);
        }
    }

    setLayersToSwap(num, first) {
        const { layersToSwap } = this;
        if (first) layersToSwap.firstLayer = num;
        else layersToSwap.secondLayer = num;
    }

    swapLayers() {
        const { frame, updateFrames } = this.props;
        const { layersToSwap } = this;
        const firstLayer = frame.layers[layersToSwap.firstLayer];
        const secondLayer = frame.layers[layersToSwap.secondLayer];
        frame.layers.splice(layersToSwap.firstLayer, 1, secondLayer);
        frame.layers.splice(layersToSwap.secondLayer, 1, firstLayer);
        updateFrames(frame);
    }

    render() {
        return (
            <div className="canvas-container">
                <CanvasInfo
                    size={this.props.canvasSize}
                    mousePosition={this.state.mousePosition}

                />
                <div className={'canvas-wrapper'} >
                    <canvas
                        className="canvas"
                        ref='canvas'
                        width={this.canvasSize}
                        height={this.canvasSize}
                        onContextMenu={(e) => { e.preventDefault(); }}
                        onMouseDown={(e) => this.mouseDownHandler(e)}
                        onMouseMove={(e) => this.mouseMoveHandler(e)}
                        onMouseUp={() => this.mouseUpHandler()}
                        onClick={(e) => this.mouseClickHandler(e)}
                        onMouseLeave={() => this.mouseLeaveHandler()}
                        onWheel={(e) => this.mouseWheelHandler()}
                    />
                </div>
                <Layers
                    setCurrentLayer={(value) => this.setCurrentLayer(value)}
                    frame={this.props.frame}
                    addLayer={() => this.addLayer()}
                    deleteLayer={() => this.deleteLayer()}
                    showLayers={() => this.toggleShowLayers()}
                    setNextLayer={() => this.setNextLayer()}
                    setPreviousLayer={() => this.setPreviousLayer()}
                    isShowing={this.state.showLayers}
                    setLayersToSwap={(a, b) => this.setLayersToSwap(a, b)}
                    swapLayers={() => this.swapLayers()}
                />
            </div>
        )
    }
}

