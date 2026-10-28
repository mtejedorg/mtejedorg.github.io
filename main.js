/* Marco Tejedor portfolio: theme, navigation, filters, modals, contact. No analytics, no trackers. */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNav();
    initDiagrams();
    initProjectFilters();
    initProjectModals();
    initEmail();
});

/* Theme ------------------------------------------------------------------ */
function initTheme() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        try { localStorage.setItem('theme', next); } catch (e) { /* private mode */ }
    });
}

/* Navigation -------------------------------------------------------------- */
function initNav() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');

    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (!toggle || !links) return;
    const setOpen = (open) => {
        links.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    toggle.addEventListener('click', () => setOpen(!links.classList.contains('open')));
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
}

/* Schematic diagrams (inline SVG for internal work without public captures) */
const diagrams = {
    xtadium: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
        <text x="200" y="20" text-anchor="middle" class="diag-caption">Multi-view VR sports streaming</text>
        <g transform="translate(140,50)">
            <rect x="0" y="20" width="120" height="60" rx="20" class="diag-fill-3"/>
            <circle cx="30" cy="50" r="14" class="diag-fill-outline"/>
            <circle cx="90" cy="50" r="14" class="diag-fill-outline"/>
            <rect x="50" y="10" width="20" height="14" rx="4" class="diag-fill-outline"/>
        </g>
        <circle cx="335" cy="45" r="5" class="diag-node-dot"/>
        <text x="335" y="65" text-anchor="middle" class="diag-caption">Live</text>
        <rect x="40" y="150" width="55" height="26" rx="5" class="diag-fill-outline"/>
        <text x="67" y="167" text-anchor="middle" class="diag-label-xs">CAM 1</text>
        <rect x="105" y="150" width="55" height="26" rx="5" class="diag-fill-1"/>
        <text x="132" y="167" text-anchor="middle" class="diag-label-xs">CAM 2</text>
        <rect x="170" y="150" width="55" height="26" rx="5" class="diag-fill-outline"/>
        <text x="197" y="167" text-anchor="middle" class="diag-label-xs">CAM 3</text>
        <rect x="235" y="150" width="80" height="26" rx="5" class="diag-fill-outline"/>
        <text x="275" y="167" text-anchor="middle" class="diag-label-xs">180° / 360°</text>
    </svg>`,
    sdk: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
        <rect x="40" y="140" width="320" height="36" rx="6" class="diag-fill-1"/>
        <text x="200" y="163" text-anchor="middle" class="diag-label">C++ core · Vulkan / OpenGL ES plugins</text>
        <rect x="40" y="94" width="320" height="36" rx="6" class="diag-fill-2"/>
        <text x="200" y="117" text-anchor="middle" class="diag-label">Java / Kotlin bridge (Android) · Swift layer (iOS)</text>
        <rect x="40" y="48" width="320" height="36" rx="6" class="diag-fill-3"/>
        <text x="200" y="71" text-anchor="middle" class="diag-label">Unity · C# app layer</text>
        <line x1="200" y1="48" x2="200" y2="22" class="diag-line"/>
        <text x="200" y="16" text-anchor="middle" class="diag-caption">White-label client apps</text>
    </svg>`,
    ai: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
        <line x1="70" y1="100" x2="330" y2="100" class="diag-line-dashed"/>
        <circle cx="70" cy="100" r="34" class="diag-node"/>
        <text x="70" y="104" text-anchor="middle" class="diag-label-sm">Query</text>
        <circle cx="157" cy="100" r="34" class="diag-node"/>
        <text x="157" y="97" text-anchor="middle" class="diag-label-sm">Retrieval</text>
        <text x="157" y="111" text-anchor="middle" class="diag-label-xs">video RAG</text>
        <circle cx="244" cy="100" r="34" class="diag-node"/>
        <text x="244" y="97" text-anchor="middle" class="diag-label-sm">Agents</text>
        <text x="244" y="111" text-anchor="middle" class="diag-label-xs">ADK · Gemini</text>
        <circle cx="331" cy="100" r="34" class="diag-node"/>
        <text x="331" y="104" text-anchor="middle" class="diag-label-sm">Tools</text>
        <text x="200" y="175" text-anchor="middle" class="diag-caption">FastAPI on Cloud Run · Vertex AI embeddings</text>
    </svg>`,
    spatial: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
        <circle cx="140" cy="100" r="20" class="diag-ring"/>
        <circle cx="140" cy="100" r="45" class="diag-ring diag-ring-2"/>
        <circle cx="140" cy="100" r="70" class="diag-ring diag-ring-3"/>
        <circle cx="140" cy="100" r="4" class="diag-node-dot"/>
        <g transform="translate(230,85)">
            <rect x="0" y="10" width="34" height="22" rx="8" class="diag-fill-outline"/>
            <rect x="46" y="10" width="34" height="22" rx="8" class="diag-fill-outline"/>
            <line x1="34" y1="21" x2="46" y2="21" class="diag-line"/>
            <line x1="-10" y1="18" x2="0" y2="18" class="diag-line"/>
            <line x1="80" y1="18" x2="90" y2="18" class="diag-line"/>
        </g>
        <text x="200" y="170" text-anchor="middle" class="diag-caption">Meta Spatial SDK · Android XR · smart glasses</text>
    </svg>`,
    tools: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
        <rect x="160" y="80" width="80" height="40" rx="6" class="diag-fill-1"/>
        <text x="200" y="104" text-anchor="middle" class="diag-label-sm">DI container</text>
        <rect x="30" y="20" width="90" height="34" rx="6" class="diag-fill-outline"/>
        <text x="75" y="41" text-anchor="middle" class="diag-label-xs">CMS contracts</text>
        <rect x="280" y="20" width="90" height="34" rx="6" class="diag-fill-outline"/>
        <text x="325" y="41" text-anchor="middle" class="diag-label-xs">Addressables</text>
        <rect x="155" y="146" width="90" height="34" rx="6" class="diag-fill-outline"/>
        <text x="200" y="167" text-anchor="middle" class="diag-label-xs">Generated UI</text>
        <line x1="120" y1="45" x2="180" y2="85" class="diag-line"/>
        <line x1="280" y1="45" x2="230" y2="85" class="diag-line"/>
        <line x1="200" y1="120" x2="200" y2="146" class="diag-line"/>
    </svg>`,
    euicc: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
        <text x="200" y="20" text-anchor="middle" class="diag-caption">Hardware-in-the-loop tooling</text>
        <rect x="155" y="80" width="90" height="40" rx="6" class="diag-fill-2"/>
        <text x="200" y="98" text-anchor="middle" class="diag-label-sm">C++ eUICC</text>
        <text x="200" y="112" text-anchor="middle" class="diag-label-sm">emulator</text>
        <g transform="translate(30,75)">
            <rect x="0" y="0" width="80" height="50" rx="6" class="diag-fill-outline"/>
            <rect x="10" y="10" width="18" height="14" rx="2" class="diag-fill-1"/>
            <text x="40" y="42" text-anchor="middle" class="diag-label-xs">eUICC card</text>
        </g>
        <rect x="290" y="30" width="90" height="34" rx="6" class="diag-fill-outline"/>
        <text x="335" y="51" text-anchor="middle" class="diag-label-xs">.NET / C# tools</text>
        <rect x="290" y="136" width="90" height="34" rx="6" class="diag-fill-outline"/>
        <text x="335" y="157" text-anchor="middle" class="diag-label-xs">VB utilities</text>
        <line x1="110" y1="100" x2="155" y2="100" class="diag-line"/>
        <line x1="245" y1="90" x2="290" y2="55" class="diag-line"/>
        <line x1="245" y1="110" x2="290" y2="150" class="diag-line"/>
    </svg>`
};

