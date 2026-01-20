// --- Data ---
const HISTORY = [
    { year: "2025", title: "Deep Learning Contest", sub: "1st Round Passed", desc: "1次審査を突破。" },
    { year: "2025", title: "Deep Learning Contest", sub: "Team Project", desc: "3人チームのAIエンジニアとして参加。モデル選定から実装までを主導し、実践的な開発知見を獲得。（Project 04参照）" },
    { year: "2025", title: "Started Learning", sub: "React / Next.js / TypeScript", desc: "モダンフロントエンド技術の習得を始める。" },
    { year: "2025", title: "Matsuo Lab", sub: "DL Fundamentals", desc: "東京大学 松尾・岩澤研究室主催 DL基礎講座修了。CNN, Transformer等のアーキテクチャおよび実装技術を習得。" },
    { year: "2025", title: "Study Abroad", sub: "New Zealand", desc: "ニュージーランド短期留学。現地での工学研修を通じ、技術英語とコミュニケーション能力を向上。" },
    { year: "2024", title: "HACK U", sub: "Team Project", desc: "LINEヤフー主催ハッカソン参加。チームで開閉監視可能なスマートキーを開発。私はPythonでDiscord Botを作成し、スマートキーとのリアルタイム通信基盤を構築。" },
    { year: "2024", title: "Started Learning", sub: "Python / Go", desc: "バックエンド開発やAI技術への関心を広げ、PythonとGoの学習を開始。" },
    { year: "2024", title: "Informatics Intelligence Course", sub: "Advancement", desc: "知能情報コース進学。情報工学およびAI・データサイエンス分野を専攻。" },
    { year: "2023", title: "OMU College of Technology", sub: "Enrollment", desc: "大阪公立大学工業高等専門学校 入学。" },
];

const SKILLS = [
    { name: "TypeScript", type: "LANG" },
    { name: "Go", type: "LANG" },
    { name: "Python", type: "LANG" },
    { name: "C++", type: "LANG" },
    { name: "React / Next.js / React", type: "FRAMEWORK" },
    { name: "Deep Learning", type: "AI" },
    { name: "Docker", type: "INFRA" },
    { name: "Git / GitHub", type: "TOOL" },
    { name: "Hugging Face", type: "TOOL" },
];

const PROJECTS = [
    {
        id: "01",
        title: "Classify Season",
        category: "DeepLearning",
        desc: "文章の季節感を判断するAI",
        tech: "Python, TensorFlow, Flask",
        fullDesc: "任意の文章を入力し、その文章が持つ「季節感（春夏秋冬）」を確信度と共に判定するWebアプリケーションです。\n\n自然言語処理（NLP）技術を用い、季節語だけでなく文脈に含まれるニュアンスを学習させました。APIサーバーとしてFlaskを採用し、軽量なフロントエンドと連携させています。データの不足や不適による精度面の課題を抱えていますが、より多くのデータを用いて学習させることで改善を図ります。",
        year: "2025",
        HuggingFace: "https://huggingface.co/spaces/SHU-KOSEN/season/tree/main",
        GoogleColab: "https://colab.research.google.com/drive/1gwn5tZdAme4SkE4YPDazogSCeDBO9tOA?usp=sharing",
        images: ["image/season1.png", "image/season2.png", "image/season3.png"]
    },
    // {
    //     id: "02",
    //     title: "Teachable Calligraphy",
    //     category: "Robotics / EdTech",
    //     desc: "ロボット × AI で書道を学ぶシステム",
    //     tech: "Python, Dobot Magician, OpenCV",
    //     fullDesc: "「動的に書道を学ぶ」をコンセプトに開発した教育支援ロボットシステムです。\n\nDeepLearningによる文字認識と、ロボットアーム（Magician Lite）の制御を組み合わせ、ユーザーが書いた文字をリアルタイムで解析・添削、あるいはロボットが手本を書いて見せる機能を実現しました。（現在プロトタイプが稼働中。更なる精度向上のためシステム改善を続けています）",
    //     year: "2025",
    //     github: "https://github.com/shuei0609" // Dummy Link
    // },
    {
        id: "02",
        title: "MusToDo",
        category: "TypeScript / React",
        desc: "Reactを用いて作成したToDoアプリ",
        tech: "TypeScript, React, HTML, CSS",
        fullDesc: "ReactのHooks（useState, useEffect）等の基礎概念習得を目的に開発したToDoアプリです。\n部活動での楽曲進行管理という実用的な課題解決も兼ねており、実際の運用を想定したUI設計を行っています。",
        year: "2025",
        github: "https://github.com/SHUEI0609/MusToDo",
        images: ["image/Todo1.png", "image/Todo2.png", "image/Todo3.png"]
    },
    {
        id: "03",
        title: "My BLOG",
        category: "TypeScript / Next.js / Prisma",
        desc: "Next.jsを用いて作成した私のブログ",
        tech: "TypeScript, Next.js, Prisma",
        fullDesc: "Next.jsによるブログプラットフォーム構築プロジェクト。フロントエンドからバックエンドまでを一気通貫で開発するスキルを磨くために制作。 Next.jsのエコシステムを活用しつつ、Prismaを用いたデータベース連携や、APIのテスト駆動開発（httpYac）にも挑戦しています。現在は基本機能の実装に加え、自分好みの機能を拡張できるよう設計を見直しながら開発を進めています。",
        year: "2026",
        github: "https://github.com/shuei0609/next-blog-app",
        images: ["image/blog1.png", "image/blog2.png", "image/blog3.png", "image/blog4.png", "image/blog5.png", "image/blog6.png", "image/blog7.png", "image/blog8.png"]
    },
    {
        id: "04",
        title: "Distance AI",
        category: "DeepLearning",
        desc: "ResNet50を用いて撮影物から人の距離を推定するAI",
        tech: "Python, Deep Learning",
        fullDesc: "ResNet50を用いた回帰モデルで作成した距離推定AIです。最初にNYU Depth Datasetというデータセットを用いて学習させたのちに、自分たちで収集したDatasetでファインチューニングしています。1m以内であれば精度は出ますが1m以上は全く精度が出ません。",
        year: "2026",
        github: "https://github.com/SHUEI0609/Distance"
    },
];

