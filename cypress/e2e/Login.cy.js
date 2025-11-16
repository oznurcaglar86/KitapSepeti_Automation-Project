import LoginPage from '../pages/LoginPage';

describe('US01_Kullanıcı Girişi', () => {

  beforeEach(() => {
    LoginPage.navigateUrl();
    LoginPage.clickAcceptCookiesButton();
    LoginPage.clickAccountIcon();
  });


  it('TC01 - Navigasyon popup açılmalı', () => {
    cy.get(LoginPage.loginModal).should('be.visible');
  });


  it('TC02 - Giriş formu elemanları görüntülenmeli', () => {
    LoginPage.verifyLoginPopupElementsVisible();
  });


  it('TC03 - Başarılı giriş yapılabilmeli', () => {
    // Gerçek test hesabı bilgilerini buraya yaz
    const email = 'first.last@example.com';
    const password = '12345-Abc';

    LoginPage.login(email, password);

    // Login sonrası ana sayfa elementini kontrol et
    LoginPage.verifyHomepageLoaded(); // .bestsellersHeader görünür olmalı
  });


  it('TC04 - Başarılı giriş sonrası doğrulama', () => {
    const email = 'first.last@example.com';
    const password = '12345-Abc';

    LoginPage.login(email, password);

    // URL kontrolünü kaldırıp, ana sayfa elementi ile doğrula
    cy.get(LoginPage.bestsellersHeader, { timeout: 10000 }).should('be.visible');
  });

  it('TC05 - Yanlış şifre girişi hata mesajı göstermeli', () => {
    LoginPage.login('first.last@example.com', 'zxcd');
    LoginPage.verifyLoginErrorMessage();
  });


  it('TC06 - Yanlış e-posta ile giriş denemesi hata mesajı göstermeli', () => {
    LoginPage.login('last.first@example.com', '12345-Abc');
    LoginPage.verifyLoginErrorMessage();
  });


  it('TC07 - Geçersiz e-posta formatı kontrolü', () => {
    LoginPage.login('first.lastexample.com', '12345-Abc');
    LoginPage.verifyLoginErrorMessage();
  });

  it('TC08 - Boş alanlarla giriş denemesi kontrolü', () => {
    LoginPage.login(' ', ' ');
    LoginPage.verifyLoginErrorMessage();
  });


  it('TC09 - Şifremi Unuttum yönlendirmesi doğru çalışmalı', () => {
    LoginPage.clickForgotPasswordLink();
    cy.url().should('include', '/uye-sifre-hatirlat'); // KitapSepeti’nin gerçek URL’i
  });

  it('TC10 - Şifre sıfırlama sayfası elemanları görüntülenmeli', () => {
    LoginPage.clickForgotPasswordLink();
    LoginPage.verifyForgotPasswordPageLoaded();
  });

});

