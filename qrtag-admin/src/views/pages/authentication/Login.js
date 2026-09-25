import { useState, useContext, Fragment, useEffect } from 'react'
import classnames from 'classnames'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { handleLogin } from '@store/actions/auth'
import { AbilityContext } from '@src/utility/context/Can'
import { Link, useHistory } from 'react-router-dom'
import InputPasswordToggle from '@components/input-password-toggle'
import { Card, CardBody, CardTitle, CardText, Form, FormGroup, Label, Input, CustomInput, Button, Spinner, Row, Col } from 'reactstrap'
import '@styles/base/pages/page-auth.scss'
import logo from '@src/assets/images/logo/logo.png'
import { Service } from '@src/services/Service'
import { OpenNotification } from '@src/views/components/Helper'
import { auth, db } from '../../../configs/firebaseConfig'
import { collection, getDocs, query, where } from 'firebase/firestore'

const LoginV1 = () => {

  const ability = useContext(AbilityContext)
  const dispatch = useDispatch()
  const history = useHistory()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [buttonDisable, setButtonDisable] = useState(false)
  const [error, setError] = useState(false)

  const { register, errors, handleSubmit } = useForm()

  const onSubmit = async data => {
    if (username !== '' && password !== '') {
      setButtonDisable(true)
      Service.post({
        url: '/admin/get-token/',
        body: JSON.stringify({ username, password })
      })
        .then(response => {
          setButtonDisable(false)
          if (response && response.token && response.user) {
            const resp = {
              status: "success",
              data: {
                user: {
                  id: response.user_id,
                  name: "Admin",
                  role: response.role,
                  username: "qrcode",
                  email: username,
                  status: 1
                },
                token: response.token
              }
            }

            dispatch(handleLogin(resp.data))

            ability.update([
              {
                action: 'manage',
                subject: 'all'
              }
            ])

            history.push("/qrcodes")
            OpenNotification('success', `Welcome!`, 'You have successfully logged into QRTag.it')
          } else if (response) {
            response.data.then(res => {
              OpenNotification('error', 'Oops!', res.message)
            })
            return false
          } else {
            OpenNotification('error', 'Oops!', 'Login Failed!')
          }
        })
        .catch(err => {
          console.log(err)
          setButtonDisable(false)
          OpenNotification('error', 'Oops!', 'Something went wrong!')
        })

    }
  }

  return (
    <div className='auth-wrapper auth-v1 px-2'>
      <div className='auth-inner py-2'>
        <Card className='mb-0'>
          <CardBody>
            <div className='brand-logo'>
              <img src={logo} width={125} />
            </div>

            <Form className='auth-login-form mt-2' onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <Label className='form-label' for='login-username'>
                  Username
                </Label>
                <Input
                  autoFocus
                  type='text'
                  value={username}
                  id='login-username'
                  name='login-username'
                  placeholder='Enter Username'
                  onChange={e => setUsername(e.target.value)}
                  className={classnames({ 'is-invalid': errors['login-username'] })}
                  innerRef={register({ required: true, validate: value => value !== '' })}
                />
              </FormGroup>
              <FormGroup>
                <div className='d-flex justify-content-between'>
                  <Label className='form-label' for='login-password'>
                    Password
                  </Label>
                </div>
                <InputPasswordToggle
                  value={password}
                  id='login-password'
                  name='login-password'
                  className='input-group-merge'
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  innerRef={register({ required: true, validate: value => value !== '' })}
                />
              </FormGroup>

              <Button.Ripple type="submit" color='primary' className="mt-3 mb-2" block>
                {(buttonDisable) ? <> <Spinner color='white' size='sm' /> </> : 'LOGIN'}
              </Button.Ripple>
              {error && <p style={{ color: 'red', textAlign: 'center' }}>please enter valid credentials.</p>}
            </Form>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default LoginV1
