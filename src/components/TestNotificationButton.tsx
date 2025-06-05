// components/TestNotificationButton.tsx
import React from 'react'
import { sendNotification, isPermissionGranted, requestPermission } from '@tauri-apps/plugin-notification'

const TestNotificationButton: React.FC = () => {
  const handleTestNotification = async () => {
    let granted = await isPermissionGranted()
    if (!granted) {
      const permission = await requestPermission()
      granted = permission === 'granted'
    }

    if (granted) {
      sendNotification({
        title: 'Testbenachrichtigung',
        body: 'Dies ist eine Testnachricht von Partitura 🎶'
      })
    } else {
      alert('Benachrichtigungsberechtigung nicht erteilt.')
    }
  }

  return (
    <button
      onClick={handleTestNotification}
      className="mt-4 px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition"
    >
      Testnachricht senden
    </button>
  )
}

export default TestNotificationButton
