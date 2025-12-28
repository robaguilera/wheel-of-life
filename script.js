const categories = [
    {
        name: 'Mission',
        color: '#00BCD4',
        angle: 0,
        description: 'Your sense of purpose and calling. How you contribute to something greater than yourself and make a meaningful impact in the world.'
    },
    {
        name: 'Family',
        color: '#FFC107',
        angle: 36,
        description: 'Relationships with family members—parents, siblings, children. The quality of connection, support, and love within your family unit.'
    },
    {
        name: 'Friends',
        color: '#8BC34A',
        angle: 72,
        description: 'Social connections and friendships. The depth and quality of your relationships with friends, community involvement, and sense of belonging.'
    },
    {
        name: 'Romance',
        color: '#FFEB3B',
        angle: 108,
        description: 'Romantic relationship and partnership. Intimacy, connection, and satisfaction with your significant other (or desire for one).'
    },
    {
        name: 'Spiritual',
        color: '#FF6B9D',
        angle: 144,
        description: 'Your spiritual life and beliefs. Connection to something greater, faith practices, meditation, or your philosophical worldview.'
    },
    {
        name: 'Mental',
        color: '#E91E63',
        angle: 180,
        description: 'Mental and emotional wellbeing. Clarity of mind, emotional stability, mental health, stress management, and inner peace.'
    },
    {
        name: 'Physical',
        color: '#F8BBD0',
        angle: 216,
        description: 'Physical health and vitality. Energy levels, fitness, nutrition, sleep quality, and how your body feels and functions.'
    },
    {
        name: 'Growth',
        color: '#4DD0E1',
        angle: 252,
        description: 'Personal development and learning. How much you\'re growing, challenging yourself, acquiring new skills, and becoming who you want to be.'
    },
    {
        name: 'Money',
        color: '#26A69A',
        angle: 288,
        description: 'Financial health and security. Income, savings, debt management, financial stress (or freedom), and abundance mindset.'
    },
    {
        name: 'Career',
        color: '#9C27B0',
        angle: 324,
        description: 'Work and professional life. Job satisfaction, career growth, work-life balance, and the impact and fulfillment from your work.'
    },
    {
        name: 'Joy',
        color: '#FFD700',
        angle: 360,
        description: 'Fun, play, and enjoyment of life. Hobbies, leisure activities, laughter, spontaneity, and your overall sense of happiness and delight.'
    }
];

let scores = {};
let notes = {};
let currentCategory = null;
const STORAGE_KEY = 'wheelOfLifeScores';
const NOTES_STORAGE_KEY = 'wheelOfLifeNotes';

// LocalStorage functions
function saveScores() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
    showSaveIndicator();
}

function saveNotes() {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
}

function loadScores() {
    const savedScores = localStorage.getItem(STORAGE_KEY);
    if (savedScores) {
        try {
            scores = JSON.parse(savedScores);
        } catch (e) {
            console.error('Error loading saved scores:', e);
            initializeScores();
        }
    } else {
        initializeScores();
    }
}

function loadNotes() {
    const savedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
    if (savedNotes) {
        try {
            notes = JSON.parse(savedNotes);
        } catch (e) {
            console.error('Error loading saved notes:', e);
            initializeNotes();
        }
    } else {
        initializeNotes();
    }
}

function initializeScores() {
    categories.forEach(cat => {
        if (scores[cat.name] === undefined) {
            scores[cat.name] = 0;
        }
    });
}

function initializeNotes() {
    categories.forEach(cat => {
        if (notes[cat.name] === undefined) {
            notes[cat.name] = { reflection: '', improvement: '' };
        }
    });
}

function showSaveIndicator() {
    const indicator = document.getElementById('saveIndicator');
    indicator.classList.add('show');
    setTimeout(() => {
        indicator.classList.remove('show');
    }, 2000);
}

// Initialize scores and notes from localStorage
loadScores();
loadNotes();

// Collapsible sections
function toggleCollapsible(section) {
    const content = document.getElementById(section + '-content');
    const icon = document.getElementById(section + '-icon');

    content.classList.toggle('open');
    icon.classList.toggle('open');
}

