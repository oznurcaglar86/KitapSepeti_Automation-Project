# 📚 Kitapsepeti.com QA Otomasyon Projesi 🚀

## 📝 Proje Hakkında

Bu proje, canlı bir e-ticaret sitesi olan **Kitapsepeti.com** üzerinde temel e-ticaret akışlarının QA otomasyon testi amacıyla hazırlanmıştır. Amaç, kullanıcıların alışveriş deneyimini kesintisiz ve güvenli şekilde tamamlayabilmesini sağlayan kritik akışları test etmektir.

**🛒 Test Edilen Akışlar:**

1. 👤 Kullanıcı Girişi
2. 🔍 Ürün Arama ve Listeleme
3. 🛍️ Ürün Detay Sayfası Görüntüleme ve Sepete Ekleme
4. 🧺 Sepet Yönetimi ve Kontrolü
5. 💳 Ödeme ve Sipariş Onayı
6. 🏷️ Misafir Olarak Satın Alma Akışı

> ⚠️ Not: Canlı sistem üzerinde test yapılacağı için gerçek sipariş oluşturulmamış, sahte kullanıcı verileri kullanılmıştır.

## ✅ Test Kapsamı

* Pozitif ve negatif senaryolar her User Story için yazılmıştır.
* Testler, ürün fiyat ve isimlerini sayfadan dinamik olarak okumaktadır.
* Gerçek kullanıcı ve sipariş bilgileri kullanılmamıştır.

## 📑 Test Senaryoları Dokümanı

User Story ve kabul kriterleri ile eşleşen test senaryoları [KitapSepetiAutomationProject](https://docs.google.com/spreadsheets/d/169_lRITHO6gTBtGGJF4SMQtzwywgMll_Os456b_6o1Y/edit?usp=sharing) üzerinden erişilebilir.

## 🛠️ Kullanılan Teknolojiler

* **JavaScript**
* **Cypress** (E2E Test Otomasyonu)
* **Mochawesome** (HTML test raporları)
* Page Object Model (POM) mimarisi
* GitHub + GitHub Actions (CI/CD workflow)

## 📂 Proje Klasör Yapısı
<img width="594" height="534" alt="2025-11-16_00-26-39" src="https://github.com/user-attachments/assets/b6155a52-4a41-4e57-9125-95c16a654546" />

<img width="133" height="460" alt="2025-11-16_01-24-08" src="https://github.com/user-attachments/assets/0f8ead3f-b86e-434e-87c6-5b14f14b85af" />

## ⚡ Kurulum ve Çalıştırma

1. Repo klonla:

```bash
git clone https://github.com/<kullaniciAdi>/kitapsepeti-qa.git
cd kitapsepeti-qa
```

2. Bağımlılıkları yükle:

```bash
npm ci
```

3. Cypress UI ile testleri çalıştır:

```bash
npx cypress open
```

4. Testleri headless modda çalıştır ve rapor oluştur:

```bash
npm run test:ci
```

> ℹ️ Not: `test:ci` script’i tüm testleri çalıştırır, screenshot ve video üretir, Mochawesome raporu oluşturur.


📊 Test Raporları

📄 Birleşik Mochawesome Raporu

🌐 [Mocha Test Raporu](https://oznurcaglar86.github.io/KitapSepeti_Automation-Project/cypress/reports/html/merged-report.html)  

Bu projede tüm User Story'lere ait test sonuçları tek bir birleşik HTML raporu altında toplanmaktadır.

Rapor içerisinde aşağıdaki bilgiler detaylı şekilde sunulur:

🔎 Her testin senaryo açıklaması ve ilgili User Story bağlantısı

🟢 Passed, 🔴 Failed, ⚪ Skipped test durumları

📷 Hata anında otomatik alınan screenshot’lar

📝 Adım adım test yürütme log’ları

⏱️ Test süresi, toplam koşu sayısı ve özet performans bilgileri

## 🏗️ CI / GitHub Actions

* Her push ve pull request'te testler otomatik çalıştırılır.
* Test sonuçları, screenshots, video ve HTML rapor olarak artifacts şeklinde saklanır.





---

**Proje Sahibi:** Öznur Çağlar

