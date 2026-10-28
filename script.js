document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    const toggleMenu = () => {
        const isOpen = navLinks.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', String(isOpen));
    };

    hamburger.addEventListener('click', toggleMenu);
    navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    }));

    const toolkitBackground = document.querySelector('#toolkit-background');
    const soundToggle = document.querySelector('.ambient-sound-toggle');
    if (toolkitBackground) {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const technologies = [
            ['devicon-cplusplus-plain colored', 'C++'],
            ['devicon-python-plain colored', 'Python'],
            ['devicon-javascript-plain colored', 'JavaScript'],
            ['devicon-c-plain colored', 'C'],
            ['devicon-fastapi-plain colored', 'FastAPI'],
            ['devicon-nodejs-plain colored', 'Node.js'],
            ['devicon-postgresql-plain colored', 'PostgreSQL'],
            ['devicon-mongodb-plain colored', 'MongoDB'],
            ['devicon-sqlalchemy-plain colored', 'SQLAlchemy'],
            ['devicon-mongoose-plain colored', 'Mongoose'],
            ['devicon-git-plain colored', 'Git'],
            ['devicon-github-original', 'GitHub'],
            ['devicon-docker-plain colored', 'Docker'],
            ['devicon-linux-plain colored', 'Linux'],
            ['devicon-pytest-plain colored', 'Pytest']
        ];
        const iconSize = 42;
        const radius = iconSize / 1;
        const minDistance = iconSize + 12;
        const padding = minDistance / 2;
        const particles = technologies.map(([iconClass, name]) => {
            const element = document.createElement('span');
            element.className = 'floating-tech';
            element.title = name;
            element.innerHTML = `<i class="${iconClass}" aria-hidden="true"></i>`;
            toolkitBackground.append(element);
            return { element, x: 0, y: 0, vx: 0, vy: 0 };
        });
        let width = window.innerWidth;
        let height = window.innerHeight;
        let frameId;
        let lastFrame = 0;

        const randomVelocity = () => (Math.random() * 2 - 1) * 40;
        const isClear = (x, y, placed) => placed.every(particle =>
            Math.hypot(particle.x - x, particle.y - y) >= minDistance
        );

        const arrangeParticles = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            const placed = [];
            const candidates = [];
            for (let attempt = 0; attempt < particles.length * 180; attempt += 1) {
                const x = padding + Math.random() * Math.max(0, width - padding * 2);
                const y = padding + Math.random() * Math.max(0, height - padding * 2);
                if (isClear(x, y, placed)) placed.push({ x, y });
                if (placed.length === particles.length) break;
            }

            if (placed.length < particles.length) {
                const columns = Math.max(1, Math.floor((width - padding * 2) / minDistance));
                const rows = Math.ceil(particles.length / columns);
                candidates.length = 0;
                for (let row = 0; row < rows; row += 1) {
                    for (let column = 0; column < columns; column += 1) {
                        candidates.push({
                            x: padding + column * minDistance,
                            y: padding + row * minDistance
                        });
                    }
                }
                candidates.sort(() => Math.random() - 0.5);
                placed.splice(0, placed.length, ...candidates.slice(0, particles.length));
            }

            particles.forEach((particle, index) => {
                particle.x = Math.min(width - radius, Math.max(radius, placed[index].x));
                particle.y = Math.min(height - radius, Math.max(radius, placed[index].y));
                particle.vx = randomVelocity();
                particle.vy = randomVelocity();
                particle.element.style.transform = `translate3d(${particle.x - radius}px, ${particle.y - radius}px, 0)`;
            });
        };

        const animate = timestamp => {
            if (!lastFrame) lastFrame = timestamp;
            const delta = Math.min((timestamp - lastFrame) / 1000, 0.04);
            lastFrame = timestamp;

            particles.forEach(particle => {
                particle.x += particle.vx * delta;
                particle.y += particle.vy * delta;
                if (particle.x < radius || particle.x > width - radius) particle.vx *= -1;
                if (particle.y < radius || particle.y > height - radius) particle.vy *= -1;
                particle.x = Math.min(width - radius, Math.max(radius, particle.x));
                particle.y = Math.min(height - radius, Math.max(radius, particle.y));
            });

            for (let left = 0; left < particles.length; left += 1) {
                for (let right = left + 1; right < particles.length; right += 1) {
                    const first = particles[left];
                    const second = particles[right];
                    const dx = second.x - first.x;
                    const dy = second.y - first.y;
                    const distance = Math.hypot(dx, dy);
                    if (distance >= minDistance) continue;

                    const angle = distance ? Math.atan2(dy, dx) : Math.random() * Math.PI * 2;
                    const overlap = (minDistance - distance) / 2;
                    const pushX = Math.cos(angle) * overlap;
                    const pushY = Math.sin(angle) * overlap;
                    first.x -= pushX;
                    first.y -= pushY;
                    second.x += pushX;
                    second.y += pushY;
                    [first.vx, second.vx] = [second.vx, first.vx];
                    [first.vy, second.vy] = [second.vy, first.vy];
                }
            }

            particles.forEach(particle => {
                particle.x = Math.min(width - radius, Math.max(radius, particle.x));
                particle.y = Math.min(height - radius, Math.max(radius, particle.y));
                particle.element.style.transform = `translate3d(${particle.x - radius}px, ${particle.y - radius}px, 0)`;
            });
            frameId = window.requestAnimationFrame(animate);
        };

        const startAnimation = () => {
            window.cancelAnimationFrame(frameId);
            lastFrame = 0;
            if (!reducedMotion.matches && !document.hidden) frameId = window.requestAnimationFrame(animate);
        };

        arrangeParticles();
        startAnimation();
        window.addEventListener('resize', () => {
            arrangeParticles();
            startAnimation();
        }, { passive: true });
        document.addEventListener('visibilitychange', startAnimation);
        reducedMotion.addEventListener?.('change', startAnimation);

        if (soundToggle) {
            let audioContext;
            const playClickSound = () => {
                if (!audioContext || audioContext.state !== 'running') return;
                const oscillator = audioContext.createOscillator();
                const gain = audioContext.createGain();
                const now = audioContext.currentTime;
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(920, now);
                oscillator.frequency.exponentialRampToValueAtTime(560, now + 0.07);
                gain.gain.setValueAtTime(0.0001, now);
                gain.gain.exponentialRampToValueAtTime(0.035, now + 0.008);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
                oscillator.connect(gain);
                gain.connect(audioContext.destination);
                oscillator.start(now);
                oscillator.stop(now + 0.1);
            };

            document.addEventListener('click', event => {
                if (soundToggle.getAttribute('aria-pressed') !== 'true') return;
                const control = event.target instanceof Element
                    ? event.target.closest('a, button, [role="button"]')
                    : null;
                if (control && control !== soundToggle) playClickSound();
            });

            soundToggle.addEventListener('click', async () => {
                const enabled = soundToggle.getAttribute('aria-pressed') !== 'true';
                soundToggle.setAttribute('aria-pressed', String(enabled));
                soundToggle.setAttribute('aria-label', `Turn click sounds ${enabled ? 'off' : 'on'}`);
                soundToggle.title = `Turn click sounds ${enabled ? 'off' : 'on'}`;
                soundToggle.innerHTML = `<i class="fas ${enabled ? 'fa-volume-high' : 'fa-volume-xmark'}" aria-hidden="true"></i>`;

                if (enabled) {
                    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                    if (!AudioContextClass) {
                        soundToggle.setAttribute('aria-pressed', 'false');
                        soundToggle.setAttribute('aria-label', 'Background sound is unavailable');
                        return;
                    }
                    audioContext ??= new AudioContextClass();
                    await audioContext.resume();
                    playClickSound();
                } else {
                    audioContext?.suspend();
                }
            });
        }
    }

    const observer = new IntersectionObserver((entries, instance) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                instance.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
});
