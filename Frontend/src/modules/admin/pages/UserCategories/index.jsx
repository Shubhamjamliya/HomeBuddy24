import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ensureIds, loadCatalog } from "./utils";
import HomePage from "./pages/HomePage";
import CategoriesPage from "./pages/CategoriesPage";
import SectionsPage from "./pages/SectionsPage";
import ServicesPage from "./pages/ServicesPage";

const UserCategories = () => {
  const [catalog, setCatalog] = useState(() => ensureIds(loadCatalog()));

  useEffect(() => {
    const handler = () => setCatalog(ensureIds(loadCatalog()));
    window.addEventListener("adminUserAppCatalogUpdated", handler);
    return () => window.removeEventListener("adminUserAppCatalogUpdated", handler);
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <Routes>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<HomePage catalog={catalog} setCatalog={setCatalog} />} />
        <Route path="categories" element={<CategoriesPage catalog={catalog} setCatalog={setCatalog} />} />
        <Route path="sections" element={<SectionsPage catalog={catalog} setCatalog={setCatalog} />} />
        <Route path="services" element={<ServicesPage catalog={catalog} setCatalog={setCatalog} />} />
        <Route path="*" element={<Navigate to="home" replace />} />
      </Routes>
    </motion.div>
  );
};

export default UserCategories;


