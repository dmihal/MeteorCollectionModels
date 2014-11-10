CollectionModel = function(name, model, options){
  'use strict';

  var defaultDoc = {
    _id: null
  };

  var transformer = function(doc){
    if (doc && doc._id){
      this._doc._id = doc._id;
    }
    this._dependencies._id = new Deps.Dependency();

    for(var property in model.properties){
      this._dependencies[property] = new Deps.Dependency();

      if (doc && doc[property]){
        this._doc[property] = doc[property];
      }
    }
  };

  var defaultGetter = function(name){
    return function(){
      this._dependencies[name].depend();
      return this._doc[name];
    }
  };
  var defaultSetter = function(name){
    return function(newVal){
      this._dependencies[name].changed();
      this._doc[name] = newVal;
    }
  }

  // Add properties
  for(var property in model.properties){
    var value = model.properties[property].value ? model.properties[property].value : null;
    defaultDoc[property] = value;
    Object.defineProperty(transformer.prototype, property, {
      enumerable: true,
      get: defaultGetter(property),
      set: defaultSetter(property)
    });
  }

  // Add methods
  for (var method in model.methods) {
    if (typeof(model.methods[method]) == "function"){
      transformer.prototype[method] = model.methods[method];
    }
  };

  // Private properties
  Object.defineProperties(transformer.prototype, {
    "_id": {
      enumerable: true,
      get: defaultGetter('_id')
    },
    "_doc": {
      value: defaultDoc
    },
    "_dependencies": {
      value: {}
    }
  });

  options = options || {};
  options.transform = function(doc){
    return new transformer(doc);
  };

  var collection = new Meteor.Collection(name,options);

  // Special methods
  transformer.prototype.save = function(){
    if (this._id) {
      collection.update(this._id, this);
    } else {
      this._doc._id = collection.insert(this);
      //this.register();
    };
    return this;
  };
  transformer.prototype.delete = function(){
    if (this._id){
      collection.remove(this._id);
    }
  };

  // Static methods
  collection.new = function(doc){
    if (doc && doc._id){
      throw "New Model can not have pre-set ID";
    }
    return new transformer(doc);
  };

  return collection;
};
