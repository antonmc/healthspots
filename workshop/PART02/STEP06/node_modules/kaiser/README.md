
kaiser
======

Serialization library that allows arbitrary objects and classes to be
serialized or deserialized in a safe way.

kaiser can serialize standard JavaScript data, objects, arrays and
dates out of the box. Anything else must be registered.


Usage
-----

Simple serialization/deserialization

    var kaiser = require("kaiser");
    var str = kaiser.serialize({a: 1, b: new Date()});
    var obj = kaiser.deserialize(str);


### whitelists

You can also instantiate a `Serializer` object with a whitelist, which
means only a limited list of approved objects and classes can be
serialized or deserialized. The resulting serializer, when used on
unsanitized data, will be as safe as the most unsafe object in the
whitelist, so be careful:

    var kaiser = require("kaiser");
    var s = kaiser.Serializer([Date, Person]);

    var str1 = ser.serialize({a: new Date(), b: new Person()}); // OK!
    var obj2 = ser.deserialize(str1);                           // OK!

    var str2 = ser.serialize({a: 1, b: new Animal()});          // ERROR!

    var str3 = kaiser.serialize({a: 1, b: new Animal()});       // OK (generic serializer)
    var obj3 = ser.deserialize(str3);                           // ERROR!


Registering functionality
-------------------------

To register with `kaiser` you need to assign a uuid to your class or
function. A uuid is a unique symbol which can identify your
functionality in any application that imports it and will not clash
with any other package. There are a few ways to do it, and `kaiser`
can help you.

First you must import `kaiser`, for that you have two options:

    // Option A: Import the full package
    kaiser = require("kaiser");

    // Option B: Import only the registering functions
    kaiser = require("kaiser/reg");

The difference between the two is that option B only defines a few
stubs to let you register your classes for serialization and is about
300 bytes minified, so it is super cheap if you only want to provide
the functionality to people who need it. Then when they import the
full `kaiser` package, the serializers will get registered for real.

Now, suppose you have the following definition:

    function Vehicle(brand) {
        this.brand = brand;
    }
    Vehicle.prototype.start = function () {
        console.log("vroom vroom!");
    }


### Use package info

This will assign `Vehicle` the uuid `npm:my-package/Vehicle`:

    kaiser.register(Vehicle.prototype, {
        package: {name: "my-package", "version": "1.2.3"}
    });

This will assign `Vehicle` the uuid `npm:my-package@1/Vehicle`:

    kaiser.register(Vehicle.prototype, {
        package: {name: "my-package", "version": "1.2.3"},
        useVersion: "major"
    });

Of course, if you have a `package.json` file in the same directory,
you should simply do this:

    kaiser.register(Vehicle.prototype, {
        package: require("./package.json"),
        useVersion: "minor"
    });

To register more than one class, use `kaiser.registerAll`:

    kaiser.registerAll([Vehicle.prototype, Animal.prototype], {
        package: require("./package.json"),
        useVersion: "minor"
    });


### uuid

Install the `uuid` command on your system and run it. It will give you
a (presumably) unique hexadecimal identifier that you can paste in
your code:

    $ uuid
    bfd249d8-302a-11e5-8044-278351ad39e9

Then you must set the `typeId` field:

    kaiser.register(Vehicle.prototype, {
        typeId: "bfd249d8-302a-11e5-8044-278351ad39e9"
    });

`kaiser.registerAll` can be used with just one `typeId`. What it will
do is that it will generate ids like
`bfd249d8-302a-11e5-8044-278351ad39e9/Vehicle` and so on.


### uuid interface

In order to generate a uuid, `kaiser` follows these steps:

* If the configuration object contains:
* `typeId` and `variant`: `typeId + JSON.stringify(variant)`
* `typeId` and `nameVariant === true`: `typeId + object.name`
* `typeId` and `nameVariant`: `typeId + nameVariant`
* `typeId`: `typeId`
* `package` and `useVersion`: `package@version/object.name`

Note that `registerAll` and `registerSingletons` automatically set
`nameVariant` in order to differentiate the entries. It is thus
important that they all have names.


Registering functions and singletons
------------------------------------

By default, `kaiser` understands that what is being registered is a
prototype, and that objects that directly inherit from the prototype
are those that we wish to serialize.

On the other hand, you may want to serialize functions, or objects
as-is. To that purpose you may use `kaiser.registerFunction` or
`kaiser.registerSingleton` (they are the same thing). Both functions
have a plural equivalent that lets you register more than one thing at
once.


    function hello(name) {
        return "hello, " + name
    }
    function bye(name) {
        return "bye, " + name
    }

    kaiser.registerSingletons([hello, bye], {
        package: require("./package.json"),
        useVersion: "patch"
    });


The above will registers ids "npm:my-package@1.2.3/hello" and
"npm:my-package@1.2.3/bye".


Custom serialization
--------------------

By default `kaiser.serialize` will pack all the fields in an object
and `kaiser.deserialize` will instantiate an object with the right
prototype and write the fields back.

But you can change this. Here is a simple example (of a flawed
serialization mechanism):

    kaiser.register(Person.prototype, {
        typeId: "bfd249d8-302a-11e5-8044-278351ad39e9",
        serialize: function (person) {
            return person.name + "/" + person.age;
        },
        deserialize: function (person) {
            fields = person.split("/");
            return new Person(fields[0], parseInt(fields[1]));
        }
    });

The serialization and deserialization interface is as follows:

**`serialize(object)`** must return either some primitive type like a
String or Number, or a plain object or array in which the fields are
*not serialized* (in other words, do not call `kaiser.serialize` in
that function). `kaiser` will serialize these fields for you so that
you can focus on the logic.

**`deserialize(form)`** must rebuild the object previously serialized
exactly. It will receive the same output serialize produced, with
already deserialized fields (do not call `kaiser.deserialize` in that
function).












