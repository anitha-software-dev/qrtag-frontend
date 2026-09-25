import { useEffect } from 'react';
import { Store as ContextStore } from '../StoreContext';
import { SignJWT } from 'jose'
import { useLocation } from 'react-router-dom';

const Store = () => {

  const { loggedIn, user, channels, accessToken } = ContextStore();
  const location = useLocation()
 
  const redirection = async () => {
    if (user && accessToken) {
      const secretKey = new TextEncoder().encode('qrtagit')
      // Get info from the JWT
      const payload = {
        user_identifier: user.email,
        iat: Math.floor(Date.now() / 1000),  // issued at time (current time)
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365 * 10, // expiration (10 years from now)
      }

      // const cognitoSession = user.getSignInUserSession();
      const xecurifyCustomerID = '9785' // process.env.REACT_APP_SHOPIFY_SSO_CUSTOMER_ID; // Provided by vendor

      // Specify the xecurify user store based on environment.
      const idpIdentifier = 'cognitoSSO' // process.env.REACT_APP_SHOPIFY_USER_STORE_ID;

      const jwtToken = await new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).sign(secretKey);

      // const jwtToken =  // cognitoSession.getIdToken().jwtToken;
      const storeDomain = process.env.REACT_APP_SHOPIFY_STORE_DOMAIN;

      // const shopifyRedirectURL = `https://store.xecurify.com/moas/broker/login/jwt/callback/${xecurifyCustomerID}/${idpIdentifier}/${jwtToken}?relay=https://store.xecurify.com/moas/broker/login/shopify/${storeDomain}/index`;
      // const shopifyRedirectURL = `https://store.xecurify.com/moas/broker/login/jwt/callback/${xecurifyCustomerID}/${idpIdentifier}/${jwtToken}?relay=https://store.xecurify.com/moas/broker/login/shopify/${storeDomain}/account`
      // console.log(shopifyRedirectURL)
      // Redirect to shopify URL
      const shopifyRedirectURL = `https://store.qrtag.it/index`;
      window.location.replace(shopifyRedirectURL);
      return null;
    } else {
      const shopifyRedirectURL = `https://store.qrtag.it/index`;
      window.location.replace(shopifyRedirectURL);
      return null;
    }
  }

  useEffect(() => {
    redirection()
  }, []);


};

export default Store;
