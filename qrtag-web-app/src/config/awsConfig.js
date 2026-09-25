const awsConfig = {
  identityPoolId: 'us-west-2:158a98c3-d510-414e-9dd5-f88de8e628de',
  region: 'us-west-2',
  userPoolId: 'us-west-2_7Hz3gUMTa',
  userPoolWebClientId: 'gu22le8apl3sv9s2n9duk0uf5',
  oauth: {
    domain: 'qrtagit-web-dev.auth.us-west-2.amazoncognito.com',
    scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
    redirectSignIn:
      'http://localhost:3000/, https://dev.qrtag.it/, https://main.d1i6i6g25r1vzu.amplifyapp.com/',
    redirectSignOut:
      'http://localhost:3000/, https://dev.qrtag.it/, https://main.d1i6i6g25r1vzu.amplifyapp.com/',
    responseType: 'code', // or 'token', note that REFRESH token will only be generated when the responseType is code
  },
};
export default awsConfig;
