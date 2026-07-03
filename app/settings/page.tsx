'use client'

import { useState } from 'react'

export default function SettingsPage() {
  const [shareCode, setShareCode] = useState('')
  const [showShareCode, setShowShareCode] = useState(false)
  const [showJoinForm, setShowJoinForm] = useState(false)
  const [joinCode, setJoinCode] = useState('')

  const generateShareCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    setShareCode(code)
    setShowShareCode(true)
  }

  const handleJoinAccount = () => {
    if (!joinCode) {
      alert('코드를 입력해주세요')
      return
    }
    alert(`${joinCode} 코드로 계정 연결됨 (로컬 데모)`)
    setJoinCode('')
    setShowJoinForm(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#ff8a80] to-[#ff6b6b] text-white p-6 rounded-b-2xl shadow-sm sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-center">설정</h1>
      </div>

      <div className="p-4 max-w-2xl mx-auto space-y-6">
        {/* Share Account Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🔗 가계부 공유</h2>

          {!showShareCode ? (
            <button
              onClick={generateShareCode}
              className="w-full py-3 bg-gradient-to-r from-[#ff8a80] to-[#ff6b6b] text-white font-bold rounded-lg hover:shadow-lg transition-shadow"
            >
              공유 코드 생성
            </button>
          ) : (
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-2">공유 코드</p>
                <p className="text-3xl font-bold text-[#ff6b6b] tracking-widest">{shareCode}</p>
              </div>
              <p className="text-sm text-gray-600">
                이 코드를 배우자에게 공유하면 같은 가계부를 함께 관리할 수 있습니다.
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareCode)
                  alert('코드가 복사되었습니다')
                }}
                className="w-full py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors"
              >
                코드 복사
              </button>
              <button
                onClick={() => setShowShareCode(false)}
                className="w-full py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                닫기
              </button>
            </div>
          )}
        </div>

        {/* Join Account Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🤝 배우자 계정 연결</h2>

          {!showJoinForm ? (
            <button
              onClick={() => setShowJoinForm(true)}
              className="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors"
            >
              코드로 계정 연결
            </button>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="ABCDEF"
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl font-bold tracking-widest focus:outline-none focus:border-[#ff6b6b]"
              />
              <button
                onClick={handleJoinAccount}
                className="w-full py-3 bg-gradient-to-r from-[#ff8a80] to-[#ff6b6b] text-white font-bold rounded-lg hover:shadow-lg transition-shadow"
              >
                연결
              </button>
              <button
                onClick={() => setShowJoinForm(false)}
                className="w-full py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                취소
              </button>
            </div>
          )}
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">👤 계정 정보</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">이메일</p>
              <p className="font-bold text-gray-800">demo@example.com</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">가입일</p>
              <p className="font-bold text-gray-800">2026년 7월 3일</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button className="w-full py-3 bg-red-100 text-red-600 font-bold rounded-lg hover:bg-red-200 transition-colors">
          로그아웃
        </button>
      </div>
    </div>
  )
}
