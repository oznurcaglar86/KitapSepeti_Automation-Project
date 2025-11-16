import BasketPage from "../pages/BasketPage";
import PaymentPage from "../pages/PaymentPage";

describe("User Story - 05 - Ödeme ve Sipariş Onayı", () => {
    before(() => {
        // 🔹 API üzerinden login ol (tek sefer)
        cy.loginViaApi();
        PaymentPage.visitHomePage();
        PaymentPage.closePopups();
    });

    beforeEach(() => {
        // 🔹 Her testte session’ı geri yükle
        cy.loginViaApi();

        // 🔹 Siteye git ve popup kapat
        PaymentPage.visitHomePage();
        PaymentPage.closePopups();
        BasketPage.openCartSidebar();
        BasketPage.clickGoToCart();
    });

    it("TC35: Satın Al butonuna tıklanınca kullanıcı adres bilgileri sayfasına yönlendirilmeli", () => {
        PaymentPage.clickContinueShippingButton();
        PaymentPage.addProductToCartByName("Gökçen 4 - Hediyeli Kutu");
        PaymentPage.clickCheckoutButton();
        PaymentPage.verifyAddressPage();
    });

    it("TC36 - Pozitif: 'Ödeme Adımına Geç' butonu ödeme sayfasına yönlendirmeli", () => {
        PaymentPage.clickCheckoutButton();

        // 3️⃣ Adres Bilgileri sayfasında olunduğunu doğrula
        PaymentPage.verifyAddressPage();

        // 4️⃣ Adres bilgilerinin göründüğünü doğrula
        PaymentPage.verifyAddressInformation();

        // 4️⃣ “Ödeme Adımına Geç” butonuna tıkla
        PaymentPage.clickProceedToPayment();

        // 5️⃣ Ödeme sayfasına yönlendirildiğini doğrula
        PaymentPage.verifyPaymentPage();
    });

    it("TC37: Kargo seçeneklerinin görüntülenmesi ve PTT Kargo’nun varsayılan seçimi", () => {
        PaymentPage.clickCheckoutButton();

        PaymentPage.clickProceedToPayment();

        PaymentPage.verifyShippingOptions();
    });
    it("TC38: Ödeme seçeneklerinin gösterimi", () => {
        PaymentPage.clickCheckoutButton(); // Satın Al
        PaymentPage.clickProceedToPayment(); // Ödeme Adımına Geç
        PaymentPage.verifyPaymentOptions(); // Ödeme seçeneklerini doğrula
    });
    it("TC39: Kartla Ödeme seçildiğinde kredi kartı formu görünür olmalı", () => {
        PaymentPage.clickCheckoutButton(); // Satın Al
        PaymentPage.clickProceedToPayment(); // Ödeme Adımına Geç
        PaymentPage.verifyPaymentOptions(); // Ödeme seçeneklerini doğrula
        // “Kartla Ödeme” sekmesine tıklanır
        PaymentPage.clickCardPaymentTab();

        // Kart formu alanları görünür olmalı
        PaymentPage.verifyCreditCardFormVisible();
    });
    it("TC40 Pozitif: Tüm alanlar doldurulunca ödeme butonunun aktif olması", () => {
        BasketPage.clickCheckoutButton();
        PaymentPage.clickProceedToPayment();
        PaymentPage.clickCardPaymentTab();
        PaymentPage.fillCreditCardForm(); // fixture’dan okuyor artık ✅
        PaymentPage.verifyPayButtonIsEnabled();
    });
    it("TC41 - Negatif: Eksik alanlar doldurulmadan ödeme butonuna tıklama", () => {
        BasketPage.clickCheckoutButton();
        PaymentPage.clickProceedToPayment();
        PaymentPage.clickCardPaymentTab();
        PaymentPage.clickPayButton();
        PaymentPage.verifyEmptyFieldsError();
    });
    it("TC42 Pozitif: Sipariş özeti kutusu görünür ve genel toplam doğru olmalı", () => {
        BasketPage.clickCheckoutButton();
        PaymentPage.clickProceedToPayment();
        // Ödeme adımında sipariş özeti kontrolü
        PaymentPage.verifyOrderSummary();
    });
});
