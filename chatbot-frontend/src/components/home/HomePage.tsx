import { useState } from "react";
import { ref, uploadBytes, UploadResult } from "firebase/storage";
import { auth, storage, backend_root } from "../../firebase-config";
import axios from "axios";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [allFiles, setAllFiles] = useState<FileList | null>(null);
  const navigate = useNavigate();
  const handleSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    // get first file from the input
    const file = event.target.files![0];
    // update selected file state
    setSelectedFile(file);
    setAllFiles(event.target.files);
  };
  const handleUpload = async () => {
    if (!allFiles) {
      alert("Plese upload a file!");
      return;
    }
    let fileRefs: Promise<UploadResult>[] = [];
    let fileNames = Array.from(allFiles).map((file) => file.name);
    let userID = auth.currentUser?.uid;
    for (let i = 0; i < allFiles.length; i++) {
      const filePath = `files/${userID}/${allFiles[i].name}`;
      const fileRef = ref(storage, filePath);
      fileRefs.push(uploadBytes(fileRef, allFiles[i]));
    }
    try {
      await Promise.all(fileRefs);
      console.log(
        `SENDING POST REQUEST WITH USER ID ${userID} and FILE NAMES ${fileNames}`
      );
      await axios.post(`${backend_root}/setup`, { userID, fileNames });
      navigate("/chat");
    } catch (error) {
      console.log(error);
      alert("Some error occurred during file upload or API ping! Try again.");
    }
  };
  return (
    <div className="file-upload-container">
      <input
        id="file-input"
        className="file-input"
        type="file"
        accept=".pdf"
        multiple
        onChange={handleSelection}
      />
      <label htmlFor="file-input" className="document-upload-input-label">
        {selectedFile ? selectedFile.name : "Upload document here"}
      </label>
      <button className="upload-btn" onClick={handleUpload}>
        Upload
      </button>
      <button
        className="chat-nav-btn"
        onClick={() => {
          navigate("/chat");
        }}
      >
        Go To Chat
      </button>
    </div>
  );
}
