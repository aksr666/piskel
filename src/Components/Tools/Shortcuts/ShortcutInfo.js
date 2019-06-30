import React from 'react';

export default class ShortcutInfo extends React.Component {
    isChanging() {
        document.querySelectorAll('.shortcut').forEach((item) => item.classList.remove('sc-changing'));
        this.refs.shortcut.classList.add('sc-changing');
        document.onkeyup = (e) => {
            this.props.setShortcut(this.props.tool, e.keyCode);
            this.isChanged();
        }
    }

    isChanged() {
        this.refs.shortcut.classList.remove('sc-changing');
    }

    render() {
        return (
            <div className={'sc-info-wrapper'} onClick={() => this.isChanging()}
            >
                <h3>{`${this.props.tool}:`}</h3>
                <p className={'shortcut'} ref='shortcut'>{`'${this.props.shortcut}'`}</p>
            </div>
        )
    }
}
