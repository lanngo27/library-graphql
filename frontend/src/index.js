import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache, split } from '@apollo/client'
import { setContext } from 'apollo-link-context'
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'
import { BrowserRouter as Router } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

var loc = window.location, wsUri
if (loc.protocol === 'https:') {
  wsUri = 'wss:'
} else {
  wsUri = 'ws:'
}
wsUri += '//' + loc.host + loc.pathname + '/graphql'

const wsLink = new WebSocketLink({
  uri: wsUri,
  options: {
    reconnect: true
  }
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('library-user')
  return {
    headers:{
      ...headers,
      authorization: token ? `bearer ${token}` : null
    }
  }
})

const httpLink = new HttpLink({
  uri: '/graphql'
})

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  authLink.concat(httpLink)
)

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          allBooks: {
            merge(existing, incoming) {
              return incoming
            }
          }
        }
      }
    }
  }),
  link: splitLink
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <App />
    </Router>
  </ApolloProvider>
  , document.getElementById('root')
)
