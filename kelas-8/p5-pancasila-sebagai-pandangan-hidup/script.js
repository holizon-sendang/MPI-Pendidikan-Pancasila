/* P.5 Pancasila sebagai Pandangan Hidup Bangsa — script.js
   Vanilla JS, tanpa framework. Fakta dan kunci jawaban mengikuti
   buku teks Pendidikan Pancasila Fase D dan fakta baku yang aman.
   localStorage (semua berawalan mpi-pp-p5- agar tidak bertabrakan
   dengan modul lain pada domain github.io yang sama):
   mpi-pp-p5-visited, mpi-pp-p5-quiz-best, mpi-pp-p5-polling,
   mpi-pp-p5-komitmen, mpi-pp-p5-refleksi. */
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
  try { visited = JSON.parse(read('mpi-pp-p5-visited', '[]')) || []; } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];

  function saveVisited() { store('mpi-pp-p5-visited', JSON.stringify(visited)); }
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
  var bestStored = read('mpi-pp-p5-quiz-best', null);
  if (bestStored !== null && bestEl) {
    bestEl.textContent = 'Skor terbaik kuis: ' + bestStored + '/10';
    bestEl.hidden = false;
  }

  /* ---------- Sub-bab 1: polling ---------- */
  var POLL_MSG = {
  "pribadi": "Tercatat! Benar, pandangan hidup menuntun kehidupan pribadi: kejujuran saat tidak ada yang melihat, misalnya. Pancasila sebagai pandangan hidup juga menuntun kita dalam bermasyarakat dan berbangsa, seperti akan kamu pelajari di modul ini.",
  "bersama": "Tercatat! Benar, pandangan hidup tampak jelas saat kita bersama orang lain: menghargai perbedaan, menolong, dan bermusyawarah. Ia juga menuntun kehidupan pribadi dan berbangsa, seperti akan kamu pelajari di modul ini.",
  "bangsa": "Tercatat! Pandangan hidup memang menuntun kehidupan berbangsa, tetapi ia tidak hanya bekerja pada peristiwa besar. Ia menuntun hal-hal kecil sehari-hari: di rumah, di sekolah, dan di masyarakat. Modul ini menunjukkan contohnya per sila."
};
  function renderPoll(pilihan, simpan) {
    document.querySelectorAll('[data-poll]').forEach(function (btn) {
      btn.classList.toggle('chosen', btn.getAttribute('data-poll') === pilihan);
    });
    if (pilihan && POLL_MSG[pilihan]) {
      showFb($('pollFb'), true, POLL_MSG[pilihan]);
      if (simpan) store('mpi-pp-p5-polling', pilihan);
    }
  }
  document.querySelectorAll('[data-poll]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      renderPoll(btn.getAttribute('data-poll'), true);
      markVisited('sub1');
    });
  });
  renderPoll(read('mpi-pp-p5-polling', null), false);

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
    "msg": "Mengikuti ajakan yang salah demi diterima kelompok berarti membiarkan kelompok menjadi pedomanmu, bukan nilai yang kamu yakini. Pandangan hidup Pancasila menuntun kita berani bersikap benar. Coba pertimbangkan pilihan lain."
  },
  "tolak": {
    "ok": true,
    "msg": "Tepat! Kamu menjadikan nilai yang kamu yakini sebagai pedoman sikap: menolak ajakan yang salah dengan cara yang baik, bahkan mengajak teman kembali. Itulah pandangan hidup yang bekerja dalam kehidupan sehari-hari."
  },
  "diam2": {
    "ok": false,
    "msg": "Tidak ikut memang lebih baik daripada ikut, tetapi diam saja melewatkan kesempatan mengajak teman ke arah yang benar. Pandangan hidup bukan hanya untuk diri sendiri; ia juga menuntun kita peduli pada orang di sekitar kita. Coba pertimbangkan pilihan lain."
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
    "target": "sila1",
    "label": "Berdoa sebelum belajar sesuai agama masing-masing"
  },
  {
    "target": "sila1",
    "label": "Menghormati teman yang sedang menjalankan ibadah"
  },
  {
    "target": "sila2",
    "label": "Menolong teman yang terjatuh di sekolah"
  },
  {
    "target": "sila2",
    "label": "Mengumpulkan bantuan untuk korban bencana alam"
  },
  {
    "target": "sila3",
    "label": "Mengutamakan kepentingan kelas di atas kepentingan kelompok sendiri"
  },
  {
    "target": "sila3",
    "label": "Bangga menggunakan produk buatan Indonesia"
  },
  {
    "target": "sila4",
    "label": "Memilih ketua kelompok melalui musyawarah"
  },
  {
    "target": "sila4",
    "label": "Mendengarkan semua pendapat sebelum mengambil keputusan bersama"
  },
  {
    "target": "sila5",
    "label": "Membagi tugas kelompok secara adil untuk semua anggota"
  },
  {
    "target": "sila5",
    "label": "Tidak membeda-bedakan teman dalam bergaul"
  }
];
  var NAMA_SLOT = {
  "sila1": "Sila 1 · Ketuhanan",
  "sila2": "Sila 2 · Kemanusiaan",
  "sila3": "Sila 3 · Persatuan",
  "sila4": "Sila 4 · Kerakyatan",
  "sila5": "Sila 5 · Keadilan"
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
        showFb($('tlFb'), true, 'Sempurna! Kesepuluh kartu sudah berada pada sila yang benar. Kamu sudah bisa membaca sikap sehari-hari dengan “kacamata” Pancasila sebagai pandangan hidup bangsa.');
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
    var simpanan = read('mpi-pp-p5-komitmen', '');
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
      store('mpi-pp-p5-komitmen', isi);
      if (st) st.textContent = 'Komitmen tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '. Tunjukkan kepada gurumu pada pertemuan berikutnya.';
      markVisited('sub5');
    });
  }

  /* ---------- Sub-bab 6: kuis 10 soal ---------- */
  /* Topik: pengertian pandangan hidup, sumber, fungsi, dan sikap per sila.
     Kunci terverifikasi manual, distribusinya seimbang A2/B3/C2/D3:
     1) B  2) C  3) D  4) A  5) D  6) B  7) A  8) C  9) B  10) D */
  var QUIZ = [
  {
    "q": "Pandangan hidup suatu bangsa adalah …",
    "options": [
      "daftar hari libur nasional bangsa tersebut",
      "kristalisasi nilai-nilai yang diyakini kebenarannya dan dijadikan pedoman bersikap dan bertingkah laku sehari-hari",
      "kumpulan peraturan lalu lintas bangsa tersebut",
      "daftar makanan khas bangsa tersebut"
    ],
    "answer": 1,
    "why": "Pandangan hidup adalah kristalisasi nilai-nilai yang diyakini kebenarannya oleh suatu bangsa dan dijadikan pedoman dalam bersikap dan bertingkah laku sehari-hari."
  },
  {
    "q": "Pandangan hidup bangsa Indonesia bersumber dari …",
    "options": [
      "budaya negara-negara maju",
      "perintah bangsa penjajah dahulu",
      "kepribadian dan budaya bangsa Indonesia sendiri",
      "hasil meniru bangsa lain"
    ],
    "answer": 2,
    "why": "Bagi bangsa Indonesia, pandangan hidup bersumber dari kepribadian dan budaya bangsa sendiri, seperti nilai religius, kekeluargaan, gotong royong, dan musyawarah."
  },
  {
    "q": "Fungsi Pancasila sebagai pandangan hidup bangsa adalah sebagai …",
    "options": [
      "alat menghukum warga yang berbeda pendapat",
      "syarat administratif membuat dokumen negara",
      "hiasan dalam upacara kenegaraan",
      "pedoman dan penuntun dalam kehidupan pribadi, bermasyarakat, dan berbangsa"
    ],
    "answer": 3,
    "why": "Pancasila sebagai pandangan hidup berfungsi sebagai pedoman dan penuntun dalam kehidupan pribadi, bermasyarakat, dan berbangsa."
  },
  {
    "q": "Sikap yang sesuai dengan sila pertama Pancasila sebagai pandangan hidup adalah …",
    "options": [
      "menghormati teman yang berbeda agama saat menjalankan ibadah",
      "memilih ketua kelas dengan suara terbanyak",
      "membagi tugas secara adil",
      "menolong korban bencana"
    ],
    "answer": 0,
    "why": "Sila pertama, Ketuhanan Yang Maha Esa, diwujudkan antara lain dengan beribadah sesuai agama masing-masing dan menghormati pemeluk agama lain."
  },
  {
    "q": "Menolong teman yang kesulitan tanpa membeda-bedakan latar belakangnya adalah sikap sesuai sila …",
    "options": [
      "pertama",
      "ketiga",
      "keempat",
      "kedua"
    ],
    "answer": 3,
    "why": "Menolong sesama secara manusiawi adalah perwujudan sila kedua, Kemanusiaan yang adil dan beradab."
  },
  {
    "q": "Mengutamakan kepentingan bersama di atas kepentingan kelompok sendiri adalah sikap sesuai sila …",
    "options": [
      "kedua",
      "ketiga",
      "kelima",
      "pertama"
    ],
    "answer": 1,
    "why": "Mengutamakan kepentingan bersama dan menjaga persatuan adalah perwujudan sila ketiga, Persatuan Indonesia."
  },
  {
    "q": "Sikap yang sesuai dengan sila keempat sebagai pandangan hidup adalah …",
    "options": [
      "menyelesaikan perbedaan pendapat melalui musyawarah",
      "berdoa sebelum makan",
      "membeli produk dalam negeri",
      "membantu tetangga yang sakit"
    ],
    "answer": 0,
    "why": "Sila keempat, Kerakyatan yang dipimpin oleh hikmat kebijaksanaan dalam permusyawaratan/perwakilan, diwujudkan melalui musyawarah dalam mengambil keputusan."
  },
  {
    "q": "Membagi tugas kelompok secara adil dan menghargai hasil karya orang lain adalah sikap sesuai sila …",
    "options": [
      "ketiga",
      "pertama",
      "kelima",
      "keempat"
    ],
    "answer": 2,
    "why": "Bersikap adil dan menghargai hasil karya orang lain adalah perwujudan sila kelima, Keadilan sosial bagi seluruh rakyat Indonesia."
  },
  {
    "q": "Pandangan hidup bangsa Indonesia berupa nilai-nilai yang telah lama hidup dalam masyarakat, seperti gotong royong dan musyawarah. Hal ini menunjukkan pandangan hidup tersebut …",
    "options": [
      "dibuat oleh bangsa lain",
      "bersumber dari kepribadian dan budaya bangsa sendiri",
      "baru muncul pada zaman media sosial",
      "hanya berlaku di sekolah"
    ],
    "answer": 1,
    "why": "Gotong royong dan musyawarah adalah nilai budaya bangsa Indonesia sendiri yang dikristalisasikan dalam Pancasila."
  },
  {
    "q": "Seseorang yang menjadikan Pancasila sebagai pandangan hidup akan …",
    "options": [
      "menghafal Pancasila hanya saat ujian",
      "memakai Pancasila hanya pada upacara",
      "melupakan Pancasila setelah lulus sekolah",
      "menjadikan nilai-nilai Pancasila sebagai pedoman sikap dan tingkah lakunya sehari-hari"
    ],
    "answer": 3,
    "why": "Pandangan hidup bekerja sebagai pedoman nyata dalam bersikap dan bertingkah laku sehari-hari, bukan sekadar hafalan."
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
    var prevBest = read('mpi-pp-p5-quiz-best', null);
    var prevNum = prevBest === null ? -1 : Number(prevBest);
    if (qScore > prevNum) store('mpi-pp-p5-quiz-best', String(qScore));
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
    try { saved = JSON.parse(read('mpi-pp-p5-refleksi', 'null')); } catch (e) { saved = null; }
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
      store('mpi-pp-p5-refleksi', JSON.stringify(data));
      var st = $('refStatus');
      if (st) st.textContent = 'Refleksi tersimpan di perangkat ini pada ' + new Date().toLocaleString('id-ID') + '.';
      markVisited('sub6');
    });
  }
})();
