import React from 'react';
import StartPage from './StartPage';
import { shallow } from 'enzyme';

describe('startPage', () => {
    const startPage = shallow(<StartPage />);
    it('startPage renders properly', () => {
        expect(startPage).toMatchSnapshot()
    });

    it('startPage has class (start-page)', () => {
        expect(startPage.hasClass("start-page")).toEqual(true);
    });

    it('startPage is render createSprite button', () => {
        expect(startPage.find('button')).toHaveLength(1);
    });

    it('startPage is render tools description', () => {
        expect(startPage.find('p')).toHaveLength(11);
    });

    it('startPage is render all sections', () => {
        expect(startPage.find('section')).toHaveLength(4);
    });

    it('startPage is render author-name correctly', () => {
        expect(startPage.find('h2.author-name').text()).toEqual('akSr-');
    });
});
