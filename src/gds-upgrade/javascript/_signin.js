"use strict";

var NSA = NSA || {};

NSA.signin = {
  form: $('.form-signin'),
  init: function () {
    this.setupEvents();
  },
  setupEvents: function () {
    this.form.on('submit', this, this.handleSubmit);
  },
  handleSubmit: function (e) {

    var $form = $(this);
    var $inputs = $form.find('input').not(':checkbox'), postData = {}, $submitButtons = $(this).find('button:submit'), $submitButton = $submitButtons.eq(0);

    $submitButtons.attr('disabled', 'disabled');

    $submitButton.css('min-width', $submitButton.outerWidth() + 'px')

    $submitButton.find('.loader').removeClass('vh');

    $inputs.each(function() {
      postData[this.name] = $(this).val();
    });

    // Hide any password inputs we may have in the form
    var $passwordInputs = $('.password-input');
    $passwordInputs.each(function (i) {
      // Hide password
      $(this).attr("type", "password");
      // Update text in show/hide button
      $(this).siblings('.show-password').html('Show');
    });

    $.ajax({
      type: 'POST',
      data: postData,
      url: $form.attr('action'),
      context: e.data,
      dataType: 'json',
      success: function (data) {
        if (data.redirect) {
          window.location.href = data.uri;
          $('title').html('DfE Sign-in');
        } else {
          if (data.isFailedLogin) {
            this.resetValidation($form);
            $('title').html('Error: DfE Sign-in');
            if (data.delayTill) {
              this.showValidationMessage(data.validationMessages, true);
            } else {
              this.showValidationMessage(data.validationMessages);
              $submitButtons.removeAttr('disabled');
            }
            this.showInlineValidation(data.validationMessages);
            $submitButton.find('.loader').addClass('vh');
          } else {
            this.buildFormAndSubmit(data);
          }
        }
      },
      error: function() {
        this.resetValidation($form);
        this.showValidationMessage();
        $submitButtons.removeAttr('disabled');
        $submitButton.find('.loader').addClass('vh');
      }
    });
    e.preventDefault();
  },
  resetValidation: function ($form) {

    $('.govuk-error-summary').remove();

    var $formGroups = $form.find('.govuk-form-group');

    $formGroups.each(function () {
      var $field = $(this).find('input').eq(0);
      if ($(this).hasClass('govuk-form-group--error')) {
        $(this).removeClass('govuk-form-group--error');
        $(this).find('span.govuk-error-message').remove();
        $field.removeAttr('aria-describedby').removeAttr('aria-invalid');
      }
    });
  },

  showValidationMessage: function (messages, showRefreshLink) {

    var $div = $('<div />').attr('class', 'govuk-error-summary govuk-!-margin-top-6').attr('role', 'alert').attr('tabindex', '-1').attr('aria-labelledby', 'error-summary-title');
    var $h2 = $('<h2 />').attr('class', 'govuk-error-summary__title').attr('id', 'error-summary');
    var $ulContainer = $('<div />').attr('class', 'govuk-error-summary__body');
    var $ul = $('<ul />').attr('class', 'govuk-list govuk-error-summary__list');

    if (messages) {
      $h2.text('There is a problem');
      $.each(messages, function (index, value) {
        if (index === 'loginError') {
          index = 'username';
        }
        var $a = $('<a />').attr('class', 'govuk-link').attr('href', '#' + index).text(value);
        var $li = $('<li />').append($a);
        $ul.append($li);
      });
      if (showRefreshLink) {
        var $a = $('<a />').attr('class', 'govuk-link-bold').attr('href', '').attr('onclick', 'window.location.reload()').text('Refresh this page').css('color', '#1d70b8');
        var $li = $('<li />').append($a);
        $ul.append($li);
      }

    } else {
      $h2.text('There has been an error');
      var $li = $('<li />').html('Please try again later. If the problem continues, follow the link to <a href="https://help.signin.education.gov.uk/contact/form">submit a support request</a>');
      $ul.append($li);
    }
    $div.append($h2).append($ulContainer.append($ul));
    $('main').prepend($div);

    $('html, body').animate({
      scrollTop: $div.offset().top - 15
    }, 300);

  },
  showInlineValidation: function(messages) {

    $.each(messages, function( index, value ) {
      var $field = $('input[name=' + index + ']'),
        $parent = $field.parent();

      var $label = $parent.find('label').first();

      if (!$parent.hasClass('govuk-form-group--error')) {

        var errorMessage = $('<span class="govuk-body">')
          .html('<span class="govuk-visually-hidden">Error:</span>' + value)
          .prop('class', 'govuk-error-message')
          .prop('id', 'validation-' + index);
      }

      $label.after(errorMessage);
      $parent.addClass('govuk-form-group--error');
      $field.attr({
        'aria-describedby' : 'validation-' + index,
        'aria-invalid': 'true'
      });

    });

  },
  buildFormAndSubmit: function (data) {

    var $form = $('<form />').attr({
      method: 'post',
      action: data.destination,
      id: 'dfesigninform'
    });

    $.each(data.postbackData, function( index, value ) {
      var $field = $('<input />').attr({
        type: 'hidden',
        name: index,
        value: value
      });
      $form.append($field);
    });

    $('#dfesigninform').remove();
    $('body').append($form);
    $form.submit();
  },
};

if ($('.form-signin').length > 0) {
  NSA.signin.init();
}

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}
