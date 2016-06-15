//--------------------------------------------- Html component manager ---------------------------------------------
var WixHtmlComponentManager = function() {
    this.htmlComponents = {};
	
	this.createGoogleMapIframe = function(params) {
        var frame = null;
        var handle = params.handle;
        var frameIdentifier = this.config.PREFIX_HANDLE + handle;
        var app = getFlashAppInstance();
        setTimeout("wixHtmlComponentManager.setFrameParams('" + handle + "'," + params.x + "," + params.y + "," + params.width + "," + params.height + ")",
                0);

        var scrolling = (params.verticalScroll == "yes") ? "auto" : "no";

        try {
            //This one is for IE
            frame = window.document.createElement('<iframe' +
					' id="' + frameIdentifier + '"' +
                    ' width="' + params.width + '"' +
                    ' height="' + params.height + '"' +
                    ' src="' + this.getGoogleMapURL(params) + '"' +
                    ' scrolling="no" marginwidth="0" marginheight="0" frameborder="0" framespacing="0" allowtransparency="true" hspace="0" vspace="0">' +
                    '</iframe>');
        } catch (e) {
            frame = window.document.createElement("iframe");
			frame.setAttribute("id", frameIdentifier);
            frame.setAttribute("width", params.width);
            frame.setAttribute("height", params.height);
            frame.setAttribute("scrolling", "no");
            frame.setAttribute("margin", "0");
            frame.setAttribute("marginwidth", "0");
            frame.setAttribute("marginheight", "0");
            frame.setAttribute("frameborder", "0");
            frame.setAttribute("framespacing", "0");
            frame.setAttribute("hspace", "0");
            frame.setAttribute("vspace", "0");
            frame.setAttribute("src", this.getGoogleMapURL(params));
        }

        frame.style.position = "absolute";
        frame.style.margin = "0px !important";

        var computedPosition = this.getHtmlComponentComputedPosition(params, {x:1, y:1});
        frame.style.left = computedPosition.x + 'px';
        frame.style.top = computedPosition.y + 'px';

        window.document.body.appendChild(frame);

        //Frame on load
        addListener(frame.contentWindow, "load", function() {
            wixHtmlComponentManager.frameOnLoad(handle)
        });
    };
	
	this.getGoogleMapURL = function(params){
		var queryString = [];
        queryString.push("q=" + params.address);
        return 'https://www.google.com/maps/embed/v1/place?key=AIzaSyCNKHMtVlkuzsb6oLI2hbpJNYnq68Uy4Mk&' + queryString.join("&");
	};

	this.updateGoogleMap = function(params, scale) {
        var frame = document.getElementById(this.config.PREFIX_HANDLE + params.handle);
        if (frame) {
            if (scale) {
                var computedPosition = this.getHtmlComponentComputedPosition(params, scale);
                frame.style.left = computedPosition.x + 'px';
                frame.style.top = computedPosition.y + 'px';
                frame.style.width = (params.width * scale.x) + 'px';
                frame.style.height = (params.height * scale.y) + 'px';
                frame.setAttribute("width", (params.width * scale.x));
                frame.setAttribute("height", (params.height * scale.y));
            } else {
                if (params.width) {
                    frame.setAttribute("width", params.width);
                    frame.style.width = params.width + 'px';
				}
                if (params.height) {
                    frame.setAttribute("height", params.height);
                    frame.style.height = params.height + 'px';
                }
            }
        }
    };


    this.createHtmlComponent = function(params) {
        var frame = null;
        var handle = params.handle;
        var frameIdentifier = this.config.PREFIX_HANDLE + handle;
        var app = getFlashAppInstance();
        var scale = {
            x: app.width / this.config.DOCUMENT_WIDTH,
            y: app.height / this.config.DOCUMENT_HEIGHT
        };
        var width = Math.round(params.width * scale.x);
        var height = Math.round(params.height * scale.y);
        params.width = width;
        params.height = height;

        setTimeout("wixHtmlComponentManager.setFrameParams('" + handle + "'," + params.x + "," + params.y + "," + params.width + "," + params.height + ")",
                0);

        var scrolling = (params.verticalScroll == "yes") ? "auto" : "no";

        try {
            //This one is for IE
            frame = window.document.createElement('<iframe' +
                    ' id="' + frameIdentifier + '"' +
                    ' name="' + frameIdentifier + '"' +
                    ' width="' + width + '"' +
                    ' height="' + height + '"' +
                    ' src="' + this.getFrameURL(params) + '"' +
                    ' scrolling="' + scrolling + '" marginwidth="0" marginheight="0" frameborder="0" framespacing="0" allowtransparency="true" hspace="0" vspace="0">' +
                    '</iframe>');
        } catch (e) {
            frame = window.document.createElement("iframe");
            frame.setAttribute("id", frameIdentifier);
            frame.setAttribute("name", frameIdentifier);
            frame.setAttribute("width", width);
            frame.setAttribute("height", height);
            frame.setAttribute("scrolling", scrolling);
            frame.setAttribute("margin", "0");
            frame.setAttribute("marginwidth", "0");
            frame.setAttribute("marginheight", "0");
            frame.setAttribute("frameborder", "0");
            frame.setAttribute("framespacing", "0");
            frame.setAttribute("hspace", "0");
            frame.setAttribute("vspace", "0");
            frame.setAttribute("src", this.getFrameURL(params));
        }

        frame.style.position = "absolute";
        frame.style.margin = "0px !important";

        var computedPosition = this.getHtmlComponentComputedPosition(params, {x:1, y:1});
        frame.style.left = computedPosition.x + 'px';
        frame.style.top = computedPosition.y + 'px';

        window.document.body.appendChild(frame);

        //Frame on load
        addListener(frame.contentWindow, "load", function() {
            wixHtmlComponentManager.frameOnLoad(handle)
        });
    };

    this.getFrameURL = function(params) {
        var queryString = [];
        var wrap = false;

        if (params.horizontalAlign != "left" || params.verticalAlign != "top" || params.verticalScroll == "yes") {
            wrap = true;
        }

        queryString.push("wrap=" + (wrap ? "yes" : "no"));
        queryString.push("gzip=" + params.gzip);
        queryString.push("bg=" + params.backgroundColor);

        if (wrap) {
            queryString.push("halign=" + params.horizontalAlign);
            queryString.push("valign=" + params.verticalAlign);
        }

        return this.config.HTML_SERVER_URL + params.guid + "?" + queryString.join("&");
    };

    this.getHtmlComponentComputedPosition = function(params, scale) {
        var position = findFlashAppInstancePosition();
        return {
            x: (position.x + (params.x * scale.x)),
            y: (position.y + (params.y * scale.y))
        };
    };

    this.updateFrameSize = function(handle) {
        var frame = document.getElementById(this.config.PREFIX_HANDLE + handle);
        if (frame) {
            var doc = frame.contentWindow || frame.contentDocument;
            if (doc.document) {
                doc = doc.document;
            }
            if (doc.body.scrollWidth > 0) {
                frame.width = doc.body.scrollWidth;
            }
            if (doc.body.scrollHeight > 0) {
                frame.height = doc.body.scrollHeight;
            }
        }
    };

    this.frameOnLoad = function(handle) {
        if (this.getFrameParams(handle).extendable) {
            this.updateFrameSize(handle);
        }
    };

    this.getFrameParams = function(handle) {
        return this.htmlComponents["_" + handle];
    };

    this.setFrameParams = function(handle, x, y, width, height) {
        this.htmlComponents["_" + handle] = {handle:handle, x:x, y:y, width:width, height:height};
    };

    this.docPageUpdated = function() {
        if (this.config.INITIAL_WIX_APP_WIDTH > 0 && this.config.INITIAL_WIX_APP_HEIGHT > 0) {
            var app = getFlashAppInstance();
            this.config.INITIAL_WIX_APP_WIDTH = app.width;
            this.config.INITIAL_WIX_APP_HEIGHT = app.height;
        }
    };

    this.updateHtmlComponent = function(params, scale) {
        var frame = document.getElementById(this.config.PREFIX_HANDLE + params.handle);
        if (frame) {
            if (scale) {
                var computedPosition = this.getHtmlComponentComputedPosition(params, scale);
                frame.style.left = computedPosition.x + 'px';
                frame.style.top = computedPosition.y + 'px';
                frame.style.width = (params.width * scale.x) + 'px';
                frame.style.height = (params.height * scale.y) + 'px';
                frame.setAttribute("width", (params.width * scale.x));
                frame.setAttribute("height", (params.height * scale.y));
            } else {
                if (params.width) {
                    frame.setAttribute("width", params.width);
                    frame.style.width = params.width + 'px';
                }
                if (params.height) {
                    frame.setAttribute("height", params.height);
                    frame.style.height = params.height + 'px';
                }
            }
        }
    };

    this.showHtmlComponent = function(params) {
        var frame = document.getElementById(this.config.PREFIX_HANDLE + params.handle);
        if (frame) {
            frame.style.display = "block";
        }
    };

    this.hideHtmlComponent = function(params) {
        var frame = document.getElementById(this.config.PREFIX_HANDLE + params.handle);
        if (frame) {
            frame.style.display = "none";
        }
    };

    this.removeHtmlComponent = function(params) {
        var frame = document.getElementById(this.config.PREFIX_HANDLE + params.handle);
        if (frame) {
            frame.parentNode.removeChild(frame);
        }
    };

};

