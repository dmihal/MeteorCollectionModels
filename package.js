Package.describe({
  summary: "Add model functionality to Meteor Collections"
});

Package.on_use(function (api) {
  api.use(['underscore', 'deps']);
  api.export('CollectionModel');
  api.add_files('collection_model.js', ['client', 'server']);
});
