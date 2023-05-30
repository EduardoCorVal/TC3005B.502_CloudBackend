import { Request, Response } from "express";
import { checkSchema } from "express-validator";
import AbstractController from "./AbstractController";
import {UserModel} from "./../models/User"
class CreadorController extends AbstractController{
    protected validateBody(type: any) {
        throw new Error("Method not implemented.");
    }
    private model_ = UserModel;

    //Singleton 
    private static instance:CreadorController;
    public static getInstance():AbstractController{
        if(this.instance)
            return this.instance;
        this.instance = new CreadorController("creador");
        return this.instance;
    }

    protected initRoutes(): void {
        this.router.post('/signup',this.signup.bind(this));
        this.router.post('/verificar',this.verify.bind(this));
        this.router.post('/signin',this.signin.bind(this));
    }

    private async signin(req:Request,res:Response){
        const {email, password} = req.body;
        try{
            const login = await this.cognitoService.signInUser(email,password);
            res.status(200).send({...login.AuthenticationResult});
        }catch(error:any){
            res.status(500).send({code:error.code,message:error.message});
        }
    }

    private async verify(req:Request,res:Response){
        const {email,code} = req.body;
        try{
            await this.cognitoService.verifyUser(email,code);
            return res.status(200).send({message:"Correct verification"});
        }catch(error:any){
            res.status(500).send({code:error.code,message:error.message});
        }
    }

    private async signup(req:Request,res:Response): Promise<void> {
        const {email, password, name, role} = req.body;
        try{
            //Create el usuario de cognito
            const user= await this.cognitoService.signUpUser(email,password,[
                {
                    Name:'email',
                    Value: email
                } 
                
            ]);
            console.log('cognito user created',user);
            
            const userDoc = await this.model_.create({
                aws_cognito: user.UserSub,
                nombre: name,
                role: role,
                email: email
            });
            
            res.status(200).send({
                status: "Success",
                user: userDoc
            });
        }catch(error:any){
            res.status(500).send({code:error.code,message:error.message});
        }
    }
    
}

export default CreadorController;