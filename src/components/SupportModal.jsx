import React, { useState } from 'react';

export default function SupportModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    subject: '',
    priority: 'Normal',
    message: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // BACKEND TEAM: Insert API call here to submit the support ticket
    // Expected Payload: { subject: string, priority: string, message: string }
    // Example: request('/api/support/tickets', 'POST', formData).then(...)
    
    setTimeout(() => {
      console.log("Support ticket payload ready for backend:", formData);
      setIsLoading(false);
      setIsSuccess(true);
      
      // Auto close modal after showing success message
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({ subject: '', priority: 'Normal', message: '' });
        onClose();
      }, 2000);
    }, 1500); // Simulated network delay
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fadeIn">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">support_agent</span>
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Contact Support</h2>
              <p className="text-[12px] font-bold text-slate-500">We usually reply within 24 hours</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 p-1.5 rounded-full transition-colors">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-6">
          {isSuccess ? (
            <div className="py-8 flex flex-col items-center justify-center text-center animate-fadeIn">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[32px]">check_circle</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Ticket Submitted!</h3>
              <p className="text-slate-500 font-medium">Our team will get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">Subject</label>
                <input 
                  type="text" 
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Brief description of the issue"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] font-bold outline-none focus:border-blue-500 transition-colors" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">Priority Level</label>
                <select 
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] font-bold outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="Low">Low - General Question</option>
                  <option value="Normal">Normal - Standard Issue</option>
                  <option value="High">High - System Malfunction</option>
                  <option value="Urgent">Urgent - Business Blocked</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">Message Details</label>
                <textarea 
                  name="message"
                  required
                  rows="4"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Please provide as much detail as possible..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] font-medium outline-none focus:border-blue-500 transition-colors resize-none" 
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 px-5 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-bold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[18px]">refresh</span>
                      Sending...
                    </>
                  ) : (
                    'Submit Ticket'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
        
      </div>
    </div>
  );
}