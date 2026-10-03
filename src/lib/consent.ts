'use client'
import { useSyncExternalStore } from 'react'

// Stores the learner's cookie / data-privacy choice on their own device.
// Nothing here is sent to a server: the record only says what they agreed to.
const KEY = 'bmo-consent-v1'

export type Consent = { v: 1; thirdParty: boolean; at: string }

let memory: string | null = null // fallback when localStorage is blocked
let panelOpen = false
const listeners = new Set<() => void>()
const emit = () => listeners.forEach(l => l())

function readRaw(): string {
  try {
    return localStorage.getItem(KEY) ?? memory ?? ''
  } catch {
    return memory ?? ''
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  const onStorage = (e: StorageEvent) => { if (e.key === KEY || e.key === null) cb() }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(cb)
    window.removeEventListener('storage', onStorage)
  }
}

function parse(raw: string): Consent | null {
  if (!raw) return null
  try {
    const c = JSON.parse(raw)
    return c && c.v === 1 && typeof c.thirdParty === 'boolean' ? (c as Consent) : null
  } catch {
    return null
  }
}

export function saveConsent(thirdParty: boolean) {
  const raw = JSON.stringify({ v: 1, thirdParty, at: new Date().toISOString() } satisfies Consent)
  memory = raw
  try { localStorage.setItem(KEY, raw) } catch {}
  panelOpen = false
  emit()
}

export function openConsentPanel() { panelOpen = true; emit() }
export function closeConsentPanel() { panelOpen = false; emit() }

export function useConsent() {
  // `null` on the server / first paint so the banner never causes a hydration mismatch.
  const raw = useSyncExternalStore(subscribe, readRaw, () => null)
  const open = useSyncExternalStore(subscribe, () => panelOpen, () => false)
  const consent = raw === null ? null : parse(raw)
  return {
    ready: raw !== null,
    decided: consent !== null,
    thirdParty: consent?.thirdParty === true,
    panelOpen: open,
  }
}
