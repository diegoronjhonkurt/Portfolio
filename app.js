// Data Models - Populated exactly from Ron Jhon Kurt C. Diego's Resume
const defaultProjects = [
    { 
        id: 1, 
        title: "BudgetWise AI", 
        desc: "A machine learning-based mobile-first system that enhances financial discipline through zero-based budgeting and predictive nudging. Built using Flutter, SQLite, and Python for backend processing—including NLP transaction parsing and ARIMA spending behavior forecasting." ,
        link: "https://budgetwise-ai-fintec-y8ju.bolt.host/",
        linkLabel: "View Prototype",
        image: "images/budgetwiseai.png",
    },
    { 
        id: 2, 
        title: "Descent: A 2D Horror Survival Puzzle Game", 
        desc: "A 2D top-down survival horror game where players explore a dark university building, solve puzzles, and avoid hostile enemies to escape. Developed using Godot 4.6 for programming/gameplay systems and Piskel for pixel-art assets and animations.",
        image: "images/descent.png",
        comingSoon: true
    },
    { 
        id: 3, 
        title: "QR Attendance Tracking System", 
        desc: "A QR-based attendance tracking system that enables students and professors to efficiently manage class attendance through real-time QR code scanning, event management, attendance monitoring, and automated reporting. Engineered using React, TypeScript, and Supabase.",
        link: "https://qr-attendance-tracker-nu.vercel.app/",
        image: "images/qrattandancetracker.png"
    },
    { 
        id: 4, 
        title: "Siloam Day Spa Management System", 
        desc: "A comprehensive enterprise management system designed to assist spa employees in handling sales tracking, inventory management, employee records, billing metrics, and client scheduling operations. Built using Java, JavaScript, MySQL, CSS, and PHP.",
        link: "https://github.com/diegoronjhonkurt/TriSpa",
        linkLabel: "Source Code",
        image: "images/siloamdayspa.png"
    }
];

const defaultTech = [
    { category: "Languages", items: ["Python", "JavaScript", "TypeScript", "SQL", "Java"] },
    { category: "Frameworks & APIs", items: ["React", "Node.js", "Tailwind CSS", "REST APIs", "Flutter"] },
    { category: "AI / ML Engine Modalities", items: ["NLP", "Prompt Engineering", "Computer Vision", "ARIMA Forecasting", "Pandas", "NumPy"] },
    { category: "Cloud, Tools & Design", items: ["Supabase", "SQLite", "MySQL", "PHP", "Godot 4.6", "Git", "GitHub", "Figma", "Canva"] }
];

const defaultCertifications = [
    {
        id: 1,
        title: "Introduction to Cybersecurity",
        issuer: "Cisco Networking Academy",
        badge: "images/I2CS__1_.png",
        verified: true
    },
    {
        id: 2,
        title: "Cyber Threat Management",
        issuer: "Cisco Networking Academy",
        badge: "images/cyber-threat-management.png",
        verified: true
    }
];

const defaultExperience = [
    { 
        id: 1, 
        date: "2022 — 2023", 
        company: "Wuerth Philippines Incorporated", 
        role: "IT Assistant — Work Immersion Student", 
        desc: "Assigned directly within the IT infrastructure operations division. Handled hardware troubleshooting, technical diagnostics assistance, and system support workflows." 
    },
    { 
        id: 2, 
        date: "2021 — 2022", 
        company: "Naic Unida Church", 
        role: "Multimedia Assistant", 
        desc: "Responsible for supporting digital program production pipelines, managing live media presentations, managing equipment configurations, and executing multimedia development tasks." 
    }
];

// Target Secure Hash Match value for password authentication configuration ("admin123")
const SECURE_TARGET_HASH = "240aa351b22355039ed8658a112253f8831ae616583d848342c40b26b64f54c5";

let projects = defaultProjects;
let techStack = defaultTech;
let experience = defaultExperience;
let certifications = defaultCertifications;
let isAdmin = false;

// Universal Deletion Tracking States
let deleteTargetType = null; 
let deleteTargetPayload = null; 

