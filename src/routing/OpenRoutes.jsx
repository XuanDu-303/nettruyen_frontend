import { Navigate } from "react-router-dom";

export const OpenRoutes = ({ children }) => {
   const auth = JSON.parse(localStorage.getItem('auth'))
   return auth?.isAuthenticated === false || auth === null ? children : (<Navigate to='/' replace={true} />)
}
