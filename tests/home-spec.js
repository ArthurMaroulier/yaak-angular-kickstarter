describe('angularjs homepage', function() {
    it('navigate to dummy page', function() {
        browser.get('http://localhost:4242/');

        expect(browser.getTitle()).toEqual('Angular kickstarter (YAAK)');

        expect(element.all(by.repeater('component in components')).get(0).getText()).toContain("1.6.6");
        element(by.css('a[ui-sref="dummy"]')).click()
            .then(function () {
                expect(element(by.css('h1')).getText()).toMatch("Dummy data");
            });
    });
});