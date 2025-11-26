// src/utils/kartlariHazirla.js

// 1 doğru + 15 yanlış örnekle 16 kart üretir
export function kartlariHazirla(konu, dogruId) {
  const liste = konu.liste;

  // doğru örneği bul
  const dogru = liste.find((x) => x.id === dogruId);

  // diğer örneklerden yanlış havuzunu oluştur
  const yanlisHavuzu = liste.filter((x) => x.id !== dogruId);

  // yanlışlardan 15 tane rastgele seç
  const secilenYanlislar = shuffle(yanlisHavuzu).slice(0, 15);

  // 1 doğru + 15 yanlış kart oluştur
  const kartlar = [
    {
      id: dogru.id,
      metin: dogru.ornek,
      dogruMu: true,
    },
    ...secilenYanlislar.map((x) => ({
      id: x.id,
      metin: x.ornek,
      dogruMu: false,
    })),
  ];

  // karıştırıp geri gönder
  return shuffle(kartlar);
}

// Basit karıştırma algoritması
export function shuffle(arr) {
  const kopya = [...arr];
  for (let i = kopya.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [kopya[i], kopya[j]] = [kopya[j], kopya[i]];
  }
  return kopya;
}
