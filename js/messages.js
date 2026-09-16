const CONVERSATION_STORAGE_KEY = 'campushelp_conversations';

function seedConversations() {
    const existing = localStorage.getItem(CONVERSATION_STORAGE_KEY);
    if (existing) {
        return JSON.parse(existing);
    }

    const defaultConversations = [
        {
            id: 'conv-001',
            title: 'Problème Wi‑Fi',
            participants: ['Étudiant', 'Service IT'],
            createdAt: new Date().toISOString(),
            messages: [
                {
                    id: 'msg-001',
                    sender: 'Étudiant',
                    content: 'Le Wi‑Fi ne fonctionne plus dans la salle B204.',
                    createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
                    read: true,
                },
                {
                    id: 'msg-002',
                    sender: 'Service IT',
                    content: 'Nous avons bien reçu votre signalement. Nous allons vérifier le réseau.',
                    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
                    read: false,
                },
            ],
        },
        {
            id: 'conv-002',
            title: 'Matériel de cours',
            participants: ['Étudiant', 'Personnel administratif'],
            createdAt: new Date().toISOString(),
            messages: [
                {
                    id: 'msg-010',
                    sender: 'Personnel administratif',
                    content: 'Le remplacement du projecteur est prévu demain matin.',
                    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
                    read: true,
                },
            ],
        },
    ];

    localStorage.setItem(CONVERSATION_STORAGE_KEY, JSON.stringify(defaultConversations));
    return defaultConversations;
}

function getConversations() {
    return JSON.parse(localStorage.getItem(CONVERSATION_STORAGE_KEY) || '[]').length
        ? JSON.parse(localStorage.getItem(CONVERSATION_STORAGE_KEY) || '[]')
        : seedConversations();
}

function createConversation({ title, participant }) {
    const conversations = getConversations();

    const newConversation = {
        id: `conv-${Date.now()}`,
        title: title || 'Nouvelle conversation',
        participants: [participant || 'Nouveau contact'],
        createdAt: new Date().toISOString(),
        messages: [
            {
                id: `msg-${Date.now()}`,
                sender: 'Système',
                content: 'Conversation créée.',
                createdAt: new Date().toISOString(),
                read: true,
            },
        ],
    };

    conversations.unshift(newConversation);
    localStorage.setItem(CONVERSATION_STORAGE_KEY, JSON.stringify(conversations));
    return newConversation;
}

function getMessages(conversationId) {
    const conversations = getConversations();
    const conversation = conversations.find((item) => item.id === conversationId);
    return conversation ? conversation.messages : [];
}

function sendMessage(conversationId, messageContent, sender = 'Étudiant') {
    if (!conversationId || !messageContent || !String(messageContent).trim()) {
        return null;
    }

    const conversations = getConversations();
    const conversation = conversations.find((item) => item.id === conversationId);

    if (!conversation) {
        return null;
    }

    const newMessage = {
        id: `msg-${Date.now()}`,
        sender,
        content: String(messageContent).trim(),
        createdAt: new Date().toISOString(),
        read: false,
    };

    conversation.messages.push(newMessage);
    localStorage.setItem(CONVERSATION_STORAGE_KEY, JSON.stringify(conversations));
    return newMessage;
}

function deleteMessage(conversationId, messageId) {
    const conversations = getConversations();
    const conversation = conversations.find((item) => item.id === conversationId);

    if (!conversation) {
        return false;
    }

    const beforeLength = conversation.messages.length;
    conversation.messages = conversation.messages.filter((message) => message.id !== messageId);
    localStorage.setItem(CONVERSATION_STORAGE_KEY, JSON.stringify(conversations));

    return conversation.messages.length !== beforeLength;
}

function renderConversationList() {
    const listElement = document.getElementById('conversation-list');
    const formElement = document.getElementById('conversation-form');

    if (!listElement) {
        return;
    }

    const conversations = getConversations();
    listElement.innerHTML = '';

    if (!conversations.length) {
        listElement.innerHTML = '<li class="empty">Aucune conversation pour le moment.</li>';
        return;
    }

    conversations.forEach((conversation) => {
        const item = document.createElement('li');
        const lastMessage = conversation.messages[conversation.messages.length - 1];

        item.innerHTML = `
      <div>
        <div><strong>${conversation.title}</strong></div>
        <div class="meta">${conversation.participants.join(', ')}</div>
        <div class="meta">${lastMessage ? lastMessage.content : 'Aucun message'}</div>
      </div>
      <div>
        <a href="./conversation.html?id=${conversation.id}">Ouvrir</a>
      </div>
    `;
        listElement.appendChild(item);
    });

    if (formElement) {
        formElement.addEventListener('submit', (event) => {
            event.preventDefault();
            const titleInput = document.getElementById('conversation-title');
            const userInput = document.getElementById('conversation-user');

            const title = titleInput.value.trim();
            const participant = userInput.value.trim();

            if (!title || !participant) {
                return;
            }

            const conversation = createConversation({ title, participant });
            titleInput.value = '';
            userInput.value = '';

            window.location.href = `./conversation.html?id=${conversation.id}`;
        });
    }
}

function renderConversationMessages() {
    const messageListElement = document.getElementById('message-list');
    const titleElement = document.getElementById('conversation-title');
    const formElement = document.getElementById('message-form');

    if (!messageListElement) {
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const conversationId = params.get('id');

    if (!conversationId) {
        messageListElement.innerHTML = '<div class="empty">Aucune conversation sélectionnée.</div>';
        return;
    }

    const conversations = getConversations();
    const conversation = conversations.find((item) => item.id === conversationId);

    if (!conversation) {
        messageListElement.innerHTML = '<div class="empty">Conversation introuvable.</div>';
        return;
    }

    if (titleElement) {
        titleElement.textContent = conversation.title;
    }

    const messages = getMessages(conversationId);
    messageListElement.innerHTML = '';

    if (!messages.length) {
        messageListElement.innerHTML = '<div class="empty">Aucun message dans cette conversation.</div>';
    } else {
        messages.forEach((message) => {
            const item = document.createElement('div');
            item.className = `message ${message.sender === 'Étudiant' ? 'me' : ''}`;
            item.innerHTML = `
        <div class="message-head">
          <strong>${message.sender}</strong>
          <span>${new Date(message.createdAt).toLocaleString('fr-FR')}</span>
        </div>
        <div>${message.content}</div>
        ${message.sender === 'Étudiant' ? '<button type="button" class="delete-btn" data-message-id="' + message.id + '">Supprimer</button>' : ''}
      `;
            messageListElement.appendChild(item);
        });

        messageListElement.querySelectorAll('.delete-btn').forEach((button) => {
            button.addEventListener('click', () => {
                const messageId = button.getAttribute('data-message-id');
                if (messageId && deleteMessage(conversationId, messageId)) {
                    renderConversationMessages();
                }
            });
        });
    }

    if (formElement) {
        formElement.addEventListener('submit', (event) => {
            event.preventDefault();
            const textarea = document.getElementById('message-content');
            const content = textarea.value.trim();

            if (!content) {
                return;
            }

            sendMessage(conversationId, content, 'Étudiant');
            textarea.value = '';
            renderConversationMessages();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    seedConversations();
    renderConversationList();
    renderConversationMessages();
});
