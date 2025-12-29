import express from 'express';
import { expressMiddleware } from "@as-integrations/express5";
import createApolloGraphqlServer from './graphql/index.js';
import UserService from './services/user.js';

async function init() {
    const app = express();
    const port = Number(process.env.PORT) || 8000;

    app.use(express.json());

    app.get("/", (req, res) => {
        res.json({message: "Server is running"});
    })

    app.use(
        '/graphql',
        expressMiddleware(await createApolloGraphqlServer(), {
            context: async ({ req }) => { const token = req.headers['token']
                try {
                    const user = UserService.decodeJWTToken(token as string);
                    return { user };
                } catch (error) {
                    return { user: null };
                }
            },
        })
    );

    app.listen(port,() => console.log(`Server started at port:${port}`));
}

init();
