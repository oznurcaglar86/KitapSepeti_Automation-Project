import LoginPage from '../pages/LoginPage';
import ProductSearchPage from '../pages/ProductSearchPage';

describe('US02 - Ürün Arama ve Listeleme İşlemleri', () => {

  before(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  beforeEach(() => {
    // Ana sayfaya git
    cy.visit('/');

    // Overlay kapanmasını bekle (bazı sitelerde ilk açılışta overlay aktif olabiliyor)
    cy.get('.drawer-overlay.active', { timeout: 10000 }).should('not.exist');

    // Login ol ve ana sayfanın yüklendiğini doğrula
    LoginPage.login('first.last@example.com', '12345-Abc');
    LoginPage.verifyHomepageLoaded();
  });

   it('TC11 - Başarılı Ürün Arama ve Sonuç Doğrulama', () => {
    const searchQuery = 'Sefiller';
    ProductSearchPage.search(searchQuery);
    ProductSearchPage.verifySearchInputCleared();
    ProductSearchPage.verifyFirstSearchResult(searchQuery);
  }); 

   it('TC12 - Bulunmayan Ürün Araması', () => {
    const searchQuery = 'asdfgh';
    ProductSearchPage.search(searchQuery);
    ProductSearchPage.verifyNoSearchResults(searchQuery);
  });

  it('TC13 - Ürün Kartı Arayüz Doğrulaması', () => {
    ProductSearchPage.search('denizler altında yirmibin fersah');
    ProductSearchPage.verifyProductCardUI();
  });

  it('TC14 - Ürün Sıralama Fonksiyonu (Fiyat Azalan)', () => {
    ProductSearchPage.search('Oyuncak Mahşeri');
    ProductSearchPage.sortByPriceHighToLow();
    ProductSearchPage.verifyProductsSortedByPrice();
  });  

  it('TC15 - Filtreleme Fonksiyonu', () => {
    ProductSearchPage.search('kitap');
    ProductSearchPage.clickCategoryFilter('Dünyanın En İyi Kitapları');
    ProductSearchPage.clickBrandOption('Doğan Kitap');
    ProductSearchPage.clickModelOption('Haruki Murakami');
    ProductSearchPage.clickApplyFilterButton();
    ProductSearchPage.verifyFilterApplied('brand=');
    ProductSearchPage.verifyFilterApplied('model=');
  });

   it('TC16 - Ana Sayfa Kategori Navigasyonu', () => {
    const categoryName = 'Roman';
    ProductSearchPage.navigateToCategory(categoryName);
    ProductSearchPage.verifyCategoryPage(categoryName);
  });

  it('TC17 - Ürün Kartı Üzerinde "Sepete Ekle" (hover) Butonu Doğrulaması', () => {
    ProductSearchPage.search('Elanın Gölgesi');
    ProductSearchPage.verifyAddToCartOnHover();
  });

  it('TC18 - Sayfa Kaydırma (Scroll) ile Ürün Sayfası Yükleme', () => {
    ProductSearchPage.search('sınav');
    ProductSearchPage.getInitialProductCount().then((initialCount) => {
      ProductSearchPage.scrollToBottomAndVerifyMoreProducts(initialCount);
      ProductSearchPage.verifyUrlPageNumber();
    });
  }); 
});
