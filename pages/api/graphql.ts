import { ApolloServer } from 'apollo-server-micro'
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from '../../graphql/schema'
import { resolvers } from '../../graphql/resolvers'
import Cors from 'micro-cors'

const schema = makeExecutableSchema({ typeDefs, resolvers });

const cors = Cors()

const apolloServer = new ApolloServer({
  schema
});

const startServer = apolloServer.start()

const getHandler = async () => {
  await startServer;
  return apolloServer.createHandler({
    path: '/api/graphql',
  });
}

export default cors(async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.end()
    return false
  }
  const h = await getHandler();

  await h(req, res)
})

export const config = {
  api: {
    bodyParser: false,
  },
}