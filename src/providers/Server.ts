import express, {Request, Response} from 'express';
import AbstractController from '../controllers/AbstractController';
import mongoose from 'mongoose';

class Server{
    //Atributos
    private app:express.Application;
    private port:number;
    private env:string;
    private mongo_uri:string;

    //Metodos
    constructor(appInit:{port:number,env:string;middlewares:any[],controllers:AbstractController[], mongo_uri:string}){
        this.app=express();
        this.port=appInit.port;
        this.env=appInit.env; 
        this.loadMiddlewares(appInit.middlewares);  
        this.loadControllers(appInit.controllers);   
        this.mongo_uri=appInit.mongo_uri;
    }

    private loadMiddlewares(middlewares:any[]):void{
        middlewares.forEach((middleware:any)=>{
            this.app.use(middleware);
        })
    }

    private loadControllers(controllers:AbstractController[]){
        controllers.forEach((controller:AbstractController)=>{
            this.app.use(`/${controller.prefix}`,controller.router);
        })
    }

    public async init(){
        this.app.listen(this.port,()=>{
            console.log(`Server:Running 🚀 @'http://localhost:${this.port}'`)
        })
        await this.connectToDatabase();
    }

    public async connectToDatabase(){
        try{
            await mongoose.connect(this.mongo_uri);
            console.log("Database:Connected 🚀")
        }catch(error){
            console.log("Database:Error 🚀")
            console.log(error)
        }
    }
}

export default Server;