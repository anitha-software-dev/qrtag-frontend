import { useState } from 'react'
import { Card, CardBody, Button, Spinner, Row, Col, CardTitle } from 'reactstrap'
import '@styles/base/pages/page-auth.scss'
import logo from '@src/assets/images/logo/logo.png'
import { Service } from '@src/services/Service'
import { OpenNotification } from '@src/views/components/Helper'
import OtpInput from 'react-otp-input'
import { Link, useHistory } from 'react-router-dom'

const LoginV1 = () => {

  const history = useHistory()
  const [buttonDisable, setButtonDisable] = useState(false)
  const [clickDisabled, setClickDisabled] = useState(false)
  const [pins, setPins] = useState('')

  const urlParams = new URLSearchParams(window.location.search)
  const uemail = urlParams.get('email')

  const onSubmit = () => {
    if (uemail) {
      if (pins.length !== 6) {
        OpenNotification('error', 'Oops!', 'Please enter valid code!')
        return false
      }
      setButtonDisable(true)
      Service.post({
        url: '/retailer-signup/verify-email/',
        body: JSON.stringify({ email: decodeURIComponent(uemail), code: pins })
      })
        .then(response => {
          setButtonDisable(false)
          setPins('')

          if (response.status === 'error') {
            response.data.then(res => {
              OpenNotification('error', 'Oops!', res.message)
            })
            return false
          } else {
            OpenNotification('success', 'Success!', 'Your email address has been verified!')
            history.push('/login')
          }
        })

    } else {
      OpenNotification('error', 'Oops!', 'Verification Failed!')
      history.push('/login')
    }
  }

  const handleResend = () => {
    if (clickDisabled) {
      return false
    }

    if (uemail) {
      setClickDisabled(true)
      Service.post({
        url: '/resend-verification-email/',
        body: JSON.stringify({ email: decodeURIComponent(uemail) })
      })
        .then(response => {
          setClickDisabled(false)
          if (response.status === 'error') {
            response.data.then(res => {
              OpenNotification('error', 'Oops!', res.message)
            })
            return false
          } else {
            OpenNotification('success', 'Success!', 'Verification code has been sent to your email address!')
            history.push('/login')
          }
        })

    } else {
      OpenNotification('error', 'Oops!', 'Resend Failed!')
      history.push('/login')
      setClickDisabled(false)
    }
  }

  return (
    <div className='auth-wrapper auth-v1 px-2'>
      <div className='auth-inner py-2'>
        <Card className='mb-0'>
          <CardBody>
            <div className='brand-logo'>
              <img src={logo} width={200} />
            </div>
            <CardTitle tag='h2' className='font-weight-bold text-center'>
              VERIFY YOUR EMAIL ADDRESS
            </CardTitle>

            <Row>
              <Col md='12'>
                <div className='py-2'>
                  <p className='d-flex align-items-center justify-content-center text-center pb-2'>Please check your inbox and enter the verification code below to verify your email address.</p>
                  <div className='auth-input-wrapper d-flex align-items-center justify-content-center'>
                    <OtpInput
                      value={pins}
                      onChange={setPins}
                      numInputs={6}
                      shouldAutoFocus={true}
                      renderInput={(props) => <input {...props} className='form-control auth-input width-50 height-50 text-center mx-25 mb-1' />}
                    />
                  </div>
                </div>
              </Col>
              <Col md='12'>
                <Button.Ripple type="button" color='primary' className="w-100 mb-2" onClick={onSubmit}>
                  {(buttonDisable) ? <> <Spinner color='white' size='sm' /> </> : 'VERIFY'}
                </Button.Ripple>

                <p className='d-flex align-items-center justify-content-between mt-1'>
                  <div>
                    <span className='text-primary cursor-pointer' onClick={handleResend}>Resend Code</span>
                  </div>

                  <Link to='/login'>
                    <span className='text-primary'>Back to Login</span>
                  </Link>
                </p>
              </Col>
            </Row>

          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default LoginV1
