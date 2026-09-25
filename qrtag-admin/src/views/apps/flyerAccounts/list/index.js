import React, { useState, useEffect, useRef } from 'react'
import DataTable from 'react-data-table-component'
import { Button, Row, Col, Label, CustomInput, Card, Badge, Modal, ModalHeader, ModalBody, ModalFooter, Input, InputGroup, InputGroupAddon } from 'reactstrap'
import Breadcrumbs from '@components/breadcrumbs'
import UILoader from '@components/ui-loader'
import Spinner from '@components/spinner/Loading-spinner'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import '@styles/react/apps/app-invoice.scss'
import { ChevronDown, Search, RefreshCcw, RotateCcw, Eye } from 'react-feather'
import { OpenNotification, formatPhone, localTimeZone } from '@src/views/components/Helper'
import { Service } from '@src/services/Service'
import ReactPaginate from 'react-paginate'

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

const Accounts = () => {

    const [revokeModal, setRevokeModal] = useState(false)
    const [users, setUsers] = useState([])
    const [deleteId, setDeleteId] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [totalRecords, setTotalRecords] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [search, setSearch] = useState('')
    const [viewModal, setViewModal] = useState(false)
    const [editInfo, setEditInfo] = useState(null)

    const toggleRevokeModal = () => setRevokeModal(!revokeModal)

    const getUsersList = (param) => {
        setLoading(true)

        const params = { page: (param && param.page) || currentPage, limit: (param && param.limit) || rowsPerPage }

        if (search) {
            params.keyword = search
        }
        if (param && param.search !== undefined && param.search !== '') {
            params.keyword = param.search
        }
        if (param && param.reset) {
            params.page = 1
            params.limit = 10
            params.keyword = ''
        }

        Service.get({
            url: `/flyer/user/?${new URLSearchParams(params).toString()}`
        })
            .then(response => {
                setLoading(false)
                if (response.status === 'error') {
                    response.data.then(res => {
                        OpenNotification('error', 'Oops!', res.message)
                    })
                    return false
                } else {
                    setUsers(response.users)
                    setTotalRecords(response.total_users)
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

    const DeleteUsers = () => {
        return false
    }

    const handleDelete = (row) => {
        toggleRevokeModal()
        setDeleteId(row.id)
    }

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
        setCurrentPage(1)
        setRowsPerPage(10)
        getUsersList({ reset: true })
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
            minWidth: '350px',
            cell: row => (
                <>
                    {(row && row.email) ? (
                        <div className='d-flex flex-column'>
                            <span className='text-primary font-weight-bold'>{(row.name) ? row.name : '-'}</span>
                            <span className='text-truncate mb-0'>{(row.email) ? row.email : ''}</span>
                        </div>
                    ) : '-'}
                </>
            )
        },
        {
            name: 'Contact',
            selector: 'contact',
            sortable: false,
            cell: row => (
                <>
                    <div className='d-flex flex-column'>
                        <span className='text-truncate mb-0'>{(row.contact) ? formatPhone(row.contact) : '-'}</span>
                    </div>
                </>
            )
        },
        {
            name: 'Status',
            selector: 'status',
            center: true,
            minWidth: '100px',
            sortable: false,
            cell: row => (
                <>{(row.status === true) ? <Badge pill color='success'>Signed Up</Badge> : <Badge pill color='secondary'>Form Filled</Badge>}</>
            )
        },
        {
            name: 'Action',
            center: true,
            minWidth: '180px',
            cell: row => (
                <>
                    <Button outline color='secondary' size='sm' onClick={() => { setEditInfo(row); setViewModal(!viewModal) }}>
                        <Eye size={14} />
                    </Button>

                </>
            )
        }
    ]

    return (
        <>
            <Breadcrumbs breadCrumbParent='Flyer Accounts' breadCrumbActive='List' />

            <div className='invoice-list-wrapper'>
                <UILoader loader={<Spinner />}>
                    <Card className="p-2">
                        <Row className="d-flex justify-content-between align-items-center ">
                            <Col md="4" className="d-flex align-items-center justify-content-center">
                                <div className='mr-1 w-100'>
                                    <InputGroup>
                                        <Input
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter' && search.trim() !== '') {
                                                    getUsersList({ search, page: 1 })
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
                                                        getUsersList({ search, page: 1 }); setCurrentPage(1)
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
                                data={users}
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

            {/* view flyer account */}
            <Modal isOpen={viewModal} toggle={() => setViewModal(!viewModal)} className='modal-dialog-centered' size="sm">
                <ModalHeader toggle={() => setViewModal(!viewModal)}>View Flyer Account</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col md='12' className="mb-1"><strong>Name</strong> <dd>{editInfo && editInfo.name ? editInfo.name : '-'}</dd></Col>
                        <Col md='12' className="mb-1"><strong>Email</strong> <dd>{editInfo && editInfo.email ? editInfo.email : '-'}</dd></Col>
                        <Col md='12' className="mb-1"><strong>Contact</strong> <dd>{editInfo && editInfo.contact ? formatPhone(editInfo.contact) : '-'}</dd></Col>
                        <Col md='12' className="mb-"><strong>Is Veteran?</strong> <dd>{editInfo && editInfo.is_veteran ? 'Yes' : 'No'}</dd></Col>
                        {(editInfo && editInfo.is_veteran) &&
                            <Col md='12'><strong>Veteran Detail</strong> <dd>{editInfo && editInfo.veteran_details ? editInfo.veteran_details : '-'}</dd></Col>
                        }
                        <Col md="12" className="mt-50 mb-1"><strong>Status</strong> <dd className='mt-50'>{(editInfo && editInfo.status === true) ? <Badge pill color='success'>Signed Up</Badge> : <Badge pill color='secondary'>Form Filled</Badge>}</dd></Col>

                        {/* <Col md='12' className="mb-1"><strong>Date and Time the form was filled</strong> <dd>{editInfo && moment.utc(editInfo.created_at).format('YYYY-MM-DD (hh:mm A)')}</dd></Col> */}
                        <Col md='12' className="mb-1"><strong>Date of Form Filled</strong> <dd>
                            {(editInfo && editInfo.is_provided) ? <div className='text-muted'>Coupon Code Provided By Someone</div> : editInfo ? localTimeZone(editInfo.created_at) : '-'}
                        </dd></Col>
                        <Col md='12' className="mb-1"><strong>Date of Coupon Applied</strong> <dd>{(editInfo && editInfo.coupon_applied_at) ? localTimeZone(editInfo.coupon_applied_at) : '-'}</dd></Col>
                    </Row>
                </ModalBody>
            </Modal>

            <Modal isOpen={revokeModal} toggle={toggleRevokeModal}>
                <ModalHeader toggle={toggleRevokeModal}>Revoke Account</ModalHeader>
                <ModalBody>
                    Are you sure you want to revoke this account?
                </ModalBody>
                <ModalFooter>
                    <Button onClick={DeleteUsers} style={{
                        background: 'linear-gradient(118deg, #4A32EF, #4A32EF)',
                        border: 'none'
                    }}>
                        Yes
                    </Button>
                    <Button color='secondary' onClick={toggleRevokeModal}>
                        No
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    )
}

export default Accounts
