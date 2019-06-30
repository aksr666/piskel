import React from 'react';
import ShortcutsPopup from './ShortcutsPopup';


export default class Shortcuts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showPopup: false,
        }
    }

    componentDidMount() {
        document.addEventListener('keydown', (e) => {
            for (let key in this.props.tools) {
                if (String.fromCharCode(e.keyCode).toUpperCase() === this.props.tools[key].shortcut) this.props.setTools(key);
            }
        });
    }

    togglePopup() {
        this.setState({ showPopup: !this.state.showPopup });
    }

    render() {
        return (
            <div>
                <button className={'shortcuts'} onClick={() => this.togglePopup()} />
                {this.state.showPopup && <ShortcutsPopup togglePopup={() => this.togglePopup()} updateShortcuts={(value) => this.props.updateShortcuts(value)} tools={this.props.tools} />}
            </div>
        )
    }
}