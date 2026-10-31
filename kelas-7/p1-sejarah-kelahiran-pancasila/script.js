/* P.1 Sejarah Kelahiran Pancasila — script.js
   Vanilla JS, tanpa framework. Semua fakta dan kunci jawaban mengikuti
   draf isi P.1 dan diverifikasi manual.
   localStorage (semua berawalan mpi-pp-p1- agar tidak bertabrakan
   dengan MPI Matematika pada domain github.io yang sama):
   mpi-pp-p1-visited, mpi-pp-p1-quiz-best, mpi-pp-p1-polling,
   mpi-pp-p1-komitmen, mpi-pp-p1-refleksi. */
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
  try { visited = JSON.parse(read('mpi-pp-p1-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];

  function saveVisited() { store('mpi-pp-p1-visited', JSON.stringify(visited)); }
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
  var bestStored = read('mpi-pp-p1-quiz-best', null);
  if (bestStored !== null && bestEl) {
    bestEl.textContent = 'Skor terbaik kuis: ' + bestStored + '/10';
    bestEl.hidden = false;
  }

  /* ---------- Sub-bab 1: polling ---------- */
  var POLL_MSG = {
    '1-juni': 'Tercatat! 1 Juni 1945 adalah hari Ir. Soekarno menyampaikan pidato “Lahirnya Pancasila”, dan tanggal inilah yang diperingati sebagai Hari Lahir Pancasila. Rumusan Pancasila-nya sendiri baru ditetapkan secara resmi pada 18 Agustus 1945.',
    '22-juni': 'Tercatat! 22 Juni 1945 adalah hari dirumuskannya Piagam Jakarta oleh Panitia Sembilan, tonggak penting sebelum penetapan. Hari Lahir Pancasila diperingati setiap 1 Juni, mengikuti pidato Soekarno, sedangkan penetapannya terjadi pada 18 Agustus 1945.',
    '18-agustus': 'Tercatat! 18 Agustus 1945 adalah hari Pancasila ditetapkan secara resmi oleh PPKI bersama Undang-Undang Dasar. Adapun Hari Lahir Pancasila diperingati setiap 1 Juni, mengikuti pidato “Lahirnya Pancasila” oleh Ir. Soekarno.'
  };
  function renderPoll(pilihan, simpan) {
    document.querySelectorAll('[data-poll]').forEach(function (btn) {
      btn.classList.toggle('chosen', btn.getAttribute('data-poll') === pilihan);
    });
    if (pilihan && POLL_MSG[pilihan]) {
      showFb($('pollFb'), true, POLL_MSG[pilihan]);
      if (simpan) store('mpi-pp-p1-polling', pilihan);
    }
  }
  document.querySelectorAll('[data-poll]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      renderPoll(btn.getAttribute('data-poll'), true);
      markVisited('sub1');
    });
  });
  renderPoll(read('mpi-pp-p1-polling', null), false);

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
    boikot: { ok: false, msg: 'Sikap memboikot merugikan kepentingan bersama: kegiatan kelas bisa gagal dan hubungan antar-teman retak. Para perumus Pancasila justru mencontohkan sebaliknya: ketika rumusan golongan mereka tidak diterima sepenuhnya, mereka tidak memboikot negara yang baru lahir, melainkan tetap berjuang bersama. Coba pertimbangkan pilihan lain.' },
    terima: { ok: true, msg: 'Tepat! Inilah sikap yang diteladani dari peristiwa 18 Agustus 1945: menerima hasil musyawarah dengan lapang dada, tetap berpartisipasi, dan menyampaikan perbaikan lewat cara yang sopan. Musyawarah hanya berhasil kalau semua pihak menghormati kesepakatan bersama.' },
    diam: { ok: false, msg: 'Diam dan tidak peduli membuatmu tidak berkontribusi apa pun, padahal pendapatmu bisa disampaikan dengan baik pada kesempatan berikutnya. Para tokoh tahun 1945 tidak diam: mereka menyampaikan keberatan, berunding, dan mencari jalan keluar bersama. Coba pertimbangkan pilihan lain.' }
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

  /* ---------- Sub-bab 4: lini masa ---------- */
  var EVENTS = [
    { target: '1945-03-01', label: 'BPUPK dibentuk' },
    { target: '1945-05-28', label: 'Anggota BPUPK dilantik (62 orang)' },
    { target: '1945-05-29', label: 'Muhammad Yamin mengusulkan lima asas' },
    { target: '1945-05-31', label: 'Soepomo mengusulkan lima asas' },
    { target: '1945-06-01', label: 'Pidato Soekarno: “Lahirnya Pancasila”' },
    { target: '1945-06-22', label: 'Panitia Sembilan merumuskan Piagam Jakarta' },
    { target: '1945-08-17', label: 'Proklamasi Kemerdekaan Indonesia' },
    { target: '1945-08-18', label: 'Sidang PPKI menetapkan Pancasila dan UUD' }
  ];
  var NAMA_TANGGAL = {
    '1945-03-01': '1 Maret 1945', '1945-05-28': '28 Mei 1945',
    '1945-05-29': '29 Mei 1945', '1945-05-31': '31 Mei 1945',
    '1945-06-01': '1 Juni 1945', '1945-06-22': '22 Juni 1945',
    '1945-08-17': '17 Agustus 1945', '1945-08-18': '18 Agustus 1945'
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
    if (el) el.textContent = tlTerpasang + ' dari 8 peristiwa terpasang tepat.';
  }
  function tlPilih(card) {
    if (tlDipilih) tlDipilih.classList.remove('terpilih');
    tlDipilih = card;
    if (card) card.classList.add('terpilih');
  }
  function tlPasang(card, slot) {
    if (!card || !slot || slot.classList.contains('benar')) return;
    var tanggalSlot = slot.getAttribute('data-slot');
    if (card.getAttribute('data-target') === tanggalSlot) {
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
        showFb($('tlFb'), true, 'Sempurna! Kedelapan peristiwa sudah berada pada tanggal yang benar. Urutannya: BPUPK dibentuk, dilantik, sidang pertama (Yamin, Soepomo, Soekarno), Piagam Jakarta, proklamasi, lalu penetapan oleh PPKI.');
        markVisited('sub4');
      } else {
        showFb($('tlFb'), true, 'Tepat! “' + card.textContent + '” memang terjadi pada ' + NAMA_TANGGAL[tanggalSlot] + '.');
      }
    } else {
      slot.classList.remove('goyang');
      void slot.offsetWidth; /* picu ulang animasi */
      slot.classList.add('goyang');
      showFb($('tlFb'), false, 'Belum tepat. “' + card.textContent + '” tidak terjadi pada ' + NAMA_TANGGAL[tanggalSlot] + '. Ingat kembali urutan babak di Sub-bab 2, lalu coba tanggal lain.');
    }
  }
  function tlBangun() {
    tlTerpasang = 0;
    tlDipilih = null;
    document.querySelectorAll('.tl-slot').forEach(function (slot) {
      slot.classList.remove('terisi', 'benar', 'goyang');
      var drop = slot.querySelector('.tl-drop');
      if (drop) drop.textContent = 'Letakkan peristiwa di sini';
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

  /* ---------- Sub-bab 4: cocokkan tokoh ---------- */
  var MATCH = {
    yamin: { tanggal: '1945-05-29', tanggalTeks: '29 Mei 1945', asas: ['Peri Kebangsaan', 'Peri Kemanusiaan', 'Peri Ketuhanan', 'Peri Kerakyatan', 'Kesejahteraan Rakyat'] },
    soepomo: { tanggal: '1945-05-31', tanggalTeks: '31 Mei 1945', asas: ['Persatuan', 'Kekeluargaan', 'Keseimbangan Lahir dan Batin', 'Musyawarah', 'Keadilan Rakyat'] },
    soekarno: { tanggal: '1945-06-01', tanggalTeks: '1 Juni 1945', asas: ['Kebangsaan Indonesia', 'Internasionalisme atau Perikemanusiaan', 'Mufakat atau Demokrasi', 'Kesejahteraan Sosial', 'Ketuhanan yang Berkebudayaan'] }
  };
  var matchCheck = $('matchCheck');
  if (matchCheck) {
    matchCheck.addEventListener('click', function () {
      var semuaBenar = true;
      var adaKosong = false;
      document.querySelectorAll('.match-row').forEach(function (row) {
        var data = MATCH[row.getAttribute('data-tokoh')];
        var tSel = row.querySelector('.match-tanggal');
        var aSel = row.querySelector('.match-asas');
        var fb = row.querySelector('.match-fb');
        if (!data || !tSel || !aSel) return;
        if (!tSel.value || !aSel.value) {
          adaKosong = true;
          semuaBenar = false;
          row.classList.remove('ok', 'no');
          if (fb) fb.textContent = 'Lengkapi dulu tanggal dan asasnya.';
          return;
        }
        var tOk = tSel.value === data.tanggal;
        var aOk = data.asas.indexOf(aSel.value) !== -1;
        var ok = tOk && aOk;
        if (!ok) semuaBenar = false;
        row.classList.toggle('ok', ok);
        row.classList.toggle('no', !ok);
        if (fb) {
          fb.textContent = ok
            ? 'Tepat: berpidato pada ' + data.tanggalTeks + ', dan “' + aSel.value + '” memang salah satu usulannya.'
            : (!tOk && !aOk ? 'Tanggal dan asasnya belum tepat. Tanggal yang benar: ' + data.tanggalTeks + '.'
              : !tOk ? 'Asasnya sudah tepat, tetapi tanggalnya belum. Tanggal yang benar: ' + data.tanggalTeks + '.'
              : 'Tanggalnya sudah tepat, tetapi “' + aSel.value + '” bukan usulan tokoh ini.');
        }
      });
      if (adaKosong) {
        showFb($('matchFb'), false, 'Masih ada pasangan yang belum lengkap. Isi tanggal dan asas untuk ketiga tokoh, lalu periksa lagi.');
      } else if (semuaBenar) {
        showFb($('matchFb'), true, 'Semua pasangan tepat! Yamin pada 29 Mei 1945, Soepomo pada 31 Mei 1945, dan Soekarno pada 1 Juni 1945.');
        markVisited('sub4');
      } else {
        showFb($('matchFb'), false, 'Sebagian pasangan belum tepat. Perhatikan keterangan di bawah nama tiap tokoh, lalu perbaiki.');
      }
    });
  }

  /* ---------- Sub-bab 4: urutkan rumusan ---------- */
  var URUTAN = ['Kebangsaan Indonesia', 'Internasionalisme atau Perikemanusiaan', 'Mufakat atau Demokrasi', 'Kesejahteraan Sosial', 'Ketuhanan yang Berkebudayaan'];
  var urutCheck = $('urutCheck');
  if (urutCheck) {
    urutCheck.addEventListener('click', function () {
      var vals = ['urut1', 'urut2', 'urut3', 'urut4', 'urut5'].map(function (id) {
        var el = $(id);
        return el ? el.value : '';
      });
      var fb = $('urutFb');
      if (vals.indexOf('') !== -1) { showFb(fb, false, 'Isi kelima posisi dulu.'); return; }
      if (new Set(vals).size !== 5) { showFb(fb, false, 'Ada asas yang terulang. Tiap asas dipakai tepat satu kali.'); return; }
      var benar = 0;
      vals.forEach(function (v, i) { if (v === URUTAN[i]) benar++; });
      if (benar === 5) {
        showFb(fb, true, 'Urutanmu tepat! Versi Soekarno 1 Juni 1945: Kebangsaan Indonesia, Internasionalisme atau Perikemanusiaan, Mufakat atau Demokrasi, Kesejahteraan Sosial, Ketuhanan yang Berkebudayaan.');
        markVisited('sub4');
      } else {
        showFb(fb, false, benar + ' dari 5 posisi sudah tepat. Urutan yang benar: 1) Kebangsaan Indonesia, 2) Internasionalisme atau Perikemanusiaan, 3) Mufakat atau Demokrasi, 4) Kesejahteraan Sosial, 5) Ketuhanan yang Berkebudayaan.');
      }
    });
  }

  /* ---------- Sub-bab 5: komitmen ---------- */
  var komitmenText = $('komitmenText');
  if (komitmenText) {
    var simpanan = read('mpi-pp-p1-komitmen', '');
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
      store('mpi-pp-p1-komitmen', isi);
      if (st) st.textContent = 'Komitmen tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '. Tunjukkan kepada gurumu pada pertemuan berikutnya.';
      markVisited('sub5');
    });
  }

  /* ---------- Sub-bab 6: kuis 10 soal ---------- */
  /* Sebaran topik: soal 1-3 kronologi, 4-6 tokoh & usulan,
     7-8 Piagam Jakarta, 9-10 perumusan & penetapan.
     Kunci terverifikasi manual, distribusinya seimbang A2/B3/C2/D3:
     1) B  2) C  3) D  4) A  5) D  6) B  7) A  8) C  9) B  10) D */
  var QUIZ = [
    { q: 'BPUPK (Dokuritsu Junbi Cosakai) dibentuk pada tanggal …', options: ['22 Juni 1945', '1 Maret 1945', '17 Agustus 1945', '28 Mei 1945'], answer: 1, why: 'BPUPK dibentuk pada 1 Maret 1945 untuk mempersiapkan kemerdekaan, termasuk merumuskan dasar negara. Tanggal 28 Mei 1945 adalah hari pelantikan anggotanya.' },
    { q: 'Ketua BPUPK yang beranggotakan 62 orang adalah …', options: ['Ir. Soekarno', 'Mr. Muhammad Yamin', 'Dr. K.R.T. Radjiman Wedyodiningrat', 'Prof. Dr. Soepomo'], answer: 2, why: 'BPUPK diketuai oleh Dr. K.R.T. Radjiman Wedyodiningrat dan beranggotakan 62 orang.' },
    { q: 'Sidang pertama BPUPK yang membahas dasar negara berlangsung pada …', options: ['1–10 Maret 1945', '17–18 Agustus 1945', '22–24 Juni 1945', '29 Mei–1 Juni 1945'], answer: 3, why: 'Sidang pertama BPUPK berlangsung pada 29 Mei sampai 1 Juni 1945 dengan agenda membahas dasar negara.' },
    { q: 'Tokoh yang menyampaikan usulan lima asas pada 29 Mei 1945 adalah …', options: ['Mr. Muhammad Yamin', 'Prof. Dr. Soepomo', 'Ir. Soekarno', 'Mohammad Hatta'], answer: 0, why: 'Pada 29 Mei 1945, Mr. Muhammad Yamin mengusulkan Peri Kebangsaan, Peri Kemanusiaan, Peri Ketuhanan, Peri Kerakyatan, dan Kesejahteraan Rakyat.' },
    { q: 'Pidato “Lahirnya Pancasila” disampaikan Ir. Soekarno pada tanggal …', options: ['29 Mei 1945', '31 Mei 1945', '22 Juni 1945', '1 Juni 1945'], answer: 3, why: 'Ir. Soekarno menyampaikan pidato “Lahirnya Pancasila” pada 1 Juni 1945, dan tanggal inilah yang diperingati sebagai Hari Lahir Pancasila.' },
    { q: 'Salah satu asas yang diusulkan Prof. Dr. Soepomo pada 31 Mei 1945 adalah …', options: ['Peri Kebangsaan', 'Musyawarah', 'Kebangsaan Indonesia', 'Kesejahteraan Sosial'], answer: 1, why: 'Lima asas Soepomo adalah Persatuan, Kekeluargaan, Keseimbangan Lahir dan Batin, Musyawarah, dan Keadilan Rakyat. Peri Kebangsaan adalah usulan Yamin, sedangkan Kebangsaan Indonesia dan Kesejahteraan Sosial adalah usulan Soekarno.' },
    { q: 'Piagam Jakarta dirumuskan oleh Panitia Sembilan pada tanggal …', options: ['22 Juni 1945', '1 Juni 1945', '17 Agustus 1945', '28 Mei 1945'], answer: 0, why: 'Panitia Sembilan menghasilkan Piagam Jakarta pada 22 Juni 1945.' },
    { q: 'Rumusan sila pertama dalam Piagam Jakarta berbunyi …', options: ['“Ketuhanan Yang Maha Esa”', '“Ketuhanan yang Berkebudayaan”', '“Ketuhanan, dengan kewajiban menjalankan syariat Islam bagi pemeluk-pemeluknya”', '“Peri Ketuhanan”'], answer: 2, why: 'Dalam Piagam Jakarta, sila pertama berbunyi “Ketuhanan, dengan kewajiban menjalankan syariat Islam bagi pemeluk-pemeluknya”. Tujuh kata di dalamnya diubah pada 18 Agustus 1945.' },
    { q: 'Pada sidang PPKI 18 Agustus 1945, tujuh kata dalam Piagam Jakarta diubah menjadi …', options: ['“Peri Ketuhanan”', '“Ketuhanan Yang Maha Esa”', '“Ketuhanan yang Berkebudayaan”', '“Kemanusiaan yang adil dan beradab”'], answer: 1, why: 'Tujuh kata diubah menjadi “Ketuhanan Yang Maha Esa” agar rumusan dasar negara dapat diterima seluruh golongan bangsa.' },
    { q: 'Selain menetapkan UUD dan Pancasila, sidang PPKI pada 18 Agustus 1945 juga …', options: ['membentuk BPUPK', 'merumuskan Piagam Jakarta', 'mendengarkan pidato “Lahirnya Pancasila”', 'mengangkat Soekarno–Hatta sebagai Presiden dan Wakil Presiden'], answer: 3, why: 'Sidang PPKI 18 Agustus 1945 menetapkan Undang-Undang Dasar dan Pancasila, serta mengangkat Ir. Soekarno dan Mohammad Hatta sebagai Presiden dan Wakil Presiden pertama.' }
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
      msg.textContent = qScore === 10 ? 'Sempurna! Kamu menguasai kronologi kelahiran Pancasila.'
        : qScore >= 8 ? 'Hebat! Tinggal sedikit lagi menuju sempurna.'
        : qScore >= 6 ? 'Bagus! Ulangi bagian yang masih salah, lalu coba lagi.'
        : 'Terus berlatih! Buka lagi kronologi lima babak di Sub-bab 2 dan permainan di Sub-bab 4, lalu ulangi kuisnya.';
    }
    var prevBest = read('mpi-pp-p1-quiz-best', null);
    var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-pp-p1-quiz-best', String(qScore));
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
    try { saved = JSON.parse(read('mpi-pp-p1-refleksi', 'null')); } catch (e) { saved = null; }
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
      store('mpi-pp-p1-refleksi', JSON.stringify(data));
      var st = $('refStatus');
      if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
      markVisited('sub6');
    });
  }
})();
