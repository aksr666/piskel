import React from 'react';
import Frame from './Frame';

export default class Frames extends React.Component {

    shouldComponentUpdate(nextProps) {
        if (JSON.stringify(this.props.frames) === JSON.stringify(nextProps.frames) && this.props.canvasSize === nextProps.canvasSize && this.props.currentFrame === nextProps.currentFrame) return false;
        else return true;
    }

    renderFrames() {
        const frames = [];
        this.props.frames.forEach((frame, i) => {
            let current = false;
            if (this.props.currentFrame === i) current = true;
            frames.push(<Frame
                current={current}
                canvasSize={this.props.canvasSize}
                num={i}
                key={Math.random().toString(36).substring(7)}
                frame={frame}
                deleteFrame={this.props.deleteFrame}
                cloneFrame={this.props.cloneFrame}
                setCurrentFrame={this.props.setCurrentFrame}
                setTargetToSwap={this.props.setTargetToSwap}
                swapFrames={this.props.swapFrames}
            />
            )
        })
        return frames;
    }

    render() {
        return (
            <div className={'frames-wrapper'}>
                {this.renderFrames()}
                <button className={'add-frame'} onClick={() => this.props.addFrame()}><p>Add new frame</p></button>
            </div>
        )
    }
}
























































































































