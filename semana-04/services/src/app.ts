import express from 'express';
import cors from 'cors';
import routers from './routers';

const app = express();
app.use(express.json());
app.use(cors());
app.use(routers);

const port = 3000;

app.listen(port, () => {
    console.log("Aplicação online na porta: ", port);
});

