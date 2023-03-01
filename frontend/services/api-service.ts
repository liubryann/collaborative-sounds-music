const availableInstruments: string[] = ["Synth", "Piano", "Guitar", "Drums"];

export const getAvailableInstruments = (): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    resolve(availableInstruments);
  });
};

const apiService = {
  getAvailableInstruments,
};

export default apiService;
