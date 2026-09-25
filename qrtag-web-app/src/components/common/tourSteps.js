import React from 'react';
import { Button } from '@mui/material';

const tourSteps = (closeTour) => [
    {
        selector: '.add-item-button',
        content: (
            <div className='mt-4'>
                <Button onClick={closeTour} style={{ position: 'absolute', top: '10px', left: '10px' }}>
                    Got It
                </Button>
                <p>The "Add Item" button empowers the owner to easily include an item in their inventory, whether it's a new addition or something that may have been misplaced. This user-friendly feature streamlines the process of tracking belongings, allowing for quick updates and ensuring that all items, regardless of their status, are accounted for.</p>
            </div>
        ),
    },
    {
        selector: '.scanner',
        content: (
            <div className='mt-4'>
                <Button onClick={closeTour} style={{ position: 'absolute', top: '10px', left: '10px' }}>
                    Got It
                </Button>
                <p>The "Scanner feature" offers a convenient solution for users to effortlessly scan any QR code, facilitating the addition of new items or the tracking of lost ones. With this intuitive functionality, users can quickly capture and manage their inventory by simply pointing their scanner at a QR code.</p>
            </div>
        ),
    },
    {
        selector: '.feedback',
        content: (
            <div className='mt-4'>
                <Button onClick={closeTour} style={{ position: 'absolute', top: '10px', left: '10px' }}>
                    Got It
                </Button>
                <p>Feedback empowers users to easily submit any inquiries directly to our team, ensuring they receive a prompt and informative response via email.</p>
            </div>
        ),
    },
    {
        selector: '.chats',
        content: (
            <div className='mt-4'>
                <Button onClick={closeTour} style={{ position: 'absolute', top: '10px', left: '10px' }}>
                    Got It
                </Button>
                <p>Our chat feature enables users to seamlessly send and receive messages with the finder or owner of an item. This real-time communication tool enhances interaction, allowing for quick questions, clarifications, and negotiations, making the process of connecting with others easier and more efficient.</p>
            </div>
        ),
    },
    {
        selector: '.edit-profile',
        content: (
            <div className='mt-4'>
                <Button onClick={closeTour} style={{ position: 'absolute', top: '10px', left: '10px' }}>
                    Got It
                </Button>
                <p>The Edit Profile feature enables users to effortlessly update their information, including contact details, state, city, and address. This functionality ensures that users can keep their profiles accurate and relevant, facilitating better communication and enhancing their overall experience.</p>
            </div>
        ),
    },
    {
        selector: '.notifications',
        content: (
            <div className='mt-4'>
                <Button onClick={closeTour} style={{ position: 'absolute', top: '10px', left: '10px' }}>
                    Got It
                </Button>
                <p>The Notifications feature keeps users informed by providing real-time updates about their items. Users can easily view alerts when their items have been scanned or when they've received messages from the finders.</p>
            </div>
        ),
    },
    {
        selector: '.myqrtags',
        content: (
            <div className='mt-4'>
                <Button onClick={closeTour} style={{ position: 'absolute', top: '10px', left: '10px' }}>
                    Got It
                </Button>
                <p>My QR Tags offers users a convenient way to view a comprehensive list of both used and unused QR codes. This feature simplifies management, allowing users to easily track their QR tags, ensuring they can quickly access and utilize their resources effectively.</p>
            </div>
        ),
    },
]

export default tourSteps;
