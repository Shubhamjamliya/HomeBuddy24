import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LogoLoader from '../../../../components/common/LogoLoader';

const Categories = lazy(() => import('./Categories'));
const Products = lazy(() => import('./Products'));
const Orders = lazy(() => import('./Orders'));
const Track = lazy(() => import('./Track'));
const OrderDetails = lazy(() => import('./OrderDetails'));

const Shop = () => {
  return (
    <Suspense fallback={<LogoLoader />}>
      <Routes>
        <Route index element={<Navigate to="categories" replace />} />
        <Route path="categories" element={<Categories />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/:id" element={<OrderDetails />} />
        <Route path="track" element={<Track />} />
      </Routes>
    </Suspense>
  );
};

export default Shop;
