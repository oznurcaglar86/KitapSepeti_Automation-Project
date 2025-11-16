import LoginPage from "../pages/LoginPage";
import ProductSearchPage from "../pages/ProductSearchPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import BasketPage from "../pages/BasketPage";


describe("User Story - 04 - Sepet Yönetimi ve Kontrolü", () => {
    before(() => {
        // 🔹 API üzerinden login ol (tek sefer)
        cy.loginViaApi();
    });

    beforeEach(() => {
        // 🔹 Her testte session’ı geri yükle
        cy.loginViaApi();

        // 🔹 Siteye git ve popup kapat
        BasketPage.visitHomePage();
        BasketPage.closePopups();
    });

     it('TC23: Sepete erişim ve "Sepete Git" butonunun çalışması', () => {
        BasketPage.openCartSidebar();
        BasketPage.clickGoToCart();
        BasketPage.verifyOnbasketPage();
    });

    it("TC24: Sepetteki ürün bilgileri doğru gösterilmeli", () => {
        BasketPage.addFirstProductToCart();
        BasketPage.verifyCartItems();
    });

    it("TC25: Sepet toplamının doğru hesaplanması", () => {
        BasketPage.openCartSidebar();
        BasketPage.clickGoToCart();
        BasketPage.verifyCartTotals();
    });

    it("TC26: Ürün adedini artırma ve toplamların güncellenmesi", () => {
        BasketPage.openCartSidebar();
        BasketPage.clickGoToCart();
        BasketPage.increaseFirstProductQuantity();
    });

    it("TC27: Tek bir ürünün silinmesi", () => {
        // Önce sepete farklı ürün ekle
        BasketPage.addDifferentProductsToCart();

        // İlk ürünü sil
        BasketPage.deleteFirstProductFromCart();

        // Sepette kaç ürün kaldığını doğrula
        BasketPage.elements.cartItems().should("have.length", 1);

        // Sepet toplamlarının güncellendiğini doğrula
        BasketPage.verifyCartTotals();
    });

    it("TC28: Sepeti tamamen temizleme", () => {
        // Önce sepete birkaç ürün ekle
        BasketPage.addDifferentProductsToCart();

        // Sepeti temizle
        BasketPage.clearCart();
    });

    it("TC29: Boş sepet durumu", () => {
        BasketPage.openCartSidebar();
        BasketPage.clickGoToCart();
        // Önce sepette varsa ürünleri temizle

        // Boş sepet durumunu kontrol et
        BasketPage.checkEmptyCart();
    });

    it("TC30: Satın alma butonu çalışır ve kullanıcıyı yönlendirir", () => {
        BasketPage.addFirstProductToCart();
        // Satın Al butonuna tıkla ve yönlendirmeyi doğrula
        BasketPage.clickCheckoutButton();
    });

    it("TC31: Ürün detay sayfasından sepete ekleme ve sepete git", () => {
        BasketPage.addProductFromDetailPage();
    });

    it("TC32: Ana sayfadan ürün sepete ekleme ve sepete git", () => {
        BasketPage.addProductFromHomePage();
    });

    it('TC33: Sepet boşken "Satın Al" butonuna tıklama', () => {
        BasketPage.openCartSidebar();
        BasketPage.clickGoToCart();
        BasketPage.clearCart(); // Sepeti tamamen temizle
        BasketPage.verifyPurchaseButtonNotVisibleWhenCartEmpty(); // Satın Al butonunun olmamasını doğrula
    }); 

    it("TC34: Geçersiz ürün adedi girme", () => {
        BasketPage.addFirstProductToCart();
        // Negatif veya sıfır değer girildiğinde davranışı kontrol et
        BasketPage.verifyInvalidQuantityHandling();
    });
});



