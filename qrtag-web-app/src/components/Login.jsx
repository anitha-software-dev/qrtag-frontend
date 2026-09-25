import './css/App.css';
import logo from '../images/qrtag.png';
import background from '../images/background.jpg';
import { Authenticator } from "@aws-amplify/ui-react";
import '@aws-amplify/ui-react/styles.css'

import Header from "./login/Header";
import Footer from "./login/Footer";
import SignInHeader from "./login/SignInHeader";
import SignInFooter from "./login/SignInFooter";
  
  const components = {
    Header,
    SignIn: {
      Header: SignInHeader,
      Footer: SignInFooter
    },
    Footer
  };

function Login() {

    return (
      <div className="container-fluid">
      <div className="row row-cols-1 row-cols-lg-2">
        <div className="col px-5">
        <div className="row row-cols-1 h-100">
          <div className="col pt-5">          
                <img src={logo} width="100em" alt="QRTag Logo" />          
          </div>		
            <div className="col mycentered">
              <div>
                <div className='col py-5'>
                <Authenticator components={components}>
                  {({ signOut, user }) => (
                    <main>
                      <div className="px-2 bodyText">Hello {user.attributes.email}</div>
                      <div className="p-2"><button onClick={signOut} className="btn btn-sm btn-outline-secondary btn-rounded">Sign out</button></div>
                    </main>
                  )}
                </Authenticator>
                </div>
              </div>
            </div>
        </div>
      </div>
      <div className="col px-0">
        <div className="bg-img vh-100" style={{ backgroundImage: `url(${background})`}}></div>
      </div>
    </div>
	</div>
    );
  }
  export default Login