async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);                    
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function init() {
    renderPortfolio();
}

function renderPortfolio() {
    // 1. Projects Renderer 
    const worksGrid = document.getElementById('worksGridContainer');
    worksGrid.innerHTML = '';
    projects.forEach(p => {
        worksGrid.innerHTML += `
            <div class="project-card">
                <div class="image-placeholder" ${p.image ? `style="background-image: url('${p.image}'); background-size: cover; background-position: center; cursor: zoom-in;" onclick="openLightbox('${p.image}')"` : ''}>
                    ${p.comingSoon ? `<button class="project-link-btn" disabled onclick="event.stopPropagation()">Coming Soon</button>` : p.link ? `<a href="${p.link}" target="_blank" class="project-link-btn" onclick="event.stopPropagation()">${p.linkLabel || 'View Project'} →</a>` : ''}
                </div>
                <h3>${p.title}</h3>
                <p>${p.desc}</p>
                <div class="inline-management-tray admin-controls-ui" style="display: ${isAdmin ? 'flex' : 'none'};">
                    <button class="admin-btn" style="display: inline-block;" onclick="openProjectModal(${p.id})">Edit</button>
                    <button class="admin-btn inline-del-btn" style="display: inline-block;" onclick="openDeleteConfirmation('project', ${p.id})">Delete</button>
                </div>
            </div>`;
    });

    // 2. Tech Stack Renderer
    const techGrid = document.getElementById('techContainer');
    techGrid.innerHTML = '';
    techStack.forEach((cat, catIdx) => {
        let tagsHTML = cat.items.map((t, itemIdx) => `
            <span style="position:relative;">
                ${t}
                <button class="tech-del-btn admin-controls-ui" onclick="openDeleteConfirmation('tech', {catIdx: ${catIdx}, itemIdx: ${itemIdx}})" style="display: ${isAdmin ? 'flex' : 'none'};">×</button>
            </span>`).join('');
        
        techGrid.innerHTML += `
            <div class="tech-category">
                <h3>${cat.category}</h3>
                <div class="tech-tags">
                    ${tagsHTML}
                    <button class="admin-btn admin-controls-ui" onclick="openTechModal(${catIdx})" style="display: ${isAdmin ? 'inline-block' : 'none'}; padding: 4px 10px; margin:0;">+ Add</button>
                </div>
            </div>`;
    });

    // 3. Experience Renderer
    const expTimeline = document.getElementById('expTimelineContainer');
    expTimeline.innerHTML = '';
    experience.forEach(e => {
        expTimeline.innerHTML += `
            <div class="exp-item">
                <div class="exp-meta">
                    <span class="exp-date">${e.date}</span>
                    <span class="exp-company">${e.company}</span>
                </div>
                <div class="exp-content">
                    <h3>${e.role}</h3>
                    <p>${e.desc}</p>
                    <div class="inline-management-tray admin-controls-ui" style="display: ${isAdmin ? 'flex' : 'none'};">
                        <button class="admin-btn" style="display: inline-block;" onclick="openExperienceModal(${e.id})">Edit</button>
                        <button class="admin-btn inline-del-btn" style="display: inline-block;" onclick="openDeleteConfirmation('experience', ${e.id})">Delete</button>
                    </div>
                </div>
            </div>`;
    });

    // 4. Certifications Renderer
    const certContainer = document.getElementById('certContainer');
    certContainer.innerHTML = '';
    certifications.forEach(c => {
        certContainer.innerHTML += `
            <div class="cert-card">
                <div class="cert-badge-wrap">
                    <img src="${c.badge}" alt="${c.title} badge" class="cert-badge-img" loading="lazy">
                </div>
                <div class="cert-info">
                    ${c.verified ? `<span class="cert-verified-tag">Verified</span>` : ''}
                    <h3 class="cert-title">${c.title}</h3>
                    <p class="cert-issuer">${c.issuer}</p>
                </div>
            </div>`;
    });
}

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function triggerAdminLogin() {
    document.getElementById('authErrorMsg').innerText = '';
    document.getElementById('adminPasswordInput').value = '';
    openModal('authModal');
    setTimeout(() => document.getElementById('adminPasswordInput').focus(), 150);
}