// --- State ---
let currentProjectId = null;
let currentSlideIndex = 0;

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
    document.body.style.overflow = 'hidden';

    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 5) + 1;
        if (progress > 100) progress = 100;
        progressEl.textContent = `${progress}%`;

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.classList.add('loading-exit');
                document.body.style.overflow = '';
                document.body.classList.add('loaded');
            }, 200);
        }
    }, 30);
}

// --- Render Functions ---

function renderHistory() {
    const container = document.getElementById('history-list');
    container.innerHTML = HISTORY.map(h => `
        <div class="relative pl-8 group">
            <div class="absolute -left-[5px] top-1.5 w-2.5 h-2.5 bg-white border-2 border-zinc-300 rounded-full group-hover:border-black group-hover:bg-black transition-colors z-10"></div>
            
            <div class="grid md:grid-cols-4 gap-2 mb-2 items-baseline">
                <div class="md:col-span-1 font-mono text-xs font-bold text-zinc-400">${h.year}</div>
                <div class="md:col-span-3">
                    <h5 class="font-bold text-lg leading-tight">${h.title}</h5>
                    <div class="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">${h.sub ? h.sub : ''}</div>
                    <p class="text-sm text-zinc-600 leading-relaxed">${h.desc}</p>
                </div>
            </div>
        </div>
    `).join('');
}

