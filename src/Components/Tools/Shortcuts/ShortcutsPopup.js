import React from 'react';
import ShortcutInfo from './ShortcutInfo';

export default class ShortcutsPopup extends React.Component {
    constructor(props) {
        super(props);
        this.copy = JSON.parse(JSON.stringify(this.props.tools));
        this.state = {
            tools: JSON.parse(JSON.stringify(this.props.tools)),
        }
    }

    createBtnsInfo() {
        const info = [];
        for (let key in this.state.tools) {
            info.push(<ShortcutInfo key={key} tool={key} shortcut={this.state.tools[key].shortcut} setShortcut={(tool, value) => this.setShortcut(tool, value)} />)
        }
        return info;
    }

    setShortcut(tool, value) {
        const tools = Object.assign({}, this.state.tools);
        for (let key in tools) {
            if (tools[key].shortcut === String.fromCharCode(value).toUpperCase()) tools[key].shortcut = tools[tool].shortcut;
        }
        tools[tool].shortcut = String.fromCharCode(value).toUpperCase();
        this.setState({
            tools: tools,
        });
        document.onkeyup = null;
    }

    setDefaultValue() {
        this.setState({ tools: this.copy});
        this.props.togglePopup();
        this.forceUpdate();
    }

    updateShortcuts() {
        this.props.updateShortcuts(this.state.tools);
        this.props.togglePopup();
    }

    render() {
        return (
            <div className={'sc-popup'}>
                {this.createBtnsInfo()}
                <button className={'save-sc-btn'} onClick={() => this.updateShortcuts()}>Save</button>
                <button className={'cancel-sc-btn'} onClick={() => this.setDefaultValue()}>Cancel</button>
            </div>
        )
    }
}
