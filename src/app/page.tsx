"use client"
import React, { useState, useEffect } from "react"
import { QrCode, PenTool, Info, User } from "lucide-react"
import Tesseract from "tesseract.js"
import axios from "axios"

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [registrationNumber, setRegistrationNumber] = useState("")
  const [error, setError] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState("")
  const [, setIsWarning] = useState(false)

  const [activeTab, setActiveTab] = useState("scan")
  const [isScanning, setIsScanning] = useState(false)
  const [activeEvent, setActiveEvent] = useState("")
  const [eventLoading, setEventLoading] = useState(false)
  const [eventError, setEventError] = useState("")

  useEffect(() => {
    if (activeTab === "info") {
      fetchActiveEvent()
    }
  }, [activeTab])

  const fetchActiveEvent = async () => {
    setEventLoading(true)
    setEventError("")
    try {
      const response = await axios.get("/api/active-event")
      setActiveEvent(response.data.eventName)
    } catch (err) {
      console.error(err)
      setEventError("Failed to fetch active event.")
    } finally {
      setEventLoading(false)
    }
  }

  const handleScan = () => {
    setError("")
    setIsScanning(true)
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.capture = "environment"
    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement | null
      const file = target?.files?.[0]
      if (file) {
        setLoading(true)
        try {
          const {
            data: { text },
          } = await Tesseract.recognize(file, "eng")
          const extractedNumber = extractRegistrationNumber(text)
          setRegistrationNumber(extractedNumber || "Not Found")
        } catch (err) {
          console.error(err)
          setError("Failed to extract registration number.")
        } finally {
          setLoading(false)
          setIsScanning(false)
        }
      } else {
        setIsScanning(false)
      }
    }
    input.click()
  }

  const extractRegistrationNumber = (text: string) => {
    const regex = /\b\d{2}[A-Z]{3}\d{5}\b/
    const match = text.match(regex)
    return match ? match[0] : null
  }

  const verifyRegistration = async () => {
    if (!registrationNumber || registrationNumber === "Not Found") {
      setError("Please scan and extract a valid registration number first.")
      return
    }

    setError("")
    try {
      const response = await axios.post("/api/registration/verify", { registrationNumber })

      if (response.data.exists) {
        if (response.data.message.includes("already marked as present")) {
          setModalMessage("Attendance already marked as present!")
          setIsWarning(true)
        } else {
          setModalMessage("Registration number is valid, attendance marked as present!")
          setIsWarning(false)
        }
      } else if (response.data.message.includes("Participant not found. Please check the registration number.")) {
        setModalMessage("Participant not found. Please check the registration number.")
        setIsWarning(true)
      } else {
        setModalMessage("Registration number not found or inactive.")
        setIsWarning(true)
      }
    } catch (err) {
      console.error(err)
      setModalMessage("Failed to verify registration number. Please try again.")
      setIsWarning(true)
    } finally {
      setIsModalOpen(true)
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case "scan":
        return (
          <>
            <div className="relative mb-8 h-64">
              <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-xl rounded-3xl"></div>
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 h-full flex items-center justify-center overflow-hidden">
                <div
                  className={`w-48 h-72 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl shadow-lg transform ${isScanning ? "translate-y-full" : "translate-y-0"} transition-transform duration-1000 ease-in-out flex flex-col items-center justify-center`}
                >
                  <div className="w-24 h-24 bg-white rounded-full mb-4 flex items-center justify-center">
                    <User className="w-16 h-16 text-blue-500" />
                  </div>
                  <div className="w-32 h-8 bg-white rounded-md mb-2"></div>
                  <div className="w-40 h-4 bg-white rounded-md"></div>
                </div>
                <div className={`absolute inset-0 bg-blue-500/30 ${isScanning ? "animate-scan" : ""}`}></div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Scanner</h2>
              <p className="text-white/60 mb-6">Seamless Access, Instant Entry</p>

              <button
                onClick={handleScan}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-400 text-white font-semibold py-3 px-6 rounded-xl backdrop-blur-xl mb-4"
                disabled={loading}
              >
                {loading ? "Processing..." : "Scan Now"}
              </button>

              <button
                onClick={verifyRegistration}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold py-3 px-6 rounded-xl backdrop-blur-xl"
              >
                Verify
              </button>

              {registrationNumber && (
                <div className="mt-4 p-4 bg-white/10 rounded-xl">
                  <p className="text-white/60">Extracted Number:</p>
                  <p className="text-white font-bold">{registrationNumber}</p>
                </div>
              )}

              {error && <p className="mt-4 text-red-400 text-center">{error}</p>}
            </div>
          </>
        )
      case "manual":
        return (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Manual Entry</h2>
            <input
              type="text"
              placeholder="Enter registration number"
              className="w-full bg-white/10 text-white p-3 rounded-xl mb-4"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
            />
            <button
              onClick={verifyRegistration}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold py-3 px-6 rounded-xl backdrop-blur-xl"
            >
              Verify
            </button>
          </div>
        )
      case "info":
        return (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 mb-8">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">QuickEntry v2</h2>
            {eventLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : eventError ? (
              <div className="bg-red-500/20 backdrop-blur-xl rounded-xl p-4 mb-4">
                <p className="text-red-400 text-center">{eventError}</p>
              </div>
            ) : (
              <div className="bg-blue-500/20 backdrop-blur-xl rounded-xl p-6 mb-4">
                <h3 className="text-xl font-semibold text-white mb-2 text-center">Active Event</h3>
                <p className="text-2xl font-bold text-blue-400 text-center">{activeEvent}</p>
              </div>
            )}
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Main Content */}
      <div className="relative px-4 pt-8 pb-24">
        {/* Header */}
        <div className="flex justify-center items-center mb-8">
          <h1 className="text-2xl font-bold text-white">QuickEntry</h1>
        </div>

        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-xl border-t border-white/10 p-4">
        <div className="flex justify-around">
          {[
            { icon: QrCode, label: "Scan", id: "scan" },
            { icon: PenTool, label: "Manual", id: "manual" },
            { icon: Info, label: "Info", id: "info" },
          ].map((item) => (
            <button
              key={item.id}
              className={`flex flex-col items-center ${activeTab === item.id ? "text-blue-400" : "text-white/60"}`}
              onClick={() => setActiveTab(item.id)}
            >
              <div
                className={`w-10 h-10 ${activeTab === item.id ? "bg-blue-400/20" : "bg-white/10"} rounded-full flex items-center justify-center mb-1`}
              >
                <item.icon className="w-5 h-5" />
              </div>
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white/20 backdrop-blur-xl p-6 rounded-2xl max-w-sm w-full mx-4">
            <p className="text-white text-center mb-4">{modalMessage}</p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold py-2 px-4 rounded-xl"
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

