module.exports = {
  bind: function (app) {
    app.get("/", function (req, res) {
      res.render("index");
    });
    app.get("/styles", function (req, res) {
      res.render("styles");
    });
    app.get("/login", function (req, res) {
      res.render("login");
    });
    app.get("/user-profile-access-request", function (req, res) {
      res.render("user-profile-access-request");
    });
    app.get("/change-password-current", function (req, res) {
      res.render("change-password-current");
    });
    app.get("/change-password-new", function (req, res) {
      res.render("change-password-new");
    });
    app.post("/change-password-new", function (req, res) {
      res.render("change-password-new");
    });
    app.get("/user-profile", function (req, res) {
      res.render("user-profile");
    });
    app.get("/concepts/password/strength", function (req, res) {
      res.render("concepts/password/strength");
    });
    app.get("/concepts/password/content", function (req, res) {
      res.render("concepts/password/content");
    });
    app.get("/concepts/password/new", function (req, res) {
      res.render("concepts/password/new");
    });
    app.get("/concepts/portal/services", function (req, res) {
      res.render("concepts/portal/services");
    });
    app.get("/concepts/portal/services-v2", function (req, res) {
      res.render("concepts/portal/services-v2");
    });
    app.get("/concepts/portal/services-v3", function (req, res) {
      res.render("concepts/portal/services-v3");
    });
    app.get("/concepts/components/:comp", function (req, res) {
      var comp = req.params.comp;
      res.render("concepts/components/" + comp);
    });
    app.get("/journeys/:journey/:stepId", function (req, res) {
      var stepId = req.params.stepId;
      var journey = req.params.journey;
      res.render("journeys/" + journey + "/" + stepId);
    });
  },
};
