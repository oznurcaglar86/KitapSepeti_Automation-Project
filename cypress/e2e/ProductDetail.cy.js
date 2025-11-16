import LoginPage from "../pages/LoginPage";
import ProductSearchPage from "../pages/ProductSearchPage";
import ProductDetailPage from "../pages/ProductDetailPage";


describe('US03 - Ürün Detay Sayfasi Görüntüleme ve Sepete Ekleme', () => {

    const productName = 'Elanın Gölgesi';
    const productAuthor = 'Burak Yıldız';
    const productPublisher = 'Divit Kitabevi';

    beforeEach(() => {
        LoginPage.login('first.last@example.com', '12345-Abc');
        LoginPage.verifyHomepageLoaded();
        ProductSearchPage.search(productName);
        ProductSearchPage.clickProductCard();

        // Dinamik fiyatı oku ve alias olarak kaydet
        cy.get('.product-price')
            .invoke('text')
            .as('dynamicPrice');
    });


     it('TC19 - Ürüne Tiklayip Detay Sayfasina Yönlendirildiğinin Dogrulamasi (Kart üzerindeki Sepete Ekle butonunun islevselligi)', () => {

        ProductDetailPage.verifyProductDetailPage(productName);
    });

    it('TC20 - Temel Ürün Bilgileri Arayüz Dogrulamasi', () => {

        cy.get('@dynamicPrice').then(dynamicPrice => {
            ProductDetailPage.verifyProductBasicInfo(productName, productAuthor, productPublisher, dynamicPrice);
        });
    }); 

    it('TC21 - "Ürün Hakkinda Bilgiler" Bölümü Dogrulamasi', () => {

        ProductDetailPage.verifyProductDetailedInfo();
    }); 

    it('TC22 - Sepete Ekle Butonunun Islevselligini dogrulamasi', () => {

        ProductDetailPage.getCurrentCartCount().then((initialCount) => {
            const expectedCount = initialCount + 1;

            ProductDetailPage.clickAddToCartButton();
            ProductDetailPage.verifySuccessfulAddToCartMessage();
            ProductDetailPage.closeAddToCartModal();
            ProductDetailPage.verifyCartIconCount(expectedCount);
        });
    });

});