/* =========================================================================
   TrackPro Chatbot
   File: js/chatbot.js
   Dependencies: Font Awesome icons, your existing HTML chatbot markup
   ========================================================================= */

/* ---------------------------
   Configuration
--------------------------- */
const ChatbotConfig = {
  botName: 'TrackBot',
  greeting:
    "Hello! I'm TrackBot, your GPS tracking assistant. Ask me about tracking, geofences, alerts, pricing, API, or settings.",
  maxMessageLength: 600,
  responseDelayMs: 700,
  enableVoiceInput: true,
  locale: 'en-US'
};

/* ---------------------------
   State
--------------------------- */
const ChatbotState = {
  isOpen: false,
  isTyping: false,
  history: [],
  context: null,
  ws: null
};

/* ---------------------------
   DOM helpers
--------------------------- */
function $(sel) {
  return document.querySelector(sel);
}
function append(el, html) {
  el.insertAdjacentHTML('beforeend', html);
}
function nowTime() {
  return new Date().toLocaleTimeString(ChatbotConfig.locale, {
    hour: '2-digit',
    minute: '2-digit'
  });
}
function scrollMessagesToEnd() {
  const box = $('#chatbot-messages');
  if (!box) return;
  setTimeout(() => (box.scrollTop = box.scrollHeight), 50);
}

/* ---------------------------
   Init
--------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  // Boot greeting on first load
  if ($('#chatbot-messages') && !$('#chatbot-messages').dataset.booted) {
    botMessage(ChatbotConfig.greeting);
    showQuickSuggestions();
    $('#chatbot-messages').dataset.booted = '1';
  }

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Alt + C toggle chat
    if (e.altKey && e.key.toLowerCase() === 'c') {
      e.preventDefault();
      toggleChat();
    }
    // Alt + X clear chat
    if (e.altKey && e.key.toLowerCase() === 'x' && ChatbotState.isOpen) {
      e.preventDefault();
      clearChat();
    }
    // Esc closes chat
    if (e.key === 'Escape' && ChatbotState.isOpen) toggleChat();
  });

  // Voice input
  if (ChatbotConfig.enableVoiceInput) setupVoice();

  // Auto nudge toggle button
  const tgl = $('.chatbot-toggle');
  if (tgl) {
    setTimeout(() => {
      tgl.style.animation = 'bounce 1s ease 2';
    }, 3000);
  }
});

/* ---------------------------
   UI controls
--------------------------- */
function toggleChat() {
  const panel = $('#chatbot');
  const tgl = $('.chatbot-toggle');
  if (!panel) return;
  ChatbotState.isOpen = !ChatbotState.isOpen;
  panel.classList.toggle('active', ChatbotState.isOpen);
  if (tgl) tgl.innerHTML = ChatbotState.isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-comment-dots"></i>';
  if (ChatbotState.isOpen) $('#chat-input')?.focus();
}

function handleChatKeyPress(ev) {
  if (ev.key === 'Enter' && !ev.shiftKey) {
    ev.preventDefault();
    sendMessage();
  }
}

/* ---------------------------
   Messaging
--------------------------- */
function userMessage(text) {
  const box = $('#chatbot-messages');
  if (!box) return;
  append(
    box,
    `<div class="user-message">
      <div class="message-avatar"><i class="fas fa-user"></i></div>
      <div class="message-content">
        <p>${escapeAndLink(text)}</p>
        <span class="message-time">${nowTime()}</span>
      </div>
    </div>`
  );
  scrollMessagesToEnd();
}

function botMessage(text) {
  const box = $('#chatbot-messages');
  if (!box) return;
  append(
    box,
    `<div class="bot-message">
      <div class="message-avatar"><i class="fas fa-robot"></i></div>
      <div class="message-content">
        <p>${escapeAndLink(text)}</p>
        <span class="message-time">${nowTime()}</span>
      </div>
    </div>`
  );
  scrollMessagesToEnd();
}

function typingStart() {
  if (ChatbotState.isTyping) return;
  ChatbotState.isTyping = true;
  const box = $('#chatbot-messages');
  append(
    box,
    `<div class="bot-message typing-indicator" id="typing-indicator">
      <div class="message-avatar"><i class="fas fa-robot"></i></div>
      <div class="message-content">
        <div class="typing-dots"><span></span><span></span><span></span></div>
      </div>
    </div>`
  );
  scrollMessagesToEnd();
}

function typingStop() {
  const ti = $('#typing-indicator');
  if (ti) ti.remove();
  ChatbotState.isTyping = false;
}

