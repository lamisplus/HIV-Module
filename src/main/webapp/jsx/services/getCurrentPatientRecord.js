import axios from "axios";
import { token, url as baseUrl } from "../../api";

export const getCurrentPatientRecord = async (id) => {
  const response = await axios.get(`${baseUrl}hiv/patient/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};