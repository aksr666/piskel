import React from 'react';
import Tool from './Tool';
import Shortcuts from './Shortcuts/Shortcuts';

export default class Tools extends React.Component {

    createButtons() {
        const { tools, setTools } = this.props;
        const buttons = [];
        for (const key in tools) {
            let checked = true;
            if (tools[key].value) checked = false;
            buttons.push(<Tool
                checked={checked}
                name={key}
                key={key}
                callBack={() => setTools(key)}
                shortcut={tools[key].shortcut}
            />);
        }
        return buttons;
    }

    render() {
        return (
            <div className='tools'>
                {this.createButtons()}
                <div className={'colors'}>
                    <input
                        className='mainColor'
                        value={this.props.colors.main}
                        onChange={(e) => this.props.setColor(e.target.value, true)}
                        type="color">
                    </input>
                    <input
                        className='extraColor'
                        value={this.props.colors.extra}
                        onChange={(e) => this.props.setColor(e.target.value)}
                        type="color">
                    </input>
                    <div className='swap' onClick={() => this.props.swapColors()}></div>
                </div>
                <Shortcuts
                    updateShortcuts={(value) => this.props.updateShortcuts(value)}
                    tools={this.props.tools}
                    setTools={(key) => this.props.setTools(key)}
                />
            </div>
        )
    }
}