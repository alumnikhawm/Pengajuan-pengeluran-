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
