import { useCallback } from "react";
import axios from "axios";

export const useCheckedInPatientData = (baseUrl, token) => {
  const fetchPatients = useCallback(async (query) => {
    try {
      const response = await axios.get(`${baseUrl}opd-setting`, {
        headers: { Authorization: `Bearer ${token}` },

      });

      const data = response.data;
      const hivCode = data?.find(
        (item) => item.moduleServiceName.toUpperCase() === "HIV"
      )?.moduleServiceCode;

      if (hivCode) {
        const patientResponse = await axios.get(
          `${baseUrl}patient/checked-in-by-service/${hivCode}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        return patientResponse.data;
      }
    } catch (error) {
      console.error("Failed to fetch patients:", error);
      return [];
    }
  }, [baseUrl, token]);

  return { fetchPatients };
};