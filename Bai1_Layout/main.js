/**
 * LÕI GIAO DIỆN VÀ TỐI ƯU HIỆU SUẤT JS (ĐẠT CHUẨN MAXPING V4)
 * Tất cả các tính năng nặng (tilt, parallax, cursor) đều được đóng gói qua requestAnimationFrame.
 */

// 1. Dark/Light Mode
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = themeToggleBtn.querySelector('i');
const currentTheme = localStorage.getItem('theme');

if (currentTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
}

let isThemeTransitioning = false; // Chống spam click

themeToggleBtn.addEventListener('click', (e) => {
    if (isThemeTransitioning) return; // Đang chuyển thì bỏ qua
    isThemeTransitioning = true;
    
    // Tọa độ nút bấm trên viewport
    const rect = themeToggleBtn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    
    // Màu đích (sau khi chuyển)
    const isDark = document.body.classList.contains('dark-theme');
    const targetColor = isDark ? '#F5F5F7' : '#000000';
    
    // Tạo overlay
    const overlay = document.createElement('div');
    overlay.className = 'theme-transition-overlay';
    overlay.style.backgroundColor = targetColor;
    overlay.style.setProperty('--cx', cx + 'px');
    overlay.style.setProperty('--cy', cy + 'px');
    document.body.appendChild(overlay);
    
    // Kích hoạt animation mở rộng (chờ 1 frame để browser render)
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            overlay.classList.add('expanding');
        });
    });
    
    // Đổi theme khi vòng tròn phủ đủ lớn
    setTimeout(() => {
        document.body.classList.toggle('dark-theme');
        if (document.body.classList.contains('dark-theme')) {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        }
    }, 500);
    
    // Fade-out overlay rồi xóa
    setTimeout(() => {
        overlay.style.transition = 'opacity 0.4s ease';
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.remove();
            isThemeTransitioning = false; // Mở khóa cho lần bấm tiếp
        }, 400);
    }, 1000);
});

// 2. Hamburger Menu
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mainNav = document.getElementById('mainNav');
const menuIcon = mobileMenuBtn.querySelector('i');

mobileMenuBtn.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    if (mainNav.classList.contains('active')) {
        menuIcon.classList.replace('fa-bars', 'fa-xmark');
    } else {
        menuIcon.classList.replace('fa-xmark', 'fa-bars');
    }
});

// Smooth Nav Scroll + Auto Close Menu Mobile
document.querySelectorAll('.main-nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
            const headerHeight = document.getElementById('header').offsetHeight;
            const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight - 10;
            window.scrollTo({ top: targetPos, behavior: 'smooth' });
        }
        
        // Auto close menu trên mobile
        if (mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
            menuIcon.classList.replace('fa-xmark', 'fa-bars');
        }
    });
});

// 3. Scroll Reveal
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

revealElements.forEach(el => revealObserver.observe(el));

// 4. Skeleton Loading (Fake 1.5s delay)
window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelectorAll('.skeleton').forEach(el => el.classList.remove('skeleton'));
    }, 1500);
});

// ==========================================
// ĐIỀU PHỐI MÀN HÌNH INTRO HELLO APPLE
// ==========================================
const appleIntro = document.getElementById('apple-intro');
if (appleIntro) {
    // Khóa cuộn trang khi đang chạy Intro
    document.body.style.overflow = 'hidden';
    
    // Sau 3.2 giây (chờ các animation chạy xong), bắt đầu làm mờ Intro Overlay
    setTimeout(() => {
        appleIntro.style.opacity = '0';
        
        // Trả lại khả năng cuộn và đảm bảo trang ở đầu (fix lỗi mobile nhảy xuống cuối)
        document.body.style.removeProperty('overflow');
        window.scrollTo(0, 0);
        
        // Đợi CSS transition 0.8s mờ dần chạy xong thì hủy hoàn toàn thẻ để giải phóng RAM
        setTimeout(() => {
            appleIntro.remove();
        }, 800);
        
        // Kích hoạt Typing Effect sau khi Intro biến mất
        startTypingEffect();
    }, 5000);
}

