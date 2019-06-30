import React from 'react';

export default class Layers extends React.PureComponent {

    renderLayers() {
        const layers = [];
        this.props.frame.layers.forEach((layer, i) => {
            layers.push(<p
                className={this.props.frame.currentLayer === i ? `layer layer-current` : `layer`}
                key={Math.random().toString(36).substring(7)}
                draggable={'true'}
                onClick={() => this.props.setCurrentLayer(i)}
                onDragEnter={(e) => {
                    e.target.style.border = '1px dashed red';
                    this.props.setLayersToSwap(i, false);
                }}
                onDragOver={(e) => e.preventDefault()}
                onDragLeave={(e) => e.target.style.border = '1px solid white'}
                onDragStart={(e) => {
                    e.target.style.opacity = .5;
                    this.props.setLayersToSwap(i, true);
                }}
                onDragEnd={(e) => {
                    e.target.style.opacity = 1;
                    e.target.style.border = '1px solid white';
                    this.props.swapLayers();
                }}
            >{`Layer-${i + 1}`}
            </p>)
        });
        return layers;
    }

    render() {
        return (
            <div className={'layers-info'}>
                <div className={'layers-header'}>
                    <h3>Layers</h3>
                    <button className={this.props.isShowing ? `show-layers checked` : `show-layers`} onClick={this.props.showLayers}></button>
                </div>
                <div className={'layers-buttons'}>
                    <button className={'layers-btn'} onClick={this.props.addLayer}>+</button>
                    <button className={this.props.frame.layers.length > 1 ? 'layers-btn' : 'layers-btn disabled'} disabled={this.props.frame.layers.length > 1 ? false : true} onClick={this.props.deleteLayer}>-</button>
                    <button className={this.props.frame.layers.length !== 1 ? 'layers-btn' : 'layers-btn disabled'} disabled={!this.props.frame.layers.length} onClick={this.props.setNextLayer}><p className={'layers-next'}>►</p></button>
                    <button className={this.props.frame.layers.length !== 1 ? 'layers-btn' : 'layers-btn disabled'} disabled={!this.props.frame.layers.length} onClick={this.props.setPreviousLayer}><p className={'layers-prev'}>►</p></button>
                </div>
                {this.renderLayers()}
            </div>
        )
    }
}
