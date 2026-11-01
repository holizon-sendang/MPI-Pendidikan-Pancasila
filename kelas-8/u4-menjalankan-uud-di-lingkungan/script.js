/* U.4 Menjalankan UUD di Lingkungan — script.js
   Vanilla JS, tanpa framework. Semua fakta dan kunci jawaban mengikuti
   rincian ATP dan diverifikasi manual.
   localStorage (semua berawalan mpi-pp-u4- agar tidak bertabrakan
   dengan modul lain dan MPI Matematika pada domain github.io yang sama):
   mpi-pp-u4-visited, mpi-pp-u4-quiz-best, mpi-pp-u4-polling,
   mpi-pp-u4-komitmen, mpi-pp-u4-refleksi. */
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
  function acak(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  /* ---------- Progres sub-bab ---------- */
  var SUBS = ['sub1', 'sub2', 'sub3', 'sub4', 'sub5', 'sub6'];
  var visited = [];
  try { visited = JSON.parse(read('mpi-pp-u4-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];

  function saveVisited() { store('mpi-pp-u4-visited', JSON.stringify(visited)); }
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
  var bestStored = read('mpi-pp-u4-quiz-best', null);
  if (bestStored !== null && bestEl) {
    bestEl.textContent = 'Skor terbaik kuis: ' + bestStored + '/10';
    bestEl.hidden = false;
  }

  /* ---------- Sub-bab 1: polling ---------- */
  var POLL_MSG = {
  "kewajiban-warga": "Tercatat! Tepat: menaati aturan lingkungan yang bersumber dari kesepakatan dan peraturan adalah wujud menjalankan UUD dalam kehidupan sehari-hari, termasuk kewajiban menjunjung hukum pada Pasal 27 ayat (1).",
  "urusan-pengurus": "Tercatat! Pendapat ini akan kita uji: aturan lingkungan mengikat semua warga, bukan hanya pengurus. UUD menjunjung hukum berlaku bagi setiap warga negara — contoh-contohnya ada di Sub-bab 2.",
  "sukarela-bebas": "Tercatat! Ada kegiatan yang memang sukarela, tetapi jadwal ronda dan kerja bakti yang sudah disepakati bersama dan diatur lingkungan adalah aturan yang mengikat warganya. Menjalankannya adalah bagian dari hidup ber-UUD, dibahas di Sub-bab 2."
};
  function renderPoll(pilihan, simpan) {
    document.querySelectorAll('[data-poll]').forEach(function (btn) {
      btn.classList.toggle('chosen', btn.getAttribute('data-poll') === pilihan);
    });
    if (pilihan && POLL_MSG[pilihan]) {
      showFb($('pollFb'), true, POLL_MSG[pilihan]);
      if (simpan) store('mpi-pp-u4-polling', pilihan);
    }
  }
  document.querySelectorAll('[data-poll]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      renderPoll(btn.getAttribute('data-poll'), true);
      markVisited('sub1');
    });
  });
  renderPoll(read('mpi-pp-u4-polling', null), false);

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
  "ikut": {
    "ok": false,
    "msg": "Diterima teman tidak sebanding dengan merusak fasilitas milik bersama yang dibangun dari iuran warga. Keberanian menjalankan UUD justru tampak saat kita berani berbeda dari ajakan yang salah. Coba pertimbangkan pilihan lain."
  },
  "tolak": {
    "ok": true,
    "msg": "Tepat! Inilah keberanian menjalankan UUD di lingkungan: berani menolak ajakan melanggar aturan, mengingatkan dengan cara baik, dan menawarkan jalan yang positif. Kamu menjaga hak semua warga atas fasilitas umum yang terawat."
  },
  "diam": {
    "ok": false,
    "msg": "Tidak ikut adalah langkah awal yang baik, tetapi diam membiarkan kerusakan tetap terjadi. Menjalankan UUD berani melangkah satu tingkat lagi: mengingatkan dengan cara baik atau melapor kepada pengurus lingkungan. Coba pertimbangkan pilihan lain."
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

  /* ---------- Sub-bab 4: sortir kartu ke dua kelompok ---------- */
  var SORT_CARDS = [
  {
    "target": "menjalankan",
    "label": "Mengikuti musyawarah warga dan menghormati hasilnya"
  },
  {
    "target": "menjalankan",
    "label": "Ikut gotong royong dan kerja bakti lingkungan"
  },
  {
    "target": "menjalankan",
    "label": "Ikut ronda/siskamling sesuai jadwal"
  },
  {
    "target": "menjalankan",
    "label": "Menghormati tetangga berbeda agama yang sedang beribadah"
  },
  {
    "target": "menjalankan",
    "label": "Membayar iuran lingkungan sesuai aturan"
  },
  {
    "target": "menjalankan",
    "label": "Mengingatkan teman yang merusak fasilitas umum dengan cara baik"
  },
  {
    "target": "melanggar",
    "label": "Merusak dan mencoret-coret fasilitas umum"
  },
  {
    "target": "melanggar",
    "label": "Menolak hasil musyawarah dan memboikot kegiatan warga"
  },
  {
    "target": "melanggar",
    "label": "Mengganggu tetangga yang sedang beribadah"
  },
  {
    "target": "melanggar",
    "label": "Mengajak teman melanggar aturan lingkungan"
  }
];
  var SORT_LABEL = {"menjalankan": "Menjalankan UUD", "melanggar": "Melanggar Semangat UUD"};
  var SUKSES_SORT = "Sempurna! Kesepuluh perilaku terkelompok dengan benar. Ingat pegangannya: menjalankan UUD itu menaati aturan bersama dan berani mengingatkan dengan baik; melanggarnya merugikan hak warga lain.";
  var sortTerpasang = 0;
  var sortDipilih = null;
  function sortUpdateProgress() {
    var el = $('sortProgress');
    if (el) el.textContent = sortTerpasang + ' dari ' + SORT_CARDS.length + ' kartu terkelompok tepat.';
  }
  function sortPilih(card) {
    if (sortDipilih) sortDipilih.classList.remove('terpilih');
    sortDipilih = card;
    if (card) card.classList.add('terpilih');
  }
  function sortPasang(card, slot) {
    if (!card || !slot || card.classList.contains('terpasang')) return;
    var kelompok = slot.getAttribute('data-slot');
    if (card.getAttribute('data-target') === kelompok) {
      var drop = slot.querySelector('.tl-drop');
      if (drop) {
        if (drop.getAttribute('data-isi') !== '1') { drop.textContent = ''; drop.setAttribute('data-isi', '1'); }
        drop.appendChild(card);
      }
      slot.classList.add('terisi');
      card.classList.remove('terpilih');
      card.classList.add('terpasang');
      card.disabled = true;
      card.draggable = false;
      if (sortDipilih === card) sortDipilih = null;
      sortTerpasang++;
      sortUpdateProgress();
      if (sortTerpasang === SORT_CARDS.length) {
        showFb($('sortFb'), true, SUKSES_SORT);
        markVisited('sub4');
      } else {
        showFb($('sortFb'), true, 'Tepat! \u201C' + card.textContent + '\u201D termasuk kelompok ' + SORT_LABEL[kelompok] + '.');
      }
    } else {
      slot.classList.remove('goyang');
      void slot.offsetWidth;
      slot.classList.add('goyang');
      showFb($('sortFb'), false, 'Belum tepat. \u201C' + card.textContent + '\u201D bukan termasuk kelompok ' + SORT_LABEL[kelompok] + '. Pikirkan lagi dampak perilaku itu, lalu coba kelompok lain.');
    }
  }
  function sortBangun() {
    sortTerpasang = 0;
    sortDipilih = null;
    document.querySelectorAll('.sort-slot').forEach(function (slot) {
      slot.classList.remove('terisi', 'benar', 'goyang');
      var drop = slot.querySelector('.tl-drop');
      if (drop) { drop.textContent = 'Letakkan kartu di sini'; drop.removeAttribute('data-isi'); }
    });
    var pool = $('sortPool');
    if (!pool) return;
    pool.innerHTML = '';
    acak(SORT_CARDS).forEach(function (c) {
      var card = document.createElement('button');
      card.type = 'button';
      card.className = 'tl-card';
      card.textContent = c.label;
      card.setAttribute('data-target', c.target);
      card.draggable = true;
      card.addEventListener('click', function () {
        if (card.classList.contains('terpasang')) return;
        sortPilih(sortDipilih === card ? null : card);
      });
      card.addEventListener('dragstart', function (e) {
        sortPilih(card);
        if (e.dataTransfer) e.dataTransfer.setData('text/plain', c.target);
      });
      pool.appendChild(card);
    });
    sortUpdateProgress();
    var fb = $('sortFb');
    if (fb) { fb.textContent = ''; fb.className = 'feedback'; }
  }
  document.querySelectorAll('.sort-slot').forEach(function (slot) {
    slot.addEventListener('click', function () { if (sortDipilih) sortPasang(sortDipilih, slot); });
    slot.addEventListener('dragover', function (e) { e.preventDefault(); slot.classList.add('dragover'); });
    slot.addEventListener('dragleave', function () { slot.classList.remove('dragover'); });
    slot.addEventListener('drop', function (e) {
      e.preventDefault();
      slot.classList.remove('dragover');
      if (sortDipilih) sortPasang(sortDipilih, slot);
    });
  });
  var sortReset = $('sortReset');
  if (sortReset) sortReset.addEventListener('click', sortBangun);
  sortBangun();

  /* ---------- Sub-bab 5: komitmen ---------- */
  var komitmenText = $('komitmenText');
  if (komitmenText) {
    var simpanan = read('mpi-pp-u4-komitmen', '');
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
      store('mpi-pp-u4-komitmen', isi);
      if (st) st.textContent = 'Komitmen tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '. Tunjukkan kepada gurumu pada pertemuan berikutnya.';
      markVisited('sub5');
    });
  }

  /* ---------- Sub-bab 6: kuis 10 soal ---------- */
  /* Kunci terverifikasi manual, distribusinya seimbang A2/B3/C2/D3:
     1) C 2) D 3) B 4) A 5) B 6) D 7) A 8) B 9) C 10) D
     Sebaran topik: Pasal 27 ayat (1), Pasal 29, contoh perilaku menjalankan UUD, dan keberanian menaati aturan. */
  var QUIZ = [
  {
    "q": "Kewajiban setiap warga negara untuk menjunjung hukum dan pemerintahan diatur dalam UUD NRI 1945 pada …",
    "options": [
      "Pasal 29",
      "Pasal 31",
      "Pasal 27 ayat (1)",
      "Pasal 33"
    ],
    "answer": 2,
    "why": "Pasal 27 ayat (1): segala warga negara bersamaan kedudukannya di dalam hukum dan pemerintahan dan wajib menjunjung hukum dan pemerintahan itu dengan tidak ada kecualinya."
  },
  {
    "q": "Contoh perilaku menjalankan UUD di lingkungan tempat tinggal adalah …",
    "options": [
      "merusak fasilitas umum yang tidak terpakai",
      "mengganggu tetangga yang sedang beribadah",
      "menolak hasil musyawarah dan memboikot kegiatan warga",
      "mengikuti musyawarah warga dan menghormati hasil kesepakatannya"
    ],
    "answer": 3,
    "why": "Mengikuti musyawarah dan menghormati hasilnya adalah wujud menaati aturan hidup bersama yang bersumber dari semangat UUD."
  },
  {
    "q": "Kemerdekaan memeluk agama dan beribadat menurut agama dan kepercayaan dijamin dalam …",
    "options": [
      "Pasal 27 ayat (1)",
      "Pasal 29",
      "Pasal 30",
      "Pasal 34"
    ],
    "answer": 1,
    "why": "Pasal 29 UUD NRI 1945 menjamin kemerdekaan tiap-tiap penduduk untuk memeluk agamanya dan beribadat menurut agama dan kepercayaannya."
  },
  {
    "q": "Ikut ronda dan siskamling sesuai jadwal lingkungan adalah contoh …",
    "options": [
      "menjaga keamanan lingkungan sebagai wujud menjalankan aturan hidup bersama",
      "pelanggaran terhadap UUD",
      "tugas yang hanya boleh dilakukan aparat negara",
      "kegiatan yang tidak ada kaitannya dengan aturan"
    ],
    "answer": 0,
    "why": "Ronda/siskamling adalah aturan keamanan yang disepakati warga; menjalankannya berarti menaati aturan lingkungan yang sah."
  },
  {
    "q": "Temanmu mengajak merusak bangku taman lingkungan. Sikap berani menjalankan UUD adalah …",
    "options": [
      "ikut agar tetap diterima teman",
      "menolak ajakan dan mengingatkan dengan cara yang baik",
      "diam saja tanpa berbuat apa pun",
      "merekamnya untuk disebarkan di media sosial"
    ],
    "answer": 1,
    "why": "Keberanian menjalankan UUD berarti berani menolak ajakan melanggar aturan dan mengingatkan pelakunya dengan cara yang baik."
  },
  {
    "q": "Gotong royong dan kerja bakti membersihkan lingkungan mencerminkan …",
    "options": [
      "pelanggaran terhadap aturan",
      "kegiatan yang dipaksakan tanpa dasar",
      "tradisi yang bertentangan dengan UUD",
      "pelaksanaan semangat kebersamaan dan ketaatan pada aturan lingkungan"
    ],
    "answer": 3,
    "why": "Gotong royong dan kerja bakti adalah cara warga menjalankan kesepakatan dan aturan lingkungannya secara bersama-sama."
  },
  {
    "q": "Melihat warga lain membuang sampah sembarangan, sikap yang paling tepat adalah …",
    "options": [
      "mengingatkan dengan sopan atau melapor kepada pengurus RT sesuai tata cara",
      "membalas dengan ikut membuang sampah sembarangan",
      "menyebarkannya sebagai bahan gosip tetangga",
      "ikut melanggar karena semua orang juga melakukannya"
    ],
    "answer": 0,
    "why": "Mengingatkan dengan cara baik atau melapor lewat saluran yang benar adalah keberanian menjalankan aturan tanpa menimbulkan keributan baru."
  },
  {
    "q": "Menyampaikan pendapat secara santun dalam musyawarah warga termasuk menjalankan UUD karena …",
    "options": [
      "pendapat sendiri harus selalu menjadi keputusan",
      "warga berhak menyampaikan pendapat, tetapi wajib menghormati aturan dan orang lain",
      "musyawarah tidak memerlukan aturan apa pun",
      "hak berpendapat hanya dimiliki pengurus lingkungan"
    ],
    "answer": 1,
    "why": "Hak menyampaikan pendapat dijamin UUD (antara lain Pasal 28E ayat (3)), dan menjalankannya secara santun berarti sekaligus menghormati hak orang lain dan aturan musyawarah."
  },
  {
    "q": "Membayar iuran lingkungan sesuai aturan yang telah disepakati warga adalah …",
    "options": [
      "kegiatan yang tidak wajib bagi siapa pun",
      "kewajiban pengurus lingkungan saja",
      "wujud ketaatan pada aturan yang berlaku di lingkungan",
      "pelanggaran terhadap hak warga"
    ],
    "answer": 2,
    "why": "Iuran yang ditetapkan berdasarkan kesepakatan dan aturan lingkungan mengikat semua warga; membayarnya adalah bentuk menjalankan aturan."
  },
  {
    "q": "Perilaku berikut yang BUKAN contoh menjalankan UUD di lingkungan adalah …",
    "options": [
      "menghormati tetangga yang sedang beribadah",
      "menjaga fasilitas umum bersama",
      "ikut kerja bakti membersihkan lingkungan",
      "mengganggu ketertiban lingkungan demi kesenangan sendiri"
    ],
    "answer": 3,
    "why": "Mengganggu ketertiban melanggar semangat Pasal 27 ayat (1) tentang menjunjung hukum dan aturan; tiga pilihan lainnya adalah contoh menjalankan UUD."
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
      msg.textContent = qScore === 10 ? 'Sempurna! Kamu menguasai materi modul ini.'
        : qScore >= 8 ? 'Hebat! Tinggal sedikit lagi menuju sempurna.'
        : qScore >= 6 ? 'Bagus! Ulangi bagian yang masih salah, lalu coba lagi.'
        : 'Terus berlatih! Buka lagi materi di Sub-bab 2 dan permainan di Sub-bab 4, lalu ulangi kuisnya.';
    }
    var prevBest = read('mpi-pp-u4-quiz-best', null);
    var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-pp-u4-quiz-best', String(qScore));
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
    try { saved = JSON.parse(read('mpi-pp-u4-refleksi', 'null')); } catch (e) { saved = null; }
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
      store('mpi-pp-u4-refleksi', JSON.stringify(data));
      var st = $('refStatus');
      if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
      markVisited('sub6');
    });
  }
})();
