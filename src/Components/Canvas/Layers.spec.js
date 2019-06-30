import React from 'react';
import Layers from './Layers';
import { shallow } from 'enzyme';

describe('Layers', () => {
    const props = {
        setCurrentLayer: () => { },
        frame: {
            layers: [Array.from(Array(32).fill([0, 0, 0, 0]), () => new Array(32).fill([0, 0, 0, 0])), Array.from(Array(32).fill([0, 0, 0, 0]), () => new Array(32).fill([0, 0, 0, 0]))],
            currentLayer: 0,
        },
        isShowing: true,
        addLayer: () => { },
        deleteLayer: () => { },
        showLayers: () => { },
        setNextLayer: () => { },
        setPreviousLayer: () => { },
        setLayersToSwap: () => { },
        swapLayers: () => { },
    }
    const layers = shallow(<Layers {...props} />);

    it('renders properly', () => {
        expect(layers).toMatchSnapshot()
    });

    it('layers component render all control buttons correctly', () => {
        expect(layers.find('button')).toHaveLength(5);
    });

    it('layers component add checked to showLayers button when props.isShowind: true', () => {
        expect(layers.find('button.show-layers').hasClass('checked')).toEqual(true);
    });
});