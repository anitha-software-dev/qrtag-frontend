import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Nav, NavItem, NavLink, TabContent, TabPane, Spinner, CardBody } from 'reactstrap'
import Breadcrumbs from '@components/breadcrumbs'
import { useParams, useHistory, useLocation } from 'react-router-dom'
import { Service } from '@src/services/Service'
import Biography from './Biography'
import Photos from './Photos'
import Tributes from './Tributes'

const AddMemorial = () => {
    const [activeTab, setActiveTab] = useState('1')
    const [data, setData] = useState(null)
    const [fetching, setFetching] = useState(false)

    const { id } = useParams()
    const toggleTab = tab => {
        if (activeTab !== tab) setActiveTab(tab)
    }

    const getMemorial = () => {
        setFetching(true)
        Service.get({
            url: `/common/digital-memorial/${id}/`
        })
            .then(response => {
                setFetching(false)
                if (response && response?.id) {
                    setData(response)
                }
            })
            .catch(err => {
                setData(null)
                setFetching(false)
                console.log('error', err)
            })
    }

    useEffect(() => {
        if (id) {
            getMemorial()
        }
    }, [id])

    return (
        <>
            <Breadcrumbs breadCrumbParent='Digital Memorial' breadCrumbActive={(id) ? 'Edit' : 'Add'} />
            {(fetching) ? <>
                <Card>
                    <CardBody className="text-center py-4">
                        <Spinner />
                    </CardBody>
                </Card>
            </> : (id && data === null) ? <>
                <Card>
                    <CardBody>
                        <p className='text-center py-4'>No Data Found!</p>
                    </CardBody>
                </Card>
            </> : <>
                <Card>
                    <CardBody>
                        <Row className="d-flex align-items-center mx-0">
                            <Col md="8" className="d-flex mt-1">
                                <Nav tabs style={{ width: '100%' }}>
                                    <div className='d-flex'>
                                        <NavItem>
                                            <NavLink
                                                className={activeTab === '1' ? 'active' : ''}
                                                onClick={() => toggleTab('1')}
                                            >
                                                BIOGRAPHY
                                            </NavLink>
                                        </NavItem>
                                        {(id) && <>
                                            <NavItem>
                                                <NavLink
                                                    className={activeTab === '2' ? 'active' : ''}
                                                    onClick={() => toggleTab('2')}
                                                >
                                                    PHOTOS
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    className={activeTab === '3' ? 'active' : ''}
                                                    onClick={() => toggleTab('3')}
                                                >
                                                    TRIBUTES
                                                </NavLink>
                                            </NavItem>
                                        </>}
                                    </div>
                                </Nav>
                            </Col>
                        </Row>

                        <TabContent activeTab={activeTab}>
                            <TabPane tabId="1">
                                <Biography editData={data} />
                            </TabPane>
                            <TabPane tabId="2">
                                <Photos editData={data} getMemorial={getMemorial} />
                            </TabPane>
                            <TabPane tabId="3">
                                <Tributes editData={data} />
                            </TabPane>
                        </TabContent>
                    </CardBody>
                </Card>
            </>}
        </>
    )
}

export default AddMemorial
