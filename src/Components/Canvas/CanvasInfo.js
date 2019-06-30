import React from 'react';

export default class CanvasInfo extends React.PureComponent {
    render() {
        const { mousePosition, size } = this.props;
        let x = mousePosition.x;
        let y = mousePosition.y
        if (x >= size - 1) x = size;
        if (x <= 0) x = 1;
        if (y >= size - 1) y = size;
        if (y <= 0) y = 1;
        return (
            <div className={'canvas-info'}>
                <div className={'cursor-position'} >
                    <h2>Mouse position:</h2>
                    <p className={'cursor-position-x'}>{`X: ${x}`}</p>
                    <p className={'cursor-position-y'}>{`Y: ${y}`}</p>
                </div>
                <div className={'canvas-size'}>
                    <h3>{`Cavas size: ${size} x ${size}`}</h3>
                </div>
            </div>
        )
    }
}