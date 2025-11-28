const selectAllButtons = $(".select-all-button");
const selectNoneButtons = $(".select-none-button");

selectAllButtons.each((index, button) => {
  const $button = $(button);

  $button.on("click", () => {
    const target = $(`#${$button.data("target")}`);
    const targetCheckboxes = target.find(".govuk-checkboxes__input");
    targetCheckboxes.prop("checked", true);
  });
});

selectNoneButtons.each((index, button) => {
  const $button = $(button);

  $button.on("click", () => {
    const target = $(`#${$button.data("target")}`);
    const targetCheckboxes = target.find(".govuk-checkboxes__input");
    targetCheckboxes.prop("checked", false);
  });
});
