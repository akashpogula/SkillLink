import { mockData as initialMockData } from './mock-data.js';

const STORAGE_KEY = 'skillConnect_db';

class StateManager {
    constructor() {
        this.db = this.loadData();
    }

    loadData() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // Refresh provider avatars if using outdated relative paths
                if (parsed.providers && Array.isArray(parsed.providers)) {
                    parsed.providers.forEach(p => {
                        const fresh = initialMockData.providers.find(fp => fp.id === p.id);
                        if (fresh && (!p.avatar || p.avatar.includes('../assets/') || !p.image)) {
                            p.avatar = fresh.avatar;
                            p.image = fresh.image;
                        }
                    });
                    this.saveToStorage(parsed);
                }
                return parsed;
            } catch (e) {
                // Fall through to reinitialize if corrupted
            }
        }
        // Initialize with default mock data if empty
        const initialData = { ...initialMockData };
        if (!initialData.requests) initialData.requests = [];
        if (!initialData.notifications) initialData.notifications = [];
        this.saveToStorage(initialData);
        return initialData;
    }

    saveToStorage(data = this.db) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    // --- Providers ---
    getProviders() {
        return this.db.providers || [];
    }
    
    getProviderById(id) {
        return this.getProviders().find(p => p.id === id);
    }
    
    addProvider(provider) {
        if (!this.db.providers) this.db.providers = [];
        this.db.providers.push(provider);
        this.saveToStorage();
    }

    updateProvider(id, updates) {
        const p = this.getProviderById(id);
        if (p) {
            Object.assign(p, updates);
            this.saveToStorage();
        }
    }

    // --- Categories ---
    getCategories() {
        return this.db.categories || [];
    }

    // --- Requests ---
    getRequests() {
        return this.db.requests || [];
    }

    getRequestsForClient(clientName) {
        return this.getRequests().filter(r => r.clientName === clientName);
    }

    getRequestsForProvider(providerId) {
        return this.getRequests().filter(r => r.providerId === providerId);
    }

    addRequest(request) {
        if (!this.db.requests) this.db.requests = [];
        const newRequest = {
            id: 'req_' + Date.now(),
            createdAt: new Date().toISOString(),
            status: 'REQUESTED',
            ...request
        };
        this.db.requests.unshift(newRequest); // Add to top
        this.saveToStorage();
        return newRequest;
    }

    updateRequestStatus(requestId, newStatus) {
        const req = this.getRequests().find(r => r.id === requestId);
        if (req) {
            req.status = newStatus;
            req.updatedAt = new Date().toISOString();
            this.saveToStorage();
        }
    }

    // --- Notifications ---
    getNotifications(userId, userRole) {
        return (this.db.notifications || []).filter(n => n.userId === userId && n.role === userRole);
    }

    addNotification(notification) {
        if (!this.db.notifications) this.db.notifications = [];
        this.db.notifications.unshift({
            id: 'notif_' + Date.now(),
            createdAt: new Date().toISOString(),
            read: false,
            ...notification
        });
        this.saveToStorage();
    }

    markNotificationRead(notificationId) {
        const n = this.db.notifications.find(x => x.id === notificationId);
        if (n) {
            n.read = true;
            this.saveToStorage();
        }
    }

    // --- Reviews ---
    addReview(providerId, review) {
        const p = this.getProviderById(providerId);
        if (p) {
            if (!p.reviews) p.reviews = [];
            p.reviews.unshift({
                id: 'rev_' + Date.now(),
                date: 'Just now',
                ...review
            });
            // Recalculate rating
            const total = p.reviews.reduce((acc, r) => acc + r.rating, 0);
            p.rating = (total / p.reviews.length).toFixed(1);
            p.reviewsCount = p.reviews.length;
            this.saveToStorage();
        }
    }
}

export const DB = new StateManager();
