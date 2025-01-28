"use client"

import { motion } from "framer-motion"
import {
  QrCode,
  Camera,
  Image,
  History,
  Share2,
  Link,
  Scan,
  FileText,
  Settings,
  HelpCircle,
  Star,
  Download,
  Upload,
  Send,
  Phone,
  Mail,
  MessageCircle,
  Wifi,
} from "lucide-react"

interface MenuScreenProps {
  onScannerClick: () => void
}

const menuItems = [
  { icon: QrCode, label: "Scan QR", color: "bg-blue-500" },
  { icon: Camera, label: "Camera", color: "bg-green-500" },
  { icon: Image, label: "Gallery", color: "bg-purple-500" },
  { icon: History, label: "History", color: "bg-yellow-500" },
  { icon: Share2, label: "Share", color: "bg-pink-500" },
  { icon: Link, label: "Links", color: "bg-indigo-500" },
  { icon: Scan, label: "Scanner", color: "bg-red-500" },
  { icon: FileText, label: "Documents", color: "bg-orange-500" },
  { icon: Settings, label: "Settings", color: "bg-gray-500" },
  { icon: HelpCircle, label: "Help", color: "bg-teal-500" },
  { icon: Star, label: "Favorites", color: "bg-amber-500" },
  { icon: Download, label: "Download", color: "bg-cyan-500" },
  { icon: Upload, label: "Upload", color: "bg-lime-500" },
  { icon: Send, label: "Send", color: "bg-rose-500" },
  { icon: Phone, label: "Call", color: "bg-violet-500" },
  { icon: Mail, label: "Email", color: "bg-fuchsia-500" },
  { icon: MessageCircle, label: "Message", color: "bg-emerald-500" },
  { icon: Wifi, label: "Connect", color: "bg-sky-500" },
]

export default function MenuScreen({ onScannerClick }: MenuScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 pt-8 px-4"
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Features</h1>
        <button onClick={onScannerClick} className="bg-primary text-white p-2 rounded-full">
          <QrCode className="w-6 h-6" />
        </button>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-4 gap-4"
      >
        {menuItems.map((item, index) => (
          <motion.button
            key={item.label}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center"
          >
            <div className={`p-3 rounded-xl ${item.color} text-white shadow-lg mb-2`}>
              <item.icon className="w-6 h-6" />
            </div>
            <span className="text-xs text-gray-600">{item.label}</span>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  )
}

