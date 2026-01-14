// public/script.js
document.addEventListener('DOMContentLoaded', () => {

    const sidebar = document.querySelector(".sidebar");
    const desktopToggleBtn = document.querySelector(".toggle-btn");
    const mobileToggleBtn = document.querySelector("#mobile-toggle-btn") || document.querySelector(".mobile-menu-toggle-btn");
    const mobileHeader = document.querySelector("#mobile-header");
    const sidebarOverlay = document.querySelector("#sidebar-overlay");
    const submenuItems = document.querySelectorAll(".has-submenu");
    const body = document.body;

    if (!sidebar) { return; }

    // --- YARDIMCI FONKSİYON: Tam Kapatmayı Yönetir ---
    const closeSidebar = () => {
        sidebar.classList.remove("mobile-open");
        body.classList.remove("sidebar-active");
        if (sidebarOverlay) sidebarOverlay.classList.remove("active");
        submenuItems.forEach(item => { item.classList.remove("open"); });
    };

    let isMobile = window.innerWidth <= 768;
    const checkMobile = () => {
        isMobile = window.innerWidth <= 768;
        if (!isMobile) {
            sidebar.classList.remove("mobile-open");
            body.classList.remove("sidebar-active");
            if (sidebarOverlay) sidebarOverlay.classList.remove("active");
        } else {
            // Mobilde sayfa yüklendiğinde sidebar'ı kapat
            closeSidebar();
        }
    };
    window.addEventListener('resize', checkMobile);
    checkMobile();

    // Sayfa yüklendiğinde mobilde sidebar'ı kapat
    if (isMobile) {
        closeSidebar();
    }

    // --- YARDIMCI FONKSİYON: Tam Açma/Kapamayı Yönetir ---
    const toggleSidebar = () => {
        if (sidebar.classList.contains("mobile-open")) {
            closeSidebar();
        } else {
            sidebar.classList.add("mobile-open");
            body.classList.add("sidebar-active");
            if (sidebarOverlay) sidebarOverlay.classList.add("active");
        }
    };


    // 1. MOBİL AÇMA İŞLEMİ (Hamburger)
    if (mobileToggleBtn) {
        mobileToggleBtn.addEventListener("click", toggleSidebar);
    }

    // 2. KAPATMA İŞLEMİ (Sidebar İçindeki Geri Ok Butonu - Mobile/Desktop)
    if (desktopToggleBtn) {
        desktopToggleBtn.addEventListener("click", (event) => {
            if (isMobile) {
                event.preventDefault();
                closeSidebar(); // Mobildeyken tamamen kapat
            } else {
                // Masaüstündeyken, daraltma yap (orijinal işlevi)
                sidebar.classList.toggle("collapsed");
                if (sidebar.classList.contains("collapsed")) {
                    submenuItems.forEach(item => { item.classList.remove("open"); });
                }
            }
        });
    }


    // 3. Alt Menüleri Açma/Kapatma (LGS, KPSS, YKS gibi ana başlıklara tıklama)
    submenuItems.forEach(item => {
        const link = item.querySelector("a");
        link.addEventListener("click", (event) => {

            // Eğer linkin href'i '#' ise (menü başlığı)
            if (link.getAttribute('href') === '#') {
                event.preventDefault(); // Sayfa yenilemeyi engelle (Alt menüyü açmak için şart!)
            }

            // Alt menüye (LGS, KPSS, YKS) tıklanma işlemi
            // Daraltılmış modda DEĞİLSE (veya mobil ise) alt menü açılır/kapanır.
            if (!sidebar.classList.contains("collapsed") || isMobile) {

                // Tıklanan menüyü aç/kapat
                item.classList.toggle("open");

                // Diğer açık menüleri kapat
                submenuItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains("open")) {
                        otherItem.classList.remove("open");
                    }
                });

            }

            // Mobilde, alt menü içindeki gerçek linke (TYT Türkçe gibi) tıklandığında menüyü kapat
            if (isMobile && link.getAttribute('href') !== '#') {
                closeSidebar();
            }
        });
    });

    // 7. Mobilde tüm sidebar linklerine tıklandığında sidebar'ı kapat
    const handleLinkClick = (event) => {
        if (!isMobile) return;
        const link = event.currentTarget;
        // Link bir kategori veya ders sayfasına gidiyorsa sidebar'ı kapat
        if (link.getAttribute('href') && link.getAttribute('href') !== '#') {
            // Kısa bir gecikme ile kapat (sayfa geçişi için)
            setTimeout(() => {
                closeSidebar();
            }, 100);
        }
    };

    // Tüm sidebar linklerini bul ve event listener ekle
    const allSidebarLinks = sidebar.querySelectorAll('a');
    allSidebarLinks.forEach(link => {
        link.addEventListener('click', handleLinkClick);
    });

    // Sayfa yüklendiğinde sidebar'ı kapat (mobilde)
    window.addEventListener('load', () => {
        if (isMobile) {
            closeSidebar();
        }
    });

    // 4. Overlay'e tıklayınca sidebar'ı kapat
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }

    // 5. Mobil Menü Açıkken Dışarı Tıklamayı Yönetme (UX için)
    document.addEventListener('click', (event) => {
        if (isMobile && sidebar.classList.contains("mobile-open")) {
            if (!sidebar.contains(event.target) &&
                mobileToggleBtn && !mobileToggleBtn.contains(event.target) &&
                sidebarOverlay && sidebarOverlay.contains(event.target)) {
                closeSidebar();
            }
        }
    });

    // 6. Mobilde Scroll Yönüne Göre Sidebar Aç/Kapat
    let lastScrollTop = 0;
    let ticking = false;

    const handleScroll = () => {
        if (!isMobile) return; // Sadece mobilde çalışsın

        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const delta = currentScrollTop - lastScrollTop;
        const threshold = 12;

        if (mobileHeader && Math.abs(delta) >= threshold) {
            if (delta > 0) {
                mobileHeader.classList.add("hidden");
            } else {
                mobileHeader.classList.remove("hidden");
            }
        }

        // Aşağı scroll → Sidebar'ı kapat
        if (currentScrollTop > lastScrollTop && currentScrollTop > 20) {
            // Kullanıcı aşağı scroll ediyor (en az 20px aşağı)
            if (sidebar.classList.contains("mobile-open")) {
                closeSidebar();
            }
        }

        lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
        ticking = false;
    };

    // Scroll event listener (throttle ile performans için)
    window.addEventListener('scroll', () => {
        if (!isMobile) return;

        if (!ticking) {
            window.requestAnimationFrame(handleScroll);
            ticking = true;
        }
    }, { passive: true });

});