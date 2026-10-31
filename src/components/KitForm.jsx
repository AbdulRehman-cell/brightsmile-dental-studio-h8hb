import { useNavigate } from 'react-router-dom'

// Hero and search forms: go to the page that handles them, carrying what the
// visitor typed as URL parameters (that page pre-fills its own form or filters).
export default function KitForm({ to, className, children }) {
  const navigate = useNavigate()
  const submit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    for (const [key, value] of new FormData(e.currentTarget)) {
      if (String(value).trim()) params.set(key, String(value).trim())
    }
    const query = params.toString()
    navigate(query ? `${to}?${query}` : to)
  }
  return <form className={className} onSubmit={submit}>{children}</form>
}
