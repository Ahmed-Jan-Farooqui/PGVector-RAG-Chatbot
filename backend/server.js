const express = require('express')
const cors = require('cors')
const { spawn } = require('child_process')
const fs = require('fs')
const {initializeApp, cert } = require('firebase-admin/app')
const {getStorage} = require('firebase-admin/storage')
const serviceAccount = require('./rag-chatbot-test-firebase-adminsdk-m67tw-829c99d6e3.json')
const app = express()
const port = 8000;
initializeApp({
    credential: cert(serviceAccount),
    storageBucket: "rag-chatbot-test.appspot.com",
})
const bucket = getStorage().bucket();

app.use(cors())
app.use(express.json())

function runSubProcess(command, args){
    return new Promise((resolve, reject) => {
        const subprocess = spawn(command, args);
        let output = ""

        subprocess.stderr.on('data', (error) => {
            console.log(`${error}`)  
        })

        subprocess.stdout.on('data', (data) => {
            output += data.toString()  
        })

        subprocess.on('close', (code) => {
            if (code == 0){
                resolve(output)
            } else {
                reject(`Subprocess failed with code ${code}`)
            }
        })
    })
}

async function download_relevant_file(user_id, paths){
    /* 
        paths: [] of file paths where files are stored in the database.
    */
   // In my case, my directory structure is defined like: files/user_id/file_name, so my paths variable
   // is an array of file names. 
   const filePathRoot = `files/${user_id}`
   let files_download_promises = []
   if (!fs.existsSync(filePathRoot)){
    fs.mkdirSync(filePathRoot, {recursive: true})
   }
   for(let i = 0; i < paths.length; i++){
    let filePath = `${filePathRoot}/${paths[i]}`
    if (fs.existsSync(filePath)){
        continue;
    }
    let file = bucket.file(filePath)
    let file_download_promise = file.download({
        destination: filePath
    })
    files_download_promises.push(file_download_promise)
   }
   try{
    await Promise.all(files_download_promises)
    return true;
   } catch(error){
    console.error(error)
    return false;
   }
}



app.post("/generate", async (req, res) => {
    let {userID, user_prompt} = req.body;
    console.log("User ID for generation is: ", userID);
    console.log("User prompt is: ", user_prompt);
    try {
        let args = ["generate.py", userID, user_prompt]
        let result = await runSubProcess("python3", args)
        res.status(200).send({
            bot_response: result, 
        })
    } catch (error) {
        res.status(500).send("An error occurred with the generation...")
    }
})

app.post("/setup", async (req, res) => {
    let { userID, fileNames } = req.body
    console.log("The user ID is: ", userID)
    console.log("The file names are: ", fileNames)
    if (!download_relevant_file(userID, fileNames)){
        res.status(500).send("Error occured during file download!");
    }
    try {
        let args = ["setup.py", userID]
        args = args.concat(fileNames.map(fileName => `files/${userID}/${fileName}`))
        await runSubProcess("python3", args)
        res.status(200).send("Knowledgebase updated successfully")
    } catch (error){
        console.error("An error occurred during execution of the script", error)
        res.status(500).send("Unable to reach database.")
    }
})

app.listen(port, () => {
    console.log("server is listening...")
})