WixHtmlComponentManager.prototype.config = {
    PREFIX_HANDLE:              "htmlComponentFrame",
    HTML_SERVER_URL:            null,
    DOCUMENT_WIDTH:             0,
    DOCUMENT_HEIGHT:            0,
    INITIAL_WIX_APP_WIDTH:      0,
    INITIAL_WIX_APP_HEIGHT:     0
};

var wixHtmlComponentManager = new WixHtmlComponentManager();

//--------------------------------------------- Start basic.js ---------------------------------------------


var MARGIN_WIDTH = 12;
var MARGIN_HEIGHT = 12;
var FOOTER_HEIGHT = 31;
var IS_BEST_FIT = false;

function languageRefresh(selectedLanguage) {
    var href = window.location.href.split("#")[0];
    href = href.substr(href.indexOf("."));
    href = href.substr(0,href.indexOf("/"));
    document.cookie = "wixLanguage=" + selectedLanguage + "; domain="+ href +"; path=/";
    location.reload(true);
    var href1 = window.location.href.split("#")[0];
    href1 = href1.substr(href1.indexOf("."));
    var prefix = selectedLanguage;
    if (selectedLanguage == "en") {
        prefix = "www";
    }
    window.location.href = "http://" + prefix  + href1;
}


function fireConversionPixel(referral) {
    document.getElementById("conversionPixel").src = "/wixBeacon";
}

