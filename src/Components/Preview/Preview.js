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
        if (JSON.stringify(this.props.frames) === JSON.stringify(nextProps.frames) && nextState.speed === this.state.speed) return false;
        else {
            this.pikselSize = Math.floor(this.canvasSize / this.props.canvasSize);
            this.currentFrame = 0;
            renderCanvas(this.canvas, this.props.frames[this.currentFrame].layers[this.props.frames[this.currentFrame].currentLayer], this.pikselSize);
            return true;
        }
    }

    componentDidMount() {
        const canvas = this.refs.canvas;
        this.pikselSize = Math.floor(this.canvasSize / this.props.canvasSize);
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.startAnimation();
    }

    componentDidUpdate() {
        clearInterval(this.interval);
        this.framesToShow = [];
        this.readyToSave = false;
        this.imgsToGif = [];
        this.imgsToPng = [];
        this.pikselSize = Math.floor(this.canvasSize / this.props.canvasSize); 
        this.currentFrame = 0;
        if (this.props.frames[this.currentFrame].layers.length > 1) renderCanvas(this.canvas, this.props.frames[this.currentFrame].layers, this.pikselSize, true);
        else renderCanvas(this.canvas, this.props.frames[this.currentFrame].layers[0], this.pikselSize);
        this.startAnimation();
    }

    startAnimation() {
        this.interval = setInterval(() => {
            if (this.framesToShow.length === this.props.frames.length) this.ctx.putImageData(this.framesToShow[this.currentFrame], 0, 0);
            else {
                renderCanvas(this.canvas, this.props.frames[this.currentFrame].layers, this.pikselSize, true);
                this.framesToShow.push(this.ctx.getImageData(0, 0, this.canvasSize, this.canvasSize));
            }
            if (this.imgsToGif.length !== this.props.frames.length && !this.readyToSave) {
                this.imgsToGif.push(this.canvas.toDataURL("image/png"));
                this.imgsToPng.push(this.ctx.getImageData(0, 0, this.canvasSize, this.canvasSize).data.buffer);
            }
            else {
                if (this.readyToSave === false) {
                    this.props.setFramesToSave(this.imgsToGif, this.imgsToPng, this.state.speed);
                    this.readyToSave = true;
                }
            }
            this.currentFrame++;
            if (this.currentFrame === this.props.frames.length) this.currentFrame = 0;
        }, 1000 / this.state.speed);
    }

    setSpeed(e) {
        clearInterval(this.interval);
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
        this.refs.fsButton.style.opacity = '1';
    }

    hideFullScreenButton() {
        this.refs.fsButton.style.opacity = '0';
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