import React, { useEffect, useState } from 'react'
import { useParams, useHistory, useLocation } from 'react-router-dom'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, ContentState, convertToRaw, convertFromHTML } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import '@styles/react/libs/editor/editor.scss'
import Spinners from '@components/spinner/Loading-spinner'

import {
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    Row,
    Col,
    Card,
    CardBody,
    Spinner
} from 'reactstrap'
import { Service } from '@src/services/Service'
import { OpenNotification } from '@src/views/components/Helper'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import Flatpickr from 'react-flatpickr'
import { useForm } from 'react-hook-form'

const Biography = ({ editData }) => {
    
    const history = useHistory()
    const [editInfo, setEditInfo] = useState(null)
    const [name, setName] = useState('')
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const [profilePhoto, setProfilePhoto] = useState(null)
    const [coverPhoto, setCoverPhoto] = useState(null)
    const [profilePhotoPreview, setProfilePhotoPreview] = useState(null)
    const [coverPhotoPreview, setCoverPhotoPreview] = useState(null)
    const [editorState, setEditorState] = useState(EditorState.createEmpty())
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        if (editData) {
            setName(editData.name || '')

            setFromDate(editData.from_date ? new Date(editData.from_date) : null)
            setToDate(editData.to_date ? new Date(editData.to_date) : null)

            const contentState = EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(editData.description)))
            setEditorState(contentState)

            if (editData.profile_photo) {
                setProfilePhotoPreview(editData.profile_photo)
            }

            if (editData.cover_photo) {
                setCoverPhotoPreview(editData.cover_photo)
            }

            setEditInfo(editData)
            // console.log("edit info:", editData)
        }
    }, [editData])


    const formatDate = (date) => {
        const d = new Date(date)
        const year = d.getFullYear()
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        
        const formData = new FormData()

        if (name && name !== "") {
            formData.append('name', name)
        } else {
            OpenNotification('error', 'Required!', "Name cannot be blank!")
            return false
        }

        if (fromDate && fromDate !== "") {
            formData.append('from_date', formatDate(fromDate))
        } else {
            OpenNotification('error', 'Required!', "Date of Birth cannot be blank!")
            return false
        }

        if (toDate && toDate !== "") {
            formData.append('to_date', formatDate(toDate))
        } else {
            OpenNotification('error', 'Required!', "Date of Death cannot be blank!")
            return false
        }

        if (profilePhoto) {
            formData.append('profile_photo', profilePhoto)
        } else if (profilePhoto === null && profilePhotoPreview === null) {
            OpenNotification('error', 'Required!', "Please upload profile photo!")
            return false
        }

        if (coverPhoto) {
            formData.append('cover_photo', coverPhoto)
        } else if (coverPhoto === null && coverPhotoPreview === null) {
            OpenNotification('error', 'Required!', "Please upload cover photo!")
            return false
        }

        const description = draftToHtml(convertToRaw(editorState.getCurrentContent()))

        formData.append('description', description)

        setLoading(true)
        
        if (editInfo) {
            Service.patch({
                url: `/common/digital-memorial/${editInfo.id}/`,
                body: formData,
                formdata: true
            })
                .then(response => {
                    setLoading(false)
                    if (response.status === 'error') {
                        response.data.then(res => {
                            if (typeof res === 'object') {
                                if (res.message) {
                                    OpenNotification('error', 'Oops!', res.message)
                                } else {
                                    for (const key in res) {
                                        if (Object.hasOwnProperty.call(res, key)) {
                                            OpenNotification('error', 'Oops!', res[key][0])
                                            return
                                        }
                                    }
                                }
                            } else {
                                OpenNotification('error', 'Oops!', 'Something went wrong!')
                            }
                        })
                    } else {
                        OpenNotification('success', 'Success!', response.message || 'Digital memorial updated successfully')
                        history.push('/digitalMemorial')
                    }
                })
                .catch(() => {
                    setLoading(false)
                    OpenNotification('error', 'Oops!', 'Something went wrong!')
                })
        } else {
            Service.post({
                url: '/common/digital-memorial/',
                body: formData,
                formdata: true
            })
                .then(response => {
                    setLoading(false)
                    if (response.status === 'error') {
                        response.data.then(res => {
                            if (typeof res === 'object') {
                                if (res.message) {
                                    OpenNotification('error', 'Oops!', res.message)
                                } else {
                                    for (const key in res) {
                                        if (Object.hasOwnProperty.call(res, key)) {
                                            OpenNotification('error', 'Oops!', res[key][0])
                                            return
                                        }
                                    }
                                }
                            } else {
                                OpenNotification('error', 'Oops!', 'Something went wrong!')
                            }
                        })
                    } else {
                        OpenNotification('success', 'Success!', response.message || 'Digital memorial added successfully')
                        history.push('/digitalMemorial')
                    }
                })
                .catch(() => {
                    setLoading(false)
                    OpenNotification('error', 'Oops!', 'Something went wrong!')
                })
        }
    }


    if (fetching) {
        return (
            <div className="d-flex justify-content-center mt-4">
                <Spinners color="primary" />
            </div>
        )
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Card className="shadow-sm">
                <CardBody>
                    <Row>
                        <Col md={12} style={{ border: '1px solid #dee2e6', borderRadius: '8px', backgroundColor: '#f8f9fa', padding: '20px' }}>
                            <Row>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label for="name">Name<span className='text-danger'>*</span></Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            placeholder="Enter Name"
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label>Date of Birth<span className='text-danger'>*</span></Label>
                                        <Flatpickr
                                            id="fromDate"
                                            placeholder="Select Date of Birth"
                                            value={fromDate}
                                            onChange={(date) => setFromDate(date[0])}
                                            options={{ dateFormat: 'Y-m-d' }}
                                            className="form-control"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup>
                                        <Label>Date of Death<span className='text-danger'>*</span></Label>
                                        <Flatpickr
                                            id="toDate"
                                            placeholder="Select Date of Death"
                                            value={toDate}
                                            onChange={(date) => setToDate(date[0])}
                                            options={{ dateFormat: 'Y-m-d', minDate: fromDate }}
                                            className="form-control"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={12}>
                                    <FormGroup>
                                        <Label>Description</Label>
                                        <Editor
                                            editorState={editorState}
                                            onEditorStateChange={setEditorState}
                                            wrapperClassName="demo-wrapper"
                                            editorClassName="demo-editor border px-2 py-1 bg-white"
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="profilePhoto">Profile Photo<span className='text-danger'>*</span></Label>
                                        <Input
                                            id="profilePhoto"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files[0]
                                                setProfilePhoto(file)
                                                setProfilePhotoPreview(URL.createObjectURL(file))
                                            }}
                                        />

                                        {profilePhotoPreview && (
                                            <img
                                                src={profilePhotoPreview}
                                                alt="Profile Preview"
                                                style={{ marginTop: '10px', width: '100px', objectFit: 'cover', borderRadius: '8px' }}
                                            />
                                        )}
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="coverPhoto">Cover Photo<span className='text-danger'>*</span></Label>
                                        <Input
                                            id="coverPhoto"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files[0]
                                                setCoverPhoto(file)
                                                setCoverPhotoPreview(URL.createObjectURL(file))
                                            }}
                                        />
                                        {coverPhotoPreview && (
                                            <img
                                                src={coverPhotoPreview}
                                                alt="Cover Preview"
                                                style={{ marginTop: '10px', width: '100px', objectFit: 'cover', borderRadius: '8px' }}
                                            />
                                        )}
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={10} className="text-end mt-2">
                                    <Button color="primary" type="submit" disabled={loading}>
                                        {loading ? <Spinner size="sm" /> : editInfo ? 'Update' : 'Submit'}
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Form>
    )
}

export default Biography
