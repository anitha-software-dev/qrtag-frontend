import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Container, Row, Col, Card, CardBody, CardHeader, Spinner } from 'reactstrap'
import { OpenNotification } from '@src/views/components/Helper'
import { Service } from '@src/services/Service'
import { FaStar } from 'react-icons/fa'

const SurveyUserView = () => {
    const { id } = useParams()
    const [userInfo, setUserInfo] = useState(null)
    const [loading, setLoading] = useState(true)
    const [surveyDetails, setSurveyDetails] = useState([])

    const getSurveyUserDetails = () => {
        setLoading(true)

        Service.get({
            url: `/admin/survey-response/?user_id=${id}`
        })
            .then(response => {
                setLoading(false)

                if (response.status === 'error') {
                    response.data.then(res => {
                        OpenNotification('error', 'Oops!', res.message)
                    })
                    return
                }

                const userData = response?.user_obj || null
                setUserInfo(userData)
                // console.log("user details:", userData)

                if (response.data.length > 0) {
                    setSurveyDetails(response.data)
                    // console.log("survey details:", response)
                }

            })
            .catch(error => {
                setLoading(false)
                console.error('Error fetching user data:', error)
            })
    }
    useEffect(() => {
        if (id) {
            getSurveyUserDetails()
        }
    }, [id])


    const getAnswer = (survey) => {
        const { question_obj } = survey
        if (!question_obj) return "N/A"

        if (question_obj.question_type === "ratings") {
            const stars = parseInt(question_obj.text_answer) || 0
            return (
                <div>
                    {[...Array(stars)].map((_, index) => (
                        <FaStar key={index} color="gold" />
                    ))}
                </div>
            )
        } else if (question_obj.question_type === "text") {
            return question_obj.text_answer || "N/A"
        } else if (question_obj.question_type === "radio") {
            return question_obj.answer_obj?.option || "N/A"
        } else if (question_obj.question_type === "checkbox") {
            return (
                <div>
                    {question_obj.answer_obj?.options?.length > 0 ? (
                        question_obj.answer_obj.options.map((option, index) => (
                            <div key={index}>✅ {option}</div>
                        ))
                    ) : (
                        "N/A"
                    )}
                </div>
            )
        }
        return "N/A"
    }


    return (
        <Container className="mt-4">
            <Row>
                {(loading) ? <>
                    <Col md="12" className="mb-2">
                        <Card>
                            <CardBody className="text-center py-4">
                                <Spinner size="md" />
                            </CardBody>
                        </Card>
                    </Col>
                </> : <>
                    <Col md="12" className="mb-2">
                        <Card>
                            <CardHeader>
                                <h4>User Details</h4>
                            </CardHeader>
                            <CardBody>
                                {userInfo ? (
                                    <Row>
                                        <Col md="4" className="mb-1">
                                            <strong>Name:</strong> <dd>{userInfo.name || '-'}</dd>
                                        </Col>
                                        <Col md="4" className="mb-1">
                                            <strong>Email:</strong> <dd>{userInfo.email || '-'}</dd>
                                        </Col>
                                        <Col md="4" className="mb-1">
                                            <strong>Contact:</strong> <dd>{userInfo.phone_number || '-'}</dd>
                                        </Col>
                                    </Row>
                                ) : (
                                    <p className="text-center "><strong>User not found!</strong></p>
                                )}
                            </CardBody>
                        </Card>
                    </Col>

                    <Col md="12">
                        <Card>
                            <CardHeader>
                                <h4 className="mb-0">Survey Details</h4>
                            </CardHeader>
                            <CardBody>
                                {surveyDetails.length > 0 ? (
                                    surveyDetails.map((survey, index) => (
                                        <Col md="12" key={index} className="mb-1">
                                            <Card style={{ backgroundColor: "#f5f7fa", borderLeft: "4px solid #007bff" }}>
                                                <CardBody>
                                                    <Row>
                                                        <Col md="12" className="mb-1">
                                                            <strong>Question:</strong>
                                                            <dd>{survey?.question_obj?.question || "N/A"}</dd>
                                                        </Col>

                                                        <Col md="12" className="mb-1">
                                                            <strong>Answer:</strong>
                                                            <dd>{getAnswer(survey)}</dd>
                                                        </Col>
                                                        {survey?.question_obj?.additional_question && (
                                                            <Col md="12" className="mb-1">
                                                                <strong>Additional Question:</strong>
                                                                <dd>{survey?.question_obj?.additional_question}</dd>
                                                            </Col>
                                                        )}
                                                        {survey?.question_obj?.aq_answer && (
                                                            <Col md="12" className="mb-1">
                                                                <strong>Additional Question Answer:</strong>
                                                                <dd>{survey?.question_obj?.aq_answer}</dd>
                                                            </Col>
                                                        )}

                                                    </Row>
                                                </CardBody>
                                            </Card>
                                        </Col>
                                    ))
                                ) : (
                                    <p>No survey details available!</p>
                                )}
                            </CardBody>
                        </Card>
                    </Col>
                </>}
            </Row>
        </Container>
    )
}

export default SurveyUserView
