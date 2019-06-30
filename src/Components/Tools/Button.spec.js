import React from 'react';
import Button from './Button';
import { shallow } from 'enzyme';

describe('Button', () => {
    const props = {
        checked: true,
        name: 'pen',
        key: '1',
        callBack: () => {},
        shortcut: () => {},
    }
    const button = shallow(<Button {...props} />);
    it('button renders properly', () => {
        expect(button).toMatchSnapshot()
    });

    it('button has class (button-wrapper)', () => {
        expect(button.hasClass("button-wrapper")).toEqual(true);
    });

    it('button shows discription for tool when mouseEnter', () => {
        button.setState({ showTooltip: true });
        expect(button.find('div.tooltip')).toHaveLength(1);
    });

    it('button is render tool name correctly', () => {
        expect(button.find('p').text()).toEqual(`${props.name} tool(() => {})`);
    });
});
