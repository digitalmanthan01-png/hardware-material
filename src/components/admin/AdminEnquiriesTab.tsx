import React from 'react';
import { BulkEnquiry } from '../../types';
import { api } from '../../services/api';
import { useStore } from '../../context/StoreContext';
import { Building2, Phone, Mail, CheckCircle2, MessageCircle, Clock } from 'lucide-react';

export const AdminEnquiriesTab: React.FC<{
  enquiries: BulkEnquiry[];
  onRefresh: () => void;
}> = ({ enquiries, onRefresh }) => {
  const { showToast, openWhatsAppEnquiry } = useStore();

  const handleUpdateStatus = async (id: string, status: BulkEnquiry['status']) => {
    try {
      await api.updateBulkEnquiry(id, { status });
      showToast(`Enquiry marked as ${status}`, 'success');
      onRefresh();
    } catch {
      showToast('Failed to update enquiry status', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
        <h3 className="text-sm font-bold text-gray-900">Contractor & B2B Wholesale Enquiries</h3>
        <p className="text-[11px] text-gray-500">
          Quotations requested by builders, furniture factories, and interior architects.
        </p>
      </div>

      <div className="space-y-4">
        {enquiries.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center text-xs text-gray-500">
            No pending contractor enquiries at the moment.
          </div>
        ) : (
          enquiries.map(enq => (
            <div key={enq.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#E87500] flex items-center justify-center font-bold text-xs">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                      {enq.name} {enq.companyName ? `(${enq.companyName})` : ''}
                    </h4>
                    <span className="text-[11px] text-gray-400">
                      City: {enq.city || 'Not specified'} · {new Date(enq.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={enq.status}
                    onChange={e => handleUpdateStatus(enq.id, e.target.value as any)}
                    className="text-xs font-semibold px-2.5 py-1 bg-gray-50 border rounded-lg"
                  >
                    <option value="new">Status: New</option>
                    <option value="contacted">Status: Contacted</option>
                    <option value="quoted">Status: Quoted</option>
                    <option value="closed">Status: Closed</option>
                  </select>
                </div>
              </div>

              {/* Requirements */}
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs">
                <span className="font-bold text-gray-700 block mb-1">Requested Hardware Bill of Materials:</span>
                <p className="text-gray-800 whitespace-pre-line leading-relaxed font-medium">
                  {enq.productsRequired}
                </p>
                {enq.estimatedQuantity && (
                  <p className="text-[11px] text-[#083B82] font-semibold mt-2">
                    Estimated Scale: {enq.estimatedQuantity}
                  </p>
                )}
              </div>

              {/* Contact actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
                <div className="flex items-center gap-4 text-gray-600">
                  <a href={`tel:${enq.phone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-1 hover:text-[#124DA6]">
                    <Phone className="w-3.5 h-3.5 text-[#124DA6]" />
                    <span className="font-bold">{enq.phone}</span>
                  </a>
                  {enq.email && (
                    <a href={`mailto:${enq.email}`} className="flex items-center gap-1 hover:text-[#124DA6]">
                      <Mail className="w-3.5 h-3.5 text-[#124DA6]" />
                      <span>{enq.email}</span>
                    </a>
                  )}
                </div>

                <button
                  onClick={() => openWhatsAppEnquiry(undefined, `Hello ${enq.name}, this is Devshree - The Hardware Gallery regarding your bulk hardware quotation request.`)}
                  className="bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold py-1.5 px-3 rounded-lg flex items-center gap-1 text-[11px]"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Contractor</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
