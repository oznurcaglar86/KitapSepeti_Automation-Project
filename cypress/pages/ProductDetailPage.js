class ProductDetailPage {

    productTitle = '#product-title';  // Ürün detay sayfasındaki ürün başlığı seçicisi
    productAuthor = '#model-title > span';
    productPublisher = '#brand-title';
    productPrice = '.product-current-price';
    productInfoSection = '.book-info-wrapper';
    addToCartButton = '#addToCartBtn';

    cartIcon = '#header-cart-btn'; // Ana sayfa başlığındaki sepet ikonu
    cartIconCount = '.cart-soft-count';
    addToCartSuccessMessage = '#popup-cart-1054-default'; // Sepete ekleme sonrası çıkan başarı mesajının modalı
    closeModalButton = '#t-modal-close-1';
    goToCartButton = '#cart-popup-go-cart'; // Modal penceresindeki 'Sepete Git' butonu


    /** Ürün fiyatının DOM elementini getirir. */
    getProductPriceElement() {
        return cy.get(this.productPrice);
    }

    /** Ürün başlığını kontrol ederek detay sayfasının doğru yüklendiğini doğrular. */
    verifyProductDetailPage(expectedTitle) {
        cy.get(this.productTitle, { timeout: 10000 }).should('contain.text', expectedTitle);
    }

    /** Temel ürün bilgilerinin görünürlüğünü ve içeriğini doğrular. */
    verifyProductBasicInfo(expectedTitle, expectedAuthor, expectedPublisher, expectedPrice) {
        cy.get(this.productTitle).should('be.visible').and('contain', expectedTitle);
        cy.get(this.productAuthor).should('be.visible').and('contain', expectedAuthor);
        cy.get(this.productPublisher).should('be.visible').and('contain', expectedPublisher);
        cy.get(this.productPrice).should('be.visible').and('contain', expectedPrice);
    }

    /** "Ürün Hakkinda Bilgiler" bölümünün içeriğini doğrular. */
    verifyProductDetailedInfo() {
        cy.get(this.productInfoSection).should('be.visible');
        cy.get(this.productInfoSection).should('contain', 'Türü');
        cy.get(this.productInfoSection).should('contain', 'ISBN');
        cy.get(this.productInfoSection).should('contain', 'Basım Yılı');
    }

    /** Sepete Ekle butonuna tıklar. */
    clickAddToCartButton() {
        // Butonun görünür ve aktif olduğundan emin ol
        cy.get(this.addToCartButton, { timeout: 10000 })
            .should('be.visible')
            .should('not.be.disabled')
            .scrollIntoView();
        
        // force: true kullanarak overlay sorununu aş (overlay butonu kapatıyor olsa bile tıklama yapılır)
        cy.get(this.addToCartButton).click({ force: true });
    }

    /** Sepete başarıyla eklendi mesajının görünür olduğunu doğrular. */
    verifySuccessfulAddToCartMessage() {
        cy.get(this.addToCartSuccessMessage, { timeout: 15000 })
            .should('be.visible')
            .and('contain', 'Ürün Başarıyla Sepete Eklendi');
    }

    /** Sepete ekleme sonrası açılan modal penceresini kapatır (X butonuna tıklar). */
    closeAddToCartModal() {
        cy.get(this.closeModalButton).click();
    }

    /** * Sepet ikonundaki mevcut ürün sayısını alır ve bir promise (thenable) olarak döndürür.
     * Bu metot, sayfa objesi içinde tüm DOM etkileşimini ve veri alımını gizler.*/
    getCurrentCartCount() {
        return cy.get(this.cartIconCount)
            .invoke('text')
            .then((cartText) => {
                // Metni temizler ve sayıya dönüştürür. Boşsa 0 döndürür.
                return parseInt(cartText.trim() || '0', 10);
            });
    }

    /** Sepet ikonundaki ürün sayısının beklenen değere ulaştığını doğrular. */
    verifyCartIconCount(expectedCount) {
        cy.get(this.cartIconCount, { timeout: 10000 }).should('be.visible');
        cy.get(this.cartIconCount).invoke('text').then((cartText) => {
            const currentCount = parseInt(cartText.trim(), 10);
            expect(currentCount).to.equal(expectedCount);
        });
    }

    /** Sepet ikonuna tıklar (Sepet sayfasına gitmek için). */
    clickCartIcon() {
        cy.get(this.cartIcon).should('be.visible').click();
    }



    /** Sepet pop-up'ındaki Sepete Git butonuna tıklar. */
    clickGoToCartButton() {
        cy.get(this.goToCartButton, { timeout: 10000 })
            .should('be.visible')
            .click();
    }

}

export default new ProductDetailPage();

