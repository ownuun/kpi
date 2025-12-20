'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@kpi/ui-components'
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface BusinessLine {
  id: string
  name: string
  displayName: string
  description: string | null
  color: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function BusinessLinesPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [businessLines, setBusinessLines] = useState<BusinessLine[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingLine, setEditingLine] = useState<BusinessLine | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    color: '#3B82F6',
  })

  useEffect(() => {
    loadBusinessLines()
  }, [])

  async function loadBusinessLines() {
    try {
      const response = await fetch('/api/business-lines')
      const result = await response.json()
      if (result.success) {
        setBusinessLines(result.data)
      }
    } catch (error) {
      console.error('Failed to load business lines:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    try {
      const url = editingLine 
        ? `/api/business-lines/${editingLine.id}` 
        : '/api/business-lines'
      
      const response = await fetch(url, {
        method: editingLine ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = await response.json()
      
      if (result.success) {
        await loadBusinessLines()
        setShowModal(false)
        setEditingLine(null)
        setFormData({ name: '', displayName: '', description: '', color: '#3B82F6' })
      }
    } catch (error) {
      console.error('Failed to save business line:', error)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(t('정말 삭제하시겠습니까?', 'Are you sure you want to delete?'))) {
      return
    }

    try {
      const response = await fetch(`/api/business-lines/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()
      
      if (result.success) {
        await loadBusinessLines()
      }
    } catch (error) {
      console.error('Failed to delete business line:', error)
    }
  }

  async function handleToggleActive(id: string, isActive: boolean) {
    try {
      const response = await fetch(`/api/business-lines/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      })

      const result = await response.json()
      
      if (result.success) {
        await loadBusinessLines()
      }
    } catch (error) {
      console.error('Failed to toggle business line:', error)
    }
  }

  function openEditModal(line: BusinessLine) {
    setEditingLine(line)
    setFormData({
      name: line.name,
      displayName: line.displayName,
      description: line.description || '',
      color: line.color || '#3B82F6',
    })
    setShowModal(true)
  }

  function openCreateModal() {
    setEditingLine(null)
    setFormData({ name: '', displayName: '', description: '', color: '#3B82F6' })
    setShowModal(true)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">{t('로딩 중...', 'Loading...')}</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('비즈니스 라인 관리', 'Business Lines Management')}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('사업 부문을 추가하거나 제거할 수 있습니다', 'Add or remove business lines')}
          </p>
        </div>
        <Button onClick={openCreateModal} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {t('새 비즈니스 라인', 'New Business Line')}
        </Button>
      </div>

      {/* Business Lines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businessLines.map((line) => (
          <Card key={line.id} className={`${line.isActive ? '' : 'opacity-60'}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: line.color || '#6b7280' }}
                  />
                  <div>
                    <CardTitle className="text-lg">{line.displayName}</CardTitle>
                    <p className="text-sm text-gray-600">{line.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleActive(line.id, line.isActive)}
                    title={line.isActive ? t('비활성화', 'Deactivate') : t('활성화', 'Activate')}
                  >
                    {line.isActive ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {line.description && (
                <p className="text-sm text-gray-600 mb-4">{line.description}</p>
              )}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditModal(line)}
                  className="flex-1"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  {t('수정', 'Edit')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(line.id)}
                  className="flex-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  {t('삭제', 'Delete')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingLine
                ? t('비즈니스 라인 수정', 'Edit Business Line')
                : t('새 비즈니스 라인 추가', 'Add New Business Line')}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('이름 (영문)', 'Name (English)')}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="outsourcing"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('표시 이름', 'Display Name')}
                </label>
                <input
                  type="text"
                  required
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Outsourcing / 외주"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('설명', 'Description')}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder={t('비즈니스 라인 설명...', 'Business line description...')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('색상', 'Color')}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="h-10 w-20 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  {editingLine ? t('저장', 'Save') : t('추가', 'Add')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowModal(false)
                    setEditingLine(null)
                  }}
                  className="flex-1"
                >
                  {t('취소', 'Cancel')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
