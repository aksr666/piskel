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
        this.pikselSize = null;
        this.canvas = null;
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
        const canvas = this.refs.canvas;
        this.pikselSize = Math.floor(this.canvasSize / this.props.canvasSize);
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        renderCanvas(canvas, this.props.frame.layers[this.props.frame.currentLayer], this.pikselSize);
    }

    componentDidUpdate() {
        this.pikselSize = this.canvasSize / this.props.canvasSize;
        if (this.frameCopy) return;
        if (this.state.showLayers) renderLayers(this.canvas, createFramesCopy(this.props.frame.layers), this.props.frame.currentLayer, this.pikselSize);
        else renderCanvas(this.canvas, this.props.frame.layers[this.props.frame.currentLayer], this.pikselSize);
    }

    mouseDownHandler(e) {
        e.preventDefault();
        this.isDrawing = true;
        this.startCoords.x = Math.floor(e.nativeEvent.offsetX / this.pikselSize);
        this.startCoords.y = Math.floor(e.nativeEvent.offsetY / this.pikselSize);
        if (this.props.tools.Stroke.value || this.props.tools.Rectangle.value || this.props.tools.Circle.value) this.frameCopy = createFrameCopy(this.props.frame);
        if (this.props.tools.Pen.value) pen(e, this.startCoords.x, this.startCoords.y, this.props.frame.layers[this.props.frame.currentLayer], this.props.colors);
        this.state.showLayers ? renderLayers(this.canvas, createFramesCopy(this.props.frame.layers), this.props.frame.currentLayer, this.pikselSize)
        : renderCanvas(this.canvas, this.props.frame.layers[this.props.frame.currentLayer], this.pikselSize);
    }

    mouseMoveHandler(e) {
        let x = Math.floor(e.nativeEvent.offsetX / this.pikselSize);
        let y = Math.floor(e.nativeEvent.offsetY / this.pikselSize);
        if (x <= 0) x = 0;
        if (x > this.props.canvasSize - 1) x = this.props.canvasSize - 1;
        if (y <= 0) y = 0;
        if (y > this.props.canvasSize - 1) y = this.props.canvasSize - 1;
        if (this.props.tools.Pen.value && this.isDrawing) pen(e, x, y, this.props.frame.layers[this.props.frame.currentLayer], this.props.colors);
        if (this.props.tools.Mirror.value && this.isDrawing) mirror(e, x, y, this.props.frame.layers[this.props.frame.currentLayer], this.props.colors);
        if (this.props.tools.Dithering.value && this.isDrawing) dithering(e, x, y, this.props.frame.layers[this.props.frame.currentLayer], this.props.colors, this.props.canvasSize);
        if (this.props.tools.Move.value && this.isDrawing) move(x, y, this.startCoords, this.props.frame.layers[this.props.frame.currentLayer], this.props.canvasSize);
        if (this.props.tools.Eraser.value && this.isDrawing) eraser(x, y, this.props.frame.layers[this.props.frame.currentLayer]);
        if (this.props.tools.Stroke.value && this.isDrawing) {
            const clone = createFrameCopy(this.props.frame);
            this.frameCopy.layers[this.frameCopy.currentLayer] = stroke(e, this.startCoords.x, this.startCoords.y, x, y, clone.layers[clone.currentLayer], this.props.colors);
            this.state.showLayers ? renderLayers(this.canvas, createFramesCopy(this.frameCopy.layers), this.props.frame.currentLayer, this.pikselSize) 
            : renderCanvas(this.canvas, this.frameCopy.layers[this.frameCopy.currentLayer], this.pikselSize);
        }
        if (this.props.tools.Rectangle.value && this.isDrawing) {
            const clone = createFrameCopy(this.props.frame);
            this.frameCopy.layers[this.frameCopy.currentLayer] = rectangle(e, this.startCoords, x, y, clone.layers[clone.currentLayer], this.props.colors);
            this.state.showLayers ? renderLayers(this.canvas, createFramesCopy(this.frameCopy.layers), this.props.frame.currentLayer, this.pikselSize) 
            : renderCanvas(this.canvas, this.frameCopy.layers[this.frameCopy.currentLayer], this.pikselSize);
        }
        if (this.props.tools.Circle.value && this.isDrawing) {
            const clone = createFrameCopy(this.props.frame);
            this.frameCopy.layers[this.frameCopy.currentLayer] = drawCircle(e, clone.layers[clone.currentLayer], this.startCoords, x, y, this.props.colors, this.props.canvasSize);
            this.state.showLayers ? renderLayers(this.canvas, createFramesCopy(this.frameCopy.layers), this.props.frame.currentLayer, this.pikselSize) 
            : renderCanvas(this.canvas, this.frameCopy.layers[this.frameCopy.currentLayer], this.pikselSize);
        }
        this.setMousePosition({ x, y });
    }

    mouseUpHandler() {
        this.isDrawing = false;
        if (this.frameCopy) {
            this.props.updateFrames(this.frameCopy);
            this.frameCopy = null;
        }
        else if (!this.props.tools.Bucket.value 
            && !this.props.tools.ColorPicker.value
            && !this.props.tools.Lighten.value 
            && !this.props.tools.Brush.value
            && !this.props.tools.VerticalReverse.value 
            && !this.props.tools.HorizontalReverse.value) this.props.updateFrames(this.props.frame);
    }

    mouseClickHandler(e) {
        e.preventDefault();
        if (this.props.tools.Bucket.value) bucket(e, this.props.frame.layers[this.props.frame.currentLayer], this.startCoords.x, this.startCoords.y, this.props.canvasSize, this.props.colors);
        if (this.props.tools.ColorPicker.value) colorPicker(e, this.props.frame.layers[this.props.frame.currentLayer], this.startCoords, this.props.setColor);
        if (this.props.tools.Lighten.value) lighten(e, this.props.frame.layers[this.props.frame.currentLayer], this.pikselSize);
        if (this.props.tools.Brush.value) brush(e, this.props.frame, this.props.colors);
        if (this.props.tools.VerticalReverse.value) verticalReverse(this.props.frame.layers[this.props.frame.currentLayer]);
        if (this.props.tools.HorizontalReverse.value) horizontalReverse(this.props.frame.layers[this.props.frame.currentLayer]);
        this.state.showLayers ? renderLayers(this.canvas, createFramesCopy(this.props.frame.layers), this.props.frame.currentLayer, this.pikselSize) 
        : renderCanvas(this.canvas, this.props.frame.layers[this.props.frame.currentLayer], this.pikselSize);
        if (this.props.tools.Bucket.value 
            || this.props.tools.ColorPicker.value
            || this.props.tools.Lighten.value 
            || this.props.tools.Brush.value
            || this.props.tools.VerticalReverse.value 
            || this.props.tools.HorizontalReverse.value) this.props.updateFrames(this.props.frame);
    }

    mouseLeaveHandler() {
        if (this.isDrawing) {
            if (this.frameCopy) {
                renderCanvas(this.canvas, this.frameCopy, this.pikselSize);
                this.props.frame.layers[this.props.frame.currentLayer] = this.frameCopy;
                this.props.updateFrames(this.props.frame);
                this.frameCopy = null;
            } else {
                this.props.updateFrames(this.props.frame);
            }
        }
        this.isDrawing = false;
    }
    
    mouseWheelHandler(e) {
        e = window.event;
        let delta = Math.max(-1, Math.min(1, e.wheelDelta));
        this.refs.canvas.style.width = Math.max(640, Math.min(900, this.refs.canvas.offsetWidth + (32 * delta))) + "px";
        this.refs.canvas.style.height = Math.max(640, Math.min(900, this.refs.canvas.offsetHeight + (32 * delta))) + "px";
    }

    setCurrentLayer(value) {
        this.props.frame.currentLayer = value;
        this.currentLayer = value;
        this.props.updateFrames(this.props.frame);
    }

    addLayer() {
        this.props.frame.layers.push(createLayer(this.props.canvasSize));
        this.props.frame.currentLayer++;
        this.props.updateFrames(this.props.frame);
    }

    deleteLayer() {
        this.props.frame.layers.splice(this.props.frame.currentLayer, 1);
        if (this.props.frame.currentLayer !== 0) this.props.frame.currentLayer--;
        this.props.updateFrames(this.props.frame);
    }

    toggleShowLayers() {
        this.setState((state) => {
            return { showLayers: !state.showLayers };
        });
    }

    setNextLayer() {
        if (this.props.frame.currentLayer !== this.props.frame.layers.length - 1) {
            this.props.frame.currentLayer++;
            this.props.updateFrames(this.props.frame);
        }
    }

    setPreviousLayer() {
        if (this.props.frame.currentLayer !== 0) {
            this.props.frame.currentLayer--;
            this.props.updateFrames(this.props.frame);
        }
    }

    setLayersToSwap(num, first) {
        if (first) this.layersToSwap.firstLayer = num;
        else this.layersToSwap.secondLayer = num;
    }

    swapLayers() {
        const firstLayer = this.props.frame.layers[this.layersToSwap.firstLayer];
        const secondLayer = this.props.frame.layers[this.layersToSwap.secondLayer];
        this.props.frame.layers.splice(this.layersToSwap.firstLayer, 1, secondLayer);
        this.props.frame.layers.splice(this.layersToSwap.secondLayer, 1, firstLayer);
        this.props.updateFrames(this.props.frame);
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
                        onWheel = {(e) => this.mouseWheelHandler()}
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

