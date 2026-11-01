/* U.7 Kemerdekaan Berpendapat di Era Keterbukaan Informasi — script.js
   Vanilla JS, tanpa framework. Semua fakta dan kunci jawaban mengikuti
   spesifikasi modul dan diverifikasi manual.
   localStorage (semua berawalan mpi-pp-u7- agar tidak bertabrakan
   dengan modul lain pada domain github.io yang sama):
   mpi-pp-u7-visited, mpi-pp-u7-quiz-best, mpi-pp-u7-polling,
   mpi-pp-u7-komitmen, mpi-pp-u7-refleksi. */
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
  try { visited = JSON.parse(read('mpi-pp-u7-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];

  function saveVisited() { store('mpi-pp-u7-visited', JSON.stringify(visited)); }
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
  var bestStored = read('mpi-pp-u7-quiz-best', null);
  if (bestStored !== null && bestEl) {
    bestEl.textContent = 'Skor terbaik kuis: ' + bestStored + '/10';
    bestEl.hidden = false;
  }

  /* ---------- Sub-bab 1: polling ---------- */
  var POLL_MSG = {
  "bertanggung-jawab": "Tepat! Kemerdekaan berpendapat adalah kebebasan yang bertanggung jawab: menyampaikan pendapat dengan fakta, bahasa santun, dan menghormati hak orang lain, sebagaimana dibatasi Pasal 28J.",
  "bebas-mutlak": "Tercatat. Kemerdekaan berpendapat memang dijamin konstitusi, tetapi bukan tanpa batas: kita wajib menghormati hak dan kebebasan orang lain (Pasal 28J) dan tidak boleh menyebarkan hoaks atau ujaran kebencian.",
  "dilarang": "Tercatat. Sebenarnya menyampaikan pendapat tidak dilarang; ia dijamin Pasal 28 dan Pasal 28E ayat (3) UUD NRI 1945 serta UU No. 9 Tahun 1998, selama dilakukan secara bertanggung jawab."
};
  function renderPoll(pilihan, simpan) {
    document.querySelectorAll('[data-poll]').forEach(function (btn) {
      btn.classList.toggle('chosen', btn.getAttribute('data-poll') === pilihan);
    });
    if (pilihan && POLL_MSG[pilihan]) {
      showFb($('pollFb'), true, POLL_MSG[pilihan]);
      if (simpan) store('mpi-pp-u7-polling', pilihan);
    }
  }
  document.querySelectorAll('[data-poll]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      renderPoll(btn.getAttribute('data-poll'), true);
      markVisited('sub1');
    });
  });
  renderPoll(read('mpi-pp-u7-polling', null), false);

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
  "sebar": {
    "ok": false,
    "msg": "Meneruskan berita tanpa memeriksa kebenarannya adalah wujud berpendapat yang tidak bertanggung jawab dan bisa merugikan banyak orang. Di era keterbukaan informasi, periksa dulu sumber dan faktanya. Coba pertimbangkan pilihan lain."
  },
  "periksa": {
    "ok": true,
    "msg": "Tepat! Memeriksa kebenaran informasi dan menyampaikan pendapat dengan data serta bahasa santun adalah wujud kemerdekaan berpendapat yang bertanggung jawab di era keterbukaan informasi."
  },
  "kasar": {
    "ok": false,
    "msg": "Mengomentari dengan kata kasar dan menyerang pribadi orang lain melanggar kewajiban menghormati hak orang lain (Pasal 28J) dan dapat termasuk ujaran kebencian. Pendapat yang baik menyerang gagasan, bukan orangnya. Coba pertimbangkan pilihan lain."
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

  /* ---------- Sub-bab 4: sortir kartu (pola lini masa) ---------- */
  var EVENTS = [
  {
    "target": "tanggung",
    "label": "Menyampaikan kritik dengan data dan bahasa santun"
  },
  {
    "target": "tanggung",
    "label": "Memeriksa kebenaran informasi sebelum membagikannya"
  },
  {
    "target": "tanggung",
    "label": "Memberitahukan aksi penyampaian pendapat kepada kepolisian"
  },
  {
    "target": "tanggung",
    "label": "Menghormati pendapat orang lain yang berbeda"
  },
  {
    "target": "tidak",
    "label": "Menyebar berita yang belum jelas kebenarannya (hoaks)"
  },
  {
    "target": "tidak",
    "label": "Mengujarkan kebencian kepada kelompok tertentu"
  },
  {
    "target": "tidak",
    "label": "Memaksakan pendapat dengan cara kekerasan"
  },
  {
    "target": "tidak",
    "label": "Mengganggu ketertiban umum saat berunjuk rasa"
  }
];
  var NAMA_SLOT = {"tanggung": "berpendapat yang bertanggung jawab", "tidak": "berpendapat yang tidak bertanggung jawab"};
  var TL_LABEL = 'kelompok ini';
  var TL_DONE_MSG = 'Sempurna! Kedelapan kartu sudah terpilah tepat. Kemerdekaan berpendapat di era digital harus disertai tanggung jawab: berbasis fakta, santun, dan menghormati hak orang lain.';
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
    var kunciSlot = slot.getAttribute('data-slot');
    if (card.getAttribute('data-target') === kunciSlot) {
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
        showFb($('tlFb'), true, TL_DONE_MSG);
        markVisited('sub4');
      } else {
        showFb($('tlFb'), true, 'Tepat! “' + card.textContent + '” memang termasuk ' + (NAMA_SLOT[kunciSlot] || TL_LABEL) + '.');
      }
    } else {
      slot.classList.remove('goyang');
      void slot.offsetWidth;
      slot.classList.add('goyang');
      showFb($('tlFb'), false, 'Belum tepat. “' + card.textContent + '” tidak termasuk ' + (NAMA_SLOT[kunciSlot] || TL_LABEL) + '. Ingat kembali materi di Sub-bab 2, lalu coba kotak lain.');
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
  if ($('tlPool')) tlBangun();

  /* ---------- Sub-bab 4: cocokkan pasangan ---------- */
  var MATCH = {};
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
        var ok = sel.value === data.value;
        if (!ok) semuaBenar = false;
        row.classList.toggle('ok', ok);
        row.classList.toggle('no', !ok);
        if (fb) fb.textContent = ok ? data.okMsg : data.noMsg;
      });
      if (adaKosong) {
        showFb($('matchFb'), false, 'Masih ada pasangan yang belum lengkap. Isi semua pasangan, lalu periksa lagi.');
      } else if (semuaBenar) {
        showFb($('matchFb'), true, '');
        markVisited('sub4');
      } else {
        showFb($('matchFb'), false, 'Sebagian pasangan belum tepat. Perhatikan keterangan di bawah tiap baris, lalu perbaiki.');
      }
    });
  }

  /* ---------- Sub-bab 4: urutkan langkah ---------- */
  var URUTAN = ["Menentukan isu dan tujuan pendapat yang akan disampaikan", "Menyusun pendapat berdasarkan fakta yang dapat dipertanggungjawabkan", "Memberitahukan rencana kegiatan kepada kepolisian setempat", "Menyampaikan pendapat dengan tertib, damai, dan menghormati hak orang lain", "Mengevaluasi kegiatan dan bertanggung jawab atas dampak penyampaian pendapat"];
  var urutCheck = $('urutCheck');
  if (urutCheck) {
    urutCheck.addEventListener('click', function () {
      var vals = URUTAN.map(function (_, i) {
        var el = $('urut' + (i + 1));
        return el ? el.value : '';
      });
      var fb = $('urutFb');
      if (vals.indexOf('') !== -1) { showFb(fb, false, 'Isi semua posisi dulu.'); return; }
      if (new Set(vals).size !== URUTAN.length) { showFb(fb, false, 'Ada langkah yang terulang. Tiap langkah dipakai tepat satu kali.'); return; }
      var benar = 0;
      vals.forEach(function (v, i) { if (v === URUTAN[i]) benar++; });
      if (benar === URUTAN.length) {
        showFb(fb, true, 'Urutanmu tepat! Menyampaikan pendapat di muka umum yang bertanggung jawab dimulai dari menentukan isu, menyusun pendapat berbasis fakta, memberitahukan kepada kepolisian, menyampaikan dengan tertib dan damai, lalu mengevaluasi dan bertanggung jawab atas dampaknya.');
        markVisited('sub4');
      } else {
        showFb(fb, false, benar + ' dari ' + URUTAN.length + ' posisi sudah tepat. Urutan yang benar: ' + URUTAN.map(function (u, i) { return (i + 1) + ') ' + u; }).join(', ') + '.');
      }
    });
  }

  /* ---------- Sub-bab 5: komitmen ---------- */
  var komitmenText = $('komitmenText');
  if (komitmenText) {
    var simpanan = read('mpi-pp-u7-komitmen', '');
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
      store('mpi-pp-u7-komitmen', isi);
      if (st) st.textContent = 'Komitmen tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '. Tunjukkan kepada gurumu pada pertemuan berikutnya.';
      markVisited('sub5');
    });
  }

  /* ---------- Sub-bab 6: kuis 10 soal ---------- */
  /* Sebaran topik: soal 1-3 jaminan & undang-undang, 4-5 bentuk &
     batas berpendapat, 6 kewajiban pemberitahuan, 7-10 praktik di era digital.
     Kunci terverifikasi manual, distribusinya seimbang A2/B3/C2/D3:
     1) B  2) C  3) D  4) A  5) D  6) B  7) A  8) C  9) B  10) D */
  var QUIZ = [
  {
    "q": "Kebebasan berserikat, berkumpul, dan mengeluarkan pendapat bagi setiap warga negara dijamin dalam UUD NRI 1945 Pasal …",
    "options": [
      "28 ayat (1)",
      "28E ayat (3)",
      "31 ayat (1)",
      "29 ayat (2)"
    ],
    "answer": 1,
    "why": "Pasal 28E ayat (3) berbunyi: setiap orang berhak atas kebebasan berserikat, berkumpul, dan mengeluarkan pendapat. Jaminan juga terdapat dalam Pasal 28."
  },
  {
    "q": "Kemerdekaan menyampaikan pendapat di muka umum diatur dalam undang-undang, yaitu …",
    "options": [
      "UU No. 14 Tahun 2008",
      "UU No. 20 Tahun 2003",
      "UU No. 9 Tahun 1998",
      "UU No. 39 Tahun 1999"
    ],
    "answer": 2,
    "why": "UU No. 9 Tahun 1998 mengatur kemerdekaan menyampaikan pendapat di muka umum. UU No. 14 Tahun 2008 mengatur keterbukaan informasi publik."
  },
  {
    "q": "Keterbukaan informasi publik di Indonesia diatur dalam …",
    "options": [
      "UU No. 9 Tahun 1998",
      "Pasal 28J UUD 1945",
      "UU No. 23 Tahun 2014",
      "UU No. 14 Tahun 2008"
    ],
    "answer": 3,
    "why": "Keterbukaan informasi publik diatur dalam UU No. 14 Tahun 2008, yang menjamin hak warga memperoleh informasi dari badan publik."
  },
  {
    "q": "Berikut ini yang termasuk bentuk penyampaian pendapat di muka umum adalah …",
    "options": [
      "mimbar bebas",
      "menyebarkan hoaks",
      "ujaran kebencian",
      "memaksakan kehendak dengan kekerasan"
    ],
    "answer": 0,
    "why": "Bentuk penyampaian pendapat di muka umum antara lain unjuk rasa atau demonstrasi, pawai, rapat umum, dan mimbar bebas. Hoaks dan ujaran kebencian bukan bentuk yang sah, melainkan penyalahgunaan."
  },
  {
    "q": "Kemerdekaan berpendapat dibatasi oleh kewajiban menghormati hak dan kebebasan orang lain sebagaimana diatur dalam Pasal …",
    "options": [
      "28A",
      "28C ayat (1)",
      "28E ayat (3)",
      "28J"
    ],
    "answer": 3,
    "why": "Pasal 28J menegaskan setiap orang wajib menghormati hak asasi manusia orang lain, dan hak serta kebebasannya tunduk pada pembatasan yang ditetapkan undang-undang."
  },
  {
    "q": "Sebelum melaksanakan penyampaian pendapat di muka umum, penanggung jawab kegiatan wajib …",
    "options": [
      "meminta izin kepada peserta",
      "memberitahukan secara tertulis kepada kepolisian setempat",
      "mengumumkan di media sosial",
      "membayar retribusi kepada pemerintah daerah"
    ],
    "answer": 1,
    "why": "Menurut UU No. 9 Tahun 1998, penyampaian pendapat di muka umum wajib diberitahukan secara tertulis kepada kepolisian setempat agar kegiatan berlangsung tertib dan aman."
  },
  {
    "q": "Wujud kemerdekaan berpendapat yang bertanggung jawab di media sosial adalah …",
    "options": [
      "memeriksa kebenaran informasi sebelum membagikannya",
      "membagikan semua berita yang sedang ramai",
      "mengomentari dengan kata-kata kasar",
      "membuat akun palsu untuk menyerang orang lain"
    ],
    "answer": 0,
    "why": "Di era keterbukaan informasi, berpendapat yang bertanggung jawab berarti memeriksa kebenaran informasi sebelum membagikannya dan menggunakan bahasa yang santun."
  },
  {
    "q": "Menyebarkan berita bohong (hoaks) dan ujaran kebencian merupakan …",
    "options": [
      "hak yang dilindungi konstitusi",
      "bentuk mimbar bebas",
      "penyalahgunaan kemerdekaan berpendapat",
      "kewajiban warga negara"
    ],
    "answer": 2,
    "why": "Hoaks dan ujaran kebencian adalah penyalahgunaan kemerdekaan berpendapat karena merugikan dan melanggar hak orang lain."
  },
  {
    "q": "Unjuk rasa, pawai, rapat umum, dan mimbar bebas merupakan bentuk-bentuk penyampaian pendapat di …",
    "options": [
      "lingkungan keluarga",
      "muka umum",
      "sidang pengadilan",
      "rapat tertutup"
    ],
    "answer": 1,
    "why": "Keempatnya adalah bentuk penyampaian pendapat di muka umum sebagaimana diatur UU No. 9 Tahun 1998."
  },
  {
    "q": "Kemerdekaan berpendapat yang benar menurut UUD NRI 1945 adalah kebebasan yang …",
    "options": [
      "tanpa batas apa pun",
      "hanya dimiliki pejabat",
      "boleh melanggar hak orang lain",
      "bertanggung jawab dan menghormati hak orang lain"
    ],
    "answer": 3,
    "why": "Kemerdekaan berpendapat bukan tanpa batas: ia harus dilaksanakan secara bertanggung jawab dengan menghormati hak dan kebebasan orang lain (Pasal 28J)."
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
      msg.textContent = qScore === 10 ? 'Sempurna! Kamu menguasai kemerdekaan berpendapat yang bertanggung jawab.'
        : qScore >= 8 ? 'Hebat! Tinggal sedikit lagi menuju sempurna.'
        : qScore >= 6 ? 'Bagus! Ulangi bagian yang masih salah, lalu coba lagi.'
        : 'Terus berlatih! Buka lagi materi jaminan dan bentuk berpendapat di Sub-bab 2 dan permainan di Sub-bab 4, lalu ulangi kuisnya.';
    }
    var prevBest = read('mpi-pp-u7-quiz-best', null);
    var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-pp-u7-quiz-best', String(qScore));
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
    try { saved = JSON.parse(read('mpi-pp-u7-refleksi', 'null')); } catch (e) { saved = null; }
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
      store('mpi-pp-u7-refleksi', JSON.stringify(data));
      var st = $('refStatus');
      if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
      markVisited('sub6');
    });
  }
})();