function renderSkills() {
    const container = document.getElementById('skills-container');
    const categories = {
        'LANG': 'Languages',
        'FRAMEWORK': 'Frameworks',
        'AI': 'AI / Science',
        'INFRA': 'DevOps / Tools',
        'TOOL': 'DevOps / Tools'
    };

    const grouped = SKILLS.reduce((acc, skill) => {
        const type = (skill.type === 'TOOL') ? 'INFRA' : skill.type;
        (acc[type] = acc[type] || []).push(skill);
        return acc;
    }, {});

    const order = ['LANG', 'FRAMEWORK', 'AI', 'INFRA'];
    let html = '';

    order.forEach(type => {
        if (grouped[type]) {
            html += `
                <div class="grid md:grid-cols-4 gap-4 items-start group">
                    <div class="md:col-span-1 pt-1">
                        <h5 class="text-xs font-bold text-zinc-400 uppercase tracking-widest group-hover:text-black transition-colors">${categories[type]}</h5>
                    </div>
                    <div class="md:col-span-3 flex flex-wrap gap-2">
                        ${grouped[type].map(s => `
                            <span class="px-3 py-1 bg-zinc-50 text-sm font-bold text-zinc-700 border border-zinc-200 rounded-sm hover:border-black hover:bg-white transition-all cursor-default">
                                ${s.name}
                            </span>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    });

    container.innerHTML = html;
}

function renderProjects() {
    const container = document.getElementById('projects-container');
    container.innerHTML = PROJECTS.map((p, index) => {
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

            <div class="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                <div class="animate-marquee whitespace-nowrap flex items-center">
                    ${marqueeText}
                </div>
            </div>
        </div>
        `;
    }).join('');
    lucide.createIcons();
}

// --- Navigation & Interactions ---

function handleProjectClick(id) {
    currentProjectId = id;
    const project = PROJECTS.find(p => p.id === id);
    const nextIndex = (PROJECTS.findIndex(p => p.id === id) + 1) % PROJECTS.length;
    const nextProject = PROJECTS[nextIndex];

    const contentContainer = document.getElementById('detail-content');

    // GitHub Link Conditional Logic
    let githubLinkHtml = '';
    if (project.github) {
        githubLinkHtml = `
            <div>
                <h3 class="text-xs font-bold tracking-widest border-b border-black pb-2 mb-4">SOURCE</h3>
                <a href="${project.github}" target="_blank" class="inline-flex items-center gap-2 text-lg font-bold hover:underline">
                    <i data-lucide="github" class="w-5 h-5"></i>
                    View on GitHub
                </a>
            </div>
        `;
    }

    // Hugging Face Link Conditional Logic
    let huggingFaceLinkHtml = '';
    if (project.HuggingFace) {
        huggingFaceLinkHtml = `
            <div>
                <h3 class="text-xs font-bold tracking-widest border-b border-black pb-2 mb-4">HuggingFace</h3>
                <a href="${project.HuggingFace}" target="_blank" class="inline-flex items-center gap-2 text-lg font-bold hover:underline">
                    <i data-lucide="bot" class="w-5 h-5"></i>
                    View on HuggingFace
                </a>
            </div>
        `;
    }

    // Google Colab Link Conditional Logic
    let googleColabLinkHtml = '';
    if (project.GoogleColab) {
        googleColabLinkHtml = `
            <div>
                <h3 class="text-xs font-bold tracking-widest border-b border-black pb-2 mb-4">Colab</h3>
                <a href="${project.GoogleColab}" target="_blank" class="inline-flex items-center gap-2 text-lg font-bold hover:underline">
                    <i data-lucide="file-code-2" class="w-5 h-5"></i>
                    View on Colab
                </a>
            </div>
        `;
    }

    // Image Slider Logic
    let imageSectionHtml = '';
    if (project.images && project.images.length > 0) {
        currentSlideIndex = 0;
        const slidesHtml = project.images.map((img, i) => `
            <div class="min-w-full h-full relative flex items-center justify-center bg-zinc-100 p-8 md:p-12">
                <img src="${img}" class="h-full w-auto object-contain max-h-full drop-shadow-2xl border-[8px] border-white bg-white" alt="${project.title} Image ${i + 1}">
            </div>
        `).join('');

        imageSectionHtml = `
            <div class="w-full aspect-video bg-zinc-200 mb-16 relative group overflow-hidden border border-zinc-200">
                <div id="slider-track" class="flex h-full transition-transform duration-500 ease-in-out">
                    ${slidesHtml}
                </div>
                
                <!-- Navigation Arrows -->
                <button onclick="changeSlide(-1)" class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 text-white flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black">
                    <i data-lucide="chevron-left" class="w-6 h-6"></i>
                </button>
                <button onclick="changeSlide(1)" class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 text-white flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black">
                    <i data-lucide="chevron-right" class="w-6 h-6"></i>
                </button>
                
                <!-- Indicators -->
                <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    ${project.images.map((_, i) => `
                        <div id="indicator-${i}" class="w-2 h-2 rounded-full bg-white/50 transition-colors ${i === 0 ? 'bg-white' : ''}"></div>
                    `).join('')}
                </div>
            </div>
        `;
    } else {
        imageSectionHtml = `
            <div class="w-full aspect-video bg-zinc-200 mb-16 flex items-center justify-center overflow-hidden relative">
                <span class="text-[10vw] font-black text-zinc-300 opacity-50 select-none">PROJECT IMG</span>
                <div class="absolute inset-0 bg-black/5"></div>
            </div>
        `;
    }

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

            ${imageSectionHtml}

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
                    <!-- GitHub Link Section -->
                    ${githubLinkHtml}
                    <!-- Hugging Face Link Section -->
                    ${huggingFaceLinkHtml}
                    <!-- Google Colab Link Section -->
                    ${googleColabLinkHtml}
                </div>
                <div class="md:col-span-8">
                    <h3 class="text-xs font-bold tracking-widest border-b border-black pb-2 mb-6">DESCRIPTION</h3>
                    <p class="text-xl md:text-2xl font-medium leading-relaxed whitespace-pre-line text-justify-inter-character">
                        ${project.fullDesc || project.desc}
                    </p>
                </div>
            </div>
        </div>
    `;

    document.getElementById('next-project-title').textContent = nextProject.title;
    document.getElementById('main-view').classList.add('hidden');
    document.getElementById('detail-view').classList.remove('hidden');
    window.scrollTo(0, 0);
    lucide.createIcons();
}

function handleBackToHome() {
    currentProjectId = null;
    document.getElementById('detail-view').classList.add('hidden');
    document.getElementById('main-view').classList.remove('hidden');
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

function changeSlide(direction) {
    if (!currentProjectId) return;
    const project = PROJECTS.find(p => p.id === currentProjectId);
    if (!project || !project.images) return;

    currentSlideIndex += direction;
    if (currentSlideIndex < 0) currentSlideIndex = project.images.length - 1;
    if (currentSlideIndex >= project.images.length) currentSlideIndex = 0;

    const track = document.getElementById('slider-track');
    if (track) {
        track.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    }

    // Update Indicators
    project.images.forEach((_, i) => {
        const indicator = document.getElementById(`indicator-${i}`);
        if (indicator) {
            if (i === currentSlideIndex) {
                indicator.classList.remove('bg-white/50');
                indicator.classList.add('bg-white');
            } else {
                indicator.classList.remove('bg-white');
                indicator.classList.add('bg-white/50');
            }
        }
    });
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

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    setTimeout(() => {
        document.querySelectorAll('#projects-container .animate-on-scroll').forEach(el => observer.observe(el));
    }, 100);
}

// --- Canvas ---
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