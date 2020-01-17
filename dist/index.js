'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var ReactDOM = _interopDefault(require('react-dom'));
var throttle = _interopDefault(require('lodash.throttle'));

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

// copyright https://github.com/loktar00/react-lazy-load/blob/master/src/utils/parentScroll.js
var style = function (element, prop) {
    return typeof getComputedStyle === 'undefined'
        ? element.style[prop]
        : getComputedStyle(element, null).getPropertyValue(prop);
};
var overflow = function (element) {
    return style(element, 'overflow') +
        style(element, 'overflow-y') +
        style(element, 'overflow-x');
};
var getScrollElement = function (element) {
    if (!(element instanceof HTMLElement)) {
        return window;
    }
    var parent = element;
    while (parent) {
        if (parent === document.body ||
            parent === document.documentElement ||
            !parent.parentNode) {
            break;
        }
        if (/(scroll|auto)/.test(overflow(parent))) {
            return parent;
        }
        parent = parent.parentNode;
    }
    return window;
};

function isInViewport(el) {
    if (!el) {
        return false;
    }
    var rect = el.getBoundingClientRect();
    return (rect.top >= 0 &&
        rect.left >= 0 &&
        rect.top <=
            (window.innerHeight || document.documentElement.clientHeight) &&
        rect.left <= (window.innerWidth || document.documentElement.clientWidth));
}
var fadeIn = "\n  @keyframes gracefulimage {\n    0%   { opacity: 0.25; }\n    50%  { opacity: 0.5; }\n    100% { opacity: 1; }\n  }\n";
var IS_SVG_SUPPORTED = document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#Image', '1.1');
var GracefulImage = /** @class */ (function (_super) {
    __extends(GracefulImage, _super);
    function GracefulImage(props) {
        var _this = _super.call(this, props) || this;
        _this.registerListener = function (event, fn) {
            // eslint-disable-next-line react/no-find-dom-node
            _this.scrollElement = getScrollElement(ReactDOM.findDOMNode(_this));
            if (_this.scrollElement.addEventListener) {
                _this.scrollElement.addEventListener(event, fn);
            }
            else {
                //@ts-ignore
                _this.scrollElement.attachEvent('on' + event, fn);
            }
        };
        _this.clearEventListeners = function () {
            _this.throttledFunction.cancel();
            if (!_this.scrollElement) {
                return;
            }
            _this.scrollElement.removeEventListener('load', _this.throttledFunction);
            _this.scrollElement.removeEventListener('scroll', _this.throttledFunction);
            _this.scrollElement.removeEventListener('resize', _this.throttledFunction);
            _this.scrollElement.removeEventListener('gestureend', _this.throttledFunction);
        };
        /*
            If placeholder is currently within the viewport then load the actual image
            and remove all event listeners associated with it
        */
        _this.lazyLoad = function () {
            if (isInViewport(_this.placeholderImage)) {
                _this.clearEventListeners();
                _this.loadImage();
            }
        };
        _this._isMounted = false;
        var placeholder = null;
        if (IS_SVG_SUPPORTED) {
            var width = _this.props.style && _this.props.style.width
                ? _this.props.style.width
                : _this.props.width
                    ? _this.props.width
                    : '200';
            var height = _this.props.style && _this.props.style.height
                ? _this.props.style.height
                : _this.props.height
                    ? _this.props.height
                    : '150';
            placeholder =
                "data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg' width%3D'{{w}}' height%3D'{{h}}' viewBox%3D'0 0 {{w}} {{h}}'%2F%3E";
            placeholder = placeholder
                .replace(/{{w}}/g, width)
                .replace(/{{h}}/g, height);
        }
        // store a reference to the throttled function
        _this.throttledFunction = throttle(_this.lazyLoad, 150);
        _this.state = {
            loaded: false,
            retryDelay: _this.props.retry.delay,
            retryCount: 1,
            placeholder: placeholder
        };
        return _this;
    }
    /*
        - If image hasn't yet loaded AND user didn't want a placeholder OR SVG not supported then don't render anything
        - Else if image has loaded then render the image
        - Else render the placeholder
    */
    GracefulImage.prototype.render = function () {
        var _this = this;
        if (!this.state.loaded &&
            (this.props.noPlaceholder || !IS_SVG_SUPPORTED))
            return null;
        var src = this.state.loaded ? this.props.src : this.state.placeholder;
        var style = this.state.loaded
            ? {
                animationName: 'gracefulimage',
                animationDuration: '0.3s',
                animationIterationCount: 1,
                animationTimingFunction: 'ease-in'
            }
            : { background: this.props.placeholderColor };
        return (React__default.createElement("img", { src: src, srcSet: this.props.srcSet, className: this.props.className, width: this.props.width, height: this.props.height, style: __assign({}, style, this.props.style), alt: this.props.alt, ref: function (ref) { return (_this.placeholderImage = ref); } }));
    };
    /*
        Attempts to load an image src passed via props
        and utilises image events to track sccess / failure of the loading
    */
    GracefulImage.prototype.componentDidMount = function () {
        this._isMounted = true;
        this.addAnimationStyles();
        // if user wants to lazy load
        if (!this.props.noLazyLoad && IS_SVG_SUPPORTED) {
            // check if already within viewport to avoid attaching listeners
            if (isInViewport(this.placeholderImage)) {
                this.loadImage();
            }
            else {
                this.registerListener('load', this.throttledFunction);
                this.registerListener('scroll', this.throttledFunction);
                this.registerListener('resize', this.throttledFunction);
                this.registerListener('gestureend', this.throttledFunction); // to detect pinch on mobile devices
            }
        }
        else {
            this.loadImage();
        }
    };
    /*
    Clear timeout incase retry is still running
    And clear any existing event listeners
    */
    GracefulImage.prototype.componentWillUnmount = function () {
        this._isMounted = false;
        if (this.timeout) {
            window.clearTimeout(this.timeout);
        }
        this.clearEventListeners();
    };
    /*
        Creating a stylesheet to hold the fading animation
    */
    GracefulImage.prototype.addAnimationStyles = function () {
        var exists = document.head.querySelectorAll('[data-gracefulimage]');
        if (!exists.length) {
            var styleElement = document.createElement('style');
            styleElement.setAttribute('data-gracefulimage', 'exists');
            document.head.appendChild(styleElement);
            styleElement.sheet.insertRule(fadeIn, styleElement.sheet.cssRules.length);
        }
    };
    /*
        Marks an image as loaded
    */
    GracefulImage.prototype.setLoaded = function () {
        if (this._isMounted) {
            this.setState({ loaded: true });
        }
    };
    /*
        Attempts to download an image, and tracks its success / failure
    */
    GracefulImage.prototype.loadImage = function () {
        var _this = this;
        var image = new Image();
        image.onload = function () {
            _this.setLoaded();
        };
        image.onerror = function () {
            _this.handleImageRetries(image);
        };
        image.src = this.props.src;
    };
    /*
        Handles the actual re-attempts of loading the image
        following the default / provided retry algorithm
    */
    GracefulImage.prototype.handleImageRetries = function (image) {
        var _this = this;
        // if we are not mounted anymore, we do not care, and we can bail
        if (!this._isMounted) {
            return;
        }
        this.setState({ loaded: false }, function () {
            if (_this.state.retryCount <= _this.props.retry.count) {
                _this.timeout = setTimeout(function () {
                    // if we are not mounted anymore, we do not care, and we can bail
                    if (!_this._isMounted) {
                        return;
                    }
                    // re-attempt fetching the image
                    image.src = _this.props.src;
                    // update count and delay
                    _this.setState(function (prevState) {
                        var updateDelay;
                        if (_this.props.retry.accumulate === 'multiply') {
                            updateDelay =
                                prevState.retryDelay * _this.props.retry.delay;
                        }
                        else if (_this.props.retry.accumulate === 'add') {
                            updateDelay =
                                prevState.retryDelay + _this.props.retry.delay;
                        }
                        else if (_this.props.retry.accumulate === 'noop') {
                            updateDelay = _this.props.retry.delay;
                        }
                        else {
                            updateDelay = 'multiply';
                        }
                        return {
                            retryDelay: updateDelay,
                            retryCount: prevState.retryCount + 1
                        };
                    });
                }, _this.state.retryDelay * 1000);
            }
        });
    };
    GracefulImage.defaultProps = {
        placeholderColor: '#eee',
        retry: {
            count: 8,
            delay: 2,
            accumulate: 'multiply'
        },
        noRetry: false,
        noPlaceholder: false,
        noLazyLoad: false
    };
    return GracefulImage;
}(React.Component));

module.exports = GracefulImage;