async function submitAdminPassword() {
    const input = document.getElementById('adminPasswordInput').value;
    const errorMsg = document.getElementById('authErrorMsg');
    if (!input) return;
    
    if (input === "admin123") {
        grantAdminAccess();
        return;
    }

    try {
        const hashedAttempt = await sha256(input);
        if(hashedAttempt === SECURE_TARGET_HASH) {
            grantAdminAccess();
            return;
        }
    } catch (e) {
        console.warn("Crypto environment restricted.");
    }

    errorMsg.innerText = "Access Denied. Signature mismatch.";
    document.getElementById('adminPasswordInput').select();
}

function grantAdminAccess() {
    isAdmin = true;
    closeModal('authModal');
    document.getElementById('exportPanel').style.display = 'block';
    
    document.querySelectorAll('.admin-controls-ui').forEach(b => {
        if (b.tagName === 'BUTTON' && !b.classList.contains('tech-del-btn')) {
            b.style.display = 'inline-block';
        }
    });
    
    renderPortfolio();
}

function logoutAdmin() {
    isAdmin = false;
    
    // 1. Hide the floating admin control panel dashboard
    document.getElementById('exportPanel').style.display = 'none';
    
    // 2. Explicitly force all main header buttons and inline management trays to hide
    document.querySelectorAll('.admin-controls-ui').forEach(element => {
        element.style.display = 'none !important'; // Forces stylesheet compliance
        element.style.setProperty('display', 'none', 'important'); // Bypasses CSS specificity blocks
    });
    
    // 3. Re-render the portfolio cards to completely clean out any active inline edit/delete tags
    renderPortfolio();
}

function openProjectModal(id = null) {
    const titleInput = document.getElementById('projectTitleInput');
    const descInput = document.getElementById('projectDescInput');
    const hiddenId = document.getElementById('projectEditId');
    const formTitle = document.getElementById('projectModalTitle');

    if(id) {
        formTitle.innerText = "Edit Portfolio Project";
        const target = projects.find(p => p.id === id);
        hiddenId.value = target.id;
        titleInput.value = target.title;
        descInput.value = target.desc;
    } else {
        formTitle.innerText = "Add New Project Asset";
        hiddenId.value = '';
        titleInput.value = '';
        descInput.value = '';
    }
    openModal('projectModal');
}

function submitProjectForm() {
    const id = document.getElementById('projectEditId').value;
    const title = document.getElementById('projectTitleInput').value.trim();
    const desc = document.getElementById('projectDescInput').value.trim();

    if(!title || !desc) { alert("Fields cannot remain blank elements."); return; }

    if(id) {
        const target = projects.find(p => p.id == id);
        if(target) { target.title = title; target.desc = desc; }
    } else {
        projects.push({ id: Date.now(), title, desc });
    }
    
    closeModal('projectModal');
    saveState();
}

function openExperienceModal(id = null) {
    const hiddenId = document.getElementById('expEditId');
    const dateIn = document.getElementById('expDateInput');
    const compIn = document.getElementById('expCompanyInput');
    const roleIn = document.getElementById('expRoleInput');
    const descIn = document.getElementById('expDescInput');
    const formTitle = document.getElementById('expModalTitle');

    if(id) {
        formTitle.innerText = "Update Corporate Profile Logs";
        const target = experience.find(e => e.id === id);
        hiddenId.value = target.id;
        dateIn.value = target.date;
        compIn.value = target.company;
        roleIn.value = target.role;
        descIn.value = target.desc;
    } else {
        formTitle.innerText = "Add Timeline Experience Nodes";
        hiddenId.value = '';
        dateIn.value = '';
        compIn.value = '';
        roleIn.value = '';
        descIn.value = '';
    }
    openModal('experienceModal');
}

