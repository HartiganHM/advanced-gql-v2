const resolvers = require("../src/resolvers");

describe("resolvers", () => {
  test("feed", () => {
    const modelsMock = {
      models: {
        Post: {
          findMany: jest.fn(() => {
            return ["hello"];
          }),
        },
      },
    };

    const result = resolvers.Query.feed(null, null, modelsMock);

    expect(modelsMock.models.Post.findMany).toHaveBeenCalled();
    expect(result).toEqual(["hello"]);
  });
});
