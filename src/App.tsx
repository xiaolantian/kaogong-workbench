import { useEffect } from 'react'
import DesktopShell from './components/desktop/DesktopShell'
import WindowManager from './components/desktop/WindowManager'
import { seedDefaultData } from './db/database'
import { useDesktopStore } from './store/desktopStore'

export default function App() {
  const { windows } = useDesktopStore()

  useEffect(() => {
    seedDefaultData()
  }, [])

  return (
    <>
      <DesktopShell />
      {windows.length > 0 && <WindowManager />}
    </>
  )
}