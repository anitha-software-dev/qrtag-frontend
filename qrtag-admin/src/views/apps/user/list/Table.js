// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** Invoice List Sidebar
import { Link } from 'react-router-dom'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { ChevronDown, Trash2, Search, Eye } from 'react-feather'
import { Edit } from 'react-feather/dist'
import DataTable from 'react-data-table-component'
import { Card, Input, Row, Col, Label, CustomInput, Button, InputGroup, InputGroupAddon, Modal, ModalHeader, ModalBody, Form, FormGroup } from 'reactstrap'
import Breadcrumbs from '@components/breadcrumbs'
import { Service } from '@src/services/Service'
import { formatPhoneNumber } from '@src/views/components/Helper'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Spinner from '@components/spinner/Loading-spinner'

const MySwal = withReactContent(Swal)

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { useForm } from 'react-hook-form'

// ** Table Header
const CustomHeader = ({ handlePerPage, rowsPerPage, handleFilter, searchTerm, setSearchTerm }) => {
  return (
    <div className='invoice-list-table-header w-100 mr-1 ml-50 mt-2 mb-75'>
      <Row>
        <Col xl='6' className='d-flex align-items-center p-0'>
          <div className='d-flex align-items-center w-100'>
            <Label for='rows-per-page'>Show</Label>
            <CustomInput
              className='form-control mx-50'
              type='select'
              id='rows-per-page'
              value={rowsPerPage}
              onChange={handlePerPage}
              style={{
                width: '5rem',
                padding: '0 0.8rem',
                backgroundPosition: 'calc(100% - 3px) 11px, calc(100% - 20px) 13px, 100% 0'
              }}
            >
              <option value='10'>10</option>
              <option value='25'>25</option>
              <option value='50'>50</option>
            </CustomInput>
            <Label for='rows-per-page'>Entries</Label>
          </div>
        </Col>
        <Col
          xl='6'
          className='d-flex align-items-sm-center justify-content-lg-end justify-content-start flex-lg-nowrap flex-wrap flex-sm-row flex-column pr-lg-1 p-0 mt-lg-0 mt-1'
        >
          <div className='mr-1'>
            <InputGroup>
              <Input
                id='search-invoice'
                type='text'
                value={searchTerm}
                placeholder="Search"
                onChange={e => setSearchTerm(e.target.value)}
              />
              <InputGroupAddon addonType='append'>
                <Button color='secondary' outline onClick={handleFilter}>
                  <Search size={14} />
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </div>
          <Button.Ripple color='primary' tag={Link} to={`/clients/create`}>
            Add New Client
          </Button.Ripple>
        </Col>
      </Row>
    </div>
  )
}

