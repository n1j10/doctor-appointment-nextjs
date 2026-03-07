'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { XCircle, Loader2 } from 'lucide-react';

export default function CancelButton({ appointmentId }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');





    const handleCancel = async () => {
        if (loading) return;

        setLoading(true);
        setError('');


        try {
            const res = await fetch(`/api/appointments/${appointmentId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'CANCELLED' }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || 'Failed to cancel appointment');
            }

            router.refresh();


            
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }

    };




    return (
        <div className="flex flex-col items-end gap-1">
            <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="text-xs text-red-600 hover:text-red-800 font-medium transition-colors flex items-center gap-1 disabled:opacity-60"
            >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                {loading ? 'Cancelling...' : 'Cancel'}
            </button>
            {error && <span className="text-[11px] text-red-600">{error}</span>}
        </div>
    );
}