function getCookieValue(cookieName) {
    if (document.cookie) {
        var cookies = document.cookie.split(/;\s*/);
        for (var i = 0, n = cookies.length; i < n; i++) {
            var cookie = cookies[i];
            if (cookie.indexOf(cookieName + "=") === 0)
                return cookie.substr(cookieName.length + 1);
        }
    }
    return null;
}


//expires in minutes
function setCookie(name, value, expires) {
    var date = new Date();
    date.setTime(date.getTime() + (expires * 60 * 1000));

    var domain;
    var hostName = window.location.host;

     // get domain name without subdomain
    if (hostName.indexOf(".") == hostName.lastIndexOf(".")) {
        domain = hostName;
    }
    else {
        domain = hostName.substring(hostName.indexOf("."));
    }

    document.cookie = name + "=" + encodeURIComponent(value) + "; path=/; expires=" + date.toUTCString() + "; domain=" + domain;
}

function deleteCookie(name) {
    setCookie(name, "", -1);
}

var USER_SERVER_LOG = [];
function handleUserServerResponse(action, success, errorCode, errorDescription, userJson, token) {
    try {
        USER_SERVER_LOG.push({action:action, success:success, errorCode:errorCode, errorDescription:errorDescription, userJson:userJson, token:token});
        getFlashAppInstance().handleUserServerResponse(action, success, errorCode, errorDescription, userJson, token);
    } catch(e) {
        logError("VIEWER", "handleUserServerResponse", e.message, action, "basic.js");
    }
}

function logError(origin, errType, description, apiCall, appVersion, apiParams, additionalParams) {
    var url;
    if (window.location.host.indexOf(".wix.com") != -1) {
        url = "http://frog.wix.com/plebs";
    } else {
        url = "http://flogger.wixpress.com/plebs";
    }
    var arr = [];
    arr.push(url + "?origin=" + encodeURI(origin));
    if (typeof errType != "undefined") arr.push("errType=" + encodeURI(errType));
    if (typeof description != "undefined") arr.push("description=" + encodeURI(description));
    if (typeof apiCall != "undefined") arr.push("apiCall=" + encodeURI(apiCall));
    if (typeof appVersion != "undefined") arr.push("appVersion=" + encodeURI(appVersion));
    if (typeof apiParams != "undefined") arr.push("apiParams=" + encodeURI(apiParams));
    if (typeof additionalParams != "undefined") arr.push("additionalParams=" + encodeURI(additionalParams));
    if (typeof wixDocId != "undefined") arr.push("docID=" + encodeURI(wixDocId));
    new Image(0, 0).src = arr.join("&");
}

var APP_TYPE = "VIEWER";
var APP_STATUS = "appLoading";
var APP_TIMESTAMPS = [];
var LAST_ERROR_TYPE = null;
APP_TIMESTAMPS[APP_STATUS] = new Date().getTime();
var APP_TIMER = window.setInterval("testReadyState()", 250);
var isFirstTime = true;

function setReadyState(appType, status) {
    APP_TYPE = appType;
    APP_STATUS = status;
    APP_TIMESTAMPS[APP_STATUS] = new Date().getTime();

    /*Sending hash to urlState object*/
    /*comment this section to shut down deep linking*/
    if (APP_STATUS == "appLoadedXML" &&	isFirstTime === true) {
		isFirstTime = false;
        hashToFlash(urlState.getHash());
    }
}

function testReadyState() {
    var version = APP_TYPE.substring(0, 2) + "XXX";
    var now = new Date().getTime();
    var secondsSinceStart = (now - APP_TIMESTAMPS["appLoading"]) / 1000;
    var secondsSinceLast = (now - APP_TIMESTAMPS[APP_STATUS]) / 1000;

    switch (APP_STATUS) {
        case "appLoading":
            if (secondsSinceLast > 20 && LAST_ERROR_TYPE != "appStarted") {
                LAST_ERROR_TYPE = "appStarted";
                logError(APP_TYPE, LAST_ERROR_TYPE, "The application failed to load the first phase within " + secondsSinceStart + " seconds", "setReadyState", version, secondsSinceStart);
            }
            break;
        case "appStarted":
            if (secondsSinceLast > 20 && LAST_ERROR_TYPE != "appLoadedXML") {
                LAST_ERROR_TYPE = "appLoadedXML";
                logError(APP_TYPE, LAST_ERROR_TYPE, "The application failed to load the page-xml within " + secondsSinceStart + " seconds. Time of appStarted was " + getSecondsSinceState("appStarted"), "setReadyState", version, secondsSinceStart);
            }
            break;
        case "appLoadedXML":
            if (secondsSinceLast > 20 && LAST_ERROR_TYPE != "appLoadedAll") {
                LAST_ERROR_TYPE = "appLoadedAll";
                logError(APP_TYPE, LAST_ERROR_TYPE, "The application failed to finish loading within " + secondsSinceStart + " seconds. Time of appStarted was " + getSecondsSinceState("appStarted") + ". Time of appLoadedXML was " + getSecondsSinceState("appLoadedXML"), "setReadyState", version, secondsSinceStart);
            }
            break;
        case "appLoadedAll":
            window.clearInterval(APP_TIMER);
            preCache();
            break;
    }
}

function getSecondsSinceState(state) {
    return ((APP_TIMESTAMPS[state] - APP_TIMESTAMPS["appLoading"]) / 1000);
}

