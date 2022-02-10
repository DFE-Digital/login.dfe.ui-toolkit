function validatePassword() {
  var id =  $(this).attr("id")
  $(`#validation-feedback-${id}`).slideDown();
  /*Array of rules and the information target*/
  var rules = [{
      Pattern: /(.*[A-Z]){2}/,
      Target: `upper-case-${id}`
    },
    {
      Pattern: /(.*[a-z]){2}/,
      Target: `lower-case-${id}`
    },
    {
      Pattern: /(.*\d){2}/,
      Target: `numbers-${id}`
    },
  ];
  var password = $(this).val();
  $(`#length-${id}`).removeClass(password.length > 7 ? "icon-remove" : "icon-ok");
  $(`#length-${id}`).addClass(password.length > 7 ? "icon-ok" : "icon-remove");

  for (var i = 0; i < rules.length; i++) {
    $("#" + rules[i].Target).removeClass(new RegExp(rules[i].Pattern).test(password) ? "icon-remove" : "icon-ok"); 
    $("#" + rules[i].Target).addClass(new RegExp(rules[i].Pattern).test(password) ? "icon-ok" : "icon-remove");
  }
}

function initialiseValidatePassword() {
  var $passwordInput = $(this)
  var id = $passwordInput.attr("id")
  var validatePasswordHtml = $(`<div id='validation-feedback-${id}' style='display: none;'>`)
  .append(`<div id='length-${id}' class='icon-remove'>8 charcters minimum</div>`)
  .append(`<div id='upper-case-${id}' class='icon-remove'>contain at least 2 upper-case characters</div>`)
  .append(`<div id='lower-case-${id}' class='icon-remove'>contain at least 2 lower-case characters</div>`)
  .append(`<div id='numbers-${id}' class='icon-remove'>contain at least 2 numbers</div>`);

  $passwordInput.before(validatePasswordHtml);
}

$('.password-input-check').one('click', initialiseValidatePassword);
$('.password-input-check').on('keyup', validatePassword);
