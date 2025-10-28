import ExpenseRequestForm from "@/components/expense-request-form"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-2">MTs. KH A Wahab Muhsin</h1>
          <p className="text-gray-600">Formulir Pengajuan Pengeluaran</p>
        </div>
        <ExpenseRequestForm />
      </div>
    </main>
  )
}
'use client';

import { useState } from 'react';

export default function FormPengajuan() {
  const [formData, setFormData] = useState({
    nama: '',
    jumlah: '',
    alasan: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/submit-pengeluaran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        setSuccess(true);
        setFormData({ nama: '', jumlah: '', alasan: '' });
      } else {
        setError(result.error || 'Gagal mengirim data');
      }
    } catch (err) {
      setError('Koneksi gagal. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="nama"
        value={formData.nama}
        onChange={handleChange}
        placeholder="Nama"
        required
      />
      <input
        name="jumlah"
        type="number"
        value={formData.jumlah}
        onChange={handleChange}
        placeholder="Jumlah"
        required
      />
      <textarea
        name="alasan"
        value={formData.alasan}
        onChange={handleChange}
        placeholder="Alasan Pengeluaran"
        required
      />
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Pengajuan berhasil dikirim!</p>}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Mengirim...' : 'Kirim Pengajuan'}
      </button>
    </form>
  );
}
