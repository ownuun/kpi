export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">KPI Tracker</h1>
        <p className="text-gray-600 mb-8">KPI 자동화 트래킹 시스템</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-lg shadow-md border">
            <h2 className="text-xl font-semibold mb-2">대시보드</h2>
            <p className="text-gray-600">전체 KPI 현황을 확인하세요</p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md border">
            <h2 className="text-xl font-semibold mb-2">리드 관리</h2>
            <p className="text-gray-600">리드 생성 및 전환율을 추적합니다</p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md border">
            <h2 className="text-xl font-semibold mb-2">매출 목표</h2>
            <p className="text-gray-600">매출 3,000만원 달성 진행상황</p>
          </div>
        </div>
      </div>
    </main>
  )
}
