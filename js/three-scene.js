// === THREE.JS СЦЕНА В HERO ===

(function () {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    // Сцена
    const scene = new THREE.Scene();

    // Камера
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 5;

    // Рендерер
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,       // прозрачный фон
        antialias: true    // сглаживание
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // === Объекты ===

    // 1. Главный икосаэдр (wireframe)
    const icoGeometry = new THREE.IcosahedronGeometry(1.8, 1);
    const icoMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff88,
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });
    const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
    icosahedron.position.set(2.5, 0, 0); // смещён вправо
    scene.add(icosahedron);

    // 2. Внутренний икосаэдр (сплошной, маленький)
    const innerGeometry = new THREE.IcosahedronGeometry(0.8, 1);
    const innerMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff88,
        wireframe: true,
        transparent: true,
        opacity: 0.08
    });
    const innerIco = new THREE.Mesh(innerGeometry, innerMaterial);
    innerIco.position.set(2.5, 0, 0);
    scene.add(innerIco);

    // 3. Кольцо (торус)
    const torusGeometry = new THREE.TorusGeometry(2.5, 0.02, 16, 100);
    const torusMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff88,
        transparent: true,
        opacity: 0.1
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.set(2.5, 0, 0);
    torus.rotation.x = Math.PI / 3;
    scene.add(torus);

    // 4. Частицы (точки вокруг)
    const particlesCount = 300;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 15;
    }

    particlesGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
        color: 0x00ff88,
        size: 0.02,
        transparent: true,
        opacity: 0.6
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // === Реакция на мышь ===
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // === Ресайз ===
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // === Анимация ===
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const elapsed = clock.getElapsedTime();

        // Вращение икосаэдра
        icosahedron.rotation.x = elapsed * 0.15 + mouseY * 0.3;
        icosahedron.rotation.y = elapsed * 0.2 + mouseX * 0.3;

        // Внутренний — в обратную сторону
        innerIco.rotation.x = -elapsed * 0.25 + mouseY * 0.2;
        innerIco.rotation.y = -elapsed * 0.3 + mouseX * 0.2;

        // Кольцо
        torus.rotation.z = elapsed * 0.1;
        torus.rotation.x = Math.PI / 3 + mouseY * 0.1;

        // Частицы медленно крутятся
        particles.rotation.y = elapsed * 0.02;
        particles.rotation.x = elapsed * 0.01;

        // Камера слегка следует за мышью
        camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 0.3 - camera.position.y) * 0.05;
        camera.lookAt(1.5, 0, 0);

        renderer.render(scene, camera);
    }

    animate();
})();