function initDiagrams() {
    document.querySelectorAll('[data-diagram]').forEach(el => {
        const svg = diagrams[el.getAttribute('data-diagram')];
        if (svg) el.innerHTML = svg;
    });
}

/* Filters ----------------------------------------------------------------- */
function initProjectFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            cards.forEach(card => {
                const cats = (card.getAttribute('data-category') || '').split(/\s+/);
                card.style.display = (filter === 'all' || cats.includes(filter)) ? '' : 'none';
            });
        });
    });
}

/* Modals ------------------------------------------------------------------ */
const modalData = {
    'modal-cluckwars': {
        title: 'Cluck Wars',
        badge: 'Solo · built with AI agents · in development (2026)',
        visual: `<div class="modal-strip">
            <img src="assets/cluckwars_menu.jpg" alt="Cluck Wars main menu with the four classes" loading="lazy">
            <img src="assets/cluckwars_postmatch.jpg" alt="Cluck Wars post-match standings screen" loading="lazy">
        </div>`,
        tech: ['Unity 6', 'URP', 'Photon Fusion 2 (shared mode)', 'Unity Gaming Services', 'Zenject', 'UI Toolkit', 'Unity MCP'],
        links: [{ label: 'GitHub ↗', url: 'https://github.com/mtejedorg/CluckWars' }],
        description: `
            <p>Four chickens, one farm, forty-five seconds. A 4-player free-for-all where players collect food, bank it at their base and steal from rivals. First to forty units, or the most food when the clock runs out, wins. Designed and engineered solo, with AI coding agents (Claude Code, Unity MCP) doing a real share of the typing.</p>
            <h4>What's inside</h4>
            <ul>
                <li><strong>Networking:</strong> Photon Fusion 2 in shared mode. Each player's state authority owns their chicken; a steal is credited optimistically by the thief and clamped by the victim's authority. Lobby, relay and authentication on Unity Gaming Services.</li>
                <li><strong>Classes and abilities:</strong> four classes (Fatty, Speedy, Warrior, Assassin) and a shared pool of steal, control, defense and utility abilities, all data-driven through ScriptableObjects.</li>
                <li><strong>Balance from data:</strong> every number in the design docs ships straight from the game's own data files, so design and implementation cannot drift apart.</li>
                <li><strong>Architecture:</strong> Zenject dependency injection, hierarchical state machines, a 4-slot ability loadout with targeting, cooldowns and hitboxes, and a meta-progression layer (journal, economy, unlock contracts).</li>
            </ul>`
    },
    'modal-saintmanick': {
        title: 'Saint Manick',
        badge: 'Solo · built with AI agents · in development (2026)',
        visual: `<div class="modal-visual"><img src="assets/saintmanick_capstone_2017.jpg" alt="The 2017 Unity capstone prototype of Saint Manick" loading="lazy"></div>`,
        tech: ['Godot 4.6', 'GDScript', 'Hierarchical state machines', 'Hitbox / hurtbox components', 'Rhythm conductor', 'Automated tests'],
        links: [{ label: 'GitHub ↗', url: 'https://github.com/mtejedorg/SaintManick2026' }],
        description: `
            <p>A 2.5D action roguelite beat 'em up. Nick, an android combat unit, fights through ten zones where the camera shifts between side-scrolling and top-down bullet-hell. The picture is the 2017 Unity capstone from my master's, which this project rebuilds from scratch in Godot 4; a capture of the current build is coming.</p>
            <h4>What's inside</h4>
            <ul>
                <li><strong>Vertical slice:</strong> all ten zones, two bosses, a roguelite meta-loop, and a data-driven shop and combo skill tree.</li>
                <li><strong>Beat-driven combat:</strong> a tempo "Conductor" drives every hazard and enemy telegraph off a variable-BPM clock. The player is never forced to act on the beat; the enemies are.</li>
                <li><strong>Game feel:</strong> hit-stop micro-pauses, procedural screenshake, a VFX manager and dynamic audio buses.</li>
                <li><strong>Self-verifying:</strong> an automated suite of 100 tests plus a headless smoke run that catches scene and shader regressions.</li>
            </ul>`
    },
    'modal-xtadium': {
        title: 'Xtadium, VR live sports',
        badge: 'YBVR · shipped on Meta Quest, 2022',
        visual: `<div class="modal-visual"><div class="diagram-visual">${diagrams.xtadium}</div></div>`,
        tech: ['Unity', 'C#', 'Meta Quest', 'PICO', 'OpenXR', 'Meta XR SDK', 'Compositor Layers', 'Photon Realtime / Voice'],
        links: [
            { label: 'SportsPro coverage ↗', url: 'https://www.sportspro.com/news/broadcast-ott/euroleague-tv-ybvr-virtual-reality-vr-xtadium-meta-quest-real-madrid-barcelona/' },
            { label: 'ybvr.com ↗', url: 'https://ybvr.com/' }
        ],
        description: `
            <p>Live sport and music in VR and MR on Meta Quest, with the viewer in control: multi-camera switching, immersive 180°/360° streams, and a flat 2D option. I led the client side from prototype through release and live iteration, and built the team that shipped it. Xtadium carried NBA games for some years, its flagship content, alongside EuroLeague fixtures such as Real Madrid–Barcelona, streamed at a steady 8K and 60 fps.</p>
            <h4>What I owned</h4>
            <ul>
                <li><strong>Client architecture:</strong> Unity 2022.3 LTS and Unity 6, ScriptableObject-based, with the whole UI generated from CMS contracts and server state so layouts changed without a release.</li>
                <li><strong>Performance:</strong> firm 60 fps on the Oculus Go and 90/120 Hz on Quest, with video and key UI on Compositor Layers, SRP batching, occlusion culling and zero-allocation async.</li>
                <li><strong>Watch Party:</strong> multi-user sessions on Photon Realtime and Voice with sub-frame video synchronization across clients.</li>
                <li><strong>Live ops:</strong> Remote Config, feature flags, A/B testing, event-tied content drops through Addressables, Meta in-app purchases, telemetry over WebSockets.</li>
                <li><strong>In the press:</strong> EuroLeague's Real Madrid–Barcelona broadcast in VR via Xtadium; live at the Mutua Madrid Open.</li>
            </ul>`
    },
    'modal-sdk': {
        title: 'Native multi-platform SDK',
        badge: 'YBVR · Unity SDK 2019, Android 2021, iOS 2023',
        visual: `<div class="modal-visual"><div class="diagram-visual">${diagrams.sdk}</div></div>`,
        tech: ['C++', 'Java', 'Kotlin', 'C#', 'Vulkan', 'OpenGL ES', 'ExoPlayer / Media3', 'JNI'],
        links: [],
        description: `
            <p>The engineering layer under Xtadium and YBVR's white-label apps: one native core reused across products instead of tied to any single app. I architected it and wrote most of the native rendering side; the iOS Swift layer I supervised.</p>
            <h4>What's inside</h4>
            <ul>
                <li><strong>Rendering plugins:</strong> Vulkan and OpenGL ES C++ plugins behind Unity's native graphics interface, streaming raw video buffers to the GPU with no garbage-collection overhead.</li>
                <li><strong>Projection meshes:</strong> parametric meshes for equirectangular 360 and 180, fisheye and equidome video, with UV remapping and border correction.</li>
                <li><strong>Video pipeline:</strong> ExoPlayer 2 / Media3 customized with JNI extensions (FFmpeg, RTMP, AV1, FLAC), multi-camera sub-frame synchronization and live telemetry.</li>
                <li><strong>White label:</strong> partners re-skin client apps on the same core; the SDK also shipped for Android TV, and I onboarded the external teams integrating it.</li>
            </ul>`
    },
    'modal-ai': {
        title: 'Multi-agent AI assistant',
        badge: 'YBVR · in production since 2025',
        visual: `<div class="modal-visual"><div class="diagram-visual">${diagrams.ai}</div></div>`,
        tech: ['Google ADK', 'Vertex AI Search', 'Vector embeddings', 'Gemini API', 'RAG', 'FastAPI', 'Docker', 'Cloud Run', 'Firebase'],
        links: [],
        description: `
            <p>An assistant over YBVR's video catalogue, designed and launched from scratch. Production-ready in one month and used by real users since; I don't publish usage numbers.</p>
            <h4>What's inside</h4>
            <ul>
                <li><strong>Agents:</strong> coordinator and specialist agents on Google ADK with declarative tool schemas, structured validation (Pydantic) and multi-step tool execution.</li>
                <li><strong>Retrieval:</strong> a multimodal RAG pipeline over video embeddings (temporal chunking, frame extraction) in Vertex AI vector search, with metadata filtering.</li>
                <li><strong>Service:</strong> FastAPI microservices in Docker on Cloud Run, Firebase for state, secrets in GCP Secret Manager.</li>
                <li><strong>Operating it:</strong> model routing and prompt caching to keep token cost in check; offline synthetic prompt harnesses and mock agent runners for testing.</li>
            </ul>`
    },
    'modal-spatial': {
        title: 'Spatial and smart-glasses prototypes',
        badge: 'YBVR · 2025–2026 · prototypes',
        visual: `<div class="modal-visual"><div class="diagram-visual">${diagrams.spatial}</div></div>`,
        tech: ['Meta Spatial SDK', 'Android XR (Jetpack XR)', 'Kotlin', 'Camera2 / CameraX', 'BLE audio', 'VIVE Wave', 'XREAL'],
        links: [],
        description: `
            <p>Research prototypes to find out what the next platforms cost to support. A working build in the first week, a polished one in one to four weeks; the viable ideas went to production.</p>
            <h4>What's inside</h4>
            <ul>
                <li><strong>Spatial video:</strong> Meta Spatial SDK panels and custom video surfaces (GLXF, Birdseye), and Android XR with Jetpack XR.</li>
                <li><strong>Smart glasses:</strong> a Kotlin abstraction layer with hardware, display and interaction providers, a HUD coordinator, Camera2/CameraX frame capture, BLE audio routing, QR decoding and a voice assistant.</li>
                <li><strong>Other headsets:</strong> VIVE Wave and XREAL ports to measure effort.</li>
            </ul>`
    },
    'modal-tools': {
        title: 'Data-driven UI and editor tooling',
        badge: 'YBVR · shipped inside Xtadium',
        visual: `<div class="modal-visual"><div class="diagram-visual">${diagrams.tools}</div></div>`,
        tech: ['uGUI / TextMeshPro', 'UI Toolkit', 'ScriptableObjects', 'Zenject', 'Addressables', 'Unity editor tools'],
        links: [],
        description: `
            <p>Every layout change used to mean a new build and a store release. I rebuilt the UI as a procedurally generated system fed by CMS contracts and server state.</p>
            <h4>What's inside</h4>
            <ul>
                <li><strong>Generated UI:</strong> screens assembled at runtime from backend data, editable from a website and loaded instantly in the app; releases only for new features.</li>
                <li><strong>Responsiveness:</strong> menus about 90% more responsive than the previous application.</li>
                <li><strong>Foundations:</strong> dependency injection with Zenject, Addressables for remote content, assembly definitions, object pooling, and the editor tools that kept the workflow out of the build queue.</li>
            </ul>`
    },
    'modal-euicc': {
        title: 'eUICC emulator and desktop tooling',
        badge: 'Valid · 2017–2018',
        visual: `<div class="modal-visual"><div class="diagram-visual">${diagrams.euicc}</div></div>`,
        tech: ['C++', '.NET', 'C#', 'Visual Basic', 'eUICC'],
        links: [],
        description: `
            <p>Embedded SIMs (eUICC) are hard to test against real hardware all day. The team used a C++ emulator instead, and I maintained it along with the desktop tools built around it.</p>
            <h4>What I did</h4>
            <ul>
                <li><strong>Emulator:</strong> maintained the C++ Windows emulator that stood in for physical cards during development and QA.</li>
                <li><strong>Tools:</strong> built the .NET desktop applications (C#, VB) used to create, analyze and test eUICCs.</li>
            </ul>`
    }
};