function addListener(win, eventName, handler) {
    if (win.addEventListener)
        win.addEventListener(eventName, handler, false);
    else if (win.attachEvent)
        win.attachEvent("on" + eventName, handler);
    else
        win["on" + eventName] = handler;
}

function openUrl(url, vaildatePopup) {
    try {
        var popupBlocked = false;
        var win = window.open(url, '_blank');
        if (!win || win.closed || typeof win.closed == 'undefined') {
            popupBlocked = true;
        } else {
            win.focus();
        }
        if (vaildatePopup) {
            try {
                getFlashAppInstance().popupFailure(popupBlocked);
            } catch(e) {
                logError("VIEWER", "openUrl", "Flash object is not yet ready", url, "basic.js");
            }
        }
        return true;
    } catch (e) {
        logError("VIEWER", "openUrl", e.message, url, "basic.js");
        return false;
    }
}

function openUrlNoMenu(url, vaildatePopup) {
    try {
        var popupBlocked = false;
        var screenSize = getPhysicalScreenDimensions();
        var win = window.open(url, '_blank', "resizable=yes,menubar=no,status=no,titlebar=no,toolbar=no,channelmode=yes,width=" + screenSize.width + ",height=" + screenSize.height);
        if (!win || win.closed || typeof win.closed == 'undefined') {
            popupBlocked = true;
        } else {
            win.focus();
        }
        if (vaildatePopup) {
            try {
                getFlashAppInstance().popupFailure(popupBlocked);
            } catch(e) {
                logError("VIEWER", "openUrlNoMenu", "Flash object is not yet ready", url, "basic.js");
            }
        }
        return true;
    } catch(e) {
        logError("VIEWER", "openUrlNoMenu", e.message, url, "basic.js");
        return false;
    }
}

function getPhysicalScreenDimensions() {
    var winW = 1024, winH = 768;
    try {
        winW = screen.availWidth;
        winH = screen.availHeight;
        if (typeof winW == "undefined") {
            winW = 1024;
        }
        if (typeof winH == "undefined") {
            winH = 768;
        }
    } catch(e) {
        winW = 1024;
        winH = 768;
    }
    return {width: (winW ), height: (winH )};
}

function getBodyDimensions() {
    var w = 0, h = 0;
    if (!window.innerWidth) {
        //strict mode
        if (!(document.documentElement.clientWidth == 0)) {
            w = document.documentElement.clientWidth;
            h = document.documentElement.clientHeight;
        } else { //quirks mode
            w = document.body.clientWidth;
            h = document.body.clientHeight;
        }
    } else { //w3c
        w = window.innerWidth;
        h = window.innerHeight;
    }
    return {width:w,height:h}
}

function getScreenDimensions() {
    var d = getBodyDimensions();
    return {width: (d.width - (2 * MARGIN_WIDTH)), height: (d.height - (2 * MARGIN_HEIGHT + ((getFooter() || document.getElementById("wixfooter1")) ? FOOTER_HEIGHT : 0)))};
}

function getScrollOffset() {
    var x = 0,y = 0;
    if (self.pageYOffset) { // all except Explorer
        x = self.pageXOffset;
        y = self.pageYOffset;
    } else if (document.documentElement && document.documentElement.scrollTop) { // Explorer 6 Strict
        x = document.documentElement.scrollLeft;
        y = document.documentElement.scrollTop;
    } else if (document.body) {
        // all other Explorers
        x = document.body.scrollLeft;
        y = document.body.scrollTop;
    }
    return {x:x,y:y}
}

function getViewport() {
    var app = getFlashAppInstance();
    var dimensions = getScreenDimensions();
    var position = findFlashAppInstancePosition();
    var scroll = getScrollOffset();
    return {x:scroll.x, y:scroll.y, width:Math.min(dimensions.width - position.x,
            app.clientWidth), height:Math.min(dimensions.height - position.y, app.clientHeight)};
}

function findFlashAppInstancePosition() {
    return findElementPosition(getFlashAppInstance());
}

function findElementPosition(oElement) {
    if (typeof( oElement.offsetParent ) != 'undefined') {
        for (var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent) {
            posX += oElement.offsetLeft;
            posY += oElement.offsetTop;
        }
        return {x:posX, y:posY};
    } else {
        return {x:oElement.x, y:oElement.y};
    }
}

function getScreenSize() {
    var dimensions = getScreenDimensions();
    return dimensions.width + "," + dimensions.height;
}

function setTitle(title) {
    document.title = title;
}

function getFlashAppInstance() {
    return swfobject.getObjectById("app");
}

function getFooter() {
    return document.getElementById("wixfooter");
}

function setFooterWidth(width) {
    try {
        var footer = getFooter();
        if (footer) {
            footer.style.width = width + "px";
        } else {
            footer = document.getElementById("wixfooter1");
            if (footer) {
                if (navigator.userAgent.indexOf("Firefox") == -1) {
                    footer.style.position = "static";
                    footer.style.width = width + "px";
                }
            }
        }
    } catch(e) {
    }
}

