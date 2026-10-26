document.documentElement.classList.add("js");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Content: edit this object to update the whole page ---------- */
const DATA = {
  profile: {
    name: "Shivam Mishra",
    eyebrow: "Portfolio · Chandigarh University",
    roles: ["Software engineer", "AI engineer"],
    tagline: "Talk to AI in the most efficient way",
    about: "I build retrieval and LLM systems with <b>Claude</b> and design the interface around them, so people can see where an answer came from and decide whether to trust it.",
    facts: ["B.Tech Computer Science and Engineering", "2023 to present"]
  },
  sections: [
    { id: "ask", label: "Ask Claude" },
    { id: "work", label: "Work" },
    { id: "design", label: "Design" },
    { id: "system", label: "System" },
    { id: "contact", label: "Contact" }
  ],
  pipeline: {
    title: "Inside DocuMind",
    stages: [
      { label: "Ingest", stack: ["PyMuPDF"], detail: "PyMuPDF reads large PDF and document collections and extracts their text. Keeping track of the source page here is what lets the final answer cite it." },
      { label: "Embed", stack: ["Sentence Transformers", "Qdrant"], detail: "Sentence Transformers turn each passage into a semantic embedding, which is stored in the Qdrant vector database." },
      { label: "Retrieve", stack: ["Qdrant", "BM25"], detail: "Vector search and BM25 keyword search run together. Meaning-based and exact-term matches both make it into the candidate set." },
      { label: "Rerank", stack: ["Cross-Encoder"], detail: "A cross-encoder rescores the candidates against the question so the most relevant context reaches the model first." },
      { label: "Generate", stack: ["LLM", "Citations"], detail: "The LLM answers from the retrieved context and attaches page-level citations. Readers can verify each answer, which reduces hallucinations." },
      { label: "Serve", stack: ["FastAPI", "Streamlit", "Pydantic", "Docker"], detail: "A FastAPI backend and a Streamlit interface, validated with Pydantic and packaged in Docker for repeatable deployment." }
    ]
  },
  projects: [
    {
      title: "DocuMind",
      kind: "Intelligent RAG knowledge assistant",
      summary: "Ask natural-language questions across large PDF and document collections and get grounded answers with page-level citations.",
      tags: ["RAG", "GenAI", "Retrieval", "MLOps"],
      points: [
        "Cut manual document search with a Python RAG system for natural-language querying.",
        "Built ingestion and semantic embedding pipelines with PyMuPDF and Sentence Transformers.",
        "Combined Qdrant vector search with BM25, then reranked with a cross-encoder for more relevant context.",
        "Grounded LLM generation with page-level citations to give verifiable answers.",
        "Containerized the FastAPI and Streamlit application with Docker and Pydantic for scalable deployment."
      ],
      stack: ["Python", "FastAPI", "Streamlit", "Qdrant", "Sentence Transformers", "BM25", "Cross-Encoder", "PyMuPDF", "LLMs", "Docker"],
      link: null
    },
    {
      title: "Content-Based Image Retrieval",
      kind: "Transfer learning and feature fusion",
      summary: "An image search system that finds visually similar images by comparing learned features instead of tags.",
      tags: ["Computer Vision", "Retrieval"],
      points: [
        "Applied transfer learning with pre-trained VGG16 and ResNet50 models.",
        "Fused features from both networks to improve accuracy and robustness across diverse image datasets.",
        "Used the FAISS vector database for fast similarity search over extracted feature vectors.",
        "Validated results with Precision, Recall and Mean Average Precision."
      ],
      stack: ["Python", "TensorFlow", "VGG16", "ResNet50", "FAISS", "OpenCV"],
      link: null
    }
  ],
  principles: [
    { title: "Show the source", body: "DocuMind attaches page-level citations to its answers, so a reader can open the page and confirm the claim without taking the model's word for it. The interface treats evidence as part of the answer.", from: "From DocuMind" },
    { title: "Make quality visible", body: "The image retrieval work is judged with Precision, Recall and Mean Average Precision. A design choice needs a number beside it, and the interface should be able to show that number.", from: "From image retrieval" },
    { title: "Design for the person in the room", body: "Leading student workshops and hackathons taught me to write instructions and layouts that still work when people are rushed, distracted or seeing them for the first time.", from: "From leading campus events" }
  ],
  contact: [
    { label: "Email", value: "shivam.workplace683@gmail.com", href: "mailto:shivam.workplace683@gmail.com" },
    { label: "Phone", value: "+91 7081226550" }
  ]
};

