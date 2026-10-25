import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  Mail,
  Send,
  Calendar,
  DollarSign,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Building2,
  ShieldCheck,
  FileText,
  CreditCard,
  Layers,
  ArrowUpRight,
  RefreshCw,
  Info
} from 'lucide-react';
import api from '../../api/apiClient';
import { useToast } from '../../context/ToastContext';

export const AdminReportsPage = () => {
  const [data, setData] = useState(null);
  const [caReport, setCaReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ca'); // 'ca' | 'overview'

  // CA Direct Dispatch Modal & Form State
  const [isCaModalOpen, setIsCaModalOpen] = useState(false);
  const [caEmail, setCaEmail] = useState('');
  const [caName, setCaName] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('Current Financial Year');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [notesToCa, setNotesToCa] = useState('');
  const [isSending, setIsSending] = useState(false);

  const { success, error } = useToast();

  const fetchReports = async () => {
    setLoading(true);
    try {
      const [dashRes, caRes] = await Promise.all([
        api.get('/reports/dashboard'),
        api.get('/reports/ca-summary')
      ]);
      if (dashRes.success) setData(dashRes);
      if (caRes.success) {
        setCaReport(caRes);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // Try to load stored CA email if available
    api.get('/settings')
      .then(res => {
        if (res.success && res.settings?.ca_dispatch_config) {
          const cfg = res.settings.ca_dispatch_config;
          if (cfg.caEmail) setCaEmail(cfg.caEmail);
          if (cfg.caName) setCaName(cfg.caName);
        }
      })
      .catch(() => {});
  }, []);

  const handleApplyFilter = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (customStartDate) query.append('startDate', customStartDate);
      if (customEndDate) query.append('endDate', customEndDate);
      const res = await api.get(`/reports/ca-summary?${query.toString()}`);
      if (res.success) setCaReport(res);
      success('Filtered CA business report updated.');
    } catch (err) {
      error('Failed to filter records.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCaCSV = () => {
    const apiUrl = import.meta.env.PROD ? '/api' : (import.meta.env.VITE_API_URL || '/api');
    const query = new URLSearchParams();
    if (customStartDate) query.append('startDate', customStartDate);
    if (customEndDate) query.append('endDate', customEndDate);
    const token = localStorage.getItem('shagun_token');
    window.open(`${apiUrl}/reports/export/ca-csv?token=${token}&${query.toString()}`, '_blank');
    success('Downloading CA GST-Ready B2C Inward/Outward Sales CSV...');
  };

  const handleSendToCa = async (e) => {
    e.preventDefault();
    if (!caEmail || !caEmail.includes('@')) {
      error('Please enter a valid CA email address.');
      return;
    }

    setIsSending(true);
    try {
      const res = await api.post('/reports/send-ca-report', {
        caEmail: caEmail.trim(),
        caName: caName.trim(),
        period: selectedPeriod,
        notes: notesToCa
      });

      if (res.success) {
        success(`Report ready & sent to CA (${caEmail})!`);
        setIsCaModalOpen(false);

        // Also trigger mailto so user's client opens directly with pre-filled figures
        const subject = encodeURIComponent(`Shagun Shine Cosmetics - Sales & GST Financial Report (${selectedPeriod})`);
        const summaryText = caReport?.summary;
        const meta = caReport?.reportMetadata;
        const body = encodeURIComponent(
`Respected ${caName || 'Chartered Accountant'},

Please find the verified sales, turnover, and GST summary of Shagun Shine Cosmetics for ${selectedPeriod}:

BUSINESS DETAILS:
- Legal Entity: ${meta?.businessName || 'Shagun Shine Cosmetics'}
- GSTIN: ${meta?.gstin || '23AAAAA0000A1Z5'}
- Jurisdiction: ${meta?.jurisdiction || 'Indore, Madhya Pradesh'}

FINANCIAL SUMMARY:
- Gross Sales Turnover: ₹${(summaryText?.grossTurnover || 0).toLocaleString()}
- Total Verified Invoices: ${summaryText?.totalInvoices || 0}
- Taxable Supply Value: ₹${(summaryText?.totalTaxable || 0).toLocaleString()}
- Central GST (CGST 9%): ₹${(summaryText?.totalCgst || 0).toLocaleString()}
- State GST (SGST 9%): ₹${(summaryText?.totalSgst || 0).toLocaleString()}
- Integrated GST (IGST 18%): ₹${(summaryText?.totalIgst || 0).toLocaleString()}
- Total Output GST Liability: ₹${(summaryText?.totalGstTax || 0).toLocaleString()}

PAYMENT BREAKDOWN:
${caReport?.paymentBreakdown?.map(p => `- ${p.payment_method}: ₹${p.amount.toLocaleString()} (${p.transaction_count} orders)`).join('\n') || '- 100% Prepaid via Razorpay & UPI'}

Note from Merchant:
${notesToCa || 'Please file our GSTR-1 and GSTR-3B based on these figures. Complete transaction CSV has been exported and attached.'}

Warm regards,
Accounts Department
Shagun Shine Cosmetics Private Limited`
        );

        window.open(`mailto:${caEmail}?subject=${subject}&body=${body}`, '_blank');
      } else {
        error(res.message || 'Could not send report to CA.');
      }
    } catch (err) {
      error(err.message || 'Error sending report.');
    } finally {
      setIsSending(false);
    }
  };

  if (loading && !data && !caReport) {
    return <div className="py-20 text-center text-xs text-stone-500">Compiling financial reports & CA ledger...</div>;
  }

  const { stats, revenueByCategory, topProducts } = data || {};
  const caSummary = caReport?.summary || {};
  const caMeta = caReport?.reportMetadata || {};

  return (
    <div className="space-y-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
              CA & GST Ready
            </span>
            <span className="text-xs text-stone-400">• Indore, Madhya Pradesh</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Business Financials & CA Report Dispatch
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Auto-calculates gross turnover, taxable amounts, and CGST/SGST breakdown ready for your Chartered Accountant.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-4 h-4 text-stone-600" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleExportCaCSV}
            className="px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-800 flex items-center gap-1.5 shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export CA Excel/CSV</span>
          </button>

          <button
            onClick={() => setIsCaModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-maroon-800 to-maroon-900 hover:from-maroon-900 hover:to-stone-950 text-gold-100 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all"
          >
            <Send className="w-4 h-4 text-gold-400" />
            <span>Send to My CA Directly</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200">
        <button
          onClick={() => setActiveTab('ca')}
          className={`py-3 px-6 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'ca'
              ? 'border-maroon-800 text-maroon-900 bg-maroon-50/30'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Building2 className="w-4 h-4 text-maroon-800" />
          <span>CA & GST Balance Sheet</span>
        </button>
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-6 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'border-maroon-800 text-maroon-900 bg-maroon-50/30'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-maroon-800" />
          <span>Product Line & SKU Performance</span>
        </button>
      </div>

      {activeTab === 'ca' && (
        <div className="space-y-6">
          {/* Date Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-maroon-800 shrink-0" />
              <span className="text-xs font-bold text-stone-700">Audit Period:</span>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-gold-500 text-stone-700"
              />
              <span className="text-xs text-stone-400">to</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:border-gold-500 text-stone-700"
              />
              <button
                onClick={handleApplyFilter}
                className="px-3.5 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors"
              >
                Apply
              </button>
              {(customStartDate || customEndDate) && (
                <button
                  onClick={() => { setCustomStartDate(''); setCustomEndDate(''); fetchReports(); }}
                  className="text-xs text-stone-400 hover:text-stone-600 underline"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="text-xs text-stone-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Entity: <strong>{caMeta.businessName || 'Shagun Shine Cosmetics'}</strong> (GSTIN: {caMeta.gstin})</span>
            </div>
          </div>

          {/* CA Executive Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Gross Sales Turnover</span>
                <DollarSign className="w-4 h-4 text-maroon-800" />
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-maroon-900">
                ₹{(caSummary.grossTurnover || 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-stone-400">{caSummary.totalInvoices || 0} Invoices Generated</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Taxable Value</span>
                <FileText className="w-4 h-4 text-amber-700" />
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                ₹{(caSummary.totalTaxable || 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-stone-400">Net Sales before GST</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">CGST (9%)</span>
                <span className="text-[10px] font-bold text-stone-400 bg-stone-100 px-2 py-0.5 rounded">Central</span>
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                ₹{(caSummary.totalCgst || 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-stone-400">SGST (9%): ₹{(caSummary.totalSgst || 0).toLocaleString()}</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-stone-50 p-5 rounded-2xl border border-emerald-200/80 shadow-sm space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Total Output GST</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-emerald-800">
                ₹{(caSummary.totalGstTax || 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-emerald-700 font-medium">Ready for GSTR-1 & 3B</p>
            </div>
          </div>

          {/* Two-Column Detail Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 6 cols: Payment Realization & Mode */}
            <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
              <h3 className="font-serif text-base font-bold text-stone-900 flex items-center justify-between pb-3 border-b border-stone-100">
                <span>Collections by Payment Mode</span>
                <span className="text-[11px] text-stone-400 font-sans font-normal">Bank Realization</span>
              </h3>
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-50 text-stone-600 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">Mode</th>
                    <th className="py-2.5 px-3">Orders</th>
                    <th className="py-2.5 px-3 text-right">Settled Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {caReport?.paymentBreakdown?.map((p) => (
                    <tr key={p.payment_method} className="hover:bg-stone-50/70">
                      <td className="py-3 px-3 font-semibold text-stone-800 flex items-center gap-2">
                        <CreditCard className="w-3.5 h-3.5 text-stone-500" />
                        <span>{p.payment_method}</span>
                      </td>
                      <td className="py-3 px-3 text-stone-600">{p.transaction_count} transactions</td>
                      <td className="py-3 px-3 text-right font-serif font-bold text-stone-900">
                        ₹{Number(p.amount).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {(!caReport?.paymentBreakdown || caReport?.paymentBreakdown.length === 0) && (
                    <tr>
                      <td colSpan={3} className="py-4 text-center text-stone-400">No payment records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Right 6 cols: HSN-Wise Summary for GST Return */}
            <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
              <h3 className="font-serif text-base font-bold text-stone-900 flex items-center justify-between pb-3 border-b border-stone-100">
                <span>HSN-Wise Summary (GSTR-1 Table 12)</span>
                <span className="text-[11px] text-stone-400 font-sans font-normal">Cosmetics 18%</span>
              </h3>
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-50 text-stone-600 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">HSN Code</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Qty</th>
                    <th className="py-2.5 px-3 text-right">Total Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {caReport?.hsnBreakdown?.map((h) => (
                    <tr key={h.hsn_code} className="hover:bg-stone-50/70">
                      <td className="py-3 px-3 font-mono font-semibold text-maroon-800">{h.hsn_code}</td>
                      <td className="py-3 px-3 text-stone-700">{h.category_name || 'Beauty & Cosmetics'}</td>
                      <td className="py-3 px-3 text-stone-600">{h.total_quantity_sold} pcs</td>
                      <td className="py-3 px-3 text-right font-serif font-bold text-stone-900">
                        ₹{Number(h.total_sales_value).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {(!caReport?.hsnBreakdown || caReport?.hsnBreakdown.length === 0) && (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-stone-400">No HSN data found for period.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Invoice Audit Trail Table */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  B2C Invoices Ledger (For CA Verification)
                </h3>
                <p className="text-xs text-stone-500">Each invoice includes complete tax component breakdown</p>
              </div>
              <button
                onClick={handleExportCaCSV}
                className="px-3.5 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Download className="w-3.5 h-3.5 text-stone-500" />
                <span>Export Full Ledger</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-600 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-3">Invoice No.</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3 text-right">Taxable (₹)</th>
                    <th className="py-3 px-3 text-right">CGST 9% (₹)</th>
                    <th className="py-3 px-3 text-right">SGST 9% (₹)</th>
                    <th className="py-3 px-3 text-right">Gross Total (₹)</th>
                    <th className="py-3 px-3">Payment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {caReport?.invoices?.map((inv) => (
                    <tr key={inv.id} className="hover:bg-stone-50/60">
                      <td className="py-3 px-3 font-semibold text-stone-900">{inv.invoice_number}</td>
                      <td className="py-3 px-3 text-stone-500">{inv.invoice_date}</td>
                      <td className="py-3 px-3 text-stone-800">{inv.customer_name}</td>
                      <td className="py-3 px-3 text-right font-mono text-stone-700">{Number(inv.taxable_amount).toFixed(2)}</td>
                      <td className="py-3 px-3 text-right font-mono text-stone-600">{Number(inv.cgst_amount).toFixed(2)}</td>
                      <td className="py-3 px-3 text-right font-mono text-stone-600">{Number(inv.sgst_amount).toFixed(2)}</td>
                      <td className="py-3 px-3 text-right font-serif font-bold text-maroon-900">
                        ₹{Number(inv.total_amount).toLocaleString()}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {inv.payment_method}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {(!caReport?.invoices || caReport?.invoices.length === 0) && (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-stone-400">No invoices generated for this period.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'overview' && (
        <div id="printable-invoice" className="space-y-8">
          {/* KPI Financial Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Gross Turnover</span>
              <div className="font-serif text-3xl font-bold text-maroon-900">
                ₹{(stats?.totalRevenue || 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-stone-400">Total verified orders placed</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Total Shipments</span>
              <div className="font-serif text-3xl font-bold text-stone-900">
                {stats?.totalOrders || 0} Orders
              </div>
              <p className="text-[11px] text-stone-400">100% Free Shipping Dispatched</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Average Order Value (AOV)</span>
              <div className="font-serif text-3xl font-bold text-stone-900">
                ₹{(stats?.averageOrderValue || 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-emerald-700 font-semibold">Average basket size</p>
            </div>
          </div>

          {/* Category Breakdown Table */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-stone-900 pb-2 border-b border-stone-100">
              Revenue by Cosmetic Line
            </h3>
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 rounded-l-lg">Category</th>
                  <th className="py-3 px-4">Units Sold</th>
                  <th className="py-3 px-4 text-right rounded-r-lg">Gross Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {revenueByCategory?.map((cat) => (
                  <tr key={cat.category} className="hover:bg-stone-50">
                    <td className="py-3 px-4 font-bold text-stone-900">{cat.category}</td>
                    <td className="py-3 px-4 text-stone-600">{cat.units_sold || 0} units</td>
                    <td className="py-3 px-4 text-right font-serif font-bold text-maroon-900 text-sm">
                      ₹{(cat.revenue || 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Top Products Performance Table */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-stone-900 pb-2 border-b border-stone-100">
              Top Performing SKUs
            </h3>
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 rounded-l-lg">Product Title</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Units Sold</th>
                  <th className="py-3 px-4 text-right rounded-r-lg">Total Sales Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {topProducts?.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50">
                    <td className="py-3 px-4 font-bold text-stone-900">{p.name}</td>
                    <td className="py-3 px-4 font-mono text-stone-500">{p.sku}</td>
                    <td className="py-3 px-4 text-stone-700">{p.total_sold || 0} units</td>
                    <td className="py-3 px-4 text-right font-serif font-bold text-maroon-900 text-sm">
                      ₹{(p.total_revenue || 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Direct Send to CA Modal */}
      {isCaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-gold-300/60 shadow-2xl overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-stone-950 via-maroon-950 to-stone-950 text-stone-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-gold-400 tracking-widest block">
                  Chartered Accountant Dispatch
                </span>
                <h3 className="font-serif text-lg font-bold text-white">Send Business Sale Report to CA</h3>
              </div>
              <button
                onClick={() => setIsCaModalOpen(false)}
                className="text-stone-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendToCa} className="p-6 space-y-4 text-xs">
              {/* Highlight summary to be sent */}
              <div className="p-3.5 rounded-xl bg-gold-50/70 border border-gold-200 space-y-1.5">
                <div className="flex justify-between font-bold text-stone-900 text-xs">
                  <span>Gross Sales To Dispatch:</span>
                  <span className="font-serif text-maroon-900">₹{(caSummary.grossTurnover || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-600 text-[11px]">
                  <span>Taxable Value: ₹{(caSummary.totalTaxable || 0).toLocaleString()}</span>
                  <span>Total GST: ₹{(caSummary.totalGstTax || 0).toLocaleString()}</span>
                </div>
                <div className="text-[10px] text-stone-500 pt-1 border-t border-gold-200/60">
                  Includes CGST (9%), SGST (9%), B2C small inward/outward invoices & HSN table.
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">CA's Email Address *</label>
                <input
                  type="email"
                  required
                  value={caEmail}
                  onChange={(e) => setCaEmail(e.target.value)}
                  placeholder="e.g. ca.sharma@accountingfirm.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-gold-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-800 block mb-1">CA / Firm Name</label>
                  <input
                    type="text"
                    value={caName}
                    onChange={(e) => setCaName(e.target.value)}
                    placeholder="e.g. CA Rajesh Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-gold-500 text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-800 block mb-1">Audit Period</label>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-gold-500 text-xs bg-white"
                  >
                    <option value="Current Financial Year">Current Financial Year</option>
                    <option value="Current Quarter (Q3)">Current Quarter</option>
                    <option value="Current Month">Current Month</option>
                    <option value="Custom Date Range">Filtered Range</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">Special Instructions for Filing (Optional)</label>
                <textarea
                  rows={3}
                  value={notesToCa}
                  onChange={(e) => setNotesToCa(e.target.value)}
                  placeholder="e.g. Please file GSTR-1 for Indore cosmetics division before 11th. Invoices are B2C prepaid."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-gold-500 text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCaModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-maroon-800 to-maroon-900 hover:from-maroon-900 hover:to-stone-950 text-gold-100 font-bold uppercase tracking-wider flex items-center gap-2 shadow-md disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-gold-400" />
                  <span>{isSending ? 'Compiling & Sending...' : 'Dispatch Report to CA'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