function setSize(width, height) {

    setFooterWidth(width);

    var app = getFlashAppInstance();
    app.width = width;
    app.height = height;

    var dimensions = getScreenDimensions();
    document.body.style.marginTop = height > dimensions.height ? "8px" : "0";

    if (wixHtmlComponentManager.config.INITIAL_WIX_APP_WIDTH == 0 && wixHtmlComponentManager.config.INITIAL_WIX_APP_HEIGHT == 0) {
        wixHtmlComponentManager.config.INITIAL_WIX_APP_WIDTH = width;
        wixHtmlComponentManager.config.INITIAL_WIX_APP_HEIGHT = height;
    } else {
        var params;
        var scale = {
            x: width / wixHtmlComponentManager.config.INITIAL_WIX_APP_WIDTH,
            y: height / wixHtmlComponentManager.config.INITIAL_WIX_APP_HEIGHT
        };
        if (wixHtmlComponentManager) {
            for (var i in wixHtmlComponentManager.htmlComponents) {
                params = wixHtmlComponentManager.htmlComponents[i];
                wixHtmlComponentManager.updateHtmlComponent(params, scale);
}
			for (var i in wixHtmlComponentManager.htmlComponents) {
                params = wixHtmlComponentManager.htmlComponents[i];
                wixHtmlComponentManager.updateHtmlComponent(params, scale);
            }
        }
    }
}

function createStyles(autoSize, width, height) {
    IS_BEST_FIT = (autoSize == "fitScreen");
    var cssText = new Array();
    cssText.push('<style type="text/css">');
    if (IS_BEST_FIT) {
        cssText.push('body {overflow:hidden !important}');
    } else {
        var dimensions = getScreenDimensions();
        if (height > dimensions.height) {
            cssText.push('body {margin-top:8px}');
        }
    }
    cssText.push('</style>');
    document.write(cssText.join(""));
}

//this function should call both the wix googlitics and the users (if the user have one)
function doGooglitics(fakeUrl) {
    pageTracker._trackPageview(fakeUrl);
    if (hasGoogleAnalytics) {
        pageTrackerUser._trackPageview(fakeUrl);
    }
}

//this function should call only the wix googlitics
function doGoogliticsWix(fakeUrl) {
    pageTracker._trackPageview(fakeUrl);
}

//this function should call only the user googlitics (if the user doesnt have one the function should be empty
function doGoogliticsUser(fakeUrl) {
    if (null != userGoogleAnalytics && "" != userGoogleAnalytics) {
        if (hasGoogleAnalytics) {
            pageTrackerUser._trackPageview(fakeUrl);
        }
    }
}

function gaSSDSLoad(acct) {
    var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www."),
            pageTracker,
            s;
    s = document.createElement('script');
    s.src = gaJsHost + 'google-analytics.com/ga.js';
    s.type = 'text/javascript';
    s.onloadDone = false;
    function initPageTrackers() {
        pageTracker = _gat._getTracker(acct);
        if (wixGoogleAnalytics){
            pageTracker._trackPageview();

            if (hasGoogleAnalytics) {
                pageTrackerUser = _gat._getTracker(userGoogleAnalytics);
                pageTrackerUser._initData();
                pageTrackerUser._trackPageview();
            }
        }
    }

    s.onload = function () {
        s.onloadDone = true;
        initPageTrackers();
    };
    s.onreadystatechange = function() {
        if (('loaded' === s.readyState || 'complete' === s.readyState) && !s.onloadDone) {
            s.onloadDone = true;
            initPageTrackers();
        }
    };
    document.getElementsByTagName('head')[0].appendChild(s);
}

function pageOnLoad() {
    if (typeof wixGoogleAnalytics != "undefined")
        gaSSDSLoad(wixGoogleAnalytics);
    //comment this line to shut down deep linking
    urlState.init(docTitle);
}

function preCache(){
    //Run pre cache for the flex when on a wix document
    try {
        if (docTypeFlags == 2) {
            window.setTimeout(function() {
                var ph = document.createElement('div');
                ph.id = "preCacheLoader";
                ph.style.width = "1px";
                ph.style.height = "1px";
                ph.style.position = "absolute";
                document.body.appendChild(ph);
                swfobject.embedSWF(staticServerUrl + "client/PreCache.swf?" + cacheKiller + "&max-age=172800", "preCacheLoader", "1", "1", minimalFlashVersion);
            }, 3000);
        }
    } catch(e) {
    }
}

function pageOnResize() {
    var dimensions = getScreenDimensions();
    var app = getFlashAppInstance();
    if (app != null) {
        try {
            app.onScreenResize(dimensions.width, dimensions.height);
        } catch(e) {
        }
    }
    return false;
}

function setHistoryFrame(address, additionalInfo) {
    var ifrm;
    try {
        var page_name = address.substr(8, adress.indexOf(',') - 8);
        if (additionalInfo != null && additionalInfo.length > 0) {
            page_name = page_name + '_' + additionalInfo;
        }
        page_name = page_name + '.html';
        ifrm = document.getElementById("historyframe");
        if (ifrm != null) {
            ifrm.src = "/siteBackHtml?adress=" + address + '&additionalInfo=' + additionalInfo;
        }
    } catch(ex) {
        ifrm = document.getElementById("historyframe");
        if (ifrm != null) {
            ifrm.src = "/siteBackFiles/siteBack.html?adress=" + address + '&additionalInfo=' + additionalInfo;
        }
    }
}

function onHistoryFrameLoaded(adress, additionalInfo) {
    var app = getFlashAppInstance();
    if (app != null) {
        try {
            app.onHistoryFrameLoaded(adress, additionalInfo);
        } catch(e) {
        }
    }
}

addListener(window, "load", function() {
    pageOnLoad();
});
addListener(window, "resize", function() {
    pageOnResize();
});

