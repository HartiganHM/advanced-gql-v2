const { SchemaDirectiveVisitor } = require("apollo-server");
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

    field.resolve = async (root, { format, ...rest }, ctx, info) => {
      // When arguments from the user ARE being passed
      const result = await resolver.call(this, root, rest, ctx, info);

      // When arguments from the user are NOT being passed
      // const result = await resolver.apply(this, args);

      return formatDate(result, format || defaultFormat);
    };

    field.type = GraphQLString;
  }
}

module.exports = {
  FormatDateDirective,
};
