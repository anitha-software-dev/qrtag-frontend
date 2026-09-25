import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { Row, Col, Button, Label, CustomInput, Card, Nav, NavItem, NavLink, TabContent, TabPane, Input, InputGroup, InputGroupAddon, Badge, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import Breadcrumbs from '@components/breadcrumbs'
import UILoader from '@components/ui-loader'
import Spinner from '@components/spinner/Loading-spinner'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import '@styles/react/apps/app-invoice.scss'
import { ChevronDown, Search, RefreshCcw, Eye } from 'react-feather'
import { FiFlag } from "react-icons/fi"
import { MdBlock } from "react-icons/md"
import defaultAvatar from '@src/assets/images/avatars/avatar-blank.png'
import { Service } from '@src/services/Service'
import { OpenNotification } from '@src/views/components/Helper'
import ReactPaginate from 'react-paginate'
import { CgUnblock } from "react-icons/cg"
import { LuFlagOff } from "react-icons/lu"
import { formatPhoneNumber, localTimeZone, localTimeZoneDate } from '../../../components/Helper'

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

const Users = () => {
    const [activeTab, setActiveTab] = useState('1')
    const [allUsers, setAllUsers] = useState([])
    const [flaggedUsers, setFlaggedUsers] = useState([])
    const [blockedUsers, setBlockedUsers] = useState([])
    const [blockedUsersId, setBlockedUsersId] = useState('')
    const [flaggedUsersId, setFlaggedUsersId] = useState('')
    const [unblockedUsersId, setUnBlockedUsersId] = useState('')
    const [unflaggedUsersId, setUnFlaggedUsersId] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [totalRecords, setTotalRecords] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [modalOpen, setModalOpen] = useState(false)
    const [actionType, setActionType] = useState('')
    const [currentUser, setCurrentUser] = useState(null)
    const [search, setSearch] = useState('')
    const [totalEntries, setTotalEntries] = useState(0)
    const [viewModal, setViewModal] = useState(false)
    const [editInfo, setEditInfo] = useState(null)

    const toggleModal = () => setModalOpen(!modalOpen)

    const getAllUsers = (param) => {
        setLoading(true)

        const offsetParam = (((param && param.page) || currentPage) - 1) * ((param && param.limit) || rowsPerPage)

        const params = { page: (param && param.page) || currentPage, limit: (param && param.limit) || rowsPerPage, offset: offsetParam }

        if (search) {
            params.search = search
        }
        if (param && param.search !== undefined && param.search !== '') {
            params.search = param.search
        }
        if (param && param.reset) {
            params.page = 1
            params.limit = 10
            params.search = ''
            params.offset = 0
        }

        Service.get({
            url: `/admin/users/?${new URLSearchParams(params).toString()}`
        })
            .then(response => {
                setLoading(false)
                if (response.status === 'error') {
                    response.data.then(res => {
                        OpenNotification('error', 'Oops!', res.message)
                    })
                    return false

                } else {
                    setAllUsers(response.results)
                    setTotalRecords(response.count)
                }
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
                OpenNotification('error', 'Oops!', 'Something went wrong!')
            })
    }
    useEffect(() => {
        getAllUsers()
    }, [])

    const getBlockedUsers = () => {
        setLoading(true)
        Service.get({
            url: '/admin/users/?is_blocked=true'
        })
            .then(response => {
                setLoading(false)
                if (response.status === 'error') {
                    response.data.then(res => {
                        OpenNotification('error', 'Oops!', res.message)
                    })
                    return false
                } else {
                    setBlockedUsers(response)
                }
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
                OpenNotification('error', 'Oops!', 'Something went wrong!')
            })
    }
    useEffect(() => {
        getBlockedUsers()
    }, [])

    const getFlaggedUsers = () => {
        setLoading(true)
        Service.get({
            url: '/admin/users/?is_flagged=true'
        })
            .then(response => {
                setLoading(false)
                if (response.status === 'error') {
                    response.data.then(res => {
                        OpenNotification('error', 'Oops!', res.message)
                    })
                    return false
                } else {
                    setFlaggedUsers(response)
                }
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
                OpenNotification('error', 'Oops!', 'Something went wrong!')
            })
    }
    useEffect(() => {
        getFlaggedUsers()
    }, [])

    const BlockUsers = () => {
        setLoading(true)

        Service.post({
            url: `/admin/users/${blockedUsersId}/block/`

        })
            .then(response => {
                setLoading(false)
                if (response) {
                    OpenNotification('success', 'User blocked', 'User blocked successfully.')
                    getAllUsers()
                    getBlockedUsers()

                } else {
                    OpenNotification('error', 'Oops!', 'Failed to User blocked.')
                }
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
                OpenNotification('error', 'Oops!', 'Something went wrong!')
            })
    }

    const UnBlockUsers = () => {
        setLoading(true)

        Service.post({
            url: `/admin/users/${unblockedUsersId}/unblock/`

        })
            .then(response => {
                setLoading(false)
                if (response) {
                    OpenNotification('success', 'User unblocked', 'User unblocked successfully.')
                    getAllUsers()
                    getBlockedUsers()
                } else {
                    OpenNotification('error', 'Oops!', 'Failed to User unblocked.')
                }
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
                OpenNotification('error', 'Oops!', 'Something went wrong!')
            })
    }

    const FlagUsers = () => {
        setLoading(true)

        Service.post({
            url: `/admin/users/${flaggedUsersId}/flag/`
        })
            .then(response => {
                setLoading(false)
                if (response) {
                    OpenNotification('success', 'User Flagged', 'User Flagged successfully.')
                    getAllUsers()
                    getFlaggedUsers()
                } else {
                    OpenNotification('error', 'Oops!', 'Failed to User Flagged.')
                }
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
                OpenNotification('error', 'Oops!', 'Something went wrong!')
            })
    }

    const UnFlagUsers = () => {
        setLoading(true)

        Service.post({
            url: `/admin/users/${unflaggedUsersId}/remove-flag/`
        })
            .then(response => {
                setLoading(false)
                if (response) {
                    OpenNotification('success', 'User Unflagged', 'User Unflagged successfully.')
                    getAllUsers()
                    getFlaggedUsers()
                } else {
                    OpenNotification('error', 'Oops!', 'Failed to User Unflagged.')
                }
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
                OpenNotification('error', 'Oops!', 'Something went wrong!')
            })
    }

    const handleModalAction = () => {
        if (actionType === 'block') {
            BlockUsers()
        } else if (actionType === 'unblock') {
            UnBlockUsers()
        } else if (actionType === 'flag') {
            FlagUsers()
        } else if (actionType === 'unflag') {
            UnFlagUsers()
        }
        toggleModal()
    }

    const handleBlock = (row) => {
        setBlockedUsersId(row.id)
        setCurrentUser(row)
        setActionType('block')
        toggleModal()
    }

    const handleUnBlock = (row) => {
        setUnBlockedUsersId(row.id)
        setCurrentUser(row)
        setActionType('unblock')
        toggleModal()
    }

    const handleFlag = (row) => {
        setFlaggedUsersId(row.id)
        setCurrentUser(row)
        setActionType('flag')
        toggleModal()
    }

    const handleUnFlag = (row) => {
        setUnFlaggedUsersId(row.id)
        setCurrentUser(row)
        setActionType('unflag')
        toggleModal()
    }

    const handlePagination = page => {
        setCurrentPage(page.selected + 1)
        getAllUsers({ page: page.selected + 1 })
    }

    const handlePerPage = e => {
        setRowsPerPage(parseInt(e.target.value))
        setCurrentPage(1)
        getAllUsers({
            limit: parseInt(e.target.value),
            page: 1
        })
    }
    const handleReset = () => {
        setSearch('')
        setCurrentPage(1)
        setRowsPerPage(10)
        getAllUsers({ reset: true })
    }
    const CustomPagination = () => {
        const count = Number(Math.ceil(totalEntries / rowsPerPage))

        return (
            <div className="d-flex justify-content-between align-items-center p-1">
                <p className='mb-1 ml-1'>Total Entries: {totalEntries}</p>
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
    const commonColumns = [
        {
            name: 'User',
            selector: 'user',
            sortable: false,
            minWidth: '330px',
            cell: row => (
                <>
                    {(row) ? <>
                        <div className='d-flex align-items-center'>
                            <img
                                src={row.image ? row.image : defaultAvatar}
                                alt="Profile"
                                style={{ borderRadius: '50%', width: '35px', height: '35px', marginRight: '10px' }}
                            />
                            <div className='d-flex flex-column'>
                                <span className='text-primary font-weight-bold cursor-pointer' onClick={() => { setEditInfo(row); setViewModal(!viewModal) }}>{(row.name) ? row.name : '-'}</span>
                                <span className='mt-0'>{(row.email) ? row.email : ''}</span>
                            </div>
                        </div>
                    </> : ''}
                </>
            )
        },
        {
            name: 'Referred By',
            selector: 'referred',
            minWidth: '250px',
            sortable: false,
            cell: row => <>
                {(row.referred_by) ? <>
                    <div className='d-flex flex-column'>
                        <span className='text-primary font-weight-bold'>{(row.referred_by.name) ? row.referred_by.name : '-'}</span>
                        <span className='mt-0'>{(row.referred_by.email) ? row.referred_by.email : ''}</span>
                    </div>
                </> : '-'}
            </>
        },
        {
            name: 'Subscription',
            selector: 'Subscrition',
            sortable: false,
            cell: row => (
                row.current_plan ? row.current_plan : '-'
            )
        },
        {
            name: 'Signup Date',
            selector: 'created_at',
            sortable: false,
            cell: row => (
                row && row.looser ? <div className=''>
                    <span className=''>{localTimeZoneDate(row.looser.created_at)}</span>
                </div> : '-'
            )
        }
    ]

    const allUsersColumns = [
        ...commonColumns,
        {
            name: 'Actions',
            center: true,
            minWidth: '175px',
            cell: row => (
                <>
                    {/* <Button.Ripple outline color='secondary' size='sm' onClick={() => { setEditInfo(row); setViewModal(!viewModal) }}> */}
                    <Button title='View' outline color='secondary' size='sm' onClick={() => { setEditInfo(row); setViewModal(!viewModal) }}>
                        <Eye size={14} />
                    </Button>&nbsp;&nbsp;
                    {row.is_flagged ? (
                        <>
                            <Button title='UnFlag' outline color='success' size='sm' onClick={() => handleUnFlag(row)}>
                                <LuFlagOff />
                            </Button>&nbsp;
                        </>
                    ) : (
                        <>
                            <Button title='Flag' outline color='danger' size='sm' onClick={() => handleFlag(row)}>
                                <FiFlag size={14} />
                            </Button>&nbsp;
                        </>
                    )}
                    &nbsp;
                    {row.is_blocked ? (
                        <>
                            <Button title='UnBlock' outline color='success' size='sm' onClick={() => handleUnBlock(row)}>
                                <CgUnblock size={14} />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button title='Block' outline color='danger' size='sm' onClick={() => handleBlock(row)}>
                                <MdBlock size={14} />
                            </Button>
                        </>
                    )}
                </>
            )
        }
    ]

    const loosersColumns = [
        ...commonColumns,
        {
            name: 'Actions',
            center: true,
            minWidth: '180px',
            cell: row => (
                <>
                    <Button title='View' className='mr-1' outline color='secondary' size='sm' onClick={() => { setEditInfo(row); setViewModal(!viewModal) }}>
                        <Eye size={14} />
                    </Button>
                    {row.is_flagged ? (
                        <Button title='UnFlag' outline className='mr-1' color='success' size='sm' onClick={() => handleUnFlag(row)}>
                            <LuFlagOff />
                        </Button>
                    ) : (
                        <Button title='Flag' outline className='mr-1' color='danger' size='sm' onClick={() => handleFlag(row)}>
                            <FiFlag size={14} />
                        </Button>
                    )}
                    &nbsp;
                    {row.is_blocked ? (
                        <Button title='UnBlock' outline color='success' size='sm' onClick={() => handleUnBlock(row)}>
                            <CgUnblock size={14} />
                        </Button>
                    ) : (
                        <Button title='Block' outline color='danger' size='sm' onClick={() => handleBlock(row)}>
                            <MdBlock size={14} />
                        </Button>
                    )}
                </>
            )
        }
    ]

    const flaggedUsersColumns = [
        ...commonColumns,
        {
            name: 'Action',
            center: true,
            minWidth: '180px',
            cell: row => (
                <>
                    <Button title='UnFlag' outline color='success' size='sm' onClick={() => handleUnFlag(row)}>
                        <LuFlagOff />
                    </Button>
                </>
            )
        }
    ]

    const blockedUsersColumns = [
        ...commonColumns,
        {
            name: 'Action',
            center: true,
            minWidth: '180px',
            cell: row => (
                <>
                    <Button title='UnBlock' outline color='success' size='sm' onClick={() => handleUnBlock(row)}>
                        <CgUnblock size={14} />
                    </Button>
                </>
            )
        }
    ]

    const toggleTab = tab => {
        if (activeTab !== tab) setActiveTab(tab)
    }

    useEffect(() => {
        if (activeTab === '1' || activeTab === '2') {
            setTotalEntries(totalRecords)
        } else if (activeTab === '3') {
            setTotalEntries(flaggedUsers.length)
        } else if (activeTab === '4') {
            setTotalEntries(blockedUsers.length)
        }
    }, [activeTab, totalRecords, flaggedUsers.length, blockedUsers.length])

    const renderDataTable = () => {
        if (activeTab === '1') {
            return (
                <DataTable
                    noHeader
                    pagination
                    paginationServer
                    subHeader={true}
                    columns={allUsersColumns}
                    responsive={true}
                    sortIcon={<ChevronDown />}
                    className='react-dataTable'
                    // defaultSortField='name'
                    paginationDefaultPage={currentPage}
                    paginationComponent={CustomPagination}
                    progressPending={loading}
                    progressComponent={<div className="py-6 d-flex align-items-center"><Spinner className="w-14 text-secondary mr-1" /></div>}
                    data={allUsers}
                    subHeaderComponent={
                        <CustomHeader
                            rowsPerPage={rowsPerPage}
                            handlePerPage={handlePerPage}
                        />
                    }
                />
            )
        } else if (activeTab === '2') {
            return (
                <DataTable
                    noHeader
                    pagination
                    paginationServer
                    subHeader={true}
                    columns={loosersColumns}
                    responsive={true}
                    sortIcon={<ChevronDown />}
                    className='react-dataTable'
                    // defaultSortField='name'
                    paginationDefaultPage={currentPage}
                    paginationComponent={CustomPagination}
                    progressPending={loading}
                    progressComponent={<div className="py-6 d-flex align-items-center"><Spinner className="w-14 text-secondary mr-1" /></div>}
                    data={allUsers}
                    subHeaderComponent={
                        <CustomHeader
                            rowsPerPage={rowsPerPage}
                            handlePerPage={handlePerPage}
                        />
                    }
                />
            )
        } else if (activeTab === '3') {
            return (
                <DataTable
                    noHeader
                    pagination
                    paginationServer
                    subHeader={true}
                    columns={flaggedUsersColumns}
                    responsive={true}
                    sortIcon={<ChevronDown />}
                    className='react-dataTable'
                    // defaultSortField='name'
                    paginationDefaultPage={currentPage}
                    paginationComponent={CustomPagination}
                    progressPending={loading}
                    progressComponent={<div className="py-6 d-flex align-items-center"><Spinner className="w-14 text-secondary mr-1" /></div>}
                    data={flaggedUsers}
                    subHeaderComponent={
                        <CustomHeader
                            rowsPerPage={rowsPerPage}
                            handlePerPage={handlePerPage}
                        />
                    }
                />
            )
        } else if (activeTab === '4') {
            return (
                <DataTable
                    noHeader
                    pagination
                    paginationServer
                    subHeader={true}
                    columns={blockedUsersColumns}
                    responsive={true}
                    sortIcon={<ChevronDown />}
                    className='react-dataTable'
                    // defaultSortField='name'
                    paginationDefaultPage={currentPage}
                    paginationComponent={CustomPagination}
                    progressPending={loading}
                    progressComponent={<div className="py-6 d-flex align-items-center"><Spinner className="w-14 text-secondary mr-1" /></div>}
                    data={blockedUsers}
                    subHeaderComponent={
                        <CustomHeader
                            rowsPerPage={rowsPerPage}
                            handlePerPage={handlePerPage}
                        />
                    }
                />
            )
        } else {
            return null
        }
    }

    return (
        <>
            <Breadcrumbs breadCrumbParent='Users' breadCrumbActive='List' />

            <Card className="p-1">
                <Row className="d-flex align-items-center">
                    <Col md="8" className="d-flex mt-1">
                        <Nav tabs style={{ width: '100%' }}>
                            <div className='d-flex'>
                                <NavItem>
                                    <NavLink
                                        className={activeTab === '1' ? 'active' : ''}
                                        onClick={() => toggleTab('1')}
                                    >
                                        ALL USERS ({totalRecords})
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={activeTab === '2' ? 'active' : ''}
                                        onClick={() => toggleTab('2')}
                                    >
                                        LOOSERS ({totalRecords})
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={activeTab === '3' ? 'active' : ''}
                                        onClick={() => toggleTab('3')}
                                    >
                                        FLAGGED USERS ({flaggedUsers.length})
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={activeTab === '4' ? 'active' : ''}
                                        onClick={() => toggleTab('4')}
                                    >
                                        BLOCKED USERS ({blockedUsers.length})
                                    </NavLink>
                                </NavItem>
                            </div>
                        </Nav>
                    </Col>
                    <Col md="4" className="d-flex justify-content-end">
                        <div className='mr-1 w-100'>
                            <InputGroup>
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter' && search.trim() !== '') {
                                            getAllUsers({ search, page: 1 })
                                            setCurrentPage(1)
                                        }
                                    }}
                                    id='search-code'
                                    type='text'
                                    placeholder="Search User"
                                />
                                <InputGroupAddon addonType='append'>
                                    <Button color='secondary' outline style={{ height: "38px" }} onClick={() => {
                                        if (search !== '') {
                                            getAllUsers({ search, page: 1 }); setCurrentPage(1)
                                        }
                                    }}>
                                        <Search size={14} />
                                    </Button>
                                </InputGroupAddon>
                            </InputGroup>
                        </div>
                        <Button.Ripple color='secondary' title="Reset" onClick={() => handleReset()}>
                            <RefreshCcw size={14} />
                        </Button.Ripple>
                    </Col>
                </Row>

                <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                        <Row>
                            <Col md="12">
                                <div className='invoice-list-wrapper'>
                                    <UILoader loader={<Spinner />}>
                                        <Card className="">
                                            <div className='invoice-list-dataTable mb-3'>
                                                {renderDataTable()}
                                            </div>

                                        </Card>
                                    </UILoader>
                                </div>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="2">
                        <Row>
                            <Col md="12">
                                <div className='invoice-list-wrapper'>
                                    <UILoader loader={<Spinner />}>
                                        <Card className="">
                                            <div className='invoice-list-dataTable mb-3'>
                                                {renderDataTable()}
                                            </div>

                                        </Card>
                                    </UILoader>
                                </div>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="3">
                        <Row>
                            <Col md="12">
                                <div className='invoice-list-wrapper'>
                                    <UILoader loader={<Spinner />}>
                                        <Card className="">
                                            <div className='invoice-list-dataTable mb-3'>
                                                {renderDataTable()}
                                            </div>

                                        </Card>
                                    </UILoader>
                                </div>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId="4">
                        <Row>
                            <Col md="12">
                                <div className='invoice-list-wrapper'>
                                    <UILoader loader={<Spinner />}>
                                        <Card className="">
                                            <div className='invoice-list-dataTable mb-3'>
                                                {renderDataTable()}
                                            </div>

                                        </Card>
                                    </UILoader>
                                </div>
                            </Col>
                        </Row>
                    </TabPane>
                </TabContent>
            </Card>


            <Modal isOpen={modalOpen} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}><div className='text-capitalize'>{actionType} User</div></ModalHeader>
                <ModalBody>
                    Are you sure you want to {actionType} {currentUser?.name}?
                </ModalBody>
                <ModalFooter>
                    <Button color='secondary' onClick={toggleModal}>No</Button>
                    <Button color='primary' onClick={handleModalAction}>Yes</Button>
                </ModalFooter>
            </Modal>

            {/* View User Details */}
            <Modal isOpen={viewModal} toggle={() => setViewModal(!viewModal)} className='modal-dialog-centered' size='sm'>
                <ModalHeader toggle={() => setViewModal(!viewModal)}>View Details</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col md='12' className='mb-1'><strong>Name</strong> <dd>{editInfo && editInfo.name ? editInfo.name : '-'}</dd></Col>
                        <Col md='12' className='mb-1'><strong>Email</strong> <dd>{editInfo && editInfo.email ? editInfo.email : '-'}</dd></Col>
                        <Col md='12' className='mb-1'><strong>Phone Number</strong> <dd>{editInfo && editInfo.phone_number ? formatPhoneNumber(editInfo.phone_number, editInfo.country_code) : '-'}</dd></Col>
                        <Col md='12' className='mb-1'><strong>State</strong> <dd>{editInfo && editInfo.looser.state ? editInfo.looser.state : '-'}</dd></Col>
                        <Col md='12' className='mb-1'><strong>City</strong> <dd>{editInfo && editInfo.looser.city ? editInfo.looser.city : '-'}</dd></Col>
                        <Col md='12' className='mb-1'><strong>Address</strong> <dd>{editInfo && editInfo.looser.address ? editInfo.looser.address : '-'}</dd></Col>
                        <Col md='12' className='mb-0'><strong>Referred By:</strong></Col>
                        {(editInfo && editInfo.referred_by) ? <>
                            <Col md='12' className="mt-1 mb-0 d-flex"><dd>Name:</dd>&nbsp; <dd>{editInfo && editInfo.referred_by && editInfo.referred_by.name ? editInfo.referred_by.name : '-'}</dd></Col>
                            <Col md='12' className="mb-1 d-flex"><dd>Email:</dd>&nbsp; <dd>{editInfo && editInfo.referred_by && editInfo.referred_by.email ? editInfo.referred_by.email : '-'}</dd></Col>
                        </> : <Col md='12' className="mb-1 d-flex"><dd>-</dd></Col>}
                        <Col md='12' className='mb-0'><strong>Subscription details:</strong></Col>
                        {(editInfo && editInfo.subscription_details) ? <>
                            <Col md='12' className="mt-1 mb-0 d-flex"><dd>Plan Name:</dd>&nbsp; <dd>{editInfo && editInfo.subscription_details && editInfo.subscription_details.plan_name ? editInfo.subscription_details.plan_name : '-'}</dd></Col>
                            <Col md='12' className="mb-0 d-flex"><dd>Created Date and Time:</dd>&nbsp; <dd>{editInfo && editInfo.subscription_details && editInfo.subscription_details.created_at ? localTimeZone(editInfo.subscription_details.created_at) : '-'}</dd></Col>
                            <Col md='12' className="mb-0 d-flex"><dd>Expiry Date and Time:</dd>&nbsp; <dd>{editInfo && editInfo.subscription_details && editInfo.subscription_details.expires_at ? localTimeZone(editInfo.subscription_details.expires_at) : '-'}</dd></Col>
                            <Col md='12' className="mb-0 d-flex"><dd>Status:</dd>
                                <dd>
                                    {(editInfo && editInfo.subscription_details) ? (
                                        editInfo.subscription_details.is_active === true ? 'ACTIVE' : 'INACTIVE'
                                    ) : '-'}


                                </dd>
                            </Col>
                        </> : <Col md='12' className="mb-1 d-flex"><dd>-</dd></Col>}
                    </Row>
                </ModalBody>
            </Modal>
        </>
    )
}

export default Users
