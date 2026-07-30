// app.js

// Kunci ini URL yang Anda berikan tadi
const API_URL = "https://script.google.com/macros/s/AKfycbyk_xYhuL4uj7mLx9L0Rtg9AI68Ifw9yCf35cXDAdB6by-18R4Mcq3vxydfUgJy4RnTNA/exec";
const API_KEY = "SuperAppKantor2026!"; // Harus sama persis dengan di GAS

// Fungsi Universal untuk menembak API (Dengan indikator Loading SweetAlert)
async function callAPI(action, payload = {}) {
    // Gabungkan payload khusus dengan konfigurasi sistem
    const data = {
        api_key: API_KEY,
        action: action,
        ...payload
    };

    // Munculkan Loading Animasi
    Swal.fire({
        title: 'Memproses...',
        text: 'Mohon tunggu sebentar',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify(data)
        });
        const result = await response.json();
        
        // Tutup loading
        Swal.close();

        if (result.status === "success") {
            return result.data; // Kembalikan data murni
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        Swal.close();
        Swal.fire({
            icon: 'error',
            title: 'Terjadi Kesalahan',
            text: error.message,
            confirmButtonColor: '#ef4444'
        });
        throw error; // Lempar error agar bisa ditangkap oleh fungsi pemanggil
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