import { lazy } from 'react'

const DashboardRoutes = [
  // Dashboards
  {
    path: '/users',
    component: lazy(() => import('../../views/apps/users/list')),
    exact: true
  },
  {
    path: '/qrcodes',
    component: lazy(() => import('../../views/apps/qrcodes/list')),
    exact: true
  },
  {
    path: '/feedbacks',
    component: lazy(() => import('../../views/apps/feedbacks/list')),
    exact: true
  },
  {
    path: '/accounts',
    component: lazy(() => import('../../views/apps/accounts/list')),
    exact: true
  },
  {
    path: '/honorary-requests',
    component: lazy(() => import('../../views/apps/honoraryRequests/list')),
    exact: true
  },
  {
    path: '/flyerAccounts',
    component: lazy(() => import('../../views/apps/flyerAccounts/list')),
    exact: true
  },
  {
    path: '/subscriptions',
    component: lazy(() => import('../../views/apps/subscriptions/list')),
    exact: true
  },
  {
    path: '/surveyUsers',
    component: lazy(() => import('../../views/apps/surveyUsers/list')),
    exact: true
  },
  {
    path: '/surveyUsers/view/:id',
    component: lazy(() => import('../../views/apps/surveyUsers/view')),
    exact: true
  },
  {
    path: '/brandAmbassadors',
    component: lazy(() => import('../../views/apps/brandAmbassadors/list')),
    exact: true
  },
  {
    path: '/digitalMemorial',
    component: lazy(() => import('../../views/apps/digitalMemorial/list')),
    exact: true
  },
  {
    path: '/digitalMemorial/add',
    component: lazy(() => import('../../views/apps/digitalMemorial/add')),
    exact: true
  },
  {
    path: '/digitalMemorial/edit/:id',
    component: lazy(() => import('../../views/apps/digitalMemorial/add')),
    exact: true
  },
  {
    path: '/digitalMemorial/view/:id',
    component: lazy(() => import('../../views/apps/digitalMemorial/view')),
    exact: true
  },
  {
    path: '/configurations',
    component: lazy(() => import('../../views/apps/configurations/list')),
    exact: true
  },
  {
    path: '/configurations/survey/view/:id',
    component: lazy(() => import('../../views/apps/configurations/surveyForm')),
    exact: true
  }
]

export default DashboardRoutes
