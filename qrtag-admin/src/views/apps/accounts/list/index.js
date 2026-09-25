import React, { useState, useEffect, useRef } from 'react'
import DataTable from 'react-data-table-component'
import { Button, Row, Col, Label, CustomInput, Card, Modal, ModalHeader, ModalBody, ModalFooter, Input, InputGroup, InputGroupAddon, Badge, Spinner, Form } from 'reactstrap'
import Breadcrumbs from '@components/breadcrumbs'
import UILoader from '@components/ui-loader'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import '@styles/react/apps/app-invoice.scss'
import { ChevronDown, Search, RefreshCcw, RotateCcw } from 'react-feather'
import { OpenNotification, formatPhone, localTimeZoneDate } from '@src/views/components/Helper'
import { Service } from '@src/services/Service'
import ReactPaginate from 'react-paginate'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import moment from 'moment'

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

    const [addEmailModal, setAddEmailModal] = useState(false)
    const [revokeModal, setRevokeModal] = useState(false)
    const [email, setEmail] = useState('')
    const [users, setUsers] = useState([])
    const [deleteId, setDeleteId] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [totalRecords, setTotalRecords] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [search, setSearch] = useState('')
    const [userType, setUserType] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [viewModal, setViewModal] = useState(false)
    const [editInfo, setEditInfo] = useState(null)

    const { register, control, handleSubmit, formState: { errors }, reset } = useForm()

    const fileInputRef = useRef(null)

    const toggleAddEmailModal = () => setAddEmailModal(!addEmailModal)
    const toggleRevokeModal = () => setRevokeModal(!revokeModal)

    const getUsersList = (param = {}) => {

        const params = { page: (param && param.page) || currentPage, limit: (param && param.limit) || rowsPerPage }

        if (search) {
            params.keyword = search
        }
        if (param && param.search !== undefined && param.search !== '') {
            params.keyword = param.search
        }

        const userValue = param.user !== undefined ? param.user : userType
        if (userValue === 'app') {
            params.user_filter = true
        } else if (userValue === 'admin') {
            params.user_filter = false
        } else if (userValue === '') {
            // params.user_filter = ''
        }
        if (param && param.reset) {
            params.page = 1
            params.limit = 10
            params.keyword = ''
            params.user_filter = ''
        }
        setLoading(true)

        Service.get({
            url: `/admin/honorary-user/?${new URLSearchParams(params).toString()}`
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
                    console.log(" users:", response.users)
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

    const AddUsers = () => {

        const params = {
            email
        }
        if (email !== '') {

            setSubmitting(true)
            Service.post({
                url: '/admin/honorary-user/',
                body: JSON.stringify(params)
            })
                .then(response => {
                    setSubmitting(false)
                    if (response && response.status === 'error') {
                        response.data.then(res => {
                            if (res && res.email && res.email[0]) {
                                OpenNotification('error', 'Oops!', res.email[0])
                            } else {
                                OpenNotification('error', 'Oops!', 'User addition failed!')
                            }
                        })
                        return false
                    } else {
                        setEmail('')
                        OpenNotification('success', 'Success!', `${response.message}`)
                        toggleAddEmailModal()
                        getUsersList()
                    }
                })
                .catch(err => {
                    setEmail('')
                    console.error(err)
                    setSubmitting(false)
                    OpenNotification('error', 'Oops!', 'Something went wrong!')
                })
        }
    }

    const ImportUsers = (file) => {
        const formData = new FormData()
        formData.append('file', file)

        Service.post({
            url: '/admin/honorary-user/import-csv/',
            body: formData,
            formdata: true
        })
            .then(response => {
                if (response.status === 'error') {
                    OpenNotification('error', 'Oops!', 'Failed to File Import.')
                    return false
                } else {
                    OpenNotification('success', 'File Imported', 'File Imported successfully.')
                    getUsersList()
                }
            })
            .catch(err => {
                console.error('Import error:', err)
                OpenNotification('error', 'Oops!', 'Something went wrong!')
            })
    }

    const DeleteUsers = () => {
        setSubmitting(true)
        Service.post({
            url: `/admin/honorary-request/${deleteId}/revoke-access/`
        })
            .then(response => {
                setSubmitting(false)
                toggleRevokeModal()
                if (response.status === 'error') {
                    response.data.then(res => {
                        OpenNotification('error', 'Oops!', res.message)
                    })
                    return false
                } else {
                    OpenNotification('success', 'Access Revoked', 'Access has been successfully revoked.')
                    getUsersList()
                }
            })
            .catch(err => {
                setSubmitting(false)
                console.error(err)
                OpenNotification('error', 'Oops!', 'Something went wrong!')
            })
    }

    const handleAddEmail = () => {
        toggleAddEmailModal()
    }

    const handleDelete = (row) => {
        toggleRevokeModal()
        setDeleteId(row.id)
    }
    const handleImportCSV = () => {
        fileInputRef.current.click()
    }

    const handleFileChange = event => {
        const file = event.target.files[0]
        ImportUsers(file)
        const validFileExtensions = ['csv', 'xls', 'xlsx']
        const fileExtension = file.name.split('.').pop().toLowerCase()

        if (!validFileExtensions.includes(fileExtension)) {
            OpenNotification('error', 'Error!', 'Invalid file type. Please upload a CSV or Excel file.')
        }

        // OpenNotification('success', 'Success!', 'File is valid and ready for processing')
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
        setUserType('')
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
            name: 'Status',
            selector: 'status',
            center: true,
            minWidth: '250px',
            sortable: false,
            cell: row => {
                return (
                    <>
                        <><Badge pill color='secondary'>{(row.status === true) ? 'User through App' : 'User through Admin'}</Badge> </>
                    </>
                )
            }
        },
        {
            name: 'Applied Date',
            selector: 'date',
            maxWidth: '150px',
            sortable: false,
            cell: row => (
                <>
                    {(row && row.created_at) ? (
                        <div className='d-flex flex-column'>
                            <span className='text-truncate mb-0'>
                                {localTimeZoneDate(row.created_at)}
                            </span>
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
                    <Button.Ripple outline color='secondary' className='mr-1' size='sm' onClick={() => { setEditInfo(row); setViewModal(!viewModal) }}>
                        View
                    </Button.Ripple>
                    <Button.Ripple outline color='danger' size='sm' onClick={() => handleDelete(row)}>
                        Revoke
                    </Button.Ripple>

                </>
            )
        }
    ]

    return (
        <>
            <Breadcrumbs breadCrumbParent='Honorary Accounts' breadCrumbActive='List' />

            <div className='invoice-list-wrapper'>
                <UILoader loader={<Spinner />}>
                    <Card className="p-2">
                        <Row className="d-flex align-items-center ">
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
                            </Col>
                            <Col md="3">
                                <Input
                                    id='status'
                                    type='select'
                                    value={userType}
                                    onChange={(e) => { setUserType(e.target.value); getUsersList({ user: e.target.value }) }}
                                >
                                    <option value="">All</option>
                                    <option value="admin">User through Admin</option>
                                    <option value="app">User through App</option>
                                </Input>
                            </Col>
                            <Col md="2">
                                <Button color='secondary' title="Reset" onClick={() => handleReset()}>
                                    <RefreshCcw size={14} />
                                </Button>
                            </Col>
                        </Row>
                        <Row className="d-flex align-items-center mt-2">
                            <Col md="3">
                                <Link to='/honorary-requests'>
                                    <Button.Ripple color='primary' className="w-100 mt-1">
                                        View Access Requests
                                    </Button.Ripple>
                                </Link>
                            </Col>
                            <Col md="3">
                                <Button.Ripple color='primary' className="w-100 mt-1" onClick={handleAddEmail}>
                                    Add Email ID
                                </Button.Ripple>
                            </Col>
                            <Col md="3">
                                <Button.Ripple color='primary' className="w-100 mt-1" onClick={handleImportCSV}>
                                    Import CSV
                                </Button.Ripple>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    accept=".csv, .xls, .xlsx"
                                    onChange={handleFileChange}
                                />
                            </Col>
                            <Col md="3">

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

            {/* view honorary account */}
            <Modal isOpen={viewModal} toggle={() => setViewModal(!viewModal)} className='modal-dialog-centered' size="sm">
                <ModalHeader toggle={() => setViewModal(!viewModal)}>View Honorary Account</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col md='12' className="mb-1"><strong>Name</strong> <dd>{editInfo && editInfo.name ? editInfo.name : '-'}</dd></Col>
                        <Col md='12' className="mb-1"><strong>Email</strong> <dd>{editInfo && editInfo.email ? editInfo.email : '-'}</dd></Col>
                        <Col md='12' className="mb-1"><strong>Phone Number</strong> <dd>{editInfo && editInfo.phone_number ? formatPhone(editInfo.phone_number) : '-'}</dd></Col>
                        <Col md='12' className="mb-1"><strong>State</strong> <dd>{editInfo && editInfo.state ? editInfo.state : '-'}</dd></Col>
                        <Col md='12' className="mb-1"><strong>City</strong> <dd>{editInfo && editInfo.city ? editInfo.city : '-'}</dd></Col>
                        <Col md="12" className="mb-1"><strong>Status</strong> <dd className=''>{(editInfo && editInfo.status === true) ? <Badge pill color='secondary'>User through App</Badge> : <Badge pill color='secondary'>User through Admin</Badge>}</dd></Col>

                        <Col md='12' className="mb-1">
                            <strong>Applied Date</strong>
                            <dd>{editInfo && editInfo.created_at ? localTimeZoneDate(editInfo.created_at) : '-'}</dd>
                        </Col>

                    </Row>
                </ModalBody>
            </Modal>

            <Modal isOpen={addEmailModal} toggle={toggleAddEmailModal}>
                <ModalHeader toggle={toggleAddEmailModal}>Add Email</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleSubmit(AddUsers)}>
                        <Input
                            type='email'
                            value={email}
                            name='email'
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Enter email address"
                            innerRef={register({ required: true })}
                        />
                        <ModalFooter>
                            <Button disabled={submitting} color='primary'>
                                {(submitting) ? <> <Spinner color='white' size='sm' /> </> : 'Save'}
                            </Button>
                            <Button color='secondary' onClick={toggleAddEmailModal}>
                                Cancel
                            </Button>
                        </ModalFooter>
                    </Form>
                </ModalBody>
            </Modal>

            <Modal isOpen={revokeModal} toggle={toggleRevokeModal}>
                <ModalHeader toggle={toggleRevokeModal}>Revoke Account</ModalHeader>
                <ModalBody>
                    Are you sure you want to revoke this account?
                </ModalBody>
                <ModalFooter>
                    <Button disabled={submitting} onClick={DeleteUsers} style={{
                        background: 'linear-gradient(118deg, #4A32EF, #4A32EF)',
                        border: 'none'
                    }}>
                        {(submitting) ? <> <Spinner color='white' size='sm' /> </> : 'Yes'}
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
