const defaults = {
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

const agent = navigator.userAgent;

const Platform = {
    isAndroid: /Android/i.test(agent),
    isIOS: /iPhone|iPad|iPod/i.test(agent)
};

const Browser = {
    isSafari: /Safari/i.test(agent) && !/Chrome/i.test(agent),
    isChrome: /Chrome/i.test(agent),
    isOpera: /Opera/i.test(agent),
    isWechat: /MicroMessenger/i.test(agent)
};

class Smartbanner {
    constructor(options) {
        this.options = Object.assign(options);
        this.init();
    }

    init() {
        // Safari use Smart App Banner feature,
        // https://developer.apple.com/library/ios/documentation/AppleApplications/Reference/SafariWebContent/PromotingAppswithAppBanners/PromotingAppswithAppBanners.html
        // Wechat doesn't support.
        if (Browser.isWechat || Browser.isSafari) return;
        // @todo  windows phone/firefox os,etc..
        if (!Platform.isAndroid && !Platform.isIOS) return;

        this.sb = this.create();

    }

    create() {
        let opt = this.options;
        let sb = document.createElement('div');
        sb.setAttribute('id', 'js-smartbanner');
        sb.setAttribute('class', 'smartbanner hide');
        sb.innerHTML = `<div class="sb-container">
                          <span id="js-close" class="sb-close">×</span>
                          <img src="${opt.icon}" class="sb-icon" />
                          <div class="sb-info">
                            <p>${opt.title}</p>
                            <p>${opt.author}</p>
                            <p class="rank">${opt.rank}</p>
                          </div>
                          <a id="js-open" class="sb-button">
                            <span>${opt.button}</span>
                          </a>
                        </div>`;
        document.body.appendChild(sb);

        return sb;
    }

    show() {
        let className = this.sb.className.replace('hide', 'show');
        this.sb.className = className;
    }

    hide() {
        let className = this.sb.className.replace('show', 'hide');
        this.sb.className = className;
    }

    close() {
        this.hide();
    }

    open() {
        this.try();
        this.hide();
    }

    listen() {
        let elClose = document.getElementById('js-close'),
            elOpen = document.getElementById('js-open');

        elClose.onclick = () => this.close();
        elOpen.onclick = () => this.open();
    }

    // try to open the app, if not installed then open the store
    try () {
        let _this = this;

        if (Platform.isAndroid) {
            // if chrome 25+, instead of using the actual URL scheme, use 'intent://'.
            // see https://developer.chrome.com/multidevice/android/intents
            // if fail, will open the market
            let v = agent.match(/Chrome\/(\d+)/);

            if (25 <= (v && v[1])) {
                window.location = this.options.intentUrl;
            } else {
                let ifr = document.createElement('iframe');

                ifr.style.display = 'none';
                ifr.src = this.options.schemeAndroid;
                document.body.appendChild(ifr);

                // If fail, open the market or the url you set
                let d = new Date;
                setTimeout(() => {
                    if (600 > new Date - d) {
                        window.location = this.options.marketUrl;
                    }
                }, 400);
            }
        } else if (Platform.isIOS) {
            window.location = this.options.schemeIOS;

            // If fail to open the app store
            setTimeout(() => {
                window.location = this.options.appStore;
            }, 250);
        }
    }
}

window.Smartbanner = Smartbanner;