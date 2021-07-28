const gql = require("graphql-tag");
const createTestServer = require("./helper");
const CREATE_POST = gql`
  mutation {
    createPost(input: { message: "hello" }) {
      message
    }
  }
`;

describe("mutations", () => {
  test("createPost", async () => {
    const { mutate } = createTestServer({
      user: { id: 1 },
      models: {
        Post: {
          //* Mockking resolver to return specific response
          createOne: jest.fn(() => [
            {
              message: "hello",
            },
          ]),
          user: {
            id: 1,
          }
        },
      },
    });

    //* Comparing snapshots to make sure structure is the same every time
    //* Can check props if needed, but snapshot checks everything

    const res = await mutate({ query: CREATE_POST });
    //* Will pass first time, important to look at snapshot result
    expect(res).toMatchSnapshot();
  });
});
