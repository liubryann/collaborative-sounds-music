const API_URL = process.env.API_URL || "http://localhost:3001";

/**
 *
 * @param username
 * @param firstname
 * @param lastname
 * @param password
 * @param email
 * @returns Promise<{user: User}>
 * @description Creates a new user and returns the user object.
 */
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

/**
 *
 * @param username
 * @param password
 * @returns Promise<{user: User}>
 * @description Logs in a user and returns the user object.
 */
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

/**
 *
 * @returns Promise<{user: User}>
 * @description Signs out a user and returns the user object.
 */
const signout = () => {
  return fetch(`${API_URL}/users/signout`, {
    method: "GET",
  }).then((res) => res.json());
};

/**
 *
 * @param userId
 * @returns Promise<{compositions: Composition[]}>
 * @description Gets all compositions for a user.
 */
const getUsersCompositions = (userId: number) => {
  return fetch(`${API_URL}/user/${userId}/compositions`, {
    method: "GET",
  }).then((res) => res.json());
};

/**
 *
 * @param compositionTitle
 * @returns Promise<{composition: Composition}>
 * @description Creates a new composition and returns the composition object.
 */
const createComposition = (compositionTitle: string) => {
  return fetch(`${API_URL}/api/compositions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ compositionTitle }),
  }).then((res) => res.json());
};

/**
 *
 * @param compositionId
 * @returns Promise<{composition: Composition}>
 * @description Gets a composition by id and returns the composition object.
 */
const getComposition = (compositionId: number) => {
  return fetch(`${API_URL}/api/compositions/${compositionId}`, {
    method: "GET",
  }).then((res) => res.json());
};

/**
 *
 * @param compositionId
 * @param title
 * @returns Promise<{message: string}>
 * @description Updates a composition title by id and returns a message on success.
 */
const updateComposition = (compositionId: number, title: string) => {
  return fetch(`${API_URL}/api/compositions/${compositionId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  }).then((res) => res.json());
};

/**
 *
 * @param compositionId
 * @returns Promise<{message: string}>
 * @description Deletes a composition by id and returns a message on success.
 */
const deleteComposition = (compositionId: number) => {
  return fetch(`${API_URL}/api/compositions/${compositionId}`, {
    method: "DELETE",
  }).then((res) => res.json());
};

/**
 *
 * @param compositionId
 * @param collaboratorId
 * @returns Promise<{composition: Composition}>
 * @description Adds a user to a composition as a collaborator and returns the
 *              composition object.
 */
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

/**
 *
 * @param compositionId
 * @param collaboratorId
 * @returns Promise<{message: string}>
 * @description Removes a user from a composition as a collaborator and
 *              returns a message on success.
 */
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

export {
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
