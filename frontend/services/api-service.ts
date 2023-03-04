import { instrumentNames } from "../components/DigitalAudioWorkstation/instruments";

export const getAvailableInstruments = (): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    resolve(instrumentNames);
  });
};

const apiService = {
  getAvailableInstruments,
};

export default apiService;
