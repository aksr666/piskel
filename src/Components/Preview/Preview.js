import React from 'react';
import { renderCanvas } from '../Piskel/utils';

export default class Preview extends React.Component {
    constructor(props) {
        super(props);
        this.readyToSave = false;
        this.imgsToGif = [];
        this.imgsToPng = [];
        this.framesToShow = [];
        this.interval = null;
        this.canvasSize = 384;
        this.currentFrame = 0;
        this.state = {
            speed: 12
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { frames, canvasSize } = this.props;
        let { canvas, pikselSize, currentFrame } = this;
        if (JSON.stringify(frames) === JSON.stringify(nextProps.frames) && nextState.speed === this.state.speed) return false;
        else {
            pikselSize = Math.floor(this.canvasSize / canvasSize);
            currentFrame = 0;
            renderCanvas(canvas, frames[currentFrame].layers[frames[currentFrame].currentLayer], pikselSize);
            return true;
        }
    }

    componentDidMount() {
        const { canvas } = this.refs;
        const { canvasSize } = this.props;
        this.pikselSize = Math.floor(this.canvasSize / canvasSize);
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.startAnimation();
    }

    componentDidUpdate() {
        const { interval } = this;
        const { frames, canvasSize } = this.props;
        clearInterval(interval);
        this.framesToShow = [];
        this.readyToSave = false;
        this.imgsToGif = [];
        this.imgsToPng = [];
        this.pikselSize = Math.floor(this.canvasSize / canvasSize);
        this.currentFrame = 0;
        if (frames[this.currentFrame].layers.length > 1) renderCanvas(this.canvas, frames[this.currentFrame].layers, this.pikselSize, true);
        else renderCanvas(this.canvas, frames[this.currentFrame].layers[0], this.pikselSize);
        this.startAnimation();
    }

    startAnimation() {
        let { framesToShow, ctx, currentFrame, pikselSize, canvasSize, readyToSave, imgsToGif, imgsToPng, canvas } = this;
        const { frames, setFramesToSave } = this.props;
        const { speed } = this.state;
        this.interval = setInterval(() => {
            if (framesToShow.length === frames.length) ctx.putImageData(framesToShow[currentFrame], 0, 0);
            else {
                renderCanvas(canvas, frames[currentFrame].layers, pikselSize, true);
                framesToShow.push(ctx.getImageData(0, 0, canvasSize, canvasSize));
            }
            if (imgsToGif.length !== frames.length && !readyToSave) {
                imgsToGif.push(canvas.toDataURL("image/png"));
                imgsToPng.push(ctx.getImageData(0, 0, canvasSize, canvasSize).data.buffer);
            }
            else {
                if (readyToSave === false) {
                    setFramesToSave(imgsToGif, imgsToPng, speed);
                    readyToSave = true;
                }
            }
            currentFrame++;
            if (currentFrame === frames.length) currentFrame = 0;
        }, 1000 / speed);
    }

    setSpeed(e) {
        const { interval } = this.state;
        clearInterval(interval);
        const speed = e.target.value;
        this.setState({ speed });
        this.startAnimation();
    }

    toggleFullscreen() {
        let elem = document.querySelector(".preview-wrapper");
        if (!document.fullscreenElement) {
            elem.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    showFullScreenButton() {
        const { fsButton } = this.refs;
        fsButton.style.opacity = '1';
    }

    hideFullScreenButton() {
        const { fsButton } = this.refs;
        fsButton.style.opacity = '0';
    }

    render() {
        return (
            <div className='previev-container'>
                <div onMouseEnter={() => this.showFullScreenButton()} onMouseLeave={() => this.hideFullScreenButton()} className={'preview-wrapper'}>
                    <canvas
                        className='preview'
                        ref='canvas'
                        width={this.canvasSize}
                        height={this.canvasSize}
                    />
                    <button className={'preview-fullscreen'} ref='fsButton' onClick={(e) => this.toggleFullscreen(e)}></button>
                </div>
                <p>{`FPS Rate: ${this.state.speed}`}</p>
                <input
                    onInput={(e) => this.setSpeed(e)}
                    type='range'
                    min="1"
                    max="24"
                    defaultValue='12' />
            </div>
        )
    }
}