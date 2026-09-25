import '../css/App.css';
import logo from '../../images/qrtag.png';
import background from '../../images/background.jpg';

function Home() {
  return (
    <div className='container-fluid'>
      <div className='row row-cols-1 row-cols-lg-2'>
        <div className='col px-5'>
          <div className='row row-cols-1 h-100'>
            <div className='col py-5'>
              <img src={logo} width='100em' alt='QRTag Logo' />
            </div>

            <div className='col py-5 mycentered'>
              <div className=''>
                <h3 className='titleText'>Coming Soon</h3>
                <div className='col py-5'>
                  <p className='subTitleText'>QRTag.it</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='col px-0'>
          <div className='bg-img vh-100' style={{ backgroundImage: `url(${background})` }}></div>
        </div>
      </div>
    </div>
  );
}

  export default Home
