import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import History from "./pages/History";
import Wishlist from "./pages/Wishlist";
import Layout from "./Layout";
import Hot from "./pages/Hot";
import SearchResults from "./pages/SearchResults";
import Female from "./pages/Female";
import Male from "./pages/Male";
import Logout from "./pages/Logout";
import { AuthProvider } from "./contexts/AuthContext";
import { OpenRoutes} from "./routing/OpenRoutes.jsx";
import { PrivateRoutes } from "./routing/PrivateRoutes.jsx";
import ComicDetail from "./pages/ComicDetail";
import Chapter from "./pages/Chapter";
import Category from "./pages/Category";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/truyen-tranh-hot" element={<Hot />} />
            <Route path="/tim-truyen" element={<SearchResults />} />
            <Route path="/truyen-tranh-con-gai" element={<Female />} />
            <Route path="/truyen-tranh-con-trai" element={<Male />} />
            <Route path="/the-loai/:slug" element={<Category />} />
            <Route path="/truyen-tranh/:slug" element={<ComicDetail />} />
            <Route path="/truyen-tranh/:slug/:chapterName/:chapterId" element={<Chapter />} />
            <Route
              path="/logout"
              element={<PrivateRoutes><Logout /></PrivateRoutes>}
            />
            <Route
              path="/lich-su-truyen-tranh"
              element={<PrivateRoutes><History /></PrivateRoutes>}
            />
            <Route
              path="/theo-doi"
              element={<PrivateRoutes><Wishlist /></PrivateRoutes>}
            />
            <Route
              path="/login"
              element={<OpenRoutes><Login /></OpenRoutes>}
            />
            <Route
              path="/register"
              element={<OpenRoutes><Register /></OpenRoutes>}
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
