import React from 'react';
import ShortcutInfo from './ShortcutInfo';
import { shallow } from 'enzyme';

describe('ShortcutInfo', () => {
    const props = {
        tool: 'Pen', 
        shortcut: 'Q',
    };

    const shortcutsInfo = shallow(<ShortcutInfo {...props} />);
    it('renders properly', () => {
        expect(shortcutsInfo).toMatchSnapshot()
    });

    it('shortcuts component is render shortcut correctly', () => {
        expect(shortcutsInfo.find("p").text()).toEqual(`'${props.shortcut}'`);
    });

    it('shortcuts component is render tool name correctly', () => {
        expect(shortcutsInfo.find("h3").text()).toEqual(`${props.tool}:`);
    });

    it('shortcuts component is render tool name correctly', () => {
        expect(shortcutsInfo.find("p").hasClass('shortcut')).toEqual(true);
    });
    
});
