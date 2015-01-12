define(['thorax'], function (Thorax) {
  return Thorax.Model.extend({
      defaults: {
        // urlRoot: "http://hguo2-centos:8080/FraudServiceTest/"
        urlRoot: "/data"
        // urlRoot: ""
      }
  });
});
