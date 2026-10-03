/**
 * Nayak K. V. Sindha — Indian Army Heritage Scrapbook
 * Vanilla JavaScript: Modal Dossiers, Lightbox & Smooth Interactions
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. ARCHIVAL DATA FOR THE 12 CARDS
     ========================================================================== */
  const ARCHIVE_DOSSIERS = {
    1: {
      number: "01",
      title: "Personal Information",
      subtitle: "ROOTS, CHILDHOOD & EARLY FOUNDATIONS",
      quote: "“Before I wore the olive green, the soil of my village taught me the true meaning of devotion.”",
      narrative: `Nayak K. V. Sindha was born and raised in an upright, hardworking family steeped in traditional Indian values of integrity, endurance, and quiet humility. From an early age, rural life instilled in him rugged physical stamina, strict punctuality, and a deep reverence for the motherland.

His childhood was shaped by tales of valor from the Indian armed forces and the guiding philosophy that duty toward the nation comes before individual convenience. These formative virtues became the bedrock of his military career.`,
      points: [
        "Roots: Village upbringing grounded in agricultural discipline and simplicity.",
        "Character: Upright conduct, physical endurance, and respect for elders.",
        "Aspiration: Lifelong dream to serve Bharat Mata in uniform.",
        "Ethos: Deep devotion to the ideals of honesty and courage."
      ]
    },
    2: {
      number: "02",
      title: "Journey into the Army",
      subtitle: "RECRUITMENT RALLY, ATTESTATION & RIGOROUS DRILLS",
      quote: "“The training broke our comfort, but forged an unbreakable bond of steel.”",
      narrative: `Answering the call to defend India's borders, young K. V. Sindha competed with distinction at the Army recruitment rally. Meeting the rigorous physical, endurance, and medical criteria, he was selected and dispatched to the regimental training center.

Through grueling physical training—cross-country marches with battle loads, weapons handling (SLR/INSAS), field camouflage, obstacle navigation, and drill-square discipline—he transitioned into a resolute soldier. On his Attestation Parade, he took the sacred oath under the National Flag to defend India to his last breath.`,
      points: [
        "Selection: Excelled at competitive open recruitment rally trials.",
        "Basic Military Training: 44 weeks of rigorous physical and tactical drill.",
        "Attestation Oath: Sworn on the Constitution of India and National Flag.",
        "First Posting: Dispatched to active unit ready for forward deployment."
      ]
    },
    3: {
      number: "03",
      title: "Army Career",
      subtitle: "RANK OF NAYAK, LOGISTICAL LEADERSHIP & SECTION COMMAND",
      quote: "“The two chevrons were a sacred trust—to lead by personal example and protect my men.”",
      narrative: `Over decades of steadfast service, Nayak K. V. Sindha rose to the rank of Nayak (two chevrons), commanding respect for his calm composure, strict unit discipline, and tactical reliability. 

Entrusted with section-level command and vital convoy/supply operations, he ensured that frontlines received essential rations, ammunition, and logistical support regardless of weather extremes. His service record is marked by the highest character grading: 'Exemplary'.`,
      points: [
        "Rank Achieved: Nayak (Non-Commissioned Officer, 2 Chevrons).",
        "Duties: Convoy management, supply chain integrity, and section discipline.",
        "Conduct: Immaculate conduct sheet with zero adverse entries.",
        "Leadership: Fostered high morale, comradeship, and total dedication to unit orders."
      ]
    },
    4: {
      number: "04",
      title: "Postings & Places",
      subtitle: "BORDER SECTORS, MOUNTAIN PASSES & DESERT PATROLS",
      quote: "“Wherever the Tricolor called, there was our duty—under frozen skies or blazing sun.”",
      narrative: `Nayak K. V. Sindha served across the diverse geographical extremes of India. His postings included remote high-altitude sectors with freezing sub-zero temperatures, harsh desert outposts along western borders, and bustling transit and supply depots.

In forward operational areas, jawans lived in fortified field bunkers, standing guard through snowstorms and torrential monsoons. His ability to adapt cheerfully to every posting reflected the unyielding spirit of the Indian jawan.`,
      points: [
        "Northern Sector: Forward logistics support in high-altitude terrain.",
        "Western Borders: Readiness mobilizations and desert field postings.",
        "Supply Corridors: Coordinated movements across vital Army transit junctions.",
        "Endurance: Overcame isolation and severe climatic hardships with cheerful resilience."
      ]
    },
    5: {
      number: "05",
      title: "Achievements & Awards",
      subtitle: "MEDALS, COMMENDATION CITATIONS & RECOGNITION",
      quote: "“The medals belong to the nation; the honor belongs to the unit.”",
      narrative: `Nayak K. V. Sindha’s uniform proudly bore medals recognizing dedicated service in operational field areas and continuous long service with unblemished conduct.

His decorations include the Sainya Seva Medal with operational clasp, along with the 9-Year and 20-Year Long Service Ribbons. He was repeatedly recognized by commanding officers for tactical diligence and exceptional section leadership during field exercises.`,
      points: [
        "Sainya Seva Medal: Recognized active field service in operational sectors.",
        "Long Service Medals: 9 and 20 years of loyal and exemplary service.",
        "Commendations: Praised for logistical precision during operational alerts.",
        "Regimental Honor: Respected as an anchor of section morale and efficiency."
      ]
    },
    6: {
      number: "06",
      title: "Family Life",
      subtitle: "THE PILLAR OF SACRIFICE, RESILIENCE & WARM REUNIONS",
      quote: "“While I stood guard on the border, my family held the fort at home with silent courage.”",
      narrative: `Behind every brave soldier stands a family whose silent sacrifices make service possible. Living apart for long months, Mrs. Sindha managed the household, farming, and children's education with admirable courage and independence.

Treasured letters arriving via 56 APO were read repeatedly by the family. Whenever annual leave was granted, Nayak Sindha returned to his village to immerse himself in simple joys, instilling the virtues of discipline, punctuality, and love for India in his children.`,
      points: [
        "Domestic Strength: Family managed farming and home with quiet resilience.",
        "APO Letters: The vital lifeline bridging remote borders with home.",
        "Annual Leave: Joyous homecomings celebrated by the entire village community.",
        "Heritage Passed On: Children raised with strong values of integrity and patriotism."
      ]
    },
    7: {
      number: "07",
      title: "Memories & Stories",
      subtitle: "BARRACKS BROTHERHOOD, CAMPFIRE TALES & FIELD DRILLS",
      quote: "“In the uniform, caste and state disappear. We shared one ration tin and one soul.”",
      narrative: `Nayak Sindha's career was filled with unforgettable moments of camaraderie. He often reminisced about freezing nights in field shelters, sharing steaming mess tea around a kerosene stove with comrades from every state in India.

He recalled joint operations during torrential monsoon deluges where jawans pushed stuck heavy vehicles shoulder-to-shoulder out of axle-deep mud. In the Indian Army, linguistic and regional differences melt away into an unbreakable brotherhood.`,
      points: [
        "Barracks Brotherhood: Living harmoniously with jawans from across India.",
        "Shared Hardships: Overcoming freezing snow and relentless mud through teamwork.",
        "High Morale: Songs, shared humor, and banter that lifted spirits during long watches.",
        "Bugle Calls: The cherished daily rhythm of Reveille at dawn and Last Post at dusk."
      ]
    },
    8: {
      number: "08",
      title: "Photo Gallery",
      subtitle: "VISUAL CHRONICLES OF A PROUD JOURNEY IN UNIFORM",
      quote: "“Photographs fade with time, but the honor of serving the nation shines forever.”",
      narrative: `This archival collection captures authentic portraits, parade inspections, and memorable milestones from Nayak K. V. Sindha’s military service. 

From the iconic original framed portrait featuring his nametag 'K. V. SINDHA' and ribbon bar to historical scenes of barracks life, these photographs offer an emotional window into a dedicated life in service of the nation.`,
      points: [
        "Official Portrait: In olive green uniform with ribbons and regimental nametag.",
        "Passing Out Parade: Impeccable drill formation and attestation ceremony.",
        "Field Outposts: Glimpses of daily logistics and sentry watch.",
        "Family Keepsakes: Cherished archival prints preserved with deep pride."
      ]
    },
    9: {
      number: "09",
      title: "Documents & Letters",
      subtitle: "FIELD POST COMMUNICATIONS, SERVICE BOOK & OFFICIAL RECORDS",
      quote: "“Every letter from 56 APO was stamped with love, prayer, and patriotic resolve.”",
      narrative: `The written records of Nayak K. V. Sindha provide an authentic documentary record of his dedication. His official Army Service Book details his unblemished career, courses completed, and exemplary conduct grading.

Preserved inland letters stamped with Army Postal Service (APS) markings carry heartfelt assurances to his family, reassuring them of his health and high morale while reiterating that duty to Mother India came before all else.`,
      points: [
        "Army Service Book: Comprehensive official log of postings, promotions, and character.",
        "Field Letters: Correspondence dispatched from 56 APO during active deployments.",
        "Discharge Certificate: Honorable release document recording exemplary character.",
        "Commendation Records: Written appreciation from commanding officers."
      ]
    },
    10: {
      number: "10",
      title: "Retirement",
      subtitle: "THE FINAL SALUTE, FAREWELL PARADE & HANGING UP THE BOOTS",
      quote: "“A soldier never truly retires; he simply stands guard in civilian life.”",
      narrative: `Upon completing his full term of exemplary service, Nayak K. V. Sindha took his final salute on the unit drill square. Honored by his officers and brother jawans with a guard of honor, he hung up his active combat boots with immense satisfaction.

Returning to his hometown as a decorated veteran, he was welcomed with deep reverence by village elders and youth. He stepped into civilian life carrying the lifelong dignity and poise of an Indian soldier.`,
      points: [
        "Ceremonial Farewell: Unit guard of honor and traditional send-off parade.",
        "Clean Record: Concluded full service tenure with highest exemplary grading.",
        "Hero's Return: Celebrated in his village as a respected elder and veteran.",
        "Lifelong Pride: Preserved the crisp bearing and discipline of the army every single day."
      ]
    },
    11: {
      number: "11",
      title: "Life Beyond the Uniform",
      subtitle: "COMMUNITY LEADERSHIP, YOUTH MENTORSHIP & SERENE RETIREMENT",
      quote: "“Discipline is a lamp that illuminates every corner of your life, in or out of uniform.”",
      narrative: `In his post-service years, Nayak K. V. Sindha continued to lead by example. He maintained his strict military routine—early dawn walks, physical fitness, and immaculate personal habits.

He dedicated his spare time to mentoring young village boys aspiring to join the Armed Forces, coaching them on physical requirements, running drills, and teaching the importance of character and patriotism. He remained an active voice in veterans' associations and community welfare.`,
      points: [
        "Youth Coaching: Trained local boys for army recruitment rallies and physical tests.",
        "Community Pillar: Guided village affairs with fair, principled leadership.",
        "Veterans Network: Maintained active brotherhood through Zila Sainik Board.",
        "Agricultural Life: Cultivated his ancestral fields with military precision and care."
      ]
    },
    12: {
      number: "12",
      title: "Values & Legacy",
      subtitle: "NAAM, NAMAK, NISHAAN — TIMELESS LESSONS FOR BHARAT",
      quote: "“Duty is not an option; it is the highest calling. Serve your motherland in whatever you do.”",
      narrative: `The timeless legacy of Nayak K. V. Sindha is rooted in the sacred code of the Indian soldier: Naam (Honor), Namak (Loyalty), and Nishaan (The Colors of the Regiment and Nation). 

He proved that an ordinary village son, through discipline, courage, and unconditional love for India, can live a life of eternal honor. His memory remains an enduring inspiration for his family, his community, and every Indian who respects the uniform.`,
      points: [
        "Naam, Namak, Nishaan: Lived by the sacred core values of the Indian Armed Forces.",
        "Uncompromising Integrity: A soldier's word and honor are inviolable.",
        "Patriotism in Action: Believed selfless service to society is the highest worship.",
        "Enduring Inspiration: An immortal legacy of courage, dedication, and simplicity."
      ]
    }
  };

  /* ==========================================================================
     2. MODAL DOSSIER CONTROLS
     ========================================================================== */
  const dossierModal = document.getElementById('dossier-modal');
  const modalContentBody = document.getElementById('modal-content-body');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalDismissBtn = document.getElementById('modal-dismiss-btn');

  function openDossier(cardId) {
    const data = ARCHIVE_DOSSIERS[cardId];
    if (!data || !dossierModal) return;

    modalContentBody.innerHTML = `
      <div class="modal-meta-line">DOSSIER REF: NK-KVS-${data.number} &bull; INDIAN ARMY ARCHIVE</div>
      <h3 class="modal-main-title" id="dossier-title">${data.title}</h3>
      <h4 class="modal-subtitle">${data.subtitle}</h4>

      <div class="modal-quote-strip">
        <p class="modal-quote-text">${data.quote}</p>
      </div>

      <div class="modal-desc-body">
        ${data.narrative.split('\n\n').map(p => `<p style="margin-bottom: 0.85rem;">${p}</p>`).join('')}
      </div>

      <div style="border-top: 1px dashed rgba(62,47,28,0.25); padding-top: 0.85rem;">
        <h5 class="modal-points-heading">KEY ARCHIVAL HIGHLIGHTS:</h5>
        <ul class="modal-points-list">
          ${data.points.map(pt => `<li>${pt}</li>`).join('')}
        </ul>
      </div>
    `;

    if (typeof dossierModal.showModal === 'function') {
      dossierModal.showModal();
    } else {
      dossierModal.setAttribute('open', '');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeDossier() {
    if (!dossierModal) return;
    if (typeof dossierModal.close === 'function') {
      dossierModal.close();
    } else {
      dossierModal.removeAttribute('open');
    }
    document.body.style.overflow = '';
  }

  // Bind click on all 12 cards
  const cards = document.querySelectorAll('.scrapbook-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const cardId = card.getAttribute('data-card-id');
      if (cardId === '8') {
        openLightbox(0);
        return;
      }
      openDossier(cardId);
    });

    // Keyboard support
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeDossier);
  if (modalDismissBtn) modalDismissBtn.addEventListener('click', closeDossier);

  // Close when clicking outside modal box
  if (dossierModal) {
    dossierModal.addEventListener('click', (e) => {
      const rect = dossierModal.getBoundingClientRect();
      const inBox = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
      if (!inBox) {
        closeDossier();
      }
    });
  }

  /* ==========================================================================
     3. NAV LINK SHORTCUTS TO MODALS (SERVICE, MEMORIES, GALLERY)
     ========================================================================== */
  const navShortcuts = document.querySelectorAll('[data-open-card]');
  navShortcuts.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const cardNum = link.getAttribute('data-open-card');
      if (cardNum === '8') {
        openLightbox(0);
      } else {
        openDossier(cardNum);
      }
      // Close mobile menu if open
      const mobPanel = document.getElementById('mobile-nav-panel');
      if (mobPanel) mobPanel.classList.remove('open');
    });
  });

  /* ==========================================================================
     4. HERO PHOTO TRIGGER (CLICK TO ZOOM PORTRAIT)
     ========================================================================== */
  const heroPhotoTrigger = document.getElementById('hero-photo-trigger');
  if (heroPhotoTrigger) {
    heroPhotoTrigger.addEventListener('click', () => {
      openLightbox(0);
    });
  }

  /* ==========================================================================
     5. PHOTO GALLERY LIGHTBOX
     ========================================================================== */
  const LIGHTBOX_ITEMS = [
    {
      src: "assets/images/nayak-sindha-portrait.jpg",
      title: "Nayak K. V. Sindha — Uniform Portrait",
      desc: "Authentic portrait in Indian Army service uniform with ribbon bar and regimental nametag."
    },
    {
      src: "assets/images/nayak-sindha.jpg",
      title: "Original Archival Framed Photograph",
      desc: "The cherished original family keepsake preserved in honor of Nayak K. V. Sindha."
    },
    {
      src: "assets/images/reference-mockup.jpg",
      title: "Indian Army Heritage Scrapbook Overview",
      desc: "Official commemorative scrapbook layout celebrating a lifetime of dedication to the nation."
    },
    {
      src: "assets/images/bottom-banner-bg.jpg",
      title: "Mountain Ridge Sentry & National Flag",
      desc: "Guarding India's high frontiers with steadfast devotion — Service Before Self."
    }
  ];

  let currentLbIndex = 0;
  const lbModal = document.getElementById('lightbox-modal');
  const lbImage = document.getElementById('lb-image');
  const lbTitle = document.getElementById('lb-title');
  const lbDesc = document.getElementById('lb-desc');
  const lbCounter = document.getElementById('lb-counter');
  const lbClose = document.getElementById('lb-close');
  const lbPrev = document.getElementById('lb-prev');
  const lbNext = document.getElementById('lb-next');

  function openLightbox(idx) {
    currentLbIndex = idx;
    updateLightbox();
    if (lbModal) {
      lbModal.classList.add('active');
      lbModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLightbox() {
    if (lbModal) {
      lbModal.classList.remove('active');
      lbModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  function updateLightbox() {
    const item = LIGHTBOX_ITEMS[currentLbIndex];
    if (!item) return;
    if (lbImage) {
      lbImage.src = item.src;
      lbImage.alt = item.title;
    }
    if (lbTitle) lbTitle.textContent = item.title;
    if (lbDesc) lbDesc.textContent = item.desc;
    if (lbCounter) lbCounter.textContent = `${currentLbIndex + 1} of ${LIGHTBOX_ITEMS.length}`;
  }

  function prevLbPhoto() {
    currentLbIndex = (currentLbIndex - 1 + LIGHTBOX_ITEMS.length) % LIGHTBOX_ITEMS.length;
    updateLightbox();
  }

  function nextLbPhoto() {
    currentLbIndex = (currentLbIndex + 1) % LIGHTBOX_ITEMS.length;
    updateLightbox();
  }

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbPrev) lbPrev.addEventListener('click', prevLbPhoto);
  if (lbNext) lbNext.addEventListener('click', nextLbPhoto);

  if (lbModal) {
    lbModal.addEventListener('click', (e) => {
      if (e.target === lbModal) closeLightbox();
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeDossier();
    }
    if (lbModal && lbModal.classList.contains('active')) {
      if (e.key === 'ArrowLeft') prevLbPhoto();
      if (e.key === 'ArrowRight') nextLbPhoto();
    }
  });

  /* ==========================================================================
     6. MOBILE MENU TOGGLE
     ========================================================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileNavPanel = document.getElementById('mobile-nav-panel');

  if (mobileToggle && mobileNavPanel) {
    mobileToggle.addEventListener('click', () => {
      mobileNavPanel.classList.toggle('open');
    });

    const mobLinks = mobileNavPanel.querySelectorAll('a:not([data-open-card])');
    mobLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNavPanel.classList.remove('open');
      });
    });
  }

  /* ==========================================================================
     7. SEARCH BUTTON FEEDBACK
     ========================================================================== */
  const searchBtn = document.getElementById('search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      const term = prompt("Search archival records (e.g., 'medals', 'postings', 'training', 'retirement'):");
      if (term) {
        const lower = term.toLowerCase().trim();
        let found = false;
        for (let i = 1; i <= 12; i++) {
          const d = ARCHIVE_DOSSIERS[i];
          if (d && (d.title.toLowerCase().includes(lower) || d.narrative.toLowerCase().includes(lower))) {
            openDossier(i);
            found = true;
            break;
          }
        }
        if (!found) {
          alert(`No exact record found for "${term}". Showing Personal Information.`);
          openDossier(1);
        }
      }
    });
  }

});
