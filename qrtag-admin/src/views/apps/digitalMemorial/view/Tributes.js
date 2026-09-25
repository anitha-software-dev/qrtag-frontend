import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Row, Col, Card, ListGroup, ListGroupItem } from "reactstrap"
import { localTimeZoneDate } from '@src/views/components/Helper'

const Tributes = ({ editData }) => {

    const [tributeData, setTributeData] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (editData && Array.isArray(editData.tributes)) {
            setTributeData(editData.tributes)
        }
    }, [editData])

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

    return (
        <div className='p-2'>
            <Row form className=' '>
                <Col md="12">


                    {(tributeData && tributeData.length > 0) ? <>
                        {tributeData.map(item => (
                            <Card className="mb-2">
                                <ListGroup>
                                    <ListGroupItem key={item.id}>
                                        <div className="d-flex justify-content-between align-items-center mt-1">
                                            <p style={{ flex: 1 }}>{item.message}</p>
                                        </div>
                                        <div className='d-flex align-items-center justify-content-between'>
                                            <div className='d-flex justify-content-between'>
                                                <div className='text-secondary'>
                                                    <strong>{item?.name}</strong>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-column align-items-end">
                                                <p className='text-secondary'>{formatDate(item.created_at)}</p>
                                            </div>
                                        </div>
                                    </ListGroupItem>
                                </ListGroup>
                            </Card>
                        ))}
                    </> : <>
                        <Card>
                            <div className="d-flex justify-content-center text-center align-items-center mt-2 mb-2">
                                <p style={{ flex: 1 }}>No Tributes Found</p>
                            </div>
                        </Card>
                    </>}

                </Col>

            </Row >
        </div>
    )
}

export default Tributes
