import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Nav, NavItem, NavLink, Form, FormGroup, Label, TabContent, TabPane, Button, Spinner, CardBody, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import Breadcrumbs from '@components/breadcrumbs'
import { useParams, useHistory, useLocation } from 'react-router-dom'
import { OpenNotification } from '@src/views/components/Helper'
import { useForm } from 'react-hook-form'
import { Service } from '@src/services/Service'
import Biography from './Biography'
import Photos from './Photos'
import Tributes from './Tributes'
import { Download, UploadCloud } from 'react-feather'

const AddMemorial = () => {

    const { register, control, handleSubmit, formState: { errors }, reset } = useForm()

    const [activeTab, setActiveTab] = useState('1')
    const [data, setData] = useState(null)
    const [fetching, setFetching] = useState(false)
    const [publishModal, setPublishModal] = useState(false)
    const [loading, setLoading] = useState(false)
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

    const handlePublish = () => {

        if (id) {
            const params = {
                status: 'publish'
            }
            setLoading(true)

            Service.patch({
                url: `/common/digital-memorial/${id}/`,
                body: JSON.stringify(params)
            })
                .then((response) => {
                    setPublishModal(!publishModal)
                    setLoading(false)
                    getMemorial()
                    OpenNotification('success', 'Success!', 'Digital Memorial published successfully!')
                })
                .catch(err => {
                    setLoading(false)
                    console.log('Error details:', err)

                    if (err instanceof SyntaxError) {
                        setPublishModal(!publishModal)
                        getMemorial()
                    } else {
                        setPublishModal(!publishModal)
                        OpenNotification('error', 'Oops!', 'Something went wrong while deleting the item!')
                    }
                })
        }
    }


    const handleDownload = () => {
        try {
            if (data && data.qr_code) {
                const cacheBustedUrl = `${data.qr_code}?_=${new Date().getTime()}`

                fetch(cacheBustedUrl, { cache: 'reload' })
                    .then(response => response.blob())
                    .then(blob => {
                        const url = window.URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.style.display = 'none'
                        a.href = url
                        a.download = 'qr_code.png'
                        document.body.appendChild(a)
                        a.click()
                        window.URL.revokeObjectURL(url)
                    })
                    .catch((e) => console.log(e))
            }

        } catch (error) {
            console.error('Failed to download the QR code:', error)
        }
    }

    return (
        <>
            <Breadcrumbs breadCrumbParent='Digital Memorial' breadCrumbActive={'View'} />

            {(fetching) ? <>
                <Card>
                    <CardBody className="text-center py-4">
                        <Spinner />
                    </CardBody>
                </Card>
            </> : (data === null) ? <>
                <Card> 
                    <CardBody>
                        <p className='text-center py-4'>No Data Found!</p>
                    </CardBody>
                </Card>
            </> : <>
                <Card>
                    <CardBody>
                        <Row className="d-flex align-items-center justify-content-between mb-1 mx-50">
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
                                    </div>
                                </Nav>
                            </Col>
                            <Col md="4" className="d-flex mt-1 justify-content-end">
                                {(data && data.qr_code) && <>
                                    <Button color="secondary" className="mr-1" type="button" onClick={() => { handleDownload() }}>
                                        <Download size={15} /> DOWNLOAD QR
                                    </Button>
                                </>}
                                {(activeTab && activeTab === "1" && data && data.status !== 'publish') && <>
                                    <Button color="primary" type="button" onClick={() => { setPublishModal(true) }}>
                                        <UploadCloud size={16} /> PUBLISH
                                    </Button>
                                </>}
                            </Col>
                        </Row>

                        <TabContent activeTab={activeTab}>
                            <TabPane tabId="1">
                                <Biography editInfo={data} fetching={fetching} getMemorial={getMemorial} />
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

            {/* Publish Digital Memorial */}
            <Modal isOpen={publishModal} toggle={() => setPublishModal(!publishModal)}>
                <ModalHeader toggle={() => setPublishModal(!publishModal)}>Publish Digital Memorial</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleSubmit(handlePublish)}>
                        <FormGroup>
                            <Label for="">
                                Do you want to publish this Digital Memorial ?
                            </Label>
                        </FormGroup>
                        <ModalFooter className="d-flex justify-content-start px-0">
                            <Button color="secondary" onClick={() => setPublishModal(!publishModal)}>
                                No
                            </Button>{' '}
                            <Button disabled={loading} color="primary" type="submit">
                                {(loading) ? <> <Spinner color='white' size='sm' /> </> : 'Publish'}
                            </Button>
                        </ModalFooter>
                    </Form>
                </ModalBody>
            </Modal>

        </>
    )
}

export default AddMemorial
