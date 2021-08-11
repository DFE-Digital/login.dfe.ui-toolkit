var NSA = NSA || {};

NSA = {
  showPassword : function () {
    var $showPassword = $('.show-password');
    $showPassword.each(function (i) {
      var $that = $(this);
      var $pwdFld = $that.find('input:password');
      var $checkLbl = $('<label />').prop({ for: 'show-password-' + i }).html('Show');
      var $checkBox = $('<input />').prop({ type: 'checkbox', id: 'show-password-' + i }).on('change', function () {
        var $that = $(this);
        $pwdFld.prop('type', function () {
          return $that.prop('checked') ? 'text' : 'password';
        });
        $checkLbl.html(function () {
          return $that.prop('checked') ? 'Hide' : 'Show';
        });
        $that.parent().removeClass('type-password');
        if ($that.prop('checked')) {
          $that.parent().addClass('type-password');
        }
      });
      var $cbWrap = $('<div />').prop('class', 'show-password-control').append($checkBox, $checkLbl);
      $pwdFld.after($cbWrap);
    });
  },
  backLink: function () {
    var backLink = $('<a>')
      .attr({ 'href': '#', 'class': 'link-back' })
      .text('Back')
      .on('click', function (e) { window.history.back(); e.preventDefault(); });
    $('.js-back-link').html(backLink);
  },
};


if ($('select.select2').length > 0) {
  $('select.select2').select2({matcher: select2ModelMatcher});
}

function select2ModelMatcher (params, data) {
  data.parentText = data.parentText || "";
  if (typeof(params.term) === 'undefined' || !params.term || params.term.trim() === '') {
    return data;
  }
  if (data.children && data.children.length > 0) {
    var match = $.extend(true, {}, data);
    for (var c = data.children.length - 1; c >= 0; c--) {
      var child = data.children[c];
      child.parentText += data.parentText + " " + data.text;
      var matches = select2ModelMatcher(params, child);
      if (matches == null) {
        match.children.splice(c, 1);
      }
    }
    if (match.children.length > 0) {
      return match;
    }
    return select2ModelMatcher(params, match);
  }
  var original = (data.parentText + ' ' + data.text).toUpperCase();
  var term = params.term.toUpperCase();
  if (original.indexOf(term) > -1) {
    return data;
  }
  return null;
}

if ($('.show-password').length > 0) {
  NSA.showPassword();
}

if ($('.js-back-link')) {
  NSA.backLink();
}

$('.under-construction').on('click', function (e) {
  alert('This functionality is not available yet');
  e.preventDefault();
});

if ($('.notification span.icon').length > 0) {
  $('.notification span.icon').on('click', function () {
    $(this).parent().hide();
  });
}

if ($('article.organisation-services').length > 0) {

  $('.information').on('click', function (e) {
    var info = $(this).parent().parent().find('.service-description');
    e.preventDefault();
    info.toggle();
  });

  $('.info-link').on('click', function (e) {
    var meta = $(this).parent().next();
    e.preventDefault();
    meta.toggle();
  });
}

var searchFields = $('form .search-field');

if (searchFields.length > 0) {

  var loader = $('<span />').addClass('loader spinner-inline');
  var b1 = $('<span />').addClass('ball b-1');
  var b2 = $('<span />').addClass('ball b-2');
  loader.append(b1).append(b2);

  searchFields.each(function () {
    var form = $(this).parent();
    var button = form.find('button');
    form.on('submit', function () {
      button.after(loader).hide();
    });
  });
}

var redirect = $('#redirect-url');

$('#add-redirect').on('click', function() {
  $('<p><label for="redirect-url"><input class="form-control inputConfig" name="redirect_uris"></label></p>').appendTo(redirect);
  return false;
});

var logout = $('#logout-url');

$('#add-logout').on('click', function() {
  $('<p><label for="logout-url"><input class="form-control inputConfig" name="post_logout_redirect_uris"></label></p>').appendTo(logout);
  return false;
});


$('#generate-client-secret').on('click', function() {
  var secretArray = window.niceware.generatePassphrase(8);
  var secret = secretArray.join('-');
  var isConfirm = confirm('Are you sure you want to regenerate the client secret?');
  if (isConfirm) {
    $('input#clientSecret').attr('value', secret);
  }
  return false;
});

$('#generate-api-secret').on('click', function() {
  var secretArray = window.niceware.generatePassphrase(8);
  var secret = secretArray.join('-');
  var isConfirm = confirm('Are you sure you want to regenerate the api secret?');
  if (isConfirm) {
    $('input#apiSecret').attr('value', secret);
  }
  return false;
});

var formRegister = $('.prevent-form-double-submission');

if (formRegister.length > 0) {
  formRegister.each(function () {
    var $submitButtons = $(formRegister).find('button:submit'), $submitButton = $submitButtons.eq(0);
    formRegister.on('submit', function () {
      $submitButtons.attr('disabled', 'disabled');

      $submitButton.css('min-width', $submitButton.outerWidth() + 'px');

      $submitButton.append("<span class='loader spinner-inline'> <span class='ball b-1'></span> <span class='ball b-2'></span> <span class='ball b-3'></span> </span>");

    });
  });
}

var showHideContent = new GOVUK.ShowHideContent()
showHideContent.init()

GOVUK.details.init()

