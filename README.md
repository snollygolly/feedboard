# :ledger: feedboard
A billboard for showing activity feeds

## Description
__Feedboard__ is a web application that can be used in a kiosk setting to show live activity information from a variety of sources.  Currently the following plugins are supported:

* [Github](https://developer.github.com/webhooks/) (create, ping, push, pull_request)
* [Pivotal Tracker](https://www.pivotaltracker.com/help/api/rest/v5#activity_resource) (activity)

## Requirements
* [Node.js](https://nodejs.org/en/) (Version 5 and up recommended)

### Installation

* Clone down the repository.
```
git clone https://github.com/snollygolly/feedboard.git
```

* Install node packages (from inside the feedboard folder).
```
npm install
```

* Create your config.  There's a `config.json.example` file in the root.  Edit it to include all your values for the site and your OAuth information.  Save it as `config.json` and leave it in the root.

* If you want to use Google Analytics, set `config.site.analytics` to your Tracking ID and make sure the analytics partial (analytics.hbs) contains the correct Universal Analytics tracking code.  If you don't want to use Google Analytics, remove that property or set it to false.`

* Start it up.
```
npm start
```

* Enjoy!
