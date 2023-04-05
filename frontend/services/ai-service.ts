import { constructURL, handleResponse } from "./api-service";

export const getChord = (note: string, type: string) => {
  return fetch(constructURL(`/api/ai/generate/chord/${type}/${note}`), {
    credentials: "include",
    method: "GET",
  }).then(handleResponse);
};

export const getProgression = (type: string) => {
  return fetch(constructURL(`/api/ai/generate/progression/${type}`), {
    credentials: "include",
    method: "GET",
  }).then(handleResponse);
};
