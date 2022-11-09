import React from 'react'
import { render } from 'react-dom'
import { ApolloProvider } from 'react-apollo'

import { ThemeProvider } from 'react-jss'
import yahaha$ from '@lib/keyboard'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import moment from 'moment'
import 'moment/locale/zh-cn'
import 'react-perfect-scrollbar/dist/css/styles.css'

import mapClient from './client/map_client'
import theme from './theme'
import config from './client'
import './index.less'
import './scrollbar.css'


import App from './app'

moment.updateLocale('zh-cn', {})
const client = mapClient(config)

const ApolloApp = AppComponent => (
  <ThemeProvider theme={theme}>
    <ApolloProvider client={client}>
      <AppComponent />
    </ApolloProvider>
  </ThemeProvider>
)

yahaha$.subscribe(() => console.log('23333'))

render(ApolloApp(App), document.getElementById('app'))
