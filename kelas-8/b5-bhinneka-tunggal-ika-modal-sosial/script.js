/* B.5 Bhinneka Tunggal Ika sebagai Modal Sosial — script.js
   Vanilla JS, tanpa framework. Meniru mesin prototipe P.1.
   localStorage (semua berawalan mpi-pp-b5- agar tidak bertabrakan
   dengan MPI Matematika pada domain github.io yang sama):
   mpi-pp-b5-visited, mpi-pp-b5-quiz-best, mpi-pp-b5-polling,
   mpi-pp-b5-komitmen, mpi-pp-b5-refleksi. */
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
  try { visited = JSON.parse(read('mpi-pp-b5-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];

  function saveVisited() { store('mpi-pp-b5-visited', JSON.stringify(visited)); }
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
  var bestStored = read('mpi-pp-b5-quiz-best', null);
  if (bestStored !== null && bestEl) {
    bestEl.textContent = 'Skor terbaik kuis: ' + bestStored + '/10';
    bestEl.hidden = false;
  }

  /* ---------- Sub-bab 1: polling ---------- */
  var POLL_MSG = {
  "percaya": "Tercatat! Kepercayaan (trust) adalah unsur pertama modal sosial: tanpa saling percaya, kerja sama sulit dimulai. Di modul ini kamu akan mengenal dua unsur lainnya.",
  "jaringan": "Tercatat! Jaringan hubungan adalah unsur modal sosial: hubungan baik antar-orang dan antar-kelompok membuat bantuan mudah mengalir. Di modul ini kamu akan mengenal unsur lainnya.",
  "norma": "Tercatat! Norma dan nilai bersama adalah unsur modal sosial: aturan yang disepakati dan ditaati bersama membuat kerja sama berjalan tertib. Di modul ini kamu akan mengenal unsur lainnya."
};
  function renderPoll(pilihan, simpan) {
    document.querySelectorAll('[data-poll]').forEach(function (btn) {
      btn.classList.toggle('chosen', btn.getAttribute('data-poll') === pilihan);
    });
    if (pilihan && POLL_MSG[pilihan]) {
      showFb($('pollFb'), true, POLL_MSG[pilihan]);
      if (simpan) store('mpi-pp-b5-polling', pilihan);
    }
  }
  document.querySelectorAll('[data-poll]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      renderPoll(btn.getAttribute('data-poll'), true);
      markVisited('sub1');
    });
  });
  renderPoll(read('mpi-pp-b5-polling', null), false);

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
  "pihak": {
    "ok": false,
    "msg": "Membela kelompok sendiri tanpa mendengar pihak lain adalah sikap memihak — lawan dari solusi yang berkeadilan. Setiap pihak perlu didengar dulu agar akar masalahnya jelas. Coba pertimbangkan pilihan lain."
  },
  "musyawarah": {
    "ok": true,
    "msg": "Tepat! Inilah langkah solusi yang berkeadilan: mendengarkan semua pihak, bermusyawarah, dan menyepakati solusi yang adil untuk semua — modal sosial kelasmu bekerja."
  },
  "biarkan": {
    "ok": false,
    "msg": "Membiarkan perselisihan tanpa penyelesaian membuat kepercayaan antar-kelompok rusak. Modal sosial justru dipakai untuk menyelesaikan masalah bersama lewat musyawarah. Coba pertimbangkan pilihan lain."
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

  /* ---------- Sub-bab 4: urutkan langkah ---------- */
  var URUTAN = ["Mendengarkan semua pihak", "Mencari akar masalah", "Bermusyawarah mencari jalan keluar", "Menyepakati solusi yang adil untuk semua pihak", "Melaksanakan dan menjaga kesepakatan"];
  var urutCheck = $('urutCheck');
  if (urutCheck) {
    urutCheck.addEventListener('click', function () {
      var vals = ['urut1', 'urut2', 'urut3', 'urut4', 'urut5'].map(function (id) {
        var el = $(id);
        return el ? el.value : '';
      });
      var fb = $('urutFb');
      if (vals.indexOf('') !== -1) { showFb(fb, false, 'Isi kelima posisi dulu.'); return; }
      if (new Set(vals).size !== 5) { showFb(fb, false, 'Ada langkah yang terulang. Tiap langkah dipakai tepat satu kali.'); return; }
      var benar = 0;
      vals.forEach(function (v, i) { if (v === URUTAN[i]) benar++; });
      if (benar === 5) {
        showFb(fb, true, "Urutanmu tepat! Solusi yang berkeadilan dimulai dengan mendengarkan semua pihak, mencari akar masalah, bermusyawarah, menyepakati solusi yang adil, lalu melaksanakan dan menjaga kesepakatan.");
        markVisited('sub4');
      } else {
        showFb(fb, false, benar + ' dari 5 posisi sudah tepat. Urutan yang benar: ' + URUTAN.join(' → ') + '.');
      }
    });
  }
  /* ---------- Sub-bab 4: cocokkan (match) ---------- */
  var MATCH = {"trust": "Teman menitipkan tugas kelompok dan yakin dikerjakan dengan jujur", "jaringan": "Hubungan baik antarwarga dan antarorganisasi yang saling membantu", "norma": "Aturan bersama yang disepakati dan ditaati semua warga", "gotong": "Warga bekerja bersama membersihkan lingkungan secara sukarela"};
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
      else if (semuaBenar) { showFb($('matchFb'), true, "Semua pasangan tepat! Kepercayaan, jaringan hubungan, dan norma bersama adalah unsur modal sosial, dan gotong royong adalah wujud khasnya di Indonesia."); markVisited('sub4'); }
      else showFb($('matchFb'), false, 'Sebagian pasangan belum tepat. Perhatikan keterangan di bawah tiap nama, lalu perbaiki.');
    });
  }

  /* ---------- Sub-bab 5: komitmen ---------- */
  var komitmenText = $('komitmenText');
  if (komitmenText) {
    var simpanan = read('mpi-pp-b5-komitmen', '');
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
      store('mpi-pp-b5-komitmen', isi);
      if (st) st.textContent = 'Komitmen tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '. Tunjukkan kepada gurumu pada pertemuan berikutnya.';
      markVisited('sub5');
    });
  }

  /* ---------- Sub-bab 6: kuis 10 soal ---------- */
  /* Kunci terverifikasi manual, distribusinya seimbang A2/B3/C2/D3:
     1) B  2) C  3) D  4) A  5) D  6) B  7) A  8) C  9) B  10) D */
  var QUIZ = [
    {
        "q": "Modal sosial adalah …",
        "options": [
            "Kekayaan berupa uang yang disimpan masyarakat",
            "Kekayaan berupa kepercayaan, jaringan hubungan, dan norma bersama yang memungkinkan masyarakat bekerja sama",
            "Bangunan fasilitas umum milik warga",
            "Jumlah penduduk dalam suatu masyarakat"
        ],
        "answer": 1,
        "why": "Modal sosial adalah kekayaan berupa kepercayaan (trust), jaringan hubungan, dan norma atau nilai bersama yang memungkinkan masyarakat bekerja sama mencapai tujuan bersama."
    },
    {
        "q": "Berikut ini yang merupakan unsur modal sosial adalah …",
        "options": [
            "Uang kas bersama",
            "Gedung pertemuan",
            "Kepercayaan (trust) antarwarga",
            "Kendaraan operasional"
        ],
        "answer": 2,
        "why": "Unsur modal sosial adalah kepercayaan (trust), jaringan hubungan, dan norma atau nilai bersama — bukan benda atau uang."
    },
    {
        "q": "Gotong royong dalam masyarakat Indonesia merupakan …",
        "options": [
            "Kewajiban yang dipaksakan pemerintah",
            "Kegiatan yang hanya dilakukan di desa",
            "Tradisi yang sudah tidak relevan",
            "Wujud modal sosial khas Indonesia"
        ],
        "answer": 3,
        "why": "Gotong royong adalah wujud modal sosial khas Indonesia: warga bekerja sama sukarela atas dasar kepercayaan, hubungan baik, dan norma bersama."
    },
    {
        "q": "Apabila keberagaman dikelola dengan baik, maka keberagaman akan …",
        "options": [
            "Menjadi kekuatan dan modal bagi masyarakat",
            "Menjadi sumber konflik",
            "Hilang dengan sendirinya",
            "Menimbulkan prasangka antarkelompok"
        ],
        "answer": 0,
        "why": "Keberagaman yang dikelola baik menjadi kekuatan (modal); yang dikelola buruk menjadi sumber konflik."
    },
    {
        "q": "Langkah pertama dalam memberikan solusi yang berkeadilan atas konflik antar-kelompok adalah …",
        "options": [
            "Langsung memutuskan solusi sendiri",
            "Meminta satu kelompok mengalah",
            "Menjatuhkan sanksi kepada semua pihak",
            "Mendengarkan semua pihak yang terlibat"
        ],
        "answer": 3,
        "why": "Langkah pertama solusi yang berkeadilan adalah mendengarkan semua pihak, dilanjutkan mencari akar masalah, musyawarah, menyepakati solusi yang adil, lalu melaksanakannya."
    },
    {
        "q": "Solusi yang berkeadilan antara lain dicapai melalui …",
        "options": [
            "Keputusan sepihak kelompok terkuat",
            "Musyawarah dan mediasi yang tidak memihak",
            "Membiarkan konflik berjalan sendiri",
            "Pemungutan suara yang hanya diikuti satu kelompok"
        ],
        "answer": 1,
        "why": "Solusi berkeadilan dicapai melalui musyawarah atau mediasi, menghormati hak semua pihak, dan tidak memihak."
    },
    {
        "q": "Apabila keberagaman dikelola dengan buruk, keberagaman dapat menjadi …",
        "options": [
            "Sumber konflik dalam masyarakat",
            "Modal untuk bekerja sama",
            "Kekuatan bangsa",
            "Alasan untuk bermusyawarah"
        ],
        "answer": 0,
        "why": "Keberagaman yang dikelola buruk dapat menjadi sumber konflik; yang dikelola baik menjadi modal sosial."
    },
    {
        "q": "Norma bersama dalam modal sosial berarti …",
        "options": [
            "Aturan yang dibuat satu orang untuk orang lain",
            "Hukuman bagi warga yang berbeda pendapat",
            "Nilai dan aturan yang disepakati serta ditaati bersama",
            "Kebiasaan satu kelompok yang dipaksakan"
        ],
        "answer": 2,
        "why": "Norma bersama adalah nilai dan aturan yang disepakati dan ditaati bersama oleh masyarakat."
    },
    {
        "q": "Sikap berikut yang bertentangan dengan solusi yang berkeadilan adalah …",
        "options": [
            "Mendengarkan semua pihak",
            "Memihak salah satu pihak tanpa mendengar pihak lainnya",
            "Bermusyawarah mencari jalan keluar",
            "Menghormati hak semua pihak"
        ],
        "answer": 1,
        "why": "Memihak tanpa mendengar pihak lain bertentangan dengan solusi berkeadilan, yang menuntut musyawarah, penghormatan hak semua pihak, dan sikap tidak memihak."
    },
    {
        "q": "Tujuan utama modal sosial dalam masyarakat adalah …",
        "options": [
            "Membuat satu kelompok lebih berkuasa",
            "Menggantikan peraturan perundang-undangan",
            "Menghilangkan semua perbedaan",
            "Memungkinkan masyarakat bekerja sama mencapai tujuan bersama"
        ],
        "answer": 3,
        "why": "Modal sosial memungkinkan masyarakat bekerja sama mencapai tujuan bersama berkat kepercayaan, jaringan hubungan, dan norma bersama."
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
    var prevBest = read('mpi-pp-b5-quiz-best', null);
    var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-pp-b5-quiz-best', String(qScore));
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
    try { saved = JSON.parse(read('mpi-pp-b5-refleksi', 'null')); } catch (e) { saved = null; }
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
      store('mpi-pp-b5-refleksi', JSON.stringify(data));
      var st = $('refStatus');
      if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
      markVisited('sub6');
    });
  }
})();
