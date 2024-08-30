import { Navigate } from "react-router-dom";

export const PrivateRoutes = ({ children }) => {
   const auth = JSON.parse(localStorage.getItem('auth'))
   return auth && auth?.isAuthenticated !== false ? children : (<Navigate to='/login' replace={true} />)
}