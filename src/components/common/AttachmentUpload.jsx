import React, { useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa'; // Import trash icon (FontAwesome)

const AttachmentUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Handle file selection through both click and drag-drop
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setSelectedFile(file);
    } else {
      alert("File too large. Max 5MB allowed.");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setSelectedFile(file);
    } else {
      alert("File too large. Max 5MB allowed.");
    }
  };

  const handleDelete = () => {
    setSelectedFile(null); // Remove the selected file
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-DarkBlue font-bold text-lg">Attach File</label>

      <div
        className={`w-full border-2 border-dashed ${isDragOver ? 'border-blue-500' : 'border-gray-300'} rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition`}
        onClick={() => document.getElementById('file-upload').click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <p className="text-gray-500 text-sm">Drag & drop files here or click to upload</p>
        <p className="text-xs text-gray-400 mt-1">Max file size: 5MB</p>
      </div>

      <input
        id="file-upload"
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />

      {selectedFile && (
        <div className="mt-2 flex items-center text-sm text-gray-400 italic underline ">
          <span className="mr-2">{selectedFile.name}</span>
          <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
            <FaTrashAlt />
          </button>
        </div>
      )}
    </div>
  );
};

export default AttachmentUpload;
