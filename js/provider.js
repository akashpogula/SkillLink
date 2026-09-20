import { DB } from './state.js';

let state = {
    providerId: null,
    currentView: 'onboarding',
    wizardStep: 1
};

// ==========================================
// INITIALIZATION
// ==========================================
function initProviderApp() {
    // Check for existing session
    const savedSession = sessionStorage.getItem('skillConnectProvider');
    if (savedSession) {
        state.providerId = savedSession;
        navigate('dashboard');
    } else {
        navigate('onboarding');
        populateCategories();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProviderApp);
} else {
    initProviderApp();
}

// Make globally available
window.navigate = navigate;
window.logout = logout;
window.nextStep = nextStep;
window.prevStep = prevStep;
window.updateAvailability = updateAvailability;
window.updateRequest = updateRequest;
window.toggleNotifications = toggleNotifications;

// ==========================================
// ROUTING
// ==========================================
function navigate(viewName) {
    state.currentView = viewName;
    if (!state.providerId) {
        state.providerId = sessionStorage.getItem('skillConnectProvider');
    }
    
    // Hide all views
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    
    // Show nav if not onboarding
    const nav = document.getElementById('provider-nav');
    if (viewName === 'onboarding') {
        nav.classList.add('hidden');
    } else {
        nav.classList.remove('hidden');
        const p = DB.getProviderById(state.providerId);
        if (p) {
            document.getElementById('user-greeting').innerText = `Hi, ${p.name.split(' ')[0]}`;
        }
    }

    document.getElementById(`${viewName}-view`).classList.add('active');
    window.scrollTo(0, 0);

    if (viewName === 'dashboard') renderDashboard();
}

function logout() {
    sessionStorage.removeItem('skillConnectProvider');
}

// ==========================================
// ONBOARDING WIZARD
// ==========================================
function populateCategories() {
    const select = document.getElementById('prov-category');
    if (!select) return;
    DB.getCategories().forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.id;
        opt.innerText = cat.name;
        select.appendChild(opt);
    });
}

function updateWizardUI() {
    document.querySelectorAll('.wizard-step').forEach(el => el.classList.remove('active'));
    document.getElementById(`step-${state.wizardStep}`).classList.add('active');
    
    // Update progress indicator
    document.querySelectorAll('.progress-step').forEach(el => el.classList.remove('active'));
    for (let i = 1; i <= state.wizardStep; i++) {
        document.getElementById(`prog-${i}`).classList.add('active');
    }

    document.getElementById('btn-prev').disabled = state.wizardStep === 1;
    
    if (state.wizardStep === 3) {
        document.getElementById('btn-next').classList.add('hidden');
        document.getElementById('btn-submit').classList.remove('hidden');
    } else {
        document.getElementById('btn-next').classList.remove('hidden');
        document.getElementById('btn-submit').classList.add('hidden');
    }
}

function nextStep() {
    // Basic validation could go here
    if (state.wizardStep < 3) {
        state.wizardStep++;
        updateWizardUI();
    }
}

function prevStep() {
    if (state.wizardStep > 1) {
        state.wizardStep--;
        updateWizardUI();
    }
}

document.getElementById('provider-onboarding-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const catId = document.getElementById('prov-category').value;
    const catName = DB.getCategories().find(c => c.id === catId)?.name;
    
    const newProvider = {
        id: 'p_' + Date.now(),
        name: document.getElementById('prov-name').value,
        skill: document.getElementById('prov-skill').value,
        categoryId: catId,
        categoryName: catName,
        services: document.getElementById('prov-services').value.split(',').map(s => s.trim()),
        location: document.getElementById('prov-location').value,
        serviceRadius: document.getElementById('prov-radius').value,
        experience: document.getElementById('prov-exp').value,
        pricing: document.getElementById('prov-price').value,
        about: document.getElementById('prov-about').value,
        status: 'Ready',
        avatar: '../assets/avatar_1.jpg', // Default mockup
        rating: 0,
        reviewsCount: 0,
        reviews: [],
        distance: 'Nearby' // Mock distance
    };
    
    DB.addProvider(newProvider);
    state.providerId = newProvider.id;
    sessionStorage.setItem('skillConnectProvider', state.providerId);
    
    navigate('dashboard');
});

// ==========================================
// DASHBOARD
// ==========================================
function renderDashboard() {
    const p = DB.getProviderById(state.providerId);
    if (!p) {
        logout();
        navigate('onboarding');
        return;
    }
    
    // Populate Sidebar
    document.getElementById('dash-name').innerText = p.name;
    document.getElementById('dash-skill').innerText = p.skill;
    document.getElementById('dash-status-select').value = p.status;
    document.getElementById('dash-rating').innerText = p.rating || '0.0';
    document.getElementById('dash-reviews').innerText = p.reviewsCount || '0';
    
    renderRequests();
    renderProviderNotifications();
}

