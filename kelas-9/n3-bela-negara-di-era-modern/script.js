/* N.3 Bela Negara di Era Modern — script.js
   Vanilla JS, tanpa framework. Meniru mesin prototipe P.1.
   localStorage (semua berawalan mpi-pp-n3- agar tidak bertabrakan
   dengan modul lain pada domain github.io yang sama):
   mpi-pp-n3-visited, mpi-pp-n3-quiz-best, mpi-pp-n3-polling,
   mpi-pp-n3-komitmen, mpi-pp-n3-refleksi. */
(function () {
  'use strict';

  /* ---------- Util ---------- */
  function $(id) { return document.getElementById(id); }
  function showFb(el, ok, msg) {
    if (!el) return;
    el.textContent = msg;
    el.classList.remove('ok', 'no', 'show');
    el.classList.add(ok ? 'ok' : 'no', 'show');
  }
  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* abaikan */ }
  }
  function read(key, fallback) {
    try {
      var v = localStorage.getItem(key);
      return v === null ? fallback : v;
    } catch (e) { return fallback; }
  }

  /* ---------- Progres sub-bab ---------- */
  var SUBS = ['sub1', 'sub2', 'sub3', 'sub4', 'sub5', 'sub6'];
  var visited = [];
  try { visited = JSON.parse(read('mpi-pp-n3-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];

  function saveVisited() { store('mpi-pp-n3-visited', JSON.stringify(visited)); }
  function renderProgress() {
    var pct = Math.round((visited.length / SUBS.length) * 100);
    var text = $('progressText');
    if (text) text.textContent = 'Progres: ' + visited.length + ' dari 6 sub-bab (' + pct + '%)';
    var fill = $('progressFill');
    if (fill) fill.style.width = pct + '%';
    var bar = $('progressBar');
    if (bar) bar.setAttribute('aria-valuenow', String(pct));
    document.querySelectorAll('[data-sub]').forEach(function (a) {
      a.classList.toggle('done', visited.indexOf(a.getAttribute('data-sub')) !== -1);
    });
  }
  function markVisited(id) {
    if (visited.indexOf(id) === -1) {
      visited.push(id);
      saveVisited();
      renderProgress();
    }
  }
  document.querySelectorAll('[data-sub]').forEach(function (a) {
    a.addEventListener('click', function () { markVisited(a.getAttribute('data-sub')); });
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) markVisited(en.target.id);
      });
    }, { rootMargin: '-20% 0px -60% 0px' });
    SUBS.forEach(function (id) { var s = $(id); if (s) io.observe(s); });
  }
  renderProgress();

  /* Skor terbaik kuis di header */
  var bestEl = $('quizBestText');
  var bestStored = read('mpi-pp-n3-quiz-best', null);
  if (bestStored !== null && bestEl) {
    bestEl.textContent = 'Skor terbaik kuis: ' + bestStored + '/10';
    bestEl.hidden = false;
  }

  /* ---------- Sub-bab 1: polling ---------- */
  var POLL_MSG = {
  "belajar": "Tercatat! Belajar sungguh-sungguh adalah wujud bela negara yang paling mendasar bagi siswa: bangsa yang kuat membutuhkan generasi yang cerdas dan berkarakter.",
  "antihoks": "Tercatat! Di era modern, ancaman juga datang lewat informasi. Tidak menyebar hoaks dan bijak bermedia sosial adalah bela negara di ruang digital.",
  "persatuan": "Tercatat! Menjaga persatuan adalah benteng menghadapi ATHG: bangsa yang bersatu sulit dipecah belah oleh ancaman dari mana pun."
};
  function renderPoll(pilihan, simpan) {
    document.querySelectorAll('[data-poll]').forEach(function (btn) {
      btn.classList.toggle('chosen', btn.getAttribute('data-poll') === pilihan);
    });
    if (pilihan && POLL_MSG[pilihan]) {
      showFb($('pollFb'), true, POLL_MSG[pilihan]);
      if (simpan) store('mpi-pp-n3-polling', pilihan);
    }
  }
  document.querySelectorAll('[data-poll]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      renderPoll(btn.getAttribute('data-poll'), true);
      markVisited('sub1');
    });
  });
  renderPoll(read('mpi-pp-n3-polling', null), false);

  /* ---------- Sub-bab 2: buka babak bertahap ---------- */
  document.querySelectorAll('[data-buka]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = $(btn.getAttribute('data-buka'));
      if (target) {
        target.classList.remove('tersembunyi');
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      btn.disabled = true;
      btn.textContent = 'Babak berikutnya sudah dibuka ↓';
      markVisited('sub2');
    });
  });

  /* ---------- Cek paham singkat ---------- */
  document.querySelectorAll('[data-cek]').forEach(function (box) {
    var fb = box.querySelector('.feedback');
    var buttons = box.querySelectorAll('.cek-btn');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var benar = btn.getAttribute('data-benar') === '1';
        if (benar) {
          buttons.forEach(function (b) {
            b.disabled = true;
            if (b === btn) b.classList.add('correct');
          });
          showFb(fb, true, 'Benar! Jawabannya: ' + btn.textContent + '.');
        } else {
          btn.classList.add('wrong');
          btn.disabled = true;
          showFb(fb, false, 'Belum tepat. Baca lagi materi di atas, lalu coba pilihan lain.');
        }
      });
    });
  });

  /* ---------- Sub-bab 3: skenario sikap ---------- */
  var SKENARIO = {
  "teruskan": {
    "ok": false,
    "msg": "Meneruskan hoaks berarti ikut menyebarkan gangguan yang memecah persatuan bangsa. Sekali terkirim, pesan bohong sulit ditarik kembali. Coba pertimbangkan pilihan lain."
  },
  "cek": {
    "ok": true,
    "msg": "Tepat! Tidak meneruskan, memeriksa kebenaran, dan mengingatkan teman adalah bela negara di era digital. Kamu ikut menjaga persatuan dan keamanan bangsa dari gangguan informasi."
  },
  "diam": {
    "ok": false,
    "msg": "Tidak meneruskan memang lebih baik, tetapi membiarkan hoaks menyebar tetap merugikan. Kamu bisa berperan aktif dengan mengingatkan teman secara sopan. Coba pertimbangkan pilihan lain."
  }
};
  document.querySelectorAll('[data-skenario]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.getAttribute('data-skenario');
      var info = SKENARIO[key];
      document.querySelectorAll('[data-skenario]').forEach(function (b) {
        b.classList.toggle('best', b === btn && info.ok);
        b.classList.toggle('weak', b === btn && !info.ok);
      });
      showFb($('skenarioFb'), info.ok, info.msg);
      if (info.ok) markVisited('sub3');
    });
  });

  /* ---------- Sub-bab 4: sortir kartu (pola lini masa) ---------- */
  var EVENTS = [
  {
    "target": "ancaman",
    "label": "Aksi terorisme yang mengancam keselamatan warga dan keutuhan bangsa"
  },
  {
    "target": "ancaman",
    "label": "Kejahatan siber yang menyerang data dan jaringan negara"
  },
  {
    "target": "tantangan",
    "label": "Kemajuan teknologi global yang menuntut bangsa meningkatkan kemampuannya"
  },
  {
    "target": "tantangan",
    "label": "Persaingan global yang menguji daya saing dan kemampuan bangsa"
  },
  {
    "target": "hambatan",
    "label": "Rendahnya kesadaran sebagian warga di dalam negeri untuk menaati aturan"
  },
  {
    "target": "hambatan",
    "label": "Kurangnya kepedulian sebagian masyarakat terhadap persatuan bangsa"
  },
  {
    "target": "gangguan",
    "label": "Provokasi dari pihak luar yang mengganggu ketertiban dan persatuan"
  },
  {
    "target": "gangguan",
    "label": "Penyebaran hoaks dari luar yang mengadu domba masyarakat Indonesia"
  }
];
  var NAMA_SLOT = {"ancaman": "Ancaman", "tantangan": "Tantangan", "hambatan": "Hambatan", "gangguan": "Gangguan"};
  var TL_TOTAL = EVENTS.length;
  var tlTerpasang = 0;
  var tlDipilih = null;

  function acak(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }
  function tlUpdateProgress() {
    var el = $('tlProgress');
    if (el) el.textContent = tlTerpasang + ' dari ' + TL_TOTAL + ' kartu terpasang tepat.';
  }
  function tlPilih(card) {
    if (tlDipilih) tlDipilih.classList.remove('terpilih');
    tlDipilih = card;
    if (card) card.classList.add('terpilih');
  }
  function tlPasang(card, slot) {
    if (!card || !slot) return;
    var kunciSlot = slot.getAttribute('data-slot');
    if (card.getAttribute('data-target') === kunciSlot) {
      var drop = slot.querySelector('.tl-drop');
      slot.classList.add('terisi');
      if (drop) {
        if (drop.getAttribute('data-kosong') === '1') { drop.textContent = ''; drop.setAttribute('data-kosong', '0'); }
        drop.appendChild(card);
      }
      card.classList.remove('terpilih');
      card.classList.add('terpasang');
      card.disabled = true;
      card.draggable = false;
      if (tlDipilih === card) tlDipilih = null;
      tlTerpasang++;
      tlUpdateProgress();
      if (tlTerpasang === TL_TOTAL) {
        slot.classList.add('benar');
        document.querySelectorAll('.tl-slot').forEach(function (s) { s.classList.add('benar'); });
        showFb($('tlFb'), true, "Sempurna! Kedelapan kartu sudah berada di kategori ATHG yang tepat. Ingat: ancaman membahayakan kedaulatan dan keselamatan bangsa; tantangan menguji kemampuan; hambatan adalah kendala dari dalam; gangguan adalah kendala dari luar.");
        markVisited('sub4');
      } else {
        showFb($('tlFb'), true, 'Tepat! \u201C' + card.textContent + '\u201D memang termasuk: ' + NAMA_SLOT[kunciSlot] + '.');
      }
    } else {
      slot.classList.remove('goyang');
      void slot.offsetWidth;
      slot.classList.add('goyang');
      showFb($('tlFb'), false, 'Belum tepat. \u201C' + card.textContent + '\u201D tidak termasuk: ' + NAMA_SLOT[kunciSlot] + '. Pikirkan lagi maknanya, lalu coba kotak lain.');
    }
  }
  function tlBangun() {
    tlTerpasang = 0;
    tlDipilih = null;
    document.querySelectorAll('.tl-slot').forEach(function (slot) {
      slot.classList.remove('terisi', 'benar', 'goyang');
      var drop = slot.querySelector('.tl-drop');
      if (drop) { drop.textContent = 'Letakkan kartu di sini'; drop.setAttribute('data-kosong', '1'); }
    });
    var pool = $('tlPool');
    if (!pool) return;
    pool.innerHTML = '';
    acak(EVENTS).forEach(function (ev) {
      var card = document.createElement('button');
      card.type = 'button';
      card.className = 'tl-card';
      card.textContent = ev.label;
      card.setAttribute('data-target', ev.target);
      card.draggable = true;
      card.addEventListener('click', function () {
        if (card.classList.contains('terpasang')) return;
        tlPilih(tlDipilih === card ? null : card);
      });
      card.addEventListener('dragstart', function (e) {
        tlPilih(card);
        if (e.dataTransfer) e.dataTransfer.setData('text/plain', ev.target);
      });
      pool.appendChild(card);
    });
    tlUpdateProgress();
    var fb = $('tlFb');
    if (fb) { fb.textContent = ''; fb.className = 'feedback'; }
  }
  document.querySelectorAll('.tl-slot').forEach(function (slot) {
    slot.addEventListener('click', function () {
      if (tlDipilih) tlPasang(tlDipilih, slot);
    });
    slot.addEventListener('dragover', function (e) {
      e.preventDefault();
      slot.classList.add('dragover');
    });
    slot.addEventListener('dragleave', function () { slot.classList.remove('dragover'); });
    slot.addEventListener('drop', function (e) {
      e.preventDefault();
      slot.classList.remove('dragover');
      if (tlDipilih) tlPasang(tlDipilih, slot);
    });
  });
  var tlReset = $('tlReset');
  if (tlReset) tlReset.addEventListener('click', tlBangun);
  tlBangun();

  /* ---------- Sub-bab 4: cocokkan pasangan ---------- */
  var MATCH = {
  "asean": {
    "s1": "Salah satu negara pendiri",
    "s2": "Ikut mendirikan organisasi kerja sama Asia Tenggara pada 8 Agustus 1967",
    "ok": "Tepat: Indonesia adalah salah satu pendiri ASEAN pada 8 Agustus 1967.",
    "no": "Belum tepat. Indonesia adalah salah satu negara pendiri ASEAN pada 8 Agustus 1967."
  },
  "kaa": {
    "s1": "Tuan rumah penyelenggara",
    "s2": "Menyelenggarakan konferensi yang melahirkan Dasa Sila Bandung",
    "ok": "Tepat: Indonesia menjadi tuan rumah Konferensi Asia-Afrika di Bandung tahun 1955 yang melahirkan Dasa Sila Bandung.",
    "no": "Belum tepat. Pada KAA 1955, Indonesia adalah tuan rumah penyelenggara di Bandung."
  },
  "gnb": {
    "s1": "Ikut mempelopori gerakan",
    "s2": "Mempelopori gerakan negara-negara yang tidak memihak blok mana pun",
    "ok": "Tepat: Indonesia ikut mempelopori Gerakan Non-Blok (1961), gerakan negara-negara yang tidak memihak blok mana pun.",
    "no": "Belum tepat. Indonesia adalah salah satu pelopor Gerakan Non-Blok tahun 1961."
  },
  "garuda": {
    "s1": "Mengirim pasukan perdamaian",
    "s2": "Mengirim Kontingen Garuda untuk misi perdamaian dunia sejak 1957",
    "ok": "Tepat: Indonesia mengirim pasukan perdamaian PBB bernama Kontingen Garuda sejak 1957.",
    "no": "Belum tepat. Peran Indonesia adalah mengirim pasukan perdamaian PBB, Kontingen Garuda, sejak 1957."
  }
};
  var matchCheck = $('matchCheck');
  if (matchCheck) {
    matchCheck.addEventListener('click', function () {
      var semuaBenar = true;
      var adaKosong = false;
      document.querySelectorAll('.match-row').forEach(function (row) {
        var data = MATCH[row.getAttribute('data-kunci')];
        var s1 = row.querySelector('.match-s1');
        var s2 = row.querySelector('.match-s2');
        var fb = row.querySelector('.match-fb');
        if (!data || !s1 || !s2) return;
        if (!s1.value || !s2.value) {
          adaKosong = true;
          semuaBenar = false;
          row.classList.remove('ok', 'no');
          if (fb) fb.textContent = 'Lengkapi dulu kedua pilihannya.';
          return;
        }
        var ok = (s1.value === data.s1) && (s2.value === data.s2);
        if (!ok) semuaBenar = false;
        row.classList.toggle('ok', ok);
        row.classList.toggle('no', !ok);
        if (fb) fb.textContent = ok ? data.ok : data.no;
      });
      if (adaKosong) {
        showFb($('matchFb'), false, 'Masih ada pasangan yang belum lengkap. Isi kedua pilihan untuk semua baris, lalu periksa lagi.');
      } else if (semuaBenar) {
        showFb($('matchFb'), true, "Semua pasangan tepat! ASEAN, KAA Bandung 1955, Gerakan Non-Blok, dan Kontingen Garuda adalah bukti peran aktif Indonesia di dunia.");
        markVisited('sub4');
      } else {
        showFb($('matchFb'), false, 'Sebagian pasangan belum tepat. Perhatikan keterangan di bawah tiap baris, lalu perbaiki.');
      }
    });
  }

  /* ---------- Sub-bab 5: komitmen ---------- */
  var komitmenText = $('komitmenText');
  if (komitmenText) {
    var simpanan = read('mpi-pp-n3-komitmen', '');
    if (simpanan) komitmenText.value = simpanan;
  }
  var komitmenSave = $('komitmenSave');
  if (komitmenSave) {
    komitmenSave.addEventListener('click', function () {
      var isi = komitmenText ? komitmenText.value.trim() : '';
      var st = $('komitmenStatus');
      if (!isi) {
        if (st) st.textContent = 'Tulis dulu komitmenmu, lalu simpan.';
        return;
      }
      store('mpi-pp-n3-komitmen', isi);
      if (st) st.textContent = 'Komitmen tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '. Tunjukkan kepada gurumu pada pertemuan berikutnya.';
      markVisited('sub5');
    });
  }

  /* ---------- Sub-bab 6: kuis 10 soal ---------- */
  /* Kunci terverifikasi manual, distribusinya seimbang A2/B3/C2/D3:
     1) B  2) C  3) D  4) A  5) D  6) B  7) A  8) C  9) B  10) D */
  var QUIZ = [
  {
    "q": "Dasar hukum bela negara dalam Pasal 27 ayat (3) UUD NRI Tahun 1945 menyatakan …",
    "options": [
      "bela negara hanya kewajiban TNI dan Polri",
      "setiap warga negara berhak dan wajib ikut serta dalam upaya pembelaan negara",
      "warga negara bebas dari kewajiban membela negara",
      "bela negara hanya dilakukan saat perang"
    ],
    "answer": 1,
    "why": "Pasal 27 ayat (3) menyatakan setiap warga negara berhak dan wajib ikut serta dalam upaya pembelaan negara."
  },
  {
    "q": "SISHANKAMRATA adalah singkatan dari …",
    "options": [
      "Sistem Pertahanan dan Keamanan Rakyat Indonesia",
      "Sistem Pertahanan Negara Rakyat Semesta",
      "Sistem Pertahanan dan Keamanan Rakyat Semesta",
      "Sistem Keamanan dan Ketertiban Rakyat Semesta"
    ],
    "answer": 2,
    "why": "SISHANKAMRATA adalah Sistem Pertahanan dan Keamanan Rakyat Semesta, sebagaimana dimaksud Pasal 30 ayat (2) UUD NRI Tahun 1945."
  },
  {
    "q": "Dalam SISHANKAMRATA, kekuatan utama pertahanan dan keamanan negara adalah …",
    "options": [
      "rakyat sipil",
      "organisasi internasional",
      "pemerintah daerah",
      "TNI dan Polri, dengan rakyat sebagai kekuatan pendukung"
    ],
    "answer": 3,
    "why": "Dalam SISHANKAMRATA, TNI dan Polri merupakan kekuatan utama, sedangkan rakyat adalah kekuatan pendukung."
  },
  {
    "q": "Penyelenggaraan pertahanan negara diatur dalam …",
    "options": [
      "UU No. 3 Tahun 2002 tentang Pertahanan Negara",
      "UU No. 20 Tahun 2003 tentang Sistem Pendidikan Nasional",
      "Pasal 32 UUD NRI Tahun 1945",
      "Piagam Jakarta"
    ],
    "answer": 0,
    "why": "Pertahanan negara diatur dalam UU No. 3 Tahun 2002 tentang Pertahanan Negara."
  },
  {
    "q": "Politik luar negeri yang dijalankan Indonesia adalah …",
    "options": [
      "tertutup dan netral pasif",
      "memihak satu blok kekuatan dunia",
      "mengikuti negara adidaya",
      "bebas aktif"
    ],
    "answer": 3,
    "why": "Indonesia menjalankan politik luar negeri bebas aktif: bebas menentukan sikap dan aktif berperan dalam perdamaian dunia."
  },
  {
    "q": "Indonesia adalah salah satu negara pendiri ASEAN yang dibentuk pada tahun …",
    "options": [
      "1955",
      "1967",
      "1961",
      "1957"
    ],
    "answer": 1,
    "why": "ASEAN didirikan pada 8 Agustus 1967, dan Indonesia adalah salah satu negara pendirinya."
  },
  {
    "q": "Konferensi Asia-Afrika pada tahun 1955 diselenggarakan di kota …",
    "options": [
      "Bandung",
      "Jakarta",
      "Bangkok",
      "Kuala Lumpur"
    ],
    "answer": 0,
    "why": "Konferensi Asia-Afrika diselenggarakan di Bandung pada tahun 1955 dan melahirkan semangat Dasa Sila Bandung."
  },
  {
    "q": "Pasukan perdamaian PBB yang dikirim Indonesia sejak 1957 disebut …",
    "options": [
      "Pasukan Garuda Nusantara",
      "Korps Perdamaian Indonesia",
      "Kontingen Garuda",
      "Brigade Perdamaian"
    ],
    "answer": 2,
    "why": "Pasukan perdamaian Indonesia untuk PBB disebut Kontingen Garuda, dikirim sejak 1957."
  },
  {
    "q": "Contoh ancaman dalam ATHG adalah …",
    "options": [
      "persaingan global yang sehat",
      "terorisme dan kejahatan siber",
      "kemajuan teknologi informasi",
      "kerja sama antarbangsa"
    ],
    "answer": 1,
    "why": "Ancaman adalah usaha atau kegiatan yang membahayakan kedaulatan, keutuhan wilayah, dan keselamatan bangsa, misalnya terorisme dan kejahatan siber. Peredaran narkoba juga termasuk ancaman."
  },
  {
    "q": "Wujud bela negara yang tepat bagi siswa adalah …",
    "options": [
      "menjadi tentara sejak SMP",
      "menyebarkan berita tanpa memeriksa kebenarannya",
      "menghindari semua kegiatan sekolah",
      "belajar sungguh-sungguh, menjaga persatuan, dan tidak menyebar hoaks"
    ],
    "answer": 3,
    "why": "Bela negara siswa diwujudkan dengan belajar sungguh-sungguh, cinta tanah air, menjaga persatuan, menaati aturan, bijak bermedia sosial, dan melestarikan budaya."
  }
];
  var qi = 0;
  var qScore = 0;
  var qAnswered = false;
  var letters = ['A', 'B', 'C', 'D'];

  function renderQuiz() {
    var item = QUIZ[qi];
    var qEl = $('quizQuestion');
    if (qEl) qEl.textContent = (qi + 1) + '. ' + item.q;
    var prog = $('quizProgress');
    if (prog) prog.textContent = 'Soal ' + (qi + 1) + ' dari 10';
    var live = $('quizScoreLive');
    if (live) live.textContent = 'Skor sementara: ' + qScore;
    var box = $('quizOptions');
    if (box) {
      box.innerHTML = '';
      item.options.forEach(function (opt, idx) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'opt-btn';
        btn.innerHTML = '<span class="letter">' + letters[idx] + '</span><span></span>';
        btn.lastChild.textContent = opt;
        btn.addEventListener('click', function () { answerQuiz(idx, btn); });
        box.appendChild(btn);
      });
    }
    var fb = $('quizFb');
    if (fb) { fb.textContent = ''; fb.className = 'feedback'; }
    var next = $('quizNext');
    if (next) {
      next.disabled = true;
      next.textContent = qi === QUIZ.length - 1 ? 'Lihat Hasil \u2192' : 'Soal Berikutnya \u2192';
    }
    qAnswered = false;
  }

  function answerQuiz(idx, btn) {
    if (qAnswered) return;
    qAnswered = true;
    var item = QUIZ[qi];
    var ok = idx === item.answer;
    if (ok) qScore++;
    var live = $('quizScoreLive');
    if (live) live.textContent = 'Skor sementara: ' + qScore;
    var buttons = document.querySelectorAll('#quizOptions .opt-btn');
    buttons.forEach(function (b, i) {
      b.disabled = true;
      if (i === item.answer) b.classList.add('correct');
      else if (i === idx) b.classList.add('wrong');
    });
    showFb($('quizFb'), ok, (ok ? 'Benar! ' : 'Belum tepat. ') + item.why);
    var next = $('quizNext');
    if (next) next.disabled = false;
  }

  function finishQuiz() {
    var box = $('quizBox');
    var res = $('quizResult');
    if (box) box.hidden = true;
    if (res) res.hidden = false;
    var scoreEl = $('quizScore');
    if (scoreEl) scoreEl.textContent = qScore + '/10';
    var ring = $('quizRing');
    if (ring) ring.style.setProperty('--p', (qScore * 10) + '%');
    var msg = $('quizMsg');
    if (msg) {
      msg.textContent = qScore === 10 ? "Sempurna! Kamu menguasai dasar hukum bela negara, SISHANKAMRATA, peran Indonesia, dan ATHG."
        : qScore >= 8 ? 'Hebat! Tinggal sedikit lagi menuju sempurna.'
        : qScore >= 6 ? 'Bagus! Ulangi bagian yang masih salah, lalu coba lagi.'
        : "Terus berlatih! Buka lagi babak-babak di Sub-bab 2 dan permainan di Sub-bab 4, lalu ulangi kuisnya.";
    }
    var prevBest = read('mpi-pp-n3-quiz-best', null);
    var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-pp-n3-quiz-best', String(qScore));
    var bestNow = Math.max(qScore, prevNum);
    var bestLine = $('quizBestLine');
    if (bestLine) bestLine.textContent = 'Skor terbaikmu: ' + bestNow + '/10. Skor ini tersimpan di perangkat ini.';
    if (bestEl) {
      bestEl.textContent = 'Skor terbaik kuis: ' + bestNow + '/10';
      bestEl.hidden = false;
    }
    markVisited('sub6');
  }

  var quizNext = $('quizNext');
  if (quizNext) {
    quizNext.addEventListener('click', function () {
      if (!qAnswered) return;
      if (qi < QUIZ.length - 1) { qi++; renderQuiz(); }
      else finishQuiz();
    });
  }
  var quizRetry = $('quizRetry');
  if (quizRetry) {
    quizRetry.addEventListener('click', function () {
      qi = 0; qScore = 0; qAnswered = false;
      var res = $('quizResult'); if (res) res.hidden = true;
      var box = $('quizBox'); if (box) box.hidden = false;
      renderQuiz();
    });
  }
  renderQuiz();

  /* ---------- Refleksi ---------- */
  function loadRefleksi() {
    var saved = null;
    try { saved = JSON.parse(read('mpi-pp-n3-refleksi', 'null')); } catch (e) { saved = null; }
    if (!saved) return;
    if ($('refQ1') && saved.q1) $('refQ1').value = saved.q1;
    if ($('refQ2') && saved.q2) $('refQ2').value = saved.q2;
    if ($('refQ3') && saved.q3) $('refQ3').value = saved.q3;
  }
  loadRefleksi();
  var refSave = $('refSave');
  if (refSave) {
    refSave.addEventListener('click', function () {
      var data = {
        q1: $('refQ1') ? $('refQ1').value : '',
        q2: $('refQ2') ? $('refQ2').value : '',
        q3: $('refQ3') ? $('refQ3').value : ''
      };
      store('mpi-pp-n3-refleksi', JSON.stringify(data));
      var st = $('refStatus');
      if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
      markVisited('sub6');
    });
  }
})();