/* ---------- Helpers ---------- */
const $ = (s, r) => (r || document).querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const tagList = a => '<ul class="tags">' + a.map(x => "<li>" + esc(x) + "</li>").join("") + "</ul>";
const pointList = a => '<ul class="points">' + a.map(x => "<li>" + esc(x) + "</li>").join("") + "</ul>";

/* ---------- Hero ---------- */
function renderHero() {
  const p = DATA.profile;
  $("#h-eyebrow").textContent = p.eyebrow;
  let i = 0;
  const h = $("#h-name");
  h.setAttribute("aria-label", p.name);
  h.innerHTML = p.name.split(" ").map(word =>
    '<span class="w" aria-hidden="true">' + word.split("").map(ch => '<span class="letter" style="--i:' + (i++) + '">' + esc(ch) + "</span>").join("") + "</span>"
  ).join(" ");
  $("#h-tagline").textContent = p.tagline;
  $("#h-about").innerHTML = p.about;
  $("#h-facts").innerHTML = p.facts.map(f => "<span>" + esc(f) + "</span>").join("");

  const role = $("#h-role");
  if (reduce) { role.textContent = p.roles.join(" · "); return; }
  let r = 0;
  const set = () => { role.innerHTML = "<span>" + esc(p.roles[r]) + "</span>"; };
  set();
  setInterval(() => { r = (r + 1) % p.roles.length; set(); }, 2600);
}

