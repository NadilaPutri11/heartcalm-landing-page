/* ============================================================
   HEARTCALM Acne Water Gel - script.js
   Berisi: smooth scroll dengan offset navbar, penanda menu aktif
   (ScrollSpy), perbandingan sebelum-sesudah, validasi email newsletter,
   dan modal konfirmasi.
   Modal hanya simulasi antarmuka, email TIDAK disimpan.
   ============================================================ */

(function () {
    "use strict";

    // ---------- Elemen yang dipakai ----------
    const navbar = document.getElementById("navbar");
    const menuNavigasi = document.getElementById("menuNavigasi");
    const formNewsletter = document.getElementById("formNewsletter");
    const inputEmail = document.getElementById("emailNewsletter");
    const pesanGalat = document.getElementById("pesanEmail");
    const modalNewsletter = document.getElementById("modalNewsletter");
    const teksTahun = document.getElementById("tahunSekarang");

    const kurangiGerakan = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const perilakuGeser = kurangiGerakan ? "auto" : "smooth";

    // Format email: ada nama, tanda @, domain, dan akhiran minimal 2 huruf (misal .com)
    const POLA_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    // ---------- Smooth scroll dengan offset navbar ----------

    // Posisi scroll = posisi bagian - tinggi navbar - jarak kecil.
    // Tinggi navbar dibaca saat itu juga, karena di ponsel tingginya berubah saat menu dibuka/ditutup.
    function hitungPosisiTujuan(elemenTujuan) {
        const jarakTambahan = 16;
        const posisiBagian = elemenTujuan.getBoundingClientRect().top + window.scrollY;
        return Math.max(posisiBagian - navbar.offsetHeight - jarakTambahan, 0);
    }

    function geserKeBagian(elemenTujuan, perilaku = perilakuGeser) {
        window.scrollTo({ top: hitungPosisiTujuan(elemenTujuan), behavior: perilaku });
    }

    // Menu di ponsel ditutup dulu, baru halaman digeser (supaya tinggi navbar sudah final)
    function tutupMenuLaluJalankan(aksi) {
        if (menuNavigasi.classList.contains("show")) {
            menuNavigasi.addEventListener("hidden.bs.collapse", aksi, { once: true });
            bootstrap.Collapse.getOrCreateInstance(menuNavigasi).hide();
        } else {
            aksi();
        }
    }

    function tanganiKlikNavigasi(event) {
        const idTujuan = event.currentTarget.getAttribute("href");
        const elemenTujuan = document.querySelector(idTujuan);
        if (!elemenTujuan) return;

        event.preventDefault();
        tutupMenuLaluJalankan(() => {
            geserKeBagian(elemenTujuan);
            history.pushState(null, "", idTujuan);
            elemenTujuan.focus({ preventScroll: true });
        });
    }

    function aktifkanSmoothScroll() {
        // Semua tautan internal (#bahan, #manfaat, dst.), kecuali tautan "#" kosong
        document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach((tautan) => {
            tautan.addEventListener("click", tanganiKlikNavigasi);
        });
    }

    // Jika halaman dibuka dengan hash (misal index.html#testimoni), geser dengan offset yang sama
    function geserSesuaiHashSaatMuat() {
        if (!location.hash) return;
        const elemenTujuan = document.querySelector(location.hash);
        if (elemenTujuan) {
            window.requestAnimationFrame(() => geserKeBagian(elemenTujuan, "auto"));
        }
    }

    // ---------- Penanda menu aktif (ScrollSpy Bootstrap) ----------
    function aktifkanScrollSpy() {
        new bootstrap.ScrollSpy(document.body, {
            target: "#menuNavigasi",
            rootMargin: "-35% 0px -55% 0px",
            threshold: [0],
            smoothScroll: false
        });
    }

    // ---------- Validasi newsletter ----------
    function validasiEmail(nilai) {
        if (nilai === "") return "Email wajib diisi ya.";
        if (!POLA_EMAIL.test(nilai)) return "Format email belum tepat. Contoh: nama@email.com";
        return "";
    }

    // Menampilkan pesan galat dan menandai input. Mengembalikan true jika email valid.
    function tampilkanStatusEmail(pesan) {
        const adaGalat = pesan !== "";
        pesanGalat.textContent = pesan;
        inputEmail.classList.toggle("is-invalid", adaGalat);
        inputEmail.setAttribute("aria-invalid", String(adaGalat));
        return !adaGalat;
    }

    function aktifkanFormNewsletter() {
        const modal = bootstrap.Modal.getOrCreateInstance(modalNewsletter);

        formNewsletter.addEventListener("submit", (event) => {
            event.preventDefault();

            const emailBersih = inputEmail.value.trim();
            const valid = tampilkanStatusEmail(validasiEmail(emailBersih));
            if (!valid) {
                inputEmail.focus();
                return;
            }

            // Simulasi: hanya menampilkan konfirmasi, tidak ada pengiriman atau penyimpanan
            formNewsletter.reset();
            modal.show();
        });

        // Setelah galat muncul, pesan diperbarui sambil pengguna mengetik
        inputEmail.addEventListener("input", () => {
            if (inputEmail.classList.contains("is-invalid")) {
                tampilkanStatusEmail(validasiEmail(inputEmail.value.trim()));
            }
        });

        // Setelah modal ditutup, fokus kembali ke kolom email
        modalNewsletter.addEventListener("hidden.bs.modal", () => inputEmail.focus());
    }

    // ---------- Perbandingan sebelum-sesudah (ilustrasi) ----------
    // Input range transparan di atas ilustrasi; nilainya dipakai untuk menggeser garis pembatas.
    function aktifkanPembandingHasil() {
        const pembanding = document.getElementById("pembandingHasil");
        if (!pembanding) return;

        const penggeser = pembanding.querySelector(".pembanding-input");
        const perbaruiPosisi = () => {
            pembanding.style.setProperty("--posisi", penggeser.value + "%");
        };

        penggeser.addEventListener("input", perbaruiPosisi);
        perbaruiPosisi();
    }

    // ---------- Tahun pada copyright ----------
    function isiTahunSekarang() {
        if (teksTahun) teksTahun.textContent = new Date().getFullYear();
    }

    // ---------- Inisialisasi ----------
    document.addEventListener("DOMContentLoaded", () => {
        aktifkanSmoothScroll();
        aktifkanScrollSpy();
        aktifkanFormNewsletter();
        aktifkanPembandingHasil();
        isiTahunSekarang();
        geserSesuaiHashSaatMuat();
    });
})();
