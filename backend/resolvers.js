const { UserInputError } = require('apollo-server')
const bcrypt = require('bcrypt')
const Book = require('./models/Book')
const Author = require('./models/Author')
const User = require('./models/User')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')

const pubsub = new PubSub()

const JWT_SECRET = process.env.JWT_SECRET

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (!author) return []
        if(args.genre) {
          return Book.find({ author: author.id, genres: { $in: [args.genre] } }).populate('author')
        }
        return Book.find({ author: author.id }).populate('author')
      }
      if(args.genre) {
        return Book.find({ genres: { $in: [args.genre] } }).populate('author')
      }
      return Book.find({}).populate('author')
    },
    allAuthors: async () => {
      const authors = await Author.find({}).populate('books')
      return authors.map(a => {
        return {
          name: a.name,
          id: a.id,
          born: a.born,
          books: a.books,
          bookCount: a.books.length
        }
      })
    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const existingBook = await Book.findOne({ title: args.title })
      if (existingBook) {
        throw new UserInputError('Book existed', {
          invalidArgs: args,
        })
      }
      if ( !context.currentUser ) {
        throw new UserInputError('Not authenticated')
      }
      if ( args.author.length < 4 ) {
        throw new UserInputError('Author name should be at least 4 characters long')
      }
      if ( args.title.length < 2 ) {
        throw new UserInputError('Book title should be at least 2 characters long')
      }

      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({
          name: args.author,
          books: []
        })
        try {
          await author.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        }
      }
      const newBook = new Book({ ...args, author: author })

      try {
        await newBook.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }

      const updatedAuthor = await Author.findOneAndUpdate({ name: args.author }
        , { $push: { books: newBook } }
        , { new: true }).populate('books')

      pubsub.publish('BOOK_ADDED', { bookAdded: { book: newBook, author: updatedAuthor } })

      return newBook
    },
    editAuthor: async (root, args, context) => {
      if ( !context.currentUser ) {
        throw new UserInputError('Not authenticated')
      }

      return Author.findOneAndUpdate({ name: args.name }
        , { born: args.setBornTo }
        , { new: true }
      )
    },
    createUser: async (root, args) => {
      const { username, password, favoriteGenre } = args
      const existingBook = await User.findOne({ username })
      if (existingBook) {
        throw new UserInputError('User existed', {
          invalidArgs: args,
        })
      }

      if (!password || password.length <3) {
        throw new UserInputError('Password must be given with length at least 3 characters long', {
          invalidArgs: args,
        })
      }

      const saltRounds = 10
      const passwordHash = await bcrypt.hash(password, saltRounds)

      const user = new User({
        username
        , passwordHash
        , favoriteGenre
      })


      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(args.password, user.passwordHash)

      if ( !passwordCorrect ) {
        throw new UserInputError('Wrong credentials')
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }

      return {
        value: jwt.sign(userForToken, JWT_SECRET)
      }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    }
  }
}

module.exports = resolvers