// Open scoring guide by default
window.addEventListener('DOMContentLoaded', () => {
    toggleCollapsible('scoring');
});

const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = 200;
const anglePerSegment = (2 * Math.PI) / categories.length;

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw each segment
    categories.forEach((cat, index) => {
        const startAngle = (index * anglePerSegment) - Math.PI / 2;
        const endAngle = startAngle + anglePerSegment;

        // Draw outer segment (full color, light)
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = cat.color + '40'; // Light version
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw score segment (filled based on score)
        const score = scores[cat.name] || 0;
        const scoreRadius = (score / 5) * radius;

        if (score > 0) {
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, scoreRadius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = cat.color;
            ctx.fill();
        }

        // Draw labels
        const labelAngle = startAngle + anglePerSegment / 2;
        const labelRadius = radius + 30;
        const labelX = centerX + Math.cos(labelAngle) * labelRadius;
        const labelY = centerY + Math.sin(labelAngle) * labelRadius;

        ctx.fillStyle = '#333';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(cat.name, labelX, labelY);
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw grid circles
    for (let i = 1; i <= 5; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, (i / 5) * radius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

function updateCategoriesList() {
    const listContainer = document.getElementById('categoriesList');
    listContainer.innerHTML = '';

    categories.forEach(cat => {
        const item = document.createElement('div');
        item.className = 'category-item';

        const score = scores[cat.name] || 0;
        const hasNotes = notes[cat.name] && (notes[cat.name].reflection || notes[cat.name].improvement);
        const notesIcon = hasNotes ? '📝' : '';

        item.innerHTML = `
            <div class="category-name">
                <span class="color-dot" style="background-color: ${cat.color}"></span>
                ${cat.name}
                ${notesIcon ? `<span class="notes-icon" title="Has notes">${notesIcon}</span>` : ''}
            </div>
            <div class="category-actions">
                <div class="category-score">${score || '-'}</div>
                ${score > 0 ? `<button class="notes-btn" onclick="event.stopPropagation(); viewNotes('${cat.name}')" title="View/Edit Notes">✏️</button>` : ''}
            </div>
        `;

        item.onclick = () => openModal(cat.name);
        listContainer.appendChild(item);
    });
}

function openModal(categoryName) {
    currentCategory = categoryName;
    const category = categories.find(cat => cat.name === categoryName);

    document.getElementById('modalTitle').textContent = categoryName;
    document.getElementById('modal').classList.add('active');

    // Show category description
    const descriptionEl = document.getElementById('categoryDescription');
    if (category && category.description) {
        descriptionEl.textContent = category.description;
        descriptionEl.style.display = 'block';
    } else {
        descriptionEl.style.display = 'none';
    }

    // Show score step, hide notes step
    document.getElementById('scoreStep').style.display = 'block';
    document.getElementById('notesStep').style.display = 'none';

    const buttonsContainer = document.getElementById('scoreButtons');
    buttonsContainer.innerHTML = '';

    // Create buttons for 1-5
    const scores = [1, 2, 3, 4, 5];
    scores.forEach(i => {
        const btn = document.createElement('button');
        btn.className = i === 3 ? 'score-btn discouraged-btn' : 'score-btn';
        btn.textContent = i;
        btn.onclick = () => setScore(i);
        buttonsContainer.appendChild(btn);
    });
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');

    // Reset to step 1 for next time
    setTimeout(() => {
        document.getElementById('scoreStep').style.display = 'block';
        document.getElementById('notesStep').style.display = 'none';
    }, 300);

    currentCategory = null;
}

function saveAndCloseModal() {
    if (currentCategory) {
        const reflection = document.getElementById('reflectionInput').value;
        const improvement = document.getElementById('improvementInput').value;

        notes[currentCategory] = { reflection, improvement };
        saveNotes();
        updateCategoriesList();
    }
    closeModal();
}

function skipNotes() {
    closeModal();
}

function setScore(score) {
    if (currentCategory) {
        scores[currentCategory] = score;
        saveScores();
        drawWheel();
        updateCategoriesList();

        // Transition to notes step
        showNotesStep(currentCategory, score);
    }
}

function showNotesStep(categoryName, score) {
    // Hide score selection content
    document.getElementById('scoreStep').style.display = 'none';

    // Show notes step
    const notesStep = document.getElementById('notesStep');
    notesStep.style.display = 'block';

    // Update notes step content
    const notesStepTitle = document.getElementById('notesStepTitle');
    notesStepTitle.textContent = categoryName;

    // Get existing notes
    const categoryNotes = notes[categoryName] || { reflection: '', improvement: '' };

    // Generate prompts based on score
    let prompts = '';
    if (score <= 2) {
        // Low score prompts
        prompts = `
            <div class="notes-field">
                <label for="reflectionInput">What is lacking in this area?</label>
                <textarea id="reflectionInput" rows="3" placeholder="Reflect on what's missing or not working...">${categoryNotes.reflection}</textarea>
            </div>
            <div class="notes-field">
                <label for="improvementInput">How can you improve this area?</label>
                <textarea id="improvementInput" rows="3" placeholder="What specific actions can you take?">${categoryNotes.improvement}</textarea>
            </div>
        `;
    } else if (score === 3) {
        // Middle score prompts - encourage deeper reflection
        prompts = `
            <div class="notes-field">
                <label for="reflectionInput">What's keeping you in the middle?</label>
                <textarea id="reflectionInput" rows="3" placeholder="What factors are preventing this from being better or worse?">${categoryNotes.reflection}</textarea>
            </div>
            <div class="notes-field">
                <label for="improvementInput">What would it take to move this to a 4 or 5?</label>
                <textarea id="improvementInput" rows="3" placeholder="What specific changes would improve your satisfaction?">${categoryNotes.improvement}</textarea>
            </div>
        `;
    } else {
        // High score prompts (4-5)
        prompts = `
            <div class="notes-field">
                <label for="reflectionInput">What is going well in this area?</label>
                <textarea id="reflectionInput" rows="3" placeholder="What are you doing right?">${categoryNotes.reflection}</textarea>
            </div>
            <div class="notes-field">
                <label for="improvementInput">What can you keep doing to maintain this?</label>
                <textarea id="improvementInput" rows="3" placeholder="How can you sustain this success?">${categoryNotes.improvement}</textarea>
            </div>
        `;
    }

    document.getElementById('notesPrompts').innerHTML = prompts;
}

function viewNotes(categoryName) {
    const score = scores[categoryName] || 0;
    if (score > 0) {
        currentCategory = categoryName;
        const category = categories.find(cat => cat.name === categoryName);

        document.getElementById('modalTitle').textContent = categoryName;
        document.getElementById('modal').classList.add('active');

        // Show category description
        const descriptionEl = document.getElementById('categoryDescription');
        if (category && category.description) {
            descriptionEl.textContent = category.description;
            descriptionEl.style.display = 'block';
        } else {
            descriptionEl.style.display = 'none';
        }

        // Go directly to notes step
        document.getElementById('scoreStep').style.display = 'none';
        showNotesStep(categoryName, score);
    }
}

function resetAll() {
    if (confirm('Are you sure you want to reset all scores and notes?')) {
        categories.forEach(cat => {
            scores[cat.name] = 0;
            notes[cat.name] = { reflection: '', improvement: '' };
        });
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(NOTES_STORAGE_KEY);
        drawWheel();
        updateCategoriesList();
    }
}

// Handle canvas clicks
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= radius) {
        let angle = Math.atan2(dy, dx) + Math.PI / 2;
        if (angle < 0) angle += 2 * Math.PI;

        const segmentIndex = Math.floor(angle / anglePerSegment);
        const category = categories[segmentIndex];

        if (category) {
            openModal(category.name);
        }
    }
});

// Close modal when clicking outside
document.getElementById('modal').addEventListener('click', (e) => {
    if (e.target.id === 'modal') {
        closeModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('modal');
        if (modal.classList.contains('active')) {
            closeModal();
        }
    }
});

// Initial draw
drawWheel();
updateCategoriesList();
