/* Skills constellation, behind the "List | Constellation" toggle in the Skills section.
   Stars = skills, one constellation per category; brightness = depth
   (production > mixed > working). Each project is drawn as its own constellation line through the
   skills it used. Pick a project chip, or tap a star, to trace them. */
(function () {
    const root = document.getElementById('constellation');
    const toggle = document.querySelectorAll('.skills-toggle button');
    const section = document.getElementById('skills');
    if (!root || !toggle.length || !section) return;

    const groups = [
        { id: 'lang', name: 'Languages and engines' },
        { id: 'xr', name: 'XR and multiplayer' },
        { id: 'ai', name: 'AI, cloud and tooling' },
        { id: 'arch', name: 'Architecture and rendering' }
    ];
    // depth: 3 production, 2 mixed (part production, part working), 1 prototypes / working
    const skills = [
        ['C#', 'lang', 3], ['Unity', 'lang', 3], ['C++', 'lang', 3], ['Java', 'lang', 3], ['Kotlin', 'lang', 3],
        ['Python', 'lang', 3], ['GDScript / Godot 4', 'lang', 3], ['HLSL / GLSL / Metal', 'lang', 3], ['Bash', 'lang', 3],
        ['Meta XR SDK', 'xr', 3], ['OpenXR', 'xr', 3], ['XR Interaction Toolkit', 'xr', 3], ['Compositor Layers', 'xr', 3],
        ['Photon Fusion 2', 'xr', 3], ['Photon Realtime / Voice', 'xr', 3], ['Unity Gaming Services', 'xr', 3],
        ['Meta Spatial SDK', 'xr', 1], ['Android XR', 'xr', 1],
        ['Claude Code skills', 'ai', 3], ['Docker', 'ai', 3], ['Firebase', 'ai', 3], ['Jenkins', 'ai', 3], ['Gradle', 'ai', 3],
        ['Gemini / Vertex AI', 'ai', 2], ['GCP / Cloud Run', 'ai', 2], ['Function calling and RAG', 'ai', 2],
        ['Google ADK', 'ai', 1], ['FastAPI', 'ai', 1], ['Unity MCP', 'ai', 1],
        ['Data-driven UI', 'arch', 3], ['Native rendering plugins', 'arch', 3], ['Zenject', 'arch', 3], ['UniTask', 'arch', 3],
        ['Addressables', 'arch', 3], ['URP / Shader Graph', 'arch', 3], ['Vulkan / OpenGL ES', 'arch', 3],
        ['ExoPlayer / Media3', 'arch', 3], ['Remote Config / A/B testing', 'arch', 3]
    ].map(([name, group, depth], i) => ({ i, name, group, depth }));
    const byName = Object.fromEntries(skills.map(s => [s.name, s]));
    const depthText = d => d === 3 ? 'production' : d === 2 ? 'production + working' : 'working';
    // Which half of a mixed pill is which (from the profile's Skills section).
    const mixedNote = { 'Gemini / Vertex AI': 'Gemini API: production · Vertex AI: working',
                        'GCP / Cloud Run': 'GCP: production · Cloud Run: working',
                        'Function calling and RAG': 'Function calling: production · RAG pipelines: working' };

    // Projects and the skills each used, from the site's own project and role texts.
    // chip: shown as a selectable project. details: modal id or URL for "Project details".
    const projects = [
        { id: 'xtadium', name: 'Xtadium', details: 'modal-xtadium',
          skills: ['C#', 'Unity', 'Meta XR SDK', 'OpenXR', 'XR Interaction Toolkit', 'Compositor Layers', 'Photon Realtime / Voice',
                   'Data-driven UI', 'Zenject', 'UniTask', 'Addressables', 'Remote Config / A/B testing'] },
        { id: 'sdk', name: 'Native SDK', details: 'modal-sdk',
          skills: ['Unity', 'C++', 'Native rendering plugins', 'Vulkan / OpenGL ES', 'ExoPlayer / Media3', 'Java', 'Kotlin'] },
        { id: 'ai', name: 'AI assistant', details: 'modal-ai',
          skills: ['Kotlin', 'Android XR', 'Firebase', 'Python', 'FastAPI', 'Google ADK', 'Gemini / Vertex AI', 'Function calling and RAG', 'GCP / Cloud Run', 'Docker'] },
        { id: 'spatial', name: 'Spatial prototypes', details: 'modal-spatial', skills: ['Kotlin', 'Meta Spatial SDK', 'Android XR'] },
        { id: 'cluckwars', name: 'Cluck Wars', details: 'modal-cluckwars',
          skills: ['C#', 'Unity', 'Photon Fusion 2', 'Unity Gaming Services', 'Zenject', 'URP / Shader Graph', 'Unity MCP'] },
        { id: 'saintmanick', name: 'Saint Manick', details: 'modal-saintmanick', skills: ['GDScript / Godot 4'] },
        { id: 'cvkit', name: 'cvkit', details: 'https://mtejedorg.github.io/cvkit/', skills: ['Claude Code skills', 'Python'] },
        { id: 'ci', name: 'YBVR CI and QA builds', details: null, skills: ['Gradle', 'Jenkins', 'Unity', 'Bash'] },
        { id: 'shaders', name: 'Shaders and URP', details: null, chip: false, skills: ['HLSL / GLSL / Metal', 'URP / Shader Graph'] }
    ];
    projects.forEach(p => { p.idx = p.skills.map(n => byName[n].i); });
    const projectsOf = i => projects.filter(p => p.idx.includes(i));

    let seed = 7;
    const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const NS = 'http://www.w3.org/2000/svg';
    const el = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
    const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

    const chipsBox = root.querySelector('.constellation-projects');
    const svgWrap = root.querySelector('.constellation-sky');
    const info = root.querySelector('.constellation-info');
    const defaultInfo = 'Pick a project to trace the skills it used, or tap a star.';
    const legend = root.querySelector('.c-legend');
    if (legend) legend.innerHTML = '<span><i class="d3"></i>production</span><span><i class="d2"></i>mixed</span><span><i class="d1"></i>working</span>';

    // Project chips
    const chipEls = {};
    projects.filter(p => p.chip !== false).forEach(p => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'filter-btn'; b.textContent = p.name; b.setAttribute('aria-pressed', 'false');
        b.addEventListener('click', () => { state.project === p.id ? clear() : showProject(p.id); b.scrollIntoView({ inline: 'nearest', block: 'nearest' }); });
        chipsBox.appendChild(b); chipEls[p.id] = b;
    });

    let built = false, layoutKey = '', nodes = [], starEls = [], projLines = null, baseLines = null, svg = null;
    const state = { project: null, star: null };

    // Nearest-neighbour tour, so each project reads as a constellation shape rather than a zigzag.
    function tour(idx) {
        if (idx.length < 2) return [];
        const left = idx.slice(1), path = [idx[0]], segs = [];
        while (left.length) {
            const last = nodes[path[path.length - 1]];
            let best = 0, bd = Infinity;
            left.forEach((k, j) => { const d = Math.hypot(nodes[k].x - last.x, nodes[k].y - last.y); if (d < bd) { bd = d; best = j; } });
            const nxt = left.splice(best, 1)[0]; segs.push([path[path.length - 1], nxt]); path.push(nxt);
        }
        return segs;
    }

    function layout() {
        const w = svgWrap.clientWidth;
        if (!w) return;
        const phone = w < 640;
        const key = (phone ? 'p' : 'd') + Math.round(w);
        if (key === layoutKey) return;
        layoutKey = key; seed = 7;

        const W = w, H = phone ? 4 * 250 : 640, font = phone ? 12.5 : 12;
        const regions = phone
            ? groups.map((g, k) => ({ x0: 0, x1: W, y0: k * 250, y1: (k + 1) * 250 }))
            : [{ x0: 0, x1: W / 2, y0: 0, y1: H / 2 }, { x0: W / 2, x1: W, y0: 0, y1: H / 2 },
               { x0: W / 2, x1: W, y0: H / 2, y1: H }, { x0: 0, x1: W / 2, y0: H / 2, y1: H }];
        const centers = regions.map(r => ({ x: (r.x0 + r.x1) / 2, y: (r.y0 + r.y1) / 2 + 14 }));
        const gIndex = Object.fromEntries(groups.map((g, k) => [g.id, k]));

        nodes = skills.map(s => {
            const c = centers[gIndex[s.group]], a = rand() * Math.PI * 2, r = 30 + rand() * 80;
            return { ...s, x: c.x + Math.cos(a) * r, y: c.y + Math.sin(a) * r * 0.7, vx: 0, vy: 0, cx: c.x, cy: c.y,
                     reg: regions[gIndex[s.group]], hw: Math.max(26, s.name.length * font * 0.29), hh: 22 };
        });
        // Springs between skills of the same project inside one constellation keep related stars near.
        const springs = [];
        projects.forEach(p => p.idx.forEach((a, k) => { if (k) springs.push([p.idx[k - 1], a]); }));
        for (let it = 0; it < 420; it++) {
            const alpha = 1 - it / 420;
            nodes.forEach(n => { n.vx += (n.cx - n.x) * 0.02 * alpha; n.vy += (n.cy - n.y) * 0.03 * alpha; });
            springs.forEach(([a, b]) => {
                const A = nodes[a], B = nodes[b]; if (A.group !== B.group) return;
                const dx = B.x - A.x, dy = B.y - A.y, d = Math.hypot(dx, dy) || 1, f = (d - 80) * 0.003 * alpha;
                A.vx += dx / d * f; A.vy += dy / d * f; B.vx -= dx / d * f; B.vy -= dy / d * f;
            });
            for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
                const A = nodes[i], B = nodes[j];
                const ox = A.hw + B.hw + 8 - Math.abs(B.x - A.x), oy = A.hh + B.hh - Math.abs(B.y - A.y);
                if (ox > 0 && oy > 0) {
                    if (ox * 0.6 < oy) { const s = Math.sign(B.x - A.x || 1) * ox * 0.25; A.vx -= s; B.vx += s; }
                    else { const s = Math.sign(B.y - A.y || 1) * oy * 0.25; A.vy -= s; B.vy += s; }
                }
            }
            nodes.forEach(n => {
                n.x += n.vx; n.y += n.vy; n.vx *= 0.6; n.vy *= 0.6;
                n.x = Math.min(n.reg.x1 - n.hw - 10, Math.max(n.reg.x0 + n.hw + 10, n.x));
                n.y = Math.min(n.reg.y1 - 30, Math.max(n.reg.y0 + 58, n.y));
            });
        }
        projects.forEach(p => { p.segs = tour(p.idx); });

        svgWrap.innerHTML = '';
        svg = el('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, role: 'group', 'aria-label': 'Skills constellation' }, svgWrap);
        const dust = el('g', { class: 'c-dust', 'aria-hidden': 'true' }, svg);
        for (let k = 0; k < (phone ? 90 : 140); k++) el('circle', { cx: rand() * W, cy: rand() * H, r: (rand() * 0.9 + 0.3).toFixed(2), style: `animation-delay:${(rand() * 6).toFixed(2)}s` }, dust);
        groups.forEach(g => {
            const mine = nodes.filter(n => n.group === g.id);
            const top = Math.min(...mine.map(n => n.y));
            const mid = (Math.min(...mine.map(n => n.x - n.hw)) + Math.max(...mine.map(n => n.x + n.hw))) / 2;
            el('text', { x: mid, y: top - 24, class: 'c-group', 'text-anchor': 'middle', 'aria-hidden': 'true' }, svg).textContent = g.name.toUpperCase();
        });
        // Faint background lines: every project's constellation, drawn once.
        baseLines = el('g', { class: 'c-lines', 'aria-hidden': 'true' }, svg);
        const seen = new Set();
        projects.forEach(p => p.segs.forEach(([a, b]) => {
            const key = a < b ? a + '|' + b : b + '|' + a; if (seen.has(key)) return; seen.add(key);
            const A = nodes[a], B = nodes[b];
            el('line', { x1: A.x, y1: A.y, x2: B.x, y2: B.y, class: A.group === B.group ? 'c-line' : 'c-line c-line-cross' }, baseLines);
        }));
        projLines = el('g', { class: 'c-proj-lines', 'aria-hidden': 'true' }, svg);
        const starsG = el('g', { class: 'c-stars' }, svg);
        starEls = nodes.map((n, k) => {
            const g = el('g', { class: `c-star d${n.depth}`, transform: `translate(${n.x.toFixed(1)},${n.y.toFixed(1)})`,
                                 tabindex: '0', role: 'button', 'aria-label': `${n.name}, ${depthText(n.depth)}` }, starsG);
            el('circle', { r: 22, class: 'c-hit' }, g);
            el('circle', { r: n.depth === 3 ? 9 : n.depth === 2 ? 7 : 5, class: 'c-glow' }, g);
            el('circle', { r: n.depth === 3 ? 3.6 : n.depth === 2 ? 3 : 2.3, class: 'c-core' }, g);
            el('text', { y: 19, 'text-anchor': 'middle', class: 'c-label' }, g).textContent = n.name;
            const act = () => { state.star === k ? clear() : showStar(k); };
            g.addEventListener('click', (e) => { e.stopPropagation(); act(); });
            g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); } });
            return g;
        });
        svg.addEventListener('click', () => { if (state.star !== null || state.project) clear(); });
        render();
    }

    function drawSegs(segsList) {
        projLines.innerHTML = '';
        segsList.forEach(([a, b]) => {
            const A = nodes[a], B = nodes[b];
            el('line', { x1: A.x, y1: A.y, x2: B.x, y2: B.y, class: 'c-proj-line', pathLength: 1 }, projLines);
        });
    }

    function render() {
        if (!svg) return;
        let lit = null, segs = [];
        if (state.project) { const p = projects.find(q => q.id === state.project); lit = new Set(p.idx); segs = p.segs; }
        else if (state.star !== null) {
            lit = new Set([state.star]);
            projectsOf(state.star).forEach(p => p.segs.forEach(([a, b]) => { if (a === state.star || b === state.star) { segs.push([a, b]); lit.add(a); lit.add(b); } }));
        }
        svg.classList.toggle('focusing', !!lit);
        starEls.forEach((s, k) => { s.classList.toggle('near', !!lit && lit.has(k)); s.classList.toggle('sel', k === state.star); });
        drawSegs(segs);
        Object.entries(chipEls).forEach(([id, b]) => { const on = id === state.project; b.classList.toggle('active', on); b.setAttribute('aria-pressed', String(on)); });
    }

    function detailsButton(p) {
        if (!p.details) return '';
        if (p.details.startsWith('http')) return ` <a class="c-details" href="${p.details}" target="_blank" rel="noopener">Project site ↗</a>`;
        return ` <button type="button" class="c-details" data-modal="${p.details}">Project details →</button>`;
    }
    function wireInfo() {
        info.querySelectorAll('button.c-details').forEach(b => b.addEventListener('click', () => {
            if (window.openProjectModal) window.openProjectModal(b.dataset.modal, b);
        }));
        info.querySelectorAll('button.c-proj').forEach(b => b.addEventListener('click', () => showProject(b.dataset.p)));
    }
    function showProject(id) {
        state.project = id; state.star = null; render();
        const p = projects.find(q => q.id === id);
        const list = p.idx.slice().sort((a, b) => skills[b].depth - skills[a].depth).map(k => esc(skills[k].name)).join(' · ');
        info.innerHTML = `<strong>${esc(p.name)}</strong>${detailsButton(p)}<br>${list}`;
        wireInfo();
    }
    function showStar(k) {
        state.star = k; state.project = null; render();
        const ps = projectsOf(k), name = skills[k].name;
        const note = mixedNote[name] ? `<br><span class="c-note">${esc(mixedNote[name])}</span>` : '';
        info.innerHTML = `<strong>${esc(name)}</strong> <span class="c-depth d${skills[k].depth}">${depthText(skills[k].depth)}</span>${note}<br>` +
            (ps.length ? 'Used in ' + ps.map(p => p.chip === false ? esc(p.name)
                : `<button type="button" class="c-proj" data-p="${p.id}">${esc(p.name)}</button>`).join(' ') : '');
        wireInfo();
    }
    function clear() { state.project = null; state.star = null; render(); info.innerHTML = defaultInfo; }

    function setView(view) {
        const con = view === 'constellation';
        section.classList.toggle('view-constellation', con);
        toggle.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === view)));
        if (con && !built) { built = true; info.innerHTML = defaultInfo; }
        if (con) layout();
        try { localStorage.setItem('skills-view', view); } catch (e) { /* storage blocked */ }
    }
    toggle.forEach(b => b.addEventListener('click', () => setView(b.dataset.view)));
    toggle[0].parentElement.classList.add('ready');
    let saved = 'list';
    try { saved = localStorage.getItem('skills-view') || 'list'; } catch (e) { /* storage blocked */ }
    setView(saved === 'constellation' ? 'constellation' : 'list');
    let t; window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(() => { if (section.classList.contains('view-constellation')) layout(); }, 150); });
})();
