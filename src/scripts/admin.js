// --- Admin Panel Logic ---

let authToken = localStorage.getItem('admin_token') || null;
let currentTab = 'history';
let currentData = { history: [], skills: [], projects: [], topics: [] };
let editIndex = null; // null = add mode, number = edit mode
let deleteIndex = null;

// --- Field Definitions ---
const FIELDS = {
    history: [
        { key: 'year', label: 'Year', type: 'text', placeholder: '2026' },
        { key: 'title', label: 'Title', type: 'text', placeholder: 'Event Title' },
        { key: 'sub', label: 'Subtitle', type: 'text', placeholder: 'Additional info' },
        { key: 'desc', label: 'Description', type: 'textarea', placeholder: '詳細説明...' },
    ],
    skills: [
        { key: 'name', label: 'Name', type: 'text', placeholder: 'TypeScript' },
        { key: 'type', label: 'Type', type: 'select', options: [
            { value: 'LANG', label: 'Language' },
            { value: 'FRAMEWORK', label: 'Framework' },
            { value: 'AI', label: 'AI / Science' },
            { value: 'INFRA', label: 'Infrastructure' },
            { value: 'TOOL', label: 'Tool' },
        ]},
        { key: 'info', label: 'Info', type: 'textarea', placeholder: '説明...' },
    ],
    projects: [
        { key: 'id', label: 'ID', type: 'text', placeholder: '05' },
        { key: 'title', label: 'Title', type: 'text', placeholder: 'Project Title' },
        { key: 'category', label: 'Category', type: 'text', placeholder: 'DeepLearning' },
        { key: 'desc', label: 'Short Description', type: 'text', placeholder: '短い説明...' },
        { key: 'tech', label: 'Technology', type: 'text', placeholder: 'Python, PyTorch' },
        { key: 'fullDesc', label: 'Full Description', type: 'textarea', placeholder: '詳細説明...' },
        { key: 'year', label: 'Year', type: 'text', placeholder: '2026' },
        { key: 'github', label: 'GitHub URL', type: 'text', placeholder: 'https://github.com/...' },
        { key: 'HuggingFace', label: 'HuggingFace URL', type: 'text', placeholder: 'https://huggingface.co/...' },
        { key: 'GoogleColab', label: 'Google Colab URL', type: 'text', placeholder: 'https://colab.research.google.com/...' },
        { key: 'images', label: 'Images (Upload or path)', type: 'image_list' },
    ],
    topics: [
        { key: 'title', label: 'Title', type: 'text', placeholder: 'Topic Title' },
        { key: 'image', label: 'Image', type: 'image_single' },
        { key: 'tag', label: 'Tag', type: 'text', placeholder: 'AI / Work / Hackathon' },
        { key: 'date', label: 'Date', type: 'text', placeholder: '2026-01' },
    ],
};

const SECTION_TITLES = {
    history: 'History',
    skills: 'Skills',
    projects: 'Projects',
    topics: 'Topics',
};

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Check if already logged in
    if (authToken) {
        showDashboard();
    }

    // Login form
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const password = document.getElementById('login-password').value;
        await handleLogin(password);
    });

    // Modal form
    document.getElementById('modal-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleSave();
    });
});

// --- Auth ---
async function handleLogin(password) {
    try {
        const res = await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        });
        const data = await res.json();

        if (res.ok) {
            authToken = data.token;
            localStorage.setItem('admin_token', authToken);
            document.getElementById('login-error').classList.add('hidden');
            showDashboard();
        } else {
            document.getElementById('login-error').classList.remove('hidden');
        }
    } catch (e) {
        document.getElementById('login-error').classList.remove('hidden');
    }
}

function handleLogout() {
    authToken = null;
    localStorage.removeItem('admin_token');
    document.getElementById('admin-dashboard').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('login-password').value = '';
}

// --- Dashboard ---
async function showDashboard() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('admin-dashboard').classList.remove('hidden');
    await loadAllData();
    renderList();
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

