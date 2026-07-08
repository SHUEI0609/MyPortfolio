// --- Data ---
let HISTORY = [];
let SKILLS = [];
let PROJECTS = [];
let TOPICS = [];
let MINDMAP = [];
let ABOUT = [];

// --- State ---
let currentProjectId = null;
let currentSlideIndex = 0;
let aboutPhotoIndex = 0;
let projectPage = 1;
const projectsPerPage = 5;
const heroMindmapHiddenQuery = '(max-width: 1023px), (pointer: coarse) and (max-width: 1366px)';

function shouldRenderHeroMindmap() {
    return !window.matchMedia(heroMindmapHiddenQuery).matches;
}

// --- Data Loading ---
async function loadData() {
    try {
        const [historyRes, skillsRes, projectsRes, topicsRes, mindmapRes, aboutRes] = await Promise.all([
            fetch('/api/history'),
            fetch('/api/skills'),
            fetch('/api/projects'),
            fetch('/api/topics'),
            fetch('/api/mindmap'),
            fetch('/api/about'),
        ]);

        if (!historyRes.ok || !skillsRes.ok || !projectsRes.ok || !topicsRes.ok || !mindmapRes.ok || !aboutRes.ok) {
            throw new Error('One or more API responses were not OK');
        }

        HISTORY = await historyRes.json();
        SKILLS = await skillsRes.json();
        PROJECTS = await projectsRes.json();
        TOPICS = await topicsRes.json();
        MINDMAP = await mindmapRes.json();
        ABOUT = await aboutRes.json();
    } catch (e) {
        console.error('Failed to load data from API:', e);
        showErrorBanner('データの読み込みに失敗しました。ページを再読み込みしてください。');
        HISTORY = [];
        SKILLS = [];
        PROJECTS = [];
        TOPICS = [];
        MINDMAP = [];
        ABOUT = [];
    }
}

// --- Error Banner ---
function showErrorBanner(message) {
    const existing = document.getElementById('error-banner');
    if (existing) return;
    const banner = document.createElement('div');
    banner.id = 'error-banner';
    banner.setAttribute('role', 'alert');
    banner.style.cssText = `
        position: fixed; bottom: 1.5rem; left: 50%; transform: translateX(-50%);
        background: #111; color: #fff; padding: 0.75rem 1.5rem;
        font-size: 0.8rem; font-weight: 700; letter-spacing: 0.05em;
        border: 1px solid #333; z-index: 9999; max-width: 90vw; text-align: center;
    `;
    banner.textContent = message;
    document.body.appendChild(banner);
    setTimeout(() => banner.remove(), 6000);
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', async () => {
    lucide.createIcons();
    initLoading();
    initCanvas();
    await loadData();
    renderHistory();
    renderAbout();
    renderSkills();
    renderTopics();
    renderProjects();
    renderHeroMindmap();
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
    if (!container) return;
    container.innerHTML = HISTORY.map(h => `
        <div class="relative pl-8 group" role="listitem">
            <div class="absolute -left-[5px] top-1.5 w-2.5 h-2.5 bg-white border-2 border-zinc-300 rounded-full group-hover:border-black group-hover:bg-black transition-colors z-10"></div>
            
            <div class="grid md:grid-cols-4 gap-2 mb-2 items-baseline">
                <div class="md:col-span-1 font-mono text-xs font-bold text-zinc-600">${h.year}</div>
                <div class="md:col-span-3">
                    <h4 class="font-bold text-lg leading-tight">${h.title}</h4>
                    <div class="text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">${h.sub ? h.sub : ''}</div>
                    <p class="text-sm text-zinc-600 leading-relaxed">${h.desc}</p>
                </div>
            </div>
        </div>
    `).join('');
}

