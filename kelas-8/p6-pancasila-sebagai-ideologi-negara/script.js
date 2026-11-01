/* P.6 Pancasila sebagai Ideologi Negara — script.js
   Vanilla JS, tanpa framework. Fakta dan kunci jawaban mengikuti
   buku teks Pendidikan Pancasila Fase D dan fakta baku yang aman.
   localStorage (semua berawalan mpi-pp-p6- agar tidak bertabrakan
   dengan modul lain pada domain github.io yang sama):
   mpi-pp-p6-visited, mpi-pp-p6-quiz-best, mpi-pp-p6-polling,
   mpi-pp-p6-komitmen, mpi-pp-p6-refleksi. */
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
  try { visited = JSON.parse(read('mpi-pp-p6-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];

  function saveVisited() { store('mpi-pp-p6-visited', JSON.stringify(visited)); }
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
  var bestStored = read('mpi-pp-p6-quiz-best', null);
  if (bestStored !== null && bestEl) {
    bestEl.textContent = 'Skor terbaik kuis: ' + bestStored + '/10';
    bestEl.hidden = false;
  }

  /* ---------- Sub-bab 1: polling ---------- */
  var POLL_MSG = {
  "boleh": "Tercatat! Itulah sifat ideologi terbuka: nilai-nilai dasarnya tetap, tetapi penjabarannya dapat berkembang sesuai zaman. Pancasila adalah ideologi terbuka, seperti akan kamu pelajari di modul ini.",
  "tidak": "Tercatat! Sikap tidak menerima perubahan apa pun adalah ciri ideologi tertutup yang bersifat kaku. Pancasila justru ideologi terbuka: nilai dasarnya memang tetap, tetapi penjabarannya boleh berkembang sesuai zaman tanpa mengubah nilai dasarnya.",
  "bebas": "Tercatat! Perubahan pada ideologi terbuka ada batasnya: yang berkembang adalah penjabarannya, sedangkan nilai-nilai dasarnya tetap dan tidak diubah. Jika nilai dasarnya ikut diubah, ideologi itu sudah berganti. Penjelasannya ada di Sub-bab 2."
};
  function renderPoll(pilihan, simpan) {
    document.querySelectorAll('[data-poll]').forEach(function (btn) {
      btn.classList.toggle('chosen', btn.getAttribute('data-poll') === pilihan);
    });
    if (pilihan && POLL_MSG[pilihan]) {
      showFb($('pollFb'), true, POLL_MSG[pilihan]);
      if (simpan) store('mpi-pp-p6-polling', pilihan);
    }
  }
  document.querySelectorAll('[data-poll]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      renderPoll(btn.getAttribute('data-poll'), true);
      markVisited('sub1');
    });
  });
  renderPoll(read('mpi-pp-p6-polling', null), false);

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
  "sebarkan": {
    "ok": false,
    "msg": "Menyebarkan pesan yang memaksakan kehendak berarti ikut menyebarkan sikap ideologi tertutup. Keterbukaan Pancasila justru menuntut kita kritis sebelum menerima atau menyebarkan gagasan. Coba pertimbangkan pilihan lain."
  },
  "kritis": {
    "ok": true,
    "msg": "Tepat! Inilah sikap ideologi terbuka: menerima ruang diskusi, memeriksa gagasan dengan nilai dasar Pancasila, dan menyampaikan pendapat dengan sopan — tanpa memaksakan kehendak dan tanpa menelan mentah-mentah."
  },
  "keluar": {
    "ok": false,
    "msg": "Menghindar memang menyelamatkan dirimu, tetapi pesan yang memaksakan kehendak tetap menyebar ke teman lain. Sikap terbuka yang aktif — memeriksa dan mengajak berdiskusi dengan sopan — lebih bermanfaat. Coba pertimbangkan pilihan lain."
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

  /* ---------- Sub-bab 4: sortir kartu ke kategori (pola lini masa) ---------- */
  var EVENTS = [
  {
    "target": "terbuka",
    "label": "Nilai dasarnya tetap, penjabarannya berkembang sesuai zaman"
  },
  {
    "target": "terbuka",
    "label": "Memberi ruang bagi diskusi dan musyawarah"
  },
  {
    "target": "terbuka",
    "label": "Penjabarannya dijabarkan dalam peraturan yang dapat disesuaikan kebutuhan masyarakat"
  },
  {
    "target": "terbuka",
    "label": "Menerima gagasan baru selama tidak mengubah nilai dasar"
  },
  {
    "target": "tertutup",
    "label": "Kaku dan tidak menerima perubahan apa pun"
  },
  {
    "target": "tertutup",
    "label": "Memaksakan satu kehendak kepada seluruh warga"
  },
  {
    "target": "tertutup",
    "label": "Menolak dan melarang gagasan baru dari masyarakat"
  },
  {
    "target": "tertutup",
    "label": "Penjabarannya tidak boleh disesuaikan dengan perkembangan zaman"
  }
];
  var NAMA_SLOT = {
  "terbuka": "Ideologi Terbuka",
  "tertutup": "Ideologi Tertutup"
};
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
    if (!card || !slot) return;
    var slotKey = slot.getAttribute('data-slot');
    if (card.getAttribute('data-target') === slotKey) {
      var drop = slot.querySelector('.tl-drop');
      slot.classList.add('terisi', 'benar');
      if (drop) {
        if (drop.getAttribute('data-isi') !== '1') { drop.textContent = ''; drop.setAttribute('data-isi', '1'); }
        drop.appendChild(card);
      }
      card.classList.remove('terpilih');
      card.classList.add('terpasang');
      card.disabled = true;
      card.draggable = false;
      if (tlDipilih === card) tlDipilih = null;
      tlTerpasang++;
      tlUpdateProgress();
      if (tlTerpasang === EVENTS.length) {
        showFb($('tlFb'), true, 'Sempurna! Kedelapan kartu sudah tepat. Ideologi terbuka menerima perkembangan penjabaran dengan nilai dasar yang tetap; ideologi tertutup kaku dan memaksakan kehendak.');
        markVisited('sub4');
      } else {
        showFb($('tlFb'), true, 'Tepat! “' + card.textContent + '” memang termasuk kategori ' + NAMA_SLOT[slotKey] + '.');
      }
    } else {
      slot.classList.remove('goyang');
      void slot.offsetWidth;
      slot.classList.add('goyang');
      showFb($('tlFb'), false, 'Belum tepat. “' + card.textContent + '” tidak termasuk kategori ' + NAMA_SLOT[slotKey] + '. Pikirkan kembali bidang/kategorinya, lalu coba slot lain.');
    }
  }
  function tlBangun() {
    tlTerpasang = 0;
    tlDipilih = null;
    document.querySelectorAll('.tl-slot').forEach(function (slot) {
      slot.classList.remove('terisi', 'benar', 'goyang');
      var drop = slot.querySelector('.tl-drop');
      if (drop) { drop.textContent = 'Letakkan kartu di sini'; drop.removeAttribute('data-isi'); }
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

  /* ---------- Sub-bab 4: cocokkan pasangan (satu pilihan per baris) ---------- */
  var MATCH2 = {
  "dasar": {
    "benar": "Nilai Ketuhanan Yang Maha Esa sebagai nilai pokok yang tetap",
    "ket": "nilai dasar adalah nilai pokok dalam sila Pancasila yang tetap, misalnya nilai Ketuhanan Yang Maha Esa."
  },
  "instrumental": {
    "benar": "Undang-undang dan peraturan yang menjabarkan nilai dasar Pancasila",
    "ket": "nilai instrumental adalah penjabaran nilai dasar dalam peraturan perundang-undangan."
  },
  "praksis": {
    "benar": "Membantu tetangga yang sedang kesulitan dalam kehidupan sehari-hari",
    "ket": "nilai praksis adalah praktik nyata sehari-hari, misalnya membantu tetangga yang kesulitan."
  }
};
  var MATCH2_DONE = 'Semua pasangan tepat! Nilai dasar dijabarkan menjadi nilai instrumental, lalu diwujudkan sebagai nilai praksis dalam kehidupan sehari-hari.';
  var matchCheck = $('matchCheck');
  if (matchCheck) {
    matchCheck.addEventListener('click', function () {
      var semuaBenar = true;
      var adaKosong = false;
      document.querySelectorAll('.match2-row').forEach(function (row) {
        var kunci = MATCH2[row.getAttribute('data-match2')];
        var sel = row.querySelector('.match2-sel');
        var fb = row.querySelector('.match-fb');
        if (!kunci || !sel) return;
        if (!sel.value) {
          adaKosong = true;
          semuaBenar = false;
          row.classList.remove('ok', 'no');
          if (fb) fb.textContent = 'Pilih dulu pasangannya.';
          return;
        }
        var ok = sel.value === kunci.benar;
        if (!ok) semuaBenar = false;
        row.classList.toggle('ok', ok);
        row.classList.toggle('no', !ok);
        if (fb) fb.textContent = ok ? ('Tepat: ' + kunci.ket) : ('Belum tepat. Petunjuk: ' + kunci.ket);
      });
      if (adaKosong) {
        showFb($('matchFb'), false, 'Masih ada baris yang belum dipilih. Lengkapi semua pasangan, lalu periksa lagi.');
      } else if (semuaBenar) {
        showFb($('matchFb'), true, MATCH2_DONE);
        markVisited('sub4');
      } else {
        showFb($('matchFb'), false, 'Sebagian pasangan belum tepat. Perhatikan petunjuk di bawah tiap baris, lalu perbaiki.');
      }
    });
  }

  /* ---------- Sub-bab 5: komitmen ---------- */
  var komitmenText = $('komitmenText');
  if (komitmenText) {
    var simpanan = read('mpi-pp-p6-komitmen', '');
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
      store('mpi-pp-p6-komitmen', isi);
      if (st) st.textContent = 'Komitmen tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '. Tunjukkan kepada gurumu pada pertemuan berikutnya.';
      markVisited('sub5');
    });
  }

  /* ---------- Sub-bab 6: kuis 10 soal ---------- */
  /* Topik: asal kata ideologi, ideologi terbuka/tertutup, dan tiga lapisan nilai.
     Kunci terverifikasi manual, distribusinya seimbang A2/B3/C2/D3:
     1) B  2) C  3) D  4) A  5) D  6) B  7) A  8) C  9) B  10) D */
  var QUIZ = [
  {
    "q": "Kata “ideologi” berasal dari kata idea yang berarti …",
    "options": [
      "ilmu",
      "gagasan",
      "negara",
      "kekuasaan"
    ],
    "answer": 1,
    "why": "Ideologi berasal dari idea (gagasan) dan logos (ilmu)."
  },
  {
    "q": "Dalam kata “ideologi”, kata logos berarti …",
    "options": [
      "gagasan",
      "bangsa",
      "ilmu",
      "hukum"
    ],
    "answer": 2,
    "why": "Logos berarti ilmu, sedangkan idea berarti gagasan."
  },
  {
    "q": "Pancasila disebut ideologi terbuka karena …",
    "options": [
      "nilai dasarnya berubah-ubah setiap tahun",
      "semua penjabarannya ditetapkan bangsa lain",
      "warganya bebas tidak menaati nilai apa pun",
      "nilai dasarnya tetap, tetapi penjabarannya dapat berkembang sesuai zaman tanpa mengubah nilai dasar"
    ],
    "answer": 3,
    "why": "Ideologi terbuka: nilai dasar tetap, penjabaran berkembang sesuai perkembangan zaman tanpa mengubah nilai dasarnya."
  },
  {
    "q": "Berikut ini yang merupakan ciri ideologi tertutup adalah …",
    "options": [
      "kaku, memaksakan kehendak, dan tidak menerima perubahan",
      "memberi ruang musyawarah bagi warga",
      "penjabarannya disesuaikan dengan zaman",
      "nilai dasarnya digali dari budaya bangsa"
    ],
    "answer": 0,
    "why": "Ideologi tertutup bersifat kaku, memaksakan kehendak, dan tidak menerima perubahan — kebalikan dari ideologi terbuka."
  },
  {
    "q": "Nilai-nilai pokok dalam kelima sila Pancasila yang bersifat tetap disebut nilai …",
    "options": [
      "praksis",
      "instrumental",
      "sementara",
      "dasar"
    ],
    "answer": 3,
    "why": "Nilai dasar adalah nilai pokok Pancasila yang tetap dan tidak berubah, yaitu nilai-nilai dalam kelima silanya."
  },
  {
    "q": "Penjabaran nilai dasar Pancasila ke dalam peraturan perundang-undangan disebut nilai …",
    "options": [
      "dasar",
      "instrumental",
      "praksis",
      "budaya"
    ],
    "answer": 1,
    "why": "Nilai instrumental adalah penjabaran nilai dasar dalam bentuk peraturan perundang-undangan dan kelembagaan, yang dapat disesuaikan dengan perkembangan zaman."
  },
  {
    "q": "Praktik nyata nilai Pancasila dalam kehidupan sehari-hari disebut nilai …",
    "options": [
      "praksis",
      "dasar",
      "instrumental",
      "formal"
    ],
    "answer": 0,
    "why": "Nilai praksis adalah pelaksanaan nyata nilai Pancasila oleh warga negara dalam kehidupan sehari-hari."
  },
  {
    "q": "Contoh nilai praksis Pancasila adalah …",
    "options": [
      "rumusan sila pertama Pancasila",
      "sebuah undang-undang yang baru disahkan",
      "membantu tetangga yang sedang terkena musibah",
      "pembukaan undang-undang dasar"
    ],
    "answer": 2,
    "why": "Membantu tetangga adalah praktik nyata (praksis) nilai kemanusiaan dan kegotongroyongan dalam kehidupan sehari-hari."
  },
  {
    "q": "Contoh nilai instrumental Pancasila adalah …",
    "options": [
      "sikap sopan seorang siswa kepada guru",
      "peraturan perundang-undangan yang menjabarkan nilai dasar Pancasila",
      "gotong royong di lingkungan rumah",
      "nilai persatuan dalam sila ketiga"
    ],
    "answer": 1,
    "why": "Peraturan perundang-undangan adalah penjabaran nilai dasar, yaitu nilai instrumental. Nilai persatuan dalam sila ketiga adalah nilai dasar."
  },
  {
    "q": "Ideologi terbuka menerima perkembangan zaman dengan syarat …",
    "options": [
      "nilai dasarnya ikut diganti",
      "seluruh warga menuruti satu pendapat",
      "peraturan lama semuanya dihapus",
      "perkembangan itu tidak mengubah nilai-nilai dasar Pancasila"
    ],
    "answer": 3,
    "why": "Dalam ideologi terbuka, penjabaran boleh berkembang mengikuti zaman selama nilai-nilai dasarnya tetap tidak berubah."
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
    var prevBest = read('mpi-pp-p6-quiz-best', null);
    var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-pp-p6-quiz-best', String(qScore));
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
    try { saved = JSON.parse(read('mpi-pp-p6-refleksi', 'null')); } catch (e) { saved = null; }
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
      store('mpi-pp-p6-refleksi', JSON.stringify(data));
      var st = $('refStatus');
      if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
      markVisited('sub6');
    });
  }
})();
