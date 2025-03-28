
        const canvas = document.getElementById('globe');
        const ctx = canvas.getContext('2d');
        const wrapper = document.getElementById('globe-wrapper');

        const NAME = 'yM oiloftroP';
        let rotation = 0;
        const ROTATION_SPEED = -0.01;
        const devicePixelRatio = window.devicePixelRatio || 1;

        let isDragging = false;
        let lastX = 0;
        let dragRotation = 0;

        function resizeCanvas() {
            const size = wrapper.clientWidth * devicePixelRatio;
            canvas.width = size;
            canvas.height = size;
            canvas.style.width = wrapper.clientWidth + 'px';
            canvas.style.height = wrapper.clientHeight + 'px';
            return size;
        }

        function generateNameSphere() {
            const points = [];
            const layers = 8;
            const chars = NAME.trim().split('');
            let index = 0;

            for (let latIndex = 0; latIndex < layers; latIndex++) {
                const lat = -70 + (latIndex * 20);
                const charsInBand = chars.length + latIndex * 2;
                for (let i = 0; i < charsInBand; i++) {
                    const lng = (i / charsInBand) * 360 - 180;
                    const char = chars[index % chars.length];
                    points.push({ lat, lng, char });
                    index++;
                }
            }

            return points;
        }

        const points = generateNameSphere();

        function draw(rotation) {
            const size = resizeCanvas();
            const r = size / 2.5;
            const cx = size / 2;
            const cy = size / 2;

            ctx.clearRect(0, 0, size, size);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            points.forEach(p => {
                const phi = (90 - p.lat) * Math.PI / 180;
                const theta = (p.lng + rotation * 180 / Math.PI) * Math.PI / 180;

                const x = r * Math.sin(phi) * Math.cos(theta);
                const y = r * Math.cos(phi);
                const z = r * Math.sin(phi) * Math.sin(theta);

                if (z > 0) {
                    ctx.globalAlpha = 0.3 + 0.7 * (z / r);

                    const hue = (rotation * 100 + x + y) % 360;
                    const scale = 0.7 + (z / r) * 0.8;
                    ctx.fillStyle = `hsl(${hue}, 85%, 65%)`;
                    ctx.font = `${14 * scale}px 'Segoe UI', sans-serif`;

                    ctx.fillText(p.char, cx + x, cy + y);
                }
            });

            ctx.globalAlpha = 1;
        }

        function animate() {
            rotation += isDragging ? 0 : ROTATION_SPEED;
            rotation += dragRotation;
            dragRotation *= 0.95; // apply damping
            draw(rotation);
            requestAnimationFrame(animate);
        }

        // --- Mouse interaction ---
        canvas.addEventListener('mousedown', (e) => {
            isDragging = true;
            lastX = e.clientX;
        });

        canvas.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const deltaX = e.clientX - lastX;
                dragRotation += deltaX * 0.005;
                lastX = e.clientX;
            }
        });

        canvas.addEventListener('mouseup', () => {
            isDragging = false;
        });

        canvas.addEventListener('mouseleave', () => {
            isDragging = false;
        });

        // --- Touch interaction ---
        canvas.addEventListener('touchstart', (e) => {
            isDragging = true;
            lastX = e.touches[0].clientX;
        });

        canvas.addEventListener('touchmove', (e) => {
            if (isDragging) {
                const deltaX = e.touches[0].clientX - lastX;
                dragRotation += deltaX * 0.005;
                lastX = e.touches[0].clientX;
            }
        });

        canvas.addEventListener('touchend', () => {
            isDragging = false;
        });

        resizeCanvas();
        animate();
        window.addEventListener('resize', resizeCanvas);
