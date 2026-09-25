// ** React Imports
import { useState, useEffect } from 'react'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { ChevronDown, Eye, Edit, Search, Trash2, RefreshCcw, Plus } from 'react-feather'
import DataTable from 'react-data-table-component'
import { Button, Label, Input, CustomInput, Row, Col, Card, CardBody, Modal, ModalHeader, ModalBody, InputGroup, InputGroupAddon, Badge, Form, FormGroup, ModalFooter, Spinner } from 'reactstrap'
import { components } from 'react-select'
import QRCode, { QRCodeSVG } from 'qrcode.react'
import BlueLogo from '@src/assets/images/logo/logo-blue.png'

import { useDispatch } from 'react-redux'
import { addDoc, collection, doc, getDoc, getDocs, query, orderBy, limit, onSnapshot, Timestamp, getCountFromServer, startAfter, where, writeBatch, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../../../../configs/firebaseConfig'

// ** Utils
import Breadcrumbs from '@components/breadcrumbs'
import UILoader from '@components/ui-loader'
import Spinners from '@components/spinner/Loading-spinner'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/apps/app-invoice.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { useForm } from 'react-hook-form'
import Config from '@src/configs/config'
import { OpenNotification } from '@src/views/components/Helper'
import { SiZara } from 'react-icons/si'
import { Service } from '@src/services/Service'
import { FaQrcode } from 'react-icons/fa'
import { IoMdDownload } from 'react-icons/io'

// ** Custom select components
const OptionComponent = ({ data, ...props }) => {
    return (
        <components.Option {...props}>
            {data.label}
        </components.Option>
    )
}


const CustomHeader = ({ handlePerPage, rowsPerPage, handleExport, downloading }) => {
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

const BrandAmbassadors = () => {

    const dispatch = useDispatch()

    const [value, setValue] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [statusValue, setStatusValue] = useState('')
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [qrList, setQRList] = useState([1, 2, 3])
    const [totalRecords, setTotalRecords] = useState(0)
    const [fetching, setFetching] = useState(false)
    const [loading, setLoading] = useState(false)
    const [downloading, setDownloading] = useState(false)
    const [viewModal, setViewModal] = useState(false)
    const [editInfo, setEditInfo] = useState(null)
    const [addModal, setAddModal] = useState(false)
    const [referedModal, setReferedModal] = useState(false)
    const [qrvalue, setQRvalue] = useState('')
    const [editModal, setEditModal] = useState(null)
    const [deleteModal, setDeleteModal] = useState(false)
    const [qrcodeModal, setQrcodeModal] = useState(false)
    const [deleteId, setDeleteId] = useState(null)
    const [search, setSearch] = useState('')
    const [ambassadorList, setAmbassadorsList] = useState([])

    const [used, setUsed] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [contact, setContact] = useState('')
    const [profile, setProfile] = useState(['', ''])

    const { register, control, handleSubmit, formState: { errors }, reset } = useForm()

    const handleAdd = async () => {
        setProfile(['', ''])
        setName('')
        setContact('')
        setEmail('')
        setEditInfo(null)
        setAddModal(!addModal)
    }

    const getBrandAmbassadorsList = (param = {}) => {
        setLoading(true)

        const params = {
            limit: (param && param.limit) || rowsPerPage,
            offset: (currentPage - 1) * rowsPerPage
        }

        if (param && param.page) {
            params.offset = (param.page - 1) * rowsPerPage
        }
        if (param && param.limit) {
            params.offset = 0 * param.limit
        }

        if (search) {
            params.search = search
        }

        if (param && param.search !== undefined && param.search !== '') {
            params.search = param.search
        }

        if (param && param.reset) {
            params.limit = 10
            params.search = ''
            params.offset = 0
        }

        Service.get({
            url: `/admin/brand-ambassador/?${new URLSearchParams(params).toString()}`
        })
            .then(response => {

                setLoading(false)
                if (response.status === 'error') {
                    response.data.then(res => {
                        OpenNotification('error', 'Oops!', res.message)
                    })
                    return false
                } else {
                    setAmbassadorsList(response.results)
                    setTotalRecords(response.count)
                }
            })
            .catch(err => {
                setLoading(false)
                console.log('error', err)
                OpenNotification('error', 'Oops!', 'Something went wrong!')
            })
    }

    useEffect(() => {
        getBrandAmbassadorsList()
    }, [])

    const onSubmit = (data) => {

        const params = {
            name: data.name,
            email: data.email,
            contact: data.contact,
            social_profile: profile.filter(item => item.trim() !== '').join(',')
        }

        setLoading(true)

        if (editInfo) {

            Service.put({
                url: `/admin/brand-ambassador/${editInfo.id}/`,
                body: JSON.stringify(params)
            })
                .then(response => {
                    setLoading(false)
                    if (response.status === 'error') {
                        response.data.then(res => {
                            if (typeof res === 'object') {
                                for (const key in res) {
                                    if (Object.hasOwnProperty.call(res, key)) {
                                        const value = res[key]
                                        OpenNotification('error', 'Oops!', value[0])
                                        return false
                                    }
                                }
                            } else {
                                OpenNotification('error', 'Oops!', 'Edit Failed!')
                            }
                        })
                        return false
                    } else {
                        getBrandAmbassadorsList()
                        setAddModal(!addModal)
                        OpenNotification('success', 'Success!', `${response.message}!`)
                    }
                })
                .catch(err => {
                    console.log('error', err)
                    setLoading(false)
                    OpenNotification('error', 'Oops!', 'Something went wrong!')
                })
        } else {

            Service.post({
                url: '/admin/brand-ambassador/',
                body: JSON.stringify(params)
            })
                .then(response => {

                    setLoading(false)
                    if (response.status === 'error') {

                        response.data.then(res => {
                            if (typeof res === 'object') {
                                for (const key in res) {
                                    if (Object.hasOwnProperty.call(res, key)) {
                                        const value = res[key]
                                        OpenNotification('error', 'Oops!', value[0])
                                        return false
                                    }
                                }
                            } else {
                                OpenNotification('error', 'Oops!', 'Add Failed!')
                            }
                        })
                        return false
                    } else {
                        setAddModal(!addModal)
                        getBrandAmbassadorsList()
                        OpenNotification('success', 'Success!', `${response.message}!`)
                    }
                })
                .catch(err => {
                    console.log('error', err)
                    setLoading(false)
                    OpenNotification('error', 'Oops!', 'Something went wrong!')
                })
        }
    }

    const handleEdit = (row) => {
        setProfile(row && row.social_profile ? row.social_profile.split(',') : [''])
        setName(row && row.name)
        setContact(row && row.contact)
        setEmail(row && row.email)
        setEditInfo(row)
        setAddModal(!addModal)
    }

    const handleDelete = () => {
        setLoading(true)
        Service.delete({
            url: `/admin/brand-ambassador/${editInfo.id}/`
        })
            .then((response) => {
                setDeleteModal(!deleteModal)
                setLoading(false)
                getBrandAmbassadorsList()
                OpenNotification('success', 'Success!', 'Brand Ambassador deleted successfully!')
            })
            .catch(err => {
                setLoading(false)
                console.log('Error details:', err)

                if (err instanceof SyntaxError) {
                    // Handle empty response as successful deletion
                    setDeleteModal(!deleteModal)
                    getBrandAmbassadorsList()
                    OpenNotification('success', 'Success!', 'Brand Ambassador deleted successfully!')
                } else {
                    setDeleteModal(!deleteModal)
                    OpenNotification('error', 'Oops!', 'Something went wrong while deleting the item!')
                }
            })
    }

    const handleGenerateQRCode = () => {
        setLoading(true)
        Service.get({
            url: `/admin/brand-ambassador/${editInfo.id}/generate-qr-code/`
        })
            .then((response) => {
                setLoading(false)

                if (response.status === false) {
                    // Handle empty response as successful deletion
                    setQrcodeModal(!qrcodeModal)

                    OpenNotification('error', 'Oops!', response.message)

                } else {
                    setQrcodeModal(!qrcodeModal)
                    getBrandAmbassadorsList()
                    OpenNotification('success', 'Success!', 'QR Code generated to this Brand Ambassador successfully!')
                }

            })
            .catch(err => {
                setLoading(false)
                console.log('Error details:', err)

                if (err instanceof SyntaxError) {
                    setQrcodeModal(!qrcodeModal)
                    getBrandAmbassadorsList()
                    OpenNotification('success', 'Success!', 'QR Code generated to this Brand Ambassador successfully!')
                } else {
                    setQrcodeModal(!qrcodeModal)
                    OpenNotification('error', 'Oops!', 'Something went wrong while generating QR Code to this Brand Ambassador!')
                }
            })
    }

    const handlePerPage = e => {
        setRowsPerPage(parseInt(e.target.value))
        setCurrentPage(1)
        getBrandAmbassadorsList({
            limit: parseInt(e.target.value),
            page: 1
        })
    }

    const handlePagination = page => {
        setCurrentPage(page.selected + 1)
        getBrandAmbassadorsList({ search, page: page.selected + 1 })
    }

    const handleReset = () => {
        setSearch('')
        setCurrentPage(1)
        setRowsPerPage(10)
        getBrandAmbassadorsList({ reset: true })
    }

    const handleExport = async () => {

    }

    const addProfile = () => {
        setProfile([...profile, ''])
    }

    const handleProfileChange = (index, value) => {
        setProfile(prevProfile => prevProfile.map((item, idx) => (idx === index ? value : item)))
    }

    const removeProfile = (index) => {
        setProfile(prevProfile => prevProfile.filter((_, idx) => idx !== index))
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
            selector: 'name',
            minWidth: '250px',
            sortable: false,
            cell: row => (
                <>
                    <div className='d-flex flex-column'>
                        <span className='text-primary font-weight-bold'>{(row.name) ? row.name : '-'}</span>
                        <span className='text-truncate mb-0'>{(row.email) ? row.email : ''}</span>
                    </div>
                </>
            )
        },
        {
            name: 'Contact',
            selector: 'contact',
            sortable: false,
            cell: row => <>{row.contact ? row.contact : '-'}</>
        },
        {
            name: 'No.of Users Referred',
            selector: 'referred',
            sortable: false,
            cell: row => <><Badge className="cursor-pointer" onClick={() => { setEditInfo(row); setReferedModal(!referedModal) }}>{row.total_referred_users}</Badge></>
        },
        {
            name: 'Actions',
            center: true,
            minWidth: '250px',
            cell: row => (
                <>
                    <Button outline color='secondary' size='sm' onClick={() => { setEditInfo(row); setViewModal(!viewModal) }}>
                        <Eye size={14} />
                    </Button> &nbsp; &nbsp;
                    <Button outline color='info' size='sm' onClick={() => { handleEdit(row) }}>
                        <Edit size={14} />
                    </Button> &nbsp; &nbsp;
                    <Button outline color='danger' size='sm' onClick={() => { setEditInfo(row); setDeleteModal(true) }}>
                        <Trash2 size={14} />
                    </Button>
                    {/* </Button.Ripple>&nbsp; &nbsp; */}
                    {/* <Button.Ripple disabled={row.qr_code && true} outline color='primary' size='sm' onClick={() => { setEditInfo(row); setQrcodeModal(true) }}>
                        <FaQrcode size={14} />
                    </Button.Ripple> */}
                </>
            )
        }
    ]

    return (
        <>
            <Breadcrumbs breadCrumbParent='Brand Ambassadors' breadCrumbActive='List' />

            <Card>
                <CardBody>
                    <Row form className='mt-1 mb-50 d-flex align-items-center justify-content-between'>
                        <Col md="4" className="d-flex align-items-center justify-content-center">
                            <div className='mr-1 w-100'>
                                <InputGroup>
                                    <Input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter' && search.trim() !== '') {
                                                getBrandAmbassadorsList({ search, page: 1 })
                                                setCurrentPage(1)
                                            }
                                        }}
                                        id='search-code'
                                        type='text'
                                        placeholder="Search"
                                    />
                                    <InputGroupAddon addonType='append'>
                                        <Button onClick={() => {
                                            if (search !== '') {
                                                getBrandAmbassadorsList({ search, page: 1 }); setCurrentPage(1)
                                            }
                                        }} color='secondary' outline style={{ height: "38px" }}>
                                            <Search size={14} />
                                        </Button>
                                    </InputGroupAddon>
                                </InputGroup>
                            </div>

                            <Button color='secondary' onClick={() => handleReset()} title="Reset">
                                <RefreshCcw size={14} />
                            </Button>

                        </Col>

                        <Col md="2">
                            <Button.Ripple color='primary' className="w-100" onClick={handleAdd}>
                                Add New
                            </Button.Ripple>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
            <div className='invoice-list-wrapper'>
                <UILoader blocking={downloading} loader={<Spinners />}>
                    <Card>
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
                                defaultSortField='invoiceId'
                                progressPending={loading}
                                progressComponent={<div className="py-6 d-flex align-items-center"><Spinners className="w-14 text-secondary mr-1" /></div>}
                                paginationDefaultPage={currentPage}
                                paginationComponent={CustomPagination}
                                data={ambassadorList}
                                subHeaderComponent={
                                    <CustomHeader
                                        value={value}
                                        statusValue={statusValue}
                                        rowsPerPage={rowsPerPage}
                                        handlePerPage={handlePerPage}
                                        handleExport={handleExport}
                                        downloading={downloading}
                                    />
                                }
                            />
                        </div>

                    </Card>
                </UILoader>
            </div>

            {/* View Ambassador */}
            {editInfo && (
                <Modal isOpen={viewModal} toggle={() => setViewModal(!viewModal)} className='modal-dialog-centered' size="sm">
                    <ModalHeader toggle={() => setViewModal(!viewModal)}>View Ambassador Details</ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col md='12' className="mb-1"><strong>Name</strong> <dd>{editInfo && editInfo.name ? editInfo.name : '-'}</dd></Col>
                            <Col md='12' className="mb-1"><strong>Email</strong> <dd>{editInfo && editInfo.email ? editInfo.email : '-'}</dd></Col>
                            <Col md='12' className="mb-1"><strong>Contact</strong> <dd>{editInfo && editInfo.contact ? editInfo.contact : '-'}</dd></Col>
                            <Col md='12' className="mb-1">
                                <strong>Social Profile</strong>
                                <dd>
                                    {editInfo && editInfo.social_profile ? (
                                        editInfo.social_profile.split(',').map((profile, index) => (
                                            <div key={index}>
                                                {profile}
                                            </div>
                                        ))
                                    ) : (
                                        '-'
                                    )}
                                </dd>
                            </Col>
                            <Col md='12' className="mb-1"><strong>No.of. Users Referred</strong> <dd>{editInfo && editInfo.total_referred_users ? editInfo.total_referred_users : '0'}</dd></Col>
                            {editInfo.qr_code &&
                                <Col md='12' className="mb-1 d-flex flex-column"><strong>QR Code</strong>
                                    <img
                                        src={editInfo.qr_code}
                                        alt="QR Code"
                                        style={{ width: '50%', marginTop: '0px', marginLeft: "-15px" }}
                                    />
                                    <span
                                        onClick={async () => {
                                            try {
                                                if (editInfo.qr_code) {
                                                    const cacheBustedUrl = `${editInfo.qr_code}?_=${new Date().getTime()}`

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
                                        }}
                                        className="cursor-pointer mt-1 d-flex align-items-center"
                                        style={{ width: '150px' }}
                                    >
                                        <IoMdDownload size={14} />&nbsp;Download
                                    </span>
                                </Col>
                            }
                        </Row>
                    </ModalBody>
                </Modal>
            )}

            {editInfo && (
                <Modal
                    isOpen={referedModal}
                    toggle={() => setReferedModal(!referedModal)}
                    className="modal-dialog-centered"
                    size="sm"
                >
                    <ModalHeader toggle={() => setReferedModal(!referedModal)}>
                        View Referred Users
                    </ModalHeader>
                    <ModalBody>
                        {editInfo.referred_users && editInfo.referred_users.length > 0 ? (
                            <Row>
                                {editInfo.referred_users.map((user, index) => (
                                    <Col md="12" className="mb-1" key={index}>
                                        <strong>{user.name ? user.name : '-'}</strong>
                                        <dd>{user.email ? user.email : '-'}</dd>
                                        {index < editInfo.referred_users.length - 1 && <hr />}
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <div className="d-flex justify-content-center align-items-center" style={{ height: "100%" }}>
                                <p className="text-muted my-2">No Referred Users</p>
                            </div>
                        )}
                    </ModalBody>
                </Modal>
            )}
            {/* Add Ambassador */}
            <Modal isOpen={addModal} toggle={() => setAddModal(!addModal)} size='sm'>
                <ModalHeader toggle={() => setAddModal(!addModal)}>{editInfo ? 'Edit Details' : 'Add Ambassador'}</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <FormGroup>
                            <Label for="name">
                                Name <span className='text-danger'>*</span>
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                innerRef={register({ required: true })}
                                placeholder="Enter Name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="email">
                                Email <span className='text-danger'>*</span>
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                placeholder="Enter Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                innerRef={register({ required: true })}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="contact">
                                Contact <span className='text-danger'>*</span>
                            </Label>
                            <Input
                                id="contact"
                                name="contact"
                                innerRef={register({ required: true })}
                                placeholder="Enter Contact"
                                type="text"
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="profile">Social Profiles</Label>
                            {profile && profile.map((url, index) => (
                                <div key={index} className="d-flex align-items-center mt-1">
                                    <Input
                                        type="text"
                                        placeholder={`Enter Profile URL`}
                                        value={url}
                                        className="w-100 mr-1"
                                        onChange={(e) => handleProfileChange(index, e.target.value)}
                                    />
                                    {profile.length > 1 && (
                                        <Button
                                            outline
                                            color="danger"
                                            size="sm"
                                            className="ml-0"
                                            onClick={() => removeProfile(index)}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    )}
                                </div>
                            ))}


                            <div className='ml-1 mt-2 cursor-pointer text-primary font-weight-bold' onClick={() => addProfile()}>
                                <Plus size='20' /> Add More
                            </div>
                        </FormGroup>


                        <ModalFooter className="d-flex justify-content-start px-0">
                            <Button color="secondary" onClick={() => setAddModal(!addModal)}>
                                Close
                            </Button>{' '}
                            <Button disabled={loading} color="primary" type="submit">
                                {(loading) ? <> <Spinner color='white' size='sm' /> </> : 'Submit'}
                            </Button>
                        </ModalFooter>

                    </Form>
                </ModalBody>
            </Modal>

            {/* Generate QR Code */}
            <Modal isOpen={qrcodeModal} toggle={() => setQrcodeModal(!qrcodeModal)}>
                <ModalHeader toggle={() => setQrcodeModal(!qrcodeModal)}>Generate QR Code</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleSubmit(handleGenerateQRCode)}>
                        <FormGroup>
                            <Label for="">
                                Do you want to generate QR Code to this Ambassador ?
                            </Label>
                        </FormGroup>
                        <ModalFooter className="d-flex justify-content-start px-0">
                            <Button color="secondary" onClick={() => setQrcodeModal(!qrcodeModal)}>
                                No
                            </Button>{' '}
                            <Button color="primary" type="submit">
                                Yes
                            </Button>
                        </ModalFooter>
                    </Form>
                </ModalBody>
            </Modal>

            {/* Delete QR Detail */}
            <Modal isOpen={deleteModal} toggle={() => setDeleteModal(!deleteModal)}>
                <ModalHeader toggle={() => setDeleteModal(!deleteModal)}>Delete Ambassador</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleSubmit(handleDelete)}>
                        <FormGroup>
                            <Label for="">
                                Do you want to delete this Ambassador ?
                            </Label>
                        </FormGroup>
                        <ModalFooter className="d-flex justify-content-start px-0">
                            <Button color="secondary" onClick={() => setDeleteModal(!deleteModal)}>
                                No
                            </Button>{' '}
                            <Button disabled={loading} color="primary" type="submit">
                                {(loading) ? <> <Spinner color='white' size='sm' /> </> : 'Yes'}
                            </Button>
                        </ModalFooter>
                    </Form>
                </ModalBody>
            </Modal>
        </>
    )
}

export default BrandAmbassadors
