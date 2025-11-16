class GuestPurchasePage {
    elements = {
        productCard: () => cy.get(".product-detail-card", { timeout: 10000 }),
        addToCartButton: () => cy.get(".add-to-cart-btn"),
        buyNowButton: () =>
            cy.get("#cart-popup-continue-shopping", { timeout: 10000 }),
        pageTitle: () =>
            cy.get(".fw-bold.text-uppercase.text-nowrap", { timeout: 10000 }), // class selector düzeltildi
        loginTab: () => cy.get("#ug-login-tab li.d-flex.active a"), // Üye Girişi aktif tab
        registerTab: () => cy.get("#tab-register-form-131"), // Üye Ol sekmesi
        continueAsGuestButton: () =>
            cy.contains(
                ".w-100.btn.btn-dark.text-uppercase.fw-bold",
                "Üye Olmadan Devam Et"
            ),
        addressTitle: () =>
            cy.contains(
                "a.d-flex.align-items-center.w-100.px-1.border-round.text-uppercase.fw-bold.active.disable",
                "Adres Bilgileri"
            ),
        emailInput: () =>
            cy.get('#order-address-form input[name="email"]:visible', {
                timeout: 10000,
            }),
        fullNameInput: () =>
            cy.get('#order-address-form input[name="fullname"]:visible'),
        provinceSelect: () =>
            cy.get('#order-address-form select[name="city_code"]:visible'),
        districtSelect: () =>
            cy.get('#order-address-form select[name="town_code"]:visible'),
        neighborhoodSelect: () =>
            cy.get('#order-address-form select[name="district_code"]:visible'),
        addressTextArea: () =>
            cy.get('#order-address-form textarea[name="address"]:visible'),
        phoneInput: () =>
            cy.get('#order-address-form input[name="mobile_phone"]:visible'),
        saveAddressButton: () =>
            cy.get('#order-address-form button[type="submit"]:visible'),
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

    addProductFromHomePage(productIndex = 0) {
        // Ana sayfadan ürünü bul ve hover et
        this.elements.productCard().eq(productIndex).trigger("mouseover");

        // Sepete ekle butonuna tıkla (hover sonrası görünür)
        this.elements
            .productCard()
            .eq(productIndex)
            .within(() => {
                this.elements.addToCartButton().should("exist").click({ force: true });
            });

        // “Satın Al” butonuna tıklama
        this.elements.buyNowButton().should("be.visible").click({ force: true });
    }

    verifyRedirectToLoginPage() {
        cy.url().should("include", "/siparis-uye-giris");

        this.elements
            .loginTab()
            .should("be.visible")
            .and("contain.text", "Üye Girişi");
        this.elements
            .registerTab()
            .should("be.visible")
            .and("contain.text", "Üye Ol");
    }

    verifyContinueAsGuestButtonVisible() {
        this.elements
            .continueAsGuestButton()
            .should("be.visible")
            .and("not.be.disabled");
    }

    clickContinueAsGuestButton() {
        this.elements.continueAsGuestButton().click({ force: true });
    }

    verifyAddressPageLoaded() {
        cy.url().should("include", "/order");
        this.elements.addressTitle().should("be.visible");
    }
    verifyAddressFormFields() {
        this.elements.emailInput().should("be.visible");
        this.elements.fullNameInput().should("be.visible");
        this.elements.provinceSelect().should("be.visible");
        this.elements.districtSelect().should("be.visible");
        this.elements.neighborhoodSelect().should("be.visible");
        this.elements.addressTextArea().should("be.visible");
        this.elements.phoneInput().should("be.visible");
    }
    fillAddressFormWithoutFullName() {
        cy.fixture("testData.json").then((data) => {
            const address = data.guestAddress;

            // fullname boş bırakılıyor
            this.elements.emailInput().type(address.email);
            this.elements.provinceSelect().select(address.province);
            cy.wait(1000);
            this.elements.districtSelect().select(address.district);
            cy.wait(1000);
            this.elements.neighborhoodSelect().select(address.neighborhood);
            this.elements.addressTextArea().type(address.address);
            this.elements.phoneInput().type(address.phone);
        });
    }
    submitAddressForm() {
        this.elements.saveAddressButton().click({ force: true });
    }

    verifyFullNameErrorVisible() {
        cy.get('input[name="fullname"]')
            .parent() // popover-wrapper div
            .find("span.popover-item")
            .should("be.visible")
            .and("contain.text", "Lütfen bu alanı doldurunuz");
    }
    fillAddressForm() {
        cy.fixture("testData.json").then((data) => {
            const address = data.guestAddress;

            this.elements.emailInput().type(address.email);
            this.elements.fullNameInput().type(address.fullname);

            this.elements.provinceSelect().select(address.province);

            // İlçelerin yüklenmesini bekle
            cy.get('#order-address-form select[name="town_code"] option', { timeout: 15000 })
                .should("have.length.greaterThan", 1);

            this.elements.districtSelect().select(address.district);

            cy.get('#order-address-form select[name="district_code"] option', { timeout: 15000 })
                .should("have.length.greaterThan", 1);

            this.elements.neighborhoodSelect().select(address.neighborhood);

            this.elements.addressTextArea().type(address.address);
            this.elements.phoneInput().type(address.phone);
        });
    }

}

export default new GuestPurchasePage();
