// ** Routes Imports
import PagesRoutes from './Pages'
import DashboardRoutes from './Dashboards'

// ** Document title
const TemplateTitle = '%s - Ads AI App'

// ** Default Route
const DefaultRoute = '/qrcodes'

// ** Merge Routes
const Routes = [
  ...DashboardRoutes,
  ...PagesRoutes
]

export { DefaultRoute, TemplateTitle, Routes }
