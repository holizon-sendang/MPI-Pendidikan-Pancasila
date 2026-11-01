/* P.4 Pancasila sebagai Dasar Negara — script.js
   Vanilla JS, tanpa framework. Fakta dan kunci jawaban mengikuti
   buku teks Pendidikan Pancasila Fase D dan fakta baku yang aman.
   localStorage (semua berawalan mpi-pp-p4- agar tidak bertabrakan
   dengan modul lain pada domain github.io yang sama):
   mpi-pp-p4-visited, mpi-pp-p4-quiz-best, mpi-pp-p4-polling,
   mpi-pp-p4-komitmen, mpi-pp-p4-refleksi. */
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
  try { visited = JSON.parse(read('mpi-pp-p4-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];

  function saveVisited() { store('mpi-pp-p4-visited', JSON.stringify(visited)); }
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
  var bestStored = read('mpi-pp-p4-quiz-best', null);
  if (bestStored !== null && bestEl) {
    bestEl.textContent = 'Skor terbaik kuis: ' + bestStored + '/10';
    bestEl.hidden = false;
  }

  /* ---------- Sub-bab 1: polling ---------- */
  var POLL_MSG = {
  "terasa": "Tercatat! Benar, banyak hal di sekitar kita berpijak pada Pancasila sebagai dasar negara: tata tertib sekolah, pemilihan umum yang demokratis, sampai peraturan perundang-undangan. Di modul ini kamu akan menemukan contohnya bidang demi bidang.",
  "sebagian": "Tercatat! Perasaan itu wajar. Pancasila sebagai dasar negara memang sering terasa jauh, padahal perwujudannya dekat: dari musyawarah keluarga sampai ekonomi kerakyatan pada Pasal 33 UUD NRI Tahun 1945. Ikuti modul ini sampai selesai untuk melihatnya.",
  "belum": "Tercatat! Di modul ini kamu akan melihat bahwa Pancasila bukan sekadar hafalan: ia adalah landasan berdirinya negara dan sumber dari segala sumber hukum, sehingga setiap peraturan di bawahnya tidak boleh bertentangan dengannya."
};
  function renderPoll(pilihan, simpan) {
    document.querySelectorAll('[data-poll]').forEach(function (btn) {
      btn.classList.toggle('chosen', btn.getAttribute('data-poll') === pilihan);
    });
    if (pilihan && POLL_MSG[pilihan]) {
      showFb($('pollFb'), true, POLL_MSG[pilihan]);
      if (simpan) store('mpi-pp-p4-polling', pilihan);
    }
  }
  document.querySelectorAll('[data-poll]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      renderPoll(btn.getAttribute('data-poll'), true);
      markVisited('sub1');
    });
  });
  renderPoll(read('mpi-pp-p4-polling', null), false);

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
  "diam": {
    "ok": false,
    "msg": "Diam membuat aturan yang tidak adil tetap berlaku dan merugikan sebagian teman. Sebagai dasar negara, nilai Pancasila seharusnya menjadi pegangan kita menolak aturan yang bertentangan dengan keadilan — tentu dengan cara yang sopan. Coba pertimbangkan pilihan lain."
  },
  "adil": {
    "ok": true,
    "msg": "Tepat! Inilah wujud memahami Pancasila sebagai dasar negara dalam skala kelas: aturan apa pun tidak boleh bertentangan dengan nilai keadilan dan musyawarah. Kamu menolak ketidakadilan dengan cara yang baik, yaitu mengusulkan perbaikan melalui musyawarah."
  },
  "pilih": {
    "ok": false,
    "msg": "Menguntungkan diri sendiri dengan merugikan orang lain bertentangan dengan keadilan sosial bagi seluruh rakyat Indonesia. Aturan yang baik berlaku adil untuk semua, bukan hanya untuk sebagian orang. Coba pertimbangkan pilihan lain."
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
    "target": "keluarga",
    "label": "Bermusyawarah dengan orang tua tentang aturan di rumah"
  },
  {
    "target": "keluarga",
    "label": "Menghormati dan menyayangi semua anggota keluarga"
  },
  {
    "target": "sekolah",
    "label": "Mengikuti pemilihan ketua kelas secara demokratis"
  },
  {
    "target": "sekolah",
    "label": "Menghargai teman yang berbeda agama dan suku di sekolah"
  },
  {
    "target": "masyarakat",
    "label": "Ikut kerja bakti membersihkan lingkungan tempat tinggal"
  },
  {
    "target": "masyarakat",
    "label": "Menjaga keamanan dan ketertiban lingkungan tempat tinggal"
  },
  {
    "target": "negara",
    "label": "Mengikuti pemilihan umum yang jujur dan demokratis"
  },
  {
    "target": "negara",
    "label": "Menaati peraturan perundang-undangan yang berlaku"
  }
];
  var NAMA_SLOT = {
  "keluarga": "Keluarga",
  "sekolah": "Sekolah",
  "masyarakat": "Masyarakat",
  "negara": "Berbangsa &amp; Bernegara"
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
        showFb($('tlFb'), true, 'Sempurna! Kedelapan kartu sudah berada pada bidang yang benar. Pancasila sebagai dasar negara memang diwujudkan di semua lingkungan: keluarga, sekolah, masyarakat, sampai berbangsa dan bernegara.');
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

  /* ---------- Sub-bab 5: komitmen ---------- */
  var komitmenText = $('komitmenText');
  if (komitmenText) {
    var simpanan = read('mpi-pp-p4-komitmen', '');
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
      store('mpi-pp-p4-komitmen', isi);
      if (st) st.textContent = 'Komitmen tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '. Tunjukkan kepada gurumu pada pertemuan berikutnya.';
      markVisited('sub5');
    });
  }

  /* ---------- Sub-bab 6: kuis 10 soal ---------- */
  /* Topik: pengertian, kedudukan dalam Pembukaan, sumber hukum, perwujudan berbagai bidang.
     Kunci terverifikasi manual, distribusinya seimbang A2/B3/C2/D3:
     1) B  2) C  3) D  4) A  5) D  6) B  7) A  8) C  9) B  10) D */
  var QUIZ = [
  {
    "q": "Pancasila sebagai dasar negara berarti Pancasila menjadi …",
    "options": [
      "lambang resmi negara Indonesia",
      "landasan atau fondasi berdirinya negara",
      "bahasa resmi negara Indonesia",
      "lagu kebangsaan negara Indonesia"
    ],
    "answer": 1,
    "why": "Dasar negara adalah landasan atau fondasi berdirinya suatu negara. Lambang negara, bahasa, dan lagu kebangsaan adalah identitas bangsa yang lain, dibahas pada modul P.7."
  },
  {
    "q": "Kedudukan Pancasila sebagai dasar negara tercantum dalam …",
    "options": [
      "Pasal 1 UUD NRI Tahun 1945",
      "Penjelasan UUD NRI Tahun 1945",
      "Pembukaan UUD NRI Tahun 1945 alinea keempat",
      "Aturan Peralihan UUD NRI Tahun 1945"
    ],
    "answer": 2,
    "why": "Rumusan Pancasila dengan frasa “dengan berdasar kepada” tercantum dalam Pembukaan UUD NRI Tahun 1945 alinea keempat."
  },
  {
    "q": "Pancasila berkedudukan sebagai sumber dari segala sumber hukum. Artinya …",
    "options": [
      "hanya presiden yang boleh membuat peraturan",
      "peraturan hanya berlaku di ibu kota negara",
      "semua peraturan dibuat tanpa acuan apa pun",
      "peraturan di bawahnya tidak boleh bertentangan dengan Pancasila"
    ],
    "answer": 3,
    "why": "Sebagai sumber dari segala sumber hukum, Pancasila menjadi acuan tertinggi: seluruh peraturan perundang-undangan di bawahnya tidak boleh bertentangan dengan nilai-nilai Pancasila."
  },
  {
    "q": "Contoh perwujudan Pancasila sebagai dasar negara dalam bidang politik adalah …",
    "options": [
      "pemilihan umum yang demokratis, jujur, dan adil",
      "kerja bakti membersihkan selokan",
      "memakai pakaian adat pada hari tertentu",
      "bermain sepak bola antar kampung"
    ],
    "answer": 0,
    "why": "Pemilu yang demokratis adalah perwujudan bidang politik, sesuai nilai kerakyatan. Kerja bakti adalah perwujudan bidang sosial di masyarakat."
  },
  {
    "q": "Perekonomian sebagai usaha bersama berdasar atas asas kekeluargaan, sebagai perwujudan Pancasila di bidang ekonomi, diatur dalam UUD NRI Tahun 1945 pada …",
    "options": [
      "Pasal 27",
      "Pasal 29",
      "Pasal 31",
      "Pasal 33"
    ],
    "answer": 3,
    "why": "Pasal 33 UUD NRI Tahun 1945 mengatur perekonomian disusun sebagai usaha bersama berdasar atas asas kekeluargaan."
  },
  {
    "q": "Contoh perwujudan nilai Pancasila sebagai dasar negara dalam kehidupan keluarga adalah …",
    "options": [
      "mengikuti pemilihan umum",
      "bermusyawarah dan saling menghormati dalam keluarga",
      "mengikuti upacara bendera di sekolah",
      "membayar pajak kendaraan"
    ],
    "answer": 1,
    "why": "Dalam keluarga, perwujudannya antara lain bermusyawarah, saling menghormati, dan menyayangi anggota keluarga."
  },
  {
    "q": "Contoh perwujudan nilai Pancasila sebagai dasar negara dalam kehidupan sekolah adalah …",
    "options": [
      "mengikuti pemilihan ketua kelas secara demokratis",
      "menjaga keamanan negara di perbatasan",
      "menyusun undang-undang bersama guru",
      "mengikuti sidang Dewan Perwakilan Rakyat"
    ],
    "answer": 0,
    "why": "Di sekolah, perwujudannya antara lain pemilihan ketua kelas secara demokratis, mematuhi tata tertib, dan menghargai perbedaan antar teman."
  },
  {
    "q": "Apabila suatu peraturan ternyata bertentangan dengan Pancasila, maka peraturan tersebut …",
    "options": [
      "tetap berlaku selamanya",
      "hanya berlaku untuk sebagian warga",
      "harus disesuaikan karena Pancasila adalah sumber dari segala sumber hukum",
      "boleh diabaikan oleh semua orang sesuka hati"
    ],
    "answer": 2,
    "why": "Karena Pancasila adalah sumber dari segala sumber hukum, peraturan yang bertentangan dengannya harus disesuaikan atau diubah, bukan dibiarkan."
  },
  {
    "q": "Fungsi Pancasila sebagai dasar negara bagi penyelenggaraan negara adalah sebagai …",
    "options": [
      "hiasan pada gedung pemerintahan",
      "landasan dan pedoman penyelenggaraan negara",
      "syarat untuk menjadi warga negara",
      "nama lain dari undang-undang dasar"
    ],
    "answer": 1,
    "why": "Sebagai dasar negara, Pancasila menjadi landasan dan pedoman bagi seluruh penyelenggaraan negara Republik Indonesia."
  },
  {
    "q": "Contoh perwujudan Pancasila dalam bidang pertahanan dan keamanan yang dapat dilakukan siswa adalah …",
    "options": [
      "menjadi anggota tentara sejak sekolah",
      "menyusun strategi perang negara",
      "membeli peralatan pertahanan negara",
      "ikut menjaga keamanan dan ketertiban lingkungan tempat tinggal"
    ],
    "answer": 3,
    "why": "Pertahanan dan keamanan adalah tanggung jawab bersama. Dalam kehidupan sehari-hari, siswa dapat ikut menjaga keamanan dan ketertiban lingkungannya."
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
    var prevBest = read('mpi-pp-p4-quiz-best', null);
    var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-pp-p4-quiz-best', String(qScore));
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
    try { saved = JSON.parse(read('mpi-pp-p4-refleksi', 'null')); } catch (e) { saved = null; }
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
      store('mpi-pp-p4-refleksi', JSON.stringify(data));
      var st = $('refStatus');
      if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
      markVisited('sub6');
    });
  }
})();
