import React from 'react';

export default class CanvasInfo extends React.PureComponent {
    render() {
        let x = this.props.mousePosition.x;
        let y = this.props.mousePosition.y
        if (x >= this.props.size - 1) x = this.props.size;
        if (x <= 0) x = 1;
        if (y >= this.props.size - 1) y = this.props.size;
        if (y <= 0) y = 1;
        return (
            <div className={'canvas-info'}>
                <div className={'cursor-position'} >
                    <h2>Mouse position:</h2>
                    <p className={'cursor-position-x'}>{`X: ${x}`}</p>
                    <p className={'cursor-position-y'}>{`Y: ${y}`}</p>
                </div>
                <div className={'canvas-size'}>
                    <h3>{`Cavas size: ${this.props.size} x ${this.props.size}`}</h3>
                </div>
            </div>
        )
    }
}