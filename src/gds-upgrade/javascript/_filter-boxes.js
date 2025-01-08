/* global $ */

// ESLint rules disabled for this line as let/const do not allow for the same functionality.
// eslint-disable-next-line no-var, no-use-before-define
var NSA = NSA || {};
const filterBoxes = $(".filter-box");

NSA.filters = {
  init() {
    function checkCountText(checkboxes) {
      return checkboxes.filter(":checked").length > 0
        ? `${checkboxes.filter(":checked").length} selected`
        : "";
    }

    filterBoxes.each((_, element) => {
      const filterBox = $(element);
      const header = filterBox.find(".container-head");
      const title = header.find(".option-select-label");
      const checkboxes = filterBox.find("input:checkbox");
      const button = $("<button />").addClass("js-container-head");
      const checkCount = $("<div />")
        .addClass("js-selected-counter")
        .text(() => checkCountText(checkboxes));

      button
        .on("click", (e) => {
          const target = $(e.currentTarget);
          const options = target.next();
          if (target.hasClass("closed")) {
            options.show();
            target.removeClass("closed").attr("aria-expanded", true);
          } else {
            options.hide();
            target.addClass("closed").attr("aria-expanded", false);
          }
          e.preventDefault();
        })
        .append(title, checkCount);

      header.replaceWith(button);

      checkboxes.on("change", () => {
        checkCount.text(() => checkCountText(checkboxes));
      });
    });
  },
};

if (filterBoxes.length > 0) {
  NSA.filters.init();
}
