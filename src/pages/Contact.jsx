import { useState } from 'react'
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react'
import { useToast } from '../context/ToastContext'
import { UNIVERSITY, CONTACT } from '../config/branding'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const { toast } = useToast()

  const handleSubmit = (e) => {
    e.preventDefault()
    toast('Thank you. Your message has been received.')
    setForm({ name: '', email: '', message: '' })
  }

  const contacts = [
    { icon: Mail, label: 'Email', value: CONTACT.email },
    { icon: Phone, label: 'Phone', value: CONTACT.phone },
    { icon: MapPin, label: 'Campus', value: CONTACT.address },
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="animate-fade-in text-center">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Contact</h1>
        <p className="mt-3 text-slate-500">{UNIVERSITY} — attendance support</p>
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          {contacts.map((c) => (
            <div key={c.label} className="surface flex items-start gap-4 p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-800 dark:bg-brand-900/50">
                <c.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{c.label}</p>
                <p className="font-semibold text-slate-900 dark:text-white">{c.value}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="surface-elevated space-y-5 p-8 lg:col-span-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-brand-600" />
            <h2 className="font-semibold">Send a message</h2>
          </div>
          {[
            { name: 'name', label: 'Full name', type: 'text' },
            { name: 'email', label: 'Email', type: 'email' },
          ].map((f) => (
            <div key={f.name}>
              <label className="label">{f.label}</label>
              <input
                type={f.type}
                required
                className="input"
                value={form[f.name]}
                onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
              />
            </div>
          ))}
          <div>
            <label className="label">Message</label>
            <textarea
              required
              rows={5}
              className="input resize-none"
              placeholder="Describe your issue (e.g. matric not found, session code not working)..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            <Send className="h-4 w-4" />
            Send message
          </button>
        </form>
      </div>
    </div>
  )
}
