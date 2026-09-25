import { Fragment, useEffect, useState } from 'react'
import { Row, Col, CardHeader, CardBody, Form, FormGroup, Label, Input, Card, Button, Spinner, Breadcrumb, BreadcrumbItem, CustomInput } from 'reactstrap'
import Breadcrumbs from '@components/breadcrumbs'
import { Service } from '@src/services/Service'
import '@styles/react/pages/page-account-settings.scss'
import { Controller, useForm } from 'react-hook-form'
import { OpenNotification } from '../../../components/Helper'
import { Plus, Trash, Trash2 } from 'react-feather'
import ItemTypes from '../../itemTypes/list'
import Relations from '../../relations/list'
import SubscriptionContent from '../subscriptionContent'
import SurveyForm from '../surveyForm'
import ManageSurvey from '../manageSurvey'
import OurStory from '../ourStory'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, ContentState, convertToRaw, convertFromHTML } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import '@styles/react/libs/editor/editor.scss'

const Configurations = () => {

    const [honoraryMessage, setHonoraryMessage] = useState({ id: null, value: '' })
    const [flyerMessage, setFlyerMessage] = useState({ id: null, value: '' })
    const [downloadMessage, setDownloadMessage] = useState({ id: null, value: '' })
    const [premiumMessage, setPremiumMessage] = useState({ id: null, value: '' })
    const [waitingPeriod, setWaitingPeriod] = useState({ id: null, value: '' })
    const [widgetExpiry, setWidgetExpiry] = useState({ id: null, value: '' })
    const [enableHonoraryAccess, setEnableHonoraryAccess] = useState({ id: null, value: '' })
    const [trialExpires, setTrialExpires] = useState({ id: null, value: '' })
    const [appUpdates, setAppUpdates] = useState({ id: null, value: '' })
    const [whatsNew, setWhatsNew] = useState({ id: null, value: '' })
    const [honoraryAccess, setHonoraryAccess] = useState({ id: null, value: '' })
    const [ApplyHonoraryAccess, setApplyHonoraryAccess] = useState({ id: null, value: '' })
    const [accountReactivation, setAccountReactivation] = useState({ id: null, value: '' })
    const [subscriptionVisibility, setSubscriptionVisibility] = useState({ id: null, value: '' })
    const [loadingType, setLoadingType] = useState('')
    const [tutorialContent, setTutorialContent] = useState({ id: null, value: [{ title: 'Title 1', content: 'lorem ipsum' }] })
    const [widgetMessage, setWidgetMessage] = useState({ id: null, value: '' })
    const [widgetSteps, setWidgetSteps] = useState({ id: null, value: '' })
    const [itemFieldsVisibilityMessage, setItemFieldsVisibilityMessage] = useState({ id: null, value: '' })
    const [forgotPasswordHeadingMessage, setForgotPasswordHeadingMessage] = useState({ id: null, value: '' })
    const [resetPasswordHeadingMessage, setResetPasswordHeadingMessage] = useState({ id: null, value: '' })
    const [verificationHeadingMessage, setVerificationHeadingMessage] = useState({ id: null, value: '' })
    const [otpExpirationTime, setOtpExpirationTime] = useState({ id: null, value: '' })
    const [otpResendTime, setOtpResendTime] = useState({ id: null, value: '' })
    const [extentTrailSurveyMessage, setExtentTrailSurveyMessage] = useState({ id: null, value: '' })
    const [didntReceiveTokenMessage, setDidntReceiveTokenMessage] = useState({ id: null, value: '' })
    const [surveyUnlockedSubscriptionMessage, setSurveyUnlockedSubscriptionMessage] = useState({ id: null, value: '' })
    const [notSecuredMessage, setNotSecuredMessage] = useState({ id: null, value: '' })
    const [notSecuredCTAMessage, setNotSecuredCTAMessage] = useState({ id: null, value: '' })
    const [welcomeFreeTrialMessage, setWelcomeFreeTrialMessage] = useState({ id: null, value: '' })
    const [instructionAddItem, setInstructionAddItem] = useState({ id: null, value: '' })
    const [lapCharges, setLapCharges] = useState({ id: null, value: '' })
    const [reminderMonthlySubscription, setReminderMonthlySubscription] = useState({ id: null, value: '' })
    const [reminderYearlySubscription, setReminderYearlySubscription] = useState({ id: null, value: '' })

    // Separate useForm hooks for each form to handle independent validation
    const { register: registerHonorary, errors: errorsHonorary, handleSubmit: handleSubmitHonorary } = useForm()
    const { register: registerHonoraryAccess, errors: errorsHonoraryAccess, handleSubmit: handleSubmitHonoraryAccess } = useForm()
    const { register: registerApplyHonoraryAccess, errors: errorsApplyHonoraryAccess, handleSubmit: handleSubmitApplyHonoraryAccess } = useForm()
    const { register: registerAccountReactivation, errors: errorsAccountReactivation, handleSubmit: handleSubmitAccountReactivation } = useForm()
    const { register: registerFlyer, errors: errorsFlyer, handleSubmit: handleSubmitFlyer } = useForm()
    const { register: registerDownload, errors: errorsDownload, handleSubmit: handleSubmitDownload } = useForm()
    const { register: registerPremium, errors: errorsPremium, handleSubmit: handleSubmitPremium } = useForm()
    const { register: registerWhatsNew, errors: errorsWhatsNew, handleSubmit: handleSubmitWhatsNew } = useForm()
    const { register: registerAppUpdates, errors: errorsAppUpdates, handleSubmit: handleSubmitAppUpdates } = useForm()
    const { register: registerWaitingPeriod, errors: errorsWaitingPeriod, handleSubmit: handleSubmitWaitingPeriod } = useForm()
    const { register: registerWidgetExpiry, errors: errorsWidgetExpiry, handleSubmit: handleSubmitWidgetExpiry } = useForm()
    const { register: registerSubscriptionVisibility, errors: errorsSubscriptionVisibility, handleSubmit: handleSubmitSubscriptionVisibility } = useForm()
    const { register: registerEnableHonoraryAccess, errors: errorsEnableHonoraryAccess, handleSubmit: handleSubmitEnableHonoraryAccess } = useForm()
    const { register: registerTrialExpires, errors: errorsTrialExpires, handleSubmit: handleSubmitTrialExpires } = useForm()
    const { register: registerWidgetMessage, errors: errorsWidgetMessage, handleSubmit: handleSubmitWidgetMessage } = useForm()
    const { register: registerTutorial, errors: errorsTutorial, handleSubmit: handleSubmitTutorial, control: controlTutorial, setError: setErrorTutorial } = useForm()
    const { register: registerWidgetSteps, errors: errorsWidgetSteps, handleSubmit: handleSubmitWidgetSteps, control: controlWidgetSteps, setError: setErrorWidgetSteps } = useForm()
    const { register: registerItemFieldsVisibilityMessage, errors: errorsItemFieldsVisibilityMessage, handleSubmit: handleSubmitItemFieldsVisibilityMessage } = useForm()
    const { register: registerForgotPasswordHeading, errors: errorsForgotPasswordHeading, handleSubmit: handleSubmitForgotPasswordHeading } = useForm()
    const { register: registerResetPasswordHeading, errors: errorsResetPasswordHeading, handleSubmit: handleSubmitResetPasswordHeading } = useForm()
    const { register: registerOtpExpirationTime, errors: errorsOtpExpirationTime, handleSubmit: handleOtpExpirationTime } = useForm()
    const { register: registerOtpResendTime, errors: errorsOtpResendTime, handleSubmit: handleOtpResendTime } = useForm()
    const { register: registerExtentTrailWithSurvey, errors: errorsExtentTrailWithSurvey, handleSubmit: handleExtentTrailWithSurvey } = useForm()
    const { register: registerVerificationHeading, errors: errorsVerificationHeading, handleSubmit: handleSubmitVerificationHeading } = useForm()
    const { register: registerDidntReceiveToken, errors: errorsDidntReceiveToken, handleSubmit: handleSubmitDidntReceiveToken } = useForm()
    const { register: registerSurveyUnlockedSubscription, errors: errorsSurveyUnlockedSubscription, handleSubmit: handleSubmitSurveyUnlockedSubscription } = useForm()
    const { register: registerNotSecuredCTAMessage, errors: errorsNotSecuredCTAMessage, handleSubmit: handleNotSecuredCTAMessage } = useForm()
    const { register: registerNotSecuredMessage, errors: errorsNotSecuredMessage, handleSubmit: handleNotSecuredMessage } = useForm()
    const { register: registerWelcomeFreeTrialMessage, errors: errorsWelcomeFreeTrialMessage, handleSubmit: handleWelcomeFreeTrialMessage } = useForm()
    const { register: registerInstructionAddItem, errors: errorsInstructionsAddItem, handleSubmit: handleSubmitInstructionsAddItem } = useForm()
    const { register: registerLapCharges, errors: errorsLapCharges, handleSubmit: handleSubmitLapCharges } = useForm()
    const { register: registerReminderMonthlySubscription, errors: errorsReminderMonthlySubscription, handleSubmit: handleSubmitReminderMonthlySubscription } = useForm()
    const { register: registerReminderYearlySubscription, errors: errorsReminderYearlySubscription, handleSubmit: handleSubmitReminderYearlySubscription } = useForm()

    const getMessage = () => {
        Service.get({
            url: `/common/configuration/`
        }).then(response => {
            // console.log("response", response)

            const data = response
            if (data.length > 0) {
                data.forEach(item => {
                    switch (item.key) {
                        case 'honorary_message':
                            setHonoraryMessage({ id: item.id, value: item.value })
                            break
                        case 'flyer_message':
                            setFlyerMessage({ id: item.id, value: item.value })
                            break
                        case 'download_message':
                            setDownloadMessage({ id: item.id, value: item.value })
                            break
                        case 'unlock_premium_message':
                            setPremiumMessage({ id: item.id, value: item.value })
                            break
                        case 'app_update':
                            setAppUpdates({ id: item.id, value: item.value })
                            break
                        case 'whats_new':
                            setWhatsNew({ id: item.id, value: item.value })
                            break
                        case 'honorary_request_waiting_period':
                            setWaitingPeriod({ id: item.id, value: item.value })
                            break
                        case 'widget_expiry_notification':
                            setWidgetExpiry({ id: item.id, value: item.value })
                            break
                        case 'survey_form_count':
                            setTrialExpires({ id: item.id, value: item.value })
                            break
                        case 'honorary_access_feature_toggle':
                            setEnableHonoraryAccess({ id: item.id, value: item.value })
                            break
                        case 'subscriptions_visibility':
                            setSubscriptionVisibility({ id: item.id, value: item.value })
                            break
                        case 'request_review_message':
                            setHonoraryAccess({ id: item.id, value: item.value })
                            break
                        case 'honorary_access_apply_message':
                            setApplyHonoraryAccess({ id: item.id, value: item.value })
                            break
                        case 'account_reactivation_message':
                            setAccountReactivation({ id: item.id, value: item.value })
                            break
                        case 'widget_message':
                            setWidgetMessage({ id: item.id, value: item.value })
                            break
                        case 'steps_to_apply_widget':
                            setWidgetSteps({ id: item.id, value: EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(item.value))) })
                            break
                        case 'tutorial_content':
                            const parsedValue = JSON.parse(item.value)
                            setTutorialContent({ id: item.id, value: Array.isArray(parsedValue) ? parsedValue : [] })
                            break
                        case 'item_fields_visibility_message':
                            setItemFieldsVisibilityMessage({ id: item.id, value: item.value })
                            break
                        case 'forgot_password_heading_message':
                            setForgotPasswordHeadingMessage({ id: item.id, value: item.value })
                            break
                        case 'new_password_heading_message':
                            setResetPasswordHeadingMessage({ id: item.id, value: item.value })
                            break
                        case 'otp_expiration_time':
                            setOtpExpirationTime({ id: item.id, value: item.value })
                            break
                        case 'otp_resend_time':
                            setOtpResendTime({ id: item.id, value: item.value })
                            break
                        case 'extend_trial_with_survey_message':
                            setExtentTrailSurveyMessage({ id: item.id, value: item.value })
                            break
                        case 'verification_heading_message':
                            setVerificationHeadingMessage({ id: item.id, value: item.value })
                            break
                        case 'didnot_receive_token':
                            setDidntReceiveTokenMessage({ id: item.id, value: item.value })
                            break
                        case 'rate_app_message':
                            setSurveyUnlockedSubscriptionMessage({ id: item.id, value: item.value })
                            break
                        case 'not_secured_message':
                            setNotSecuredMessage({ id: item.id, value: item.value })
                            break
                        case 'not_secured_cta_message':
                            setNotSecuredCTAMessage({ id: item.id, value: item.value })
                            break
                        case 'trial_message':
                            setWelcomeFreeTrialMessage({ id: item.id, value: item.value })
                            break
                        case 'add_item_instruction':
                            setInstructionAddItem({ id: item.id, value: item.value })
                            break
                        case 'is_lap_charge_feature_active':
                            setLapCharges({ id: item.id, value: item.value })
                            break
                        case 'reminder_for_monthly_subscription':
                            setReminderMonthlySubscription({ id: item.id, value: item.value })
                            break
                        case 'reminder_for_yearly_subscription':
                            setReminderYearlySubscription({ id: item.id, value: item.value })
                            break
                        default:
                            break
                    }
                })
            }
        }).catch(err => {
            console.log('Error fetching messages', err)
        })
    }

    useEffect(() => {
        getMessage()
    }, [])

    const updateMessage = (param = {}) => {
        setLoadingType(param.type)
        const params = {
            value: param.message
        }
        Service.put({
            url: `/admin/configuration/${param.id}/`,
            body: JSON.stringify(params)
        })
            .then(response => {
                setLoadingType('')
                if (response && response.status === true) {
                    OpenNotification('success', 'Success!', `${param.alert} updated successfully.`)
                } else if (response && response.status === 'error') {
                    OpenNotification('error', 'Oops!', 'Failed to update detail!')
                } else {
                    OpenNotification('error', 'Oops!', 'Failed to update detail!')
                }
            })
            .catch(err => {
                setLoadingType('')
                console.error(err)
                OpenNotification('error', 'Oops!', 'Something went wrong!')
            })
    }

    const onSubmitHonorary = (data) => {
        updateMessage({ message: honoraryMessage.value, id: honoraryMessage.id, alert: 'Honorary message', type: 'Honorary' })
    }

    const onSubmitFlyer = (data) => {
        updateMessage({ message: flyerMessage.value, id: flyerMessage.id, alert: 'Flyer message', type: 'Flyer' })
    }

    const onSubmitDownload = (data) => {
        updateMessage({ message: downloadMessage.value, id: downloadMessage.id, alert: 'Download message', type: 'Download' })
    }

    const onSubmitPremium = (data) => {
        updateMessage({ message: premiumMessage.value, id: premiumMessage.id, alert: 'Unlock Premium message', type: 'Premium' })
    }

    const onSubmitWhatsNew = (data) => {
        updateMessage({ message: whatsNew.value, id: whatsNew.id, alert: "What's New message", type: 'whatsNew' })
    }

    const onSubmitAppUpdates = (data) => {
        updateMessage({ message: appUpdates.value, id: appUpdates.id, alert: "App updates", type: 'appUpdates' })
    }

    const onSubmitWaitingPeriod = (data) => {
        updateMessage({ message: waitingPeriod.value, id: waitingPeriod.id, alert: 'Honorary Request Waiting Period', type: 'Waiting Period' })
    }

    const onSubmitWidgetExpiry = (data) => {
        updateMessage({ message: widgetExpiry.value, id: widgetExpiry.id, alert: 'Widget Expiration Days', type: 'Widget Expiry' })
    }

    const onSubmitEnableHonoraryAccess = (data) => {
        updateMessage({ message: enableHonoraryAccess.value, id: enableHonoraryAccess.id, alert: 'Honorary access feature toggle', type: 'Enable Honorary Access' })
    }

    const onSubmitSubscriptionVisibility = (data) => {
        updateMessage({ message: subscriptionVisibility.value, id: subscriptionVisibility.id, alert: 'Subscription Visibility', type: 'Subscription Visibility' })
    }

    const onSubmitTrialExpires = (data) => {
        updateMessage({ message: trialExpires.value, id: trialExpires.id, alert: 'Survey Form Before the Trial Expires message', type: 'Trial Expires' })
    }

    const onSubmitHonoraryAccess = (data) => {
        updateMessage({ message: honoraryAccess.value, id: honoraryAccess.id, alert: 'Honorary Access Request message', type: 'Honorary Access' })
    }

    const onSubmitApplyHonoraryAccess = (data) => {
        updateMessage({ message: ApplyHonoraryAccess.value, id: ApplyHonoraryAccess.id, alert: 'Apply Honorary Access message', type: 'Apply Honorary Access' })
    }

    const onSubmitAccountReactivation = (data) => {
        updateMessage({ message: accountReactivation.value, id: accountReactivation.id, alert: 'Account Reactivation message', type: 'Account Reactivation' })
    }

    const onSubmitwidgetMessage = (data) => {
        updateMessage({ message: widgetMessage.value, id: widgetMessage.id, alert: 'Widget Message', type: 'Widget Message' })
    }

    const onSubmitWidgetSteps = (data) => {
        updateMessage({ message: draftToHtml(convertToRaw(widgetSteps.value.getCurrentContent())), id: widgetSteps.id, alert: 'Widget Steps', type: 'Widget Steps' })
    }

    const onSubmitItemFieldsVisibilityMessage = (data) => {
        updateMessage({ message: itemFieldsVisibilityMessage.value, id: itemFieldsVisibilityMessage.id, alert: 'Item Fields Visibility Message', type: 'Item Fields Visibility Message' })
    }

    const onSubmitForgotPasswordHeadingMessage = (data) => {
        updateMessage({ message: forgotPasswordHeadingMessage.value, id: forgotPasswordHeadingMessage.id, alert: 'Forgot Password Heading Message', type: 'Forgot Password Heading  Message' })
    }

    const onSubmitResetPasswordHeadingMessage = (data) => {
        updateMessage({ message: resetPasswordHeadingMessage.value, id: resetPasswordHeadingMessage.id, alert: 'Reset Password Heading Message', type: 'Reset Password Heading Message' })
    }

    const onSubmitOtpExpirationTime = (data) => {
        updateMessage({ message: otpExpirationTime.value, id: otpExpirationTime.id, alert: 'OTP Expiration Time', type: 'OTP Expiration Time' })
    }

    const onSubmitOtpResendTime = (data) => {
        updateMessage({ message: otpResendTime.value, id: otpResendTime.id, alert: 'OTP Resend Time', type: 'OTP Resend Time' })
    }

    const onSubmitExtentTrailWithSurvey = (data) => {
        updateMessage({ message: extentTrailSurveyMessage.value, id: extentTrailSurveyMessage.id, alert: 'Extend Trial With Survey Message', type: 'Extend Trial With Survey Message' })
    }

    const onSubmitVerificationHeadingMessage = (data) => {
        updateMessage({ message: verificationHeadingMessage.value, id: verificationHeadingMessage.id, alert: 'Verification Heading Message', type: 'Verification Heading Message' })
    }

    const onSubmitDidntReceiveToken = (data) => {
        updateMessage({ message: didntReceiveTokenMessage.value, id: didntReceiveTokenMessage.id, alert: "Content", type: "Didn't Receive Token Content" })
    }

    const onSubmitSurveyUnlockedSubscription = (data) => {
        updateMessage({ message: surveyUnlockedSubscriptionMessage.value, id: surveyUnlockedSubscriptionMessage.id, alert: "Rate App Message", type: "Rate App Message" })
    }

    const onSubmitNotSecuredMessage = (data) => {
        updateMessage({ message: notSecuredMessage.value, id: notSecuredMessage.id, alert: 'Not Secured Message', type: 'Not Secured Message' })
    }

    const onSubmitNotSecuredCTAMessage = (data) => {
        updateMessage({ message: notSecuredCTAMessage.value, id: notSecuredCTAMessage.id, alert: 'Not Secured CTA Message', type: 'Not Secured CTA Message' })
    }

    const onSubmitWelcomeFreeTrialMessage = (data) => {
        updateMessage({ message: welcomeFreeTrialMessage.value, id: welcomeFreeTrialMessage.id, alert: 'Welcome Free Trial Message', type: 'Welcome Free Trial Message' })
    }

    const onSubmitInstructionsAddItem = (data) => {
        updateMessage({ message: instructionAddItem.value, id: instructionAddItem.id, alert: 'Instructions to Add Item', type: 'Instructions to Add Item' })
    }

    const onSubmitLapCharges = (data) => {
        updateMessage({ message: lapCharges.value, id: lapCharges.id, alert: 'Lap Charges', type: 'Lap Charges' })
    }

    const onSubmitReminderMonthlySubscription = (data) => {
        updateMessage({ message: reminderMonthlySubscription.value, id: reminderMonthlySubscription.id, alert: 'Reminder for Monthly Subscription', type: 'Reminder for Monthly Subscription' })
    }

    const onSubmitReminderYearlySubscription = (data) => {
        updateMessage({ message: reminderYearlySubscription.value, id: reminderYearlySubscription.id, alert: 'Reminder for Yearly Subscription', type: 'Reminder for Yearly Subscription' })
    }

    const onSubmitTutorial = () => {
        let isValid = true
        tutorialContent.value.forEach((item, index) => {
            if (!item.title.trim() || !item.content.trim()) {
                OpenNotification('error', 'Validation Error', `Please fill out all the contents.`)
                isValid = false
            }
        })

        // If any field is invalid, stop submission
        if (!isValid) return

        updateMessage({ message: JSON.stringify(tutorialContent.value), id: tutorialContent.id, alert: 'Tutorial Content', type: 'Tutorial' })
    }
    const addContent = () => {
        const newContent = { title: '', content: '' }
        setTutorialContent({
            ...tutorialContent,
            value: [...tutorialContent.value, newContent]
        })
    }

    const removeContent = (index) => {
        const updatedContent = tutorialContent.value.filter((item, i) => i !== index)
        setTutorialContent({
            ...tutorialContent,
            value: updatedContent
        })
    }

    return (
        <Fragment>
            <Breadcrumbs breadCrumbParent='Configurations' breadCrumbActive='Details' />

            <Row>

                {/* Honorary Message Form */}
                <Col sm="6">
                    <Card>
                        <CardHeader tag='h4'>Honorary Message</CardHeader>
                        <CardBody>
                            <Form onSubmit={handleSubmitHonorary(onSubmitHonorary)}>
                                <FormGroup>
                                    <Input
                                        type='textarea'
                                        id='honorary'
                                        name='honorary'
                                        placeholder='Honorary Message'
                                        value={honoraryMessage.value}
                                        onChange={(e) => setHonoraryMessage({ ...honoraryMessage, value: e.target.value })}
                                        innerRef={registerHonorary({ required: 'Honorary Message is required' })}
                                        rows='4'
                                    />
                                    {errorsHonorary.honorary && <p className="text-danger mt-1">{errorsHonorary.honorary.message}</p>}
                                </FormGroup>
                                <Button.Ripple disabled={loadingType === 'Honorary'} type='submit' className='mr-1' color='primary'>
                                    {(loadingType === 'Honorary') ? <> <Spinner color='white' size='sm' /> </> : 'Save Changes'}
                                </Button.Ripple>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>

                {/* Flyer Message Form */}
                <Col sm="6">
                    <Card>
                        <CardHeader tag='h4'>Flyer Message</CardHeader>
                        <CardBody>
                            <Form onSubmit={handleSubmitFlyer(onSubmitFlyer)}>
                                <FormGroup>
                                    <Input
                                        type='textarea'
                                        id='flyer'
                                        name='flyer'
                                        placeholder='Flyer Message'
                                        value={flyerMessage.value}
                                        onChange={(e) => setFlyerMessage({ ...flyerMessage, value: e.target.value })}
                                        innerRef={registerFlyer({ required: 'Flyer Message is required' })}
                                        rows='4'
                                    />
                                    {errorsFlyer.flyer && <p className="text-danger mt-1">{errorsFlyer.flyer.message}</p>}
                                </FormGroup>
                                <Button.Ripple disabled={loadingType === 'Flyer'} type='submit' className='mr-1' color='primary'>
                                    {(loadingType === 'Flyer') ? <> <Spinner color='white' size='sm' /> </> : 'Save Changes'}
                                </Button.Ripple>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>

                {/* Download Message Form */}
                <Col sm="6">
                    <Card>
                        <CardHeader tag='h4'>Download Message</CardHeader>
                        <CardBody>
                            <Form onSubmit={handleSubmitDownload(onSubmitDownload)}>
                                <FormGroup>
                                    <Input
                                        type='textarea'
                                        id='download'
                                        name='download'
                                        placeholder='Download Message'
                                        value={downloadMessage.value}
                                        onChange={(e) => setDownloadMessage({ ...downloadMessage, value: e.target.value })}
                                        innerRef={registerDownload({ required: 'Download Message is required' })}
                                        rows='4'
                                    />
                                    {errorsDownload.download && <p className="text-danger mt-1">{errorsDownload.download.message}</p>}
                                </FormGroup>
                                <Button.Ripple disabled={loadingType === 'Download'} type='submit' className='mr-1' color='primary'>
                                    {(loadingType === 'Download') ? <> <Spinner color='white' size='sm' /> </> : 'Save Changes'}
                                </Button.Ripple>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>

                {/* Unlock Premium Message Form */}
                <Col sm="6">
                    <Card>
                        <CardHeader tag='h4'>Unlock Premium Message</CardHeader>
                        <CardBody>
                            <Form onSubmit={handleSubmitPremium(onSubmitPremium)}>
                                <FormGroup>
                                    <Input
                                        type='textarea'
                                        id='premium'
                                        name='premium'
                                        placeholder='Unlock Premium Message'
                                        value={premiumMessage.value}
                                        onChange={(e) => setPremiumMessage({ ...premiumMessage, value: e.target.value })}
                                        innerRef={registerPremium({ required: 'Premium Message is required' })}
                                        rows='4'
                                    />
                                    {errorsPremium.premium && <p className="text-danger mt-1">{errorsPremium.premium.message}</p>}
                                </FormGroup>
                                <Button.Ripple disabled={loadingType === 'Premium'} type='submit' className='mr-1' color='primary'>
                                    {(loadingType === 'Premium') ? <> <Spinner color='white' size='sm' /> </> : 'Save Changes'}
                                </Button.Ripple>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>

                {/* App Updates Form */}
                <Col sm="6">
                    <Card style={{ minHeight: '250px' }}>
                        <CardHeader tag='h4'>App Updates</CardHeader>
                        <CardBody>
                            <Form onSubmit={handleSubmitAppUpdates(onSubmitAppUpdates)}>
                                <FormGroup>
                                    <Input
                                        type='textarea'
                                        id='appUpdates'
                                        name='appUpdates'
                                        placeholder="App Updates"
                                        value={appUpdates.value}
                                        onChange={(e) => setAppUpdates({ ...appUpdates, value: e.target.value })}
                                        innerRef={registerAppUpdates({ required: "App updates is required" })}
                                        rows='4'
                                    />
                                    {errorsAppUpdates.whatsNew && <p className="text-danger mt-1">{errorsAppUpdates.appUpdates.message}</p>}
                                </FormGroup>
                                <Button.Ripple disabled={loadingType === 'appUpdates'} type='submit' className='mr-1' color='primary'>
                                    {(loadingType === "appUpdates") ? <> <Spinner color='white' size='sm' /> </> : 'Save Changes'}
                                </Button.Ripple>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>

                {/* What's New Message Form */}
                <Col sm="6">
                    <Card style={{ minHeight: '250px' }}>
                        <CardHeader tag='h4'>What's New </CardHeader>
                        <CardBody>
                            <Form onSubmit={handleSubmitWhatsNew(onSubmitWhatsNew)}>
                                <FormGroup>
                                    <Input
                                        type='textarea'
                                        id='whatsNew'
                                        name='whatsNew'
                                        placeholder="What's New"
                                        value={whatsNew.value}
                                        onChange={(e) => setWhatsNew({ ...whatsNew, value: e.target.value })}
                                        innerRef={registerWhatsNew({ required: "What's New Message is required" })}
                                        rows='4'
                                    />
                                    {errorsWhatsNew.whatsNew && <p className="text-danger mt-1">{errorsWhatsNew.whatsNew.message}</p>}
                                </FormGroup>
                                <Button.Ripple disabled={loadingType === 'whatsNew'} type='submit' className='mr-1' color='primary'>
                                    {(loadingType === "whatsNew") ? <> <Spinner color='white' size='sm' /> </> : 'Save Changes'}
                                </Button.Ripple>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>

                {/* Honorary Access */}
                <Col sm="6">
                    <Card style={{ minHeight: '250px' }}>
                        <CardHeader tag='h4'>Honorary Access Request Message</CardHeader>
                        <CardBody>
                            <Form onSubmit={handleSubmitHonoraryAccess(onSubmitHonoraryAccess)}>
                                <FormGroup>
                                    <Input
                                        type='textarea'
                                        id='honoraryAccess'
                                        name='honoraryAccess'
                                        placeholder="Honorary Access Request Message"
                                        value={honoraryAccess.value}
                                        onChange={(e) => setHonoraryAccess({ ...honoraryAccess, value: e.target.value })}
                                        innerRef={registerHonoraryAccess({ required: "Honorary Access Request Message is required" })}
                                        rows='4'
                                    />
                                    {errorsHonoraryAccess.honoraryAccess && <p className="text-danger mt-1">{errorsHonoraryAccess.honoraryAccess.message}</p>}
                                </FormGroup>
                                <Button.Ripple disabled={loadingType === 'Honorary Access'} type='submit' className='mr-1' color='primary'>
                                    {(loadingType === "Honorary Access") ? <> <Spinner color='white' size='sm' /> </> : 'Save Changes'}
                                </Button.Ripple>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>

                {/* Account Reactivation */}
                <Col sm="6">
                    <Card style={{ minHeight: '250px' }}>
                        <CardHeader tag='h4'>Account Reactivation Message</CardHeader>
                        <CardBody>
                            <Form onSubmit={handleSubmitAccountReactivation(onSubmitAccountReactivation)}>
                                <FormGroup>
                                    <Input
                                        type='textarea'
                                        id='accountReactivation'
                                        name='accountReactivation'
                                        placeholder="Account Reactivation Message"
                                        value={accountReactivation.value}
                                        onChange={(e) => setAccountReactivation({ ...accountReactivation, value: e.target.value })}
                                        innerRef={registerAccountReactivation({ required: "Account Reactivation Message is required" })}
                                        rows='4'
                                    />
                                    {errorsAccountReactivation.accountReactivation && <p className="text-danger mt-1">{errorsAccountReactivation.accountReactivation.message}</p>}
                                </FormGroup>
                                <Button.Ripple disabled={loadingType === 'Account Reactivation'} type='submit' className='mr-1' color='primary'>
                                    {(loadingType === "Account Reactivation") ? <> <Spinner color='white' size='sm' /> </> : 'Save Changes'}
                                </Button.Ripple>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>

                {/*WIDGET TEXT */}
                <Col sm="6">
                    <Card style={{ minHeight: '250px' }}>
                        <CardHeader tag='h4'>Widget Message</CardHeader>
                        <CardBody>
                            <Form onSubmit={handleSubmitWidgetMessage(onSubmitwidgetMessage)}>
                                <FormGroup>
                                    <Input
                                        type='textarea'
                                        id='widgetMessage'
                                        name='widgetMessage'
                                        placeholder="Widget Message"
                                        value={widgetMessage.value}
                                        onChange={(e) => setWidgetMessage({ ...widgetMessage, value: e.target.value })}
                                        innerRef={registerWidgetMessage({ required: "Honorary Access Request Message is required" })}
                                        rows='4'
                                    />
                                    {errorsWidgetMessage.widgetMessage && <p className="text-danger mt-1">{errorsWidgetMessage.widgetMessage.message}</p>}
                                </FormGroup>
                                <Button.Ripple disabled={loadingType === 'Honorary Access'} type='submit' className='mr-1' color='primary'>
                                    {(loadingType === "Honorary Access") ? <> <Spinner color='white' size='sm' /> </> : 'Save Changes'}
                                </Button.Ripple>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>

                <Col sm="6">
                    <Card style={{ minHeight: '250px' }}>
                        <CardHeader tag='h4'>Item Fields Visibility Message</CardHeader>
                        <CardBody>
                            <Form onSubmit={handleSubmitItemFieldsVisibilityMessage(onSubmitItemFieldsVisibilityMessage)}>
                                <FormGroup>
                                    <Input
                                        type='textarea'
                                        id='widgetMessage'
                                        name='widgetMessage'
                                        placeholder="Widget Message"
                                        value={itemFieldsVisibilityMessage.value}
                                        onChange={(e) => setItemFieldsVisibilityMessage({ ...itemFieldsVisibilityMessage, value: e.target.value })}
                                        innerRef={registerWidgetMessage({ required: "Item Fields Visibility Message is required" })}
                                        rows='4'
                                    />
                                    {errorsItemFieldsVisibilityMessage.itemFieldsVisibilityMessage && <p className="text-danger mt-1">{errorsItemFieldsVisibilityMessage.itemFieldsVisibilityMessage.message}</p>}
                                </FormGroup>
                                <Button.Ripple disabled={loadingType === 'Item Fields Visibility Message'} type='submit' className='mr-1' color='primary'>
                                    {(loadingType === "Item Fields Visibility Message") ? <> <Spinner color='white' size='sm' /> </> : 'Save Changes'}
                                </Button.Ripple>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>

                <Col sm="6">
                    <Card style={{ minHeight: '250px' }}>
                        <CardHeader tag='h4'>Forgot Password Heading Message</CardHeader>
                        <CardBody>
                            <Form onSubmit={handleSubmitForgotPasswordHeading(onSubmitForgotPasswordHeadingMessage)}>
                                <FormGroup>
                                    <Input
                                        type='textarea'
                                        id='forgotPasswordHeadingMessage'
                                        name='forgotPasswordHeadingMessage'
                                        placeholder="Forgot Password Heading Message"
                                        value={forgotPasswordHeadingMessage.value}
                                        onChange={(e) => setForgotPasswordHeadingMessage({ ...forgotPasswordHeadingMessage, value: e.target.value })}
                                        innerRef={registerForgotPasswordHeading({ required: "Forgot Password Heading Message is required" })}
                                        rows='4'
                                    />
                                    {errorsForgotPasswordHeading.forgotPasswordHeadingMessage && <p className="text-danger mt-1">{errorsForgotPasswordHeading.forgotPasswordHeadingMessage.message}</p>}
                                </FormGroup>
                                <Button.Ripple disabled={loadingType === 'Forgot Password Heading Message'} type='submit' className='mr-1' color='primary'>
                                    {(loadingType === "Forgot Password Heading Message") ? <> <Spinner color='white' size='sm' /> </> : 'Save Changes'}
                                </Button.Ripple>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>

                <Col sm="6">
                    <Card style={{ minHeight: '250px' }}>
                        <CardHeader tag='h4'>Reset Password Heading Message</CardHeader>
                        <CardBody>
                            <Form onSubmit={handleSubmitResetPasswordHeading(onSubmitResetPasswordHeadingMessage)}>
                                <FormGroup>
                                    <Input
                                        type='textarea'
                                        id='resetPasswordHeadingMessage'
                                        name='resetPasswordHeadingMessage'
                                        placeholder="Reset Password Heading Message"
                                        value={resetPasswordHeadingMessage.value}
                                        onChange={(e) => setResetPasswordHeadingMessage({ ...resetPasswordHeadingMessage, value: e.target.value })}
                                        innerRef={registerResetPasswordHeading({ required: "Reset Password Heading Message is required" })}
                                        rows='4'
                                    />
                                    {errorsResetPasswordHeading.resetPasswordHeadingMessage && <p className="text-danger mt-1">{errorsResetPasswordHeading.resetPasswordHeadingMessage.message}</p>}
                                </FormGroup>
                                <Button.Ripple disabled={loadingType === 'Reset Password Heading Message'} type='submit' className='mr-1' color='primary'>
                                    {(loadingType === "Reset Password Heading Message") ? <> <Spinner color='white' size='sm' /> </> : 'Save Changes'}
                                </Button.Ripple>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>

                <Col sm="6">
                    <Card>
                        <CardHeader><h4>OTP Expiration Time <small>(In Minutes)</small></h4></CardHeader>
                        <CardBody>
                            <Form onSubmit={handleOtpExpirationTime(onSubmitOtpExpirationTime)}>
                                <FormGroup>
                                    <Input
                                        type='number'
                                        id='otpExpirationTime'
                                        name='otpExpirationTime'
                                        placeholder="OTP Expiration Time (In Minutes)"
                                        value={otpExpirationTime.value}
                                        onChange={(e) => setOtpExpirationTime({ ...otpExpirationTime, value: e.target.value })}
                                        innerRef={registerOtpExpirationTime({ required: "OTP Expiration Time is required" })}
                                        rows='4'
                                    />
                                    {errorsOtpExpirationTime.otpExpirationTime && <p className="text-danger mt-1">{errorsOtpExpirationTime.otpExpirationTime.message}</p>}
                                </FormGroup>
                                <Button.Ripple disabled={loadingType === 'OTP Expiration Time'} type='submit' className='mr-1' color='primary'>
                                    {(loadingType === 'OTP Expiration Time') ? <> <Spinner color='white' size='sm' /> </> : 'Save Changes'}
                                </Button.Ripple>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>

                <Col sm="6">
                    <Card>
                        <CardHeader><h4>OTP Resend Time <small>(In Minutes)</small></h4></CardHeader>
                        <CardBody>
                            <Form onSubmit={handleOtpResendTime(onSubmitOtpResendTime)}>
                                <FormGroup>
                                    <Input
                                        type='number'
                                        id='otpResendTime'
                                        name='otpResendTime'
                                        placeholder="OTP Resend Time (In Minutes)"
                                        value={otpResendTime.value}
                                        onChange={(e) => setOtpResendTime({ ...otpResendTime, value: e.target.value })}
                                        innerRef={registerOtpResendTime({ required: "OTP Resend Time is required" })}
                                        rows='4'
                                    />
                                    {errorsOtpResendTime.otpResendTime && <p className="text-danger mt-1">{errorsOtpResendTime.otpResendTime.message}</p>}
                                </FormGroup>
                                <Button.Ripple disabled={loadingType === 'OTP Resend Time'} type='submit' className='mr-1' color='primary'>
                                    {(loadingType === 'OTP Resend Time') ? <> <Spinner color='white' size='sm' /> </> : 'Save Changes'}
                                </Button.Ripple>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>

                <Col sm="6">
                    <Card>
                        <CardHeader><h4>Not Secured Message</h4></CardHeader>
                        <CardBody>
                            <Form onSubmit={handleNotSecuredMessage(onSubmitNotSecuredMessage)}>
                                <FormGroup>
                                    <Input
                                        type='text'
                                        id='notSecuredMessage'
                                        name='notSecuredMessage'
                                        placeholder="Not Secured Message"
                                        value={notSecuredMessage.value}
                                        onChange={(e) => setNotSecuredMessage({ ...notSecuredMessage, value: e.target.value })}
                                        innerRef={registerNotSecuredMessage({ required: "Not Secured Message is required" })}
                                    />
                                    {errorsNotSecuredMessage.notSecuredMessage && <p className="text-danger mt-1">{errorsNotSecuredMessage.notSecuredMessage.message}</p>}
                                </FormGroup>
                                <Button.Ripple disabled={loadingType === 'Not Secured Message'} type='submit' className='mr-1' color='primary'>
                                    {(loadingType === 'Not Secured Message') ? <> <Spinner color='white' size='sm' /> </> : 'Save Changes'}
                                </Button.Ripple>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>

                <Col sm="6">
                    <Card>
                        <CardHeader><h4>Not Secured CTA Message</h4></CardHeader>
                        <CardBody>
                            <Form onSubmit={handleNotSecuredCTAMessage(onSubmitNotSecuredCTAMessage)}>
                                <FormGroup>
                                    <Input
                                        type='text'
                                        id='notSecuredCTAMessage'
                                        name='notSecuredCTAMessage'
                                        placeholder="Not Secured CTA Message"
                                        value={notSecuredCTAMessage.value}
                                        onChange={(e) => setNotSecuredCTAMessage({ ...notSecuredCTAMessage, value: e.target.value })}
                                        innerRef={registerNotSecuredCTAMessage({ required: "Not Secured CTA Message is required" })}
                                    />
                                    {errorsNotSecuredCTAMessage.notSecuredCTAMessage && <p className="text-danger mt-1">{errorsNotSecuredCTAMessage.notSecuredCTAMessage.message}</p>}
                                </FormGroup>
                                <Button.Ripple disabled={loadingType === 'Not Secured CTA Message'} type='submit' className='mr-1' color='primary'>
                                    {(loadingType === 'Not Secured Message') ? <> <Spinner color='white' size='sm' /> </> : 'Save Changes'}
                                </Button.Ripple>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>

                <Col sm="6">
                    <Card style={{ minHeight: '250px' }}>
                        <CardHeader tag='h4'>Extend Trial With Survey Message</CardHeader>
                        <CardBody>
                            <Form onSubmit={handleExtentTrailWithSurvey(onSubmitExtentTrailWithSurvey)}>
                                <FormGroup>
                                    <Input
                                        type='textarea'
                                        id='extentTrailWithSurveyMessage'
                                        name='extentTrailWithSurveyMessage'
                                        placeholder="Extend Trial with Survey Message"
                                        value={extentTrailSurveyMessage.value}
                                        onChange={(e) => setExtentTrailSurveyMessage({ ...extentTrailSurveyMessage, value: e.target.value })}
                                        innerRef={registerExtentTrailWithSurvey({ required: "Extend Trial With Survey Message is required" })}
                                        rows='4'
                                    />
                                    {errorsExtentTrailWithSurvey.extentTrailSurveyMessage && <p className="text-danger mt-1">{errorsExtentTrailWithSurvey.extentTrailSurveyMessage.message}</p>}
                                </FormGroup>
                                <Button.Ripple disabled={loadingType === 'Extend Trial With Survey Message'} type='submit' className='mr-1' color='primary'>
                                    {(loadingType === "Extend Trial With Survey Message") ? <> <Spinner color='white' size='sm' /> </> : 'Save Changes'}
                                </Button.Ripple>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
                <Col sm="6">
                    <Card style={{ minHeight: '250px' }}>
                        <CardHeader tag='h4'>Verification Heading Message</CardHeader>
                        <CardBody>
                            <Form onSubmit={handleSubmitVerificationHeading(onSubmitVerificationHeadingMessage)}>
                                <FormGroup>
                                    <Input
                                        type='textarea'
                                        id='verificationHeadingMessage'
                                        name='verificationHeadingMessage'
                                        placeholder="Verification Heading Message"
                                        value={verificationHeadingMessage.value}
                                        onChange={(e) => setVerificationHeadingMessage({ ...verificationHeadingMessage, value: e.target.value })}
                                        innerRef={registerVerificationHeading({ required: "Verification Heading Message is required" })}
                                        rows='4'
                                    />
                                    {errorsVerificationHeading.verificationHeadingMessage && <p className="text-danger mt-1">{errorsVerificationHeading.verificationHeadingMessage.message}</p>}
                                </FormGroup>
                                <Button.Ripple disabled={loadingType === 'Verification Heading Message'} type='submit' className='mr-1' color='primary'>
                                    {(loadingType === "Verification Heading Message") ? <> <Spinner color='white' size='sm' /> </> : 'Save Changes'}
                                </Button.Ripple>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
                <Col sm="6">
                    <Card style={{ minHeight: '250px' }}>
                        <CardHeader tag='h4'>Didn't Receive Token Content</CardHeader>
                        <CardBody>
                            <Form onSubmit={handleSubmitDidntReceiveToken(onSubmitDidntReceiveToken)}>
                                <FormGroup>
                                    <Input
                                        type='textarea'
                                        id='didntReceiveTokenMessage'
                                        name='didntReceiveTokenMessage'
                                        placeholder="Didnt Receive Token Cotent"
                                        value={didntReceiveTokenMessage.value}
                                        onChange={(e) => setDidntReceiveTokenMessage({ ...didntReceiveTokenMessage, value: e.target.value })}
                                        innerRef={registerDidntReceiveToken({ required: "Verification Heading Message is required" })}
                                        rows='4'
                                    />
                                    {errorsDidntReceiveToken.didntReceiveTokenMessage && <p className="text-danger mt-1">{errorsDidntReceiveToken.didntReceiveTokenMessage.message}</p>}
                                </FormGroup>
                                <Button.Ripple disabled={loadingType === "Didn't Receive Token Content"} type='submit' className='mr-1' color='primary'>
                                    {(loadingType === "Didn't Receive Token Content") ? <> <Spinner color='white' size='sm' /> </> : 'Save Changes'}
                                </Button.Ripple>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>

                <Col sm="6">
                    <Card style={{ minHeight: '250px' }}>
                        <CardHeader tag='h4'>Rate App Message</CardHeader>
                        <CardBody>
                            <Form onSubmit={handleSubmitSurveyUnlockedSubscription(onSubmitSurveyUnlockedSubscription)}>
                                <FormGroup>
                                    <Input
                                        type='textarea'
                                        id='surveyUnlockedSubscriptionMessage'
                                        name='surveyUnlockedSubscriptionMessage'
                                        placeholder="Survey Unlocked Subscription Content"
                                        value={surveyUnlockedSubscriptionMessage.value}
                                        onChange={(e) => setSurveyUnlockedSubscriptionMessage({ ...surveyUnlockedSubscriptionMessage, value: e.target.value })}
                                        innerRef={registerDidntReceiveToken({ required: "Rate App Message is required" })}
                                        rows='4'
                                    />
                                    {errorsSurveyUnlockedSubscription.surveyUnlockedSubscriptionMessage && <p className="text-danger mt-1">{errorsSurveyUnlockedSubscription.surveyUnlockedSubscriptionMessage.message}</p>}
                                </FormGroup>
                                <Button.Ripple disabled={loadingType === "Rate App Message"} type='submit' className='mr-1' color='primary'>
                                    {(loadingType === "Rate App Message") ? <> <Spinner color='white' size='sm' /> </> : 'Save Changes'}
                                </Button.Ripple>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
                <Col sm="6">
                    <Card style={{ minHeight: '250px' }}>
                        <CardHeader tag='h4'>Welcome Free Trial Message</CardHeader>
                        <CardBody>
                            <Form onSubmit={handleWelcomeFreeTrialMessage(onSubmitWelcomeFreeTrialMessage)}>
                                <FormGroup>
                                    <Input
                                        type='textarea'
                                        id='welcomeFreeTrialMessage'
                                        name='welcomeFreeTrialMessage'
                                        placeholder="Welcome Free Trial Message"
                                        value={welcomeFreeTrialMessage.value}
                                        onChange={(e) => setWelcomeFreeTrialMessage({ ...welcomeFreeTrialMessage, value: e.target.value })}
                                        innerRef={registerWelcomeFreeTrialMessage({ required: "Welcome Free Trial Message is required" })}
                                        rows='4'
                                    />
                                    {errorsWelcomeFreeTrialMessage.welcomeFreeTrialMessage && <p className="text-danger mt-1">{errorsWelcomeFreeTrialMessage.welcomeFreeTrialMessage.message}</p>}
                                </FormGroup>
                                <Button.Ripple disabled={loadingType === "Welcome Free Trial Message"} type='submit' className='mr-1' color='primary'>
                                    {(loadingType === "Welcome Free Trial Message") ? <> <Spinner color='white' size='sm' /> </> : 'Save Changes'}
                                </Button.Ripple>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
                <Col sm="6">
                    {/* Widget Expiry Days Form */}
                    <Card>
                        <CardHeader tag='h4'>Widget Expiry Notification</CardHeader>
                        <CardBody>
                            <Form onSubmit={handleSubmitWidgetExpiry(onSubmitWidgetExpiry)}>
                                <FormGroup>
                                    <Label>Days</Label>
                                    <Input
                                        type='number'
                                        id='widgetExpiry'
                                        name='widgetExpiry'
                                        placeholder='Widget Expiration Days'
                                        value={widgetExpiry.value}
                                        onChange={(e) => setWidgetExpiry({ ...widgetExpiry, value: e.target.value })}
                                        innerRef={registerWidgetExpiry({
                                            required: 'Widget Expiration Days is required',
                                            valueAsNumber: true
                                        })}
                                        step='1'
                                        min='0'
                                    />
                                    {errorsWidgetExpiry.widgetExpiry && (
                                        <p className="text-danger mt-1">{errorsWidgetExpiry.widgetExpiry.message}</p>
                                    )}
                                </FormGroup>
                                <Button.Ripple disabled={loadingType === 'Widget Expiry'} type='submit' className='mr-1' color='primary'>
                                    {(loadingType === 'Widget Expiry') ? <> <Spinner color='white' size='sm' /> </> : 'Save Changes'}
                                </Button.Ripple>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>

            </Row>
            <Row>
                <Col sm="6">
                    <Card>
                        <ItemTypes />
                    </Card>
                </Col>

                <Col sm="6">
                    <Card>
                        <SubscriptionContent />
                    </Card>
                </Col>

                {/* Enable Apply Honorary Access */}
                <Col sm="6">
                    <Card>
                        <CardHeader tag='h4'>Apply Honorary Access Visibility</CardHeader>
                        <CardBody>
                            <Form onSubmit={handleSubmitEnableHonoraryAccess(onSubmitEnableHonoraryAccess)}>
                                <FormGroup className='d-flex mt-1'>
                                    <span className='mr-1 font-weight-bold'>Disabled</span>
                                    <CustomInput
                                        className='mb-1'
                                        type="switch"
                                        id="enableHonoraryAccess"
                                        name="enableHonoraryAccess"
                                        checked={enableHonoraryAccess.value === "true"}
                                        onChange={(e) => setEnableHonoraryAccess({ ...enableHonoraryAccess, value: e.target.checked.toString() })}
                                    />
                                    <span className='font-weight-bold'>Enabled</span>
                                </FormGroup>
                                <Button.Ripple disabled={loadingType === 'Enable Honorary Access'} type='submit' className='mr-1' color='primary'>
                                    {(loadingType === 'Enable Honorary Access') ? <> <Spinner color='white' size='sm' /> </> : 'Save Changes'}
                                </Button.Ripple>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>

                {/* Enable Subscription Visibility*/}
                <Col sm="6">
                    <Card>
                        <CardHeader tag='h4'>Subscription Visibility</CardHeader>
                        <CardBody>
                            <Form onSubmit={handleSubmitSubscriptionVisibility(onSubmitSubscriptionVisibility)}>
                                <FormGroup className='d-flex mt-1'>
                                    <span className='mr-1 font-weight-bold'>Disabled</span>
                                    <CustomInput
                                        className='mb-1'
                                        type="switch"
                                        id="enableSubscription"
                                        name="enableSubscription"
                                        checked={subscriptionVisibility.value === "true"}
                                        onChange={(e) => setSubscriptionVisibility({ ...subscriptionVisibility, value: e.target.checked.toString() })}
                                    />
                                    <span className='font-weight-bold'>Enabled</span>
                                </FormGroup>
                                <Button.Ripple disabled={loadingType === 'Subscription Visibility'} type='submit' className='mr-1' color='primary'>
                                    {(loadingType === 'Subscription Visibility') ? <> <Spinner color='white' size='sm' /> </> : 'Save Changes'}
                                </Button.Ripple>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>

                {/* Enable Lab Charges*/}
                <Col sm="6">
                    <Card>
                        <CardHeader tag='h4'>Lap Charges</CardHeader>
                        <CardBody>
                            <Form onSubmit={handleSubmitLapCharges(onSubmitLapCharges)}>
                                <FormGroup className='d-flex mt-1'>
                                    <span className='mr-1 font-weight-bold'>Disabled</span>
                                    <CustomInput
                                        className='mb-1'
                                        type="switch"
                                        id="lapCharges"
                                        name="lapCharges"
                                        checked={lapCharges.value === "true"}
                                        onChange={(e) => setLapCharges({ ...lapCharges, value: e.target.checked.toString() })}
                                    />
                                    <span className='font-weight-bold'>Enabled</span>
                                </FormGroup>
                                <Button.Ripple disabled={loadingType === 'Lap Charges'} type='submit' className='mr-1' color='primary'>
                                    {(loadingType === 'Lap Charges') ? <> <Spinner color='white' size='sm' /> </> : 'Save Changes'}
                                </Button.Ripple>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>

                {/* INSTRUCTIONS TO ADD ITEMS */}
                <Col sm="6">
                    <Card style={{ minHeight: '250px' }}>
                        <CardHeader tag='h4'>Instructions to Add Item</CardHeader>
                        <CardBody>
                            <Form onSubmit={handleSubmitInstructionsAddItem(onSubmitInstructionsAddItem)}>
                                <FormGroup>
                                    <Input
                                        type='textarea'
                                        id='instructionAddItem'
                                        name='instructionAddItem'
                                        placeholder="Instructions to Add Item"
                                        value={instructionAddItem.value}
                                        onChange={(e) => setInstructionAddItem({ ...instructionAddItem, value: e.target.value })}
                                        innerRef={registerInstructionAddItem({ required: "Instructions to Add Item is required" })}
                                        rows='10'
                                    />
                                    {errorsInstructionsAddItem.instructionAddItem && <p className="text-danger mt-1">{errorsInstructionsAddItem.instructionAddItem.message}</p>}
                                </FormGroup>
                                <Button.Ripple disabled={loadingType === 'Instructions to Add Item'} type='submit' className='mr-1' color='primary'>
                                    {(loadingType === "Instructions to Add Item") ? <> <Spinner color='white' size='sm' /> </> : 'Save Changes'}
                                </Button.Ripple>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>

                {/* Apply Honorary Access */}
                <Col sm="6">
                    <Card style={{ minHeight: '250px' }}>
                        <CardHeader tag='h4'>Apply Honorary Access Message</CardHeader>
                        <CardBody>
                            <Form onSubmit={handleSubmitApplyHonoraryAccess(onSubmitApplyHonoraryAccess)}>
                                <FormGroup>
                                    <Input
                                        type='textarea'
                                        id='applyHonoraryAccess'
                                        name='applyHonoraryAccess'
                                        placeholder="Apply Honorary Access Message"
                                        value={ApplyHonoraryAccess.value}
                                        onChange={(e) => setApplyHonoraryAccess({ ...ApplyHonoraryAccess, value: e.target.value })}
                                        innerRef={registerApplyHonoraryAccess({ required: "Apply Honorary Access Message is required" })}
                                        rows='10'
                                    />
                                    {errorsApplyHonoraryAccess.applyHonoraryAccess && <p className="text-danger mt-1">{errorsApplyHonoraryAccess.applyHonoraryAccess.message}</p>}
                                </FormGroup>
                                <Button.Ripple disabled={loadingType === 'Apply Honorary Access'} type='submit' className='mr-1' color='primary'>
                                    {(loadingType === "Apply Honorary Access") ? <> <Spinner color='white' size='sm' /> </> : 'Save Changes'}
                                </Button.Ripple>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>

                <Col sm="6">
                    <Card>
                        <Relations />
                    </Card>
                </Col>

            </Row>
            <Row>

                <Col sm="6">
                    {/* Honorary Request Waiting Period Form */}
                    <Card>
                        <CardHeader tag='h4'>Honorary Request Waiting Period</CardHeader>
                        <CardBody>
                            <Form onSubmit={handleSubmitWaitingPeriod(onSubmitWaitingPeriod)}>
                                <FormGroup>
                                    <Label>Days</Label>
                                    <Input
                                        type='number'
                                        id='waitingPeriod'
                                        name='waitingPeriod'
                                        placeholder='Honorary Request Waiting Period'
                                        value={waitingPeriod.value}
                                        onChange={(e) => setWaitingPeriod({ ...waitingPeriod, value: e.target.value })}
                                        innerRef={registerWaitingPeriod({
                                            required: 'Waiting Period is required',
                                            valueAsNumber: true
                                        })}
                                        step='1'
                                        min='0'
                                    />
                                    {errorsWaitingPeriod.waitingPeriod && (
                                        <p className="text-danger mt-1">{errorsWaitingPeriod.waitingPeriod.message}</p>
                                    )}
                                </FormGroup>
                                <Button.Ripple disabled={loadingType === 'Waiting Period'} type='submit' className='mr-1' color='primary'>
                                    {(loadingType === 'Waiting Period') ? <> <Spinner color='white' size='sm' /> </> : 'Save Changes'}
                                </Button.Ripple>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>


                <Col sm="6">
                    <Card>
                        <CardHeader tag='h4'>Survey Form Before the Trial Expires</CardHeader>
                        <CardBody>
                            <Form onSubmit={handleSubmitTrialExpires(onSubmitTrialExpires)}>
                                <FormGroup>
                                    <Label>Days</Label>
                                    <Input
                                        type='number'
                                        id='trialExpires'
                                        name='trialExpires'
                                        placeholder='Survey Form Before the Trial Expires'
                                        value={trialExpires.value}
                                        onChange={(e) => setTrialExpires({ ...trialExpires, value: e.target.value })}
                                        innerRef={registerTrialExpires({
                                            required: 'Trial Expires is required',
                                            valueAsNumber: true
                                        })}
                                        step='1'
                                        min='0'
                                    />
                                    {errorsTrialExpires.trialExpires && (
                                        <p className="text-danger mt-1">{errorsTrialExpires.trialExpires.message}</p>
                                    )}
                                </FormGroup>
                                <Button.Ripple disabled={loadingType === 'Waiting Period'} type='submit' className='mr-1' color='primary'>
                                    {(loadingType === 'Waiting Period') ? <> <Spinner color='white' size='sm' /> </> : 'Save Changes'}
                                </Button.Ripple>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>

                <Col sm="6">
                    <Card>
                        <CardHeader tag='h4'>Reminder for Monthly Subscription</CardHeader>
                        <CardBody>
                            <Form onSubmit={handleSubmitReminderMonthlySubscription(onSubmitReminderMonthlySubscription)}>
                                <FormGroup>
                                    <Label>Days</Label>
                                    <Input
                                        type='number'
                                        id='reminderMonthlySubscription'
                                        name='reminderMonthlySubscription'
                                        placeholder='Reminder for Monthly Subscription'
                                        value={reminderMonthlySubscription.value}
                                        onChange={(e) => setReminderMonthlySubscription({ ...reminderMonthlySubscription, value: e.target.value })}
                                        innerRef={registerReminderMonthlySubscription({
                                            required: 'Reminder for Monthly Subscription is required',
                                            valueAsNumber: true
                                        })}
                                        step='1'
                                        min='0'
                                    />
                                    {errorsReminderMonthlySubscription.reminderMonthlySubscription && (
                                        <p className="text-danger mt-1">{errorsReminderMonthlySubscription.reminderMonthlySubscription.message}</p>
                                    )}
                                </FormGroup>
                                <Button.Ripple disabled={loadingType === 'Reminder for Monthly Subscription'} type='submit' className='mr-1' color='primary'>
                                    {(loadingType === 'Reminder for Monthly Subscription') ? <> <Spinner color='white' size='sm' /> </> : 'Save Changes'}
                                </Button.Ripple>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
                
                <Col sm="6">
                    <Card>
                        <CardHeader tag='h4'>Reminder for Yearly Subscription</CardHeader>
                        <CardBody>
                            <Form onSubmit={handleSubmitReminderYearlySubscription(onSubmitReminderYearlySubscription)}>
                                <FormGroup>
                                    <Label>Days</Label>
                                    <Input
                                        type='number'
                                        id='reminderYearlySubscription'
                                        name='reminderYearlySubscription'
                                        placeholder='Reminder for Yearly Subscription'
                                        value={reminderYearlySubscription.value}
                                        onChange={(e) => setReminderYearlySubscription({ ...reminderYearlySubscription, value: e.target.value })}
                                        innerRef={registerReminderYearlySubscription({
                                            required: 'Reminder for Yearly Subscription is required',
                                            valueAsNumber: true
                                        })}
                                        step='1'
                                        min='0'
                                    />
                                    {errorsReminderYearlySubscription.reminderYearlySubscription && (
                                        <p className="text-danger mt-1">{errorsReminderYearlySubscription.reminderYearlySubscription.message}</p>
                                    )}
                                </FormGroup>
                                <Button.Ripple disabled={loadingType === 'Reminder for Yearly Subscription'} type='submit' className='mr-1' color='primary'>
                                    {(loadingType === 'Reminder for Yearly Subscription') ? <> <Spinner color='white' size='sm' /> </> : 'Save Changes'}
                                </Button.Ripple>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>


                <Col sm="6">
                    <Card>
                        <CardHeader tag='h4'>Steps to Apply Widget</CardHeader>
                        <CardBody>
                            <Form onSubmit={handleSubmitWidgetSteps(onSubmitWidgetSteps)}>
                                <FormGroup>
                                    <Editor editorState={widgetSteps.value} onEditorStateChange={data => setWidgetSteps({ ...widgetSteps, value: data })} />
                                    {errorsWidgetSteps.WidgetSteps && (
                                        <p className="text-danger mt-1">{errorsWidgetSteps.WidgetSteps.message}</p>
                                    )}
                                </FormGroup>
                                <Button.Ripple disabled={loadingType === 'Widget Steps'} type='submit' className='mr-1' color='primary'>
                                    {(loadingType === 'Widget Steps') ? <> <Spinner color='white' size='sm' /> </> : 'Save Changes'}
                                </Button.Ripple>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>

                {/* Our Story */}
                <Col sm="6">
                    <Card>
                        <OurStory />
                    </Card>
                </Col>

                {/* Tutorial Content */}
                <Col sm="12">
                    <Card>
                        <CardHeader tag='h4'>App Tutorial Content</CardHeader>
                        <hr className='mt-0' />
                        <CardBody>
                            <Form onSubmit={handleSubmitTutorial(onSubmitTutorial)}>
                                <Row>
                                    {tutorialContent.value.map((item, index) => (
                                        <>
                                            <Col md="6" className='mb-1' key={index}>
                                                <FormGroup className='d-flex justify-content-between align-items-center'>
                                                    <h5 className='mb-0'>{item.title}</h5>
                                                    {/* <Input
                                                className='w-50'
                                                type='text'
                                                name={`Title ${index + 1}`}
                                                placeholder={`Enter Title ${index + 1}`}
                                                value={item.title}
                                                onChange={(e) => {
                                                    const updatedContent = { ...tutorialContent }
                                                    updatedContent.value[index].title = e.target.value
                                                    setTutorialContent(updatedContent)
                                                }}
                                            /> */}
                                                    {/* <div style={{ display: tutorialContent.value.length < 2 && 'none' }} className='cursor-pointer text-danger text-right mb-1 font-weight-bold' onClick={() => removeContent(index)}>
                                                <Trash2 size='18' /> Remove
                                            </div> */}
                                                </FormGroup>
                                                <FormGroup>
                                                    <Input
                                                        type='textarea'
                                                        rows={6}
                                                        placeholder={`Enter Content`}
                                                        name={`Content ${index + 1}`}
                                                        value={item.content}
                                                        onChange={(e) => {
                                                            const updatedContent = { ...tutorialContent }
                                                            updatedContent.value[index].content = e.target.value
                                                            setTutorialContent(updatedContent)
                                                        }}
                                                        style={{ resize: 'none' }}
                                                    />

                                                </FormGroup>
                                            </Col>
                                        </>
                                    ))}
                                    {/* Add More Button */}
                                    {/* <div className='cursor-pointer text-primary font-weight-bold' onClick={() => addContent()}>
                                        <Plus size='20' /> Add More
                                    </div> */}
                                </Row>
                                <Row>
                                    {/* Save Changes Button */}
                                    <Col>
                                        <Button.Ripple disabled={loadingType === 'Tutorial'} type='submit' className='mr-1 mt-2' color='primary'>
                                            {(loadingType === 'Tutorial') ? <> <Spinner color='white' size='sm' /> </> : 'Save Changes'}
                                        </Button.Ripple>
                                    </Col>
                                </Row>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>


                {/* Manage Survey */}
                <Col sm="12">
                    <Card>
                        <ManageSurvey />
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )
}

export default Configurations