const UsersList = () => {

  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalRecords, setTotalrecords] = useState(0)
  const [userList, setUserList] = useState([])
  const [viewModal, setViewModal] = useState(false)
  const [editInfo, setEditInfo] = useState(null)
  const [loading, setLoading] = useState(false)

  const getUserList = (param) => {
    const params = { page: currentPage, limit: rowsPerPage }

    if (searchTerm && searchTerm !== '') {
      params.keyword = searchTerm
    }
    if (param && param.page) {
      params.page = param.page
    }
    if (param && param.limit) {
      params.limit = param.limit
    }
    setLoading(true)
    Service.get({
      url: `/client/?${new URLSearchParams(params).toString()}`
    }).then(response => {
      setLoading(false)
      if (response) {
        setTotalrecords(response.total_records)
        if (response.data && response.data.length > 0) {
          setUserList(response.data)
        } else {
          setUserList([])
        }
      }
    }).catch(err => {
      setUserList([])
      setLoading(false)
    })
  }

  useEffect(() => {
    getUserList()
  }, [])

  const handlePagination = page => {
    setCurrentPage(page.selected + 1)
    getUserList({ page: page.selected + 1 })
  }

  const handlePerPage = e => {
    const value = parseInt(e.currentTarget.value)
    setRowsPerPage(value)
    getUserList({ limit: value })
  }

  const handleFilter = val => {
    getUserList()
  }

  { /* DELETE CLIENTS */ }
  const handleDelete = (row) => {

    return MySwal.fire({
      title: 'Are you sure?',
      text: "You want to delete this Client!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete',
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-outline-secondary ml-1'
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        Service.delete({
          url: `/client/${row.id}/`
        }).then(response => {

          if (response.status === true) {
            MySwal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Client has been deleted successfully!',
              customClass: {
                confirmButton: 'btn btn-outline-secondary'
              }
            })
            getUserList()
          } else {
            MySwal.fire({
              icon: 'warning',
              title: 'Oops!',
              text: `Delete Failed!`,
              customClass: {
                confirmButton: 'btn btn-outline-secondary'
              }
            })
          }

        })
      }
    })
  }

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Number(Math.ceil(totalRecords / rowsPerPage))

    return (
      <ReactPaginate
        previousLabel={''}
        nextLabel={''}
        pageCount={count || 1}
        activeClassName='active'
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={page => handlePagination(page)}
        pageClassName={'page-item'}
        nextLinkClassName={'page-link'}
        nextClassName={'page-item next'}
        previousClassName={'page-item prev'}
        previousLinkClassName={'page-link'}
        pageLinkClassName={'page-link'}
        containerClassName={'pagination react-paginate justify-content-end my-2 pr-1'}
      />
    )
  }

  const columns = [
    {
      name: 'Client Name',
      minWidth: '297px',
      selector: 'fullName',
      sortable: true,
      cell: row => (
        <div className='d-flex justify-content-left align-items-center'>
          <div className='d-flex flex-column' onClick={() => { setEditInfo(row); setViewModal(!viewModal) }}>
            <span className='text-primary font-weight-bold'>{row.name}</span>
            <small className='text-truncate mb-0'>{row.email}</small>
          </div>
        </div>
      )
    },
    {
      name: 'Phone Number',
      selector: 'email',
      sortable: true,
      cell: row => <>{row.phone_number}</>
    },
    {
      name: 'Company Name',
      selector: 'role',
      sortable: true,
      cell: row => <>{row.company_name}</>
    },
    {
      name: 'Location',
      selector: 'role',
      sortable: true,
      cell: row => <>{row.city_name}, {row.state_name}</>
    },
    {
      name: 'Actions',
      center: true,
      cell: row => (
        <>
          <Button.Ripple outline color='secondary' size='sm' onClick={() => { setEditInfo(row); setViewModal(!viewModal) }}>
            <Eye size={14} />
          </Button.Ripple> &nbsp;
          <Button.Ripple outline color='info' size='sm' tag={Link} to={`/clients/edit/${row.id}`}>
            <Edit size={14} />
          </Button.Ripple> &nbsp;
          <Button.Ripple outline color='danger' size='sm' onClick={() => handleDelete(row)}>
            <Trash2 size={14} />
          </Button.Ripple>
        </>
      )
    }
  ]

  return (
    <Fragment>
      <Breadcrumbs breadCrumbTitle='Manage Clients' breadCrumbParent='Clients' breadCrumbActive='List' />
      <Card>
        <div className='invoice-list-dataTable mb-3'>
          <DataTable
            noHeader
            pagination
            subHeader
            responsive
            paginationServer
            columns={columns}
            sortIcon={<ChevronDown />}
            className='react-dataTable'
            progressPending={loading}
            progressComponent={<div className="py-6 d-flex align-items-center"><Spinner className="w-14 text-secondary mr-1" /></div>}
            paginationComponent={CustomPagination}
            data={userList}
            subHeaderComponent={
              <CustomHeader
                handlePerPage={handlePerPage}
                rowsPerPage={rowsPerPage}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleFilter={handleFilter}
              />
            }
          />
        </div>
      </Card>

      {/******* VIEW CLIENT DETAIL ********/}
      <Modal isOpen={viewModal} toggle={() => setViewModal(!viewModal)} className='modal-dialog-centered' size="md">
        <ModalHeader toggle={() => setViewModal(!viewModal)}>View Client</ModalHeader>
        <ModalBody>
          <Row>
            <Col md='12'>
              <dl className='view-recipient'>
                <Row>
                  <Col md='6'><strong>Contact Name</strong> <dd>{editInfo && editInfo.name}</dd></Col>
                  <Col md='6'><strong>Company Name</strong> <dd>{editInfo && editInfo.company_name}</dd></Col>
                  <Col md='6'><strong>GST</strong> <dd>{editInfo && editInfo.gst}</dd></Col>
                  <Col md='6' style={{ wordWrap: 'break-word' }}><strong>Address Line 1</strong> <dd>{editInfo && editInfo.address_1}</dd></Col>
                  {(editInfo && editInfo.address_2 && editInfo.address_2 !== null) && <Col md='6'><strong>Address Line 2</strong> <dd>{editInfo && editInfo.address_2 && editInfo.address_2 === "null" ? " " : editInfo.address_2}</dd></Col>}
                  <Col md='6'><strong>City</strong> <dd>{editInfo && editInfo.city_name}</dd></Col>
                  <Col md='6'><strong>State </strong> <dd>{editInfo && editInfo.state_name}</dd></Col>
                  <Col md='6'><strong>Zip Code</strong> <dd>{editInfo && editInfo.zip_code}</dd></Col>
                  <Col md='6'><strong>Phone No</strong> <dd>{editInfo && formatPhoneNumber(editInfo.phone_number)}</dd></Col>
                  <Col md='6' style={{ wordWrap: 'break-word' }}><strong>Email</strong> <dd>{editInfo && editInfo.email}</dd></Col>
                  <Col md='6'><strong>Website URL</strong> <dd>{editInfo && editInfo.website}</dd></Col>
                  <Col md='6'><strong>PAN</strong> <dd>{editInfo && editInfo.pan}</dd></Col>
                </Row>
              </dl>

            </Col>
          </Row>
        </ModalBody>
      </Modal>

    </Fragment>
  )
}

export default UsersList
