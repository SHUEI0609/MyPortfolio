// --- Data ---

const HISTORY = [
    { year: "2025", title: "Deep Learning Contest 1次審査突破", desc: "Backend Engineering / Go Language / Microservices Architecture" },
    { year: "2025", title: "Deep Learning Contest 出場", desc: "Team Leader / Hackathon / Product Development" },
    { year: "2025", title: "TypeScript React Next.js学習開始", desc: "Backend Engineering / Go Language / Microservices Architecture" },
    { year: "2025", title: "松尾・岩澤研究室　DL基礎講座修了", desc: "Backend Engineering / Go Language / Microservices Architecture" },
    { year: "2025", title: "松尾・岩澤研究室　DL基礎講座受講開始", desc: "Backend Engineering / Go Language / Microservices Architecture" },
    { year: "2025", title: "ニュージーランドに短期留学", desc: "Backend Engineering / Go Language / Microservices Architecture" },
    { year: "2024", title: "HACK Uに参加", desc: "Team Leader / Hackathon / Product Development" },
    { year: "2024", title: "Python Go学習開始", desc: "Sound Design / Indie Games / Soundscape" },
    { year: "2024", title: "知能情報コース進学", desc: "Sound Design / Indie Games / Soundscape" },
    { year: "2023", title: "大阪公立大学工業高等専門学校入学", desc: "Dept. of Information Technology" },
];

const SKILLS = [
    { name: "TYPESCRIPT", type: "LANG" },
    { name: "GO", type: "LANG" },
    { name: "PYTHON", type: "LANG" },
    { name: "REACT / NEXT.JS", type: "FRAMEWORK" },
    { name: "PLAYING BASS", type: "CREATIVE" },
    { name: "DOCKER", type: "INFRA" },
];

const PROJECTS = [
    {
        id: "01",
        title: "classify season in sentence",
        category: "DeepLearning",
        desc: "文章の季節感を判断するAI",
        tech: "Python",
        fullDesc: "任意の文章を入力し，季節感を判断します．",
        year: "2025"
    },
    {
        id: "02",
        title: "Teachable caligraphy machine",
        category: "machine",
        desc: "ロボット × AI で動的に書道を学ぶことができるロボット",
        tech: "Python , Magician Lite",
        fullDesc: "DeepLearningとMagician Liteを用いて動的に書道を学ぶことができるロボットをチームで作成しました．ロボットアームの動かす筆を持つことで筆の動かし方を学ぶことができます",
        year: "2025"
    }
];

// --- State ---
let currentProjectId = null;

// --- Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initLoading();
    initCanvas();
    renderHistory();
    renderSkills();
    renderProjects();
    initScrollObserver();

    document.getElementById('current-year').textContent = new Date().getFullYear();
});

// --- Loading Screen ---

function initLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    const progressEl = document.getElementById('loading-progress');
    let progress = 0;

    // Disable scroll during loading
    document.body.style.overflow = 'hidden';

    const interval = setInterval(() => {
        progress++;
        progressEl.textContent = `${progress}%`;

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.classList.add('loading-exit');
                document.body.style.overflow = ''; // Enable scroll
                document.body.classList.add('loaded');
            }, 200);
        }
    }, 20); // 20ms * 100 = 2000ms total
}

// --- Render Functions ---

function renderHistory() {
    const container = document.getElementById('history-list');
    container.innerHTML = HISTORY.map(h => `
        <div class="flex gap-4 border-b border-gray-300 pb-4 last:border-0">
            <span class="font-mono font-bold w-16 pt-1 shrink-0">${h.year}</span>
            <div>
                <div class="font-bold uppercase">${h.title}</div>
                <div class="text-xs text-gray-600 mt-1">${h.desc}</div>
            </div>
        </div>
    `).join('');
}

function renderSkills() {
    const container = document.getElementById('skills-list');
    container.innerHTML = SKILLS.map(s => `
        <span class="px-3 py-1 border border-black text-xs font-bold hover:bg-black hover:text-white transition-colors cursor-default">
            ${s.name}
        </span>
    `).join('');
}

