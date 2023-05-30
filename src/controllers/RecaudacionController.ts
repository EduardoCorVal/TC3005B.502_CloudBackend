import { Request,Response } from "express";
import AbstractController from "./AbstractController";
import { UserModel, IUser } from "./../models/User";
import { ICampana, campanaModel } from "./../models/Campana";
import mongoose, { HydratedDocument } from "mongoose";

class RecaudacionController extends AbstractController{
    private model_ = campanaModel;
    private user_model_ = UserModel

    protected validateBody(type: any) {
        throw new Error("Method not implemented.");
    }
        
    //Singleton
    private static instance:RecaudacionController;
    public static getInstance():AbstractController{
        //si existe la instancia la regreso
        if(this.instance){
            return this.instance;
        }
        //si no exite la creo
        this.instance = new RecaudacionController('recaudacion');
        return this.instance;
    } 

    //Configurar las rutas del controlador
    protected initRoutes(): void {
        this.router.post("/donacion/:id", this.authMiddleware.verifyToken, this.postDonacion.bind(this));
        this.router.post("/configurar", this.authMiddleware.verifyToken, this.configurar.bind(this));
        this.router.get("/totalDonaciones/:id", this.authMiddleware.verifyToken, this.getTotalDonaciones.bind(this));
    }

    //Los métodos asociados a las rutas
    private async postDonacion(req:Request, res:Response): Promise<void> {
        try{
            const user: HydratedDocument<IUser> | null = await this.user_model_.findOne({aws_cognito: req.user});
            if (user == null) throw "User not found";
            const id = new mongoose.Types.ObjectId(req.params.id);
            const campana: HydratedDocument<ICampana> | null = await this.model_.findById(id);
            if (campana == null) throw "Campana not found";
            const { cantidad } = req.body;
            const donacion = {
                donador_id: user._id,
                cantidad_donada: cantidad
            }
            const campanaActualizada = await this.model_.findByIdAndUpdate(
                req.params.id,
                {
                    $set: {
                        donaciones: [...campana.donaciones, donacion],
                        saldo: campana.saldo + cantidad
                    }
                },
                {new: true}
            );
            res.status(200).send({
                status: "Success",
                donacion: donacion,
                campana: campanaActualizada
            });
        } catch (error: any) {
            res.status(500).send({ code: error.code, message: error.message });
        }
    }

    private async configurar(req:Request, res:Response): Promise<void> {
        try{
            const user: HydratedDocument<IUser> | null = await this.user_model_.findOne({aws_cognito: req.user});
            if(user == null) throw "User not found";
            const {nombre, proposito, meta} = req.body;
            const campana: HydratedDocument<ICampana> = await this.model_.create({
                nombre,
                proposito,
                meta,
            });
            res.status(200).send({
                message: "Campaña creada exitosamente",
                campana
            });
        }catch(error:any){
            res.status(500).send({ code: error.code, message: error.message });
        }
    }

    private async getTotalDonaciones(req:Request, res:Response): Promise<void> {
        try{
            const id = new mongoose.Types.ObjectId(req.params.id);
            const campana: HydratedDocument<ICampana> | null = await this.model_.findById(id);
            if(campana == null) throw "Campana not found";
            res.status(200).send({
                message: "Total de donaciones",
                total: campana.saldo
            });
        }catch(error:any){
            res.status(500).send({ code: error.code, message: error.message });
        }
    }
}

export default RecaudacionController;