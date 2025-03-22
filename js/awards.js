document.addEventListener('DOMContentLoaded', function() {
    // 處理獎盃展示點擊
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').src;
            const imgTitle = this.querySelector('.gallery-overlay p').textContent;
            showImageModal(imgSrc, imgTitle);
        });
    });

    // 處理評語卡片點擊
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('expanded');
        });
    });

    // 圖片模態視窗功能
    function showImageModal(src, title) {
        // 創建模態視窗
        const modal = document.createElement('div');
        modal.className = 'award-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h3>${title}</h3>
                <img src="${src}" alt="${title}">
            </div>
        `;
        document.body.appendChild(modal);

        // 關閉模態視窗
        modal.querySelector('.close-modal').addEventListener('click', function() {
            document.body.removeChild(modal);
        });

        // 點擊背景也關閉
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
});