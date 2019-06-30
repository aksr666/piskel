import React from 'react';
import Shortcuts from './Shortcuts';
import { shallow } from 'enzyme';

describe('Shortcuts', () => {
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
          }
    };
    const shortcuts = shallow(<Shortcuts {...props} />);
    it('renders properly', () => {
        expect(shortcuts).toMatchSnapshot()
    });


    it('shortcuts component is render shortcut button', () => {
        expect(shortcuts.find("button.shortcuts")).toHaveLength(1);
    });

});