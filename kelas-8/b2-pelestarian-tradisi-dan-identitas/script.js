/* B.2 Pelestarian Tradisi dan Identitas — script.js
   Vanilla JS, tanpa framework. Meniru mesin prototipe P.1.
   localStorage (semua berawalan mpi-pp-b2- agar tidak bertabrakan
   dengan MPI Matematika pada domain github.io yang sama):
   mpi-pp-b2-visited, mpi-pp-b2-quiz-best, mpi-pp-b2-polling,
   mpi-pp-b2-komitmen, mpi-pp-b2-refleksi. */
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
  try { visited = JSON.parse(read('mpi-pp-b2-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];

  function saveVisited() { store('mpi-pp-b2-visited', JSON.stringify(visited)); }
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
  var bestStored = read('mpi-pp-b2-quiz-best', null);
  if (bestStored !== null && bestEl) {
    bestEl.textContent = 'Skor terbaik kuis: ' + bestStored + '/10';
    bestEl.hidden = false;
  }

  /* ---------- Sub-bab 1: polling ---------- */
  var POLL_MSG = {
  "upacara": "Tercatat! Upacara adat seperti Ngaben, Rambu Solo, dan Tabuik adalah tradisi yang paling tampak. Di modul ini kamu akan mengenal asal daerahnya dan cara melestarikannya.",
  "kesenian": "Tercatat! Kesenian tradisional adalah tradisi yang hidup lewat pertunjukan dan perayaan. Di modul ini kamu akan melihat bagaimana kesenian ikut membentuk identitas daerah dan bangsa.",
  "kuliner": "Tercatat! Kuliner tradisional juga tradisi: resep dan cara memasaknya diwariskan turun-temurun, terutama di lingkungan keluarga — salah satu lingkungan pelestarian yang akan kita bahas."
};
  function renderPoll(pilihan, simpan) {
    document.querySelectorAll('[data-poll]').forEach(function (btn) {
      btn.classList.toggle('chosen', btn.getAttribute('data-poll') === pilihan);
    });
    if (pilihan && POLL_MSG[pilihan]) {
      showFb($('pollFb'), true, POLL_MSG[pilihan]);
      if (simpan) store('mpi-pp-b2-polling', pilihan);
    }
  }
  document.querySelectorAll('[data-poll]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      renderPoll(btn.getAttribute('data-poll'), true);
      markVisited('sub1');
    });
  });
  renderPoll(read('mpi-pp-b2-polling', null), false);

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
  "ejek": {
    "ok": false,
    "msg": "Mengejek tradisi daerah lain melukai perasaan pemiliknya dan merusak persatuan. Tradisi setiap daerah adalah warisan yang dijaga turun-temurun dan layak dihargai, bukan ditertawakan. Coba pertimbangkan pilihan lain."
  },
  "hargai": {
    "ok": true,
    "msg": "Tepat! Menghargai tradisi daerah lain — dan berani menegur ejekan dengan sopan — adalah wujud nyata pelestarian: tradisi hanya bertahan jika masyarakatnya saling menghormati dan menjaganya."
  },
  "diam": {
    "ok": false,
    "msg": "Diam membiarkan ejekan dianggap wajar. Kamu bisa membantu dengan cara sederhana: tidak ikut mengejek dan menyampaikan bahwa tradisi setiap daerah patut dihargai. Coba pertimbangkan pilihan lain."
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
  var MATCH = {"ngaben": "Bali", "rambu": "Tana Toraja, Sulawesi Selatan", "sekaten": "Yogyakarta dan Surakarta", "tabuik": "Pariaman, Sumatera Barat", "bakar": "Papua"};
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
      else if (semuaBenar) { showFb($('matchFb'), true, "Semua pasangan tepat! Ngaben dari Bali, Rambu Solo dari Tana Toraja, Sekaten dari Yogyakarta dan Surakarta, Tabuik dari Pariaman, dan Bakar Batu dari Papua."); markVisited('sub4'); }
      else showFb($('matchFb'), false, 'Sebagian pasangan belum tepat. Perhatikan keterangan di bawah tiap nama, lalu perbaiki.');
    });
  }
  /* ---------- Sub-bab 4: sortir kategori ---------- */
  var SORT = {"s1": "Keluarga", "s2": "Keluarga", "s3": "Sekolah", "s4": "Sekolah", "s5": "Masyarakat", "s6": "Masyarakat"};
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
      else if (semuaBenar) { showFb($('sortFb'), true, "Sortirmu tepat semua! Pelestarian tradisi berjalan di tiga lingkungan sekaligus: keluarga, sekolah, dan masyarakat."); markVisited('sub4'); }
      else showFb($('sortFb'), false, 'Sebagian kategori belum tepat. Perhatikan keterangan di bawah tiap item, lalu perbaiki.');
    });
  }

  /* ---------- Sub-bab 5: komitmen ---------- */
  var komitmenText = $('komitmenText');
  if (komitmenText) {
    var simpanan = read('mpi-pp-b2-komitmen', '');
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
      store('mpi-pp-b2-komitmen', isi);
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
            "Kegiatan baru yang sedang viral di media sosial",
            "Kebiasaan yang diwariskan secara turun-temurun dari satu generasi ke generasi berikutnya",
            "Aturan tertulis yang dibuat oleh pemerintah daerah",
            "Kebiasaan yang hanya dilakukan satu kali"
        ],
        "answer": 1,
        "why": "Tradisi adalah kebiasaan yang diwariskan secara turun-temurun dari satu generasi ke generasi berikutnya."
    },
    {
        "q": "Upacara Ngaben berasal dari daerah …",
        "options": [
            "Papua",
            "Nias",
            "Bali",
            "Pariaman"
        ],
        "answer": 2,
        "why": "Ngaben adalah upacara pembakaran jenazah yang berasal dari Bali."
    },
    {
        "q": "Rambu Solo, upacara pemakaman adat yang besar, berasal dari …",
        "options": [
            "Bali",
            "Yogyakarta",
            "Surabaya",
            "Tana Toraja, Sulawesi Selatan"
        ],
        "answer": 3,
        "why": "Rambu Solo adalah upacara pemakaman adat dari Tana Toraja, Sulawesi Selatan."
    },
    {
        "q": "Identitas pribadi seseorang terutama terbentuk dari …",
        "options": [
            "Nilai keluarga dan tradisi yang dijalaninya",
            "Budaya asing yang ditontonnya",
            "Jumlah pengikutnya di media sosial",
            "Kelompok penggemar idolanya"
        ],
        "answer": 0,
        "why": "Identitas pribadi terbentuk dari nilai keluarga dan tradisi yang dijalani seseorang sejak kecil."
    },
    {
        "q": "Identitas bangsa Indonesia terbentuk dari …",
        "options": [
            "Hobi pribadi warga negara",
            "Kelompok pertemanan di sekolah",
            "Bahasa asing yang dikuasai",
            "Budaya bersama yang dimiliki seluruh bangsa"
        ],
        "answer": 3,
        "why": "Identitas bangsa terbentuk dari budaya bersama yang dimiliki dan dijaga oleh seluruh bangsa."
    },
    {
        "q": "Salah satu manfaat melestarikan tradisi adalah …",
        "options": [
            "Membuat budaya daerah cepat punah",
            "Memperkuat jati diri dan menumbuhkan rasa bangga pada budaya sendiri",
            "Menghilangkan keberagaman budaya",
            "Membuat generasi muda melupakan daerahnya"
        ],
        "answer": 1,
        "why": "Pelestarian tradisi memperkuat jati diri, menumbuhkan rasa bangga, menjadi daya tarik wisata, dan mencegah budaya punah."
    },
    {
        "q": "Tradisi Sekaten diselenggarakan di …",
        "options": [
            "Yogyakarta dan Surakarta",
            "Bali dan Lombok",
            "Pariaman dan Padang",
            "Toraja dan Makassar"
        ],
        "answer": 0,
        "why": "Sekaten adalah tradisi perayaan yang diselenggarakan di Yogyakarta dan Surakarta."
    },
    {
        "q": "Tradisi Tabuik berasal dari Pariaman, yang terletak di provinsi …",
        "options": [
            "Sulawesi Selatan",
            "Sumatera Utara",
            "Sumatera Barat",
            "Jawa Tengah"
        ],
        "answer": 2,
        "why": "Pariaman terletak di provinsi Sumatera Barat, dan Tabuik adalah tradisi dari daerah tersebut."
    },
    {
        "q": "Cara melestarikan tradisi di lingkungan sekolah adalah …",
        "options": [
            "Melarang kegiatan budaya di sekolah",
            "Mengikuti ekstrakurikuler tari tradisional dan muatan lokal budaya daerah",
            "Hanya mempelajari budaya asing",
            "Menghapus pelajaran muatan lokal"
        ],
        "answer": 1,
        "why": "Di sekolah, tradisi dilestarikan antara lain melalui ekstrakurikuler seni tradisional dan muatan lokal bahasa dan budaya daerah."
    },
    {
        "q": "Fahombo, tradisi lompat batu yang terkenal, berasal dari …",
        "options": [
            "Papua",
            "Bali",
            "Sumatera Barat",
            "Nias"
        ],
        "answer": 3,
        "why": "Fahombo adalah tradisi lompat batu dari Nias."
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
    var prevBest = read('mpi-pp-b2-quiz-best', null);
    var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-pp-b2-quiz-best', String(qScore));
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
    try { saved = JSON.parse(read('mpi-pp-b2-refleksi', 'null')); } catch (e) { saved = null; }
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
      store('mpi-pp-b2-refleksi', JSON.stringify(data));
      var st = $('refStatus');
      if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
      markVisited('sub6');
    });
  }
})();
