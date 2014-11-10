CollectionModels
======================

This package supplements Meteor's awesome collection system by making your data behave more like _objects_ than _documents_.


Defined Schema
--------------

To create a vanilla Meteor collection, you would define a collection with code like this:

    Cars = new Meteor.Collection('cars');

Creating a CollectionModel is similar, but you must define the schema of your collection. This is as simple as the following:

    Cars = new CollectionModel('cars',{
      properties: {
        licencePlate: null,
        model: 'generic',
        speed: 0
      }
    });

The object returned is simply a modified version of Meteor.Collection, so you can still use the same functions you're used to like `Cars.find()` and `Cars.findOne()`.

Responsive
----------

Responsiveness is one of the coolest things about the Meteor Framework. CollectionModels extends this functionality to your Models, so they will update reactively.

    > var car = Cars.findOne();
    > Deps.autorun(function(){
        console.log(car.model);
      });
    "generic"
    > car.model = "Tesla"
    "Tesla"

Methods
-------

Say you wanted to write an `accelerate` function to increase the speed of a car. With CollectionModels, you can add a simple method to the collection like this:

    Cars = new CollectionModel('cars',{
      properties: {
        licencePlate: null,
        model: 'generic',
        speed: 0
      },
      methods: {
        accelerate: function(){
          this.speed = this.speed + 1;
          this.save();
        }
      }
    });

Now making a car acclerate is as easy as this:

    var car = Cars.fetchOne();
    car.accelerate();


Special Methods
---------------

CollectionModels includes few methods in each model to handle common actions

To save a model, you can call the `.save()` method. This method will save your model to the Meteor server, and insert if it doesn't exist yet.

Similarly, the `.delete()` method will remove your model from the collection, if it exists.


Reference
---------

### CollectionModel

####.new()
Create a new Model object with default paramaters

    Cars = new CollectionModel('cars',{...});
    var car = Cars.new();
    car.save() // Save model to server

This model does not exist in the collection until `.save()` is called.

####.find()
Same as Collection.find()

####.findOne()
Same as Collection.findOne()


### Model

####.save()
Save the model to the collection. The model will be updated if it already exists or inserted if it does not exist on the server.

####.delete()
The model will be removed from the collection
