// public/script.js
document.addEventListener('DOMContentLoaded', () => {

    try {

        const safeListener = (fn) => {
            return (...args) => {
                try {
                    return fn(...args);
                } catch (e) {
                    console.error('Sidebar handler failed:', e);
                }
            };
        };

        const sidebar = document.querySelector(".sidebar");
        const desktopToggleBtn = document.querySelector(".toggle-btn");
        const mobileToggleBtn = document.querySelector("#mobile-toggle-btn") || document.querySelector(".mobile-menu-toggle-btn");
        const mobileHeader = document.querySelector("#mobile-header");
        const sidebarOverlay = document.querySelector("#sidebar-overlay");
        const body = document.body;

        if (!sidebar) { return; }

        const getSubmenuItems = () => sidebar.querySelectorAll(".has-submenu");

        // --- YARDIMCI FONKSİYON: Tam Kapatmayı Yönetir ---
        const closeSidebar = () => {
            sidebar.classList.remove("mobile-open");
            body.classList.remove("sidebar-active");
            if (sidebarOverlay) sidebarOverlay.classList.remove("active");
            getSubmenuItems().forEach(item => { item.classList.remove("open"); });
        };

        let isMobile = window.innerWidth <= 768;
        const checkMobile = () => {
            isMobile = window.innerWidth <= 768;
            if (!isMobile) {
                sidebar.classList.remove("mobile-open");
                body.classList.remove("sidebar-active");
                if (sidebarOverlay) sidebarOverlay.classList.remove("active");
            } else {
                // Mobilde collapsed mod submenu'leri tamamen gizler; mobilde her zaman açık genişlikte olsun
                sidebar.classList.remove("collapsed");
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
                // Mobilde collapsed mod submenu'leri gizlediği için açarken sıfırla
                if (isMobile) sidebar.classList.remove("collapsed");
                sidebar.classList.add("mobile-open");
                body.classList.add("sidebar-active");
                if (sidebarOverlay) sidebarOverlay.classList.add("active");
            }
        };


        // 1. MOBİL AÇMA İŞLEMİ (Hamburger)
        if (mobileToggleBtn) {
            mobileToggleBtn.addEventListener("click", safeListener(toggleSidebar));
        }

        // 2. KAPATMA İŞLEMİ (Sidebar İçindeki Geri Ok Butonu - Mobile/Desktop)
        if (desktopToggleBtn) {
            desktopToggleBtn.addEventListener("click", safeListener((event) => {
                if (isMobile) {
                    event.preventDefault();
                    closeSidebar(); // Mobildeyken tamamen kapat
                } else {
                    // Masaüstündeyken, daraltma yap (orijinal işlevi)
                    sidebar.classList.toggle("collapsed");
                    if (sidebar.classList.contains("collapsed")) {
                        getSubmenuItems().forEach(item => { item.classList.remove("open"); });
                    }
                }
            }));
        }

        // 3. Alt Menüleri Açma/Kapatma (event delegation - dinamik içerik için)
        sidebar.addEventListener('click', safeListener((event) => {
            const target = event.target instanceof Element ? event.target : event.target && event.target.parentElement;
            if (!target) return;

            const submenuLink = target.closest('.has-submenu > a');
            const anyLink = target.closest('a');

            // Submenu başlığına tıklandıysa
            if (submenuLink && sidebar.contains(submenuLink)) {
                if (submenuLink.getAttribute('href') === '#') {
                    event.preventDefault();
                }

                const item = submenuLink.closest('.has-submenu');
                if (!item) return;

                if (!sidebar.classList.contains("collapsed") || isMobile) {
                    item.classList.toggle('open');
                    getSubmenuItems().forEach(otherItem => {
                        if (otherItem !== item && otherItem.classList.contains('open')) {
                            otherItem.classList.remove('open');
                        }
                    });
                }

                return;
            }

            // Mobilde, sidebar içindeki herhangi bir gerçek linke tıklanınca kapat
            if (isMobile && anyLink && sidebar.contains(anyLink)) {
                const href = anyLink.getAttribute('href');
                if (href && href !== '#') {
                    setTimeout(() => {
                        closeSidebar();
                    }, 100);
                }
            }
        }));

        // Sayfa yüklendiğinde sidebar'ı kapat (mobilde)
        window.addEventListener('load', () => {
            if (isMobile) {
                closeSidebar();
            }
        });

        // 4. Overlay'e tıklayınca sidebar'ı kapat
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', safeListener(closeSidebar));
        }

        // 5. Mobil Menü Açıkken Dışarı Tıklamayı Yönetme (UX için)
        document.addEventListener('click', safeListener((event) => {
            if (isMobile && sidebar.classList.contains("mobile-open")) {
                if (!sidebar.contains(event.target) &&
                    mobileToggleBtn && !mobileToggleBtn.contains(event.target) &&
                    sidebarOverlay && sidebarOverlay.contains(event.target)) {
                    closeSidebar();
                }
            }
        }));

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

    } catch (e) {
        console.error('Sidebar init failed:', e);
    }

});