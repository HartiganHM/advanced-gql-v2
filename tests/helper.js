const {ApolloServer} = require('apollo-server')
const { createTestClient } = require('apollo-server-testing')
const typeDefs = require('../src/typedefs')
const resolvers = require('../src/resolvers')

const createTestServer = ctx => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    //* Don't mock all resolvers, only the ones I don't pass above
    //* More control of test cases
    mockEntireSchema: false,
    //* Ignore resolvers and mock out with random data that fits schema
    mocks: true,
    context: () => ctx
  })

  //* Returns an object with query/mutation method
  return createTestClient(server)
}

module.exports = createTestServer
