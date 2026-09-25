// ** React Imports
import { useState, useEffect } from 'react'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { ChevronDown, Eye, Edit, Search, Trash2, RefreshCcw } from 'react-feather'
import DataTable from 'react-data-table-component'
import { Button, Label, Input, CustomInput, Row, Col, Card, CardBody, Modal, ModalHeader, ModalBody, InputGroup, InputGroupAddon, Badge, Form, FormGroup, ModalFooter } from 'reactstrap'
import { components } from 'react-select'
import QRCode, { QRCodeSVG } from 'qrcode.react'
import BlueLogo from '@src/assets/images/logo/logo-blue.png'

import { useDispatch } from 'react-redux'
import { addDoc, collection, doc, getDoc, getDocs, query, orderBy, limit, onSnapshot, Timestamp, getCountFromServer, startAfter, where, writeBatch, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../../../../configs/firebaseConfig'

// ** Utils
import Breadcrumbs from '@components/breadcrumbs'
import UILoader from '@components/ui-loader'
import Spinner from '@components/spinner/Loading-spinner'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/apps/app-invoice.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { useForm } from 'react-hook-form'
import Config from '@src/configs/config'
import { OpenNotification } from '@src/views/components/Helper'

// ** Custom select components
const OptionComponent = ({ data, ...props }) => {
  return (
    <components.Option {...props}>
      {data.label}
    </components.Option>
  )
}


const CustomHeader = ({ handlePerPage, rowsPerPage, handleExport, downloading }) => {
  return (

    <div className='invoice-list-table-header w-100 py-2'>
      <Row>
        <Col lg='4' className='d-flex align-items-center px-0 px-lg-1'>
          <div className='d-flex align-items-center mr-2'>
            <Label for='rows-per-page'>Show</Label>
            <CustomInput
              className='form-control ml-50 pr-3'
              type='select'
              id='rows-per-page'
              value={rowsPerPage}
              onChange={handlePerPage}
            >
              <option value='10'>10</option>
              <option value='25'>25</option>
              <option value='50'>50</option>
            </CustomInput>
          </div>

        </Col>
        <Col
          lg='8'
          className='actions-right d-flex align-items-center justify-content-lg-end flex-lg-nowrap flex-wrap mt-lg-0 mt-1 pr-lg-1 p-0'
        >

        </Col>
      </Row>
    </div>
  )
}

const QRList = () => {

  const dispatch = useDispatch()

  const [value, setValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [statusValue, setStatusValue] = useState('')
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [qrList, setQRList] = useState([])
  const [totalRecords, setTotalRecords] = useState(0)
  const [fetching, setFetching] = useState(false)
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [viewModal, setViewModal] = useState(false)
  const [editInfo, setEditInfo] = useState(null)
  const [addModal, setAddModal] = useState(false)
  const [qrvalue, setQRvalue] = useState('')
  const [editModal, setEditModal] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [search, setSearch] = useState('')

  const [used, setUsed] = useState('')
  const [usedEdit, setUsedEdit] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const { register, control, handleSubmit, formState: { errors }, reset } = useForm()

  function randomString() {
    const length = 23
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let result = ''
    for (let i = length; i > 0; --i) {
      result += chars[Math.floor(Math.random() * chars.length)]
    }
    return result
  }

  const generateUniqueString = async () => {
    let unique = false
    let newString
    const collectionRef = collection(db, 'qrtags')

    while (!unique) {
      newString = randomString()
      const q = query(collectionRef, where("uuid", "==", newString))
      const querySnapshot = await getDocs(q)
      if (querySnapshot.empty) {
        unique = true
      }
    }

    return newString
  }

  const handleAdd = async () => {
    setQRvalue('')
    setEditModal(null)
    setAddModal(!addModal)
    const number = await generateUniqueString()
    setQRvalue(number)
  }

  // GET QR CODE LISTS
  // const getQRList = async (param = {}) => {
  //   setLoading(true)
  //   try {
  //     const collectionRef = collection(db, 'qrtags')
  //     let q = query(collectionRef, orderBy('createdAt', 'desc'), limit(rowsPerPage))
  //     console.log('param', param.page)
  //     if (param.page && param.page > 1) {
  //       const lastVisibleIndex = (param.page - 1) * rowsPerPage
  //       const lastVisibleDoc = (await getDocs(query(collectionRef, orderBy('createdAt', 'desc'), limit(lastVisibleIndex)))).docs[lastVisibleIndex - 1]
  //       q = query(collectionRef, orderBy('createdAt', 'desc'), startAfter(lastVisibleDoc), limit(rowsPerPage))
  //     }

  //     const querySnapshot = await getDocs(q)
  //     const results = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
  //     setQRList(results)

  //     const countSnapshot = await getCountFromServer(collectionRef)
  //     setTotalRecords(countSnapshot.data().count)
  //   } catch (error) {
  //     console.error('Error fetching records:', error)
  //   }
  //   setLoading(false)
  // }

  const getQRList = async (param = {}) => {
    setLoading(true)
    try {
      const collectionRef = collection(db, 'qrtags')
      let q

      // Check if `used` param exists, if it does, build the query accordingly
      if (used !== '') {
        // Query to get records where `used` matches the param
        q = query(
          collectionRef,
          where('used', '==', used),
          limit(rowsPerPage)
        )

        if (param.page && param.page > 1) {
          const lastVisibleIndex = (param.page - 1) * rowsPerPage
          const lastVisibleDocSnapshot = (await getDocs(query(
            collectionRef,
            where('used', '==', used),
            limit(lastVisibleIndex)
          ))).docs[lastVisibleIndex - 1]
          q = query(
            collectionRef,
            where('used', '==', used),
            startAfter(lastVisibleDocSnapshot),
            limit(rowsPerPage)
          )
        }

        const countQuery = query(
          collectionRef,
          where('used', '==', used)
        )

        const countSnapshot = await getCountFromServer(countQuery)
        setTotalRecords(countSnapshot.data().count)

      } else {
        // Standard query without `used` filter
        // q = query(collectionRef, orderBy('createdAt', 'desc'), limit(rowsPerPage))
        q = query(collectionRef, orderBy('createdAt', 'desc'), limit(rowsPerPage))

        if (param.page && param.page > 1) {
          const lastVisibleIndex = (param.page - 1) * rowsPerPage
          const lastVisibleDoc = (await getDocs(query(collectionRef, orderBy('createdAt', 'desc'), limit(lastVisibleIndex)))).docs[lastVisibleIndex - 1]
          q = query(collectionRef, orderBy('createdAt', 'desc'), startAfter(lastVisibleDoc), limit(rowsPerPage))
        }

        const countSnapshot = await getCountFromServer(collectionRef)
        setTotalRecords(countSnapshot.data().count)
      }

      // Fetch the documents based on the query
      const querySnapshot = await getDocs(q)
      const results = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
      setQRList(results)

    } catch (error) {
      console.error('Error fetching records:', error)
    }

    setLoading(false)
  }

  useEffect(() => {
    if (used === '') {
      setCurrentPage(1)
      getQRList({ page: 1 })
    } else {
      getQRList()
    }
    // getQRList()

  }, [rowsPerPage, used])


  const onSubmit = async (data) => {
    const collectionRef = collection(db, 'qrtags')

    if (editModal) {
      console.log('edited')

      const q = query(collectionRef, where("uuid", "==", data.qrcode))
      const querySnapshot = await getDocs(q)
      const results = querySnapshot.docs.map(doc => doc.data())


      if (results.length > 0 && querySnapshot.docs[0].id !== editModal.id) {
        OpenNotification('error', 'Oops!', 'QR Code already exists')
        return
      }

      // Reference the document directly by its ID (editModal.id)
      const docRef = doc(collectionRef, editModal.id)

      const updateData = {
        uuid: data.qrcode,
        used: usedEdit
      }

      if (usedEdit === 'Yes') {

        updateData.user = {
          name,
          email
        }
      } else {

        updateData.user = {
          name: '',
          email: ''
        }
      }

      try {

        await updateDoc(docRef, updateData)

        OpenNotification('success', 'Success!', 'QR Code updated successfully')
        getQRList()
        setAddModal(false)
        setEditModal(null)
      } catch (error) {
        console.error('Error updating QR code:', error)
        OpenNotification('error', 'Oops!', 'Failed to update QR Code')
      }

    } else {
      console.log('added')

      const q = query(collectionRef, where("uuid", "==", data.qrcode))
      const querySnapshot = await getDocs(q)
      const results = querySnapshot.docs.map(doc => doc.data())

      // Check if the QR code exists in the qrtags collection
      if (results.length > 0) {
        OpenNotification('error', 'Oops!', 'QR Code already exists')
      } else {
        // Add the new QR code to the collection
        await addDoc(collectionRef, { uuid: data.qrcode, url: `https://qrtag.it/uuid/${data.qrcode}`, createdAt: Timestamp.now() })
        OpenNotification('success', 'Success!', 'QR Code added successfully')
        // Refresh the list table
        getQRList()
        setAddModal(false)
      }
    }
  }

  const handleEdit = (row) => {
    console.log('row value', row)
    setQRvalue(row.uuid)
    setUsedEdit(row.used ? row.used : 'No')
    setName(row.user && row.user.name)
    setEmail(row.user && row.user.email)
    setEditModal(row)
    setAddModal(!addModal)
  }

  const handleDelete = (row) => {
    setDeleteModal(!deleteModal)
    console.log('deleteid', row.id)
    setDeleteId(row.id)
  }

  const onDeleteQRCode = async () => {
    try {
      const docRef = doc(collection(db, 'qrtags'), deleteId)
      await deleteDoc(docRef)
      setDeleteModal(!deleteModal)
      getQRList()
      OpenNotification('success', 'Success!', 'QR Code deleted successfully')
    } catch (error) {
      console.error('Error deleting QR code:', error)
      OpenNotification('error', 'Oops!', 'Failed to delete QR Code')
    }
  }

  const handleSearch = async () => {

    if (search.length >= 3) {
      setLoading(true)
      try {
        const collectionRef = collection(db, 'qrtags')
        const querySnapshot = await getDocs(collectionRef)

        const results = querySnapshot.docs
          .map(doc => doc.data())
          .filter(doc => {
            const uuidMatch = doc.uuid && doc.uuid.toLowerCase().includes(search.toLowerCase())
            const emailMatch = doc.user?.email && doc.user.email.toLowerCase().includes(search.toLowerCase())
            const nameMatch = doc.user?.name && doc.user.name.toLowerCase().includes(search.toLowerCase())

            return uuidMatch || emailMatch || nameMatch
          })

        setQRList(results)
        setTotalRecords(results.length)
      } catch (error) {
        console.error('Error searching QR tags:', error)
      }
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSearch('')
    getQRList()
  }

  const handlePerPage = e => {
    setRowsPerPage(parseInt(e.target.value))
    // getQRList({ limit: parseInt(e.target.value) })
  }

  const handleStatusValue = e => {
    getQRList(e.target.value)
  }

  const handlePagination = page => {
    setCurrentPage(page.selected + 1)
    getQRList({ page: page.selected + 1 })
  }

  // useEffect(() => {
  //   getQRList()
  // }, [rowsPerPage])

  // const getQRUsedList = async () => {

  //   setLoading(true)
  //   try {
  //     const collectionRef = collection(db, 'qrtags')

  //     // Base query with filter on 'used'
  //     const q = query(
  //       collectionRef,
  //       where('used', '==', used),
  //       limit(rowsPerPage)
  //     )

  //     // Fetch the documents
  //     const querySnapshot = await getDocs(q)
  //     const results = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
  //     setQRList(results)

  //     const countQuery = query(
  //       collectionRef,
  //       where('used', '==', used)
  //     )

  //     const countSnapshot = await getCountFromServer(countQuery)
  //     setTotalRecords(countSnapshot.data().count)

  //   } catch (error) {
  //     console.error('Error fetching records:', error)
  //   }

  //   setLoading(false)
  // }

  // useEffect(() => {
  //   if (used !== '') {
  //     getQRUsedList()
  //   } else {
  //     getQRList()
  //   }
  // }, [rowsPerPage, used])

  const handleExport = async () => {

  }

  const CustomPagination = () => {
    const count = Number(Math.ceil(totalRecords / rowsPerPage))

    return (
      <div className="d-flex justify-content-between align-items-center p-1">
        <p className='mb-1 ml-1'>Total Entries: {totalRecords}</p>
        <ReactPaginate
          pageCount={count || 1}
          nextLabel=''
          breakLabel='...'
          previousLabel=''
          activeClassName='active'
          breakClassName='page-item'
          breakLinkClassName='page-link'
          forcePage={currentPage !== 0 ? currentPage - 1 : 0}
          onPageChange={page => handlePagination(page)}
          pageClassName={'page-item'}
          nextLinkClassName={'page-link'}
          nextClassName={'page-item next'}
          previousClassName={'page-item prev'}
          previousLinkClassName={'page-link'}
          pageLinkClassName={'page-link'}
          containerClassName={'pagination react-paginate justify-content-end p-1'}
        />
      </div>
    )
  }

  const columns = [
    {
      name: 'Code',
      selector: 'code',
      minWidth: '250px',
      sortable: false,
      cell: row => <>
        {/* <QRCodeSVG value={row.url} level='L' size="40"/> */}
        {row.uuid}
      </>
    },
    {
      name: 'Used?',
      selector: 'used',
      sortable: false,
      cell: row => <>{(row.used === 'Yes') ? 'YES' : 'NO'}</>
    },
    {
      name: 'Owner',
      selector: 'owner',
      minWidth: '250px',
      sortable: false,
      cell: row => <>
        {(row && row.user) ? <>
          <div className='d-flex flex-column'>
            <span className='text-primary font-weight-bold'>{(row.user.name) ? row.user.name : ''}</span>
            <small className='text-truncate mb-0' style={{ whiteSpace: "wrap" }}>{(row.user.email) ? row.user.email : ''}</small>
          </div>
        </> : '-'}
      </>
    },
    {
      name: 'Item',
      selector: 'item',
      sortable: false,
      cell: row => <>{(row.item && row.item.name) ? row.item.name : ''}</>
    },
    {
      name: 'Status',
      selector: 'status',
      sortable: false,
      cell: row => <><Badge pill color='danger'>LOST</Badge></>
    },
    {
      name: 'Action',
      center: true,
      minWidth: '180px',
      cell: row => (
        <>
          <Button.Ripple outline color='secondary' size='sm' onClick={() => { setEditInfo(row); setViewModal(!viewModal) }}>
            <Eye size={14} />
          </Button.Ripple> &nbsp;
          {/* <Button.Ripple outline color='info' size='sm' onClick={() => { handleEdit(row) }}>
            <Edit size={14} />
          </Button.Ripple> &nbsp;
          <Button.Ripple outline color='danger' size='sm' onClick={() => { handleDelete(row) }}>
            <Trash2 size={14} />
          </Button.Ripple> */}
        </>
      )
    }
  ]

  return (
    <>
      <Breadcrumbs breadCrumbParent='QR Codes' breadCrumbActive='List' />

      <Card>
        <CardBody>
          <Row form className='mt-1 mb-50 d-flex align-items-center justify-content-between'>
            <Col md="7" className="d-flex align-items-center justify-content-center">
              <div className='mr-1 w-100'>
                <InputGroup>
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    id='search-code'
                    type='text'
                    placeholder="Search"
                  />
                  <InputGroupAddon addonType='append'>
                    <Button onClick={() => handleSearch()} color='secondary' outline style={{ height: "38px" }}>
                      <Search size={14} />
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </div>
              <Button color='secondary' onClick={() => handleReset()} title="Reset">
                <RefreshCcw size={14} />
              </Button>

              <CustomInput
                className='form-control ml-2 w-50'
                type='select'
                id='used'
                value={used}
                onChange={(e) => setUsed(e.target.value)}
              >
                <option value=''>ALL</option>
                <option value='Yes'>USED</option>
                <option value='No'>UNUSED</option>
              </CustomInput>

            </Col>

            {/* <Col md="2">
              <CustomInput
                className='form-control'
                type='select'
                id='used'
              // value={rowsPerPage}
              // onChange={handlePerPage}
              >
                <option value='All'>ALL</option>
                <option value='Used'>USED</option>
                <option value='Unused'>UNUSED</option>
              </CustomInput>
            </Col> */}

            <Col md="2">
              <Button.Ripple color='primary' className="w-100" onClick={handleAdd}>
                Add QR Code
              </Button.Ripple>
            </Col>
          </Row>
        </CardBody>
      </Card>
      <div className='invoice-list-wrapper'>
        <UILoader blocking={downloading} loader={<Spinner />}>
          <Card>
            <div className='invoice-list-dataTable mb-3'>
              <DataTable
                noHeader
                pagination
                paginationServer
                subHeader={true}
                columns={columns}
                responsive={true}
                sortIcon={<ChevronDown />}
                className='react-dataTable'
                defaultSortField='invoiceId'
                progressPending={loading}
                progressComponent={<div className="py-6 d-flex align-items-center"><Spinner className="w-14 text-secondary mr-1" /></div>}
                paginationDefaultPage={currentPage}
                paginationComponent={CustomPagination}
                data={qrList}
                subHeaderComponent={
                  <CustomHeader
                    value={value}
                    statusValue={statusValue}
                    rowsPerPage={rowsPerPage}
                    handlePerPage={handlePerPage}
                    handleStatusValue={handleStatusValue}
                    handleExport={handleExport}
                    downloading={downloading}
                  />
                }
              />
            </div>

          </Card>
        </UILoader>
      </div>

      <Modal isOpen={viewModal} toggle={() => setViewModal(!viewModal)} className='modal-dialog-centered' size="md">
        <ModalHeader toggle={() => setViewModal(!viewModal)}>View QR Code</ModalHeader>
        <ModalBody>
          <Row>
            <Col md='12'>
              <dl className='view-recipient'>
                <Row>
                  <Col className="mb-2" md='5'>
                    {/* Wrapper to position QRCode and text */}
                    <div className='d-flex align-items-center justify-content-center' style={{ position: 'relative', width: '160px', height: '160px', boxShadow: '0 0px 5px 2px rgba(34,41,47,.1)' }}>
                      {/* QR Code */}
                      <QRCodeSVG
                        value={(editInfo && editInfo.uuid) && `${Config.SITE_URL}/uuid/${editInfo.uuid}`}
                        level='L'
                        size="100"
                      // imageSettings={{ src: BlueLogo, width: 50, height: 50, excavate: true }}
                      />

                      {/* Top text */}
                      <div style={{ position: 'absolute', top: '5px', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontWeight: 'bold', color: '#000' }}>
                        QRTag.it
                      </div>

                      {/* Right text - vertical */}
                      <div style={{ position: 'absolute', top: '50%', right: '-15px', transform: 'translateY(-50%) rotate(-90deg)', whiteSpace: 'nowrap', color: '#000' }}>
                        Scan Me!
                      </div>

                      {/* Bottom text */}
                      <div style={{ position: 'absolute', bottom: '5px', left: '50%', transform: 'translateX(-50%) rotate(180deg)', whiteSpace: 'nowrap', fontWeight: 'bold', color: '#000' }}>
                        QRTag.it
                      </div>

                      {/* Left text - vertical */}
                      <div style={{ position: 'absolute', top: '50%', left: '-25px', transform: 'translateY(-50%) rotate(-90deg)', whiteSpace: 'nowrap', color: '#000' }}>
                        Found me?
                      </div>
                    </div>
                  </Col>

                  <Col className="mb-2" md='7'>
                    <Row>
                      <Col md='4' className="mb-2"><strong>USED?</strong> <dd>{(editInfo && editInfo.used && editInfo.used === 'Yes') ? 'YES' : 'NO'}</dd></Col>
                      <Col md='8' className="mb-2"><strong>OWNER</strong> {(editInfo && editInfo.user) ? <><dd>{(editInfo.user.name) ? editInfo.user.name : ''}</dd></> : <dd>-</dd>}</Col>
                      <Col md='4' className="mb-2"><strong>STATUS</strong> <dd><Badge pill color='danger' className="px-2">Lost</Badge></dd></Col>
                      <Col md='8' className="mb-2"><strong>ITEM</strong> <dd>{(editInfo && editInfo.item && editInfo.item.name) ? editInfo.item.name : '-'}</dd></Col>
                    </Row>
                  </Col>

                  <Col md='12'><strong>CODE</strong> <dd>{editInfo && editInfo.uuid}</dd></Col>
                  <Col md='12'><strong>URL</strong> <dd>{(editInfo && editInfo.uuid) ? `${Config.SITE_URL}/uuid/${editInfo.uuid}` : ''}</dd></Col>
                </Row>
              </dl>
            </Col>
          </Row>
        </ModalBody>
      </Modal>


      <Modal isOpen={addModal} toggle={() => setAddModal(!addModal)}>
        <ModalHeader toggle={() => setAddModal(!addModal)}>{editModal ? 'Edit' : 'Add'} QR Code</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <Label for="qrcode">
                Code
              </Label>
              <Input
                id="qrcode"
                name="qrcode"
                innerRef={register({ required: true })}
                placeholder="Enter Code"
                type="text"
                value={qrvalue}
                onChange={(e) => setQRvalue(e.target.value)}
              />
            </FormGroup>

            <FormGroup className={editModal ? '' : 'd-none'}>
              <Label for="usedEdit">
                Used
              </Label>
              {/* <br /> */}
              <CustomInput
                className='form-control ml-2 w-50'
                type='select'
                id='usedEdit'
                value={usedEdit}
                onChange={(e) => setUsedEdit(e.target.value)}
              >
                {/* <option value=''>ALL</option> */}
                <option value='Yes'>Yes</option>
                <option value='No'>No</option>
              </CustomInput>
            </FormGroup>

            <div className={usedEdit === 'Yes' ? '' : 'd-none'}>
              <h5>
                Owner Details
              </h5>
              <FormGroup>
                <Label for="name">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  // innerRef={register({ required: true })}
                  placeholder="Enter Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label for="email">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  // innerRef={register({ required: true })}
                  placeholder="Enter Email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormGroup>
            </div>

            <ModalFooter className="d-flex justify-content-start px-0">
              <Button color="secondary" onClick={() => setAddModal(!addModal)}>
                Close
              </Button>{' '}
              <Button color="primary" type="submit">
                Submit
              </Button>
            </ModalFooter>

          </Form>
        </ModalBody>
      </Modal>

      {/* Delete QR Detail */}
      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(!deleteModal)}>
        <ModalHeader toggle={() => setDeleteModal(!deleteModal)}>Delete QR Code</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit(onDeleteQRCode)}>
            <FormGroup>
              <Label for="">
                Do you want to delete the QR Code ?
              </Label>
            </FormGroup>
            <ModalFooter className="d-flex justify-content-start px-0">
              <Button color="secondary" onClick={() => setDeleteModal(!deleteModal)}>
                No
              </Button>{' '}
              <Button color="primary" type="submit">
                Yes
              </Button>
            </ModalFooter>
          </Form>
        </ModalBody>
      </Modal>
    </>
  )
}

export default QRList