async function loadAllData() {
    try {
        const [historyRes, skillsRes, projectsRes, topicsRes] = await Promise.all([
            fetch('/api/history'),
            fetch('/api/skills'),
            fetch('/api/projects'),
            fetch('/api/topics'),
        ]);
        currentData.history = await historyRes.json();
        currentData.skills = await skillsRes.json();
        currentData.projects = await projectsRes.json();
        currentData.topics = await topicsRes.json();
    } catch (e) {
        showToast('データ読み込みに失敗しました', 'error');
    }
}

// --- Tab Switching ---
function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.admin-tab').forEach(t => {
        t.classList.remove('active');
        t.style.borderBottomColor = 'transparent';
        t.style.color = '#a1a1aa';
    });
    const activeTab = document.getElementById(`tab-${tab}`);
    activeTab.classList.add('active');
    activeTab.style.borderBottomColor = '#000';
    activeTab.style.color = '#000';

    document.getElementById('section-title').textContent = SECTION_TITLES[tab];
    renderList();
}

// --- Render List ---
function renderList() {
    const container = document.getElementById('data-list');
    const items = currentData[currentTab] || [];

    if (items.length === 0) {
        container.innerHTML = `
            <div class="text-center py-16 text-zinc-400">
                <p class="text-sm font-bold tracking-widest mb-2">データがありません</p>
                <p class="text-xs">「新規追加」で最初のデータを追加してください</p>
            </div>
        `;
        return;
    }

    container.innerHTML = items.map((item, index) => {
        let primaryText = '';
        let secondaryText = '';

        if (currentTab === 'history') {
            primaryText = `<span class="font-mono text-xs text-zinc-400 mr-3">${item.year}</span>${item.title}`;
            secondaryText = item.sub || '';
        } else if (currentTab === 'skills') {
            primaryText = item.name;
            secondaryText = `<span class="px-2 py-0.5 bg-zinc-100 text-[10px] font-bold tracking-wider">${item.type}</span>`;
        } else if (currentTab === 'projects') {
            primaryText = `<span class="font-mono text-xs text-zinc-400 mr-3">${item.id}</span>${item.title}`;
            secondaryText = item.category;
        } else if (currentTab === 'topics') {
            primaryText = item.title;
            secondaryText = item.tag;
        }

        return `
            <div class="admin-card">
                <div class="flex-1 min-w-0">
                    <div class="font-bold text-sm truncate">${primaryText}</div>
                    <div class="text-xs text-zinc-500 mt-0.5">${secondaryText}</div>
                </div>
                <div class="admin-card-actions">
                    <button onclick="handleEdit(${index})" class="admin-btn-icon" title="編集">
                        <i data-lucide="pencil" class="w-4 h-4"></i>
                    </button>
                    <button onclick="handleDelete(${index})" class="admin-btn-icon delete" title="削除">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// --- Add / Edit ---
function handleAdd() {
    editIndex = null;
    document.getElementById('modal-title').textContent = '新規追加';
    renderFormFields({});
    openModal();
}

function handleEdit(index) {
    editIndex = index;
    document.getElementById('modal-title').textContent = '編集';
    const item = currentData[currentTab][index];
    renderFormFields(item);
    openModal();
}

function renderFormFields(item) {
    const fields = FIELDS[currentTab];
    const container = document.getElementById('modal-fields');

    container.innerHTML = fields.map(field => {
        let value = item[field.key] || '';

        if (field.type === 'image_list') {
            const imageArray = Array.isArray(value) ? value : (value ? value.split(',').map(s => s.trim()) : []);
            return `
                <div>
                    <label class="admin-label">${field.label}</label>
                    <div id="image-preview-container" class="grid grid-cols-3 gap-2 mb-2">
                        ${imageArray.map((img, i) => `
                            <div class="relative aspect-square border border-zinc-200 bg-zinc-50 group">
                                <img src="${img.startsWith('http') || img.startsWith('/') ? img : '/' + img}" class="w-full h-full object-cover" />
                                <button type="button" onclick="removeImage(${i})" class="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <i data-lucide="x" class="w-3 h-3"></i>
                                </button>
                                <input type="hidden" name="images_hidden" value="${img}" />
                            </div>
                        `).join('')}
                    </div>
                    <div class="flex gap-2">
                        <label class="flex-1 cursor-pointer bg-zinc-100 hover:bg-zinc-200 text-zinc-600 px-4 py-2 text-xs font-bold tracking-widest text-center transition-colors">
                            UPLOAD IMAGE
                            <input type="file" class="hidden" accept="image/*" onchange="uploadImage(this, 'list')" />
                        </label>
                    </div>
                </div>
            `;
        } else if (field.type === 'image_single') {
            const imgSrc = value ? (value.startsWith('http') || value.startsWith('/') ? value : '/' + value) : '';
            return `
                <div>
                    <label class="admin-label">${field.label}</label>
                    <div id="single-image-preview" class="mb-2 ${value ? '' : 'hidden'}">
                        <div class="relative aspect-video max-h-40 border border-zinc-200 bg-zinc-50 group inline-block">
                            <img src="${imgSrc}" class="h-full object-contain" />
                            <button type="button" onclick="removeSingleImage()" class="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                <i data-lucide="x" class="w-3 h-3"></i>
                            </button>
                        </div>
                    </div>
                    <input type="hidden" id="single-image-input" name="image_single_hidden" value="${value}" />
                    <div class="flex gap-2">
                        <label class="flex-1 cursor-pointer bg-zinc-100 hover:bg-zinc-200 text-zinc-600 px-4 py-2 text-xs font-bold tracking-widest text-center transition-colors">
                            ${value ? 'CHANGE IMAGE' : 'UPLOAD IMAGE'}
                            <input type="file" class="hidden" accept="image/*" onchange="uploadImage(this, 'single')" />
                        </label>
                    </div>
                </div>
            `;
        } else if (field.type === 'textarea') {
            return `
                <div>
                    <label class="admin-label">${field.label}</label>
                    <textarea name="${field.key}" class="admin-input" placeholder="${field.placeholder || ''}">${value}</textarea>
                </div>
            `;
        } else if (field.type === 'select') {
            return `
                <div>
                    <label class="admin-label">${field.label}</label>
                    <select name="${field.key}" class="admin-input">
                        ${field.options.map(opt => `
                            <option value="${opt.value}" ${value === opt.value ? 'selected' : ''}>${opt.label}</option>
                        `).join('')}
                    </select>
                </div>
            `;
        } else {
            return `
                <div>
                    <label class="admin-label">${field.key === 'id' && currentTab === 'projects' ? 'ID (例: 05)' : field.label}</label>
                    <input type="text" name="${field.key}" class="admin-input" value="${value}" placeholder="${field.placeholder || ''}" />
                </div>
            `;
        }
    }).join('');
    
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

async function uploadImage(input, mode = 'list') {
    if (!input.files || !input.files[0]) return;
    
    const file = input.files[0];
    const formData = new FormData();
    formData.append('file', file);
    
    showToast('アップロード中...', 'info');
    
    try {
        const res = await fetch('/api/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
            body: formData
        });
        
        if (res.ok) {
            const data = await res.json();
            
            if (mode === 'list') {
                const container = document.getElementById('image-preview-container');
                const div = document.createElement('div');
                div.className = 'relative aspect-square border border-zinc-200 bg-zinc-50 group';
                div.innerHTML = `
                    <img src="${data.url}" class="w-full h-full object-cover" />
                    <button type="button" onclick="this.parentElement.remove()" class="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <i data-lucide="x" class="w-3 h-3"></i>
                    </button>
                    <input type="hidden" name="images_hidden" value="${data.url}" />
                `;
                container.appendChild(div);
            } else {
                const preview = document.getElementById('single-image-preview');
                const input = document.getElementById('single-image-input');
                preview.innerHTML = `
                    <div class="relative aspect-video max-h-40 border border-zinc-200 bg-zinc-50 group inline-block">
                        <img src="${data.url}" class="h-full object-contain" />
                        <button type="button" onclick="removeSingleImage()" class="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <i data-lucide="x" class="w-3 h-3"></i>
                        </button>
                    </div>
                `;
                preview.classList.remove('hidden');
                input.value = data.url;
            }
            
            if (typeof lucide !== 'undefined') lucide.createIcons();
            showToast('アップロード完了', 'success');
        } else {
            showToast('アップロードに失敗しました', 'error');
        }
    } catch (e) {
        showToast('通信エラーが発生しました', 'error');
    }
}

function removeSingleImage() {
    const preview = document.getElementById('single-image-preview');
    const input = document.getElementById('single-image-input');
    preview.classList.add('hidden');
    preview.innerHTML = '';
    input.value = '';
}

function removeImage(index) {
    const container = document.getElementById('image-preview-container');
    const items = container.querySelectorAll('.relative');
    if (items[index]) {
        items[index].remove();
    }
}

async function handleSave() {
    const form = document.getElementById('modal-form');
    const formData = new FormData(form);
    const fields = FIELDS[currentTab];
    const item = {};

    fields.forEach(field => {
        if (field.type === 'image_list') {
            const images = [];
            form.querySelectorAll('input[name="images_hidden"]').forEach(input => {
                let path = input.value;
                if (path.startsWith('/')) path = path.substring(1);
                images.push(path);
            });
            item[field.key] = images;
        } else if (field.type === 'image_single') {
            const input = form.querySelector('input[name="image_single_hidden"]');
            let path = input ? input.value : '';
            if (path.startsWith('/')) path = path.substring(1);
            item[field.key] = path;
        } else {
            item[field.key] = formData.get(field.key) || '';
        }
    });

    try {
        const url = `/api/${currentTab}`;
        const isEdit = editIndex !== null;

        const res = await fetch(url, {
            method: isEdit ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: isEdit
                ? JSON.stringify({ index: editIndex, item })
                : JSON.stringify(item),
        });

        if (res.status === 401) {
            showToast('認証エラー。再ログインしてください。', 'error');
            handleLogout();
            return;
        }

        if (res.ok) {
            currentData[currentTab] = await res.json();
            closeModal();
            renderList();
            showToast(isEdit ? '更新しました' : '追加しました', 'success');
        } else {
            showToast('保存に失敗しました', 'error');
        }
    } catch (e) {
        showToast('通信エラーが発生しました', 'error');
    }
}

// --- Delete ---
function handleDelete(index) {
    deleteIndex = index;
    document.getElementById('delete-overlay').classList.remove('hidden');
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

async function confirmDelete() {
    if (deleteIndex === null) return;

    try {
        const res = await fetch(`/api/${currentTab}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify({ index: deleteIndex }),
        });

        if (res.status === 401) {
            showToast('認証エラー。再ログインしてください。', 'error');
            handleLogout();
            return;
        }

        if (res.ok) {
            currentData[currentTab] = await res.json();
            closeDeleteModal();
            renderList();
            showToast('削除しました', 'success');
        } else {
            showToast('削除に失敗しました', 'error');
        }
    } catch (e) {
        showToast('通信エラーが発生しました', 'error');
    }
}

function closeDeleteModal() {
    document.getElementById('delete-overlay').classList.add('hidden');
    deleteIndex = null;
}

// --- Modal ---
function openModal() {
    document.getElementById('modal-overlay').classList.remove('hidden');
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
    editIndex = null;
}

// --- Toast ---
function showToast(message, type = 'success') {
    // Remove existing toast
    const existing = document.querySelector('.admin-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `admin-toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
