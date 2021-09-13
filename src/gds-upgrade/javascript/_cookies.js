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
  getRaw: function (name) {
    if (!window.Cookies) {
      return;
    }

    return window.Cookies.get(name);
  },
  get: function (name) {
    if (!window.Cookies) {
      return;
    }

    var value = window.Cookies.get(name);
    if (value) {
      return JSON.parse(value);
    }
    return value;
  },
  set: function (name, value) {
    if (!window.Cookies) {
      return;
    }

    return window.Cookies.set(
      name,
      value,
      GOVUK_COOKIE_OPTIONS
    );
  },
  remove: function (name) {
    if (!window.Cookies) {
      return;
    }

    return window.Cookies.remove(
      name,
      GOVUK_COOKIE_OPTIONS
    );
  }
};

(function (window) {
  var $ = window.$;
  var Cookies = window.Cookies;
  if (!Cookies || !$) {
    return;
  }

  var $cookieBanner = $('#dsi-cookie-banner');
  var $cookieAcceptButton = $cookieBanner.find('#cookie-accept');

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

  var $preferencesForm = $('#dsi-cookie-form');

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

function checkConditionForUsersBanner() {
  // Check user's consent for the cookie
  var cookiePreferencesSet = GovUKCookie.getRaw('cookies_preferences_set');
  var cookiePolicy = GovUKCookie.get('cookies_policy');

  if (!!cookiePreferencesSet && !!cookiePolicy && cookiePolicy.settings) {
    var lastSeen = GovUKCookie.getRaw('user_banner_last_seen');
    if (!!lastSeen) {
      var numberOfDays = (new Date().getTime() - lastSeen) / (1000 * 3600 * 24);
      if (numberOfDays > 90) {
        // if the period is longer than 90 days show/update the banner
        return true;
      }
    } else {
      // if there is no value then show/update the banner
      return true;
    }
  }
  return false;
}

function showReviewUsersBanner(){
  $('#review-users-banner').show();
}

function setReviewUsersBannerLastSeen(){
  GovUKCookie.set('user_banner_last_seen', new Date().getTime());
}

function loadReviewUsersBanner() {
  if (checkConditionForUsersBanner()) {
    showReviewUsersBanner();
  }
}

function updateCookieReviewUsersBanner(){
  if (checkConditionForUsersBanner()) {
    setReviewUsersBannerLastSeen();
  }
}
