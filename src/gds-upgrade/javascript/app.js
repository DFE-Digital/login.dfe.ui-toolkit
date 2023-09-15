var NSA = NSA || {};

NSA = {

  initialiseShowPassword : function () {
    // Get all the password inputs in the page and loop through them to add the show/hide button
    var $passwordInputs = $('.password-input');
    $passwordInputs.each(function (i) {
      var $that = $(this);
      // Create show/hide button
      var $showButton = $('<button />').prop({ type: 'button', class: 'show-password govuk-button govuk-button--secondary govuk-!-margin-bottom-1', ariaLabel = 'Show password' });
      $showButton.html('Show');
      // When clicking on that button we will show/hide the password accordingly
      $showButton.on('click', function(){
        if($that.attr('type') === 'password'){
          $that.attr("type", "text");
          $showButton.text("Hide");
        } else {
          $that.attr("type", "password");
          $showButton.text("Show");
        }
      });
      // Add button to the document
      $that.after($showButton);
    });
  },

  backLink: function () {
    var backLink = $('<a>')
      .attr({ 'href': '#', "class": "govuk-back-link-bold" })
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

if ($('.password-input').length > 0) {
  NSA.initialiseShowPassword();
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

//Manage console service config form functionality

const createServiceConfigUrlSections = (sectionId, formGroupSelector, labelText ) => {
  const addButton = $(`#${sectionId}-add`);
  const formGroup = $(`${formGroupSelector}`);

  addButton.on('click', function() {
    let counter = parseInt(formGroup.data(`${sectionId}-counter`), 10);
    const newInputId = `${sectionId}-${counter}`;
    const newElement = `
      <div class="govuk-body dfe-flex-container" id="${sectionId}-input-group-${counter}">
        <label for="${newInputId}" class="govuk-label govuk-label--s govuk-visually-hidden">
          ${labelText}
        </label>
        <input
          class="form-control dfe-flex-input-grow govuk-input"
          id="${newInputId}"
          name="${sectionId}"
        />
        <a href="#" class="govuk-link govuk-link--no-visited-state remove-redirect" id="${sectionId}-remove-${counter}" data-group-id="${counter}">Remove</a>
      </div>`;

    $(newElement).appendTo(formGroup);
    counter++;
    formGroup.data(`${sectionId}-counter`, counter);
    $(this).trigger('blur');
    return false;
  });

  formGroup.on('click', '.remove-redirect', function(e) {
    e.preventDefault();
    const groupId = $(this).data('group-id');
    $(`#${sectionId}-input-group-${groupId}`).remove();
    $(this).trigger('blur');

    const newCounter = formGroup.find('.dfe-flex-container').length;
    formGroup.data(`${sectionId}-counter`, newCounter);
  });
};

createServiceConfigUrlSections('redirect_uris', '#redirect_uris-form-group', 'Redirect URL');
createServiceConfigUrlSections('post_logout_redirect_uris', '#post_logout_redirect_uris-form-group', 'Logout redirect URL');



function handleSecretGeneration(eventId, inputId, confirmMessage) {
  $(eventId).on('click', function() {
    let secretArray = window.niceware.generatePassphrase(8);
    let secret = secretArray.join('-');
    let isConfirm = confirm(confirmMessage);
    if (isConfirm) {
      $(`input#${inputId}`).attr('value', secret);
    }
    $(this).blur();
    return false;
  });
}

handleSecretGeneration('#generate-clientSecret', 'clientSecret', 'Are you sure you want to regenerate the client secret?');
handleSecretGeneration('#generate-apiSecret', 'apiSecret', 'Are you sure you want to regenerate the API secret?');


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

$('.auto-scroll-on-change').on('change', function(e) {
  $(window).scrollTop($('.auto-scroll-dest').position().top);
});

$('.close-button').on('click', function(e) {
  var notification = e.target.closest(".govuk-notification-banner");
  notification.remove();
});

// select next element in the template, show it and hide the toggle link
$('.toggle-open').on('click', function (e) {
  var meta = $(this).next();
  e.preventDefault();
  meta.removeClass('govuk-visually-hidden');
  $(this).addClass('govuk-visually-hidden');
});

// #region Session time out

var tabId = new Date().getTime();

function sessionTimeout() {
  localStorage.removeItem('uri');

  window.onfocus = function () {
    countTimeDiff();
  }

  setTimeout(function() {

    // Tabs are set to check if other tabs running timer then set to 1
    // when set to 0 means 'Stay signed in' is selected
    localStorage.setItem('tabs',  '1');

    $('.session-timeout-overlay').show();
    $('#modal-signin').focus();

    startTimer();
  }, 14 * 59 * 1000); // minute * seconds * milliseconds e.g 14 * 59 * 1000
}

$('#modal-signin').on("click", ()=>{
  clearInterval(timeoutTimer);
  localStorage.setItem('tabs', '0')
  location.reload();
});

$('#modal-signout').on("click", ()=>{
  clearInterval(timeoutTimer);
  location.href = '/signout'
});

var timeoutTimer;

function startTimer() {
  var timePlaceHolder = "4 minutes and 60 seconds"

  timeoutTimer = setInterval(function() {

  if (localStorage.getItem('tabs') === '0'){
    clearInterval(timeoutTimer);
    location.reload();
  }

  var timer = timePlaceHolder.split('and');
  var minutes = parseInt(timer[0], 10);
  var seconds = parseInt(timer[1], 10);
  --seconds;
  minutes = (seconds < 0) ? --minutes : minutes;
  seconds = (seconds < 0) ? 59 : seconds;
  seconds = (seconds < 10) ? '0' + seconds : seconds;

  $('#minutes').html(minutes);
  $('#seconds').html(seconds);

  if (minutes < 0 || (seconds <= 0) && (minutes <= 0)) {
    callTimeout();
   } else if(tabId) {
    countTimeDiff();
   }

  timePlaceHolder = minutes + ' minutes and ' + seconds + ' seconds';
}, 1000);
}

function callTimeout() {
  clearInterval(timeoutTimer);
  localStorage.setItem('uri', location.pathname);
  location.href = '/signout';
}

function countTimeDiff() {
  var diff = new Date().getTime() - Number(tabId);
  var minutes = diff/(60 * 1000);

  if (minutes > 20) {
    localStorage.setItem('uri', location.pathname);
    clearInterval(timeoutTimer);
    location.reload();
  }
}

// #endregion

var showHideContent = new GOVUK.ShowHideContent()
showHideContent.init()

GOVUK.details.init()
