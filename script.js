/**
 * GRURU MUSEUM — Future Archaeology Digital Engine
 * Interactive Data Booming, Knowledge Graph, & HUD Controls
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 GRURU MUSEUM Engine Initialized [Light Tech Mode]');

  initMobileMenu();
  initDecodeTextAnimation();
  initDataBoomingCanvas();
  initKnowledgeGraphCanvas();
  initExhibitionFilters();
  initSpecimenModal();
});

/* ==========================================================================
   1. MOBILE MENU TOGGLE
   ========================================================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('hidden');
    });
  }
}

/* ==========================================================================
   2. DECODE TEXT ANIMATION (600ms Glitch Decode Effect)
   ========================================================================== */
function initDecodeTextAnimation() {
  const decodableElements = document.querySelectorAll('.decode-text');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        decodeText(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  decodableElements.forEach(el => observer.observe(el));
}

function decodeText(element) {
  const originalText = element.getAttribute('data-original') || element.innerText;
  element.setAttribute('data-original', originalText);

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789%#@$&*';
  let iteration = 0;
  const totalIterations = originalText.length;

  const interval = setInterval(() => {
    element.innerText = originalText
      .split('')
      .map((char, index) => {
        if (char === ' ') return ' ';
        if (index < iteration) return originalText[index];
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join('');

    iteration += 1 / 2;

    if (iteration >= totalIterations) {
      element.innerText = originalText;
      clearInterval(interval);
    }
  }, 30);
}

/* ==========================================================================
   3. DATA BOOMING ENGINE (INTERACTIVE RADIAL EXPLOSION SIMULATOR)
   ========================================================================== */
let boomingNodes = [];
let boomingLinks = [];
let maxDepth = 3;

function initDataBoomingCanvas() {
  const svg = document.getElementById('boomingCanvas');
  if (!svg) return;

  const nodeGroup = document.getElementById('boomingNodeGroup');
  const lineGroup = document.getElementById('boomingLineGroup');
  const counterEl = document.getElementById('boomingCounter');
  const resetBtn = document.getElementById('boomingResetBtn');

  const width = svg.clientWidth || 700;
  const height = svg.clientHeight || 450;
  const centerX = width / 2;
  const centerY = height / 2;

  const centerNode = {
    id: 1,
    title_th: "ภูมิปัญญาการทำเครื่องปั้นดินเผาไทย",
    title_en: "Thai Ceramic Heritage",
    x: centerX,
    y: centerY,
    layer: 0,
    category: "cul",
    color: "#D97706"
  };

  function resetBooming() {
    boomingNodes = [centerNode];
    boomingLinks = [];
    explodeNode(centerNode);
  }

  function explodeNode(parent) {
    if (parent.layer >= maxDepth) {
      alert('🔒 จำกัดการระเบิดโหนดความรู้ไว้ที่ 3 ชั้น เพื่อความกระชับของการนำเสนอ');
      return;
    }

    const childCount = parent.layer === 0 ? 8 : 6;
    const radius = 130 - (parent.layer * 25);

    for (let i = 0; i < childCount; i++) {
      const angle = (i * 2 * Math.PI) / childCount;
      const targetX = parent.x + radius * Math.cos(angle);
      const targetY = parent.y + radius * Math.sin(angle);

      const categoryTypes = ['sci', 'his', 'tech', 'cul', 'bio', 'art'];
      const cat = categoryTypes[Math.floor(Math.random() * categoryTypes.length)];
      const colorMap = {
        sci: '#06B6D4',
        his: '#FF5A1F',
        tech: '#8C6BFF',
        cul: '#D97706',
        bio: '#059669',
        art: '#DB2777'
      };

      const childNode = {
        id: boomingNodes.length + 1,
        title_th: `โหนดเชื่อมโยงที่ ${boomingNodes.length + 1}`,
        title_en: `Connected Node ${boomingNodes.length + 1}`,
        x: targetX,
        y: targetY,
        layer: parent.layer + 1,
        category: cat,
        color: colorMap[cat]
      };

      setTimeout(() => {
        boomingNodes.push(childNode);
        boomingLinks.push({ source: parent, target: childNode });
        renderBoomingGraph();
      }, i * 40); // 40ms stagger animation
    }
  }

  function renderBoomingGraph() {
    if (!lineGroup || !nodeGroup) return;

    lineGroup.innerHTML = '';
    nodeGroup.innerHTML = '';

    // Lines
    boomingLinks.forEach(link => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', link.source.x);
      line.setAttribute('y1', link.source.y);
      line.setAttribute('x2', link.target.x);
      line.setAttribute('y2', link.target.y);
      line.setAttribute('stroke', link.target.color);
      line.setAttribute('stroke-width', '1.5');
      line.setAttribute('stroke-opacity', '0.5');
      lineGroup.appendChild(line);
    });

    // Nodes
    boomingNodes.forEach(node => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'cursor-pointer');
      g.onclick = (e) => {
        e.stopPropagation();
        explodeNode(node);
      };

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', node.x);
      circle.setAttribute('cy', node.y);
      circle.setAttribute('r', node.layer === 0 ? '16' : '10');
      circle.setAttribute('fill', node.color);
      circle.setAttribute('stroke', '#FFFFFF');
      circle.setAttribute('stroke-width', '2');
      circle.setAttribute('class', 'hover:scale-125 transition duration-150');

      // Glow effect for selected
      if (node.layer === 0) {
        circle.setAttribute('filter', 'drop-shadow(0px 0px 8px rgba(132, 204, 22, 0.8))');
      }

      g.appendChild(circle);
      nodeGroup.appendChild(g);
    });

    if (counterEl) {
      counterEl.innerText = `CONNECTED NODES: ${boomingNodes.length}`;
    }
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', resetBooming);
  }

  resetBooming();
}

