import './globals.css'
import type {Metadata,Viewport} from 'next'
import {Providers} from '@/lib/progress'
import Nav from '@/components/Nav'
export const metadata:Metadata={title:'VAL Guide: Basic Sewing Machine Operation',description:'Short video lessons, quizzes and checklists for BTLED Home Economics students.'}
export const viewport:Viewport={width:'device-width',initialScale:1,themeColor:'#6E1A2C'}
export default function RootLayout({children}:{children:React.ReactNode}){
 return(<html lang="en"><body className="bg-cream font-sans text-ink">
  <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-mustard focus:p-2">Skip to content</a>
  <Providers><Nav/><main id="main" className="mx-auto max-w-3xl px-4 py-6">{children}</main></Providers>
  <div className="weave" aria-hidden="true"/>
  <footer className="mx-auto max-w-3xl px-4 py-6 text-sm">VAL Guide for BTLED Home Economics students. Videos load only when you press play, so lessons stay light on slow connections.</footer>
 </body></html>)}