function initProjectModals() {
    const backdrop = document.getElementById('modal-backdrop');
    const box = document.getElementById('modal-box');
    const body = document.getElementById('modal-body');
    const closeBtn = document.getElementById('modal-close');
    if (!backdrop || !body) return;

    let lastFocus = null;

    const close = () => {
        backdrop.classList.remove('open');
        backdrop.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lastFocus) lastFocus.focus();
    };

    const open = (id, trigger) => {
        const data = modalData[id];
        if (!data) return;
        lastFocus = trigger;
        const tech = data.tech.map(t => `<span class="tag">${t}</span>`).join('');
        const links = data.links.map(l => `<a class="btn btn-secondary" href="${l.url}" target="_blank" rel="noopener">${l.label}</a>`).join('');
        body.innerHTML = `
            <span class="modal-badge">${data.badge}</span>
            <h2 id="modal-title">${data.title}</h2>
            ${data.visual}
            <div class="tech-tags" style="margin-bottom:1rem;">${tech}</div>
            ${data.description}
            ${links ? `<div class="modal-links">${links}</div>` : ''}`;
        backdrop.classList.add('open');
        backdrop.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        box.scrollTop = 0;
        closeBtn.focus();
    };

    document.querySelectorAll('.view-project-btn').forEach(btn => {
        btn.addEventListener('click', () => open(btn.getAttribute('data-modal'), btn));
    });
    closeBtn.addEventListener('click', close);
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && backdrop.classList.contains('open')) close(); });
}

/* Email: assembled at runtime so the address is not sitting in the HTML as text. */
function buildAddress(el) {
    return `${el.dataset.user}@${el.dataset.host}.${el.dataset.tld}`;
}

function initEmail() {
    document.querySelectorAll('.copy-email').forEach(btn => {
        btn.addEventListener('click', async () => {
            const address = buildAddress(btn);
            const label = btn.querySelector('.copy-text');
            try {
                await navigator.clipboard.writeText(address);
                label.textContent = 'Copied';
            } catch (e) {
                label.textContent = address;
            }
            setTimeout(() => { label.textContent = 'Copy email'; }, 2500);
        });
    });

    document.querySelectorAll('.contact-email').forEach(btn => {
        btn.addEventListener('click', () => {
            const address = buildAddress(btn);
            const text = btn.querySelector('.email-text');
            if (text) text.textContent = address;
            window.location.href = `mailto:${address}`;
        });
    });
}
