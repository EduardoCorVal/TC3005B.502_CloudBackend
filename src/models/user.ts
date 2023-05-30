import { Schema, Types, model } from "mongoose"

export interface IUser {
    nombre: string;
    correo: string;
    aws_cognito: string;
    role: 'Trabajador' | 'Creador';
    email: string;
}

const UsuarioSchema = new Schema<IUser>({
    nombre: {type: String, requiered: true},
    aws_cognito: {type: String, required: true},
    role: {type: String, enum: ['Trabajador', 'Creador'], default: 'Creador'},
    email: {type: String, required: true},
})

export default IUser
export const UserSchema = UsuarioSchema
export const UserModel = model<IUser>('Usuario', UsuarioSchema)