import { Box } from "@mui/material";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "../components/Edditor.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "@emotion/styled";
 
const Component = styled.div`
  background: #f5f5f5;
`;

//tool bar option for quill
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ["clean"], // remove formatting button
];


const Edditor = () => {

  const [socket, setSocket] = useState();

  const [quill, setQuill] = useState();

  //fetching id from our url using useParams
  const {id} = useParams();

  useEffect(() => {
    const quillServer = new Quill("#container", {
      theme: "snow",
      modules: { toolbar: toolbarOptions },
    });
       
    //disabled our server untill detail fetched
    quillServer.disable();
    quillServer.setText("Loading the document ....");
    setQuill(quillServer);
  }, []);

  //creating socket io connection
  useEffect(() => {
    const socketServer = io("http://localhost:9000");
 
    setSocket(socketServer);
    //component wil unmount
    return () => {
      socketServer.disconnect();
    };
  }, []);

  //quill text change api

  useEffect(() => {
    if (socket === null || quill === null) {
      return;
    }

    const changeHandel = (delta, oldData, source) => {
      if (source !== "user") {
        return;
      }
      //emit funtion use to send changes ....delta detect all changes
      socket && socket.emit("send-changes", delta);
    };

    //api name
    quill && quill.on("text-change", changeHandel);

    //unmount changes
    return () => {
      quill && quill.off("text-change", changeHandel);
    };
  }, [quill, socket]);

  //message get from socket
  useEffect(() => {
    if (socket === null || quill === null) {
      return;
    }

    const changeHandel = (delta) => {
      //bordcasting message to all quill from socket
      quill.updateContents(delta);
    };

    //api name
    socket && socket.on("receive-changes", changeHandel);

    //unmount changes
    return () => {
      socket && socket.off("receive-changes", changeHandel);
    };
  }, [quill, socket]);

  
  //creatinguse effect for checking id 
useEffect(()=>{
    if (socket === null || quill === null) {
        return;
      }

      //once time loading document
      socket && socket.once("load-document",document => {

        //undefine check
        quill && quill.setContents(document);
        quill &&  quill.enable();
      })

    socket && socket.emit("get-document",id);
},[quill,socket,id]);


//saving data to server using useEffect
useEffect(()=>{
    if (socket === null || quill === null) {
        return;
      }

      //creating interval and saving data on that time period
      //evenry 2 sec data will save
      const interval = setInterval(()=>{
        socket && socket.emit("save-document",quill.getContents())
      },2000)

      return() => {
        clearInterval(interval);
      }

},[socket,quill])

    return (
    <Component>
      <Box class="container" id="container"></Box>
    </Component>
  );
};

export default Edditor;
