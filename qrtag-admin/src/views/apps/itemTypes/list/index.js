import React, { useState, useEffect, useRef } from 'react'
import DataTable from 'react-data-table-component'
import { Button, Row, Col, Label, CustomInput, Card, Modal, ModalHeader, ModalBody, ModalFooter, Input, InputGroup, InputGroupAddon, Spinner, Form, FormGroup, CardHeader } from 'reactstrap'
import Breadcrumbs from '@components/breadcrumbs'
import UILoader from '@components/ui-loader'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import '@styles/react/apps/app-invoice.scss'
import { ChevronDown, Search, RefreshCcw, RotateCcw, Eye, Trash2, Edit, Plus } from 'react-feather'
import { OpenNotification, formatPhone } from '@src/views/components/Helper'
import { Service } from '@src/services/Service'
import ReactPaginate from 'react-paginate'
import { useForm } from 'react-hook-form'

const CustomHeader = ({ handlePerPage, rowsPerPage, handleAdd }) => {
    return (

        <div className='invoice-list-table-header w-100 py-2'>
            <Row>
                <Col lg='4' className='d-flex align-items-center px-0 px-lg-1'>
                    {/* <div className='d-flex align-items-center mr-2'>
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
                    </div> */}

                    <h6>ITEM TYPES</h6>
                </Col>
                <Col
                    lg='5'
                    className='actions-right d-flex align-items-center justify-content-lg-end flex-lg-nowrap flex-wrap mt-lg-0 mt-1 pr-lg-1 p-0'
                >
                </Col>
                <Col
                    lg='3'
                    className='actions-right d-flex align-items-center justify-content-lg-end flex-lg-nowrap flex-wrap mt-lg-0 mt-1 pr-lg-1 p-0'
                >
                    <Button color='primary' size='sm' onClick={() => { handleAdd() }}>
                        <Plus size={14} /> Add
                    </Button>
                </Col>
            </Row>
        </div>
    )
}

const ItemTypes = () => {

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

    const { register, control, handleSubmit, formState: { errors }, reset } = useForm()

    const getItemTypes = (param) => {
        setLoading(true)

        Service.get({
            url: `/common/item-type/`
        })
            .then(response => {
                setLoading(false)
                if (response.status === false) {
                    OpenNotification('error', 'Oops!', response.message)
                    return false
                } else {
                    setItemTypesList(response)
                }
            })
            .catch(err => {
                setLoading(false)
                console.log('error', err)
                OpenNotification('error', 'Oops!', 'Something went wrong!')
            })
    }

    useEffect(() => {
        getItemTypes()
    }, [currentPage, rowsPerPage])

    const handlePagination = page => {
        setCurrentPage(page.selected + 1)
    }
    const handlePerPage = e => {
        setRowsPerPage(parseInt(e.target.value))
        setCurrentPage(1)
    }

    const handleReset = () => {
        setSearch('')
        getItemTypes()
    }

    const handleAdd = async () => {
        setName('')
        setEditInfo(null)
        setAddModal(!addModal)
    }

    const handleEdit = (row) => {
        setName(row && row.name)
        setEditInfo(row)
        setAddModal(!addModal)
    }

    const handleDelete = (row) => {
        setDeleteModal(!deleteModal)
        setEditInfo(row)
    }

    const handleDeleteList = () => {
        setSubmitting(true)
        Service.delete({
            url: `/admin/item-type/${editInfo.id}/`
        })
            .then((response) => {
                setDeleteModal(!deleteModal)
                setSubmitting(false)
                getItemTypes()
                OpenNotification('success', 'Success!', 'Item deleted successfully!')
            })
            .catch(err => {
                setSubmitting(false)
                console.log('Error details:', err)

                if (err instanceof SyntaxError) {
                    // Handle empty response as successful deletion
                    setDeleteModal(!deleteModal)
                    getItemTypes()
                    OpenNotification('success', 'Success!', 'Item deleted successfully!')
                } else {
                    setDeleteModal(!deleteModal)
                    OpenNotification('error', 'Oops!', 'Something went wrong while deleting the item!')
                }
            })
    }

    const onSubmit = (data) => {

        const params = {
            name: data.name
        }
        setSubmitting(true)

        if (editInfo) {

            Service.put({
                url: `/admin/item-type/${editInfo.id}/`,
                body: JSON.stringify(params)
            })
                .then(response => {
                    setSubmitting(false)
                    if (response.status === false) {
                        OpenNotification('error', 'Oops!', response.message)
                        return false
                    } else {
                        getItemTypes()
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
                url: '/admin/item-type/',
                body: JSON.stringify(params)
            })
                .then(response => {
                    setSubmitting(false)
                    if (response.status === false) {
                        OpenNotification('error', 'Oops!', response.message)
                        return false
                    } else {
                        getItemTypes()
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

    const CustomPagination = () => {

        return (
            <div className="d-flex justify-content-between align-items-center p-1">
                <ReactPaginate
                    nextLabel=''
                    breakLabel='...'
                    previousLabel=''
                    activeClassName='active'
                    breakClassName='page-item'
                    breakLinkClassName='page-link'
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
            sortable: false,
            cell: row => (
                <>
                    {(row && row.name) ? (
                        <div className='d-flex flex-column'>
                            <span className='text-truncate mb-0'>{(row.name) ? row.name : ''}</span>
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
                        <Button.Ripple outline color='info' size='sm' onClick={() => { handleEdit(row) }}>
                            <Edit size={14} />
                        </Button.Ripple> &nbsp;
                        <Button.Ripple outline color='danger' size='sm' onClick={() => { handleDelete(row) }}>
                            <Trash2 size={14} />
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
                                subHeader={true}
                                columns={columns}
                                responsive={true}
                                sortIcon={<ChevronDown />}
                                className='react-dataTable'
                                progressPending={loading}
                                progressComponent={<div className="py-6 d-flex align-items-center"><Spinner className="w-14 text-secondary mr-1" /></div>}
                                data={itemTypesList}
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
            <Modal isOpen={addModal} toggle={() => setAddModal(!addModal)}>
                <ModalHeader toggle={() => setAddModal(!addModal)}>{editInfo ? 'Edit' : 'Add'} Item Type</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <FormGroup>
                            <Input
                                id="name"
                                name="name"
                                innerRef={register({ required: true })}
                                placeholder="Enter Type Name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </FormGroup>

                        <ModalFooter className="d-flex justify-content-start px-0">
                            <Button color="secondary" onClick={() => setAddModal(!addModal)}>
                                Close
                            </Button>{' '}
                            <Button color="primary" type="submit">
                                {submitting ? <> <Spinner color='white' size='sm' /> </> : 'Submit'}
                            </Button>
                        </ModalFooter>

                    </Form>
                </ModalBody>
            </Modal>

            {/* Delete Modal */}
            <Modal isOpen={deleteModal} toggle={() => setDeleteModal(!deleteModal)}>
                <ModalHeader toggle={() => setDeleteModal(!deleteModal)}>Delete Item</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleSubmit(handleDeleteList)}>
                        <FormGroup>
                            <Label for="">
                                Do you want to delete this Item?
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

        </>
    )
}

export default ItemTypes