function updateAvailability(newStatus) {
    DB.updateProvider(state.providerId, { status: newStatus });
    // In a real app, might show a toast notification
}

function renderRequests() {
    const container = document.getElementById('requests-container');
    const reqs = DB.getRequestsForProvider(state.providerId);
    
    if (reqs.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p class="text-large">You don't have any requests right now.</p>
                <p>When someone needs your skills, their request will appear here.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = reqs.map(r => {
        let actions = '';
        if (r.status === 'REQUESTED') {
            actions = `
                <button class="btn btn-primary btn-sm" onclick="updateRequest('${r.id}', 'ACCEPTED')">Accept</button>
                <button class="btn btn-secondary btn-sm" onclick="updateRequest('${r.id}', 'DECLINED')">Decline</button>
            `;
        } else if (r.status === 'ACCEPTED') {
            actions = `
                <button class="btn btn-primary btn-sm" onclick="updateRequest('${r.id}', 'IN_SERVICE')">Mark as In-Service</button>
                <button class="btn btn-secondary btn-sm" onclick="alert('Simulation: Calling client...')">📞 Contact Client</button>
            `;
        } else if (r.status === 'IN_SERVICE') {
            actions = `
                <button class="btn btn-primary btn-sm" onclick="updateRequest('${r.id}', 'COMPLETED')">Complete Service</button>
            `;
        }

        const statusColor = (r.status === 'REQUESTED' || r.status === 'Pending') ? 'var(--color-status-warning)' : 
                            (r.status === 'ACCEPTED' || r.status === 'IN_SERVICE' || r.status === 'COMPLETED' || r.status === 'Accepted' || r.status === 'Completed' ? 'var(--color-status-success)' : 'var(--color-status-error)');

        return `
            <div class="req-card">
                <div class="req-header">
                    <div>
                        <h3 class="req-title">${r.clientName}</h3>
                        <p class="req-meta">Requested: ${new Date(r.createdAt || Date.now()).toLocaleDateString()}</p>
                    </div>
                    <span class="status-badge" style="color:${statusColor}; background: ${statusColor}15;">${r.status}</span>
                </div>
                
                <div class="req-details">
                    <p style="margin:0 0 0.5rem 0;"><strong>Service:</strong> ${r.serviceName}</p>
                    <p style="margin:0 0 0.5rem 0;"><strong>Location:</strong> ${r.location}</p>
                    <p style="margin:0 0 0.5rem 0;"><strong>Date & Time:</strong> ${r.preferredDate || r.date || 'Anytime'} ${r.preferredTime || r.time ? 'at ' + (r.preferredTime || r.time) : ''}</p>
                    <p style="margin:0;"><strong>Details:</strong> ${r.details || 'No additional details provided.'}</p>
                </div>
                
                <div class="req-actions">
                    ${actions}
                </div>
            </div>
        `;
    }).join('');
}

function updateRequest(reqId, newStatus) {
    DB.updateRequestStatus(reqId, newStatus);
    
    // Add notification for client
    const req = DB.getRequests().find(x => x.id === reqId);
    if (req) {
        DB.addNotification({
            userId: req.clientName, // In real app, clientId
            role: 'client',
            title: `Request ${newStatus}`,
            message: `Your request for ${req.serviceName} has been ${newStatus.toLowerCase()}.`
        });
    }

    renderRequests();
}

// ==========================================
// NOTIFICATIONS
// ==========================================
function toggleNotifications() {
    const el = document.getElementById('notif-dropdown');
    el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

function renderProviderNotifications() {
    const notifs = DB.getNotifications(state.providerId, 'provider');
    const badge = document.getElementById('notif-badge');
    const unreadCount = notifs.filter(n => !n.read).length;
    
    if (unreadCount > 0) {
        badge.style.display = 'block';
        badge.innerText = unreadCount;
    } else {
        badge.style.display = 'none';
    }
    
    const list = document.getElementById('notif-list');
    if (notifs.length === 0) {
        list.innerHTML = `<p style="font-size:0.9rem; color:#666;">No notifications.</p>`;
    } else {
        list.innerHTML = notifs.map(n => `
            <div style="padding:0.5rem 0; border-bottom:1px solid #eee; cursor:pointer; ${!n.read ? 'font-weight:bold;' : ''}" onclick="DB.markNotificationRead('${n.id}'); renderProviderNotifications();">
                <div style="font-size:0.9rem;">${n.message}</div>
                <div style="font-size:0.75rem; color:#999;">${new Date(n.createdAt).toLocaleTimeString()}</div>
            </div>
        `).join('');
    }
}
