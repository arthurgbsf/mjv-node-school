import { Schema } from "mongoose";

interface ICoach{
    id?: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date | string;
    UpdatedAt: Date | string;
}

const userSchema = new Schema<ICoach>({

});

