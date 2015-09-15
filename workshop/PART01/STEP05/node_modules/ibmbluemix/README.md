Mobile Cloud Services Core JavaScript SDK for IBM Bluemix
===

This package contains the required native components to interact with the IBM Mobile Cloud Services for Bluemix.  You can use the JavaScript SDK to build Web or Hybrid applications. You can also use this SDK in server-side [Node.js](http://nodejs.org)
JavaScript modules. The SDK manages all the communication and security integration between
the client and the Mobile Cloud Services in Bluemix.

When you use Bluemix to create a Mobile Cloud application, BlueMix provisions multiple services under a single application context. Your mobile application is given access to the following mobile services: Mobile Application Security, Push, and Mobile Data.

Version: v1.0.0-20150720-1718

##Install the SDK
You can install the SDK by downloading a [zip file](https://mbaas-catalog.ng.bluemix.net/sdk/ibm-bluemix-sdk-javascript.zip),
or by installing the desired components with [Bower](http://bower.io), or [NPM](https://www.npmjs.org/).
Using the Bower or NPM tools can shorten the time required to start a new project and make managing library version requirements
as well as the dependencies easier.  If you
are using one of the [samples](https://hub.jazz.net/user/mobilecloud),
instructions for using the package manager is included with the documentation.

### Get the SDK for Node.js (NPM)

NPM is included in current Node.js distributions.  To install Node.js, go to [Download Node.js](http://nodejs.org/download/). 

Run the following command to install the `ibmbluemix` package:

```bash
npm install ibmbluemix
```

### Get the SDK for Web or Hybrid (Bower)

To install Bower, see [Bower.io](http://bower.io/).  

Run the following command to install the `ibmbluemix` package:

```
bower install https://hub.jazz.net/git/bluemixmobilesdk/ibmbluemix-javascript/.git
```

###Download zip file

To download a zip of the entire SDK, see [Building Mobile Cloud applications](https://www.ng.bluemix.net/docs/#starters/mobile/index.html#index).

###SDK modules

The complete SDK consists of a core, plus a collection of modules that correspond to function that is included in the Mobile Cloud Services.  

The downloaded zip file contains all of these components. However, each piece of the JavaScript SDK is also available as a separate module that you can add to your project individually so that you can choose the modules that are required for your application.

You can add any of the following components to your project:

- **[ibmbluemix](https://hub.jazz.net/project/bluemixmobilesdk/ibmbluemix-javascript/overview)** : SDK foundation, and controls connection and communication with back end services
- **[ibmpush](https://hub.jazz.net/project/bluemixmobilesdk/ibmpush-javascript/overview)** - Service SDK for Push
- **[ibmdata](https://hub.jazz.net/project/bluemixmobilesdk/ibmdata-javascript/overview)** - Service SDK for Mobile Data
- **[ibmfilesync](https://hub.jazz.net/project/bluemixmobilesdk/ibmfilesync-javascript/overview)** - Service SDK for cloud file storage with Mobile Data
- **[ibmcloudcode](https://hub.jazz.net/project/bluemixmobilesdk/ibmcloudcode-javascript/overview)** - Service SDK for cloud code invocation
- **[ibmlocation](https://hub.jazz.net/project/bluemixmobilesdk/ibmlocation-javascript/overview)** - Service SDK for the beta mobile location services
- **docs/** - Documentation for the SDK

##Get started

Services are associated with a Mobile Cloud application. Connectivity and interaction with
these services depends on the application ID, application secret, and application route that is associated with a Mobile Cloud Application.

The `IBMBluemix` module is the entry point for interacting with the Mobile Cloud Services SDKs.  You must invoke the `initialize` method before any other API calls.  `IBMBluemix` provides information about the current SDK level and access to service SDKs.

An example of initializing the Mobile Cloud Services SDK follows:
```javascript
var config = {
  applicationId:"<ApplicationID>",
  applicationRoute:"<ApplicationRoute>",
  applicationSecret:"<ApplicationSecret>"
};
IBMBluemix.initialize(config);
```

##Learn more
To learn more about using the SDK, please consult the following resources:
- **[Mobile Cloud Services SDK Developer Guide](http://mbaas-gettingstarted.ng.bluemix.net/)**
- **[Samples and Tutorials](https://www.ng.bluemix.net/docs/#starters/mobile/index.html#samples)**
- **[Bluemix Developers Community](https://developer.ibm.com/bluemix/)**
- Connect with Bluemix: [Twitter](https://twitter.com/ibmbluemix) |
[YouTube](https://www.youtube.com/playlist?list=PLzpeuWUENMK2d3L5qCITo2GQEt-7r0oqm) |
[Blog](https://developer.ibm.com/bluemix/blog/) |
[Facebook](https://www.facebook.com/ibmbluemix) |
[Meetup](http://www.meetup.com/bluemix/)

*Licensed Materials - Property of IBM
(C) Copyright IBM Corp. 2013, 2015. All Rights Reserved.
US Government Users Restricted Rights - Use, duplication or
disclosure restricted by GSA ADP Schedule Contract with IBM Corp.*

[Terms of Use](https://hub.jazz.net/project/bluemixmobilesdk/ibmbluemix-android/overview#https://hub.jazz.net/gerrit/plugins/gerritfs/contents/bluemixmobilesdk%252Fibmbluemix-android/refs%252Fheads%252Fmaster/License.txt) |
[Notices]()