// ==========================================
// OPTION 1: TYPING EFFECT (Đánh máy tự động)
// ==========================================
function startTypingEffect() {
    const target = document.getElementById('typing-target');
    if (!target) return;
    
    const lines = ['Khám phá bộ sưu tập sản phẩm độc đáo', 'với thiết kế hiện đại và tinh tế.'];
    let lineIndex = 0;
    let charIndex = 0;
    
    // Thêm con trỏ nháy
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    target.appendChild(cursor);
    
    function typeChar() {
        if (lineIndex < lines.length) {
            if (charIndex < lines[lineIndex].length) {
                target.insertBefore(document.createTextNode(lines[lineIndex][charIndex]), cursor);
                charIndex++;
                setTimeout(typeChar, 40);
            } else {
                // Hết dòng → xuống hàng và chuyển sang dòng tiếp
                lineIndex++;
                charIndex = 0;
                if (lineIndex < lines.length) {
                    target.insertBefore(document.createElement('br'), cursor);
                    setTimeout(typeChar, 200); // Dừng nhẹ khi xuống hàng
                } else {
                    setTimeout(() => cursor.remove(), 2000);
                }
            }
        }
    }
    typeChar();
}

// ==========================================
// ĐẠI PHẪU TỐI ƯU BẰNG requestAnimationFrame
// ==========================================

const scrollProgress = document.getElementById('scroll-progress');
const appleWatermark = document.querySelector('.apple-bg-watermark');
const header = document.getElementById('header');
const backToTop = document.getElementById('back-to-top');

let lastScrollY = window.scrollY;
let isScrolling = false;

// Parallax & Scroll Events Tối Ưu Hóa
window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            // Thanh tiến trình
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            scrollProgress.style.width = `${(lastScrollY / height) * 100}%`;

            // Watermark Parallax (Tạo cảm giác chìm sâu 3D cho logo táo)
            if (lastScrollY < window.innerHeight && appleWatermark) {
                appleWatermark.style.transform = `translate(-50%, calc(-50% + ${lastScrollY * 0.2}px))`;
            }

            // Sticky Header Glass
            if (lastScrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Back To Top (Hiện khi cuộn quá 50% trang)
            if (backToTop) {
                const scrollPercent = (lastScrollY / height) * 100;
                if (scrollPercent > 30) {
                    backToTop.classList.add('show');
                } else {
                    backToTop.classList.remove('show');
                }
            }
            
            isScrolling = false;
        });
        isScrolling = true;
    }
});

// Back To Top: Click để cuộn lên đầu trang
if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Custom Magnetic Cursor Tối Ưu Hóa (Chống giật)
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
let mouseX = 0, mouseY = 0, outlineX = 0, outlineY = 0;
let isHovering = false;

