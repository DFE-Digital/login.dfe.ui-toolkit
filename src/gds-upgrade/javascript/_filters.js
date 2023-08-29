/* eslint-disable no-undef */
function toKebabCase(str) {
  return str.toLowerCase().replace(/\s+/g, '-');
}

function updateCount(categoryName) {
  const safeCategoryName = toKebabCase(categoryName);
  const checkedCount = $(`.${safeCategoryName} .govuk-checkboxes__input:checked`).length;
  $(`#${safeCategoryName}-count`).text(checkedCount);
}

function updateCategoryHeader(categoryName) {
  const safeCategoryName = toKebabCase(categoryName);
  const categoryHeader = $(`#${safeCategoryName}-text`);
  const isAnyCheckedInCategory =
    $(`input[id^='show-hide-${safeCategoryName}']:checked`).length > 0;
  categoryHeader.css('display', isAnyCheckedInCategory ? 'block' : 'none');
}

function updateNoFilterMessage() {
  const isAnyCheckedGlobal =
    $('.govuk-checkboxes__input.dfe-filter-input:checked').length > 0;
  $('#show-hide-selected-filters').css(
    'display',
    isAnyCheckedGlobal ? 'none' : 'block',
  );
}

function showMe(boxId, categoryName, checkedElementId) {
  const isChecked = $(`#${checkedElementId}`).prop('checked');
  $(`#${boxId}`).css('display', isChecked ? 'block' : 'none');

  updateCategoryHeader(categoryName);
  updateNoFilterMessage();
}

function hideMe(listId, categoryName, checkboxId) {
  $(`#${listId}`).hide();
  $(`#${checkboxId}`).prop('checked', false);

  updateCount(categoryName);
  updateCategoryHeader(categoryName);
  updateNoFilterMessage();
}


function initializeFilters() {
  $('.govuk-checkboxes__input.dfe-filter-input').each(function () {
    const isChecked = $(this).prop('checked');
    if (isChecked) {
      const checkboxId = $(this).attr('id');
      const parts = checkboxId.match(/show-hide-(.+)-(\d+)/);
      if (parts && parts.length === 3) {
        const categoryName = parts[1];
        const index = parts[2];
        const boxId = `${categoryName}-option-${index}`;

        showMe(boxId, categoryName, checkboxId);
        updateCount(categoryName);
        updateCategoryHeader(categoryName);
        updateNoFilterMessage();
      }
    }
  });
}

$(document).ready(() => {
  initializeFilters();
});
