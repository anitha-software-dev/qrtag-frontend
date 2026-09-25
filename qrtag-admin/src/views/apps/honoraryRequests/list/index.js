import React, { useState, useEffect, useRef } from 'react'
import DataTable from 'react-data-table-component'
import { Button, Row, Col, Label, CustomInput, Card, Modal, ModalHeader, ModalBody, ModalFooter, Input, InputGroup, InputGroupAddon, Spinner, FormGroup, Form } from 'reactstrap'
import Breadcrumbs from '@components/breadcrumbs'
import UILoader from '@components/ui-loader'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import '@styles/react/apps/app-invoice.scss'
import { ChevronDown, Search, RefreshCcw, RotateCcw, Eye } from 'react-feather'
import { OpenNotification, formatPhone } from '@src/views/components/Helper'
import { Service } from '@src/services/Service'
import ReactPaginate from 'react-paginate'
import { useForm } from 'react-hook-form'

const CustomHeader = ({ handlePerPage, rowsPerPage }) => {
    return (

        <div className='invoice-list-table-header w-100 py-2'>
            <Row>
                <Col lg='4' className='d-flex align-items-center px-0 px-lg-1'>
                    <div className='d-flex align-items-center mr-2'>
                        <Label for='rows-per-page'>Show</Label>
                        <CustomInput
                            className='form-control ml-50 pr-3'
                            type='select'
                            id='rows-per-page'
                            value={rowsPerPage}
                            onChange={handlePerPage}
                        >
                            <option value='10'>10</option>
                            <option value='25'>25</option>
                            <option value='50'>50</option>
                        </CustomInput>
                    </div>

                </Col>
                <Col
                    lg='8'
                    className='actions-right d-flex align-items-center justify-content-lg-end flex-lg-nowrap flex-wrap mt-lg-0 mt-1 pr-lg-1 p-0'
                >
                </Col>
            </Row>
        </div>
    )
}