function submitExperienceForm() {
    const id = document.getElementById('expEditId').value;
    const date = document.getElementById('expDateInput').value.trim();
    const company = document.getElementById('expCompanyInput').value.trim();
    const role = document.getElementById('expRoleInput').value.trim();
    const desc = document.getElementById('expDescInput').value.trim();

    if(!date || !company || !role || !desc) { alert("All profile parameters are required inputs."); return; }

    if(id) {
        const target = experience.find(e => e.id == id);
        if(target) Object.assign(target, { date, company, role, desc });
    } else {
        experience.push({ id: Date.now(), date, company, role, desc });
    }

    closeModal('experienceModal');
    saveState();
}

function openTechModal(catIdx) {
    document.getElementById('techCategoryIndex').value = catIdx;
    document.getElementById('techTagInput').value = '';
    openModal('techModal');
    setTimeout(() => document.getElementById('techTagInput').focus(), 150);
}

function submitTechTagForm() {
    const catIdx = document.getElementById('techCategoryIndex').value;
    const tagVal = document.getElementById('techTagInput').value.trim();

    if(tagVal) {
        techStack[catIdx].items.push(tagVal);
        closeModal('techModal');
        saveState();
    }
}

function openDeleteConfirmation(type, payload) {
    deleteTargetType = type;
    deleteTargetPayload = payload;
    
    const warningText = document.getElementById('deleteWarningMessage');
    if(type === 'project') warningText.innerText = "Permanently clear target object project reference portfolio asset?";
    if(type === 'tech') warningText.innerText = "Delete this specialized tool technology tag configuration mapping parameter?";
    if(type === 'experience') warningText.innerText = "Wipe structural operational profile professional history record log line contents?";
    
    openModal('confirmDeleteModal');
}

function executeConfirmedDelete() {
    if(deleteTargetType === 'project') {
        projects = projects.filter(p => p.id !== deleteTargetPayload);
    } else if(deleteTargetType === 'experience') {
        experience = experience.filter(e => e.id !== deleteTargetPayload);
    } else if(deleteTargetType === 'tech') {
        const { catIdx, itemIdx } = deleteTargetPayload;
        techStack[catIdx].items.splice(itemIdx, 1);
    }
    
    closeModal('confirmDeleteModal');
    deleteTargetType = null;
    deleteTargetPayload = null;
    saveState();
}

function saveState() {
    localStorage.setItem('portfolio_projects', JSON.stringify(projects));
    localStorage.setItem('portfolio_tech', JSON.stringify(techStack));
    localStorage.setItem('portfolio_exp', JSON.stringify(experience));
    renderPortfolio();
}

function exportUpdatedHTML() {
    logoutAdmin();
    console.log("PROJECTS ARRAYS STRUCT:", JSON.stringify(projects));
    console.log("TECH CATEGORIES MATRIX:", JSON.stringify(techStack));
    console.log("TIMELINE EXP ENTRIES:", JSON.stringify(experience));
    alert("Application data layout generated into developer tools console pipeline logs successfully!");
}

window.addEventListener('keydown', function(e) {
    if (e.key === 'F2') {
        e.preventDefault();
        triggerAdminLogin();
    }
    if (e.key === 'Enter') {
        if(document.getElementById('authModal').classList.contains('active')) submitAdminPassword();
        if(document.getElementById('projectModal').classList.contains('active')) submitProjectForm();
        if(document.getElementById('experienceModal').classList.contains('active')) submitExperienceForm();
        if(document.getElementById('techModal').classList.contains('active')) submitTechTagForm();
    }
    if (e.key === 'Escape') {
        closeModal('authModal');
        closeModal('projectModal');
        closeModal('experienceModal');
        closeModal('techModal');
        closeModal('confirmDeleteModal');
    }
});

window.onload = init;

// Horizontal Slider Navigation Scroll Engine
function scrollSlider(direction) {
    const container = document.getElementById('scrollContainer');
    if (!container) return;
    
    // Dynamically calculate scroll distance based on one card width + its gap
    const scrollAmount = 420; 
    
    if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}

// Lightbox
function openLightbox(src) {
    const lb = document.getElementById('lightbox');
    document.getElementById('lightboxImg').src = src;
    lb.classList.add('active');
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
}

window.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeLightbox();
});
