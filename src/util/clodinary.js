import { v2 as cloudinary} from "cloudinary";
import fs from 'fs'


          
cloudinary.config({ 
  cloud_name:'manvireact' , 
  api_key:519335975666383, 
  api_secret:'h6qehn2F1HlrimIZkVDxwodch-U' 
});

const uploadOnCloudinary = async (localFilePath) =>{
try {
    if(!localFilePath) return null;
  const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type :'auto'
    })
    console.log("file is uploaded",response.url);
    console.log("Cloudinary",response);
    fs.unlinkSync(localFilePath);
    return response;
} catch (error) {
    fs.unlinkSync(localFilePath); //remove local save file on server
    return null;
}
}
export {uploadOnCloudinary} ;
