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

    //$submitButtons.attr('disabled', 'disabled');

    $submitButton.css('min-width', $submitButton.outerWidth() + 'px')

    $submitButton.find('.loader').removeClass('vh');

    $inputs.each(function() {
      postData[this.name] = $(this).val();
    });

    $('#password').prop('type', 'password').next().removeClass('type-password');

    $.ajax({
      type: 'POST',
      data: postData,
      url: $form.attr('action'),
      context: e.data,
      dataType: 'json',
      success: function (data) {
        if (data.isFailedLogin) {
          this.resetValidation($form);
          this.showValidationMessage(data.validationMessages);
          this.showInlineValidation(data.validationMessages);
          //$submitButtons.removeAttr('disabled');
          $submitButton.find('.loader').addClass('vh');
        } else {
          this.buildFormAndSubmit(data);
        }
      },
      statusCode: {
        403: function () {
          //$submitButtons.removeAttr('disabled');
          $submitButton.find('.loader').addClass('vh');
        },
        500: function () {
          //$submitButtons.removeAttr('disabled');
          this.resetValidation($form);
          this.showValidationMessage(data.validationMessages);
          $submitButton.find('.loader').addClass('vh');
        }
      }
    });
    e.preventDefault();
  },
  resetValidation: function ($form) {

    var $formGroups = $form.find('.form-group');

    $('.error-summary').remove();

    $formGroups.each(function () {
      var $field = $(this).find('input').eq(0);
      if ($(this).hasClass('form-group-error')) {
        $(this).removeClass('form-group-error');
        $(this).find('p.error-message').remove();
        $field.removeAttr('aria-describedby').removeAttr('aria-invalid');
      }
    });
  },

  showValidationMessage: function (messages) {

    var $div = $('<div />').attr('class', 'error-summary').attr('role', 'alert').attr('tabindex', '-1');
    var $h2 = $('<h2 />').attr('class', 'heading-medium error-summary-heading').attr('id', 'error-summary');
    var $ul = $('<ul />').attr('class', 'error-summary-list');

    if (messages) {
      $h2.text('Information missing or incorrect');
      $.each(messages, function (index, value) {
        var $a = $('<a />').attr('href', '#' + index).text(value);
        var $li = $('<li />').append($a);
        $ul.append($li);
      });
    } else {
      $h2.text('There has been an error');
      var $li = $('<li />').html('Please try again later. If the problem continues, follow the link to <a href="https://help.signin.education.gov.uk/contact">submit a support request</a>');
      $ul.append($li);
    }

    $div.append($h2).append($ul);
    $('main').prepend($div);

    $('html, body').animate({
      scrollTop: $div.offset().top - 15
    }, 300);

  },
  showInlineValidation: function(messages) {

    $.each(messages, function( index, value ) {
      var $field = $('input[name=' + index + ']'),
        $parent = $field.parent();

      if ($parent.hasClass('show-password')) {
        $parent = $parent.parent();
      }

      var $label = $parent.find('label').first();

      if (!$parent.hasClass('form-group-error')) {

        var errorMessage = $('<p>')
          .html(value)
          .prop('class', 'error-message')
          .prop('id', 'validation-' + index);
      }

      $label.after(errorMessage);
      $parent.addClass('form-group-error');
      $field.attr({
        'aria-describedby' : 'validation-' + index,
        'aria-invalid': 'true'
      });

    });

  },
  buildFormAndSubmit: function (data) {

    var $form = $('<form />').attr({
      method: 'post',
      action: data.destination
    });

    $.each(data.postbackData, function( index, value ) {
      var $field = $('<input />').attr({
        type: 'hidden',
        name: index,
        value: value
      });
      $form.append($field);
    });

    $('body').append($form);
    $form.submit();
  }
};

if ($('.form-signin').length > 0) {
  NSA.signin.init();
}
