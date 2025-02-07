"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Download } from 'lucide-react'

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallButton, setShowInstallButton] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallButton(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt')
        } else {
          console.log('User dismissed the install prompt')
        }
        setDeferredPrompt(null)
        setShowInstallButton(false)
      })
    }
  }

  if (isStandalone) return null

  if (isIOS) {
    return (
      <div className="text-sm">
        <p>To install this app on your iPhone:</p>
        <ol className="list-decimal list-inside">
          <li>Tap the Share button</li>
          <li>Scroll down and tap "Add to Home Screen"</li>
        </ol>
      </div>
    )
  }

  if (!showInstallButton) return null

  return (
    <Button onClick={handleInstallClick}>
      <Download className="mr-2 h-4 w-4" /> Install App
    </Button>
  )
}

