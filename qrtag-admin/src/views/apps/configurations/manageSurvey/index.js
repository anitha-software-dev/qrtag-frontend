import React, { useState, useEffect } from 'react'
import DataTable from 'react-data-table-component'
import { Button, Row, Col, Label, Card, Modal, ModalHeader, ModalBody, ModalFooter, Input, InputGroup, InputGroupAddon, Spinner, Form, FormGroup } from 'reactstrap'
import UILoader from '@components/ui-loader'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import '@styles/react/apps/app-invoice.scss'
import { ChevronDown, Search, RefreshCcw, Trash2, Edit, Plus, Eye } from 'react-feather'
import { OpenNotification } from '@src/views/components/Helper'
import { Service } from '@src/services/Service'
import { useForm } from 'react-hook-form'
import { useParams, Link } from 'react-router-dom'

const CustomHeader = ({ handlePerPage, rowsPerPage, handleAdd }) => {
    return (

        <div className='invoice-list-table-header w-100 py-2'>
            <Row>
                <Col lg='6' className='d-flex align-items-center px-0 px-lg-1'>
                    <h6>MANAGE SURVEY</h6>
                </Col>
                {/* <Col
                    lg='5'
                    className='actions-right d-flex align-items-center justify-content-lg-end flex-lg-nowrap flex-wrap mt-lg-0 mt-1 pr-lg-1 p-0'
                >
                </Col> */}
                <Col
                    lg='6'
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

const ManageSurvey = () => {
    const { id } = useParams()

    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [search, setSearch] = useState('')
    const [editInfo, setEditInfo] = useState(null)
    const [surveyList, setSurveyList] = useState([])
    const [name, setName] = useState('')
    const [addModal, setAddModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [updateModal, setUpdateModal] = useState(false)
    const [selectedSurvey, setSelectedSurvey] = useState(null)

    const { register, control, handleSubmit, formState: { errors }, reset } = useForm()

    const getSurveys = (param) => {
        setLoading(true)

        Service.get({
            url: `/admin/survey-form/`
        })
            .then(response => {
                setLoading(false)
                if (response) {
                    if (response.status === false) {
                        OpenNotification('error', 'Oops!', response.message)
                        return false
                    } else {
                        setSurveyList(response)
                    }
                }
            })
            .catch(err => {
                setLoading(false)
                console.log('error', err)
            })
    }

    useEffect(() => {
        getSurveys()
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
        getSurveys()
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

    const handleUpdate = (row) => {
        setUpdateModal(true)
        setEditInfo(row)
    }

    const handleUpdateSurvey = () => {
        Service.patch({
            url: `/admin/survey-form/${editInfo.id}/`,
            body: JSON.stringify({ is_active: true })
        })
            .then(response => {
                if (response && response.status === 'error') {
                    response.data.then(res => {
                        OpenNotification('error', 'Oops!', res.message)
                    })
                    return false
                } else {
                    getSurveys()
                    OpenNotification('success', 'Success!', 'Survey activated successfully!')
                }
                setUpdateModal(false)
            })
            .catch(err => {
                setUpdateModal(false)
                OpenNotification('error', 'Oops!', 'Something went wrong while updating the survey status!')
            })
    }


    const handleDeleteList = () => {
        setSubmitting(true)
        Service.delete({
            url: `/admin/survey-form/${editInfo.id}/`
        })
            .then((response) => {
                setDeleteModal(!deleteModal)
                setSubmitting(false)
                getSurveys()
                OpenNotification('success', 'Success!', 'Survey deleted successfully!')
            })
            .catch(err => {
                setSubmitting(false)

                if (err instanceof SyntaxError) {
                    // Handle empty response as successful deletion
                    setDeleteModal(!deleteModal)
                    getSurveys()
                    OpenNotification('success', 'Success!', 'Survey deleted successfully!')
                } else {
                    setDeleteModal(!deleteModal)
                    OpenNotification('error', 'Oops!', 'Something went wrong while deleting the survey!')
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
                url: `/admin/survey-form/${editInfo.id}/`,
                body: JSON.stringify(params)
            })
                .then(response => {
                    setSubmitting(false)
                    if (response.status === false) {
                        OpenNotification('error', 'Oops!', response.message)
                        return false
                    } else {
                        getSurveys()
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
                url: '/admin/survey-form/',
                body: JSON.stringify(params)
            })
                .then(response => {
                    setSubmitting(false)
                    if (response.status === false) {
                        OpenNotification('error', 'Oops!', response.message)
                        return false
                    } else {
                        getSurveys()
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
            name: 'Title',
            selector: 'title',
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
            name: 'Status',
            selector: 'status',
            center: true,
            minWidth: '100px',
            sortable: false,
            cell: row => (
                <>
                    {(row.is_active) ? <>
                        <span>
                            Active
                        </span>
                    </> : <>
                        <span
                            className="status-hover"
                            onMouseEnter={(e) => e.target.classList.add('hovered')}
                            onMouseLeave={(e) => e.target.classList.remove('hovered')}
                            onClick={() => { handleUpdate(row) }}
                        >
                            Inactive
                        </span>
                    </>}
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
                        <Button.Ripple outline color='secondary' size='sm' tag={Link} to={`/configurations/survey/view/${row.id}`}>
                            <Eye size={14} />
                        </Button.Ripple> &nbsp;
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
                                data={surveyList}
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


            <Modal isOpen={addModal} toggle={() => setAddModal(!addModal)}>
                <ModalHeader toggle={() => setAddModal(!addModal)}>{editInfo ? 'Edit' : 'Add'} Survey</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <FormGroup>
                            <Input
                                id="name"
                                name="name"
                                innerRef={register({ required: true })}
                                placeholder="Enter Title"
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

            {/* Update Modal */}
            <Modal isOpen={updateModal} toggle={() => setUpdateModal(!updateModal)}>
                <ModalHeader toggle={() => setUpdateModal(!updateModal)}>
                    Activate Survey
                </ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label>Are you sure you want to activate this survey?</Label>
                    </FormGroup>
                    <ModalFooter className="d-flex justify-content-start px-0">
                        <Button color="secondary" onClick={() => setUpdateModal(false)}>
                            No
                        </Button>{' '}
                        <Button color="primary" type="button" onClick={handleUpdateSurvey}>
                            {submitting ? <Spinner color='white' size='sm' /> : 'Yes'}
                        </Button>
                    </ModalFooter>
                </ModalBody>
            </Modal>

            {/* Delete Modal */}
            <Modal isOpen={deleteModal} toggle={() => setDeleteModal(!deleteModal)}>
                <ModalHeader toggle={() => setDeleteModal(!deleteModal)}>Delete Survey</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleSubmit(handleDeleteList)}>
                        <FormGroup>
                            <Label for="">
                                Do you want to delete this survey?
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

export default ManageSurvey