// =============================================== settings (vars) ======================================================
FOOTER_HEIGHT = 23;
var desing_wix = "http://www.wix.com/";
var free_web = "Make a free website";
var campaign_id = "sf_footer";
//var experiment_id =  <social network>_<site_id>
var twitter_txt = "Check out this @Wix site";
var addrWithParamsNotEnc = window.location.href + "?client_bi=true&utm_campaign=" + campaign_id + "&experiment_id=";
var iconImageAddr = "";
var floggerAddr = "http://frog.wix.com";
var domain = "";

function buildFootbar() {
    if (parseInt(biSequence) % 2 == 0) {
        var oldDomain = "" + usersDomain;
        domain = oldDomain.replace("users.", "static.");

        iconImageAddr = "http://" + domain + "/media/" + siteIconName;

        var suf = document.getElementById("wfa1");
        if (suf.href) {
            desing_wix = suf.href;
        }
        if (suf.innerHTML) {
            suf_txt = suf.innerHTML;
            free_web = suf.innerHTML;
        }

        buildFootbarNew();

        // call inform
        inform(floggerAddr + "/footer_bi?event_id=1&site_id=" + biSequence + "&target_sn=0");
    } else {
        document.getElementById("wixfooter1").parentNode.innerHTML = '<div id="wixfooter">\
                   <span class="logo"></span>\
                   <a href="http://www.wix.com" title="Website builder" class="link1">This website was created using <span>wix.com</span></a>\
                   <a href="http://www.wix.com/free/website" title="Free website" class="link3">Free</a>\
                   <a href="http://www.wix.com" title="Free website" class="link2">Make a free website</a>\
                </div>';

        inform(floggerAddr + "/footer_bi?event_id=3&site_id=" + biSequence + "&target_sn=0");

        pageOnResize();
    }
}

function buildFootbarNew() {
    var footerElem = document.getElementById("wixfooter1");
    footerElem.style.backgroundColor = "#F0F0F0";
    footerElem.style.bottom = "0px";
    footerElem.style.position = "fixed";
    footerElem.style.width = "100%";
    footerElem.innerHTML = "";
    footerElem.parentNode.style.height = "23px";

    buildPrefix(footerElem);
    buildFacebook(footerElem);
    buildTwitter(footerElem);
    buildBuzz(footerElem);
    buildDigg(footerElem);
    buildStumble(footerElem);
    buildSuffix(footerElem);
}

function buildPrefix(footerElem) {
    var tagA = document.createElement("a");
    tagA.href = desing_wix;
    tagA.title = "website builder";
    tagA.id = "a0id";
    var L1 = document.createElement("span");
    L1.className = "logo";
    tagA.appendChild(L1);
    footerElem.appendChild(tagA);

    var imLine = document.createElement("img");
    imLine.src = "http://" + domain + "/client/images/Line.png";
    imLine.align = "left";
    imLine.style.height = "21px";
    footerElem.appendChild(imLine);

    var tagA1 = document.createElement("a");
    tagA1.title = "Website builder";
    tagA1.className = "link1";
    tagA1.align = "left";
    tagA1.innerHTML = "&nbsp;&nbsp;Share this site!: ";
    footerElem.appendChild(tagA1);
}

function buildTwitter(footerElem) {
    var tagA = document.createElement("a");
    tagA.title = "Share site on Twitter";
    tagA.target = "_blank";
    tagA.id = "a2id";
    var experiment_id = getSocialCode("Twitter") + "_" + biSequence;
    tagA.href = "http://twitter.com/share?url=" + encodeURIComponent(addrWithParamsNotEnc + experiment_id) + "&text=" + encodeURIComponent(twitter_txt) + "&original_referer=" + encodeURIComponent(document.referrer);
    tagA.onclick = new Function('inform("' + floggerAddr + '/footer_bi?event_id=2&site_id=' + biSequence + '&target_sn=2")');
    footerElem.appendChild(tagA);

    var im = document.createElement("img");
    im.alt = "Share site on Twitter";
    im.border = "0";
    im.hspace = "6";
    im.align = "left";
    im.src = "http://" + domain + "/client/images/twitter.png";
    im.style.marginLeft = '7px';
    im.style.width = "17px";
    im.style.height = "17px";
    im.style.marginTop = '3px';
    im.id = "twitterId";
    tagA.appendChild(im);
}

function buildStumble(footerElem) {
    var tagA = document.createElement("a");
    var experiment_id = getSocialCode("StumbleUpon") + "_" + biSequence;
    tagA.href = "http://www.stumbleupon.com/submit?url=" + encodeURIComponent(addrWithParamsNotEnc + experiment_id) + "&title=WIX";
    tagA.onclick = new Function('inform("' + floggerAddr + '/footer_bi?event_id=2&site_id=' + biSequence + '&target_sn=5")');
    tagA.title = "Share site on StumbleUpon";
    tagA.id = "a4id";
    tagA.target = "_blank";
    tagA.rel = "external";
    footerElem.appendChild(tagA);

    var im = document.createElement("img");
    im.alt = "Share site on StumbleUpon";
    im.border = "0";
    im.hspace = "6";
    im.align = "left";
    im.src = "http://" + domain + "/client/images/stumbleupon.png";
    im.style.width = "17px";
    im.style.height = "17px";
    im.style.marginTop = '3px';
    tagA.appendChild(im);
}

