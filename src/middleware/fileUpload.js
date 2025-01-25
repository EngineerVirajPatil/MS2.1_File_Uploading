import express from "express"
import multer, { MulterError } from "multer"
import path from "path"
const app = express();
export const uploadRouter = express.Router();

/**
 * Error handling function for the upload middleware
 * @param {Error} err - The error object passed by multer
 * @param {Request} req - The Express request object
 * @param {Response} res - The Express response object
 */
export const UNEXPECTED_FILE_TYPE={
    code:'UNEXPECTED_FILE_TYPE',
    message:'Only Image file type is allowed',
}


function handleError(req,res,err){

    if(err){
        if(err instanceof multer.MulterError){
            if(err.code===UNEXPECTED_FILE_TYPE.code){
                return res.status(400).json({error:UNEXPECTED_FILE_TYPE.message})
            }
            else{
              return res.status(400).json({error:err.message})
            }             
        }
        return res.status(500).json({error:err.message}) 
    }

   




    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files were uploaded." });
      }
    

      const uploadedFiles = req.files.map((file) => ({
        originalName: file.originalname,
        fileName: file.filename,
        path: file.path,
        size: file.size,
      }));
    
      res.status(200).json({
        message: "Files uploaded successfully.",
        files: uploadedFiles,
      });

}

uploadRouter.post('/uploads',(req, res,err)=>{
    upload(req,res,(err)=handleError(req,res,err))
})




export function fileTypeValidator(file){
    const fileTypes =/jpeg|png|jpg|gif/;
    const extName= fileTypes.test(path.extname(file.originalname));
    const mimeType=fileTypes.test(file.mimetype);
    return extName&&mimeType;
}

//This function is used to store the files in local storage which is coming from request 
// This code is about storage part
const storage=multer.diskStorage({
    destination:(req, file,cb)=>{
     cb(null,"uploads");
    },
    filename:(req, file,cb)=>{
     cb(null,Date.now()+path.extname(file.originalname));
    }
})


export const upload=multer({
storage:storage,
fileFilter: (req, file, cb)=>{
const isFileTypeAllowed=fileTypeValidator(file);
if(isFileTypeAllowed){
  cb(null,true);
}else{
    cb(new multer.MulterError(UNEXPECTED_FILE_TYPE.code,UNEXPECTED_FILE_TYPE.message));
}
}
}).array("file",10);

