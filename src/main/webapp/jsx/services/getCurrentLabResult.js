import axios from "axios";
import { token, url as baseUrl } from "../../api";

export const getCurrentLabResult = async (id) => {
  const response = await axios.get(`${baseUrl}laboratory/vl-results/patients/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};