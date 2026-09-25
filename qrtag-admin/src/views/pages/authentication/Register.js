import { useState, useContext, Fragment } from 'react'
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

const RegisterV1 = () => {

  const dispatch = useDispatch()
  const history = useHistory()
  const [buttonDisable, setButtonDisable] = useState(false)

  const { register, errors, handleSubmit } = useForm()

  const onSubmit = data => {

    const params = {
      first_name: data.firstname,
      last_name: data.lastname,
      email: data.email,
      password: data.password
    }

    if (data.password.length < 6) {
      OpenNotification('error', 'Oops!', 'Password length must be greater than 6 characters!')
      return false
    }

    if (data.password !== data.cpassword) {
      OpenNotification('error', 'Password Mismatch!', 'Both password must be same!')
      return false
    }

    setButtonDisable(true)
    Service.post({
      url: '/retailer-signup/',
      body: JSON.stringify(params)
    })
      .then(response => {
        setButtonDisable(false)

        if (response.status === 'error') {
          response.data.then(res => {
            if (typeof res === 'object') {
              for (const key in res) {
                if (Object.hasOwnProperty.call(res, key)) {
                  const value = res[key]
                  OpenNotification('error', 'Oops!', `${key}: ${value[0]}`)
                  return false
                }
              }
            } else {
              OpenNotification('error', 'Oops!', 'Signup Failed!')
            }
          })
          return false
        } else {

          setButtonDisable(false)

          history.push(`/account/verify/?email=${encodeURIComponent(data.email)}`)
          OpenNotification('success', `Signup Successful!`, 'Please verify your email to complete your account.')
        }
      })
      .catch(err => {
        console.log(err)
        setButtonDisable(false)
        OpenNotification('error', 'Oops!', 'Something went wrong!')
      })
  }

  return (
    <div className='auth-wrapper auth-v1 px-2'>
      <div className='auth-inner py-1'>
        <Card className='mb-0'>
          <CardBody>
            <div className='brand-logo'>
              <img src={logo} width={200} />
            </div>
            <CardTitle tag='h2' className='font-weight-bold text-center'>
                Sign up for an account
              </CardTitle>

            <Form className='auth-login-form mt-2' onSubmit={handleSubmit(onSubmit)}>

              <FormGroup>
                <Label className='form-label' htmlFor='firstname'>
                  First Name<span className='text-danger'>*</span>
                </Label>
                <Input
                  type='text'
                  placeholder='Enter First Name'
                  id='firstname'
                  name='firstname'
                  className={classnames({ 'is-invalid': errors['firstname'] })}
                  innerRef={register({ required: true, validate: value => value !== '' })}
                />
              </FormGroup>
              <FormGroup>
                <Label className='form-label' htmlFor='lastname'>
                  Last Name<span className='text-danger'>*</span>
                </Label>
                <Input
                  type='text'
                  placeholder='Enter Last Name'
                  id='lastname'
                  name='lastname'
                  className={classnames({ 'is-invalid': errors['lastname'] })}
                  innerRef={register({ required: true, validate: value => value !== '' })}
                />
              </FormGroup>
              <FormGroup>
                <Label className='form-label' htmlFor='email'>
                  Email<span className='text-danger'>*</span>
                </Label>
                <Input
                  type='email'
                  id='email'
                  name='email'
                  placeholder='Enter Email'
                  className={classnames({ 'is-invalid': errors['email'] })}
                  innerRef={register({ required: true, validate: value => value !== '' })}
                />
              </FormGroup>
              <FormGroup>
                <Label className='form-label' htmlFor='password'>
                  Password<span className='text-danger'>*</span>
                </Label>
                <InputPasswordToggle
                  id='password'
                  name='password'
                  className='input-group-merge'
                  inputClassName={classnames({ 'is-invalid': errors['password'] })}
                  innerRef={register({ required: true, validate: value => value !== '' })}
                  placeholder="Enter Password"
                />
              </FormGroup>
              <FormGroup>
                <Label className='form-label' htmlFor='cpassword'>
                  Confirm Password<span className='text-danger'>*</span>
                </Label>
                <InputPasswordToggle
                  id='cpassword'
                  name='cpassword'
                  className='input-group-merge'
                  inputClassName={classnames({ 'is-invalid': errors['cpassword'] })}
                  innerRef={register({ required: true, validate: value => value !== '' })}
                  placeholder="Enter Confirm Password"
                />
              </FormGroup>
              <Button.Ripple type="submit" color='primary' className="mt-2" block>
                {(buttonDisable) ? <> <Spinner color='white' size='sm' /> </> : 'REGISTER'}
              </Button.Ripple>
            </Form>
            <p className='text-center mt-2'>
              <span className='mr-25'>Already have an account?</span>
              <Link to='/login'>
                <span className='text-primary'>Login</span>
              </Link>
            </p>

          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default RegisterV1
