/* N.2 Wawasan Nusantara dan Keutuhan Bangsa — script.js
   Vanilla JS, tanpa framework. Meniru mesin prototipe P.1.
   localStorage (semua berawalan mpi-pp-n2- agar tidak bertabrakan
   dengan MPI Matematika pada domain github.io yang sama):
   mpi-pp-n2-visited, mpi-pp-n2-quiz-best, mpi-pp-n2-polling,
   mpi-pp-n2-komitmen, mpi-pp-n2-refleksi. */
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
  try { visited = JSON.parse(read('mpi-pp-n2-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];

  function saveVisited() { store('mpi-pp-n2-visited', JSON.stringify(visited)); }
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
  var bestStored = read('mpi-pp-n2-quiz-best', null);
  if (bestStored !== null && bestEl) {
    bestEl.textContent = 'Skor terbaik kuis: ' + bestStored + '/10';
    bestEl.hidden = false;
  }

  /* ---------- Sub-bab 1: polling ---------- */
  var POLL_MSG = {
  "wilayah": "Tercatat! Kesatuan wilayah adalah inti wawasan Nusantara — unsur dasarnya disebut wadah. Di modul ini kamu akan mengenal unsur dasar dan gatra lainnya.",
  "bahasa": "Tercatat! Rasa satu kebangsaan adalah bagian dari isi wawasan Nusantara: jiwa dan kehidupan bangsa yang satu. Di modul ini kamu akan mengenal unsur wadah, isi, dan tata laku.",
  "tujuan": "Tercatat! Wawasan Nusantara memang selalu diarahkan untuk mencapai tujuan nasional bangsa Indonesia. Di modul ini kamu akan mempelajari tujuan, landasan, dan fungsinya."
};
  function renderPoll(pilihan, simpan) {
    document.querySelectorAll('[data-poll]').forEach(function (btn) {
      btn.classList.toggle('chosen', btn.getAttribute('data-poll') === pilihan);
    });
    if (pilihan && POLL_MSG[pilihan]) {
      showFb($('pollFb'), true, POLL_MSG[pilihan]);
      if (simpan) store('mpi-pp-n2-polling', pilihan);
    }
  }
  document.querySelectorAll('[data-poll]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      renderPoll(btn.getAttribute('data-poll'), true);
      markVisited('sub1');
    });
  });
  renderPoll(read('mpi-pp-n2-polling', null), false);

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
  "sebar": {
    "ok": false,
    "msg": "Meneruskan kabar yang merendahkan daerah lain ikut menyebarkan paham yang memecah belah — salah satu tantangan keutuhan bangsa. Periksa dulu kebenarannya. Coba pertimbangkan pilihan lain."
  },
  "periksa": {
    "ok": true,
    "msg": "Tepat! Memeriksa kabar dan menolak menyebarkan konten perpecahan adalah perilaku nyata wawasan Nusantara: seluruh daerah adalah satu kesatuan bangsa yang harus dijaga."
  },
  "diam": {
    "ok": false,
    "msg": "Dalam wawasan Nusantara, tidak ada daerah yang “bukan urusanku” — semua wilayah dan rakyat Indonesia adalah satu kesatuan. Kamu bisa membantu dengan tidak meneruskan dan mengingatkan pengirimnya. Coba pertimbangkan pilihan lain."
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
  var MATCH = {"ideologi": "Menjunjung Pancasila sebagai dasar negara dalam kehidupan bersama", "politik": "Berpartisipasi dalam musyawarah dan proses demokrasi", "ekonomi": "Mengembangkan usaha dan sumber daya untuk kesejahteraan bersama", "sosbud": "Melestarikan budaya dan hidup rukun dalam keberagaman", "hankam": "Menjaga keamanan lingkungan dan semangat bela negara"};
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
      else if (semuaBenar) { showFb($('matchFb'), true, "Semua pasangan tepat! Kelima gatra itu — ideologi, politik, ekonomi, sosial budaya, dan pertahanan keamanan — adalah pancagatra dalam asta gatra."); markVisited('sub4'); }
      else showFb($('matchFb'), false, 'Sebagian pasangan belum tepat. Perhatikan keterangan di bawah tiap nama, lalu perbaiki.');
    });
  }
  /* ---------- Sub-bab 4: sortir dua kategori (pola lini masa) ---------- */
  var EVENTS = [{"target": "dukung", "label": "Menghargai teman yang berasal dari daerah lain"}, {"target": "dukung", "label": "Menolak dan tidak menyebarkan hoaks yang memecah belah"}, {"target": "dukung", "label": "Bangga menggunakan produk dalam negeri"}, {"target": "lemah", "label": "Menyebarkan hoaks yang memecah belah antar-daerah"}, {"target": "lemah", "label": "Menganggap daerah sendiri paling unggul dan merendahkan daerah lain"}, {"target": "lemah", "label": "Memancing pertengkaran antar-kelompok yang berbeda daerah"}];
  var NAMA_SLOT = {"dukung": "Mendukung Keutuhan", "lemah": "Melemahkan Keutuhan"};
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
    var slotId = slot.getAttribute('data-slot');
    if (card.getAttribute('data-target') === slotId) {
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
        showFb($('tlFb'), true, "Sortirmu sempurna! Menghargai keberagaman, menolak hoaks perpecahan, dan bangga pada produk dalam negeri mendukung keutuhan; menyebarkan hoaks, merendahkan daerah lain, dan memancing pertengkaran melemahkannya.");
        markVisited('sub4');
      } else {
        showFb($('tlFb'), true, 'Tepat! “' + card.textContent + '” memang termasuk kategori ' + NAMA_SLOT[slotId] + '.');
      }
    } else {
      slot.classList.remove('goyang');
      void slot.offsetWidth;
      slot.classList.add('goyang');
      showFb($('tlFb'), false, 'Belum tepat. “' + card.textContent + '” tidak termasuk kategori ' + NAMA_SLOT[slotId] + '. Coba kategori lainnya.');
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
    slot.addEventListener('click', function () { if (tlDipilih) tlPasang(tlDipilih, slot); });
    slot.addEventListener('dragover', function (e) { e.preventDefault(); slot.classList.add('dragover'); });
    slot.addEventListener('dragleave', function () { slot.classList.remove('dragover'); });
    slot.addEventListener('drop', function (e) { e.preventDefault(); slot.classList.remove('dragover'); if (tlDipilih) tlPasang(tlDipilih, slot); });
  });
  var tlReset = $('tlReset');
  if (tlReset) tlReset.addEventListener('click', tlBangun);
  tlBangun();

  /* ---------- Sub-bab 5: komitmen ---------- */
  var komitmenText = $('komitmenText');
  if (komitmenText) {
    var simpanan = read('mpi-pp-n2-komitmen', '');
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
      store('mpi-pp-n2-komitmen', isi);
      if (st) st.textContent = 'Komitmen tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '. Tunjukkan kepada gurumu pada pertemuan berikutnya.';
      markVisited('sub5');
    });
  }

  /* ---------- Sub-bab 6: kuis 10 soal ---------- */
  /* Kunci terverifikasi manual, distribusinya seimbang A2/B3/C2/D3:
     1) B  2) C  3) D  4) A  5) D  6) B  7) A  8) C  9) B  10) D */
  var QUIZ = [
    {
        "q": "Wawasan Nusantara adalah …",
        "options": [
            "Cara pandang bangsa asing terhadap kepulauan Indonesia",
            "Cara pandang dan sikap bangsa Indonesia mengenai diri dan lingkungannya sebagai kesatuan wilayah dan kebangsaan",
            "Cara membagi wilayah Indonesia menjadi daerah-daerah terpisah",
            "Nama program pembangunan di kawasan timur Indonesia"
        ],
        "answer": 1,
        "why": "Wawasan Nusantara adalah cara pandang dan sikap bangsa Indonesia mengenai diri dan lingkungannya (kesatuan wilayah dan kebangsaan) dalam mencapai tujuan nasional."
    },
    {
        "q": "Landasan idiil wawasan Nusantara adalah …",
        "options": [
            "UUD NRI 1945",
            "Deklarasi Djuanda",
            "Pancasila",
            "Ketetapan MPR"
        ],
        "answer": 2,
        "why": "Landasan idiil wawasan Nusantara adalah Pancasila, sedangkan landasan konstitusionalnya adalah UUD NRI 1945."
    },
    {
        "q": "Deklarasi Djuanda yang menegaskan Indonesia sebagai negara kepulauan dinyatakan pada tanggal …",
        "options": [
            "17 Agustus 1945",
            "28 Oktober 1928",
            "1 Juni 1945",
            "13 Desember 1957"
        ],
        "answer": 3,
        "why": "Deklarasi Djuanda dinyatakan pada 13 Desember 1957 dan menegaskan Indonesia sebagai negara kepulauan."
    },
    {
        "q": "Landasan konstitusional wawasan Nusantara adalah …",
        "options": [
            "UUD NRI 1945",
            "Pancasila",
            "Deklarasi Djuanda",
            "Sumpah Pemuda"
        ],
        "answer": 0,
        "why": "Landasan konstitusional wawasan Nusantara adalah UUD NRI 1945; landasan idiilnya adalah Pancasila."
    },
    {
        "q": "Unsur dasar wawasan Nusantara yang berarti wilayah Indonesia adalah …",
        "options": [
            "Isi",
            "Tata laku",
            "Tujuan nasional",
            "Wadah"
        ],
        "answer": 3,
        "why": "Unsur dasar wawasan Nusantara: wadah (wilayah), isi (jiwa dan kehidupan bangsa), dan tata laku (perilaku bangsa)."
    },
    {
        "q": "Trigatra dalam wawasan Nusantara terdiri dari …",
        "options": [
            "Ideologi, politik, dan ekonomi",
            "Geografi, demografi, dan kekayaan alam",
            "Sosial budaya, hankam, dan politik",
            "Ekonomi, geografi, dan ideologi"
        ],
        "answer": 1,
        "why": "Trigatra adalah geografi, demografi, dan kekayaan alam. Bersama pancagatra, keduanya membentuk asta gatra (delapan gatra)."
    },
    {
        "q": "Jumlah seluruh gatra dalam asta gatra adalah …",
        "options": [
            "Delapan",
            "Tiga",
            "Lima",
            "Sepuluh"
        ],
        "answer": 0,
        "why": "Asta gatra berjumlah delapan: trigatra (3) ditambah pancagatra (5)."
    },
    {
        "q": "Berikut ini yang termasuk pancagatra adalah …",
        "options": [
            "Geografi dan demografi",
            "Kekayaan alam dan geografi",
            "Ideologi, politik, ekonomi, sosial budaya, dan pertahanan keamanan",
            "Demografi dan kekayaan alam"
        ],
        "answer": 2,
        "why": "Pancagatra adalah ideologi, politik, ekonomi, sosial budaya, dan pertahanan keamanan (hankam)."
    },
    {
        "q": "Berikut ini yang merupakan tantangan bagi keutuhan bangsa adalah …",
        "options": [
            "Gotong royong antarwarga",
            "Kesenjangan antar-daerah",
            "Menghargai keberagaman",
            "Persatuan antar suku"
        ],
        "answer": 1,
        "why": "Tantangan keutuhan bangsa antara lain kesenjangan antar-daerah, isu perbatasan, dan paham yang memecah belah."
    },
    {
        "q": "Perilaku berikut yang mendukung pelaksanaan wawasan Nusantara adalah …",
        "options": [
            "Menyebarkan hoaks tentang daerah lain",
            "Merendahkan budaya daerah lain",
            "Bersikap acuh terhadap persatuan bangsa",
            "Menghargai keberagaman dan menjaga persatuan bangsa"
        ],
        "answer": 3,
        "why": "Menghargai keberagaman dan menjaga persatuan adalah perilaku yang mendukung wawasan Nusantara dan keutuhan bangsa."
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
    var prevBest = read('mpi-pp-n2-quiz-best', null);
    var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-pp-n2-quiz-best', String(qScore));
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
    try { saved = JSON.parse(read('mpi-pp-n2-refleksi', 'null')); } catch (e) { saved = null; }
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
      store('mpi-pp-n2-refleksi', JSON.stringify(data));
      var st = $('refStatus');
      if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
      markVisited('sub6');
    });
  }
})();
