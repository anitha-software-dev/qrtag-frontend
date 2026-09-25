import { Row, Col, Modal, ModalHeader, ModalBody } from 'reactstrap'

// ** Utils
import Spinner from '@components/spinner/Loading-spinner'
import { formatPhoneNumber, localTimeZone } from './Helper'


const UserModal = ({ userData, setUserModal, userModal, fetching, editInfo }) => {
  return (
    <>
      <Modal isOpen={userModal} toggle={() => setUserModal(!userModal)} className='modal-dialog-centered' size='sm'>
        <ModalHeader toggle={() => setUserModal(!userModal)}>View User Details</ModalHeader>
        <ModalBody>
          <Row>
            {(fetching) ? <>
              <Col md='12' className="mb-1 d-flex align-items-center justify-content-center py-4"><Spinner /></Col>
            </> : <>
              <Col md='12' className='mb-1'><strong>Name</strong> <dd>{userData && userData.name ? userData.name : (editInfo && editInfo.user && editInfo.user.name) ? editInfo.user.name : '-'}</dd></Col>
              <Col md='12' className='mb-1'><strong>Email</strong> <dd>{userData && userData.email ? userData.email : (editInfo && editInfo.user && editInfo.user.email) ? editInfo.user.email : '-'}</dd></Col>
              {(userData) && <>
                <Col md='12' className='mb-1'><strong>Phone Number</strong> <dd>{userData && userData.phone_number ? formatPhoneNumber(userData.phone_number, userData.country_code) : '-'}</dd></Col>
                <Col md='12' className='mb-1'><strong>State</strong> <dd>{userData && userData.looser.state ? userData.looser.state : '-'}</dd></Col>
                <Col md='12' className='mb-1'><strong>City</strong> <dd>{userData && userData.looser.city ? userData.looser.city : '-'}</dd></Col>
                <Col md='12' className='mb-1'><strong>Address</strong> <dd>{userData && userData.looser.address ? userData.looser.address : '-'}</dd></Col>
                <Col md='12' className='mb-0'><strong>Referred By:</strong></Col>
                {(userData && userData.referred_by) ? <>
                  <Col md='12' className="mt-1 mb-0 d-flex"><dd>Name:</dd>&nbsp; <dd>{userData && userData.referred_by && userData.referred_by.name ? userData.referred_by.name : '-'}</dd></Col>
                  <Col md='12' className="mb-1 d-flex"><dd>Email:</dd>&nbsp; <dd>{userData && userData.referred_by && userData.referred_by.email ? userData.referred_by.email : '-'}</dd></Col>
                </> : <Col md='12' className="mb-1 d-flex"><dd>-</dd></Col>}
                <Col md='12' className='mb-0'><strong>Subscription details:</strong></Col>
                {(userData && userData.subscription_details) ? <>
                  <Col md='12' className="mt-1 mb-0 d-flex"><dd>Plan Name:</dd>&nbsp; <dd>{userData && userData.subscription_details && userData.subscription_details.plan_name ? userData.subscription_details.plan_name : '-'}</dd></Col>
                  <Col md='12' className="mb-0 d-flex"><dd>Created Date and Time:</dd>&nbsp; <dd>{userData && userData.subscription_details && userData.subscription_details.created_at ? localTimeZone(userData.subscription_details.created_at) : '-'}</dd></Col>
                  <Col md='12' className="mb-0 d-flex"><dd>Expiry Date and Time:</dd>&nbsp; <dd>{userData && userData.subscription_details && userData.subscription_details.expires_at ? localTimeZone(userData.subscription_details.expires_at) : '-'}</dd></Col>
                  <Col md='12' className="mb-0 d-flex"><dd>Status:</dd>
                    <dd>
                      {(userData && userData.subscription_details) ? (
                        userData.subscription_details.is_active === true ? 'ACTIVE' : 'INACTIVE'
                      ) : '-'}


                    </dd>
                  </Col>
                </> : <Col md='12' className="mb-1 d-flex"><dd>-</dd></Col>}
              </>}
            </>}
          </Row>
        </ModalBody>
      </Modal>
    </>
  )
}

export default UserModal
