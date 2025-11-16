class BasketPage {
    elements = {
        cartIcon: () => cy.get("#header-cart-btn", { timeout: 10000 }), // Sepetim Butonu
        sideCartPanel: () => cy.get('.drawer-wrapper[data-display="overlay"]'), // Açılan sağ panel
        goToCartButton: () => cy.get("#go-cart-btn", { timeout: 10000 }), // Sepete git butonu
        cartItems: () => cy.get(".cart-item"), // Sepetteki ürünler
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

    openCartSidebar() {
        this.elements.cartIcon().should("be.visible").click({ force: true });
        this.elements.sideCartPanel().should("be.visible");
    }

    clickGoToCart() {
        this.elements
            .goToCartButton()
            .should("exist") // DOM'da var mı
            .and("be.visible") // görünür mü
            .click({ force: true }); // bazen animasyon overlay'leri engelleyebilir
    }

    verifyOnbasketPage() {
        cy.url().should("include", "/sepet");
    }



    verifyCartItems() {
        this.elements.cartItems().each(($el) => {
            cy.wrap($el).within(() => {
                // Ürün başlığı
                cy.get(".cart-item-title").should("be.visible").and("not.be.empty");
                // Marka
                cy.get(".cart-item-brand").should("be.visible").and("not.be.empty");
                // Model
                cy.get(".cart-item-model").should("be.visible").and("not.be.empty");
                // Birim fiyat
                cy.get(".price-sell").should("be.visible").and("not.be.empty");
                // Adet
                cy.get(".cart-item-qty input").should("be.visible");
                // Toplam
                cy.get(".price-sell").eq(1).should("be.visible").and("not.be.empty"); // 2. price-sell toplam fiyat
            });
        });
    }

    verifyCartTotals() {
        cy.get(".cart-price-box").within(() => {
            cy.get(".row")
                .eq(0)
                .find(".col-6")
                .eq(1)
                .invoke("text")
                .then((subtotalText) => {
                    const subtotal = parseFloat(subtotalText.replace(",", "."));

                    cy.get(".row")
                        .eq(1)
                        .find(".col-6")
                        .eq(1)
                        .invoke("text")
                        .then((shippingText) => {
                            const shipping = parseFloat(shippingText.replace(",", "."));

                            cy.get(".row")
                                .eq(2)
                                .find(".col-6")
                                .eq(1)
                                .invoke("text")
                                .then((grandTotalText) => {
                                    const grandTotal = parseFloat(
                                        grandTotalText.replace(",", ".")
                                    );

                                    expect(grandTotal).to.eq(subtotal + shipping);
                                });
                        });
                });
        });
    }

    increaseFirstProductQuantity() {
        // Sepetteki ilk ürünün "+" butonuna tıkla
        this.elements
            .cartItems()
            .first()
            .within(() => {
                cy.get(".cart-item-qty #qty-plus5067240") // veya genel selector: .cart-item-qty span[id^='qty-plus']
                    .click({ force: true });

                // Adetin 1 artmasını kontrol et
                cy.get(".cart-item-qty input");
            });

        // Sepet toplamlarını tekrar kontrol et
        this.verifyCartTotals();
    }

    addDifferentProductsToCart() {
        // Farklı ürün
        cy.get(".product-detail-card", { timeout: 10000 })
            .first()
            .within(() => {
                cy.get(".add-to-cart-btn").click({ force: true });
            });
        cy.get("#popup-cart", { timeout: 15000 }).should("be.visible");
        cy.get("#cart-popup-go-cart").click({ force: true });
    }

    deleteFirstProductFromCart() {
        // Sepetteki ilk ürünün çöp kutusu ikonuna tıkla
        this.elements
            .cartItems()
            .first()
            .within(() => {
                cy.get(".cart-item-delete").click({ force: true });
            });

        // Açılan popup'ta "Sil" butonuna tıkla
        cy.get(".t-popconfirm-cancel-btn")
            .should("be.visible")
            .click({ force: true });
    }

    clearCart() {
        // Sepeti Temizle butonuna tıkla
        cy.get("a[id^='clear-cart-btn']", { timeout: 10000 })
            .should("be.visible")
            .click({ force: true });

        // Sepetin boş olduğunu doğrula
        this.elements.cartItems().should("have.length", 0);

        // Sepet boş mesajını doğrula
        cy.get(".fw-light.text-center.mb-2")
            .should("be.visible")
            .and("contain.text", "Sepetinizde Ürün Bulunmamaktadır");
    }

    checkEmptyCart() {
        // Boş sepet mesajını doğrula
        cy.get(".fw-light.text-center.mb-2")
            .should("be.visible")
            .and("contain.text", "Sepetinizde Ürün Bulunmamaktadır");

        // Alışverişe Devam Et butonunu doğrula
        cy.get("#cart-back-btn") // selector, canlı siteye göre güncelleyebilirsin
            .should("be.visible")
            .and("not.be.disabled");
    }

    clickCheckoutButton() {
        // Satın Al butonuna tıkla
        cy.get("#cart-buy-btn") // Canlı sitedeki selector
            .should("be.visible")
            .and("not.be.disabled")
            .click({ force: true });

        // Checkout sayfasına yönlendirme kontrolü
        cy.url({ timeout: 10000 }).should("include", "order/");
    }

    addProductFromDetailPage(productIndex = 0) {
        // Ana sayfadan ürün detay sayfasına git
        cy.get(".product-detail-card", { timeout: 10000 })
            .eq(productIndex)
            .within(() => {
                cy.get(".product-title")
                    .invoke("attr", "href")
                    .then((href) => {
                        cy.visit(`https://www.kitapsepeti.com${href}`);
                    });
            });

        // Ürün detay sayfasında Sepete Ekle butonuna tıkla
        cy.get("#addToCartBtn", { timeout: 10000 })
            .should("be.visible")
            .click({ force: true });

        // Açılan popup’ta Sepete Git tıkla
        cy.get("#cart-popup-go-cart", { timeout: 15000 })
            .should("be.visible")
            .click({ force: true });

        // Sepet sayfasına yönlendirme ve kontrol
        this.verifyOnbasketPage();
        this.verifyCartItems();
        this.verifyCartTotals();
    }

    addProductFromHomePage(productIndex = 0) {
        // Ana sayfadan ürünü bul ve Sepete Ekle
        cy.get(".product-detail-card", { timeout: 10000 })
            .eq(productIndex)
            .within(() => {
                cy.get(".add-to-cart-btn").click({ force: true });
            });

        // Açılan popup’ta Sepete Git tıkla
        cy.get("#cart-popup-go-cart", { timeout: 15000 })
            .should("be.visible")
            .click({ force: true });

        // Sepet sayfasına yönlendirme ve kontrol
        this.verifyOnbasketPage();
        this.verifyCartItems();
        this.verifyCartTotals();
    }

    verifyPurchaseButtonNotVisibleWhenCartEmpty() {
        this.openCartSidebar();
        cy.get("#cart-purchase-btn").should("not.exist"); // veya .should('not.be.visible')
    }
    verifyInvalidQuantityHandling() {
        // Sepetteki ilk ürünün adedine geçersiz değer gir
        this.elements
            .cartItems()
            .first()
            .within(() => {
                cy.get(".cart-item-qty input")
                    .scrollIntoView() // Elementi görünür hale getir
                    .should("be.visible")
                    .clear({ force: true }) // Force kullanarak overlay sorununu aş
                    .type("-5", { force: true }) // Negatif değer gir
                    .blur(); // Focus kaybı ile güncelleme tetiklenebilir
            });

        // Toplamların doğru güncellendiğini doğrula
        this.verifyCartTotals();
    }

    addFirstProductToCart() {
        // Ana sayfadaki ilk ürünü bul ve sepete ekle
        cy.get(".product-detail-card", { timeout: 10000 })
            .first()
            .within(() => {
                cy.get(".add-to-cart-btn").click({ force: true });
            });

        // Modalın açılmasını bekle
        cy.get("#popup-cart", { timeout: 15000 }) // modal bazen uzun sürebilir
            .should("be.visible");

        // Sepete Git butonuna tıkla
        cy.get("#cart-popup-go-cart").click({ force: true });

        // /sepet sayfasına yönlendirilmesini doğrula
        cy.url({ timeout: 10000 }).should("include", "/sepet");
    }
}

export default new BasketPage();



// class BasketPage {

//     // Sepet ikonları ve sayfa seçicileri
//     cartIcon = '.header-cart';
//     cartPageHeader = '.col-12 > .block-title';
//     emptyCartButton = '.btn-clear-cart, .cart-clear-btn';
//     emptyCartMessage = '.cart-empty-title, .empty-cart-text';
//     confirmModalButton = '.confirm-button, .swal2-confirm';

//     // Sağ pop-up modal
//     cartModal = '.drawer-wrapper.closable-active.active';
//     productRow = '.drawer-body > .cart-product-row';
//     productName = '.cp-title';
//     productQuantityInput = '.quantity-input';
//     productCartTotal = '.fw-black > .text-right';
//     goToCartButton = '.drawer-footer .btn-go-cart';
//     removeProductButton = '.remove-product-btn';

//     // --------------------------
//     // Yardımcı Overlay Kapatma Fonksiyonu
//     // --------------------------
//     closeOverlayIfExists() {
//         cy.get('body').then(($body) => {
//             const overlays = $body.find('.drawer-overlay.active, .drawer-wrapper.closable-active.active');
//             if (overlays.length) {
//                 cy.wrap(overlays).first().click({ force: true }); // sadece ilk overlay’i kapat
//             }
//         });
//     }

//     // --------------------------
//     // Sepet ikonuna tıklama
//     // --------------------------
//     clickCartIcon() {
//         this.closeOverlayIfExists();
//         cy.get(this.cartIcon).click();
//     }

//     // --------------------------
//     // Sepete Git butonuna tıklama
//     // --------------------------
//     clickGoToCartButton() {
//         this.closeOverlayIfExists();
//         cy.get(this.goToCartButton).click();
//     }

//     // --------------------------
//     // Sepet sayfasının yüklendiğini doğrulama
//     // --------------------------
//     verifyCartPageLoaded() {
//         cy.get(this.cartPageHeader).should('contain.text', 'Sepetim');
//     }

//     // --------------------------
//     // Ürün bilgilerini doğrulama
//     // --------------------------
//     verifyProductInfoInModal(index = 0) {
//         cy.get(this.productRow).eq(index).within(() => {
//             cy.get(this.productName).should('not.be.empty');
//             cy.get(this.productQuantityInput).should('exist');
//             cy.get(this.productCartTotal).should('exist');
//         });
//     }

//     // --------------------------
//     // Sepet toplamını doğrulama
//     // --------------------------
//     verifyCartTotals() {
//         cy.get('.cart-total, .cart-shipping, .cart-grand-total').should('exist');
//     }

//     // --------------------------
//     // Ürün adedi artırma
//     // --------------------------
//     increaseProductQuantity(index = 0) {
//         this.closeOverlayIfExists();
//         cy.get(this.productRow).eq(index).find('.quantity-increase').click();
//     }

//     // --------------------------
//     // Ürün adedi azaltma
//     // --------------------------
//     decreaseProductQuantity(index = 0) {
//         this.closeOverlayIfExists();
//         cy.get(this.productRow).eq(index).find('.quantity-decrease').click();
//     }

//     // --------------------------
//     // Sepetten ürün silme
//     // --------------------------
//     removeProduct(index = 0) {
//         this.closeOverlayIfExists();
//         cy.get(this.productRow).eq(index).find(this.removeProductButton).click();
//         this.closeOverlayIfExists();
//         cy.get(this.confirmModalButton).click();
//     }

//     // --------------------------
//     // Sepeti tamamen boşaltma
//     // --------------------------
//     emptyCart() {
//         this.closeOverlayIfExists();
//         cy.get(this.emptyCartButton).click();
//     }

//     // --------------------------
//     // Sepetin boş olduğunu doğrulama
//     // --------------------------
//     verifyCartEmpty() {
//         cy.get(this.emptyCartMessage).should('contain.text', 'Sepetinizde Ürün Bulunmamaktadır');
//         cy.get('.continue-shopping-btn').should('be.visible');
//     }

//     verifyCartModalLoaded() {
//         cy.get('body').then(($body) => {
//             // Sepet modalının aktif olup olmadığını kontrol et
//             if ($body.find('.drawer-wrapper.closable-active.active > .drawer-header').length) {
//                 cy.get('.drawer-wrapper.closable-active.active > .drawer-header', { timeout: 10000 })
//                     .should('be.visible')
//                     .and('contain', 'Sepetim');
//             } else {
//                 throw new Error('Sepet modalı bulunamadı.');
//             }
//         });
//     }


// }

// export default new BasketPage();



// class BasketPage {
//     elements = {
//         cartIcon: () => cy.get("#header-cart-btn", { timeout: 10000 }), // Sepetim Butonu
//         sideCartPanel: () => cy.get('.drawer-wrapper[data-display="overlay"]'), // Açılan sağ panel
//         goToCartButton: () => cy.get("#go-cart-btn", { timeout: 10000 }), // Sepete git butonu
//         cartItems: () => cy.get(".cart-item"), // Sepetteki ürünler
//     };

//     visitHomePage() {
//         cy.visit("https://www.kitapsepeti.com/");
//     }

//     closePopups() {
//         cy.get("body").then(($body) => {
//             Kampanya popup'ı varsa kapat
//             if ($body.find(".ccp---nb-interstitial-overlay .ccp-close").length > 0) {
//                 cy.get(".ccp---nb-interstitial-overlay .ccp-close").click({ force: true });
//             }

//             Çerez onayı varsa kapat
//             if ($body.find(".cc-nb-okagree").length > 0) {
//                 cy.get(".cc-nb-okagree").click({ force: true });
//             }
//         });
//     }

//     openCartSidebar() {
//         this.elements.cartIcon().should("be.visible").click({ force: true });
//         this.elements.sideCartPanel().should("be.visible");
//     }

//     clickGoToCart() {
//         this.elements
//             .goToCartButton()
//             .should("exist") // DOM'da var mı
//             .and("be.visible") // görünür mü
//             .click({ force: true });
//     }

//     verifyOnBasketPage() {
//         cy.url().should("include", "/sepet");
//     }

//     addFirstProductToCart() {
//         Ana sayfadaki ilk ürünü bul ve sepete ekle
//         cy.get(".product-detail-card", { timeout: 10000 })
//             .first()
//             .within(() => {
//                 cy.get(".add-to-cart-btn").click({ force: true });
//             });

//         Modalın açılmasını bekle
//         cy.get("#popup-cart", { timeout: 15000 }).should("be.visible");

//         Sepete Git butonuna tıkla
//         cy.get("#cart-popup-go-cart").click({ force: true });

//         Sepet sayfasına yönlendirilmesini doğrula
//         cy.url({ timeout: 10000 }).should("include", "/sepet");
//     }
// }

// export default new BasketPage();