if (window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        // Cập nhật ngay lập tức cho tâm con trỏ bằng translate3d (Hardware acceleration)
        cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    });

    // Vòng lặp rAF nội suy (Lerp) cho vòng tròn bên ngoài di chuyển siêu mượt
    function renderCursor() {
        outlineX += (mouseX - outlineX) * 0.15; // Tốc độ bám đuổi (0.15 là chuẩn mượt)
        outlineY += (mouseY - outlineY) * 0.15;
        
        const scale = isHovering ? 1.5 : 1;
        cursorOutline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0) scale(${scale})`;
        
        requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Bắt sự kiện hover nút bấm để bật nam châm
    document.querySelectorAll('a, button, .ripple-btn').forEach(el => {
        el.addEventListener('mouseenter', () => {
            isHovering = true;
            cursorOutline.classList.add('hover-btn');
        });
        el.addEventListener('mouseleave', () => {
            isHovering = false;
            cursorOutline.classList.remove('hover-btn');
        });
    });
}

// 3D Tilt Effect Tối Ưu Hóa (Giảm thiểu reflow layout)
const productCards = document.querySelectorAll('.product-card');

productCards.forEach(card => {
    let isInside = false;
    let cardRect = null; // Cache tọa độ thay vì đo lại mỗi pixel

    card.addEventListener('mouseenter', () => {
        isInside = true;
        cardRect = card.getBoundingClientRect(); // Chỉ đo một lần khi chuột bắt đầu vào thẻ
    });

    card.addEventListener('mousemove', e => {
        if (!isInside) return;
        
        window.requestAnimationFrame(() => {
            // Tính toán góc nghiêng dựa trên tọa độ cache (hiệu năng x10)
            const x = e.clientX - cardRect.left;
            const y = e.clientY - cardRect.top;
            const centerX = cardRect.width / 2;
            const centerY = cardRect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -8; 
            const rotateY = ((x - centerX) / centerX) * 8;
            
            // Dùng scale3d để kích hoạt GPU
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
    });
    
    card.addEventListener('mouseleave', () => {
        isInside = false;
        window.requestAnimationFrame(() => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });
});

// Ripple Effect
document.querySelectorAll('.ripple-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});


// ==========================================
// TÍNH NĂNG MỚI: TOAST & BOOTSTRAP MODAL
// ==========================================

const toastContainer = document.getElementById('toast-container');

function showToast(message) {
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerHTML = `<i class="fa-solid fa-check-circle"></i> <span>${message}</span>`;
    
    // Thêm vào DOM
    toastContainer.appendChild(toast);
    
    // Kích hoạt animation nở ra (Island Expands)
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });
    });
    
    // Thu nhỏ lại sau 2.5s
    setTimeout(() => {
        toast.classList.remove('show');
        // Xóa khỏi DOM sau khi CSS transition kết thúc
        setTimeout(() => toast.remove(), 500);
    }, 2500);
}

// Logic Đẩy Dữ Liệu vào Modal Bootstrap
document.querySelectorAll('.btn-detail').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const dataBtn = e.target;
        
        // Đổ data vào UI của Modal
        document.getElementById('modal-name').innerText = dataBtn.getAttribute('data-name');
        document.getElementById('modal-price').innerText = dataBtn.getAttribute('data-price');
        document.getElementById('modal-desc').innerText = dataBtn.getAttribute('data-desc');
        document.getElementById('modal-img').src = dataBtn.getAttribute('data-img');
        
        // Cập nhật lại tên sản phẩm cho nút Mua ở trong Modal
        document.getElementById('modal-buy-btn').setAttribute('data-name', dataBtn.getAttribute('data-name'));
    });
});

// ==========================================
// TÂM LÝ HỌC: LENS MAGNIFIER (Kính lúp Modal)
// ==========================================
const modalImgContainer = document.querySelector('.premium-modal-image');
const modalImg = document.getElementById('modal-img');
if (modalImgContainer && modalImg) {
    modalImgContainer.addEventListener('mousemove', (e) => {
        requestAnimationFrame(() => {
            const rect = modalImgContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Tính toán % tọa độ chuột để dịch chuyển tâm ảnh
            const xPercent = (x / rect.width) * 100;
            const yPercent = (y / rect.height) * 100;
            
            modalImg.style.transformOrigin = `${xPercent}% ${yPercent}%`;
            modalImg.style.transform = 'scale(2)'; // Zoom x2
        });
    });
    
    modalImgContainer.addEventListener('mouseleave', () => {
        requestAnimationFrame(() => {
            modalImg.style.transformOrigin = 'center center';
            modalImg.style.transform = 'scale(1)'; // Trả về bình thường
        });
    });
}

// ==========================================
// TÂM LÝ HỌC: REWARD BURST PARTICLES (Hạt Dopamine)
// ==========================================
function createBurst(x, y) {
    const colors = ['#0071E3', '#34C759', '#FF3B30', '#F5A623', '#AF52DE'];
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'burst-particle';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        document.body.appendChild(particle);
        
        // Tính toán hướng bay ngẫu nhiên
        const angle = Math.random() * Math.PI * 2;
        const velocity = 30 + Math.random() * 50; // Tốc độ văng
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        // Ép Frame render ngay lập tức hiệu ứng
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                particle.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(0)`;
                particle.style.opacity = '0';
            });
        });
        
        // Hốt rác DOM ngay sau khi kết thúc
        setTimeout(() => particle.remove(), 600);
    }
}

// ==========================================
// TÂM LÝ HỌC: FLOATING SMART CART (Giỏ hàng thông minh)
// ==========================================
let cartItemsCount = 0;
const smartCart = document.getElementById('smart-cart');
const cartCountBadge = document.getElementById('cart-count');

function addToCartEffect(e, productName) {
    // 1. Phóng pháo hoa Dopamine tại tọa độ Click
    if (e) createBurst(e.clientX, e.clientY);
    
    // 2. Hiện Toast
    showToast(`Đã thêm <b>${productName}</b> vào giỏ hàng!`);
    
    // 3. Tăng số lượng & Hiện Giỏ Hàng Thông Minh
    cartItemsCount++;
    if(cartCountBadge) {
        cartCountBadge.innerText = cartItemsCount;
        cartCountBadge.classList.add('pop');
        setTimeout(() => cartCountBadge.classList.remove('pop'), 300);
    }
    
    if (smartCart && !smartCart.classList.contains('show')) {
        smartCart.classList.add('show');
    }
}

// Logic Nút Mua nằm bên ngoài danh sách sản phẩm
document.querySelectorAll('.btn-buy:not(#modal-buy-btn)').forEach(btn => {
    btn.addEventListener('click', (e) => {
        addToCartEffect(e, e.target.getAttribute('data-name'));
    });
});

