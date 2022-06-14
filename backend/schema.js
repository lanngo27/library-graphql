const { gql } = require('apollo-server')

const typeDefs = gql`
  type Book {
    title: String!,
    published: Int!,
    author: Author!,
    id: ID!,
    genres: [String!]!
  }

  type Author {
    name: String!,
    id: ID!,
    born: Int,
    books: [Book!]!
    bookCount: Int
  }

  type User {
    username: String!
    passwordHash: String!
    favoriteGenre: String!
    id: ID!
  }
  
  type Token {
    value: String!
  }  
  
  type bookAuthor {
    book: Book!
    author: Author!
  }
  
  type Subscription {
    bookAdded: bookAuthor!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      password: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`

module.exports = typeDefs