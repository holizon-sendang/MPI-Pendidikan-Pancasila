/* U.6 Hak dan Kewajiban Warga Negara — script.js
   Vanilla JS, tanpa framework. Semua fakta dan kunci jawaban mengikuti
   spesifikasi modul dan diverifikasi manual.
   localStorage (semua berawalan mpi-pp-u6- agar tidak bertabrakan
   dengan modul lain pada domain github.io yang sama):
   mpi-pp-u6-visited, mpi-pp-u6-quiz-best, mpi-pp-u6-polling,
   mpi-pp-u6-komitmen, mpi-pp-u6-refleksi. */
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
  try { visited = JSON.parse(read('mpi-pp-u6-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];

  function saveVisited() { store('mpi-pp-u6-visited', JSON.stringify(visited)); }
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
  var bestStored = read('mpi-pp-u6-quiz-best', null);
  if (bestStored !== null && bestEl) {
    bestEl.textContent = 'Skor terbaik kuis: ' + bestStored + '/10';
    bestEl.hidden = false;
  }

  /* ---------- Sub-bab 1: polling ---------- */
  var POLL_MSG = {
  "seimbang": "Tepat! Hak dan kewajiban berjalan seiring: kita menuntut hak sambil menunaikan kewajiban. Warga negara yang baik tidak hanya menuntut, tetapi juga melaksanakan kewajibannya.",
  "hak-dulu": "Tercatat. Menuntut hak memang hak setiap warga negara, tetapi hak dan kewajiban harus berjalan seimbang: kewajiban ditunaikan, hak pun terpenuhi dengan tertib.",
  "kewajiban-saja": "Tercatat. Kewajiban memang harus ditunaikan, tetapi warga negara juga memiliki hak yang dijamin UUD. Kuncinya adalah keseimbangan: menuntut hak sambil menunaikan kewajiban."
};
  function renderPoll(pilihan, simpan) {
    document.querySelectorAll('[data-poll]').forEach(function (btn) {
      btn.classList.toggle('chosen', btn.getAttribute('data-poll') === pilihan);
    });
    if (pilihan && POLL_MSG[pilihan]) {
      showFb($('pollFb'), true, POLL_MSG[pilihan]);
      if (simpan) store('mpi-pp-u6-polling', pilihan);
    }
  }
  document.querySelectorAll('[data-poll]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      renderPoll(btn.getAttribute('data-poll'), true);
      markVisited('sub1');
    });
  });
  renderPoll(read('mpi-pp-u6-polling', null), false);

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

  /* ---------- Cek paham singkat (Sub-bab 2 & 4) ---------- */
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
  "tuntut": {
    "ok": false,
    "msg": "Hanya menuntut hak tanpa menunaikan kewajiban membuat kehidupan bersama tidak seimbang. Hak atas fasilitas sekolah, misalnya, disertai kewajiban menjaga dan menggunakannya dengan tertib. Coba pertimbangkan pilihan lain."
  },
  "seimbang": {
    "ok": true,
    "msg": "Tepat! Inilah penerapan hak dan kewajiban secara seimbang: menikmati hak sebagai warga sekolah sambil menunaikan kewajiban menjaga fasilitas dan menaati aturan. Sikap ini juga menghormati hak orang lain."
  },
  "acuh": {
    "ok": false,
    "msg": "Acuh terhadap hak dan kewajiban membuat kita kehilangan manfaat keduanya dan merugikan orang lain. Warga negara yang baik peduli pada haknya dan setia pada kewajibannya. Coba pertimbangkan pilihan lain."
  }
};
  document.querySelectorAll('[data-skenario]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.getAttribute('data-skenario');
      var info = SKENARIO[key];
      if (!info) return;
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
    "target": "hak",
    "label": "Mendapat pendidikan"
  },
  {
    "target": "hak",
    "label": "Memeluk agama dan beribadat menurut keyakinan"
  },
  {
    "target": "hak",
    "label": "Mendapatkan pekerjaan dan penghidupan yang layak"
  },
  {
    "target": "hak",
    "label": "Berserikat dan berkumpul"
  },
  {
    "target": "hak",
    "label": "Mengeluarkan pikiran dengan lisan dan tulisan"
  },
  {
    "target": "kewajiban",
    "label": "Menjunjung hukum dan pemerintahan"
  },
  {
    "target": "kewajiban",
    "label": "Ikut serta dalam upaya pembelaan negara"
  },
  {
    "target": "kewajiban",
    "label": "Menghormati hak asasi manusia orang lain"
  },
  {
    "target": "kewajiban",
    "label": "Mengikuti pendidikan dasar"
  },
  {
    "target": "kewajiban",
    "label": "Ikut serta dalam usaha pertahanan dan keamanan negara"
  }
];
  var NAMA_SLOT = {"hak": "hak warga negara", "kewajiban": "kewajiban warga negara"};
  var TL_LABEL = 'kelompok ini';
  var TL_DONE_MSG = 'Sempurna! Kesepuluh kartu sudah terpilah tepat: lima hak dan lima kewajiban warga negara menurut UUD NRI 1945. Ingat, keduanya harus dilaksanakan secara seimbang.';
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
    if (el) el.textContent = tlTerpasang + ' dari ' + EVENTS.length + ' kartu terpasang tepat.';
  }
  function tlPilih(card) {
    if (tlDipilih) tlDipilih.classList.remove('terpilih');
    tlDipilih = card;
    if (card) card.classList.add('terpilih');
  }
  function tlPasang(card, slot) {
    if (!card || !slot || slot.classList.contains('benar')) return;
    var kunciSlot = slot.getAttribute('data-slot');
    if (card.getAttribute('data-target') === kunciSlot) {
      var drop = slot.querySelector('.tl-drop');
      slot.classList.add('terisi', 'benar');
      if (drop) { drop.textContent = ''; drop.appendChild(card); }
      card.classList.remove('terpilih');
      card.classList.add('terpasang');
      card.disabled = true;
      card.draggable = false;
      if (tlDipilih === card) tlDipilih = null;
      tlTerpasang++;
      tlUpdateProgress();
      if (tlTerpasang === EVENTS.length) {
        showFb($('tlFb'), true, TL_DONE_MSG);
        markVisited('sub4');
      } else {
        showFb($('tlFb'), true, 'Tepat! “' + card.textContent + '” memang termasuk ' + (NAMA_SLOT[kunciSlot] || TL_LABEL) + '.');
      }
    } else {
      slot.classList.remove('goyang');
      void slot.offsetWidth;
      slot.classList.add('goyang');
      showFb($('tlFb'), false, 'Belum tepat. “' + card.textContent + '” tidak termasuk ' + (NAMA_SLOT[kunciSlot] || TL_LABEL) + '. Ingat kembali materi di Sub-bab 2, lalu coba kotak lain.');
    }
  }
  function tlBangun() {
    tlTerpasang = 0;
    tlDipilih = null;
    document.querySelectorAll('.tl-slot').forEach(function (slot) {
      slot.classList.remove('terisi', 'benar', 'goyang');
      var drop = slot.querySelector('.tl-drop');
      if (drop) drop.textContent = 'Letakkan kartu di sini';
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
  if ($('tlPool')) tlBangun();

  /* ---------- Sub-bab 4: cocokkan pasangan ---------- */
  var MATCH = {
  "h272": {
    "value": "Pasal 27 ayat (2)",
    "okMsg": "Tepat: hak atas pekerjaan dan penghidupan yang layak bagi kemanusiaan diatur dalam Pasal 27 ayat (2).",
    "noMsg": "Belum tepat. Hak atas pekerjaan dan penghidupan yang layak diatur dalam Pasal 27 ayat (2)."
  },
  "h311": {
    "value": "Pasal 31 ayat (1)",
    "okMsg": "Tepat: hak mendapat pendidikan diatur dalam Pasal 31 ayat (1): setiap warga negara berhak mendapat pendidikan.",
    "noMsg": "Belum tepat. Hak mendapat pendidikan diatur dalam Pasal 31 ayat (1)."
  },
  "k271": {
    "value": "Pasal 27 ayat (1)",
    "okMsg": "Tepat: kewajiban menjunjung hukum dan pemerintahan diatur dalam Pasal 27 ayat (1).",
    "noMsg": "Belum tepat. Kewajiban menjunjung hukum dan pemerintahan diatur dalam Pasal 27 ayat (1)."
  },
  "k28j": {
    "value": "Pasal 28J ayat (1)",
    "okMsg": "Tepat: kewajiban menghormati hak asasi manusia orang lain diatur dalam Pasal 28J ayat (1).",
    "noMsg": "Belum tepat. Kewajiban menghormati HAM orang lain diatur dalam Pasal 28J ayat (1)."
  },
  "k312": {
    "value": "Pasal 31 ayat (2)",
    "okMsg": "Tepat: kewajiban mengikuti pendidikan dasar diatur dalam Pasal 31 ayat (2).",
    "noMsg": "Belum tepat. Kewajiban mengikuti pendidikan dasar diatur dalam Pasal 31 ayat (2)."
  }
};
  var matchCheck = $('matchCheck');
  if (matchCheck) {
    matchCheck.addEventListener('click', function () {
      var semuaBenar = true;
      var adaKosong = false;
      document.querySelectorAll('.match-row').forEach(function (row) {
        var data = MATCH[row.getAttribute('data-match')];
        var sel = row.querySelector('.match-sel');
        var fb = row.querySelector('.match-fb');
        if (!data || !sel) return;
        if (!sel.value) {
          adaKosong = true;
          semuaBenar = false;
          row.classList.remove('ok', 'no');
          if (fb) fb.textContent = 'Lengkapi dulu pasangannya.';
          return;
        }
        var ok = sel.value === data.value;
        if (!ok) semuaBenar = false;
        row.classList.toggle('ok', ok);
        row.classList.toggle('no', !ok);
        if (fb) fb.textContent = ok ? data.okMsg : data.noMsg;
      });
      if (adaKosong) {
        showFb($('matchFb'), false, 'Masih ada pasangan yang belum lengkap. Isi semua pasangan, lalu periksa lagi.');
      } else if (semuaBenar) {
        showFb($('matchFb'), true, 'Semua pasangan tepat! Pasal 27 ayat (2) hak pekerjaan layak, Pasal 31 ayat (1) hak pendidikan, Pasal 27 ayat (1) kewajiban menjunjung hukum, Pasal 28J ayat (1) kewajiban menghormati HAM orang lain, dan Pasal 31 ayat (2) kewajiban pendidikan dasar.');
        markVisited('sub4');
      } else {
        showFb($('matchFb'), false, 'Sebagian pasangan belum tepat. Perhatikan keterangan di bawah tiap baris, lalu perbaiki.');
      }
    });
  }

  /* ---------- Sub-bab 4: urutkan langkah ---------- */
  var URUTAN = [];
  var urutCheck = $('urutCheck');
  if (urutCheck) {
    urutCheck.addEventListener('click', function () {
      var vals = URUTAN.map(function (_, i) {
        var el = $('urut' + (i + 1));
        return el ? el.value : '';
      });
      var fb = $('urutFb');
      if (vals.indexOf('') !== -1) { showFb(fb, false, 'Isi semua posisi dulu.'); return; }
      if (new Set(vals).size !== URUTAN.length) { showFb(fb, false, 'Ada langkah yang terulang. Tiap langkah dipakai tepat satu kali.'); return; }
      var benar = 0;
      vals.forEach(function (v, i) { if (v === URUTAN[i]) benar++; });
      if (benar === URUTAN.length) {
        showFb(fb, true, '');
        markVisited('sub4');
      } else {
        showFb(fb, false, benar + ' dari ' + URUTAN.length + ' posisi sudah tepat. Urutan yang benar: ' + URUTAN.map(function (u, i) { return (i + 1) + ') ' + u; }).join(', ') + '.');
      }
    });
  }

  /* ---------- Sub-bab 5: komitmen ---------- */
  var komitmenText = $('komitmenText');
  if (komitmenText) {
    var simpanan = read('mpi-pp-u6-komitmen', '');
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
      store('mpi-pp-u6-komitmen', isi);
      if (st) st.textContent = 'Komitmen tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '. Tunjukkan kepada gurumu pada pertemuan berikutnya.';
      markVisited('sub5');
    });
  }

  /* ---------- Sub-bab 6: kuis 10 soal ---------- */
  /* Sebaran topik: soal 1-4 hak warga negara dan pasalnya,
     5 HAM Bab XA, 6-9 kewajiban dan pasalnya, 10 keseimbangan.
     Kunci terverifikasi manual, distribusinya seimbang A2/B3/C2/D3:
     1) B  2) C  3) D  4) A  5) D  6) B  7) A  8) C  9) B  10) D */
  var QUIZ = [
  {
    "q": "Hak warga negara atas pekerjaan dan penghidupan yang layak bagi kemanusiaan diatur dalam Pasal …",
    "options": [
      "27 ayat (1)",
      "27 ayat (2)",
      "28",
      "31 ayat (1)"
    ],
    "answer": 1,
    "why": "Pasal 27 ayat (2) berbunyi: tiap-tiap warga negara berhak atas pekerjaan dan penghidupan yang layak bagi kemanusiaan."
  },
  {
    "q": "Kemerdekaan berserikat dan berkumpul, mengeluarkan pikiran dengan lisan dan tulisan, diatur dalam Pasal …",
    "options": [
      "29 ayat (2)",
      "30 ayat (1)",
      "28",
      "27 ayat (3)"
    ],
    "answer": 2,
    "why": "Pasal 28 menjamin kemerdekaan berserikat dan berkumpul, mengeluarkan pikiran dengan lisan dan tulisan, dan sebagainya."
  },
  {
    "q": "Negara menjamin kemerdekaan tiap penduduk untuk memeluk agamanya masing-masing dan untuk beribadat menurut agama dan kepercayaannya. Ketentuan ini terdapat dalam Pasal …",
    "options": [
      "28E ayat (3)",
      "27 ayat (2)",
      "31 ayat (2)",
      "29 ayat (2)"
    ],
    "answer": 3,
    "why": "Jaminan kebebasan memeluk agama dan beribadat terdapat dalam Pasal 29 ayat (2)."
  },
  {
    "q": "Hak setiap warga negara untuk mendapat pendidikan diatur dalam Pasal …",
    "options": [
      "31 ayat (1)",
      "31 ayat (2)",
      "28C ayat (1)",
      "27 ayat (2)"
    ],
    "answer": 0,
    "why": "Pasal 31 ayat (1) berbunyi: setiap warga negara berhak mendapat pendidikan. Adapun ayat (2) mengatur kewajibannya."
  },
  {
    "q": "Hak asasi manusia dalam UUD NRI 1945 diatur dalam Bab XA, yaitu Pasal …",
    "options": [
      "27 sampai 34",
      "29 sampai 34",
      "36A sampai 37",
      "28A sampai 28J"
    ],
    "answer": 3,
    "why": "HAM diatur dalam Bab XA UUD NRI 1945, yaitu Pasal 28A sampai dengan Pasal 28J."
  },
  {
    "q": "Kewajiban warga negara untuk menjunjung hukum dan pemerintahan diatur dalam Pasal …",
    "options": [
      "27 ayat (3)",
      "27 ayat (1)",
      "28J ayat (1)",
      "30 ayat (1)"
    ],
    "answer": 1,
    "why": "Pasal 27 ayat (1) menyatakan segala warga negara bersamaan kedudukannya di dalam hukum dan pemerintahan dan wajib menjunjung hukum dan pemerintahan itu."
  },
  {
    "q": "Setiap warga negara berhak dan wajib ikut serta dalam upaya pembelaan negara. Ketentuan ini terdapat dalam Pasal …",
    "options": [
      "27 ayat (3)",
      "28 ayat (3)",
      "29 ayat (1)",
      "34 ayat (1)"
    ],
    "answer": 0,
    "why": "Pasal 27 ayat (3) berbunyi: setiap warga negara berhak dan wajib ikut serta dalam upaya pembelaan negara."
  },
  {
    "q": "Kewajiban setiap orang untuk menghormati hak asasi manusia orang lain diatur dalam Pasal …",
    "options": [
      "28A",
      "28E ayat (3)",
      "28J ayat (1)",
      "28I ayat (1)"
    ],
    "answer": 2,
    "why": "Pasal 28J ayat (1) menyatakan setiap orang wajib menghormati hak asasi manusia orang lain dalam tertib kehidupan bermasyarakat, berbangsa, dan bernegara."
  },
  {
    "q": "Kewajiban setiap warga negara mengikuti pendidikan dasar diatur dalam Pasal …",
    "options": [
      "31 ayat (1)",
      "31 ayat (2)",
      "27 ayat (1)",
      "30 ayat (1)"
    ],
    "answer": 1,
    "why": "Pasal 31 ayat (2) berbunyi: setiap warga negara wajib mengikuti pendidikan dasar dan pemerintah wajib membiayainya."
  },
  {
    "q": "Pelaksanaan hak dan kewajiban warga negara yang benar adalah …",
    "options": [
      "menuntut hak sebesar-besarnya tanpa kewajiban",
      "melaksanakan kewajiban hanya bila diawasi",
      "mengutamakan hak pribadi di atas hak orang lain",
      "menuntut hak sambil menunaikan kewajiban secara seimbang"
    ],
    "answer": 3,
    "why": "Hak dan kewajiban berjalan seiring: warga negara yang baik menuntut haknya sambil menunaikan kewajibannya, di keluarga, sekolah, masyarakat, bangsa, dan negara."
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
      next.textContent = qi === QUIZ.length - 1 ? 'Lihat Hasil →' : 'Soal Berikutnya →';
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
      msg.textContent = qScore === 10 ? 'Sempurna! Kamu menguasai hak dan kewajiban warga negara beserta pasalnya.'
        : qScore >= 8 ? 'Hebat! Tinggal sedikit lagi menuju sempurna.'
        : qScore >= 6 ? 'Bagus! Ulangi bagian yang masih salah, lalu coba lagi.'
        : 'Terus berlatih! Buka lagi daftar pasal hak dan kewajiban di Sub-bab 2 dan permainan di Sub-bab 4, lalu ulangi kuisnya.';
    }
    var prevBest = read('mpi-pp-u6-quiz-best', null);
    var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-pp-u6-quiz-best', String(qScore));
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
    try { saved = JSON.parse(read('mpi-pp-u6-refleksi', 'null')); } catch (e) { saved = null; }
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
      store('mpi-pp-u6-refleksi', JSON.stringify(data));
      var st = $('refStatus');
      if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
      markVisited('sub6');
    });
  }
})();
