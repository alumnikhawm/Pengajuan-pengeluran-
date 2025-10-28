"use client"

import type React from "react"

import { useState } from "react"
import { CheckCircle, Upload, X } from "lucide-react"

interface FormData {
  purpose: string
  amount: string
  document: File | null
  authorization: string
}

interface FormErrors {
  purpose?: string
  amount?: string
  document?: string
}

export default function ExpenseRequestForm() {
  const [formData, setFormData] = useState<FormData>({
    purpose: "",
    amount: "",
    document: null,
    authorization: "Menunggu Persetujuan",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const formatCurrency = (value: string): string => {
    const numValue = value.replace(/\D/g, "")
    if (!numValue) return ""
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number.parseInt(numValue))
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setFormData((prev) => ({
      ...prev,
      amount: value,
    }))
    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: undefined }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ["image/jpeg", "image/png"]
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        document: "Hanya file JPG dan PNG yang diizinkan",
      }))
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        document: "Ukuran file tidak boleh lebih dari 5MB",
      }))
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    setFormData((prev) => ({
      ...prev,
      document: file,
    }))
    setErrors((prev) => ({ ...prev, document: undefined }))
  }

  const removeFile = () => {
    setFormData((prev) => ({
      ...prev,
      document: null,
    }))
    setPreview(null)
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.purpose.trim()) {
      newErrors.purpose = "Tujuan pengeluaran harus diisi"
    }

    if (!formData.amount) {
      newErrors.amount = "Nominal harus diisi"
    } else if (Number.parseInt(formData.amount) < 1000) {
      newErrors.amount = "Nominal minimal Rp 1.000"
    }

    if (!formData.document) {
      newErrors.document = "Bukti pendukung harus diunggah"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Simulate successful submission
    setSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        purpose: "",
        amount: "",
        document: null,
        authorization: "Menunggu Persetujuan",
      })
      setPreview(null)
      setSubmitted(false)
    }, 3000)
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Pengajuan Berhasil Dikirim!</h2>
        <p className="text-gray-600">Pengajuan pengeluaran Anda telah diterima dan sedang menunggu persetujuan.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 sm:p-8 space-y-6">
      {/* Purpose Field */}
      <div>
        <label htmlFor="purpose" className="block text-sm font-semibold text-gray-700 mb-2">
          Tujuan Pengeluaran <span className="text-red-500">*</span>
        </label>
        <input
          id="purpose"
          type="text"
          placeholder="Contoh: Pembelian alat tulis kantor"
          value={formData.purpose}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, purpose: e.target.value }))
            if (errors.purpose) {
              setErrors((prev) => ({ ...prev, purpose: undefined }))
            }
          }}
          className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none ${
            errors.purpose
              ? "border-red-500 bg-red-50 focus:border-red-600"
              : "border-blue-200 bg-blue-50 focus:border-blue-500"
          }`}
          aria-invalid={!!errors.purpose}
          aria-describedby={errors.purpose ? "purpose-error" : undefined}
        />
        {errors.purpose && (
          <p id="purpose-error" className="text-red-500 text-sm mt-1">
            {errors.purpose}
          </p>
        )}
      </div>

      {/* Amount Field */}
      <div>
        <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2">
          Nominal (IDR) <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-3 text-gray-600 font-medium">Rp</span>
          <input
            id="amount"
            type="text"
            placeholder="0"
            value={formatCurrency(formData.amount)}
            onChange={handleAmountChange}
            className={`w-full pl-12 pr-4 py-3 rounded-lg border-2 transition-colors focus:outline-none ${
              errors.amount
                ? "border-red-500 bg-red-50 focus:border-red-600"
                : "border-blue-200 bg-blue-50 focus:border-blue-500"
            }`}
            aria-invalid={!!errors.amount}
            aria-describedby={errors.amount ? "amount-error" : undefined}
          />
        </div>
        {errors.amount && (
          <p id="amount-error" className="text-red-500 text-sm mt-1">
            {errors.amount}
          </p>
        )}
      </div>

      {/* Document Upload Field */}
      <div>
        <label htmlFor="document" className="block text-sm font-semibold text-gray-700 mb-2">
          Bukti Pendukung (JPG/PNG, Max 5MB) <span className="text-red-500">*</span>
        </label>

        {!formData.document ? (
          <label
            htmlFor="document-input"
            className={`flex items-center justify-center w-full px-4 py-8 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
              errors.document
                ? "border-red-500 bg-red-50 hover:bg-red-100"
                : "border-blue-300 bg-blue-50 hover:bg-blue-100"
            }`}
          >
            <div className="text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-sm font-medium text-gray-700">Klik untuk unggah atau drag and drop</p>
              <p className="text-xs text-gray-500 mt-1">JPG atau PNG (Max 5MB)</p>
            </div>
            <input
              id="document-input"
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
              className="hidden"
              aria-invalid={!!errors.document}
              aria-describedby={errors.document ? "document-error" : undefined}
            />
          </label>
        ) : (
          <div className="space-y-3">
            <div className="relative inline-block">
              <img
                src={preview || ""}
                alt="Preview dokumen pendukung"
                className="h-32 w-32 object-cover rounded-lg border-2 border-blue-300"
              />
              <button
                type="button"
                onClick={removeFile}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                aria-label="Hapus file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-600">{formData.document.name}</p>
          </div>
        )}

        {errors.document && (
          <p id="document-error" className="text-red-500 text-sm mt-2">
            {errors.document}
          </p>
        )}
      </div>

      {/* Authorization Field (Read-only) */}
      <div>
        <label htmlFor="authorization" className="block text-sm font-semibold text-gray-700 mb-2">
          Status Otorisasi
        </label>
        <input
          id="authorization"
          type="text"
          value={formData.authorization}
          readOnly
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
          aria-readonly="true"
        />
        <p className="text-xs text-gray-500 mt-1">Bidang ini tidak dapat diubah</p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Ajukan Pengeluaran
      </button>

      {/* Help Text */}
      <p className="text-xs text-gray-500 text-center">
        <span className="text-red-500">*</span> Bidang wajib diisi
      </p>
    </form>
  )
}
