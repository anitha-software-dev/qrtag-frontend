import { Home, Activity, Settings, Users, File, Search, PlusSquare, List, Square, Tv } from 'react-feather'
import { Circle } from 'react-feather/dist'
import { FaAddressBook, FaAddressCard, FaCircle, FaDraft2Digital, FaQrcode, FaTrain, FaUsers } from 'react-icons/fa'
import { MdFeedback, MdSubscriptions, MdManageAccounts, MdAccountCircle, MdQrCodeScanner } from "react-icons/md"
import { RiSurveyFill } from "react-icons/ri"
import { FiUsers } from "react-icons/fi"
import { SiBrandfolder } from "react-icons/si"

export default [
  {
    id: 'users',
    title: 'Users',
    icon: <FaUsers />,
    navLink: '/users'
  },
  {
    id: 'qrcodes',
    title: 'QR Codes',
    icon: <FaQrcode />,
    navLink: '/qrcodes'
  },
  {
    id: 'feedbacks',
    title: 'Feedbacks',
    icon: <MdFeedback />,
    navLink: '/feedbacks'
  },
  {
    id: 'accounts',
    title: 'Honorary Accounts',
    icon: <MdAccountCircle />,
    navLink: '/accounts'
  },
  {
    id: 'flyerAccounts',
    title: 'Flyer Accounts',
    icon: <MdAccountCircle />,
    navLink: '/flyerAccounts'
  },
  {
    id: 'subscriptions',
    title: 'Subscriptions',
    icon: <MdSubscriptions />,
    navLink: '/subscriptions'
  },
  {
    id: 'surveyUsers',
    title: 'Survey Users',
    icon: <RiSurveyFill />,
    navLink: '/surveyUsers'
  },
  {
    id: 'brandAmbassadors',
    title: 'Brand Ambassadors',
    icon: <SiBrandfolder />,
    navLink: '/brandAmbassadors'
  },
  {
    id: 'digitalMemorial',
    title: 'Digital Memorial',
    icon: <MdQrCodeScanner />,
    navLink: '/digitalMemorial'
  },
  {
    id: 'configurations',
    title: 'Configurations',
    icon: <Settings />,
    navLink: '/configurations'
  }
]
