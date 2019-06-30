import React from 'react';
import { renderCanvas } from '../Piskel/utils';

export default class Frame extends React.Component {
    constructor(props) {
        super(props);
        this.pikselSize = null;
        this.frameSize = 256;
    }

    shouldComponentUpdate(nextProps) {
        if (JSON.stringify(this.props.frame) === JSON.stringify(nextProps.frame)) return false;
        else return true;
    }

    componentDidMount() {
        const canvas = this.refs.canvas;
        this.canvas = canvas;
        this.pikselSize = Math.floor(this.frameSize / this.props.canvasSize);
        renderCanvas(canvas, this.props.frame.layers[this.props.frame.currentLayer], this.pikselSize);
    }

    componentDidUpdate() {
        this.pikselSize = Math.floor(this.frameSize / this.props.canvasSize);
        renderCanvas(this.canvas, this.props.frame.layers[this.props.frame.currentLayer], this.pikselSize);
    }

    showButtons() {
        this.refs.clone.style.opacity = '1';
        this.refs.delete.style.opacity = '1';
    }

    hideButtons() {
        this.refs.clone.style.opacity = '0';
        this.refs.delete.style.opacity = '0';
    }

    render() {
        return (
            <div onMouseEnter={() => this.showButtons()} onMouseLeave={() => this.hideButtons()} className={this.props.current ? `frame-wrapper frame-wrapper-active` : 'frame-wrapper'}>
                <canvas
                    className={'frame-canvas'}
                    draggable={'true'}
                    ref='canvas'
                    width={this.frameSize}
                    height={this.frameSize}
                    onClick={() => this.props.setCurrentFrame(this.props.frame)}
                    onDragEnter={() => {
                        this.canvas.parentNode.classList.add('frame-wrapper-dragEnter');
                        this.props.setTargetToSwap(this.props.frame, false);
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDragLeave={() => this.canvas.parentNode.classList.remove('frame-wrapper-dragEnter')}
                    onDragStart={() => {
                        this.canvas.parentNode.classList.add('frame-wrapper-dragStart');
                        this.props.setTargetToSwap(this.props.frame, true);
                    }}
                    onDragEnd={() => {
                        this.props.swapFrames();
                        this.canvas.parentNode.classList.remove('frame-wrapper-dragEnter');
                        this.canvas.parentNode.classList.remove('frame-wrapper-dragStart');
                    }}
                />
                <p className={'frame-number'}>{this.props.num + 1}</p>
                <button className={'frame-copy'} ref='clone' onClick={() => this.props.cloneFrame(this.props.frame)} />
                <button className={'frame-delete'} ref='delete' onClick={() => this.props.deleteFrame(this.props.frame)} />
            </div>
        )
    }
}