/* living network behind the hero */
function mountNet() {
  const panel = $("#hero-panel"), c = $("#net"), ctx = c.getContext("2d");
  const css = getComputedStyle(document.documentElement);
  let w = 0, h = 0, nodes = [], mx = -1e3, my = -1e3, running = false, raf = 0;
  function size() {
    const r = panel.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2);
    w = r.width; h = r.height;
    c.width = Math.round(w * d); c.height = Math.round(h * d);
    ctx.setTransform(d, 0, 0, d, 0, 0);
    const n = Math.max(18, Math.min(64, Math.round(w * h / 15000)));
    nodes = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28 }));
  }
  function frame() {
    ctx.clearRect(0, 0, w, h);
    const a = css.getPropertyValue("--accent").trim(), b = css.getPropertyValue("--accent2").trim();
    if (!reduce) {
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        const dx = mx - n.x, dy = my - n.y, d2 = dx * dx + dy * dy;
        if (d2 < 22000 && d2 > 1) { n.x += dx * 0.012; n.y += dy * 0.012; }
      }
    }
    ctx.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) {
      const p = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const q = nodes[j], dx = p.x - q.x, dy = p.y - q.y, d = dx * dx + dy * dy;
        if (d < 14400) { ctx.globalAlpha = (1 - d / 14400) * 0.35; ctx.strokeStyle = b; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
      }
      const mdx = p.x - mx, mdy = p.y - my, md = mdx * mdx + mdy * mdy, near = md < 32400;
      if (near) { ctx.globalAlpha = (1 - md / 32400) * 0.7; ctx.strokeStyle = a; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mx, my); ctx.stroke(); }
      ctx.globalAlpha = 0.75; ctx.fillStyle = near ? a : b; ctx.beginPath(); ctx.arc(p.x, p.y, 1.7, 0, 6.2832); ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (running) raf = requestAnimationFrame(frame);
  }
  const start = () => { if (running || reduce) return; running = true; raf = requestAnimationFrame(frame); };
  const stop = () => { running = false; cancelAnimationFrame(raf); };
  size(); frame();
  if ("ResizeObserver" in window) new ResizeObserver(() => { size(); if (!running) frame(); }).observe(panel);
  panel.addEventListener("pointermove", e => { const r = c.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
  panel.addEventListener("pointerleave", () => { mx = -1e3; my = -1e3; });
  window.addEventListener("themechange", () => { if (!running) frame(); });
  if ("IntersectionObserver" in window) new IntersectionObserver(es => { es[0].isIntersecting ? start() : stop(); }).observe(panel);
  else start();
}

/* ---------- Pipeline walkthrough ---------- */
function mountPipeline() {
  const pl = DATA.pipeline, box = $("#pipe"), DUR = 3800;
  box.style.setProperty("--dur", DUR + "ms");
  box.innerHTML =
    '<div class="pipe-top"><h2>' + esc(pl.title) + '</h2><div class="pipe-ctl"><span class="eyebrow">Select a stage</span><button class="mini" id="pipe-play" type="button">Pause</button></div></div>' +
    '<div class="stages">' + pl.stages.map((s, i) =>
      '<button class="stage" type="button" data-i="' + i + '" aria-pressed="' + (i === 0) + '"><small>Stage ' + (i + 1) + "</small><span>" + esc(s.label) + "</span></button>").join("") + "</div>" +
    '<div class="stage-detail" id="stage-detail" aria-live="polite"></div>';
  const playBtn = $("#pipe-play");
  let cur = 0, playing = false, timer = 0, userStopped = reduce;
  function restartBar() { box.classList.remove("playing"); void box.offsetWidth; if (playing) box.classList.add("playing"); }
  function show(i) {
    cur = i;
    const s = pl.stages[i];
    $("#stage-detail").innerHTML = "<h3>" + esc(s.label) + "</h3><p>" + esc(s.detail) + "</p>" + tagList(s.stack);
    box.querySelectorAll(".stage").forEach(b => b.setAttribute("aria-pressed", String(Number(b.dataset.i) === i)));
    restartBar();
  }
  function setPlaying(on) {
    playing = on; clearInterval(timer);
    playBtn.textContent = on ? "Pause" : "Play";
    if (on) timer = setInterval(() => show((cur + 1) % pl.stages.length), DUR);
    restartBar();
  }
  box.addEventListener("click", e => {
    const b = e.target.closest(".stage");
    if (b) { userStopped = true; setPlaying(false); show(Number(b.dataset.i)); }
  });
  playBtn.addEventListener("click", () => { userStopped = playing; setPlaying(!playing); });
  show(0);
  if (reduce) { playBtn.textContent = "Play"; }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(es => {
      if (es[0].isIntersecting) { if (!userStopped && !playing) setPlaying(true); }
      else if (playing) setPlaying(false);
    }, { threshold: 0.35 }).observe(box);
  }
}

/* ---------- Work ---------- */
const renderProject = (p, i) =>
  '<article class="card" style="--d:' + (i * 110) + 'ms"><div><div class="kind">' + esc(p.kind) + "</div><h3>" + esc(p.title) + "</h3></div>" +
  '<p class="sum">' + esc(p.summary) + "</p>" + pointList(p.points) + tagList(p.stack) +
  (p.link ? '<a class="more" href="' + esc(p.link) + '" target="_blank" rel="noopener">Open the demo</a>' : "") + "</article>";

function mountFilter(filterEl, listEl, items, render) {
  const tags = ["All"].concat(Array.from(new Set(items.flatMap(i => i.tags))));
  filterEl.innerHTML = tags.map((t, i) => '<button type="button" class="chip" data-tag="' + esc(t) + '" aria-pressed="' + (i === 0) + '">' + esc(t) + "</button>").join("");
  const draw = tag => {
    listEl.innerHTML = items.filter(i => tag === "All" || i.tags.includes(tag)).map((it, i) => render(it, i)).join("");
    filterEl.querySelectorAll(".chip").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.tag === tag)));
  };
  filterEl.addEventListener("click", e => { const b = e.target.closest(".chip"); if (b) draw(b.dataset.tag); });
  draw("All");
  listEl.addEventListener("pointermove", e => {
    const card = e.target.closest(".card"); if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", (e.clientX - r.left) + "px");
    card.style.setProperty("--my", (e.clientY - r.top) + "px");
  });
}

