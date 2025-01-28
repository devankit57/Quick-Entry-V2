import type React from "react"
import { Settings } from "lucide-react"

const SettingsTab: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex flex-col items-center">
          <Settings className="w-20 h-20 text-blue-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Settings</h2>
          <p className="text-gray-600 text-center">This is where the app settings would be displayed.</p>
        </div>
      </div>
    </div>
  )
}

export default SettingsTab