function buildDigg(footerElem) {
    var tagA = document.createElement("a");
    var experiment_id = getSocialCode("Digg") + "_" + biSequence;
    tagA.href = "http://digg.com/submit?phase=2&url=" + encodeURIComponent(addrWithParamsNotEnc + experiment_id) + "&title=WIX";
    tagA.title = "Share site on Digg";
    tagA.id = "a5id";
    tagA.onclick = new Function('inform("' + floggerAddr + '/footer_bi?event_id=2&site_id=' + biSequence + '&target_sn=4")');
    tagA.rel = "external";
    tagA.target = "_blank";
    footerElem.appendChild(tagA);

    var im = document.createElement("img");
    im.alt = "Share site on Digg";
    im.border = "0";
    im.hspace = "6";
    im.align = "left";
    im.src = "http://" + domain + "/client/images/digg.png";
    im.style.width = "17px";
    im.style.height = "17px";
    im.style.marginTop = '3px';
    tagA.appendChild(im);
}

function buildFacebook(footerElem) {
    var tagA = document.createElement("a");
    tagA.title = "Share site on Facebook";
    tagA.id = "a6id";
    var experiment_id = getSocialCode("Facebook") + "_" + biSequence;
    tagA.href = "http://www.facebook.com/share.php?u=" + encodeURIComponent(addrWithParamsNotEnc + experiment_id);

    tagA.onclick = new Function('return start_publish()');
    tagA.target = "_blank";

    footerElem.appendChild(tagA);

    var im = document.createElement("img");
    im.alt = "Share site on Facebook";
    im.border = "0";
    im.hspace = "6";
    im.align = "left";
    im.src = "http://" + domain + "/client/images/facebook.png";
    im.style.width = "17px";
    im.style.height = "17px";
    im.style.marginTop = '3px';
    tagA.appendChild(im);
}

function buildBuzz(footerElem) {
    var tagA = document.createElement("a");
    tagA.title = "Share site on Google Buzz";
    var experiment_id = getSocialCode("Buzz") + "_" + biSequence;
    tagA.href = "http://www.google.com/buzz/post?url=" + encodeURIComponent(addrWithParamsNotEnc + experiment_id) + "&imageurl=" + iconImageAddr;

    tagA.onclick = new Function('inform("' + floggerAddr + '/footer_bi?event_id=2&site_id=' + biSequence + '&target_sn=3")');
    tagA.id = "a3id";
    tagA.target = "_blank";
    footerElem.appendChild(tagA);

    var im = document.createElement("img");
    im.alt = "Share site on Google Buzz";
    im.border = "0";
    im.hspace = "6";
    im.align = "left";
    im.src = "http://" + domain + "/client/images/buzz.png";
    im.style.width = "17px";
    im.style.height = "17px";
    im.style.marginTop = '3px';
    tagA.appendChild(im);
}

function buildSuffix(footerElem) {
    var tagA = document.createElement("a");
    tagA.id = "wfa1";
    tagA.href = desing_wix;
    tagA.className = "link2";
    tagA.title = "Free website";
    tagA.innerHTML = free_web;
    footerElem.appendChild(tagA);
    var node = document.getElementById("wfa1");
}

function inform(name) {
    new Image(0, 0).src = name;
}

function start_publish() {
    var docname = "";
    var url = addrWithParamsNotEnc + "1_" + biSequence;
    var message = "";
    shareOnFacebook(docname, url, iconImageAddr, message);
    inform(floggerAddr + "/footer_bi?event_id=2&site_id=" + biSequence + "&target_sn=1");
    return false;
}

function getSocialCode(name) {
    var codes = {
        "Facebook":"1",
        "Twitter":"2",
        "Buzz":"3",
        "Digg":"4",
        "StumbleUpon":"5"
    };
    for (x in codes) {
        if (x.toUpperCase() == name.toUpperCase()) {
            return codes[x];
        }
    }
    return null;
}


// START: social footer persol ver

/**
 * Social footer link and bi builder
 * @param options 				A dictionary of parameters:
 * @param options.url 			The url to share, defaults to current page.
 * @param options.title 		The text to share, defaults to page title.
 * @param options.campaign_id 	The campaign id defaults to window.campaign_id.
 * @param options.biSequence 	The BI name for the campaign, defaults to window.biSequence.
 * @param options.socialItems 	A dictionary of the links to build. Defaults are hard coded here.
 * @param options.floggerAddr	The flossger address. Defaults to window.floggerAddr.
 * @param options.ABTesting		Show the social footer only for even biSequence IDs. 
 */
