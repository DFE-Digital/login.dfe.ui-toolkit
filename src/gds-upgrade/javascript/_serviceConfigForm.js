/* global window */
/* global $ */
$(() => {
  const createServiceConfigUrlSections = (sectionId, formGroupSelector, labelText) => {
    const addButton = $(`#${sectionId}-add`);
    const formGroup = $(`${formGroupSelector}`);

    addButton.on('click', function addInputFIeld() {
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
      counter += 1;
      formGroup.data(`${sectionId}-counter`, counter);
      $(this).trigger('blur');
      return false;
    });

    formGroup.on('click', '.remove-redirect', function removeInput(e) {
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
    $(eventId).on('click', function generateSecret() {
      const secretArray = window.niceware.generatePassphrase(8);
      const secret = secretArray.join('-');
      // eslint-disable-next-line no-restricted-globals, no-alert
      const isConfirm = window.confirm(confirmMessage);
      if (isConfirm) {
        $(`input#${inputId}`).attr('value', secret);
      }
      $(this).trigger('blur');
      return false;
    });
  }

  handleSecretGeneration('#generate-clientSecret', 'clientSecret', 'Are you sure you want to regenerate the client secret?');
  handleSecretGeneration('#generate-apiSecret', 'apiSecret', 'Are you sure you want to regenerate the API secret?');

  function updateSections() {
    const selectedTypes = [];

    if ($('#response_types-id_token').is(':checked')) {
      selectedTypes.push('ID token');
    }

    if ($('#response_types-token').is(':checked')) {
      selectedTypes.push('Token');
    }

    if ($('#response_types-code').is(':checked')) {
      selectedTypes.push('Code');
    }

    let warningMessage = '';

    if (selectedTypes.length > 0) {
      selectedTypes.sort((a, b) => {
        const order = ['Code', 'ID token', 'Token'];
        return order.indexOf(a) - order.indexOf(b);
      });

      let flowType = 'Implicit';

      if (selectedTypes.length === 1 && selectedTypes.includes('Code')) {
        flowType = 'Authorisation';
      } else if ((selectedTypes.includes('Code') && selectedTypes.includes('Token')) ||
            (selectedTypes.includes('Code') && selectedTypes.includes('ID token'))) {
        flowType = 'Hybrid';
      }

      if (selectedTypes.length === 1 && selectedTypes.includes('Token')) {
        warningMessage = '';
      } else {
        let selectedTypesDisplay;

        if (selectedTypes.length > 1) {
          const allButLast = selectedTypes.slice(0, -1).join(', ');
          const last = selectedTypes[selectedTypes.length - 1];
          selectedTypesDisplay = `${allButLast} and ${last}`;
        } else {
          [selectedTypesDisplay] = selectedTypes;
        }

        warningMessage = `
            <div class="govuk-warning-text govuk-!-margin-top-5 govuk-!-margin-bottom-0">
                <span class="govuk-warning-text__icon" aria-hidden="true">!</span>
                <strong class="govuk-warning-text__text">
                    <span class="govuk-warning-text__assistive">Warning</span>
                    You have selected ${selectedTypesDisplay} as your response type. This means ${flowType} flow is your flow.
                </strong>
            </div>
        `;
      }
    }

    // Remove existing warning, if any
    $('.govuk-warning-text').remove();

    // Add the new warning
    if (warningMessage) {
      $('#response_types-fieldset').append(warningMessage);
    }

    const initialOffset = $('#response_types-code').offset().top;
    const initialScrollPosition = $(window).scrollTop();

    if ($('#response_types-code').is(':checked')) {
      $('#refresh_token-wrapper :input, #clientSecret-wrapper :input, #tokenEndpointAuthMethod-wrapper select').prop('disabled', false);
      $('#refresh_token-wrapper, #clientSecret-wrapper, #tokenEndpointAuthMethod-wrapper').slideDown(500);
    } else {
      $('#refresh_token-wrapper, #clientSecret-wrapper, #tokenEndpointAuthMethod-wrapper').slideUp(500, () => {
        $('#refresh_token-wrapper :input, #clientSecret-wrapper :input, #tokenEndpointAuthMethod-wrapper select').prop('disabled', true);
      });
    }


    const newOffset = $('#response_types-code').offset().top;
    const offsetDifference = newOffset - initialOffset;

    $('html, body').animate({
      scrollTop: initialScrollPosition + offsetDifference,
    }, 50, 'linear');
  }
  updateSections();

  // Event listener for the checkboxes
  $('#response_types-id_token, #response_types-token, #response_types-code').on('change', () => {
    updateSections();
  });
});
