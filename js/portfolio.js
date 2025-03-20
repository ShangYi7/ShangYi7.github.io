// 作品集篩選功能模組
const PortfolioFilter = {
    init: () => {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                PortfolioFilter.updateActiveButton(btn);
                PortfolioFilter.filterItems(filter);
            });
        });
    },

    updateActiveButton: (activeBtn) => {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    },

    filterItems: (filter) => {
        const items = document.querySelectorAll('.portfolio-item');
        const grid = document.querySelector('.portfolio-grid');
        
        grid.style.opacity = '0';
        setTimeout(() => {
            items.forEach(item => {
                const tags = item.dataset.tags.split(' ');
                const match = filter === 'all' || tags.includes(filter);
                item.style.display = match ? 'flex' : 'none';
                if(match) item.classList.add('animate__animated', 'animate__fadeIn');
            });
            grid.style.opacity = '1';
        }, 300);
    }
};

// 初始化模組
// 延遲載入設定
const lazyLoadObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            lazyLoadObserver.unobserve(img);
        }
    });
}, {rootMargin: '200px 0px'});

// 動態生成作品項目
async function generatePortfolioItems() {
    const items = await fetch('/js/portfolio-data.json')
        .then(response => response.json())
        .catch(error => {
            console.error('無法載入作品數據:', error);
            return [];
        });
    
    items.forEach(item => {
        const portfolioItem = document.createElement('div');
        portfolioItem.className = 'portfolio-item';
        portfolioItem.dataset.tags = item.category;
        
        const tagName = item.category === 'web' ? '網頁設計' : 
                      item.category === 'app' ? '應用程式' : 
                      item.category === 'design' ? '平面設計' : '其他';

        portfolioItem.innerHTML = `
            <span class="portfolio-tag">${tagName}</span>
            <img src="${item.image}" alt="${item.title}" loading="lazy">
            <div class="portfolio-content">
                <h3 class="portfolio-title">${item.title}</h3>
                <p class="portfolio-description">${item.description}</p>
                <a href="${item.link}" target="_blank" class="portfolio-link">
                    <div class="svg-wrapper-1">
                        <div class="svg-wrapper">
                            ${document.querySelector('.portfolio-link svg').outerHTML}
                        </div>
                    </div>
                    <span>查看詳情</span>
                </a>
            </div>
        `;
        
        document.querySelector('.portfolio-grid').appendChild(portfolioItem);
        lazyLoadObserver.observe(portfolioItem.querySelector('img'));
    });
}

document.addEventListener('DOMContentLoaded', () => {
    PortfolioFilter.init();
    generatePortfolioItems();
    
    // 動畫性能優化
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.portfolio-item').forEach(item => {
        observer.observe(item);
    });
});