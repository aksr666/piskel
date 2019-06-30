import React from 'react';
import Frame from './Frame';

export default class Frames extends React.Component {

    shouldComponentUpdate(nextProps) {
        const { frames, canvasSize, currentFrame } = this.props;
        if (JSON.stringify(frames) === JSON.stringify(nextProps.frames) && canvasSize === nextProps.canvasSize && currentFrame === nextProps.currentFrame) return false;
        else return true;
    }

    renderFrames() {
        const { frames, canvasSize, currentFrame, deleteFrame, cloneFrame, setCurrentFrame, setTargetToSwap, swapFrames } = this.props;
        const framesToRender = [];
        frames.forEach((frame, i) => {
            let current = false;
            if (currentFrame === i) current = true;
            framesToRender.push(<Frame
                current={current}
                canvasSize={canvasSize}
                num={i}
                key={Math.random().toString(36).substring(7)}
                frame={frame}
                deleteFrame={deleteFrame}
                cloneFrame={cloneFrame}
                setCurrentFrame={setCurrentFrame}
                setTargetToSwap={setTargetToSwap}
                swapFrames={swapFrames}
            />
            )
        })
        return framesToRender;
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
























































































