function buildSocialFootbar(options){
	options = options || {};
	var biSequence = options.biSequence || window.biSequence || 0;
	var ABTesting = (typeof options.ABTesting == 'undefined') ? true : options.ABTesting; 
	// 1 == social footer, 3 == normal footer
	var footerStatus = 3;
	var url = options.url || window.location.href;
	var title = options.title || document.title;
	var campaign_id = options.campaign_id || 'sf_footer2'; // || window.campaign_id || 'sf_footer2';
	var urlParams = "?client_bi=true&utm_campaign=" + campaign_id + "&experiment_id=";
	var floggerAddr = options.floggerAddr || window.floggerAddr || '';
	var socialItems = options.socialItems || {
		'facebook':{'name':'Facebook', 		'target_sn':1, 'id':'ficn', 	'href':'http://www.facebook.com/share.php?', 'url': 'u='  , 'text':'',        'title': '', 		'extra': ''},
		'twitter': {'name':'Twitter', 		'target_sn':2, 'id':'ticn', 	'href':'https://twitter.com/share/?', 		 'url': 'url=', 'text':'&text=',  'title':'Check out this @Wix site', 'extra': '&original_referer=' + document.referrer},
		'buzz':    {'name':'Google Buzz', 	'target_sn':3, 'id':'bicn', 	'href':'http://www.google.com/buzz/post?',   'url': 'url=', 'text':'&text=',  'title': '', 		'extra': ''},
		'digg':    {'name':'Digg', 			'target_sn':4, 'id':'dicn', 	'href':'http://digg.com/submit?phase=2&', 	 'url': 'url=', 'text':'&title=', 'title': 'WIX', 	'extra': ''},
		'stumble': {'name':'StumbleUpon', 	'target_sn':5, 'id':'suicn',	'href':'http://www.stumbleupon.com/submit?', 'url': 'url=', 'text':'&title=', 'title': 'WIX', 	'extra': ''}		
	}
	
	var buildButtons = function(){
		footerStatus = 1;
		var footer = document.getElementById('footer');
		var links = document.getElementById('sfshare');
		
		links.style.display = 'block';
		
		for (var i in socialItems){
			if(socialItems.hasOwnProperty(i)){
				var item = socialItems[i];
				var link = document.getElementById(item.id);
				if (!link) continue;
				link.href =	item.href 
						  // Build URL + bi parameters and encode it
						  + item.url +  encodeURIComponent(url + (item.urlParams || urlParams) + item.target_sn + '_' + biSequence) 
						  // Text or title to show in share - leave 'item.text' empty to skip, else will print page title if text not explicitly defined 
						  + item.text + (item.text && (item.title || title))
						  // Add other parameters if exist
						  + (item.extra || '');
				link.target = '_blank';
				link.title = 'Share site on ' + item.name;
				link.rel = item.target_sn;
				addEvent(link, 'click', function(e){
					var e = e || window.event;
					var tgt = e.target || e.srcElement;		
					inform(floggerAddr + '/footer_bi?event_id=2&site_id=' + biSequence + '&target_sn=' + tgt.rel);
				});
			}
		}		
	}
	
	// Helper functions
	/**
	 * Simple cross browser add event
	 * fixes 'this' context for IE
	 * @param html_element The element to apply the event on
	 * @param event_name The name of the event (like 'click', 'focus' etc.)
	 * @param event_function The function to run on event.
	 */
	function addEvent(html_element, event_name, event_function) 
	{       
	   if (html_element.attachEvent) //Internet Explorer
		  html_element.attachEvent("on" + event_name, event_function); 
	   else if (html_element.addEventListener) //Firefox & company
		  html_element.addEventListener(event_name, event_function, false); //don't need the 'call' trick because in FF everything already works in the right way          
	} 
	
	// Set Footer width
	func = function(){
		document.getElementById('footer').style.width = document.getElementById('app') ? document.getElementById('app').width + 'px' : '1000px';
	};
	
	// Run!
	setTimeout(func, 1000);
	if (!ABTesting || (ABTesting && (+biSequence % 2 == 0))){
		buildButtons();
	}
	inform(floggerAddr + "/footer_bi?event_id=" + footerStatus + "&site_id=" + biSequence + "&target_sn=0");
}

// END: social footer persol ver 
function setUrlFragment(newHash) {
    urlState.setUrlFragment(newHash);
}

function hashToFlash(hashVal) {
    var app = getFlashAppInstance();
    if (app != null) {
        try {
            app.onUrlFragmentChange(hashVal);
        } catch(e) {
        }
    }
}

var docTitle = document.title;

var urlState = {
    options:{
        currentHash:""
    },
    init:function(docTitle) {
        document.title = docTitle;
        this.options.currentHash = this.getHash();
        /*Browser detection*/
        var browser = navigator.userAgent.toLowerCase();
        var place = browser.indexOf("msie");
        var version = browser.charAt(place + 3);
        if (typeof document.all !== "undefined" && (version == "6" || version === "7")) {
            setInterval(this.ieCheckChange, 100);
        } else {
            window.onhashchange = function() {
                urlState.urlchanged();
            };
        }
    },
    urlchanged:function() {
        var hashValue = this.getHash();
        hashToFlash(hashValue);
        this.options.currentHash = hashValue;
        document.title = docTitle;
    },
    getHash:function() {
        var hashStr = this.setString(window.location.hash);
        return hashStr;
    },
    setString:function(str) {
        var hashValue;
        var fullUrl = str.replace("%20", "-");
        fullUrl = fullUrl.replace(" ", "-");
        /* deprecated, used to unescape values for safari only */
        fullUrl = unescape(fullUrl);
        fullUrl = fullUrl.toLowerCase();
        if (fullUrl.indexOf("#!") == 0 || fullUrl.indexOf("#!") == true) {
            hashValue = fullUrl.split("#!")[1];
        } else {
            hashValue = "";
        }
        return hashValue;
    },
    setUrlFragment:function(newHash) {
          /* timeout is a fix for chrome who execute go to page after hash change */
          setTimeout(function(){window.location.hash = "!" + newHash;}, 1000);
          document.title = docTitle;
    },
    ieCheckChange:function() {
        var curHash = urlState.getHash();
        var lastHash = urlState.options.currentHash;
        if (lastHash !== curHash) {
            urlState.options.currentHash = curHash;
            hashToFlash(curHash);
        }
    },
	getLocation:function(){
		return window.location.href;
	}
};