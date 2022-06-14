import { gql } from '@apollo/client'

export const ADD_BOOKS = gql`
mutation AddBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
  addBook(
    title: $title, 
    author: $author, 
    published: $published, 
    genres: $genres
  ) {
    title,
    author {
      name,
      born
    },
    published,
    genres
  }
}
`

export const EDIT_AUTHORS = gql`
mutation EditAuthor($name: String!, $setBornTo: Int!) {
  editAuthor(
    name: $name, 
    setBornTo: $setBornTo
  ) {
    name
    born
  }
}
`

export const LOGIN = gql`
mutation login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    value
  }
}
`

export const SIGNUP = gql`
mutation CreateUser($username: String!, $password: String!, $favoriteGenre: String!) {
  createUser(username: $username, password: $password, favoriteGenre: $favoriteGenre
  ) 
  {
    username
  }
}
`