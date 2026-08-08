import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../../services/customerService";
// --- Sample Initial Data (Fallback if API is not yet connected) ---
const INITIAL_TICKETS = [
  {
    id: 'TICK-1001',
    customerName: 'Srinivas Rao',
    phone: '+91 98765 43210',
    category: 'Delivery Delay',
    priority: 'High',
    status: 'Open',
    date: '2026-08-01',
    description: 'Ordered 5 20L jars yesterday. Delivery was scheduled for 10 AM today but has not arrived.',
    waterQuantity: '5 x 20L Jars',
  },
  {
    id: 'TICK-1002',
    customerName: 'Anitha Reddy',
    phone: '+91 91234 56789',
    category: 'Water Quality',
    priority: 'Medium',
    status: 'In Progress',
    date: '2026-07-31',
    description: 'Jar cap seal was broken upon arrival. Requesting replacement jar.',
    waterQuantity: '1 x 20L Jar',
  },
  {
    id: 'TICK-1003',
    customerName: 'Apex Tech Solutions',
    phone: '+91 80000 11122',
    category: 'Billing & Invoice',
    priority: 'Low',
    status: 'Resolved',
    date: '2026-07-29',
    description: 'Requesting monthly tax invoice for July dispenser refills.',
    waterQuantity: '25 x 20L Jars',
  },
];