/* ==========================================================================
   4. KNOWLEDGE GRAPH CANVAS (FORCE-DIRECTED GRAPH PREVIEW)
   ========================================================================== */
function initKnowledgeGraphCanvas() {
  const svg = document.getElementById('knowledgeGraphCanvas');
  if (!svg) return;

  const nodeGroup = document.getElementById('kgNodeGroup');
  const lineGroup = document.getElementById('kgLineGroup');
  const specTitle = document.getElementById('specTitle');
  const specEra = document.getElementById('specEra');
  const specCat = document.getElementById('specCat');
  const specTakeaway = document.getElementById('specTakeaway');

  const width = svg.clientWidth || 700;
  const height = svg.clientHeight || 400;

  const sampleNodes = [
    { id: 1, title: "ศิลาจารึกสุโขทัย", era: "สุโขทัย (1292)", category: "his", color: "#FF5A1F", takeaway: "ศึกษาหลักภาษาและการปกครองโบราณ", x: width * 0.2, y: height * 0.3 },
    { id: 2, title: "การย้อมผ้าด้วยครามธรรมชาติ", era: "อยุธยา - ปัจจุบัน", category: "cul", color: "#D97706", takeaway: "เคมีชีวภาพและภูมิปัญญาสีย้อมธรรมชาติ", x: width * 0.4, y: height * 0.25 },
    { id: 3, title: "สถาปัตยกรรมเรือนไทยเรือนผูก", era: "อยุธยา", category: "tech", color: "#8C6BFF", takeaway: "โครงสร้างไร้ตะปู ทนต่อแผ่นดินไหว", x: width * 0.6, y: height * 0.4 },
    { id: 4, title: "ยาสมุนไพรตำรับวัดโพธิ์", era: "รัตนโกสินทร์ตอนต้น", category: "bio", color: "#059669", takeaway: "เภสัชกรรมพฤกษศาสตร์ไทยประยุกต์", x: width * 0.35, y: height * 0.65 },
    { id: 5, title: "ลวดลายกนกช่างสิบหมู่", era: "รัตนโกสินทร์", category: "art", color: "#DB2777", takeaway: "คณิตศาสตร์เรขาคณิตในงานศิลป์ไทย", x: width * 0.7, y: height * 0.7 },
    { id: 6, title: "ระบบชลประทานตลิ่งโบราณ", era: "สุโขทัย", category: "sci", color: "#06B6D4", takeaway: "การจัดการน้ำและชลประทานพื้นบ้าน", x: width * 0.8, y: height * 0.3 }
  ];

  const sampleLinks = [
    { source: sampleNodes[0], target: sampleNodes[1] },
    { source: sampleNodes[1], target: sampleNodes[2] },
    { source: sampleNodes[2], target: sampleNodes[3] },
    { source: sampleNodes[3], target: sampleNodes[4] },
    { source: sampleNodes[4], target: sampleNodes[5] },
    { source: sampleNodes[2], target: sampleNodes[5] }
  ];

  // Render lines
  sampleLinks.forEach(link => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', link.source.x);
    line.setAttribute('y1', link.source.y);
    line.setAttribute('x2', link.target.x);
    line.setAttribute('y2', link.target.y);
    line.setAttribute('stroke', '#CBD5E1');
    line.setAttribute('stroke-width', '1.5');
    lineGroup.appendChild(line);
  });

  // Render nodes
  sampleNodes.forEach(node => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'cursor-pointer');

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', node.x);
    circle.setAttribute('cy', node.y);
    circle.setAttribute('r', '14');
    circle.setAttribute('fill', node.color);
    circle.setAttribute('stroke', '#FFFFFF');
    circle.setAttribute('stroke-width', '2');
    circle.setAttribute('class', 'hover:scale-125 transition');

    g.appendChild(circle);

    // Hover tooltip updating Specimen HUD
    g.addEventListener('mouseenter', () => {
      if (specTitle) specTitle.innerText = node.title;
      if (specEra) specEra.innerText = `ยุคสมัย: ${node.era}`;
      if (specCat) specCat.innerText = `หมวดหมู่: ${node.category.toUpperCase()}`;
      if (specTakeaway) specTakeaway.innerText = node.takeaway;
    });

    nodeGroup.appendChild(g);
  });
}

/* ==========================================================================
   5. EXHIBITION GALLERY FILTERS
   ========================================================================== */
function initExhibitionFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.exhibition-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('bg-gr-void', 'text-white'));
      btn.classList.add('bg-gr-void', 'text-white');

      items.forEach(item => {
        if (category === 'all' || item.getAttribute('data-category') === category) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   6. SPECIMEN LIGHTBOX MODAL
   ========================================================================== */
function initSpecimenModal() {
  const modal = document.getElementById('specimenModal');
  const modalClose = document.getElementById('modalCloseBtn');
  const cards = document.querySelectorAll('.exhibition-card');

  if (!modal) return;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const title = card.getAttribute('data-title') || "โบราณวัตถุดิจิทัล";
      const code = card.getAttribute('data-code') || "GRM-2026-SPEC-001";
      const desc = card.getAttribute('data-desc') || "รายละเอียดวัตถุโบราณทางวัฒนธรรมและความสัมพันธ์ในโครงข่ายข้อมูล";

      document.getElementById('modalTitle').innerText = title;
      document.getElementById('modalCode').innerText = code;
      document.getElementById('modalDesc').innerText = desc;

      modal.classList.remove('hidden');
      modal.classList.add('flex');
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  });
}
