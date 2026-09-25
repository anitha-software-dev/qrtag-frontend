// ** React Imports
import { useState, useEffect } from 'react'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { ChevronDown, Eye, Edit, Search, Trash2, RefreshCcw } from 'react-feather'
import DataTable from 'react-data-table-component'
import { Button, Label, Input, CustomInput, Row, Col, Card, CardBody, Modal, ModalHeader, ModalBody, InputGroup, InputGroupAddon, Badge, Form, FormGroup, ModalFooter } from 'reactstrap'
import { components } from 'react-select'
import QRCode, { QRCodeSVG } from 'qrcode.react'
import BlueLogo from '@src/assets/images/logo/logo-blue.png'
import { useParams, Link } from 'react-router-dom'

import { useDispatch } from 'react-redux'
import { addDoc, collection, doc, getDoc, getDocs, query, orderBy, limit, onSnapshot, Timestamp, getCountFromServer, startAfter, where, writeBatch, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../../../../configs/firebaseConfig'

// ** Utils
import Breadcrumbs from '@components/breadcrumbs'
import UILoader from '@components/ui-loader'
import Spinner from '@components/spinner/Loading-spinner'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/apps/app-invoice.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { useForm } from 'react-hook-form'
import Config from '@src/configs/config'
import { OpenNotification } from '@src/views/components/Helper'
import { Service } from '@src/services/Service'
import UserModal from '../../../components/UserModal'

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

const SurveyUsers = () => {
    const { id } = useParams()

    const dispatch = useDispatch()

    const [value, setValue] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [statusValue, setStatusValue] = useState('')
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [qrList, setQRList] = useState([1, 2, 3])
    const [surveyUsersList, setSurveyUsersList] = useState([1, 2, 3])
    const [totalRecords, setTotalRecords] = useState(0)
    const [fetching, setFetching] = useState(false)
    const [loading, setLoading] = useState(false)
    const [downloading, setDownloading] = useState(false)
    const [viewModal, setViewModal] = useState(false)
    const [editInfo, setEditInfo] = useState(null)
    const [addModal, setAddModal] = useState(false)
    const [qrvalue, setQRvalue] = useState('')
    const [editModal, setEditModal] = useState(null)
    const [deleteModal, setDeleteModal] = useState(false)
    const [deleteId, setDeleteId] = useState(null)
    const [search, setSearch] = useState('')

    const [used, setUsed] = useState('')
    const [usedEdit, setUsedEdit] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [selectedRows, setSelectedRows] = useState([])
    const [clearSelectedRows, setClearSelectedRows] = useState(false)

    const { register, control, handleSubmit, formState: { errors }, reset } = useForm()


    const getSurveyUsersList = (param = {}) => {
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
            url: `/admin/survey-users/?${new URLSearchParams(params).toString()}`
        })
            .then(response => {
                setLoading(false)
                if (response.status === 'error') {
                    response.data.then(res => {
                        OpenNotification('error', 'Oops!', res.message)
                    })
                    return false
                } else {
                    setSurveyUsersList(response.results)
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
        getSurveyUsersList()
    }, [])

    const handleAdd = () => {
        if (selectedRows.length === 0) {
            OpenNotification('error', 'Validation Error', 'Please select at least one user to add a free trial.')
            return
        }

        const selectedIds = selectedRows.map(row => row.id)

        const params = {
            user_ids: selectedIds
        }

        setLoading(true)

        Service.post({
            url: '/admin/survey-users/update-subscription/',
            body: JSON.stringify(params)
        })
            .then(response => {

                setLoading(false)
                if (response.status === 'error') {
                    setLoading(false)
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
                    getSurveyUsersList()
                    setSelectedRows([])
                    setClearSelectedRows(!clearSelectedRows)
                    OpenNotification('success', 'Success!', `${response.message}`)
                    setLoading(false)
                }
            })
            .catch(err => {
                console.log('error', err)
                setLoading(false)
                OpenNotification('error', 'Oops!', 'Something went wrong!')
            })

    }

    const handleRowSelected = (state) => {
        setSelectedRows(state.selectedRows)
    }

    const handlePerPage = e => {
        setRowsPerPage(parseInt(e.target.value))
        setCurrentPage(1)
        getSurveyUsersList({
            limit: parseInt(e.target.value),
            page: 1
        })
    }

    const handlePagination = page => {
        setCurrentPage(page.selected + 1)
        getSurveyUsersList({ search, page: page.selected + 1 })
    }

    const handleReset = () => {
        setSearch('')
        setCurrentPage(1)
        setRowsPerPage(10)
        setUsed('')
        getSurveyUsersList({ reset: true })
    }

    const handleExport = async () => {

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
            minWidth: '300px',
            sortable: false,
            cell: row => (
                <>
                    <div className='d-flex flex-column'>
                        <span className='text-primary font-weight-bold cursor-pointer' onClick={() => { setEditInfo(row); setViewModal(!viewModal) }}>{(row.name) ? row.name : '-'}</span>
                        <span className='text-truncate mb-0'>{(row.email) ? row.email : ''}</span>
                    </div>
                </>
            )
        },
        {
            name: 'Contact',
            selector: 'contact',
            sortable: false,
            cell: row => <>{row.phone_number ? row.phone_number : '-'}</>
        },
        {
            name: 'Action',
            center: true,
            minWidth: '180px',
            cell: row => (
                <>
                    <Button.Ripple outline color='secondary' size='sm' tag={Link} to={`/surveyUsers/view/${row.id}`}>
                        <Eye size={14} />
                    </Button.Ripple>
                </>
            )
        }
    ]

    return (
        <>
            <Breadcrumbs breadCrumbParent='Survey Users' breadCrumbActive='List' />

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
                                                getSurveyUsersList({ search, page: 1 })
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
                                                getSurveyUsersList({ search, page: 1 }); setCurrentPage(1)
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
                            {/* <Button.Ripple disabled={loading} color='primary' className="w-100" onClick={handleAdd}>
                                Add Free Trial
                            </Button.Ripple> */}
                        </Col>
                    </Row>
                </CardBody>
            </Card>
            <div className='invoice-list-wrapper'>
                <UILoader blocking={downloading} loader={<Spinner />}>
                    <Card>
                        <div className='invoice-list-dataTable mb-3'>
                            <DataTable
                                selectableRows={false}
                                onSelectedRowsChange={handleRowSelected}
                                clearSelectedRows={clearSelectedRows}
                                selectableRowDisabled={row => row.has_received_free_trial}
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
                                progressComponent={<div className="py-6 d-flex align-items-center"><Spinner className="w-14 text-secondary mr-1" /></div>}
                                paginationDefaultPage={currentPage}
                                paginationComponent={CustomPagination}
                                data={surveyUsersList}
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

            <UserModal setUserModal={setViewModal} userModal={viewModal} userData={editInfo} />

        </>
    )
}

export default SurveyUsers
