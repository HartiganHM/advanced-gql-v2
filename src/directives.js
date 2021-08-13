const {
  AuthenticationError,
  ForbiddenError,
  SchemaDirectiveVisitor,
} = require("apollo-server");
const { defaultFieldResolver, GraphQLString } = require("graphql");
const { formatDate } = require("./utils");

class FormatDateDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const resolver = field.resolve || defaultFieldResolver;
    const { format: defaultFormat } = this.args;

    field.args.push({
      name: "format",
      type: GraphQLString,
    });

    field.resolve = async (root, { format, ...rest }, context, info) => {
      // When arguments from the user ARE being passed
      const result = await resolver.call(this, root, rest, context, info);

      // When arguments from the user are NOT being passed
      // const result = await resolver.apply(this, args);

      return formatDate(result, format || defaultFormat);
    };

    field.type = GraphQLString;
  }
}

class AuthenticationDirective extends SchemaDirectiveVisitor {
  visitArgumentDefinition(field) {
    // Grab the user from the context
    const resolver = field.resolve || defaultFieldResolver;

    field.resolve = async (root, args, context, info) => {
      if (!context.user) {
        // If the user isn't there throw an error
        throw new AuthenticationError("Not authenticated");
      }

      return resolver(root, args, context, info);
    };
  }
}

class AuthorizationDirective extends SchemaDirectiveVisitor {
  visitArgumentDefinition(field) {
    const resolver = field.resolve || defaultFieldResolver;
    // Grab the role for this.args and compare against user.role
    const { role } = this.args;

    field.resolve = async (root, args, context, info) => {
      if (context.user.role !== role) {
        // If user.role isn't there throw an error
        throw new ForbiddenError(`Not authorized, must be role of ${role}`);
      }

      return resolver(root, args, context, info);
    };
  }
}

module.exports = {
  AuthenticationDirective,
  AuthorizationDirective,
  FormatDateDirective,
};
