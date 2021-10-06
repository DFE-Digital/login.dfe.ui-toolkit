var COOKIE_NAMES = {
  PREFERENCES_SET: 'cookies_preferences_set',
  POLICY: 'cookies_policy',
  GA: '_ga',
  GA_GID: '_gid',
  GA_GAT: '_gat'
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

// function that will remove any existing tracking cookies on page load
(function () {
  GovUKCookie.remove(COOKIE_NAMES.POLICY);
  GovUKCookie.remove(COOKIE_NAMES.PREFERENCES_SET);
  GovUKCookie.remove(COOKIE_NAMES.GA);
  GovUKCookie.remove(COOKIE_NAMES.GA_GAT);
  GovUKCookie.remove(COOKIE_NAMES.GA_GID);
})();
