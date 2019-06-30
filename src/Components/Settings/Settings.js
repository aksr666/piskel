import React from 'react';

export default class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showSaveInfo: false,
            showResizeInfo: false,
            project: 'Import .rss file...',
        }
    }

    showResizeInfo() {
        if (!this.state.showSaveInfo && !this.state.showResizeInfo) {
            this.setState({ showResizeInfo: true });
            this.refs.settings.classList.add('show-settings');
            this.refs.resizeInfo.style.borderRight = 'none';
        }
        if (this.state.showResizeInfo) this.refs.settings.classList.toggle('show-settings');
        if (this.state.showSaveInfo) {
            this.setState({ showResizeInfo: true, showSaveInfo: false });
            this.refs.saveInfo.style.borderRight = '3px solid black';
            this.refs.resizeInfo.style.borderRight = 'none';
            this.refs.settings.classList.add('show-settings');
        }
    }

    showSaveInfo() {
        if (!this.state.showSaveInfo && !this.state.showResizeInfo) {
            this.setState({ showSaveInfo: true });
            this.refs.settings.classList.add('show-settings');
            this.refs.saveInfo.style.borderRight = 'none';
        }
        if (this.state.showSaveInfo) this.refs.settings.classList.toggle('show-settings');
        if (this.state.showResizeInfo) {
            this.setState({ showResizeInfo: false, showSaveInfo: true });
            this.refs.resizeInfo.style.borderRight = '3px solid black';
            this.refs.saveInfo.style.borderRight = 'none';
            this.refs.settings.classList.add('show-settings');
        }
    }

    importRssFileHandler() {
        this.setState({ project: document.querySelector('input[type=file]').files[0].name });
    }

    render() {
        return (
            <div ref='settings' className={'settings'}>
                <div className={'settings-btn-wrapper'}>
                    <button className={'saveInfo-btn'} ref='saveInfo' onClick={() => this.showSaveInfo()} />
                    <button className={'resizeInfo-btn'} ref='resizeInfo' onClick={() => this.showResizeInfo()} />
                </div>
                <div className={'settings-info-container'}>
                    {this.state.showResizeInfo && <div className={'canvas-resize-wrapper'}>
                        <h3>{`Current size: ${this.props.canvasSize} x ${this.props.canvasSize}`}</h3>
                        <div className={"button"} onClick={() => this.props.resize(32)}>
                            <p className={"btnText"} >32x32</p>
                            <div className={"btnTwo"}>
                                <p className={"btnText2"}>Resize</p>
                            </div>
                        </div>
                        <div className={"button"} onClick={() => this.props.resize(64)}>
                            <p className={"btnText"}>64x64</p>
                            <div className={"btnTwo"}>
                                <p className={"btnText2"}>Resize</p>
                            </div>
                        </div>
                        <div className={"button"} onClick={() => this.props.resize(128)}>
                            <p className={"btnText"}>128x128</p>
                            <div className={"btnTwo"}>
                                <p className={"btnText2"}>Resize</p>
                            </div>
                        </div>
                    </div>}
                    {this.state.showSaveInfo && <div><div className={'canvas-saveInfo-wrapper'}>
                        <div className={'save-format-btn-wrapper'}>
                            <input
                                type={'file'}
                                id={'file'}
                                className={'inputFile'}
                                onChange={() => {
                                    this.importRssFileHandler();
                                    this.props.importRssFile();
                                }}
                            />
                            <label htmlFor="file">
                                <div className={'import-file'} />
                                {this.state.project}
                            </label>
                            <h3>Save as:</h3>
                            <div className={"button"} onClick={this.props.saveAsGif}>
                                <p className={"btnText"} >.gif</p>
                                <div className={"btnTwo"}>
                                    <p className={"btnText2"}>Save</p>
                                </div>
                            </div>
                            <div className={"button"} onClick={this.props.saveAsApng}>
                                <p className={"btnText"}>.apng</p>
                                <div className={"btnTwo"}>
                                    <p className={"btnText2"}>Save</p>
                                </div>
                            </div>
                            <div className={"button"} onClick={this.props.saveAsPiskel}>
                                <p className={"btnText"}>.piskel</p>
                                <div className={"btnTwo"}>
                                    <p className={"btnText2"}>Save</p>
                                </div>
                            </div>
                            <div className={"button"} onClick={this.props.saveAsRss}>
                                <p className={"btnText"}>.rss</p>
                                <div className={"btnTwo"}>
                                    <p className={"btnText2"}>Save</p>
                                </div>
                            </div>
                        </div>
                        <div className={'save-location-btn-wrapper'}>
                            <h3>Save to:</h3>
                            <div className={"button"} onClick={this.props.saveToLocalStorage}>
                                <p className={"btnText"}>Storage</p>
                                <div className={"btnTwo"}>
                                    <p className={"btnText2"}>Save</p>
                                </div>
                            </div>
                            <div className={"button"} onClick={this.props.saveToGoogleDrive}>
                                <p className={"btnText"}>Google</p>
                                <div className={"btnTwo"}>
                                    <p className={"btnText2"}>Upload</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>}
                </div>
            </div>
        )
    }
}