import React from 'react';
import Amplify, { Auth } from 'aws-amplify';
import { AmplifyAuthenticator, AmplifySignUp, AmplifySignOut } from '@aws-amplify/ui-react';
import { AuthState } from '@aws-amplify/ui-components';


class Profile extends React.Component {
    state = {
      authState: null,
      user: null
    }

  constructor() {
    super();
    Amplify.configure({
      Auth: {
        // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
        identityPoolId: "us-east-2:8719b911-cf79-40b0-b5ae-224d89676e35",
    
        // REQUIRED - Amazon Cognito Region
        region: 'us-east-2',
    
        // OPTIONAL - Amazon Cognito Federated Identity Pool Region
        // Required only if it's different from Amazon Cognito Region
        identityPoolRegion: "us-east-2",
    
        // OPTIONAL - Amazon Cognito User Pool ID
        userPoolId: "us-east-2_DOrhf0hE5",
    
        // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
        userPoolWebClientId: "3ncome13g4a3cm3o8v683862f6",
    
        // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
        mandatorySignIn: false,
    
        // // OPTIONAL - Configuration for cookie storage
        // // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
        // cookieStorage: {
        // // REQUIRED - Cookie domain (only required if cookieStorage is provided)
        //     domain: '.yourdomain.com',
        // // OPTIONAL - Cookie path
        //     path: '/',
        // // OPTIONAL - Cookie expiration in days
        //     expires: 365,
        // // OPTIONAL - See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
        //     sameSite: "strict" | "lax",
        // // OPTIONAL - Cookie secure flag
        // // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
        //     secure: true
        // },
    
        // OPTIONAL - customized storage object
        // storage: MyStorage,
    
        // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
        // authenticationFlowType: 'USER_PASSWORD_AUTH',
    
        // OPTIONAL - Manually set key value pairs that can be passed to Cognito Lambda Triggers
        // clientMetadata: { myCustomKey: 'myCustomValue' },
    
        // OPTIONAL - Hosted UI configuration
        // oauth: {
        //     domain: 'your_cognito_domain',
        //     scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
        //     redirectSignIn: 'https://localhost:3000/biblebase/',
        //     redirectSignOut: 'https://localhost:3000/biblebase',
        //     responseType: 'code' // or 'token', note that REFRESH token will only be generated when the responseType is code
        // }
      },
    });
  }

  handleAuthStateChange = (state, user) => {
    if (state === AuthState.SignedOut) {
      localStorage.removeItem("USER_TOKEN");
    } else if (state === AuthState.SignedIn) {
      localStorage.setItem("USER_TOKEN", user.token);
    }
    this.setState({
      authState: state,
      user: user
    });
  }

  federated = {
    facebookAppId: "390923218595415",
    googleClientId: "99718692835-n317oqkd6imvg039n3t9gm3qfqi0rlk1.apps.googleusercontent.com"
  }

  render() {
    const { authState, user } = this.state;

    return authState && authState === AuthState.SignedIn && user ? (
        <div className="profile">
            <div>Hello, { user.name }</div>
            <AmplifySignOut handleAuthStateChange={this.handleAuthStateChange}/>
        </div>
      ) : (
        <AmplifyAuthenticator handleAuthStateChange={this.handleAuthStateChange} federated={ this.federated }>
          <AmplifySignUp
            slot="sign-up"
            formFields={[
              { type: "email" },
              { type: "password" }
            ]}
          />
        </AmplifyAuthenticator>
    );
  }
  
}

export default Profile;
