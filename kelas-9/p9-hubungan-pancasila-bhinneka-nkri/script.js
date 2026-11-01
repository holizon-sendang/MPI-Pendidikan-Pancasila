/* P.9 Hubungan Pancasila dengan Bhinneka Tunggal Ika dan NKRI — script.js
   Vanilla JS, tanpa framework. Semua fakta dan kunci jawaban mengikuti
   spesifikasi modul dan diverifikasi manual.
   localStorage (semua berawalan mpi-pp-p9- agar tidak bertabrakan
   dengan modul lain pada domain github.io yang sama):
   mpi-pp-p9-visited, mpi-pp-p9-quiz-best, mpi-pp-p9-polling,
   mpi-pp-p9-komitmen, mpi-pp-p9-refleksi. */
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
  try { visited = JSON.parse(read('mpi-pp-p9-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];

  function saveVisited() { store('mpi-pp-p9-visited', JSON.stringify(visited)); }
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
  var bestStored = read('mpi-pp-p9-quiz-best', null);
  if (bestStored !== null && bestEl) {
    bestEl.textContent = 'Skor terbaik kuis: ' + bestStored + '/10';
    bestEl.hidden = false;
  }

  /* ---------- Sub-bab 1: polling ---------- */
  var POLL_MSG = {
  "sila3": "Tepat! Sila ketiga, Persatuan Indonesia, adalah landasan semangat Bhinneka Tunggal Ika dan NKRI. Sila-sila lain ikut menopang: sila 1 toleransi beragama, sila 2 kemanusiaan, sila 4 musyawarah, dan sila 5 keadilan bagi seluruh rakyat.",
  "sila1": "Tercatat. Sila pertama memang menopang keberagaman lewat toleransi beragama, tetapi landasan utama semangat Bhinneka Tunggal Ika dan NKRI adalah sila ketiga, Persatuan Indonesia.",
  "sila5": "Tercatat. Sila kelima menopang keberagaman lewat keadilan bagi seluruh rakyat, tetapi landasan utama semangat Bhinneka Tunggal Ika dan NKRI adalah sila ketiga, Persatuan Indonesia."
};
  function renderPoll(pilihan, simpan) {
    document.querySelectorAll('[data-poll]').forEach(function (btn) {
      btn.classList.toggle('chosen', btn.getAttribute('data-poll') === pilihan);
    });
    if (pilihan && POLL_MSG[pilihan]) {
      showFb($('pollFb'), true, POLL_MSG[pilihan]);
      if (simpan) store('mpi-pp-p9-polling', pilihan);
    }
  }
  document.querySelectorAll('[data-poll]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      renderPoll(btn.getAttribute('data-poll'), true);
      markVisited('sub1');
    });
  });
  renderPoll(read('mpi-pp-p9-polling', null), false);

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
  "pilih": {
    "ok": false,
    "msg": "Hanya bergaul dengan teman yang sama latar belakangnya membuat keberagaman tidak pernah menjadi kekuatan. Bhinneka Tunggal Ika justru mengajarkan berbeda-beda tetapi tetap satu. Coba pertimbangkan pilihan lain."
  },
  "satu": {
    "ok": true,
    "msg": "Tepat! Mengajak semua teman tanpa membeda-bedakan adalah wujud sila ketiga dan semangat Bhinneka Tunggal Ika: berbeda-beda tetapi tetap satu, saling menghargai dalam satu kesatuan."
  },
  "ejek": {
    "ok": false,
    "msg": "Mengejek perbedaan merusak persatuan dan bertentangan dengan sila kedua dan ketiga. Keberagaman diakui dan dilindungi negara, bukan untuk direndahkan. Coba pertimbangkan pilihan lain."
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
    "target": "bhinneka",
    "label": "Menghormati teman yang berbeda suku dan agama"
  },
  {
    "target": "bhinneka",
    "label": "Menghargai bahasa daerah yang dipakai teman"
  },
  {
    "target": "bhinneka",
    "label": "Merayakan keberagaman budaya di sekolah"
  },
  {
    "target": "bhinneka",
    "label": "Tidak memaksakan keyakinan kepada orang lain"
  },
  {
    "target": "nkri",
    "label": "Menjaga keutuhan wilayah Indonesia"
  },
  {
    "target": "nkri",
    "label": "Menaati hukum yang berlaku di seluruh Indonesia"
  },
  {
    "target": "nkri",
    "label": "Bangga menjadi bagian dari satu negara Indonesia"
  },
  {
    "target": "nkri",
    "label": "Menolak ajakan memecah belah NKRI"
  }
];
  var NAMA_SLOT = {"bhinneka": "hubungan dengan Bhinneka Tunggal Ika", "nkri": "hubungan dengan NKRI"};
  var TL_LABEL = 'kelompok ini';
  var TL_DONE_MSG = 'Sempurna! Kedelapan kartu sudah terpilah tepat. Keberagaman dihargai lewat semangat Bhinneka Tunggal Ika, dan keutuhan bangsa dijaga dalam bingkai NKRI — keduanya berlandaskan sila ketiga Pancasila.';
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
  var MATCH = {
  "p36a": {
    "value": "Lambang negara Garuda Pancasila",
    "okMsg": "Tepat: Pasal 36A mengatur lambang negara, yaitu Garuda Pancasila dengan semboyan Bhinneka Tunggal Ika.",
    "noMsg": "Belum tepat. Pasal 36A mengatur lambang negara Garuda Pancasila."
  },
  "p11": {
    "value": "Negara kesatuan berbentuk republik",
    "okMsg": "Tepat: Pasal 1 ayat (1) menegaskan Indonesia ialah negara kesatuan yang berbentuk republik.",
    "noMsg": "Belum tepat. Pasal 1 ayat (1) menegaskan bentuk negara kesatuan yang berbentuk republik."
  },
  "p375": {
    "value": "Bentuk NKRI tidak dapat dilakukan perubahan",
    "okMsg": "Tepat: Pasal 37 ayat (5) menyatakan bentuk negara kesatuan tidak dapat dilakukan perubahan.",
    "noMsg": "Belum tepat. Pasal 37 ayat (5) menyatakan bentuk NKRI tidak dapat dilakukan perubahan."
  },
  "p32": {
    "value": "Kebudayaan nasional dan bahasa daerah",
    "okMsg": "Tepat: Pasal 32 mengatur kebudayaan nasional dan penghormatan bahasa daerah sebagai kekayaan kebudayaan nasional.",
    "noMsg": "Belum tepat. Pasal 32 mengatur kebudayaan nasional dan bahasa daerah."
  }
};
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
        showFb($('matchFb'), true, 'Semua pasangan tepat! Pasal 36A lambang negara, Pasal 1 ayat (1) negara kesatuan, Pasal 37 ayat (5) bentuk NKRI tidak dapat diubah, dan Pasal 32 kebudayaan nasional.');
        markVisited('sub4');
      } else {
        showFb($('matchFb'), false, 'Sebagian pasangan belum tepat. Perhatikan keterangan di bawah tiap baris, lalu perbaiki.');
      }
    });
  }

  /* ---------- Sub-bab 4: urutkan langkah ---------- */
  var URUTAN = [];
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
        showFb(fb, true, '');
        markVisited('sub4');
      } else {
        showFb(fb, false, benar + ' dari ' + URUTAN.length + ' posisi sudah tepat. Urutan yang benar: ' + URUTAN.map(function (u, i) { return (i + 1) + ') ' + u; }).join(', ') + '.');
      }
    });
  }

  /* ---------- Sub-bab 5: komitmen ---------- */
  var komitmenText = $('komitmenText');
  if (komitmenText) {
    var simpanan = read('mpi-pp-p9-komitmen', '');
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
      store('mpi-pp-p9-komitmen', isi);
      if (st) st.textContent = 'Komitmen tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '. Tunjukkan kepada gurumu pada pertemuan berikutnya.';
      markVisited('sub5');
    });
  }

  /* ---------- Sub-bab 6: kuis 10 soal ---------- */
  /* Sebaran topik: soal 1-3 sila ketiga, semboyan & lambang negara,
     4-8 pasal-pasal keberagaman dan NKRI, 9-10 makna & sikap.
     Kunci terverifikasi manual, distribusinya seimbang A2/B3/C2/D3:
     1) B  2) C  3) D  4) A  5) D  6) B  7) A  8) C  9) B  10) D */
  var QUIZ = [
  {
    "q": "Sila Pancasila yang menjadi landasan semangat Bhinneka Tunggal Ika dan NKRI adalah sila …",
    "options": [
      "pertama",
      "ketiga, Persatuan Indonesia",
      "kelima",
      "kedua"
    ],
    "answer": 1,
    "why": "Sila ketiga, Persatuan Indonesia, adalah landasan semangat Bhinneka Tunggal Ika dan Negara Kesatuan Republik Indonesia."
  },
  {
    "q": "Semboyan Bhinneka Tunggal Ika tercantum pada lambang negara, yaitu …",
    "options": [
      "Bendera Merah Putih",
      "Burung Elang Jawa",
      "Garuda Pancasila",
      "Pohon Beringin"
    ],
    "answer": 2,
    "why": "Bhinneka Tunggal Ika adalah semboyan yang menjadi bagian lambang negara Garuda Pancasila, tercengkeram pada pita yang dicengkeram Garuda."
  },
  {
    "q": "Bentuk Negara Kesatuan Republik Indonesia tidak dapat dilakukan perubahan. Ketentuan ini ditegaskan dalam Pasal …",
    "options": [
      "1 ayat (1)",
      "36A",
      "32",
      "37 ayat (5)"
    ],
    "answer": 3,
    "why": "Pasal 37 ayat (5) UUD NRI 1945 secara khusus menyatakan bahwa bentuk Negara Kesatuan Republik Indonesia tidak dapat dilakukan perubahan."
  },
  {
    "q": "Kedudukan lambang negara Garuda Pancasila diatur dalam UUD NRI 1945 Pasal …",
    "options": [
      "36A",
      "1 ayat (1)",
      "18B ayat (2)",
      "28I ayat (3)"
    ],
    "answer": 0,
    "why": "Pasal 36A mengatur bahwa lambang negara ialah Garuda Pancasila dengan semboyan Bhinneka Tunggal Ika."
  },
  {
    "q": "Pengakuan negara terhadap kesatuan masyarakat hukum adat beserta hak tradisionalnya diatur dalam Pasal …",
    "options": [
      "32",
      "36A",
      "28I ayat (3)",
      "18B ayat (2)"
    ],
    "answer": 3,
    "why": "Pasal 18B ayat (2) menyatakan negara mengakui dan menghormati kesatuan-kesatuan masyarakat hukum adat beserta hak-hak tradisionalnya."
  },
  {
    "q": "Identitas budaya dan hak masyarakat tradisional dihormati selaras dengan perkembangan zaman menurut Pasal …",
    "options": [
      "18B ayat (2)",
      "28I ayat (3)",
      "1 ayat (1)",
      "37 ayat (5)"
    ],
    "answer": 1,
    "why": "Pasal 28I ayat (3) menyatakan identitas budaya dan hak masyarakat tradisional dihormati selaras dengan perkembangan zaman dan peradaban."
  },
  {
    "q": "Kebudayaan nasional dan penghormatan terhadap bahasa daerah diatur dalam Pasal …",
    "options": [
      "32",
      "36A",
      "29",
      "33"
    ],
    "answer": 0,
    "why": "Pasal 32 mengatur bahwa negara memajukan kebudayaan nasional dan menghormati serta memelihara bahasa daerah sebagai kekayaan kebudayaan nasional."
  },
  {
    "q": "Bentuk negara kesatuan ditegaskan dalam UUD NRI 1945 Pasal …",
    "options": [
      "1 ayat (2)",
      "37 ayat (5)",
      "1 ayat (1)",
      "36A"
    ],
    "answer": 2,
    "why": "Pasal 1 ayat (1) berbunyi: Negara Indonesia ialah negara kesatuan, yang berbentuk Republik."
  },
  {
    "q": "Arti semboyan Bhinneka Tunggal Ika adalah …",
    "options": [
      "berbeda-beda suku dan budaya",
      "berbeda-beda tetapi tetap satu jua",
      "satu bahasa satu bangsa",
      "bersatu kita teguh"
    ],
    "answer": 1,
    "why": "Bhinneka Tunggal Ika berarti berbeda-beda tetapi tetap satu jua: keberagaman yang diikat oleh persatuan."
  },
  {
    "q": "Sikap sila keempat yang menopang persatuan dalam keberagaman adalah …",
    "options": [
      "memaksakan kehendak mayoritas",
      "menjauhi golongan lain",
      "mengutamakan kepentingan pribadi",
      "musyawarah antar-golongan untuk mencapai mufakat"
    ],
    "answer": 3,
    "why": "Sila keempat menopang keberagaman lewat musyawarah antar-golongan: perbedaan diselesaikan dengan hikmat kebijaksanaan, bukan paksaan."
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
      msg.textContent = qScore === 10 ? 'Sempurna! Kamu menguasai hubungan Pancasila dengan Bhinneka Tunggal Ika dan NKRI.'
        : qScore >= 8 ? 'Hebat! Tinggal sedikit lagi menuju sempurna.'
        : qScore >= 6 ? 'Bagus! Ulangi bagian yang masih salah, lalu coba lagi.'
        : 'Terus berlatih! Buka lagi materi pasal-pasal keberagaman di Sub-bab 2 dan permainan di Sub-bab 4, lalu ulangi kuisnya.';
    }
    var prevBest = read('mpi-pp-p9-quiz-best', null);
    var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-pp-p9-quiz-best', String(qScore));
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
    try { saved = JSON.parse(read('mpi-pp-p9-refleksi', 'null')); } catch (e) { saved = null; }
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
      store('mpi-pp-p9-refleksi', JSON.stringify(data));
      var st = $('refStatus');
      if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
      markVisited('sub6');
    });
  }
})();
