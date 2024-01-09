import {Server} from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import DbConnect from "../server/Config/Database.js";
import { getDocs,updateDocs } from "./Controller/docController.js";

dotenv.config();

const PORT = process.env.PORT;

const io = new Server(PORT,
{
    cors: {
        origin:"http://localhost:3000",
        method: ["GET" , "POST"]
    }
}
);

DbConnect();

//creating connection 
        //connection name // callback function
io.on("connection" , socket => {

    //checking a document
    socket.on("get-document",async documentId => {
    //    //setting data empty
    //     const data =" "; 

        //using data base to check if id avail then data will field if not then create and id doc and fill data
        const document = await getDocs(documentId);

        //joining server with particula id we get from client 
        socket.join(documentId) ;

        //changes will emit to client when document get load 
        socket.emit("load-document",document.data);

        socket.on("send-changes",delta => {
                        //broadcast at particular id
        socket.broadcast.to(documentId).emit("receive-changes",delta);
        //console.log("Connected ......",delta);

        //updating data on server mongodb
        socket.on("save-document",async data => {
            await updateDocs(documentId,data);
        })
    });
    })

}); 