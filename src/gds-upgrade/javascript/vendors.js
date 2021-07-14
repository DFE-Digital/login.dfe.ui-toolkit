var GOVUKFrontend = require('govuk-frontend');
GOVUKFrontend.initAll();

window.Cookies = require('js-cookie');

//GA Utils
window.dataLayer = window.dataLayer || [];
window.gtag = function () {
    dataLayer.push(arguments);
}
