import React from 'react';

export default class Header extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            mail: null,
        }
    }

    componentDidMount() {
        try {
            window.gapi.load('auth2', () => {
                window.gapi.auth2.init({ client_id: '355911681552-osgglvf1ep2a6ivbi8h0uhd8nprv452a.apps.googleusercontent.com' });
            });
        } catch (error) {
            console.log(error.message);
        }

    }

    signIn() {
        const GoogleAuth = window.gapi.auth2.getAuthInstance();
        GoogleAuth.signIn({ scope: 'https://www.googleapis.com/auth/drive' })
            .then(user => this.setState({ mail: user.w3.U3 }));
    }

    singOut() {
        const GoogleAuth = window.gapi.auth2.getAuthInstance();
        GoogleAuth.signOut().then(i => this.setState({ mail: null }));
    }

    render() {
        const { mail } = this.state;
        return (
            <div className={'header'}>
                <div className={'logo'} />
                <div className={'user-info-wrapper'}>
                    <p className={'user-info'}>{this.state.mail}</p>
                    {!mail && <button onClick={() => this.signIn()}>Log In</button>}
                    {mail && <button onClick={() => this.singOut()}>Log Out</button>}

                </div>
            </div>
        )
    }
}
