import { createContext, useReducer, useContext, useEffect } from "react";
import { getLoggedInUser } from "@/services/api-service";

const UserContext = createContext<User | null>(null);

const UserDispatchContext = createContext<React.Dispatch<any>>(() => null);

interface UserProviderProps {
  children: React.ReactNode;
}

interface User {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
}

interface UserAction {
  type: string;
  payload: any;
}

export function UserProvider({ children }: UserProviderProps) {
  const [User, dispatch] = useReducer(UserReducer, initialUser);
  useEffect(() => {
    getLoggedInUser()
      .then((user) => {
        dispatch({ type: "SET_USER", payload: user });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <UserContext.Provider value={User}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

export function useUserDispatch() {
  return useContext(UserDispatchContext);
}

function UserReducer(User: User, action: UserAction) {
  switch (action.type) {
    case "SET_USER": {
      return action.payload;
    }
    default: {
      return User;
    }
  }
}

const initialUser: User = {
  username: "",
  firstname: "",
  lastname: "",
  email: "",
};
