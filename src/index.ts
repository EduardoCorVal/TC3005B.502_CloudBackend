import Server from "./providers/Server";
import express from 'express';
import cors from 'cors';
import CreadorController from "./controllers/CreadorController";
import TrabajadorController from "./controllers/TrabajadorController";
import RecaudacionController from "./controllers/RecaudacionController";
import { MONGO_URI } from "./config";

const servidor = new Server({
    port:8080,
    middlewares:[
        express.json(),
        express.urlencoded({extended:true}),
        cors()
    ],
    controllers:[
        CreadorController.getInstance(),
        RecaudacionController.getInstance(),
        TrabajadorController.getInstance()
    ],
    env:'development',
    mongo_uri:MONGO_URI
});

declare global{
    namespace Express{
        interface Request{
            user:string;
            token:string;
        }
    }
}

servidor.init();
