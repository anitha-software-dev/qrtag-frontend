import React, { useState, useEffect, useRef } from 'react'
import DataTable from 'react-data-table-component'
import { Button, Row, Col, Label, CustomInput, Card, Badge, Modal, ModalHeader, ModalBody, ModalFooter, Input, InputGroup, InputGroupAddon } from 'reactstrap'
import Breadcrumbs from '@components/breadcrumbs'
import UILoader from '@components/ui-loader'
import Spinner from '@components/spinner/Loading-spinner'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import '@styles/react/apps/app-invoice.scss'
import { ChevronDown, Search, RefreshCcw, RotateCcw, Eye } from 'react-feather'
import { OpenNotification, formatPhone, localTimeZone, formatPhoneNumber } from '@src/views/components/Helper'
import { Service } from '@src/services/Service'
import ReactPaginate from 'react-paginate'
import defaultAvatar from '@src/assets/images/avatars/avatar-blank.png'

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

const Subscriptions = () => {

    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [totalRecords, setTotalRecords] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [search, setSearch] = useState('')
    const [viewModal, setViewModal] = useState(false)
    const [editInfo, setEditInfo] = useState(null)

    const [subscriptionsList, setSubscriptionList] = useState([])
    const [plan, setPlan] = useState('')
    const [status, setStatus] = useState('')

    const getSubscriptionsList = (param = {}) => {
        setLoading(true)

        // const params = { page: (param && param.page) || currentPage, limit: (param && param.limit) || rowsPerPage, keyword: search || '', plan: (param && param.plan) || plan, status: (param && param.status) || status }

        const params = {
            page: (param && param.page) || currentPage,
            limit: (param && param.limit) || rowsPerPage
        }

        if (search) {
            params.keyword = search
        }

        if (plan) {
            params.plan = plan
        }

        if (status) {
            params.status = status
        }

        if (param && param.search !== undefined && param.search !== '') {
            params.keyword = param.search
        }

        if (param && param.reset) {
            params.page = 1
            params.limit = 10
            params.keyword = ''
            params.plan = ''
            params.status = ''
        }

        Service.get({
            url: `/admin/user-subscriptions/?${new URLSearchParams(params).toString()}`
        })
            .then(response => {
                setLoading(false)
                if (response.status === 'error') {
                    response.data.then(res => {
                        OpenNotification('error', 'Oops!', res.message)
                    })
                    return false
                } else {
                    setSubscriptionList(response.subscriptions)
                    setTotalRecords(response.total_subscriptions)
                }
            })
            .catch(err => {
                setLoading(false)
                console.log('error', err)
                OpenNotification('error', 'Oops!', 'Something went wrong!')
            })
    }

    useEffect(() => {
        getSubscriptionsList({ page: 1 })
        setCurrentPage(1)
    }, [plan, status])

    const handlePagination = page => {
        setCurrentPage(page.selected + 1)
        getSubscriptionsList({ page: page.selected + 1 })
    }
    const handlePerPage = e => {
        setRowsPerPage(parseInt(e.target.value))
        setCurrentPage(1)
        getSubscriptionsList({
            limit: parseInt(e.target.value),
            page: 1
        })
    }

    const handleReset = () => {
        setSearch('')
        setPlan('')
        setStatus('')
        setCurrentPage(1)
        setRowsPerPage(10)
        // getSubscriptionsList({ reset: true })
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
            name: 'User',
            selector: 'user',
            sortable: false,
            minWidth: '400px',
            cell: row => (
                <>
                    {(row && row.user) ? <>
                        <div className='d-flex align-items-center'>
                            <img
                                src={row.user.looser.profile_picture ? row.user.looser.profile_picture : defaultAvatar}
                                alt="Profile"
                                style={{ borderRadius: '50%', width: '35px', height: '35px', marginRight: '10px' }}
                            />
                            <div className='d-flex flex-column'>
                                <span className='text-primary font-weight-bold'>{(row.user.name) ? row.user.name : '-'}</span>
                                <span className='mt-0'>{(row.user.email) ? row.user.email : ''}</span>
                            </div>
                        </div>
                    </> : '-'}
                </>
            )
        },
        {
            name: 'Plan Name',
            selector: 'email',
            sortable: false,
            cell: row => (
                <>
                    {(row && row.user) ? (
                        <div className='d-flex flex-column'>
                            <span className='text-truncate mb-0'>{(row.user.current_plan) ? row.user.current_plan : '-'}</span>
                        </div>
                    ) : '-'}
                </>
            )
        },
        {
            name: 'Status',
            selector: 'status',
            center: true,
            minWidth: '100px',
            sortable: false,
            cell: row => {
                return (
                    <>
                        {(row) ? (
                            row.is_active === true ? <Badge pill color='success'>ACTIVE</Badge> : (row.is_active === false && row.inactive_reason === "Revoked") ? <Badge pill color='danger'>REVOKED</Badge> : row.is_active === false ? <Badge pill color='danger'>EXPIRED</Badge> : '-'
                        ) : '-'}
                    </>
                )
            }
        },
        {
            name: 'Action',
            center: true,
            minWidth: '180px',
            cell: row => (
                <>
                    <Button.Ripple outline color='secondary' size='sm' onClick={() => { setEditInfo(row); setViewModal(!viewModal) }}>
                        <Eye size={14} />
                    </Button.Ripple>

                </>
            )
        }
    ]

    return (
        <>
            <Breadcrumbs breadCrumbParent='Subscriptions' breadCrumbActive='List' />

            <div className='invoice-list-wrapper'>
                <UILoader loader={<Spinner />}>
                    <Card className="p-2">
                        <Row className="d-flex justify-content- align-items-center ">
                            <Col md="4" className="d-flex align-items-center justify-content-center">
                                <div className='mr- w-100'>
                                    <InputGroup>
                                        <Input
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter' && search.trim() !== '') {
                                                    getSubscriptionsList({ search, page: 1 })
                                                    setCurrentPage(1)
                                                }
                                            }}
                                            id='search-code'
                                            type='text'
                                            placeholder="Search"
                                        />
                                        <InputGroupAddon addonType='append'>
                                            <Button color='secondary' outline style={{ height: "38px" }}
                                                onClick={() => {
                                                    if (search !== '') {
                                                        getSubscriptionsList({ search, page: 1 }); setCurrentPage(1)
                                                    }
                                                }}>
                                                <Search size={14} />
                                            </Button>
                                        </InputGroupAddon>
                                    </InputGroup>
                                </div>
                            </Col>
                            <Col md="3">
                                <Input
                                    id='plan'
                                    type='select'
                                    value={plan}
                                    onChange={(e) => { setPlan(e.target.value) }}
                                >
                                    <option defaultValue={''} hidden>
                                        Select Plan
                                    </option>
                                    <option value="standard">Standard</option>
                                    <option value="premium">Premium</option>
                                </Input>
                            </Col>
                            <Col md="3">
                                <Input
                                    id='status'
                                    type='select'
                                    value={status}
                                    onChange={(e) => { setStatus(e.target.value) }}
                                >
                                    <option defaultValue={''} hidden>
                                        Select Status
                                    </option>
                                    <option value="expired">Expired</option>
                                    <option value="active">Active</option>
                                    <option value="revoked">Revoked</option>
                                </Input>
                            </Col>
                            <Col md='2'>
                                <Button color='secondary' title="Reset" onClick={() => handleReset()}>
                                    <RefreshCcw size={14} />
                                </Button>
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
                                data={subscriptionsList}
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

            {/* view subscription */}
            {editInfo && (
                <Modal isOpen={viewModal} toggle={() => setViewModal(!viewModal)} className='modal-dialog-centered' size="sm">
                    <ModalHeader toggle={() => setViewModal(!viewModal)}>View Subscription Details</ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col md='12' className="mb-1"><strong>Name</strong> <dd>{editInfo && editInfo.user.name ? editInfo.user.name : '-'}</dd></Col>
                            <Col md='12' className="mb-1"><strong>Email</strong> <dd>{editInfo && editInfo.user.email ? editInfo.user.email : '-'}</dd></Col>
                            <Col md='12' className="mb-1"><strong>Phone Number</strong> <dd>{editInfo && editInfo.user.phone_number ? formatPhoneNumber(editInfo.user.phone_number, editInfo.user.country_code) : '-'}</dd></Col>
                            <Col md='12' className="mb-1"><strong>Address</strong> <dd>{editInfo && editInfo.user.looser.address ? editInfo.user.looser.address : '-'}</dd></Col>
                            <Col md='12' className="mb-1"><strong>Plan Name</strong> <dd>{editInfo && editInfo.user.subscription_plan ? editInfo.user.subscription_plan : '-'}</dd></Col>
                            <Col md='12' className="mb-1"><strong>Created Date and Time</strong> <dd>{editInfo && editInfo.created_at ? localTimeZone(editInfo.created_at) : '-'}</dd></Col>
                            <Col md='12' className="mb-1"><strong>Expiry Date and Time</strong> <dd>{((editInfo && editInfo.user.is_honorary === true) || (editInfo && editInfo.inactive_reason)) ? '-' : (editInfo && editInfo.user.plan_expires_at) ? localTimeZone(editInfo.user.plan_expires_at) : "-"}</dd></Col>
                            <Col md='12' className="mb-1"><strong>Status</strong>
                                <dd>
                                    {(editInfo) ? (
                                        editInfo.is_active === true ? <Badge pill color='success'>ACTIVE</Badge> : (editInfo.is_active === false && editInfo.inactive_reason === "Revoked") ? <Badge pill color='danger'>REVOKED</Badge> : editInfo.is_active === false ? <Badge pill color='danger'>EXPIRED</Badge> : '-'
                                    ) : '-'}
                                </dd>
                            </Col>
                        </Row>
                    </ModalBody>
                </Modal>
            )}
        </>
    )
}

export default Subscriptions
