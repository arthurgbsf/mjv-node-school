import express from 'express';
import cors from 'cors';
import routers from './routers';
import connection from './config/database';
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./docs/swagger.doc.json";

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(express.json());
app.use(cors());
app.use(routers);

const port = 3000;

connection.then( () => {
    console.log("Database connected");
    app.listen(port, () => {
        console.log("App online in port: ", port);
    });
}).catch( (err) => console.log(err));

