import React from 'react';

export default class Layers extends React.PureComponent {

    renderLayers() {
        const { frame, setCurrentLayer, setLayersToSwap, swapLayers } = this.props;
        const layers = [];
        frame.layers.forEach((layer, i) => {
            layers.push(<p
                className={frame.currentLayer === i ? `layer layer-current` : `layer`}
                key={Math.random().toString(36).substring(7)}
                draggable={'true'}
                onClick={() => setCurrentLayer(i)}
                onDragEnter={(e) => {
                    e.target.style.border = '1px dashed red';
                    setLayersToSwap(i, false);
                }}
                onDragOver={(e) => e.preventDefault()}
                onDragLeave={(e) => e.target.style.border = '1px solid white'}
                onDragStart={(e) => {
                    e.target.style.opacity = .5;
                    setLayersToSwap(i, true);
                }}
                onDragEnd={(e) => {
                    e.target.style.opacity = 1;
                    e.target.style.border = '1px solid white';
                    swapLayers();
                }}
            >{`Layer-${i + 1}`}
            </p>)
        });
        return layers;
    }

    render() {
        const { frame, addLayer, setNextLayer, setPreviousLayer, deleteLayer, showLayers, isShowing } = this.props;
        return (
            <div className={'layers-info'}>
                <div className={'layers-header'}>
                    <h3>Layers</h3>
                    <button className={isShowing ? `show-layers checked` : `show-layers`} onClick={showLayers}></button>
                </div>
                <div className={'layers-buttons'}>
                    <button className={'layers-btn'} onClick={addLayer}>+</button>
                    <button className={frame.layers.length > 1 ? 'layers-btn' : 'layers-btn disabled'} disabled={frame.layers.length > 1 ? false : true} onClick={deleteLayer}>-</button>
                    <button className={frame.layers.length !== 1 ? 'layers-btn' : 'layers-btn disabled'} disabled={!frame.layers.length} onClick={setNextLayer}><p className={'layers-next'}>►</p></button>
                    <button className={frame.layers.length !== 1 ? 'layers-btn' : 'layers-btn disabled'} disabled={!frame.layers.length} onClick={setPreviousLayer}><p className={'layers-prev'}>►</p></button>
                </div>
                {this.renderLayers()}
            </div>
        )
    }
}
