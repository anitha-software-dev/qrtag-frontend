import React, { useEffect, useState } from 'react'
import { Row, Col, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ListGroup, ListGroupItem } from "reactstrap"
import { EditorState } from 'draft-js'
import { Editor } from "react-draft-wysiwyg"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import { Service } from '@src/services/Service'
import { OpenNotification, localTimeZoneDate } from '@src/views/components/Helper'
import Breadcrumbs from '@components/breadcrumbs'
import defaultAvatar from '@src/assets/images/avatars/avatar-blank.png'
import { FiCornerUpLeft } from 'react-icons/fi'
import { FaReply } from 'react-icons/fa'
import UILoader from '@components/ui-loader'
import Spinner from '@components/spinner/Loading-spinner'


const Feedbacks = () => {
    const [feedbacks, setFeedbacks] = useState([])
    const [visibleFeedbacks, setVisibleFeedbacks] = useState(10)
    const [selectedFeedback, setSelectedFeedback] = useState(null)
    const [editorState, setEditorState] = useState(EditorState.createEmpty())
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen)
    }

    const fetchFeedbacks = () => {
        setLoading(true)
        Service.get({
            url: '/admin/feedback/'
        })
            .then(response => {
                if (response.status === 'error') {
                    response.data.then(res => {
                        OpenNotification('error', 'Oops!', res.message)
                    })
                    return false
                } else {
                    setFeedbacks(response)
                }
            })
            .catch(err => {
                console.log(err)
                OpenNotification('error', 'Oops!', 'Something went wrong!')
            })
            .finally(() => {
                setLoading(false)
            })

    }

    useEffect(() => {
        fetchFeedbacks()
    }, [])


    const formatDate = (dateString) => {
        if (!dateString) return 'Invalid Date'

        const localDateStr = localTimeZoneDate(dateString)
        const localNowStr = localTimeZoneDate(new Date())

        const isToday = localDateStr === localNowStr

        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const localYesterdayStr = localTimeZoneDate(yesterday)

        const isYesterday = localDateStr === localYesterdayStr

        const formattedTime = new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }).format(new Date(dateString))

        if (isToday) {
            return `Today at ${formattedTime}`
        } else if (isYesterday) {
            return `Yesterday at ${formattedTime}`
        } else {
            return `${localDateStr} at ${formattedTime}`
        }
    }

    const handleFeedbackClick = (feedback) => {
        setSelectedFeedback(feedback)
        setEditorState(EditorState.createEmpty())
    }

    const handleSendReply = () => {

        const contentState = editorState.getCurrentContent()
        const message = contentState.getPlainText().trim()

        if (message === '') {
            OpenNotification('error', 'Error', 'Cannot send an empty message.')
            return
        }

        const payload = {
            subject: selectedFeedback.subject,
            message,
            feedback: selectedFeedback.id
        }

        Service.post({
            url: '/admin/feedback-reply/',
            body: JSON.stringify(payload)
        })
            .then(response => {
                if (response) {
                    OpenNotification('success', 'Reply Sent', 'Your reply has been sent successfully.')
                    setEditorState(EditorState.createEmpty())
                    setSelectedFeedback(null)
                    fetchFeedbacks()
                } else {
                    OpenNotification('error', 'Oops!', 'Failed to send reply.')
                }
            })
            .catch(err => {
                console.error(err)
                OpenNotification('error', 'Oops!', 'Something went wrong!')
            })
    }

    const loadMoreFeedbacks = () => {
        setVisibleFeedbacks(visibleFeedbacks + 10)
    }

    return (
        <>
            <Breadcrumbs breadCrumbParent='Feedbacks' breadCrumbActive='List' />

            <Card className="p-1 ">
                <strong className='py-1'>{feedbacks ? `${feedbacks.length} messages` : '0 messages'}</strong>
                <Row form className=' '>
                    <Col md="12">

                        <Card className="p-1" style={{ backgroundColor: '#ededed', height: '100vh', overflowY: 'auto' }}>
                            {loading ? (
                                <div className="d-flex justify-content-center align-items-center" style={{ height: "50%" }}>
                                    <Spinner />
                                </div>
                            ) : (
                                <ListGroup>
                                    {feedbacks.slice(0, visibleFeedbacks).map(item => (
                                        <ListGroupItem key={item.id} className="mb-1" onClick={() => handleFeedbackClick(item)} style={{ cursor: 'pointer' }}>
                                            <div className='d-flex align-items-center justify-content-between border-bottom '>
                                                <div className='d-flex justify-content-between'>
                                                    <img src={item.user.looser && item.user.looser.profile_picture ? item.user.looser.profile_picture : defaultAvatar} alt="" style={{ borderRadius: '50%', width: '50px', height: '50px' }} />
                                                    <div className='ml-1'>
                                                        <strong><p className='mb-0'>{item.user.name}</p></strong>
                                                        <p>{item.user.email}</p>
                                                    </div>
                                                </div>
                                                <div className="d-flex flex-column align-items-end">
                                                    <p className='mb-1'>{formatDate(item.created_at)}</p>
                                                </div>
                                            </div>

                                            <div className="d-flex justify-content-between align-items-center mt-1 mb-1">
                                                <p className='mb-0' style={{ flex: 1 }}>{item.message}</p>
                                                <span className="d-flex align-items-center text-primary" style={{ cursor: 'pointer', gap: '5px', fontWeight: '500' }} onClick={toggleModal}>
                                                    <FaReply size={14} /> Reply
                                                </span>
                                            </div>
                                        </ListGroupItem>
                                    ))}
                                </ListGroup>
                            )}
                        </Card>


                        {visibleFeedbacks < feedbacks.length && (
                            <div className='d-flex justify-content-center'>
                                <Button
                                    onClick={loadMoreFeedbacks}
                                    outline
                                >
                                    Load More
                                </Button>
                            </div>
                        )}

                    </Col>

                    <Modal isOpen={isModalOpen} toggle={toggleModal} size="lg">
                        <ModalHeader toggle={toggleModal}>Feedback Details</ModalHeader>
                        <ModalBody>
                            {selectedFeedback && (
                                <>
                                    <Card style={{ backgroundColor: '#ededed' }}>
                                        <CardBody style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 150px)' }}>
                                            <div>
                                                <div className='d-flex'>
                                                    <strong><p>From:</p></strong>
                                                    <p className='ml-1'>{selectedFeedback.user.email}</p>
                                                </div>
                                                <div className='d-flex'>
                                                    <strong><p>Subject:</p></strong>
                                                    <p className='ml-1'>{selectedFeedback.subject}</p>
                                                </div>
                                                <strong><p>Message:</p></strong>
                                                <div dangerouslySetInnerHTML={{ __html: selectedFeedback.message }}></div>
                                            </div>

                                            <div className='mt-1'>
                                                <strong><p>Response</p></strong>
                                                <Editor
                                                    toolbarClassName="toolbar-class"
                                                    wrapperClassName="wrapper-class"
                                                    editorClassName="editor-class form-control border pb-5"
                                                    placeholder='Type your response here...'
                                                    editorState={editorState}
                                                    onEditorStateChange={setEditorState}
                                                    toolbar={{
                                                        textAlign: { inDropdown: true },
                                                        link: { inDropdown: true },
                                                        history: { inDropdown: true }
                                                    }}
                                                />
                                            </div>

                                            <div className='my-2 d-flex align-items-center justify-content-end'>
                                                <Button
                                                    color="white mx-2"
                                                    style={{ border: 'none', backgroundColor: '#fff' }}
                                                    onClick={() => setEditorState(EditorState.createEmpty())}
                                                >
                                                    Clear
                                                </Button>
                                                <Button onClick={handleSendReply}
                                                    style={{
                                                        background: 'linear-gradient(118deg, #4A32EF, #4A32EF)',
                                                        border: 'none'
                                                    }}>
                                                    Send
                                                </Button>
                                            </div>
                                        </CardBody>
                                    </Card>

                                    {selectedFeedback.replies.length > 0 && (
                                        <Card className="my-1" style={{ backgroundColor: '#ededed' }}>
                                            <CardBody>
                                                <strong><p className='text-dark'>Replies:</p></strong>
                                                <strong><p className='text-dark'>{selectedFeedback.user.name}</p></strong>
                                                <p className='text-dark'>{selectedFeedback.user.email}</p>

                                                {selectedFeedback.replies.map((item, index) => (
                                                    <div key={index} className='d-flex justify-content-between'>
                                                        <div dangerouslySetInnerHTML={{ __html: item.message }}></div>
                                                        <p>{formatDate(item.created_at)}</p>
                                                    </div>
                                                ))}
                                            </CardBody>
                                        </Card>
                                    )}
                                </>
                            )}
                        </ModalBody>
                    </Modal>
                </Row >
            </Card>

        </>
    )
}

export default Feedbacks
