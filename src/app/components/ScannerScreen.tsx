"use client"

import { motion } from "framer-motion"
import { Menu, Camera, Image } from "lucide-react"

interface ScannerScreenProps {
  onMenuClick: () => void
}

export default function ScannerScreen({ onMenuClick }: ScannerScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full w-full flex flex-col bg-primary"
    >
      {/* Scanner Viewport */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 bg-black/80">
          <div className="absolute inset-8 border-2 border-white/30 rounded-lg">
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="w-48 h-48 border-2 border-white rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2 }}
        className="h-20 bg-white rounded-t-3xl flex items-center justify-around px-6"
      >
        <button className="p-3 rounded-full bg-gray-100">
          <Image className="w-6 h-6 text-gray-600"  aria-label="Description of the icon"/>
        </button>
        <button className="p-4 rounded-full bg-primary text-white shadow-lg">
          <Camera className="w-8 h-8" />
        </button>
        <button onClick={onMenuClick} className="p-3 rounded-full bg-gray-100">
          <Menu className="w-6 h-6 text-gray-600" />
        </button>
      </motion.div>
    </motion.div>
  )
}

