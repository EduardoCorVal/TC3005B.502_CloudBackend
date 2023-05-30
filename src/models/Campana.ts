import { Schema, Types, model } from "mongoose"

export interface ICampana {
    nombre: string;
    proposito: string;
    meta: number;
    donaciones: [{
        donador_id: Types.ObjectId;
        cantidad_donada: number;
    }]
    saldo: number;
}

const CampanaSchema = new Schema<ICampana>({
    nombre: {type: String, required: true},
    proposito: {type: String, required: true},
    meta: {type: Number, required: true },
    donaciones: {type: [{
        donador_id: {type: Types.ObjectId, required: true},
        cantidad_donada: {type: Number, required: true}
    }], default: []},
    saldo: {type: Number, required: true, default: 0}
})

export default ICampana;
export const campanaSchema = CampanaSchema;
export const campanaModel = model<ICampana>('Campana', campanaSchema);