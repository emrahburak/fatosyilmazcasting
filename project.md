## Marka İşareti — "f"

Form: Kaligrafi × Geometri sentezi

- Ana gövde: Geometrik, keskin ve dengeli iskelet
- f-bar ve kuyruk: Tek fırça hamlesi gibi organik, kıvrımlı hareket
- Keman referansı: f-bar köşelerinde ve kuyruğun içe kıvrılmasında ima
  Renk: Tek renk — #c9a96e açık zeminde / #1c1a17 koyu zeminde
  Format: SVG, degradesiz, her boyutta çalışır
  Kullanım: Favicon, navbar, sertifika başlığı, workshop afişi

## Sayfa Akışı

Hero → Hakkımda → Filmografi → Eğitimler → Katalog → İletişim

## Section Kararları

### Hero

- Dikey scroll
- Portre merkezde, tam ekran
- Cinzel ile isim + unvan
- Altın ayraç + şehirler: İstanbul · Zurich · Berlin · Amsterdam

### Hakkımda

- Scroll tetiklemeli timeline
- Ay Yapım'dan bugüne kronolojik akış
- Kişisel ses, ajans dili değil
- Crimson Pro italic alıntı

### Filmografi

- Öne çıkan 12 afiş — asimetrik editorial grid
- "Tüm Projeler" accordion ile genişler
- Her afişe tıklandığında sağdan açılan overlay panel
- Tek koyu (#1c1a17) arka plan section'ı bu

### Eğitimler

- 4 şehir: İstanbul · Zurich · Berlin · Amsterdam
- Her şehir: fotoğraf + tarih + sertifika modal
- JSON verisi müşteriden bekleniyor — iskelet hazır, içerik sonra

### Katalog

- Bonus section
- Tek buton → PDF modal (object tag)
- Müşteri talep etmedi, vazgeçilebilir

### İletişim

- Ayrı section, minimal
- Instagram + info@fatosyilmazcasting.com
- Diğer sosyal medya müşteriden gelirse eklenir

## Renk Paleti

- Background: #faf8f4
- Primary text: #1c1a17
- Secondary text: #3d3629
- Gold accent: #c9a96e
- Muted: #8c7560
- Dark exception: #1c1a17 — sadece Filmografi

## Tipografi

- Heading: Cinzel 400
- Body/quote: Crimson Pro 300 + italic
- Nav: Cinzel 400, 11px, tracking 0.16em

## Mimari

- Single page scroll
- Sıfır veritabanı, statik

## Data Files

- /data/education.json
- /data/projects.json
- /data/hero.json
- R2 catalog: getCatalogPdfUrl() ile erişim
