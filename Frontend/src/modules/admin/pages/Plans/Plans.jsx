import React, { useState, useEffect } from 'react';
import { getPlans, createPlan, updatePlan, deletePlan } from '../../services/planService';
import { categoryService, serviceService } from '../../../../services/catalogService';
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiList, FiPackage, FiTool, FiChevronRight } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [formData, setFormData] = useState({ name: 'Silver', price: '', services: [], freeCategories: [], freeServices: [] });

  const PLAN_TYPES = ['Silver', 'Gold', 'Diamond', 'Platinum'];

  const getCardStyle = (name) => {
    const lower = name.toLowerCase();

    if (lower.includes('platinum')) {
      return {
        container: 'bg-slate-900 text-white border-slate-700 ring-1 ring-slate-700',
        text: 'text-white',
        subtext: 'text-slate-400',
        badge: 'bg-slate-800 text-white',
        price: 'text-white',
        check: 'text-slate-900 bg-white',
        footer: 'bg-slate-800 border-slate-700'
      };
    }
    if (lower.includes('diamond')) {
      return {
        container: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white border-transparent shadow-xl ring-0',
        text: 'text-white',
        subtext: 'text-indigo-100',
        badge: 'bg-white/20 text-white',
        price: 'text-white',
        check: 'text-indigo-600 bg-white',
        footer: 'bg-white/10 border-white/20'
      }
    }
    if (lower.includes('gold')) {
      return {
        container: 'bg-gradient-to-br from-amber-100 to-yellow-100 border-amber-200 text-amber-900',
        text: 'text-amber-900',
        subtext: 'text-amber-700',
        badge: 'bg-amber-200 text-amber-800',
        price: 'text-amber-900',
        check: 'text-amber-100 bg-amber-600',
        footer: 'bg-amber-50/80 border-amber-200'
      };
    }
    // Silver / Default
    return {
      container: 'bg-gradient-to-br from-gray-100 to-slate-200 border-gray-300 text-gray-800',
      text: 'text-gray-900',
      subtext: 'text-gray-600',
      badge: 'bg-white/50 text-gray-700',
      price: 'text-gray-900',
      check: 'text-gray-700 bg-white/60',
      footer: 'bg-gray-50 border-gray-200'
    };
  };

  // Catalog State
  const [categories, setCategories] = useState([]);
  const [servicesList, setServicesList] = useState([]); // All services
  const [filteredServices, setFilteredServices] = useState([]); // Services for selected category
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedService, setSelectedService] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [plansRes, catsRes, servsRes] = await Promise.all([
        getPlans(),
        categoryService.getAll({ status: 'active' }),
        serviceService.getAll({ status: 'active' })
      ]);

      if (plansRes.success) setPlans(plansRes.data);
      if (catsRes.success) setCategories(catsRes.data || catsRes.categories || []); // Handle potentially different response structures
      // Ensure we handle both {data: [...]} and just [...] or {services: [...]}
      const servicesData = servsRes.data || servsRes.services || servsRes;
      setServicesList(Array.isArray(servicesData) ? servicesData : []);

    } catch (error) {
      console.error(error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const res = await getPlans();
      if (res.success) setPlans(res.data);
    } catch (error) {
      console.error('Refresh plans failed', error);
    }
  };

  // Filter services when category changes
  useEffect(() => {
    if (!selectedCategory) {
      setFilteredServices([]);
      return;
    }
    const filtered = servicesList.filter(s => {
      // Check if categoryId matches or is in categoryIds array
      // categoryIds can be array of strings or array of objects depending on population
      const directMatch = s.categoryId === selectedCategory;
      const idsMatch = s.categoryIds && s.categoryIds.some(cat => {
        const catId = typeof cat === 'object' ? (cat.id || cat._id) : cat;
        return catId === selectedCategory;
      });
      return directMatch || idsMatch;
    });
    setFilteredServices(filtered);
    setSelectedService('');
  }, [selectedCategory, servicesList]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };

      if (currentPlan) {
        await updatePlan(currentPlan._id, payload);
        toast.success('Plan updated successfully');
      } else {
        await createPlan(payload);
        toast.success('Plan created successfully');
      }
      setIsModalOpen(false);
      fetchPlans();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Error saving plan');
    }
  };

  const handleEdit = (plan) => {
    setCurrentPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price,
      services: plan.services || [],
      freeCategories: plan.freeCategories || [],
      freeServices: plan.freeServices || []
    });
    setIsModalOpen(true);
    // Reset selections
    setSelectedCategory('');
    setSelectedService('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;
    try {
      await deletePlan(id);
      toast.success('Plan deleted successfully');
      fetchPlans();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete plan');
    }
  };

  const openCreateModal = () => {
    setCurrentPlan(null);
    setFormData({ name: 'Silver', price: '', services: [], freeCategories: [], freeServices: [] });
    setIsModalOpen(true);
    // Reset selections
    setSelectedCategory('');
    setSelectedService('');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center">
        <button
          onClick={openCreateModal}
          className="px-3 py-1.5 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 flex items-center gap-2 transition-colors shadow-sm"
        >
          <FiPlus className="w-4 h-4" /> Add New Plan
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map(plan => {
            const style = getCardStyle(plan.name);
            return (
              <div key={plan._id} className={`rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all flex flex-col h-full ${style.container}`}>
                <div className="p-4 flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className={`text-lg font-bold ${style.text}`}>{plan.name}</h3>
                    <span className={`px-1.5 py-0.5 text-[10px] rounded-full font-medium ${plan.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                      {plan.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className={`text-2xl font-bold mb-4 ${style.price}`}>
                    ₹{plan.price}
                  </div>

                  <div className="space-y-2 mb-4">
                    <h4 className={`text-[10px] font-bold uppercase tracking-wider ${style.subtext}`}>Includes</h4>
                    <div className="space-y-1.5">
                      {/* Display Free Categories First */}
                      {plan.freeCategories && plan.freeCategories.length > 0 && (
                        <div className={`flex flex-col gap-1 text-xs ${style.text}`}>
                          {plan.freeCategories.map((catId, idx) => {
                            const cat = categories.find(c => (c.id || c._id) === catId || (c.id || c._id) === (catId._id || catId));
                            return cat ? (
                              <div key={`c-${idx}`} className="flex items-center gap-2">
                                <FiCheck className={`w-3.5 h-3.5 ${style.check} rounded-full p-0.5`} />
                                <span>Unlimited {cat.title}</span>
                              </div>
                            ) : null;
                          })}
                        </div>
                      )}

                      {/* Display Free Services */}
                      {plan.freeServices && plan.freeServices.length > 0 && (
                        <div className={`flex flex-col gap-1 text-xs ${style.text}`}>
                          {plan.freeServices.map((svcId, idx) => {
                            const svc = servicesList.find(s => (s.id || s._id) === svcId || (s.id || s._id) === (svcId._id || svcId));
                            return svc ? (
                              <div key={`s-${idx}`} className="flex items-center gap-2">
                                <FiCheck className={`w-3.5 h-3.5 ${style.check} rounded-full p-0.5`} />
                                <span>Free {svc.title}</span>
                              </div>
                            ) : null;
                          })}
                        </div>
                      )}

                      {(!plan.freeCategories?.length && !plan.freeServices?.length) && (
                        <span className={`text-xs italic ${style.subtext}`}>No benefits configured</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className={`px-4 py-3 flex justify-end gap-2 border-t ${style.footer}`}>
                  <button
                    onClick={() => handleEdit(plan)}
                    className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-full transition-all duration-300"
                    title="Edit"
                  >
                    <FiEdit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(plan._id)}
                    className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-full transition-all duration-300"
                    title="Delete"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}

          {plans.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
              <p>No plans found. Create one to get started.</p>
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in duration-200 my-8 flex flex-col max-h-[90vh]">

            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{currentPlan ? 'Edit Configuration' : 'Create New Plan'}</h2>
                <p className="text-sm text-gray-500 mt-1">Define plan details and benefits</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="bg-white p-2 rounded-full text-gray-400 hover:text-gray-600 shadow-sm border border-gray-200 transition-all hover:rotate-90">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">

              {/* Basic Info Section */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Plan Type</label>
                  <select
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all font-medium"
                    required
                  >
                    {PLAN_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Monthly Price (₹)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-gray-500 font-bold">₹</span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all font-bold text-gray-800"
                      required
                      placeholder="999"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Boxed Benefits Section */}
              <div className="border border-gray-200 rounded-2xl overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                      <FiCheck className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="font-bold text-gray-800">Plan Benefits</h3>
                      <p className="text-xs text-gray-500">Configure free services included in this plan</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white space-y-6">
                  {/* Selector Row */}
                  <div className="flex flex-col md:flex-row gap-3 items-end">
                    <div className="flex-1 w-full space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase">Category</label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option value="">Select Category...</option>
                        {categories.map(cat => (
                          <option key={cat.id || cat._id} value={cat.id || cat._id}>{cat.title}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center justify-center pb-3 text-gray-400">
                      <FiChevronRight className="w-5 h-5 hidden md:block" />
                    </div>

                    <div className="flex-1 w-full space-y-1.5">
                      <label className="text-xs font-semibold text-gray-500 uppercase">Specific Service (Optional)</label>
                      <select
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        disabled={!selectedCategory}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        <option value="">All Services in Category</option>
                        {filteredServices.map(service => (
                          <option key={service.id || service._id} value={service.id || service._id}>{service.title}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      disabled={!selectedCategory}
                      onClick={() => {
                        if (selectedService) {
                          if (!formData.freeServices.includes(selectedService)) {
                            setFormData(p => ({ ...p, freeServices: [...p.freeServices, selectedService] }));
                          }
                        } else {
                          if (!formData.freeCategories.includes(selectedCategory)) {
                            setFormData(p => ({ ...p, freeCategories: [...p.freeCategories, selectedCategory] }));
                          }
                        }
                        setSelectedService('');
                      }}
                      className="h-[42px] px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/20 active:scale-95 transition-all w-full md:w-auto"
                    >
                      Add Benefit
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gray-100 w-full"></div>

                  {/* Active List */}
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-700">Active Benefits</p>

                    <div className="flex flex-wrap gap-3">
                      {/* Categories */}
                      {formData.freeCategories.map((catId, idx) => {
                        const cat = categories.find(c => (c.id || c._id) === catId);
                        return (
                          <div key={`c-tag-${idx}`} className="flex items-center gap-2 pl-3 pr-2 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-sm font-medium shadow-sm">
                            <FiPackage className="w-4 h-4" />
                            <span>{cat ? cat.title : 'Category'}</span>
                            <span className="bg-indigo-200 text-indigo-800 text-[10px] px-1.5 rounded-full uppercase">All Free</span>
                            <button
                              type="button"
                              onClick={() => setFormData(p => ({ ...p, freeCategories: p.freeCategories.filter(id => id !== catId) }))}
                              className="ml-1 p-0.5 hover:bg-white rounded-full transition-colors text-indigo-400 hover:text-red-500"
                            >
                              <FiX className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}

                      {/* Services */}
                      {formData.freeServices.map((svcId, idx) => {
                        const svc = servicesList.find(s => (s.id || s._id) === svcId);
                        return (
                          <div key={`s-tag-${idx}`} className="flex items-center gap-2 pl-3 pr-2 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-sm font-medium shadow-sm">
                            <FiTool className="w-4 h-4" />
                            <span>{svc ? svc.title : 'Service'}</span>
                            <button
                              type="button"
                              onClick={() => setFormData(p => ({ ...p, freeServices: p.freeServices.filter(id => id !== svcId) }))}
                              className="ml-1 p-0.5 hover:bg-white rounded-full transition-colors text-emerald-400 hover:text-red-500"
                            >
                              <FiX className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}

                      {formData.freeCategories.length === 0 && formData.freeServices.length === 0 && (
                        <p className="text-gray-400 text-sm italic w-full">No benefits added yet. Select a category above to start.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 sticky bottom-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-8 py-2.5 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 active:scale-95"
              >
                {currentPlan ? 'Save Changes' : 'Create Plan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Plans;
