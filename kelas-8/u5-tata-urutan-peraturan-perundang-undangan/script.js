/* U.5 Tata Urutan Peraturan Perundang-undangan — script.js
   Vanilla JS, tanpa framework. Semua fakta dan kunci jawaban mengikuti
   rincian ATP dan diverifikasi manual.
   localStorage (semua berawalan mpi-pp-u5- agar tidak bertabrakan
   dengan modul lain dan MPI Matematika pada domain github.io yang sama):
   mpi-pp-u5-visited, mpi-pp-u5-quiz-best, mpi-pp-u5-polling,
   mpi-pp-u5-komitmen, mpi-pp-u5-refleksi. */
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
  try { visited = JSON.parse(read('mpi-pp-u5-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];

  function saveVisited() { store('mpi-pp-u5-visited', JSON.stringify(visited)); }
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
  var bestStored = read('mpi-pp-u5-quiz-best', null);
  if (bestStored !== null && bestEl) {
    bestEl.textContent = 'Skor terbaik kuis: ' + bestStored + '/10';
    bestEl.hidden = false;
  }

  /* ---------- Sub-bab 1: polling ---------- */
  var POLL_MSG = {
  "lebih-tinggi": "Tercatat! Tepat: aturan yang lebih rendah harus menyesuaikan aturan yang lebih tinggi. Dalam hukum ini disebut asas lex superiori derogat legi inferiori, dan berlaku dari aturan kelas sampai undang-undang negara.",
  "lebih-baru": "Tercatat! Pendapat ini sebagian benar untuk peraturan yang sederajat, tetapi bukan pegangan utama antarjenjang: aturan kelas yang baru tetap tidak boleh bertentangan dengan tata tertib sekolah yang lebih tinggi kedudukannya. Asas lengkapnya dibahas di Babak 1.",
  "disukai": "Tercatat! Kesukaan mayoritas penting dalam musyawarah, tetapi tidak dapat mengalahkan aturan yang lebih tinggi. Aturan kelas hasil musyawarah pun tetap harus selaras dengan tata tertib sekolah — sama seperti peraturan daerah harus selaras dengan undang-undang dan UUD."
};
  function renderPoll(pilihan, simpan) {
    document.querySelectorAll('[data-poll]').forEach(function (btn) {
      btn.classList.toggle('chosen', btn.getAttribute('data-poll') === pilihan);
    });
    if (pilihan && POLL_MSG[pilihan]) {
      showFb($('pollFb'), true, POLL_MSG[pilihan]);
      if (simpan) store('mpi-pp-u5-polling', pilihan);
    }
  }
  document.querySelectorAll('[data-poll]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      renderPoll(btn.getAttribute('data-poll'), true);
      markVisited('sub1');
    });
  });
  renderPoll(read('mpi-pp-u5-polling', null), false);

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
  "kelas": {
    "ok": false,
    "msg": "Musyawarah kelas sah untuk hal-hal yang menjadi kewenangan kelas, tetapi hasilnya tidak boleh bertentangan dengan aturan yang lebih tinggi. Ini contoh langsung asas lex superiori: aturan kelas (lebih rendah) harus menyesuaikan tata tertib sekolah (lebih tinggi). Coba pertimbangkan pilihan lain."
  },
  "sekolah": {
    "ok": true,
    "msg": "Tepat! Kamu menerapkan tata urutan peraturan dalam kehidupan nyata: pegang aturan yang lebih tinggi, dan perbaiki aturan yang lebih rendah lewat musyawarah — persis seperti peraturan perundang-undangan yang bertentangan harus diubah atau dicabut oleh peraturan sederajat atau yang lebih tinggi."
  },
  "pilih-sendiri": {
    "ok": false,
    "msg": "Memilih aturan sesuka hati membuat ketertiban tidak pasti dan dapat merugikan orang lain. Tata urutan ada justru agar semua orang memegang pegangan yang sama: yang lebih tinggi didahulukan. Coba pertimbangkan pilihan lain."
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

  /* ---------- Sub-bab 4: cocokkan pasangan ---------- */
  var MATCH = {
  "uu": {
    "answer": "DPR bersama Presiden",
    "okMsg": "Tepat: undang-undang dibentuk oleh DPR bersama Presiden.",
    "noMsg": "Belum tepat: undang-undang adalah produk DPR bersama Presiden."
  },
  "pp": {
    "answer": "Presiden",
    "okMsg": "Tepat: Peraturan Pemerintah ditetapkan oleh Presiden untuk menjalankan undang-undang.",
    "noMsg": "Belum tepat: PP ditetapkan oleh Presiden."
  },
  "perda": {
    "answer": "DPRD bersama kepala daerah",
    "okMsg": "Tepat: Perda dibentuk oleh DPRD bersama kepala daerah.",
    "noMsg": "Belum tepat: Perda dibentuk oleh DPRD bersama kepala daerah."
  }
};
  var SUKSES_MATCH = "Semua pasangan tepat! UU oleh DPR bersama Presiden, PP oleh Presiden, dan Perda oleh DPRD bersama kepala daerah.";
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
        var ok = sel.value === data.answer;
        if (!ok) semuaBenar = false;
        row.classList.toggle('ok', ok);
        row.classList.toggle('no', !ok);
        if (fb) fb.textContent = ok ? data.okMsg : data.noMsg;
      });
      if (adaKosong) {
        showFb($('matchFb'), false, 'Masih ada pasangan yang belum lengkap. Isi semua pasangan, lalu periksa lagi.');
      } else if (semuaBenar) {
        showFb($('matchFb'), true, SUKSES_MATCH);
        markVisited('sub4');
      } else {
        showFb($('matchFb'), false, 'Sebagian pasangan belum tepat. Perhatikan keterangan di bawah tiap baris, lalu perbaiki.');
      }
    });
  }

  /* ---------- Sub-bab 4: urutkan ---------- */
  var URUTAN = ["UUD NRI 1945", "Ketetapan MPR", "Undang-Undang/Perppu", "Peraturan Pemerintah", "Peraturan Presiden", "Peraturan Daerah Provinsi", "Peraturan Daerah Kabupaten/Kota"];
  var SUKSES_URUT = "Urutanmu tepat! Hierarki Pasal 7 ayat (1): UUD NRI 1945 → Ketetapan MPR → Undang-Undang/Perppu → Peraturan Pemerintah → Peraturan Presiden → Peraturan Daerah Provinsi → Peraturan Daerah Kabupaten/Kota.";
  var urutCheck = $('urutCheck');
  if (urutCheck) {
    urutCheck.addEventListener('click', function () {
      var ids = URUTAN.map(function (_, i) { return 'urut' + (i + 1); });
      var vals = ids.map(function (id) { var el = $(id); return el ? el.value : ''; });
      var fb = $('urutFb');
      if (vals.indexOf('') !== -1) { showFb(fb, false, 'Isi semua posisi dulu.'); return; }
      if (new Set(vals).size !== URUTAN.length) { showFb(fb, false, 'Ada pilihan yang terulang. Tiap pilihan dipakai tepat satu kali.'); return; }
      var benar = 0;
      vals.forEach(function (v, i) { if (v === URUTAN[i]) benar++; });
      if (benar === URUTAN.length) {
        showFb(fb, true, SUKSES_URUT);
        markVisited('sub4');
      } else {
        showFb(fb, false, benar + ' dari ' + URUTAN.length + ' posisi sudah tepat. Urutan yang benar dari tertinggi: ' + URUTAN.join(' → ') + '.');
      }
    });
  }

  /* ---------- Sub-bab 5: komitmen ---------- */
  var komitmenText = $('komitmenText');
  if (komitmenText) {
    var simpanan = read('mpi-pp-u5-komitmen', '');
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
      store('mpi-pp-u5-komitmen', isi);
      if (st) st.textContent = 'Komitmen tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '. Tunjukkan kepada gurumu pada pertemuan berikutnya.';
      markVisited('sub5');
    });
  }

  /* ---------- Sub-bab 6: kuis 10 soal ---------- */
  /* Kunci terverifikasi manual, distribusinya seimbang A2/B3/C2/D3:
     1) A 2) B 3) D 4) C 5) D 6) A 7) B 8) D 9) C 10) B
     Sebaran topik: UU pembentuk tata urutan, tujuh tingkat hierarki Pasal 7 ayat (1), asas lex superiori, dan lembaga pembentuk peraturan. */
  var QUIZ = [
  {
    "q": "Tata urutan peraturan perundang-undangan di Indonesia saat ini diatur dalam …",
    "options": [
      "UU No. 12 Tahun 2011 sebagaimana diubah dengan UU No. 13 Tahun 2022",
      "UU No. 10 Tahun 2004",
      "UU No. 23 Tahun 2014",
      "UU No. 20 Tahun 2003"
    ],
    "answer": 0,
    "why": "Pembentukan peraturan perundang-undangan diatur dalam UU No. 12 Tahun 2011 yang telah diubah dengan UU No. 13 Tahun 2022. UU No. 10 Tahun 2004 adalah aturan pendahulunya yang sudah digantikan."
  },
  {
    "q": "Jenis peraturan dengan kedudukan tertinggi dalam hierarki Pasal 7 ayat (1) adalah …",
    "options": [
      "Undang-Undang",
      "UUD NRI 1945",
      "Ketetapan MPR",
      "Peraturan Pemerintah"
    ],
    "answer": 1,
    "why": "UUD NRI 1945 menempati tingkat tertinggi hierarki peraturan perundang-undangan Indonesia."
  },
  {
    "q": "Urutan tingkat kedua dalam hierarki, tepat di bawah UUD NRI 1945, adalah …",
    "options": [
      "Undang-Undang/Perppu",
      "Peraturan Pemerintah",
      "Peraturan Presiden",
      "Ketetapan MPR"
    ],
    "answer": 3,
    "why": "Menurut Pasal 7 ayat (1): UUD NRI 1945, lalu Ketetapan MPR, kemudian UU/Perppu, PP, Perpres, Perda Provinsi, dan Perda Kabupaten/Kota."
  },
  {
    "q": "Kedudukan Undang-Undang/Perppu dalam hierarki adalah …",
    "options": [
      "di atas Ketetapan MPR",
      "di bawah Peraturan Pemerintah",
      "di bawah Ketetapan MPR dan di atas Peraturan Pemerintah",
      "sejajar dengan UUD NRI 1945"
    ],
    "answer": 2,
    "why": "UU/Perppu berada pada tingkat ketiga: di bawah Ketetapan MPR dan di atas Peraturan Pemerintah."
  },
  {
    "q": "Peraturan Pemerintah (PP) berkedudukan di bawah …",
    "options": [
      "Peraturan Presiden",
      "Peraturan Daerah Provinsi",
      "Peraturan Daerah Kabupaten/Kota",
      "Undang-Undang/Perppu"
    ],
    "answer": 3,
    "why": "Urutan dari atas: UU/Perppu, lalu PP, lalu Perpres, lalu Perda. Jadi PP berada tepat di bawah UU/Perppu."
  },
  {
    "q": "Dua tingkat terbawah dalam hierarki peraturan perundang-undangan adalah …",
    "options": [
      "Peraturan Daerah Provinsi, lalu Peraturan Daerah Kabupaten/Kota",
      "Peraturan Presiden, lalu Peraturan Pemerintah",
      "Ketetapan MPR, lalu Undang-Undang",
      "Peraturan Pemerintah, lalu Peraturan Presiden"
    ],
    "answer": 0,
    "why": "Dua tingkat terbawah adalah Perda Provinsi (keenam) dan Perda Kabupaten/Kota (ketujuh/terendah)."
  },
  {
    "q": "Asas lex superiori derogat legi inferiori berarti …",
    "options": [
      "peraturan yang lebih rendah mengalahkan yang lebih tinggi",
      "peraturan yang lebih rendah tidak boleh bertentangan dengan peraturan yang lebih tinggi",
      "semua peraturan kedudukannya sejajar",
      "peraturan yang paling baru selalu menang atas yang lama"
    ],
    "answer": 1,
    "why": "Lex superiori derogat legi inferiori: hukum yang lebih tinggi mengesampingkan hukum yang lebih rendah, sehingga peraturan rendah tidak boleh bertentangan dengan yang lebih tinggi."
  },
  {
    "q": "Sebuah peraturan hanya dapat diubah atau dicabut oleh …",
    "options": [
      "peraturan apa pun yang lebih rendah darinya",
      "pengumuman dari warga masyarakat",
      "aturan tidak tertulis di lingkungan",
      "peraturan yang sederajat atau lebih tinggi"
    ],
    "answer": 3,
    "why": "Asas tata urutan: perubahan dan pencabutan peraturan hanya dapat dilakukan oleh peraturan yang sederajat atau lebih tinggi kedudukannya."
  },
  {
    "q": "Undang-Undang dibentuk oleh …",
    "options": [
      "Presiden sendirian",
      "MPR",
      "DPR bersama Presiden",
      "DPRD bersama kepala daerah"
    ],
    "answer": 2,
    "why": "Undang-undang dibentuk oleh DPR bersama Presiden. MPR mengubah dan menetapkan UUD, sedangkan DPRD bersama kepala daerah membentuk peraturan daerah."
  },
  {
    "q": "Peraturan Daerah (Perda) dibentuk oleh …",
    "options": [
      "DPR bersama Presiden",
      "DPRD bersama kepala daerah",
      "Presiden sendirian",
      "Mahkamah Konstitusi"
    ],
    "answer": 1,
    "why": "Perda dibentuk oleh DPRD bersama kepala daerah: DPRD provinsi bersama gubernur, dan DPRD kabupaten/kota bersama bupati/wali kota."
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
    var prevBest = read('mpi-pp-u5-quiz-best', null);
    var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-pp-u5-quiz-best', String(qScore));
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
    try { saved = JSON.parse(read('mpi-pp-u5-refleksi', 'null')); } catch (e) { saved = null; }
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
      store('mpi-pp-u5-refleksi', JSON.stringify(data));
      var st = $('refStatus');
      if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
      markVisited('sub6');
    });
  }
})();
