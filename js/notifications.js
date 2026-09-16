const NOTIFICATION_STORAGE_KEY = 'campushelp_notifications';

function seedNotifications() {
    const existing = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
    if (existing) {
        return JSON.parse(existing);
    }

    const defaultNotifications = [
        {
            id: 'notif-001',
            type: 'response',
            title: 'Réponse à un signalement',
            message: 'Le service technique a répondu à votre demande concernant le Wi‑Fi.',
            createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
            read: false,
            link: './conversation.html?id=conv-001',
        },
        {
            id: 'notif-002',
            type: 'accepted',
            title: 'Aide acceptée',
            message: 'Votre demande d’aide a été acceptée par le service concerné.',
            createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
            read: true,
            link: './messages.html',
        },
    ];

    localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(defaultNotifications));
    return defaultNotifications;
}

function getNotifications() {
    return JSON.parse(localStorage.getItem(NOTIFICATION_STORAGE_KEY) || '[]').length
        ? JSON.parse(localStorage.getItem(NOTIFICATION_STORAGE_KEY) || '[]')
        : seedNotifications();
}

function markAsRead(notificationId) {
    const notifications = getNotifications();
    const match = notifications.find((notification) => notification.id === notificationId);

    if (!match) {
        return false;
    }

    match.read = true;
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(notifications));
    return true;
}

function renderNotifications() {
    const listElement = document.getElementById('notification-list');
    if (!listElement) {
        return;
    }

    const notifications = getNotifications();
    listElement.innerHTML = '';

    if (!notifications.length) {
        listElement.innerHTML = '<li class="empty">Aucune notification.</li>';
        return;
    }

    notifications.forEach((notification) => {
        const item = document.createElement('li');
        item.className = notification.read ? '' : 'unread';

        item.innerHTML = `
      <div>
        <div><strong>${notification.title}</strong></div>
        <div>${notification.message}</div>
        <div class="meta">${new Date(notification.createdAt).toLocaleString('fr-FR')}</div>
      </div>
      <div>
        ${notification.read ? '' : '<span class="badge">New</span>'}
        <a href="${notification.link}" style="margin-right: 10px; color: #1d4ed8; text-decoration: none;">Voir</a>
        ${notification.read ? '' : '<button type="button" data-notification-id="' + notification.id + '">Marquer lu</button>'}
      </div>
    `;

        listElement.appendChild(item);

        const button = item.querySelector('button[data-notification-id]');
        if (button) {
            button.addEventListener('click', () => {
                markAsRead(notification.id);
                renderNotifications();
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    seedNotifications();
    renderNotifications();
});
