import React, { useState, useEffect, useRef } from 'react'
import DataTable from 'react-data-table-component'
import { Button, Row, Col, Label, CustomInput, Card, Modal, ModalHeader, ModalBody, ModalFooter, Input, InputGroup, InputGroupAddon, Spinner, Form, FormGroup, CardHeader, CardBody, Table } from 'reactstrap'
import Breadcrumbs from '@components/breadcrumbs'
import UILoader from '@components/ui-loader'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import '@styles/react/apps/app-invoice.scss'
import { ChevronDown, Search, RefreshCcw, RotateCcw, Eye, Trash2, Edit, Plus } from 'react-feather'
import { OpenNotification, formatPhone } from '@src/views/components/Helper'
import { Service } from '@src/services/Service'
import ReactPaginate from 'react-paginate'
import { useForm } from 'react-hook-form'
import { useParams, Link } from 'react-router-dom'

import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc'
import arrayMove from 'array-move'

const DragHandle = sortableHandle(() => <span className='font-size-1 cursor-pointer'>☰</span>)

const SortableItem = sortableElement(({ value }) => (
    <tr className='w-100 rearrange_tr'>
        {value}
    </tr>
))

const SortableContainer = sortableContainer(({ children }) => {
    return <tbody className='sortLists'>{children}</tbody>
})

const CustomHeader = ({ handlePerPage, rowsPerPage, handleAdd }) => {
    return (

        <div className='invoice-list-table-header w-100 py-2'>
            <Row>
                <Col lg='8' className='d-flex align-items-center px-0 px-lg-1'>
                    <h6>SURVEY FORM</h6>
                </Col>
                <Col
                    lg='1'
                    className='actions-right d-flex align-items-center justify-content-lg-end flex-lg-nowrap flex-wrap mt-lg-0 mt-1 pr-lg-1 p-0'
                >
                </Col>
                <Col
                    lg='3'
                    className='actions-right d-flex align-items-center justify-content-lg-end flex-lg-nowrap flex-wrap mt-lg-0 mt-1 pr-lg-1 p-0'
                >
                    <Button color='primary' size='sm' onClick={() => { handleAdd() }}>
                        <Plus size={14} /> Add New
                    </Button>
                </Col>
            </Row>
        </div>
    )
}

