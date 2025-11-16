class PaymentPage {
    elements = {
        checkoutButton: () => cy.get("#cart-buy-btn"), // Sepet sayfasındaki Satın Al butonu
        continueShipping: () => cy.get('#cart-back-btn'), // Alışverişe Devam Et butonu
        addressPageTitle: () => cy.get("a[href='/order/']"), // Adres bilgileri başlığı
        addressBox: () => cy.get(".address-box.active"), // Aktif adres kutusu
        addressTitle: () => cy.get(".address-title"), // Adres başlığı
        deliveryRadio: () => cy.get("input[name='delivery_address']"), // Teslimat adresi seçimi
        invoiceRadio: () => cy.get("input[name='invoice_address']"), // Fatura adresi seçimi
        proceedPaymentButton: () => cy.get(".order-next-btn"),
        cargoList: () => cy.get(".payment-cargo-list"),
        cargoOptions: () => cy.get(".cargo-options .cargo-option-item"),
        cargoNames: () => cy.get(".cargo-content strong"),
        activeCargo: () =>
            cy.get(".cargo-option-item.active .cargo-content strong"),
        // "Kartla Ödeme" sekmesi
        cardPaymentTab: () => cy.get("#iyz-tab-credit-card"),

        // Kredi kartı form alanları
        cardHolderInput: () => cy.get('input[name="cardHolderName"]'),
        cardNumberInput: () => cy.get('input[autocomplete="cc-number"]'),
        expiryDateInput: () => cy.get('input[autocomplete="cc-exp"]'),
        cvvInput: () => cy.get('input[autocomplete="cc-csc"]'),

        // Ödeme butonu
        payButton: () =>
            cy
                .get("#iyz-payment-button")
                .filter(':contains("ÖDE")', { timeout: 20000 }),
        emptyFieldError: () => cy.contains("Lütfen tüm alanları doldurunuz"),
        orderSummaryBox: () => cy.get("#order-summary"), // Sipariş özeti kutusu
        subtotalAmount: () =>
            cy.get("#order-summary div").contains("Sepet Toplamı").next(), // Sepet toplamı
        shippingFee: () => cy.get("#priceCargo"), // Kargo ücreti
        totalAmount: () =>
            cy.get("#order-summary div.fw-bold.text-primary").find("div").eq(1), // Genel toplam
    };

    visitHomePage() {
        cy.visit("https://www.kitapsepeti.com/");
    }

    closePopups() {
        cy.get("body").then(($body) => {
            if ($body.find(".ccp---nb-interstitial-overlay .ccp-close").length > 0) {
                cy.get(".ccp---nb-interstitial-overlay .ccp-close").click({
                    force: true,
                });
            }
            if ($body.find(".cc-nb-okagree").length > 0) {
                cy.get(".cc-nb-okagree").click({ force: true });
            }
        });
    }

    addProductToCartByName(productName) {
        cy.contains(".product-title", productName, { timeout: 10000 })
            .parents(".product-detail-card")
            .within(() => {
                cy.get(".add-to-cart-btn").click({ force: true });
            });

        cy.get("#popup-cart", { timeout: 15000 }).should("be.visible");
        cy.get("#cart-popup-go-cart").click({ force: true });
        cy.url({ timeout: 10000 }).should("include", "/sepet");
    }



    clickCheckoutButton() {
        // Satın Al butonunun görünmesini ve tıklanabilir olmasını bekle
        this.elements
            .checkoutButton()
            .should("be.visible")
            .and("not.be.disabled")
            .click({ force: true });

        // Adres bilgileri kutusunun yüklenmesini bekle
        cy.get(".address-box.active", { timeout: 15000 }).should("be.visible");
    }

    clickContinueShippingButton() {
        this.elements
            .continueShipping()
            .click({ force: true });
    }

    verifyAddressPage() {
        // URL kontrolü
        cy.url({ timeout: 10000 }).should("include", "/order");

        // Sayfa başlığı veya adres bilgileri alanı görünüyor mu
        this.elements
            .addressPageTitle()
            .should("be.visible")
            .and("contain.text", "Adres Bilgileri");
    }

    verifyAddressInformation() {
        this.elements.addressBox().should("be.visible").and("have.class", "active");
        this.elements.addressTitle().should("be.visible").and("not.be.empty");
        this.elements.deliveryRadio().should("exist");
        this.elements.invoiceRadio().should("exist");
    }

    clickProceedToPayment() {
        // Ödeme Adımına Geç butonunun görünmesini ve tıklanabilir olmasını bekle
        this.elements
            .proceedPaymentButton()
            .should("be.visible")
            .and("be.enabled")
            .click({ force: true });

        // Kargo seçenekleri kutusunun yüklenmesini bekle
        cy.get(".payment-cargo-list", { timeout: 30000 }).should("be.visible");
    }

    verifyPaymentPage() {
        cy.url({ timeout: 10000 }).should("include", "/order/payment");
    }

    verifyShippingOptions() {
        // Kargo Seçenekleri kutusunun görünür olduğunu doğrula
        this.elements.cargoList().should("be.visible");

        // Üç kargo seçeneği görünmeli
        this.elements.cargoOptions().should("have.length", 3);

        // Kargo isimlerinin doğru olduğunu doğrula
        this.elements.cargoNames().then(($names) => {
            const cargos = [...$names].map((el) => el.innerText.trim());
            expect(cargos).to.include.members(["PTT Kargo", "HEPSİJET", "DHL"]);
        });

        // PTT Kargo'nun varsayılan (active) olarak seçili olduğunu doğrula
        this.elements.activeCargo().should("have.text", "PTT Kargo");
    }
    verifyPaymentOptions() {
        // Ödeme Seçenekleri container'ının yüklenmesini bekle
        cy.get("#iyz-tablist", { timeout: 20000 })
            .should("exist")
            .and("be.visible");

        // İyzico ve Kartla Ödeme seçeneklerini kontrol et
        cy.get("#iyz-tab-payWithIyzico")
            .should("be.visible")
            .and("not.be.disabled");
        cy.get("#iyz-tab-credit-card").should("be.visible").and("not.be.disabled");

        // Opsiyonel: Etiket text'lerini kontrol et
        cy.get("#iyz-tab-payWithIyzico span").should("contain.text", "KART");
        cy.get("#iyz-tab-credit-card span").should("contain.text", "Kartla Ödeme");
    }
    clickCardPaymentTab() {
        // iyzico container'ın yüklenmesini bekle
        cy.get("#iyz-tablist", { timeout: 15000 }).should("be.visible");

        // “Kartla Ödeme” sekmesini bekle ve tıkla
        this.elements
            .cardPaymentTab()
            .should("exist")
            .and("be.visible")
            .click({ force: true });
    }

    verifyCreditCardFormVisible() {
        // Formun yüklendiğini doğrula
        this.elements.cardHolderInput({ timeout: 10000 }).should("be.visible");
        this.elements.cardNumberInput().should("be.visible");
        this.elements.expiryDateInput().should("be.visible");
        this.elements.cvvInput().should("be.visible");
        this.elements.payButton().should("contain.text", "ÖDE");
    }

    fillCreditCardForm() {
        cy.fixture("testData").then((data) => {
            const card = data.payment;

            cy.get('input[name="cardHolderName"]', { timeout: 20000 })
                .should('be.visible')
                .type(card.cardHolderName, { force: true });

            cy.get('#ccnumber', { timeout: 20000 })
                .should('be.visible')
                .type(card.cardNumber, { force: true });

            cy.get('#ccexp', { timeout: 20000 })
                .should('be.visible')
                .type(card.expiryDate, { force: true });

            cy.get('#cccvc', { timeout: 20000 })
                .should('be.visible')
                .type(card.cvv, { force: true });
        });
    }


    verifyPayButtonIsEnabled() {
        // Önce butonun DOM’a geldiğinden emin ol
        this.elements
            .payButton()
            .should("exist")
            .and("be.visible")
            .and("not.have.attr", "disabled");

        // İçerik kontrolü: “ÖDE” kelimesini içermeli
        this.elements
            .payButton()
            .invoke("text")
            .then((text) => {
                cy.log("Buton texti:", text.trim());
                expect(text).to.include("ÖDE");
            });

        this.elements
            .payButton()
            .should("have.css", "background-color", "rgb(30, 100, 255)");
    }
    clickPayButton() {
        this.elements.payButton().should("be.visible").click({ force: true });
    }
    verifyEmptyFieldsError() {
        // Hata mesajı görünür olmalı
        this.elements
            .emptyFieldError()
            .should("be.visible")
            .and("have.css", "color")
            .and("eq", "rgb(250, 82, 82)"); // kırmızı
        // Buton halen pasif
        this.elements
            .payButton()
            .should("have.css", "background-color")
            .then((color) => {
                expect(color).to.not.eq("rgb(30, 100, 255)"); // aktif mavi değil
            });
    }
    verifyOrderSummary() {
        // Sipariş özeti kutusunun görünür olmasını bekle
        cy.get("body").then(($body) => {
            // Eğer backdrop varsa kapanmasını bekle
            if ($body.find("#orderBackdrop").is(":visible")) {
                cy.wait(2000);
            }
        });

        // Sipariş özeti kutusunun varlığını doğrula
        this.elements.orderSummaryBox().should("exist");

        // Değerleri saklamak için değişkenler
        let subtotal = 0;
        let shipping = 0;
        let total = 0;

        // Sepet toplamını al
        this.elements
            .subtotalAmount()
            .invoke("text")
            .then((text) => {
                subtotal = parseFloat(text.replace(/[^\d,]/g, "").replace(",", "."));
                cy.log("Sepet Toplamı: " + subtotal);
            });

        // --- TRY / CATCH ile kargo ücreti güvenli okuma ---
        cy.get("body").then(($body) => {
            try {
                if ($body.find("#priceCargo").length > 0) {
                    const text = $body.find("#priceCargo").text().trim();
                    if (text) {
                        shipping = parseFloat(text.replace(",", "."));
                        cy.log("Kargo Ücreti: " + shipping);
                    } else {
                        cy.log("Kargo Ücreti boş geldi, 0 kabul edildi");
                        shipping = 0;
                    }
                } else if (
                    $body
                        .find(".fw-bold.text-uppercase.text-primary")
                        .text()
                        .includes("BEDAVA")
                ) {
                    cy.log("İyzico ile Öde’de BEDAVA, kargo 0 kabul edildi");
                    shipping = 0;
                } else {
                    cy.log("Kargo elemanı bulunamadı, 0 kabul edildi");
                    shipping = 0;
                }
            } catch (err) {
                cy.log("Kargo alanı okunamadı, 0 kabul edildi");
                shipping = 0;
            }
        });

        // Genel toplamı al ve kontrol et
        this.elements
            .totalAmount()
            .invoke("text")
            .then((text) => {
                total = parseFloat(text.replace(/[^\d,]/g, "").replace(",", "."));
                cy.log("Genel Toplam: " + total);

                // Hesap kontrolü (kargo ücretsizse subtotal == total olmalı)
                const expectedTotal = parseFloat((subtotal + shipping).toFixed(2));
                cy.log(`Beklenen toplam: ${expectedTotal}`);

                expect(total).to.be.closeTo(expectedTotal, 0.1);
            });
    }
}

export default new PaymentPage();
