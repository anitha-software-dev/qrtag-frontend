// ** React Imports
import { useState, useEffect } from 'react'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { ChevronDown, Edit, Search, Trash2, RefreshCcw, Eye } from 'react-feather'
import DataTable from 'react-data-table-component'
import { Button, Label, Input, CustomInput, Row, Col, Card, CardBody, Modal, ModalHeader, ModalBody, InputGroup, InputGroupAddon, Form, FormGroup, ModalFooter, Spinner, Badge } from 'reactstrap'
import { components } from 'react-select'

import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import defaultAvatar from '@src/assets/images/avatars/avatar-blank.png'

// ** Utils
import Breadcrumbs from '@components/breadcrumbs'
import UILoader from '@components/ui-loader'
import Spinners from '@components/spinner/Loading-spinner'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/apps/app-invoice.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { useForm } from 'react-hook-form'
import { OpenNotification } from '@src/views/components/Helper'
import { Service } from '@src/services/Service'
import { IoMdDownload } from 'react-icons/io'

// ** Custom select components
const OptionComponent = ({ data, ...props }) => {
    return (
        <components.Option {...props}>
            {data.label}
        </components.Option>
    )
}


const CustomHeader = ({ handlePerPage, rowsPerPage, downloading }) => {
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

const DigitalMemorial = () => {

    const dispatch = useDispatch()

    const [value, setValue] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [statusValue, setStatusValue] = useState('')
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [totalRecords, setTotalRecords] = useState(0)
    const [fetching, setFetching] = useState(false)
    const [loading, setLoading] = useState(false)
    const [downloading, setDownloading] = useState(false)
    const [viewModal, setViewModal] = useState(false)

    const [editInfo, setEditInfo] = useState(null)

    const [deleteModal, setDeleteModal] = useState(false)

    const [search, setSearch] = useState('')
    const [memorialsList, setMemorialsList] = useState([])

    const { register, control, handleSubmit, formState: { errors }, reset } = useForm()


    const getDigitalMemorialsList = (param = {}) => {
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
            url: `/common/digital-memorial/?${new URLSearchParams(params).toString()}`
        })
            .then(response => {

                setLoading(false)
                if (response.status === 'error') {
                    response.data.then(res => {
                        OpenNotification('error', 'Oops!', res.message)
                    })
                    return false
                } else {
                    setMemorialsList(response.results)
                    // console.log("memorial list:", response.results)
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
        getDigitalMemorialsList()
    }, [])


    const handleDelete = () => {
        setLoading(true)
        Service.delete({
            url: `/common/digital-memorial/${editInfo.id}/`
        })
            .then((response) => {
                setDeleteModal(!deleteModal)
                setLoading(false)
                getDigitalMemorialsList()
                OpenNotification('success', 'Success!', 'Digital Memorial deleted successfully!')
            })
            .catch(err => {
                setLoading(false)
                console.log('Error details:', err)

                if (err instanceof SyntaxError) {
                    // Handle empty response as successful deletion
                    setDeleteModal(!deleteModal)
                    getDigitalMemorialsList()
                    OpenNotification('success', 'Success!', 'Digital Memorial deleted successfully!')
                } else {
                    setDeleteModal(!deleteModal)
                    OpenNotification('error', 'Oops!', 'Something went wrong while deleting the item!')
                }
            })
    }


    const handlePerPage = e => {
        setRowsPerPage(parseInt(e.target.value))
        setCurrentPage(1)
        getDigitalMemorialsList({
            limit: parseInt(e.target.value),
            page: 1
        })
    }

    const handlePagination = page => {
        setCurrentPage(page.selected + 1)
        getDigitalMemorialsList({ search, page: page.selected + 1 })
    }

    const handleReset = () => {
        setSearch('')
        setCurrentPage(1)
        setRowsPerPage(10)
        getDigitalMemorialsList({ reset: true })
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
            name: 'Name',
            selector: 'name',
            minWidth: '250px',
            sortable: false,
            cell: row => (
                <>
                    {(row) ? <>
                        <div className='d-flex align-items-center'>
                            <img
                                src={row.profile_photo ? row.profile_photo : defaultAvatar}
                                alt="Profile"
                                style={{ borderRadius: '50%', width: '35px', height: '35px', marginRight: '10px' }}
                            />
                            <div className='d-flex flex-column'>
                                <span>{(row.name) ? row.name : '-'}</span>
                            </div>
                        </div>
                    </> : ''}
                </>
            )
        },
        {
            name: 'Date of Birth',
            selector: 'from',
            sortable: false,
            cell: row => <>{row.from_date ? row.from_date : '-'}</>
        },
        {
            name: 'Date of Death',
            selector: 'from',
            sortable: false,
            cell: row => <>{row.to_date ? row.to_date : '-'}</>
        },
        {
            name: 'Status',
            selector: 'status',
            sortable: false,
            cell: row => <>{row.status && row.status === 'publish' ? <Badge color={'success'} className='badge-sm'>Published</Badge> : <Badge color={'warning'} className='badge-sm'>Draft</Badge>}</>
        },
        {
            name: 'Actions',
            center: true,
            minWidth: '250px',
            cell: row => (
                <>
                    <Button outline color='secondary' size='sm'
                        tag={Link}
                        to={{
                            pathname: `/digitalMemorial/view/${row.id}`
                        }}>
                        <Eye size={14} />
                    </Button> &nbsp; &nbsp;
                    <Button
                        outline
                        tag={Link}
                        to={{
                            pathname: `/digitalMemorial/edit/${row.id}`
                        }}
                        color='info'
                        size='sm'
                    >
                        <Edit size={14} />
                    </Button> &nbsp; &nbsp;
                    <Button outline color='danger' size='sm' onClick={() => { setEditInfo(row); setDeleteModal(true) }}>
                        <Trash2 size={14} />
                    </Button>
                </>
            )
        }
    ]

    return (
        <>
            <Breadcrumbs breadCrumbParent='Digital Memorial' breadCrumbActive='List' />

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
                                                getDigitalMemorialsList({ search, page: 1 })
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
                                                getDigitalMemorialsList({ search, page: 1 }); setCurrentPage(1)
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
                            <Button.Ripple color='primary' className="w-100" tag={Link}
                                to="/digitalMemorial/add" >
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
                                data={memorialsList}
                                subHeaderComponent={
                                    <CustomHeader
                                        value={value}
                                        statusValue={statusValue}
                                        rowsPerPage={rowsPerPage}
                                        handlePerPage={handlePerPage}

                                        downloading={downloading}
                                    />
                                }
                            />
                        </div>

                    </Card>
                </UILoader>
            </div>


            {/* Delete Digital Memorial */}
            <Modal isOpen={deleteModal} toggle={() => setDeleteModal(!deleteModal)}>
                <ModalHeader toggle={() => setDeleteModal(!deleteModal)}>Delete Digital Memorial</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleSubmit(handleDelete)}>
                        <FormGroup>
                            <Label for="">
                                Do you want to delete this Digital Memorial ?
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

export default DigitalMemorial
