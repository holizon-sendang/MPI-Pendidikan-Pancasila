/* B.3 Budaya Nasional sebagai Pemersatu Bangsa — script.js
   Vanilla JS, tanpa framework. Meniru mesin prototipe P.1.
   localStorage (semua berawalan mpi-pp-b3- agar tidak bertabrakan
   dengan MPI Matematika pada domain github.io yang sama):
   mpi-pp-b3-visited, mpi-pp-b3-quiz-best, mpi-pp-b3-polling,
   mpi-pp-b3-komitmen, mpi-pp-b3-refleksi. */
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
  try { visited = JSON.parse(read('mpi-pp-b3-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];

  function saveVisited() { store('mpi-pp-b3-visited', JSON.stringify(visited)); }
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
  var bestStored = read('mpi-pp-b3-quiz-best', null);
  if (bestStored !== null && bestEl) {
    bestEl.textContent = 'Skor terbaik kuis: ' + bestStored + '/10';
    bestEl.hidden = false;
  }

  /* ---------- Sub-bab 1: polling ---------- */
  var POLL_MSG = {
  "bahasa": "Tercatat! Bahasa Indonesia memang disebut unsur pemersatu utama: dengannya, warga dari ratusan suku dapat saling memahami. Di modul ini kamu akan mengenal unsur pemersatu lainnya.",
  "simbol": "Tercatat! Bendera Merah Putih dan lagu kebangsaan adalah simbol yang diakui dan dihormati bersama di seluruh Indonesia. Di modul ini kamu akan mengenal unsur pemersatu lainnya.",
  "dasar": "Tercatat! Pancasila sebagai dasar negara adalah kesepakatan bersama seluruh bangsa. Di modul ini kamu akan melihat bagaimana dasar negara termasuk unsur budaya nasional pemersatu bangsa."
};
  function renderPoll(pilihan, simpan) {
    document.querySelectorAll('[data-poll]').forEach(function (btn) {
      btn.classList.toggle('chosen', btn.getAttribute('data-poll') === pilihan);
    });
    if (pilihan && POLL_MSG[pilihan]) {
      showFb($('pollFb'), true, POLL_MSG[pilihan]);
      if (simpan) store('mpi-pp-b3-polling', pilihan);
    }
  }
  document.querySelectorAll('[data-poll]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      renderPoll(btn.getAttribute('data-poll'), true);
      markVisited('sub1');
    });
  });
  renderPoll(read('mpi-pp-b3-polling', null), false);

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
    "msg": "Jika setiap orang hanya memakai bahasa daerahnya, kelompok tidak bisa saling memahami — padahal bahasa Indonesia disediakan justru sebagai bahasa persatuan. Coba pertimbangkan pilihan lain."
  },
  "indonesia": {
    "ok": true,
    "msg": "Tepat! Mengajak memakai bahasa Indonesia dalam forum bersama adalah penggunaan nyata budaya nasional sebagai pemersatu, tanpa melarang siapa pun berbahasa daerah dalam pergaulan sehari-hari."
  },
  "diam": {
    "ok": false,
    "msg": "Diam membiarkan masalah komunikasi berlanjut. Satu ajakan sederhana untuk memakai bahasa Indonesia bersama bisa menyelamatkan kerja kelompok. Coba pertimbangkan pilihan lain."
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

  /* ---------- Sub-bab 4: cocokkan (match) ---------- */
  var MATCH = {"batik": "Diakui UNESCO pada 2 Oktober 2009", "saman": "Dari Aceh, diakui UNESCO pada 2011", "angklung": "Dari Jawa Barat, diakui UNESCO pada 2010", "wayang": "Diakui UNESCO sebagai warisan budaya Indonesia", "bahasa": "Bahasa persatuan, unsur pemersatu utama bangsa"};
  var matchCheck = $('matchCheck');
  if (matchCheck) {
    matchCheck.addEventListener('click', function () {
      var semuaBenar = true;
      var adaKosong = false;
      document.querySelectorAll('.match-row[data-match]').forEach(function (row) {
        var key = row.getAttribute('data-match');
        var sel = row.querySelector('.match-pilih');
        var fb = row.querySelector('.match-fb');
        if (!sel) return;
        if (!sel.value) { adaKosong = true; semuaBenar = false; row.classList.remove('ok','no'); if (fb) fb.textContent = 'Lengkapi dulu jawabannya.'; return; }
        var ok = sel.value === MATCH[key];
        if (!ok) semuaBenar = false;
        row.classList.toggle('ok', ok);
        row.classList.toggle('no', !ok);
        if (fb) fb.textContent = ok ? 'Tepat! “' + sel.value + '” memang pasangan yang benar.' : 'Belum tepat. Jawaban yang benar: “' + MATCH[key] + '”.';
      });
      if (adaKosong) showFb($('matchFb'), false, 'Masih ada pasangan yang belum lengkap. Isi semua pilihan, lalu periksa lagi.');
      else if (semuaBenar) { showFb($('matchFb'), true, "Semua pasangan tepat! Batik (2009), Tari Saman dari Aceh (2011), Angklung dari Jawa Barat (2010), Wayang, dan Bahasa Indonesia sebagai pemersatu utama."); markVisited('sub4'); }
      else showFb($('matchFb'), false, 'Sebagian pasangan belum tepat. Perhatikan keterangan di bawah tiap nama, lalu perbaiki.');
    });
  }
  /* ---------- Sub-bab 4: sortir kategori ---------- */
  var SORT = {"t1": "Pemersatu Bangsa", "t2": "Pemersatu Bangsa", "t3": "Pemersatu Bangsa", "t4": "Memecah Belah", "t5": "Memecah Belah", "t6": "Memecah Belah"};
  var sortCheck = $('sortCheck');
  if (sortCheck) {
    sortCheck.addEventListener('click', function () {
      var semuaBenar = true;
      var adaKosong = false;
      document.querySelectorAll('.sort-row').forEach(function (row) {
        var key = row.getAttribute('data-sort');
        var sel = row.querySelector('.sort-pilih');
        var fb = row.querySelector('.sort-fb');
        if (!sel) return;
        if (!sel.value) { adaKosong = true; semuaBenar = false; row.classList.remove('ok','no'); if (fb) fb.textContent = 'Pilih dulu kategorinya.'; return; }
        var ok = sel.value === SORT[key];
        if (!ok) semuaBenar = false;
        row.classList.toggle('ok', ok);
        row.classList.toggle('no', !ok);
        if (fb) fb.textContent = ok ? 'Tepat! Kategorinya memang “' + sel.value + '”.' : 'Belum tepat. Kategori yang benar: “' + SORT[key] + '”.';
      });
      if (adaKosong) showFb($('sortFb'), false, 'Masih ada item yang belum dikategorikan. Lengkapi semua, lalu periksa lagi.');
      else if (semuaBenar) { showFb($('sortFb'), true, "Sortirmu tepat semua! Unsur dan sikap bersama mempersatukan bangsa, sedangkan sikap merasa paling unggul dan menutup diri memecah belah."); markVisited('sub4'); }
      else showFb($('sortFb'), false, 'Sebagian kategori belum tepat. Perhatikan keterangan di bawah tiap item, lalu perbaiki.');
    });
  }

  /* ---------- Sub-bab 5: komitmen ---------- */
  var komitmenText = $('komitmenText');
  if (komitmenText) {
    var simpanan = read('mpi-pp-b3-komitmen', '');
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
      store('mpi-pp-b3-komitmen', isi);
      if (st) st.textContent = 'Komitmen tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '. Tunjukkan kepada gurumu pada pertemuan berikutnya.';
      markVisited('sub5');
    });
  }

  /* ---------- Sub-bab 6: kuis 10 soal ---------- */
  /* Kunci terverifikasi manual, distribusinya seimbang A2/B3/C2/D3:
     1) B  2) C  3) D  4) A  5) D  6) B  7) A  8) C  9) B  10) D */
  var QUIZ = [
    {
        "q": "Budaya nasional Indonesia bersumber dari …",
        "options": [
            "Budaya asing yang masuk ke Indonesia",
            "Puncak-puncak kebudayaan daerah yang diterima oleh sebagian besar bangsa",
            "Kebijakan pemerintah semata",
            "Budaya satu suku terbesar saja"
        ],
        "answer": 1,
        "why": "Budaya nasional bersumber dari puncak-puncak kebudayaan daerah yang diterima oleh sebagian besar bangsa Indonesia."
    },
    {
        "q": "Unsur pemersatu utama yang memungkinkan warga antardaerah saling memahami adalah …",
        "options": [
            "Bahasa daerah masing-masing",
            "Bahasa asing",
            "Bahasa Indonesia",
            "Bahasa isyarat setempat"
        ],
        "answer": 2,
        "why": "Bahasa Indonesia adalah bahasa persatuan dan unsur pemersatu utama bangsa Indonesia."
    },
    {
        "q": "Batik diakui UNESCO sebagai Warisan Budaya Takbenda pada tanggal …",
        "options": [
            "17 Agustus 1945",
            "1 Juni 1945",
            "20 Mei 1908",
            "2 Oktober 2009"
        ],
        "answer": 3,
        "why": "Batik diakui UNESCO pada 2 Oktober 2009, dan tanggal itu diperingati sebagai Hari Batik Nasional."
    },
    {
        "q": "Hari Batik Nasional diperingati setiap tanggal …",
        "options": [
            "2 Oktober",
            "21 April",
            "10 November",
            "1 Juni"
        ],
        "answer": 0,
        "why": "Hari Batik Nasional diperingati setiap 2 Oktober, mengikuti tanggal pengakuan UNESCO atas batik."
    },
    {
        "q": "Tari Saman yang berasal dari Aceh diakui UNESCO pada tahun …",
        "options": [
            "2009",
            "2010",
            "2012",
            "2011"
        ],
        "answer": 3,
        "why": "Tari Saman dari Aceh diakui UNESCO sebagai Warisan Budaya Takbenda pada tahun 2011."
    },
    {
        "q": "Alat musik angklung yang diakui UNESCO pada 2010 berasal dari daerah …",
        "options": [
            "Aceh",
            "Jawa Barat",
            "Bali",
            "Sulawesi Selatan"
        ],
        "answer": 1,
        "why": "Angklung berasal dari Jawa Barat dan diakui UNESCO pada tahun 2010."
    },
    {
        "q": "Pasal UUD NRI 1945 yang menyatakan negara memajukan kebudayaan nasional adalah …",
        "options": [
            "Pasal 32 ayat (1)",
            "Pasal 27 ayat (1)",
            "Pasal 30 ayat (1)",
            "Pasal 33 ayat (1)"
        ],
        "answer": 0,
        "why": "Pasal 32 ayat (1) UUD NRI 1945 menyatakan negara memajukan kebudayaan nasional Indonesia di tengah peradaban dunia."
    },
    {
        "q": "Berikut ini yang termasuk unsur budaya nasional pemersatu bangsa adalah …",
        "options": [
            "Fanatisme daerah yang berlebihan",
            "Hanya memakai bahasa daerah di forum nasional",
            "Lagu kebangsaan Indonesia Raya",
            "Meremehkan budaya daerah lain"
        ],
        "answer": 2,
        "why": "Lagu kebangsaan Indonesia Raya adalah salah satu unsur budaya nasional pemersatu bangsa, bersama dasar negara, UUD 1945, bendera, lambang negara, dan bahasa Indonesia."
    },
    {
        "q": "Angklung diakui UNESCO sebagai Warisan Budaya Takbenda pada tahun …",
        "options": [
            "2009",
            "2010",
            "2011",
            "1945"
        ],
        "answer": 1,
        "why": "Angklung dari Jawa Barat diakui UNESCO pada tahun 2010."
    },
    {
        "q": "Selain sebagai alat pemersatu, budaya nasional juga berfungsi sebagai …",
        "options": [
            "Alat untuk menghapus budaya daerah",
            "Pembeda status sosial warga",
            "Pengganti dasar negara",
            "Identitas dan jati diri bangsa"
        ],
        "answer": 3,
        "why": "Budaya nasional berfungsi sebagai alat pemersatu bangsa sekaligus identitas dan jati diri bangsa Indonesia."
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
    var prevBest = read('mpi-pp-b3-quiz-best', null);
    var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-pp-b3-quiz-best', String(qScore));
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
    try { saved = JSON.parse(read('mpi-pp-b3-refleksi', 'null')); } catch (e) { saved = null; }
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
      store('mpi-pp-b3-refleksi', JSON.stringify(data));
      var st = $('refStatus');
      if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
      markVisited('sub6');
    });
  }
})();
