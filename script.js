// ═══════ NAVBAR SCROLL EFFECT ═══════
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ═══════ MOBILE TOGGLE ═══════
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  const spans = navToggle.querySelectorAll('span');
  if (navLinks.classList.contains('active')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

// ═══════ ACTIVE NAV LINK ON SCROLL ═══════
const sections = document.querySelectorAll('section[id]');
const navItems = navLinks.querySelectorAll('a');

function updateActiveNav() {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navItems.forEach(a => a.classList.remove('active'));
      const active = navLinks.querySelector(`a[href="#${id}"]`);
      if (active) active.classList.add('active');
    }
  });
}
window.addEventListener('scroll', updateActiveNav);

// ═══════ SCROLL ANIMATIONS ═══════
const animatedElements = document.querySelectorAll('.animate-on-scroll');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 100);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

animatedElements.forEach(el => observer.observe(el));

// ═══════ CONTACT FORM ═══════
const contactForm = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');

contactForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  // Reset message
  formMsg.className = 'form-msg';
  formMsg.textContent = '';

  // Validate
  if (!name || !email || !message) {
    formMsg.className = 'form-msg form-msg--error';
    formMsg.textContent = 'Please complete all fields before submitting.';
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    formMsg.className = 'form-msg form-msg--error';
    formMsg.textContent = 'Please enter a valid email address.';
    return;
  }

  // Success
  formMsg.className = 'form-msg form-msg--success';
  formMsg.textContent = `Thank you, ${name}! Your message has been received successfully. We will respond shortly.`;
  contactForm.reset();

  setTimeout(() => {
    formMsg.className = 'form-msg';
    formMsg.textContent = '';
  }, 6000);
});

