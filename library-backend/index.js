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
  // TODO: author field on book query
  Author: {
    bookCount: async ({ name }) => {
      // TODO: bookCount on author
      return 0
    },
  },
  Mutation: {
    addBook: async (root, args) => {
      /*
      If we can't find a matching author from db, then insert a new record
      into database. However, we don't know anything about the author other
      than the name, so we will just have to make do with only that.

      And that's why the filter object is same as the update object :)
       */
      const author = await Author.findOneAndUpdate(
        { name: args.author },
        { name: args.author },
        {
          new: true,
          upsert: true,
          runValidators: true,
        }
      ).catch((error) => {
        throw new GraphQLError('Getting author info failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.author,
            error,
          },
        })
      })

      const book = new Book({ ...args, author })
      await book.save()

      return book
    },
    editAuthor: async (root, args) => {
      // TODO: editAuthor mutation
      return null
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
