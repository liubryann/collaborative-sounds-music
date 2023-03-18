const API_URL = process.env.API_URL || "http://localhost:3001";

const signup = (
  username: string,
  firstname: string,
  lastname: string,
  password: string,
  email: string
) => {
  return fetch(`${API_URL}/users/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      firstname,
      lastname,
      password,
      email,
    }),
  }).then((res) => res.json());
};

const login = (username: string, password: string) => {
  return fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  }).then((res) => res.json());
};

const signout = () => {
  return fetch(`${API_URL}/users/signout`, {
    method: "GET",
  }).then((res) => res.json());
};

const getUsersCompositions = (userId: number) => {
  return fetch(`${API_URL}/user/${userId}/compositions`, {
    method: "GET",
  }).then((res) => res.json());
};

const createComposition = (title: string) => {
  return fetch(`${API_URL}/api/compositions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  }).then((res) => res.json());
};

const getComposition = (id: number) => {
  return fetch(`${API_URL}/api/compositions/${id}`, {
    method: "GET",
  }).then((res) => res.json());
};

const updateComposition = (id: number, title: string) => {
  return fetch(`${API_URL}/api/compositions/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  }).then((res) => res.json());
};

const deleteComposition = (id: number) => {
  return fetch(`${API_URL}/api/compositions/${id}`, {
    method: "DELETE",
  }).then((res) => res.json());
};

const addCollaboratorToComposition = (
  compositionId: number,
  collaboratorId: number
) => {
  return fetch(`${API_URL}/api/compositions/collaborators/${compositionId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ collaboratorId }),
  }).then((res) => res.json());
};

const removeCollaboratorFromComposition = (
  compositionId: number,
  collaboratorId: number
) => {
  return fetch(`${API_URL}/api/compositions/collaborators/${compositionId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ collaboratorId }),
  }).then((res) => res.json());
};

const apiService = {
  signup,
  login,
  signout,
  getUsersCompositions,
  createComposition,
  getComposition,
  updateComposition,
  deleteComposition,
  addCollaboratorToComposition,
  removeCollaboratorFromComposition,
};

export default apiService;