const HonoraryRequests = () => {

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
    const [requestList, setRequestList] = useState('')

    const { register, control, watch, handleSubmit, formState: { errors }, reset } = useForm()

    const getUsersList = (param) => {
        setLoading(true)

        const params = { page: (param && param.page) || currentPage, limit: (param && param.limit) || rowsPerPage }
        // if (param && param.search !== '') {
        //     params.keyword = param.search
        // }

        Service.get({
            url: `/admin/honorary-user/access-requests/?${new URLSearchParams(params).toString()}`
        })
            .then(response => {
                setLoading(false)
                if (response.status === 'error') {
                    response.data.then(res => {
                        OpenNotification('error', 'Oops!', res.message)
                    })
                    return false
                } else {
                    setRequestList(response.access_requests)
                    setTotalRecords(response.total_requests)
                }
            })
            .catch(err => {
                setLoading(false)
                console.log('error', err)
                OpenNotification('error', 'Oops!', 'Something went wrong!')
            })
    }
    useEffect(() => {
        getUsersList()
    }, [])

    const handlePagination = page => {
        setCurrentPage(page.selected + 1)
        getUsersList({ page: page.selected + 1 })
    }

    const handlePerPage = e => {
        setRowsPerPage(parseInt(e.target.value))
        setCurrentPage(1)
        getUsersList({
            limit: parseInt(e.target.value),
            page: 1
        })
    }

    const handleReset = () => {
        setSearch('')
        getUsersList()
    }

    const handleAccept = (row) => {
        setActionType('accept')
        setEditInfo(row)
        setModalOpen(!modalOpen)
    }

    const handleDecline = (row) => {
        setActionType('decline')
        setEditInfo(row)
        setModalOpen(!modalOpen)
    }

    const handleRequest = (data) => {

        if (actionType === 'accept') {

            setSubmitting(true)
            Service.post({
                url: `/admin/honorary-request/${editInfo?.id}/accept/`
            })
                .then(response => {
                    setSubmitting(false)
                    setModalOpen(!modalOpen)
                    if (response.status === 'error') {
                        response.data.then(res => {
                            OpenNotification('error', 'Oops!', res.message)
                        })
                        return false
                    } else {
                        getUsersList()
                        OpenNotification('success', 'Success!', `Request accepted successfully!`)
                    }
                })
                .catch(err => {
                    console.log('error', err)
                    setModalOpen(!modalOpen)
                    setSubmitting(false)
                    OpenNotification('error', 'Oops!', 'Something went wrong!')
                })

        } else {

            const params = {
                decline_reason: data.reason
            }

            Service.post({
                url: `/admin/honorary-request/${editInfo?.id}/decline/`,
                body: JSON.stringify(params)
            })
                .then(response => {
                    setModalOpen(!modalOpen)
                    if (response.status === 'error') {
                        response.data.then(res => {
                            OpenNotification('error', 'Oops!', res.message)
                        })
                        return false
                    } else {
                        getUsersList()
                        OpenNotification('success', 'Success!', `Request declined successfully!`)
                    }
                })
                .catch(err => {
                    console.log('error', err)
                    setModalOpen(!modalOpen)
                    OpenNotification('error', 'Oops!', 'Something went wrong!')
                })
        }
    }

    const CustomPagination = () => {
        const count = Number(Math.ceil(totalRecords / rowsPerPage))

        return (
            <div className="d-flex justify-content-between align-items-center p-1">
                <p className='mb-1 ml-1'>Total Entries: {totalRecords}</p>
                <ReactPaginate
                    pageCount={count || 1}
                    nextLabel=''
                    breakLabel='...'
                    previousLabel=''
                    activeClassName='active'
                    breakClassName='page-item'
                    breakLinkClassName='page-link'
                    forcePage={currentPage !== 0 ? currentPage - 1 : 0}
                    onPageChange={page => handlePagination(page)}
                    pageClassName={'page-item'}
                    nextLinkClassName={'page-link'}
                    nextClassName={'page-item next'}
                    previousClassName={'page-item prev'}
                    previousLinkClassName={'page-link'}
                    pageLinkClassName={'page-link'}
                    containerClassName={'pagination react-paginate justify-content-end p-1'}
                />
            </div>
        )
    }

    const columns = [
        {
            name: 'Account',
            selector: 'account',
            sortable: false,
            cell: row => (
                <>
                    {(row && row.email) ? (
                        <div className='d-flex flex-column'>
                            <span className='text-truncate mb-0'>{(row.email) ? row.email : '-'}</span>
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
                        <Button
                            color="secondary"
                            size="sm"
                            onClick={() => { setEditInfo(row); setViewModal(!viewModal) }}
                            className="mr-1"
                        >
                            View
                        </Button>
                        <Button
                            color="success"
                            size="sm"
                            onClick={() => handleAccept(row)}
                            className="mr-1"
                        >
                            Accept
                        </Button>
                        <Button
                            color="danger"
                            size="sm"
                            onClick={() => handleDecline(row)}
                        >
                            Decline
                        </Button>
                    </div>

                </>
            )
        }
    ]

    return (
        <>
            <Breadcrumbs breadCrumbParent='Honorary Requests' breadCrumbActive='List' />

            <div className='invoice-list-wrapper'>
                <UILoader loader={<Spinner />}>
                    <Card className="p-2 d-none">
                        <Row className="d-flex justify-content-end align-items-center ">
                            <Col md="4" className="d-flex align-items-center justify-content-center">
                                <div className='mr-1 w-100'>
                                    <InputGroup>
                                        <Input
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            id='search-code'
                                            type='text'
                                            placeholder="Search"
                                        />
                                        <InputGroupAddon addonType='append'>
                                            <Button color='secondary' outline style={{ height: "38px" }}
                                                onClick={() => {
                                                    if (search !== '') {
                                                        getUsersList({ search })
                                                    }
                                                }}>
                                                <Search size={14} />
                                            </Button>
                                        </InputGroupAddon>
                                    </InputGroup>
                                </div>
                                <Button color='secondary' title="Reset" onClick={() => handleReset()}>
                                    <RefreshCcw size={14} />
                                </Button>
                            </Col>
                            <Col md="2">

                            </Col>
                            <Col md="2">

                            </Col>
                            <Col md="2">

                            </Col>
                            <Col md="2">

                            </Col>
                        </Row>
                    </Card>
                    <Card className="">
                        <div className='invoice-list-dataTable mb-3'>
                            <DataTable
                                noHeader
                                pagination
                                paginationServer
                                subHeader={true}
                                columns={columns}
                                responsive={true}
                                sortIcon={<ChevronDown />}
                                className='react-dataTable'
                                paginationDefaultPage={currentPage}
                                paginationComponent={CustomPagination}
                                progressPending={loading}
                                progressComponent={<div className="py-6 d-flex align-items-center"><Spinner className="w-14 text-secondary mr-1" /></div>}
                                data={requestList}
                                subHeaderComponent={
                                    <CustomHeader
                                        rowsPerPage={rowsPerPage}
                                        handlePerPage={handlePerPage}
                                    />
                                }
                            />
                        </div>
                    </Card>
                </UILoader>
            </div >

            {/* View Honorary Request */}
            <Modal isOpen={viewModal} toggle={() => setViewModal(!viewModal)} className='modal-dialog-centered' size='md'>
                <ModalHeader toggle={() => setViewModal(!viewModal)}>View Honorary Request</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col md='12' className='mb-1'><strong>Name</strong> <dd>{editInfo && editInfo.name ? editInfo.name : '-'}</dd></Col>
                        <Col md='12' className='mb-1'><strong>Email</strong> <dd>{editInfo && editInfo.email ? editInfo.email : '-'}</dd></Col>
                        <Col md='12' className='mb-1'><strong>Phone Number</strong> <dd>{editInfo && editInfo.phone_number ? editInfo.phone_number : '-'}</dd></Col>
                        <Col md='12' className='mb-1'><strong>City & State</strong> <dd>{editInfo && editInfo.city ? editInfo.city : ''}, {editInfo && editInfo.state ? editInfo.state : ''}</dd></Col>
                        <Col md='12' className='mb-1'><strong>What was your branch of the military you served in?</strong> <dd>{editInfo && editInfo.branch_of_military ? editInfo.branch_of_military : '-'}</dd></Col>
                        <Col md='12' className='mb-1'><strong>What was you MOS?</strong> <dd>{editInfo && editInfo.mos ? editInfo.mos : '-'}</dd></Col>
                        <Col md='12' className='mb-1'><strong>What were your years of service?</strong> <dd>{editInfo && editInfo.years_of_service ? editInfo.years_of_service : '-'}</dd></Col>
                        <Col md='12' className='mb-1'><strong>What was your rank at the time of separation?</strong> <dd>{editInfo && editInfo.rank_at_seperation ? editInfo.rank_at_seperation : '-'}</dd></Col>
                        <Col md='12' className='mb-1'><strong>Why should I be granted honorary access?</strong> <dd>{editInfo && editInfo.honorary_access_reason ? editInfo.honorary_access_reason : '-'}</dd></Col>

                    </Row>
                </ModalBody>
            </Modal>

            {/* Request Confirmation Alert */}
            <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)} size='sm'>
                <ModalHeader toggle={() => setModalOpen(!modalOpen)}><div className='text-capitalize'>Honorary Request</div></ModalHeader>
                <Form onSubmit={handleSubmit(handleRequest)}>
                    {/* <Form > */}
                    <ModalBody>
                        Are you sure you want to {actionType}?

                        <FormGroup className={actionType === 'accept' ? 'd-none' : ' mt-1'}>
                            <h6 for="reason">
                                Reason:
                            </h6>
                            <Input
                                id="reason"
                                name="reason"
                                placeholder="Enter Reason"
                                type="textarea"
                                innerRef={register({
                                    validate: (value) => {
                                        if (actionType === 'decline' && (!value || value.trim() === '')) {
                                            return 'Reason is required when declining the request'
                                        }
                                        return true
                                    }
                                })}
                                invalid={!!errors.reason}
                            />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color='secondary' onClick={() => setModalOpen(!modalOpen)}>No</Button>
                        <Button type='submit' color={actionType === 'accept' ? 'success' : 'danger'} >
                            {(submitting) ? <> <Spinner color='white' size='sm' /> </> : 'Yes'}
                        </Button>
                    </ModalFooter>
                </Form>
            </Modal>

        </>
    )
}

export default HonoraryRequests
