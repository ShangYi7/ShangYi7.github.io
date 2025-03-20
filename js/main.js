// 主題切換功能
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// 從localStorage讀取主題設置
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.className = savedTheme;
    if (savedTheme === 'dark-mode') {
        themeToggle.checked = true;
    }
}

// 切換主題
themeToggle.addEventListener('click', () => {
    if (body.classList.contains('light-mode')) {
        body.classList.replace('light-mode', 'dark-mode');
        localStorage.setItem('theme', 'dark-mode');
    } else {
        body.classList.replace('dark-mode', 'light-mode');
        localStorage.setItem('theme', 'light-mode');
    }
});

// 作品集數據
const portfolioItems = [
    {
        title: '響應式網站設計',
        category: 'frontend',
        image: '../assets/portfolio1.jpg',
        description: '使用HTML5、CSS3和JavaScript開發的響應式電商網站，提供良好的用戶體驗與流暢的操作介面。',
        link: '#',
        featured: true
    },
    {
        title: 'UI設計作品',
        category: 'ui',
        image: '../assets/portfolio2.jpg',
        description: '使用Figma設計的現代化UI界面，包含全套用戶旅程和交互原型。',
        link: '#',
        featured: true
    },
    {
        title: 'AI圖像識別',
        category: 'ai',
        image: '../assets/portfolio3.jpg',
        description: '基於TensorFlow.js的圖像識別應用，能夠實時識別並分類多種物體。',
        link: '#',
        featured: true
    },
    {
        title: '個人作品集網站',
        category: 'frontend',
        image: '../assets/portfolio4.jpg',
        description: '使用現代化前端技術開發的個人作品集網站，融合動畫和交互效果。',
        link: '#',
        featured: true
    },
    {
        title: '移動應用UI設計',
        category: 'ui',
        image: '../assets/portfolio5.jpg',
        description: '為iOS和Android平台設計的統一視覺風格移動應用UI介面。',
        link: '#',
        featured: false
    },
    {
        title: '自然語言處理應用',
        category: 'ai',
        image: '../assets/portfolio6.jpg',
        description: '使用NLP技術開發的智能聊天助手，能夠理解並響應用戶的自然語言輸入。',
        link: '#',
        featured: false
    }
];

// 更多作品集數據（用於載入更多功能）
const morePortfolioItems = [
    {
        title: '電子商務網站',
        category: 'frontend',
        image: '../assets/portfolio7.jpg',
        description: '全功能電子商務平台，包含商品展示、購物車、支付流程等功能。',
        link: '#',
        featured: false
    },
    {
        title: '數據可視化界面',
        category: 'ui',
        image: '../assets/portfolio8.jpg',
        description: '企業級數據可視化儀表板設計，直觀展示複雜數據和業務指標。',
        link: '#',
        featured: false
    },
    {
        title: '推薦系統',
        category: 'ai',
        image: '../assets/portfolio9.jpg',
        description: '基於用戶行為的內容推薦系統，提高用戶參與度和轉化率。',
        link: '#',
        featured: false
    }
];

// 作品集篩選功能
const portfolioGrid = document.querySelector('.portfolio-grid');
const filterButtons = document.querySelectorAll('.filter-btn');

// 渲染作品集
function renderPortfolio(items) {
    portfolioGrid.innerHTML = '';

    items.forEach(item => {
        const portfolioItem = document.createElement('div');
        portfolioItem.className = 'portfolio-item';
        portfolioItem.dataset.category = item.category;

        // 分類標籤
        const tagName = getCategoryName(item.category);

        portfolioItem.innerHTML = `
            <span class="portfolio-tag">${tagName}</span>
            <img src="${item.image}" alt="${item.title}" loading="lazy">
            <div class="portfolio-content">
                <h3 class="portfolio-title">${item.title}</h3>
                <p class="portfolio-description">${item.description}</p>
                <a href="${item.link}" target="_blank" class="portfolio-link">
                    <div class="svg-wrapper-1">
                        <div class="svg-wrapper">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                <path fill="none" d="M0 0h24v24H0z"></path>
                                <path fill="currentColor" d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"></path>
                            </svg>
                        </div>
                    </div>
                    <span>查看詳情</span>
                </a>
            </div>
        `;

        portfolioGrid.appendChild(portfolioItem);
    });

    // 添加載入動畫
    setTimeout(() => {
        document.querySelectorAll('.portfolio-item').forEach(item => {
            item.style.opacity = '1';
        });
    }, 100);
}

