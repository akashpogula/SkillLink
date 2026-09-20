import { DB } from './state.js';

// ==========================================
// STATE MANAGEMENT
// ==========================================
let state = {
    user: null,
    currentView: 'onboarding',
    searchQuery: '',
    searchCategory: '',
    searchStatus: '',
    selectedProviderId: null
};

// ==========================================
// INITIALIZATION
// ==========================================
function initClientApp() {
    // Check for existing session
    const savedUser = sessionStorage.getItem('skillConnectClient');
    if (savedUser) {
        state.user = JSON.parse(savedUser);
        navigate('dashboard');
    } else {
        navigate('onboarding');
    }

    // Event Listeners
    setupEventListeners();
    
    // Render static parts
    populateCategoryFilters();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initClientApp);
} else {
    initClientApp();
}

function setupEventListeners() {
    // Onboarding Form
    const onboardingForm = document.getElementById('client-onboarding-form');
    if (onboardingForm) {
        onboardingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('client-name').value;
            const loc = document.getElementById('client-location').value;
            
            state.user = { name, location: loc };
            sessionStorage.setItem('skillConnectClient', JSON.stringify(state.user));
            navigate('dashboard');
        });
    }

    // Dashboard Search Input
    // Dashboard search input (filter-query on the search view)
    const dashSearch = document.getElementById('filter-query');
    if (dashSearch) {
        dashSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                state.searchQuery = e.target.value;
                navigate('search');
            }
        });
    }
}

// Make globally available for HTML onclicks
window.navigate = navigate;
window.logout = logout;
window.applyFilters = applyFilters;
window.clearFilters = clearFilters;
window.viewProvider = viewProvider;
window.openRequestModal = openRequestModal;
window.closeRequestModal = closeRequestModal;
window.cancelRequest = cancelRequest;
window.toggleNotifications = toggleNotifications;
window.openReviewModal = openReviewModal;
window.closeReviewModal = closeReviewModal;
window.toggleMobileFilters = toggleMobileFilters;

// ==========================================
// ROUTING
// ==========================================
function navigate(viewName) {
    state.currentView = viewName;
    if (!state.user) {
        const saved = sessionStorage.getItem('skillConnectClient');
        if (saved) {
            try { state.user = JSON.parse(saved); } catch(e){}
        }
    }
    
    // Hide all views
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    
    // Show nav if not onboarding
    const nav = document.getElementById('client-nav');
    if (viewName === 'onboarding') {
        nav.classList.add('hidden');
    } else {
        nav.classList.remove('hidden');
        if (state.user) {
            document.getElementById('user-greeting').innerText = `Hi, ${state.user.name.split(' ')[0]}`;
        }
    }

    // Show target view & render specific content
    document.getElementById(`${viewName}-view`).classList.add('active');
    window.scrollTo(0, 0);

    if (viewName === 'dashboard') renderDashboard();
    if (viewName === 'search') renderSearch();
    if (viewName === 'profile') renderProfile();
}

function logout() {
    sessionStorage.removeItem('skillConnectClient');
    // Navigation to index.html happens via href natively
}

// ==========================================
// DASHBOARD
// ==========================================
function renderDashboard() {
    if (state.user) {
        // Update the greeting heading with the user's first name
        const greetingEl = document.getElementById('dash-greeting');
        if (greetingEl) {
            greetingEl.innerText = `Hi, ${state.user.name.split(' ')[0]}. What needs doing today?`;
        }
    }

    // Categories
    const catContainer = document.getElementById('dash-categories');
    catContainer.innerHTML = DB.getCategories().map(cat => `
        <div class="cat-card" onclick="setCategoryAndSearch('${cat.id}')">
            <img src="${cat.image || '../assets/cat_other.jpg'}" alt="${cat.name}" class="cat-icon">
            <div class="cat-name">${cat.name}</div>
        </div>
    `).join('');

    // Nearby Providers (Show a slice of mock data)
    const provContainer = document.getElementById('dash-providers');
    provContainer.innerHTML = DB.getProviders().slice(0, 3).map(p => createProviderCard(p)).join('');

    // Requests
    renderClientRequests();
    renderClientNotifications();
}

