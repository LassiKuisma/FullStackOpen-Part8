const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')

const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')
const { GraphQLError } = require('graphql')

mongoose.set('strictQuery', false)
require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI
console.log('connecting to mongo...')

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to mongo')
  })
  .catch((error) => {
    console.log('error connection to mongo:', error.message)
  })

const typeDefs = `
  type Author {
    name: String!
    born: Int
    bookCount: Int!
    id: ID!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
`

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      // TODO: filter by genre
      // TODO: filter by author
      return Book.find({})
    },
    allAuthors: async () => Author.find({}),
  },
  Book: {
    author: async (root) => Author.findById(root.author),
  },
  Author: {
    bookCount: async ({ name }) => {
      // TODO: bookCount on author
      return 0
    },
  },
  Mutation: {
    addBook: async (root, args) => {
      const getOrCreateAuthor = async (name) => {
        const author = await Author.findOne({ name })
        if (author) {
          return author
        }

        const created = new Author({ name })
        await created.save().catch((error) => {
          throw new GraphQLError('Failed to create author', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: name,
              error,
            },
          })
        })

        return created
      }

      const author = await getOrCreateAuthor(args.author)

      const book = new Book({ ...args, author })
      await book.save()

      return book
    },
    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })
      author.born = Number(args.setBornTo)

      try {
        author.save()
      } catch (error) {
        throw new GraphQLError('Saving author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        })
      }

      return author
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