// ═══════ SMOOTH SCROLL FOR ALL ANCHOR LINKS ═══════
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ═══════ CHATBOT ═══════
(function () {
  const chatbot = document.getElementById('chatbot');
  const toggle = document.getElementById('chatbotToggle');
  const closeBtn = document.getElementById('chatbotClose');
  const messagesEl = document.getElementById('chatbotMessages');
  const inputEl = document.getElementById('chatbotInput');
  const sendBtn = document.getElementById('chatbotSend');
  const suggestionsEl = document.getElementById('chatbotSuggestions');
  let firstOpen = true;

  // Toggle open/close
  toggle.addEventListener('click', () => {
    chatbot.classList.toggle('active');
    if (chatbot.classList.contains('active')) {
      inputEl.focus();
      if (firstOpen) {
        firstOpen = false;
        addBotMessage("Hello! 🍃 I'm the VitalSip Assistant. Ask me anything about healthy beverages, recipes, nutritional benefits, or beverage types. How can I help you today?");
      }
    }
  });
  closeBtn.addEventListener('click', () => chatbot.classList.remove('active'));

  // Quick-reply chips
  suggestionsEl.querySelectorAll('.chatbot__chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const query = chip.getAttribute('data-query');
      handleUserMessage(query);
    });
  });

  // Send button & Enter key
  sendBtn.addEventListener('click', () => {
    const text = inputEl.value.trim();
    if (text) handleUserMessage(text);
  });
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const text = inputEl.value.trim();
      if (text) handleUserMessage(text);
    }
  });

  function handleUserMessage(text) {
    addUserMessage(text);
    inputEl.value = '';
    suggestionsEl.style.display = 'none';
    showTyping();
    setTimeout(() => {
      removeTyping();
      const reply = generateReply(text);
      addBotMessage(reply);
    }, 800 + Math.random() * 600);
  }

  function addUserMessage(text) {
    const div = document.createElement('div');
    div.className = 'chat-msg chat-msg--user';
    div.innerHTML = `<div class="chat-msg__avatar">👤</div><div class="chat-msg__bubble">${escapeHtml(text)}</div>`;
    messagesEl.appendChild(div);
    scrollToBottom();
  }

  function addBotMessage(text) {
    const div = document.createElement('div');
    div.className = 'chat-msg chat-msg--bot';
    div.innerHTML = `<div class="chat-msg__avatar">🍃</div><div class="chat-msg__bubble">${text}</div>`;
    messagesEl.appendChild(div);
    scrollToBottom();
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'chat-msg chat-msg--bot';
    div.id = 'typingIndicator';
    div.innerHTML = `<div class="chat-msg__avatar">🍃</div><div class="chat-msg__bubble"><div class="chat-msg__typing"><span></span><span></span><span></span></div></div>`;
    messagesEl.appendChild(div);
    scrollToBottom();
  }

  function removeTyping() {
    const t = document.getElementById('typingIndicator');
    if (t) t.remove();
  }

  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function escapeHtml(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  // ── Knowledge Base & Intent Matching ──
  const responses = [
    {
      keywords: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good evening'],
      reply: "Hello there! 👋 Welcome to VitalSip. I can help you with healthy beverage recipes, nutritional info, and wellness tips. What would you like to know?"
    },
    {
      keywords: ['what are healthy beverages', 'define healthy beverages', 'healthy drinks'],
      reply: "Healthy beverages are drinks made from natural, nutrient-dense ingredients such as fruits, vegetables, herbs, and plant-based milks. They provide essential vitamins, minerals, antioxidants, and hydration without artificial sugars or preservatives. 🥤"
    },
    {
      keywords: ['types', 'categories', 'kinds', 'variety', 'varieties'],
      reply: "There are <strong>5 main categories</strong> of healthy beverages:<br>🍵 <strong>Herbal Teas</strong> – chamomile, peppermint, ginger<br>💧 <strong>Fruit-Infused Water</strong> – lemon-cucumber, berry-mint<br>🥤 <strong>Smoothies</strong> – blended fruits, veggies & superfoods<br>🍊 <strong>Fresh Juices</strong> – cold-pressed fruit & vegetable juices<br>🥛 <strong>Dairy & Plant-Based</strong> – almond, oat, coconut milk & kefir"
    },
    {
      keywords: ['benefit', 'benefits', 'advantage', 'why', 'good for', 'healthy'],
      reply: "Healthy beverages offer numerous benefits:<br>💧 <strong>Hydration</strong> – supports cellular function & cognition<br>🛡️ <strong>Immune Boost</strong> – vitamins C, D & zinc strengthen defences<br>🧠 <strong>Brain Health</strong> – antioxidants improve cognitive clarity<br>🌿 <strong>Digestive Wellness</strong> – probiotics & fibre support gut health<br>⚡ <strong>Natural Energy</strong> – sustained vitality without crashes"
    },
    {
      keywords: ['smoothie', 'smoothies', 'blend', 'blender'],
      reply: "Here's a quick <strong>Green Detox Smoothie</strong> recipe:<br>🥬 1 cup spinach<br>🍌 1 banana<br>🍏 ½ green apple<br>🫚 1 tsp fresh ginger<br>🍋 Juice of ½ lemon<br>💧 1 cup water<br><br>Blend everything until smooth and enjoy immediately! It's packed with vitamins A, C, K and iron. 💚"
    },
    {
      keywords: ['recipe', 'recipes', 'make', 'prepare', 'how to'],
      reply: "I have several recipes for you! Here are three favourites:<br><br>🟢 <strong>Green Detox Smoothie</strong> – spinach, banana, apple, ginger & lemon<br>🔵 <strong>Berry Antioxidant Blast</strong> – blueberries, strawberries, Greek yoghurt & chia seeds<br>🟡 <strong>Citrus Mint Infused Water</strong> – lemon, orange, cucumber & fresh mint<br><br>Would you like the full steps for any of these?"
    },
    {
      keywords: ['tea', 'teas', 'herbal', 'chamomile', 'peppermint', 'ginger tea'],
      reply: "Herbal teas are wonderful for relaxation and wellness! 🍵<br><br>🌼 <strong>Chamomile</strong> – promotes sleep & reduces anxiety<br>🌿 <strong>Peppermint</strong> – aids digestion & relieves headaches<br>🫚 <strong>Ginger</strong> – anti-inflammatory & boosts immunity<br>🌺 <strong>Hibiscus</strong> – lowers blood pressure & rich in vitamin C<br><br>Steep in hot water for 5–7 minutes for the best flavour!"
    },
    {
      keywords: ['infused water', 'detox water', 'fruit water', 'cucumber water', 'lemon water'],
      reply: "Fruit-infused water is a fantastic zero-calorie way to stay hydrated! 💧<br><br>Try these combinations:<br>🍋 Lemon + Cucumber + Mint<br>🍓 Strawberry + Basil<br>🍊 Orange + Blueberry<br>🥒 Cucumber + Lime + Ginger<br><br>Simply add sliced fruits to cold water and refrigerate for 2+ hours. Delicious and refreshing!"
    },
    {
      keywords: ['juice', 'juices', 'fresh juice', 'cold press', 'juicing'],
      reply: "Fresh juices deliver a concentrated dose of vitamins and enzymes! 🍊<br><br>Top juice combinations:<br>🥕 <strong>Carrot + Ginger + Orange</strong> – vitamin A powerhouse<br>🍏 <strong>Green Apple + Celery + Cucumber</strong> – detox & hydration<br>🫐 <strong>Pomegranate + Beet</strong> – rich in antioxidants<br><br>Tip: Drink within 20 minutes of juicing for maximum nutrient retention."
    },
    {
      keywords: ['plant milk', 'almond milk', 'oat milk', 'coconut milk', 'dairy', 'plant-based', 'kefir'],
      reply: "Plant-based milks are excellent alternatives! 🥛<br><br>🌰 <strong>Almond Milk</strong> – low calorie, rich in vitamin E<br>🌾 <strong>Oat Milk</strong> – creamy, high in fibre & B vitamins<br>🥥 <strong>Coconut Milk</strong> – healthy fats & tropical flavour<br>🫘 <strong>Soy Milk</strong> – complete protein source<br><br>For gut health, try <strong>kefir</strong> – it contains over 30 strains of beneficial probiotics!"
    },
    {
      keywords: ['antioxidant', 'antioxidants', 'free radical', 'polyphenol'],
      reply: "Antioxidants are crucial for cellular protection! 🛡️<br><br>Top antioxidant-rich beverages:<br>🫐 Blueberry smoothies (anthocyanins)<br>🍵 Green tea (EGCG catechins)<br>🍫 Cacao drinks (flavonoids)<br>🍊 Pomegranate juice (punicalagins)<br><br>These compounds neutralise free radicals, reducing the risk of chronic disease and premature ageing."
    },
    {
      keywords: ['hydration', 'water', 'dehydration', 'how much water'],
      reply: "Proper hydration is essential! 💧<br><br>📏 <strong>Daily target</strong>: 2–3 litres (8–12 glasses)<br>🏃 <strong>During exercise</strong>: add 500ml per 30 mins of activity<br>🧠 Even mild dehydration can reduce cognitive performance by 25%<br><br>Tip: Infused water and herbal teas count towards your daily intake and make hydration more enjoyable!"
    },
    {
      keywords: ['calorie', 'calories', 'weight', 'diet', 'lose weight', 'low calorie'],
      reply: "Many healthy beverages are naturally low in calories:<br><br>💧 Infused Water – 5–15 kcal<br>🍵 Herbal Tea – 0–5 kcal<br>🥤 Green Smoothie – 100–150 kcal<br>🍊 Fresh Juice – 80–120 kcal<br><br>Replace sugary sodas (150+ kcal) with these options to support weight management while getting vital nutrients! 🎯"
    },
    {
      keywords: ['trend', 'trends', 'statistics', 'data', 'consumption', 'popular'],
      reply: "Healthy beverage consumption is growing rapidly! 📈<br><br>📊 Adult consumption rose from <strong>34% (2020)</strong> to <strong>68% (2026)</strong><br>👦 Adolescent adoption grew from <strong>22%</strong> to <strong>57%</strong><br>🏆 Most popular in 2026: <strong>Plant-Based Drinks</strong><br>📈 Average annual growth: <strong>+5.5%</strong><br><br>Check our Trends section for the full data table!"
    },
    {
      keywords: ['contact', 'email', 'reach', 'phone', 'address'],
      reply: "You can reach us through:<br><br>📍 123 Wellness Avenue, Health City, HC 45001<br>📞 +1 (555) 234-5678<br>📧 hello@vitalsip.com<br><br>Or use the contact form on our website — we typically respond within 24 hours! 💌"
    },
    {
      keywords: ['thank', 'thanks', 'appreciate', 'great', 'awesome', 'wonderful'],
      reply: "You're very welcome! 😊 I'm glad I could help. If you have any more questions about healthy beverages, feel free to ask anytime. Stay hydrated and healthy! 🍃"
    },
    {
      keywords: ['bye', 'goodbye', 'see you', 'exit', 'quit'],
      reply: "Goodbye! 👋 Thank you for chatting with VitalSip. Remember to stay hydrated and keep exploring nutritious beverages. Wishing you wellness and vitality! 🍃✨"
    }
  ];

  function generateReply(input) {
    const lower = input.toLowerCase();

    for (const r of responses) {
      for (const kw of r.keywords) {
        if (lower.includes(kw)) {
          return r.reply;
        }
      }
    }

    // Fallback
    return "That's an interesting question! 🤔 While I specialise in healthy beverages, I'd recommend exploring our website sections for detailed information. You can ask me about <strong>recipes, beverage types, nutrition benefits, hydration tips, or consumption trends</strong>. How can I assist you?";
  }
})();
