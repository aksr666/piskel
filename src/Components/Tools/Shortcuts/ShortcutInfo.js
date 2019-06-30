import React from 'react';

export default class ShortcutInfo extends React.Component {
    isChanging() {
        const { tool, setShortcut } = this.props;
        const { shortcut } = this.refs;
        document.querySelectorAll('.shortcut').forEach((item) => item.classList.remove('sc-changing'));
        shortcut.classList.add('sc-changing');
        document.onkeyup = (e) => {
            setShortcut(tool, e.keyCode);
            this.isChanged();
        }
    }

    isChanged() {
        const { shortcut } = this.refs;
        shortcut.classList.remove('sc-changing');
    }

    render() {
        const { tool, shortcut } = this.props;
        return (
            <div className={'sc-info-wrapper'} onClick={() => this.isChanging()}
            >
                <h3>{`${tool}:`}</h3>
                <p className={'shortcut'} ref='shortcut'>{`'${shortcut}'`}</p>
            </div>
        )
    }
}
