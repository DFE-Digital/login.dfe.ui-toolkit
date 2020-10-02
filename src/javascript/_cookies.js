(function (window) {
  var $ = window.$;
  var Cookies = window.Cookies;
  if (!Cookies || !$) {
    return;
  }

  var COOKIE_NAMES = {
    PREFERENCES_SET: 'cookies_preferences_set',
    POLICY: 'cookies_policy'
  };
  
  var DEFAULT_POLICY = {
    essential: true,
    settings: false,
    usage: true
  };

  var GOVUK_COOKIE_OPTIONS = {
    expires: 365, // days
    secure: true,
    domain: '.education.gov.uk'
  };

  var GovUKCookie = {
    get: function (name) {
      var value = Cookies.get(name);
      if (value) {
        return JSON.parse(value);
      }
      return value;
    },
    set: function (name, value) {
      return Cookies.set(
        name,
        value,
        GOVUK_COOKIE_OPTIONS
      );
    },
    remove: function (name) {
      return Cookies.remove(
        name,
        GOVUK_COOKIE_OPTIONS
      );
    }
  };

  (function initGA () {
    if (!window.gtag || !window.gaTrackingId) {
      console.error(
        'Google Analytics (GA) has not initialised. GA will not track this session.',
        window.gtag,
        window.gaTrackingId);
      return
    }
    window.gtag('js', new Date());
    window.gtag('config', window.gaTrackingId, { cookie_flags: 'secure'});
  })();

  var $cookieBanner = $('#dsi-cookie-banner.global-cookie-message-dfe-sign-in');
  var $cookieAcceptButton = $cookieBanner.find('button.cookie-accept');

  var getAcceptedAllPolicy = function () {
    var acceptedPolicy = $.extend(DEFAULT_POLICY, {}); // deep copy

    $.each(acceptedPolicy, function (key) {
      acceptedPolicy[key] = true;
    });

    return acceptedPolicy;
  };

  var onCookieAccept = function (event, newPolicy) {
    var acceptedPolicy = newPolicy || getAcceptedAllPolicy();

    GovUKCookie.set(
      COOKIE_NAMES.POLICY,
      acceptedPolicy
    );
    GovUKCookie.set(
      COOKIE_NAMES.PREFERENCES_SET,
      true
    );

    if (event.target === $cookieAcceptButton[0]) {
      $cookieBanner.slideUp();
    }
  };

  if (!GovUKCookie.get(COOKIE_NAMES.PREFERENCES_SET)) {
    GovUKCookie.set(
      COOKIE_NAMES.POLICY,
      DEFAULT_POLICY
    );
    $cookieAcceptButton.click(onCookieAccept);
    if (window.location.pathname !== '/cookies') {
      $cookieBanner.slideDown();
    } else {
      $cookieBanner.show();
    }
  }
  
  var $preferencesForm = $('#dsi-cookie-form.cookies-page-dfe-sign-in__preferences-form');

  $preferencesForm.length && $preferencesForm.on('submit', function (event) {
    event.preventDefault();
    var newPolicy = {
      settings: !!$preferencesForm.find("input[name='cookie.settings']:checked").val()
    };

    var acceptedPolicy = $.extend(DEFAULT_POLICY, newPolicy);
    onCookieAccept(event, acceptedPolicy);

    if (document.referrer) {
      window.location = document.referrer;
    } else {
      window.location.pathname = '/';
    }
    return false;
  });

})(window);