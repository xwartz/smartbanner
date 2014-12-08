smartbanner
===========

smartbanner like iOS's smart app banners 


####usage

###### Safari

```html
<meta name="apple-itunes-app" content="app-id=yourappid">
```

###### Other
```js
var banner = {
    icon: null,               // the url of the app icon
    title: null,              // the title of the app
    author: null,             // the author of the app
    appStore: null,           // the url of app for iOS
    marketUrl: null,          // the url of app for Android
    schemeIOS: null,          // the scheme url for iOS
    schemeAndroid: null,      // the scheme url for Android
    intentUrl: null           // the intent url for chrome 25+
}
```

```js
smartbanner.init(banner)
```
