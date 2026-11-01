/* U.3 Fungsi dan Kedudukan UUD NRI 1945 — script.js
   Vanilla JS, tanpa framework. Semua fakta dan kunci jawaban mengikuti
   rincian ATP dan diverifikasi manual.
   localStorage (semua berawalan mpi-pp-u3- agar tidak bertabrakan
   dengan modul lain dan MPI Matematika pada domain github.io yang sama):
   mpi-pp-u3-visited, mpi-pp-u3-quiz-best, mpi-pp-u3-polling,
   mpi-pp-u3-komitmen, mpi-pp-u3-refleksi. */
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
  try { visited = JSON.parse(read('mpi-pp-u3-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];

  function saveVisited() { store('mpi-pp-u3-visited', JSON.stringify(visited)); }
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
  var bestStored = read('mpi-pp-u3-quiz-best', null);
  if (bestStored !== null && bestEl) {
    bestEl.textContent = 'Skor terbaik kuis: ' + bestStored + '/10';
    bestEl.hidden = false;
  }

  /* ---------- Sub-bab 1: polling ---------- */
  var POLL_MSG = {
  "tetap-berlaku": "Tercatat! Pendapat ini akan kita uji: peraturan memang dibuat lembaga resmi, tetapi kedudukan UUD lebih tinggi — peraturan yang bertentangan dengan UUD dapat diuji dan dibatalkan. Itulah fungsi UUD sebagai alat kontrol, dibahas di Babak 3.",
  "diuji-dibatalkan": "Tercatat! Tepat arahnya: undang-undang yang bertentangan dengan UUD dapat diuji oleh Mahkamah Konstitusi, dan peraturan di bawah undang-undang diuji oleh Mahkamah Agung. Inilah wujud kedudukan UUD sebagai sumber hukum tertinggi.",
  "dibiarkan": "Tercatat! Membiarkan peraturan yang bertentangan dengan UUD justru menimbulkan ketidakpastian hukum: warga tidak tahu aturan mana yang harus ditaati. Karena itu UUD berfungsi sebagai alat kontrol agar semua norma hukum selaras."
};
  function renderPoll(pilihan, simpan) {
    document.querySelectorAll('[data-poll]').forEach(function (btn) {
      btn.classList.toggle('chosen', btn.getAttribute('data-poll') === pilihan);
    });
    if (pilihan && POLL_MSG[pilihan]) {
      showFb($('pollFb'), true, POLL_MSG[pilihan]);
      if (simpan) store('mpi-pp-u3-polling', pilihan);
    }
  }
  document.querySelectorAll('[data-poll]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      renderPoll(btn.getAttribute('data-poll'), true);
      markVisited('sub1');
    });
  });
  renderPoll(read('mpi-pp-u3-polling', null), false);

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
  "langgar": {
    "ok": false,
    "msg": "Satu pelanggaran tidak membenarkan pelanggaran lain. Pola berpikir berjenjang justru sebaliknya: aturan yang lebih rendah (OSIS) harus menyesuaikan aturan yang lebih tinggi (tata tertib sekolah) — sama seperti peraturan di bawah UUD tidak boleh bertentangan dengan UUD. Coba pertimbangkan pilihan lain."
  },
  "sampaikan": {
    "ok": true,
    "msg": "Tepat! Kamu menempatkan aturan yang lebih tinggi sebagai pegangan, dan menempuh saluran resmi untuk mengoreksi aturan yang bertentangan — persis cara kerja fungsi kontrol terhadap peraturan perundang-undangan di negara kita."
  },
  "diam": {
    "ok": false,
    "msg": "Diam membuat aturan yang bertentangan terus berjalan. Warga negara — dan warga sekolah — boleh dan perlu menyampaikan keberatan lewat saluran yang benar agar aturan yang keliru diperbaiki. Coba pertimbangkan pilihan lain."
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
  "kontrol": {
    "answer": "Mahkamah Konstitusi membatalkan ketentuan undang-undang yang bertentangan dengan UUD NRI 1945",
    "okMsg": "Tepat: pengujian dan pembatalan ketentuan undang-undang oleh MK adalah wujud fungsi kontrol.",
    "noMsg": "Belum tepat: alat kontrol berkaitan dengan menilai kesesuaian aturan yang lebih rendah terhadap UUD."
  },
  "penentu": {
    "answer": "UUD membatasi kewenangan dan masa jabatan penyelenggara negara agar kekuasaan tidak sewenang-wenang",
    "okMsg": "Tepat: membatasi kekuasaan penyelenggara negara adalah fungsi penentu.",
    "noMsg": "Belum tepat: penentu berkaitan dengan pembatasan kekuasaan penyelenggara negara."
  },
  "pengatur": {
    "answer": "UUD membagi kekuasaan negara kepada DPR, Presiden, Mahkamah Agung, Mahkamah Konstitusi, dan lembaga negara lainnya",
    "okMsg": "Tepat: pembagian kekuasaan antarlembaga negara adalah fungsi pengatur.",
    "noMsg": "Belum tepat: pengatur berkaitan dengan pembagian kekuasaan di antara lembaga-lembaga negara."
  }
};
  var SUKSES_MATCH = "Semua pasangan tepat! Kontrol = pengujian oleh MK, penentu = pembatasan kekuasaan, pengatur = pembagian kekuasaan antarlembaga negara.";
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

  /* ---------- Sub-bab 4: sortir kartu ke dua kelompok ---------- */
  var SORT_CARDS = [
  {
    "target": "benar",
    "label": "UUD NRI 1945 adalah hukum dasar tertulis"
  },
  {
    "target": "benar",
    "label": "Peraturan di bawah UUD tidak boleh bertentangan dengan UUD"
  },
  {
    "target": "benar",
    "label": "MPR berwenang mengubah dan menetapkan UUD"
  },
  {
    "target": "benar",
    "label": "Pembukaan UUD tidak diubah dalam amandemen 1999–2002"
  },
  {
    "target": "salah",
    "label": "Peraturan daerah boleh bertentangan dengan UUD asal disetujui warga"
  },
  {
    "target": "salah",
    "label": "UUD dapat diubah oleh DPR sendirian sewaktu-waktu"
  },
  {
    "target": "salah",
    "label": "Kedudukan UUD sama dengan peraturan menteri"
  },
  {
    "target": "salah",
    "label": "Pembukaan UUD diubah pada amandemen 1999–2002"
  }
];
  var SORT_LABEL = {"benar": "Pernyataan Benar", "salah": "Pernyataan Salah"};
  var SUKSES_SORT = "Sempurna! Kedelapan pernyataan terkelompok dengan benar. Pegangannya: UUD adalah hukum dasar tertulis dan sumber hukum tertinggi, yang mengubahnya adalah MPR, dan Pembukaannya tidak pernah diubah.";
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
    var simpanan = read('mpi-pp-u3-komitmen', '');
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
      store('mpi-pp-u3-komitmen', isi);
      if (st) st.textContent = 'Komitmen tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '. Tunjukkan kepada gurumu pada pertemuan berikutnya.';
      markVisited('sub5');
    });
  }

  /* ---------- Sub-bab 6: kuis 10 soal ---------- */
  /* Kunci terverifikasi manual, distribusinya seimbang A2/B3/C2/D3:
     1) D 2) B 3) A 4) C 5) B 6) D 7) C 8) A 9) D 10) B
     Sebaran topik: kedudukan UUD, fungsi kontrol/penentu/pengatur, sifat UUD, kewenangan mengubah UUD. */
  var QUIZ = [
  {
    "q": "Kedudukan UUD NRI 1945 dalam sistem hukum Indonesia adalah …",
    "options": [
      "sama dengan peraturan pemerintah",
      "berada di bawah undang-undang",
      "peraturan pelaksana bagi undang-undang",
      "hukum dasar tertulis dan sumber hukum tertinggi"
    ],
    "answer": 3,
    "why": "UUD NRI 1945 adalah hukum dasar tertulis dan sumber hukum tertinggi; semua peraturan di bawahnya bersumber darinya dan tidak boleh bertentangan dengannya."
  },
  {
    "q": "Sebuah peraturan di bawah UUD ternyata bertentangan dengan UUD. Menurut kedudukan UUD, peraturan itu …",
    "options": [
      "tetap berlaku penuh",
      "tidak boleh diberlakukan dan harus disesuaikan/dapat dibatalkan melalui pengujian",
      "otomatis menjadi bagian UUD",
      "dibiarkan sampai ada protes warga"
    ],
    "answer": 1,
    "why": "Karena UUD adalah hukum tertinggi, peraturan yang bertentangan dengannya tidak boleh diberlakukan; undang-undang diuji oleh MK dan peraturan di bawah undang-undang diuji oleh MA."
  },
  {
    "q": "Fungsi UUD sebagai alat kontrol berarti UUD dipakai untuk …",
    "options": [
      "menilai apakah norma hukum yang lebih rendah sesuai dengan UUD",
      "mengatur jadwal sidang lembaga negara",
      "mengangkat dan memberhentikan presiden",
      "membuat peraturan daerah"
    ],
    "answer": 0,
    "why": "Sebagai alat kontrol, UUD menjadi tolok ukur: norma hukum yang lebih rendah dinilai kesesuaiannya dengan UUD, antara lain lewat pengujian oleh Mahkamah Konstitusi."
  },
  {
    "q": "Lembaga yang berwenang menguji undang-undang terhadap UUD NRI 1945 adalah …",
    "options": [
      "Mahkamah Agung",
      "DPR",
      "Mahkamah Konstitusi",
      "Presiden"
    ],
    "answer": 2,
    "why": "Pengujian undang-undang terhadap UUD adalah kewenangan Mahkamah Konstitusi. Mahkamah Agung menguji peraturan di bawah undang-undang terhadap undang-undang."
  },
  {
    "q": "Fungsi UUD sebagai penentu tampak ketika UUD …",
    "options": [
      "menentukan harga kebutuhan pokok",
      "membatasi kekuasaan penyelenggara negara",
      "menentukan kurikulum sekolah",
      "mengatur ketertiban lalu lintas"
    ],
    "answer": 1,
    "why": "Sebagai penentu, UUD membatasi kekuasaan penyelenggara negara — misalnya kewenangan dan masa jabatan — agar kekuasaan tidak sewenang-wenang."
  },
  {
    "q": "Contoh fungsi UUD sebagai pengatur adalah UUD …",
    "options": [
      "mengatur warna seragam sekolah",
      "mengatur harga di pasar",
      "mengatur iuran warga RT",
      "mengatur pembagian kekuasaan di antara lembaga-lembaga negara"
    ],
    "answer": 3,
    "why": "Sebagai pengatur, UUD mengatur pembagian kekuasaan lembaga negara: kekuasaan legislatif, eksekutif, dan yudikatif beserta lembaga-lembaganya."
  },
  {
    "q": "Sifat UUD NRI 1945 yang hanya memuat aturan pokok dan dapat mengikuti perkembangan disebut …",
    "options": [
      "kaku dan sangat rinci",
      "tidak tertulis",
      "singkat dan supel",
      "sementara"
    ],
    "answer": 2,
    "why": "UUD bersifat tertulis, singkat, dan supel (fleksibel): hanya memuat aturan pokok/fundamental, perinciannya diatur peraturan di bawahnya."
  },
  {
    "q": "Lembaga yang berwenang mengubah dan menetapkan Undang-Undang Dasar adalah …",
    "options": [
      "MPR",
      "DPR sendirian",
      "Presiden",
      "Mahkamah Konstitusi"
    ],
    "answer": 0,
    "why": "Pasal 3 ayat (1) UUD NRI 1945: MPR berwenang mengubah dan menetapkan Undang-Undang Dasar. DPR bersama Presiden membentuk undang-undang, bukan mengubah UUD."
  },
  {
    "q": "Tata cara perubahan UUD NRI 1945 diatur dalam …",
    "options": [
      "Pasal 27 ayat (1)",
      "Pasal 29 ayat (2)",
      "Pasal 31 ayat (1)",
      "Pasal 37"
    ],
    "answer": 3,
    "why": "Kewenangan MPR mengubah UUD dinyatakan dalam Pasal 3 ayat (1), dan tata cara perubahannya diatur dalam Pasal 37 UUD NRI 1945."
  },
  {
    "q": "Dalam amandemen UUD 1945 tahun 1999–2002, bagian yang disepakati tidak diubah adalah …",
    "options": [
      "batang tubuh",
      "Pembukaan",
      "pasal-pasal tentang kekuasaan negara",
      "aturan tambahan"
    ],
    "answer": 1,
    "why": "Amandemen mengubah batang tubuh (pasal-pasal), sedangkan Pembukaan — yang memuat Pancasila sebagai dasar negara — tidak diubah."
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
    var prevBest = read('mpi-pp-u3-quiz-best', null);
    var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-pp-u3-quiz-best', String(qScore));
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
    try { saved = JSON.parse(read('mpi-pp-u3-refleksi', 'null')); } catch (e) { saved = null; }
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
      store('mpi-pp-u3-refleksi', JSON.stringify(data));
      var st = $('refStatus');
      if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
      markVisited('sub6');
    });
  }
})();
