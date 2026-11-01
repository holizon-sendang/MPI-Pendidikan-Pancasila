/* P.8 Hubungan Pancasila dengan UUD NRI Tahun 1945 — script.js
   Vanilla JS, tanpa framework. Semua fakta dan kunci jawaban mengikuti
   spesifikasi modul dan diverifikasi manual.
   localStorage (semua berawalan mpi-pp-p8- agar tidak bertabrakan
   dengan modul lain pada domain github.io yang sama):
   mpi-pp-p8-visited, mpi-pp-p8-quiz-best, mpi-pp-p8-polling,
   mpi-pp-p8-komitmen, mpi-pp-p8-refleksi. */
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
  try { visited = JSON.parse(read('mpi-pp-p8-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];

  function saveVisited() { store('mpi-pp-p8-visited', JSON.stringify(visited)); }
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
  var bestStored = read('mpi-pp-p8-quiz-best', null);
  if (bestStored !== null && bestEl) {
    bestEl.textContent = 'Skor terbaik kuis: ' + bestStored + '/10';
    bestEl.hidden = false;
  }

  /* ---------- Sub-bab 1: polling ---------- */
  var POLL_MSG = {
  "pembukaan": "Tepat! Rumusan Pancasila tercantum dalam Pembukaan UUD NRI 1945 alinea keempat. Pembukaan adalah pokok kaidah fundamental negara, dan pasal-pasal batang tubuh merupakan penjabaran nilai-nilai Pancasila.",
  "batang-tubuh": "Tercatat. Sebenarnya rumusan Pancasila tidak tertulis di batang tubuh, melainkan dalam Pembukaan UUD NRI 1945 alinea keempat. Batang tubuh berisi pasal-pasal yang menjabarkan nilai Pancasila.",
  "aturan-peralihan": "Tercatat. Rumusan Pancasila bukan berada di Aturan Peralihan, melainkan dalam Pembukaan UUD NRI 1945 alinea keempat, bagian yang menjadi pokok kaidah fundamental negara."
};
  function renderPoll(pilihan, simpan) {
    document.querySelectorAll('[data-poll]').forEach(function (btn) {
      btn.classList.toggle('chosen', btn.getAttribute('data-poll') === pilihan);
    });
    if (pilihan && POLL_MSG[pilihan]) {
      showFb($('pollFb'), true, POLL_MSG[pilihan]);
      if (simpan) store('mpi-pp-p8-polling', pilihan);
    }
  }
  document.querySelectorAll('[data-poll]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      renderPoll(btn.getAttribute('data-poll'), true);
      markVisited('sub1');
    });
  });
  renderPoll(read('mpi-pp-p8-polling', null), false);

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
  "asal": {
    "ok": false,
    "msg": "Aturan yang dibuat asal-asalan dan membeda-bedakan teman bertentangan dengan semangat Pancasila dan dapat menimbulkan ketidakadilan. Peraturan yang baik harus menjabarkan nilai Pancasila: adil, manusiawi, dan diputuskan secara musyawarah. Coba pertimbangkan pilihan lain."
  },
  "musyawarah": {
    "ok": true,
    "msg": "Tepat! Menyusun aturan lewat musyawarah dan berlandaskan nilai Pancasila meneladani hubungan Pancasila dengan UUD: Pancasila adalah sumber nilainya, aturan adalah penjabarannya. Aturan seperti ini lebih mudah diterima dan ditaati semua pihak."
  },
  "salin": {
    "ok": false,
    "msg": "Menyalin aturan tanpa memahami nilai di baliknya membuat aturan mudah dilanggar dan tidak sesuai kebutuhan kelas. Pancasila menuntut kita memahami semangatnya, bukan sekadar meniru bunyi aturan. Coba pertimbangkan pilihan lain."
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
    "target": "benar",
    "label": "Pembukaan UUD NRI 1945 tidak diubah dalam amandemen"
  },
  {
    "target": "benar",
    "label": "Pasal 29 merupakan penjabaran sila pertama"
  },
  {
    "target": "benar",
    "label": "Peraturan tidak boleh bertentangan dengan nilai Pancasila dan UUD"
  },
  {
    "target": "salah",
    "label": "Rumusan Pancasila tercantum dalam pasal-pasal batang tubuh"
  },
  {
    "target": "salah",
    "label": "Pembukaan UUD diubah pada setiap amandemen"
  },
  {
    "target": "salah",
    "label": "Pasal 33 merupakan penjabaran sila pertama"
  }
];
  var NAMA_SLOT = {"benar": "pernyataan yang benar", "salah": "pernyataan yang tidak benar"};
  var TL_LABEL = 'kelompok ini';
  var TL_DONE_MSG = 'Sempurna! Semua pernyataan sudah berada di kelompok yang benar. Ingat: Pembukaan tidak diubah dalam amandemen, Pasal 29 menjabarkan sila pertama, Pasal 33 menjabarkan sila kelima, dan peraturan tidak boleh bertentangan dengan Pancasila maupun UUD.';
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
  "sila1": {
    "value": "Pasal 29 (agama)",
    "okMsg": "Tepat: sila pertama Ketuhanan Yang Maha Esa dijabarkan antara lain dalam Pasal 29 tentang agama.",
    "noMsg": "Belum tepat. Sila pertama dijabarkan antara lain dalam Pasal 29 tentang agama."
  },
  "sila2": {
    "value": "Pasal 28A–28J (HAM)",
    "okMsg": "Tepat: sila kedua Kemanusiaan yang adil dan beradab dijabarkan dalam pasal-pasal HAM, Pasal 28A sampai 28J.",
    "noMsg": "Belum tepat. Sila kedua dijabarkan dalam pasal-pasal HAM, yaitu Pasal 28A–28J."
  },
  "sila3": {
    "value": "Pasal 1 ayat (1) (negara kesatuan)",
    "okMsg": "Tepat: sila ketiga Persatuan Indonesia dijabarkan antara lain dalam Pasal 1 ayat (1) tentang negara kesatuan.",
    "noMsg": "Belum tepat. Sila ketiga dijabarkan antara lain dalam Pasal 1 ayat (1): Indonesia adalah negara kesatuan berbentuk republik."
  },
  "sila4": {
    "value": "Pasal 1 ayat (2) (kedaulatan rakyat)",
    "okMsg": "Tepat: sila keempat dijabarkan antara lain dalam Pasal 1 ayat (2): kedaulatan berada di tangan rakyat.",
    "noMsg": "Belum tepat. Sila keempat dijabarkan antara lain dalam Pasal 1 ayat (2) tentang kedaulatan rakyat."
  },
  "sila5": {
    "value": "Pasal 33 dan Pasal 34 (perekonomian & kesejahteraan)",
    "okMsg": "Tepat: sila kelima dijabarkan antara lain dalam Pasal 33 tentang perekonomian dan Pasal 34 tentang fakir miskin dan anak terlantar yang dipelihara negara.",
    "noMsg": "Belum tepat. Sila kelima dijabarkan antara lain dalam Pasal 33 dan Pasal 34."
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
        showFb($('matchFb'), true, 'Semua pasangan tepat! Sila 1 ke Pasal 29, sila 2 ke Pasal 28A–28J, sila 3 ke Pasal 1 ayat (1), sila 4 ke Pasal 1 ayat (2), dan sila 5 ke Pasal 33 dan 34.');
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
    var simpanan = read('mpi-pp-p8-komitmen', '');
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
      store('mpi-pp-p8-komitmen', isi);
      if (st) st.textContent = 'Komitmen tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '. Tunjukkan kepada gurumu pada pertemuan berikutnya.';
      markVisited('sub5');
    });
  }

  /* ---------- Sub-bab 6: kuis 10 soal ---------- */
  /* Sebaran topik: soal 1-3 kedudukan Pancasila dalam Pembukaan,
     4-8 penjabaran sila ke pasal, 9-10 sumber hukum & semangat Pancasila.
     Kunci terverifikasi manual, distribusinya seimbang A2/B3/C2/D3:
     1) B  2) C  3) D  4) A  5) D  6) B  7) A  8) C  9) B  10) D */
  var QUIZ = [
  {
    "q": "Rumusan Pancasila tercantum dalam Pembukaan UUD NRI Tahun 1945 pada alinea …",
    "options": [
      "pertama",
      "keempat",
      "kedua",
      "ketiga"
    ],
    "answer": 1,
    "why": "Rumusan Pancasila tercantum dalam Pembukaan UUD NRI 1945 alinea keempat, bersama tujuan dan bentuk negara."
  },
  {
    "q": "Pembukaan UUD NRI Tahun 1945 disebut sebagai …",
    "options": [
      "aturan peralihan negara",
      "penjelasan batang tubuh",
      "pokok kaidah fundamental negara",
      "lampiran undang-undang dasar"
    ],
    "answer": 2,
    "why": "Pembukaan merupakan pokok kaidah fundamental negara karena memuat dasar, tujuan, dan asas negara, termasuk Pancasila."
  },
  {
    "q": "Dalam proses amandemen UUD NRI Tahun 1945, bagian yang disepakati untuk tidak diubah adalah …",
    "options": [
      "pasal-pasal tentang lembaga negara",
      "Aturan Peralihan",
      "Aturan Tambahan",
      "Pembukaan"
    ],
    "answer": 3,
    "why": "Pembukaan tidak diubah dalam amandemen karena memuat Pancasila sebagai dasar negara dan pokok kaidah fundamental negara."
  },
  {
    "q": "Sila pertama Pancasila dijabarkan antara lain dalam Pasal 29 UUD NRI Tahun 1945 yang mengatur tentang …",
    "options": [
      "agama",
      "perekonomian nasional",
      "pertahanan negara",
      "pendidikan"
    ],
    "answer": 0,
    "why": "Pasal 29 mengatur tentang agama, sejalan dengan sila pertama Ketuhanan Yang Maha Esa."
  },
  {
    "q": "Pasal-pasal hak asasi manusia, Pasal 28A sampai 28J, merupakan penjabaran dari sila …",
    "options": [
      "pertama",
      "ketiga",
      "keempat",
      "kedua"
    ],
    "answer": 3,
    "why": "Sila kedua, Kemanusiaan yang adil dan beradab, dijabarkan dalam pasal-pasal HAM Pasal 28A–28J."
  },
  {
    "q": "Pasal 1 ayat (1) tentang negara kesatuan merupakan penjabaran dari sila …",
    "options": [
      "kedua",
      "ketiga",
      "kelima",
      "pertama"
    ],
    "answer": 1,
    "why": "Sila ketiga, Persatuan Indonesia, dijabarkan antara lain dalam Pasal 1 ayat (1): Indonesia ialah negara kesatuan yang berbentuk republik."
  },
  {
    "q": "Kedaulatan berada di tangan rakyat sebagaimana Pasal 1 ayat (2) merupakan penjabaran dari sila …",
    "options": [
      "keempat",
      "pertama",
      "kedua",
      "kelima"
    ],
    "answer": 0,
    "why": "Sila keempat tentang kerakyatan dan permusyawaratan dijabarkan antara lain dalam Pasal 1 ayat (2) tentang kedaulatan rakyat."
  },
  {
    "q": "Pasal 33 tentang perekonomian dan Pasal 34 tentang fakir miskin dan anak terlantar merupakan penjabaran dari sila …",
    "options": [
      "ketiga",
      "pertama",
      "kelima",
      "kedua"
    ],
    "answer": 2,
    "why": "Sila kelima, Keadilan sosial bagi seluruh rakyat Indonesia, dijabarkan antara lain dalam Pasal 33 dan Pasal 34."
  },
  {
    "q": "Dalam tata urutan peraturan perundang-undangan, Pancasila berkedudukan sebagai …",
    "options": [
      "peraturan pelaksana undang-undang",
      "sumber dari segala sumber hukum",
      "aturan tambahan undang-undang dasar",
      "penjelasan pasal-pasal UUD"
    ],
    "answer": 1,
    "why": "Pancasila adalah sumber dari segala sumber hukum, sehingga semua peraturan harus bersumber dan tidak boleh bertentangan dengan nilai Pancasila."
  },
  {
    "q": "Apabila suatu peraturan bertentangan dengan UUD NRI 1945 dan nilai Pancasila, maka peraturan tersebut …",
    "options": [
      "tetap berlaku selamanya",
      "hanya berlaku di daerah tertentu",
      "boleh dilaksanakan sebagian",
      "tidak boleh berlaku dan dapat dibatalkan"
    ],
    "answer": 3,
    "why": "Peraturan yang bertentangan dengan UUD dan nilai Pancasila tidak boleh berlaku dan dapat dibatalkan melalui mekanisme pengujian peraturan."
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
      msg.textContent = qScore === 10 ? 'Sempurna! Kamu menguasai hubungan Pancasila dengan UUD NRI 1945.'
        : qScore >= 8 ? 'Hebat! Tinggal sedikit lagi menuju sempurna.'
        : qScore >= 6 ? 'Bagus! Ulangi bagian yang masih salah, lalu coba lagi.'
        : 'Terus berlatih! Buka lagi materi penjabaran sila ke pasal di Sub-bab 2 dan permainan di Sub-bab 4, lalu ulangi kuisnya.';
    }
    var prevBest = read('mpi-pp-p8-quiz-best', null);
    var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-pp-p8-quiz-best', String(qScore));
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
    try { saved = JSON.parse(read('mpi-pp-p8-refleksi', 'null')); } catch (e) { saved = null; }
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
      store('mpi-pp-p8-refleksi', JSON.stringify(data));
      var st = $('refStatus');
      if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
      markVisited('sub6');
    });
  }
})();
