import React from 'react';
import Amplify from 'aws-amplify';
import { AmplifyAuthenticator, AmplifySignUp, AmplifySignOut } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';

import awsconfig from './awsconfig'
Amplify.configure(awsconfig);

const Profile = () => {
    const [authState, setAuthState] = React.useState();
    const [user, setUser] = React.useState();

    React.useEffect(() => {
        return onAuthUIStateChange((nextAuthState, authData) => {
            setAuthState(nextAuthState);
            setUser(authData)
        });
    }, []);

  const federated = {
    facebookAppId: "686452428896570"
  }
  return authState === AuthState.SignedIn && user ? (
      <div className="App">
          <div>Hello, { user.attributes.email }</div>
          <AmplifySignOut />
      </div>
    ) : (
      <AmplifyAuthenticator federated={ federated }>
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

export default Profile;
