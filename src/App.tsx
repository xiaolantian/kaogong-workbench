import DesktopShell from './components/desktop/DesktopShell'
import WindowManager from './components/desktop/WindowManager'
import { useDesktopStore } from './store/desktopStore'

export default function App() {
  const { windows } = useDesktopStore()
  return (
    <>
      <DesktopShell />
      {windows.length > 0 && <WindowManager />}
    </>
  )
}
