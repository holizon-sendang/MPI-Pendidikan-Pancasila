/* U.2 Sejarah UUD NRI 1945 — script.js
   Vanilla JS, tanpa framework. Semua fakta dan kunci jawaban mengikuti
   rincian ATP dan diverifikasi manual.
   localStorage (semua berawalan mpi-pp-u2- agar tidak bertabrakan
   dengan modul lain dan MPI Matematika pada domain github.io yang sama):
   mpi-pp-u2-visited, mpi-pp-u2-quiz-best, mpi-pp-u2-polling,
   mpi-pp-u2-komitmen, mpi-pp-u2-refleksi. */
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
  try { visited = JSON.parse(read('mpi-pp-u2-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];

  function saveVisited() { store('mpi-pp-u2-visited', JSON.stringify(visited)); }
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
  var bestStored = read('mpi-pp-u2-quiz-best', null);
  if (bestStored !== null && bestEl) {
    bestEl.textContent = 'Skor terbaik kuis: ' + bestStored + '/10';
    bestEl.hidden = false;
  }

  /* ---------- Sub-bab 1: polling ---------- */
  var POLL_MSG = {
  "hukum-dasar": "Tercatat! Tepat arahnya: konstitusi adalah hukum dasar yang menjadi landasan penyelenggaraan negara. Di Indonesia, konstitusi tertulisnya adalah UUD NRI 1945. Rincian sejarahnya kamu telusuri di Sub-bab 2.",
  "uu-biasa": "Tercatat! Pendapat ini akan kita uji: konstitusi berbeda dari undang-undang biasa karena kedudukannya lebih tinggi — undang-undang justru harus bersumber dan tidak boleh bertentangan dengan konstitusi. Buktinya ada di Sub-bab 2.",
  "aturan-adat": "Tercatat! Kebiasaan ketatanegaraan memang termasuk konstitusi tidak tertulis (konvensi), tetapi konstitusi juga ada yang tertulis, yaitu undang-undang dasar. Keduanya dibahas di Babak 1 Sub-bab 2."
};
  function renderPoll(pilihan, simpan) {
    document.querySelectorAll('[data-poll]').forEach(function (btn) {
      btn.classList.toggle('chosen', btn.getAttribute('data-poll') === pilihan);
    });
    if (pilihan && POLL_MSG[pilihan]) {
      showFb($('pollFb'), true, POLL_MSG[pilihan]);
      if (simpan) store('mpi-pp-u2-polling', pilihan);
    }
  }
  document.querySelectorAll('[data-poll]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      renderPoll(btn.getAttribute('data-poll'), true);
      markVisited('sub1');
    });
  });
  renderPoll(read('mpi-pp-u2-polling', null), false);

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
    "msg": "Melanggar diam-diam bukan jalan keluar: aturan yang berlaku tetap mengikat selama belum diubah dengan cara yang benar. Sejarah UUD mengajarkan hal yang sama — ketika UUDS 1950 dinilai tidak sesuai, bangsa Indonesia tidak melanggarnya diam-diam, melainkan kembali ke UUD 1945 melalui Dekrit Presiden 5 Juli 1959, sebuah keputusan resmi. Coba pertimbangkan pilihan lain."
  },
  "usulkan": {
    "ok": true,
    "msg": "Tepat! Inilah cara konstitusional: aturan ditaati selama berlaku, dan perubahan ditempuh lewat saluran resmi. Pola yang sama terjadi pada UUD 1945: perubahannya (amandemen) dilakukan MPR secara bertahap dan resmi pada 1999–2002, bukan dengan pelanggaran diam-diam."
  },
  "abaikan": {
    "ok": false,
    "msg": "Mengabaikan aturan membuat kehidupan bersama tidak tertib. Konstitusi ada justru agar penyelenggara negara dan warga mempunyai pegangan bersama. Jika ada isi aturan yang perlu diubah, sampaikan usulanmu lewat musyawarah — bukan dengan mengabaikannya. Coba pertimbangkan pilihan lain."
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

  /* ---------- Sub-bab 4: lini masa ---------- */
  var EVENTS = [
  {
    "target": "1945-07-10",
    "label": "Sidang kedua BPUPK mulai membahas rancangan UUD"
  },
  {
    "target": "1945-08-18",
    "label": "UUD disahkan oleh PPKI"
  },
  {
    "target": "1949-12-27",
    "label": "Konstitusi RIS berlaku"
  },
  {
    "target": "1950-08-17",
    "label": "UUDS 1950 berlaku"
  },
  {
    "target": "1959-07-05",
    "label": "Dekrit Presiden: kembali ke UUD 1945"
  },
  {
    "target": "1999",
    "label": "Amandemen pertama UUD 1945"
  },
  {
    "target": "2002",
    "label": "Amandemen keempat UUD 1945 (selesai)"
  }
];
  var NAMA_TANGGAL = {"1945-07-10": "10 Juli 1945", "1945-08-18": "18 Agustus 1945", "1949-12-27": "27 Desember 1949", "1950-08-17": "17 Agustus 1950", "1959-07-05": "5 Juli 1959", "1999": "1999", "2002": "2002"};
  var SUKSES_TL = "Sempurna! Ketujuh peristiwa sudah berada pada tanggal yang benar: sidang kedua BPUPK, pengesahan oleh PPKI, Konstitusi RIS, UUDS 1950, Dekrit Presiden 1959, lalu amandemen pertama (1999) sampai keempat (2002).";
  var tlTerpasang = 0;
  var tlDipilih = null;
  function tlUpdateProgress() {
    var el = $('tlProgress');
    if (el) el.textContent = tlTerpasang + ' dari ' + EVENTS.length + ' peristiwa terpasang tepat.';
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
        showFb($('tlFb'), true, SUKSES_TL);
        markVisited('sub4');
      } else {
        showFb($('tlFb'), true, 'Tepat! \u201C' + card.textContent + '\u201D memang terjadi pada ' + NAMA_TANGGAL[tanggalSlot] + '.');
      }
    } else {
      slot.classList.remove('goyang');
      void slot.offsetWidth;
      slot.classList.add('goyang');
      showFb($('tlFb'), false, 'Belum tepat. \u201C' + card.textContent + '\u201D tidak terjadi pada ' + NAMA_TANGGAL[tanggalSlot] + '. Ingat kembali urutan babak di Sub-bab 2, lalu coba tanggal lain.');
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
    slot.addEventListener('click', function () { if (tlDipilih) tlPasang(tlDipilih, slot); });
    slot.addEventListener('dragover', function (e) { e.preventDefault(); slot.classList.add('dragover'); });
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

  /* ---------- Sub-bab 5: komitmen ---------- */
  var komitmenText = $('komitmenText');
  if (komitmenText) {
    var simpanan = read('mpi-pp-u2-komitmen', '');
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
      store('mpi-pp-u2-komitmen', isi);
      if (st) st.textContent = 'Komitmen tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '. Tunjukkan kepada gurumu pada pertemuan berikutnya.';
      markVisited('sub5');
    });
  }

  /* ---------- Sub-bab 6: kuis 10 soal ---------- */
  /* Kunci terverifikasi manual, distribusinya seimbang A2/B3/C2/D3:
     1) B 2) C 3) D 4) A 5) D 6) B 7) A 8) C 9) B 10) D
     Sebaran topik: pengertian konstitusi, perumusan, pengesahan, perjalanan konstitusi, amandemen. */
  var QUIZ = [
  {
    "q": "Konstitusi bagi sebuah negara adalah …",
    "options": [
      "kumpulan peraturan menteri",
      "hukum dasar yang menjadi landasan penyelenggaraan negara",
      "aturan adat yang tidak tertulis saja",
      "tata tertib yang dibuat sekolah"
    ],
    "answer": 1,
    "why": "Konstitusi adalah hukum dasar negara: landasan penyelenggaraan negara yang memuat aturan pokok. Peraturan menteri dan tata tertib sekolah kedudukannya jauh di bawah konstitusi."
  },
  {
    "q": "Konstitusi tertulis Negara Republik Indonesia adalah …",
    "options": [
      "konvensi ketatanegaraan",
      "kebiasaan para penyelenggara negara",
      "UUD NRI 1945",
      "pidato kenegaraan presiden"
    ],
    "answer": 2,
    "why": "Konstitusi tertulis Indonesia adalah UUD NRI 1945. Konvensi dan kebiasaan ketatanegaraan termasuk konstitusi tidak tertulis."
  },
  {
    "q": "Rancangan UUD dibahas BPUPK pada sidang kedua yang berlangsung pada …",
    "options": [
      "29 Mei – 1 Juni 1945",
      "1 Maret 1945",
      "18 Agustus 1945",
      "10–17 Juli 1945"
    ],
    "answer": 3,
    "why": "Sidang kedua BPUPK pada 10–17 Juli 1945 membahas rancangan UUD. Sidang pertama (29 Mei–1 Juni 1945) membahas dasar negara."
  },
  {
    "q": "Panitia Perancang Undang-Undang Dasar pada sidang kedua BPUPK diketuai oleh …",
    "options": [
      "Ir. Soekarno",
      "Dr. K.R.T. Radjiman Wedyodiningrat",
      "Prof. Dr. Soepomo",
      "Mohammad Hatta"
    ],
    "answer": 0,
    "why": "Panitia Perancang Undang-Undang Dasar diketuai Ir. Soekarno. Radjiman Wedyodiningrat adalah ketua BPUPK."
  },
  {
    "q": "UUD NRI 1945 disahkan sebagai konstitusi Indonesia oleh …",
    "options": [
      "BPUPK pada sidang keduanya",
      "Panitia Sembilan",
      "MPR hasil pemilihan umum",
      "PPKI pada 18 Agustus 1945"
    ],
    "answer": 3,
    "why": "Sehari setelah proklamasi, PPKI mengesahkan UUD pada 18 Agustus 1945. BPUPK menyiapkan rancangannya, tetapi pengesahannya adalah wewenang PPKI."
  },
  {
    "q": "Konstitusi yang berlaku di Indonesia mulai 27 Desember 1949 adalah …",
    "options": [
      "UUDS 1950",
      "Konstitusi RIS",
      "UUD 1945 hasil amandemen",
      "Piagam Jakarta"
    ],
    "answer": 1,
    "why": "Mulai 27 Desember 1949 berlaku Konstitusi RIS, ketika Indonesia berbentuk Republik Indonesia Serikat. UUDS 1950 baru berlaku pada 17 Agustus 1950."
  },
  {
    "q": "Indonesia kembali memberlakukan UUD 1945 melalui …",
    "options": [
      "Dekrit Presiden 5 Juli 1959",
      "Piagam Jakarta",
      "Proklamasi 17 Agustus 1945",
      "Ketetapan MPR tahun 1999"
    ],
    "answer": 0,
    "why": "Dekrit Presiden 5 Juli 1959 menetapkan kembali berlakunya UUD 1945 dan tidak berlakunya lagi UUDS 1950."
  },
  {
    "q": "UUDS 1950 mulai berlaku pada …",
    "options": [
      "27 Desember 1949",
      "5 Juli 1959",
      "17 Agustus 1950",
      "18 Agustus 1945"
    ],
    "answer": 2,
    "why": "UUDS 1950 berlaku mulai 17 Agustus 1950, setelah Indonesia kembali menjadi negara kesatuan."
  },
  {
    "q": "Amandemen UUD 1945 pada tahun 1999–2002 dilakukan dalam … tahap.",
    "options": [
      "dua",
      "empat",
      "tiga",
      "lima"
    ],
    "answer": 1,
    "why": "MPR mengubah UUD 1945 dalam empat tahap pada 1999, 2000, 2001, dan 2002."
  },
  {
    "q": "Bagian UUD NRI 1945 yang tidak diubah dalam amandemen 1999–2002 adalah …",
    "options": [
      "batang tubuh",
      "pasal-pasal tentang lembaga negara",
      "aturan peralihan",
      "Pembukaan"
    ],
    "answer": 3,
    "why": "Amandemen hanya mengubah batang tubuh (pasal-pasal). Pembukaan UUD 1945 — yang memuat Pancasila — disepakati untuk tidak diubah."
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
    var prevBest = read('mpi-pp-u2-quiz-best', null);
    var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-pp-u2-quiz-best', String(qScore));
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
    try { saved = JSON.parse(read('mpi-pp-u2-refleksi', 'null')); } catch (e) { saved = null; }
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
      store('mpi-pp-u2-refleksi', JSON.stringify(data));
      var st = $('refStatus');
      if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
      markVisited('sub6');
    });
  }
})();
