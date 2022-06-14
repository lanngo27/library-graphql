import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
query {
  allAuthors {
    name,
    born,
    books {
      title
    }
  }
}
`

export const ALL_BOOKS = gql`
query {
  allBooks 
  {
    published
    title
    genres
    author {
      name
    }
  }
}`

export const ALL_BOOKS_OF_GENRE = gql`
query BookOfGenre($genre: String) {
  allBooks(
    genre: $genre
  ) {
    published
    title
    genres
    author {
      name
    }
  }
}`

export const ME = gql`
query {
  me {
    username,
    favoriteGenre
  }
}
`