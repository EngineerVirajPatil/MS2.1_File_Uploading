import uploadToCloudinary from "../service/fileService.js"
import fs from "fs"

export const uploadImagesToCloudinary=async(file)=>{
    try{
        const cloudResponse=await uploadToCloudinary(file.path);
        fs.unlink(file.path,err=>{
            if(err){
               console.error(err);
            }
        })
        return cloudResponse;
    }
    catch(error){
      console.error(error);
    }

}