import axios from 'axios';

const baseURL = 'http://localhost:3001/decode';


export const getData = async () => {
  const response = await axios.get(baseURL);
  return response.data; 
};

export const decodeData = async (decodedOutput: any) => {
  return await axios.post(baseURL, decodedOutput);
};

export const editData = async (_id: string, decodedOutput: any) => {
  return await axios.put(`${baseURL}/${_id}`, decodedOutput);
};

export const deleteData = async (_id: string) => {
  return await axios.delete(`${baseURL}/${_id}`);
};