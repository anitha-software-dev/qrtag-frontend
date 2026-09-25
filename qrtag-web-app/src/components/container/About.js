import React, { useEffect, useState } from 'react'
import '../css/App.css'
import Navbar from '../common/Navbar'
import { useLocation } from 'react-router-dom'
import mixpanel from 'mixpanel-browser'
import { Button, Grid, Box } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TopNavbar from '../common/TopNavContent'
import { GetUserDetails } from '../../services/user'
import Breadcrumbs from '../common/Breadcrumbs'
import Footer from '../common/Footer'
import About from '../../images/About.png'
import Dave from '../../images/dave-1.png'

function OurStory() {

  const location = useLocation()
  const [story, setStory] = useState(null)

  useEffect(() => {
    mixpanel.track('Our Story', {
      pageName: 'Our Story',
    })

    GetUserDetails()
      .then((response) => {
        if (response?.success && response?.data?.story) {
          setStory(response.data.story)
        }
      })
      .catch((error) => {
        console.error('Error fetching story:', error)
      })
  }, [])

  return (
    <>
      <Navbar />
      <Breadcrumbs breadCrumbParent='Dashboard' breadCrumbActive='About / Our Story' />
      <TopNavbar />

      <div className='section-background'>
        <div className=' container py-5'>
          <div className='d-flex flex-column'>
            <Grid container spacing={2} alignItems='center' justifyContent='space-between' style={{ width: '100%', margin: 'auto' }}>
              <Card
                sx={{
                  margin: 'auto',
                  boxShadow: 'none',
                  width: '100%',
                  maxWidth: '100%',
                  borderRadius: '12px'
                }}
              >
                <CardContent style={{ padding: '40px' }}>

                  <Grid container alignItems='center'>

                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={6}
                      display='flex'
                      flexDirection='column'
                      alignItems='flex-start'
                      justifyContent='flex-start'
                      marginTop={{ xs: '2rem', sm: '2rem', lg: '0rem' }}
                      sx={{ borderLeft: '4px solid #8ACD42', paddingLeft: '1.5rem', mb: { xs: 5, md: 0 } }}
                    >
                      <div style={{ backgroundColor: '#ffe5e2', padding: '5px 13px', borderRadius: '25px' }}>
                        <p className='mb-0' style={{ color: '#FF503D', fontSize: '12px', fontWeight: 600 }}>ABOUT THE QR TAG IT APP</p>
                      </div>

                      <Typography className='mb-3' sx={{ fontSize: { xs: '33px', md: '48px' }, fontWeight: 800 }}>
                        <span style={{ color: '#8ACD42' }}>QRTag.it </span>
                        <span style={{ color: '#152758' }}>App</span>
                      </Typography>

                      <Typography sx={{ color: '#4B5A5B', textAlign: 'left' }} component='p' variant='p'>
                        Tag and keep track of your valuables with the QRTag.it app. Available in Google Play and the App Store. If one of your tagged items gets lost, and someone finds it and scans the item’s unique QR code, you will be notified via the QRTag.it website or app. From there, you can join a “chat” with the finder for pick-up / delivery in a public place, such as a library. Your conversation will take place via the website and without the need to provide your name, telephone number, address, or any other personally identifiable information. You also have the option of marking the item as lost in the QRTag.it app, which will enable you to post a reward if you want.

                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={12} md={6} display='flex' justifyContent={{ xs: 'center', sm: 'center', lg: 'flex-end' }} sx={{ pb: { xs: 5, md: 0 } }}>
                      <img src={About} alt='about' style={{ width: '90%' }} />
                    </Grid>

                  </Grid>

                  <Grid container alignItems='center' sx={{ marginTop: { xs: '6%', md: '4%' } }}>
                    <Grid item xs={12} sm={12} md={5} display='flex' justifyContent={{ xs: 'center', sm: 'center', lg: 'flex-start' }}>
                      <img src={Dave} alt='story' style={{ width: '100%' }} />
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={7}
                      display='flex'
                      flexDirection='column'
                      alignItems='flex-start'
                      justifyContent='flex-start'
                      marginTop={{ xs: '2rem', sm: '2rem', lg: '0rem' }}
                      sx={{ background: '#dfe7fc', padding: { md: '40px', xs: '10px' }, borderLeft: '25px solid #8ACD42' }}
                    >
                      <Typography component='h3' variant='h3' className='mb-3' sx={{ color: '#FF503D', fontSize: { md: '85px', xs: '60px' }, fontWeight: 800, textAlign: { xs: 'left', md: 'center' } }}>
                        Dave
                      </Typography>
                      <Typography sx={{ color: '#4B5A5B', textAlign: 'left' }} component='p' variant='p'>
                        Dave, a retired Army Major and Japanese linguist, brings over two decades of expertise in psychology, nursing, and encryption to QRTag.it. His passion for codes and secure communication inspired the creation of this groundbreaking platform. Dave’s vision is to empower users to safeguard their valuables and personal information while contributing to sustainability efforts. A leader with a global perspective, he combines military precision with innovative thinking to make QRTag.it a trusted solution for modern challenges.
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid container alignItems='start' sx={{ paddingTop: '8%' }}>
                    <Grid item xs={12} sm={12} md={4} display='flex' flexDirection='column' justifyContent='center' sx={{ pt: { xs: 5, md: 0 } }}>
                      <Box sx={{ borderBottom: '2px solid #1e5af9' }}>
                        <Box position="relative" mb={1} >
                          <Typography
                            variant="h1"
                            sx={{
                              fontSize: '90px',
                              fontWeight: 900,
                              color: '#e6eaf0',
                              position: 'absolute',
                              top: '-30px',
                              left: -5,
                              zIndex: 0,
                              lineHeight: 1,
                              userSelect: 'none',
                            }}
                          >
                            Rick
                          </Typography>
                          <Typography
                            variant="h4"
                            sx={{
                              color: '#1e5af9',
                              fontWeight: 800,
                              position: 'relative',
                              zIndex: 1,
                              display: 'inline-block',
                            }}
                          >
                            Rick
                          </Typography>
                        </Box>
                      </Box>

                      <Typography sx={{ color: '#4B5A5B', mt: 2, textAlign: "left" }}>
                        Rick, the technological visionary behind QRTag.it, brings over two decades of global, cross-industry expertise in platform design, scalable architecture, and intuitive system development. His deep technical acumen has been instrumental in crafting QRTag.it’s robust unified technical architecture—designed to be highly scalable, secure, and monetizable. This architecture not only ensures seamless customer experiences but also supports both retail and enterprise markets, setting a benchmark in innovation and operational excellence.
                      </Typography>

                    </Grid>

                    <Grid item xs={12} sm={12} md={4} display='flex' flexDirection='column' justifyContent='center' sx={{ paddingInline: { xs: 0, md: '30px' }, pt: { xs: 5, md: 0 } }}>
                      <Box sx={{ borderBottom: '2px solid #1e5af9' }}>
                        <Box position="relative" mb={1} >

                          <Typography
                            variant="h1"
                            sx={{
                              fontSize: '90px',
                              fontWeight: 900,
                              color: '#e6eaf0',
                              position: 'absolute',
                              top: '-30px',
                              left: -5,
                              zIndex: 0,
                              lineHeight: 1,
                              userSelect: 'none',
                            }}
                          >
                            Susan
                          </Typography>
                          <Typography
                            variant="h4"
                            sx={{
                              color: '#1e5af9',
                              fontWeight: 800,
                              position: 'relative',
                              zIndex: 1,
                              display: 'inline-block',
                            }}
                          >
                            Susan
                          </Typography>
                        </Box>
                      </Box>
                      <Typography sx={{ color: '#4B5A5B', mt: 2, textAlign: "left" }} component='p' variant='p'>
                        Susan brings a unique combination of marketing expertise, background in legal documentation and contracts, and a customer-centric approach to QRTag.it customer service. Her qualifications in business process improvement, organizational behavior, and contract management, coupled with her deep understanding of user needs, enable her to craft solutions that resonate with customers.
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={12} md={4} display='flex' flexDirection='column' justifyContent='center' sx={{ pt: { xs: 5, md: 0 } }}>
                      <Box sx={{ borderBottom: '2px solid #1e5af9' }}>
                        <Box position="relative" mb={1} >
                          <Typography
                            variant="h1"
                            sx={{
                              fontSize: '90px',
                              fontWeight: 900,
                              color: '#e6eaf0',
                              position: 'absolute',
                              top: '-30px',
                              left: -5,
                              zIndex: 0,
                              lineHeight: 1,
                              userSelect: 'none',
                            }}
                          >
                            Manoj
                          </Typography>
                          <Typography
                            variant="h4"
                            sx={{
                              color: '#1e5af9',
                              fontWeight: 800,
                              position: 'relative',
                              zIndex: 1,
                              display: 'inline-block',
                            }}
                          >
                            Manoj
                          </Typography>
                        </Box>
                      </Box>
                      <Typography sx={{ color: '#4B5A5B', mt: 2, textAlign: "left" }} component='p' variant='p'>
                        With a strategic mindset and entrepreneurial drive, Manoj spearheads QRTag.it’s sales, business development, and monetization strategies. His ability to identify opportunities and craft innovative growth models has been pivotal to the platform’s success. Manoj’s knack for transforming challenges into opportunities ensures that QRTag.it remains a step ahead in delivering exceptional value to its users, making it a preferred choice for secure and reliable QR tag solutions worldwide.
                      </Typography>
                    </Grid>
                  </Grid>

                </CardContent>
              </Card>
            </Grid>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default OurStory