const SurveyForm = () => {

    const { id } = useParams()

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

    const [options, setOptions] = useState([{ option: '' }])
    const [selectedType, setSelectedType] = useState('')
    const [selectedQuestion, setSelectedQuestion] = useState('')
    const [showAdditionalQuestion, setShowAdditionalQuestion] = useState(false)
    const [additionalQuestion, setAdditionalQuestion] = useState('')
    const [answerWordLimit, setAnswerWordLimit] = useState('')


    const [questionsList, setQuestionsList] = useState([])

    const { register, control, handleSubmit, setValue, formState: { errors }, reset } = useForm()

    const getQuestionsList = (param) => {
        setLoading(true)

        Service.get({
            url: `/common/question/?survey_id=${id}`
        })
            .then(response => {

                setLoading(false)
                if (response.status === false) {
                    OpenNotification('error', 'Oops!', response.message)
                    return false
                } else {
                    setQuestionsList(response)
                }
            })
            .catch(err => {
                setLoading(false)
                console.log('error', err)
                OpenNotification('error', 'Oops!', 'Something went wrong!')
            })
    }

    useEffect(() => {
        getQuestionsList()
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
        getQuestionsList()
    }

    const handleAdd = async () => {
        setSelectedType('')
        setSelectedQuestion('')
        setOptions([{ option: '' }])
        setEditInfo(null)
        setAddModal(!addModal)
        setShowAdditionalQuestion(false)
        setAdditionalQuestion('')
        setAnswerWordLimit('')
    }

    const handleEdit = (row) => {
        setSelectedType(row && row.question_type)
        setValue('type', row && row.question_type)
        setSelectedQuestion(row && row.question)
        setValue('question', row && row.question)
        setTimeout(() => {
            setAnswerWordLimit((row && row.answer_word_limit) ? row.answer_word_limit : '')
        }, 500)

        setOptions(row.options)
        if (row && row.additional_question && row.additional_question !== null) {
            setShowAdditionalQuestion(true)
            setAdditionalQuestion(row.additional_question)
        } else {
            setShowAdditionalQuestion(false)
            setAdditionalQuestion(null)
            setAnswerWordLimit('')
        }
        setEditInfo(row)
        setAddModal(!addModal)
    }

    const handleDelete = (row) => {
        setDeleteModal(!deleteModal)
        setEditInfo(row)
    }

    const addOption = () => {
        setOptions([...options, { option: '' }])
    }

    const removeOption = (option, index) => {

        if (option.id) {
            Service.delete({
                url: `/admin/option/${option.id}/`
            })
                .then((response) => {

                })
                .catch(err => {

                    console.log('Error details:', err)
                    if (err instanceof SyntaxError) {
                    } else {
                        // setDeleteModal(!deleteModal)
                        OpenNotification('error', 'Oops!', 'Something went wrong while deleting the option!')
                    }
                })
        }

        const updatedOptions = options.filter((_, i) => i !== index)
        setOptions(updatedOptions)

    }

    const handleOptionChange = (index, value) => {
        const updatedOptions = [...options]
        updatedOptions[index] = { ...updatedOptions[index], option: value }
        setOptions(updatedOptions)
    }


    const handleDeleteList = () => {

        setSubmitting(true)
        Service.delete({
            url: `/admin/question/${editInfo.id}/`
        })
            .then((response) => {
                setDeleteModal(!deleteModal)
                setSubmitting(false)
                getQuestionsList()
                OpenNotification('success', 'Success!', 'Question successfully deleted!')
            })
            .catch(err => {
                setSubmitting(false)
                console.log('Error details:', err)

                if (err instanceof SyntaxError) {
                    // Handle empty response as successful deletion
                    setDeleteModal(!deleteModal)
                    getQuestionsList()
                    OpenNotification('success', 'Success!', 'Question deleted successfully!')
                } else {
                    setDeleteModal(!deleteModal)
                    OpenNotification('error', 'Oops!', 'Something went wrong while deleting the question!')
                }
            })
    }

    const onSubmit = (data) => {

        if (
            (selectedType === 'radio' || selectedType === 'checkbox') &&
            options.some(option => option.option.trim() === '')
        ) {
            OpenNotification('error', 'Oops!', 'Please fill all options!')
            return
        }

        const params = {
            question: data.question,
            question_type: data.type,
            options: (data.type === 'text' || data.type === 'ratings') ? [] : options,
            additional_question: showAdditionalQuestion ? additionalQuestion : "",
            answer_word_limit: answerWordLimit ? parseInt(answerWordLimit) : 0,
            survey: id
        }

        setSubmitting(true)

        if (editInfo) {

            Service.put({
                url: `/admin/question/${editInfo.id}/`,
                body: JSON.stringify(params)
            })
                .then(response => {
                    setSubmitting(false)

                    if (response && response.status === 'error') {
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
                        getQuestionsList()
                        setAddModal(!addModal)
                        OpenNotification('success', 'Success!', `Question successfully updated!`)
                    }
                })
                .catch(err => {
                    console.log('error', err)
                    setSubmitting(false)
                    OpenNotification('error', 'Oops!', 'Something went wrong!')
                })
        } else {


            Service.post({
                url: '/admin/question/',
                body: JSON.stringify(params)
            })
                .then(response => {

                    setSubmitting(false)
                    if (response && response.status === 'error') {
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
                        getQuestionsList()
                        setAddModal(!addModal)
                        OpenNotification('success', 'Success!', `Question successfully added!`)
                    }
                })
                .catch(err => {
                    console.log('error', err)
                    setSubmitting(false)
                    OpenNotification('error', 'Oops!', 'Something went wrong!')
                })
        }
    }

    //Sort instantly when user drag drop ite,
    const onSortEnd = ({ oldIndex, newIndex }) => {
        const sorted = arrayMove(questionsList, oldIndex, newIndex)
        setQuestionsList(sorted)

        const newArr = []

        //Create array of sorted order
        for (let i = 0; i < sorted.length; i++) {
            newArr.push({ question_id: sorted[i].id, order: i + 1 })
        }

        if (newArr.length > 0) {
            Service.post({
                url: "/admin/question/update-question-order/",
                body: JSON.stringify({
                    data: newArr
                })
            })
        }
    }

    return (
        <>
            <Breadcrumbs breadCrumbParent='Survey Questions' breadCrumbActive='List' />

            <div className='invoice-list-wrapper'>
                <UILoader loader={<Spinner />}>
                    <Card>
                        <CardHeader>
                            <div className='invoice-list-table-header w-100 py-1'>
                                <Row>
                                    <Col lg='8' className='d-flex align-items-center px-0 px-lg-1'>
                                        <h6>SURVEY FORM</h6>
                                    </Col>
                                    <Col
                                        lg='4'
                                        className='actions-right d-flex align-items-center justify-content-lg-end flex-lg-nowrap flex-wrap mt-lg-0 mt-1 pr-lg-1 p-0'
                                    >
                                        <Button color='primary' size='sm' onClick={() => { handleAdd() }}>
                                            <Plus size={14} /> Add New
                                        </Button>
                                    </Col>
                                </Row>
                            </div>
                        </CardHeader>

                        <CardBody>
                            <Row>
                                <Col sm="12">
                                    <FormGroup>
                                        <div className="d-flex prevent-select">
                                            <Table>
                                                {loading ? (
                                                    <tr>
                                                        <td className="text-center" colSpan={3}>
                                                            <Spinner />
                                                        </td>
                                                    </tr>
                                                ) : questionsList && questionsList.length > 0 ? (
                                                    <>
                                                        <thead>
                                                            <tr>
                                                                <th></th>
                                                                <th>Question</th>
                                                                <th className="text-center">ACTIONS</th>
                                                            </tr>
                                                        </thead>
                                                        <SortableContainer onSortEnd={onSortEnd} useDragHandle>
                                                            {questionsList.map((row, index) => (
                                                                <SortableItem
                                                                    key={`item-${index}`}
                                                                    index={index}
                                                                    value={
                                                                        <>
                                                                            <td className="d-flex flex-row align-items-center justify-content-center" style={{ minWidth: "30px" }}>
                                                                                <DragHandle />
                                                                            </td>
                                                                            <td style={{ minWidth: "300px" }}>
                                                                                <span>{row.question ? row.question : "-"}</span>
                                                                            </td>
                                                                            <td className="flex-row align-items-center justify-content-center text-center" style={{ width: "180px" }}>
                                                                                <Button.Ripple outline color="info" size="sm" onClick={() => handleEdit(row)}>
                                                                                    <Edit size={14} />
                                                                                </Button.Ripple>{" "}
                                                                                &nbsp;
                                                                                <Button.Ripple outline color="danger" size="sm" onClick={() => handleDelete(row)}>
                                                                                    <Trash2 size={14} />
                                                                                </Button.Ripple>
                                                                            </td>
                                                                        </>
                                                                    }
                                                                />
                                                            ))}
                                                        </SortableContainer>
                                                    </>
                                                ) : (
                                                    <tr>
                                                        <td className="text-center py-4" colSpan={3}>
                                                            No questions found
                                                        </td>
                                                    </tr>
                                                )}
                                            </Table>
                                        </div>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </CardBody>

                    </Card>
                </UILoader>
            </div >


            {/* Open Modal */}
            <Modal isOpen={addModal} toggle={() => setAddModal(!addModal)} size='sm'>
                <ModalHeader toggle={() => setAddModal(!addModal)}>{editInfo ? 'Edit' : 'Add'} Question</ModalHeader>
                <Row>
                    <ModalBody>
                        <Form onSubmit={handleSubmit(onSubmit)}>

                            <Col md="12">
                                <Label className=''>Type</Label>
                                <Input
                                    id='type'
                                    type='select'
                                    name='type'
                                    value={selectedType}
                                    onChange={(e) => { setSelectedType(e.target.value); setValue('type', e.target.value) }}
                                    {...register('type', { required: 'Type is required' })}
                                >
                                    <option defaultValue={''} hidden>
                                        Select
                                    </option>
                                    <option value="text">Text</option>
                                    <option value="radio">Radio</option>
                                    <option value="checkbox">Checkbox</option>
                                    <option value="ratings">Ratings</option>
                                </Input>
                                {errors.type && <p className="text-danger">{errors.type.message}</p>}
                            </Col>
                            <Col md="12" className='mt-1'>
                                <Label className=''>Question</Label>
                                <Input
                                    id='question'
                                    type='text'
                                    name='question'
                                    placeholder='Enter Question'
                                    value={selectedQuestion}
                                    onChange={(e) => { setSelectedQuestion(e.target.value); setValue('question', e.target.value) }}
                                    innerRef={register('question', { required: 'Question is required' })}
                                />
                                {errors.question && <p className="text-danger">{errors.question.message}</p>}
                            </Col>
                            {selectedType !== 'text' && selectedType !== 'ratings' && selectedType !== '' && (
                                <div className=''>
                                    <Label className='mt-2 ml-1'>Options</Label>
                                    {options.map((option, index) => (
                                        <Col md='12' className='mt-1 d-flex align-items-center'>
                                            <Input
                                                className='w-100 mr-1'
                                                type='text'
                                                name={`options[${index}]`}
                                                placeholder={`Enter Option`}
                                                value={option.option}
                                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                            />
                                            <div style={{ display: options.length < 2 && 'none' }} className='cursor-pointer mt-1 text-danger text-right mb-1 font-weight-bold' onClick={() => removeOption(option, index)}>
                                                <Trash2 size='20' />
                                            </div>
                                        </Col>
                                    ))}


                                    <div className='ml-1 w-25 my-1 cursor-pointer text-primary font-weight-bold' onClick={() => addOption()}>
                                        <Plus size='20' /> Add More
                                    </div>
                                </div>
                            )}


                            <div className='mt-2'>
                                <Input
                                    className='mr-1 ml-1'
                                    id='additionalQuestionCheckbox'
                                    type='checkbox'
                                    checked={showAdditionalQuestion}
                                    onChange={(e) => setShowAdditionalQuestion(e.target.checked)}
                                />{' '}
                                <Label for='additionalQuestionCheckbox' className='ml-3 mb-2'>
                                    Add Additional Question
                                </Label>
                            </div>


                            {showAdditionalQuestion && (
                                <>
                                    <Col md="12" className='mb-2'>
                                        <Label className=''>Additional Question</Label>
                                        <Input
                                            id='additionalQuestion'
                                            type='text'
                                            name='additionalQuestion'
                                            placeholder='Enter Additional Question'
                                            value={additionalQuestion}
                                            onChange={(e) => setAdditionalQuestion(e.target.value)}
                                        />
                                    </Col>
                                </>
                            )}

                            <Col md="12" className='mb-2'>
                                <Label>Word Limit for the Answer</Label>
                                <Input
                                    id='answerWordLimit'
                                    type='number'
                                    name='answerWordLimit'
                                    placeholder='Enter Word Limit'
                                    value={answerWordLimit}
                                    onChange={(e) => setAnswerWordLimit(e.target.value)}
                                />
                            </Col>

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
                </Row>
            </Modal >


            {/* Delete Modal */}
            < Modal isOpen={deleteModal} toggle={() => setDeleteModal(!deleteModal)}>
                <ModalHeader toggle={() => setDeleteModal(!deleteModal)}>Delete Question</ModalHeader>
                <ModalBody>
                    <Form >
                        <FormGroup>
                            <Label for="">
                                Do you want to delete this Question?
                            </Label>
                        </FormGroup>
                        <ModalFooter className="d-flex justify-content-start px-0">
                            <Button color="secondary" onClick={() => setDeleteModal(!deleteModal)}>
                                No
                            </Button>{' '}
                            <Button color="primary" onClick={() => handleDeleteList()}>
                                {submitting ? <> <Spinner color='white' size='sm' /> </> : 'Yes'}
                            </Button>
                        </ModalFooter>
                    </Form>
                </ModalBody>
            </Modal >

        </>
    )
}

export default SurveyForm
