import React from 'react';

export default class Tool extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTooltip: false,
        }
    }
    showTooltip() {
        this.setState({ showTooltip: true });
    }

    hideTooltip() {
        this.setState({ showTooltip: false });
    }

    render() {
        return (
            <div className={'button-wrapper'}>
                <button onMouseEnter={() => this.showTooltip()} onMouseLeave={() => this.hideTooltip()} onClick={this.props.callBack} className={this.props.checked ? this.props.name : `${this.props.name} checked`} />
                {this.state.showTooltip && <div ref='toolTip' className={'tooltip'}><p>{`${this.props.name} tool`}<span>{`(${this.props.shortcut})`}</span></p></div>}
            </div>
        )
    }
}