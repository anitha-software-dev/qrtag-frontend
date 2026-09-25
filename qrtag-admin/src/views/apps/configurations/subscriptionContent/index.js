import React, { useState, useEffect, useRef } from 'react'
import DataTable from 'react-data-table-component'
import { Button, Row, Col, Label, CustomInput, Card, Modal, ModalHeader, ModalBody, ModalFooter, Input, InputGroup, InputGroupAddon, Spinner, Form, FormGroup, CardHeader } from 'reactstrap'
import Breadcrumbs from '@components/breadcrumbs'
import UILoader from '@components/ui-loader'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import '@styles/react/apps/app-invoice.scss'
import { ChevronDown, Search, RefreshCcw, RotateCcw, Eye, Trash2, Edit, Plus, Edit2 } from 'react-feather'
import { OpenNotification, formatPhone } from '@src/views/components/Helper'
import { Service } from '@src/services/Service'
import ReactPaginate from 'react-paginate'
import { useForm } from 'react-hook-form'

const CustomHeader = ({ handlePerPage, rowsPerPage, handleAdd }) => {
    return (

        <div className='invoice-list-table-header w-100 py-2'>
            <Row>
                <Col lg='8' className='d-flex align-items-center px-0 px-lg-1'>
                    <h6>SUBSCRIPTION CONTENT</h6>
                </Col>
                <Col
                    lg='1'
                    className='actions-right d-flex align-items-center justify-content-lg-end flex-lg-nowrap flex-wrap mt-lg-0 mt-1 pr-lg-1 p-0'
                >
                </Col>
                <Col
                    lg='3'
                    className='actions-right d-flex align-items-center justify-content-lg-end flex-lg-nowrap flex-wrap mt-lg-0 mt-1 pr-lg-1 p-0'
                >
                    {/* <Button color='primary' size='sm' onClick={() => { handleAdd() }}>
                        <Plus size={14} /> Add
                    </Button> */}
                </Col>
            </Row>
        </div>
    )
}

