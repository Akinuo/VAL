'use client'
import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { IconLock } from './icons'

export type ToastVariant = 'warn' | 'lock'

type ToastAction = { label: string; href?: string; onClick?: () => void }

// Animation duration in ms — kept as a constant so the mount-delay timer
// below always matches the CSS transition it's waiting out.
const TRANSITION_MS = 200

/**
 * A single, reusable floating notice — portaled straight to <body> so it
 * floats above everything regardless of where it's rendered from (rendering
 * inside a transformed ancestor breaks `position: fixed` for anything
 * nested inside it).
 *
 * Only ever mount ONE of these at a time per page. Because every caller
 * shares this component, two notices can never physically overlap — there's
 * only one fixed slot for it to occupy.
 */
export default function FloatingToast({
  show,
  variant,
  title,
  message,
  action,
  onClose,
  ariaLive = 'polite',
}: {
  show: boolean
  variant: ToastVariant
  title: string
  message: ReactNode
  action?: ToastAction
  onClose?: () => void
  ariaLive?: 'polite' | 'assertive'
}) {
  // `mounted` keeps the node in the DOM long enough to play the exit
  // transition; `visible` is what actually drives the transform/opacity so
  // the enter transition has a frame to animate from.
  const [mounted, setMounted] = useState(show)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setMounted(true)
      const raf = requestAnimationFrame(() => setVisible(true))
      return () => cancelAnimationFrame(raf)
    }
    setVisible(false)
    const t = setTimeout(() => setMounted(false), TRANSITION_MS)
    return () => clearTimeout(t)
  }, [show])

  if (!mounted || typeof document === 'undefined') return null

  const isLock = variant === 'lock'

  return createPortal(
    <div
      role="alert"
      aria-live={ariaLive}
      className={`fixed inset-x-4 z-[100] mx-auto flex max-w-sm items-start gap-3 rounded-lg border bg-white px-4 py-3 shadow-xl transition-all duration-200 ease-out sm:right-4 sm:left-auto sm:mx-0 ${
        isLock ? 'border-red-border' : 'border-amber-border'
      } ${visible ? 'bottom-4 opacity-100' : '-bottom-6 opacity-0'}`}
    >
      <span
        className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full ${
          isLock ? 'bg-red-soft text-red' : 'bg-amber-soft text-amber'
        }`}
      >
        <IconLock className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink">{title}</p>
        <div className="mt-0.5 text-sm text-muted">{message}</div>
        {action && (
          action.href ? (
            <Link href={action.href} className="mt-2 inline-block text-sm font-medium text-denim underline underline-offset-2">
              {action.label}
            </Link>
          ) : (
            <button onClick={action.onClick} className="mt-2 inline-block text-sm font-medium text-denim underline underline-offset-2">
              {action.label}
            </button>
          )
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Dismiss"
          className="shrink-0 rounded p-1 text-muted transition-colors hover:bg-chalk hover:text-ink"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
            <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </svg>
        </button>
      )}
    </div>,
    document.body
  )
}
