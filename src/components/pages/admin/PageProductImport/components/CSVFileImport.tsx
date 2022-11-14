import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    if (!file) return;

    console.log('uploadFile to', url);

    const token = localStorage.getItem('authorization_token') || '';
    // Get the presigned URL
    const response = await axios({
      method: 'GET',
      url,
      headers: {
        authorization: `Basic ${token}`,
      },
      params: {
        name: encodeURIComponent(file.name),
      },
    });

    console.log('File to upload: ', file);
    console.log('Uploading to: ', response.data);

    // Upload file to S3
    await axios.put(response.data, file, {
      headers: {
        'Content-Type': file.type,
      },
    });

    setFile(undefined);
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
