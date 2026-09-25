import { Fragment } from 'react'
import Avatar from '@components/avatar'
import { CheckCircle, X } from 'react-feather'
import { toast } from 'react-toastify'
import moment from 'moment-timezone'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

const OpenToast = ({ color, title, message }) => (
  <Fragment>
    <div className='toastify-header'>
      <div className='title-wrapper'>
        <Avatar size='sm' color={color} icon={(color === 'success') ? <CheckCircle size={12} /> : <X size={12} />} />
        <h6 className='toast-title'>{title}</h6>
      </div>
    </div>
    <div className='toastify-body'>
      <span>{message && message.charAt(0).toUpperCase() + message.slice(1)}</span>
    </div>
  </Fragment>
)

const OpenNotification = (type, title, message) => {
  toast[type](<OpenToast color={(type === 'error') ? 'danger' : type} title={title} message={message} />, {
    position: "top-right",
    autoClose: 6000,
    hideProgressBar: true
  })
}

const formatPhone = (value) => {

  if (value === null) {
    return ''
  }

  const phoneNumber = value.replace(/[^\d]/g, '')
  const phoneNumberLength = phoneNumber.length

  if (phoneNumberLength < 4) return phoneNumber

  if (phoneNumberLength < 7) {
    return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3)}`
  }

  if (phoneNumberLength <= 10) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`
  }

  return `+${phoneNumber.slice(0, phoneNumberLength - 10)} (${phoneNumber.slice(phoneNumberLength - 10, phoneNumberLength - 7)}) ${phoneNumber.slice(phoneNumberLength - 7, phoneNumberLength - 4)}-${phoneNumber.slice(phoneNumberLength - 4)}`

}

const formatPhoneNumber = (number, code) => {
  try {
    const parsed = parsePhoneNumberFromString(number, code)?.formatInternational() || ''
    if (parsed) {
      return formatPhone(parsed)
    } else {
      return formatPhone(number)
    }
  } catch (e) {
    console.error(e)
    return formatPhone(number)
  }

}

function displayErrors(errors) {
  if (Array.isArray(errors)) {
    return errors.join("\n")
  } else if (typeof errors === "object") {
    return Object.entries(errors).map(([key, value]) => {
      if (value.constructor.name === "Object") {
        return Object.entries(value).map(([k, v]) => {
          return `${key.toLowerCase().split('_').map((str) => { return str[0].toUpperCase() + str.substring(1) }).join(" ")}: ${v}`
        })
      } else if (value.constructor.name === "Array") {
        return value.map((k, v) => {
          if (k.constructor.name === "String") {
            return `${key.toLowerCase().split('_').map((str) => { return str[0].toUpperCase() + str.substring(1) }).join(" ")}: ${k}`
          }
        })
      } else {
        return `${key.toLowerCase().split('_').map((str) => { return str[0].toUpperCase() + str.substring(1) }).join(" ")}: ${value}`
      }
    })
  } else {
    return errors
  }
}

const localTimeZone = (dateTime) => {

  const utcDate = moment.utc(dateTime) // Example UTC date

  // Get the user's local timezone
  const localTimezone = moment.tz.guess()

  // Convert the UTC date to the user's local timezone
  const localDate = utcDate.tz(localTimezone)

  // Format the date as needed
  return localDate.format('YYYY-MM-DD h:mm A')

}

const localTimeZoneDate = (dateTime) => {

  const utcDate = moment.utc(dateTime) // Example UTC date

  // Get the user's local timezone
  const localTimezone = moment.tz.guess()

  // Convert the UTC date to the user's local timezone
  const localDate = utcDate.tz(localTimezone)

  // Format the date as needed
  return localDate.format('YYYY-MM-DD')

}

export { OpenNotification, formatPhone, displayErrors, localTimeZone, formatPhoneNumber, localTimeZoneDate }