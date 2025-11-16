import GuestPurchasePage from "../pages/guestPurchasePage";

describe("US06 - Misafir Olarak Satın Alma Akışı", () => {
    beforeEach(() => {
        GuestPurchasePage.visitHomePage();
        GuestPurchasePage.closePopups();
    });

    it("TC43 - Pozitif: Satın al butonuna tıklayınca '/siparis-uye-giris' sayfasına yönlendirme", () => {
        GuestPurchasePage.addProductFromHomePage();
        GuestPurchasePage.verifyRedirectToLoginPage();
    });

    it("TC44 - Pozitif: Üye olmadan devam et butonunun görünürlüğü", () => {
        GuestPurchasePage.addProductFromHomePage();
        GuestPurchasePage.verifyContinueAsGuestButtonVisible();
    });

    it("TC45 - Pozitif: Üye olmadan devam et seçildiğinde adres formunun görüntülenmesi", () => {
        GuestPurchasePage.addProductFromHomePage();
        GuestPurchasePage.clickContinueAsGuestButton();
        GuestPurchasePage.verifyAddressPageLoaded();
    });
    it("TC46 - Pozitif: Adres formu alanlarının doğruluğu", () => {
        GuestPurchasePage.addProductFromHomePage();
        GuestPurchasePage.clickContinueAsGuestButton();
        GuestPurchasePage.verifyAddressFormFields();
    });
    it("TC47 - Negatif: Zorunlu alan boş bırakıldığında uyarı mesajı görüntülenmesi", () => {
        GuestPurchasePage.addProductFromHomePage();
        GuestPurchasePage.clickContinueAsGuestButton();
        GuestPurchasePage.fillAddressFormWithoutFullName();
        GuestPurchasePage.submitAddressForm();
        GuestPurchasePage.verifyFullNameErrorVisible();
        cy.url().should("include", "/order/address");
    });
     it("TC48 - Pozitif: Tüm alanlar doldurulduğunda adres kaydı başarılı olmalı", () => {
         GuestPurchasePage.addProductFromHomePage();
         GuestPurchasePage.clickContinueAsGuestButton();
         GuestPurchasePage.fillAddressForm();
         GuestPurchasePage.submitAddressForm();
         cy.url().should("include", "/payment");
     });
});
