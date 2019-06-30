import React from 'react';
import Tool from './Tool';
import { shallow } from 'enzyme';

describe('Tool', () => {
    const props = {
        checked: true,
        name: 'pen',
        key: '1',
        callBack: () => {},
        shortcut: () => {},
    }
    const tools = shallow(<Tool {...props} />);
    it('tools renders properly', () => {
        expect(tools).toMatchSnapshot()
    });

    it('tools has class (button-wrapper)', () => {
        expect(tools.hasClass("button-wrapper")).toEqual(true);
    });

    it('tools shows discription for tool when mouseEnter', () => {
        tools.setState({ showTooltip: true });
        expect(tools.find('div.tooltip')).toHaveLength(1);
    });

    it('tools is render tool name correctly', () => {
        expect(tools.find('p').text()).toEqual(`${props.name} tool(() => {})`);
    });
});
