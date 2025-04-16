const canvas = document.getElementById('globe');
const ctx = canvas.getContext('2d');
const wrapper = document.getElementById('globe-wrapper');

const NAME = 'yM oiloftroP';

let rotationX = 0;
let rotationY = 0;
let dragRotationX = 0;
let dragRotationY = 0;
let isDragging = false;
let lastX = 0, lastY = 0;

const ROTATION_SPEED_Y = 0.01;
const ROTATION_SPEED_X = 0;

const devicePixelRatio = window.devicePixelRatio || 1;

function resizeCanvas() {
    const size = wrapper.clientWidth * devicePixelRatio;
    canvas.width = size;
    canvas.height = size;
    canvas.style.width = wrapper.clientWidth + 'px';
    canvas.style.height = wrapper.clientHeight + 'px';
    return size;
}

// 🌍 Create stable 3D points for the globe
function generatePoints() {
    const layers = 12;
    const chars = NAME.trim().split('');
    let index = 0;
    const points = [];

    for (let i = 0; i < layers; i++) {
        const lat = Math.PI * (i / (layers - 1) - 0.5); // from -π/2 to π/2
        const radius = Math.cos(lat);
        const y = Math.sin(lat);

        const count = Math.round(10 + radius * chars.length);
        for (let j = 0; j < count; j++) {
            const lng = 2 * Math.PI * (j / count);
            const x = Math.cos(lng) * radius;
            const z = Math.sin(lng) * radius;
            const char = chars[index % chars.length];
            points.push({ x, y, z, char });
            index++;
        }
    }

    return points;
}

const points = generatePoints();

function rotatePoint(p, rotX, rotY) {
    // Rotate around X axis
    let y = p.y * Math.cos(rotX) - p.z * Math.sin(rotX);
    let z1 = p.y * Math.sin(rotX) + p.z * Math.cos(rotX);

    // Rotate around Y axis
    let x = p.x * Math.cos(rotY) + z1 * Math.sin(rotY);
    let z = -p.x * Math.sin(rotY) + z1 * Math.cos(rotY);

    return { x, y, z };
}

function draw() {
    const size = resizeCanvas();
    const r = size / 2.5;
    const cx = size / 2;
    const cy = size / 2;

    ctx.clearRect(0, 0, size, size);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const rotated = points.map(p => {
        const { x, y, z } = rotatePoint(p, rotationX, rotationY);
        return { ...p, x, y, z };
    });

    rotated.sort((a, b) => a.z - b.z); // depth sort

    rotated.forEach((p, idx) => {
        if (p.z > 0) {
            const projX = cx + r * p.x;
            const projY = cy + r * p.y;
            const scale = 0.7 + p.z * 0.6;
            const alpha = 0.3 + 0.7 * p.z;

            ctx.globalAlpha = alpha;

            // ✨ Color glow like original
            const hue = (rotationY * 100 + p.x * 100 + p.y * 100) % 360;
            ctx.fillStyle = `hsl(${hue}, 85%, 65%)`;
            ctx.font = `${14 * scale}px 'Segoe UI', sans-serif`;
            ctx.fillText(p.char, projX, projY);
        }
    });

    ctx.globalAlpha = 1;
}

function animate() {
    if (!isDragging) {
        rotationY += ROTATION_SPEED_Y;
        rotationX += ROTATION_SPEED_X;
    }

    rotationY += dragRotationY;
    rotationX += dragRotationX;

    dragRotationY *= 0.95;
    dragRotationX *= 0.95;

    draw();
    requestAnimationFrame(animate);
}

// 🖱 Mouse interaction
canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
});
canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        dragRotationY += dx * 0.005;
        dragRotationX += dy * 0.005;
        lastX = e.clientX;
        lastY = e.clientY;
    }
});
canvas.addEventListener('mouseup', () => { isDragging = false; });
canvas.addEventListener('mouseleave', () => { isDragging = false; });

// 📱 Touch interaction
canvas.addEventListener('touchstart', (e) => {
    isDragging = true;
    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
});
canvas.addEventListener('touchmove', (e) => {
    if (isDragging) {
        const dx = e.touches[0].clientX - lastX;
        const dy = e.touches[0].clientY - lastY;
        dragRotationY += dx * 0.005;
        dragRotationX += dy * 0.005;
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
    }
});
canvas.addEventListener('touchend', () => { isDragging = false; });

// 🚀 Start animation
resizeCanvas();
animate();
window.addEventListener('resize', resizeCanvas);