export default function CustomerService() {
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // New Ticket Form State
  const [newTicket, setNewTicket] = useState({
    customerName: '',
    phone: '',
    category: 'Delivery Delay',
    priority: 'Medium',
    waterQuantity: '',
    description: '',
  });

  // Fetch Tickets from Backend API (Uncomment when backend API is live)
  /*
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/customer-service/tickets');
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };
  */
 
  // Filter Logic
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.phone.includes(searchQuery);

    const matchesStatus = filterStatus === 'All' || ticket.status === filterStatus;
    const matchesPriority = filterPriority === 'All' || ticket.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Handle Status Change
  const handleStatusChange = async (id, newStatus) => {
    // Optimistic UI update
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
    if (selectedTicket && selectedTicket.id === id) {
      setSelectedTicket((prev) => ({ ...prev, status: newStatus }));
    }

    try {
      // API call to backend
      await axios.patch(`/api/customer-service/tickets/${id}`, { status: newStatus });
    } catch (error) {
      console.warn('Backend server not connected. Saved in local state.');
    }
  };

  // Handle Create New Ticket
  const handleCreateTicket = async (e) => {
    e.preventDefault();
    const createdTicket = {
      ...newTicket,
      id: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Open',
      date: new Date().toISOString().split('T')[0],
    };

    setTickets([createdTicket, ...tickets]);
    setIsNewTicketOpen(false);
    setNewTicket({
      customerName: '',
      phone: '',
      category: 'Delivery Delay',
      priority: 'Medium',
      waterQuantity: '',
      description: '',
    });

    try {
      await axios.post('/api/customer-service/tickets', createdTicket);
    } catch (error) {
      console.warn('Backend server not connected. Ticket created locally.');
    }
  };

  // Status Badge Styling Helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Open':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'In Progress':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Priority Badge Helper
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-50 text-rose-600 font-semibold';
      case 'Medium':
        return 'bg-orange-50 text-orange-600 font-medium';
      case 'Low':
        return 'bg-blue-50 text-blue-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-sky-900 flex items-center gap-2">
              <svg className="w-8 h-8 text-sky-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
              Aqua Drop — Customer Support
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage water delivery tickets, quality complaints, and customer service requests.
            </p>
          </div>
          <button
            onClick={() => setIsNewTicketOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-sm transition-all focus:ring-4 focus:ring-sky-200"
          >
            <span className="text-lg font-bold">+</span> Raise Ticket
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Tickets</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{tickets.length}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
            <p className="text-xs font-medium text-amber-600 uppercase tracking-wider">Open / Pending</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">
              {tickets.filter((t) => t.status !== 'Resolved').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
            <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider">Resolved Today</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              {tickets.filter((t) => t.status === 'Resolved').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
            <p className="text-xs font-medium text-sky-600 uppercase tracking-wider">Avg Resolution</p>
            <p className="text-2xl font-bold text-sky-600 mt-1">1.8 hrs</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket List Section */}
        <div className={`${selectedTicket ? 'hidden lg:block' : ''} lg:col-span-2 space-y-4`}>
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search ticket #, customer name, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="All">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="All">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Tickets List */}
          <div className="space-y-3">
            {filteredTickets.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-slate-200/80">
                <p className="text-slate-400">No support tickets found matching criteria.</p>
              </div>
            ) : (
              filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer hover:border-sky-300 hover:shadow-md ${
                    selectedTicket?.id === ticket.id
                      ? 'border-sky-500 ring-2 ring-sky-100 shadow-md'
                      : 'border-slate-200/80 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full">
                          {ticket.id}
                        </span>
                        <span className="text-xs text-slate-400">• {ticket.date}</span>
                      </div>
                      <h3 className="font-semibold text-slate-900 mt-1">{ticket.customerName}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{ticket.phone}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full border font-medium ${getStatusBadge(
                          ticket.status
                        )}`}
                      >
                        {ticket.status}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${getPriorityBadge(
                          ticket.priority
                        )}`}
                      >
                        {ticket.priority} Priority
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <span className="font-medium text-slate-700">Category: {ticket.category}</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-mono">
                      {ticket.waterQuantity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Selected Ticket Detail View Panel */}
        <div className={`${!selectedTicket ? 'hidden lg:block' : ''} lg:col-span-1`}>
          {selectedTicket ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm sticky top-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-sky-700">{selectedTicket.id}</span>
                  <h2 className="text-lg font-bold text-slate-900">{selectedTicket.customerName}</h2>
                </div>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="lg:hidden text-slate-400 hover:text-slate-600 text-sm font-semibold"
                >
                  ✕ Close
                </button>
              </div>

              <div className="mt-4 space-y-4 text-sm">
                <div>
                  <label className="text-xs text-slate-400 font-medium uppercase">Phone Number</label>
                  <p className="font-semibold text-slate-800">{selectedTicket.phone}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl">
                  <div>
                    <label className="text-xs text-slate-400 font-medium uppercase">Quantity</label>
                    <p className="font-medium text-slate-700">{selectedTicket.waterQuantity}</p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-medium uppercase">Category</label>
                    <p className="font-medium text-slate-700">{selectedTicket.category}</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium uppercase">Issue Description</label>
                  <p className="mt-1 text-slate-600 bg-slate-50 p-3 rounded-xl leading-relaxed">
                    {selectedTicket.description}
                  </p>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium uppercase">Update Status</label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {['Open', 'In Progress', 'Resolved'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(selectedTicket.id, status)}
                        className={`py-2 text-xs rounded-xl font-medium border transition-all ${
                          selectedTicket.status === status
                            ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <a
                    href={`tel:${selectedTicket.phone}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-xl text-xs transition-all"
                  >
                    📞 Call Customer
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm text-center">
              <p className="text-slate-400 text-sm">Select a ticket from the list to view details and update status.</p>
            </div>
          )}
        </div>
      </div>

      {/* Raise New Ticket Modal */}
      {isNewTicketOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">New Customer Ticket</h3>
              <button
                onClick={() => setIsNewTicketOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={newTicket.customerName}
                  onChange={(e) => setNewTicket({ ...newTicket, customerName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                    Phone *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 43210"
                    value={newTicket.phone}
                    onChange={(e) => setNewTicket({ ...newTicket, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                    Water Quantity
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 10 x 20L Jars"
                    value={newTicket.waterQuantity}
                    onChange={(e) => setNewTicket({ ...newTicket, waterQuantity: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Delivery Delay">Delivery Delay</option>
                    <option value="Water Quality">Water Quality</option>
                    <option value="Billing & Invoice">Billing & Invoice</option>
                    <option value="Empty Jar Return">Empty Jar Return</option>
                    <option value="New Dispenser">New Dispenser</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                    Priority
                  </label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Describe the complaint or service request..."
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewTicketOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-xl text-sm transition-all shadow-sm"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}