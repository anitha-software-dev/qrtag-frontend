import React, { useEffect, useState } from 'react'
import '../css/App.css'
import Navbar from '../common/Navbar'
import { useLocation } from 'react-router-dom'
import mixpanel from 'mixpanel-browser'
import { Button, Grid } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TopNavbar from '../common/TopNavContent'
import { GetUserDetails } from '../../services/user'
import Breadcrumbs from '../common/Breadcrumbs'
import Footer from '../common/Footer'

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
      <Breadcrumbs breadCrumbParent='Dashboard' breadCrumbActive='Our Story' />
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
                <CardContent style={{ padding: '20px' }}>

                  <Grid container alignItems='center'>
                    {story ? (
                      <>
                        <Grid item xs={12} sm={12} md={3} display='flex' justifyContent={{ xs: 'center', sm: 'center', lg: 'flex-start' }}>
                          <img src={story.image} alt={story.title} style={{ width: '80%', borderRadius: '10px' }} />
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={9}
                          display='flex'
                          flexDirection='column'
                          alignItems={{ xs: 'center', sm: 'center', lg: 'flex-start' }}
                          justifyContent={{ xs: 'center', sm: 'center', lg: 'flex-start' }}
                          marginTop={{ xs: '2rem', sm: '2rem', lg: '0rem' }}
                        >
                          <h3 className='mb-3' style={{ color: '#1e5af9' }}>
                            <b>{story.title}</b>
                          </h3>
                          <Typography sx={{ textAlign: { xs: 'center', sm: 'center', md: 'left', lg: 'left' } }} style={{ fontSize: '1.2rem' }} component='p' variant='p'>
                            {story.content}
                          </Typography>
                        </Grid>
                      </>
                    ) : (
                      <Typography variant='h6' align='center' style={{ width: '100%' }}>
                        No story found
                      </Typography>
                    )}
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


