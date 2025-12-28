import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware} from "@as-integrations/express5";

async function init() {
    const app = express();
    const port = Number(process.env.PORT) || 8000;

    app.use(express.json());

    const gqlserver = new ApolloServer({
        typeDefs: `
            type Query {
                hello: String 
            }`,
        resolvers: {
            Query:{
                hello: () => "Helllooooo"
            }
        },
    });

    await gqlserver.start();

    app.get("/", (req, res) => {
        res.json({message: "Server is running"});
    })

    app.use(
    '/graphql',
    expressMiddleware(gqlserver),
    );

    app.listen(port,() => console.log(`Server started at port:${port}`));
}

init();

