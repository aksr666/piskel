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
        const { checked, name, shortcut, callBack } = this.props;
        return (
            <div className={'button-wrapper'}>
                <button onMouseEnter={() => this.showTooltip()} onMouseLeave={() => this.hideTooltip()} onClick={callBack} className={checked ? name : `${name} checked`} />
                {this.state.showTooltip && <div ref='toolTip' className={'tooltip'}><p>{`${name} tool`}<span>{`(${shortcut})`}</span></p></div>}
            </div>
        )
    }
}