import React, { useState, useEffect } from 'react';
import { getPlans, createPlan, updatePlan, deletePlan } from '../../services/planService';
import { categoryService, serviceService } from '../../../../services/catalogService';
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiList } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [formData, setFormData] = useState({ name: 'Silver', price: '', services: [] });

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
  const [customService, setCustomService] = useState('');

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

  const handleAddService = () => {
    let serviceToAdd = '';
    if (selectedService) {
      const serviceObj = servicesList.find(s => (s.id || s._id) === selectedService);
      if (serviceObj) serviceToAdd = serviceObj.title;
    } else if (customService.trim()) {
      serviceToAdd = customService.trim();
    }

    if (serviceToAdd) {
      if (!formData.services.includes(serviceToAdd)) {
        setFormData(prev => ({
          ...prev,
          services: [...prev.services, serviceToAdd]
        }));
        // Reset inputs
        setSelectedService('');
        setCustomService('');
      } else {
        toast.error('Service already added');
      }
    }
  };

  const removeService = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData }; // Services is already an array

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
      services: plan.services || []
    });
    setIsModalOpen(true);
    // Reset selections
    setSelectedCategory('');
    setSelectedService('');
    setCustomService('');
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
    setFormData({ name: 'Silver', price: '', services: [] });
    setIsModalOpen(true);
    // Reset selections
    setSelectedCategory('');
    setSelectedService('');
    setCustomService('');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Subscription Plans</h1>
          <p className="text-gray-500">Manage your subscription plans</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2 transition-colors"
        >
          <FiPlus /> Add New Plan
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map(plan => {
            const style = getCardStyle(plan.name);
            return (
              <div key={plan._id} className={`rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all flex flex-col h-full ${style.container}`}>
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className={`text-xl font-bold ${style.text}`}>{plan.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${plan.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                      {plan.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className={`text-3xl font-bold mb-6 ${style.price}`}>
                    ₹{plan.price}
                  </div>

                  <div className="space-y-3 mb-6">
                    <h4 className={`text-sm font-semibold uppercase tracking-wider ${style.subtext}`}>Includes</h4>
                    <div className="space-y-2">
                      {plan.services.map((service, idx) => (
                        <div key={idx} className={`flex items-start gap-2 text-sm ${style.text}`}>
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 ${style.check}`}>
                            <FiCheck className="w-3 h-3" />
                          </div>
                          <span>{service}</span>
                        </div>
                      ))}
                      {(!plan.services || plan.services.length === 0) && (
                        <span className={`text-sm italic ${style.subtext}`}>No specific services listed</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className={`px-6 py-4 flex justify-end gap-3 border-t ${style.footer}`}>
                  <button
                    onClick={() => handleEdit(plan)}
                    className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg active:scale-95"
                    title="Edit"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(plan._id)}
                    className="p-2.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg active:scale-95"
                    title="Delete"
                  >
                    <FiTrash2 className="w-4 h-4" />
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200 my-8">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">{currentPlan ? 'Edit Plan' : 'Create New Plan'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                <select
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  required
                >
                  {PLAN_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  required
                  placeholder="e.g. 999"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Services
                </label>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-3 space-y-3">
                  {/* Category Selector */}
                  <div>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id || cat._id} value={cat.id || cat._id}>{cat.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* Service Selector */}
                  <div className="flex gap-2">
                    <select
                      value={selectedService}
                      onChange={(e) => {
                        setSelectedService(e.target.value);
                        setCustomService(''); // Clear custom if selecting from list
                      }}
                      disabled={!selectedCategory}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:bg-gray-200 disabled:text-gray-500"
                    >
                      <option value="">Select Service</option>
                      {filteredServices.map(service => (
                        <option key={service.id || service._id} value={service.id || service._id}>{service.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="text-center text-xs text-gray-400 font-medium my-1">- OR -</div>

                  {/* Custom Service Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customService}
                      onChange={(e) => {
                        setCustomService(e.target.value);
                        setSelectedService(''); // Clear select if typing custom
                      }}
                      placeholder="Type custom service name..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddService}
                      disabled={!selectedService && !customService.trim()}
                      className="px-4 py-2 bg-slate-800 text-white text-sm rounded-md hover:bg-slate-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Included Services List */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase">Included Services ({formData.services.length})</h4>
                  {formData.services.length === 0 ? (
                    <p className="text-sm text-gray-400 italic">No services added yet.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {formData.services.map((service, index) => (
                        <div key={index} className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-100">
                          <span>{service}</span>
                          <button
                            type="button"
                            onClick={() => removeService(index)}
                            className="hover:text-red-500 transition-colors ml-1 focus:outline-none"
                          >
                            <FiX className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
                >
                  {currentPlan ? 'Update Plan' : 'Create Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Plans;
