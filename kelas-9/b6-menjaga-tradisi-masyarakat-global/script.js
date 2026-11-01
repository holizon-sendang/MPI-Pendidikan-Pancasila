/* B.6 Menjaga Tradisi dalam Masyarakat Global — script.js
   Vanilla JS, tanpa framework. Meniru mesin prototipe P.1.
   localStorage (semua berawalan mpi-pp-b6- agar tidak bertabrakan
   dengan modul lain pada domain github.io yang sama):
   mpi-pp-b6-visited, mpi-pp-b6-quiz-best, mpi-pp-b6-polling,
   mpi-pp-b6-komitmen, mpi-pp-b6-refleksi. */
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
  try { visited = JSON.parse(read('mpi-pp-b6-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];

  function saveVisited() { store('mpi-pp-b6-visited', JSON.stringify(visited)); }
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
  var bestStored = read('mpi-pp-b6-quiz-best', null);
  if (bestStored !== null && bestEl) {
    bestEl.textContent = 'Skor terbaik kuis: ' + bestStored + '/10';
    bestEl.hidden = false;
  }

  /* ---------- Sub-bab 1: polling ---------- */
  var POLL_MSG = {
  "dianggap-kuno": "Tercatat! Memang ada anggapan bahwa tradisi itu kuno. Di modul ini kamu akan melihat bahwa tradisi yang dijaga justru bisa menjadi kebanggaan dan identitas, bukan beban masa lalu.",
  "budaya-asing": "Tercatat! Budaya populer asing memang mudah masuk lewat internet dan hiburan. Bukan berarti harus ditolak semuanya, tetapi tradisi sendiri jangan sampai tersisih dan dilupakan.",
  "gaya-instan": "Tercatat! Banyak tradisi membutuhkan waktu, proses, dan kebersamaan, sehingga terasa berat di zaman serba instan. Justru di situlah nilainya: tradisi melatih kesabaran dan gotong royong."
};
  function renderPoll(pilihan, simpan) {
    document.querySelectorAll('[data-poll]').forEach(function (btn) {
      btn.classList.toggle('chosen', btn.getAttribute('data-poll') === pilihan);
    });
    if (pilihan && POLL_MSG[pilihan]) {
      showFb($('pollFb'), true, POLL_MSG[pilihan]);
      if (simpan) store('mpi-pp-b6-polling', pilihan);
    }
  }
  document.querySelectorAll('[data-poll]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      renderPoll(btn.getAttribute('data-poll'), true);
      markVisited('sub1');
    });
  });
  renderPoll(read('mpi-pp-b6-polling', null), false);

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
  "tolak": {
    "ok": false,
    "msg": "Menolak dan mengajak orang lain menolak justru mempercepat hilangnya tradisi. Tradisi tidak buta terhadap zaman: ia bisa ditampilkan secara kreatif. Kalau bukan generasi muda yang menjaganya, siapa lagi? Coba pertimbangkan pilihan lain."
  },
  "ikut": {
    "ok": true,
    "msg": "Tepat! Sikap ini menunjukkan tanggung jawab menjaga tradisi: tetap berpartisipasi dengan bangga dan mengajak teman memahami maknanya. Inilah wujud nyata peran aktif melestarikan tradisi dalam masyarakat global."
  },
  "diam": {
    "ok": false,
    "msg": "Diam membuatmu tidak berkontribusi apa pun. Kamu bisa menyampaikan pendapat dengan sopan: tradisi daerah adalah identitas kita, dan mengikutinya tidak mengurangi kekerenanmu sama sekali. Coba pertimbangkan pilihan lain."
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
    "target": "menjaga",
    "label": "Mengikuti upacara adat bersama keluarga"
  },
  {
    "target": "menjaga",
    "label": "Mendokumentasikan tradisi lalu membagikannya secara positif di media sosial"
  },
  {
    "target": "menjaga",
    "label": "Mempelajari makna di balik tradisi daerah sendiri"
  },
  {
    "target": "menjaga",
    "label": "Mengajak teman menonton festival budaya daerah"
  },
  {
    "target": "mengikis",
    "label": "Menganggap tradisi kuno dan tidak mau mempelajarinya"
  },
  {
    "target": "mengikis",
    "label": "Mengejek budaya sendiri dan hanya bangga pada budaya asing"
  },
  {
    "target": "mengikis",
    "label": "Menolak ikut kegiatan adat di lingkungan sendiri"
  },
  {
    "target": "mengikis",
    "label": "Membiarkan tradisi hilang tanpa pernah mencatat atau mempelajarinya"
  }
];
  var NAMA_SLOT = {"menjaga": "Menjaga Tradisi di Era Global", "mengikis": "Mengikis Tradisi"};
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
        showFb($('tlFb'), true, "Sempurna! Semua kartu sikap sudah tersortir tepat. Menjaga tradisi berarti aktif mempelajari, mengikuti, dan mempromosikannya; mengikis tradisi berarti meremehkan dan membiarkannya hilang.");
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
  "ngaben": {
    "s1": "Bali",
    "s2": "Upacara pembakaran jenazah (kremasi) umat Hindu",
    "ok": "Tepat: Ngaben adalah upacara pembakaran jenazah umat Hindu di Bali.",
    "no": "Belum tepat. Ngaben berasal dari Bali dan merupakan upacara pembakaran jenazah (kremasi) umat Hindu."
  },
  "sekaten": {
    "s1": "Yogyakarta dan Surakarta",
    "s2": "Rangkaian peringatan Maulid Nabi Muhammad SAW",
    "ok": "Tepat: Sekaten adalah rangkaian peringatan Maulid Nabi di Yogyakarta dan Surakarta.",
    "no": "Belum tepat. Sekaten berasal dari Yogyakarta dan Surakarta, berupa rangkaian peringatan Maulid Nabi Muhammad SAW."
  },
  "tabuik": {
    "s1": "Pariaman, Sumatera Barat",
    "s2": "Peringatan hari Asyura dengan arak-arakan",
    "ok": "Tepat: Tabuik dari Pariaman, Sumatera Barat, adalah peringatan hari Asyura dengan arak-arakan tabuik.",
    "no": "Belum tepat. Tabuik berasal dari Pariaman, Sumatera Barat, dan memperingati hari Asyura."
  },
  "rambusolo": {
    "s1": "Toraja, Sulawesi Selatan",
    "s2": "Upacara pemakaman adat",
    "ok": "Tepat: Rambu Solo adalah upacara pemakaman adat masyarakat Toraja, Sulawesi Selatan.",
    "no": "Belum tepat. Rambu Solo berasal dari Toraja, Sulawesi Selatan, dan merupakan upacara pemakaman adat."
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
        showFb($('matchFb'), true, "Semua pasangan tepat! Ngaben–Bali, Sekaten–Yogyakarta/Surakarta, Tabuik–Pariaman, dan Rambu Solo–Toraja.");
        markVisited('sub4');
      } else {
        showFb($('matchFb'), false, 'Sebagian pasangan belum tepat. Perhatikan keterangan di bawah tiap baris, lalu perbaiki.');
      }
    });
  }

  /* ---------- Sub-bab 5: komitmen ---------- */
  var komitmenText = $('komitmenText');
  if (komitmenText) {
    var simpanan = read('mpi-pp-b6-komitmen', '');
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
      store('mpi-pp-b6-komitmen', isi);
      if (st) st.textContent = 'Komitmen tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '. Tunjukkan kepada gurumu pada pertemuan berikutnya.';
      markVisited('sub5');
    });
  }

  /* ---------- Sub-bab 6: kuis 10 soal ---------- */
  /* Kunci terverifikasi manual, distribusinya seimbang A2/B3/C2/D3:
     1) B  2) C  3) D  4) A  5) D  6) B  7) A  8) C  9) B  10) D */
  var QUIZ = [
  {
    "q": "Tradisi adalah …",
    "options": [
      "aturan baru yang dibuat untuk kepentingan wisata",
      "kebiasaan atau adat yang diwariskan turun-temurun dan masih dijalankan masyarakat",
      "kebiasaan yang hanya dilakukan satu generasi",
      "peraturan tertulis dari pemerintah pusat"
    ],
    "answer": 1,
    "why": "Tradisi adalah kebiasaan atau adat yang diwariskan turun-temurun dan masih dijalankan oleh masyarakat pendukungnya."
  },
  {
    "q": "Upacara Ngaben berasal dari daerah …",
    "options": [
      "Toraja",
      "Pariaman",
      "Bali",
      "Semarang"
    ],
    "answer": 2,
    "why": "Ngaben adalah upacara pembakaran jenazah (kremasi) umat Hindu yang berasal dari Bali."
  },
  {
    "q": "Tradisi Tabuik berasal dari daerah …",
    "options": [
      "Bali",
      "Toraja",
      "Tengger",
      "Pariaman, Sumatera Barat"
    ],
    "answer": 3,
    "why": "Tabuik adalah tradisi peringatan hari Asyura dari Pariaman, Sumatera Barat."
  },
  {
    "q": "Rambu Solo, upacara pemakaman adat, berasal dari …",
    "options": [
      "Toraja, Sulawesi Selatan",
      "Bali",
      "Semarang",
      "Yogyakarta"
    ],
    "answer": 0,
    "why": "Rambu Solo adalah upacara pemakaman adat masyarakat Toraja, Sulawesi Selatan."
  },
  {
    "q": "Tradisi Sekaten diselenggarakan di …",
    "options": [
      "Bali",
      "Pariaman",
      "Toraja",
      "Yogyakarta dan Surakarta"
    ],
    "answer": 3,
    "why": "Sekaten adalah rangkaian peringatan Maulid Nabi Muhammad SAW yang diselenggarakan di Yogyakarta dan Surakarta."
  },
  {
    "q": "Salah satu peran tradisi bagi masyarakat adalah …",
    "options": [
      "membuat masyarakat saling menjauhi",
      "memperkuat identitas dan kebersamaan masyarakat",
      "menggantikan seluruh teknologi modern",
      "menghapus perbedaan antar daerah"
    ],
    "answer": 1,
    "why": "Tradisi memperkuat identitas dan kebersamaan masyarakat, serta dapat menjadi daya tarik wisata budaya."
  },
  {
    "q": "Salah satu tantangan tradisi di era globalisasi adalah …",
    "options": [
      "generasi muda menganggap tradisi kuno",
      "terlalu banyak festival budaya",
      "tradisi selalu ditayangkan televisi",
      "semua siswa wajib mengikuti upacara adat"
    ],
    "answer": 0,
    "why": "Di era globalisasi, tradisi terancam oleh gaya hidup instan, dominasi budaya populer asing, dan anggapan generasi muda bahwa tradisi itu kuno."
  },
  {
    "q": "Sikap siswa yang paling tepat untuk menjaga tradisi adalah …",
    "options": [
      "membiarkan tradisi hilang dengan sendirinya",
      "mengejek tradisi daerah lain",
      "mendokumentasikan dan mempromosikan tradisi lewat media digital",
      "hanya mempelajari budaya asing"
    ],
    "answer": 2,
    "why": "Siswa dapat menjaga tradisi dengan mempelajari, mengikuti, mendokumentasikan, dan mempromosikannya secara positif lewat media digital."
  },
  {
    "q": "Tradisi Kasada dijalankan oleh masyarakat …",
    "options": [
      "Hindu Bali",
      "Tengger di kawasan Bromo",
      "Toraja",
      "Minangkabau"
    ],
    "answer": 1,
    "why": "Kasada adalah upacara persembahan masyarakat Tengger di kawasan Gunung Bromo."
  },
  {
    "q": "Jika tradisi yang baik dibiarkan hilang, akibatnya bagi masyarakat adalah …",
    "options": [
      "tidak ada akibat apa pun",
      "masyarakat menjadi lebih modern",
      "pariwisata budaya semakin ramai",
      "identitas dan jati diri budaya masyarakat melemah"
    ],
    "answer": 3,
    "why": "Hilangnya tradisi melemahkan identitas dan jati diri budaya masyarakat, serta menghilangkan daya tarik wisata budayanya."
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
      msg.textContent = qScore === 10 ? "Sempurna! Kamu menguasai makna, contoh, dan cara menjaga tradisi."
        : qScore >= 8 ? 'Hebat! Tinggal sedikit lagi menuju sempurna.'
        : qScore >= 6 ? 'Bagus! Ulangi bagian yang masih salah, lalu coba lagi.'
        : "Terus berlatih! Buka lagi babak-babak di Sub-bab 2 dan permainan di Sub-bab 4, lalu ulangi kuisnya.";
    }
    var prevBest = read('mpi-pp-b6-quiz-best', null);
    var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-pp-b6-quiz-best', String(qScore));
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
    try { saved = JSON.parse(read('mpi-pp-b6-refleksi', 'null')); } catch (e) { saved = null; }
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
      store('mpi-pp-b6-refleksi', JSON.stringify(data));
      var st = $('refStatus');
      if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
      markVisited('sub6');
    });
  }
})();
