import React, { useState, useEffect } from "react";
import Navbar from '../common/Navbar';
import Footer from '../common/Footer'
import {
    Box,
    Button,
    Typography,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    Checkbox,
} from "@mui/material";
import { PulseLoader } from "react-spinners";
import { Store, UpdateStore } from '../../StoreContext';
import { toast } from 'react-toastify';
import Rating from '@mui/material/Rating';
import Axios from "../../config/axios";
import { useNavigate } from "react-router-dom";
import RateAppModal from '../../components/common/RateAppModal'
import { SubmitSurvey } from "../../services/user";
import Breadcrumbs from '../common/Breadcrumbs'

export default function SurveyForm({ open, setOpen }) {

    const { user } = Store();
    const updateStore = UpdateStore();
    const nav = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [questionsList, setQuestionsList] = useState([]);
    const [questionsLength, setQuestionsLength] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [formState, setFormState] = useState({});
    const [isAnswerValid, setIsAnswerValid] = useState(false);
    const [wordCounts, setWordCounts] = useState({});
    const [showRateAppModal, setShowRateAppModal] = useState(false)

    useEffect(() => {
        if (showRateAppModal) {
            setShowRateAppModal(true)
        }
    }, [showRateAppModal])

    const getQuestionList = () => {
        setFetching(true)
        Axios.get(`/common/question/`)
            .then((response) => {
                setFetching(false)
                if (response.status === 200) {
                    setQuestionsList(response.data);
                    setQuestionsLength(response.data.length)
                }
            })
            .catch((err) => {
                setFetching(false)
                console.error("Error fetching questions", err);
            });
    }

    useEffect(() => {
        getQuestionList()
    }, []);


    useEffect(() => {
        validateAnswer();
    }, [formState, currentQuestionIndex]);

    const validateAnswer = () => {
        const currentQuestion = questionsList[currentQuestionIndex];
        if (!currentQuestion) return;

        const answer = formState[currentQuestion.id];

        switch (currentQuestion.question_type) {
            case "text":
                setIsAnswerValid(answer?.trim().length > 0);
                break;
            case "radio":
                setIsAnswerValid(!!answer);
                break;
            case "ratings":
                setIsAnswerValid(!!answer);
                break;
            case "checkbox":
                setIsAnswerValid(answer?.length > 0);
                break;
            default:
                setIsAnswerValid(false);
        }
    };

    const handleInputChange = (id, value) => {
        const textValue = typeof value === "string" ? value : value ?? ""
        setFormState(prev => ({ ...prev, [id]: textValue }))

        if (typeof textValue === "string") {
            setWordCounts(prev => ({
                ...prev,
                [id]: (textValue.trim().match(/\b\w+\b/g) || []).length
            }))
        }
    }

    const validateWordCount = (text, limit) => {
        const textValue = typeof text === "string" ? text.trim() : ""
        const wordCount = (textValue.match(/\b\w+\b/g) || []).length
        return wordCount >= limit
    }

    const handleCheckboxChange = (questionName, optionValue) => {
        setFormState((prevState) => {
            const currentValues = prevState[questionName] || [];
            const newValues = currentValues.includes(optionValue)
                ? currentValues.filter((value) => value !== optionValue)
                : [...currentValues, optionValue];
            return {
                ...prevState,
                [questionName]: newValues,
            };
        });
    };

    const handleNext = () => {
        const currentQuestion = questionsList[currentQuestionIndex]

        const userAnswer = formState[currentQuestion.id] || ''
        const additionalAnswer = formState[`${currentQuestion.id}_aq`] || ''
        const wordLimit = currentQuestion.answer_word_limit

        if (currentQuestion?.question_type === "text" && userAnswer.trim().length === 0) {
            toast.error("Please enter an answer for the question.")
            return
        }

        if (currentQuestion?.question_type === "text" && wordLimit && !validateWordCount(userAnswer.trim(), wordLimit)) {
            toast.error(`Please make sure the answer has a minimum of ${wordLimit} words.`)
            return
        }

        if (currentQuestion?.additional_question && additionalAnswer.trim().length === 0) {
            toast.error("Please enter an answer for the additional question.")
            return
        }

        if (currentQuestion?.additional_question && wordLimit && !validateWordCount(additionalAnswer, wordLimit)) {
            toast.error(`Oops! It looks like your answer to the additional question is too short. Please make sure the answer has a minimum of ${wordLimit} words.`)
            return
        }

        setCurrentQuestionIndex((prev) => prev + 1)
    }

    const handleSubmit = () => {

        if (loading) {
            return;
        }

        const submissionData = questionsList.map((question) => {
            const userAnswer = formState[question.id];
            const aqAnswer = formState[`${question.id}_aq`];
            if (question.question_type === "text" || question.question_type === "ratings") {
                return {
                    question: question.id,
                    text_answer: userAnswer || "",
                    aq_answer: aqAnswer || ""
                };
            } else {
                return {
                    question: question.id,
                    answer: Array.isArray(userAnswer) ? userAnswer : [userAnswer].filter(Boolean),
                    aq_answer: aqAnswer || ""
                };
            }
        });

        // console.log("Submitting Data:", submissionData);

        setLoading(true);

        Axios.post("/users/survey-response/", submissionData).then((response) => {
            setLoading(false);
            if (response?.data?.status === true) {
                const temp = { ...user };
                temp['is_survey_submitted'] = true;

                localStorage.setItem('user', JSON.stringify(temp));
                updateStore({ user: temp });
                localStorage.setItem('userData', JSON.stringify(temp));

                setShowRateAppModal(true)
            }
        }).catch((err) => {
            console.error("Error submitting form", err);

            if (err.response?.data?.detail) {
                toast.error(err.response.data.detail);
            } else if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error("Failed to submit survey. Please try again.");
            }
        })
            .finally(() => {
                setLoading(false);
            });

    };

    // const currentQuestion = questionsList[currentQuestionIndex];

    return (
        <>
            <Navbar />

            <Breadcrumbs breadCrumbParent='Dashboard' breadCrumbActive='Survey Form' />

            <div className='section-background' style={{ minHeight: '100vh' }}>
                <div className='container py-5'>

                    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{
                        padding: '2%', borderBottom: '1px solid #E2E8F0', flexDirection: { xs: 'column', lg: 'row' }, gap: { xs: 2, lg: 0 },
                    }}>
                        <Typography variant="h6" sx={{
                            fontWeight: 600,
                            color: '#1e5af9',
                            whiteSpace: 'nowrap',
                            fontSize: 21
                        }}>
                            Survey Form
                        </Typography>

                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#d0d8ef',
                                borderRadius: '999px',
                                padding: '4px',
                                position: 'relative',
                                width: '100%',
                                maxWidth: '120px',
                                height: '42px',
                                cursor: 'pointer'
                            }}
                        >
                            Step {currentQuestionIndex + 1}/{questionsList.length}
                        </Box>
                    </Box>

                    <Box className="box-survey-form" style={{ textAlign: "left", padding: "20px" }}>
                        {fetching ? (
                            <div className="text-center py-5" style={{ background: "#FFF" }}>
                                <Typography sx={{ mb: 2, mt: 3 }} variant="h6">
                                    Loading Survey
                                </Typography>
                                <PulseLoader size={10} color="#000" />
                            </div>
                        ) : (
                            <Box className="box-survey-form" sx={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "center" }}>

                                {questionsList.length > 0 && (
                                    <FormControl fullWidth sx={{ width: "100%", marginInline: "10%", padding: "20px", border: "1px solid #ddd", borderRadius: "10px", backgroundColor: "#f9f9f9" }}>
                                        <Typography sx={{ mb: 3 }} variant="h6">
                                            {questionsList[currentQuestionIndex].question}
                                        </Typography>

                                        {questionsList[currentQuestionIndex].question_type === "text" && (
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Enter Answer"
                                                    value={formState[questionsList[currentQuestionIndex].id] || ""}
                                                    onChange={(e) => handleInputChange(questionsList[currentQuestionIndex].id, e.target.value)}
                                                    className="LogIn_InputEmail"
                                                    style={{ background: "#f5f5f5", width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
                                                />
                                                {questionsList[currentQuestionIndex].answer_word_limit != null && questionsList[currentQuestionIndex].answer_word_limit > 0 && (
                                                    <Typography sx={{ mt: 1, fontSize: "14px", color: "black" }}>
                                                        <strong>Word count: </strong>
                                                        <span style={{ color: wordCounts[questionsList[currentQuestionIndex].id] >= questionsList[currentQuestionIndex].answer_word_limit ? "green" : "red" }}>
                                                            {wordCounts[questionsList[currentQuestionIndex].id] || 0}
                                                        </span>
                                                        &nbsp;words (Minimum {questionsList[currentQuestionIndex].answer_word_limit} required)
                                                    </Typography>
                                                )}


                                            </div>
                                        )}

                                        {questionsList[currentQuestionIndex].question_type === "ratings" && (

                                            <Rating
                                                style={{ display: "flex", justifyContent: "left" }}
                                                name={questionsList[currentQuestionIndex].id.toString()}
                                                value={formState[questionsList[currentQuestionIndex].id] ?? null}
                                                onChange={(event, newValue) => handleInputChange(questionsList[currentQuestionIndex].id, newValue)}
                                                precision={1}
                                                size="large"
                                            />

                                        )}

                                        {questionsList[currentQuestionIndex].question_type === "radio" && (
                                            <RadioGroup
                                                value={formState[questionsList[currentQuestionIndex].id] || ""}
                                                onChange={(e) => handleInputChange(questionsList[currentQuestionIndex].id, e.target.value)}
                                            >
                                                {questionsList[currentQuestionIndex].options.map((option, idx) => (
                                                    <FormControlLabel
                                                        key={idx}
                                                        value={option.id}
                                                        control={<Radio sx={{ color: '#1e5af9', '&.Mui-checked': { color: '#1e5af9' } }} />}
                                                        label={option.option}
                                                    />
                                                ))}
                                            </RadioGroup>
                                        )}

                                        {questionsList[currentQuestionIndex].question_type === "checkbox" && (
                                            <div>
                                                {questionsList[currentQuestionIndex].options.map((option, idx) => (
                                                    <FormControlLabel
                                                        key={idx}
                                                        control={
                                                            <Checkbox
                                                                onChange={() => handleCheckboxChange(questionsList[currentQuestionIndex].id, option.id)}
                                                                checked={formState[questionsList[currentQuestionIndex].id]?.includes(option.id) || false}
                                                            />
                                                        }
                                                        label={option.option}
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        {questionsList[currentQuestionIndex].additional_question && (
                                            <div>
                                                <Typography sx={{ mb: 1, mt: 3 }} style={{ fontSize: '1rem' }} variant="h6">
                                                    {questionsList[currentQuestionIndex].additional_question}
                                                </Typography>
                                                <textarea
                                                    style={{ width: "100%", background: "#f5f5f5", border: "1px solid #ccc", padding: "8px", borderRadius: "5px", resize: 'none' }}
                                                    value={formState[`${questionsList[currentQuestionIndex].id}_aq`] || ""}
                                                    onChange={(e) => handleInputChange(`${questionsList[currentQuestionIndex].id}_aq`, e.target.value)}
                                                    rows={4}
                                                />

                                                {questionsList[currentQuestionIndex].answer_word_limit != null &&
                                                    questionsList[currentQuestionIndex].answer_word_limit > 0 && (
                                                        <Typography sx={{ mt: 1, fontSize: "14px", color: "black" }}>
                                                            <strong>Word count: </strong>
                                                            <span style={{ color: wordCounts[`${questionsList[currentQuestionIndex].id}_aq`] >= questionsList[currentQuestionIndex].answer_word_limit ? "green" : "red" }}>
                                                                {wordCounts[`${questionsList[currentQuestionIndex].id}_aq`] || 0}
                                                            </span>
                                                            &nbsp;words (Minimum {questionsList[currentQuestionIndex].answer_word_limit} required)
                                                        </Typography>
                                                    )}
                                            </div>
                                        )}
                                    </FormControl>
                                )}
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginTop: "20px",
                                        width: "100%",
                                        paddingBottom: "10%"
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                                        disabled={currentQuestionIndex === 0}
                                        sx={{
                                            backgroundColor: currentQuestionIndex === 0 ? "#ccc" : "#fff",
                                            border: currentQuestionIndex === 0 ? "1px solid #ccc" : "1px solid #1e5af9",
                                            borderRadius: "50px",
                                            padding: "10px 45px",
                                            color: "#1e5af9",
                                            "&:hover": {
                                                backgroundColor: currentQuestionIndex === 0 ? "#ccc" : "#073052",
                                                color: "#fff"
                                            },
                                            "&.Mui-disabled": {
                                                backgroundColor: "rgba(10, 63, 116, 0.4)",
                                                color: "#fff",
                                            },
                                        }}
                                    >
                                        Previous
                                    </Button>

                                    {currentQuestionIndex < questionsList.length - 1 ? (
                                        <Button
                                            variant="contained"
                                            onClick={handleNext}
                                            // onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                                            disabled={!isAnswerValid}
                                            sx={{
                                                backgroundColor: "#1e5af9",
                                                borderRadius: "50px",
                                                padding: "10px 45px",
                                                color: "#fff",
                                                "&:hover": {
                                                    backgroundColor: "#073052",
                                                },
                                                "&.Mui-disabled": {
                                                    backgroundColor: "rgba(10, 63, 116, 0.4)",
                                                    color: "#fff",
                                                },
                                            }}
                                        >
                                            Next
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleSubmit}
                                            disabled={loading || !isAnswerValid}
                                            sx={{
                                                backgroundColor: "#1e5af9",
                                                borderRadius: "50px",
                                                padding: "10px 45px",
                                                color: "#fff",
                                                "&:hover": {
                                                    backgroundColor: "#073052",
                                                },
                                                "&.Mui-disabled": {
                                                    backgroundColor: "rgba(10, 63, 116, 0.4)",
                                                    color: "#fff",
                                                },
                                            }}
                                        >
                                            {!loading ? "Submit" : <PulseLoader size={10} color="#fff" />}
                                        </Button>
                                    )}
                                </div>
                            </Box>
                        )}
                    </Box>
                </div>
            </div>

            <Footer />

            {(showRateAppModal) && <>
                <RateAppModal
                    open={showRateAppModal}
                    setOpen={setShowRateAppModal}
                />
            </>}
        </>
    );
}