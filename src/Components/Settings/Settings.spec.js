import React from 'react';
import Settings from './Settings';
import { shallow } from 'enzyme';

describe('Settings', () => {
    const props = {
        canvasSize: 32,
    }
    const settings = shallow(<Settings {...props} />);

    it('renders properly', () => {
        expect(settings).toMatchSnapshot()
    });

    it('settings has class (settings)', () => {
        expect(settings.hasClass("settings")).toEqual(true);
    });

    it('settings component should be render resizeInfo container when resize button is clicked', () => {
        settings.setState({ showResizeInfo: true });
        expect(settings.find('div.canvas-resize-wrapper')).toHaveLength(1);
    });

    it('settings component should be render saveeInfo container when resize button is clicked', () => {
        settings.setState({ showSaveInfo: true });
        expect(settings.find('div.canvas-saveInfo-wrapper')).toHaveLength(1);
    });

    it('settings component should be render saveeInfo and resizeInfo buttons', () => {
        settings.setState({ showSaveInfo: true });
        expect(settings.find('button')).toHaveLength(2);
    });
});
