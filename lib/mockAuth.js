const USERS = [
  {
    id: 'admin-001',
    email: 'admin@egaxstudios.com',
    password: 'password123',
    name: 'Admin EGAX',
    role: 'admin',
    avatar: null,
  },
]

export function loginUser(email, password) {
  const user = USERS.find((u) => u.email === email && u.password === password)
  if (!user) return { success: false, error: 'Email atau password salah.' }
  const { password: _pw, ...safeUser } = user
  return { success: true, user: safeUser }
}

export function registerUser(email, name, password) {
  if (USERS.find((u) => u.email === email)) {
    return { success: false, error: 'Email sudah terdaftar.' }
  }
  const newUser = {
    id: `user-${Date.now()}`,
    email,
    name,
    password,
    role: 'customer',
    avatar: null,
  }
  USERS.push(newUser)
  const { password: _pw, ...safeUser } = newUser
  return { success: true, user: safeUser }
}
