'use client'

import { useEffect, useRef, useState } from 'react'

interface QrCodeGeneratorProps {
  url: string
}

export function QrCodeGenerator({ url }: QrCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Dynamically import qrcode library
        const QRCode = (await import('qrcode')).default

        if (canvasRef.current) {
          await QRCode.toCanvas(canvasRef.current, url, {
            errorCorrectionLevel: 'H',
            margin: 1,
            width: 300,
            color: {
              dark: '#000000',
              light: '#FFFFFF',
            },
          })
        }

        setIsLoading(false)
      } catch (err) {
        console.error('QR Code generation error:', err)
        setError('Failed to generate QR code. Make sure the qrcode library is installed.')
        setIsLoading(false)
      }
    }

    if (url) {
      generateQRCode()
    }
  }, [url])

  const downloadQRCode = () => {
    if (canvasRef.current) {
      const link = document.createElement('a')
      link.href = canvasRef.current.toDataURL('image/png')
      link.download = `utm-qrcode-${Date.now()}.png`
      link.click()
    }
  }

  const copyQRCodeToClipboard = async () => {
    if (canvasRef.current) {
      try {
        const blob = await new Promise<Blob>((resolve) => {
          canvasRef.current!.toBlob((blob) => {
            if (blob) resolve(blob)
          }, 'image/png')
        })

        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob,
          }),
        ])

        alert('QR Code copied to clipboard!')
      } catch (err) {
        console.error('Failed to copy QR code:', err)
      }
    }
  }

  return (
    <div className="mt-4 space-y-4">
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Generating QR code...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{error}</p>
          <p className="text-xs text-red-600 mt-2">
            Install the qrcode library: npm install qrcode
          </p>
        </div>
      )}

      {!isLoading && !error && (
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-white border-4 border-gray-200 rounded-lg p-4">
            <canvas
              ref={canvasRef}
              className="w-64 h-64"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>

          <p className="text-xs text-gray-500 text-center max-w-xs">
            Scan this QR code to open the UTM link
          </p>

          <div className="flex gap-2 w-full">
            <button
              onClick={downloadQRCode}
              className="flex-1 px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded-lg hover:bg-blue-100 transition-colors text-sm"
            >
              Download QR Code
            </button>
            <button
              onClick={copyQRCodeToClipboard}
              className="flex-1 px-4 py-2 bg-purple-50 text-purple-700 font-medium rounded-lg hover:bg-purple-100 transition-colors text-sm"
            >
              Copy to Clipboard
            </button>
          </div>
        </div>
      )}

      {/* QR Code Details */}
      {!isLoading && !error && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-2 font-semibold">QR Code Details:</p>
          <ul className="text-xs text-gray-700 space-y-1">
            <li>
              <strong>Size:</strong> 300x300 pixels
            </li>
            <li>
              <strong>Error Correction:</strong> Level H (30% recovery)
            </li>
            <li>
              <strong>Format:</strong> PNG
            </li>
            <li>
              <strong>Encoded URL Length:</strong> {url.length} characters
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
