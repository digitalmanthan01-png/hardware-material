import React, { useState } from 'react';
import { ProductReview } from '../../types';
import { api } from '../../services/api';
import { useStore } from '../../context/StoreContext';
import { ConfirmModal } from '../common/ConfirmModal';
import { Star, CheckCircle2, XCircle, Trash2 } from 'lucide-react';

export const AdminReviewsTab: React.FC<{
  reviews: ProductReview[];
  onRefresh: () => void;
}> = ({ reviews, onRefresh }) => {
  const { showToast } = useStore();
  const [reviewToDelete, setReviewToDelete] = useState<ProductReview | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleApprove = async (id: string) => {
    try {
      await api.toggleApproveReview(id);
      showToast('Review status updated', 'success');
      onRefresh();
    } catch {
      showToast('Failed to update review status', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!reviewToDelete) return;
    setIsDeleting(true);
    try {
      await api.deleteReview(reviewToDelete.id);
      showToast('Review removed', 'info');
      setReviewToDelete(null);
      onRefresh();
    } catch {
      showToast('Failed to delete review', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
        <h3 className="text-sm font-bold text-gray-900">Customer & Carpenter Reviews ({reviews.length})</h3>
        <p className="text-[11px] text-gray-500">Moderate product testimonials, feedback ratings, and verified purchases.</p>
      </div>

      <div className="space-y-3">
        {reviews.map(rev => (
          <div key={rev.id} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <strong className="text-xs text-gray-900">{rev.headline}</strong>
                {rev.isApproved ? (
                  <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.2 rounded">
                    Approved & Live
                  </span>
                ) : (
                  <span className="text-[9px] bg-gray-100 text-gray-600 font-bold px-1.5 py-0.2 rounded">
                    Hidden
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 italic">"{rev.comment}"</p>
              <div className="text-[11px] text-gray-400">
                By <strong>{rev.customerName}</strong> on <strong>{rev.productName}</strong> · {new Date(rev.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleToggleApprove(rev.id)}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-colors ${
                  rev.isApproved
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {rev.isApproved ? 'Hide Review' : 'Approve & Publish'}
              </button>
              <button
                type="button"
                onClick={() => setReviewToDelete(rev)}
                className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
                title="Delete Review"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Review Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(reviewToDelete)}
        title="Delete Customer Review?"
        message="Are you sure you want to permanently delete this testimonial from the database?"
        confirmText="Yes, Delete Review"
        cancelText="Cancel"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setReviewToDelete(null)}
      />
    </div>
  );
};
