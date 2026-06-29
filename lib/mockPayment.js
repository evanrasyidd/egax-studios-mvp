export function generateQRISData(orderId, amount) {
  return `00020101021226590014ID.CO.EGAXSTUDIOS.WWW01189360050300000898230203UMI51440014ID.CO.QRIS.WWW0215ID20232078621900303UMI520454995303360540${amount}5802ID5915EGAX STUDIOS ID6013Jakarta Selatan61051234062${orderId}630412AB`
}

export function generateVANumber(bank) {
  const prefix = { BCA: '8277', BNI: '8887', Mandiri: '8998' }
  const rand = Math.floor(Math.random() * 1e12).toString().padStart(12, '0')
  return prefix[bank] + rand
}

/**
 * Simulasi proses verifikasi pembayaran ala payment gateway asli (Midtrans
 * dkk): ada delay seolah-olah menunggu webhook/polling status dari bank,
 * dan ada kemungkinan kecil gagal (timeout/insufficient balance) supaya
 * flow checkout tidak terasa "pasti sukses" seperti placeholder developer.
 *
 * @param {string} orderId
 * @param {object} opts - { failureRate?: number antara 0-1, default 0.04 }
 */
export async function simulatePayment(orderId, opts = {}) {
  const failureRate = opts.failureRate ?? 0.04
  const delay = 1800 + Math.random() * 1400
  return new Promise((resolve) => {
    setTimeout(() => {
      const failed = Math.random() < failureRate
      resolve(
        failed
          ? { success: false, orderId, reason: 'Pembayaran gagal diverifikasi. Saldo tidak cukup atau koneksi bank terputus.' }
          : { success: true, orderId }
      )
    }, delay)
  })
}
