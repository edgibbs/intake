import React from 'react'
import {createHistory} from 'history'
import {Router, Route, IndexRoute, useRouterHistory} from 'react-router'
import App from 'common/App'
import HomePage from 'home/HomePage'
import ScreeningPage from 'screenings/ScreeningPage'
import ScreeningSummaryContainer from 'investigations/ScreeningSummaryContainer'
import ContactLogContainer from 'investigations/ContactLogContainer'
import ContactContainer from 'investigations/ContactContainer'
import {config} from 'common/config'

const historyIntake = useRouterHistory(createHistory)({
  basename: config().base_path,
})

const InvestigationPage = (props) => (
  <div>
    <ScreeningSummaryContainer {...props} />
    <ContactLogContainer {...props} />
  </div>
)

export default (
  <Router history={historyIntake} >
    <Route path='/' component={App}>
      <IndexRoute component={HomePage} />
      <Route path='screenings/:id' component={ScreeningPage}/>
      <Route path='screenings/:id/:mode' component={ScreeningPage} />
      <Route path='investigations/:id' component={InvestigationPage} />
      <Route path='investigations/:investigation_id/contacts/new' component={ContactContainer} />
    </Route>
  </Router>
)
