import React, { useEffect, useState } from 'react'
import { FormGroup, Row, Col, Button } from 'reactstrap'

const Photos = ({ editData }) => {

    const [photoList, setPhotoList] = useState([])

    useEffect(() => {
        if (editData && Array.isArray(editData.photos)) {
            const filledFields = editData.photos.map(photo => ({
                id: photo.id || null,
                title: photo.title || '',
                file: null,
                preview: photo.photo || null
            }))
            setPhotoList(filledFields)
        }
    }, [editData])

    return (
        <>
            <div className="p-3">
                
                <Row>
                    {(photoList && photoList.length > 0) ? <>
                        {photoList.map((field, index) => (
                            <Col md="3" key={index} className="mb-4">
                                <div className="border rounded px-2 py-2 position-relative text-center" style={{ backgroundColor: '#f8f9fa' }}>

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

        </>
    )
}

export default Photos
