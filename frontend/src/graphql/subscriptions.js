import { gql } from '@apollo/client'

export const BOOK_ADDED = gql`
subscription {
  bookAdded {
    book {
      published
      title
      genres
      author {
        name
      }
    }
    author {
      name
      born
      books {
        title
      }
    }
  }
}
`