function renderClientRequests() {
    const container = document.getElementById('client-requests-container');
    if (!container) return;
    
    const reqs = DB.getRequestsForClient(state.user.name);
    
    if (reqs.length === 0) {
        container.innerHTML = `<div class="empty-state" style="padding: 2rem;">No service requests yet. <a href="#" onclick="navigate('search')">Find a service</a></div>`;
        return;
    }
    
    container.innerHTML = reqs.map(r => {
        let statusColor = 'var(--color-text-primary)';
        if (r.status === 'ACCEPTED') statusColor = 'var(--color-status-success)';
        if (r.status === 'DECLINED') statusColor = 'var(--color-status-error)';
        if (r.status === 'CANCELLED') statusColor = 'var(--color-text-tertiary)';
        if (r.status === 'COMPLETED') statusColor = 'var(--color-status-success)';
        
        let cancelBtn = '';
        if (r.status === 'REQUESTED') {
            cancelBtn = `<button class="btn btn-secondary btn-sm" style="margin-top:0.5rem;" onclick="cancelRequest('${r.id}')">Cancel Request</button>`;
        } else if (r.status === 'COMPLETED' && !r.reviewed) {
            cancelBtn = `<button class="btn btn-primary btn-sm" style="margin-top:0.5rem;" onclick="openReviewModal('${r.id}', '${r.providerId}')">Leave Review</button>`;
        }
        
        return `
            <div class="req-item">
                <div>
                    <h4 style="margin:0 0 0.25rem 0;">${r.serviceName}</h4>
                    <p style="margin:0; font-size:0.9rem; color:var(--color-text-secondary);">Provider: ${r.providerName}</p>
                    <p style="margin:0.5rem 0 0 0;"><span class="status-badge" style="color:${statusColor}; background: ${statusColor}15;">${r.status}</span></p>
                </div>
                <div style="text-align:right;">
                    <p style="margin:0 0 0.5rem 0; font-size:0.8rem; color:var(--color-text-tertiary);">${new Date(r.createdAt).toLocaleDateString()}</p>
                    ${cancelBtn}
                </div>
            </div>
        `;
    }).join('');
}

function cancelRequest(reqId) {
    if (confirm('Are you sure you want to cancel this request?')) {
        DB.updateRequestStatus(reqId, 'CANCELLED');
        
        // Notify provider
        const req = DB.getRequests().find(x => x.id === reqId);
        if (req) {
            DB.addNotification({
                userId: req.providerId,
                role: 'provider',
                title: 'Request Cancelled',
                message: `Client ${req.clientName} cancelled their request for ${req.serviceName}.`
            });
        }
        
        renderClientRequests();
    }
}