/* ---------- Design accordion ---------- */
function mountAcc() {
  const box = $("#acc");
  box.innerHTML = DATA.principles.map((p, i) =>
    '<div class="acc-item"><button class="acc-btn" type="button" id="acc-b' + i + '" aria-controls="acc-p' + i + '" aria-expanded="' + (i === 0) + '"><h3>' + esc(p.title) + '</h3><span class="plus" aria-hidden="true"></span></button>' +
    '<div class="acc-panel" id="acc-p' + i + '" role="region" aria-labelledby="acc-b' + i + '"><div><p>' + esc(p.body) + '</p><span class="src">' + esc(p.from) + "</span></div></div></div>").join("");
  box.addEventListener("click", e => {
    const b = e.target.closest(".acc-btn"); if (!b) return;
    const open = b.getAttribute("aria-expanded") === "true";
    box.querySelectorAll(".acc-btn").forEach(x => x.setAttribute("aria-expanded", "false"));
    if (!open) b.setAttribute("aria-expanded", "true");
  });
}

/* ---------- System + contact ---------- */
function renderStatic() {
  const layers = [
    ["Content", "One object holds the profile, projects, principles and sections.", "DATA"],
    ["Renderers", "Small functions turn each entry into markup. Nothing is copied by hand.", "render()"],
    ["Interactions", "Filters, the pipeline walkthrough, navigation and theme read the same data.", "mount()"],
    ["Live services", "Ask Claude reads the same object, so new content is answerable at once.", "sample"]
  ];
  $("#layers").innerHTML = layers.map(l => '<div class="layer"><span class="mono">' + esc(l[2]) + "</span><b>" + esc(l[0]) + "</b><span>" + esc(l[1]) + "</span></div>").join("");
  $("#schema").textContent =
'projects.push({\n  title: "New project",\n  kind: "One-line category",\n  summary: "What it does for a user.",\n  tags: ["GenAI", "Agents"],   // creates a filter chip\n  points: ["What you built", "How you measured it"],\n  stack: ["Python", "Claude"],\n  link: "https://..."            // optional, shows a button\n});';
  const growth = [
    "<b>More projects.</b> Append an entry. Filter chips for new tags appear on their own.",
    "<b>Screenshots and case studies.</b> Store images with the assets capability and reference them from the entry.",
    "<b>Editing without republishing.</b> Move the content object into the db capability and the page reads it live."
  ];
  $("#growth").innerHTML = growth.map(g => "<li>" + g + "</li>").join("");
  $("#foot").textContent = "Built as a single data-driven page. Update the content object and republish.";
}

function renderContact() {
  const box = $("#contact-list");
  box.innerHTML = DATA.contact.map((c, i) =>
    c.big
      ? '<div><a class="mail" href="' + esc(c.href) + '" id="mail-' + i + '">' + esc(c.value) + '</a></div><div class="contact-row"><span class="label">' + esc(c.label) + '</span><button class="chip" type="button" data-i="' + i + '">Copy address</button></div>'
      : '<div class="contact-row"><span class="label">' + esc(c.label) + '</span><span class="val">' + esc(c.value) + '</span><button class="chip" type="button" data-i="' + i + '">Copy</button></div>').join("");
  box.addEventListener("click", async e => {
    const b = e.target.closest("button[data-i]"); if (!b) return;
    const c = DATA.contact[Number(b.dataset.i)], orig = b.textContent;
    try { await navigator.clipboard.writeText(c.value); b.textContent = "Copied"; }
    catch (err) {
      const t = c.big ? document.getElementById("mail-" + b.dataset.i) : b.previousElementSibling;
      const r = document.createRange(); r.selectNodeContents(t);
      const s = getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = "Selected";
    }
    setTimeout(() => { b.textContent = orig; }, 1600);
  });
}

/* ---------- Nav, theme, scroll effects ---------- */
function renderNav() {
  $("#nav").innerHTML = DATA.sections.map(s => '<a href="#' + s.id + '" data-id="' + s.id + '">' + esc(s.label) + "</a>").join("");
  const askLink = $('#nav a[data-id="ask"]'); if (askLink) askLink.hidden = true;
  if (!("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) document.querySelectorAll("#nav a").forEach(a => a.setAttribute("aria-current", String(a.dataset.id === e.target.id))); });
  }, { rootMargin: "-30% 0px -60% 0px" });
  DATA.sections.forEach(s => { const el = document.getElementById(s.id); if (el) io.observe(el); });
}

