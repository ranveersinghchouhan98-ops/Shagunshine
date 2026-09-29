import React, { useState, useEffect } from 'react';
import { Boxes, AlertTriangle, Search, Save, Check, RefreshCw, Loader2 } from 'lucide-react';
import api from '../../api/apiClient';
import { useToast } from '../../context/ToastContext';

export const AdminInventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [stockUpdates, setStockUpdates] = useState({});
  const [savingId, setSavingId] = useState(null);

  const { success, error } = useToast();

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const data = await api.get('/products?limit=100');
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleStockChange = (id, value) => {
    setStockUpdates({
      ...stockUpdates,
      [id]: Math.max(0, parseInt(value) || 0)
    });
  };

  const handleSaveStock = async (p) => {
    const newQty = stockUpdates[p.id] !== undefined ? stockUpdates[p.id] : p.stock_quantity;
    setSavingId(p.id);
    try {
      const res = await api.put(`/products/${p.id}`, {
        stock_quantity: newQty,
        status: newQty > 0 ? (p.status === 'out_of_stock' ? 'active' : p.status) : 'out_of_stock'
      });

      if (res.success) {
        success(`Stock for ${p.name} updated to ${newQty} units.`);
        fetchInventory();
      }
    } catch (err) {
      error(err.message || 'Error updating stock.');
    } finally {
      setSavingId(null);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesLow = !filterLowStock || p.stock_quantity <= 10;
    return matchesSearch && matchesLow;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Inventory & Stock Matrix
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time warehouse units, out-of-stock prevention, and bulk restocking.
          </p>
        </div>

        <button
          onClick={fetchInventory}
          className="px-4 py-2 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 flex items-center gap-1.5 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5 text-gold-700" />
          <span>Refresh Stock</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search SKU or product title..."
            className="w-full px-4 py-2 pl-10 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-gold-500"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-2.5" />
        </div>

        <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer bg-ivory-100 px-3.5 py-2 rounded-xl border border-gold-300">
          <input
            type="checkbox"
            checked={filterLowStock}
            onChange={(e) => setFilterLowStock(e.target.checked)}
            className="accent-maroon-800"
          />
          <span className="flex items-center gap-1 text-rose-700">
            <AlertTriangle className="w-3.5 h-3.5" />
            Show Low Stock (&le; 10 units) Only
          </span>
        </label>
      </div>

      {/* Stock Matrix Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Product Formulation</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Unit Price</th>
                <th className="py-3.5 px-4">Current Stock</th>
                <th className="py-3.5 px-4">Inline Restock Adjustment</th>
                <th className="py-3.5 px-4">Stock Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.map((p) => {
                const isLow = p.stock_quantity <= 10;
                const currentVal = stockUpdates[p.id] !== undefined ? stockUpdates[p.id] : p.stock_quantity;
                return (
                  <tr key={p.id} className={isLow ? 'bg-amber-50/40' : 'hover:bg-stone-50/70'}>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={Array.isArray(p.images) ? p.images[0] : ''}
                          alt=""
                          className="w-10 h-10 rounded-xl object-cover border border-stone-200"
                        />
                        <div>
                          <span className="font-bold text-stone-900 block">{p.name}</span>
                          <span className="text-[10px] font-mono text-stone-400">SKU: {p.sku}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-stone-700">
                      {p.category_name}
                    </td>

                    <td className="py-3.5 px-4 font-serif font-bold text-stone-900">
                      ₹{(p.discount_price || p.price).toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 font-bold text-sm ${isLow ? 'text-rose-600' : 'text-stone-900'}`}>
                        {isLow && <AlertTriangle className="w-4 h-4 text-rose-500" />}
                        <span>{p.stock_quantity}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          value={currentVal}
                          onChange={(e) => handleStockChange(p.id, e.target.value)}
                          className="w-20 px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs font-bold text-stone-900 bg-white text-center focus:outline-none focus:border-gold-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleStockChange(p.id, currentVal + 25)}
                          className="px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-[10px] font-bold text-stone-700"
                        >
                          +25
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStockChange(p.id, currentVal + 50)}
                          className="px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-[10px] font-bold text-stone-700"
                        >
                          +50
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        p.stock_quantity > 10
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.stock_quantity > 0
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {p.stock_quantity > 10 ? 'Healthy Stock' : p.stock_quantity > 0 ? 'Low Stock Warning' : 'Depleted'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleSaveStock(p)}
                        disabled={savingId === p.id}
                        className="px-3 py-1.5 rounded-xl bg-maroon-800 hover:bg-maroon-900 text-gold-100 text-xs font-bold flex items-center gap-1 shadow-sm ml-auto disabled:opacity-50"
                      >
                        {savingId === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        <span>Save</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
