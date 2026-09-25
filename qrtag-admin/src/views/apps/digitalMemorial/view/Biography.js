import React, { useEffect, useState } from 'react'
import '@styles/react/libs/editor/editor.scss'
import Spinners from '@components/spinner/Loading-spinner'
import { useParams } from 'react-router-dom'
import { Row, Col, Card, Form, FormGroup, Label, Button, Spinner, CardBody, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { OpenNotification } from '@src/views/components/Helper'
import { Service } from '@src/services/Service'
import { UploadCloud } from 'react-feather'
import { useForm } from 'react-hook-form'


const Biography = ({ editInfo, fetching }) => {

    const { id } = useParams()

    if (fetching) {
        return (
            <div className="d-flex justify-content-center mt-4">
                <Spinners color="primary" />
            </div>
        )
    }

    return (
        <>
            <Card className="shadow-sm p-2">

                <CardBody>
                    <Row>
                        <Col md='4' className="mb-1"><strong>Name</strong> <dd>{editInfo && editInfo.name ? editInfo.name : '-'}</dd></Col>
                        <Col md='4' className="mb-1"><strong>Date of Birth</strong> <dd>{editInfo && editInfo.from_date ? editInfo.from_date : '-'}</dd></Col>
                        <Col md='4' className="mb-1"><strong>Date of Death</strong> <dd>{editInfo && editInfo.to_date ? editInfo.to_date : '-'}</dd></Col>

                        <Col md='12' className="mb-1"><strong>Description</strong>
                            <dd><div dangerouslySetInnerHTML={{ __html: (editInfo && editInfo.description) ? editInfo.description : '' }} /></dd>
                        </Col>
                    </Row>
                    <Row className='mt-2'>
                        <Col md={6}>
                            <strong>Profile Photo</strong>
                            <FormGroup>
                                {editInfo && editInfo.profile_photo && (
                                    <img
                                        src={editInfo.profile_photo}
                                        alt="Profile Preview"
                                        style={{ marginTop: '10px', width: '200px', objectFit: 'cover', borderRadius: '8px' }}
                                    />
                                )}
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <strong>Cover Photo</strong>
                            <FormGroup>
                                {editInfo && editInfo.cover_photo && (
                                    <img
                                        src={editInfo.cover_photo}
                                        alt="Cover Preview"
                                        style={{ marginTop: '10px', width: '300px', objectFit: 'cover', borderRadius: '8px' }}
                                    />
                                )}
                            </FormGroup>
                        </Col>
                    </Row>
                </CardBody>
            </Card>


        </>
    )
}

export default Biography
