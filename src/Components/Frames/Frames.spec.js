import React from 'react';
import Frames from './Frames';
import { shallow } from 'enzyme';
import { createFrame } from '../Piskel/utils';

describe('frame', () => {
    const props = {
        currentFrame: 0,
        canvasSize: 32,
        frames: [createFrame(32), createFrame(32)],
        addFrame: () => { },
        deleteFrame: () => { },
        cloneFrame: () => { },
        setCurrentFrame: () => { },
        setTargetToSwap: () => { },
        swapFrames: () => { },
    };
    const frames = shallow(<Frames {...props} />);
    it('renders properly', () => {
        expect(frames).toMatchSnapshot()
    });

    it('Frames component is render wrapper correctly', () => {
        expect(frames.find('p').text()).toEqual('Add new frame');
    });

    it('Frames component is render only one button', () => {
        expect(frames.find('button')).toHaveLength(1);
    });

    it('Frames component is render frames correctly', () => {
        expect(frames.find('canvas')).toHaveLength(0);
    });
});

