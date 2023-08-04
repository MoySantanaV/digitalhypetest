import axios from "axios";
import { toast } from "react-toastify";

const baseURL = "https://digitalhype-api-test.vercel.app/api/decode";

interface DecodedOutput {
  first_name: string;
  last_name: string;
  id: string;
}

export const getData = async () => {
  try {
    const response = await axios.get(baseURL);
    toast.success("Data loaded successfully");
    return response.data;
  } catch (error) {
    console.error(`Error getting the data: ${error}`);
    toast.error("Error getting the data");
    return [];
  }
};

export const decodeData = async (decodedOutput: DecodedOutput) => {
  try {
    const response = await axios.post(baseURL, decodedOutput);
    toast.success("Data successfully decoded");
    return response;
  } catch (error) {
    console.error(`Error decoding the data: ${error}`);
    toast.error("Error decoding the data");
    return null;
  }
};

export const editData = async (_id: string, decodedOutput: DecodedOutput) => {
  try {
    const response = await axios.put(`${baseURL}/${_id}`, decodedOutput);
    toast.success("Data successfully edited");
    return response;
  } catch (error) {
    console.error(`Error editing the data: ${error}`);
    toast.error("Error editing the data");
    return null;
  }
};

export const deleteData = async (_id: string) => {
  try {
    const response = await axios.delete(`${baseURL}/${_id}`);
    toast.success("Data successfully deleted");
    return response;
  } catch (error) {
    console.error(`Error deleting the data: ${error}`);
    toast.error("Error deleting the data");
    return null;
  }
};
