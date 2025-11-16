class LoginPage {
  url = "https://www.kitapsepeti.com/";
  acceptCookiesButton = '.cc-nb-okagree';
  accountIcon = '#header-account > .custom-user';
  emailInput = '#header-email';
  passwordInput = '#header-password';
  loginButton = '#login-btn-322';
  bestsellersHeader = '.position-relative > .block-title';
  loginModal = '.drawer-wrapper.closable-active.active';
  errorMessageText = 'Giriş bilgileriniz hatalı';
  forgotPasswordLink = '.flex-wrap > .text-gray';
  remindPasswordEmailInput = '#email-292';
  remindPasswordButton = '#forgot-password-btn-292';
  remindPasswordButtonText = 'Şifremi Hatırlat';
  excessiveLoginAttemptMessage = 'Çok fazla istek talebinde bulundunuz. Lütfen 30 dakika sonra tekrar deneyin.';
  excessiveLoginAttemptLocator = '.popover-item';

  /** Sayfayı aç */
  navigateUrl() {
    cy.visit(this.url);
  }

  /** Çerezleri kabul et */
  clickAcceptCookiesButton() {
    cy.get('body').then(($body) => {
      if ($body.find(this.acceptCookiesButton).length > 0) {
        cy.get(this.acceptCookiesButton).click({ force: true });
      }
    });
  }

  /** Account popup aç (stabil & animasyon uyumlu versiyon) */
  clickAccountIcon() {

    // Eğer overlay açıksa kapat
    cy.get('body').then(($body) => {
      if ($body.find('.drawer-overlay.active').length > 0) {
        cy.get('.drawer-overlay.active').click({ force: true });
        cy.wait(400); // animasyon bekleme
      }
    });

    // Hesap ikonuna tıkla
    cy.get(this.accountIcon).should('be.visible').click();

    // Modal yüklenmesini bekle
    cy.get(this.loginModal, { timeout: 10000 })
      .should('exist')
      .should('be.visible');  // artık cy.wait yok, should re-try ediyor
  }

  /** Email gir */
  enterEmail(email) {
    cy.get(this.emailInput).clear().type(email);
  }

  /** Şifre gir */
  enterPassword(password) {
    cy.get(this.passwordInput).clear().type(password);
  }

  /** Giriş butonuna tıkla */
  clickLoginButton() {
    cy.get(this.loginButton).click();
  }

  /** Login işlemi */
  login(email, password) {
    this.navigateUrl();
    this.clickAcceptCookiesButton();
    this.clickAccountIcon();
    this.enterEmail(email);
    this.enterPassword(password);
    this.clickLoginButton();
  }

  /** Anasayfa yüklendi mi? */
  verifyHomepageLoaded() {
    cy.get(this.bestsellersHeader, { timeout: 10000 })
      .should('be.visible');
  }

  /** Hata mesajı kontrolü */
  verifyLoginErrorMessage() {
    // Drawer veya popup açıldıktan sonra retry ile text kontrol
    cy.get('body', { timeout: 20000 }).should(($body) => {
      const text = $body.text();
      if (!text.includes('Giriş bilgileriniz hatalı')) {
        throw new Error('Hata mesajı henüz görünmedi');
      }
    });
  }



  /** Login popup elementleri görünür mü? */
  verifyLoginPopupElementsVisible() {
    cy.get(this.emailInput).should('be.visible');
    cy.get(this.passwordInput).should('be.visible');
    cy.get(this.loginButton).should('be.visible');
    cy.get(this.forgotPasswordLink).should('be.visible');
  }

  /** Şifremi unuttum'a gir */
  clickForgotPasswordLink() {
    this.navigateUrl();
    this.clickAcceptCookiesButton();
    this.clickAccountIcon();
    cy.get(this.forgotPasswordLink).should('be.visible').click();
  }

  /** Şifre sıfırlama sayfası */
  verifyForgotPasswordPageLoaded() {
    cy.get(this.remindPasswordEmailInput).should('be.visible');
    cy.get(this.remindPasswordButton)
      .should('be.visible')
      .and('contain', this.remindPasswordButtonText);
  }

  /** Çoklu hatalı giriş güvenlik mesajı */
  verifyExcessiveLoginAttemptMessage() {
    cy.get(this.excessiveLoginAttemptLocator, { timeout: 10000 })
      .should('be.visible')
      .and('contain', this.excessiveLoginAttemptMessage);
  }

  /** Popup'ı kapat */
  closeLoginPopup() {
    cy.get('body').then(($body) => {
      if ($body.find('.drawer-overlay.active').length > 0) {
        cy.get('.drawer-overlay.active').click({ force: true });
        cy.wait(300);
      }
    });
  }
}

export default new LoginPage();
