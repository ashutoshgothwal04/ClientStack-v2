import { useState } from "react"

export default function ProfileSettings() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    avatar: null,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleAvatarUpload = (e) => {
    if (!e.target.files?.[0]) return
    setProfile((prev) => ({
      ...prev,
      avatar: URL.createObjectURL(e.target.files[0]),
    }))
  }

  const initials =
    profile.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U"

  return (
    <section className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Profile Settings</h2>
        <p className="text-sm text-muted-foreground">
          Update your personal information and avatar
        </p>
      </div>

      <div className="grid gap-6">
        {/* Avatar */}
        <div className="flex items-center gap-5">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt="Avatar"
              className="h-20 w-20 rounded-full object-cover border"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted text-xl font-semibold text-muted-foreground">
              {initials}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">
              Profile photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="block text-sm text-muted-foreground file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              JPG, PNG up to 2MB
            </p>
          </div>
        </div>

        {/* Name */}
        <div className="grid gap-1">
          <label className="text-sm font-medium">Full Name</label>
          <input
            name="name"
            placeholder="John Doe"
            value={profile.name}
            onChange={handleChange}
            className="w-full rounded-md border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Email */}
        <div className="grid gap-1">
          <label className="text-sm font-medium">Email Address</label>
          <input
            name="email"
            type="email"
            placeholder="john@example.com"
            value={profile.email}
            onChange={handleChange}
            className="w-full rounded-md border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="text-xs text-muted-foreground">
            Used for notifications and invoices
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Save Changes
          </button>
          <button className="rounded-md border px-6 py-2 text-sm hover:bg-muted">
            Cancel
          </button>
        </div>
      </div>
    </section>
  )
}
