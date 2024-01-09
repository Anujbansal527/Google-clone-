import Document from "../Model/documentSchema.js"

export const getDocs = async (id) => {
    if(id === null )
    {
        return;
    }
   // console.log(id);

 const docs =await Document.findById(id);

 if(docs)
    {
        return(docs);
    }

return await Document.create({_id:id, data:"" })
}

//updating docs

export const updateDocs = async (id , data) => {
    return await Document.findByIdAndUpdate(id,{data});
}