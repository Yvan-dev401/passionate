/* messages.js – Interactive logic for the conversations/chat page */

(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* Data: per-contact metadata used to update the chat header           */
  /* ------------------------------------------------------------------ */
  var contacts = [
    {
      name: 'ShadowByte',
      avatar: 'assets/images/avatar-01.jpg',
      statusClass: 'online',
      statusText: 'Online',
      statusTextClass: 'text-online'
    },
    {
      name: 'NeonFox',
      avatar: 'assets/images/avatar-02.jpg',
      statusClass: 'online',
      statusText: 'Online',
      statusTextClass: 'text-online'
    },
    {
      name: 'CyberWolf',
      avatar: 'assets/images/avatar-03.jpg',
      statusClass: 'away',
      statusText: 'Away',
      statusTextClass: 'text-away'
    },
    {
      name: 'PixelQueen',
      avatar: 'assets/images/avatar-04.jpg',
      statusClass: 'offline',
      statusText: 'Offline',
      statusTextClass: 'text-offline'
    },
    {
      name: 'DarkMatter',
      avatar: 'assets/images/profile-header.jpg',
      statusClass: 'online',
      statusText: 'Online',
      statusTextClass: 'text-online'
    }
  ];

  /* Currently open conversation index */
  var activeIndex = 0;

  /* ------------------------------------------------------------------ */
  /* openChat – switch to a different conversation                       */
  /* ------------------------------------------------------------------ */
  window.openChat = function (index) {
    var contact = contacts[index];
    if (!contact) { return; }

    /* Deactivate current contact item */
    var currentItem = document.querySelector('.contact-item.active');
    if (currentItem) { currentItem.classList.remove('active'); }

    /* Activate the clicked contact item */
    var newItem = document.querySelector('.contact-item[data-user="' + index + '"]');
    if (newItem) {
      newItem.classList.add('active');
      /* Remove unread badge */
      var badge = newItem.querySelector('.unread-badge');
      if (badge) { badge.remove(); }
    }

    /* Update chat header */
    document.getElementById('chat-avatar-img').src = contact.avatar;
    document.getElementById('chat-avatar-img').alt = contact.name;

    var statusDot = document.getElementById('chat-status-dot');
    statusDot.className = 'status-dot ' + contact.statusClass;

    document.getElementById('chat-user-name').textContent = contact.name;

    var statusLabel = document.getElementById('chat-user-status');
    statusLabel.textContent = contact.statusText;
    statusLabel.className = contact.statusTextClass;

    /* Hide all conversations, show the selected one */
    var allConversations = document.querySelectorAll('.chat-conversation');
    allConversations.forEach(function (c) { c.classList.remove('active'); });

    var target = document.getElementById('conversation-' + index);
    if (target) { target.classList.add('active'); }

    activeIndex = index;

    /* Scroll to the bottom */
    scrollToBottom();

    /* Focus input */
    var input = document.getElementById('message-input');
    if (input) { input.focus(); }
  };

  /* ------------------------------------------------------------------ */
  /* sendMessage – append a new outgoing bubble                          */
  /* ------------------------------------------------------------------ */
  window.sendMessage = function () {
    var input = document.getElementById('message-input');
    var text = input.value.trim();
    if (!text) { return; }

    var conversation = document.getElementById('conversation-' + activeIndex);
    if (!conversation) { return; }

    /* Build bubble */
    var now = new Date();
    var timeStr = pad(now.getHours()) + ':' + pad(now.getMinutes());

    var msgDiv = document.createElement('div');
    msgDiv.className = 'message outgoing';

    var bubble = document.createElement('div');
    bubble.className = 'message-bubble';

    var p = document.createElement('p');
    p.textContent = text;

    var time = document.createElement('span');
    time.className = 'message-time';
    time.textContent = timeStr;

    bubble.appendChild(p);
    bubble.appendChild(time);
    msgDiv.appendChild(bubble);
    conversation.appendChild(msgDiv);

    /* Update last message in contact list */
    var contactItem = document.querySelector('.contact-item[data-user="' + activeIndex + '"]');
    if (contactItem) {
      var lastMsg = contactItem.querySelector('.last-message');
      if (lastMsg) { lastMsg.textContent = text; }
      var msgTime = contactItem.querySelector('.msg-time');
      if (msgTime) { msgTime.textContent = 'Just now'; }
    }

    /* Clear input and scroll */
    input.value = '';
    scrollToBottom();

    /* Simulate a reply after a short delay */
    simulateReply(activeIndex, conversation);
  };

  /* ------------------------------------------------------------------ */
  /* handleEnter – send on Enter key, newline on Shift+Enter            */
  /* ------------------------------------------------------------------ */
  window.handleEnter = function (event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      window.sendMessage();
    }
  };

  /* ------------------------------------------------------------------ */
  /* filterContacts – live-search through the contact list              */
  /* ------------------------------------------------------------------ */
  window.filterContacts = function (query) {
    var items = document.querySelectorAll('.contact-item');
    var q = query.toLowerCase();
    items.forEach(function (item) {
      var name = item.querySelector('h6');
      var last = item.querySelector('.last-message');
      var nameText = name ? name.textContent.toLowerCase() : '';
      var lastText = last ? last.textContent.toLowerCase() : '';
      item.style.display = (nameText.indexOf(q) !== -1 || lastText.indexOf(q) !== -1) ? '' : 'none';
    });
  };

  /* ------------------------------------------------------------------ */
  /* Helpers                                                             */
  /* ------------------------------------------------------------------ */

  function scrollToBottom() {
    var area = document.getElementById('chat-messages');
    if (area) { area.scrollTop = area.scrollHeight; }
  }

  function pad(n) {
    return n < 10 ? '0' + n : '' + n;
  }

  var replies = [
    'Nice! 😄',
    'Haha, yeah totally!',
    'GG! Let\'s go again 🎮',
    'That\'s awesome!',
    '👍',
    'For sure, count me in!',
    'LOL 😂',
    'Did you see that last match?',
    'I\'ll be online in a bit.',
    'Let\'s squad up tonight!'
  ];

  function simulateReply(index, conversation) {
    var contact = contacts[index];
    if (!contact || contact.statusClass === 'offline') { return; }

    var delay = 1500 + Math.random() * 1500;
    setTimeout(function () {
      var replyText = replies[Math.floor(Math.random() * replies.length)];
      var now = new Date();
      var timeStr = pad(now.getHours()) + ':' + pad(now.getMinutes());

      var msgDiv = document.createElement('div');
      msgDiv.className = 'message incoming';

      var avatar = document.createElement('img');
      avatar.src = contact.avatar;
      avatar.alt = contact.name;
      avatar.className = 'msg-avatar';

      var bubble = document.createElement('div');
      bubble.className = 'message-bubble';

      var p = document.createElement('p');
      p.textContent = replyText;

      var time = document.createElement('span');
      time.className = 'message-time';
      time.textContent = timeStr;

      bubble.appendChild(p);
      bubble.appendChild(time);
      msgDiv.appendChild(avatar);
      msgDiv.appendChild(bubble);
      conversation.appendChild(msgDiv);

      /* Update last message in contact list */
      var contactItem = document.querySelector('.contact-item[data-user="' + index + '"]');
      if (contactItem) {
        var lastMsg = contactItem.querySelector('.last-message');
        if (lastMsg) { lastMsg.textContent = replyText; }
        var msgTime = contactItem.querySelector('.msg-time');
        if (msgTime) { msgTime.textContent = 'Just now'; }
      }

      scrollToBottom();
    }, delay);
  }

  /* ------------------------------------------------------------------ */
  /* Init: scroll to bottom of the initially active conversation        */
  /* ------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', function () {
    scrollToBottom();
  });

})();
