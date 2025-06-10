        let currentIndex = 0;
        let images = [];
        // initialize images array
        document.querySelectorAll('.gallery-item img').forEach(img => {
            images.push(img.src);
        });
        // open lightbox on image click
        document.querySelectorAll('.gallery-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                currentIndex = index;
                document.getElementById('lightbox-img').src = images[currentIndex];
                document.getElementById('lightbox').style.display = 'flex';
                document.body.style.overflow = 'hidden';
            });
        });
        // close lightbox
        function closeLightbox() {
            document.getElementById('lightbox').style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        // navigate images
        function changeImage(direction) {
            currentIndex += direction;
            if (currentIndex >= images.length) currentIndex = 0;
            if (currentIndex < 0) currentIndex = images.length - 1;
            document.getElementById('lightbox-img').src = images[currentIndex];
        }
        // close on background click
        document.getElementById('lightbox').addEventListener('click', (e) => {
            if (e.target.id === 'lightbox') closeLightbox();
        });
        // filter functionality
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // remove active class from all buttons
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                // add active class to clicked button
                btn.classList.add('active');
            });
        });
        // keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (document.getElementById('lightbox').style.display === 'flex') {
                if (e.key === 'ArrowLeft') changeImage(-1);
                if (e.key === 'ArrowRight') changeImage(1);
                if (e.key === 'Escape') closeLightbox();
            }
        });
