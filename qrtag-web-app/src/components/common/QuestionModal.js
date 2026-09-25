import React, { useState, useEffect } from "react";
import {
    Box,
    Modal,
    Button,
    Typography,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    Checkbox,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Axios from "../../config/axios";
import { PulseLoader } from "react-spinners";
import { KeyboardBackspace } from "@mui/icons-material";
import LinearProgress from '@mui/material/LinearProgress';
import { Store, UpdateStore } from '../../StoreContext';
import { toast } from 'react-toastify';

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -38%)",
    width: 480,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    borderRadius: "10px",
    borderBottomLeftRadius: "0px",
    borderBottomRightRadius: "0px",
};

export default function QuestionModal({ open, setOpen }) {

    const { user } = Store();
    const updateStore = UpdateStore();

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [questionsList, setQuestionsList] = useState([]);
    const [questionsLength, setQuestionsLength] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [formState, setFormState] = useState({});
    const [isAnswerValid, setIsAnswerValid] = useState(false);
    const [progress, setProgress] = React.useState(0);

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
        const percentage = (currentQuestionIndex / questionsLength) * 100;
        const val = isNaN(Number(percentage)) ? 0 : Number(percentage)
        setProgress(val)
    }, [currentQuestionIndex]);

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
            case "checkbox":
                setIsAnswerValid(answer?.length > 0);
                break;
            default:
                setIsAnswerValid(false);
        }
    };

    const handleInputChange = (questionId, value) => {
        setFormState((prevState) => ({
            ...prevState,
            [questionId]: value,
        }));
    };

    const handleCheckboxChange = (questionId, optionValue) => {
        setFormState((prevState) => {
            const currentValues = prevState[questionId] || [];
            const newValues = currentValues.includes(optionValue)
                ? currentValues.filter((value) => value !== optionValue)
                : [...currentValues, optionValue];
            return {
                ...prevState,
                [questionId]: newValues,
            };
        });
    };

    const handleSubmit = () => {
        
        const submissionData = questionsList.map((question) => {
            const userAnswer = formState[question.id];

            if (question.question_type === "text") {
                return {
                    question: question.id,
                    text_answer: userAnswer || "",
                };
            } else {
                return {
                    question: question.id,
                    answer: Array.isArray(userAnswer) ? userAnswer : [userAnswer].filter(Boolean),
                };
            }
        });

        setLoading(true);
        Axios.post("/users/survey-response/", submissionData)
            .then((response) => {
                
                if (response && response.data && response.data.status === true) {
                    setOpen(false)
                    const temp = { ...user }

                    temp['is_survey_submitted'] = true;

                    localStorage.setItem('user', JSON.stringify(temp));
                    updateStore({ user: temp });
                    localStorage.setItem('userData', JSON.stringify(temp));

                    toast.success('Survey submitted successfully!');
                }
            })
            .catch((err) => {
                console.error("Error submitting form", err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const currentQuestion = questionsList[currentQuestionIndex];

    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            {fetching ? <Box sx={style}>
                <div className="text-center">
                    <Typography
                        sx={{ mb: 2, mt: 3 }}
                        variant="h6"
                    >
                        Loading Survey
                    </Typography>
                    <PulseLoader size={10} color="#000" />
                </div>
            </Box> : <>
                <Box sx={style}>
                    <div style={{ position: "relative", width: "100%" }}>
                        {/* Left Arrow Button */}
                        {currentQuestionIndex > 0 && (
                            <KeyboardBackspace
                                style={{
                                    position: "absolute",
                                    left: 0,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                    color: "#000",
                                    fontSize: "24px",
                                }}
                                onClick={() =>
                                    setCurrentQuestionIndex((prev) => prev - 1)
                                }
                            />
                        )}
                        {/* Close Button */}
                        <div
                            style={{
                                position: "absolute",
                                right: "-5%",
                                marginTop: "-5%",
                                border: "2px solid #000",
                                borderRadius: "50%",
                                padding: "3px",
                                backgroundColor: "#fff",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            onClick={() => setOpen(false)}
                        >
                            <CloseIcon />
                        </div>
                    </div>

                    {currentQuestion && (
                        <FormControl fullWidth>
                            <Typography
                                sx={{ mb: 3, fontWeight: "bold", mt: 5 }}
                                variant="h6"
                            >
                                {currentQuestion.question}
                            </Typography>

                            {currentQuestion.question_type === "text" && (
                                <input
                                    type="text"
                                    placeholder="Enter Answer"
                                    value={formState[currentQuestion.id] || ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            currentQuestion.id,
                                            e.target.value
                                        )
                                    }
                                    className="LogIn_InputEmail"
                                    style={{ background: "#f5f5f5" }}
                                />
                            )}

                            {currentQuestion.question_type === "radio" && (
                                <RadioGroup
                                    value={formState[currentQuestion.id] || ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            currentQuestion.id,
                                            e.target.value
                                        )
                                    }
                                >
                                    {currentQuestion.options.map((option, index) => (
                                        <FormControlLabel
                                            key={index}
                                            value={option.id}
                                            control={<Radio
                                                sx={{
                                                    color: '#0a3f74',
                                                    '&.Mui-checked': {
                                                        color: '#0a3f74',
                                                    },
                                                }}
                                            />}
                                            label={option.option}
                                            style={{
                                                border: "1px solid #ccc",
                                                padding: "5px",
                                                borderRadius: "5px",
                                                marginBottom: "8px",
                                                background: "#f5f5f5",
                                                marginLeft: "0px",
                                                marginRight: "0px"
                                            }}
                                        />
                                    ))}
                                </RadioGroup>
                            )}

                            {currentQuestion.question_type === "checkbox" &&
                                currentQuestion.options.map((option, index) => (
                                    <FormControlLabel
                                        key={index}
                                        control={
                                            <Checkbox
                                                sx={{
                                                    color: '#0a3f74',
                                                    '&.Mui-checked': {
                                                        color: '#0a3f74',
                                                    },
                                                }}
                                                checked={(
                                                    formState[
                                                    currentQuestion.id
                                                    ] || []
                                                ).includes(option.id)}
                                                onChange={() =>
                                                    handleCheckboxChange(
                                                        currentQuestion.id,
                                                        option.id
                                                    )
                                                }
                                            />
                                        }
                                        label={option.option}
                                        style={{
                                            border: "1px solid #ccc",
                                            padding: "5px",
                                            borderRadius: "5px",
                                            marginBottom: "8px",
                                            background: "#f5f5f5",
                                            marginLeft: "0px",
                                            marginRight: "0px"
                                        }}
                                    />
                                ))}
                        </FormControl>
                    )}

                    <div
                        style={{
                            display: "none",
                            justifyContent: "flex-end",
                            marginTop: "5px",
                            marginBottom: "20px",
                            fontSize: "12px",
                            fontWeight: "bold",
                            color: "#0a3f74",
                        }}
                    >
                        Count {currentQuestionIndex + 1}/{questionsList.length}
                    </div>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            marginTop: "20px",
                        }}
                    >
                        {currentQuestionIndex < questionsList.length - 1 ? (

                            <Button
                                variant="contained"
                                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                                disabled={!isAnswerValid}
                                sx={{
                                    backgroundColor: "#0a3f74",
                                    borderRadius: '50px',
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
                                    backgroundColor: "#0a3f74",
                                    borderRadius: '50px',
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
                    <Box sx={{ width: '100%', position: "fixed", left: 0, bottom: 0, borderRadius: "100%" }}>
                        <LinearProgress variant="determinate" value={progress} />
                    </Box>
                </Box>
            </>}
        </Modal>
    );
}