import { Storage } from "aws-amplify";

export async function s3Upload(file) {
  const filename = `ProfilePic`;
  console.log(file.type);

  if (file.type !== 'image/jpeg'){
    console.log("upload error");
    alert("please only upload JPEG files, this will not be uploaded")
    return
  } else {
    const stored = await Storage.vault.put(filename, file, {
      contentType: file.type,
    });
  
    return stored.key;
  }
   
  
}