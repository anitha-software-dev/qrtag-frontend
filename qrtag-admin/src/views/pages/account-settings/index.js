// ** React Imports
import { Fragment, useEffect, useState } from 'react'
import { Row, Col } from 'reactstrap'
import Breadcrumbs from '@components/breadcrumbs'
import DownloadCode from './DownloadCode'
import SettingCode from './SettingCode'
import PingDelayTime from './PingDelayTime'
import { Service } from '@src/services/Service'
import '@styles/react/pages/page-account-settings.scss'

const Security = () => {
  
  const [locationList, setLocationList] = useState([])

  // PRIMARY LOCATIONS
  const getPrimaryLocationList = (param) => {
    const params = { page: 1, limit: 1000 }

    Service.get({
      url: `/primary-location/?${new URLSearchParams(params).toString()}`
    }).then(response => {
      if (response) {
        if (response && response.data && response.data.length > 0) {
          const tmp = response.data.map((item) => { return { value: item.id, label: item.location_name } })
          setLocationList(tmp)
        } else {
          setLocationList([])
        }
      }
    }).catch(err => {
      setLocationList([])
    })
  }

  useEffect(() => {
    getPrimaryLocationList()
  }, [])

  return (
    <Fragment>
      <Breadcrumbs breadCrumbTitle='Manage Configurations' breadCrumbParent='Configurations' breadCrumbActive='Details' />
      <Row>
        <Col sm="4">
          <DownloadCode />
        </Col>

        <Col sm="4">
          <SettingCode />
        </Col>

        <Col sm="4">
          <PingDelayTime />
        </Col>
      </Row>
    </Fragment>
  )
}

export default Security
