/*!
 * smartbanner.js v0.0.1
 * https://github.com/xwartz/smartbanner
 *
 * Copyright 2014, xwartz
 * Date: 2014-12-08
 * MIT
 * 
 */


 ;(function () {
    
    'use strict';

    var Platform = {
      isAndroid: /Android/i.test(navigator.userAgent),
      isIOS: /iPhone|iPad|iPod/i.test(navigator.userAgent)
    }

    var Browser = {
        isSafari: /iPhone|iPad|iPod/i.test(navigator.userAgent) && /Safari/.test(navigator.userAgent) && /CriOS/.test(navigator.userAgent) === false,
        isChrome: /Chrome/.test(navigator.userAgent),
        isOpera: /Opera/.test(navigator.userAgent),
        isWechat: /MicroMessenger/i.test(navigator.userAgent)
    }

    var Smartbanner = {

        banner: {
            icon: null,               // the url of the app icon
            title: null,              // the title of the app
            author: null,             // the author of the app
            appStore: null,           // the url of app for iOS
            marketUrl: null,          // the url of app for Android
            schemeIOS: null,          // the scheme url for iOS
            schemeAndroid: null,      // the scheme url for Android
            intentUrl: null           // the intent url for chrome 25+
        },

        init: function (option) {
            // If safari use Smart App Banner feature,
            // https://developer.apple.com/library/ios/documentation/AppleApplications/Reference/SafariWebContent/PromotingAppswithAppBanners/PromotingAppswithAppBanners.html
            // If wechat, doesn't support.
            if(Browser.isWechat || Browser.isSafari) return;

            if(!Platform.isAndroid && !Platform.isIOS) return;

            this.banner = option;
            this._create();
            this._show();
            this._listen();
        },

        _create: function () {
            var sb = this.sb = document.createElement('div');
            sb.setAttribute('id', 'js-smartbanner');
            sb.setAttribute('class', 'smartbanner hide');
            sb.innerHTML = '<div class=sb-container>'
                         +    '<span id=js-close class=sb-close>×</span>'
                         +    '<img src=' + this.banner.icon + ' class=sb-icon />'
                         +     '<div class=sb-info>'
                         +       '<p>' + this.banner.title + '</p>'
                         +       '<p>' + this.banner.author + '</p>'
                         +       '<p class="rating">★★★★★</p>'
                         +     '</div>'
                         +     '<a id=js-open class=sb-button>'
                         +        '<span>OPEN</span>'
                         +     '</a>'
                         + '</div>';

            document.body.appendChild(sb);
        },

        _show: function () {
            var className = this.sb.className.replace('hide', 'show');
            this.sb.className = className;
        },

        _hide: function () {
            var className = this.sb.className.replace('show', 'hide');
            this.sb.className = className;
        },

        _close: function () {
            this._hide();
        },

        _open: function () {
            this._try();
            this._hide();
        },

        _listen: function () {
            var close = this.btnClose = document.getElementById('js-close');
            var open = this.btnOpen = document.getElementById('js-open');
            var _this = this;
            close.onclick = function(){
                 _this._close();
            }
            open.onclick = function () {
                _this._open();
            }
        },

        // try to open the app, if not installed then open the store
        _try: function () {

            if (Platform.isAndroid) {
                // if chrome 25+, instead of using the actual URL scheme, use 'intent://'.
                // see https://developer.chrome.com/multidevice/android/intents
                // if fail, will open the market
                var v = navigator.userAgent.match(/Chrome\/(\d+)/);
                if (25 <= (v && v[1])) {
                    window.location = this.banner.intentUrl;
                } else {
                    var ifr = document.createElement("iframe");
                    ifr.style.display = 'none';
                    ifr.src = this.banner.schemeAndroid;
                    document.body.appendChild(ifr);

                    // If fail, open the market or the url you set
                    var d = new Date;
                    window.setTimeout(function() {
                       if(600 > new Date - d) {
                           window.location = this.banner.marketUrl;
                       }
                    }, 400);
                }
            } else if (Platform.isIOS) {
                window.location = this.banner.schemeIOS;

                // If fail to open the app, open the store
                window.setTimeout(function() {
                    window.location = this.banner.appStore;
                }, 250);
            }
        }

    }

    window.smartbanner = Smartbanner;

 })();