function mountTheme() {
  const root = document.documentElement;
  try { const t = localStorage.getItem("theme"); if (t === "dark" || t === "light") root.dataset.theme = t; } catch (e) {}
  $("#theme").addEventListener("click", () => {
    const cur = root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = cur === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
    window.dispatchEvent(new Event("themechange"));
  });
}

function mountEffects() {
  const els = document.querySelectorAll(".rv");
  if (reduce || !("IntersectionObserver" in window)) els.forEach(e => e.classList.add("in"));
  else {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -6% 0px" });
    els.forEach(e => io.observe(e));
  }
  const p = $("#prog"); let tick = false;
  const upd = () => { tick = false; const max = document.documentElement.scrollHeight - innerHeight; p.style.setProperty("--p", max > 0 ? Math.min(1, scrollY / max) : 0); };
  addEventListener("scroll", () => { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
  upd();
  if (!reduce && matchMedia("(pointer: fine)").matches) {
    const g = $("#glow"); let t = false, x = 0, y = 0;
    addEventListener("pointermove", e => {
      x = e.clientX; y = e.clientY;
      if (!t) { t = true; requestAnimationFrame(() => { t = false; g.style.transform = "translate3d(" + (x - 260) + "px," + (y - 260) + "px,0)"; g.style.opacity = "1"; }); }
    }, { passive: true });
  }
}

/* ---------- Ask Claude (runtime capability, optional) ---------- */
const ASK_SUGGESTIONS = [
  "What has Shivam built with LLMs?",
  "How does DocuMind reduce hallucinations?",
  "How does he think about UX for AI?",
  "How can I contact him?"
];
const aiContext = () => JSON.stringify({ profile: DATA.profile, pipeline: DATA.pipeline.stages, projects: DATA.projects, principles: DATA.principles, contact: DATA.contact });

async function mountAsk() {
  let sample = null;
  try { sample = await claude.use("sample"); } catch (e) { sample = null; }
  if (!sample) return;
  $("#ask").hidden = false;
  const link = $('#nav a[data-id="ask"]'); if (link) link.hidden = false;
  const out = $("#ask-out"), input = $("#ask-q"), go = $("#ask-go");
  $("#ask-chips").innerHTML = ASK_SUGGESTIONS.map(q => '<button class="chip" type="button">' + esc(q) + "</button>").join("");
  let ctrl = null;
  async function ask(q) {
    q = q.trim().slice(0, 300);
    if (!q) return;
    if (ctrl) ctrl.abort();
    ctrl = new AbortController();
    go.disabled = true;
    out.textContent = "Thinking...";
    const prompt =
      "You answer questions about Shivam Mishra for people reading his portfolio. Use only the JSON below. " +
      "Write in the third person, in plain text with no markdown, in under 110 words. " +
      "If the JSON does not contain the answer, say the portfolio does not cover it. " +
      "Never invent employers, dates, metrics, links or claims.\n\nJSON:\n" + aiContext() + "\n\nQuestion: " + q;
    try {
      await sample(prompt, { cache: false, signal: ctrl.signal, onText: ({ text }) => { out.textContent = text; } });
    } catch (err) {
      if (err && err.name === "AbortError") return;
      const code = err && err.code;
      out.textContent = code === "rate_limited" ? "Too many questions in a short time. Try again in a minute."
        : code === "not_granted" ? "Live answers need permission. Allow the request when it appears, then ask again."
        : (err && err.text) ? err.text : "That did not work. Try asking again.";
    } finally { go.disabled = false; }
  }
  $("#ask-form").addEventListener("submit", e => { e.preventDefault(); ask(input.value); });
  $("#ask-chips").addEventListener("click", e => {
    const b = e.target.closest(".chip"); if (!b) return;
    input.value = b.textContent; ask(b.textContent);
  });
}

/* ---------- Boot ---------- */
renderHero();
renderNav();
mountNet();
mountPipeline();
mountFilter($("#work-filters"), $("#work-list"), DATA.projects, renderProject);
mountAcc();
renderStatic();
renderContact();
mountTheme();
mountEffects();
mountAsk();
