const fs = require('fs');
const path = require('path');

// JSON dosyasını oku (tam path ile)
const jsonPath = path.join(__dirname, 'sorular.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// LGS İnkılap quizlerini bul
const lgsInkilapQuizzes = data.filter(q => q.dersSlug === 'lgs-inkilap');

console.log(`Toplam ${lgsInkilapQuizzes.length} LGS İnkılap quizi bulundu.`);

// Her quiz için şıkları karıştır
lgsInkilapQuizzes.forEach((quiz, quizIndex) => {
  console.log(`\nQuiz ${quizIndex + 1}: ${quiz.quizBasligi}`);
  const sorular = quiz.sorular;
  
  // Her soru için şıkları karıştır
  sorular.forEach((soru, soruIndex) => {
    const siklar = soru.siklar;
    
    // Doğru cevabı bul
    const dogruSikIndex = siklar.findIndex(s => s.dogru);
    if (dogruSikIndex === -1) return;
    
    const dogruSik = siklar[dogruSikIndex];
    const yanlisSiklar = siklar.filter(s => !s.dogru);
    
    // Yanlış şıkları karıştır
    for (let i = yanlisSiklar.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [yanlisSiklar[i], yanlisSiklar[j]] = [yanlisSiklar[j], yanlisSiklar[i]];
    }
    
    // Doğru cevabı A, B, C, D pozisyonlarına dengeli dağıt
    // Her 4 soruda bir döngü: 0->A, 1->B, 2->C, 3->D
    const pozisyon = soruIndex % 4;
    
    // Yeni şıklar listesi oluştur
    const yeniSiklar = [];
    for (let j = 0; j < 4; j++) {
      if (j === pozisyon) {
        yeniSiklar.push(dogruSik);
      } else {
        yeniSiklar.push(yanlisSiklar.shift());
      }
    }
    
    // Şıkları güncelle
    soru.siklar = yeniSiklar;
  });
  
  console.log(`  ${sorular.length} soru işlendi`);
});

// JSON dosyasını kaydet (tam path ile)
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');

console.log('\n✅ Tüm LGS İnkılap sorularındaki şıklar dengeli dağıtıldı!');
