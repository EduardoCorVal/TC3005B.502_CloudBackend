import { Response, Request, NextFunction } from 'express';
import { HydratedDocument } from "mongoose";
// Models
import IUser, { UserModel } from "../models/User"


export default class PermissionMiddleware {
	// Singleton
	private static instance: PermissionMiddleware;
	public static getInstance(): PermissionMiddleware {
		if (this.instance) {
			return this.instance;
		}
		this.instance = new PermissionMiddleware();
		return this.instance;
	}

	/**
	 * Verify that the current user is an Trabajador
	 */
	public async checkIsTrabajador(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const user: HydratedDocument<IUser> | null = await UserModel.findOne({aws_cognito: req.user});
			if (user != null && user.role === "Trabajador") {
				next();
			} else {
				res.status(401).send({ code: 'UserNotTrabajadorException', message: 'The logged account is not a trabajador' });
			}
		} catch (error:any) {
			res.status(500).send({ code: error.code, message: error.message });
		}
	}
}