// Logic Nút Mua nằm bên trong Modal
document.getElementById('modal-buy-btn').addEventListener('click', (e) => {
    addToCartEffect(e, e.target.getAttribute('data-name'));
    
    // Tự động đóng Modal Bootstrap sau khi click mua
    const modalElement = document.getElementById('productModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
        modalInstance.hide();
    }
});

// ==========================================
// OPTION 2: ANIMATED NUMBER COUNTER (Đếm số bay)
// ==========================================
function animateCounter(el, target) {
    const duration = 1500; // 1.5 giây
    const startTime = performance.now();
    
    // Lưu nội dung gốc và loại bỏ ký tự không phải số
    const suffix = target.replace(/[\d.]/g, '').trim(); // 'đ', '%' etc.
    const numericValue = parseInt(target.replace(/[^\d]/g, ''));
    
    if (isNaN(numericValue) || numericValue === 0) return;
    
    function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing: Chuyển động từ nhanh -> chậm (ease-out)
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easedProgress * numericValue);
        
        // Format số có dấu chấm ngăn cách hàng nghìn
        el.textContent = currentVal.toLocaleString('vi-VN') + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            el.textContent = target; // Đảm bảo giá trị cuối chính xác
        }
    }
    requestAnimationFrame(step);
}

// Sử dụng IntersectionObserver để kích hoạt đếm số khi thẻ xuất hiện
const priceElements = document.querySelectorAll('.price');
const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const originalText = el.textContent.trim();
            el.textContent = '0đ'; // Reset về 0
            animateCounter(el, originalText);
            observer.unobserve(el); // Chỉ chạy 1 lần duy nhất
        }
    });
}, { threshold: 0.5 });

priceElements.forEach(el => counterObserver.observe(el));

// ==========================================
// OPTION 1: SCROLLSPY (Điểm sáng Thanh Nav)
// ==========================================
const sections = document.querySelectorAll('#home, #products, #contact');
const navLinks = document.querySelectorAll('.nav-link[data-section]');

const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-section') === id) {
                    link.classList.add('active');
                }
            });
        }
    });
}, { threshold: 0.3, rootMargin: '-70px 0px -30% 0px' });

sections.forEach(sec => {
    if (sec.id) spyObserver.observe(sec);
});

// ==========================================
// OPTION 4: BLUR-UP IMAGE LOADING + ERROR FALLBACK
// ==========================================
document.querySelectorAll('.blur-up').forEach(img => {
    // Blur-up: Sắc nét dần khi tải xong
    if (img.complete && img.naturalWidth > 0) {
        img.classList.add('loaded');
    } else {
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });
    }
    
    // Error Fallback: Hiện placeholder đẹp khi ảnh lỗi
    img.addEventListener('error', () => {
        const fallback = document.createElement('div');
        fallback.className = 'img-fallback';
        fallback.innerHTML = '<i class="fa-solid fa-camera"></i>';
        img.parentElement.replaceChild(fallback, img);
    });
});

// ==========================================
// TAB ATTENTION GRABBER (Gọi người dùng quay lại)
// ==========================================
const originalTitle = document.title;
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.title = 'Quay lại nha! 🥺 — Moshi Store';
    } else {
        document.title = originalTitle;
    }
});

// ==========================================
// KONAMI CODE EASTER EGG 🎮
// ==========================================
const konamiSequence = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiSequence[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiSequence.length) {
            konamiIndex = 0;
            triggerConfetti();
        }
    } else {
        konamiIndex = 0;
    }
});

function triggerConfetti() {
    const colors = ['#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#007AFF', '#AF52DE', '#FF2D55'];
    const total = 80;
    
    for (let i = 0; i < total; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: ${Math.random() * 10 + 5}px;
                height: ${Math.random() * 10 + 5}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
                left: ${Math.random() * 100}vw;
                top: -10px;
                z-index: 100000;
                pointer-events: none;
                opacity: 1;
            `;
            document.body.appendChild(confetti);
            
            const endX = (Math.random() - 0.5) * 200;
            const endY = window.innerHeight + 50;
            const rotation = Math.random() * 720;
            const duration = Math.random() * 2000 + 1500;
            
            confetti.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translate(${endX}px, ${endY}px) rotate(${rotation}deg)`, opacity: 0 }
            ], { duration, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' });
            
            setTimeout(() => confetti.remove(), duration);
        }, i * 30);
    }
}

// ==========================================
// 3. SPOTLIGHT HOVER (macOS Vibe)
// ==========================================
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

