const gql = require("graphql-tag");
const createTestServer = require("./helper");
const FEED = gql`
  {
    feed {
      id
      message
      createdAt
      likes
      views
    }
  }
`;

const ME = gql`
  {
    me {
      id
      email
      role
    }
  }
`;

describe("queries", () => {
  test("me", async () => {
    const { query } = createTestServer({
      user: { id: 1 },
      user: {
        id: 1,
        email: "torbear@roo.com",
        role: "ADMIN",
      },
    });

    const response = await query({ query: ME });
    expect(response).toMatchSnapshot();
  });

  test("feed", async () => {
    const { query } = createTestServer({
      user: { id: 1 },
      models: {
        Post: {
          //* Mockking resolver to return specific response
          findMany: jest.fn(() => [
            {
              id: 1,
              message: "hello",
              createdAt: 12345839,
              likes: 20,
              views: 300,
            },
          ]),
        },
      },
    });

    //* Comparing snapshots to make sure structure is the same every time
    //* Can check props if needed, but snapshot checks everything

    const res = await query({ query: FEED });
    expect(res).toMatchSnapshot();
  });
});
