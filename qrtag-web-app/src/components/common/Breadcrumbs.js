import '../css/App.css'
import { Breadcrumbs, Link, Typography } from '@mui/material'

const CustomBreadcrumbs = ({ breadCrumbParent, breadCrumbChild, breadCrumbActive }) => {


    return (
        <>
            <div className='p-3' style={{ backgroundColor: '#eff3fe', textAlign: 'center' }}>
                <div className='container d-flex justify-content-lg-end justify-content-center align-items-center'>
                    <Breadcrumbs
                        separator="/"
                        aria-label="breadcrumb"
                        sx={{
                            fontWeight: 400,
                            marginRight: '1%',
                            fontSize: {
                                xs: '12px',
                                sm: '13px',
                                md: '14px',
                            },
                        }}
                    >
                        <Link underline="hover" color="inherit" href="/">
                            {breadCrumbParent}
                        </Link>
                        {(breadCrumbChild) && (
                            <Typography sx={{
                                fontSize: {
                                    xs: '12px',
                                    sm: '13px',
                                    md: '14px',
                                },
                            }} >{breadCrumbChild}</Typography>
                        )}
                        <Typography sx={{
                            color: '#3c50e0',
                            fontSize: {
                                xs: '12px',
                                sm: '13px',
                                md: '14px',
                            }
                        }}>{breadCrumbActive}</Typography>
                    </Breadcrumbs>
                </div>
            </div>
        </>
    );
};

export default CustomBreadcrumbs;
