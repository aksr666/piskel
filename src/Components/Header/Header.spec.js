import React from 'react';
import Header from './Header';
import { shallow } from 'enzyme';

describe('Header', () => {
    const header = shallow(<Header />);
    it('header renders properly', () => {
        expect(header).toMatchSnapshot()
    });

    it('header has class (header)', () => {
        expect(header.hasClass("header")).toEqual(true);
    });

    it('header component is render only correct button', () => {
        expect(header.find('button')).toHaveLength(1);
    });

    it('header component is render user information correctly', () => {
        expect(header.find('p').text()).toEqual("");
    });

    it('header component is render correctly information when user SignIn', () => {
        header.setState({ mail: 'test@mail.com' });
        expect(header.find('p').text()).toEqual('test@mail.com');
    });

    it('button SingIn is changing when user authorize', () => {
        expect(header.find('button').text()).toEqual('Log Out');
    });
});
