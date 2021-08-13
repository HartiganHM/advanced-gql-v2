const { ApolloServer, AuthenticationError } = require("apollo-server");
const typeDefs = require("./typedefs");
const resolvers = require("./resolvers");
const { formatDateDirective, FormatDateDirective } = require("./directives");
const { createToken, getUserFromToken } = require("./auth");
const db = require("./db");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives: {
    formatDate: FormatDateDirective,
  },
  context({ req, connection }) {
    const context = { ...db };
    if (connection) {
      return { ...context, ...connection.context };
    }

    const token = req.headers.authtoken;
    const user = getUserFromToken(token);
    return { ...db, user, createToken };
  },
  subscriptions: {
    // params === req.headers
    onConnect(params) {
      const token = params.authToken;
      const user = getUserFromToken(token);
      // Can be used to globally shut down subscription
      if (!user) {
        throw new AuthenticationError("Nope!");
      }

      return { user };
    },
  },
});

server.listen(4000).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
