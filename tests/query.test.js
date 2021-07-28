const gql = require('graphql-tag')
const createTestServer = require('./helper')
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
`

describe('queries', () => {
  test('feed', async () => {
    const {query} = createTestServer({
      user: {id: 1},
      models: {
        Post: {
          //* Mockking resolver to return specific response
          findMany: jest.fn(() => [{id: 1, message: 'hello', createdAt: 12345839, likes: 20, views: 300}])
        }
      }
    })

    //* Comparing snapshots to make sure structure is the same every time
    //* Can check props if needed, but snapshot checks everything

    const res = await query({query: FEED})
    expect(res).toMatchSnapshot()
  })
})
