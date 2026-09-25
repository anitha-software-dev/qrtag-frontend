import React, { useEffect, useState } from 'react'
import { Button, FormGroup, Input, Label, Row, Col, Form, Modal, ModalHeader, ModalBody, ModalFooter, Spinner } from 'reactstrap'
import { MdDelete } from 'react-icons/md'
import { Service } from '@src/services/Service'
import { OpenNotification } from '@src/views/components/Helper'
import { useParams, useLocation, useHistory } from 'react-router-dom'
import { ChevronDown, Edit, Search, Trash2, RefreshCcw, Eye } from 'react-feather'

const Photos = ({ editData, getMemorial }) => {
    const history = useHistory()

    const { id } = useParams()
    const [photoFields, setPhotoFields] = useState({ title: '', file: null, preview: null })
    const [photoList, setPhotoList] = useState([])
    const [editInfo, setEditInfo] = useState(null)
    const [loading, setLoading] = useState(false)
    const [addModal, setAddModal] = useState(false)

    useEffect(() => {
        if (editData && Array.isArray(editData.photos)) {
            const filledFields = editData.photos.map(photo => ({
                id: photo.id || null,
                title: photo.title || '',
                file: null,
                preview: photo.photo || null
            }))
            setPhotoList(filledFields)
            setEditInfo(editData)
        }
    }, [editData])

    const handleTitleChange = (value) => {
        const updated = { ...photoFields }
        updated.title = value
        setPhotoFields(updated)
    }

    const handlePhotoChange = (file) => {
        const updated = { ...photoFields }
        updated.file = file

        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                updated.preview = reader.result
                setPhotoFields({ ...updated })
            }
            reader.readAsDataURL(file)
        } else {
            updated.preview = null
            setPhotoFields(updated)
        }
    }

    const removeField = (obj) => {
        if (obj && obj.id) {
          
            Service.delete({
                url: `/common/memorial-photo/${obj.id}/`
            })
                .then((response) => {
                    getMemorial()
                    OpenNotification('success', 'Success!', 'Photo deleted successfully!')
                })
                .catch(err => {
                    console.log('Error details:', err)

                    OpenNotification('error', 'Oops!', 'Something went wrong while deleting the photo!')
                })

        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        

        const formData = new FormData()

        formData.append('memorial_id', id)

        if (photoFields.title) {
            formData.append('title', photoFields.title)
        } else {
            OpenNotification('error', 'Required!', "Title cannot be blank!")
            return false
        }

        if (photoFields.file) {
            formData.append('image', photoFields.file)
        } else {
            OpenNotification('error', 'Required!', "Please upload a photo!")
            return false
        }
       
        setLoading(true)

        Service.post({
            url: '/common/memorial-photo/',
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
                    OpenNotification(
                        'success', 'Success!', response.message || 'Photos added successfully'
                    )
                    setPhotoFields({ title: '', file: null, preview: null })
                    setAddModal(!addModal)
                    // history.push('/digitalMemorial')
                    getMemorial()
                }
            })
            .catch(() => {
                setLoading(false)
                OpenNotification('error', 'Oops!', 'Something went wrong!')
            })
    }

    return (
        <>
            <div className="p-2">
                <Row>
                    <Col md="12" className="text-right mb-3">
                        <Button color="primary" onClick={() => setAddModal(!addModal)} disabled={loading}>
                            + Add Photo
                        </Button>
                    </Col>
                </Row>
                <Row>
                    {(photoList && photoList.length > 0) ? <>
                        {photoList.map((field, index) => (
                            <Col md="3" key={index} className="mb-4">
                                <div className="border rounded px-2 py-2 position-relative text-center" style={{ backgroundColor: '#f8f9fa' }}>
                                    <div
                                        className="position-absolute"
                                        style={{ top: '10px', right: '10px', cursor: 'pointer' }}
                                    >
                                        {/* <Button.Ripple outline color='info' size='sm'>
                                            <Edit size={14} />
                                        </Button.Ripple> &nbsp; */}
                                        <Button.Ripple outline color='danger' size='sm' onClick={() => removeField(field)}>
                                            <Trash2 size={14} />
                                        </Button.Ripple>
                                    </div>

                                    <FormGroup>
                                        {field.preview && (
                                            <img
                                                src={field.preview}
                                                alt={`Preview ${index}`}
                                                style={{
                                                    marginTop: '30px',
                                                    width: '100%',
                                                    minHeight: '250px',
                                                    maxHeight: '250px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px'
                                                }}
                                            />
                                        )}
                                    </FormGroup>
                                    <FormGroup>
                                        <p>{field.title}</p>
                                    </FormGroup>
                                </div>
                            </Col>
                        ))}
                    </> : <>
                        <Col md="12" className="text-center my-3">
                            <p>No photos available.</p>
                        </Col>
                    </>}
                </Row>

            </div>

            <Modal isOpen={addModal} toggle={() => setAddModal(!addModal)}>
                <ModalHeader toggle={() => setAddModal(!addModal)}>Add Photo</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md="12">
                                <FormGroup>
                                    <Label>Title<span className='text-danger'>*</span></Label>
                                    <Input
                                        type="text"
                                        value={photoFields.title}
                                        onChange={(e) => handleTitleChange(e.target.value)}
                                        placeholder="Enter photo title"
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="12">
                                <FormGroup>
                                    <Label>Photo<span className='text-danger'>*</span></Label>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handlePhotoChange(e.target.files[0])}
                                    />
                                    {photoFields.preview && (
                                        <img
                                            src={photoFields.preview}
                                            alt={`Preview 1`}
                                            style={{
                                                marginTop: '10px',
                                                width: '100px',
                                                maxHeight: '250px',
                                                objectFit: 'cover',
                                                borderRadius: '8px'
                                            }}
                                        />
                                    )}
                                </FormGroup>
                            </Col>
                        </Row>
                        <ModalFooter className="d-flex justify-content-start px-0">
                            <Button disabled={loading} color="primary" type="submit">
                                {(loading) ? <> <Spinner color='white' size='sm' /> </> : 'SUBMIT'}
                            </Button>
                        </ModalFooter>
                    </Form>
                </ModalBody>

            </Modal >
        </>
    )
}

export default Photos
