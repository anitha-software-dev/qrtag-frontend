"use client"
import React, { useEffect, useRef, useState } from 'react';
import Config from '../../config/config';

const Faq1 = () => {

  const faqContent = [
    {
      title: 'How does QRTag.it work?',
      content: (
        <>
          <p>
            QRTag.it allows you to tag your belongings with unique QR codes. If you lose an item,
            a finder can scan the QR code with their phone’s camera, connecting you with the finder
            through the website for easy anonymous retrieval.
          </p>
        </>
      ),
    },
    {
      title: 'Which items can I tag with QRTag.it?',
      content: (
        <>
          <p>
            QRTag.it provides different types of tags for different types of items or valuables.
            For example, if you want to put a QRTag.it tag on your cat, you can order an aluminum
            QR Tag with a hole enabling it to be placed on the cat’s collar. If you want to tag
            your cell phone, you can order a QRTag.it tag that has an extra strong adhesive back.
            (Coming soon: with a premium subscription, you will be able to print out the QR tags
            you order using your own adhesive label sheets and you will be able to tag electronics
            using a widget that will show your unique QRTag.it tag for that item on the screen as
            soon as a lost electronic device is turned on or activated.)
          </p>
          <br />
          <p>
            The possibilities are endless, you could have a dependent, such as an elderly grandparent
            or young child, wear a QRTag.it tag on a chain around their neck or wrist so that you can
            be contacted if ever they wander off, or you could place a QRTag.it tag on the front of
            a credit card or in the billfold of your wallet. In the event these are stolen, the police
            will be able to identify you as the owner, or you could post an award for the safe return
            of such items using the QRTag.it app.
          </p>
        </>
      ),
    },
    {
      title: 'Is QRTag.it free to use?',
      content: (
        <>
          <p>
            QRTag.it is free to download and then after a free 30-day trial, QRTag.it users can opt
            for an affordable subscription plan that will enable them to track their valuables as long
            as they keep their account active. (Coming soon: one free QRTag.it tag will be made
            available to first responders, active military, veterans and teachers.)
          </p>
        </>
      ),
    },
    {
      title: 'How do I mark an item as lost with QRTag.it app?',
      content: (
        <>
          <p>
            If you lose a tagged valuable, then its unique QR tag can be immediately scanned by a finder.
            If you wish, you may “mark” the item as “lost” within the QRTag.it app and also post a reward
            for its safe return so that when a finder scans the item, they will see the item marked as
            lost and the offered reward.
          </p>
        </>
      ),
    },
    {
      title: 'How can I provide incentive for a finder to return my lost item?',
      content: (
        <>
          <p>
            Offering a reward is optional and can be done when an item is marked as lost. A reward can also
            be negotiated after a finder initiates a “chat” with you via the QRTag.it website about
            discovering the lost item.
          </p>
        </>
      ),
    },
    {
      title: 'Does QRTag.it depend on the "honor system" for the return of my valuables?',
      content: (
        <>
          <p>
            There are several reasons why someone might return a lost item: goodwill, honesty, karma,
            and a sense of community spirit. At QRTag.it, we facilitate the return of lost items by
            providing a platform for finders to connect with owners easily, securely, and anonymously,
            ensuring a positive outcome for both parties.
          </p>
          <br />
          <p>
            QRTag.it enables you to provide a reward as incentive for the return of your valuables;
            however, it is very much the case that as soon as a finder scans your item’s unique QR code,
            you will know that the item has been found and be able to track it back to the finder, thus
            helping the “honor system” along a bit.
          </p>
        </>
      ),
    },
    {
      title: 'If my phone, where the QRTag.it app resides, is lost how do I connect with a finder?',
      content: (
        <>
          <p>
            You do not need the lost phone to be notified of a finder’s message to you. When a finder
            initiates the QRTag.it chat feature to return any item, a notification is sent to both
            the owner’s phone and to their email on file. This is done via the QRTag.it website.
          </p>
        </>
      ),
    },
    {
      title: 'Please describe return policy of QRTag.it',
      content: (
        <>
          <p>
            You can find return policy{' '}
            <a
              href={`${Config.WEB_URL}return-policy/`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#c36', fontWeight: 'bold' }}
            >
              click here
            </a>
          </p>
        </>
      ),
    },
  ];


  const accordionContentRef = useRef(null);
  const [openItemIndex, setOpenItemIndex] = useState(-1);
  const [firstItemOpen, setFirstItemOpen] = useState(true);

  const handleItemClick = index => {
    if (index === openItemIndex) {
      setOpenItemIndex(-1);
    } else {
      setOpenItemIndex(index);
    }
  };
  useEffect(() => {
    if (firstItemOpen) {
      setOpenItemIndex(0);
      setFirstItemOpen(false);
    }
  }, [firstItemOpen]);


  return (
    <section className="position-relative overflow-hidden faq-bg" id='faqs'>
      <div className="cs_height_120 "></div>
      <div className="container">
        <div className="row cs_gap_y_30 position-relative z-1">
          <div className="col-lg-12">
            <div className="cs_section_heading mobile-heading cs_style_1 text-center">
              <h2 className="cs_fs_60 mt-3 mt-md-0 mb-0 wow fadeInUp">Still Have Questions?</h2>
            </div>
          </div>
          <div className="col-lg-2"></div>
          <div className="col-lg-8">
            <div className="cs_accordians">
              {faqContent.map((item, index) => (
                <div key={index} className={`cs_accordian cs_style_1 ${index === openItemIndex ? "active" : ""}`} >
                  <div onClick={() => handleItemClick(index)} className="cs_accordian_head position-relative mb-2">
                    <p className="cs_accordian_title cs_fs_16 mb-0 mx-2">{item.title}</p>

                    <span className="cs_accordian_toggler cs_heading_color position-absolute">
                      {index === openItemIndex ? (
                        <i className="bi bi-dash-lg"></i>
                      ) : (
                        <i className="bi bi-plus-lg"></i>
                      )}
                    </span>
                  </div>
                  <div ref={accordionContentRef} className="cs_accordian_body mobile-content">
                    <div className="cs_accordian_text cs_fs_18" style={{ color: "#494D59CC" }}>
                      {item.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-lg-2"></div>
        </div>
      </div>
    </section>
  );
};

export default Faq1;