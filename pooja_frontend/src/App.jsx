import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Packages from './pages/Packages';
import Orders from './pages/Orders';
import PujariDispatch from './pages/PujariDispatch';
import SupportTickets from './pages/SupportTickets';
import ProductModal from './components/catalog/ProductModal';
import PackageBuilder from './components/catalog/PackageBuilder';
import { api } from './api/client';
import { Loader2 } from 'lucide-react';

function DashboardApp() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [packages, setPackages] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isPackageBuilderOpen, setIsPackageBuilderOpen] = useState(false);

  // Fetch products, packages, and orders from live backend
  const fetchData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [prodRes, pkgRes, orderRes] = await Promise.allSettled([
        api.getProducts(),
        api.getPackages(),
        api.getAllOrders(),
      ]);

      if (prodRes.status === 'fulfilled' && prodRes.value.success) {
        setProducts(prodRes.value.data || []);
      }
      if (pkgRes.status === 'fulfilled' && pkgRes.value.success) {
        setPackages(pkgRes.value.data || []);
      }
      if (orderRes.status === 'fulfilled' && orderRes.value.success) {
        setOrders(orderRes.value.data || []);
      }
    } catch (err) {
      console.error('Error fetching catalog data:', err);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, fetchData]);

  // Product CRUD Handlers
  const handleSaveProduct = async (productData) => {
    if (editingProduct) {
      const res = await api.updateProduct(editingProduct.id, productData);
      if (res.success && res.data) {
        setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? res.data : p)));
      }
    } else {
      const res = await api.createProduct(productData);
      if (res.success && res.data) {
        setProducts((prev) => [...prev, res.data]);
      }
    }
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (id) => {
    await api.deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Package Assembly Handler
  const handleSavePackage = async (packageData) => {
    const res = await api.createPackage(packageData);
    if (res.success && res.data) {
      setPackages((prev) => [...prev, res.data]);
    }
  };

  // Order Status Handler (Phase 2)
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    const res = await api.updateOrderStatus(orderId, newStatus);
    if (res.success && res.data) {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
      // Re-fetch products because status cancellation restores inventory stock
      if (newStatus === 'cancelled') {
        const prodRes = await api.getProducts();
        if (prodRes.success) setProducts(prodRes.data || []);
      }
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  const tabTitles = {
    dashboard: { title: 'Executive Overview', subtitle: 'Real-time metrics, active packages, and catalog health' },
    products: { title: 'Inventory Management', subtitle: 'Manage devotional catalog items, stock quantities, and prices' },
    packages: { title: 'Pooja Packages', subtitle: 'Assemble ritual kits with automated masked pricing and item deduction' },
    orders: { title: 'Orders & Customization', subtitle: 'Phase 2: Live order governance, dynamic deductions & status lifecycles' },
    'pujari-dispatch': { title: 'Zonal Pujari Dispatch', subtitle: 'Phase 3: Real-time broadcast engine & atomic Redis locks' },
    'support-tickets': { title: 'Support & Transcripts', subtitle: 'Phase 4: Customer ticket governance and live audit logs' },
  };

  const currentMeta = tabTitles[currentTab] || tabTitles.dashboard;

  return (
    <AdminLayout
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
      title={currentMeta.title}
      subtitle={currentMeta.subtitle}
      onRefresh={fetchData}
    >
      {currentTab === 'dashboard' && (
        <Dashboard
          products={products}
          packages={packages}
          orders={orders}
          onNavigate={setCurrentTab}
          onOpenProductModal={() => {
            setEditingProduct(null);
            setIsProductModalOpen(true);
          }}
          onOpenPackageBuilder={() => setIsPackageBuilderOpen(true)}
        />
      )}

      {currentTab === 'products' && (
        <Products
          products={products}
          onOpenCreate={() => {
            setEditingProduct(null);
            setIsProductModalOpen(true);
          }}
          onOpenEdit={(p) => {
            setEditingProduct(p);
            setIsProductModalOpen(true);
          }}
          onDelete={handleDeleteProduct}
        />
      )}

      {currentTab === 'packages' && (
        <Packages
          packages={packages}
          onOpenPackageBuilder={() => setIsPackageBuilderOpen(true)}
        />
      )}

      {currentTab === 'orders' && (
        <Orders
          orders={orders}
          onStatusUpdate={handleUpdateOrderStatus}
        />
      )}

      {currentTab === 'pujari-dispatch' && <PujariDispatch />}
      {currentTab === 'support-tickets' && <SupportTickets />}

      {/* Product Create / Edit Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
      />

      {/* Package Builder Modal */}
      <PackageBuilder
        isOpen={isPackageBuilderOpen}
        onClose={() => setIsPackageBuilderOpen(false)}
        onSave={handleSavePackage}
        availableProducts={products}
      />
    </AdminLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DashboardApp />
    </AuthProvider>
  );
}
