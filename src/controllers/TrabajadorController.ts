import { Request,Response } from "express";
import AbstractController from "./AbstractController";
import ICampana, { campanaModel } from "./../models/Campana";

class TrabajadorController extends AbstractController{
    private campana_model_ = campanaModel;

    protected validateBody(type: any) {
        throw new Error("Method not implemented.");
    }
        
    //Singleton
    private static instance:TrabajadorController;
    public static getInstance():AbstractController{
        //si existe la instancia la regreso
        if(this.instance){
            return this.instance;
        }
        //si no exite la creo
        this.instance = new TrabajadorController('trabajador');
        return this.instance;
    } 

    //Configurar las rutas del controlador
    protected initRoutes(): void {
        this.router.get("/consultar",this.authMiddleware.verifyToken, this.permissionMiddleware.checkIsTrabajador, this.consultar.bind(this));
        this.router.get("/overhead",this.authMiddleware.verifyToken, this.permissionMiddleware.checkIsTrabajador, this.overhead.bind(this));
    }

    //Los métodos asociados a las rutas
    private async consultar(req:Request, res:Response): Promise<void> {
        try{
            const campanas: Array<ICampana> = await this.campana_model_.find();
            res.status(200).send({
                status: "Success",
                campanas: campanas
            });
        }catch(error:any){
            res.status(500).send({ code: error.code, message: error.message });
        }
    }

    private async overhead(req:Request, res:Response): Promise<void> {
        try{
            const campanas: Array<ICampana> = await this.campana_model_.find();
            const overhead = campanas.map((campana: ICampana) => {
                return {
                    nombre: campana.nombre,
                    overhead: campana.saldo - campana.meta 
                }
            });
            res.status(200).send({
                status: "Success",
                campanas: overhead
            });
        }catch(error:any){
            res.status(500).send({ code: error.code, message: error.message });
        }
    }

}

export default TrabajadorController;