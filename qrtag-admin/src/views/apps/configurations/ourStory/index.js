import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Col, Card, CardHeader, CardBody, Form, FormGroup, Label, Input, Button, Spinner } from 'reactstrap'
import { Service } from '@src/services/Service'
import { OpenNotification } from '@src/views/components/Helper'

const OurStory = () => {
    const [loading, setLoading] = useState(false)
    const [storyData, setStoryData] = useState({})
    const [imagePreview, setImagePreview] = useState(null)

    const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm()

    const getStoryData = async () => {
        setLoading(true)

        Service.get({
            url: `/admin/story/`
        })
            .then(response => {
                setLoading(false)

                if (response && response.length > 0) {
                    const story = response[0]
                    setStoryData(story)
                    setValue("title", story?.title)
                    setValue("content", story?.content)

                    if (story?.image) {
                        setImagePreview(story.image)
                    }
                } else {
                    setStoryData(null)
                }
            })
            .catch(err => {
                setLoading(false)
                console.log('error', err)
                OpenNotification('error', 'Oops!', 'Something went wrong!')
            })
    }

    useEffect(() => {
        getStoryData()
    }, [])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setStoryData((prev) => ({ ...prev, [name]: value }))
        setValue(name, value)
    }

    const handleImageChange = (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0]
            setImagePreview(URL.createObjectURL(file))
            setValue("image", file)
        }
    }

    const onSubmit = async (values) => {
        setLoading(true)
        const formData = new FormData()
        formData.append('title', values.title)
        formData.append('content', values.content)

        if (values.image instanceof File) {
            formData.append('image', values.image)
        } else if (!storyData?.image) {
            OpenNotification('error', 'Oops!', 'Image is required!')
            setLoading(false)
            return
        }

        let response
        if (storyData?.id) {
            response = await Service.patch({ url: `/admin/story/${storyData.id}/`, body: formData, formdata: true })
        } else {
            response = await Service.post({ url: '/admin/story/', body: formData, formdata: true })
        }

        setLoading(false)
        getStoryData()
        if (response.status === 'error') {
            OpenNotification('error', 'Oops!', response.data.message || 'Failed to save story!')
        } else {
            OpenNotification('success', 'Success!', `Story ${storyData?.id ? 'updated' : 'created'} successfully!`)
        }
    }

    return (
        <Col sm="12">
            <Card>
                <CardHeader tag='h4'>Our Story</CardHeader>
                <CardBody>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <FormGroup>
                            <Label>Title</Label>
                            <Input
                                id='title'
                                name='title'
                                type="text"
                                placeholder="Enter title"
                                innerRef={register({ required: "Title is required" })}
                                value={storyData?.title || ''}
                                onChange={handleInputChange}
                            />
                            {errors.title && <p className="text-danger mt-1">{errors.title.message}</p>}
                        </FormGroup>

                        <FormGroup>
                            <Label>Content</Label>
                            <Input
                                id='content'
                                name='content'
                                type="textarea"
                                rows="7"
                                placeholder="Enter content"
                                value={storyData?.content || ''}
                                onChange={handleInputChange}
                                innerRef={register({ required: "Content is required" })}
                            />
                            {errors.content && <p className="text-danger mt-1">{errors.content.message}</p>}
                        </FormGroup>

                        <FormGroup>
                            <Label>Image</Label>
                            {imagePreview && (
                                <div className="mb-2">
                                    <img src={imagePreview} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                </div>
                            )}
                            <Input
                                type="file"
                                accept="image/*"
                                {...register('image')}
                                onChange={handleImageChange}
                            />
                            {errors.image && <p className="text-danger mt-1">{errors.image.message}</p>}
                        </FormGroup>

                        <Button.Ripple type="submit" color="primary" disabled={loading}>
                            {loading ? <Spinner color="white" size="sm" /> : 'Save Changes'}
                        </Button.Ripple>
                    </Form>
                </CardBody>
            </Card>
        </Col>
    )
}

export default OurStory
