'use client'

/**
 * Hashing client-side untuk credential staff (password admin, PIN kasir).
 *
 * PENTING -- batasan jujur: ini BUKAN pengganti auth server-side yang
 * sesungguhnya. Karena seluruh logic (termasuk fungsi hash ini) tetap
 * berjalan dan terbaca di browser, siapa pun yang benar-benar berniat
 * bisa reverse-engineer alurnya. Yang berubah dengan hashing ini adalah:
 *
 * 1. Password/PIN TIDAK lagi tersimpan plaintext di localStorage -- yang
 *    tersimpan adalah hash + salt, bukan teks asli. Membuka DevTools
 *    Application > Local Storage tidak langsung membocorkan password.
 * 2. Login TIDAK BISA lagi di-bypass cuma dengan mengetik
 *    `isLoggedIn: true` di console -- sekarang ada `sessionToken` yang
 *    di-derive dari hash staff yang sedang login, dan token itu
 *    di-verifikasi ulang terhadap staffStore tiap kali sesi dicek
 *    (lihat verifySession() di store/adminAuthStore.js dan
 *    store/posStore.js). Mengubah `isLoggedIn` tanpa token yang valid
 *    akan gagal re-validasi dan auto-logout.
 *
 * Ini menaikkan effort yang dibutuhkan untuk bypass dari "edit satu
 * baris di console" menjadi "perlu paham alur derivasi token", yang
 * cukup untuk konteks demo/portfolio -- tapi tetap bukan pengganti
 * backend auth sungguhan untuk data yang benar-benar sensitif.
 */

function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function randomSalt(length = 16) {
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  return bufferToHex(bytes)
}

async function sha256Hex(text) {
  const data = new TextEncoder().encode(text)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return bufferToHex(hashBuffer)
}

/**
 * Hash sebuah credential (password/PIN) dengan salt baru.
 * @returns {Promise<{hash: string, salt: string}>}
 */
export async function hashCredential(plainText) {
  const salt = randomSalt()
  const hash = await sha256Hex(`${salt}:${plainText}`)
  return { hash, salt }
}

/**
 * Verifikasi credential plaintext terhadap hash+salt yang tersimpan.
 * @returns {Promise<boolean>}
 */
export async function verifyCredential(plainText, hash, salt) {
  if (!hash || !salt) return false
  const candidate = await sha256Hex(`${salt}:${plainText}`)
  return candidate === hash
}

/**
 * Derive session token dari staffId + hash credential staff tersebut.
 * Token ini yang disimpan di adminAuthStore/posStore (bukan password),
 * dan diverifikasi ulang terhadap hash staff yang bersangkutan saat
 * re-check sesi -- jadi token lama otomatis invalid begitu password/PIN
 * staff diganti, dan tidak bisa dipalsukan tanpa tahu hash aslinya.
 */
export async function deriveSessionToken(staffId, credentialHash) {
  return sha256Hex(`session:${staffId}:${credentialHash}`)
}