function renderAbout() {
    const profile = Array.isArray(ABOUT) ? ABOUT[0] : ABOUT;
    if (!profile) return;

    const setText = (id, value) => {
        const element = document.getElementById(id);
        if (element && value) element.textContent = value;
    };

    setText('about-name', profile.name);
    setText('about-age', profile.age);
    setText('about-location', profile.location);
    setText('about-role', profile.role);
    setText('about-focus', profile.focus);

    const affiliations = Array.isArray(profile.affiliations)
        ? profile.affiliations
        : String(profile.affiliations || '').split('\n');
    const list = document.getElementById('about-affiliations');
    if (list && affiliations.length > 0) {
        list.innerHTML = affiliations
            .map(item => item.trim())
            .filter(Boolean)
            .map(item => `<li>${escapeHtml(item)}</li>`)
            .join('');
    }
}

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function renderSkills() {
    const container = document.getElementById('skills-container');
    if (!container) return;
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
                <div class="grid md:grid-cols-4 gap-4 items-start group" role="listitem">
                    <div class="md:col-span-1 pt-1">
                        <div class="text-xs font-bold text-zinc-600 uppercase tracking-widest group-hover:text-black transition-colors">${categories[type]}</div>
                    </div>
                    <div class="md:col-span-3 flex flex-wrap gap-2" role="list" aria-label="${categories[type]}">
                        ${grouped[type].map(s => `
                            <div class="relative group/skill cursor-help" role="listitem">
                                <span class="px-3 py-1 bg-zinc-50 text-sm font-bold text-zinc-700 border border-zinc-200 rounded-sm group-hover/skill:border-black group-hover/skill:bg-white transition-all block">
                                    ${s.name}
                                </span>
                                <!-- Tooltip -->
                                <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] px-3 py-2 bg-black text-white text-xs rounded opacity-0 invisible group-hover/skill:opacity-100 group-hover/skill:visible transition-all duration-300 z-20 pointer-events-none text-center after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-black">
                                    ${s.info}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    });

    container.innerHTML = html;
}

function renderTopics() {
    const track1 = document.getElementById('topics-track-1');
    const track2 = document.getElementById('topics-track-2');
    const countEl = document.getElementById('topics-count');

    if (!track1 || TOPICS.length === 0) return;

    if (countEl) {
        countEl.textContent = `${String(TOPICS.length).padStart(2, '0')} entries`;
        countEl.classList.remove('hidden');
    }

    const buildCard = (t) => {
        const rawImg = t.image && t.image.trim() !== '' ? t.image.trim() : null;
        const imgSrc = rawImg
            ? (rawImg.startsWith('http') || rawImg.startsWith('/') ? rawImg : `/${rawImg}`)
            : null;

        if (imgSrc) {
            return `<div class="topic-card topic-card--image" data-tag="${t.tag}" role="listitem">
                <div class="topic-card-bg" style="background-image:url('${imgSrc}')" role="img" aria-label="${t.title}の画像"></div>
                <div class="topic-card-overlay"></div>
                <div class="topic-card-content">
                    <div class="topic-card-meta">
                        <span class="topic-tag-badge">${t.tag}</span>
                        <span class="topic-date"><time datetime="${t.date}">${t.date}</time></span>
                    </div>
                    <h3 class="topic-title">${t.title}</h3>
                </div>
            </div>`;
        } else {
            const initial = t.tag ? t.tag.charAt(0).toUpperCase() : '#';
            return `<div class="topic-card topic-card--text" data-tag="${t.tag}" role="listitem">
                <div class="topic-card-initial" aria-hidden="true">${initial}</div>
                <div class="topic-card-content">
                    <div class="topic-card-meta">
                        <span class="topic-tag-badge">${t.tag}</span>
                        <span class="topic-date"><time datetime="${t.date}">${t.date}</time></span>
                    </div>
                    <h3 class="topic-title">${t.title}</h3>
                </div>
            </div>`;
        }
    };

    const forward = TOPICS.map(buildCard).join('');
    track1.innerHTML = forward + forward;
}

function renderHeroMindmap() {
    const container = document.getElementById('hero-mindmap');
    if (!container) return;
    if (!shouldRenderHeroMindmap()) {
        container.innerHTML = '';
        return;
    }
    const rect = container.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) {
        container.innerHTML = '';
        return;
    }

    const items = Array.isArray(MINDMAP) ? MINDMAP.slice(0, 14).map((item, index) => ({
        ...item,
        id: item.id || `node-${index}`,
        parentId: item.parentId || '',
    })) : [];
    const roots = items.filter(item => !item.parentId);
    const positionMap = new Map();

    roots.forEach((item, index) => {
        const fallbackAngle = -135 + (index * (270 / Math.max(roots.length - 1, 1)));
        const angle = Number.isFinite(Number(item.angle)) ? Number(item.angle) : fallbackAngle;
        const distance = Number.isFinite(Number(item.distance)) ? Number(item.distance) : 42;
        const safeDistance = Math.max(38, Math.min(distance, 49));
        const radians = angle * Math.PI / 180;
        positionMap.set(item.id, {
            left: Math.max(14, Math.min(86, 50 + Math.cos(radians) * safeDistance)),
            top: Math.max(14, Math.min(86, 50 + Math.sin(radians) * safeDistance)),
            angle,
            depth: 0,
        });
    });

    const childrenByParent = items.reduce((acc, item) => {
        if (item.parentId) {
            if (!acc.has(item.parentId)) acc.set(item.parentId, []);
            acc.get(item.parentId).push(item);
        }
        return acc;
    }, new Map());

    const childCounts = new Map();

    items.filter(item => item.parentId).forEach((item) => {
        const parent = positionMap.get(item.parentId);
        if (!parent) return;
        const siblings = childrenByParent.get(item.parentId) || [];
        const count = childCounts.get(item.parentId) || 0;
        childCounts.set(item.parentId, count + 1);

        const parentFromCenter = Math.atan2(parent.top - 50, parent.left - 50) * 180 / Math.PI;
        const nearHorizontalEdge = parent.left < 28 || parent.left > 72;
        const nearVerticalEdge = parent.top < 28 || parent.top > 72;
        const edgeAngles = parent.left < 28
            ? [-120, 120, -60, 60, -150, 150]
            : parent.left > 72
                ? [-60, 60, -120, 120, -30, 30]
                : parent.top < 28
                    ? [160, 20, -160, -20, 120, 60]
                    : parent.top > 72
                        ? [-160, -20, 160, 20, -120, -60]
                        : null;
        const fanCenter = nearHorizontalEdge
            ? (parent.left < 50 ? 180 : 0)
            : nearVerticalEdge
                ? (parent.top < 50 ? -90 : 90)
                : parentFromCenter;
        const spread = Math.min(140, 52 + (siblings.length - 1) * 28);
        const step = siblings.length <= 1 ? 0 : spread / (siblings.length - 1);
        const fallbackAngle = edgeAngles
            ? edgeAngles[count % edgeAngles.length]
            : fanCenter - (spread / 2) + (count * step);
        const angle = item.angle !== '' && Number.isFinite(Number(item.angle)) ? Number(item.angle) : fallbackAngle;
        const distance = Number.isFinite(Number(item.distance)) ? Number(item.distance) : 28;
        const safeDistance = Math.max(24, Math.min(distance + (edgeAngles ? Math.floor(count / edgeAngles.length) * 7 : 0), 36));
        const radians = angle * Math.PI / 180;
        positionMap.set(item.id, {
            left: Math.max(12, Math.min(88, parent.left + Math.cos(radians) * safeDistance)),
            top: Math.max(12, Math.min(88, parent.top + Math.sin(radians) * safeDistance)),
            angle,
            depth: Math.min(parent.depth + 1, 2),
        });
    });

    const clamp = (min, value, max) => Math.max(min, Math.min(value, max));
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const viewportUnit = window.innerWidth / 100;
    const nodeSize = (depth) => {
        if (depth === 0) return clamp(5.5 * rootFontSize, 9 * viewportUnit, 7.25 * rootFontSize);
        if (depth === 1) return clamp(4.25 * rootFontSize, 6.1 * viewportUnit, 5.25 * rootFontSize);
        return clamp(3.75 * rootFontSize, 5.2 * viewportUnit, 4.55 * rootFontSize);
    };
    const centerCircleRadius = clamp(18 * rootFontSize, window.innerWidth * 0.34, 32 * rootFontSize) / 2;
    const layoutNodes = Array.from(positionMap.entries()).map(([id, position]) => {
        const size = nodeSize(position.depth);
        return {
            id,
            position,
            x: position.left * rect.width / 100,
            y: position.top * rect.height / 100,
            radius: (size / 2) + 18,
        };
    });
    const clampNode = (node) => {
        node.x = clamp(node.radius + 10, node.x, rect.width - node.radius - 10);
        node.y = clamp(node.radius + 10, node.y, rect.height - node.radius - 10);
    };
    const pushFromSignature = (node) => {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const dx = node.x - centerX;
        const dy = node.y - centerY;
        const distance = Math.hypot(dx, dy) || 1;
        const minimum = centerCircleRadius + node.radius + 18;
        if (distance >= minimum) return;
        node.x = centerX + (dx / distance) * minimum;
        node.y = centerY + (dy / distance) * minimum;
        clampNode(node);
    };

    layoutNodes.forEach((node) => {
        pushFromSignature(node);
        clampNode(node);
    });
    for (let iteration = 0; iteration < 56; iteration += 1) {
        layoutNodes.forEach(pushFromSignature);
        for (let i = 0; i < layoutNodes.length; i += 1) {
            for (let j = i + 1; j < layoutNodes.length; j += 1) {
                const a = layoutNodes[i];
                const b = layoutNodes[j];
                let dx = b.x - a.x;
                let dy = b.y - a.y;
                let distance = Math.hypot(dx, dy);
                const minimum = a.radius + b.radius + 14;
                if (distance >= minimum) continue;

                if (distance < 1) {
                    const fallbackAngle = ((i * 97) + (j * 53)) * Math.PI / 180;
                    dx = Math.cos(fallbackAngle);
                    dy = Math.sin(fallbackAngle);
                    distance = 1;
                }
                const push = (minimum - distance) / 2;
                const unitX = dx / distance;
                const unitY = dy / distance;
                a.x -= unitX * push;
                a.y -= unitY * push;
                b.x += unitX * push;
                b.y += unitY * push;
                clampNode(a);
                clampNode(b);
            }
        }
    }
    layoutNodes.forEach((node) => {
        pushFromSignature(node);
        clampNode(node);
        node.position.left = node.x * 100 / rect.width;
        node.position.top = node.y * 100 / rect.height;
    });

    const buildBranch = (item) => {
        const position = positionMap.get(item.id);
        if (!position) return '';
        const parent = item.parentId ? positionMap.get(item.parentId) : { left: 50, top: 50 };
        if (!parent) return '';

        const dxPercent = position.left - parent.left;
        const dyPercent = position.top - parent.top;
        const dxPixels = dxPercent * rect.width / 100;
        const dyPixels = dyPercent * rect.height / 100;
        const length = Math.hypot(dxPixels, dyPixels);
        if (!Number.isFinite(length) || length <= 1) return '';

        const angle = Math.atan2(dyPixels, dxPixels) * 180 / Math.PI;
        const trimStart = item.parentId ? 34 : Math.min(Math.max(rect.width * 0.17, 150), 270);
        const trimEnd = item.parentId ? 28 : 42;
        const visibleLength = Math.max(length - trimStart - trimEnd, 12);
        const startLeft = parent.left + (dxPercent * trimStart / length);
        const startTop = parent.top + (dyPercent * trimStart / length);

        return `<div class="hero-mindmap-branch" style="--branch-left: ${startLeft}%; --branch-top: ${startTop}%; --branch-angle: ${angle}deg; --branch-length: ${visibleLength}px"></div>`;
    };

    const buildNode = (item) => {
        const position = positionMap.get(item.id);
        if (!position) return '';

        return `
            <div class="hero-mindmap-node hero-mindmap-node--depth-${position.depth}" style="--node-left: ${position.left}%; --node-top: ${position.top}%">
                <div class="hero-mindmap-node-title">${escapeHtml(item.title)}</div>
                <div class="hero-mindmap-node-detail">${escapeHtml(item.detail)}</div>
            </div>
        `;
    };

    container.innerHTML = items.map(buildBranch).join('') + items.map(buildNode).join('');
}

function renderProjects() {
    const container = document.getElementById('projects-container');
    const pagination = document.getElementById('projects-pagination');
    const pageInfo = document.getElementById('project-page-info');
    const prevBtn = document.getElementById('prev-projects');
    const nextBtn = document.getElementById('next-projects');
    
    if (!container) return;

    const totalPages = Math.ceil(PROJECTS.length / projectsPerPage);
    if (projectPage > totalPages) projectPage = totalPages;
    if (projectPage < 1) projectPage = 1;

    const start = (projectPage - 1) * projectsPerPage;
    const end = start + projectsPerPage;
    const paginatedProjects = PROJECTS.slice(start, end);

    // Update UI
    if (pageInfo) pageInfo.textContent = `Page ${String(projectPage).padStart(2, '0')} / ${String(totalPages).padStart(2, '0')}`;
    if (prevBtn) prevBtn.disabled = projectPage === 1;
    if (nextBtn) nextBtn.disabled = projectPage === totalPages;
    if (pagination) {
        pagination.style.display = totalPages <= 1 ? 'none' : 'flex';
    }

    container.innerHTML = paginatedProjects.map((p, index) => {
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
            role="button"
            tabindex="0"
            aria-label="${p.title} の詳細を見る"
            onkeydown="if(event.key==='Enter'||event.key===' '){handleProjectClick('${p.id}')}"
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
                        VIEW WORK <i data-lucide="arrow-right" class="w-4 h-4" aria-hidden="true"></i>
                    </div>
                </div>
            </div>

            <div class="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100" aria-hidden="true">
                <div class="animate-marquee whitespace-nowrap flex items-center">
                    ${marqueeText}
                </div>
            </div>
        </div>
        `;
    }).join('');

    lucide.createIcons();

    // Re-observe new elements
    if (typeof initScrollObserver === 'function') initScrollObserver();
    
    // Setup listeners only once
    if (!prevBtn.dataset.listener) {
        prevBtn.addEventListener('click', () => {
            if (projectPage > 1) {
                projectPage--;
                renderProjects();
                document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
            }
        });
        prevBtn.dataset.listener = 'true';
    }
    if (!nextBtn.dataset.listener) {
        nextBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(PROJECTS.length / projectsPerPage);
            if (projectPage < totalPages) {
                projectPage++;
                renderProjects();
                document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
            }
        });
        nextBtn.dataset.listener = 'true';
    }
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
                <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-lg font-bold hover:underline">
                    <i data-lucide="github" class="w-5 h-5" aria-hidden="true"></i>
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
                <a href="${project.HuggingFace}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-lg font-bold hover:underline">
                    <i data-lucide="bot" class="w-5 h-5" aria-hidden="true"></i>
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
                <a href="${project.GoogleColab}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-lg font-bold hover:underline">
                    <i data-lucide="file-code-2" class="w-5 h-5" aria-hidden="true"></i>
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
                <img src="/${img}" class="h-full w-auto object-contain max-h-full drop-shadow-2xl border-[8px] border-white bg-white" alt="${project.title} スクリーンショット ${i + 1}枚目">
            </div>
        `).join('');

        imageSectionHtml = `
            <div class="w-full aspect-video bg-zinc-200 mb-16 relative group overflow-hidden border border-zinc-200" role="region" aria-label="${project.title} 画像スライダー">
                <div id="slider-track" class="flex h-full transition-transform duration-500 ease-in-out">
                    ${slidesHtml}
                </div>
                
                <!-- Navigation Arrows -->
                <button onclick="changeSlide(-1)" aria-label="前の画像" class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-black/60 text-white flex items-center justify-center rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black">
                    <i data-lucide="chevron-left" class="w-5 h-5" aria-hidden="true"></i>
                </button>
                <button onclick="changeSlide(1)" aria-label="次の画像" class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-black/60 text-white flex items-center justify-center rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black">
                    <i data-lucide="chevron-right" class="w-5 h-5" aria-hidden="true"></i>
                </button>
                
                <!-- Indicators -->
                <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2" role="tablist" aria-label="スライドインジケーター">
                    ${project.images.map((_, i) => `
                        <div id="indicator-${i}" role="tab" aria-label="${i + 1}枚目" aria-selected="${i === 0 ? 'true' : 'false'}" class="w-2 h-2 rounded-full bg-white/50 transition-colors ${i === 0 ? 'bg-white' : ''}"></div>
                    `).join('')}
                </div>
            </div>
        `;
    } else {
        imageSectionHtml = `
            <div class="w-full aspect-video bg-zinc-200 mb-16 flex items-center justify-center overflow-hidden relative">
                <span class="text-[10vw] font-black text-zinc-300 opacity-50 select-none" aria-hidden="true">PROJECT IMG</span>
                <div class="absolute inset-0 bg-black/5"></div>
            </div>
        `;
    }

    contentContainer.innerHTML = `
        <div class="container mx-auto px-6 border-t-2 border-black pt-8 mb-24">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
                <h1 class="text-4xl sm:text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.85] break-words">
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
                indicator.setAttribute('aria-selected', 'true');
            } else {
                indicator.classList.remove('bg-white');
                indicator.classList.add('bg-white/50');
                indicator.setAttribute('aria-selected', 'false');
            }
        }
    });
}

function setAboutPhoto(index) {
    const track = document.getElementById('about-photo-track');
    if (!track) return;

    const slideCount = track.children.length;
    if (slideCount === 0) return;

    aboutPhotoIndex = ((index % slideCount) + slideCount) % slideCount;
    track.style.transform = `translateX(-${aboutPhotoIndex * 100}%)`;

    for (let i = 0; i < slideCount; i++) {
        const indicator = document.getElementById(`about-photo-indicator-${i}`);
        if (!indicator) continue;

        const isActive = i === aboutPhotoIndex;
        indicator.classList.toggle('bg-white', isActive);
        indicator.classList.toggle('bg-white/50', !isActive);
        indicator.setAttribute('aria-current', String(isActive));
    }
}

function changeAboutPhoto(direction) {
    setAboutPhoto(aboutPhotoIndex + direction);
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

// --- Mobile Menu ---
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (!menu) return;
    const isOpen = !menu.classList.contains('translate-x-full');
    if (isOpen) {
        menu.classList.add('translate-x-full');
        document.body.style.overflow = '';
    } else {
        menu.classList.remove('translate-x-full');
        document.body.style.overflow = 'hidden';
    }
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