/* ---------------------------
   Send / Process
--------------------------- */
function sendMessage() {
  const input = $('#chat-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  if (text.length > ChatbotConfig.maxMessageLength) {
    botMessage('Your message is too long. Please shorten it.');
    return;
  }

  // show user msg
  userMessage(text);
  ChatbotState.history.push({ role: 'user', text, time: Date.now() });
  input.value = '';

  // remove previous suggestions
  $('.suggestions-container')?.remove();

  // typing indicator
  typingStart();

  setTimeout(() => {
    const reply = generateReply(text);
    typingStop();
    botMessage(reply);
    ChatbotState.history.push({ role: 'bot', text: reply, time: Date.now() });
    showFollowUps();
  }, ChatbotConfig.responseDelayMs);
}

/* ---------------------------
   NLU: generateReply
--------------------------- */
function generateReply(messageRaw) {
  const msg = messageRaw.toLowerCase();

  // greetings
  if (/^(hi|hello|hey)\b/.test(msg)) {
    return "Hi there! Ask me about real-time tracking, geofencing, alerts, pricing, API, or account settings.";
  }
  if (/(thank|thanks)/.test(msg)) return "You're welcome! Anything else?";

  // Tracking
  if (/(track|location|where|live|real[- ]?time)/.test(msg)) {
    ChatbotState.context = 'tracking';
    if (/how/.test(msg)) {
      return "Install a GPS device, open Dashboard, and view live markers on the map. Updates are every 1–5 seconds based on your plan.";
    }
    if (/(accurate|accuracy)/.test(msg)) {
      return "Tracking accuracy is typically 5–10 meters using multi‑GNSS (GPS/GLONASS/Galileo). Urban canyons may reduce accuracy.";
    }
    return "Open dashboard.html to view live positions, speed, and heading for each device with 1–5s refresh.";
  }

  // Geofencing
  if (/(geofence|zone|boundary)/.test(msg)) {
    ChatbotState.context = 'geofence';
    if (/(create|setup|make|draw)/.test(msg)) {
      return "In Dashboard, click Create Geofence, draw a circle/polygon, name it, choose devices, and set entry/exit alerts.";
    }
    return "Geofencing lets you define virtual zones and receive entry/exit alerts instantly.";
  }

  // Alerts
  if (/(alert|notification|notify)/.test(msg)) {
    ChatbotState.context = 'alerts';
    if (/type|kinds?/.test(msg)) {
      return "Supported alerts: Speed, Geofence Entry/Exit, Idle, Low Battery, SOS, and AI‑predictive risk alerts.";
    }
    if (/(setup|create|configure)/.test(msg)) {
      return "Go to alerts.html → Create Alert Rule → choose type, threshold, devices, and notification channel (push/email/SMS).";
    }
    return "Manage alerts on alerts.html and customize channels in settings.html → Notifications.";
  }

  // History
  if (/(history|route|replay|past)/.test(msg)) {
    ChatbotState.context = 'history';
    if (/(how long|retention|store)/.test(msg)) {
      return "Retention: Basic 30 days, Pro 180 days, Enterprise 365 days. Export CSV/JSON/PDF/Excel from settings.html → Advanced.";
    }
    return "Use history.html to filter by device/date and replay routes with timestamps, speeds, and stops.";
  }

  // Devices
  if (/(device|tracker|hardware)/.test(msg)) {
    ChatbotState.context = 'devices';
    if (/(battery|charge)/.test(msg)) {
      return "Battery life ranges 7–30 days for portables; vehicle hardwired units run indefinitely. Low-battery alert triggers at 20%.";
    }
    if (/(install|setup)/.test(msg)) {
      return "OBD‑II: plug under steering wheel. Hardwired: professional install. Personal trackers: just power on and pair in devices.html.";
    }
    return "Manage and register devices in devices.html, view status, signal, and last update times.";
  }

  // Pricing
  if (/(price|cost|plan|subscription|trial)/.test(msg)) {
    ChatbotState.context = 'pricing';
    if (/basic/.test(msg)) return "Basic: $9.99/mo — 1 device, realtime tracking, 30‑day history, basic alerts, email support.";
    if (/pro/.test(msg)) return "Pro: $24.99/mo — 5 devices, 180‑day history, unlimited geofences, AI alerts, priority support.";
    if (/enterprise|team|fleet/.test(msg))
      return "Enterprise: $99.99/mo — Unlimited devices, 365‑day history, API access, advanced analytics, dedicated support.";
    return "Plans: Basic $9.99, Pro $24.99, Enterprise $99.99 per month. 30‑day money‑back guarantee on all plans.";
  }

  // API
  if (/\bapi\b|integrat|webhook|sdk/.test(msg)) {
    ChatbotState.context = 'api';
    if (/doc|reference/.test(msg)) return "See api-docs.html for endpoints, auth with Bearer API keys, examples, and webhooks.";
    if (/key|auth/.test(msg)) return "Generate test/production keys in settings.html → API Keys, then send Authorization: Bearer YOUR_API_KEY.";
    if (/webhook/.test(msg)) return "Add webhooks in settings.html to receive device.alert and geofence.enter/exit events in real time.";
    return "Full REST API + WebSockets stream available. Start at api-docs.html and settings.html for keys.";
  }

  // Account/Settings
  if (/(account|profile|setting|password|billing|payment|2fa|two[- ]factor)/.test(msg)) {
    ChatbotState.context = 'account';
    if (/password|reset|change/.test(msg)) return "Change password in settings.html → Account Security. Enable 2FA for extra protection.";
    if (/billing|payment|invoice|plan/.test(msg)) return "Manage subscription, cards, and invoices in settings.html → Billing.";
    if (/delete|cancel/.test(msg)) return "Cancel anytime in Settings → Billing. To delete account, go to Settings → Advanced → Danger Zone.";
    return "Update profile, security, notifications, map preferences, and language in settings.html.";
  }

  // Support
  if (/(support|help|contact|human|agent)/.test(msg)) {
    ChatbotState.context = 'support';
    return "Support 24/7 — Email support@trackpro.com, call +1 (555) 123‑4567, or open contact.html. What can be helped with?";
  }

  // Fallback
  return "Here to help with tracking, geofences, alerts, pricing, API, devices, and settings. Try: “How do I create a geofence?”";
}

