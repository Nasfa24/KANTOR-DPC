// app.js

// KUNCI INI HARUS BERISI URL DEPLOYMENT "WEB APP" YANG PALING BARU (Berakhiran /exec)
const API_URL = "https://script.google.com/macros/s/AKfycbyk_xYhuL4uj7mLx9L0Rtg9AI68Ifw9yCf35cXDAdB6by-18R4Mcq3vxydfUgJy4RnTNA/exec"; 
const API_KEY = "SuperAppKantor2026!"; // Harus sama persis dengan di GAS

// Fungsi Universal untuk menembak API Lapis Baja (Bulletproof Fetch)
async function callAPI(action, payload = {}) {
    const data = {
        api_key: API_KEY,
        action: action,
        ...payload
    };

    Swal.fire({
        title: 'Memproses...',
        text: 'Menyinkronkan data dengan server',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => { Swal.showLoading(); }
    });

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            // STANDAR MUTLAK: text/plain agar Google tidak memblokir (Bypass CORS Preflight)
            headers: {
                "Content-Type": "text/plain;charset=utf-8", 
            },
            body: JSON.stringify(data),
            // STANDAR MUTLAK: Mengikuti sistem Redirect 302 milik Google
            redirect: "follow" 
        });

        // Tangkap respon sebagai teks dulu (Jangan langsung di-parse ke JSON)
        const textResponse = await response.text();
        
        let result;
        try {
            // Mencoba mengubah teks menjadi JSON
            result = JSON.parse(textResponse);
        } catch (e) {
            // JIKA GAGAL (Artinya Google mengirim HTML "Unexpected token <"):
            console.error("SERVER GOOGLE MENOLAK:", textResponse);
            throw new Error("Koneksi diblokir oleh Server Google. Pastikan Akses API (Deployment) diatur ke 'Anyone/Siapa Saja'.");
        }
        
        Swal.close();

        if (result.status === "success") {
            return result.data; 
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        Swal.close();
        Swal.fire({
            icon: 'error',
            title: 'Koneksi Gagal',
            text: error.message,
            confirmButtonColor: '#ef4444',
            customClass: { popup: 'rounded-3xl' }
        });
        throw error; 
    }
}

// Cek apakah user sudah login. Jika belum, tendang ke index.html
function requireLogin() {
    const user = JSON.parse(localStorage.getItem('userSession'));
    const currentPage = window.location.pathname.split('/').pop();
    
    if (!user && currentPage !== 'index.html' && currentPage !== '') {
        window.location.href = 'index.html';
    }
    return user;
}

// Fungsi Logout
function logout() {
    localStorage.removeItem('userSession');
    window.location.href = 'index.html';
}

// ==========================================
// ENGINE INSTALASI APLIKASI (PWA)
// ==========================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('Sistem Aplikasi Terinstal (PWA Aktif)'))
      .catch(err => console.log('PWA Gagal:', err));
  });
}