// ==========================================
// NOTIFICATIONS
// ==========================================
function toggleNotifications() {
    const el = document.getElementById('notif-dropdown');
    el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

function renderClientNotifications() {
    const notifs = DB.getNotifications(state.user.name, 'client');
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
            <div style="padding:0.5rem 0; border-bottom:1px solid #eee; ${!n.read ? 'font-weight:bold;' : ''}" onclick="DB.markNotificationRead('${n.id}'); renderClientNotifications();">
                <div style="font-size:0.9rem;">${n.message}</div>
                <div style="font-size:0.75rem; color:#999;">${new Date(n.createdAt).toLocaleTimeString()}</div>
            </div>
        `).join('');
    }

}

window.setCategoryAndSearch = function(catId) {
    state.searchCategory = catId;
    state.searchQuery = '';
    navigate('search');
};

// ==========================================
// SEARCH & FILTERS
// ==========================================
function populateCategoryFilters() {
    const filterCat = document.getElementById('filter-category');
    if (!filterCat) return;
    
    DB.getCategories().forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.id;
        opt.innerText = cat.name;
        filterCat.appendChild(opt);
    });
}

function applyFilters() {
    state.searchQuery = document.getElementById('filter-query').value.toLowerCase();
    state.searchCategory = document.getElementById('filter-category').value;
    state.searchStatus = document.getElementById('filter-status').value;
    renderSearch();
}

function clearFilters() {
    state.searchQuery = '';
    state.searchCategory = '';
    state.searchStatus = '';
    
    document.getElementById('filter-query').value = '';
    document.getElementById('filter-category').value = '';
    document.getElementById('filter-status').value = '';
    
    renderSearch();
}

function toggleMobileFilters() {
    const panel = document.getElementById('filters-panel');
    if (panel) {
        panel.classList.toggle('open');
    }
}

function renderSearch() {
    // Sync UI with state
    document.getElementById('filter-query').value = state.searchQuery;
    document.getElementById('filter-category').value = state.searchCategory;
    document.getElementById('filter-status').value = state.searchStatus;

    // Filter Logic
    let results = DB.getProviders().filter(p => {
        let matchesQuery = true;
        if (state.searchQuery) {
            const q = state.searchQuery.toLowerCase();
            matchesQuery = p.name.toLowerCase().includes(q) || 
                           p.skill.toLowerCase().includes(q) || 
                           p.services.some(s => s.toLowerCase().includes(q));
        }
        
        const matchesCat = state.searchCategory ? p.categoryId === state.searchCategory : true;
        const matchesStatus = state.searchStatus ? p.status === state.searchStatus : true;
        
        return matchesQuery && matchesCat && matchesStatus;
    });

    const container = document.getElementById('search-results-grid');
    if (results.length === 0) {
        container.innerHTML = `<div class="empty-state"><h3>No providers found</h3><p>Try adjusting your filters or search terms.</p></div>`;
    } else {
        container.innerHTML = results.map(p => createProviderCard(p)).join('');
    }
    
    document.getElementById('search-results-title').innerText = results.length === 1 ? '1 Provider Found' : `${results.length} Providers Found`;
}

function getInitials(name) {
    if (!name) return 'SC';
    return name.split(' ').map(n => n[0]).filter(Boolean).join('').substring(0, 2).toUpperCase();
}

function createProviderCard(p) {
    const avatarSrc = p.avatar || p.image || '';
    const initials = getInitials(p.name);
    return `
        <div class="provider-card" onclick="viewProvider('${p.id}')">
            <div class="card-header">
                <div class="card-avatar-container">
                    <img src="${avatarSrc}" alt="${p.name}" class="card-avatar" onerror="this.classList.add('avatar-img-failed');">
                    <div class="card-avatar-fallback" aria-hidden="true">${initials}</div>
                </div>
                <div class="card-info">
                    <h4>${p.name}</h4>
                    <div class="skill">${p.skill}</div>
                </div>
            </div>
            <div class="card-meta">
                <span>📍 ${p.distance}</span>
                <span>⭐ ${p.rating} (${p.reviewsCount})</span>
            </div>
            <div class="card-price">
                ${p.pricing}
            </div>
        </div>
    `;
}

// ==========================================
// PROVIDER PROFILE
// ==========================================
function viewProvider(id) {
    state.selectedProviderId = id;
    navigate('profile');
}

function renderReviews(reviews) {
    if (!reviews || reviews.length === 0) return '<p style="color: var(--color-text-secondary);">No reviews yet.</p>';
    return reviews.map(r => `
        <div style="padding-bottom: 1rem; margin-bottom: 1rem; border-bottom: 1px solid var(--color-border-default);">
            <div style="display:flex; justify-content:space-between; margin-bottom: 0.5rem;">
                <strong>${r.author}</strong>
                <span style="color:#fbbf24;">${'⭐'.repeat(r.rating)}</span>
            </div>
            <p style="margin:0; color: var(--color-text-secondary);">${r.text}</p>
            <small style="color: var(--color-text-tertiary);">${r.date}</small>
        </div>
    `).join('');
}

function renderProfile() {
    const p = DB.getProviderById(state.selectedProviderId);
    const container = document.getElementById('profile-content-area');
    
    if (!p) {
        container.innerHTML = `<p>Provider not found.</p>`;
        return;
    }
    
    container.innerHTML = `
        <div class="page-header" style="margin-bottom: var(--space-6);">
            <button class="btn btn-secondary btn-sm" onclick="navigate('search')">← Back to Search</button>
        </div>
        
        <div class="profile-header">
            <div class="profile-avatar-large-container">
                <img src="${p.avatar || p.image || ''}" alt="${p.name}" class="profile-avatar-large" onerror="this.classList.add('avatar-img-failed');">
                <div class="profile-avatar-large-fallback" aria-hidden="true">${getInitials(p.name)}</div>
            </div>
            <div>
                <h1 style="margin-bottom: var(--space-1);">${p.name}</h1>
                <p style="font-size: var(--font-size-xl); color: var(--color-accent-primary); margin-bottom: var(--space-2);">${p.skill}</p>
                <div class="profile-tags">
                    <span class="tag">📍 ${p.location}</span>
                    <span class="tag">⭐ ${p.rating} (${p.reviewsCount} reviews)</span>
                    <span class="tag">💼 ${p.experience} Experience</span>
                </div>
            </div>
        </div>
        
        <div class="profile-content">
            <div class="main-details">
                <div class="profile-section">
                    <h2>About</h2>
                    <p style="white-space: pre-line; color: var(--color-text-primary);">${p.about}</p>
                </div>
                
                <div class="profile-section">
                    <h2>What I can help with</h2>
                    <ul style="list-style: none; display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem;">
                        ${p.services.map(s => `<li class="tag" style="background:var(--color-bg-tertiary);">${s}</li>`).join('')}
                    </ul>
                </div>

                <div class="profile-section">
                    <h2>Reviews</h2>
                    ${renderReviews(p.reviews)}
                </div>
            </div>
            
            <div class="action-sidebar">
                <div class="sticky-action-card">
                    <p style="color: var(--color-text-secondary); margin-bottom: 0.5rem;">Indicative Pricing</p>
                    <div style="font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); margin-bottom: var(--space-6);">${p.pricing}</div>
                    <button class="btn btn-primary btn-lg" style="width:100%;" onclick="openRequestModal()">Request service</button>
                </div>
            </div>
        </div>
    `;
}

// ==========================================
// REQUEST FLOW
// ==========================================
function openRequestModal() {
    const p = DB.getProviderById(state.selectedProviderId);
    if (!p) return;
    
    document.getElementById('request-modal').style.display = 'flex';
    document.getElementById('request-provider-context').innerHTML = `
        <strong>Requesting:</strong> ${p.name}<br>
        <span style="font-size:0.9rem; color:var(--color-text-secondary);">${p.skill}</span>
    `;
    
    const serviceSelect = document.getElementById('req-service');
    serviceSelect.innerHTML = p.services.map(s => `<option value="${s}">${s}</option>`).join('');
    
    document.getElementById('req-location').value = state.user.location || '';
}

function closeRequestModal() {
    document.getElementById('request-modal').style.display = 'none';
}

document.getElementById('request-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const p = DB.getProviderById(state.selectedProviderId);
    
    const req = {
        clientName: state.user.name,
        providerId: p.id,
        providerName: p.name,
        serviceName: document.getElementById('req-service').value,
        location: document.getElementById('req-location').value,
        date: document.getElementById('req-date').value,
        time: document.getElementById('req-time').value,
        details: document.getElementById('req-details').value
    };
    
    DB.addRequest(req);
    
    // Send Notification to Provider
    DB.addNotification({
        userId: p.id,
        role: 'provider',
        title: 'New Service Request',
        message: `${state.user.name} has requested your service: ${req.serviceName}.`
    });
    
    closeRequestModal();
    alert('Service requested successfully!');
    navigate('dashboard');
});

// ==========================================
// REVIEW FLOW
// ==========================================
let currentReviewContext = null;

function openReviewModal(reqId, providerId) {
    currentReviewContext = { reqId, providerId };
    document.getElementById('review-modal').style.display = 'flex';
}

function closeReviewModal() {
    document.getElementById('review-modal').style.display = 'none';
}

document.getElementById('review-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentReviewContext) return;
    
    const review = {
        author: state.user.name,
        rating: parseInt(document.getElementById('rev-rating').value),
        text: document.getElementById('rev-text').value
    };
    
    DB.addReview(currentReviewContext.providerId, review);
    
    // Mark request as reviewed (custom flag on request)
    const reqs = DB.getRequests();
    const req = reqs.find(x => x.id === currentReviewContext.reqId);
    if (req) {
        req.reviewed = true;
        DB.saveToStorage();
    }
    
    // Notify provider
    DB.addNotification({
        userId: currentReviewContext.providerId,
        role: 'provider',
        title: 'New Review',
        message: `${state.user.name} left a ${review.rating}-star review for you.`
    });
    
    closeReviewModal();
    alert('Review submitted successfully!');
    renderClientRequests();
});