const SubscriptionContent = () => {

    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [totalRecords, setTotalRecords] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [search, setSearch] = useState('')
    const [viewModal, setViewModal] = useState(false)
    const [editInfo, setEditInfo] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [actionType, setActionType] = useState('')
    const [itemTypesList, setItemTypesList] = useState('')
    const [name, setName] = useState('')
    const [addModal, setAddModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)

    const [features, setFeatures] = useState([''])
    const [packageSelected, setPackageSelected] = useState('')
    const [durationSelected, setDurationSelected] = useState('')
    const [subscriptionsList, setSubscriptionList] = useState([])

    const { register, control, handleSubmit, setValue, formState: { errors }, reset } = useForm()

    const getSubscriptionsList = (param) => {
        setLoading(true)

        Service.get({
            url: `/payment/stripe-products/`
        })
            .then(response => {
                setLoading(false)
                if (response.status === false) {
                    OpenNotification('error', 'Oops!', response.message)
                    return false
                } else {
                    setSubscriptionList(response)
                }
            })
            .catch(err => {
                setLoading(false)
                console.log('error', err)
            })
    }

    useEffect(() => {
        getSubscriptionsList()
    }, [currentPage, rowsPerPage])

    const handlePerPage = e => {
        setRowsPerPage(parseInt(e.target.value))
        setCurrentPage(1)
    }

    const handleAdd = async () => {
        setPackageSelected('')
        setDurationSelected('')
        setFeatures([''])
        setEditInfo(null)
        setAddModal(!addModal)
    }

    const handleEdit = (row) => {
        setEditInfo(row)
        setAddModal(!addModal)

        setTimeout(() => {
            setValue('content', row.metadata?.content)
        }, 1000)
    }

    const handleView = (row) => {
        setEditInfo(row)
        setViewModal(!addModal)
    }

    const handleDelete = (row) => {
        setDeleteModal(!deleteModal)
        setEditInfo(row)
    }

    const addFeature = () => {
        setFeatures([...features, ''])
    }

    const removeFeature = (index) => {
        const updatedFeatures = features.filter((_, i) => i !== index)
        setFeatures(updatedFeatures)
    }

    const handleFeatureChange = (index, value) => {
        const updatedFeatures = [...features]
        updatedFeatures[index] = value
        setFeatures(updatedFeatures)
    }

    const handleDeleteList = () => {
        setSubmitting(true)
        Service.delete({
            url: `/admin/package/${editInfo.id}/`
        })
            .then((response) => {
                setDeleteModal(!deleteModal)
                setSubmitting(false)
                getSubscriptionsList()
                OpenNotification('success', 'Success!', 'Subscription Content deleted successfully!')
            })
            .catch(err => {
                setSubmitting(false)
                console.log('Error details:', err)

                if (err instanceof SyntaxError) {
                    // Handle empty response as successful deletion
                    setDeleteModal(!deleteModal)
                    getSubscriptionsList()
                    OpenNotification('success', 'Success!', 'Subscription Content deleted successfully!')
                } else {
                    setDeleteModal(!deleteModal)
                    OpenNotification('error', 'Oops!', 'Something went wrong while deleting the item!')
                }
            })
    }

    const onSubmit = (data) => {

        const params = {
            metadata: {
                content: data?.content
            }
        }

        setSubmitting(true)

        if (editInfo) {
            Service.put({
                url: `/admin/stripe-products/${editInfo.id}/`,
                body: JSON.stringify(params)
            })
                .then(response => {
                    setSubmitting(false)
                    if (response.status === false) {
                        OpenNotification('error', 'Oops!', response.message)
                        return false
                    } else {
                        getSubscriptionsList()
                        setAddModal(!addModal)
                        OpenNotification('success', 'Success!', `${response.message}!`)
                    }
                })
                .catch(err => {
                    console.log('error', err)
                    setSubmitting(false)
                    OpenNotification('error', 'Oops!', 'Something went wrong!')
                })
        } else {
            Service.post({
                url: '/admin/stripe-products/',
                body: JSON.stringify(params)
            })
                .then(response => {
                    setSubmitting(false)
                    if (response.status === false) {
                        OpenNotification('error', 'Oops!', response.message)
                        return false
                    } else {
                        getSubscriptionsList()
                        setAddModal(!addModal)
                        OpenNotification('success', 'Success!', `${response.message}!`)
                    }
                })
                .catch(err => {
                    console.log('error', err)
                    setSubmitting(false)
                    OpenNotification('error', 'Oops!', 'Something went wrong!')
                })
        }
    }

    const columns = [
        {
            name: 'Package',
            selector: 'plan',
            sortable: false,
            cell: row => (
                <>
                    {(row && row.name) ? (
                        <div className='d-flex flex-column'>
                            <span className='text-truncate text-capitalize mb-0'>{(row.name) ? row.name : '-'}</span>
                        </div>
                    ) : '-'}
                </>
            )
        },
        {
            name: 'Actions',
            center: true,
            minWidth: '180px',
            cell: row => (
                <>
                    <div>
                        <Button.Ripple outline color='secondary' size='sm' onClick={() => { handleView(row) }}>
                            <Eye size={14} />
                        </Button.Ripple> &nbsp;
                        <Button.Ripple outline color='info' size='sm' onClick={() => { handleEdit(row) }}>
                            <Edit size={14} />
                        </Button.Ripple>
                    </div>

                </>
            )
        }
    ]

    return (
        <>
            <div className='invoice-list-wrapper'>
                <UILoader loader={<Spinner />}>
                    <Card className="">
                        <div className='invoice-list-dataTable mb-3'>
                            <DataTable
                                noHeader
                                subHeader={true}
                                columns={columns}
                                responsive={true}
                                sortIcon={<ChevronDown />}
                                className='react-dataTable'
                                progressPending={loading}
                                progressComponent={<div className="py-6 d-flex align-items-center"><Spinner className="w-14 text-secondary mr-1" /></div>}
                                data={subscriptionsList}
                                subHeaderComponent={
                                    <CustomHeader
                                        rowsPerPage={rowsPerPage}
                                        handlePerPage={handlePerPage}
                                        handleAdd={handleAdd}
                                    />
                                }
                            />
                        </div>
                    </Card>
                </UILoader>
            </div >


            {/* Open Modal */}
            <Modal isOpen={addModal} toggle={() => setAddModal(!addModal)} size='sm'>
                <ModalHeader toggle={() => setAddModal(!addModal)}>{editInfo ? 'Edit' : 'Add'} Subscription Feature</ModalHeader>
                <Row>
                    <ModalBody>
                        <Form onSubmit={handleSubmit(onSubmit)}>

                            <Col md='12' className='my-1 d-flex align-items-center'>
                                <Input
                                    className='w-100'
                                    type='text'
                                    id={`content`}
                                    name={`content`}
                                    placeholder={`Enter Feature`}
                                    innerRef={register({ required: true })}
                                    {...register(`content`, { required: 'Feature is required' })}
                                />
                            </Col>

                            <ModalFooter className="d-flex justify-content-end px-1">
                                <Button color="secondary" onClick={() => setAddModal(!addModal)}>
                                    Close
                                </Button>{' '}
                                <Button color="primary" type="submit">
                                    {submitting ? <> <Spinner color='white' size='sm' /> </> : 'Submit'}
                                </Button>
                            </ModalFooter>

                        </Form>
                    </ModalBody>
                </Row>
            </Modal>

            {/* Delete Modal */}
            <Modal isOpen={deleteModal} toggle={() => setDeleteModal(!deleteModal)}>
                <ModalHeader toggle={() => setDeleteModal(!deleteModal)}>Delete Item</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleSubmit(handleDeleteList)}>
                        <FormGroup>
                            <Label for="">
                                Do you want to delete this Subscription Content?
                            </Label>
                        </FormGroup>
                        <ModalFooter className="d-flex justify-content-start px-0">
                            <Button color="secondary" onClick={() => setDeleteModal(!deleteModal)}>
                                No
                            </Button>{' '}
                            <Button color="primary" type="submit">
                                {submitting ? <> <Spinner color='white' size='sm' /> </> : 'Yes'}
                            </Button>
                        </ModalFooter>
                    </Form>
                </ModalBody>
            </Modal>

            <Modal isOpen={viewModal} toggle={() => setViewModal(!viewModal)}>
                <ModalHeader toggle={() => setViewModal(!viewModal)}>View Plan</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col md='6' className="mb-1"><strong>Plan Name</strong> <dd>{editInfo && editInfo.name ? editInfo.name : '-'}</dd></Col>
                        <Col md='6' className="mb-1"><strong>Interval</strong > <dd className='text-capitalize'>{(editInfo && editInfo.metadata && editInfo.metadata?.duration) ? editInfo.metadata?.duration : '-'}</dd></Col>
                        <Col md='6' className="mb-1"><strong>Price</strong> <dd>{(editInfo && editInfo.prices && editInfo.prices.length > 0) ? editInfo.prices[0].unit_amount / 100 : '-'}</dd></Col>
                        <Col md='6' className="mb-1"><strong>Feature</strong> <dd>{(editInfo && editInfo.metadata && editInfo.metadata?.content) ? editInfo.metadata?.content : '-'}</dd></Col>
                    </Row>
                </ModalBody>
            </Modal>

        </>
    )
}

export default SubscriptionContent
