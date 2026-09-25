// ** Dropdowns Imports
import { useState } from 'react'
import UserDropdown from './UserDropdown'
import { OpenNotification } from '@src/views/components/Helper'
import { Service } from '@src/services/Service'
import { useForm } from 'react-hook-form'
import Config from '@src/configs/config'

// ** Third Party Components
import { Sun, Moon } from 'react-feather'
import { FaUser } from 'react-icons/fa'
import { NavItem, NavLink, Button, Spinner, Modal, ModalHeader, ModalBody, Label, FormGroup, ModalFooter, Form } from 'reactstrap'

const NavbarUser = props => {
  // ** Props
  const { skin, setSkin } = props
  const [loading, setLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const { register, control, handleSubmit, formState: { errors }, reset } = useForm()

  // ** Function to toggle Theme (Light/Dark)
  const ThemeToggler = () => {
    if (skin === 'dark') {
      return <Sun className='ficon' onClick={() => setSkin('light')} />
    } else {
      return <Moon className='ficon' onClick={() => setSkin('dark')} />
    }
  }

  const handleOpen = () => {
    setLoading(true)
    Service.get({
      url: `/admin/generate-one-time-login-token/`
    })
      .then((response) => {
        if (response && response.token) {
          window.open(`${Config.STORE_URL}/auto-login?token=${response.token}`, '_blank')
          setOpenModal(!openModal)
          setLoading(false)
        }
      })
      .catch(err => {
        setLoading(false)
        console.log('Error details:', err)

        setOpenModal(!openModal)
        OpenNotification('error', 'Oops!', 'Something went wrong while deleting the item!')
      })
  }

  return (
    <>
      <ul className='nav navbar-nav align-items-center ml-auto'>
        <NavItem className='d-none d-lg-block'>
          <NavLink className='nav-link-style'>
            {/* <ThemeToggler /> */}
          </NavLink>
        </NavItem>
        {/* <NavbarSearch /> */}

        <div>
          <Button color="primary" outline type="button" className="mr-2" onClick={() => setOpenModal(!openModal)}>
            Store Admin
          </Button>
        </div>
        <UserDropdown />
      </ul>

      <Modal isOpen={openModal} toggle={() => setOpenModal(!openModal)}>
        <ModalHeader toggle={() => setOpenModal(!openModal)}>Store Admin Panel</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit(handleOpen)}>
            <FormGroup>
              <Label for="">
                Are you sure you want to open the store admin panel?
              </Label>
            </FormGroup>
            <ModalFooter className="d-flex justify-content-start px-0">
              <Button color="secondary" onClick={() => setOpenModal(!openModal)}>
                No
              </Button>{' '}
              <Button disabled={loading} color="primary" type="submit">
                {(loading) ? <> <Spinner color='white' size='sm' /> </> : 'Yes'}
              </Button>
            </ModalFooter>
          </Form>
        </ModalBody>
      </Modal>

    </>
  )
}
export default NavbarUser