// 獲取分類名稱
function getCategoryName(category) {
    switch(category) {
        case 'frontend':
            return '前端開發';
        case 'ui':
            return 'UI設計';
        case 'ai':
            return 'AI專案';
        default:
            return '其他';
    }
}

// 初始渲染
document.addEventListener('DOMContentLoaded', () => {
    // 預設只顯示精選作品
    const featuredItems = portfolioItems.filter(item => item.featured);
    renderPortfolio(featuredItems);

    // 渲染技能條
    renderSkillBars();

    // 處理滾動動畫
    handleScroll();

    // 初始化載入更多按鈕
    initLoadMoreButton();
});

// 篩選功能
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.dataset.filter;

        // 更新按鈕狀態
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // 獲取當前已載入的所有作品（包括更多載入的）
        const allItems = [...portfolioItems, ...loadedMoreItems];

        // 篩選並渲染作品
        const filteredItems = filter === 'all'
            ? allItems
            : allItems.filter(item => item.category === filter);

        renderPortfolio(filteredItems);
    });
});

// 已載入的更多作品
let loadedMoreItems = [];

// 初始化載入更多按鈕
function initLoadMoreButton() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (!loadMoreBtn) return;

    loadMoreBtn.addEventListener('click', function() {
        this.classList.add('loading');
        this.innerHTML = '<span>載入中...</span><i class="fas fa-spinner fa-spin"></i>';

        // 模擬載入過程
        setTimeout(() => {
            // 添加更多作品
            loadedMoreItems = morePortfolioItems;

            // 獲取當前活躍的過濾器
            const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;

            // 合併原有作品和新載入的作品
            const allItems = [...portfolioItems, ...loadedMoreItems];

            // 根據當前過濾器篩選作品
            const filteredItems = activeFilter === 'all'
                ? allItems
                : allItems.filter(item => item.category === activeFilter);

            // 渲染作品
            renderPortfolio(filteredItems);

            // 更新按鈕狀態
            this.classList.remove('loading');
            this.innerHTML = '已載入所有作品';
            this.disabled = true;
        }, 1500);
    });
}

// 技能數據
const skills = {
    frontend: [
        { name: 'HTML/CSS', level: 90 },
        { name: 'JavaScript', level: 85 },
        { name: 'React', level: 80 },
        { name: 'Vue', level: 75 }
    ],
    backend: [
        { name: 'Node.js', level: 70 },
        { name: 'Python', level: 65 },
        { name: 'Go', level: 60 }
    ],
    tools: [
        { name: 'Git', level: 85 },
        { name: 'Docker', level: 70 },
        { name: 'Figma', level: 75 }
    ]
};

// 渲染技能條
function renderSkillBars() {
    const categories = ['frontend', 'backend', 'tools'];
    categories.forEach(category => {
        const container = document.querySelector(`[data-category="${category}"] .skill-bars`);
        if (!container) return;

        container.innerHTML = skills[category].map(skill => `
            <div class="skill-bar">
                <div class="skill-info">
                    <span>${skill.name}</span>
                    <span>${skill.level}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress" style="width: ${skill.level}%"></div>
                </div>
            </div>
        `).join('');
    });
}

// 聯繫表單處理
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // 獲取表單數據
        const formData = new FormData(this);
        const formValues = Object.fromEntries(formData.entries());

        // 這裡可以添加表單驗證邏輯

        // 顯示成功訊息
        alert('感謝您的訊息！我會盡快回覆您。');

        // 重置表單
        this.reset();
    });
}

// 監聽滾動事件，實現動畫效果
function handleScroll() {
    const elements = document.querySelectorAll('.section');
    elements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;

        if (isVisible) {
            element.classList.add('visible');
        }
    });
}

// 平滑滾動到指定位置
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        window.scrollTo({
            top: section.offsetTop - 80,
            behavior: 'smooth'
        });
    }
}

// 添加滾動事件監聽器
window.addEventListener('scroll', handleScroll);

// 頁面載入時顯示導航欄陰影
window.addEventListener('load', () => {
    document.querySelector('.navbar').classList.add('scrolled');
});

// 導航欄滾動效果
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});