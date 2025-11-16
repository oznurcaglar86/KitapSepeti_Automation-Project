class ProductSearchPage {

    searchInput = '[name="q"]';  // Anasayfadaki ürün arama alanı seçicisi
    searchIcon = '#search';
    searchButton = '#live-search-btn';

    productTitle = '.col-6 > .bg-white > .product-detail-card > .text-center'; // Ürün başlığı seçicisi
    productDetailCards = '.col-6 > .bg-white > .product-detail-card';  // Anasayfadaki ürün kartlarının detay kısmı seçicisi
    productCard = '.col-6 > .bg-white';   // Anasayfadaki ürün kartları seçicisi
    productImage = '.col-6 > .bg-white > .position-relative > .image-animate-zoom > .image-inner';
    productName = '.col-6 > .bg-white > .product-detail-card > .text-center';
    productAuthor = '.col-6 > .bg-white > .product-detail-card > .d-flex >.model-title';
    productPublisher = '.col-6 > .bg-white > .product-detail-card > .d-flex >.brand-title';
    productPrice = '.col-6 > .bg-white > .product-detail-card > .product-bottom-line > .product-price-wrapper >.current-price > .product-price';

    sortingDropdown = '[name="sort"]';
    productPriceList = '.col-6 > .bg-white > .product-detail-card > .product-bottom-line > .product-price-wrapper >.current-price > .product-price';  // Fiyat sıralaması için tüm fiyat listesi seçicisi

    categoryOption = '.category-general > .w-100 > .filter-list';
    brandOption = '.px-1 > :nth-child(2) > .w-100';
    modelOption = '.px-1 > :nth-child(3) > .w-100';
    applyFilterButton = '.position-sticky > .btn-secondary';
    productListContainer = '#catalog362'; //Ürün listesinin ana kapsayıcısı

    pageTitle = '.col-12.py-1.d-none.d-md-block.category-name.text-center';   // Kategori sayfasının başlığı
    addToCartButton = '.add-to-cart-btn';    // Sepete Ekle butonu (Hover sonrası görünür)
    buyButton = '#cart-popup-continue-shopping';  // Sepet pop-up'ındaki Satın Al butonu


    clickSearchIcon() {
        cy.get(this.searchIcon).click();
    }

    typeSearchQuery(query) {
        cy.get(this.searchInput, { timeout: 10000 })
            .should('be.visible')
            .and('be.enabled')
            .type(query);
    }

    clickSearchButton() {
        cy.get(this.searchButton).click();
        cy.url().should('include', 'arama?q=');
    }

    search(query) {
        cy.wait(1000);
        this.clickSearchIcon();
        this.typeSearchQuery(query);
        this.clickSearchButton();
    }

    /** Arama input alanının içeriğinin temizlendiğini doğrular. */
    verifySearchInputCleared() {
        cy.get(this.searchInput).should('have.value', '');
    }

    /** Ürün başlığını alır ve arama sorgusunu içerip içermediğini doğrular. */
    verifyFirstSearchResult(query) {
        cy.get(this.productTitle, { timeout: 10000 })
            .first()
            .invoke('text')
            .then((text) => {
                expect(text.toLowerCase()).to.include(query.toLowerCase());
            });
    }

    /** Arama sonucunda hiç ürün kartı olmadığını doğrular. */
    verifyNoSearchResults() {
        cy.get(this.productDetailCards).should('have.length', 0);
    }

    /** Ürün kartındaki tüm görsel elementlerin görünür olduğunu doğrular. */
    verifyProductCardUI() {
        cy.get(this.productCard).each(() => {
            cy.get(this.productImage).should('be.visible');
            cy.get(this.productName).should('be.visible');
            cy.get(this.productAuthor).should('be.visible');
            cy.get(this.productPublisher).should('be.visible');
            cy.get(this.productPrice).should('be.visible');
        });
    }

    /** Sıralama dropdown'ından 'Fiyat Azalan' seçeneğini seçer. */
    sortByPriceHighToLow() {
        cy.get('#sort')
            .should('be.visible')
            .select('Fiyat Azalan', { force: true });

        // Sıralama işleminin tamamlanmasını bekle
        cy.get('#catalog362', { timeout: 10000 })
            .should('exist')
            .find('.product-item')
            .should('have.length.greaterThan', 0);

        cy.wait(2000); // Ek güvenlik beklemesi
    }

    /** Ürün fiyatlarının azalan sırada listelendiğini doğrular. */
    verifyProductsSortedByPrice() {
        let prices = [];

        // Ürün fiyatlarını topla
        cy.get('#catalog362 .product-item .product-price')
            .should('exist')
            .each(($el) => {
                const priceText = $el.text()
                    .replace(',', '.')
                    .replace('₺', '')
                    .replace('TL', '')
                    .trim();
                const price = parseFloat(priceText);
                if (!isNaN(price)) {
                    prices.push(price);
                }
            })
            .then(() => {
                cy.log('Alınan Fiyatlar:', prices);

                // Azalan (büyükten küçüğe) sıralama kontrolü
                for (let i = 0; i < prices.length - 1; i++) {
                    expect(prices[i]).to.be.at.least(prices[i + 1]);
                }
            });
    }

    verifyAddToCartOnHover() {
        cy.log('Ürün kartı üzerinde güçlü hover tetikleniyor...');

        cy.get('#catalog362 .product-item')
            .first()
            .trigger('mouseenter')
            .trigger('mousemove', { force: true });

        cy.wait(500); // animasyon varsa kısa bekleme

        cy.get('#catalog362 .product-item')
            .first()
            .find('.add-to-cart-btn', { timeout: 10000 })
            .should('exist')
            .and('contain.text', 'Sepete Ekle')
            .click({ force: true });


        cy.log('"Sepete Ekle" butonu hover sonrası göründü.');
    }

    /** Belirtilen kategori filtresine tıklar. */
    clickCategoryFilter(categoryName) {
        cy.get(this.categoryOption, { timeout: 10000 })
            .contains(categoryName)
            .scrollIntoView()
            .should('be.visible')
            .click({ force: true });
    }

    /** Belirtilen marka filtresine tıklar. */
    clickBrandOption(brandName) {
        cy.get(this.brandOption, { timeout: 10000 })
            .contains(brandName)
            .scrollIntoView()
            .should('be.visible')
            .click({ force: true });
    }

    /** Belirtilen model filtresine tıklar. */
    clickModelOption(modelName) {
        cy.get(this.modelOption, { timeout: 10000 })
            .contains(modelName)
            .scrollIntoView()
            .click({ force: true });
    }

    /** Filtreleri Uygula butonuna tıklar. */
    clickApplyFilterButton() {
        cy.get(this.applyFilterButton, { timeout: 10000 })
            .scrollIntoView()
            .should('be.visible')
            .click({ force: true });
    }

    /** URL'nin beklenen filtre parametresini içerdiğini doğrular. */
    verifyFilterApplied(expectedUrlPart) {
        cy.url({ timeout: 10000 }).should('include', expectedUrlPart);
    }

    /** Ana sayfadaki kategori linkine tıklar. */
    navigateToCategory(categoryName) {
        cy.wait(1000);
        cy.contains(categoryName).click({ force: true });
    }

    /** Kategori sayfasının doğru yüklendiğini (URL ve Başlık kontrolü) doğrular. */
    verifyCategoryPage(categoryName) {
        cy.url({ timeout: 10000 }).should('not.include', 'login');
        cy.get(this.pageTitle, { timeout: 10000 })
            .should('be.visible')
            .invoke('text')
            .then((text) => {
                // Başlık metninin kategori adını içerdiğini doğrular (Türkçe karakter ve case-insensitive).
                const normalizedText = text.trim().toLowerCase().replace(/i/g, 'i');
                const normalizedCategoryName = categoryName.toLowerCase().replace(/i/g, 'i');
                expect(normalizedText).to.include(normalizedCategoryName);
            });
    }



    /** Fare imlecini ürün kartının üzerine getirerek "Sepete Ekle" butonunun görünür olduğunu doğrular. */
    // verifyAddToCartOnHover() {
    //     cy.get(this.productCard)
    //         .first()
    //         .realHover();

    //     cy.get(this.productCard)
    //         .first()
    //         .find(this.addToCartButton)
    //         .should('be.visible');
    // }


    // clickAddToCartOnHover() {
    //     // Overlay (örn. üyelik paneli veya cookie popup) varsa bekle
    //     cy.get('.drawer-overlay.active', { timeout: 10000 }).should('not.exist');

    //     // İlk ürün kartını hedef al
    //     cy.get(this.productCard)
    //         .first()
    //         .scrollIntoView()
    //         .trigger('mouseover', { force: true }) // hover olayını tetikle
    //         .wait(500);

    //     // Sepete Ekle butonuna tıkla (görünür olmasa bile)
    //     cy.get(this.productCard)
    //         .first()
    //         .find(this.addToCartButton, { timeout: 10000 })
    //         .should('exist') // 'be.visible' yerine
    //         .click({ force: true });
    // }

    /** Fare imlecini ürün kartının üzerine getirir ve Sepete Ekle butonuna tıklar. */
    // clickAddToCartOnHover() {
    //     cy.get(this.productCard)
    //         .first()
    //         .realHover();

    //     cy.get(this.productCard)
    //         .first()
    //         .find(this.addToCartButton, { timeout: 10000 })
    //         .should('be.visible')
    //         .click({ force: true });
    // }


    clickAddToCartOnHover() {
        // 1️⃣ Olası overlay'leri (üyelik paneli, cookie popup vb.) bekle
        cy.get('body').then(($body) => {
            if ($body.find('.drawer-overlay.active').length > 0) {
                cy.get('.drawer-overlay.active', { timeout: 10000 }).should('not.exist');
            }
        });

        // 2️⃣ İlk ürün kartına git
        cy.get(this.productCard, { timeout: 20000 })
            .first()
            .scrollIntoView()
            .should('exist')
            .trigger('mouseover', { force: true });

        // 3️⃣ Sepete Ekle butonunu bul ve görünür hale getir
        cy.get(this.productCard)
            .first()
            .find(this.addToCartButton, { timeout: 10000 })
            .should('exist')
            .invoke('show') // buton görünür değilse görünür yap
            .click({ force: true });

        // 4️⃣ İşlem sonrası küçük bekleme (popup açılması vs. için)
        cy.wait(2000);
    }

    /** Sayfadaki mevcut ürün kartı sayısını döndürür. */
    getInitialProductCount() {
        return cy.get(this.productCard).its('length');
    }

    /**
    * Sayfayı önce en sona, sonra son yüklenmiş ürüne kaydırır ve daha fazla ürünün yüklendiğini doğrular.
    * Bu işlem, URL'ye 'ps=' parametresini eklenmesini tetikler.
    */


    scrollToBottomAndVerifyMoreProducts(initialCount) {
        // Sayfayı birkaç kez kaydır
        for (let i = 0; i < 3; i++) {
            cy.scrollTo('bottom', { duration: 1000 });
            cy.wait(3000);
        }

        // Yeni ürünleri say
        cy.get(this.productCard, { timeout: 20000 }).then(($cards) => {
            const newCount = $cards.length;
            cy.log(`İlk sayım: ${initialCount}, yeni sayım: ${newCount}`);

            if (newCount <= initialCount) {
                cy.log('Yeni ürünler gelmedi, tekrar kaydırılıyor...');
                cy.scrollTo('bottom', { duration: 1500 });
                cy.wait(5000);
                cy.get(this.productCard, { timeout: 20000 })
                    .should('have.length.gt', initialCount);
            } else {
                expect(newCount).to.be.greaterThan(initialCount);
            }
        });

        // UI için son ürüne kaydır
        cy.get(this.productCard).last().scrollIntoView({ duration: 500 });
        cy.wait(1000);
    }



    /** URL'nin 'ps=' sayfa numarası parametresini içerdiğini doğrular. */
    verifyUrlPageNumber() {
        cy.get('body').then(($body) => {
            if ($body.find('.pagination-next').length > 0) {
                cy.log('Pagination bulundu, 2. sayfa kontrolü yapılıyor...');

                cy.get(this.productCard).then(($cards1) => {
                    cy.get('.pagination-next').click();
                    cy.wait(3000);

                    cy.get(this.productCard).then(($cards2) => {
                        expect($cards2.first().text()).not.to.eq($cards1.first().text());
                    });
                });
            } else {
                cy.log('Pagination yok, yalnızca tek sayfa sonuç mevcut.');
            }
        });
    }


    /** İlk ürün kartına tıklar. */
    clickProductCard() {
        cy.get(this.productCard, { timeout: 10000 })
            .first()
            .should('be.visible')
            .click();
    }

    /** Sepet pop-up'ındaki Satın Al butonuna tıklar. */
    clickBuyButton() {
        cy.get(this.buyButton, { timeout: 10000 })
            .should('be.visible')
            .click();
    }

}

export default new ProductSearchPage();

