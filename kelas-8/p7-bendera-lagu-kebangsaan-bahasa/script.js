/* P.7 Bendera, Lagu Kebangsaan, dan Bahasa Indonesia — script.js
   Vanilla JS, tanpa framework. Fakta dan kunci jawaban mengikuti
   buku teks Pendidikan Pancasila Fase D dan fakta baku yang aman.
   localStorage (semua berawalan mpi-pp-p7- agar tidak bertabrakan
   dengan modul lain pada domain github.io yang sama):
   mpi-pp-p7-visited, mpi-pp-p7-quiz-best, mpi-pp-p7-polling,
   mpi-pp-p7-komitmen, mpi-pp-p7-refleksi. */
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
  try { visited = JSON.parse(read('mpi-pp-p7-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];

  function saveVisited() { store('mpi-pp-p7-visited', JSON.stringify(visited)); }
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
  var bestStored = read('mpi-pp-p7-quiz-best', null);
  if (bestStored !== null && bestEl) {
    bestEl.textContent = 'Skor terbaik kuis: ' + bestStored + '/10';
    bestEl.hidden = false;
  }

  /* ---------- Sub-bab 1: polling ---------- */
  var POLL_MSG = {
  "bendera": "Tercatat! Bendera Sang Saka Merah Putih memang paling tampak: berkibar di sekolah setiap upacara. Di modul ini kamu akan mempelajari sejarahnya — dijahit oleh Ibu Fatmawati dan pertama dikibarkan pada 17 Agustus 1945 — serta dasar hukumnya.",
  "lagu": "Tercatat! Indonesia Raya kita nyanyikan setiap upacara, tetapi tahukah kamu lagu ini pertama kali diperdengarkan pada 28 Oktober 1928, jauh sebelum kemerdekaan? Sejarahnya ada di Sub-bab 2.",
  "bahasa": "Tercatat! Benar, bahasa Indonesia adalah simbol pemersatu yang bekerja setiap hari: ia berasal dari bahasa Melayu dan diangkat sebagai bahasa persatuan dalam Sumpah Pemuda 1928. Kedudukannya sebagai bahasa negara diatur Pasal 36 UUD NRI Tahun 1945."
};
  function renderPoll(pilihan, simpan) {
    document.querySelectorAll('[data-poll]').forEach(function (btn) {
      btn.classList.toggle('chosen', btn.getAttribute('data-poll') === pilihan);
    });
    if (pilihan && POLL_MSG[pilihan]) {
      showFb($('pollFb'), true, POLL_MSG[pilihan]);
      if (simpan) store('mpi-pp-p7-polling', pilihan);
    }
  }
  document.querySelectorAll('[data-poll]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      renderPoll(btn.getAttribute('data-poll'), true);
      markVisited('sub1');
    });
  });
  renderPoll(read('mpi-pp-p7-polling', null), false);

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
    "msg": "Ikut mengobrol berarti menukar rasa hormat pada simbol perjuangan bangsa dengan penerimaan teman. Bendera dan lagu kebangsaan adalah pemersatu yang diperjuangkan sejak 1928 dan 1945. Coba pertimbangkan pilihan lain."
  },
  "khidmat": {
    "ok": true,
    "msg": "Tepat! Kamu menghormati simbol bangsa dengan sikap khidmat, dan tetap menjaga hubungan baik dengan menegur secara sopan pada waktu yang tepat. Itulah sikap warga negara yang memahami makna di balik simbol."
  },
  "marah": {
    "ok": false,
    "msg": "Maksudmu mengingatkan itu baik, tetapi berteriak di tengah upacara justru mengganggu kekhidmatan upacara itu sendiri. Teguran yang sopan setelah upacara lebih tepat. Coba pertimbangkan pilihan lain."
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

  /* ---------- Sub-bab 4: cocokkan pasangan (satu pilihan per baris) ---------- */
  var MATCH2 = {
  "bendera": {
    "benar": "Dijahit oleh Ibu Fatmawati dan pertama dikibarkan pada 17 Agustus 1945",
    "ket": "bendera pusaka dijahit oleh Ibu Fatmawati dan pertama dikibarkan pada 17 Agustus 1945; kedudukannya pada Pasal 35 UUD NRI Tahun 1945."
  },
  "lagu": {
    "benar": "Diciptakan oleh W.R. Supratman dan pertama kali diperdengarkan pada 28 Oktober 1928",
    "ket": "Indonesia Raya diciptakan W.R. Supratman dan pertama kali diperdengarkan pada Kongres Pemuda II, 28 Oktober 1928."
  },
  "bahasa": {
    "benar": "Berasal dari bahasa Melayu dan diangkat sebagai bahasa persatuan dalam Sumpah Pemuda 1928",
    "ket": "bahasa Indonesia berasal dari bahasa Melayu dan diangkat sebagai bahasa persatuan dalam Sumpah Pemuda 1928; kedudukannya pada Pasal 36 UUD NRI Tahun 1945."
  },
  "lambang": {
    "benar": "Lambang negara Garuda Pancasila yang memuat semboyan Bhinneka Tunggal Ika",
    "ket": "lambang negara Garuda Pancasila memuat semboyan Bhinneka Tunggal Ika; kedudukannya pada Pasal 36A UUD NRI Tahun 1945."
  }
};
  var MATCH2_DONE = 'Semua pasangan tepat! Keempat simbol itu diatur bersama dalam UU No. 24 Tahun 2009, dan kedudukannya dalam UUD NRI Tahun 1945: bendera Pasal 35, bahasa Pasal 36, lambang negara Pasal 36A.';
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

  /* ---------- Sub-bab 4: urutkan peristiwa ---------- */
  var URUTAN = [
  "Sumpah Pemuda dan lagu Indonesia Raya pertama kali diperdengarkan (1928)",
  "Bendera Merah Putih pertama kali dikibarkan pada Proklamasi (1945)",
  "UU No. 24 Tahun 2009 tentang Bendera, Bahasa, dan Lambang Negara, serta Lagu Kebangsaan ditetapkan (2009)"
];
  var URUT_IDS = [
  "urut1",
  "urut2",
  "urut3"
];
  var urutCheck = $('urutCheck');
  if (urutCheck) {
    urutCheck.addEventListener('click', function () {
      var vals = URUT_IDS.map(function (id) {
        var el = $(id);
        return el ? el.value : '';
      });
      var fb = $('urutFb');
      if (vals.indexOf('') !== -1) { showFb(fb, false, 'Isi semua posisi dulu.'); return; }
      if (new Set(vals).size !== vals.length) { showFb(fb, false, 'Ada peristiwa yang terulang. Tiap peristiwa dipakai tepat satu kali.'); return; }
      var benar = 0;
      vals.forEach(function (v, i) { if (v === URUTAN[i]) benar++; });
      if (benar === URUTAN.length) {
        showFb(fb, true, 'Urutanmu tepat! 1928: Sumpah Pemuda dan Indonesia Raya pertama diperdengarkan; 1945: bendera pertama dikibarkan pada proklamasi; 2009: UU No. 24 Tahun 2009 ditetapkan.');
        markVisited('sub4');
      } else {
        showFb(fb, false, benar + ' dari ' + URUTAN.length + ' posisi sudah tepat. Urutan yang benar: ' + URUTAN.join(' → ') + '.');
      }
    });
  }

  /* ---------- Sub-bab 5: komitmen ---------- */
  var komitmenText = $('komitmenText');
  if (komitmenText) {
    var simpanan = read('mpi-pp-p7-komitmen', '');
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
      store('mpi-pp-p7-komitmen', isi);
      if (st) st.textContent = 'Komitmen tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '. Tunjukkan kepada gurumu pada pertemuan berikutnya.';
      markVisited('sub5');
    });
  }

  /* ---------- Sub-bab 6: kuis 10 soal ---------- */
  /* Topik: bendera, bahasa, lambang negara, lagu kebangsaan, dan dasar hukumnya.
     Kunci terverifikasi manual, distribusinya seimbang A2/B3/C2/D3:
     1) B  2) C  3) D  4) A  5) D  6) B  7) A  8) C  9) B  10) D */
  var QUIZ = [
  {
    "q": "Bendera, bahasa, lambang negara, dan lagu kebangsaan Indonesia diatur bersama dalam …",
    "options": [
      "UU No. 20 Tahun 2003",
      "UU No. 24 Tahun 2009",
      "UU No. 12 Tahun 2011",
      "UU No. 23 Tahun 2014"
    ],
    "answer": 1,
    "why": "Keempatnya diatur dalam UU No. 24 Tahun 2009 tentang Bendera, Bahasa, dan Lambang Negara, serta Lagu Kebangsaan."
  },
  {
    "q": "Bendera Sang Saka Merah Putih pertama kali dikibarkan pada …",
    "options": [
      "28 Oktober 1928",
      "1 Juni 1945",
      "17 Agustus 1945",
      "18 Agustus 1945"
    ],
    "answer": 2,
    "why": "Bendera pusaka pertama kali dikibarkan pada Proklamasi Kemerdekaan, 17 Agustus 1945."
  },
  {
    "q": "Bendera pusaka Sang Saka Merah Putih dijahit oleh …",
    "options": [
      "Ibu Sud",
      "Ibu Kartini",
      "Cut Nyak Dien",
      "Ibu Fatmawati"
    ],
    "answer": 3,
    "why": "Bendera pusaka dijahit oleh Ibu Fatmawati, istri Presiden Soekarno."
  },
  {
    "q": "Lagu kebangsaan Indonesia Raya diciptakan oleh …",
    "options": [
      "W.R. Supratman",
      "Ismail Marzuki",
      "Ibu Sud",
      "Gesang"
    ],
    "answer": 0,
    "why": "Indonesia Raya diciptakan oleh Wage Rudolf Supratman (W.R. Supratman)."
  },
  {
    "q": "Lagu Indonesia Raya pertama kali diperdengarkan pada peristiwa …",
    "options": [
      "Proklamasi Kemerdekaan 1945",
      "Sidang BPUPK 1945",
      "Pelantikan Presiden 1945",
      "Kongres Pemuda II (Sumpah Pemuda) 28 Oktober 1928"
    ],
    "answer": 3,
    "why": "Indonesia Raya pertama kali diperdengarkan pada Kongres Pemuda II, peristiwa Sumpah Pemuda, 28 Oktober 1928."
  },
  {
    "q": "Bahasa Indonesia berasal dari bahasa …",
    "options": [
      "Jawa",
      "Melayu",
      "Sunda",
      "Belanda"
    ],
    "answer": 1,
    "why": "Bahasa Indonesia berasal dari bahasa Melayu dan diangkat sebagai bahasa persatuan dalam Sumpah Pemuda 1928."
  },
  {
    "q": "Kedudukan bendera negara diatur dalam UUD NRI Tahun 1945 pada …",
    "options": [
      "Pasal 35",
      "Pasal 36",
      "Pasal 36A",
      "Pasal 33"
    ],
    "answer": 0,
    "why": "Pasal 35 UUD NRI Tahun 1945 menyatakan bendera Negara Indonesia ialah Sang Merah Putih."
  },
  {
    "q": "Kedudukan bahasa Indonesia sebagai bahasa negara tercantum dalam UUD NRI Tahun 1945 pada …",
    "options": [
      "Pasal 35",
      "Pasal 36A",
      "Pasal 36",
      "Pasal 32"
    ],
    "answer": 2,
    "why": "Pasal 36 UUD NRI Tahun 1945 menyatakan bahasa Negara ialah Bahasa Indonesia."
  },
  {
    "q": "Kedudukan lambang negara Garuda Pancasila diatur dalam UUD NRI Tahun 1945 pada …",
    "options": [
      "Pasal 35",
      "Pasal 36A",
      "Pasal 36",
      "Pasal 34"
    ],
    "answer": 1,
    "why": "Pasal 36A UUD NRI Tahun 1945 mengatur lambang negara ialah Garuda Pancasila dengan semboyan Bhinneka Tunggal Ika."
  },
  {
    "q": "Semboyan yang termuat pada lambang negara Garuda Pancasila adalah …",
    "options": [
      "Tut Wuri Handayani",
      "Sekali Merdeka Tetap Merdeka",
      "Merdeka atau Mati",
      "Bhinneka Tunggal Ika"
    ],
    "answer": 3,
    "why": "Garuda Pancasila memuat semboyan Bhinneka Tunggal Ika: berbeda-beda tetapi tetap satu jua."
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
    var prevBest = read('mpi-pp-p7-quiz-best', null);
    var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-pp-p7-quiz-best', String(qScore));
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
    try { saved = JSON.parse(read('mpi-pp-p7-refleksi', 'null')); } catch (e) { saved = null; }
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
      store('mpi-pp-p7-refleksi', JSON.stringify(data));
      var st = $('refStatus');
      if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
      markVisited('sub6');
    });
  }
})();
