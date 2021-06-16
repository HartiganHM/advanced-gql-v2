const { ApolloServer } = require("apollo-server");
const gql = require("graphql-tag");

const typeDefs = gql`
  type User {
    id: ID!
    username: String
    createdAt: Int!
  }

  type Settings {
    user: User!
    theme: String!
  }

  input NewSettingsInput {
    user: ID!
    theme: String!
  }

  type Query {
    me: User!
    settings(user: ID!): Settings!
  }

  type Mutation {
    settings(input: NewSettingsInput!): Settings!
  }
`;

const resolvers = {
  Query: {
    me: () => ({
      id: "187324784",
      username: "Hugh",
      cratedAt: 73928579823,
    }),
    settings: (_, { user }) => ({
      user,
      theme: "Dark",
    }),
  },
  Mutation: {
    settings: (_, { input }) => ({
      input,
    }),
  },
  Settings: {
    user: (settings) => ({
      id: "187324784",
      username: "Hugh",
      cratedAt: 73928579823,
    }),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => console.log(`server at ${url}`));
