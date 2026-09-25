import React, { useState, useEffect } from 'react'
import DataTable from 'react-data-table-component'
import { Button, Row, Col, Label, Card, Modal, ModalHeader, ModalBody, ModalFooter, Input, InputGroup, InputGroupAddon, Spinner, Form, FormGroup } from 'reactstrap'
import UILoader from '@components/ui-loader'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import '@styles/react/apps/app-invoice.scss'
import { ChevronDown, Search, RefreshCcw, Trash2, Edit, Plus } from 'react-feather'
import { OpenNotification } from '@src/views/components/Helper'
import { Service } from '@src/services/Service'
import { useForm } from 'react-hook-form'

const CustomHeader = ({ handlePerPage, rowsPerPage, handleAdd }) => {
    return (

        <div className='invoice-list-table-header w-100 py-2'>
            <Row>
                <Col lg='4' className='d-flex align-items-center px-0 px-lg-1'>
                    <h6>RELATIONS</h6>
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

const RelationTypes = () => {

    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [search, setSearch] = useState('')
    const [editInfo, setEditInfo] = useState(null)
    const [relationList, setRelationList] = useState('')
    const [name, setName] = useState('')
    const [addModal, setAddModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)

    const { register, control, handleSubmit, formState: { errors }, reset } = useForm()

    const getRelations = (param) => {
        setLoading(true)

        Service.get({
            url: `/admin/relation/`
        })
            .then(response => {
                setLoading(false)
                if (response.status === false) {
                    OpenNotification('error', 'Oops!', response.message)
                    return false
                } else {
                    setRelationList(response)
                }
            })
            .catch(err => {
                setLoading(false)
                console.log('error', err)
            })
    }

    useEffect(() => {
        getRelations()
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
        getRelations()
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
            url: `/admin/relation/${editInfo.id}/`
        })
            .then((response) => {
                setDeleteModal(!deleteModal)
                setSubmitting(false)
                getRelations()
                OpenNotification('success', 'Success!', 'Relation deleted successfully!')
            })
            .catch(err => {
                setSubmitting(false)
                console.log('Error details:', err)

                if (err instanceof SyntaxError) {
                    // Handle empty response as successful deletion
                    setDeleteModal(!deleteModal)
                    getRelations()
                    OpenNotification('success', 'Success!', 'Relation deleted successfully!')
                } else {
                    setDeleteModal(!deleteModal)
                    OpenNotification('error', 'Oops!', 'Something went wrong while deleting the relation!')
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
                url: `/admin/relation/${editInfo.id}/`,
                body: JSON.stringify(params)
            })
                .then(response => {
                    setSubmitting(false)
                    if (response.status === false) {
                        OpenNotification('error', 'Oops!', response.message)
                        return false
                    } else {
                        getRelations()
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
                url: '/admin/relation/',
                body: JSON.stringify(params)
            })
                .then(response => {
                    setSubmitting(false)
                    if (response.status === false) {
                        OpenNotification('error', 'Oops!', response.message)
                        return false
                    } else {
                        getRelations()
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
                                data={relationList}
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
                <ModalHeader toggle={() => setAddModal(!addModal)}>{editInfo ? 'Edit' : 'Add'} Relation</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <FormGroup>
                            <Input
                                id="name"
                                name="name"
                                innerRef={register({ required: true })}
                                placeholder="Enter Relation"
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
                <ModalHeader toggle={() => setDeleteModal(!deleteModal)}>Delete Relation</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleSubmit(handleDeleteList)}>
                        <FormGroup>
                            <Label for="">
                                Do you want to delete this relation?
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

export default RelationTypes
