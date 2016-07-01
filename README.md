# :bird: feedboard
A billboard for showing activity feeds

## Description
__Feedboard__ is a web application that can be used in a kiosk setting to show live activity information from a variety of sources.  Currently the following plugins are supported:

* [Github](https://developer.github.com/webhooks/) (create, ping, push, pull_request)
* [Pivotal Tracker](https://www.pivotaltracker.com/help/api/rest/v5#activity_resource) (activity)
* [Slack](https://api.slack.com/outgoing-webhooks) (outgoing webhooks)
* [Taiga](http://taigaio.github.io/taiga-doc/dist/webhooks.html) _(WIP, not fully implemented yet)_

__Feedboard__ also supports RSS feeds which will be displayed on the right side of the screen. This can be enabled by adding the feeds to the config file.

## Requirements
* [Node.js](https://nodejs.org/en/) (Version 5 and up recommended)
* [Bower](http://bower.io/)

### Installation

* Clone down the repository.
```
git clone https://github.com/snollygolly/feedboard.git
```

* Install node packages (from inside the feedboard folder).
```
npm install
```

* Install front end packages (from inside the feedboard folder)
```
bower install
```

* Create your config.  There's a `config.example.json` file in the root.  Edit it to include all your values for the site and your OAuth information.  Save it as `config.json` and leave it in the root.

* If you want to use Google Analytics, set `config.site.analytics` to your Tracking ID and make sure the analytics partial (analytics.hbs) contains the correct Universal Analytics tracking code.  If you don't want to use Google Analytics, remove that property or set it to false.`

* Make sure your database is running or start it up.
```
rethinkdb
```

* Run the seed script.
```
npm run seed
```

* Start it up.
```
npm start
```

* Enjoy!

## Special Thanks
[Ansira](https://ansira.com/) for helping to support the project and offering to be the test subject.
