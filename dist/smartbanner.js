(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'module'], factory);
    } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
        factory(exports, module);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, mod);
        global.smartbanner = mod.exports;
    }
})(this, function (exports, module) {
    'use strict';

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var defaults = {
        icon: null, // the url of the app icon
        title: null, // the title of the app
        author: null, // the author of the app
        appStore: null, // the url of app for iOS
        marketUrl: null, // the url of app for Android
        schemeIOS: null, // the scheme url for iOS
        schemeAndroid: null, // the scheme url for Android
        intentUrl: null, // the intent url for chrome 25+
        button: 'OPEN', // the button text,
        rank: '★★★★★' // rank
    };

    var agent = navigator.userAgent;

    var Platform = {
        isAndroid: /Android/i.test(agent),
        isIOS: /iPhone|iPad|iPod/i.test(agent)
    };

    var Browser = {
        isSafari: /Version\/[\d\.]+.*Safari/.test(agent),
        isChrome: /Chrome/i.test(agent),
        isOpera: /Opera/i.test(agent),
        isWechat: /MicroMessenger/i.test(agent)
    };

    var Smartbanner = (function () {
        function Smartbanner(options) {
            _classCallCheck(this, Smartbanner);

            this.options = Object.assign(defaults, options);
            this.init();
        }

        _createClass(Smartbanner, [{
            key: 'init',
            value: function init() {

                // @todo  windows phone/firefox os,etc..
                if (!Platform.isAndroid && !Platform.isIOS) return;

                // Safari use Smart App Banner feature,
                // https://developer.apple.com/library/ios/documentation/AppleApplications/Reference/SafariWebContent/PromotingAppswithAppBanners/PromotingAppswithAppBanners.html
                // Wechat doesn't support.
                if (Browser.isWechat || Browser.isSafari) return;

                this.sb = this.create();
                this.show();
                this.listen();
            }
        }, {
            key: 'create',
            value: function create() {
                var opt = this.options;
                var sb = document.createElement('div');
                sb.setAttribute('id', 'js-smartbanner');
                sb.setAttribute('class', 'smartbanner hide');
                sb.innerHTML = '<div class="sb-container">\n                          <span id="js-close" class="sb-close">×</span>\n                          <img src="' + opt.icon + '" class="sb-icon" />\n                          <div class="sb-info">\n                            <p>' + opt.title + '</p>\n                            <p>' + opt.author + '</p>\n                            <p class="rank">' + opt.rank + '</p>\n                          </div>\n                          <a id="js-open" class="sb-button">\n                            <span>' + opt.button + '</span>\n                          </a>\n                        </div>';
                document.body.appendChild(sb);

                return sb;
            }
        }, {
            key: 'show',
            value: function show() {
                var className = this.sb.className.replace('hide', 'show');
                this.sb.className = className;
            }
        }, {
            key: 'hide',
            value: function hide() {
                var className = this.sb.className.replace('show', 'hide');
                this.sb.className = className;
            }
        }, {
            key: 'close',
            value: function close() {
                this.hide();
            }
        }, {
            key: 'open',
            value: function open() {
                this['try']();
                this.hide();
            }
        }, {
            key: 'listen',
            value: function listen() {
                var _this2 = this;

                var elClose = document.getElementById('js-close'),
                    elOpen = document.getElementById('js-open');

                elClose.onclick = function () {
                    return _this2.close();
                };
                elOpen.onclick = function () {
                    return _this2.open();
                };
            }

            // try to open the app, if not installed then open the store
        }, {
            key: 'try',
            value: function _try() {
                var _this3 = this;

                var _this = this;

                if (Platform.isAndroid) {
                    // if chrome 25+, instead of using the actual URL scheme, use 'intent://'.
                    // see https://developer.chrome.com/multidevice/android/intents
                    // if fail, will open the market
                    var v = agent.match(/Chrome\/(\d+)/);

                    if (25 <= (v && v[1])) {
                        window.location = this.options.intentUrl;
                    } else {
                        (function () {
                            var ifr = document.createElement('iframe');

                            ifr.style.display = 'none';
                            ifr.src = _this3.options.schemeAndroid;
                            document.body.appendChild(ifr);

                            // If fail, open the market or the url you set
                            var d = new Date();
                            setTimeout(function () {
                                if (600 > new Date() - d) {
                                    window.location = _this3.options.marketUrl;
                                }
                            }, 400);
                        })();
                    }
                } else if (Platform.isIOS) {
                    window.location = this.options.schemeIOS;

                    // If fail to open the app store
                    setTimeout(function () {
                        window.location = _this3.options.appStore;
                    }, 250);
                }
            }
        }]);

        return Smartbanner;
    })();

    module.exports = Smartbanner;
});