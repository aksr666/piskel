import React from 'react';
import ShortcutsPopup from './ShortcutsPopup';
import { shallow } from 'enzyme';

describe('Settings', () => {
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
    const popup = shallow(<ShortcutsPopup {...props} />);
    it('renders properly', () => {
        expect(popup).toMatchSnapshot()
    });

    it('popup has class (sc-popup)', () => {
        expect(popup.hasClass("sc-popup")).toEqual(true);
    });

});