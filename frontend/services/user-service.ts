const signup = (user: string) => {
  return fetch("/users/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  }).then((res) => res.json());
};

const userService = { signup };

export default userService;