/* ---------------------------
   Suggestions
--------------------------- */
function showQuickSuggestions() {
  const box = $('#chatbot-messages');
  if (!box) return;
  const suggestions = [
    'How does GPS tracking work?',
    'Create a geofence',
    'What alerts are available?',
    'Show pricing plans',
    'API authentication guide'
  ];
  append(
    box,
    `<div class="suggestions-container">
      ${suggestions
        .map(
          (s) =>
            `<button class="suggestion-btn" onclick="prefillAndSend('${escapeAttr(s)}')">${s}</button>`
        )
        .join('')}
    </div>`
  );
  scrollMessagesToEnd();
}
function showFollowUps() {
  const ctx = ChatbotState.context || 'general';
  const map = {
    tracking: ['Open dashboard', 'Accuracy details', 'Track multiple devices', 'Show history'],
    geofence: ['Create polygon zone', 'Set entry/exit alerts', 'List all zones', 'Open alerts page'],
    alerts: ['Speed alert 70 mph', 'Enable battery alerts', 'Geofence notifications', 'Weekly summary email'],
    history: ['Export CSV', 'Replay last trip', 'Filter by device', 'Monthly report'],
    pricing: ['Basic vs Pro', 'Enterprise info', 'Any free trial?', 'Billing questions'],
    api: ['Generate API key', 'Webhooks list', 'Device location endpoint', 'Rate limits'],
    account: ['Enable 2FA', 'Change password', 'Update payment', 'Delete account'],
    general: ['Help Center', 'Contact support', 'System status', 'Open settings']
  };
  const items = map[ctx] || map.general;
  const box = $('#chatbot-messages');
  $('.suggestions-container')?.remove();
  append(
    box,
    `<div class="suggestions-container">
      ${items
        .map(
          (s) =>
            `<button class="suggestion-btn" onclick="prefillAndSend('${escapeAttr(s)}')">${s}</button>`
        )
        .join('')}
    </div>`
  );
  scrollMessagesToEnd();
}
function prefillAndSend(text) {
  const input = $('#chat-input');
  if (!input) return;
  input.value = text;
  sendMessage();
}

/* ---------------------------
   Utilities
--------------------------- */
function escapeAndLink(text) {
  const esc = text
    .replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))
    .replace(/**(.*?)**/g, '<strong>$1</strong>')
    .replace(/*(.*?)*/g, '<em>$1</em>')
    .replace(/
/g, '<br>');
  return esc.replace(
    /(https?://[^s<]+)/g,
    '<a href="$1" target="_blank" rel="noopener">$1</a>'
  );
}
function escapeAttr(s) {
  return s.replace(/'/g, "\\'");
}

/* ---------------------------
   History controls
--------------------------- */
function clearChat() {
  if (!confirm('Clear conversation?')) return;
  ChatbotState.history = [];
  const box = $('#chatbot-messages');
  if (!box) return;
  box.innerHTML = '';
  botMessage(ChatbotConfig.greeting);
  showQuickSuggestions();
}

function exportChat() {
  const blob = new Blob([JSON.stringify(ChatbotState.history, null, 2)], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `trackpro-chat-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ---------------------------
   Voice input (optional)
--------------------------- */
let voice;
function setupVoice() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return;
  voice = new SR();
  voice.lang = ChatbotConfig.locale;
  voice.continuous = false;
  voice.interimResults = false;
  voice.onresult = (e) => {
    const text = e.results[0][0].transcript;
    const input = $('#chat-input');
    if (input) {
      input.value = text;
      sendMessage();
    }
  };
  voice.onerror = () => {};
}
function startVoice() {
  if (voice) voice.start();
}

/* ---------------------------
   Expose small API
--------------------------- */
window.TrackBot = {
  toggle: toggleChat,
  send: sendMessage,
  clear: clearChat,
  export: exportChat,
  voice: startVoice
};