function renderProjects() {
    const container = document.getElementById('projects-container');
    container.innerHTML = PROJECTS.map((p, index) => {
        // Create marquee text (repeated 4 times)
        const marqueeText = Array(4).fill(`
            <span class="text-7xl md:text-9xl font-black uppercase px-8 tracking-tighter">
                ${p.title}
            </span>
            <span class="text-7xl md:text-9xl font-black uppercase px-8 tracking-tighter text-stroke">
                ${p.title}
            </span>
        `).join('');

        return `
        <div onclick="handleProjectClick('${p.id}')"
             class="group relative border-t border-black transition-all duration-500 hover:bg-black hover:text-white cursor-pointer animate-on-scroll opacity-0 translate-y-8 overflow-hidden py-12 hover:py-16"
             style="transition-delay: ${index * 100}ms">
            
            <!-- Default Content -->
            <div class="container mx-auto px-6 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between relative z-10 transition-opacity duration-300 group-hover:opacity-0">
                <div class="flex flex-col gap-2 md:w-1/3">
                    <div class="flex items-center gap-4">
                        <span class="text-xs font-mono border border-current px-2 py-0.5 rounded-full">PROJECT ${p.id}</span>
                        <span class="text-xs font-bold tracking-widest">${p.category}</span>
                    </div>
                    <h3 class="text-3xl md:text-5xl font-black uppercase leading-none tracking-tight">
                        ${p.title}
                    </h3>
                    <div class="text-xs font-mono mt-1 opacity-70">${p.tech}</div>
                </div>
                <div class="md:w-1/3 text-sm font-medium leading-relaxed opacity-80">
                    ${p.desc}
                </div>
                <div class="md:w-1/6 flex justify-end">
                    <div class="flex items-center gap-2 text-sm font-bold border-b border-current pb-1">
                        VIEW WORK <i data-lucide="arrow-right" class="w-4 h-4"></i>
                    </div>
                </div>
            </div>

            <!-- Hover Marquee -->
            <div class="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                <div class="animate-marquee whitespace-nowrap flex items-center">
                    ${marqueeText}
                </div>
            </div>
        </div>
        `;
    }).join('');

    // Re-initialize icons for dynamic content
    lucide.createIcons();
}

// --- Navigation & Interactions ---

function handleProjectClick(id) {
    currentProjectId = id;
    const project = PROJECTS.find(p => p.id === id);
    const nextIndex = (PROJECTS.findIndex(p => p.id === id) + 1) % PROJECTS.length;
    const nextProject = PROJECTS[nextIndex];

    // Render Detail Content
    const contentContainer = document.getElementById('detail-content');
    contentContainer.innerHTML = `
        <div class="container mx-auto px-6 border-t-2 border-black pt-8 mb-24">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
                <h1 class="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8]">
                    ${project.title}
                </h1>
                <div class="flex flex-col items-end text-right">
                    <span class="text-xs font-bold tracking-widest border border-black px-3 py-1 rounded-full mb-2">
                        ${project.category}
                    </span>
                    <span class="text-sm font-mono">${project.year}</span>
                </div>
            </div>

            <div class="w-full aspect-video bg-zinc-200 mb-16 flex items-center justify-center overflow-hidden relative">
                <span class="text-[10vw] font-black text-zinc-300 opacity-50 select-none">PROJECT IMG</span>
                <div class="absolute inset-0 bg-black/5"></div>
            </div>

            <div class="grid md:grid-cols-12 gap-12">
                <div class="md:col-span-4 space-y-8">
                    <div>
                        <h3 class="text-xs font-bold tracking-widest border-b border-black pb-2 mb-4">TECHNOLOGY</h3>
                        <p class="text-lg font-bold font-mono">${project.tech}</p>
                    </div>
                    <div>
                        <h3 class="text-xs font-bold tracking-widest border-b border-black pb-2 mb-4">ROLE</h3>
                        <p class="text-lg font-bold">Design / Development</p>
                    </div>
                </div>
                <div class="md:col-span-8">
                    <h3 class="text-xs font-bold tracking-widest border-b border-black pb-2 mb-6">DESCRIPTION</h3>
                    <p class="text-xl md:text-2xl font-medium leading-relaxed whitespace-pre-line">
                        ${project.fullDesc || project.desc}
                    </p>
                </div>
            </div>
        </div>
    `;

    // Update Next Link
    document.getElementById('next-project-title').textContent = nextProject.title;

    // Switch View
    document.getElementById('main-view').classList.add('hidden');
    document.getElementById('detail-view').classList.remove('hidden');
    window.scrollTo(0, 0);
    lucide.createIcons();
}

function handleBackToHome() {
    currentProjectId = null;
    document.getElementById('detail-view').classList.add('hidden');
    document.getElementById('main-view').classList.remove('hidden');

    // Optional: scroll back to project list position
    const projectsEl = document.getElementById('projects');
    if (projectsEl) projectsEl.scrollIntoView({ behavior: 'auto' });
}

function handleNextProject() {
    if (!currentProjectId) return;
    const currentIndex = PROJECTS.findIndex(p => p.id === currentProjectId);
    const nextIndex = (currentIndex + 1) % PROJECTS.length;
    handleProjectClick(PROJECTS[nextIndex].id);
}

function smoothScroll(e, targetId) {
    e.preventDefault();
    if (currentProjectId) {
        handleBackToHome();
        setTimeout(() => {
            const el = document.getElementById(targetId);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    } else {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
}

// --- Scroll Observer ---

function initScrollObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('opacity-0', 'translate-y-8');
                entry.target.classList.add('opacity-100', 'translate-y-0');
            }
        });
    }, { threshold: 0.1 });

    // Observe initial elements (in HTML)
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    // Also observe dynamically generated project items after a slight delay
    setTimeout(() => {
        document.querySelectorAll('#projects-container .animate-on-scroll').forEach(el => observer.observe(el));
    }, 100);
}

// --- Canvas Particles ---

function initCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    };

    const initParticles = () => {
        particles = [];
        const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 15000);

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.3 + 0.1
            });
        }
    };

    const drawParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 0, 0, ${p.opacity})`;
            ctx.fill();
        });

        requestAnimationFrame(drawParticles);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    drawParticles();
}