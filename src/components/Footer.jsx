import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import BrandLogo from './BrandLogo'
import { UNIVERSITY, CONTACT } from '../config/branding'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <BrandLogo linked={false} light />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
              Official class attendance portal for {UNIVERSITY}. Lecturers and students use separate sign-in pages.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white">Pages</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                ['Home', '/'],
                ['About', '/about'],
                ['Contact', '/contact'],
                ['Sign in', '/login'],
              ].map(([label, path]) => (
                <li key={path}>
                  <Link to={path} className="transition hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white">Campus</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-brand-400" />
                {CONTACT.email}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-brand-400" />
                {CONTACT.phone}
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                {CONTACT.address}
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} {UNIVERSITY}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
