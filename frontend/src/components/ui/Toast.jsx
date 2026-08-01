import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import { hideToast } from '../../store/slices/uiSlice'

const icons = {
  success: <CheckCircle size={20} className="text-green-500" />,
  error: <XCircle size={20} className="text-red-500" />,
  info: <Info size={20} className="text-blue-500" />,
}

const colors = {
  success: 'border-green-200 bg-green-50',
  error: 'border-red-200 bg-red-50',
  info: 'border-blue-200 bg-blue-50',
}

export default function Toast() {
  const dispatch = useDispatch()
  const toast = useSelector((s) => s.ui.toast)

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => dispatch(hideToast()), 3000)
    return () => clearTimeout(timer)
  }, [toast, dispatch])

  if (!toast) return null

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg max-w-sm ${colors[toast.type] || colors.info}`}>
        {icons[toast.type] || icons.info}
        <p className="text-sm font-medium text-gray-800 flex-1">{toast.message}</p>
        <button onClick={() => dispatch(hideToast())} className="text-gray-400 hover:text-gray-600">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
