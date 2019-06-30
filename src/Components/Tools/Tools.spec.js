import React from 'react';
import Tools from './Tools';
import { shallow } from 'enzyme';

describe('Tools', () => {
    const props = {
        tools: {
            Pen: { value: false, shortcut: 'Q' },
            Mirror: { value: false, shortcut: 'W' },
            Bucket: { value: false, shortcut: 'E' },
            Eraser: { value: false, shortcut: 'R' },
            Brush: { value: false, shortcut: 'T' },
            Stroke: { value: false, shortcut: 'Y' },
            Rectangle: { value: false, shortcut: 'A' },
            Circle: { value: false, shortcut: 'S' },
            Move: { value: false, shortcut: 'D' },
            ColorPicker: { value: false, shortcut: 'F' },
            Lighten: { value: false, shortcut: 'G' },
            Dithering: { value: false, shortcut: 'H' },
            VerticalReverse: { value: false, shortcut: 'C' },
            HorizontalReverse: { value: false, shortcut: 'X' },
        },
        colors: {
            main: '#000000',
            extra: '#8080ff',
        },
        setTools: () => { },
        setColor: () => { },
        swapColors: () => { },
        updateShortcuts: () => { },
    }
    const tools = shallow(<Tools {...props} />);
    it('tools renders properly', () => {
        expect(tools).toMatchSnapshot()
    });

    it('tools has class (tools)', () => {
        expect(tools.hasClass("tools")).toEqual(true);
    });

    it('tools is render color inputs', () => {
        expect(tools.find('input')).toHaveLength(2);
    });
});
