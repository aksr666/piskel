import React from 'react';

export default class StartPage extends React.Component {
    render() {
        return (
            <div className={'start-page'}>
                <section className={'main-title'}>
                    <div className={'main-title-left'}>
                        <h2 className={'title-text-main'}>Piskel-clone is a final project of the second stage course of The Rolling Scopes School</h2>
                        <p className={'title-text'}>Create animations in your browser</p>
                        <button onClick={this.props.startProject}>Create Sprite</button>
                    </div>
                    <div className={'main-title-right'}>
                        <div className={'piskel-screen'} />
                    </div>
                </section>
                <section className={'sprites-section'}>
                    <h2>Sprites example</h2>
                    <div className={'sprites-gallery'}>
                        <div className={'sprite sprt1'} />
                        <div className={'sprite sprt2'} />
                        <div className={'sprite sprt3'} />
                        <div className={'sprite sprt4'} />
                        <div className={'sprite sprt5'} />
                        <div className={'sprite sprt6'} />
                        <div className={'sprite sprt7'} />
                        <div className={'sprite sprt8'} />
                    </div>
                </section>
                <section className={'functionality'}>
                    <h2>Functionality</h2>
                    <div className={'functionality-gallery'}>
                        <div>
                            <p>Choose color</p>
                            <div className={'functionality-wrapper fnc1'} />
                        </div>
                        <div>
                            <p>Frame managment</p>
                            <div className={'functionality-wrapper fnc2'} />
                        </div>
                        <div>
                            <p>Layer managment</p>
                            <div className={'functionality-wrapper fnc3'} />
                        </div>
                        <div>
                            <p>Live preview</p>
                            <div className={'functionality-wrapper fnc4'} />
                        </div>
                        <div>
                            <p>Export to .gif/.apng</p>
                            <div className={'functionality-wrapper fnc5'} />
                        </div>
                        <div>
                            <p>Hotkeys</p>
                            <div className={'functionality-wrapper fnc6'} />
                        </div>
                        <div>
                            <p>Google SingIn</p>
                            <div className={'functionality-wrapper fnc7'} />
                        </div>
                        <div>
                            <p>Tools</p>
                            <div className={'functionality-wrapper fnc8'} />
                        </div>
                    </div>
                </section>
                <section className={'about-container'}>
                    <div className={'author-img'} />
                    <div className={'about-author'}>
                        <h2 className={'author-name'}>akSr-</h2>
                        <p>I like the programming, it's exciting and fascinating. Coding is one of the easiest ways to solve practical problems.
                            The end product depends only upon how hight your skills and good idea but not any other factors.</p>
                    </div>
                    <div className={'author-contacts'}>
                        <p>GitHub: <a href='https://github.com/aksr666'>https://github.com/aksr666</a></p>
                    </div>
                </section>
            </div>
        )
    }
}