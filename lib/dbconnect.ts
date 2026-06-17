import mongoose from "mongoose";


type ConnectionObject = {
    isconnect?:number;
}

const connection : ConnectionObject ={}


async function dbconnect(): Promise<void>{
    if(connection.isconnect){
        console.log("Already connect")
        return
    }else{
        try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "",{})
        // console.log(db)
        connection.isconnect = db.connections[0].readyState 
        console.log("connect db sucesss")
        } catch (error) {
            console.log(error)
            process.exit
        }
    }
} 

export default dbconnect;
