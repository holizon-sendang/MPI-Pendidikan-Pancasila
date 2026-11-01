/* B.8 Menjaga Budaya dalam Masyarakat Global — script.js
   Vanilla JS, tanpa framework. Meniru mesin prototipe P.1.
   localStorage (semua berawalan mpi-pp-b8- agar tidak bertabrakan
   dengan modul lain pada domain github.io yang sama):
   mpi-pp-b8-visited, mpi-pp-b8-quiz-best, mpi-pp-b8-polling,
   mpi-pp-b8-komitmen, mpi-pp-b8-refleksi. */
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
  try { visited = JSON.parse(read('mpi-pp-b8-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];

  function saveVisited() { store('mpi-pp-b8-visited', JSON.stringify(visited)); }
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
  var bestStored = read('mpi-pp-b8-quiz-best', null);
  if (bestStored !== null && bestEl) {
    bestEl.textContent = 'Skor terbaik kuis: ' + bestStored + '/10';
    bestEl.hidden = false;
  }

  /* ---------- Sub-bab 1: polling ---------- */
  var POLL_MSG = {
  "batik": "Tercatat! Batik adalah contoh budaya Indonesia yang mendunia dan dipakai dengan bangga dalam berbagai acara resmi. Memakai produk budaya sendiri adalah strategi nyata menjaga budaya.",
  "gamelan": "Tercatat! Gamelan dipelajari dan dimainkan di banyak negara. Itu bukti budaya lokal bisa diterima dunia tanpa kehilangan keasliannya.",
  "kuliner": "Tercatat! Kuliner seperti rendang dikenal luas sebagai makanan khas Indonesia. Festival kuliner adalah salah satu cara efektif memperkenalkan budaya."
};
  function renderPoll(pilihan, simpan) {
    document.querySelectorAll('[data-poll]').forEach(function (btn) {
      btn.classList.toggle('chosen', btn.getAttribute('data-poll') === pilihan);
    });
    if (pilihan && POLL_MSG[pilihan]) {
      showFb($('pollFb'), true, POLL_MSG[pilihan]);
      if (simpan) store('mpi-pp-b8-polling', pilihan);
    }
  }
  document.querySelectorAll('[data-poll]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      renderPoll(btn.getAttribute('data-poll'), true);
      markVisited('sub1');
    });
  });
  renderPoll(read('mpi-pp-b8-polling', null), false);

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
  "ikut-ejek": {
    "ok": false,
    "msg": "Ikut mengejek budaya sendiri mempercepat tersisihnya budaya lokal. Gaul yang sesungguhnya tidak ditentukan oleh meremehkan identitas sendiri. Coba pertimbangkan pilihan lain."
  },
  "bangga": {
    "ok": true,
    "msg": "Tepat! Memakai produk budaya sendiri dengan bangga dan mengingatkan teman secara sopan adalah fondasi menjaga budaya. Sikapmu juga bisa menginspirasi teman lain untuk ikut bangga."
  },
  "diam": {
    "ok": false,
    "msg": "Diam dan berhenti memakai batik karena takut diejek berarti membiarkan ejekan menang. Kamu bisa tetap bangga dan menunjukkan bahwa memakai budaya sendiri tidak mengurangi gaya sama sekali. Coba pertimbangkan pilihan lain."
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

  /* ---------- Sub-bab 4: sortir kartu (pola lini masa) ---------- */
  var EVENTS = [
  {
    "target": "peluang",
    "label": "Budaya daerah dipromosikan lewat internet dan media sosial"
  },
  {
    "target": "peluang",
    "label": "Kerja sama dan pertukaran budaya antarbangsa"
  },
  {
    "target": "peluang",
    "label": "Tari tradisional tampil di festival internasional"
  },
  {
    "target": "peluang",
    "label": "Gamelan dipelajari di banyak negara"
  },
  {
    "target": "ancaman",
    "label": "Budaya asing mendominasi sehingga budaya lokal tersisih"
  },
  {
    "target": "ancaman",
    "label": "Generasi muda malu memakai produk budaya sendiri"
  },
  {
    "target": "ancaman",
    "label": "Kesenian daerah sepi peminat karena tidak pernah dipromosikan"
  },
  {
    "target": "ancaman",
    "label": "Bahasa daerah makin jarang digunakan anak muda"
  }
];
  var NAMA_SLOT = {"peluang": "Peluang bagi Budaya Lokal", "ancaman": "Ancaman bagi Budaya Lokal"};
  var TL_TOTAL = EVENTS.length;
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
    if (el) el.textContent = tlTerpasang + ' dari ' + TL_TOTAL + ' kartu terpasang tepat.';
  }
  function tlPilih(card) {
    if (tlDipilih) tlDipilih.classList.remove('terpilih');
    tlDipilih = card;
    if (card) card.classList.add('terpilih');
  }
  function tlPasang(card, slot) {
    if (!card || !slot) return;
    var kunciSlot = slot.getAttribute('data-slot');
    if (card.getAttribute('data-target') === kunciSlot) {
      var drop = slot.querySelector('.tl-drop');
      slot.classList.add('terisi');
      if (drop) {
        if (drop.getAttribute('data-kosong') === '1') { drop.textContent = ''; drop.setAttribute('data-kosong', '0'); }
        drop.appendChild(card);
      }
      card.classList.remove('terpilih');
      card.classList.add('terpasang');
      card.disabled = true;
      card.draggable = false;
      if (tlDipilih === card) tlDipilih = null;
      tlTerpasang++;
      tlUpdateProgress();
      if (tlTerpasang === TL_TOTAL) {
        slot.classList.add('benar');
        document.querySelectorAll('.tl-slot').forEach(function (s) { s.classList.add('benar'); });
        showFb($('tlFb'), true, "Sempurna! Semua kartu sudah tersortir tepat. Globalisasi adalah peluang jika kita aktif mempromosikan budaya, dan menjadi ancaman jika kita pasif dan meremehkan budaya sendiri.");
        markVisited('sub4');
      } else {
        showFb($('tlFb'), true, 'Tepat! \u201C' + card.textContent + '\u201D memang termasuk: ' + NAMA_SLOT[kunciSlot] + '.');
      }
    } else {
      slot.classList.remove('goyang');
      void slot.offsetWidth;
      slot.classList.add('goyang');
      showFb($('tlFb'), false, 'Belum tepat. \u201C' + card.textContent + '\u201D tidak termasuk: ' + NAMA_SLOT[kunciSlot] + '. Pikirkan lagi maknanya, lalu coba kotak lain.');
    }
  }
  function tlBangun() {
    tlTerpasang = 0;
    tlDipilih = null;
    document.querySelectorAll('.tl-slot').forEach(function (slot) {
      slot.classList.remove('terisi', 'benar', 'goyang');
      var drop = slot.querySelector('.tl-drop');
      if (drop) { drop.textContent = 'Letakkan kartu di sini'; drop.setAttribute('data-kosong', '1'); }
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

  /* ---------- Sub-bab 4: cocokkan pasangan ---------- */
  var MATCH = {
  "tukarpelajar": {
    "s1": "Diplomasi budaya",
    "s2": "Siswa memperkenalkan budaya Indonesia sambil belajar di negara lain",
    "ok": "Tepat: pertukaran pelajar adalah diplomasi budaya; siswa menjadi duta budaya Indonesia di negara lain.",
    "no": "Belum tepat. Pertukaran pelajar termasuk diplomasi budaya, dan manfaatnya adalah memperkenalkan budaya Indonesia sambil belajar di negara lain."
  },
  "tari-ln": {
    "s1": "Pertunjukan seni di luar negeri",
    "s2": "Penonton mancanegara mengenal kesenian Indonesia secara langsung",
    "ok": "Tepat: tampil di festival internasional adalah pertunjukan seni di luar negeri yang memperkenalkan kesenian Indonesia secara langsung.",
    "no": "Belum tepat. Kegiatan ini adalah pertunjukan seni di luar negeri, dengan manfaat memperkenalkan kesenian Indonesia kepada penonton mancanegara."
  },
  "konten": {
    "s1": "Promosi budaya digital",
    "s2": "Budaya daerah dikenal luas lewat konten internet yang positif",
    "ok": "Tepat: konten video gamelan adalah promosi budaya digital yang membuat budaya daerah dikenal luas.",
    "no": "Belum tepat. Membuat konten untuk media sosial adalah promosi budaya digital."
  },
  "batik-acara": {
    "s1": "Penggunaan produk budaya sendiri",
    "s2": "Produk budaya sendiri tetap hidup dan dihargai di dalam negeri",
    "ok": "Tepat: memakai batik adalah penggunaan produk budaya sendiri, fondasi agar budaya tetap hidup di dalam negeri.",
    "no": "Belum tepat. Memakai batik termasuk penggunaan produk budaya sendiri."
  }
};
  var matchCheck = $('matchCheck');
  if (matchCheck) {
    matchCheck.addEventListener('click', function () {
      var semuaBenar = true;
      var adaKosong = false;
      document.querySelectorAll('.match-row').forEach(function (row) {
        var data = MATCH[row.getAttribute('data-kunci')];
        var s1 = row.querySelector('.match-s1');
        var s2 = row.querySelector('.match-s2');
        var fb = row.querySelector('.match-fb');
        if (!data || !s1 || !s2) return;
        if (!s1.value || !s2.value) {
          adaKosong = true;
          semuaBenar = false;
          row.classList.remove('ok', 'no');
          if (fb) fb.textContent = 'Lengkapi dulu kedua pilihannya.';
          return;
        }
        var ok = (s1.value === data.s1) && (s2.value === data.s2);
        if (!ok) semuaBenar = false;
        row.classList.toggle('ok', ok);
        row.classList.toggle('no', !ok);
        if (fb) fb.textContent = ok ? data.ok : data.no;
      });
      if (adaKosong) {
        showFb($('matchFb'), false, 'Masih ada pasangan yang belum lengkap. Isi kedua pilihan untuk semua baris, lalu periksa lagi.');
      } else if (semuaBenar) {
        showFb($('matchFb'), true, "Semua pasangan tepat! Diplomasi budaya, pertunjukan seni di luar negeri, promosi digital, dan memakai produk budaya sendiri adalah strategi yang saling melengkapi.");
        markVisited('sub4');
      } else {
        showFb($('matchFb'), false, 'Sebagian pasangan belum tepat. Perhatikan keterangan di bawah tiap baris, lalu perbaiki.');
      }
    });
  }

  /* ---------- Sub-bab 5: komitmen ---------- */
  var komitmenText = $('komitmenText');
  if (komitmenText) {
    var simpanan = read('mpi-pp-b8-komitmen', '');
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
      store('mpi-pp-b8-komitmen', isi);
      if (st) st.textContent = 'Komitmen tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '. Tunjukkan kepada gurumu pada pertemuan berikutnya.';
      markVisited('sub5');
    });
  }

  /* ---------- Sub-bab 6: kuis 10 soal ---------- */
  /* Kunci terverifikasi manual, distribusinya seimbang A2/B3/C2/D3:
     1) B  2) C  3) D  4) A  5) D  6) B  7) A  8) C  9) B  10) D */
  var QUIZ = [
  {
    "q": "Yang termasuk praktik budaya adalah …",
    "options": [
      "sistem pertahanan dan keamanan negara",
      "kesenian, bahasa, busana, dan kuliner daerah",
      "sistem irigasi pertanian semata",
      "aturan pemilihan umum"
    ],
    "answer": 1,
    "why": "Praktik budaya berwujud antara lain kesenian, bahasa, busana, dan kuliner yang hidup dalam masyarakat."
  },
  {
    "q": "Pengaruh positif globalisasi bagi budaya lokal adalah …",
    "options": [
      "budaya asing dilarang masuk ke Indonesia",
      "semua budaya lokal diganti budaya global",
      "promosi budaya lewat internet dan kerja sama antarbangsa",
      "generasi muda meninggalkan budaya sendiri"
    ],
    "answer": 2,
    "why": "Globalisasi membuka peluang promosi budaya lewat internet dan kerja sama antarbangsa di bidang budaya."
  },
  {
    "q": "Pengaruh negatif globalisasi bagi budaya lokal adalah …",
    "options": [
      "tari tradisional tampil di festival internasional",
      "gamelan dipelajari di banyak negara",
      "batik semakin dikenal dunia",
      "budaya asing mendominasi sehingga budaya lokal tersisih"
    ],
    "answer": 3,
    "why": "Jika budaya asing mendominasi dan generasi muda meremehkan budaya sendiri, budaya lokal dapat tersisih."
  },
  {
    "q": "Pasal UUD NRI Tahun 1945 yang mengatur pemajuan kebudayaan adalah …",
    "options": [
      "Pasal 32",
      "Pasal 27",
      "Pasal 30",
      "Pasal 31"
    ],
    "answer": 0,
    "why": "Pasal 32 UUD NRI Tahun 1945 mengatur pemajuan kebudayaan nasional Indonesia di tengah peradaban dunia."
  },
  {
    "q": "Gamelan adalah contoh budaya Indonesia yang mendunia karena …",
    "options": [
      "hanya dimainkan di satu desa",
      "dilarang dipelajari orang asing",
      "tidak pernah tampil di luar negeri",
      "dipelajari dan dimainkan di banyak negara"
    ],
    "answer": 3,
    "why": "Gamelan dipelajari dan dimainkan di banyak negara, sehingga menjadi contoh budaya Indonesia yang mendunia."
  },
  {
    "q": "Strategi menjaga budaya yang dapat dilakukan di sekolah adalah …",
    "options": [
      "melarang semua pentas seni daerah",
      "mengadakan festival budaya yang menampilkan kesenian lokal",
      "mengejek pakaian adat",
      "hanya menampilkan budaya asing"
    ],
    "answer": 1,
    "why": "Festival budaya di sekolah adalah strategi nyata menjaga dan memperkenalkan kesenian lokal."
  },
  {
    "q": "Diplomasi budaya adalah …",
    "options": [
      "memperkenalkan budaya bangsa ke negara lain, misalnya lewat pertukaran pelajar dan pertunjukan seni",
      "melarang warga asing mempelajari budaya kita",
      "menutup diri dari pergaulan antarbangsa",
      "mengganti budaya sendiri dengan budaya asing"
    ],
    "answer": 0,
    "why": "Diplomasi budaya memperkenalkan budaya bangsa ke negara lain, contohnya pertukaran pelajar dan pertunjukan seni di luar negeri."
  },
  {
    "q": "Sikap yang tepat terhadap produk budaya sendiri, seperti batik, adalah …",
    "options": [
      "malu memakainya karena dianggap kuno",
      "hanya memakainya jika dipaksa",
      "mencintai dan memakainya dengan bangga",
      "menyembunyikannya dari orang asing"
    ],
    "answer": 2,
    "why": "Mencintai dan memakai produk budaya sendiri dengan bangga adalah fondasi strategi menjaga budaya."
  },
  {
    "q": "Pemanfaatan media sosial yang tepat untuk menjaga budaya adalah …",
    "options": [
      "menyebarkan ejekan terhadap budaya daerah lain",
      "membuat konten promosi positif tentang budaya daerah",
      "hanya mengunggah budaya asing",
      "tidak pernah membahas budaya sama sekali"
    ],
    "answer": 1,
    "why": "Media sosial sebaiknya dimanfaatkan untuk promosi positif budaya daerah agar dikenal luas secara baik."
  },
  {
    "q": "Jika budaya lokal tersisih di negeri sendiri, akibatnya adalah …",
    "options": [
      "identitas bangsa semakin kuat",
      "dunia semakin mengenal Indonesia",
      "tidak ada akibat yang berarti",
      "identitas dan kebanggaan budaya bangsa melemah"
    ],
    "answer": 3,
    "why": "Budaya lokal yang tersisih melemahkan identitas dan kebanggaan budaya bangsa, padahal budaya adalah jati diri bangsa."
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
      next.textContent = qi === QUIZ.length - 1 ? 'Lihat Hasil \u2192' : 'Soal Berikutnya \u2192';
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
      msg.textContent = qScore === 10 ? "Sempurna! Kamu menguasai pengaruh globalisasi dan strategi menjaga budaya."
        : qScore >= 8 ? 'Hebat! Tinggal sedikit lagi menuju sempurna.'
        : qScore >= 6 ? 'Bagus! Ulangi bagian yang masih salah, lalu coba lagi.'
        : "Terus berlatih! Buka lagi babak-babak di Sub-bab 2 dan permainan di Sub-bab 4, lalu ulangi kuisnya.";
    }
    var prevBest = read('mpi-pp-b8-quiz-best', null);
    var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-pp-b8-quiz-best', String(qScore));
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
    try { saved = JSON.parse(read('mpi-pp-b8-refleksi', 'null')); } catch (e) { saved = null; }
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
      store('mpi-pp-b8-refleksi', JSON.stringify(data));
      var st = $('refStatus');
      if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
      markVisited('sub6');
    });
  }
})();
