import { createContext, useEffect, useReducer } from "react";

// ✅ Load from localStorage
const storedUser = localStorage.getItem("user");

const initial_state = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: localStorage.getItem("token") || null,
  role: localStorage.getItem("role") || null,
};

// Create context
export const AuthContext = createContext(initial_state);

// Reducer
const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        role: null,
        token: null,
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload.user,
        role: action.payload.role,
        token: action.payload.token,
      };
    case "LOGOUT":
      return {
        user: null,
        role: null,
        token: null,
      };
    case "UPDATE_USER":
      return {
        user: action.payload.user,
        role: action.payload.role,
        token: action.payload.token,
      };
    default:
      return state;
  }
};

// Provider
export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, initial_state);

  // ✅ Save to localStorage whenever state changes
  useEffect(() => {
    if (state.user) {
      localStorage.setItem("user", JSON.stringify(state.user));
    } else {
      localStorage.removeItem("user");
    }
    state.token
      ? localStorage.setItem("token", state.token)
      : localStorage.removeItem("token");
    state.role
      ? localStorage.setItem("role", state.role)
      : localStorage.removeItem("role");
  }, [state.user, state.token, state.role]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        token: state.token,
        role: state.role,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
