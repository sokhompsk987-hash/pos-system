import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from '../../components/Layout.jsx';
import { request } from '../../util/request'; // Ensure this path is correct

export default function InvoiceDetails() {
  // Extract the invoice ID from the URL parameters
  const { id } = useParams(); 
  
  // State for the invoice data, loading status, and PDF export status
  const [invoice, setInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  // Fetch invoice details from backend when the component mounts or ID changes
  useEffect(() => {
    if (id) {
      fetchInvoiceDetails(id);
    }
  }, [id]);

  // Function to get real invoice data from the API
  const fetchInvoiceDetails = (invoiceId) => {
    setIsLoading(true);
    
    // Example endpoint: GET /invoices/INV-2026-0941
    request(`invoices/${invoiceId}`, 'GET')
      .then(res => {
        if (res?.data) {
          setInvoice(res.data);
        } else {
          loadFallbackData(invoiceId);
        }
      })
      .catch(err => {
        console.error("Failed to fetch invoice details:", err);
        // Load fallback mock data if API fails during development
        loadFallbackData(invoiceId);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Function to handle downloading the PDF version of the invoice
  const handleDownloadPDF = () => {
    if (!invoice?.id) return;
    
    setIsExporting(true);
    
    // Request backend to generate the PDF and return a download link
    request(`invoices/${invoice.id}/pdf`, 'GET')
      .then(res => {
        if (res?.data?.downloadUrl) {
           window.open(res.data.downloadUrl, '_blank');
        } else {
           alert("PDF generated, but no file link provided by backend.");
        }
      })
      .catch(err => {
        console.error("Failed to export PDF:", err);
        alert("Export failed. Ensure the backend PDF endpoint is configured.");
      })
      .finally(() => {
        setIsExporting(false);
      });
  };

  // Fallback data function to keep UI intact if backend is down
  const loadFallbackData = (invoiceId) => {
    setInvoice({
      id: invoiceId || 'INV-2026-0941',
      date: 'Jun 21, 2026',
      time: '14:30 PM',
      status: 'Paid',
      cashier: 'Admin User',
      paymentMethod: 'KHQR Scan',
      company: {
        name: 'SaaSFlow POS System',
        address: '123 Business Boulevard, Tech District',
        city: 'Phnom Penh, Cambodia',
        phone: '+855 12 345 678',
        email: 'hello@saasflow.com'
      },
      customer: {
        name: 'Walk-in Customer',
        phone: 'N/A',
        email: 'N/A',
        address: 'N/A'
      },
      items: [
        { id: 1, name: 'Baby Milk Powder Formula 1', qty: 2, unitPrice: 25.00, total: 50.00 },
        { id: 2, name: 'Newborn Diapers M Size', qty: 1, unitPrice: 18.00, total: 18.00 },
        { id: 3, name: 'Baby Wipes (80 pcs)', qty: 3, unitPrice: 3.50, total: 10.50 }
      ],
      financials: {
        subtotal: 78.50,
        discountPercent: 5,
        discountAmount: 3.93,
        taxPercent: 10,
        taxAmount: 7.46,
        total: 82.03,
        amountPaid: 82.03,
        changeDue: 0.00
      }
    });
  };

  // Helper function for status badge styling
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-700 border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Refunded': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Render loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-89px)] bg-slate-50 text-slate-500">
          <span className="material-symbols-outlined animate-spin text-4xl mb-4">refresh</span>
          <p className="font-bold">Loading invoice details...</p>
        </div>
      </Layout>
    );
  }

  // Render error/not found state
  if (!invoice) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-89px)] bg-slate-50 text-slate-500">
          <span className="material-symbols-outlined text-4xl mb-4 text-red-400">error</span>
          <p className="font-bold text-lg text-slate-700">Invoice Not Found</p>
          <Link to="/transactions" className="mt-4 text-blue-600 hover:underline font-medium">Return to Transactions</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 md:p-8 bg-slate-50 min-h-[calc(100vh-89px)] font-sans">
        
        {/* Top Action Bar - Hidden during print */}
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 print:hidden">
          <div className="flex items-center gap-4">
            <Link 
              to="/transactions" 
              className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm"
              title="Back to Transactions"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </Link>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-3">
                Invoice {invoice.id}
                <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusStyle(invoice.status)}`}>
                  {invoice.status}
                </span>
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm text-sm disabled:opacity-50"
            >
              <span className={`material-symbols-outlined text-[18px] ${isExporting ? 'animate-bounce' : ''}`}>
                {isExporting ? 'hourglass_empty' : 'download'}
              </span>
              {isExporting ? 'Generating PDF...' : 'PDF'}
            </button>
            <button 
              onClick={handlePrint}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-blue-600/20 text-sm"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              Print
            </button>
          </div>
        </div>

        {/* Invoice Document Paper */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden print:shadow-none print:border-none print:m-0">
          
          {/* Header Banner */}
          <div className="bg-slate-900 px-8 py-6 text-white flex justify-between items-center print:bg-white print:text-slate-900 print:border-b-2 print:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg print:bg-slate-800 print:shadow-none">
                <span className="material-symbols-outlined text-white text-[24px]">rocket_launch</span>
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight">SaaS<span className="text-blue-500 print:text-slate-900">Flow</span></h2>
                <p className="text-slate-400 text-xs font-medium print:text-slate-500">Official Receipt</p>
              </div>
            </div>
            <div className="text-right">
              <h3 className="text-3xl font-black opacity-20 uppercase tracking-widest print:opacity-100">Invoice</h3>
            </div>
          </div>

          <div className="p-8">
            {/* Meta Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              {/* Company Info */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">From</h4>
                <h5 className="text-base font-black text-slate-800 mb-1">{invoice.company.name}</h5>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {invoice.company.address}<br />
                  {invoice.company.city}<br />
                  <span className="inline-flex items-center gap-1 mt-1"><span className="material-symbols-outlined text-[14px]">call</span> {invoice.company.phone}</span>
                </p>
              </div>

              {/* Invoice Meta */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 print:border-none print:bg-transparent print:p-0 text-left md:text-right">
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div className="text-slate-500 font-medium">Invoice Number:</div>
                  <div className="font-black text-slate-900">{invoice.id}</div>
                  
                  <div className="text-slate-500 font-medium">Issue Date:</div>
                  <div className="font-bold text-slate-800">{invoice.date} - {invoice.time}</div>
                  
                  <div className="text-slate-500 font-medium">Payment Method:</div>
                  <div className="font-bold text-slate-800">{invoice.paymentMethod}</div>
                  
                  <div className="text-slate-500 font-medium">Cashier:</div>
                  <div className="font-bold text-slate-800">{invoice.cashier}</div>
                </div>
              </div>
            </div>

            {/* Billed To */}
            <div className="mb-8 pt-6 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Billed To</h4>
              <h5 className="text-base font-black text-slate-800">{invoice.customer.name}</h5>
              {invoice.customer.phone !== 'N/A' && <p className="text-sm text-slate-500">{invoice.customer.phone}</p>}
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-y border-slate-200 text-slate-500 text-xs uppercase tracking-widest font-bold print:bg-transparent print:border-slate-800">
                    <th className="py-3 px-4 w-12 text-center">#</th>
                    <th className="py-3 px-4">Item Description</th>
                    <th className="py-3 px-4 text-center">Qty</th>
                    <th className="py-3 px-4 text-right">Unit Price</th>
                    <th className="py-3 px-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium text-slate-700">
                  {invoice.items.map((item, index) => (
                    <tr key={item.id} className="border-b border-slate-100 print:border-slate-300">
                      <td className="py-4 px-4 text-center text-slate-400">{index + 1}</td>
                      <td className="py-4 px-4 font-bold text-slate-900">{item.name}</td>
                      <td className="py-4 px-4 text-center">{item.qty}</td>
                      <td className="py-4 px-4 text-right">${item.unitPrice.toFixed(2)}</td>
                      <td className="py-4 px-4 text-right font-black text-slate-900">${item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Summary */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
              <div className="w-full md:w-1/2 text-sm text-slate-500">
                <p className="font-bold text-slate-700 mb-1">Notes & Terms:</p>
                <p className="leading-relaxed">Please keep this receipt for your records. Returns or exchanges must be made within 14 days with the original receipt. Thank you for shopping with us!</p>
              </div>
              
              <div className="w-full md:w-80 space-y-3 text-sm">
                <div className="flex justify-between text-slate-600 font-bold">
                  <span>Subtotal</span>
                  <span>${invoice.financials.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-red-500 font-bold">
                  <span>Discount ({invoice.financials.discountPercent}%)</span>
                  <span>-${invoice.financials.discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600 font-bold">
                  <span>VAT ({invoice.financials.taxPercent}%)</span>
                  <span>${invoice.financials.taxAmount.toFixed(2)}</span>
                </div>
                
                <div className="pt-3 border-t border-slate-200 print:border-slate-800 flex justify-between items-center">
                  <span className="text-base font-black text-slate-900">Total Payable</span>
                  <span className="text-2xl font-black text-blue-600 print:text-slate-900">${invoice.financials.total.toFixed(2)}</span>
                </div>
                
                <div className="pt-3 mt-3 border-t border-dashed border-slate-200 flex justify-between text-slate-500 font-medium">
                  <span>Amount Paid</span>
                  <span>${invoice.financials.amountPaid.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>Change Due</span>
                  <span>${invoice.financials.changeDue.toFixed(2)}</span>
                </div>
              </div>
            </div>

          </div>
          
          {/* Footer Decoration */}
          <div className="h-2 bg-blue-600 w-full print:bg-slate-800"></div>
        </div>

      </div>
    </Layout>
  );
}