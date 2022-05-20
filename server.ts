import {typeDefs} from "./graphql/schema";

const { createServer: createHttpServer } = require('http')
const { parse } = require('url')
const next = require('next')
import { Server as WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import { createServer as createGraphqlServer, createPubSub } from '@graphql-yoga/node'
import {resolvers} from "./graphql/resolvers";

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 3000
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

// Provide your schema
const yogaApp = createGraphqlServer({
  graphiql: {
    // Use WebSockets in GraphiQL
    subscriptionsProtocol: 'WS',
  },
  schema: {
    typeDefs,
    resolvers
  }
});


app.prepare().then(async () => {
  const graphQlHttpServer = await yogaApp.start();
  const wsServer = new WebSocketServer({
    server: graphQlHttpServer,
    path: yogaApp.getAddressInfo().endpoint,
  });
  // TODO replace with appolo server probably, too much boilerplate
  useServer(
    {
      execute: (args: any) => args.rootValue.execute(args),
      subscribe: (args: any) => args.rootValue.subscribe(args),
      onSubscribe: async (ctx, msg) => {
        const { schema, execute, subscribe, contextFactory, parse, validate } =
          yogaApp.getEnveloped(ctx)

        const args = {
          schema,
          operationName: msg.payload.operationName,
          document: parse(msg.payload.query),
          variableValues: msg.payload.variables,
          contextValue: await contextFactory(),
          rootValue: {
            execute,
            subscribe,
          },
        }

        const errors = validate(args.schema, args.document)
        if (errors.length) return errors
        return args
      },
    },
    wsServer,
  );
  createHttpServer(async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true)
      const { pathname, query } = parsedUrl

      // if (pathname === '/a') {
      //   await app.render(req, res, '/a', query)
      // } else if (pathname === '/b') {
      //   await app.render(req, res, '/b', query)
      // } else {
      //
      // }
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  }).listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})

export default {};