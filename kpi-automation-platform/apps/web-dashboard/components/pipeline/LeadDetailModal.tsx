'use client';

import { Lead, PipelineStage, PIPELINE_STAGES } from '@/types/pipeline';
import { useState } from 'react';

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Lead>) => void;
  onDelete: (id: string) => void;
}

export function LeadDetailModal({
  lead,
  isOpen,
  onClose,
  onUpdate,
  onDelete
}: LeadDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedLead, setEditedLead] = useState<Partial<Lead>>({});

  if (!isOpen || !lead) return null;

  const handleSave = () => {
    onUpdate(lead.id, editedLead);
    setIsEditing(false);
    setEditedLead({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedLead({});
  };

  const handleDelete = () => {
    if (window.confirm('이 리드를 삭제하시겠습니까?')) {
      onDelete(lead.id);
      onClose();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (value?: number) => {
    if (!value) return '-';
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0
    }).format(value);
  };

  const currentStage = PIPELINE_STAGES.find(s => s.id === lead.stage);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
              {lead.firstName.charAt(0)}{lead.lastName.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {lead.firstName} {lead.lastName}
              </h2>
              {lead.jobTitle && (
                <p className="text-sm text-gray-500">{lead.jobTitle}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Stage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              파이프라인 단계
            </label>
            {isEditing ? (
              <select
                value={editedLead.stage || lead.stage}
                onChange={(e) => setEditedLead({ ...editedLead, stage: e.target.value as PipelineStage })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {PIPELINE_STAGES.map(stage => (
                  <option key={stage.id} value={stage.id}>
                    {stage.title}
                  </option>
                ))}
              </select>
            ) : (
              <div className={`inline-flex items-center px-4 py-2 rounded-lg ${currentStage?.color} text-white font-medium`}>
                {currentStage?.title}
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={editedLead.email ?? lead.email ?? ''}
                  onChange={(e) => setEditedLead({ ...editedLead, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{lead.email || '-'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                전화번호
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editedLead.phone ?? lead.phone ?? ''}
                  onChange={(e) => setEditedLead({ ...editedLead, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{lead.phone || '-'}</p>
              )}
            </div>
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              회사
            </label>
            <p className="text-gray-900">{lead.companyName || '-'}</p>
          </div>

          {/* Deal Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                예상 거래액
              </label>
              {isEditing ? (
                <input
                  type="number"
                  value={editedLead.amount ?? lead.amount ?? 0}
                  onChange={(e) => setEditedLead({ ...editedLead, amount: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-lg font-semibold text-green-600">
                  {formatCurrency(lead.amount)}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                성사 확률
              </label>
              {isEditing ? (
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editedLead.probability ?? lead.probability ?? 0}
                  onChange={(e) => setEditedLead({ ...editedLead, probability: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{lead.probability || 0}%</p>
              )}
            </div>
          </div>

          {/* Business Line & Assigned To */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비즈니스 라인
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedLead.businessLine ?? lead.businessLine ?? ''}
                  onChange={(e) => setEditedLead({ ...editedLead, businessLine: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{lead.businessLine || '-'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                담당자
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedLead.assignedTo ?? lead.assignedTo ?? ''}
                  onChange={(e) => setEditedLead({ ...editedLead, assignedTo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{lead.assignedTo || '-'}</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              메모
            </label>
            {isEditing ? (
              <textarea
                value={editedLead.notes ?? lead.notes ?? ''}
                onChange={(e) => setEditedLead({ ...editedLead, notes: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900 whitespace-pre-wrap">{lead.notes || '-'}</p>
            )}
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                생성일
              </label>
              <p className="text-sm text-gray-900">{formatDate(lead.createdAt)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                수정일
              </label>
              <p className="text-sm text-gray-900">{formatDate(lead.updatedAt)}</p>
            </div>
          </div>

          {/* LinkedIn */}
          {lead.linkedinUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn
              </label>
              <a
                href={lead.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {lead.linkedinUrl}
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-red-600 hover:text-red-700 font-medium"
          >
            삭제
          </button>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  저장
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                수정
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
