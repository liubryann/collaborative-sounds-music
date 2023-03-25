const API_URL = process.env.API_URL || "http://localhost:3001";

const constructURL = (path: string) => {
  return `${API_URL}${path}`;
};

const handleResponse = (res: Response) => {
  if (!res.ok) {
    return res.json().then((err) => {
      throw new Error(err.error);
    });
  } else {
    return res.json();
  }
};

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
  email: string,
  firstname: string,
  lastname: string,
  username: string,
  password: string
) => {
  return fetch(constructURL("/users/signup"), {
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
  }).then(handleResponse);
};

/**
 *
 * @param username
 * @param password
 * @returns Promise<{user: User}>
 * @description Logs in a user and returns the user object.
 */
const login = (username: string, password: string) => {
  return fetch(constructURL("/users/login"), {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  }).then(handleResponse);
};

/**
 *
 * @returns Promise<{user: User}>
 * @description Signs out a user and returns the user object.
 */
const signout = () => {
  return fetch(constructURL("/users/signout"), {
    credentials: "include",
    method: "GET",
  }).then(handleResponse);
};

/**
 *
 * @returns Promise<{compositions: Composition[]}>
 * @description Gets all compositions for a logged in user
 */
const getUsersCompositions = () => {
  return fetch(constructURL("/users/compositions"), {
    credentials: "include",
    method: "GET",
  }).then(handleResponse);
};

/**
 *
 * @param compositionTitle
 * @returns Promise<{composition: Composition}>
 * @description Creates a new composition and returns the composition object.
 */
const createComposition = (compositionTitle: string) => {
  return fetch(constructURL("/api/compositions"), {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ compositionTitle }),
  }).then(handleResponse);
};

/**
 *
 * @param compositionId
 * @returns Promise<{composition: Composition}>
 * @description Gets a composition by id and returns the composition object.
 */
const getComposition = (compositionId: number) => {
  return fetch(constructURL(`/api/compositions/${compositionId}`), {
    method: "GET",
  }).then(handleResponse);
};

/**
 *
 * @param compositionId
 * @param title
 * @returns Promise<{message: string}>
 * @description Updates a composition title by id and returns a message on success.
 */
const updateComposition = (compositionId: number, title: string) => {
  return fetch(constructURL(`/api/compositions/${compositionId}`), {
    credentials: "include",
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  }).then(handleResponse);
};

/**
 *
 * @param compositionId
 * @returns Promise<{message: string}>
 * @description Deletes a composition by id and returns a message on success.
 */
const deleteComposition = (compositionId: number) => {
  return fetch(constructURL(`/api/compositions/${compositionId}`), {
    credentials: "include",
    method: "DELETE",
  }).then(handleResponse);
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
  return fetch(
    constructURL(`/api/compositions/collaborators/${compositionId}`),
    {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ collaboratorId }),
    }
  ).then(handleResponse);
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
  return fetch(
    constructURL(`/api/compositions/collaborators/${compositionId}`),
    {
      credentials: "include",
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ collaboratorId }),
    }
  ).then(handleResponse);
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
