import React from 'react';
import CanvasInfo from './CanvasInfo';
import { shallow } from 'enzyme';

describe('CanvasInfo', () => {
    const props = {
        size: 32,
        mousePosition: {
            x: 15,
            y: 15
        }
    };
    const canvasInfo = shallow(<CanvasInfo {...props} />);
    
    it('renders properly', () => {
        expect(canvasInfo).toMatchSnapshot()
    });

    it('canvasInfo render coords X correctly', () => {
        expect(canvasInfo.find('p.cursor-position-x').text()).toEqual(`X: ${props.mousePosition.x}`);
    });

    it('canvasInfo render coords Y correctly', () => {
        expect(canvasInfo.find('p.cursor-position-y').text()).toEqual(`Y: ${props.mousePosition.y}`);
    });

    it('canvasInfo render canvas size correctly', () => {
        expect(canvasInfo.find('h3').text()).toEqual(`Cavas size: ${props.size} x ${props.size}`);
    });
});