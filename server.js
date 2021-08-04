const {
  ApolloServer,
  PubSub,
  SchemaDirectiveVisitor,
} = require("apollo-server");
const gql = require("graphql-tag");
const { defaultFieldResolver, GraphQLString } = require("graphql");

const pubSub = new PubSub();
const NEW_ITEM = "NEW_ITEM";

/**
 * Schema Directives use @ sign followed by the directive name and are placed
 * to the right of the field; will continue to return if available, but will
 * show a warning in the schema/docs
 *
 * Instrumentation at the schema level (added meta data)
 *
 * Client side directives:
 *   - @include (if: $yes)
 *   - @skip
 *   - @live
 *
 * !Lodash GraphQL client side directives
 */

class LogDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const resolver = field.resolver || defaultFieldResolver;

    field.args.push({
      type: GraphQLString,
      name: "message",
    });

    field.resolve = (root, { message, ...rest }, ctx, info) => {
      const { message: schemaMessage } = this.args;
      console.log("🔥 Hello!", message || schemaMessage);
      return resolver.call(this, root, rest, ctx, info);
    };
  }
}

const typeDefs = gql`
  directive @log(message: String = "my message") on FIELD_DEFINITION

  type User {
    id: ID! @log(message: "Id here")
    error: String!
      @deprecated(reason: "Beacause I said so, use the other field")
    username: String
    createdAt: String!
  }

  type Settings {
    user: User!
    theme: String!
  }

  input NewSettingsInput {
    user: ID!
    theme: String!
  }

  type Item {
    task: String!
  }

  type Query {
    me: User!
    settings(user: ID!): Settings!
  }

  type Mutation {
    settings(input: NewSettingsInput!): Settings!
    createItem(task: String): Item!
  }

  type Subscription {
    newItem: Item
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
    createItem: (_, { task }) => {
      const item = { task };
      pubSub.publish(NEW_ITEM, { newItem: item });

      return item;
    },
  },
  Subscription: {
    newItem: {
      subscribe: () => pubSub.asyncIterator(NEW_ITEM),
    },
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
  schemaDirectives: {
    log: LogDirective,
  },
  context({ connection, req }) {
    if (connection) {
      return { ...connection.context };
    }
  },
  subscriptions: {
    // params === req.headers
    onConnect(params) {},
  },
});

server.listen().then(({ url }) => console.log(`server at ${url}`));
