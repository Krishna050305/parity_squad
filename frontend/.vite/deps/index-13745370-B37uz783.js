import { i as __reExport, n as __esmMin, o as __toCommonJS, r as __exportAll, s as __toESM, t as __commonJSMin } from "./chunk-t8Qwt55I.js";
import { t as esm_default } from "./esm-BcL_IAAL.js";
//#region node_modules/@walletconnect/window-getters/dist/cjs/index.js
var require_cjs$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getLocalStorage = exports.getLocalStorageOrThrow = exports.getCrypto = exports.getCryptoOrThrow = exports.getLocation = exports.getLocationOrThrow = exports.getNavigator = exports.getNavigatorOrThrow = exports.getDocument = exports.getDocumentOrThrow = exports.getFromWindowOrThrow = exports.getFromWindow = void 0;
	function getFromWindow(name) {
		let res = void 0;
		if (typeof window !== "undefined" && typeof window[name] !== "undefined") res = window[name];
		return res;
	}
	exports.getFromWindow = getFromWindow;
	function getFromWindowOrThrow(name) {
		const res = getFromWindow(name);
		if (!res) throw new Error(`${name} is not defined in Window`);
		return res;
	}
	exports.getFromWindowOrThrow = getFromWindowOrThrow;
	function getDocumentOrThrow() {
		return getFromWindowOrThrow("document");
	}
	exports.getDocumentOrThrow = getDocumentOrThrow;
	function getDocument() {
		return getFromWindow("document");
	}
	exports.getDocument = getDocument;
	function getNavigatorOrThrow() {
		return getFromWindowOrThrow("navigator");
	}
	exports.getNavigatorOrThrow = getNavigatorOrThrow;
	function getNavigator() {
		return getFromWindow("navigator");
	}
	exports.getNavigator = getNavigator;
	function getLocationOrThrow() {
		return getFromWindowOrThrow("location");
	}
	exports.getLocationOrThrow = getLocationOrThrow;
	function getLocation() {
		return getFromWindow("location");
	}
	exports.getLocation = getLocation;
	function getCryptoOrThrow() {
		return getFromWindowOrThrow("crypto");
	}
	exports.getCryptoOrThrow = getCryptoOrThrow;
	function getCrypto() {
		return getFromWindow("crypto");
	}
	exports.getCrypto = getCrypto;
	function getLocalStorageOrThrow() {
		return getFromWindowOrThrow("localStorage");
	}
	exports.getLocalStorageOrThrow = getLocalStorageOrThrow;
	function getLocalStorage() {
		return getFromWindow("localStorage");
	}
	exports.getLocalStorage = getLocalStorage;
}));
//#endregion
//#region node_modules/@walletconnect/window-metadata/dist/cjs/index.js
var require_cjs$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getWindowMetadata = void 0;
	var window_getters_1 = require_cjs$2();
	function getWindowMetadata() {
		let doc;
		let loc;
		try {
			doc = window_getters_1.getDocumentOrThrow();
			loc = window_getters_1.getLocationOrThrow();
		} catch (e) {
			return null;
		}
		function getIcons() {
			const links = doc.getElementsByTagName("link");
			const icons = [];
			for (let i = 0; i < links.length; i++) {
				const link = links[i];
				const rel = link.getAttribute("rel");
				if (rel) {
					if (rel.toLowerCase().indexOf("icon") > -1) {
						const href = link.getAttribute("href");
						if (href) if (href.toLowerCase().indexOf("https:") === -1 && href.toLowerCase().indexOf("http:") === -1 && href.indexOf("//") !== 0) {
							let absoluteHref = loc.protocol + "//" + loc.host;
							if (href.indexOf("/") === 0) absoluteHref += href;
							else {
								const path = loc.pathname.split("/");
								path.pop();
								const finalPath = path.join("/");
								absoluteHref += finalPath + "/" + href;
							}
							icons.push(absoluteHref);
						} else if (href.indexOf("//") === 0) {
							const absoluteUrl = loc.protocol + href;
							icons.push(absoluteUrl);
						} else icons.push(href);
					}
				}
			}
			return icons;
		}
		function getWindowMetadataOfAny(...args) {
			const metaTags = doc.getElementsByTagName("meta");
			for (let i = 0; i < metaTags.length; i++) {
				const tag = metaTags[i];
				const attributes = [
					"itemprop",
					"property",
					"name"
				].map((target) => tag.getAttribute(target)).filter((attr) => {
					if (attr) return args.includes(attr);
					return false;
				});
				if (attributes.length && attributes) {
					const content = tag.getAttribute("content");
					if (content) return content;
				}
			}
			return "";
		}
		function getName() {
			let name = getWindowMetadataOfAny("name", "og:site_name", "og:title", "twitter:title");
			if (!name) name = doc.title;
			return name;
		}
		function getDescription() {
			return getWindowMetadataOfAny("description", "og:description", "twitter:description", "keywords");
		}
		const name = getName();
		return {
			description: getDescription(),
			url: loc.origin,
			icons: getIcons(),
			name
		};
	}
	exports.getWindowMetadata = getWindowMetadata;
}));
//#endregion
//#region node_modules/detect-browser/es/index.js
var __spreadArrays$1 = function() {
	for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
	for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];
	return r;
};
var BrowserInfo = function() {
	function BrowserInfo(name, version, os) {
		this.name = name;
		this.version = version;
		this.os = os;
		this.type = "browser";
	}
	return BrowserInfo;
}();
var NodeInfo = function() {
	function NodeInfo(version) {
		this.version = version;
		this.type = "node";
		this.name = "node";
		this.os = process.platform;
	}
	return NodeInfo;
}();
var SearchBotDeviceInfo = function() {
	function SearchBotDeviceInfo(name, version, os, bot) {
		this.name = name;
		this.version = version;
		this.os = os;
		this.bot = bot;
		this.type = "bot-device";
	}
	return SearchBotDeviceInfo;
}();
var BotInfo = function() {
	function BotInfo() {
		this.type = "bot";
		this.bot = true;
		this.name = "bot";
		this.version = null;
		this.os = null;
	}
	return BotInfo;
}();
var ReactNativeInfo = function() {
	function ReactNativeInfo() {
		this.type = "react-native";
		this.name = "react-native";
		this.version = null;
		this.os = null;
	}
	return ReactNativeInfo;
}();
var SEARCHBOX_UA_REGEX = /alexa|bot|crawl(er|ing)|facebookexternalhit|feedburner|google web preview|nagios|postrank|pingdom|slurp|spider|yahoo!|yandex/;
var SEARCHBOT_OS_REGEX = /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask\ Jeeves\/Teoma|ia_archiver)/;
var REQUIRED_VERSION_PARTS = 3;
var userAgentRules = [
	["aol", /AOLShield\/([0-9\._]+)/],
	["edge", /Edge\/([0-9\._]+)/],
	["edge-ios", /EdgiOS\/([0-9\._]+)/],
	["yandexbrowser", /YaBrowser\/([0-9\._]+)/],
	["kakaotalk", /KAKAOTALK\s([0-9\.]+)/],
	["samsung", /SamsungBrowser\/([0-9\.]+)/],
	["silk", /\bSilk\/([0-9._-]+)\b/],
	["miui", /MiuiBrowser\/([0-9\.]+)$/],
	["beaker", /BeakerBrowser\/([0-9\.]+)/],
	["edge-chromium", /EdgA?\/([0-9\.]+)/],
	["chromium-webview", /(?!Chrom.*OPR)wv\).*Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/],
	["chrome", /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/],
	["phantomjs", /PhantomJS\/([0-9\.]+)(:?\s|$)/],
	["crios", /CriOS\/([0-9\.]+)(:?\s|$)/],
	["firefox", /Firefox\/([0-9\.]+)(?:\s|$)/],
	["fxios", /FxiOS\/([0-9\.]+)/],
	["opera-mini", /Opera Mini.*Version\/([0-9\.]+)/],
	["opera", /Opera\/([0-9\.]+)(?:\s|$)/],
	["opera", /OPR\/([0-9\.]+)(:?\s|$)/],
	["ie", /Trident\/7\.0.*rv\:([0-9\.]+).*\).*Gecko$/],
	["ie", /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/],
	["ie", /MSIE\s(7\.0)/],
	["bb10", /BB10;\sTouch.*Version\/([0-9\.]+)/],
	["android", /Android\s([0-9\.]+)/],
	["ios", /Version\/([0-9\._]+).*Mobile.*Safari.*/],
	["safari", /Version\/([0-9\._]+).*Safari/],
	["facebook", /FBAV\/([0-9\.]+)/],
	["instagram", /Instagram\s([0-9\.]+)/],
	["ios-webview", /AppleWebKit\/([0-9\.]+).*Mobile/],
	["ios-webview", /AppleWebKit\/([0-9\.]+).*Gecko\)$/],
	["searchbot", SEARCHBOX_UA_REGEX]
];
var operatingSystemRules = [
	["iOS", /iP(hone|od|ad)/],
	["Android OS", /Android/],
	["BlackBerry OS", /BlackBerry|BB10/],
	["Windows Mobile", /IEMobile/],
	["Amazon OS", /Kindle/],
	["Windows 3.11", /Win16/],
	["Windows 95", /(Windows 95)|(Win95)|(Windows_95)/],
	["Windows 98", /(Windows 98)|(Win98)/],
	["Windows 2000", /(Windows NT 5.0)|(Windows 2000)/],
	["Windows XP", /(Windows NT 5.1)|(Windows XP)/],
	["Windows Server 2003", /(Windows NT 5.2)/],
	["Windows Vista", /(Windows NT 6.0)/],
	["Windows 7", /(Windows NT 6.1)/],
	["Windows 8", /(Windows NT 6.2)/],
	["Windows 8.1", /(Windows NT 6.3)/],
	["Windows 10", /(Windows NT 10.0)/],
	["Windows ME", /Windows ME/],
	["Open BSD", /OpenBSD/],
	["Sun OS", /SunOS/],
	["Chrome OS", /CrOS/],
	["Linux", /(Linux)|(X11)/],
	["Mac OS", /(Mac_PowerPC)|(Macintosh)/],
	["QNX", /QNX/],
	["BeOS", /BeOS/],
	["OS/2", /OS\/2/]
];
function detect(userAgent) {
	if (!!userAgent) return parseUserAgent(userAgent);
	if (typeof document === "undefined" && typeof navigator !== "undefined" && navigator.product === "ReactNative") return new ReactNativeInfo();
	if (typeof navigator !== "undefined") return parseUserAgent(navigator.userAgent);
	return getNodeVersion();
}
function matchUserAgent(ua) {
	return ua !== "" && userAgentRules.reduce(function(matched, _a) {
		var browser = _a[0], regex = _a[1];
		if (matched) return matched;
		var uaMatch = regex.exec(ua);
		return !!uaMatch && [browser, uaMatch];
	}, false);
}
function parseUserAgent(ua) {
	var matchedRule = matchUserAgent(ua);
	if (!matchedRule) return null;
	var name = matchedRule[0], match = matchedRule[1];
	if (name === "searchbot") return new BotInfo();
	var versionParts = match[1] && match[1].split(/[._]/).slice(0, 3);
	if (versionParts) {
		if (versionParts.length < REQUIRED_VERSION_PARTS) versionParts = __spreadArrays$1(versionParts, createVersionParts(REQUIRED_VERSION_PARTS - versionParts.length));
	} else versionParts = [];
	var version = versionParts.join(".");
	var os = detectOS$1(ua);
	var searchBotMatch = SEARCHBOT_OS_REGEX.exec(ua);
	if (searchBotMatch && searchBotMatch[1]) return new SearchBotDeviceInfo(name, version, os, searchBotMatch[1]);
	return new BrowserInfo(name, version, os);
}
function detectOS$1(ua) {
	for (var ii = 0, count = operatingSystemRules.length; ii < count; ii++) {
		var _a = operatingSystemRules[ii], os = _a[0];
		if (_a[1].exec(ua)) return os;
	}
	return null;
}
function getNodeVersion() {
	return typeof process !== "undefined" && process.version ? new NodeInfo(process.version.slice(1)) : null;
}
function createVersionParts(count) {
	var output = [];
	for (var ii = 0; ii < count; ii++) output.push("0");
	return output;
}
//#endregion
//#region node_modules/@walletconnect/browser-utils/dist/esm/browser.js
var import_cjs$1 = /* @__PURE__ */ __toESM(require_cjs$1());
var import_cjs$2 = /* @__PURE__ */ __toESM(require_cjs$2());
function detectEnv(userAgent) {
	return detect(userAgent);
}
function detectOS() {
	const env = detectEnv();
	return env && env.os ? env.os : void 0;
}
function isAndroid() {
	const os = detectOS();
	return os ? os.toLowerCase().includes("android") : false;
}
function isIOS() {
	const os = detectOS();
	return os ? os.toLowerCase().includes("ios") || os.toLowerCase().includes("mac") && navigator.maxTouchPoints > 1 : false;
}
function isMobile() {
	return detectOS() ? isAndroid() || isIOS() : false;
}
function isNode$1() {
	const env = detectEnv();
	return env && env.name ? env.name.toLowerCase() === "node" : false;
}
function isBrowser() {
	return !isNode$1() && !!getNavigator();
}
import_cjs$2.getFromWindow;
import_cjs$2.getFromWindowOrThrow;
import_cjs$2.getDocumentOrThrow;
import_cjs$2.getDocument;
import_cjs$2.getNavigatorOrThrow;
var getNavigator = import_cjs$2.getNavigator;
import_cjs$2.getLocationOrThrow;
var getLocation = import_cjs$2.getLocation;
import_cjs$2.getCryptoOrThrow;
import_cjs$2.getCrypto;
import_cjs$2.getLocalStorageOrThrow;
var getLocalStorage = import_cjs$2.getLocalStorage;
function getClientMeta() {
	return import_cjs$1.getWindowMetadata();
}
//#endregion
//#region node_modules/@walletconnect/safe-json/dist/esm/index.js
function safeJsonParse$1(value) {
	if (typeof value !== "string") throw new Error(`Cannot safe json parse value of type ${typeof value}`);
	try {
		return JSON.parse(value);
	} catch (_a) {
		return value;
	}
}
function safeJsonStringify$1(value) {
	return typeof value === "string" ? value : JSON.stringify(value);
}
//#endregion
//#region node_modules/@walletconnect/browser-utils/dist/esm/json.js
var safeJsonParse = safeJsonParse$1;
var safeJsonStringify = safeJsonStringify$1;
//#endregion
//#region node_modules/@walletconnect/browser-utils/dist/esm/local.js
function setLocal(key, data) {
	const raw = safeJsonStringify(data);
	const local = getLocalStorage();
	if (local) local.setItem(key, raw);
}
function getLocal(key) {
	let data = null;
	let raw = null;
	const local = getLocalStorage();
	if (local) raw = local.getItem(key);
	data = raw ? safeJsonParse(raw) : raw;
	return data;
}
function removeLocal(key) {
	const local = getLocalStorage();
	if (local) local.removeItem(key);
}
//#endregion
//#region node_modules/@walletconnect/browser-utils/dist/esm/mobile.js
var mobileLinkChoiceKey = "WALLETCONNECT_DEEPLINK_CHOICE";
//#endregion
//#region node_modules/@walletconnect/utils/dist/esm/constants.js
var reservedEvents = [
	"session_request",
	"session_update",
	"exchange_key",
	"connect",
	"disconnect",
	"display_uri",
	"modal_closed",
	"transport_open",
	"transport_close",
	"transport_error"
];
var signingMethods = [
	"eth_sendTransaction",
	"eth_signTransaction",
	"eth_sign",
	"eth_signTypedData",
	"eth_signTypedData_v1",
	"eth_signTypedData_v2",
	"eth_signTypedData_v3",
	"eth_signTypedData_v4",
	"personal_sign",
	"wallet_addEthereumChain",
	"wallet_switchEthereumChain",
	"wallet_getPermissions",
	"wallet_requestPermissions",
	"wallet_registerOnboarding",
	"wallet_watchAsset",
	"wallet_scanQRCode"
];
//#endregion
//#region browser-external:buffer
var require_browser_external_buffer = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = Object.create(new Proxy({}, { get(_, key) {
		if (key !== "__esModule" && key !== "__proto__" && key !== "constructor" && key !== "splice") console.warn(`Module "buffer" has been externalized for browser compatibility. Cannot access "buffer.${key}" in client code. See https://vite.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`);
	} }));
}));
//#endregion
//#region node_modules/bn.js/lib/bn.js
var require_bn = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(module$1, exports$1) {
		"use strict";
		function assert(val, msg) {
			if (!val) throw new Error(msg || "Assertion failed");
		}
		function inherits(ctor, superCtor) {
			ctor.super_ = superCtor;
			var TempCtor = function() {};
			TempCtor.prototype = superCtor.prototype;
			ctor.prototype = new TempCtor();
			ctor.prototype.constructor = ctor;
		}
		function BN(number, base, endian) {
			if (BN.isBN(number)) return number;
			this.negative = 0;
			this.words = null;
			this.length = 0;
			this.red = null;
			if (number !== null) {
				if (base === "le" || base === "be") {
					endian = base;
					base = 10;
				}
				this._init(number || 0, base || 10, endian || "be");
			}
		}
		if (typeof module$1 === "object") module$1.exports = BN;
		else exports$1.BN = BN;
		BN.BN = BN;
		BN.wordSize = 26;
		var Buffer;
		try {
			Buffer = require_browser_external_buffer().Buffer;
		} catch (e) {}
		BN.isBN = function isBN(num) {
			if (num instanceof BN) return true;
			return num !== null && typeof num === "object" && num.constructor.wordSize === BN.wordSize && Array.isArray(num.words);
		};
		BN.max = function max(left, right) {
			if (left.cmp(right) > 0) return left;
			return right;
		};
		BN.min = function min(left, right) {
			if (left.cmp(right) < 0) return left;
			return right;
		};
		BN.prototype._init = function init(number, base, endian) {
			if (typeof number === "number") return this._initNumber(number, base, endian);
			if (typeof number === "object") return this._initArray(number, base, endian);
			if (base === "hex") base = 16;
			assert(base === (base | 0) && base >= 2 && base <= 36);
			number = number.toString().replace(/\s+/g, "");
			var start = 0;
			if (number[0] === "-") start++;
			if (base === 16) this._parseHex(number, start);
			else this._parseBase(number, base, start);
			if (number[0] === "-") this.negative = 1;
			this.strip();
			if (endian !== "le") return;
			this._initArray(this.toArray(), base, endian);
		};
		BN.prototype._initNumber = function _initNumber(number, base, endian) {
			if (number < 0) {
				this.negative = 1;
				number = -number;
			}
			if (number < 67108864) {
				this.words = [number & 67108863];
				this.length = 1;
			} else if (number < 4503599627370496) {
				this.words = [number & 67108863, number / 67108864 & 67108863];
				this.length = 2;
			} else {
				assert(number < 9007199254740992);
				this.words = [
					number & 67108863,
					number / 67108864 & 67108863,
					1
				];
				this.length = 3;
			}
			if (endian !== "le") return;
			this._initArray(this.toArray(), base, endian);
		};
		BN.prototype._initArray = function _initArray(number, base, endian) {
			assert(typeof number.length === "number");
			if (number.length <= 0) {
				this.words = [0];
				this.length = 1;
				return this;
			}
			this.length = Math.ceil(number.length / 3);
			this.words = new Array(this.length);
			for (var i = 0; i < this.length; i++) this.words[i] = 0;
			var j, w;
			var off = 0;
			if (endian === "be") for (i = number.length - 1, j = 0; i >= 0; i -= 3) {
				w = number[i] | number[i - 1] << 8 | number[i - 2] << 16;
				this.words[j] |= w << off & 67108863;
				this.words[j + 1] = w >>> 26 - off & 67108863;
				off += 24;
				if (off >= 26) {
					off -= 26;
					j++;
				}
			}
			else if (endian === "le") for (i = 0, j = 0; i < number.length; i += 3) {
				w = number[i] | number[i + 1] << 8 | number[i + 2] << 16;
				this.words[j] |= w << off & 67108863;
				this.words[j + 1] = w >>> 26 - off & 67108863;
				off += 24;
				if (off >= 26) {
					off -= 26;
					j++;
				}
			}
			return this.strip();
		};
		function parseHex(str, start, end) {
			var r = 0;
			var len = Math.min(str.length, end);
			for (var i = start; i < len; i++) {
				var c = str.charCodeAt(i) - 48;
				r <<= 4;
				if (c >= 49 && c <= 54) r |= c - 49 + 10;
				else if (c >= 17 && c <= 22) r |= c - 17 + 10;
				else r |= c & 15;
			}
			return r;
		}
		BN.prototype._parseHex = function _parseHex(number, start) {
			this.length = Math.ceil((number.length - start) / 6);
			this.words = new Array(this.length);
			for (var i = 0; i < this.length; i++) this.words[i] = 0;
			var j, w;
			var off = 0;
			for (i = number.length - 6, j = 0; i >= start; i -= 6) {
				w = parseHex(number, i, i + 6);
				this.words[j] |= w << off & 67108863;
				this.words[j + 1] |= w >>> 26 - off & 4194303;
				off += 24;
				if (off >= 26) {
					off -= 26;
					j++;
				}
			}
			if (i + 6 !== start) {
				w = parseHex(number, start, i + 6);
				this.words[j] |= w << off & 67108863;
				this.words[j + 1] |= w >>> 26 - off & 4194303;
			}
			this.strip();
		};
		function parseBase(str, start, end, mul) {
			var r = 0;
			var len = Math.min(str.length, end);
			for (var i = start; i < len; i++) {
				var c = str.charCodeAt(i) - 48;
				r *= mul;
				if (c >= 49) r += c - 49 + 10;
				else if (c >= 17) r += c - 17 + 10;
				else r += c;
			}
			return r;
		}
		BN.prototype._parseBase = function _parseBase(number, base, start) {
			this.words = [0];
			this.length = 1;
			for (var limbLen = 0, limbPow = 1; limbPow <= 67108863; limbPow *= base) limbLen++;
			limbLen--;
			limbPow = limbPow / base | 0;
			var total = number.length - start;
			var mod = total % limbLen;
			var end = Math.min(total, total - mod) + start;
			var word = 0;
			for (var i = start; i < end; i += limbLen) {
				word = parseBase(number, i, i + limbLen, base);
				this.imuln(limbPow);
				if (this.words[0] + word < 67108864) this.words[0] += word;
				else this._iaddn(word);
			}
			if (mod !== 0) {
				var pow = 1;
				word = parseBase(number, i, number.length, base);
				for (i = 0; i < mod; i++) pow *= base;
				this.imuln(pow);
				if (this.words[0] + word < 67108864) this.words[0] += word;
				else this._iaddn(word);
			}
		};
		BN.prototype.copy = function copy(dest) {
			dest.words = new Array(this.length);
			for (var i = 0; i < this.length; i++) dest.words[i] = this.words[i];
			dest.length = this.length;
			dest.negative = this.negative;
			dest.red = this.red;
		};
		BN.prototype.clone = function clone() {
			var r = new BN(null);
			this.copy(r);
			return r;
		};
		BN.prototype._expand = function _expand(size) {
			while (this.length < size) this.words[this.length++] = 0;
			return this;
		};
		BN.prototype.strip = function strip() {
			while (this.length > 1 && this.words[this.length - 1] === 0) this.length--;
			return this._normSign();
		};
		BN.prototype._normSign = function _normSign() {
			if (this.length === 1 && this.words[0] === 0) this.negative = 0;
			return this;
		};
		BN.prototype.inspect = function inspect() {
			return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
		};
		var zeros = [
			"",
			"0",
			"00",
			"000",
			"0000",
			"00000",
			"000000",
			"0000000",
			"00000000",
			"000000000",
			"0000000000",
			"00000000000",
			"000000000000",
			"0000000000000",
			"00000000000000",
			"000000000000000",
			"0000000000000000",
			"00000000000000000",
			"000000000000000000",
			"0000000000000000000",
			"00000000000000000000",
			"000000000000000000000",
			"0000000000000000000000",
			"00000000000000000000000",
			"000000000000000000000000",
			"0000000000000000000000000"
		];
		var groupSizes = [
			0,
			0,
			25,
			16,
			12,
			11,
			10,
			9,
			8,
			8,
			7,
			7,
			7,
			7,
			6,
			6,
			6,
			6,
			6,
			6,
			6,
			5,
			5,
			5,
			5,
			5,
			5,
			5,
			5,
			5,
			5,
			5,
			5,
			5,
			5,
			5,
			5
		];
		var groupBases = [
			0,
			0,
			33554432,
			43046721,
			16777216,
			48828125,
			60466176,
			40353607,
			16777216,
			43046721,
			1e7,
			19487171,
			35831808,
			62748517,
			7529536,
			11390625,
			16777216,
			24137569,
			34012224,
			47045881,
			64e6,
			4084101,
			5153632,
			6436343,
			7962624,
			9765625,
			11881376,
			14348907,
			17210368,
			20511149,
			243e5,
			28629151,
			33554432,
			39135393,
			45435424,
			52521875,
			60466176
		];
		BN.prototype.toString = function toString(base, padding) {
			base = base || 10;
			padding = padding | 0 || 1;
			var out;
			if (base === 16 || base === "hex") {
				out = "";
				var off = 0;
				var carry = 0;
				for (var i = 0; i < this.length; i++) {
					var w = this.words[i];
					var word = ((w << off | carry) & 16777215).toString(16);
					carry = w >>> 24 - off & 16777215;
					if (carry !== 0 || i !== this.length - 1) out = zeros[6 - word.length] + word + out;
					else out = word + out;
					off += 2;
					if (off >= 26) {
						off -= 26;
						i--;
					}
				}
				if (carry !== 0) out = carry.toString(16) + out;
				while (out.length % padding !== 0) out = "0" + out;
				if (this.negative !== 0) out = "-" + out;
				return out;
			}
			if (base === (base | 0) && base >= 2 && base <= 36) {
				var groupSize = groupSizes[base];
				var groupBase = groupBases[base];
				out = "";
				var c = this.clone();
				c.negative = 0;
				while (!c.isZero()) {
					var r = c.modn(groupBase).toString(base);
					c = c.idivn(groupBase);
					if (!c.isZero()) out = zeros[groupSize - r.length] + r + out;
					else out = r + out;
				}
				if (this.isZero()) out = "0" + out;
				while (out.length % padding !== 0) out = "0" + out;
				if (this.negative !== 0) out = "-" + out;
				return out;
			}
			assert(false, "Base should be between 2 and 36");
		};
		BN.prototype.toNumber = function toNumber() {
			var ret = this.words[0];
			if (this.length === 2) ret += this.words[1] * 67108864;
			else if (this.length === 3 && this.words[2] === 1) ret += 4503599627370496 + this.words[1] * 67108864;
			else if (this.length > 2) assert(false, "Number can only safely store up to 53 bits");
			return this.negative !== 0 ? -ret : ret;
		};
		BN.prototype.toJSON = function toJSON() {
			return this.toString(16);
		};
		BN.prototype.toBuffer = function toBuffer(endian, length) {
			assert(typeof Buffer !== "undefined");
			return this.toArrayLike(Buffer, endian, length);
		};
		BN.prototype.toArray = function toArray(endian, length) {
			return this.toArrayLike(Array, endian, length);
		};
		BN.prototype.toArrayLike = function toArrayLike(ArrayType, endian, length) {
			var byteLength = this.byteLength();
			var reqLength = length || Math.max(1, byteLength);
			assert(byteLength <= reqLength, "byte array longer than desired length");
			assert(reqLength > 0, "Requested array length <= 0");
			this.strip();
			var littleEndian = endian === "le";
			var res = new ArrayType(reqLength);
			var b, i;
			var q = this.clone();
			if (!littleEndian) {
				for (i = 0; i < reqLength - byteLength; i++) res[i] = 0;
				for (i = 0; !q.isZero(); i++) {
					b = q.andln(255);
					q.iushrn(8);
					res[reqLength - i - 1] = b;
				}
			} else {
				for (i = 0; !q.isZero(); i++) {
					b = q.andln(255);
					q.iushrn(8);
					res[i] = b;
				}
				for (; i < reqLength; i++) res[i] = 0;
			}
			return res;
		};
		if (Math.clz32) BN.prototype._countBits = function _countBits(w) {
			return 32 - Math.clz32(w);
		};
		else BN.prototype._countBits = function _countBits(w) {
			var t = w;
			var r = 0;
			if (t >= 4096) {
				r += 13;
				t >>>= 13;
			}
			if (t >= 64) {
				r += 7;
				t >>>= 7;
			}
			if (t >= 8) {
				r += 4;
				t >>>= 4;
			}
			if (t >= 2) {
				r += 2;
				t >>>= 2;
			}
			return r + t;
		};
		BN.prototype._zeroBits = function _zeroBits(w) {
			if (w === 0) return 26;
			var t = w;
			var r = 0;
			if ((t & 8191) === 0) {
				r += 13;
				t >>>= 13;
			}
			if ((t & 127) === 0) {
				r += 7;
				t >>>= 7;
			}
			if ((t & 15) === 0) {
				r += 4;
				t >>>= 4;
			}
			if ((t & 3) === 0) {
				r += 2;
				t >>>= 2;
			}
			if ((t & 1) === 0) r++;
			return r;
		};
		BN.prototype.bitLength = function bitLength() {
			var w = this.words[this.length - 1];
			var hi = this._countBits(w);
			return (this.length - 1) * 26 + hi;
		};
		function toBitArray(num) {
			var w = new Array(num.bitLength());
			for (var bit = 0; bit < w.length; bit++) {
				var off = bit / 26 | 0;
				var wbit = bit % 26;
				w[bit] = (num.words[off] & 1 << wbit) >>> wbit;
			}
			return w;
		}
		BN.prototype.zeroBits = function zeroBits() {
			if (this.isZero()) return 0;
			var r = 0;
			for (var i = 0; i < this.length; i++) {
				var b = this._zeroBits(this.words[i]);
				r += b;
				if (b !== 26) break;
			}
			return r;
		};
		BN.prototype.byteLength = function byteLength() {
			return Math.ceil(this.bitLength() / 8);
		};
		BN.prototype.toTwos = function toTwos(width) {
			if (this.negative !== 0) return this.abs().inotn(width).iaddn(1);
			return this.clone();
		};
		BN.prototype.fromTwos = function fromTwos(width) {
			if (this.testn(width - 1)) return this.notn(width).iaddn(1).ineg();
			return this.clone();
		};
		BN.prototype.isNeg = function isNeg() {
			return this.negative !== 0;
		};
		BN.prototype.neg = function neg() {
			return this.clone().ineg();
		};
		BN.prototype.ineg = function ineg() {
			if (!this.isZero()) this.negative ^= 1;
			return this;
		};
		BN.prototype.iuor = function iuor(num) {
			while (this.length < num.length) this.words[this.length++] = 0;
			for (var i = 0; i < num.length; i++) this.words[i] = this.words[i] | num.words[i];
			return this.strip();
		};
		BN.prototype.ior = function ior(num) {
			assert((this.negative | num.negative) === 0);
			return this.iuor(num);
		};
		BN.prototype.or = function or(num) {
			if (this.length > num.length) return this.clone().ior(num);
			return num.clone().ior(this);
		};
		BN.prototype.uor = function uor(num) {
			if (this.length > num.length) return this.clone().iuor(num);
			return num.clone().iuor(this);
		};
		BN.prototype.iuand = function iuand(num) {
			var b;
			if (this.length > num.length) b = num;
			else b = this;
			for (var i = 0; i < b.length; i++) this.words[i] = this.words[i] & num.words[i];
			this.length = b.length;
			return this.strip();
		};
		BN.prototype.iand = function iand(num) {
			assert((this.negative | num.negative) === 0);
			return this.iuand(num);
		};
		BN.prototype.and = function and(num) {
			if (this.length > num.length) return this.clone().iand(num);
			return num.clone().iand(this);
		};
		BN.prototype.uand = function uand(num) {
			if (this.length > num.length) return this.clone().iuand(num);
			return num.clone().iuand(this);
		};
		BN.prototype.iuxor = function iuxor(num) {
			var a;
			var b;
			if (this.length > num.length) {
				a = this;
				b = num;
			} else {
				a = num;
				b = this;
			}
			for (var i = 0; i < b.length; i++) this.words[i] = a.words[i] ^ b.words[i];
			if (this !== a) for (; i < a.length; i++) this.words[i] = a.words[i];
			this.length = a.length;
			return this.strip();
		};
		BN.prototype.ixor = function ixor(num) {
			assert((this.negative | num.negative) === 0);
			return this.iuxor(num);
		};
		BN.prototype.xor = function xor(num) {
			if (this.length > num.length) return this.clone().ixor(num);
			return num.clone().ixor(this);
		};
		BN.prototype.uxor = function uxor(num) {
			if (this.length > num.length) return this.clone().iuxor(num);
			return num.clone().iuxor(this);
		};
		BN.prototype.inotn = function inotn(width) {
			assert(typeof width === "number" && width >= 0);
			var bytesNeeded = Math.ceil(width / 26) | 0;
			var bitsLeft = width % 26;
			this._expand(bytesNeeded);
			if (bitsLeft > 0) bytesNeeded--;
			for (var i = 0; i < bytesNeeded; i++) this.words[i] = ~this.words[i] & 67108863;
			if (bitsLeft > 0) this.words[i] = ~this.words[i] & 67108863 >> 26 - bitsLeft;
			return this.strip();
		};
		BN.prototype.notn = function notn(width) {
			return this.clone().inotn(width);
		};
		BN.prototype.setn = function setn(bit, val) {
			assert(typeof bit === "number" && bit >= 0);
			var off = bit / 26 | 0;
			var wbit = bit % 26;
			this._expand(off + 1);
			if (val) this.words[off] = this.words[off] | 1 << wbit;
			else this.words[off] = this.words[off] & ~(1 << wbit);
			return this.strip();
		};
		BN.prototype.iadd = function iadd(num) {
			var r;
			if (this.negative !== 0 && num.negative === 0) {
				this.negative = 0;
				r = this.isub(num);
				this.negative ^= 1;
				return this._normSign();
			} else if (this.negative === 0 && num.negative !== 0) {
				num.negative = 0;
				r = this.isub(num);
				num.negative = 1;
				return r._normSign();
			}
			var a, b;
			if (this.length > num.length) {
				a = this;
				b = num;
			} else {
				a = num;
				b = this;
			}
			var carry = 0;
			for (var i = 0; i < b.length; i++) {
				r = (a.words[i] | 0) + (b.words[i] | 0) + carry;
				this.words[i] = r & 67108863;
				carry = r >>> 26;
			}
			for (; carry !== 0 && i < a.length; i++) {
				r = (a.words[i] | 0) + carry;
				this.words[i] = r & 67108863;
				carry = r >>> 26;
			}
			this.length = a.length;
			if (carry !== 0) {
				this.words[this.length] = carry;
				this.length++;
			} else if (a !== this) for (; i < a.length; i++) this.words[i] = a.words[i];
			return this;
		};
		BN.prototype.add = function add(num) {
			var res;
			if (num.negative !== 0 && this.negative === 0) {
				num.negative = 0;
				res = this.sub(num);
				num.negative ^= 1;
				return res;
			} else if (num.negative === 0 && this.negative !== 0) {
				this.negative = 0;
				res = num.sub(this);
				this.negative = 1;
				return res;
			}
			if (this.length > num.length) return this.clone().iadd(num);
			return num.clone().iadd(this);
		};
		BN.prototype.isub = function isub(num) {
			if (num.negative !== 0) {
				num.negative = 0;
				var r = this.iadd(num);
				num.negative = 1;
				return r._normSign();
			} else if (this.negative !== 0) {
				this.negative = 0;
				this.iadd(num);
				this.negative = 1;
				return this._normSign();
			}
			var cmp = this.cmp(num);
			if (cmp === 0) {
				this.negative = 0;
				this.length = 1;
				this.words[0] = 0;
				return this;
			}
			var a, b;
			if (cmp > 0) {
				a = this;
				b = num;
			} else {
				a = num;
				b = this;
			}
			var carry = 0;
			for (var i = 0; i < b.length; i++) {
				r = (a.words[i] | 0) - (b.words[i] | 0) + carry;
				carry = r >> 26;
				this.words[i] = r & 67108863;
			}
			for (; carry !== 0 && i < a.length; i++) {
				r = (a.words[i] | 0) + carry;
				carry = r >> 26;
				this.words[i] = r & 67108863;
			}
			if (carry === 0 && i < a.length && a !== this) for (; i < a.length; i++) this.words[i] = a.words[i];
			this.length = Math.max(this.length, i);
			if (a !== this) this.negative = 1;
			return this.strip();
		};
		BN.prototype.sub = function sub(num) {
			return this.clone().isub(num);
		};
		function smallMulTo(self, num, out) {
			out.negative = num.negative ^ self.negative;
			var len = self.length + num.length | 0;
			out.length = len;
			len = len - 1 | 0;
			var a = self.words[0] | 0;
			var b = num.words[0] | 0;
			var r = a * b;
			var lo = r & 67108863;
			var carry = r / 67108864 | 0;
			out.words[0] = lo;
			for (var k = 1; k < len; k++) {
				var ncarry = carry >>> 26;
				var rword = carry & 67108863;
				var maxJ = Math.min(k, num.length - 1);
				for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
					var i = k - j | 0;
					a = self.words[i] | 0;
					b = num.words[j] | 0;
					r = a * b + rword;
					ncarry += r / 67108864 | 0;
					rword = r & 67108863;
				}
				out.words[k] = rword | 0;
				carry = ncarry | 0;
			}
			if (carry !== 0) out.words[k] = carry | 0;
			else out.length--;
			return out.strip();
		}
		var comb10MulTo = function comb10MulTo(self, num, out) {
			var a = self.words;
			var b = num.words;
			var o = out.words;
			var c = 0;
			var lo;
			var mid;
			var hi;
			var a0 = a[0] | 0;
			var al0 = a0 & 8191;
			var ah0 = a0 >>> 13;
			var a1 = a[1] | 0;
			var al1 = a1 & 8191;
			var ah1 = a1 >>> 13;
			var a2 = a[2] | 0;
			var al2 = a2 & 8191;
			var ah2 = a2 >>> 13;
			var a3 = a[3] | 0;
			var al3 = a3 & 8191;
			var ah3 = a3 >>> 13;
			var a4 = a[4] | 0;
			var al4 = a4 & 8191;
			var ah4 = a4 >>> 13;
			var a5 = a[5] | 0;
			var al5 = a5 & 8191;
			var ah5 = a5 >>> 13;
			var a6 = a[6] | 0;
			var al6 = a6 & 8191;
			var ah6 = a6 >>> 13;
			var a7 = a[7] | 0;
			var al7 = a7 & 8191;
			var ah7 = a7 >>> 13;
			var a8 = a[8] | 0;
			var al8 = a8 & 8191;
			var ah8 = a8 >>> 13;
			var a9 = a[9] | 0;
			var al9 = a9 & 8191;
			var ah9 = a9 >>> 13;
			var b0 = b[0] | 0;
			var bl0 = b0 & 8191;
			var bh0 = b0 >>> 13;
			var b1 = b[1] | 0;
			var bl1 = b1 & 8191;
			var bh1 = b1 >>> 13;
			var b2 = b[2] | 0;
			var bl2 = b2 & 8191;
			var bh2 = b2 >>> 13;
			var b3 = b[3] | 0;
			var bl3 = b3 & 8191;
			var bh3 = b3 >>> 13;
			var b4 = b[4] | 0;
			var bl4 = b4 & 8191;
			var bh4 = b4 >>> 13;
			var b5 = b[5] | 0;
			var bl5 = b5 & 8191;
			var bh5 = b5 >>> 13;
			var b6 = b[6] | 0;
			var bl6 = b6 & 8191;
			var bh6 = b6 >>> 13;
			var b7 = b[7] | 0;
			var bl7 = b7 & 8191;
			var bh7 = b7 >>> 13;
			var b8 = b[8] | 0;
			var bl8 = b8 & 8191;
			var bh8 = b8 >>> 13;
			var b9 = b[9] | 0;
			var bl9 = b9 & 8191;
			var bh9 = b9 >>> 13;
			out.negative = self.negative ^ num.negative;
			out.length = 19;
			lo = Math.imul(al0, bl0);
			mid = Math.imul(al0, bh0);
			mid = mid + Math.imul(ah0, bl0) | 0;
			hi = Math.imul(ah0, bh0);
			var w0 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
			c = (hi + (mid >>> 13) | 0) + (w0 >>> 26) | 0;
			w0 &= 67108863;
			lo = Math.imul(al1, bl0);
			mid = Math.imul(al1, bh0);
			mid = mid + Math.imul(ah1, bl0) | 0;
			hi = Math.imul(ah1, bh0);
			lo = lo + Math.imul(al0, bl1) | 0;
			mid = mid + Math.imul(al0, bh1) | 0;
			mid = mid + Math.imul(ah0, bl1) | 0;
			hi = hi + Math.imul(ah0, bh1) | 0;
			var w1 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
			c = (hi + (mid >>> 13) | 0) + (w1 >>> 26) | 0;
			w1 &= 67108863;
			lo = Math.imul(al2, bl0);
			mid = Math.imul(al2, bh0);
			mid = mid + Math.imul(ah2, bl0) | 0;
			hi = Math.imul(ah2, bh0);
			lo = lo + Math.imul(al1, bl1) | 0;
			mid = mid + Math.imul(al1, bh1) | 0;
			mid = mid + Math.imul(ah1, bl1) | 0;
			hi = hi + Math.imul(ah1, bh1) | 0;
			lo = lo + Math.imul(al0, bl2) | 0;
			mid = mid + Math.imul(al0, bh2) | 0;
			mid = mid + Math.imul(ah0, bl2) | 0;
			hi = hi + Math.imul(ah0, bh2) | 0;
			var w2 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
			c = (hi + (mid >>> 13) | 0) + (w2 >>> 26) | 0;
			w2 &= 67108863;
			lo = Math.imul(al3, bl0);
			mid = Math.imul(al3, bh0);
			mid = mid + Math.imul(ah3, bl0) | 0;
			hi = Math.imul(ah3, bh0);
			lo = lo + Math.imul(al2, bl1) | 0;
			mid = mid + Math.imul(al2, bh1) | 0;
			mid = mid + Math.imul(ah2, bl1) | 0;
			hi = hi + Math.imul(ah2, bh1) | 0;
			lo = lo + Math.imul(al1, bl2) | 0;
			mid = mid + Math.imul(al1, bh2) | 0;
			mid = mid + Math.imul(ah1, bl2) | 0;
			hi = hi + Math.imul(ah1, bh2) | 0;
			lo = lo + Math.imul(al0, bl3) | 0;
			mid = mid + Math.imul(al0, bh3) | 0;
			mid = mid + Math.imul(ah0, bl3) | 0;
			hi = hi + Math.imul(ah0, bh3) | 0;
			var w3 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
			c = (hi + (mid >>> 13) | 0) + (w3 >>> 26) | 0;
			w3 &= 67108863;
			lo = Math.imul(al4, bl0);
			mid = Math.imul(al4, bh0);
			mid = mid + Math.imul(ah4, bl0) | 0;
			hi = Math.imul(ah4, bh0);
			lo = lo + Math.imul(al3, bl1) | 0;
			mid = mid + Math.imul(al3, bh1) | 0;
			mid = mid + Math.imul(ah3, bl1) | 0;
			hi = hi + Math.imul(ah3, bh1) | 0;
			lo = lo + Math.imul(al2, bl2) | 0;
			mid = mid + Math.imul(al2, bh2) | 0;
			mid = mid + Math.imul(ah2, bl2) | 0;
			hi = hi + Math.imul(ah2, bh2) | 0;
			lo = lo + Math.imul(al1, bl3) | 0;
			mid = mid + Math.imul(al1, bh3) | 0;
			mid = mid + Math.imul(ah1, bl3) | 0;
			hi = hi + Math.imul(ah1, bh3) | 0;
			lo = lo + Math.imul(al0, bl4) | 0;
			mid = mid + Math.imul(al0, bh4) | 0;
			mid = mid + Math.imul(ah0, bl4) | 0;
			hi = hi + Math.imul(ah0, bh4) | 0;
			var w4 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
			c = (hi + (mid >>> 13) | 0) + (w4 >>> 26) | 0;
			w4 &= 67108863;
			lo = Math.imul(al5, bl0);
			mid = Math.imul(al5, bh0);
			mid = mid + Math.imul(ah5, bl0) | 0;
			hi = Math.imul(ah5, bh0);
			lo = lo + Math.imul(al4, bl1) | 0;
			mid = mid + Math.imul(al4, bh1) | 0;
			mid = mid + Math.imul(ah4, bl1) | 0;
			hi = hi + Math.imul(ah4, bh1) | 0;
			lo = lo + Math.imul(al3, bl2) | 0;
			mid = mid + Math.imul(al3, bh2) | 0;
			mid = mid + Math.imul(ah3, bl2) | 0;
			hi = hi + Math.imul(ah3, bh2) | 0;
			lo = lo + Math.imul(al2, bl3) | 0;
			mid = mid + Math.imul(al2, bh3) | 0;
			mid = mid + Math.imul(ah2, bl3) | 0;
			hi = hi + Math.imul(ah2, bh3) | 0;
			lo = lo + Math.imul(al1, bl4) | 0;
			mid = mid + Math.imul(al1, bh4) | 0;
			mid = mid + Math.imul(ah1, bl4) | 0;
			hi = hi + Math.imul(ah1, bh4) | 0;
			lo = lo + Math.imul(al0, bl5) | 0;
			mid = mid + Math.imul(al0, bh5) | 0;
			mid = mid + Math.imul(ah0, bl5) | 0;
			hi = hi + Math.imul(ah0, bh5) | 0;
			var w5 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
			c = (hi + (mid >>> 13) | 0) + (w5 >>> 26) | 0;
			w5 &= 67108863;
			lo = Math.imul(al6, bl0);
			mid = Math.imul(al6, bh0);
			mid = mid + Math.imul(ah6, bl0) | 0;
			hi = Math.imul(ah6, bh0);
			lo = lo + Math.imul(al5, bl1) | 0;
			mid = mid + Math.imul(al5, bh1) | 0;
			mid = mid + Math.imul(ah5, bl1) | 0;
			hi = hi + Math.imul(ah5, bh1) | 0;
			lo = lo + Math.imul(al4, bl2) | 0;
			mid = mid + Math.imul(al4, bh2) | 0;
			mid = mid + Math.imul(ah4, bl2) | 0;
			hi = hi + Math.imul(ah4, bh2) | 0;
			lo = lo + Math.imul(al3, bl3) | 0;
			mid = mid + Math.imul(al3, bh3) | 0;
			mid = mid + Math.imul(ah3, bl3) | 0;
			hi = hi + Math.imul(ah3, bh3) | 0;
			lo = lo + Math.imul(al2, bl4) | 0;
			mid = mid + Math.imul(al2, bh4) | 0;
			mid = mid + Math.imul(ah2, bl4) | 0;
			hi = hi + Math.imul(ah2, bh4) | 0;
			lo = lo + Math.imul(al1, bl5) | 0;
			mid = mid + Math.imul(al1, bh5) | 0;
			mid = mid + Math.imul(ah1, bl5) | 0;
			hi = hi + Math.imul(ah1, bh5) | 0;
			lo = lo + Math.imul(al0, bl6) | 0;
			mid = mid + Math.imul(al0, bh6) | 0;
			mid = mid + Math.imul(ah0, bl6) | 0;
			hi = hi + Math.imul(ah0, bh6) | 0;
			var w6 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
			c = (hi + (mid >>> 13) | 0) + (w6 >>> 26) | 0;
			w6 &= 67108863;
			lo = Math.imul(al7, bl0);
			mid = Math.imul(al7, bh0);
			mid = mid + Math.imul(ah7, bl0) | 0;
			hi = Math.imul(ah7, bh0);
			lo = lo + Math.imul(al6, bl1) | 0;
			mid = mid + Math.imul(al6, bh1) | 0;
			mid = mid + Math.imul(ah6, bl1) | 0;
			hi = hi + Math.imul(ah6, bh1) | 0;
			lo = lo + Math.imul(al5, bl2) | 0;
			mid = mid + Math.imul(al5, bh2) | 0;
			mid = mid + Math.imul(ah5, bl2) | 0;
			hi = hi + Math.imul(ah5, bh2) | 0;
			lo = lo + Math.imul(al4, bl3) | 0;
			mid = mid + Math.imul(al4, bh3) | 0;
			mid = mid + Math.imul(ah4, bl3) | 0;
			hi = hi + Math.imul(ah4, bh3) | 0;
			lo = lo + Math.imul(al3, bl4) | 0;
			mid = mid + Math.imul(al3, bh4) | 0;
			mid = mid + Math.imul(ah3, bl4) | 0;
			hi = hi + Math.imul(ah3, bh4) | 0;
			lo = lo + Math.imul(al2, bl5) | 0;
			mid = mid + Math.imul(al2, bh5) | 0;
			mid = mid + Math.imul(ah2, bl5) | 0;
			hi = hi + Math.imul(ah2, bh5) | 0;
			lo = lo + Math.imul(al1, bl6) | 0;
			mid = mid + Math.imul(al1, bh6) | 0;
			mid = mid + Math.imul(ah1, bl6) | 0;
			hi = hi + Math.imul(ah1, bh6) | 0;
			lo = lo + Math.imul(al0, bl7) | 0;
			mid = mid + Math.imul(al0, bh7) | 0;
			mid = mid + Math.imul(ah0, bl7) | 0;
			hi = hi + Math.imul(ah0, bh7) | 0;
			var w7 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
			c = (hi + (mid >>> 13) | 0) + (w7 >>> 26) | 0;
			w7 &= 67108863;
			lo = Math.imul(al8, bl0);
			mid = Math.imul(al8, bh0);
			mid = mid + Math.imul(ah8, bl0) | 0;
			hi = Math.imul(ah8, bh0);
			lo = lo + Math.imul(al7, bl1) | 0;
			mid = mid + Math.imul(al7, bh1) | 0;
			mid = mid + Math.imul(ah7, bl1) | 0;
			hi = hi + Math.imul(ah7, bh1) | 0;
			lo = lo + Math.imul(al6, bl2) | 0;
			mid = mid + Math.imul(al6, bh2) | 0;
			mid = mid + Math.imul(ah6, bl2) | 0;
			hi = hi + Math.imul(ah6, bh2) | 0;
			lo = lo + Math.imul(al5, bl3) | 0;
			mid = mid + Math.imul(al5, bh3) | 0;
			mid = mid + Math.imul(ah5, bl3) | 0;
			hi = hi + Math.imul(ah5, bh3) | 0;
			lo = lo + Math.imul(al4, bl4) | 0;
			mid = mid + Math.imul(al4, bh4) | 0;
			mid = mid + Math.imul(ah4, bl4) | 0;
			hi = hi + Math.imul(ah4, bh4) | 0;
			lo = lo + Math.imul(al3, bl5) | 0;
			mid = mid + Math.imul(al3, bh5) | 0;
			mid = mid + Math.imul(ah3, bl5) | 0;
			hi = hi + Math.imul(ah3, bh5) | 0;
			lo = lo + Math.imul(al2, bl6) | 0;
			mid = mid + Math.imul(al2, bh6) | 0;
			mid = mid + Math.imul(ah2, bl6) | 0;
			hi = hi + Math.imul(ah2, bh6) | 0;
			lo = lo + Math.imul(al1, bl7) | 0;
			mid = mid + Math.imul(al1, bh7) | 0;
			mid = mid + Math.imul(ah1, bl7) | 0;
			hi = hi + Math.imul(ah1, bh7) | 0;
			lo = lo + Math.imul(al0, bl8) | 0;
			mid = mid + Math.imul(al0, bh8) | 0;
			mid = mid + Math.imul(ah0, bl8) | 0;
			hi = hi + Math.imul(ah0, bh8) | 0;
			var w8 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
			c = (hi + (mid >>> 13) | 0) + (w8 >>> 26) | 0;
			w8 &= 67108863;
			lo = Math.imul(al9, bl0);
			mid = Math.imul(al9, bh0);
			mid = mid + Math.imul(ah9, bl0) | 0;
			hi = Math.imul(ah9, bh0);
			lo = lo + Math.imul(al8, bl1) | 0;
			mid = mid + Math.imul(al8, bh1) | 0;
			mid = mid + Math.imul(ah8, bl1) | 0;
			hi = hi + Math.imul(ah8, bh1) | 0;
			lo = lo + Math.imul(al7, bl2) | 0;
			mid = mid + Math.imul(al7, bh2) | 0;
			mid = mid + Math.imul(ah7, bl2) | 0;
			hi = hi + Math.imul(ah7, bh2) | 0;
			lo = lo + Math.imul(al6, bl3) | 0;
			mid = mid + Math.imul(al6, bh3) | 0;
			mid = mid + Math.imul(ah6, bl3) | 0;
			hi = hi + Math.imul(ah6, bh3) | 0;
			lo = lo + Math.imul(al5, bl4) | 0;
			mid = mid + Math.imul(al5, bh4) | 0;
			mid = mid + Math.imul(ah5, bl4) | 0;
			hi = hi + Math.imul(ah5, bh4) | 0;
			lo = lo + Math.imul(al4, bl5) | 0;
			mid = mid + Math.imul(al4, bh5) | 0;
			mid = mid + Math.imul(ah4, bl5) | 0;
			hi = hi + Math.imul(ah4, bh5) | 0;
			lo = lo + Math.imul(al3, bl6) | 0;
			mid = mid + Math.imul(al3, bh6) | 0;
			mid = mid + Math.imul(ah3, bl6) | 0;
			hi = hi + Math.imul(ah3, bh6) | 0;
			lo = lo + Math.imul(al2, bl7) | 0;
			mid = mid + Math.imul(al2, bh7) | 0;
			mid = mid + Math.imul(ah2, bl7) | 0;
			hi = hi + Math.imul(ah2, bh7) | 0;
			lo = lo + Math.imul(al1, bl8) | 0;
			mid = mid + Math.imul(al1, bh8) | 0;
			mid = mid + Math.imul(ah1, bl8) | 0;
			hi = hi + Math.imul(ah1, bh8) | 0;
			lo = lo + Math.imul(al0, bl9) | 0;
			mid = mid + Math.imul(al0, bh9) | 0;
			mid = mid + Math.imul(ah0, bl9) | 0;
			hi = hi + Math.imul(ah0, bh9) | 0;
			var w9 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
			c = (hi + (mid >>> 13) | 0) + (w9 >>> 26) | 0;
			w9 &= 67108863;
			lo = Math.imul(al9, bl1);
			mid = Math.imul(al9, bh1);
			mid = mid + Math.imul(ah9, bl1) | 0;
			hi = Math.imul(ah9, bh1);
			lo = lo + Math.imul(al8, bl2) | 0;
			mid = mid + Math.imul(al8, bh2) | 0;
			mid = mid + Math.imul(ah8, bl2) | 0;
			hi = hi + Math.imul(ah8, bh2) | 0;
			lo = lo + Math.imul(al7, bl3) | 0;
			mid = mid + Math.imul(al7, bh3) | 0;
			mid = mid + Math.imul(ah7, bl3) | 0;
			hi = hi + Math.imul(ah7, bh3) | 0;
			lo = lo + Math.imul(al6, bl4) | 0;
			mid = mid + Math.imul(al6, bh4) | 0;
			mid = mid + Math.imul(ah6, bl4) | 0;
			hi = hi + Math.imul(ah6, bh4) | 0;
			lo = lo + Math.imul(al5, bl5) | 0;
			mid = mid + Math.imul(al5, bh5) | 0;
			mid = mid + Math.imul(ah5, bl5) | 0;
			hi = hi + Math.imul(ah5, bh5) | 0;
			lo = lo + Math.imul(al4, bl6) | 0;
			mid = mid + Math.imul(al4, bh6) | 0;
			mid = mid + Math.imul(ah4, bl6) | 0;
			hi = hi + Math.imul(ah4, bh6) | 0;
			lo = lo + Math.imul(al3, bl7) | 0;
			mid = mid + Math.imul(al3, bh7) | 0;
			mid = mid + Math.imul(ah3, bl7) | 0;
			hi = hi + Math.imul(ah3, bh7) | 0;
			lo = lo + Math.imul(al2, bl8) | 0;
			mid = mid + Math.imul(al2, bh8) | 0;
			mid = mid + Math.imul(ah2, bl8) | 0;
			hi = hi + Math.imul(ah2, bh8) | 0;
			lo = lo + Math.imul(al1, bl9) | 0;
			mid = mid + Math.imul(al1, bh9) | 0;
			mid = mid + Math.imul(ah1, bl9) | 0;
			hi = hi + Math.imul(ah1, bh9) | 0;
			var w10 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
			c = (hi + (mid >>> 13) | 0) + (w10 >>> 26) | 0;
			w10 &= 67108863;
			lo = Math.imul(al9, bl2);
			mid = Math.imul(al9, bh2);
			mid = mid + Math.imul(ah9, bl2) | 0;
			hi = Math.imul(ah9, bh2);
			lo = lo + Math.imul(al8, bl3) | 0;
			mid = mid + Math.imul(al8, bh3) | 0;
			mid = mid + Math.imul(ah8, bl3) | 0;
			hi = hi + Math.imul(ah8, bh3) | 0;
			lo = lo + Math.imul(al7, bl4) | 0;
			mid = mid + Math.imul(al7, bh4) | 0;
			mid = mid + Math.imul(ah7, bl4) | 0;
			hi = hi + Math.imul(ah7, bh4) | 0;
			lo = lo + Math.imul(al6, bl5) | 0;
			mid = mid + Math.imul(al6, bh5) | 0;
			mid = mid + Math.imul(ah6, bl5) | 0;
			hi = hi + Math.imul(ah6, bh5) | 0;
			lo = lo + Math.imul(al5, bl6) | 0;
			mid = mid + Math.imul(al5, bh6) | 0;
			mid = mid + Math.imul(ah5, bl6) | 0;
			hi = hi + Math.imul(ah5, bh6) | 0;
			lo = lo + Math.imul(al4, bl7) | 0;
			mid = mid + Math.imul(al4, bh7) | 0;
			mid = mid + Math.imul(ah4, bl7) | 0;
			hi = hi + Math.imul(ah4, bh7) | 0;
			lo = lo + Math.imul(al3, bl8) | 0;
			mid = mid + Math.imul(al3, bh8) | 0;
			mid = mid + Math.imul(ah3, bl8) | 0;
			hi = hi + Math.imul(ah3, bh8) | 0;
			lo = lo + Math.imul(al2, bl9) | 0;
			mid = mid + Math.imul(al2, bh9) | 0;
			mid = mid + Math.imul(ah2, bl9) | 0;
			hi = hi + Math.imul(ah2, bh9) | 0;
			var w11 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
			c = (hi + (mid >>> 13) | 0) + (w11 >>> 26) | 0;
			w11 &= 67108863;
			lo = Math.imul(al9, bl3);
			mid = Math.imul(al9, bh3);
			mid = mid + Math.imul(ah9, bl3) | 0;
			hi = Math.imul(ah9, bh3);
			lo = lo + Math.imul(al8, bl4) | 0;
			mid = mid + Math.imul(al8, bh4) | 0;
			mid = mid + Math.imul(ah8, bl4) | 0;
			hi = hi + Math.imul(ah8, bh4) | 0;
			lo = lo + Math.imul(al7, bl5) | 0;
			mid = mid + Math.imul(al7, bh5) | 0;
			mid = mid + Math.imul(ah7, bl5) | 0;
			hi = hi + Math.imul(ah7, bh5) | 0;
			lo = lo + Math.imul(al6, bl6) | 0;
			mid = mid + Math.imul(al6, bh6) | 0;
			mid = mid + Math.imul(ah6, bl6) | 0;
			hi = hi + Math.imul(ah6, bh6) | 0;
			lo = lo + Math.imul(al5, bl7) | 0;
			mid = mid + Math.imul(al5, bh7) | 0;
			mid = mid + Math.imul(ah5, bl7) | 0;
			hi = hi + Math.imul(ah5, bh7) | 0;
			lo = lo + Math.imul(al4, bl8) | 0;
			mid = mid + Math.imul(al4, bh8) | 0;
			mid = mid + Math.imul(ah4, bl8) | 0;
			hi = hi + Math.imul(ah4, bh8) | 0;
			lo = lo + Math.imul(al3, bl9) | 0;
			mid = mid + Math.imul(al3, bh9) | 0;
			mid = mid + Math.imul(ah3, bl9) | 0;
			hi = hi + Math.imul(ah3, bh9) | 0;
			var w12 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
			c = (hi + (mid >>> 13) | 0) + (w12 >>> 26) | 0;
			w12 &= 67108863;
			lo = Math.imul(al9, bl4);
			mid = Math.imul(al9, bh4);
			mid = mid + Math.imul(ah9, bl4) | 0;
			hi = Math.imul(ah9, bh4);
			lo = lo + Math.imul(al8, bl5) | 0;
			mid = mid + Math.imul(al8, bh5) | 0;
			mid = mid + Math.imul(ah8, bl5) | 0;
			hi = hi + Math.imul(ah8, bh5) | 0;
			lo = lo + Math.imul(al7, bl6) | 0;
			mid = mid + Math.imul(al7, bh6) | 0;
			mid = mid + Math.imul(ah7, bl6) | 0;
			hi = hi + Math.imul(ah7, bh6) | 0;
			lo = lo + Math.imul(al6, bl7) | 0;
			mid = mid + Math.imul(al6, bh7) | 0;
			mid = mid + Math.imul(ah6, bl7) | 0;
			hi = hi + Math.imul(ah6, bh7) | 0;
			lo = lo + Math.imul(al5, bl8) | 0;
			mid = mid + Math.imul(al5, bh8) | 0;
			mid = mid + Math.imul(ah5, bl8) | 0;
			hi = hi + Math.imul(ah5, bh8) | 0;
			lo = lo + Math.imul(al4, bl9) | 0;
			mid = mid + Math.imul(al4, bh9) | 0;
			mid = mid + Math.imul(ah4, bl9) | 0;
			hi = hi + Math.imul(ah4, bh9) | 0;
			var w13 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
			c = (hi + (mid >>> 13) | 0) + (w13 >>> 26) | 0;
			w13 &= 67108863;
			lo = Math.imul(al9, bl5);
			mid = Math.imul(al9, bh5);
			mid = mid + Math.imul(ah9, bl5) | 0;
			hi = Math.imul(ah9, bh5);
			lo = lo + Math.imul(al8, bl6) | 0;
			mid = mid + Math.imul(al8, bh6) | 0;
			mid = mid + Math.imul(ah8, bl6) | 0;
			hi = hi + Math.imul(ah8, bh6) | 0;
			lo = lo + Math.imul(al7, bl7) | 0;
			mid = mid + Math.imul(al7, bh7) | 0;
			mid = mid + Math.imul(ah7, bl7) | 0;
			hi = hi + Math.imul(ah7, bh7) | 0;
			lo = lo + Math.imul(al6, bl8) | 0;
			mid = mid + Math.imul(al6, bh8) | 0;
			mid = mid + Math.imul(ah6, bl8) | 0;
			hi = hi + Math.imul(ah6, bh8) | 0;
			lo = lo + Math.imul(al5, bl9) | 0;
			mid = mid + Math.imul(al5, bh9) | 0;
			mid = mid + Math.imul(ah5, bl9) | 0;
			hi = hi + Math.imul(ah5, bh9) | 0;
			var w14 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
			c = (hi + (mid >>> 13) | 0) + (w14 >>> 26) | 0;
			w14 &= 67108863;
			lo = Math.imul(al9, bl6);
			mid = Math.imul(al9, bh6);
			mid = mid + Math.imul(ah9, bl6) | 0;
			hi = Math.imul(ah9, bh6);
			lo = lo + Math.imul(al8, bl7) | 0;
			mid = mid + Math.imul(al8, bh7) | 0;
			mid = mid + Math.imul(ah8, bl7) | 0;
			hi = hi + Math.imul(ah8, bh7) | 0;
			lo = lo + Math.imul(al7, bl8) | 0;
			mid = mid + Math.imul(al7, bh8) | 0;
			mid = mid + Math.imul(ah7, bl8) | 0;
			hi = hi + Math.imul(ah7, bh8) | 0;
			lo = lo + Math.imul(al6, bl9) | 0;
			mid = mid + Math.imul(al6, bh9) | 0;
			mid = mid + Math.imul(ah6, bl9) | 0;
			hi = hi + Math.imul(ah6, bh9) | 0;
			var w15 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
			c = (hi + (mid >>> 13) | 0) + (w15 >>> 26) | 0;
			w15 &= 67108863;
			lo = Math.imul(al9, bl7);
			mid = Math.imul(al9, bh7);
			mid = mid + Math.imul(ah9, bl7) | 0;
			hi = Math.imul(ah9, bh7);
			lo = lo + Math.imul(al8, bl8) | 0;
			mid = mid + Math.imul(al8, bh8) | 0;
			mid = mid + Math.imul(ah8, bl8) | 0;
			hi = hi + Math.imul(ah8, bh8) | 0;
			lo = lo + Math.imul(al7, bl9) | 0;
			mid = mid + Math.imul(al7, bh9) | 0;
			mid = mid + Math.imul(ah7, bl9) | 0;
			hi = hi + Math.imul(ah7, bh9) | 0;
			var w16 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
			c = (hi + (mid >>> 13) | 0) + (w16 >>> 26) | 0;
			w16 &= 67108863;
			lo = Math.imul(al9, bl8);
			mid = Math.imul(al9, bh8);
			mid = mid + Math.imul(ah9, bl8) | 0;
			hi = Math.imul(ah9, bh8);
			lo = lo + Math.imul(al8, bl9) | 0;
			mid = mid + Math.imul(al8, bh9) | 0;
			mid = mid + Math.imul(ah8, bl9) | 0;
			hi = hi + Math.imul(ah8, bh9) | 0;
			var w17 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
			c = (hi + (mid >>> 13) | 0) + (w17 >>> 26) | 0;
			w17 &= 67108863;
			lo = Math.imul(al9, bl9);
			mid = Math.imul(al9, bh9);
			mid = mid + Math.imul(ah9, bl9) | 0;
			hi = Math.imul(ah9, bh9);
			var w18 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
			c = (hi + (mid >>> 13) | 0) + (w18 >>> 26) | 0;
			w18 &= 67108863;
			o[0] = w0;
			o[1] = w1;
			o[2] = w2;
			o[3] = w3;
			o[4] = w4;
			o[5] = w5;
			o[6] = w6;
			o[7] = w7;
			o[8] = w8;
			o[9] = w9;
			o[10] = w10;
			o[11] = w11;
			o[12] = w12;
			o[13] = w13;
			o[14] = w14;
			o[15] = w15;
			o[16] = w16;
			o[17] = w17;
			o[18] = w18;
			if (c !== 0) {
				o[19] = c;
				out.length++;
			}
			return out;
		};
		if (!Math.imul) comb10MulTo = smallMulTo;
		function bigMulTo(self, num, out) {
			out.negative = num.negative ^ self.negative;
			out.length = self.length + num.length;
			var carry = 0;
			var hncarry = 0;
			for (var k = 0; k < out.length - 1; k++) {
				var ncarry = hncarry;
				hncarry = 0;
				var rword = carry & 67108863;
				var maxJ = Math.min(k, num.length - 1);
				for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
					var i = k - j;
					var r = (self.words[i] | 0) * (num.words[j] | 0);
					var lo = r & 67108863;
					ncarry = ncarry + (r / 67108864 | 0) | 0;
					lo = lo + rword | 0;
					rword = lo & 67108863;
					ncarry = ncarry + (lo >>> 26) | 0;
					hncarry += ncarry >>> 26;
					ncarry &= 67108863;
				}
				out.words[k] = rword;
				carry = ncarry;
				ncarry = hncarry;
			}
			if (carry !== 0) out.words[k] = carry;
			else out.length--;
			return out.strip();
		}
		function jumboMulTo(self, num, out) {
			return new FFTM().mulp(self, num, out);
		}
		BN.prototype.mulTo = function mulTo(num, out) {
			var res;
			var len = this.length + num.length;
			if (this.length === 10 && num.length === 10) res = comb10MulTo(this, num, out);
			else if (len < 63) res = smallMulTo(this, num, out);
			else if (len < 1024) res = bigMulTo(this, num, out);
			else res = jumboMulTo(this, num, out);
			return res;
		};
		function FFTM(x, y) {
			this.x = x;
			this.y = y;
		}
		FFTM.prototype.makeRBT = function makeRBT(N) {
			var t = new Array(N);
			var l = BN.prototype._countBits(N) - 1;
			for (var i = 0; i < N; i++) t[i] = this.revBin(i, l, N);
			return t;
		};
		FFTM.prototype.revBin = function revBin(x, l, N) {
			if (x === 0 || x === N - 1) return x;
			var rb = 0;
			for (var i = 0; i < l; i++) {
				rb |= (x & 1) << l - i - 1;
				x >>= 1;
			}
			return rb;
		};
		FFTM.prototype.permute = function permute(rbt, rws, iws, rtws, itws, N) {
			for (var i = 0; i < N; i++) {
				rtws[i] = rws[rbt[i]];
				itws[i] = iws[rbt[i]];
			}
		};
		FFTM.prototype.transform = function transform(rws, iws, rtws, itws, N, rbt) {
			this.permute(rbt, rws, iws, rtws, itws, N);
			for (var s = 1; s < N; s <<= 1) {
				var l = s << 1;
				var rtwdf = Math.cos(2 * Math.PI / l);
				var itwdf = Math.sin(2 * Math.PI / l);
				for (var p = 0; p < N; p += l) {
					var rtwdf_ = rtwdf;
					var itwdf_ = itwdf;
					for (var j = 0; j < s; j++) {
						var re = rtws[p + j];
						var ie = itws[p + j];
						var ro = rtws[p + j + s];
						var io = itws[p + j + s];
						var rx = rtwdf_ * ro - itwdf_ * io;
						io = rtwdf_ * io + itwdf_ * ro;
						ro = rx;
						rtws[p + j] = re + ro;
						itws[p + j] = ie + io;
						rtws[p + j + s] = re - ro;
						itws[p + j + s] = ie - io;
						if (j !== l) {
							rx = rtwdf * rtwdf_ - itwdf * itwdf_;
							itwdf_ = rtwdf * itwdf_ + itwdf * rtwdf_;
							rtwdf_ = rx;
						}
					}
				}
			}
		};
		FFTM.prototype.guessLen13b = function guessLen13b(n, m) {
			var N = Math.max(m, n) | 1;
			var odd = N & 1;
			var i = 0;
			for (N = N / 2 | 0; N; N = N >>> 1) i++;
			return 1 << i + 1 + odd;
		};
		FFTM.prototype.conjugate = function conjugate(rws, iws, N) {
			if (N <= 1) return;
			for (var i = 0; i < N / 2; i++) {
				var t = rws[i];
				rws[i] = rws[N - i - 1];
				rws[N - i - 1] = t;
				t = iws[i];
				iws[i] = -iws[N - i - 1];
				iws[N - i - 1] = -t;
			}
		};
		FFTM.prototype.normalize13b = function normalize13b(ws, N) {
			var carry = 0;
			for (var i = 0; i < N / 2; i++) {
				var w = Math.round(ws[2 * i + 1] / N) * 8192 + Math.round(ws[2 * i] / N) + carry;
				ws[i] = w & 67108863;
				if (w < 67108864) carry = 0;
				else carry = w / 67108864 | 0;
			}
			return ws;
		};
		FFTM.prototype.convert13b = function convert13b(ws, len, rws, N) {
			var carry = 0;
			for (var i = 0; i < len; i++) {
				carry = carry + (ws[i] | 0);
				rws[2 * i] = carry & 8191;
				carry = carry >>> 13;
				rws[2 * i + 1] = carry & 8191;
				carry = carry >>> 13;
			}
			for (i = 2 * len; i < N; ++i) rws[i] = 0;
			assert(carry === 0);
			assert((carry & -8192) === 0);
		};
		FFTM.prototype.stub = function stub(N) {
			var ph = new Array(N);
			for (var i = 0; i < N; i++) ph[i] = 0;
			return ph;
		};
		FFTM.prototype.mulp = function mulp(x, y, out) {
			var N = 2 * this.guessLen13b(x.length, y.length);
			var rbt = this.makeRBT(N);
			var _ = this.stub(N);
			var rws = new Array(N);
			var rwst = new Array(N);
			var iwst = new Array(N);
			var nrws = new Array(N);
			var nrwst = new Array(N);
			var niwst = new Array(N);
			var rmws = out.words;
			rmws.length = N;
			this.convert13b(x.words, x.length, rws, N);
			this.convert13b(y.words, y.length, nrws, N);
			this.transform(rws, _, rwst, iwst, N, rbt);
			this.transform(nrws, _, nrwst, niwst, N, rbt);
			for (var i = 0; i < N; i++) {
				var rx = rwst[i] * nrwst[i] - iwst[i] * niwst[i];
				iwst[i] = rwst[i] * niwst[i] + iwst[i] * nrwst[i];
				rwst[i] = rx;
			}
			this.conjugate(rwst, iwst, N);
			this.transform(rwst, iwst, rmws, _, N, rbt);
			this.conjugate(rmws, _, N);
			this.normalize13b(rmws, N);
			out.negative = x.negative ^ y.negative;
			out.length = x.length + y.length;
			return out.strip();
		};
		BN.prototype.mul = function mul(num) {
			var out = new BN(null);
			out.words = new Array(this.length + num.length);
			return this.mulTo(num, out);
		};
		BN.prototype.mulf = function mulf(num) {
			var out = new BN(null);
			out.words = new Array(this.length + num.length);
			return jumboMulTo(this, num, out);
		};
		BN.prototype.imul = function imul(num) {
			return this.clone().mulTo(num, this);
		};
		BN.prototype.imuln = function imuln(num) {
			assert(typeof num === "number");
			assert(num < 67108864);
			var carry = 0;
			for (var i = 0; i < this.length; i++) {
				var w = (this.words[i] | 0) * num;
				var lo = (w & 67108863) + (carry & 67108863);
				carry >>= 26;
				carry += w / 67108864 | 0;
				carry += lo >>> 26;
				this.words[i] = lo & 67108863;
			}
			if (carry !== 0) {
				this.words[i] = carry;
				this.length++;
			}
			return this;
		};
		BN.prototype.muln = function muln(num) {
			return this.clone().imuln(num);
		};
		BN.prototype.sqr = function sqr() {
			return this.mul(this);
		};
		BN.prototype.isqr = function isqr() {
			return this.imul(this.clone());
		};
		BN.prototype.pow = function pow(num) {
			var w = toBitArray(num);
			if (w.length === 0) return new BN(1);
			var res = this;
			for (var i = 0; i < w.length; i++, res = res.sqr()) if (w[i] !== 0) break;
			if (++i < w.length) for (var q = res.sqr(); i < w.length; i++, q = q.sqr()) {
				if (w[i] === 0) continue;
				res = res.mul(q);
			}
			return res;
		};
		BN.prototype.iushln = function iushln(bits) {
			assert(typeof bits === "number" && bits >= 0);
			var r = bits % 26;
			var s = (bits - r) / 26;
			var carryMask = 67108863 >>> 26 - r << 26 - r;
			var i;
			if (r !== 0) {
				var carry = 0;
				for (i = 0; i < this.length; i++) {
					var newCarry = this.words[i] & carryMask;
					var c = (this.words[i] | 0) - newCarry << r;
					this.words[i] = c | carry;
					carry = newCarry >>> 26 - r;
				}
				if (carry) {
					this.words[i] = carry;
					this.length++;
				}
			}
			if (s !== 0) {
				for (i = this.length - 1; i >= 0; i--) this.words[i + s] = this.words[i];
				for (i = 0; i < s; i++) this.words[i] = 0;
				this.length += s;
			}
			return this.strip();
		};
		BN.prototype.ishln = function ishln(bits) {
			assert(this.negative === 0);
			return this.iushln(bits);
		};
		BN.prototype.iushrn = function iushrn(bits, hint, extended) {
			assert(typeof bits === "number" && bits >= 0);
			var h;
			if (hint) h = (hint - hint % 26) / 26;
			else h = 0;
			var r = bits % 26;
			var s = Math.min((bits - r) / 26, this.length);
			var mask = 67108863 ^ 67108863 >>> r << r;
			var maskedWords = extended;
			h -= s;
			h = Math.max(0, h);
			if (maskedWords) {
				for (var i = 0; i < s; i++) maskedWords.words[i] = this.words[i];
				maskedWords.length = s;
			}
			if (s === 0) {} else if (this.length > s) {
				this.length -= s;
				for (i = 0; i < this.length; i++) this.words[i] = this.words[i + s];
			} else {
				this.words[0] = 0;
				this.length = 1;
			}
			var carry = 0;
			for (i = this.length - 1; i >= 0 && (carry !== 0 || i >= h); i--) {
				var word = this.words[i] | 0;
				this.words[i] = carry << 26 - r | word >>> r;
				carry = word & mask;
			}
			if (maskedWords && carry !== 0) maskedWords.words[maskedWords.length++] = carry;
			if (this.length === 0) {
				this.words[0] = 0;
				this.length = 1;
			}
			return this.strip();
		};
		BN.prototype.ishrn = function ishrn(bits, hint, extended) {
			assert(this.negative === 0);
			return this.iushrn(bits, hint, extended);
		};
		BN.prototype.shln = function shln(bits) {
			return this.clone().ishln(bits);
		};
		BN.prototype.ushln = function ushln(bits) {
			return this.clone().iushln(bits);
		};
		BN.prototype.shrn = function shrn(bits) {
			return this.clone().ishrn(bits);
		};
		BN.prototype.ushrn = function ushrn(bits) {
			return this.clone().iushrn(bits);
		};
		BN.prototype.testn = function testn(bit) {
			assert(typeof bit === "number" && bit >= 0);
			var r = bit % 26;
			var s = (bit - r) / 26;
			var q = 1 << r;
			if (this.length <= s) return false;
			return !!(this.words[s] & q);
		};
		BN.prototype.imaskn = function imaskn(bits) {
			assert(typeof bits === "number" && bits >= 0);
			var r = bits % 26;
			var s = (bits - r) / 26;
			assert(this.negative === 0, "imaskn works only with positive numbers");
			if (this.length <= s) return this;
			if (r !== 0) s++;
			this.length = Math.min(s, this.length);
			if (r !== 0) {
				var mask = 67108863 ^ 67108863 >>> r << r;
				this.words[this.length - 1] &= mask;
			}
			return this.strip();
		};
		BN.prototype.maskn = function maskn(bits) {
			return this.clone().imaskn(bits);
		};
		BN.prototype.iaddn = function iaddn(num) {
			assert(typeof num === "number");
			assert(num < 67108864);
			if (num < 0) return this.isubn(-num);
			if (this.negative !== 0) {
				if (this.length === 1 && (this.words[0] | 0) < num) {
					this.words[0] = num - (this.words[0] | 0);
					this.negative = 0;
					return this;
				}
				this.negative = 0;
				this.isubn(num);
				this.negative = 1;
				return this;
			}
			return this._iaddn(num);
		};
		BN.prototype._iaddn = function _iaddn(num) {
			this.words[0] += num;
			for (var i = 0; i < this.length && this.words[i] >= 67108864; i++) {
				this.words[i] -= 67108864;
				if (i === this.length - 1) this.words[i + 1] = 1;
				else this.words[i + 1]++;
			}
			this.length = Math.max(this.length, i + 1);
			return this;
		};
		BN.prototype.isubn = function isubn(num) {
			assert(typeof num === "number");
			assert(num < 67108864);
			if (num < 0) return this.iaddn(-num);
			if (this.negative !== 0) {
				this.negative = 0;
				this.iaddn(num);
				this.negative = 1;
				return this;
			}
			this.words[0] -= num;
			if (this.length === 1 && this.words[0] < 0) {
				this.words[0] = -this.words[0];
				this.negative = 1;
			} else for (var i = 0; i < this.length && this.words[i] < 0; i++) {
				this.words[i] += 67108864;
				this.words[i + 1] -= 1;
			}
			return this.strip();
		};
		BN.prototype.addn = function addn(num) {
			return this.clone().iaddn(num);
		};
		BN.prototype.subn = function subn(num) {
			return this.clone().isubn(num);
		};
		BN.prototype.iabs = function iabs() {
			this.negative = 0;
			return this;
		};
		BN.prototype.abs = function abs() {
			return this.clone().iabs();
		};
		BN.prototype._ishlnsubmul = function _ishlnsubmul(num, mul, shift) {
			var len = num.length + shift;
			var i;
			this._expand(len);
			var w;
			var carry = 0;
			for (i = 0; i < num.length; i++) {
				w = (this.words[i + shift] | 0) + carry;
				var right = (num.words[i] | 0) * mul;
				w -= right & 67108863;
				carry = (w >> 26) - (right / 67108864 | 0);
				this.words[i + shift] = w & 67108863;
			}
			for (; i < this.length - shift; i++) {
				w = (this.words[i + shift] | 0) + carry;
				carry = w >> 26;
				this.words[i + shift] = w & 67108863;
			}
			if (carry === 0) return this.strip();
			assert(carry === -1);
			carry = 0;
			for (i = 0; i < this.length; i++) {
				w = -(this.words[i] | 0) + carry;
				carry = w >> 26;
				this.words[i] = w & 67108863;
			}
			this.negative = 1;
			return this.strip();
		};
		BN.prototype._wordDiv = function _wordDiv(num, mode) {
			var shift = this.length - num.length;
			var a = this.clone();
			var b = num;
			var bhi = b.words[b.length - 1] | 0;
			shift = 26 - this._countBits(bhi);
			if (shift !== 0) {
				b = b.ushln(shift);
				a.iushln(shift);
				bhi = b.words[b.length - 1] | 0;
			}
			var m = a.length - b.length;
			var q;
			if (mode !== "mod") {
				q = new BN(null);
				q.length = m + 1;
				q.words = new Array(q.length);
				for (var i = 0; i < q.length; i++) q.words[i] = 0;
			}
			var diff = a.clone()._ishlnsubmul(b, 1, m);
			if (diff.negative === 0) {
				a = diff;
				if (q) q.words[m] = 1;
			}
			for (var j = m - 1; j >= 0; j--) {
				var qj = (a.words[b.length + j] | 0) * 67108864 + (a.words[b.length + j - 1] | 0);
				qj = Math.min(qj / bhi | 0, 67108863);
				a._ishlnsubmul(b, qj, j);
				while (a.negative !== 0) {
					qj--;
					a.negative = 0;
					a._ishlnsubmul(b, 1, j);
					if (!a.isZero()) a.negative ^= 1;
				}
				if (q) q.words[j] = qj;
			}
			if (q) q.strip();
			a.strip();
			if (mode !== "div" && shift !== 0) a.iushrn(shift);
			return {
				div: q || null,
				mod: a
			};
		};
		BN.prototype.divmod = function divmod(num, mode, positive) {
			assert(!num.isZero());
			if (this.isZero()) return {
				div: new BN(0),
				mod: new BN(0)
			};
			var div, mod, res;
			if (this.negative !== 0 && num.negative === 0) {
				res = this.neg().divmod(num, mode);
				if (mode !== "mod") div = res.div.neg();
				if (mode !== "div") {
					mod = res.mod.neg();
					if (positive && mod.negative !== 0) mod.iadd(num);
				}
				return {
					div,
					mod
				};
			}
			if (this.negative === 0 && num.negative !== 0) {
				res = this.divmod(num.neg(), mode);
				if (mode !== "mod") div = res.div.neg();
				return {
					div,
					mod: res.mod
				};
			}
			if ((this.negative & num.negative) !== 0) {
				res = this.neg().divmod(num.neg(), mode);
				if (mode !== "div") {
					mod = res.mod.neg();
					if (positive && mod.negative !== 0) mod.isub(num);
				}
				return {
					div: res.div,
					mod
				};
			}
			if (num.length > this.length || this.cmp(num) < 0) return {
				div: new BN(0),
				mod: this
			};
			if (num.length === 1) {
				if (mode === "div") return {
					div: this.divn(num.words[0]),
					mod: null
				};
				if (mode === "mod") return {
					div: null,
					mod: new BN(this.modn(num.words[0]))
				};
				return {
					div: this.divn(num.words[0]),
					mod: new BN(this.modn(num.words[0]))
				};
			}
			return this._wordDiv(num, mode);
		};
		BN.prototype.div = function div(num) {
			return this.divmod(num, "div", false).div;
		};
		BN.prototype.mod = function mod(num) {
			return this.divmod(num, "mod", false).mod;
		};
		BN.prototype.umod = function umod(num) {
			return this.divmod(num, "mod", true).mod;
		};
		BN.prototype.divRound = function divRound(num) {
			var dm = this.divmod(num);
			if (dm.mod.isZero()) return dm.div;
			var mod = dm.div.negative !== 0 ? dm.mod.isub(num) : dm.mod;
			var half = num.ushrn(1);
			var r2 = num.andln(1);
			var cmp = mod.cmp(half);
			if (cmp < 0 || r2 === 1 && cmp === 0) return dm.div;
			return dm.div.negative !== 0 ? dm.div.isubn(1) : dm.div.iaddn(1);
		};
		BN.prototype.modn = function modn(num) {
			assert(num <= 67108863);
			var p = (1 << 26) % num;
			var acc = 0;
			for (var i = this.length - 1; i >= 0; i--) acc = (p * acc + (this.words[i] | 0)) % num;
			return acc;
		};
		BN.prototype.idivn = function idivn(num) {
			assert(num <= 67108863);
			var carry = 0;
			for (var i = this.length - 1; i >= 0; i--) {
				var w = (this.words[i] | 0) + carry * 67108864;
				this.words[i] = w / num | 0;
				carry = w % num;
			}
			return this.strip();
		};
		BN.prototype.divn = function divn(num) {
			return this.clone().idivn(num);
		};
		BN.prototype.egcd = function egcd(p) {
			assert(p.negative === 0);
			assert(!p.isZero());
			var x = this;
			var y = p.clone();
			if (x.negative !== 0) x = x.umod(p);
			else x = x.clone();
			var A = new BN(1);
			var B = new BN(0);
			var C = new BN(0);
			var D = new BN(1);
			var g = 0;
			while (x.isEven() && y.isEven()) {
				x.iushrn(1);
				y.iushrn(1);
				++g;
			}
			var yp = y.clone();
			var xp = x.clone();
			while (!x.isZero()) {
				for (var i = 0, im = 1; (x.words[0] & im) === 0 && i < 26; ++i, im <<= 1);
				if (i > 0) {
					x.iushrn(i);
					while (i-- > 0) {
						if (A.isOdd() || B.isOdd()) {
							A.iadd(yp);
							B.isub(xp);
						}
						A.iushrn(1);
						B.iushrn(1);
					}
				}
				for (var j = 0, jm = 1; (y.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);
				if (j > 0) {
					y.iushrn(j);
					while (j-- > 0) {
						if (C.isOdd() || D.isOdd()) {
							C.iadd(yp);
							D.isub(xp);
						}
						C.iushrn(1);
						D.iushrn(1);
					}
				}
				if (x.cmp(y) >= 0) {
					x.isub(y);
					A.isub(C);
					B.isub(D);
				} else {
					y.isub(x);
					C.isub(A);
					D.isub(B);
				}
			}
			return {
				a: C,
				b: D,
				gcd: y.iushln(g)
			};
		};
		BN.prototype._invmp = function _invmp(p) {
			assert(p.negative === 0);
			assert(!p.isZero());
			var a = this;
			var b = p.clone();
			if (a.negative !== 0) a = a.umod(p);
			else a = a.clone();
			var x1 = new BN(1);
			var x2 = new BN(0);
			var delta = b.clone();
			while (a.cmpn(1) > 0 && b.cmpn(1) > 0) {
				for (var i = 0, im = 1; (a.words[0] & im) === 0 && i < 26; ++i, im <<= 1);
				if (i > 0) {
					a.iushrn(i);
					while (i-- > 0) {
						if (x1.isOdd()) x1.iadd(delta);
						x1.iushrn(1);
					}
				}
				for (var j = 0, jm = 1; (b.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);
				if (j > 0) {
					b.iushrn(j);
					while (j-- > 0) {
						if (x2.isOdd()) x2.iadd(delta);
						x2.iushrn(1);
					}
				}
				if (a.cmp(b) >= 0) {
					a.isub(b);
					x1.isub(x2);
				} else {
					b.isub(a);
					x2.isub(x1);
				}
			}
			var res;
			if (a.cmpn(1) === 0) res = x1;
			else res = x2;
			if (res.cmpn(0) < 0) res.iadd(p);
			return res;
		};
		BN.prototype.gcd = function gcd(num) {
			if (this.isZero()) return num.abs();
			if (num.isZero()) return this.abs();
			var a = this.clone();
			var b = num.clone();
			a.negative = 0;
			b.negative = 0;
			for (var shift = 0; a.isEven() && b.isEven(); shift++) {
				a.iushrn(1);
				b.iushrn(1);
			}
			do {
				while (a.isEven()) a.iushrn(1);
				while (b.isEven()) b.iushrn(1);
				var r = a.cmp(b);
				if (r < 0) {
					var t = a;
					a = b;
					b = t;
				} else if (r === 0 || b.cmpn(1) === 0) break;
				a.isub(b);
			} while (true);
			return b.iushln(shift);
		};
		BN.prototype.invm = function invm(num) {
			return this.egcd(num).a.umod(num);
		};
		BN.prototype.isEven = function isEven() {
			return (this.words[0] & 1) === 0;
		};
		BN.prototype.isOdd = function isOdd() {
			return (this.words[0] & 1) === 1;
		};
		BN.prototype.andln = function andln(num) {
			return this.words[0] & num;
		};
		BN.prototype.bincn = function bincn(bit) {
			assert(typeof bit === "number");
			var r = bit % 26;
			var s = (bit - r) / 26;
			var q = 1 << r;
			if (this.length <= s) {
				this._expand(s + 1);
				this.words[s] |= q;
				return this;
			}
			var carry = q;
			for (var i = s; carry !== 0 && i < this.length; i++) {
				var w = this.words[i] | 0;
				w += carry;
				carry = w >>> 26;
				w &= 67108863;
				this.words[i] = w;
			}
			if (carry !== 0) {
				this.words[i] = carry;
				this.length++;
			}
			return this;
		};
		BN.prototype.isZero = function isZero() {
			return this.length === 1 && this.words[0] === 0;
		};
		BN.prototype.cmpn = function cmpn(num) {
			var negative = num < 0;
			if (this.negative !== 0 && !negative) return -1;
			if (this.negative === 0 && negative) return 1;
			this.strip();
			var res;
			if (this.length > 1) res = 1;
			else {
				if (negative) num = -num;
				assert(num <= 67108863, "Number is too big");
				var w = this.words[0] | 0;
				res = w === num ? 0 : w < num ? -1 : 1;
			}
			if (this.negative !== 0) return -res | 0;
			return res;
		};
		BN.prototype.cmp = function cmp(num) {
			if (this.negative !== 0 && num.negative === 0) return -1;
			if (this.negative === 0 && num.negative !== 0) return 1;
			var res = this.ucmp(num);
			if (this.negative !== 0) return -res | 0;
			return res;
		};
		BN.prototype.ucmp = function ucmp(num) {
			if (this.length > num.length) return 1;
			if (this.length < num.length) return -1;
			var res = 0;
			for (var i = this.length - 1; i >= 0; i--) {
				var a = this.words[i] | 0;
				var b = num.words[i] | 0;
				if (a === b) continue;
				if (a < b) res = -1;
				else if (a > b) res = 1;
				break;
			}
			return res;
		};
		BN.prototype.gtn = function gtn(num) {
			return this.cmpn(num) === 1;
		};
		BN.prototype.gt = function gt(num) {
			return this.cmp(num) === 1;
		};
		BN.prototype.gten = function gten(num) {
			return this.cmpn(num) >= 0;
		};
		BN.prototype.gte = function gte(num) {
			return this.cmp(num) >= 0;
		};
		BN.prototype.ltn = function ltn(num) {
			return this.cmpn(num) === -1;
		};
		BN.prototype.lt = function lt(num) {
			return this.cmp(num) === -1;
		};
		BN.prototype.lten = function lten(num) {
			return this.cmpn(num) <= 0;
		};
		BN.prototype.lte = function lte(num) {
			return this.cmp(num) <= 0;
		};
		BN.prototype.eqn = function eqn(num) {
			return this.cmpn(num) === 0;
		};
		BN.prototype.eq = function eq(num) {
			return this.cmp(num) === 0;
		};
		BN.red = function red(num) {
			return new Red(num);
		};
		BN.prototype.toRed = function toRed(ctx) {
			assert(!this.red, "Already a number in reduction context");
			assert(this.negative === 0, "red works only with positives");
			return ctx.convertTo(this)._forceRed(ctx);
		};
		BN.prototype.fromRed = function fromRed() {
			assert(this.red, "fromRed works only with numbers in reduction context");
			return this.red.convertFrom(this);
		};
		BN.prototype._forceRed = function _forceRed(ctx) {
			this.red = ctx;
			return this;
		};
		BN.prototype.forceRed = function forceRed(ctx) {
			assert(!this.red, "Already a number in reduction context");
			return this._forceRed(ctx);
		};
		BN.prototype.redAdd = function redAdd(num) {
			assert(this.red, "redAdd works only with red numbers");
			return this.red.add(this, num);
		};
		BN.prototype.redIAdd = function redIAdd(num) {
			assert(this.red, "redIAdd works only with red numbers");
			return this.red.iadd(this, num);
		};
		BN.prototype.redSub = function redSub(num) {
			assert(this.red, "redSub works only with red numbers");
			return this.red.sub(this, num);
		};
		BN.prototype.redISub = function redISub(num) {
			assert(this.red, "redISub works only with red numbers");
			return this.red.isub(this, num);
		};
		BN.prototype.redShl = function redShl(num) {
			assert(this.red, "redShl works only with red numbers");
			return this.red.shl(this, num);
		};
		BN.prototype.redMul = function redMul(num) {
			assert(this.red, "redMul works only with red numbers");
			this.red._verify2(this, num);
			return this.red.mul(this, num);
		};
		BN.prototype.redIMul = function redIMul(num) {
			assert(this.red, "redMul works only with red numbers");
			this.red._verify2(this, num);
			return this.red.imul(this, num);
		};
		BN.prototype.redSqr = function redSqr() {
			assert(this.red, "redSqr works only with red numbers");
			this.red._verify1(this);
			return this.red.sqr(this);
		};
		BN.prototype.redISqr = function redISqr() {
			assert(this.red, "redISqr works only with red numbers");
			this.red._verify1(this);
			return this.red.isqr(this);
		};
		BN.prototype.redSqrt = function redSqrt() {
			assert(this.red, "redSqrt works only with red numbers");
			this.red._verify1(this);
			return this.red.sqrt(this);
		};
		BN.prototype.redInvm = function redInvm() {
			assert(this.red, "redInvm works only with red numbers");
			this.red._verify1(this);
			return this.red.invm(this);
		};
		BN.prototype.redNeg = function redNeg() {
			assert(this.red, "redNeg works only with red numbers");
			this.red._verify1(this);
			return this.red.neg(this);
		};
		BN.prototype.redPow = function redPow(num) {
			assert(this.red && !num.red, "redPow(normalNum)");
			this.red._verify1(this);
			return this.red.pow(this, num);
		};
		var primes = {
			k256: null,
			p224: null,
			p192: null,
			p25519: null
		};
		function MPrime(name, p) {
			this.name = name;
			this.p = new BN(p, 16);
			this.n = this.p.bitLength();
			this.k = new BN(1).iushln(this.n).isub(this.p);
			this.tmp = this._tmp();
		}
		MPrime.prototype._tmp = function _tmp() {
			var tmp = new BN(null);
			tmp.words = new Array(Math.ceil(this.n / 13));
			return tmp;
		};
		MPrime.prototype.ireduce = function ireduce(num) {
			var r = num;
			var rlen;
			do {
				this.split(r, this.tmp);
				r = this.imulK(r);
				r = r.iadd(this.tmp);
				rlen = r.bitLength();
			} while (rlen > this.n);
			var cmp = rlen < this.n ? -1 : r.ucmp(this.p);
			if (cmp === 0) {
				r.words[0] = 0;
				r.length = 1;
			} else if (cmp > 0) r.isub(this.p);
			else r.strip();
			return r;
		};
		MPrime.prototype.split = function split(input, out) {
			input.iushrn(this.n, 0, out);
		};
		MPrime.prototype.imulK = function imulK(num) {
			return num.imul(this.k);
		};
		function K256() {
			MPrime.call(this, "k256", "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f");
		}
		inherits(K256, MPrime);
		K256.prototype.split = function split(input, output) {
			var mask = 4194303;
			var outLen = Math.min(input.length, 9);
			for (var i = 0; i < outLen; i++) output.words[i] = input.words[i];
			output.length = outLen;
			if (input.length <= 9) {
				input.words[0] = 0;
				input.length = 1;
				return;
			}
			var prev = input.words[9];
			output.words[output.length++] = prev & mask;
			for (i = 10; i < input.length; i++) {
				var next = input.words[i] | 0;
				input.words[i - 10] = (next & mask) << 4 | prev >>> 22;
				prev = next;
			}
			prev >>>= 22;
			input.words[i - 10] = prev;
			if (prev === 0 && input.length > 10) input.length -= 10;
			else input.length -= 9;
		};
		K256.prototype.imulK = function imulK(num) {
			num.words[num.length] = 0;
			num.words[num.length + 1] = 0;
			num.length += 2;
			var lo = 0;
			for (var i = 0; i < num.length; i++) {
				var w = num.words[i] | 0;
				lo += w * 977;
				num.words[i] = lo & 67108863;
				lo = w * 64 + (lo / 67108864 | 0);
			}
			if (num.words[num.length - 1] === 0) {
				num.length--;
				if (num.words[num.length - 1] === 0) num.length--;
			}
			return num;
		};
		function P224() {
			MPrime.call(this, "p224", "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001");
		}
		inherits(P224, MPrime);
		function P192() {
			MPrime.call(this, "p192", "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff");
		}
		inherits(P192, MPrime);
		function P25519() {
			MPrime.call(this, "25519", "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed");
		}
		inherits(P25519, MPrime);
		P25519.prototype.imulK = function imulK(num) {
			var carry = 0;
			for (var i = 0; i < num.length; i++) {
				var hi = (num.words[i] | 0) * 19 + carry;
				var lo = hi & 67108863;
				hi >>>= 26;
				num.words[i] = lo;
				carry = hi;
			}
			if (carry !== 0) num.words[num.length++] = carry;
			return num;
		};
		BN._prime = function prime(name) {
			if (primes[name]) return primes[name];
			var prime;
			if (name === "k256") prime = new K256();
			else if (name === "p224") prime = new P224();
			else if (name === "p192") prime = new P192();
			else if (name === "p25519") prime = new P25519();
			else throw new Error("Unknown prime " + name);
			primes[name] = prime;
			return prime;
		};
		function Red(m) {
			if (typeof m === "string") {
				var prime = BN._prime(m);
				this.m = prime.p;
				this.prime = prime;
			} else {
				assert(m.gtn(1), "modulus must be greater than 1");
				this.m = m;
				this.prime = null;
			}
		}
		Red.prototype._verify1 = function _verify1(a) {
			assert(a.negative === 0, "red works only with positives");
			assert(a.red, "red works only with red numbers");
		};
		Red.prototype._verify2 = function _verify2(a, b) {
			assert((a.negative | b.negative) === 0, "red works only with positives");
			assert(a.red && a.red === b.red, "red works only with red numbers");
		};
		Red.prototype.imod = function imod(a) {
			if (this.prime) return this.prime.ireduce(a)._forceRed(this);
			return a.umod(this.m)._forceRed(this);
		};
		Red.prototype.neg = function neg(a) {
			if (a.isZero()) return a.clone();
			return this.m.sub(a)._forceRed(this);
		};
		Red.prototype.add = function add(a, b) {
			this._verify2(a, b);
			var res = a.add(b);
			if (res.cmp(this.m) >= 0) res.isub(this.m);
			return res._forceRed(this);
		};
		Red.prototype.iadd = function iadd(a, b) {
			this._verify2(a, b);
			var res = a.iadd(b);
			if (res.cmp(this.m) >= 0) res.isub(this.m);
			return res;
		};
		Red.prototype.sub = function sub(a, b) {
			this._verify2(a, b);
			var res = a.sub(b);
			if (res.cmpn(0) < 0) res.iadd(this.m);
			return res._forceRed(this);
		};
		Red.prototype.isub = function isub(a, b) {
			this._verify2(a, b);
			var res = a.isub(b);
			if (res.cmpn(0) < 0) res.iadd(this.m);
			return res;
		};
		Red.prototype.shl = function shl(a, num) {
			this._verify1(a);
			return this.imod(a.ushln(num));
		};
		Red.prototype.imul = function imul(a, b) {
			this._verify2(a, b);
			return this.imod(a.imul(b));
		};
		Red.prototype.mul = function mul(a, b) {
			this._verify2(a, b);
			return this.imod(a.mul(b));
		};
		Red.prototype.isqr = function isqr(a) {
			return this.imul(a, a.clone());
		};
		Red.prototype.sqr = function sqr(a) {
			return this.mul(a, a);
		};
		Red.prototype.sqrt = function sqrt(a) {
			if (a.isZero()) return a.clone();
			var mod3 = this.m.andln(3);
			assert(mod3 % 2 === 1);
			if (mod3 === 3) {
				var pow = this.m.add(new BN(1)).iushrn(2);
				return this.pow(a, pow);
			}
			var q = this.m.subn(1);
			var s = 0;
			while (!q.isZero() && q.andln(1) === 0) {
				s++;
				q.iushrn(1);
			}
			assert(!q.isZero());
			var one = new BN(1).toRed(this);
			var nOne = one.redNeg();
			var lpow = this.m.subn(1).iushrn(1);
			var z = this.m.bitLength();
			z = new BN(2 * z * z).toRed(this);
			while (this.pow(z, lpow).cmp(nOne) !== 0) z.redIAdd(nOne);
			var c = this.pow(z, q);
			var r = this.pow(a, q.addn(1).iushrn(1));
			var t = this.pow(a, q);
			var m = s;
			while (t.cmp(one) !== 0) {
				var tmp = t;
				for (var i = 0; tmp.cmp(one) !== 0; i++) tmp = tmp.redSqr();
				assert(i < m);
				var b = this.pow(c, new BN(1).iushln(m - i - 1));
				r = r.redMul(b);
				c = b.redSqr();
				t = t.redMul(c);
				m = i;
			}
			return r;
		};
		Red.prototype.invm = function invm(a) {
			var inv = a._invmp(this.m);
			if (inv.negative !== 0) {
				inv.negative = 0;
				return this.imod(inv).redNeg();
			} else return this.imod(inv);
		};
		Red.prototype.pow = function pow(a, num) {
			if (num.isZero()) return new BN(1).toRed(this);
			if (num.cmpn(1) === 0) return a.clone();
			var windowSize = 4;
			var wnd = new Array(1 << windowSize);
			wnd[0] = new BN(1).toRed(this);
			wnd[1] = a;
			for (var i = 2; i < wnd.length; i++) wnd[i] = this.mul(wnd[i - 1], a);
			var res = wnd[0];
			var current = 0;
			var currentLen = 0;
			var start = num.bitLength() % 26;
			if (start === 0) start = 26;
			for (i = num.length - 1; i >= 0; i--) {
				var word = num.words[i];
				for (var j = start - 1; j >= 0; j--) {
					var bit = word >> j & 1;
					if (res !== wnd[0]) res = this.sqr(res);
					if (bit === 0 && current === 0) {
						currentLen = 0;
						continue;
					}
					current <<= 1;
					current |= bit;
					currentLen++;
					if (currentLen !== windowSize && (i !== 0 || j !== 0)) continue;
					res = this.mul(res, wnd[current]);
					currentLen = 0;
					current = 0;
				}
				start = 26;
			}
			return res;
		};
		Red.prototype.convertTo = function convertTo(num) {
			var r = num.umod(this.m);
			return r === num ? r.clone() : r;
		};
		Red.prototype.convertFrom = function convertFrom(num) {
			var res = num.clone();
			res.red = null;
			return res;
		};
		BN.mont = function mont(num) {
			return new Mont(num);
		};
		function Mont(m) {
			Red.call(this, m);
			this.shift = this.m.bitLength();
			if (this.shift % 26 !== 0) this.shift += 26 - this.shift % 26;
			this.r = new BN(1).iushln(this.shift);
			this.r2 = this.imod(this.r.sqr());
			this.rinv = this.r._invmp(this.m);
			this.minv = this.rinv.mul(this.r).isubn(1).div(this.m);
			this.minv = this.minv.umod(this.r);
			this.minv = this.r.sub(this.minv);
		}
		inherits(Mont, Red);
		Mont.prototype.convertTo = function convertTo(num) {
			return this.imod(num.ushln(this.shift));
		};
		Mont.prototype.convertFrom = function convertFrom(num) {
			var r = this.imod(num.mul(this.rinv));
			r.red = null;
			return r;
		};
		Mont.prototype.imul = function imul(a, b) {
			if (a.isZero() || b.isZero()) {
				a.words[0] = 0;
				a.length = 1;
				return a;
			}
			var t = a.imul(b);
			var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
			var u = t.isub(c).iushrn(this.shift);
			var res = u;
			if (u.cmp(this.m) >= 0) res = u.isub(this.m);
			else if (u.cmpn(0) < 0) res = u.iadd(this.m);
			return res._forceRed(this);
		};
		Mont.prototype.mul = function mul(a, b) {
			if (a.isZero() || b.isZero()) return new BN(0)._forceRed(this);
			var t = a.mul(b);
			var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
			var u = t.isub(c).iushrn(this.shift);
			var res = u;
			if (u.cmp(this.m) >= 0) res = u.isub(this.m);
			else if (u.cmpn(0) < 0) res = u.iadd(this.m);
			return res._forceRed(this);
		};
		Mont.prototype.invm = function invm(a) {
			return this.imod(a._invmp(this.m).mul(this.r2))._forceRed(this);
		};
	})(typeof module === "undefined" || module, exports);
}));
//#endregion
//#region node_modules/is-typedarray/index.js
var require_is_typedarray = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = isTypedArray;
	isTypedArray.strict = isStrictTypedArray;
	isTypedArray.loose = isLooseTypedArray;
	var toString = Object.prototype.toString;
	var names = {
		"[object Int8Array]": true,
		"[object Int16Array]": true,
		"[object Int32Array]": true,
		"[object Uint8Array]": true,
		"[object Uint8ClampedArray]": true,
		"[object Uint16Array]": true,
		"[object Uint32Array]": true,
		"[object Float32Array]": true,
		"[object Float64Array]": true
	};
	function isTypedArray(arr) {
		return isStrictTypedArray(arr) || isLooseTypedArray(arr);
	}
	function isStrictTypedArray(arr) {
		return arr instanceof Int8Array || arr instanceof Int16Array || arr instanceof Int32Array || arr instanceof Uint8Array || arr instanceof Uint8ClampedArray || arr instanceof Uint16Array || arr instanceof Uint32Array || arr instanceof Float32Array || arr instanceof Float64Array;
	}
	function isLooseTypedArray(arr) {
		return names[toString.call(arr)];
	}
}));
//#endregion
//#region node_modules/typedarray-to-buffer/index.js
var require_typedarray_to_buffer = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* Convert a typed array to a Buffer without a copy
	*
	* Author:   Feross Aboukhadijeh <https://feross.org>
	* License:  MIT
	*
	* `npm install typedarray-to-buffer`
	*/
	var isTypedArray = require_is_typedarray().strict;
	module.exports = function typedarrayToBuffer(arr) {
		if (isTypedArray(arr)) {
			var buf = Buffer.from(arr.buffer);
			if (arr.byteLength !== arr.buffer.byteLength) buf = buf.slice(arr.byteOffset, arr.byteOffset + arr.byteLength);
			return buf;
		} else return Buffer.from(arr);
	};
}));
require_is_typedarray();
var import_typedarray_to_buffer = /* @__PURE__ */ __toESM(require_typedarray_to_buffer());
var ENC_HEX = "hex";
var ENC_UTF8 = "utf8";
var STRING_ZERO = "0";
function bufferToArray(buf) {
	return new Uint8Array(buf);
}
function bufferToHex(buf, prefixed = false) {
	const hex = buf.toString(ENC_HEX);
	return prefixed ? addHexPrefix(hex) : hex;
}
function bufferToUtf8(buf) {
	return buf.toString(ENC_UTF8);
}
function arrayToBuffer(arr) {
	return (0, import_typedarray_to_buffer.default)(arr);
}
function arrayToHex(arr, prefixed = false) {
	return bufferToHex(arrayToBuffer(arr), prefixed);
}
function arrayToUtf8(arr) {
	return bufferToUtf8(arrayToBuffer(arr));
}
function hexToBuffer(hex) {
	return Buffer.from(removeHexPrefix(hex), ENC_HEX);
}
function hexToArray(hex) {
	return bufferToArray(hexToBuffer(hex));
}
function utf8ToBuffer(utf8) {
	return Buffer.from(utf8, ENC_UTF8);
}
function utf8ToArray(utf8) {
	return bufferToArray(utf8ToBuffer(utf8));
}
function utf8ToHex(utf8, prefixed = false) {
	return bufferToHex(utf8ToBuffer(utf8), prefixed);
}
function isHexString$1(str, length) {
	if (typeof str !== "string" || !str.match(/^0x[0-9A-Fa-f]*$/)) return false;
	if (length && str.length !== 2 + 2 * length) return false;
	return true;
}
function concatArrays(...args) {
	let result = [];
	args.forEach((arg) => result = result.concat(Array.from(arg)));
	return new Uint8Array([...result]);
}
function calcByteLength(length, byteSize = 8) {
	const remainder = length % byteSize;
	return remainder ? (length - remainder) / byteSize * byteSize + byteSize : length;
}
function sanitizeBytes(str, byteSize = 8, padding = STRING_ZERO) {
	return padLeft(str, calcByteLength(str.length, byteSize), padding);
}
function padLeft(str, length, padding = STRING_ZERO) {
	return padString(str, length, true, padding);
}
function removeHexPrefix(hex) {
	return hex.replace(/^0x/, "");
}
function addHexPrefix(hex) {
	return hex.startsWith("0x") ? hex : `0x${hex}`;
}
function sanitizeHex$1(hex) {
	hex = removeHexPrefix(hex);
	hex = sanitizeBytes(hex, 2);
	if (hex) hex = addHexPrefix(hex);
	return hex;
}
function removeHexLeadingZeros$1(hex) {
	const prefixed = hex.startsWith("0x");
	hex = removeHexPrefix(hex);
	hex = hex.startsWith(STRING_ZERO) ? hex.substring(1) : hex;
	return prefixed ? addHexPrefix(hex) : hex;
}
function padString(str, length, left, padding = STRING_ZERO) {
	const diff = length - str.length;
	let result = str;
	if (diff > 0) {
		const pad = padding.repeat(diff);
		result = left ? pad + str : str + pad;
	}
	return result;
}
//#endregion
//#region node_modules/@walletconnect/utils/dist/esm/encoding.js
var import_bn = /* @__PURE__ */ __toESM(require_bn());
function convertArrayBufferToBuffer(arrBuf) {
	return arrayToBuffer(new Uint8Array(arrBuf));
}
function convertArrayBufferToHex(arrBuf, noPrefix) {
	return arrayToHex(new Uint8Array(arrBuf), !noPrefix);
}
function convertBufferToArrayBuffer(buf) {
	return bufferToArray(buf).buffer;
}
function convertUtf8ToBuffer(utf8) {
	return utf8ToBuffer(utf8);
}
function convertUtf8ToHex(utf8, noPrefix) {
	return utf8ToHex(utf8, !noPrefix);
}
function convertHexToArrayBuffer(hex) {
	return hexToArray(hex).buffer;
}
function convertNumberToHex(num, noPrefix) {
	const hex = removeHexPrefix(sanitizeHex$1(new import_bn.default(num).toString(16)));
	return noPrefix ? hex : addHexPrefix(hex);
}
//#endregion
//#region node_modules/js-sha3/src/sha3.js
var require_sha3 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/**
	* [js-sha3]{@link https://github.com/emn178/js-sha3}
	*
	* @version 0.8.0
	* @author Chen, Yi-Cyuan [emn178@gmail.com]
	* @copyright Chen, Yi-Cyuan 2015-2018
	* @license MIT
	*/
	(function() {
		"use strict";
		var INPUT_ERROR = "input is invalid type";
		var FINALIZE_ERROR = "finalize already called";
		var WINDOW = typeof window === "object";
		var root = WINDOW ? window : {};
		if (root.JS_SHA3_NO_WINDOW) WINDOW = false;
		var WEB_WORKER = !WINDOW && typeof self === "object";
		if (!root.JS_SHA3_NO_NODE_JS && typeof process === "object" && process.versions && process.versions.node) root = global;
		else if (WEB_WORKER) root = self;
		var COMMON_JS = !root.JS_SHA3_NO_COMMON_JS && typeof module === "object" && module.exports;
		var AMD = typeof define === "function" && define.amd;
		var ARRAY_BUFFER = !root.JS_SHA3_NO_ARRAY_BUFFER && typeof ArrayBuffer !== "undefined";
		var HEX_CHARS = "0123456789abcdef".split("");
		var SHAKE_PADDING = [
			31,
			7936,
			2031616,
			520093696
		];
		var CSHAKE_PADDING = [
			4,
			1024,
			262144,
			67108864
		];
		var KECCAK_PADDING = [
			1,
			256,
			65536,
			16777216
		];
		var PADDING = [
			6,
			1536,
			393216,
			100663296
		];
		var SHIFT = [
			0,
			8,
			16,
			24
		];
		var RC = [
			1,
			0,
			32898,
			0,
			32906,
			2147483648,
			2147516416,
			2147483648,
			32907,
			0,
			2147483649,
			0,
			2147516545,
			2147483648,
			32777,
			2147483648,
			138,
			0,
			136,
			0,
			2147516425,
			0,
			2147483658,
			0,
			2147516555,
			0,
			139,
			2147483648,
			32905,
			2147483648,
			32771,
			2147483648,
			32770,
			2147483648,
			128,
			2147483648,
			32778,
			0,
			2147483658,
			2147483648,
			2147516545,
			2147483648,
			32896,
			2147483648,
			2147483649,
			0,
			2147516424,
			2147483648
		];
		var BITS = [
			224,
			256,
			384,
			512
		];
		var SHAKE_BITS = [128, 256];
		var OUTPUT_TYPES = [
			"hex",
			"buffer",
			"arrayBuffer",
			"array",
			"digest"
		];
		var CSHAKE_BYTEPAD = {
			"128": 168,
			"256": 136
		};
		if (root.JS_SHA3_NO_NODE_JS || !Array.isArray) Array.isArray = function(obj) {
			return Object.prototype.toString.call(obj) === "[object Array]";
		};
		if (ARRAY_BUFFER && (root.JS_SHA3_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) ArrayBuffer.isView = function(obj) {
			return typeof obj === "object" && obj.buffer && obj.buffer.constructor === ArrayBuffer;
		};
		var createOutputMethod = function(bits, padding, outputType) {
			return function(message) {
				return new Keccak(bits, padding, bits).update(message)[outputType]();
			};
		};
		var createShakeOutputMethod = function(bits, padding, outputType) {
			return function(message, outputBits) {
				return new Keccak(bits, padding, outputBits).update(message)[outputType]();
			};
		};
		var createCshakeOutputMethod = function(bits, padding, outputType) {
			return function(message, outputBits, n, s) {
				return methods["cshake" + bits].update(message, outputBits, n, s)[outputType]();
			};
		};
		var createKmacOutputMethod = function(bits, padding, outputType) {
			return function(key, message, outputBits, s) {
				return methods["kmac" + bits].update(key, message, outputBits, s)[outputType]();
			};
		};
		var createOutputMethods = function(method, createMethod, bits, padding) {
			for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
				var type = OUTPUT_TYPES[i];
				method[type] = createMethod(bits, padding, type);
			}
			return method;
		};
		var createMethod = function(bits, padding) {
			var method = createOutputMethod(bits, padding, "hex");
			method.create = function() {
				return new Keccak(bits, padding, bits);
			};
			method.update = function(message) {
				return method.create().update(message);
			};
			return createOutputMethods(method, createOutputMethod, bits, padding);
		};
		var createShakeMethod = function(bits, padding) {
			var method = createShakeOutputMethod(bits, padding, "hex");
			method.create = function(outputBits) {
				return new Keccak(bits, padding, outputBits);
			};
			method.update = function(message, outputBits) {
				return method.create(outputBits).update(message);
			};
			return createOutputMethods(method, createShakeOutputMethod, bits, padding);
		};
		var createCshakeMethod = function(bits, padding) {
			var w = CSHAKE_BYTEPAD[bits];
			var method = createCshakeOutputMethod(bits, padding, "hex");
			method.create = function(outputBits, n, s) {
				if (!n && !s) return methods["shake" + bits].create(outputBits);
				else return new Keccak(bits, padding, outputBits).bytepad([n, s], w);
			};
			method.update = function(message, outputBits, n, s) {
				return method.create(outputBits, n, s).update(message);
			};
			return createOutputMethods(method, createCshakeOutputMethod, bits, padding);
		};
		var createKmacMethod = function(bits, padding) {
			var w = CSHAKE_BYTEPAD[bits];
			var method = createKmacOutputMethod(bits, padding, "hex");
			method.create = function(key, outputBits, s) {
				return new Kmac(bits, padding, outputBits).bytepad(["KMAC", s], w).bytepad([key], w);
			};
			method.update = function(key, message, outputBits, s) {
				return method.create(key, outputBits, s).update(message);
			};
			return createOutputMethods(method, createKmacOutputMethod, bits, padding);
		};
		var algorithms = [
			{
				name: "keccak",
				padding: KECCAK_PADDING,
				bits: BITS,
				createMethod
			},
			{
				name: "sha3",
				padding: PADDING,
				bits: BITS,
				createMethod
			},
			{
				name: "shake",
				padding: SHAKE_PADDING,
				bits: SHAKE_BITS,
				createMethod: createShakeMethod
			},
			{
				name: "cshake",
				padding: CSHAKE_PADDING,
				bits: SHAKE_BITS,
				createMethod: createCshakeMethod
			},
			{
				name: "kmac",
				padding: CSHAKE_PADDING,
				bits: SHAKE_BITS,
				createMethod: createKmacMethod
			}
		];
		var methods = {}, methodNames = [];
		for (var i = 0; i < algorithms.length; ++i) {
			var algorithm = algorithms[i];
			var bits = algorithm.bits;
			for (var j = 0; j < bits.length; ++j) {
				var methodName = algorithm.name + "_" + bits[j];
				methodNames.push(methodName);
				methods[methodName] = algorithm.createMethod(bits[j], algorithm.padding);
				if (algorithm.name !== "sha3") {
					var newMethodName = algorithm.name + bits[j];
					methodNames.push(newMethodName);
					methods[newMethodName] = methods[methodName];
				}
			}
		}
		function Keccak(bits, padding, outputBits) {
			this.blocks = [];
			this.s = [];
			this.padding = padding;
			this.outputBits = outputBits;
			this.reset = true;
			this.finalized = false;
			this.block = 0;
			this.start = 0;
			this.blockCount = 1600 - (bits << 1) >> 5;
			this.byteCount = this.blockCount << 2;
			this.outputBlocks = outputBits >> 5;
			this.extraBytes = (outputBits & 31) >> 3;
			for (var i = 0; i < 50; ++i) this.s[i] = 0;
		}
		Keccak.prototype.update = function(message) {
			if (this.finalized) throw new Error(FINALIZE_ERROR);
			var notString, type = typeof message;
			if (type !== "string") {
				if (type === "object") {
					if (message === null) throw new Error(INPUT_ERROR);
					else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) message = new Uint8Array(message);
					else if (!Array.isArray(message)) {
						if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) throw new Error(INPUT_ERROR);
					}
				} else throw new Error(INPUT_ERROR);
				notString = true;
			}
			var blocks = this.blocks, byteCount = this.byteCount, length = message.length, blockCount = this.blockCount, index = 0, s = this.s, i, code;
			while (index < length) {
				if (this.reset) {
					this.reset = false;
					blocks[0] = this.block;
					for (i = 1; i < blockCount + 1; ++i) blocks[i] = 0;
				}
				if (notString) for (i = this.start; index < length && i < byteCount; ++index) blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
				else for (i = this.start; index < length && i < byteCount; ++index) {
					code = message.charCodeAt(index);
					if (code < 128) blocks[i >> 2] |= code << SHIFT[i++ & 3];
					else if (code < 2048) {
						blocks[i >> 2] |= (192 | code >> 6) << SHIFT[i++ & 3];
						blocks[i >> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
					} else if (code < 55296 || code >= 57344) {
						blocks[i >> 2] |= (224 | code >> 12) << SHIFT[i++ & 3];
						blocks[i >> 2] |= (128 | code >> 6 & 63) << SHIFT[i++ & 3];
						blocks[i >> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
					} else {
						code = 65536 + ((code & 1023) << 10 | message.charCodeAt(++index) & 1023);
						blocks[i >> 2] |= (240 | code >> 18) << SHIFT[i++ & 3];
						blocks[i >> 2] |= (128 | code >> 12 & 63) << SHIFT[i++ & 3];
						blocks[i >> 2] |= (128 | code >> 6 & 63) << SHIFT[i++ & 3];
						blocks[i >> 2] |= (128 | code & 63) << SHIFT[i++ & 3];
					}
				}
				this.lastByteIndex = i;
				if (i >= byteCount) {
					this.start = i - byteCount;
					this.block = blocks[blockCount];
					for (i = 0; i < blockCount; ++i) s[i] ^= blocks[i];
					f(s);
					this.reset = true;
				} else this.start = i;
			}
			return this;
		};
		Keccak.prototype.encode = function(x, right) {
			var o = x & 255, n = 1;
			var bytes = [o];
			x = x >> 8;
			o = x & 255;
			while (o > 0) {
				bytes.unshift(o);
				x = x >> 8;
				o = x & 255;
				++n;
			}
			if (right) bytes.push(n);
			else bytes.unshift(n);
			this.update(bytes);
			return bytes.length;
		};
		Keccak.prototype.encodeString = function(str) {
			var notString, type = typeof str;
			if (type !== "string") {
				if (type === "object") {
					if (str === null) throw new Error(INPUT_ERROR);
					else if (ARRAY_BUFFER && str.constructor === ArrayBuffer) str = new Uint8Array(str);
					else if (!Array.isArray(str)) {
						if (!ARRAY_BUFFER || !ArrayBuffer.isView(str)) throw new Error(INPUT_ERROR);
					}
				} else throw new Error(INPUT_ERROR);
				notString = true;
			}
			var bytes = 0, length = str.length;
			if (notString) bytes = length;
			else for (var i = 0; i < str.length; ++i) {
				var code = str.charCodeAt(i);
				if (code < 128) bytes += 1;
				else if (code < 2048) bytes += 2;
				else if (code < 55296 || code >= 57344) bytes += 3;
				else {
					code = 65536 + ((code & 1023) << 10 | str.charCodeAt(++i) & 1023);
					bytes += 4;
				}
			}
			bytes += this.encode(bytes * 8);
			this.update(str);
			return bytes;
		};
		Keccak.prototype.bytepad = function(strs, w) {
			var bytes = this.encode(w);
			for (var i = 0; i < strs.length; ++i) bytes += this.encodeString(strs[i]);
			var paddingBytes = w - bytes % w;
			var zeros = [];
			zeros.length = paddingBytes;
			this.update(zeros);
			return this;
		};
		Keccak.prototype.finalize = function() {
			if (this.finalized) return;
			this.finalized = true;
			var blocks = this.blocks, i = this.lastByteIndex, blockCount = this.blockCount, s = this.s;
			blocks[i >> 2] |= this.padding[i & 3];
			if (this.lastByteIndex === this.byteCount) {
				blocks[0] = blocks[blockCount];
				for (i = 1; i < blockCount + 1; ++i) blocks[i] = 0;
			}
			blocks[blockCount - 1] |= 2147483648;
			for (i = 0; i < blockCount; ++i) s[i] ^= blocks[i];
			f(s);
		};
		Keccak.prototype.toString = Keccak.prototype.hex = function() {
			this.finalize();
			var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks, extraBytes = this.extraBytes, i = 0, j = 0;
			var hex = "", block;
			while (j < outputBlocks) {
				for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
					block = s[i];
					hex += HEX_CHARS[block >> 4 & 15] + HEX_CHARS[block & 15] + HEX_CHARS[block >> 12 & 15] + HEX_CHARS[block >> 8 & 15] + HEX_CHARS[block >> 20 & 15] + HEX_CHARS[block >> 16 & 15] + HEX_CHARS[block >> 28 & 15] + HEX_CHARS[block >> 24 & 15];
				}
				if (j % blockCount === 0) {
					f(s);
					i = 0;
				}
			}
			if (extraBytes) {
				block = s[i];
				hex += HEX_CHARS[block >> 4 & 15] + HEX_CHARS[block & 15];
				if (extraBytes > 1) hex += HEX_CHARS[block >> 12 & 15] + HEX_CHARS[block >> 8 & 15];
				if (extraBytes > 2) hex += HEX_CHARS[block >> 20 & 15] + HEX_CHARS[block >> 16 & 15];
			}
			return hex;
		};
		Keccak.prototype.arrayBuffer = function() {
			this.finalize();
			var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks, extraBytes = this.extraBytes, i = 0, j = 0;
			var bytes = this.outputBits >> 3;
			var buffer;
			if (extraBytes) buffer = /* @__PURE__ */ new ArrayBuffer(outputBlocks + 1 << 2);
			else buffer = new ArrayBuffer(bytes);
			var array = new Uint32Array(buffer);
			while (j < outputBlocks) {
				for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) array[j] = s[i];
				if (j % blockCount === 0) f(s);
			}
			if (extraBytes) {
				array[i] = s[i];
				buffer = buffer.slice(0, bytes);
			}
			return buffer;
		};
		Keccak.prototype.buffer = Keccak.prototype.arrayBuffer;
		Keccak.prototype.digest = Keccak.prototype.array = function() {
			this.finalize();
			var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks, extraBytes = this.extraBytes, i = 0, j = 0;
			var array = [], offset, block;
			while (j < outputBlocks) {
				for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
					offset = j << 2;
					block = s[i];
					array[offset] = block & 255;
					array[offset + 1] = block >> 8 & 255;
					array[offset + 2] = block >> 16 & 255;
					array[offset + 3] = block >> 24 & 255;
				}
				if (j % blockCount === 0) f(s);
			}
			if (extraBytes) {
				offset = j << 2;
				block = s[i];
				array[offset] = block & 255;
				if (extraBytes > 1) array[offset + 1] = block >> 8 & 255;
				if (extraBytes > 2) array[offset + 2] = block >> 16 & 255;
			}
			return array;
		};
		function Kmac(bits, padding, outputBits) {
			Keccak.call(this, bits, padding, outputBits);
		}
		Kmac.prototype = new Keccak();
		Kmac.prototype.finalize = function() {
			this.encode(this.outputBits, true);
			return Keccak.prototype.finalize.call(this);
		};
		var f = function(s) {
			var h, l, n, c0, c1, c2, c3, c4, c5, c6, c7, c8, c9, b0, b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12, b13, b14, b15, b16, b17, b18, b19, b20, b21, b22, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33, b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49;
			for (n = 0; n < 48; n += 2) {
				c0 = s[0] ^ s[10] ^ s[20] ^ s[30] ^ s[40];
				c1 = s[1] ^ s[11] ^ s[21] ^ s[31] ^ s[41];
				c2 = s[2] ^ s[12] ^ s[22] ^ s[32] ^ s[42];
				c3 = s[3] ^ s[13] ^ s[23] ^ s[33] ^ s[43];
				c4 = s[4] ^ s[14] ^ s[24] ^ s[34] ^ s[44];
				c5 = s[5] ^ s[15] ^ s[25] ^ s[35] ^ s[45];
				c6 = s[6] ^ s[16] ^ s[26] ^ s[36] ^ s[46];
				c7 = s[7] ^ s[17] ^ s[27] ^ s[37] ^ s[47];
				c8 = s[8] ^ s[18] ^ s[28] ^ s[38] ^ s[48];
				c9 = s[9] ^ s[19] ^ s[29] ^ s[39] ^ s[49];
				h = c8 ^ (c2 << 1 | c3 >>> 31);
				l = c9 ^ (c3 << 1 | c2 >>> 31);
				s[0] ^= h;
				s[1] ^= l;
				s[10] ^= h;
				s[11] ^= l;
				s[20] ^= h;
				s[21] ^= l;
				s[30] ^= h;
				s[31] ^= l;
				s[40] ^= h;
				s[41] ^= l;
				h = c0 ^ (c4 << 1 | c5 >>> 31);
				l = c1 ^ (c5 << 1 | c4 >>> 31);
				s[2] ^= h;
				s[3] ^= l;
				s[12] ^= h;
				s[13] ^= l;
				s[22] ^= h;
				s[23] ^= l;
				s[32] ^= h;
				s[33] ^= l;
				s[42] ^= h;
				s[43] ^= l;
				h = c2 ^ (c6 << 1 | c7 >>> 31);
				l = c3 ^ (c7 << 1 | c6 >>> 31);
				s[4] ^= h;
				s[5] ^= l;
				s[14] ^= h;
				s[15] ^= l;
				s[24] ^= h;
				s[25] ^= l;
				s[34] ^= h;
				s[35] ^= l;
				s[44] ^= h;
				s[45] ^= l;
				h = c4 ^ (c8 << 1 | c9 >>> 31);
				l = c5 ^ (c9 << 1 | c8 >>> 31);
				s[6] ^= h;
				s[7] ^= l;
				s[16] ^= h;
				s[17] ^= l;
				s[26] ^= h;
				s[27] ^= l;
				s[36] ^= h;
				s[37] ^= l;
				s[46] ^= h;
				s[47] ^= l;
				h = c6 ^ (c0 << 1 | c1 >>> 31);
				l = c7 ^ (c1 << 1 | c0 >>> 31);
				s[8] ^= h;
				s[9] ^= l;
				s[18] ^= h;
				s[19] ^= l;
				s[28] ^= h;
				s[29] ^= l;
				s[38] ^= h;
				s[39] ^= l;
				s[48] ^= h;
				s[49] ^= l;
				b0 = s[0];
				b1 = s[1];
				b32 = s[11] << 4 | s[10] >>> 28;
				b33 = s[10] << 4 | s[11] >>> 28;
				b14 = s[20] << 3 | s[21] >>> 29;
				b15 = s[21] << 3 | s[20] >>> 29;
				b46 = s[31] << 9 | s[30] >>> 23;
				b47 = s[30] << 9 | s[31] >>> 23;
				b28 = s[40] << 18 | s[41] >>> 14;
				b29 = s[41] << 18 | s[40] >>> 14;
				b20 = s[2] << 1 | s[3] >>> 31;
				b21 = s[3] << 1 | s[2] >>> 31;
				b2 = s[13] << 12 | s[12] >>> 20;
				b3 = s[12] << 12 | s[13] >>> 20;
				b34 = s[22] << 10 | s[23] >>> 22;
				b35 = s[23] << 10 | s[22] >>> 22;
				b16 = s[33] << 13 | s[32] >>> 19;
				b17 = s[32] << 13 | s[33] >>> 19;
				b48 = s[42] << 2 | s[43] >>> 30;
				b49 = s[43] << 2 | s[42] >>> 30;
				b40 = s[5] << 30 | s[4] >>> 2;
				b41 = s[4] << 30 | s[5] >>> 2;
				b22 = s[14] << 6 | s[15] >>> 26;
				b23 = s[15] << 6 | s[14] >>> 26;
				b4 = s[25] << 11 | s[24] >>> 21;
				b5 = s[24] << 11 | s[25] >>> 21;
				b36 = s[34] << 15 | s[35] >>> 17;
				b37 = s[35] << 15 | s[34] >>> 17;
				b18 = s[45] << 29 | s[44] >>> 3;
				b19 = s[44] << 29 | s[45] >>> 3;
				b10 = s[6] << 28 | s[7] >>> 4;
				b11 = s[7] << 28 | s[6] >>> 4;
				b42 = s[17] << 23 | s[16] >>> 9;
				b43 = s[16] << 23 | s[17] >>> 9;
				b24 = s[26] << 25 | s[27] >>> 7;
				b25 = s[27] << 25 | s[26] >>> 7;
				b6 = s[36] << 21 | s[37] >>> 11;
				b7 = s[37] << 21 | s[36] >>> 11;
				b38 = s[47] << 24 | s[46] >>> 8;
				b39 = s[46] << 24 | s[47] >>> 8;
				b30 = s[8] << 27 | s[9] >>> 5;
				b31 = s[9] << 27 | s[8] >>> 5;
				b12 = s[18] << 20 | s[19] >>> 12;
				b13 = s[19] << 20 | s[18] >>> 12;
				b44 = s[29] << 7 | s[28] >>> 25;
				b45 = s[28] << 7 | s[29] >>> 25;
				b26 = s[38] << 8 | s[39] >>> 24;
				b27 = s[39] << 8 | s[38] >>> 24;
				b8 = s[48] << 14 | s[49] >>> 18;
				b9 = s[49] << 14 | s[48] >>> 18;
				s[0] = b0 ^ ~b2 & b4;
				s[1] = b1 ^ ~b3 & b5;
				s[10] = b10 ^ ~b12 & b14;
				s[11] = b11 ^ ~b13 & b15;
				s[20] = b20 ^ ~b22 & b24;
				s[21] = b21 ^ ~b23 & b25;
				s[30] = b30 ^ ~b32 & b34;
				s[31] = b31 ^ ~b33 & b35;
				s[40] = b40 ^ ~b42 & b44;
				s[41] = b41 ^ ~b43 & b45;
				s[2] = b2 ^ ~b4 & b6;
				s[3] = b3 ^ ~b5 & b7;
				s[12] = b12 ^ ~b14 & b16;
				s[13] = b13 ^ ~b15 & b17;
				s[22] = b22 ^ ~b24 & b26;
				s[23] = b23 ^ ~b25 & b27;
				s[32] = b32 ^ ~b34 & b36;
				s[33] = b33 ^ ~b35 & b37;
				s[42] = b42 ^ ~b44 & b46;
				s[43] = b43 ^ ~b45 & b47;
				s[4] = b4 ^ ~b6 & b8;
				s[5] = b5 ^ ~b7 & b9;
				s[14] = b14 ^ ~b16 & b18;
				s[15] = b15 ^ ~b17 & b19;
				s[24] = b24 ^ ~b26 & b28;
				s[25] = b25 ^ ~b27 & b29;
				s[34] = b34 ^ ~b36 & b38;
				s[35] = b35 ^ ~b37 & b39;
				s[44] = b44 ^ ~b46 & b48;
				s[45] = b45 ^ ~b47 & b49;
				s[6] = b6 ^ ~b8 & b0;
				s[7] = b7 ^ ~b9 & b1;
				s[16] = b16 ^ ~b18 & b10;
				s[17] = b17 ^ ~b19 & b11;
				s[26] = b26 ^ ~b28 & b20;
				s[27] = b27 ^ ~b29 & b21;
				s[36] = b36 ^ ~b38 & b30;
				s[37] = b37 ^ ~b39 & b31;
				s[46] = b46 ^ ~b48 & b40;
				s[47] = b47 ^ ~b49 & b41;
				s[8] = b8 ^ ~b0 & b2;
				s[9] = b9 ^ ~b1 & b3;
				s[18] = b18 ^ ~b10 & b12;
				s[19] = b19 ^ ~b11 & b13;
				s[28] = b28 ^ ~b20 & b22;
				s[29] = b29 ^ ~b21 & b23;
				s[38] = b38 ^ ~b30 & b32;
				s[39] = b39 ^ ~b31 & b33;
				s[48] = b48 ^ ~b40 & b42;
				s[49] = b49 ^ ~b41 & b43;
				s[0] ^= RC[n];
				s[1] ^= RC[n + 1];
			}
		};
		if (COMMON_JS) module.exports = methods;
		else {
			for (i = 0; i < methodNames.length; ++i) root[methodNames[i]] = methods[methodNames[i]];
			if (AMD) define(function() {
				return methods;
			});
		}
	})();
}));
//#endregion
//#region node_modules/@walletconnect/jsonrpc-utils/dist/esm/constants.js
var PARSE_ERROR = "PARSE_ERROR";
var INVALID_REQUEST = "INVALID_REQUEST";
var METHOD_NOT_FOUND = "METHOD_NOT_FOUND";
var INVALID_PARAMS = "INVALID_PARAMS";
var INTERNAL_ERROR = "INTERNAL_ERROR";
var SERVER_ERROR = "SERVER_ERROR";
var RESERVED_ERROR_CODES = [
	-32700,
	-32600,
	-32601,
	-32602,
	-32603
];
var SERVER_ERROR_CODE_RANGE = [-32e3, -32099];
var STANDARD_ERROR_MAP = {
	[PARSE_ERROR]: {
		code: -32700,
		message: "Parse error"
	},
	[INVALID_REQUEST]: {
		code: -32600,
		message: "Invalid Request"
	},
	[METHOD_NOT_FOUND]: {
		code: -32601,
		message: "Method not found"
	},
	[INVALID_PARAMS]: {
		code: -32602,
		message: "Invalid params"
	},
	[INTERNAL_ERROR]: {
		code: -32603,
		message: "Internal error"
	},
	[SERVER_ERROR]: {
		code: -32e3,
		message: "Server error"
	}
};
var DEFAULT_ERROR = SERVER_ERROR;
//#endregion
//#region node_modules/@walletconnect/jsonrpc-utils/dist/esm/error.js
function isServerErrorCode(code) {
	return code <= SERVER_ERROR_CODE_RANGE[0] && code >= SERVER_ERROR_CODE_RANGE[1];
}
function isReservedErrorCode(code) {
	return RESERVED_ERROR_CODES.includes(code);
}
function isValidErrorCode(code) {
	return typeof code === "number";
}
function getError(type) {
	if (!Object.keys(STANDARD_ERROR_MAP).includes(type)) return STANDARD_ERROR_MAP[DEFAULT_ERROR];
	return STANDARD_ERROR_MAP[type];
}
function getErrorByCode(code) {
	const match = Object.values(STANDARD_ERROR_MAP).find((e) => e.code === code);
	if (!match) return STANDARD_ERROR_MAP[DEFAULT_ERROR];
	return match;
}
function validateJsonRpcError(response) {
	if (typeof response.error.code === "undefined") return {
		valid: false,
		error: "Missing code for JSON-RPC error"
	};
	if (typeof response.error.message === "undefined") return {
		valid: false,
		error: "Missing message for JSON-RPC error"
	};
	if (!isValidErrorCode(response.error.code)) return {
		valid: false,
		error: `Invalid error code type for JSON-RPC: ${response.error.code}`
	};
	if (isReservedErrorCode(response.error.code)) {
		const error = getErrorByCode(response.error.code);
		if (error.message !== STANDARD_ERROR_MAP["SERVER_ERROR"].message && response.error.message === error.message) return {
			valid: false,
			error: `Invalid error code message for JSON-RPC: ${response.error.code}`
		};
	}
	return { valid: true };
}
function parseConnectionError(e, url, type) {
	return e.message.includes("getaddrinfo ENOTFOUND") || e.message.includes("connect ECONNREFUSED") ? /* @__PURE__ */ new Error(`Unavailable ${type} RPC url at ${url}`) : e;
}
//#endregion
//#region node_modules/tslib/tslib.es6.js
var tslib_es6_exports = /* @__PURE__ */ __exportAll({
	__assign: () => __assign,
	__asyncDelegator: () => __asyncDelegator,
	__asyncGenerator: () => __asyncGenerator,
	__asyncValues: () => __asyncValues,
	__await: () => __await,
	__awaiter: () => __awaiter,
	__classPrivateFieldGet: () => __classPrivateFieldGet,
	__classPrivateFieldSet: () => __classPrivateFieldSet,
	__createBinding: () => __createBinding,
	__decorate: () => __decorate,
	__exportStar: () => __exportStar,
	__extends: () => __extends,
	__generator: () => __generator,
	__importDefault: () => __importDefault,
	__importStar: () => __importStar,
	__makeTemplateObject: () => __makeTemplateObject,
	__metadata: () => __metadata,
	__param: () => __param,
	__read: () => __read,
	__rest: () => __rest,
	__spread: () => __spread,
	__spreadArrays: () => __spreadArrays,
	__values: () => __values
});
function __extends(d, b) {
	extendStatics(d, b);
	function __() {
		this.constructor = d;
	}
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
function __rest(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
}
function __decorate(decorators, target, key, desc) {
	var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function __param(paramIndex, decorator) {
	return function(target, key) {
		decorator(target, key, paramIndex);
	};
}
function __metadata(metadataKey, metadataValue) {
	if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}
function __awaiter(thisArg, _arguments, P, generator) {
	function adopt(value) {
		return value instanceof P ? value : new P(function(resolve) {
			resolve(value);
		});
	}
	return new (P || (P = Promise))(function(resolve, reject) {
		function fulfilled(value) {
			try {
				step(generator.next(value));
			} catch (e) {
				reject(e);
			}
		}
		function rejected(value) {
			try {
				step(generator["throw"](value));
			} catch (e) {
				reject(e);
			}
		}
		function step(result) {
			result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
		}
		step((generator = generator.apply(thisArg, _arguments || [])).next());
	});
}
function __generator(thisArg, body) {
	var _ = {
		label: 0,
		sent: function() {
			if (t[0] & 1) throw t[1];
			return t[1];
		},
		trys: [],
		ops: []
	}, f, y, t, g;
	return g = {
		next: verb(0),
		"throw": verb(1),
		"return": verb(2)
	}, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
		return this;
	}), g;
	function verb(n) {
		return function(v) {
			return step([n, v]);
		};
	}
	function step(op) {
		if (f) throw new TypeError("Generator is already executing.");
		while (_) try {
			if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
			if (y = 0, t) op = [op[0] & 2, t.value];
			switch (op[0]) {
				case 0:
				case 1:
					t = op;
					break;
				case 4:
					_.label++;
					return {
						value: op[1],
						done: false
					};
				case 5:
					_.label++;
					y = op[1];
					op = [0];
					continue;
				case 7:
					op = _.ops.pop();
					_.trys.pop();
					continue;
				default:
					if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
						_ = 0;
						continue;
					}
					if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
						_.label = op[1];
						break;
					}
					if (op[0] === 6 && _.label < t[1]) {
						_.label = t[1];
						t = op;
						break;
					}
					if (t && _.label < t[2]) {
						_.label = t[2];
						_.ops.push(op);
						break;
					}
					if (t[2]) _.ops.pop();
					_.trys.pop();
					continue;
			}
			op = body.call(thisArg, _);
		} catch (e) {
			op = [6, e];
			y = 0;
		} finally {
			f = t = 0;
		}
		if (op[0] & 5) throw op[1];
		return {
			value: op[0] ? op[1] : void 0,
			done: true
		};
	}
}
function __createBinding(o, m, k, k2) {
	if (k2 === void 0) k2 = k;
	o[k2] = m[k];
}
function __exportStar(m, exports) {
	for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) exports[p] = m[p];
}
function __values(o) {
	var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
	if (m) return m.call(o);
	if (o && typeof o.length === "number") return { next: function() {
		if (o && i >= o.length) o = void 0;
		return {
			value: o && o[i++],
			done: !o
		};
	} };
	throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __read(o, n) {
	var m = typeof Symbol === "function" && o[Symbol.iterator];
	if (!m) return o;
	var i = m.call(o), r, ar = [], e;
	try {
		while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
	} catch (error) {
		e = { error };
	} finally {
		try {
			if (r && !r.done && (m = i["return"])) m.call(i);
		} finally {
			if (e) throw e.error;
		}
	}
	return ar;
}
function __spread() {
	for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
	return ar;
}
function __spreadArrays() {
	for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
	for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];
	return r;
}
function __await(v) {
	return this instanceof __await ? (this.v = v, this) : new __await(v);
}
function __asyncGenerator(thisArg, _arguments, generator) {
	if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
	var g = generator.apply(thisArg, _arguments || []), i, q = [];
	return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
		return this;
	}, i;
	function verb(n) {
		if (g[n]) i[n] = function(v) {
			return new Promise(function(a, b) {
				q.push([
					n,
					v,
					a,
					b
				]) > 1 || resume(n, v);
			});
		};
	}
	function resume(n, v) {
		try {
			step(g[n](v));
		} catch (e) {
			settle(q[0][3], e);
		}
	}
	function step(r) {
		r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
	}
	function fulfill(value) {
		resume("next", value);
	}
	function reject(value) {
		resume("throw", value);
	}
	function settle(f, v) {
		if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
	}
}
function __asyncDelegator(o) {
	var i, p;
	return i = {}, verb("next"), verb("throw", function(e) {
		throw e;
	}), verb("return"), i[Symbol.iterator] = function() {
		return this;
	}, i;
	function verb(n, f) {
		i[n] = o[n] ? function(v) {
			return (p = !p) ? {
				value: __await(o[n](v)),
				done: n === "return"
			} : f ? f(v) : v;
		} : f;
	}
}
function __asyncValues(o) {
	if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
	var m = o[Symbol.asyncIterator], i;
	return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
		return this;
	}, i);
	function verb(n) {
		i[n] = o[n] && function(v) {
			return new Promise(function(resolve, reject) {
				v = o[n](v), settle(resolve, reject, v.done, v.value);
			});
		};
	}
	function settle(resolve, reject, d, v) {
		Promise.resolve(v).then(function(v) {
			resolve({
				value: v,
				done: d
			});
		}, reject);
	}
}
function __makeTemplateObject(cooked, raw) {
	if (Object.defineProperty) Object.defineProperty(cooked, "raw", { value: raw });
	else cooked.raw = raw;
	return cooked;
}
function __importStar(mod) {
	if (mod && mod.__esModule) return mod;
	var result = {};
	if (mod != null) {
		for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
	}
	result.default = mod;
	return result;
}
function __importDefault(mod) {
	return mod && mod.__esModule ? mod : { default: mod };
}
function __classPrivateFieldGet(receiver, privateMap) {
	if (!privateMap.has(receiver)) throw new TypeError("attempted to get private field on non-instance");
	return privateMap.get(receiver);
}
function __classPrivateFieldSet(receiver, privateMap, value) {
	if (!privateMap.has(receiver)) throw new TypeError("attempted to set private field on non-instance");
	privateMap.set(receiver, value);
	return value;
}
var extendStatics, __assign;
var init_tslib_es6 = __esmMin((() => {
	extendStatics = function(d, b) {
		extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
			d.__proto__ = b;
		} || function(d, b) {
			for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
		};
		return extendStatics(d, b);
	};
	__assign = function() {
		__assign = Object.assign || function __assign(t) {
			for (var s, i = 1, n = arguments.length; i < n; i++) {
				s = arguments[i];
				for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
			}
			return t;
		};
		return __assign.apply(this, arguments);
	};
}));
//#endregion
//#region node_modules/@walletconnect/environment/dist/cjs/crypto.js
var require_crypto = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isBrowserCryptoAvailable = exports.getSubtleCrypto = exports.getBrowerCrypto = void 0;
	function getBrowerCrypto() {
		return (global === null || global === void 0 ? void 0 : global.crypto) || (global === null || global === void 0 ? void 0 : global.msCrypto) || {};
	}
	exports.getBrowerCrypto = getBrowerCrypto;
	function getSubtleCrypto() {
		const browserCrypto = getBrowerCrypto();
		return browserCrypto.subtle || browserCrypto.webkitSubtle;
	}
	exports.getSubtleCrypto = getSubtleCrypto;
	function isBrowserCryptoAvailable() {
		return !!getBrowerCrypto() && !!getSubtleCrypto();
	}
	exports.isBrowserCryptoAvailable = isBrowserCryptoAvailable;
}));
//#endregion
//#region node_modules/@walletconnect/environment/dist/cjs/env.js
var require_env = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isBrowser = exports.isNode = exports.isReactNative = void 0;
	function isReactNative() {
		return typeof document === "undefined" && typeof navigator !== "undefined" && navigator.product === "ReactNative";
	}
	exports.isReactNative = isReactNative;
	function isNode() {
		return typeof process !== "undefined" && typeof process.versions !== "undefined" && typeof process.versions.node !== "undefined";
	}
	exports.isNode = isNode;
	function isBrowser() {
		return !isReactNative() && !isNode();
	}
	exports.isBrowser = isBrowser;
}));
//#endregion
//#region node_modules/@walletconnect/environment/dist/cjs/index.js
var require_cjs = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
	tslib_1.__exportStar(require_crypto(), exports);
	tslib_1.__exportStar(require_env(), exports);
}));
//#endregion
//#region node_modules/@walletconnect/jsonrpc-utils/dist/esm/env.js
var env_exports$1 = /* @__PURE__ */ __exportAll({ isNodeJs: () => isNodeJs });
var import_cjs = /* @__PURE__ */ __toESM(require_cjs());
__reExport(env_exports$1, /* @__PURE__ */ __toESM(require_cjs()));
var isNodeJs = import_cjs.isNode;
//#endregion
//#region node_modules/@walletconnect/jsonrpc-utils/dist/esm/format.js
function payloadId$1(entropy = 3) {
	return Date.now() * Math.pow(10, entropy) + Math.floor(Math.random() * Math.pow(10, entropy));
}
function getBigIntRpcId(entropy = 6) {
	return BigInt(payloadId$1(entropy));
}
function formatJsonRpcRequest(method, params, id) {
	return {
		id: id || payloadId$1(),
		jsonrpc: "2.0",
		method,
		params
	};
}
function formatJsonRpcResult(id, result) {
	return {
		id,
		jsonrpc: "2.0",
		result
	};
}
function formatJsonRpcError(id, error, data) {
	return {
		id,
		jsonrpc: "2.0",
		error: formatErrorMessage(error, data)
	};
}
function formatErrorMessage(error, data) {
	if (typeof error === "undefined") return getError(INTERNAL_ERROR);
	if (typeof error === "string") error = Object.assign(Object.assign({}, getError(SERVER_ERROR)), { message: error });
	if (typeof data !== "undefined") error.data = data;
	if (isReservedErrorCode(error.code)) error = getErrorByCode(error.code);
	return error;
}
//#endregion
//#region node_modules/@walletconnect/jsonrpc-utils/dist/esm/routing.js
function isValidRoute(route) {
	if (route.includes("*")) return isValidWildcardRoute(route);
	if (/\W/g.test(route)) return false;
	return true;
}
function isValidDefaultRoute(route) {
	return route === "*";
}
function isValidWildcardRoute(route) {
	if (isValidDefaultRoute(route)) return true;
	if (!route.includes("*")) return false;
	if (route.split("*").length !== 2) return false;
	if (route.split("*").filter((x) => x.trim() === "").length !== 1) return false;
	return true;
}
function isValidLeadingWildcardRoute(route) {
	return !isValidDefaultRoute(route) && isValidWildcardRoute(route) && !route.split("*")[0].trim();
}
function isValidTrailingWildcardRoute(route) {
	return !isValidDefaultRoute(route) && isValidWildcardRoute(route) && !route.split("*")[1].trim();
}
//#endregion
//#region node_modules/@walletconnect/jsonrpc-types/dist/index.es.js
var e = class {};
var o$1 = class extends e {
	constructor(c) {
		super();
	}
};
var n = class extends e {
	constructor() {
		super();
	}
};
var r$1 = class extends n {
	constructor(c) {
		super();
	}
};
//#endregion
//#region node_modules/@walletconnect/jsonrpc-utils/dist/esm/url.js
var HTTP_REGEX = "^https?:";
var WS_REGEX = "^wss?:";
function getUrlProtocol(url) {
	const matches = url.match(/* @__PURE__ */ new RegExp(/^\w+:/, "gi"));
	if (!matches || !matches.length) return;
	return matches[0];
}
function matchRegexProtocol(url, regex) {
	const protocol = getUrlProtocol(url);
	if (typeof protocol === "undefined") return false;
	return new RegExp(regex).test(protocol);
}
function isHttpUrl(url) {
	return matchRegexProtocol(url, HTTP_REGEX);
}
function isWsUrl(url) {
	return matchRegexProtocol(url, WS_REGEX);
}
function isLocalhostUrl(url) {
	return (/* @__PURE__ */ new RegExp("wss?://localhost(:d{2,5})?")).test(url);
}
//#endregion
//#region node_modules/@walletconnect/jsonrpc-utils/dist/esm/validators.js
function isJsonRpcPayload(payload) {
	return typeof payload === "object" && "id" in payload && "jsonrpc" in payload && payload.jsonrpc === "2.0";
}
function isJsonRpcRequest$1(payload) {
	return isJsonRpcPayload(payload) && "method" in payload;
}
function isJsonRpcResponse(payload) {
	return isJsonRpcPayload(payload) && (isJsonRpcResult(payload) || isJsonRpcError(payload));
}
function isJsonRpcResult(payload) {
	return "result" in payload;
}
function isJsonRpcError(payload) {
	return "error" in payload;
}
function isJsonRpcValidationInvalid(validation) {
	return "error" in validation && validation.valid === false;
}
__reExport(/* @__PURE__ */ __exportAll({
	DEFAULT_ERROR: () => DEFAULT_ERROR,
	IBaseJsonRpcProvider: () => n,
	IEvents: () => e,
	IJsonRpcConnection: () => o$1,
	IJsonRpcProvider: () => r$1,
	INTERNAL_ERROR: () => INTERNAL_ERROR,
	INVALID_PARAMS: () => INVALID_PARAMS,
	INVALID_REQUEST: () => INVALID_REQUEST,
	METHOD_NOT_FOUND: () => METHOD_NOT_FOUND,
	PARSE_ERROR: () => PARSE_ERROR,
	RESERVED_ERROR_CODES: () => RESERVED_ERROR_CODES,
	SERVER_ERROR: () => SERVER_ERROR,
	SERVER_ERROR_CODE_RANGE: () => SERVER_ERROR_CODE_RANGE,
	STANDARD_ERROR_MAP: () => STANDARD_ERROR_MAP,
	formatErrorMessage: () => formatErrorMessage,
	formatJsonRpcError: () => formatJsonRpcError,
	formatJsonRpcRequest: () => formatJsonRpcRequest,
	formatJsonRpcResult: () => formatJsonRpcResult,
	getBigIntRpcId: () => getBigIntRpcId,
	getError: () => getError,
	getErrorByCode: () => getErrorByCode,
	isHttpUrl: () => isHttpUrl,
	isJsonRpcError: () => isJsonRpcError,
	isJsonRpcPayload: () => isJsonRpcPayload,
	isJsonRpcRequest: () => isJsonRpcRequest$1,
	isJsonRpcResponse: () => isJsonRpcResponse,
	isJsonRpcResult: () => isJsonRpcResult,
	isJsonRpcValidationInvalid: () => isJsonRpcValidationInvalid,
	isLocalhostUrl: () => isLocalhostUrl,
	isNodeJs: () => isNodeJs,
	isReservedErrorCode: () => isReservedErrorCode,
	isServerErrorCode: () => isServerErrorCode,
	isValidDefaultRoute: () => isValidDefaultRoute,
	isValidErrorCode: () => isValidErrorCode,
	isValidLeadingWildcardRoute: () => isValidLeadingWildcardRoute,
	isValidRoute: () => isValidRoute,
	isValidTrailingWildcardRoute: () => isValidTrailingWildcardRoute,
	isValidWildcardRoute: () => isValidWildcardRoute,
	isWsUrl: () => isWsUrl,
	parseConnectionError: () => parseConnectionError,
	payloadId: () => payloadId$1,
	validateJsonRpcError: () => validateJsonRpcError
}), env_exports$1);
//#endregion
//#region node_modules/@walletconnect/utils/dist/esm/misc.js
function sanitizeHex(hex) {
	return sanitizeHex$1(hex);
}
function removeHexLeadingZeros(hex) {
	return removeHexLeadingZeros$1(addHexPrefix(hex));
}
var payloadId = payloadId$1;
function uuid() {
	return ((a, b) => {
		for (b = a = ""; a++ < 36; b += a * 51 & 52 ? (a ^ 15 ? 8 ^ Math.random() * (a ^ 20 ? 16 : 4) : 4).toString(16) : "-");
		return b;
	})();
}
//#endregion
//#region node_modules/@walletconnect/utils/dist/esm/validators.js
function isEmptyString(value) {
	return value === "" || typeof value === "string" && value.trim() === "";
}
function isEmptyArray(array) {
	return !(array && array.length);
}
function isHexString(value, length) {
	return isHexString$1(value, length);
}
function isJsonRpcRequest(object) {
	return typeof object.method !== "undefined";
}
function isJsonRpcResponseSuccess(object) {
	return typeof object.result !== "undefined";
}
function isJsonRpcResponseError(object) {
	return typeof object.error !== "undefined";
}
function isInternalEvent(object) {
	return typeof object.event !== "undefined";
}
function isReservedEvent(event) {
	return reservedEvents.includes(event) || event.startsWith("wc_");
}
function isSilentPayload(request) {
	if (request.method.startsWith("wc_")) return true;
	if (signingMethods.includes(request.method)) return false;
	return true;
}
//#endregion
//#region node_modules/@walletconnect/utils/dist/esm/ethereum.js
var import_sha3 = require_sha3();
function toChecksumAddress(address) {
	address = removeHexPrefix(address.toLowerCase());
	const hash = removeHexPrefix((0, import_sha3.keccak_256)(convertUtf8ToBuffer(address)));
	let checksum = "";
	for (let i = 0; i < address.length; i++) if (parseInt(hash[i], 16) > 7) checksum += address[i].toUpperCase();
	else checksum += address[i];
	return addHexPrefix(checksum);
}
var isValidAddress = (address) => {
	if (!address) return false;
	else if (address.toLowerCase().substring(0, 2) !== "0x") return false;
	else if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) return false;
	else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) return true;
	else return address === toChecksumAddress(address);
};
function parsePersonalSign(params) {
	if (!isEmptyArray(params) && !isHexString(params[0])) params[0] = convertUtf8ToHex(params[0]);
	return params;
}
function parseTransactionData(txData) {
	if (typeof txData.type !== "undefined" && txData.type !== "0") return txData;
	if (typeof txData.from === "undefined" || !isValidAddress(txData.from)) throw new Error(`Transaction object must include a valid 'from' value.`);
	function parseHexValues(value) {
		let result = value;
		if (typeof value === "number" || typeof value === "string" && !isEmptyString(value)) {
			if (!isHexString(value)) result = convertNumberToHex(value);
			else if (typeof value === "string") result = sanitizeHex(value);
		}
		if (typeof result === "string") result = removeHexLeadingZeros(result);
		return result;
	}
	const txDataRPC = {
		from: sanitizeHex(txData.from),
		to: typeof txData.to === "undefined" ? void 0 : sanitizeHex(txData.to),
		gasPrice: typeof txData.gasPrice === "undefined" ? "" : parseHexValues(txData.gasPrice),
		gas: typeof txData.gas === "undefined" ? typeof txData.gasLimit === "undefined" ? "" : parseHexValues(txData.gasLimit) : parseHexValues(txData.gas),
		value: typeof txData.value === "undefined" ? "" : parseHexValues(txData.value),
		nonce: typeof txData.nonce === "undefined" ? "" : parseHexValues(txData.nonce),
		data: typeof txData.data === "undefined" ? "" : sanitizeHex(txData.data) || "0x"
	};
	const prunable = [
		"gasPrice",
		"gas",
		"value",
		"nonce"
	];
	Object.keys(txDataRPC).forEach((key) => {
		if ((typeof txDataRPC[key] === "undefined" || typeof txDataRPC[key] === "string" && !txDataRPC[key].trim().length) && prunable.includes(key)) delete txDataRPC[key];
	});
	return txDataRPC;
}
//#endregion
//#region node_modules/@walletconnect/utils/dist/esm/payload.js
function formatRpcError(error) {
	const message = error.message || "Failed or Rejected Request";
	let code = -32e3;
	if (error && !error.code) switch (message) {
		case "Parse error":
			code = -32700;
			break;
		case "Invalid request":
			code = -32600;
			break;
		case "Method not found":
			code = -32601;
			break;
		case "Invalid params":
			code = -32602;
			break;
		case "Internal error":
			code = -32603;
			break;
		default:
			code = -32e3;
			break;
	}
	const result = {
		code,
		message
	};
	if (error.data) result.data = error.data;
	return result;
}
//#endregion
//#region node_modules/strict-uri-encode/index.js
var require_strict_uri_encode = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = (str) => encodeURIComponent(str).replace(/[!'()*]/g, (x) => `%${x.charCodeAt(0).toString(16).toUpperCase()}`);
}));
//#endregion
//#region node_modules/decode-uri-component/index.js
var require_decode_uri_component = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var token = "%[a-f0-9]{2}";
	var singleMatcher = new RegExp("(" + token + ")|([^%]+?)", "gi");
	var multiMatcher = new RegExp("(" + token + ")+", "gi");
	function decodeComponents(components, split) {
		try {
			return [decodeURIComponent(components.join(""))];
		} catch (err) {}
		if (components.length === 1) return components;
		split = split || 1;
		var left = components.slice(0, split);
		var right = components.slice(split);
		return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
	}
	function decode(input) {
		try {
			return decodeURIComponent(input);
		} catch (err) {
			var tokens = input.match(singleMatcher) || [];
			for (var i = 1; i < tokens.length; i++) {
				input = decodeComponents(tokens, i).join("");
				tokens = input.match(singleMatcher) || [];
			}
			return input;
		}
	}
	function customDecodeURIComponent(input) {
		var replaceMap = {
			"%FE%FF": "��",
			"%FF%FE": "��"
		};
		var match = multiMatcher.exec(input);
		while (match) {
			try {
				replaceMap[match[0]] = decodeURIComponent(match[0]);
			} catch (err) {
				var result = decode(match[0]);
				if (result !== match[0]) replaceMap[match[0]] = result;
			}
			match = multiMatcher.exec(input);
		}
		replaceMap["%C2"] = "�";
		var entries = Object.keys(replaceMap);
		for (var i = 0; i < entries.length; i++) {
			var key = entries[i];
			input = input.replace(new RegExp(key, "g"), replaceMap[key]);
		}
		return input;
	}
	module.exports = function(encodedURI) {
		if (typeof encodedURI !== "string") throw new TypeError("Expected `encodedURI` to be of type `string`, got `" + typeof encodedURI + "`");
		try {
			encodedURI = encodedURI.replace(/\+/g, " ");
			return decodeURIComponent(encodedURI);
		} catch (err) {
			return customDecodeURIComponent(encodedURI);
		}
	};
}));
//#endregion
//#region node_modules/split-on-first/index.js
var require_split_on_first = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = (string, separator) => {
		if (!(typeof string === "string" && typeof separator === "string")) throw new TypeError("Expected the arguments to be of type `string`");
		if (separator === "") return [string];
		const separatorIndex = string.indexOf(separator);
		if (separatorIndex === -1) return [string];
		return [string.slice(0, separatorIndex), string.slice(separatorIndex + separator.length)];
	};
}));
//#endregion
//#region node_modules/@walletconnect/utils/dist/esm/url.js
var import_query_string = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports) => {
	var strictUriEncode = require_strict_uri_encode();
	var decodeComponent = require_decode_uri_component();
	var splitOnFirst = require_split_on_first();
	var isNullOrUndefined = (value) => value === null || value === void 0;
	function encoderForArrayFormat(options) {
		switch (options.arrayFormat) {
			case "index": return (key) => (result, value) => {
				const index = result.length;
				if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") return result;
				if (value === null) return [...result, [
					encode(key, options),
					"[",
					index,
					"]"
				].join("")];
				return [...result, [
					encode(key, options),
					"[",
					encode(index, options),
					"]=",
					encode(value, options)
				].join("")];
			};
			case "bracket": return (key) => (result, value) => {
				if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") return result;
				if (value === null) return [...result, [encode(key, options), "[]"].join("")];
				return [...result, [
					encode(key, options),
					"[]=",
					encode(value, options)
				].join("")];
			};
			case "comma":
			case "separator": return (key) => (result, value) => {
				if (value === null || value === void 0 || value.length === 0) return result;
				if (result.length === 0) return [[
					encode(key, options),
					"=",
					encode(value, options)
				].join("")];
				return [[result, encode(value, options)].join(options.arrayFormatSeparator)];
			};
			default: return (key) => (result, value) => {
				if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") return result;
				if (value === null) return [...result, encode(key, options)];
				return [...result, [
					encode(key, options),
					"=",
					encode(value, options)
				].join("")];
			};
		}
	}
	function parserForArrayFormat(options) {
		let result;
		switch (options.arrayFormat) {
			case "index": return (key, value, accumulator) => {
				result = /\[(\d*)\]$/.exec(key);
				key = key.replace(/\[\d*\]$/, "");
				if (!result) {
					accumulator[key] = value;
					return;
				}
				if (accumulator[key] === void 0) accumulator[key] = {};
				accumulator[key][result[1]] = value;
			};
			case "bracket": return (key, value, accumulator) => {
				result = /(\[\])$/.exec(key);
				key = key.replace(/\[\]$/, "");
				if (!result) {
					accumulator[key] = value;
					return;
				}
				if (accumulator[key] === void 0) {
					accumulator[key] = [value];
					return;
				}
				accumulator[key] = [].concat(accumulator[key], value);
			};
			case "comma":
			case "separator": return (key, value, accumulator) => {
				accumulator[key] = typeof value === "string" && value.split("").indexOf(options.arrayFormatSeparator) > -1 ? value.split(options.arrayFormatSeparator).map((item) => decode(item, options)) : value === null ? value : decode(value, options);
			};
			default: return (key, value, accumulator) => {
				if (accumulator[key] === void 0) {
					accumulator[key] = value;
					return;
				}
				accumulator[key] = [].concat(accumulator[key], value);
			};
		}
	}
	function validateArrayFormatSeparator(value) {
		if (typeof value !== "string" || value.length !== 1) throw new TypeError("arrayFormatSeparator must be single character string");
	}
	function encode(value, options) {
		if (options.encode) return options.strict ? strictUriEncode(value) : encodeURIComponent(value);
		return value;
	}
	function decode(value, options) {
		if (options.decode) return decodeComponent(value);
		return value;
	}
	function keysSorter(input) {
		if (Array.isArray(input)) return input.sort();
		if (typeof input === "object") return keysSorter(Object.keys(input)).sort((a, b) => Number(a) - Number(b)).map((key) => input[key]);
		return input;
	}
	function removeHash(input) {
		const hashStart = input.indexOf("#");
		if (hashStart !== -1) input = input.slice(0, hashStart);
		return input;
	}
	function getHash(url) {
		let hash = "";
		const hashStart = url.indexOf("#");
		if (hashStart !== -1) hash = url.slice(hashStart);
		return hash;
	}
	function extract(input) {
		input = removeHash(input);
		const queryStart = input.indexOf("?");
		if (queryStart === -1) return "";
		return input.slice(queryStart + 1);
	}
	function parseValue(value, options) {
		if (options.parseNumbers && !Number.isNaN(Number(value)) && typeof value === "string" && value.trim() !== "") value = Number(value);
		else if (options.parseBooleans && value !== null && (value.toLowerCase() === "true" || value.toLowerCase() === "false")) value = value.toLowerCase() === "true";
		return value;
	}
	function parse(input, options) {
		options = Object.assign({
			decode: true,
			sort: true,
			arrayFormat: "none",
			arrayFormatSeparator: ",",
			parseNumbers: false,
			parseBooleans: false
		}, options);
		validateArrayFormatSeparator(options.arrayFormatSeparator);
		const formatter = parserForArrayFormat(options);
		const ret = Object.create(null);
		if (typeof input !== "string") return ret;
		input = input.trim().replace(/^[?#&]/, "");
		if (!input) return ret;
		for (const param of input.split("&")) {
			let [key, value] = splitOnFirst(options.decode ? param.replace(/\+/g, " ") : param, "=");
			value = value === void 0 ? null : ["comma", "separator"].includes(options.arrayFormat) ? value : decode(value, options);
			formatter(decode(key, options), value, ret);
		}
		for (const key of Object.keys(ret)) {
			const value = ret[key];
			if (typeof value === "object" && value !== null) for (const k of Object.keys(value)) value[k] = parseValue(value[k], options);
			else ret[key] = parseValue(value, options);
		}
		if (options.sort === false) return ret;
		return (options.sort === true ? Object.keys(ret).sort() : Object.keys(ret).sort(options.sort)).reduce((result, key) => {
			const value = ret[key];
			if (Boolean(value) && typeof value === "object" && !Array.isArray(value)) result[key] = keysSorter(value);
			else result[key] = value;
			return result;
		}, Object.create(null));
	}
	exports.extract = extract;
	exports.parse = parse;
	exports.stringify = (object, options) => {
		if (!object) return "";
		options = Object.assign({
			encode: true,
			strict: true,
			arrayFormat: "none",
			arrayFormatSeparator: ","
		}, options);
		validateArrayFormatSeparator(options.arrayFormatSeparator);
		const shouldFilter = (key) => options.skipNull && isNullOrUndefined(object[key]) || options.skipEmptyString && object[key] === "";
		const formatter = encoderForArrayFormat(options);
		const objectCopy = {};
		for (const key of Object.keys(object)) if (!shouldFilter(key)) objectCopy[key] = object[key];
		const keys = Object.keys(objectCopy);
		if (options.sort !== false) keys.sort(options.sort);
		return keys.map((key) => {
			const value = object[key];
			if (value === void 0) return "";
			if (value === null) return encode(key, options);
			if (Array.isArray(value)) return value.reduce(formatter(key), []).join("&");
			return encode(key, options) + "=" + encode(value, options);
		}).filter((x) => x.length > 0).join("&");
	};
	exports.parseUrl = (input, options) => {
		options = Object.assign({ decode: true }, options);
		const [url, hash] = splitOnFirst(input, "#");
		return Object.assign({
			url: url.split("?")[0] || "",
			query: parse(extract(input), options)
		}, options && options.parseFragmentIdentifier && hash ? { fragmentIdentifier: decode(hash, options) } : {});
	};
	exports.stringifyUrl = (input, options) => {
		options = Object.assign({
			encode: true,
			strict: true
		}, options);
		const url = removeHash(input.url).split("?")[0] || "";
		const queryFromUrl = exports.extract(input.url);
		const parsedQueryFromUrl = exports.parse(queryFromUrl, { sort: false });
		const query = Object.assign(parsedQueryFromUrl, input.query);
		let queryString = exports.stringify(query, options);
		if (queryString) queryString = `?${queryString}`;
		let hash = getHash(input.url);
		if (input.fragmentIdentifier) hash = `#${encode(input.fragmentIdentifier, options)}`;
		return `${url}${queryString}${hash}`;
	};
})))());
function getQueryString(url) {
	const pathEnd = url.indexOf("?") !== -1 ? url.indexOf("?") : void 0;
	return typeof pathEnd !== "undefined" ? url.substr(pathEnd) : "";
}
function appendToQueryString(queryString, newQueryParams) {
	let queryParams = parseQueryString(queryString);
	queryParams = Object.assign(Object.assign({}, queryParams), newQueryParams);
	queryString = formatQueryString(queryParams);
	return queryString;
}
function parseQueryString(queryString) {
	return import_query_string.parse(queryString);
}
function formatQueryString(queryParams) {
	return import_query_string.stringify(queryParams);
}
//#endregion
//#region node_modules/@walletconnect/utils/dist/esm/session.js
function isWalletConnectSession(object) {
	return typeof object.bridge !== "undefined";
}
function parseWalletConnectUri(str) {
	const pathStart = str.indexOf(":");
	const pathEnd = str.indexOf("?") !== -1 ? str.indexOf("?") : void 0;
	const protocol = str.substring(0, pathStart);
	const path = str.substring(pathStart + 1, pathEnd);
	function parseRequiredParams(path) {
		const values = path.split("@");
		return {
			handshakeTopic: values[0],
			version: parseInt(values[1], 10)
		};
	}
	const requiredParams = parseRequiredParams(path);
	const queryString = typeof pathEnd !== "undefined" ? str.substr(pathEnd) : "";
	function parseQueryParams(queryString) {
		const result = parseQueryString(queryString);
		return {
			key: result.key || "",
			bridge: result.bridge || ""
		};
	}
	const queryParams = parseQueryParams(queryString);
	return Object.assign(Object.assign({ protocol }, requiredParams), queryParams);
}
//#endregion
//#region node_modules/@walletconnect/socket-transport/dist/esm/network.js
var NetworkMonitor = class {
	constructor() {
		this._eventEmitters = [];
		if (typeof window !== "undefined" && typeof window.addEventListener !== "undefined") {
			window.addEventListener("online", () => this.trigger("online"));
			window.addEventListener("offline", () => this.trigger("offline"));
		}
	}
	on(event, callback) {
		this._eventEmitters.push({
			event,
			callback
		});
	}
	trigger(event) {
		let eventEmitters = [];
		if (event) eventEmitters = this._eventEmitters.filter((eventEmitter) => eventEmitter.event === event);
		eventEmitters.forEach((eventEmitter) => {
			eventEmitter.callback();
		});
	}
};
//#endregion
//#region node_modules/ws/browser.js
var require_browser = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function() {
		throw new Error("ws does not work in the browser. Browser clients must use the native WebSocket object");
	};
}));
//#endregion
//#region node_modules/@walletconnect/socket-transport/dist/esm/index.js
var WS = typeof global.WebSocket !== "undefined" ? global.WebSocket : require_browser();
var SocketTransport = class {
	constructor(opts) {
		this.opts = opts;
		this._queue = [];
		this._events = [];
		this._subscriptions = [];
		this._protocol = opts.protocol;
		this._version = opts.version;
		this._url = "";
		this._netMonitor = null;
		this._socket = null;
		this._nextSocket = null;
		this._subscriptions = opts.subscriptions || [];
		this._netMonitor = opts.netMonitor || new NetworkMonitor();
		if (!opts.url || typeof opts.url !== "string") throw new Error("Missing or invalid WebSocket url");
		this._url = opts.url;
		this._netMonitor.on("online", () => this._socketCreate());
	}
	set readyState(value) {}
	get readyState() {
		return this._socket ? this._socket.readyState : -1;
	}
	set connecting(value) {}
	get connecting() {
		return this.readyState === 0;
	}
	set connected(value) {}
	get connected() {
		return this.readyState === 1;
	}
	set closing(value) {}
	get closing() {
		return this.readyState === 2;
	}
	set closed(value) {}
	get closed() {
		return this.readyState === 3;
	}
	open() {
		this._socketCreate();
	}
	close() {
		this._socketClose();
	}
	send(message, topic, silent) {
		if (!topic || typeof topic !== "string") throw new Error("Missing or invalid topic field");
		this._socketSend({
			topic,
			type: "pub",
			payload: message,
			silent: !!silent
		});
	}
	subscribe(topic) {
		this._socketSend({
			topic,
			type: "sub",
			payload: "",
			silent: true
		});
	}
	on(event, callback) {
		this._events.push({
			event,
			callback
		});
	}
	_socketCreate() {
		if (this._nextSocket) return;
		this._nextSocket = new WS(getWebSocketUrl(this._url, this._protocol, this._version));
		if (!this._nextSocket) throw new Error("Failed to create socket");
		this._nextSocket.onmessage = (event) => this._socketReceive(event);
		this._nextSocket.onopen = () => this._socketOpen();
		this._nextSocket.onerror = (event) => this._socketError(event);
		this._nextSocket.onclose = () => {
			setTimeout(() => {
				this._nextSocket = null;
				this._socketCreate();
			}, 1e3);
		};
	}
	_socketOpen() {
		this._socketClose();
		this._socket = this._nextSocket;
		this._nextSocket = null;
		this._queueSubscriptions();
		this._pushQueue();
	}
	_socketClose() {
		if (this._socket) {
			this._socket.onclose = () => {};
			this._socket.close();
		}
	}
	_socketSend(socketMessage) {
		const message = JSON.stringify(socketMessage);
		if (this._socket && this._socket.readyState === 1) this._socket.send(message);
		else {
			this._setToQueue(socketMessage);
			this._socketCreate();
		}
	}
	async _socketReceive(event) {
		let socketMessage;
		try {
			socketMessage = JSON.parse(event.data);
		} catch (error) {
			return;
		}
		this._socketSend({
			topic: socketMessage.topic,
			type: "ack",
			payload: "",
			silent: true
		});
		if (this._socket && this._socket.readyState === 1) {
			const events = this._events.filter((event) => event.event === "message");
			if (events && events.length) events.forEach((event) => event.callback(socketMessage));
		}
	}
	_socketError(e) {
		const events = this._events.filter((event) => event.event === "error");
		if (events && events.length) events.forEach((event) => event.callback(e));
	}
	_queueSubscriptions() {
		this._subscriptions.forEach((topic) => this._queue.push({
			topic,
			type: "sub",
			payload: "",
			silent: true
		}));
		this._subscriptions = this.opts.subscriptions || [];
	}
	_setToQueue(socketMessage) {
		this._queue.push(socketMessage);
	}
	_pushQueue() {
		this._queue.forEach((socketMessage) => this._socketSend(socketMessage));
		this._queue = [];
	}
};
function getWebSocketUrl(_url, protocol, version) {
	var _a, _b;
	const splitUrl = (_url.startsWith("https") ? _url.replace("https", "wss") : _url.startsWith("http") ? _url.replace("http", "ws") : _url).split("?");
	const params = isBrowser() ? {
		protocol,
		version,
		env: "browser",
		host: ((_a = getLocation()) === null || _a === void 0 ? void 0 : _a.host) || ""
	} : {
		protocol,
		version,
		env: ((_b = detectEnv()) === null || _b === void 0 ? void 0 : _b.name) || ""
	};
	const queryString = appendToQueryString(getQueryString(splitUrl[1] || ""), params);
	return splitUrl[0] + "?" + queryString;
}
//#endregion
//#region node_modules/@walletconnect/core/dist/esm/errors.js
var ERROR_SESSION_CONNECTED = "Session currently connected";
var ERROR_SESSION_DISCONNECTED = "Session currently disconnected";
var ERROR_SESSION_REJECTED = "Session Rejected";
var ERROR_MISSING_JSON_RPC = "Missing JSON RPC response";
var ERROR_MISSING_RESULT = `JSON-RPC success response must include "result" field`;
var ERROR_MISSING_ERROR = `JSON-RPC error response must include "error" field`;
var ERROR_MISSING_METHOD = `JSON RPC request must have valid "method" value`;
var ERROR_MISSING_ID = `JSON RPC request must have valid "id" value`;
var ERROR_MISSING_REQUIRED = "Missing one of the required parameters: bridge / uri / session";
var ERROR_INVALID_RESPONSE = "JSON RPC response format is invalid";
var ERROR_INVALID_URI = "URI format is invalid";
var ERROR_QRCODE_MODAL_NOT_PROVIDED = "QRCode Modal not provided";
var ERROR_QRCODE_MODAL_USER_CLOSED = "User close QRCode Modal";
//#endregion
//#region node_modules/@walletconnect/core/dist/esm/events.js
var EventManager = class {
	constructor() {
		this._eventEmitters = [];
	}
	subscribe(eventEmitter) {
		this._eventEmitters.push(eventEmitter);
	}
	unsubscribe(event) {
		this._eventEmitters = this._eventEmitters.filter((x) => x.event !== event);
	}
	trigger(payload) {
		let eventEmitters = [];
		let event;
		if (isJsonRpcRequest(payload)) event = payload.method;
		else if (isJsonRpcResponseSuccess(payload) || isJsonRpcResponseError(payload)) event = `response:${payload.id}`;
		else if (isInternalEvent(payload)) event = payload.event;
		else event = "";
		if (event) eventEmitters = this._eventEmitters.filter((eventEmitter) => eventEmitter.event === event);
		if ((!eventEmitters || !eventEmitters.length) && !isReservedEvent(event) && !isInternalEvent(event)) eventEmitters = this._eventEmitters.filter((eventEmitter) => eventEmitter.event === "call_request");
		eventEmitters.forEach((eventEmitter) => {
			if (isJsonRpcResponseError(payload)) {
				const error = new Error(payload.error.message);
				eventEmitter.callback(error, null);
			} else eventEmitter.callback(null, payload);
		});
	}
};
//#endregion
//#region node_modules/@walletconnect/core/dist/esm/storage.js
var SessionStorage = class {
	constructor(storageId = "walletconnect") {
		this.storageId = storageId;
	}
	getSession() {
		let session = null;
		const json = getLocal(this.storageId);
		if (json && isWalletConnectSession(json)) session = json;
		return session;
	}
	setSession(session) {
		setLocal(this.storageId, session);
		return session;
	}
	removeSession() {
		removeLocal(this.storageId);
	}
};
//#endregion
//#region node_modules/@walletconnect/core/dist/esm/url.js
var domain = "walletconnect.org";
var bridges = "abcdefghijklmnopqrstuvwxyz0123456789".split("").map((char) => `https://${char}.bridge.walletconnect.org`);
function extractHostname(url) {
	let hostname = url.indexOf("//") > -1 ? url.split("/")[2] : url.split("/")[0];
	hostname = hostname.split(":")[0];
	hostname = hostname.split("?")[0];
	return hostname;
}
function extractRootDomain(url) {
	return extractHostname(url).split(".").slice(-2).join(".");
}
function randomBridgeIndex() {
	return Math.floor(Math.random() * bridges.length);
}
function selectRandomBridgeUrl() {
	return bridges[randomBridgeIndex()];
}
function shouldSelectRandomly(url) {
	return extractRootDomain(url) === domain;
}
function getBridgeUrl(url) {
	if (shouldSelectRandomly(url)) return selectRandomBridgeUrl();
	return url;
}
//#endregion
//#region node_modules/@walletconnect/core/dist/esm/index.js
var Connector = class {
	constructor(opts) {
		this.protocol = "wc";
		this.version = 1;
		this._bridge = "";
		this._key = null;
		this._clientId = "";
		this._clientMeta = null;
		this._peerId = "";
		this._peerMeta = null;
		this._handshakeId = 0;
		this._handshakeTopic = "";
		this._connected = false;
		this._accounts = [];
		this._chainId = 0;
		this._networkId = 0;
		this._rpcUrl = "";
		this._eventManager = new EventManager();
		this._clientMeta = getClientMeta() || opts.connectorOpts.clientMeta || null;
		this._cryptoLib = opts.cryptoLib;
		this._sessionStorage = opts.sessionStorage || new SessionStorage(opts.connectorOpts.storageId);
		this._qrcodeModal = opts.connectorOpts.qrcodeModal;
		this._qrcodeModalOptions = opts.connectorOpts.qrcodeModalOptions;
		this._signingMethods = [...signingMethods, ...opts.connectorOpts.signingMethods || []];
		if (!opts.connectorOpts.bridge && !opts.connectorOpts.uri && !opts.connectorOpts.session) throw new Error(ERROR_MISSING_REQUIRED);
		if (opts.connectorOpts.bridge) this.bridge = getBridgeUrl(opts.connectorOpts.bridge);
		if (opts.connectorOpts.uri) this.uri = opts.connectorOpts.uri;
		const session = opts.connectorOpts.session || this._getStorageSession();
		if (session) this.session = session;
		if (this.handshakeId) this._subscribeToSessionResponse(this.handshakeId, "Session request rejected");
		this._transport = opts.transport || new SocketTransport({
			protocol: this.protocol,
			version: this.version,
			url: this.bridge,
			subscriptions: [this.clientId]
		});
		this._subscribeToInternalEvents();
		this._initTransport();
		if (opts.connectorOpts.uri) this._subscribeToSessionRequest();
		if (opts.pushServerOpts) this._registerPushServer(opts.pushServerOpts);
	}
	set bridge(value) {
		if (!value) return;
		this._bridge = value;
	}
	get bridge() {
		return this._bridge;
	}
	set key(value) {
		if (!value) return;
		this._key = convertHexToArrayBuffer(value);
	}
	get key() {
		if (this._key) return convertArrayBufferToHex(this._key, true);
		return "";
	}
	set clientId(value) {
		if (!value) return;
		this._clientId = value;
	}
	get clientId() {
		let clientId = this._clientId;
		if (!clientId) clientId = this._clientId = uuid();
		return this._clientId;
	}
	set peerId(value) {
		if (!value) return;
		this._peerId = value;
	}
	get peerId() {
		return this._peerId;
	}
	set clientMeta(value) {}
	get clientMeta() {
		let clientMeta = this._clientMeta;
		if (!clientMeta) clientMeta = this._clientMeta = getClientMeta();
		return clientMeta;
	}
	set peerMeta(value) {
		this._peerMeta = value;
	}
	get peerMeta() {
		return this._peerMeta;
	}
	set handshakeTopic(value) {
		if (!value) return;
		this._handshakeTopic = value;
	}
	get handshakeTopic() {
		return this._handshakeTopic;
	}
	set handshakeId(value) {
		if (!value) return;
		this._handshakeId = value;
	}
	get handshakeId() {
		return this._handshakeId;
	}
	get uri() {
		return this._formatUri();
	}
	set uri(value) {
		if (!value) return;
		const { handshakeTopic, bridge, key } = this._parseUri(value);
		this.handshakeTopic = handshakeTopic;
		this.bridge = bridge;
		this.key = key;
	}
	set chainId(value) {
		this._chainId = value;
	}
	get chainId() {
		return this._chainId;
	}
	set networkId(value) {
		this._networkId = value;
	}
	get networkId() {
		return this._networkId;
	}
	set accounts(value) {
		this._accounts = value;
	}
	get accounts() {
		return this._accounts;
	}
	set rpcUrl(value) {
		this._rpcUrl = value;
	}
	get rpcUrl() {
		return this._rpcUrl;
	}
	set connected(value) {}
	get connected() {
		return this._connected;
	}
	set pending(value) {}
	get pending() {
		return !!this._handshakeTopic;
	}
	get session() {
		return {
			connected: this.connected,
			accounts: this.accounts,
			chainId: this.chainId,
			bridge: this.bridge,
			key: this.key,
			clientId: this.clientId,
			clientMeta: this.clientMeta,
			peerId: this.peerId,
			peerMeta: this.peerMeta,
			handshakeId: this.handshakeId,
			handshakeTopic: this.handshakeTopic
		};
	}
	set session(value) {
		if (!value) return;
		this._connected = value.connected;
		this.accounts = value.accounts;
		this.chainId = value.chainId;
		this.bridge = value.bridge;
		this.key = value.key;
		this.clientId = value.clientId;
		this.clientMeta = value.clientMeta;
		this.peerId = value.peerId;
		this.peerMeta = value.peerMeta;
		this.handshakeId = value.handshakeId;
		this.handshakeTopic = value.handshakeTopic;
	}
	on(event, callback) {
		const eventEmitter = {
			event,
			callback
		};
		this._eventManager.subscribe(eventEmitter);
	}
	off(event) {
		this._eventManager.unsubscribe(event);
	}
	async createInstantRequest(instantRequest) {
		this._key = await this._generateKey();
		const request = this._formatRequest({
			method: "wc_instantRequest",
			params: [{
				peerId: this.clientId,
				peerMeta: this.clientMeta,
				request: this._formatRequest(instantRequest)
			}]
		});
		this.handshakeId = request.id;
		this.handshakeTopic = uuid();
		this._eventManager.trigger({
			event: "display_uri",
			params: [this.uri]
		});
		this.on("modal_closed", () => {
			throw new Error(ERROR_QRCODE_MODAL_USER_CLOSED);
		});
		const endInstantRequest = () => {
			this.killSession();
		};
		try {
			const result = await this._sendCallRequest(request);
			if (result) endInstantRequest();
			return result;
		} catch (error) {
			endInstantRequest();
			throw error;
		}
	}
	async connect(opts) {
		if (!this._qrcodeModal) throw new Error(ERROR_QRCODE_MODAL_NOT_PROVIDED);
		if (this.connected) return {
			chainId: this.chainId,
			accounts: this.accounts
		};
		await this.createSession(opts);
		return new Promise(async (resolve, reject) => {
			this.on("modal_closed", () => reject(new Error(ERROR_QRCODE_MODAL_USER_CLOSED)));
			this.on("connect", (error, payload) => {
				if (error) return reject(error);
				resolve(payload.params[0]);
			});
		});
	}
	async createSession(opts) {
		if (this._connected) throw new Error(ERROR_SESSION_CONNECTED);
		if (this.pending) return;
		this._key = await this._generateKey();
		const request = this._formatRequest({
			method: "wc_sessionRequest",
			params: [{
				peerId: this.clientId,
				peerMeta: this.clientMeta,
				chainId: opts && opts.chainId ? opts.chainId : null
			}]
		});
		this.handshakeId = request.id;
		this.handshakeTopic = uuid();
		this._sendSessionRequest(request, "Session update rejected", { topic: this.handshakeTopic });
		this._eventManager.trigger({
			event: "display_uri",
			params: [this.uri]
		});
	}
	approveSession(sessionStatus) {
		if (this._connected) throw new Error(ERROR_SESSION_CONNECTED);
		this.chainId = sessionStatus.chainId;
		this.accounts = sessionStatus.accounts;
		this.networkId = sessionStatus.networkId || 0;
		this.rpcUrl = sessionStatus.rpcUrl || "";
		const sessionParams = {
			approved: true,
			chainId: this.chainId,
			networkId: this.networkId,
			accounts: this.accounts,
			rpcUrl: this.rpcUrl,
			peerId: this.clientId,
			peerMeta: this.clientMeta
		};
		const response = {
			id: this.handshakeId,
			jsonrpc: "2.0",
			result: sessionParams
		};
		this._sendResponse(response);
		this._connected = true;
		this._setStorageSession();
		this._eventManager.trigger({
			event: "connect",
			params: [{
				peerId: this.peerId,
				peerMeta: this.peerMeta,
				chainId: this.chainId,
				accounts: this.accounts
			}]
		});
	}
	rejectSession(sessionError) {
		if (this._connected) throw new Error(ERROR_SESSION_CONNECTED);
		const message = sessionError && sessionError.message ? sessionError.message : ERROR_SESSION_REJECTED;
		const response = this._formatResponse({
			id: this.handshakeId,
			error: { message }
		});
		this._sendResponse(response);
		this._connected = false;
		this._eventManager.trigger({
			event: "disconnect",
			params: [{ message }]
		});
		this._removeStorageSession();
	}
	updateSession(sessionStatus) {
		if (!this._connected) throw new Error(ERROR_SESSION_DISCONNECTED);
		this.chainId = sessionStatus.chainId;
		this.accounts = sessionStatus.accounts;
		this.networkId = sessionStatus.networkId || 0;
		this.rpcUrl = sessionStatus.rpcUrl || "";
		const sessionParams = {
			approved: true,
			chainId: this.chainId,
			networkId: this.networkId,
			accounts: this.accounts,
			rpcUrl: this.rpcUrl
		};
		const request = this._formatRequest({
			method: "wc_sessionUpdate",
			params: [sessionParams]
		});
		this._sendSessionRequest(request, "Session update rejected");
		this._eventManager.trigger({
			event: "session_update",
			params: [{
				chainId: this.chainId,
				accounts: this.accounts
			}]
		});
		this._manageStorageSession();
	}
	async killSession(sessionError) {
		const message = sessionError ? sessionError.message : "Session Disconnected";
		const request = this._formatRequest({
			method: "wc_sessionUpdate",
			params: [{
				approved: false,
				chainId: null,
				networkId: null,
				accounts: null
			}]
		});
		await this._sendRequest(request);
		this._handleSessionDisconnect(message);
	}
	async sendTransaction(tx) {
		if (!this._connected) throw new Error(ERROR_SESSION_DISCONNECTED);
		const parsedTx = parseTransactionData(tx);
		const request = this._formatRequest({
			method: "eth_sendTransaction",
			params: [parsedTx]
		});
		return await this._sendCallRequest(request);
	}
	async signTransaction(tx) {
		if (!this._connected) throw new Error(ERROR_SESSION_DISCONNECTED);
		const parsedTx = parseTransactionData(tx);
		const request = this._formatRequest({
			method: "eth_signTransaction",
			params: [parsedTx]
		});
		return await this._sendCallRequest(request);
	}
	async signMessage(params) {
		if (!this._connected) throw new Error(ERROR_SESSION_DISCONNECTED);
		const request = this._formatRequest({
			method: "eth_sign",
			params
		});
		return await this._sendCallRequest(request);
	}
	async signPersonalMessage(params) {
		if (!this._connected) throw new Error(ERROR_SESSION_DISCONNECTED);
		params = parsePersonalSign(params);
		const request = this._formatRequest({
			method: "personal_sign",
			params
		});
		return await this._sendCallRequest(request);
	}
	async signTypedData(params) {
		if (!this._connected) throw new Error(ERROR_SESSION_DISCONNECTED);
		const request = this._formatRequest({
			method: "eth_signTypedData",
			params
		});
		return await this._sendCallRequest(request);
	}
	async updateChain(chainParams) {
		if (!this._connected) throw new Error("Session currently disconnected");
		const request = this._formatRequest({
			method: "wallet_updateChain",
			params: [chainParams]
		});
		return await this._sendCallRequest(request);
	}
	unsafeSend(request, options) {
		this._sendRequest(request, options);
		this._eventManager.trigger({
			event: "call_request_sent",
			params: [{
				request,
				options
			}]
		});
		return new Promise((resolve, reject) => {
			this._subscribeToResponse(request.id, (error, payload) => {
				if (error) {
					reject(error);
					return;
				}
				if (!payload) throw new Error(ERROR_MISSING_JSON_RPC);
				resolve(payload);
			});
		});
	}
	async sendCustomRequest(request, options) {
		if (!this._connected) throw new Error(ERROR_SESSION_DISCONNECTED);
		switch (request.method) {
			case "eth_accounts": return this.accounts;
			case "eth_chainId": return convertNumberToHex(this.chainId);
			case "eth_sendTransaction":
			case "eth_signTransaction":
				if (request.params) request.params[0] = parseTransactionData(request.params[0]);
				break;
			case "personal_sign":
				if (request.params) request.params = parsePersonalSign(request.params);
				break;
			default: break;
		}
		const formattedRequest = this._formatRequest(request);
		return await this._sendCallRequest(formattedRequest, options);
	}
	approveRequest(response) {
		if (isJsonRpcResponseSuccess(response)) {
			const formattedResponse = this._formatResponse(response);
			this._sendResponse(formattedResponse);
		} else throw new Error(ERROR_MISSING_RESULT);
	}
	rejectRequest(response) {
		if (isJsonRpcResponseError(response)) {
			const formattedResponse = this._formatResponse(response);
			this._sendResponse(formattedResponse);
		} else throw new Error(ERROR_MISSING_ERROR);
	}
	transportClose() {
		this._transport.close();
	}
	async _sendRequest(request, options) {
		const callRequest = this._formatRequest(request);
		const encryptionPayload = await this._encrypt(callRequest);
		const topic = typeof (options === null || options === void 0 ? void 0 : options.topic) !== "undefined" ? options.topic : this.peerId;
		const payload = JSON.stringify(encryptionPayload);
		const silent = typeof (options === null || options === void 0 ? void 0 : options.forcePushNotification) !== "undefined" ? !options.forcePushNotification : isSilentPayload(callRequest);
		this._transport.send(payload, topic, silent);
	}
	async _sendResponse(response) {
		const encryptionPayload = await this._encrypt(response);
		const topic = this.peerId;
		const payload = JSON.stringify(encryptionPayload);
		this._transport.send(payload, topic, true);
	}
	async _sendSessionRequest(request, errorMsg, options) {
		this._sendRequest(request, options);
		this._subscribeToSessionResponse(request.id, errorMsg);
	}
	_sendCallRequest(request, options) {
		this._sendRequest(request, options);
		this._eventManager.trigger({
			event: "call_request_sent",
			params: [{
				request,
				options
			}]
		});
		return this._subscribeToCallResponse(request.id);
	}
	_formatRequest(request) {
		if (typeof request.method === "undefined") throw new Error(ERROR_MISSING_METHOD);
		return {
			id: typeof request.id === "undefined" ? payloadId() : request.id,
			jsonrpc: "2.0",
			method: request.method,
			params: typeof request.params === "undefined" ? [] : request.params
		};
	}
	_formatResponse(response) {
		if (typeof response.id === "undefined") throw new Error(ERROR_MISSING_ID);
		const baseResponse = {
			id: response.id,
			jsonrpc: "2.0"
		};
		if (isJsonRpcResponseError(response)) {
			const error = formatRpcError(response.error);
			return Object.assign(Object.assign(Object.assign({}, baseResponse), response), { error });
		} else if (isJsonRpcResponseSuccess(response)) return Object.assign(Object.assign({}, baseResponse), response);
		throw new Error(ERROR_INVALID_RESPONSE);
	}
	_handleSessionDisconnect(errorMsg) {
		const message = errorMsg || "Session Disconnected";
		if (!this._connected) {
			if (this._qrcodeModal) this._qrcodeModal.close();
			removeLocal(mobileLinkChoiceKey);
		}
		if (this._connected) this._connected = false;
		if (this._handshakeId) this._handshakeId = 0;
		if (this._handshakeTopic) this._handshakeTopic = "";
		if (this._peerId) this._peerId = "";
		this._eventManager.trigger({
			event: "disconnect",
			params: [{ message }]
		});
		this._removeStorageSession();
		this.transportClose();
	}
	_handleSessionResponse(errorMsg, sessionParams) {
		if (sessionParams) if (sessionParams.approved) {
			if (!this._connected) {
				this._connected = true;
				if (sessionParams.chainId) this.chainId = sessionParams.chainId;
				if (sessionParams.accounts) this.accounts = sessionParams.accounts;
				if (sessionParams.peerId && !this.peerId) this.peerId = sessionParams.peerId;
				if (sessionParams.peerMeta && !this.peerMeta) this.peerMeta = sessionParams.peerMeta;
				this._eventManager.trigger({
					event: "connect",
					params: [{
						peerId: this.peerId,
						peerMeta: this.peerMeta,
						chainId: this.chainId,
						accounts: this.accounts
					}]
				});
			} else {
				if (sessionParams.chainId) this.chainId = sessionParams.chainId;
				if (sessionParams.accounts) this.accounts = sessionParams.accounts;
				this._eventManager.trigger({
					event: "session_update",
					params: [{
						chainId: this.chainId,
						accounts: this.accounts
					}]
				});
			}
			this._manageStorageSession();
		} else this._handleSessionDisconnect(errorMsg);
		else this._handleSessionDisconnect(errorMsg);
	}
	async _handleIncomingMessages(socketMessage) {
		if (![this.clientId, this.handshakeTopic].includes(socketMessage.topic)) return;
		let encryptionPayload;
		try {
			encryptionPayload = JSON.parse(socketMessage.payload);
		} catch (error) {
			return;
		}
		const payload = await this._decrypt(encryptionPayload);
		if (payload) this._eventManager.trigger(payload);
	}
	_subscribeToSessionRequest() {
		this._transport.subscribe(this.handshakeTopic);
	}
	_subscribeToResponse(id, callback) {
		this.on(`response:${id}`, callback);
	}
	_subscribeToSessionResponse(id, errorMsg) {
		this._subscribeToResponse(id, (error, payload) => {
			if (error) {
				this._handleSessionResponse(error.message);
				return;
			}
			if (isJsonRpcResponseSuccess(payload)) this._handleSessionResponse(errorMsg, payload.result);
			else if (payload.error && payload.error.message) this._handleSessionResponse(payload.error.message);
			else this._handleSessionResponse(errorMsg);
		});
	}
	_subscribeToCallResponse(id) {
		return new Promise((resolve, reject) => {
			this._subscribeToResponse(id, (error, payload) => {
				if (error) {
					reject(error);
					return;
				}
				if (isJsonRpcResponseSuccess(payload)) resolve(payload.result);
				else if (payload.error && payload.error.message) reject(payload.error);
				else reject(new Error(ERROR_INVALID_RESPONSE));
			});
		});
	}
	_subscribeToInternalEvents() {
		this.on("display_uri", () => {
			if (this._qrcodeModal) this._qrcodeModal.open(this.uri, () => {
				this._eventManager.trigger({
					event: "modal_closed",
					params: []
				});
			}, this._qrcodeModalOptions);
		});
		this.on("connect", () => {
			if (this._qrcodeModal) this._qrcodeModal.close();
		});
		this.on("call_request_sent", (error, payload) => {
			const { request } = payload.params[0];
			if (isMobile() && this._signingMethods.includes(request.method)) {
				const mobileLinkUrl = getLocal(mobileLinkChoiceKey);
				if (mobileLinkUrl) window.location.href = mobileLinkUrl.href;
			}
		});
		this.on("wc_sessionRequest", (error, payload) => {
			if (error) this._eventManager.trigger({
				event: "error",
				params: [{
					code: "SESSION_REQUEST_ERROR",
					message: error.toString()
				}]
			});
			this.handshakeId = payload.id;
			this.peerId = payload.params[0].peerId;
			this.peerMeta = payload.params[0].peerMeta;
			const internalPayload = Object.assign(Object.assign({}, payload), { method: "session_request" });
			this._eventManager.trigger(internalPayload);
		});
		this.on("wc_sessionUpdate", (error, payload) => {
			if (error) this._handleSessionResponse(error.message);
			this._handleSessionResponse("Session disconnected", payload.params[0]);
		});
	}
	_initTransport() {
		this._transport.on("message", (socketMessage) => this._handleIncomingMessages(socketMessage));
		this._transport.on("open", () => this._eventManager.trigger({
			event: "transport_open",
			params: []
		}));
		this._transport.on("close", () => this._eventManager.trigger({
			event: "transport_close",
			params: []
		}));
		this._transport.on("error", () => this._eventManager.trigger({
			event: "transport_error",
			params: ["Websocket connection failed"]
		}));
		this._transport.open();
	}
	_formatUri() {
		return `${this.protocol}:${this.handshakeTopic}@${this.version}?bridge=${encodeURIComponent(this.bridge)}&key=${this.key}`;
	}
	_parseUri(uri) {
		const result = parseWalletConnectUri(uri);
		if (result.protocol === this.protocol) {
			if (!result.handshakeTopic) throw Error("Invalid or missing handshakeTopic parameter value");
			const handshakeTopic = result.handshakeTopic;
			if (!result.bridge) throw Error("Invalid or missing bridge url parameter value");
			const bridge = decodeURIComponent(result.bridge);
			if (!result.key) throw Error("Invalid or missing key parameter value");
			return {
				handshakeTopic,
				bridge,
				key: result.key
			};
		} else throw new Error(ERROR_INVALID_URI);
	}
	async _generateKey() {
		if (this._cryptoLib) return await this._cryptoLib.generateKey();
		return null;
	}
	async _encrypt(data) {
		const key = this._key;
		if (this._cryptoLib && key) return await this._cryptoLib.encrypt(data, key);
		return null;
	}
	async _decrypt(payload) {
		const key = this._key;
		if (this._cryptoLib && key) return await this._cryptoLib.decrypt(payload, key);
		return null;
	}
	_getStorageSession() {
		let result = null;
		if (this._sessionStorage) result = this._sessionStorage.getSession();
		return result;
	}
	_setStorageSession() {
		if (this._sessionStorage) this._sessionStorage.setSession(this.session);
	}
	_removeStorageSession() {
		if (this._sessionStorage) this._sessionStorage.removeSession();
	}
	_manageStorageSession() {
		if (this._connected) this._setStorageSession();
		else this._removeStorageSession();
	}
	_registerPushServer(pushServerOpts) {
		if (!pushServerOpts.url || typeof pushServerOpts.url !== "string") throw Error("Invalid or missing pushServerOpts.url parameter value");
		if (!pushServerOpts.type || typeof pushServerOpts.type !== "string") throw Error("Invalid or missing pushServerOpts.type parameter value");
		if (!pushServerOpts.token || typeof pushServerOpts.token !== "string") throw Error("Invalid or missing pushServerOpts.token parameter value");
		const pushSubscription = {
			bridge: this.bridge,
			topic: this.clientId,
			type: pushServerOpts.type,
			token: pushServerOpts.token,
			peerName: "",
			language: pushServerOpts.language || ""
		};
		this.on("connect", async (error, payload) => {
			if (error) throw error;
			if (pushServerOpts.peerMeta) pushSubscription.peerName = payload.params[0].peerMeta.name;
			try {
				if (!(await (await fetch(`${pushServerOpts.url}/new`, {
					method: "POST",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json"
					},
					body: JSON.stringify(pushSubscription)
				})).json()).success) throw Error("Failed to register in Push Server");
			} catch (error) {
				throw Error("Failed to register in Push Server");
			}
		});
	}
};
//#endregion
//#region node_modules/@walletconnect/randombytes/dist/esm/browser/index.js
function randomBytes(length) {
	return import_cjs.getBrowerCrypto().getRandomValues(new Uint8Array(length));
}
var LENGTH_1024 = 1024;
//#endregion
//#region node_modules/@walletconnect/crypto/dist/esm/constants/default.js
var AES_LENGTH = 256;
var HMAC_LENGTH = 256;
var AES_BROWSER_ALGO = "AES-CBC";
var HMAC_BROWSER_ALGO = `SHA-${AES_LENGTH}`;
var HMAC_BROWSER = "HMAC";
var SHA256_BROWSER_ALGO = "SHA-256";
var SHA512_BROWSER_ALGO = "SHA-512";
var AES_NODE_ALGO = `aes-${AES_LENGTH}-cbc`;
var HMAC_NODE_ALGO = `sha${HMAC_LENGTH}`;
var SHA256_NODE_ALGO = "sha256";
var SHA512_NODE_ALGO = "sha512";
var RIPEMD160_NODE_ALGO = "ripemd160";
var PREFIX_LENGTH = 1;
var KEY_LENGTH = 32;
var IV_LENGTH = 16;
var MAC_LENGTH = 32;
var UTF8_ENC = "utf8";
//#endregion
//#region node_modules/@walletconnect/crypto/dist/esm/constants/error.js
var ERROR_BAD_MAC = "Bad MAC";
//#endregion
//#region node_modules/@walletconnect/crypto/dist/esm/constants/operations.js
var ENCRYPT_OP = "encrypt";
var DECRYPT_OP = "decrypt";
var SIGN_OP = "sign";
var VERIFY_OP = "verify";
//#endregion
//#region node_modules/@walletconnect/crypto/dist/esm/lib/browser.js
function getAlgo(type) {
	return type === "AES-CBC" ? {
		length: AES_LENGTH,
		name: AES_BROWSER_ALGO
	} : {
		hash: { name: HMAC_BROWSER_ALGO },
		name: HMAC_BROWSER
	};
}
function getOps(type) {
	return type === "AES-CBC" ? [ENCRYPT_OP, DECRYPT_OP] : [SIGN_OP, VERIFY_OP];
}
async function browserImportKey(buffer, type = AES_BROWSER_ALGO) {
	return import_cjs.getSubtleCrypto().importKey("raw", buffer, getAlgo(type), true, getOps(type));
}
async function browserAesEncrypt(iv, key, data) {
	const subtle = import_cjs.getSubtleCrypto();
	const cryptoKey = await browserImportKey(key, AES_BROWSER_ALGO);
	const result = await subtle.encrypt({
		iv,
		name: AES_BROWSER_ALGO
	}, cryptoKey, data);
	return new Uint8Array(result);
}
async function browserAesDecrypt(iv, key, data) {
	const subtle = import_cjs.getSubtleCrypto();
	const cryptoKey = await browserImportKey(key, AES_BROWSER_ALGO);
	const result = await subtle.decrypt({
		iv,
		name: AES_BROWSER_ALGO
	}, cryptoKey, data);
	return new Uint8Array(result);
}
async function browserHmacSha256Sign(key, data) {
	const subtle = import_cjs.getSubtleCrypto();
	const cryptoKey = await browserImportKey(key, HMAC_BROWSER);
	const signature = await subtle.sign({
		length: HMAC_LENGTH,
		name: HMAC_BROWSER
	}, cryptoKey, data);
	return new Uint8Array(signature);
}
async function browserHmacSha512Sign(key, data) {
	const subtle = import_cjs.getSubtleCrypto();
	const cryptoKey = await browserImportKey(key, HMAC_BROWSER);
	const signature = await subtle.sign({
		length: 512,
		name: HMAC_BROWSER
	}, cryptoKey, data);
	return new Uint8Array(signature);
}
async function browserSha256(data) {
	const result = await import_cjs.getSubtleCrypto().digest({ name: SHA256_BROWSER_ALGO }, data);
	return new Uint8Array(result);
}
async function browserSha512(data) {
	const result = await import_cjs.getSubtleCrypto().digest({ name: SHA512_BROWSER_ALGO }, data);
	return new Uint8Array(result);
}
//#endregion
//#region node_modules/@walletconnect/crypto/dist/esm/browser/aes.js
function aesCbcEncrypt(iv, key, data) {
	return browserAesEncrypt(iv, key, data);
}
function aesCbcDecrypt(iv, key, data) {
	return browserAesDecrypt(iv, key, data);
}
//#endregion
//#region node_modules/@walletconnect/crypto/dist/esm/helpers/env.js
var env_exports = /* @__PURE__ */ __exportAll({});
__reExport(env_exports, /* @__PURE__ */ __toESM(require_cjs()));
//#endregion
//#region node_modules/@walletconnect/crypto/dist/esm/helpers/pkcs7.js
var PADDING = [
	[
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16,
		16
	],
	[
		15,
		15,
		15,
		15,
		15,
		15,
		15,
		15,
		15,
		15,
		15,
		15,
		15,
		15,
		15
	],
	[
		14,
		14,
		14,
		14,
		14,
		14,
		14,
		14,
		14,
		14,
		14,
		14,
		14,
		14
	],
	[
		13,
		13,
		13,
		13,
		13,
		13,
		13,
		13,
		13,
		13,
		13,
		13,
		13
	],
	[
		12,
		12,
		12,
		12,
		12,
		12,
		12,
		12,
		12,
		12,
		12,
		12
	],
	[
		11,
		11,
		11,
		11,
		11,
		11,
		11,
		11,
		11,
		11,
		11
	],
	[
		10,
		10,
		10,
		10,
		10,
		10,
		10,
		10,
		10,
		10
	],
	[
		9,
		9,
		9,
		9,
		9,
		9,
		9,
		9,
		9
	],
	[
		8,
		8,
		8,
		8,
		8,
		8,
		8,
		8
	],
	[
		7,
		7,
		7,
		7,
		7,
		7,
		7
	],
	[
		6,
		6,
		6,
		6,
		6,
		6
	],
	[
		5,
		5,
		5,
		5,
		5
	],
	[
		4,
		4,
		4,
		4
	],
	[
		3,
		3,
		3
	],
	[2, 2],
	[1]
];
var pkcs7 = {
	pad(plaintext) {
		const padding = PADDING[plaintext.byteLength % 16 || 0];
		const result = new Uint8Array(plaintext.byteLength + padding.length);
		result.set(plaintext);
		result.set(padding, plaintext.byteLength);
		return result;
	},
	unpad(padded) {
		return padded.subarray(0, padded.byteLength - padded[padded.byteLength - 1]);
	}
};
//#endregion
//#region node_modules/@walletconnect/crypto/dist/esm/helpers/validators.js
function assert(condition, message) {
	if (!condition) throw new Error(message || "Assertion failed");
}
function isConstantTime(arr1, arr2) {
	if (arr1.length !== arr2.length) return false;
	let res = 0;
	for (let i = 0; i < arr1.length; i++) res |= arr1[i] ^ arr2[i];
	return res === 0;
}
//#endregion
//#region node_modules/@walletconnect/crypto/dist/esm/helpers/index.js
var helpers_exports = /* @__PURE__ */ __exportAll({
	assert: () => assert,
	isConstantTime: () => isConstantTime,
	pkcs7: () => pkcs7
});
__reExport(helpers_exports, env_exports);
//#endregion
//#region node_modules/@walletconnect/crypto/dist/esm/browser/hmac.js
async function hmacSha256Sign(key, msg) {
	return await browserHmacSha256Sign(key, msg);
}
async function hmacSha256Verify(key, msg, sig) {
	return isConstantTime(await browserHmacSha256Sign(key, msg), sig);
}
async function hmacSha512Sign(key, msg) {
	return await browserHmacSha512Sign(key, msg);
}
async function hmacSha512Verify(key, msg, sig) {
	return isConstantTime(await browserHmacSha512Sign(key, msg), sig);
}
//#endregion
//#region node_modules/@walletconnect/crypto/dist/esm/browser/sha2.js
async function sha256(msg) {
	return await browserSha256(msg);
}
async function sha512(msg) {
	return await browserSha512(msg);
}
async function ripemd160(_msg) {
	throw new Error("Not supported for Browser async methods, use sync instead!");
}
__reExport(/* @__PURE__ */ __exportAll({
	AES_BROWSER_ALGO: () => AES_BROWSER_ALGO,
	AES_LENGTH: () => AES_LENGTH,
	AES_NODE_ALGO: () => AES_NODE_ALGO,
	DECRYPT_OP: () => DECRYPT_OP,
	ENCRYPT_OP: () => ENCRYPT_OP,
	ERROR_BAD_MAC: () => ERROR_BAD_MAC,
	HEX_ENC: () => "hex",
	HMAC_BROWSER: () => HMAC_BROWSER,
	HMAC_BROWSER_ALGO: () => HMAC_BROWSER_ALGO,
	HMAC_LENGTH: () => HMAC_LENGTH,
	HMAC_NODE_ALGO: () => HMAC_NODE_ALGO,
	IV_LENGTH: () => IV_LENGTH,
	KEY_LENGTH: () => KEY_LENGTH,
	LENGTH_0: () => 0,
	LENGTH_1: () => 1,
	LENGTH_1024: () => LENGTH_1024,
	LENGTH_128: () => 128,
	LENGTH_16: () => 16,
	LENGTH_256: () => 256,
	LENGTH_32: () => 32,
	LENGTH_512: () => 512,
	LENGTH_64: () => 64,
	MAC_LENGTH: () => MAC_LENGTH,
	PREFIX_LENGTH: () => PREFIX_LENGTH,
	RIPEMD160_NODE_ALGO: () => RIPEMD160_NODE_ALGO,
	SHA256_BROWSER_ALGO: () => SHA256_BROWSER_ALGO,
	SHA256_NODE_ALGO: () => SHA256_NODE_ALGO,
	SHA512_BROWSER_ALGO: () => SHA512_BROWSER_ALGO,
	SHA512_NODE_ALGO: () => SHA512_NODE_ALGO,
	SIGN_OP: () => SIGN_OP,
	UTF8_ENC: () => UTF8_ENC,
	VERIFY_OP: () => VERIFY_OP,
	aesCbcDecrypt: () => aesCbcDecrypt,
	aesCbcEncrypt: () => aesCbcEncrypt,
	assert: () => assert,
	hmacSha256Sign: () => hmacSha256Sign,
	hmacSha256Verify: () => hmacSha256Verify,
	hmacSha512Sign: () => hmacSha512Sign,
	hmacSha512Verify: () => hmacSha512Verify,
	isConstantTime: () => isConstantTime,
	pkcs7: () => pkcs7,
	randomBytes: () => randomBytes,
	ripemd160: () => ripemd160,
	sha256: () => sha256,
	sha512: () => sha512
}), helpers_exports);
//#endregion
//#region node_modules/@walletconnect/iso-crypto/dist/esm/index.js
var esm_exports = /* @__PURE__ */ __exportAll({
	decrypt: () => decrypt,
	encrypt: () => encrypt,
	generateKey: () => generateKey,
	verifyHmac: () => verifyHmac
});
async function generateKey(length) {
	return convertBufferToArrayBuffer(arrayToBuffer(randomBytes((length || 256) / 8)));
}
async function verifyHmac(payload, key) {
	const cipherText = hexToArray(payload.data);
	const iv = hexToArray(payload.iv);
	const hmacHex = arrayToHex(hexToArray(payload.hmac), false);
	const chmacHex = arrayToHex(await hmacSha256Sign(key, concatArrays(cipherText, iv)), false);
	if (removeHexPrefix(hmacHex) === removeHexPrefix(chmacHex)) return true;
	return false;
}
async function encrypt(data, key, providedIv) {
	const _key = bufferToArray(convertArrayBufferToBuffer(key));
	const iv = bufferToArray(convertArrayBufferToBuffer(providedIv || await generateKey(128)));
	const ivHex = arrayToHex(iv, false);
	const cipherText = await aesCbcEncrypt(iv, _key, utf8ToArray(JSON.stringify(data)));
	return {
		data: arrayToHex(cipherText, false),
		hmac: arrayToHex(await hmacSha256Sign(_key, concatArrays(cipherText, iv)), false),
		iv: ivHex
	};
}
async function decrypt(payload, key) {
	const _key = bufferToArray(convertArrayBufferToBuffer(key));
	if (!_key) throw new Error("Missing key: required for decryption");
	if (!await verifyHmac(payload, _key)) return null;
	const cipherText = hexToArray(payload.data);
	const utf8 = arrayToUtf8(await aesCbcDecrypt(hexToArray(payload.iv), _key, cipherText));
	let data;
	try {
		data = JSON.parse(utf8);
	} catch (error) {
		return null;
	}
	return data;
}
//#endregion
//#region node_modules/@walletconnect/client/dist/esm/index.js
var WalletConnect = class extends Connector {
	constructor(connectorOpts, pushServerOpts) {
		super({
			cryptoLib: esm_exports,
			connectorOpts,
			pushServerOpts
		});
	}
};
//#endregion
//#region node_modules/tweetnacl-ts/es/array.js
function ByteArray(n) {
	return new Uint8Array(n);
}
function WordArray(n) {
	return new Uint32Array(n);
}
function IntArray(n) {
	return new Int32Array(n);
}
function NumArray(n) {
	return new Float64Array(n);
}
String.fromCharCode;
//#endregion
//#region node_modules/tweetnacl-ts/es/check.js
function checkArrayTypes() {
	var arrays = [];
	for (var _i = 0; _i < arguments.length; _i++) arrays[_i] = arguments[_i];
	for (var _a = 0, arrays_1 = arrays; _a < arrays_1.length; _a++) if (!(arrays_1[_a] instanceof Uint8Array)) throw new TypeError("unexpected type, use ByteArray");
}
//#endregion
//#region node_modules/tweetnacl-ts/es/verify.js
function vn(x, xi, y, yi, n) {
	var i, d = 0;
	for (i = 0; i < n; i++) d |= x[xi + i] ^ y[yi + i];
	return (1 & d - 1 >>> 8) - 1;
}
function _verify_32(x, xi, y, yi) {
	return vn(x, xi, y, yi, 32);
}
//#endregion
//#region node_modules/tweetnacl-ts/es/core.js
function gf(init) {
	var r = NumArray(16);
	if (init) for (var i = 0; i < init.length; i++) r[i] = init[i];
	return r;
}
ByteArray(16);
var _9 = ByteArray(32);
_9[0] = 9;
var gf0 = gf();
var gf1 = gf([1]);
gf([56129, 1]);
var D$1 = gf([
	30883,
	4953,
	19914,
	30187,
	55467,
	16705,
	2637,
	112,
	59544,
	30585,
	16505,
	36039,
	65139,
	11119,
	27886,
	20995
]);
var D2 = gf([
	61785,
	9906,
	39828,
	60374,
	45398,
	33411,
	5274,
	224,
	53552,
	61171,
	33010,
	6542,
	64743,
	22239,
	55772,
	9222
]);
var X$1 = gf([
	54554,
	36645,
	11616,
	51542,
	42930,
	38181,
	51040,
	26924,
	56412,
	64982,
	57905,
	49316,
	21502,
	52590,
	14035,
	8553
]);
var Y$1 = gf([
	26200,
	26214,
	26214,
	26214,
	26214,
	26214,
	26214,
	26214,
	26214,
	26214,
	26214,
	26214,
	26214,
	26214,
	26214,
	26214
]);
var I$1 = gf([
	41136,
	18958,
	6951,
	50414,
	58488,
	44335,
	6150,
	12099,
	55207,
	15867,
	153,
	11085,
	57099,
	20417,
	9344,
	11139
]);
function A$1(o, a, b) {
	for (var i = 0; i < 16; i++) o[i] = a[i] + b[i];
}
function Z$1(o, a, b) {
	for (var i = 0; i < 16; i++) o[i] = a[i] - b[i];
}
function M$1(o, a, b) {
	var v, c, t0 = 0, t1 = 0, t2 = 0, t3 = 0, t4 = 0, t5 = 0, t6 = 0, t7 = 0, t8 = 0, t9 = 0, t10 = 0, t11 = 0, t12 = 0, t13 = 0, t14 = 0, t15 = 0, t16 = 0, t17 = 0, t18 = 0, t19 = 0, t20 = 0, t21 = 0, t22 = 0, t23 = 0, t24 = 0, t25 = 0, t26 = 0, t27 = 0, t28 = 0, t29 = 0, t30 = 0, b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7], b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11], b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];
	v = a[0];
	t0 += v * b0;
	t1 += v * b1;
	t2 += v * b2;
	t3 += v * b3;
	t4 += v * b4;
	t5 += v * b5;
	t6 += v * b6;
	t7 += v * b7;
	t8 += v * b8;
	t9 += v * b9;
	t10 += v * b10;
	t11 += v * b11;
	t12 += v * b12;
	t13 += v * b13;
	t14 += v * b14;
	t15 += v * b15;
	v = a[1];
	t1 += v * b0;
	t2 += v * b1;
	t3 += v * b2;
	t4 += v * b3;
	t5 += v * b4;
	t6 += v * b5;
	t7 += v * b6;
	t8 += v * b7;
	t9 += v * b8;
	t10 += v * b9;
	t11 += v * b10;
	t12 += v * b11;
	t13 += v * b12;
	t14 += v * b13;
	t15 += v * b14;
	t16 += v * b15;
	v = a[2];
	t2 += v * b0;
	t3 += v * b1;
	t4 += v * b2;
	t5 += v * b3;
	t6 += v * b4;
	t7 += v * b5;
	t8 += v * b6;
	t9 += v * b7;
	t10 += v * b8;
	t11 += v * b9;
	t12 += v * b10;
	t13 += v * b11;
	t14 += v * b12;
	t15 += v * b13;
	t16 += v * b14;
	t17 += v * b15;
	v = a[3];
	t3 += v * b0;
	t4 += v * b1;
	t5 += v * b2;
	t6 += v * b3;
	t7 += v * b4;
	t8 += v * b5;
	t9 += v * b6;
	t10 += v * b7;
	t11 += v * b8;
	t12 += v * b9;
	t13 += v * b10;
	t14 += v * b11;
	t15 += v * b12;
	t16 += v * b13;
	t17 += v * b14;
	t18 += v * b15;
	v = a[4];
	t4 += v * b0;
	t5 += v * b1;
	t6 += v * b2;
	t7 += v * b3;
	t8 += v * b4;
	t9 += v * b5;
	t10 += v * b6;
	t11 += v * b7;
	t12 += v * b8;
	t13 += v * b9;
	t14 += v * b10;
	t15 += v * b11;
	t16 += v * b12;
	t17 += v * b13;
	t18 += v * b14;
	t19 += v * b15;
	v = a[5];
	t5 += v * b0;
	t6 += v * b1;
	t7 += v * b2;
	t8 += v * b3;
	t9 += v * b4;
	t10 += v * b5;
	t11 += v * b6;
	t12 += v * b7;
	t13 += v * b8;
	t14 += v * b9;
	t15 += v * b10;
	t16 += v * b11;
	t17 += v * b12;
	t18 += v * b13;
	t19 += v * b14;
	t20 += v * b15;
	v = a[6];
	t6 += v * b0;
	t7 += v * b1;
	t8 += v * b2;
	t9 += v * b3;
	t10 += v * b4;
	t11 += v * b5;
	t12 += v * b6;
	t13 += v * b7;
	t14 += v * b8;
	t15 += v * b9;
	t16 += v * b10;
	t17 += v * b11;
	t18 += v * b12;
	t19 += v * b13;
	t20 += v * b14;
	t21 += v * b15;
	v = a[7];
	t7 += v * b0;
	t8 += v * b1;
	t9 += v * b2;
	t10 += v * b3;
	t11 += v * b4;
	t12 += v * b5;
	t13 += v * b6;
	t14 += v * b7;
	t15 += v * b8;
	t16 += v * b9;
	t17 += v * b10;
	t18 += v * b11;
	t19 += v * b12;
	t20 += v * b13;
	t21 += v * b14;
	t22 += v * b15;
	v = a[8];
	t8 += v * b0;
	t9 += v * b1;
	t10 += v * b2;
	t11 += v * b3;
	t12 += v * b4;
	t13 += v * b5;
	t14 += v * b6;
	t15 += v * b7;
	t16 += v * b8;
	t17 += v * b9;
	t18 += v * b10;
	t19 += v * b11;
	t20 += v * b12;
	t21 += v * b13;
	t22 += v * b14;
	t23 += v * b15;
	v = a[9];
	t9 += v * b0;
	t10 += v * b1;
	t11 += v * b2;
	t12 += v * b3;
	t13 += v * b4;
	t14 += v * b5;
	t15 += v * b6;
	t16 += v * b7;
	t17 += v * b8;
	t18 += v * b9;
	t19 += v * b10;
	t20 += v * b11;
	t21 += v * b12;
	t22 += v * b13;
	t23 += v * b14;
	t24 += v * b15;
	v = a[10];
	t10 += v * b0;
	t11 += v * b1;
	t12 += v * b2;
	t13 += v * b3;
	t14 += v * b4;
	t15 += v * b5;
	t16 += v * b6;
	t17 += v * b7;
	t18 += v * b8;
	t19 += v * b9;
	t20 += v * b10;
	t21 += v * b11;
	t22 += v * b12;
	t23 += v * b13;
	t24 += v * b14;
	t25 += v * b15;
	v = a[11];
	t11 += v * b0;
	t12 += v * b1;
	t13 += v * b2;
	t14 += v * b3;
	t15 += v * b4;
	t16 += v * b5;
	t17 += v * b6;
	t18 += v * b7;
	t19 += v * b8;
	t20 += v * b9;
	t21 += v * b10;
	t22 += v * b11;
	t23 += v * b12;
	t24 += v * b13;
	t25 += v * b14;
	t26 += v * b15;
	v = a[12];
	t12 += v * b0;
	t13 += v * b1;
	t14 += v * b2;
	t15 += v * b3;
	t16 += v * b4;
	t17 += v * b5;
	t18 += v * b6;
	t19 += v * b7;
	t20 += v * b8;
	t21 += v * b9;
	t22 += v * b10;
	t23 += v * b11;
	t24 += v * b12;
	t25 += v * b13;
	t26 += v * b14;
	t27 += v * b15;
	v = a[13];
	t13 += v * b0;
	t14 += v * b1;
	t15 += v * b2;
	t16 += v * b3;
	t17 += v * b4;
	t18 += v * b5;
	t19 += v * b6;
	t20 += v * b7;
	t21 += v * b8;
	t22 += v * b9;
	t23 += v * b10;
	t24 += v * b11;
	t25 += v * b12;
	t26 += v * b13;
	t27 += v * b14;
	t28 += v * b15;
	v = a[14];
	t14 += v * b0;
	t15 += v * b1;
	t16 += v * b2;
	t17 += v * b3;
	t18 += v * b4;
	t19 += v * b5;
	t20 += v * b6;
	t21 += v * b7;
	t22 += v * b8;
	t23 += v * b9;
	t24 += v * b10;
	t25 += v * b11;
	t26 += v * b12;
	t27 += v * b13;
	t28 += v * b14;
	t29 += v * b15;
	v = a[15];
	t15 += v * b0;
	t16 += v * b1;
	t17 += v * b2;
	t18 += v * b3;
	t19 += v * b4;
	t20 += v * b5;
	t21 += v * b6;
	t22 += v * b7;
	t23 += v * b8;
	t24 += v * b9;
	t25 += v * b10;
	t26 += v * b11;
	t27 += v * b12;
	t28 += v * b13;
	t29 += v * b14;
	t30 += v * b15;
	t0 += 38 * t16;
	t1 += 38 * t17;
	t2 += 38 * t18;
	t3 += 38 * t19;
	t4 += 38 * t20;
	t5 += 38 * t21;
	t6 += 38 * t22;
	t7 += 38 * t23;
	t8 += 38 * t24;
	t9 += 38 * t25;
	t10 += 38 * t26;
	t11 += 38 * t27;
	t12 += 38 * t28;
	t13 += 38 * t29;
	t14 += 38 * t30;
	c = 1;
	v = t0 + c + 65535;
	c = Math.floor(v / 65536);
	t0 = v - c * 65536;
	v = t1 + c + 65535;
	c = Math.floor(v / 65536);
	t1 = v - c * 65536;
	v = t2 + c + 65535;
	c = Math.floor(v / 65536);
	t2 = v - c * 65536;
	v = t3 + c + 65535;
	c = Math.floor(v / 65536);
	t3 = v - c * 65536;
	v = t4 + c + 65535;
	c = Math.floor(v / 65536);
	t4 = v - c * 65536;
	v = t5 + c + 65535;
	c = Math.floor(v / 65536);
	t5 = v - c * 65536;
	v = t6 + c + 65535;
	c = Math.floor(v / 65536);
	t6 = v - c * 65536;
	v = t7 + c + 65535;
	c = Math.floor(v / 65536);
	t7 = v - c * 65536;
	v = t8 + c + 65535;
	c = Math.floor(v / 65536);
	t8 = v - c * 65536;
	v = t9 + c + 65535;
	c = Math.floor(v / 65536);
	t9 = v - c * 65536;
	v = t10 + c + 65535;
	c = Math.floor(v / 65536);
	t10 = v - c * 65536;
	v = t11 + c + 65535;
	c = Math.floor(v / 65536);
	t11 = v - c * 65536;
	v = t12 + c + 65535;
	c = Math.floor(v / 65536);
	t12 = v - c * 65536;
	v = t13 + c + 65535;
	c = Math.floor(v / 65536);
	t13 = v - c * 65536;
	v = t14 + c + 65535;
	c = Math.floor(v / 65536);
	t14 = v - c * 65536;
	v = t15 + c + 65535;
	c = Math.floor(v / 65536);
	t15 = v - c * 65536;
	t0 += c - 1 + 37 * (c - 1);
	c = 1;
	v = t0 + c + 65535;
	c = Math.floor(v / 65536);
	t0 = v - c * 65536;
	v = t1 + c + 65535;
	c = Math.floor(v / 65536);
	t1 = v - c * 65536;
	v = t2 + c + 65535;
	c = Math.floor(v / 65536);
	t2 = v - c * 65536;
	v = t3 + c + 65535;
	c = Math.floor(v / 65536);
	t3 = v - c * 65536;
	v = t4 + c + 65535;
	c = Math.floor(v / 65536);
	t4 = v - c * 65536;
	v = t5 + c + 65535;
	c = Math.floor(v / 65536);
	t5 = v - c * 65536;
	v = t6 + c + 65535;
	c = Math.floor(v / 65536);
	t6 = v - c * 65536;
	v = t7 + c + 65535;
	c = Math.floor(v / 65536);
	t7 = v - c * 65536;
	v = t8 + c + 65535;
	c = Math.floor(v / 65536);
	t8 = v - c * 65536;
	v = t9 + c + 65535;
	c = Math.floor(v / 65536);
	t9 = v - c * 65536;
	v = t10 + c + 65535;
	c = Math.floor(v / 65536);
	t10 = v - c * 65536;
	v = t11 + c + 65535;
	c = Math.floor(v / 65536);
	t11 = v - c * 65536;
	v = t12 + c + 65535;
	c = Math.floor(v / 65536);
	t12 = v - c * 65536;
	v = t13 + c + 65535;
	c = Math.floor(v / 65536);
	t13 = v - c * 65536;
	v = t14 + c + 65535;
	c = Math.floor(v / 65536);
	t14 = v - c * 65536;
	v = t15 + c + 65535;
	c = Math.floor(v / 65536);
	t15 = v - c * 65536;
	t0 += c - 1 + 37 * (c - 1);
	o[0] = t0;
	o[1] = t1;
	o[2] = t2;
	o[3] = t3;
	o[4] = t4;
	o[5] = t5;
	o[6] = t6;
	o[7] = t7;
	o[8] = t8;
	o[9] = t9;
	o[10] = t10;
	o[11] = t11;
	o[12] = t12;
	o[13] = t13;
	o[14] = t14;
	o[15] = t15;
}
function S$1(o, a) {
	M$1(o, a, a);
}
//#endregion
//#region node_modules/tweetnacl-ts/es/curve25519.js
function set25519(r, a) {
	for (var i = 0; i < 16; i++) r[i] = a[i] | 0;
}
function car25519(o) {
	var i, v, c = 1;
	for (i = 0; i < 16; i++) {
		v = o[i] + c + 65535;
		c = Math.floor(v / 65536);
		o[i] = v - c * 65536;
	}
	o[0] += c - 1 + 37 * (c - 1);
}
function sel25519(p, q, b) {
	var t, c = ~(b - 1);
	for (var i = 0; i < 16; i++) {
		t = c & (p[i] ^ q[i]);
		p[i] ^= t;
		q[i] ^= t;
	}
}
function pack25519(o, n) {
	var m = gf(), t = gf();
	var i, j, b;
	for (i = 0; i < 16; i++) t[i] = n[i];
	car25519(t);
	car25519(t);
	car25519(t);
	for (j = 0; j < 2; j++) {
		m[0] = t[0] - 65517;
		for (i = 1; i < 15; i++) {
			m[i] = t[i] - 65535 - (m[i - 1] >> 16 & 1);
			m[i - 1] &= 65535;
		}
		m[15] = t[15] - 32767 - (m[14] >> 16 & 1);
		b = m[15] >> 16 & 1;
		m[14] &= 65535;
		sel25519(t, m, 1 - b);
	}
	for (i = 0; i < 16; i++) {
		o[2 * i] = t[i] & 255;
		o[2 * i + 1] = t[i] >> 8;
	}
}
function neq25519(a, b) {
	var c = ByteArray(32), d = ByteArray(32);
	pack25519(c, a);
	pack25519(d, b);
	return _verify_32(c, 0, d, 0);
}
function par25519(a) {
	var d = ByteArray(32);
	pack25519(d, a);
	return d[0] & 1;
}
function unpack25519(o, n) {
	for (var i = 0; i < 16; i++) o[i] = n[2 * i] + (n[2 * i + 1] << 8);
	o[15] &= 32767;
}
function inv25519(o, i) {
	var c = gf();
	var a;
	for (a = 0; a < 16; a++) c[a] = i[a];
	for (a = 253; a >= 0; a--) {
		S$1(c, c);
		if (a !== 2 && a !== 4) M$1(c, c, i);
	}
	for (a = 0; a < 16; a++) o[a] = c[a];
}
ByteArray([
	101,
	120,
	112,
	97,
	110,
	100,
	32,
	51,
	50,
	45,
	98,
	121,
	116,
	101,
	32,
	107
]);
//#endregion
//#region node_modules/tweetnacl-ts/es/hash.js
function _hash(out, m, n) {
	var hh = IntArray(8), hl = IntArray(8), x = ByteArray(256);
	var i, b = n;
	hh[0] = 1779033703;
	hh[1] = 3144134277;
	hh[2] = 1013904242;
	hh[3] = 2773480762;
	hh[4] = 1359893119;
	hh[5] = 2600822924;
	hh[6] = 528734635;
	hh[7] = 1541459225;
	hl[0] = 4089235720;
	hl[1] = 2227873595;
	hl[2] = 4271175723;
	hl[3] = 1595750129;
	hl[4] = 2917565137;
	hl[5] = 725511199;
	hl[6] = 4215389547;
	hl[7] = 327033209;
	_hashblocks_hl(hh, hl, m, n);
	n %= 128;
	for (i = 0; i < n; i++) x[i] = m[b - n + i];
	x[n] = 128;
	n = 256 - 128 * (n < 112 ? 1 : 0);
	x[n - 9] = 0;
	_ts64(x, n - 8, b / 536870912 | 0, b << 3);
	_hashblocks_hl(hh, hl, x, n);
	for (i = 0; i < 8; i++) _ts64(out, 8 * i, hh[i], hl[i]);
	return 0;
}
var _K = [
	1116352408,
	3609767458,
	1899447441,
	602891725,
	3049323471,
	3964484399,
	3921009573,
	2173295548,
	961987163,
	4081628472,
	1508970993,
	3053834265,
	2453635748,
	2937671579,
	2870763221,
	3664609560,
	3624381080,
	2734883394,
	310598401,
	1164996542,
	607225278,
	1323610764,
	1426881987,
	3590304994,
	1925078388,
	4068182383,
	2162078206,
	991336113,
	2614888103,
	633803317,
	3248222580,
	3479774868,
	3835390401,
	2666613458,
	4022224774,
	944711139,
	264347078,
	2341262773,
	604807628,
	2007800933,
	770255983,
	1495990901,
	1249150122,
	1856431235,
	1555081692,
	3175218132,
	1996064986,
	2198950837,
	2554220882,
	3999719339,
	2821834349,
	766784016,
	2952996808,
	2566594879,
	3210313671,
	3203337956,
	3336571891,
	1034457026,
	3584528711,
	2466948901,
	113926993,
	3758326383,
	338241895,
	168717936,
	666307205,
	1188179964,
	773529912,
	1546045734,
	1294757372,
	1522805485,
	1396182291,
	2643833823,
	1695183700,
	2343527390,
	1986661051,
	1014477480,
	2177026350,
	1206759142,
	2456956037,
	344077627,
	2730485921,
	1290863460,
	2820302411,
	3158454273,
	3259730800,
	3505952657,
	3345764771,
	106217008,
	3516065817,
	3606008344,
	3600352804,
	1432725776,
	4094571909,
	1467031594,
	275423344,
	851169720,
	430227734,
	3100823752,
	506948616,
	1363258195,
	659060556,
	3750685593,
	883997877,
	3785050280,
	958139571,
	3318307427,
	1322822218,
	3812723403,
	1537002063,
	2003034995,
	1747873779,
	3602036899,
	1955562222,
	1575990012,
	2024104815,
	1125592928,
	2227730452,
	2716904306,
	2361852424,
	442776044,
	2428436474,
	593698344,
	2756734187,
	3733110249,
	3204031479,
	2999351573,
	3329325298,
	3815920427,
	3391569614,
	3928383900,
	3515267271,
	566280711,
	3940187606,
	3454069534,
	4118630271,
	4000239992,
	116418474,
	1914138554,
	174292421,
	2731055270,
	289380356,
	3203993006,
	460393269,
	320620315,
	685471733,
	587496836,
	852142971,
	1086792851,
	1017036298,
	365543100,
	1126000580,
	2618297676,
	1288033470,
	3409855158,
	1501505948,
	4234509866,
	1607167915,
	987167468,
	1816402316,
	1246189591
];
function _hashblocks_hl(hh, hl, m, n) {
	var wh = IntArray(16), wl = IntArray(16);
	var bh0, bh1, bh2, bh3, bh4, bh5, bh6, bh7, bl0, bl1, bl2, bl3, bl4, bl5, bl6, bl7, th, tl, i, j, h, l, a, b, c, d;
	var ah0 = hh[0], ah1 = hh[1], ah2 = hh[2], ah3 = hh[3], ah4 = hh[4], ah5 = hh[5], ah6 = hh[6], ah7 = hh[7], al0 = hl[0], al1 = hl[1], al2 = hl[2], al3 = hl[3], al4 = hl[4], al5 = hl[5], al6 = hl[6], al7 = hl[7];
	var pos = 0;
	while (n >= 128) {
		for (i = 0; i < 16; i++) {
			j = 8 * i + pos;
			wh[i] = m[j + 0] << 24 | m[j + 1] << 16 | m[j + 2] << 8 | m[j + 3];
			wl[i] = m[j + 4] << 24 | m[j + 5] << 16 | m[j + 6] << 8 | m[j + 7];
		}
		for (i = 0; i < 80; i++) {
			bh0 = ah0;
			bh1 = ah1;
			bh2 = ah2;
			bh3 = ah3;
			bh4 = ah4;
			bh5 = ah5;
			bh6 = ah6;
			bh7 = ah7;
			bl0 = al0;
			bl1 = al1;
			bl2 = al2;
			bl3 = al3;
			bl4 = al4;
			bl5 = al5;
			bl6 = al6;
			bl7 = al7;
			h = ah7;
			l = al7;
			a = l & 65535;
			b = l >>> 16;
			c = h & 65535;
			d = h >>> 16;
			h = (ah4 >>> 14 | al4 << 18) ^ (ah4 >>> 18 | al4 << 14) ^ (al4 >>> 9 | ah4 << 23);
			l = (al4 >>> 14 | ah4 << 18) ^ (al4 >>> 18 | ah4 << 14) ^ (ah4 >>> 9 | al4 << 23);
			a += l & 65535;
			b += l >>> 16;
			c += h & 65535;
			d += h >>> 16;
			h = ah4 & ah5 ^ ~ah4 & ah6;
			l = al4 & al5 ^ ~al4 & al6;
			a += l & 65535;
			b += l >>> 16;
			c += h & 65535;
			d += h >>> 16;
			h = _K[i * 2];
			l = _K[i * 2 + 1];
			a += l & 65535;
			b += l >>> 16;
			c += h & 65535;
			d += h >>> 16;
			h = wh[i % 16];
			l = wl[i % 16];
			a += l & 65535;
			b += l >>> 16;
			c += h & 65535;
			d += h >>> 16;
			b += a >>> 16;
			c += b >>> 16;
			d += c >>> 16;
			th = c & 65535 | d << 16;
			tl = a & 65535 | b << 16;
			h = th;
			l = tl;
			a = l & 65535;
			b = l >>> 16;
			c = h & 65535;
			d = h >>> 16;
			h = (ah0 >>> 28 | al0 << 4) ^ (al0 >>> 2 | ah0 << 30) ^ (al0 >>> 7 | ah0 << 25);
			l = (al0 >>> 28 | ah0 << 4) ^ (ah0 >>> 2 | al0 << 30) ^ (ah0 >>> 7 | al0 << 25);
			a += l & 65535;
			b += l >>> 16;
			c += h & 65535;
			d += h >>> 16;
			h = ah0 & ah1 ^ ah0 & ah2 ^ ah1 & ah2;
			l = al0 & al1 ^ al0 & al2 ^ al1 & al2;
			a += l & 65535;
			b += l >>> 16;
			c += h & 65535;
			d += h >>> 16;
			b += a >>> 16;
			c += b >>> 16;
			d += c >>> 16;
			bh7 = c & 65535 | d << 16;
			bl7 = a & 65535 | b << 16;
			h = bh3;
			l = bl3;
			a = l & 65535;
			b = l >>> 16;
			c = h & 65535;
			d = h >>> 16;
			h = th;
			l = tl;
			a += l & 65535;
			b += l >>> 16;
			c += h & 65535;
			d += h >>> 16;
			b += a >>> 16;
			c += b >>> 16;
			d += c >>> 16;
			bh3 = c & 65535 | d << 16;
			bl3 = a & 65535 | b << 16;
			ah1 = bh0;
			ah2 = bh1;
			ah3 = bh2;
			ah4 = bh3;
			ah5 = bh4;
			ah6 = bh5;
			ah7 = bh6;
			ah0 = bh7;
			al1 = bl0;
			al2 = bl1;
			al3 = bl2;
			al4 = bl3;
			al5 = bl4;
			al6 = bl5;
			al7 = bl6;
			al0 = bl7;
			if (i % 16 === 15) for (j = 0; j < 16; j++) {
				h = wh[j];
				l = wl[j];
				a = l & 65535;
				b = l >>> 16;
				c = h & 65535;
				d = h >>> 16;
				h = wh[(j + 9) % 16];
				l = wl[(j + 9) % 16];
				a += l & 65535;
				b += l >>> 16;
				c += h & 65535;
				d += h >>> 16;
				th = wh[(j + 1) % 16];
				tl = wl[(j + 1) % 16];
				h = (th >>> 1 | tl << 31) ^ (th >>> 8 | tl << 24) ^ th >>> 7;
				l = (tl >>> 1 | th << 31) ^ (tl >>> 8 | th << 24) ^ (tl >>> 7 | th << 25);
				a += l & 65535;
				b += l >>> 16;
				c += h & 65535;
				d += h >>> 16;
				th = wh[(j + 14) % 16];
				tl = wl[(j + 14) % 16];
				h = (th >>> 19 | tl << 13) ^ (tl >>> 29 | th << 3) ^ th >>> 6;
				l = (tl >>> 19 | th << 13) ^ (th >>> 29 | tl << 3) ^ (tl >>> 6 | th << 26);
				a += l & 65535;
				b += l >>> 16;
				c += h & 65535;
				d += h >>> 16;
				b += a >>> 16;
				c += b >>> 16;
				d += c >>> 16;
				wh[j] = c & 65535 | d << 16;
				wl[j] = a & 65535 | b << 16;
			}
		}
		h = ah0;
		l = al0;
		a = l & 65535;
		b = l >>> 16;
		c = h & 65535;
		d = h >>> 16;
		h = hh[0];
		l = hl[0];
		a += l & 65535;
		b += l >>> 16;
		c += h & 65535;
		d += h >>> 16;
		b += a >>> 16;
		c += b >>> 16;
		d += c >>> 16;
		hh[0] = ah0 = c & 65535 | d << 16;
		hl[0] = al0 = a & 65535 | b << 16;
		h = ah1;
		l = al1;
		a = l & 65535;
		b = l >>> 16;
		c = h & 65535;
		d = h >>> 16;
		h = hh[1];
		l = hl[1];
		a += l & 65535;
		b += l >>> 16;
		c += h & 65535;
		d += h >>> 16;
		b += a >>> 16;
		c += b >>> 16;
		d += c >>> 16;
		hh[1] = ah1 = c & 65535 | d << 16;
		hl[1] = al1 = a & 65535 | b << 16;
		h = ah2;
		l = al2;
		a = l & 65535;
		b = l >>> 16;
		c = h & 65535;
		d = h >>> 16;
		h = hh[2];
		l = hl[2];
		a += l & 65535;
		b += l >>> 16;
		c += h & 65535;
		d += h >>> 16;
		b += a >>> 16;
		c += b >>> 16;
		d += c >>> 16;
		hh[2] = ah2 = c & 65535 | d << 16;
		hl[2] = al2 = a & 65535 | b << 16;
		h = ah3;
		l = al3;
		a = l & 65535;
		b = l >>> 16;
		c = h & 65535;
		d = h >>> 16;
		h = hh[3];
		l = hl[3];
		a += l & 65535;
		b += l >>> 16;
		c += h & 65535;
		d += h >>> 16;
		b += a >>> 16;
		c += b >>> 16;
		d += c >>> 16;
		hh[3] = ah3 = c & 65535 | d << 16;
		hl[3] = al3 = a & 65535 | b << 16;
		h = ah4;
		l = al4;
		a = l & 65535;
		b = l >>> 16;
		c = h & 65535;
		d = h >>> 16;
		h = hh[4];
		l = hl[4];
		a += l & 65535;
		b += l >>> 16;
		c += h & 65535;
		d += h >>> 16;
		b += a >>> 16;
		c += b >>> 16;
		d += c >>> 16;
		hh[4] = ah4 = c & 65535 | d << 16;
		hl[4] = al4 = a & 65535 | b << 16;
		h = ah5;
		l = al5;
		a = l & 65535;
		b = l >>> 16;
		c = h & 65535;
		d = h >>> 16;
		h = hh[5];
		l = hl[5];
		a += l & 65535;
		b += l >>> 16;
		c += h & 65535;
		d += h >>> 16;
		b += a >>> 16;
		c += b >>> 16;
		d += c >>> 16;
		hh[5] = ah5 = c & 65535 | d << 16;
		hl[5] = al5 = a & 65535 | b << 16;
		h = ah6;
		l = al6;
		a = l & 65535;
		b = l >>> 16;
		c = h & 65535;
		d = h >>> 16;
		h = hh[6];
		l = hl[6];
		a += l & 65535;
		b += l >>> 16;
		c += h & 65535;
		d += h >>> 16;
		b += a >>> 16;
		c += b >>> 16;
		d += c >>> 16;
		hh[6] = ah6 = c & 65535 | d << 16;
		hl[6] = al6 = a & 65535 | b << 16;
		h = ah7;
		l = al7;
		a = l & 65535;
		b = l >>> 16;
		c = h & 65535;
		d = h >>> 16;
		h = hh[7];
		l = hl[7];
		a += l & 65535;
		b += l >>> 16;
		c += h & 65535;
		d += h >>> 16;
		b += a >>> 16;
		c += b >>> 16;
		d += c >>> 16;
		hh[7] = ah7 = c & 65535 | d << 16;
		hl[7] = al7 = a & 65535 | b << 16;
		pos += 128;
		n -= 128;
	}
	return n;
}
function _ts64(x, i, h, l) {
	x[i] = h >> 24 & 255;
	x[i + 1] = h >> 16 & 255;
	x[i + 2] = h >> 8 & 255;
	x[i + 3] = h & 255;
	x[i + 4] = l >> 24 & 255;
	x[i + 5] = l >> 16 & 255;
	x[i + 6] = l >> 8 & 255;
	x[i + 7] = l & 255;
}
//#endregion
//#region node_modules/tweetnacl-ts/es/sign.js
function sign_detached_verify(msg, sig, publicKey) {
	checkArrayTypes(msg, sig, publicKey);
	if (sig.length !== 64) throw new Error("bad signature size");
	if (publicKey.length !== 32) throw new Error("bad public key size");
	var sm = ByteArray(64 + msg.length);
	var m = ByteArray(64 + msg.length);
	var i;
	for (i = 0; i < 64; i++) sm[i] = sig[i];
	for (i = 0; i < msg.length; i++) sm[i + 64] = msg[i];
	return _sign_open(m, sm, sm.length, publicKey) >= 0;
}
function _sign_open(m, sm, n, pk) {
	var t = ByteArray(32), h = ByteArray(64);
	var p = [
		gf(),
		gf(),
		gf(),
		gf()
	], q = [
		gf(),
		gf(),
		gf(),
		gf()
	];
	var i, mlen = -1;
	if (n < 64 || unpackneg(q, pk)) return -1;
	for (i = 0; i < n; i++) m[i] = sm[i];
	for (i = 0; i < 32; i++) m[i + 32] = pk[i];
	_hash(h, m, n);
	reduce(h);
	scalarmult(p, q, h);
	scalarbase(q, sm.subarray(32));
	add(p, q);
	pack(t, p);
	n -= 64;
	if (_verify_32(sm, 0, t, 0)) {
		for (i = 0; i < n; i++) m[i] = 0;
		return -1;
	}
	for (i = 0; i < n; i++) m[i] = sm[i + 64];
	mlen = n;
	return mlen;
}
function scalarbase(p, s) {
	var q = [
		gf(),
		gf(),
		gf(),
		gf()
	];
	set25519(q[0], X$1);
	set25519(q[1], Y$1);
	set25519(q[2], gf1);
	M$1(q[3], X$1, Y$1);
	scalarmult(p, q, s);
}
function scalarmult(p, q, s) {
	var b, i;
	set25519(p[0], gf0);
	set25519(p[1], gf1);
	set25519(p[2], gf1);
	set25519(p[3], gf0);
	for (i = 255; i >= 0; --i) {
		b = s[i / 8 | 0] >> (i & 7) & 1;
		cswap(p, q, b);
		add(q, p);
		add(p, p);
		cswap(p, q, b);
	}
}
function pack(r, p) {
	var tx = gf(), ty = gf(), zi = gf();
	inv25519(zi, p[2]);
	M$1(tx, p[0], zi);
	M$1(ty, p[1], zi);
	pack25519(r, ty);
	r[31] ^= par25519(tx) << 7;
}
function unpackneg(r, p) {
	var t = gf(), chk = gf(), num = gf(), den = gf(), den2 = gf(), den4 = gf(), den6 = gf();
	set25519(r[2], gf1);
	unpack25519(r[1], p);
	S$1(num, r[1]);
	M$1(den, num, D$1);
	Z$1(num, num, r[2]);
	A$1(den, r[2], den);
	S$1(den2, den);
	S$1(den4, den2);
	M$1(den6, den4, den2);
	M$1(t, den6, num);
	M$1(t, t, den);
	pow2523(t, t);
	M$1(t, t, num);
	M$1(t, t, den);
	M$1(t, t, den);
	M$1(r[0], t, den);
	S$1(chk, r[0]);
	M$1(chk, chk, den);
	if (neq25519(chk, num)) M$1(r[0], r[0], I$1);
	S$1(chk, r[0]);
	M$1(chk, chk, den);
	if (neq25519(chk, num)) return -1;
	if (par25519(r[0]) === p[31] >> 7) Z$1(r[0], gf0, r[0]);
	M$1(r[3], r[0], r[1]);
	return 0;
}
function reduce(r) {
	var x = NumArray(64);
	var i;
	for (i = 0; i < 64; i++) x[i] = r[i];
	for (i = 0; i < 64; i++) r[i] = 0;
	modL(r, x);
}
var L$1 = NumArray([
	237,
	211,
	245,
	92,
	26,
	99,
	18,
	88,
	214,
	156,
	247,
	162,
	222,
	249,
	222,
	20,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	16
]);
function modL(r, x) {
	var carry, i, j, k;
	for (i = 63; i >= 32; --i) {
		carry = 0;
		for (j = i - 32, k = i - 12; j < k; ++j) {
			x[j] += carry - 16 * x[i] * L$1[j - (i - 32)];
			carry = x[j] + 128 >> 8;
			x[j] -= carry * 256;
		}
		x[j] += carry;
		x[i] = 0;
	}
	carry = 0;
	for (j = 0; j < 32; j++) {
		x[j] += carry - (x[31] >> 4) * L$1[j];
		carry = x[j] >> 8;
		x[j] &= 255;
	}
	for (j = 0; j < 32; j++) x[j] -= carry * L$1[j];
	for (i = 0; i < 32; i++) {
		x[i + 1] += x[i] >> 8;
		r[i] = x[i] & 255;
	}
}
function add(p, q) {
	var a = gf(), b = gf(), c = gf(), d = gf(), e = gf(), f = gf(), g = gf(), h = gf(), t = gf();
	Z$1(a, p[1], p[0]);
	Z$1(t, q[1], q[0]);
	M$1(a, a, t);
	A$1(b, p[0], p[1]);
	A$1(t, q[0], q[1]);
	M$1(b, b, t);
	M$1(c, p[3], q[3]);
	M$1(c, c, D2);
	M$1(d, p[2], q[2]);
	A$1(d, d, d);
	Z$1(e, b, a);
	Z$1(f, d, c);
	A$1(g, d, c);
	A$1(h, b, a);
	M$1(p[0], e, f);
	M$1(p[1], h, g);
	M$1(p[2], g, f);
	M$1(p[3], e, h);
}
function cswap(p, q, b) {
	for (var i = 0; i < 4; i++) sel25519(p[i], q[i], b);
}
function pow2523(o, i) {
	var c = gf();
	var a;
	for (a = 0; a < 16; a++) c[a] = i[a];
	for (a = 250; a >= 0; a--) {
		S$1(c, c);
		if (a !== 1) M$1(c, c, i);
	}
	for (a = 0; a < 16; a++) o[a] = c[a];
}
WordArray([
	1779033703,
	3144134277,
	1013904242,
	2773480762,
	1359893119,
	2600822924,
	528734635,
	1541459225
]);
ByteArray([
	0,
	1,
	2,
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	12,
	13,
	14,
	15,
	14,
	10,
	4,
	8,
	9,
	15,
	13,
	6,
	1,
	12,
	0,
	2,
	11,
	7,
	5,
	3,
	11,
	8,
	12,
	0,
	5,
	2,
	15,
	13,
	10,
	14,
	3,
	6,
	7,
	1,
	9,
	4,
	7,
	9,
	3,
	1,
	13,
	12,
	11,
	14,
	2,
	6,
	5,
	10,
	4,
	0,
	15,
	8,
	9,
	0,
	5,
	7,
	2,
	4,
	10,
	15,
	14,
	1,
	11,
	12,
	6,
	8,
	3,
	13,
	2,
	12,
	6,
	10,
	0,
	11,
	8,
	3,
	4,
	13,
	7,
	5,
	15,
	14,
	1,
	9,
	12,
	5,
	1,
	15,
	14,
	13,
	4,
	10,
	0,
	7,
	6,
	3,
	9,
	2,
	8,
	11,
	13,
	11,
	7,
	14,
	12,
	1,
	3,
	9,
	5,
	0,
	15,
	4,
	8,
	6,
	2,
	10,
	6,
	15,
	14,
	9,
	11,
	3,
	0,
	8,
	12,
	2,
	13,
	7,
	1,
	4,
	10,
	5,
	10,
	2,
	8,
	4,
	7,
	6,
	1,
	5,
	15,
	11,
	9,
	14,
	3,
	12,
	13,
	0
]);
WordArray(16);
WordArray(16);
WordArray([
	4089235720,
	1779033703,
	2227873595,
	3144134277,
	4271175723,
	1013904242,
	1595750129,
	2773480762,
	2917565137,
	1359893119,
	725511199,
	2600822924,
	4215389547,
	528734635,
	327033209,
	1541459225
]);
ByteArray([
	0,
	1,
	2,
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	12,
	13,
	14,
	15,
	14,
	10,
	4,
	8,
	9,
	15,
	13,
	6,
	1,
	12,
	0,
	2,
	11,
	7,
	5,
	3,
	11,
	8,
	12,
	0,
	5,
	2,
	15,
	13,
	10,
	14,
	3,
	6,
	7,
	1,
	9,
	4,
	7,
	9,
	3,
	1,
	13,
	12,
	11,
	14,
	2,
	6,
	5,
	10,
	4,
	0,
	15,
	8,
	9,
	0,
	5,
	7,
	2,
	4,
	10,
	15,
	14,
	1,
	11,
	12,
	6,
	8,
	3,
	13,
	2,
	12,
	6,
	10,
	0,
	11,
	8,
	3,
	4,
	13,
	7,
	5,
	15,
	14,
	1,
	9,
	12,
	5,
	1,
	15,
	14,
	13,
	4,
	10,
	0,
	7,
	6,
	3,
	9,
	2,
	8,
	11,
	13,
	11,
	7,
	14,
	12,
	1,
	3,
	9,
	5,
	0,
	15,
	4,
	8,
	6,
	2,
	10,
	6,
	15,
	14,
	9,
	11,
	3,
	0,
	8,
	12,
	2,
	13,
	7,
	1,
	4,
	10,
	5,
	10,
	2,
	8,
	4,
	7,
	6,
	1,
	5,
	15,
	11,
	9,
	14,
	3,
	12,
	13,
	0,
	0,
	1,
	2,
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	12,
	13,
	14,
	15,
	14,
	10,
	4,
	8,
	9,
	15,
	13,
	6,
	1,
	12,
	0,
	2,
	11,
	7,
	5,
	3
].map(function(x) {
	return x * 2;
}));
WordArray(32);
WordArray(32);
//#endregion
//#region node_modules/bowser/es5.js
var require_es5 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(e, t) {
		"object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.bowser = t() : e.bowser = t();
	})(exports, (function() {
		return function(e) {
			var t = {};
			function r(n) {
				if (t[n]) return t[n].exports;
				var i = t[n] = {
					i: n,
					l: !1,
					exports: {}
				};
				return e[n].call(i.exports, i, i.exports, r), i.l = !0, i.exports;
			}
			return r.m = e, r.c = t, r.d = function(e, t, n) {
				r.o(e, t) || Object.defineProperty(e, t, {
					enumerable: !0,
					get: n
				});
			}, r.r = function(e) {
				"undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e, "__esModule", { value: !0 });
			}, r.t = function(e, t) {
				if (1 & t && (e = r(e)), 8 & t) return e;
				if (4 & t && "object" == typeof e && e && e.__esModule) return e;
				var n = Object.create(null);
				if (r.r(n), Object.defineProperty(n, "default", {
					enumerable: !0,
					value: e
				}), 2 & t && "string" != typeof e) for (var i in e) r.d(n, i, function(t) {
					return e[t];
				}.bind(null, i));
				return n;
			}, r.n = function(e) {
				var t = e && e.__esModule ? function() {
					return e.default;
				} : function() {
					return e;
				};
				return r.d(t, "a", t), t;
			}, r.o = function(e, t) {
				return Object.prototype.hasOwnProperty.call(e, t);
			}, r.p = "", r(r.s = 90);
		}({
			17: function(e, t, r) {
				"use strict";
				t.__esModule = !0, t.default = void 0;
				var n = r(18);
				t.default = function() {
					function e() {}
					return e.getFirstMatch = function(e, t) {
						var r = t.match(e);
						return r && r.length > 0 && r[1] || "";
					}, e.getSecondMatch = function(e, t) {
						var r = t.match(e);
						return r && r.length > 1 && r[2] || "";
					}, e.matchAndReturnConst = function(e, t, r) {
						if (e.test(t)) return r;
					}, e.getWindowsVersionName = function(e) {
						switch (e) {
							case "NT": return "NT";
							case "XP": return "XP";
							case "NT 5.0": return "2000";
							case "NT 5.1": return "XP";
							case "NT 5.2": return "2003";
							case "NT 6.0": return "Vista";
							case "NT 6.1": return "7";
							case "NT 6.2": return "8";
							case "NT 6.3": return "8.1";
							case "NT 10.0": return "10";
							default: return;
						}
					}, e.getMacOSVersionName = function(e) {
						var t = e.split(".").splice(0, 2).map((function(e) {
							return parseInt(e, 10) || 0;
						}));
						if (t.push(0), 10 === t[0]) switch (t[1]) {
							case 5: return "Leopard";
							case 6: return "Snow Leopard";
							case 7: return "Lion";
							case 8: return "Mountain Lion";
							case 9: return "Mavericks";
							case 10: return "Yosemite";
							case 11: return "El Capitan";
							case 12: return "Sierra";
							case 13: return "High Sierra";
							case 14: return "Mojave";
							case 15: return "Catalina";
							default: return;
						}
					}, e.getAndroidVersionName = function(e) {
						var t = e.split(".").splice(0, 2).map((function(e) {
							return parseInt(e, 10) || 0;
						}));
						if (t.push(0), !(1 === t[0] && t[1] < 5)) return 1 === t[0] && t[1] < 6 ? "Cupcake" : 1 === t[0] && t[1] >= 6 ? "Donut" : 2 === t[0] && t[1] < 2 ? "Eclair" : 2 === t[0] && 2 === t[1] ? "Froyo" : 2 === t[0] && t[1] > 2 ? "Gingerbread" : 3 === t[0] ? "Honeycomb" : 4 === t[0] && t[1] < 1 ? "Ice Cream Sandwich" : 4 === t[0] && t[1] < 4 ? "Jelly Bean" : 4 === t[0] && t[1] >= 4 ? "KitKat" : 5 === t[0] ? "Lollipop" : 6 === t[0] ? "Marshmallow" : 7 === t[0] ? "Nougat" : 8 === t[0] ? "Oreo" : 9 === t[0] ? "Pie" : void 0;
					}, e.getVersionPrecision = function(e) {
						return e.split(".").length;
					}, e.compareVersions = function(t, r, n) {
						void 0 === n && (n = !1);
						var i = e.getVersionPrecision(t), s = e.getVersionPrecision(r), a = Math.max(i, s), o = 0, u = e.map([t, r], (function(t) {
							var r = a - e.getVersionPrecision(t), n = t + new Array(r + 1).join(".0");
							return e.map(n.split("."), (function(e) {
								return new Array(20 - e.length).join("0") + e;
							})).reverse();
						}));
						for (n && (o = a - Math.min(i, s)), a -= 1; a >= o;) {
							if (u[0][a] > u[1][a]) return 1;
							if (u[0][a] === u[1][a]) {
								if (a === o) return 0;
								a -= 1;
							} else if (u[0][a] < u[1][a]) return -1;
						}
					}, e.map = function(e, t) {
						var r, n = [];
						if (Array.prototype.map) return Array.prototype.map.call(e, t);
						for (r = 0; r < e.length; r += 1) n.push(t(e[r]));
						return n;
					}, e.find = function(e, t) {
						var r, n;
						if (Array.prototype.find) return Array.prototype.find.call(e, t);
						for (r = 0, n = e.length; r < n; r += 1) {
							var i = e[r];
							if (t(i, r)) return i;
						}
					}, e.assign = function(e) {
						for (var t, r, n = e, i = arguments.length, s = new Array(i > 1 ? i - 1 : 0), a = 1; a < i; a++) s[a - 1] = arguments[a];
						if (Object.assign) return Object.assign.apply(Object, [e].concat(s));
						var o = function() {
							var e = s[t];
							"object" == typeof e && null !== e && Object.keys(e).forEach((function(t) {
								n[t] = e[t];
							}));
						};
						for (t = 0, r = s.length; t < r; t += 1) o();
						return e;
					}, e.getBrowserAlias = function(e) {
						return n.BROWSER_ALIASES_MAP[e];
					}, e.getBrowserTypeByAlias = function(e) {
						return n.BROWSER_MAP[e] || "";
					}, e;
				}(), e.exports = t.default;
			},
			18: function(e, t, r) {
				"use strict";
				t.__esModule = !0, t.ENGINE_MAP = t.OS_MAP = t.PLATFORMS_MAP = t.BROWSER_MAP = t.BROWSER_ALIASES_MAP = void 0;
				t.BROWSER_ALIASES_MAP = {
					"Amazon Silk": "amazon_silk",
					"Android Browser": "android",
					Bada: "bada",
					BlackBerry: "blackberry",
					Chrome: "chrome",
					Chromium: "chromium",
					Electron: "electron",
					Epiphany: "epiphany",
					Firefox: "firefox",
					Focus: "focus",
					Generic: "generic",
					"Google Search": "google_search",
					Googlebot: "googlebot",
					"Internet Explorer": "ie",
					"K-Meleon": "k_meleon",
					Maxthon: "maxthon",
					"Microsoft Edge": "edge",
					"MZ Browser": "mz",
					"NAVER Whale Browser": "naver",
					Opera: "opera",
					"Opera Coast": "opera_coast",
					PhantomJS: "phantomjs",
					Puffin: "puffin",
					QupZilla: "qupzilla",
					QQ: "qq",
					QQLite: "qqlite",
					Safari: "safari",
					Sailfish: "sailfish",
					"Samsung Internet for Android": "samsung_internet",
					SeaMonkey: "seamonkey",
					Sleipnir: "sleipnir",
					Swing: "swing",
					Tizen: "tizen",
					"UC Browser": "uc",
					Vivaldi: "vivaldi",
					"WebOS Browser": "webos",
					WeChat: "wechat",
					"Yandex Browser": "yandex",
					Roku: "roku"
				};
				t.BROWSER_MAP = {
					amazon_silk: "Amazon Silk",
					android: "Android Browser",
					bada: "Bada",
					blackberry: "BlackBerry",
					chrome: "Chrome",
					chromium: "Chromium",
					electron: "Electron",
					epiphany: "Epiphany",
					firefox: "Firefox",
					focus: "Focus",
					generic: "Generic",
					googlebot: "Googlebot",
					google_search: "Google Search",
					ie: "Internet Explorer",
					k_meleon: "K-Meleon",
					maxthon: "Maxthon",
					edge: "Microsoft Edge",
					mz: "MZ Browser",
					naver: "NAVER Whale Browser",
					opera: "Opera",
					opera_coast: "Opera Coast",
					phantomjs: "PhantomJS",
					puffin: "Puffin",
					qupzilla: "QupZilla",
					qq: "QQ Browser",
					qqlite: "QQ Browser Lite",
					safari: "Safari",
					sailfish: "Sailfish",
					samsung_internet: "Samsung Internet for Android",
					seamonkey: "SeaMonkey",
					sleipnir: "Sleipnir",
					swing: "Swing",
					tizen: "Tizen",
					uc: "UC Browser",
					vivaldi: "Vivaldi",
					webos: "WebOS Browser",
					wechat: "WeChat",
					yandex: "Yandex Browser"
				};
				t.PLATFORMS_MAP = {
					tablet: "tablet",
					mobile: "mobile",
					desktop: "desktop",
					tv: "tv"
				};
				t.OS_MAP = {
					WindowsPhone: "Windows Phone",
					Windows: "Windows",
					MacOS: "macOS",
					iOS: "iOS",
					Android: "Android",
					WebOS: "WebOS",
					BlackBerry: "BlackBerry",
					Bada: "Bada",
					Tizen: "Tizen",
					Linux: "Linux",
					ChromeOS: "Chrome OS",
					PlayStation4: "PlayStation 4",
					Roku: "Roku"
				};
				t.ENGINE_MAP = {
					EdgeHTML: "EdgeHTML",
					Blink: "Blink",
					Trident: "Trident",
					Presto: "Presto",
					Gecko: "Gecko",
					WebKit: "WebKit"
				};
			},
			90: function(e, t, r) {
				"use strict";
				t.__esModule = !0, t.default = void 0;
				var n, i = (n = r(91)) && n.__esModule ? n : { default: n }, s = r(18);
				function a(e, t) {
					for (var r = 0; r < t.length; r++) {
						var n = t[r];
						n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n);
					}
				}
				t.default = function() {
					function e() {}
					var t, r, n;
					return e.getParser = function(e, t) {
						if (void 0 === t && (t = !1), "string" != typeof e) throw new Error("UserAgent should be a string");
						return new i.default(e, t);
					}, e.parse = function(e) {
						return new i.default(e).getResult();
					}, t = e, n = [
						{
							key: "BROWSER_MAP",
							get: function() {
								return s.BROWSER_MAP;
							}
						},
						{
							key: "ENGINE_MAP",
							get: function() {
								return s.ENGINE_MAP;
							}
						},
						{
							key: "OS_MAP",
							get: function() {
								return s.OS_MAP;
							}
						},
						{
							key: "PLATFORMS_MAP",
							get: function() {
								return s.PLATFORMS_MAP;
							}
						}
					], (r = null) && a(t.prototype, r), n && a(t, n), e;
				}(), e.exports = t.default;
			},
			91: function(e, t, r) {
				"use strict";
				t.__esModule = !0, t.default = void 0;
				var n = u(r(92)), i = u(r(93)), s = u(r(94)), a = u(r(95)), o = u(r(17));
				function u(e) {
					return e && e.__esModule ? e : { default: e };
				}
				t.default = function() {
					function e(e, t) {
						if (void 0 === t && (t = !1), null == e || "" === e) throw new Error("UserAgent parameter can't be empty");
						this._ua = e, this.parsedResult = {}, !0 !== t && this.parse();
					}
					var t = e.prototype;
					return t.getUA = function() {
						return this._ua;
					}, t.test = function(e) {
						return e.test(this._ua);
					}, t.parseBrowser = function() {
						var e = this;
						this.parsedResult.browser = {};
						var t = o.default.find(n.default, (function(t) {
							if ("function" == typeof t.test) return t.test(e);
							if (t.test instanceof Array) return t.test.some((function(t) {
								return e.test(t);
							}));
							throw new Error("Browser's test function is not valid");
						}));
						return t && (this.parsedResult.browser = t.describe(this.getUA())), this.parsedResult.browser;
					}, t.getBrowser = function() {
						return this.parsedResult.browser ? this.parsedResult.browser : this.parseBrowser();
					}, t.getBrowserName = function(e) {
						return e ? String(this.getBrowser().name).toLowerCase() || "" : this.getBrowser().name || "";
					}, t.getBrowserVersion = function() {
						return this.getBrowser().version;
					}, t.getOS = function() {
						return this.parsedResult.os ? this.parsedResult.os : this.parseOS();
					}, t.parseOS = function() {
						var e = this;
						this.parsedResult.os = {};
						var t = o.default.find(i.default, (function(t) {
							if ("function" == typeof t.test) return t.test(e);
							if (t.test instanceof Array) return t.test.some((function(t) {
								return e.test(t);
							}));
							throw new Error("Browser's test function is not valid");
						}));
						return t && (this.parsedResult.os = t.describe(this.getUA())), this.parsedResult.os;
					}, t.getOSName = function(e) {
						var t = this.getOS().name;
						return e ? String(t).toLowerCase() || "" : t || "";
					}, t.getOSVersion = function() {
						return this.getOS().version;
					}, t.getPlatform = function() {
						return this.parsedResult.platform ? this.parsedResult.platform : this.parsePlatform();
					}, t.getPlatformType = function(e) {
						void 0 === e && (e = !1);
						var t = this.getPlatform().type;
						return e ? String(t).toLowerCase() || "" : t || "";
					}, t.parsePlatform = function() {
						var e = this;
						this.parsedResult.platform = {};
						var t = o.default.find(s.default, (function(t) {
							if ("function" == typeof t.test) return t.test(e);
							if (t.test instanceof Array) return t.test.some((function(t) {
								return e.test(t);
							}));
							throw new Error("Browser's test function is not valid");
						}));
						return t && (this.parsedResult.platform = t.describe(this.getUA())), this.parsedResult.platform;
					}, t.getEngine = function() {
						return this.parsedResult.engine ? this.parsedResult.engine : this.parseEngine();
					}, t.getEngineName = function(e) {
						return e ? String(this.getEngine().name).toLowerCase() || "" : this.getEngine().name || "";
					}, t.parseEngine = function() {
						var e = this;
						this.parsedResult.engine = {};
						var t = o.default.find(a.default, (function(t) {
							if ("function" == typeof t.test) return t.test(e);
							if (t.test instanceof Array) return t.test.some((function(t) {
								return e.test(t);
							}));
							throw new Error("Browser's test function is not valid");
						}));
						return t && (this.parsedResult.engine = t.describe(this.getUA())), this.parsedResult.engine;
					}, t.parse = function() {
						return this.parseBrowser(), this.parseOS(), this.parsePlatform(), this.parseEngine(), this;
					}, t.getResult = function() {
						return o.default.assign({}, this.parsedResult);
					}, t.satisfies = function(e) {
						var t = this, r = {}, n = 0, i = {}, s = 0;
						if (Object.keys(e).forEach((function(t) {
							var a = e[t];
							"string" == typeof a ? (i[t] = a, s += 1) : "object" == typeof a && (r[t] = a, n += 1);
						})), n > 0) {
							var a = Object.keys(r), u = o.default.find(a, (function(e) {
								return t.isOS(e);
							}));
							if (u) {
								var d = this.satisfies(r[u]);
								if (void 0 !== d) return d;
							}
							var c = o.default.find(a, (function(e) {
								return t.isPlatform(e);
							}));
							if (c) {
								var f = this.satisfies(r[c]);
								if (void 0 !== f) return f;
							}
						}
						if (s > 0) {
							var l = Object.keys(i), h = o.default.find(l, (function(e) {
								return t.isBrowser(e, !0);
							}));
							if (void 0 !== h) return this.compareVersion(i[h]);
						}
					}, t.isBrowser = function(e, t) {
						void 0 === t && (t = !1);
						var r = this.getBrowserName().toLowerCase(), n = e.toLowerCase(), i = o.default.getBrowserTypeByAlias(n);
						return t && i && (n = i.toLowerCase()), n === r;
					}, t.compareVersion = function(e) {
						var t = [0], r = e, n = !1, i = this.getBrowserVersion();
						if ("string" == typeof i) return ">" === e[0] || "<" === e[0] ? (r = e.substr(1), "=" === e[1] ? (n = !0, r = e.substr(2)) : t = [], ">" === e[0] ? t.push(1) : t.push(-1)) : "=" === e[0] ? r = e.substr(1) : "~" === e[0] && (n = !0, r = e.substr(1)), t.indexOf(o.default.compareVersions(i, r, n)) > -1;
					}, t.isOS = function(e) {
						return this.getOSName(!0) === String(e).toLowerCase();
					}, t.isPlatform = function(e) {
						return this.getPlatformType(!0) === String(e).toLowerCase();
					}, t.isEngine = function(e) {
						return this.getEngineName(!0) === String(e).toLowerCase();
					}, t.is = function(e, t) {
						return void 0 === t && (t = !1), this.isBrowser(e, t) || this.isOS(e) || this.isPlatform(e);
					}, t.some = function(e) {
						var t = this;
						return void 0 === e && (e = []), e.some((function(e) {
							return t.is(e);
						}));
					}, e;
				}(), e.exports = t.default;
			},
			92: function(e, t, r) {
				"use strict";
				t.__esModule = !0, t.default = void 0;
				var n, i = (n = r(17)) && n.__esModule ? n : { default: n };
				var s = /version\/(\d+(\.?_?\d+)+)/i;
				t.default = [
					{
						test: [/googlebot/i],
						describe: function(e) {
							var t = { name: "Googlebot" }, r = i.default.getFirstMatch(/googlebot\/(\d+(\.\d+))/i, e) || i.default.getFirstMatch(s, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: [/opera/i],
						describe: function(e) {
							var t = { name: "Opera" }, r = i.default.getFirstMatch(s, e) || i.default.getFirstMatch(/(?:opera)[\s/](\d+(\.?_?\d+)+)/i, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: [/opr\/|opios/i],
						describe: function(e) {
							var t = { name: "Opera" }, r = i.default.getFirstMatch(/(?:opr|opios)[\s/](\S+)/i, e) || i.default.getFirstMatch(s, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: [/SamsungBrowser/i],
						describe: function(e) {
							var t = { name: "Samsung Internet for Android" }, r = i.default.getFirstMatch(s, e) || i.default.getFirstMatch(/(?:SamsungBrowser)[\s/](\d+(\.?_?\d+)+)/i, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: [/Whale/i],
						describe: function(e) {
							var t = { name: "NAVER Whale Browser" }, r = i.default.getFirstMatch(s, e) || i.default.getFirstMatch(/(?:whale)[\s/](\d+(?:\.\d+)+)/i, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: [/MZBrowser/i],
						describe: function(e) {
							var t = { name: "MZ Browser" }, r = i.default.getFirstMatch(/(?:MZBrowser)[\s/](\d+(?:\.\d+)+)/i, e) || i.default.getFirstMatch(s, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: [/focus/i],
						describe: function(e) {
							var t = { name: "Focus" }, r = i.default.getFirstMatch(/(?:focus)[\s/](\d+(?:\.\d+)+)/i, e) || i.default.getFirstMatch(s, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: [/swing/i],
						describe: function(e) {
							var t = { name: "Swing" }, r = i.default.getFirstMatch(/(?:swing)[\s/](\d+(?:\.\d+)+)/i, e) || i.default.getFirstMatch(s, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: [/coast/i],
						describe: function(e) {
							var t = { name: "Opera Coast" }, r = i.default.getFirstMatch(s, e) || i.default.getFirstMatch(/(?:coast)[\s/](\d+(\.?_?\d+)+)/i, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: [/opt\/\d+(?:.?_?\d+)+/i],
						describe: function(e) {
							var t = { name: "Opera Touch" }, r = i.default.getFirstMatch(/(?:opt)[\s/](\d+(\.?_?\d+)+)/i, e) || i.default.getFirstMatch(s, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: [/yabrowser/i],
						describe: function(e) {
							var t = { name: "Yandex Browser" }, r = i.default.getFirstMatch(/(?:yabrowser)[\s/](\d+(\.?_?\d+)+)/i, e) || i.default.getFirstMatch(s, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: [/ucbrowser/i],
						describe: function(e) {
							var t = { name: "UC Browser" }, r = i.default.getFirstMatch(s, e) || i.default.getFirstMatch(/(?:ucbrowser)[\s/](\d+(\.?_?\d+)+)/i, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: [/Maxthon|mxios/i],
						describe: function(e) {
							var t = { name: "Maxthon" }, r = i.default.getFirstMatch(s, e) || i.default.getFirstMatch(/(?:Maxthon|mxios)[\s/](\d+(\.?_?\d+)+)/i, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: [/epiphany/i],
						describe: function(e) {
							var t = { name: "Epiphany" }, r = i.default.getFirstMatch(s, e) || i.default.getFirstMatch(/(?:epiphany)[\s/](\d+(\.?_?\d+)+)/i, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: [/puffin/i],
						describe: function(e) {
							var t = { name: "Puffin" }, r = i.default.getFirstMatch(s, e) || i.default.getFirstMatch(/(?:puffin)[\s/](\d+(\.?_?\d+)+)/i, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: [/sleipnir/i],
						describe: function(e) {
							var t = { name: "Sleipnir" }, r = i.default.getFirstMatch(s, e) || i.default.getFirstMatch(/(?:sleipnir)[\s/](\d+(\.?_?\d+)+)/i, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: [/k-meleon/i],
						describe: function(e) {
							var t = { name: "K-Meleon" }, r = i.default.getFirstMatch(s, e) || i.default.getFirstMatch(/(?:k-meleon)[\s/](\d+(\.?_?\d+)+)/i, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: [/micromessenger/i],
						describe: function(e) {
							var t = { name: "WeChat" }, r = i.default.getFirstMatch(/(?:micromessenger)[\s/](\d+(\.?_?\d+)+)/i, e) || i.default.getFirstMatch(s, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: [/qqbrowser/i],
						describe: function(e) {
							var t = { name: /qqbrowserlite/i.test(e) ? "QQ Browser Lite" : "QQ Browser" }, r = i.default.getFirstMatch(/(?:qqbrowserlite|qqbrowser)[/](\d+(\.?_?\d+)+)/i, e) || i.default.getFirstMatch(s, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: [/msie|trident/i],
						describe: function(e) {
							var t = { name: "Internet Explorer" }, r = i.default.getFirstMatch(/(?:msie |rv:)(\d+(\.?_?\d+)+)/i, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: [/\sedg\//i],
						describe: function(e) {
							var t = { name: "Microsoft Edge" }, r = i.default.getFirstMatch(/\sedg\/(\d+(\.?_?\d+)+)/i, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: [/edg([ea]|ios)/i],
						describe: function(e) {
							var t = { name: "Microsoft Edge" }, r = i.default.getSecondMatch(/edg([ea]|ios)\/(\d+(\.?_?\d+)+)/i, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: [/vivaldi/i],
						describe: function(e) {
							var t = { name: "Vivaldi" }, r = i.default.getFirstMatch(/vivaldi\/(\d+(\.?_?\d+)+)/i, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: [/seamonkey/i],
						describe: function(e) {
							var t = { name: "SeaMonkey" }, r = i.default.getFirstMatch(/seamonkey\/(\d+(\.?_?\d+)+)/i, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: [/sailfish/i],
						describe: function(e) {
							var t = { name: "Sailfish" }, r = i.default.getFirstMatch(/sailfish\s?browser\/(\d+(\.\d+)?)/i, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: [/silk/i],
						describe: function(e) {
							var t = { name: "Amazon Silk" }, r = i.default.getFirstMatch(/silk\/(\d+(\.?_?\d+)+)/i, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: [/phantom/i],
						describe: function(e) {
							var t = { name: "PhantomJS" }, r = i.default.getFirstMatch(/phantomjs\/(\d+(\.?_?\d+)+)/i, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: [/slimerjs/i],
						describe: function(e) {
							var t = { name: "SlimerJS" }, r = i.default.getFirstMatch(/slimerjs\/(\d+(\.?_?\d+)+)/i, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: [/blackberry|\bbb\d+/i, /rim\stablet/i],
						describe: function(e) {
							var t = { name: "BlackBerry" }, r = i.default.getFirstMatch(s, e) || i.default.getFirstMatch(/blackberry[\d]+\/(\d+(\.?_?\d+)+)/i, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: [/(web|hpw)[o0]s/i],
						describe: function(e) {
							var t = { name: "WebOS Browser" }, r = i.default.getFirstMatch(s, e) || i.default.getFirstMatch(/w(?:eb)?[o0]sbrowser\/(\d+(\.?_?\d+)+)/i, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: [/bada/i],
						describe: function(e) {
							var t = { name: "Bada" }, r = i.default.getFirstMatch(/dolfin\/(\d+(\.?_?\d+)+)/i, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: [/tizen/i],
						describe: function(e) {
							var t = { name: "Tizen" }, r = i.default.getFirstMatch(/(?:tizen\s?)?browser\/(\d+(\.?_?\d+)+)/i, e) || i.default.getFirstMatch(s, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: [/qupzilla/i],
						describe: function(e) {
							var t = { name: "QupZilla" }, r = i.default.getFirstMatch(/(?:qupzilla)[\s/](\d+(\.?_?\d+)+)/i, e) || i.default.getFirstMatch(s, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: [/firefox|iceweasel|fxios/i],
						describe: function(e) {
							var t = { name: "Firefox" }, r = i.default.getFirstMatch(/(?:firefox|iceweasel|fxios)[\s/](\d+(\.?_?\d+)+)/i, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: [/electron/i],
						describe: function(e) {
							var t = { name: "Electron" }, r = i.default.getFirstMatch(/(?:electron)\/(\d+(\.?_?\d+)+)/i, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: [/MiuiBrowser/i],
						describe: function(e) {
							var t = { name: "Miui" }, r = i.default.getFirstMatch(/(?:MiuiBrowser)[\s/](\d+(\.?_?\d+)+)/i, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: [/chromium/i],
						describe: function(e) {
							var t = { name: "Chromium" }, r = i.default.getFirstMatch(/(?:chromium)[\s/](\d+(\.?_?\d+)+)/i, e) || i.default.getFirstMatch(s, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: [/chrome|crios|crmo/i],
						describe: function(e) {
							var t = { name: "Chrome" }, r = i.default.getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.?_?\d+)+)/i, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: [/GSA/i],
						describe: function(e) {
							var t = { name: "Google Search" }, r = i.default.getFirstMatch(/(?:GSA)\/(\d+(\.?_?\d+)+)/i, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: function(e) {
							var t = !e.test(/like android/i), r = e.test(/android/i);
							return t && r;
						},
						describe: function(e) {
							var t = { name: "Android Browser" }, r = i.default.getFirstMatch(s, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: [/playstation 4/i],
						describe: function(e) {
							var t = { name: "PlayStation 4" }, r = i.default.getFirstMatch(s, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: [/safari|applewebkit/i],
						describe: function(e) {
							var t = { name: "Safari" }, r = i.default.getFirstMatch(s, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: [/.*/i],
						describe: function(e) {
							var t = -1 !== e.search("\\(") ? /^(.*)\/(.*)[ \t]\((.*)/ : /^(.*)\/(.*) /;
							return {
								name: i.default.getFirstMatch(t, e),
								version: i.default.getSecondMatch(t, e)
							};
						}
					}
				], e.exports = t.default;
			},
			93: function(e, t, r) {
				"use strict";
				t.__esModule = !0, t.default = void 0;
				var n, i = (n = r(17)) && n.__esModule ? n : { default: n }, s = r(18);
				t.default = [
					{
						test: [/Roku\/DVP/],
						describe: function(e) {
							var t = i.default.getFirstMatch(/Roku\/DVP-(\d+\.\d+)/i, e);
							return {
								name: s.OS_MAP.Roku,
								version: t
							};
						}
					},
					{
						test: [/windows phone/i],
						describe: function(e) {
							var t = i.default.getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i, e);
							return {
								name: s.OS_MAP.WindowsPhone,
								version: t
							};
						}
					},
					{
						test: [/windows /i],
						describe: function(e) {
							var t = i.default.getFirstMatch(/Windows ((NT|XP)( \d\d?.\d)?)/i, e), r = i.default.getWindowsVersionName(t);
							return {
								name: s.OS_MAP.Windows,
								version: t,
								versionName: r
							};
						}
					},
					{
						test: [/Macintosh(.*?) FxiOS(.*?)\//],
						describe: function(e) {
							var t = { name: s.OS_MAP.iOS }, r = i.default.getSecondMatch(/(Version\/)(\d[\d.]+)/, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: [/macintosh/i],
						describe: function(e) {
							var t = i.default.getFirstMatch(/mac os x (\d+(\.?_?\d+)+)/i, e).replace(/[_\s]/g, "."), r = i.default.getMacOSVersionName(t), n = {
								name: s.OS_MAP.MacOS,
								version: t
							};
							return r && (n.versionName = r), n;
						}
					},
					{
						test: [/(ipod|iphone|ipad)/i],
						describe: function(e) {
							var t = i.default.getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i, e).replace(/[_\s]/g, ".");
							return {
								name: s.OS_MAP.iOS,
								version: t
							};
						}
					},
					{
						test: function(e) {
							var t = !e.test(/like android/i), r = e.test(/android/i);
							return t && r;
						},
						describe: function(e) {
							var t = i.default.getFirstMatch(/android[\s/-](\d+(\.\d+)*)/i, e), r = i.default.getAndroidVersionName(t), n = {
								name: s.OS_MAP.Android,
								version: t
							};
							return r && (n.versionName = r), n;
						}
					},
					{
						test: [/(web|hpw)[o0]s/i],
						describe: function(e) {
							var t = i.default.getFirstMatch(/(?:web|hpw)[o0]s\/(\d+(\.\d+)*)/i, e), r = { name: s.OS_MAP.WebOS };
							return t && t.length && (r.version = t), r;
						}
					},
					{
						test: [/blackberry|\bbb\d+/i, /rim\stablet/i],
						describe: function(e) {
							var t = i.default.getFirstMatch(/rim\stablet\sos\s(\d+(\.\d+)*)/i, e) || i.default.getFirstMatch(/blackberry\d+\/(\d+([_\s]\d+)*)/i, e) || i.default.getFirstMatch(/\bbb(\d+)/i, e);
							return {
								name: s.OS_MAP.BlackBerry,
								version: t
							};
						}
					},
					{
						test: [/bada/i],
						describe: function(e) {
							var t = i.default.getFirstMatch(/bada\/(\d+(\.\d+)*)/i, e);
							return {
								name: s.OS_MAP.Bada,
								version: t
							};
						}
					},
					{
						test: [/tizen/i],
						describe: function(e) {
							var t = i.default.getFirstMatch(/tizen[/\s](\d+(\.\d+)*)/i, e);
							return {
								name: s.OS_MAP.Tizen,
								version: t
							};
						}
					},
					{
						test: [/linux/i],
						describe: function() {
							return { name: s.OS_MAP.Linux };
						}
					},
					{
						test: [/CrOS/],
						describe: function() {
							return { name: s.OS_MAP.ChromeOS };
						}
					},
					{
						test: [/PlayStation 4/],
						describe: function(e) {
							var t = i.default.getFirstMatch(/PlayStation 4[/\s](\d+(\.\d+)*)/i, e);
							return {
								name: s.OS_MAP.PlayStation4,
								version: t
							};
						}
					}
				], e.exports = t.default;
			},
			94: function(e, t, r) {
				"use strict";
				t.__esModule = !0, t.default = void 0;
				var n, i = (n = r(17)) && n.__esModule ? n : { default: n }, s = r(18);
				t.default = [
					{
						test: [/googlebot/i],
						describe: function() {
							return {
								type: "bot",
								vendor: "Google"
							};
						}
					},
					{
						test: [/huawei/i],
						describe: function(e) {
							var t = i.default.getFirstMatch(/(can-l01)/i, e) && "Nova", r = {
								type: s.PLATFORMS_MAP.mobile,
								vendor: "Huawei"
							};
							return t && (r.model = t), r;
						}
					},
					{
						test: [/nexus\s*(?:7|8|9|10).*/i],
						describe: function() {
							return {
								type: s.PLATFORMS_MAP.tablet,
								vendor: "Nexus"
							};
						}
					},
					{
						test: [/ipad/i],
						describe: function() {
							return {
								type: s.PLATFORMS_MAP.tablet,
								vendor: "Apple",
								model: "iPad"
							};
						}
					},
					{
						test: [/Macintosh(.*?) FxiOS(.*?)\//],
						describe: function() {
							return {
								type: s.PLATFORMS_MAP.tablet,
								vendor: "Apple",
								model: "iPad"
							};
						}
					},
					{
						test: [/kftt build/i],
						describe: function() {
							return {
								type: s.PLATFORMS_MAP.tablet,
								vendor: "Amazon",
								model: "Kindle Fire HD 7"
							};
						}
					},
					{
						test: [/silk/i],
						describe: function() {
							return {
								type: s.PLATFORMS_MAP.tablet,
								vendor: "Amazon"
							};
						}
					},
					{
						test: [/tablet(?! pc)/i],
						describe: function() {
							return { type: s.PLATFORMS_MAP.tablet };
						}
					},
					{
						test: function(e) {
							var t = e.test(/ipod|iphone/i), r = e.test(/like (ipod|iphone)/i);
							return t && !r;
						},
						describe: function(e) {
							var t = i.default.getFirstMatch(/(ipod|iphone)/i, e);
							return {
								type: s.PLATFORMS_MAP.mobile,
								vendor: "Apple",
								model: t
							};
						}
					},
					{
						test: [/nexus\s*[0-6].*/i, /galaxy nexus/i],
						describe: function() {
							return {
								type: s.PLATFORMS_MAP.mobile,
								vendor: "Nexus"
							};
						}
					},
					{
						test: [/[^-]mobi/i],
						describe: function() {
							return { type: s.PLATFORMS_MAP.mobile };
						}
					},
					{
						test: function(e) {
							return "blackberry" === e.getBrowserName(!0);
						},
						describe: function() {
							return {
								type: s.PLATFORMS_MAP.mobile,
								vendor: "BlackBerry"
							};
						}
					},
					{
						test: function(e) {
							return "bada" === e.getBrowserName(!0);
						},
						describe: function() {
							return { type: s.PLATFORMS_MAP.mobile };
						}
					},
					{
						test: function(e) {
							return "windows phone" === e.getBrowserName();
						},
						describe: function() {
							return {
								type: s.PLATFORMS_MAP.mobile,
								vendor: "Microsoft"
							};
						}
					},
					{
						test: function(e) {
							var t = Number(String(e.getOSVersion()).split(".")[0]);
							return "android" === e.getOSName(!0) && t >= 3;
						},
						describe: function() {
							return { type: s.PLATFORMS_MAP.tablet };
						}
					},
					{
						test: function(e) {
							return "android" === e.getOSName(!0);
						},
						describe: function() {
							return { type: s.PLATFORMS_MAP.mobile };
						}
					},
					{
						test: function(e) {
							return "macos" === e.getOSName(!0);
						},
						describe: function() {
							return {
								type: s.PLATFORMS_MAP.desktop,
								vendor: "Apple"
							};
						}
					},
					{
						test: function(e) {
							return "windows" === e.getOSName(!0);
						},
						describe: function() {
							return { type: s.PLATFORMS_MAP.desktop };
						}
					},
					{
						test: function(e) {
							return "linux" === e.getOSName(!0);
						},
						describe: function() {
							return { type: s.PLATFORMS_MAP.desktop };
						}
					},
					{
						test: function(e) {
							return "playstation 4" === e.getOSName(!0);
						},
						describe: function() {
							return { type: s.PLATFORMS_MAP.tv };
						}
					},
					{
						test: function(e) {
							return "roku" === e.getOSName(!0);
						},
						describe: function() {
							return { type: s.PLATFORMS_MAP.tv };
						}
					}
				], e.exports = t.default;
			},
			95: function(e, t, r) {
				"use strict";
				t.__esModule = !0, t.default = void 0;
				var n, i = (n = r(17)) && n.__esModule ? n : { default: n }, s = r(18);
				t.default = [
					{
						test: function(e) {
							return "microsoft edge" === e.getBrowserName(!0);
						},
						describe: function(e) {
							if (/\sedg\//i.test(e)) return { name: s.ENGINE_MAP.Blink };
							var t = i.default.getFirstMatch(/edge\/(\d+(\.?_?\d+)+)/i, e);
							return {
								name: s.ENGINE_MAP.EdgeHTML,
								version: t
							};
						}
					},
					{
						test: [/trident/i],
						describe: function(e) {
							var t = { name: s.ENGINE_MAP.Trident }, r = i.default.getFirstMatch(/trident\/(\d+(\.?_?\d+)+)/i, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: function(e) {
							return e.test(/presto/i);
						},
						describe: function(e) {
							var t = { name: s.ENGINE_MAP.Presto }, r = i.default.getFirstMatch(/presto\/(\d+(\.?_?\d+)+)/i, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: function(e) {
							var t = e.test(/gecko/i), r = e.test(/like gecko/i);
							return t && !r;
						},
						describe: function(e) {
							var t = { name: s.ENGINE_MAP.Gecko }, r = i.default.getFirstMatch(/gecko\/(\d+(\.?_?\d+)+)/i, e);
							return r && (t.version = r), t;
						}
					},
					{
						test: [/(apple)?webkit\/537\.36/i],
						describe: function() {
							return { name: s.ENGINE_MAP.Blink };
						}
					},
					{
						test: [/(apple)?webkit/i],
						describe: function(e) {
							var t = { name: s.ENGINE_MAP.WebKit }, r = i.default.getFirstMatch(/webkit\/(\d+(\.?_?\d+)+)/i, e);
							return r && (t.version = r), t;
						}
					}
				], e.exports = t.default;
			}
		});
	}));
}));
//#endregion
//#region node_modules/@perawallet/connect/dist/index-13745370.js
var import_es5 = /* @__PURE__ */ __toESM(require_es5(), 1);
var i = "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, o = [], s = [], a = "undefined" != typeof Uint8Array ? Uint8Array : Array, c = !1;
function l() {
	c = !0;
	for (var e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", t = 0; t < 64; ++t) o[t] = e[t], s[e.charCodeAt(t)] = t;
	s["-".charCodeAt(0)] = 62, s["_".charCodeAt(0)] = 63;
}
function u(e, t, n) {
	for (var r, i, s = [], a = t; a < n; a += 3) r = (e[a] << 16) + (e[a + 1] << 8) + e[a + 2], s.push(o[(i = r) >> 18 & 63] + o[i >> 12 & 63] + o[i >> 6 & 63] + o[63 & i]);
	return s.join("");
}
function h(e) {
	var t;
	c || l();
	for (var n = e.length, r = n % 3, i = "", s = [], a = 16383, h = 0, d = n - r; h < d; h += a) s.push(u(e, h, h + a > d ? d : h + a));
	return 1 === r ? (t = e[n - 1], i += o[t >> 2], i += o[t << 4 & 63], i += "==") : 2 === r && (t = (e[n - 2] << 8) + e[n - 1], i += o[t >> 10], i += o[t >> 4 & 63], i += o[t << 2 & 63], i += "="), s.push(i), s.join("");
}
function d(e, t, n, r, i) {
	var o, s, a = 8 * i - r - 1, c = (1 << a) - 1, l = c >> 1, u = -7, h = n ? i - 1 : 0, d = n ? -1 : 1, f = e[t + h];
	for (h += d, o = f & (1 << -u) - 1, f >>= -u, u += a; u > 0; o = 256 * o + e[t + h], h += d, u -= 8);
	for (s = o & (1 << -u) - 1, o >>= -u, u += r; u > 0; s = 256 * s + e[t + h], h += d, u -= 8);
	if (0 === o) o = 1 - l;
	else {
		if (o === c) return s ? NaN : Infinity * (f ? -1 : 1);
		s += Math.pow(2, r), o -= l;
	}
	return (f ? -1 : 1) * s * Math.pow(2, o - r);
}
function f(e, t, n, r, i, o) {
	var s, a, c, l = 8 * o - i - 1, u = (1 << l) - 1, h = u >> 1, d = 23 === i ? Math.pow(2, -24) - Math.pow(2, -77) : 0, f = r ? 0 : o - 1, p = r ? 1 : -1, g = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;
	for (t = Math.abs(t), isNaN(t) || t === Infinity ? (a = isNaN(t) ? 1 : 0, s = u) : (s = Math.floor(Math.log(t) / Math.LN2), t * (c = Math.pow(2, -s)) < 1 && (s--, c *= 2), (t += s + h >= 1 ? d / c : d * Math.pow(2, 1 - h)) * c >= 2 && (s++, c /= 2), s + h >= u ? (a = 0, s = u) : s + h >= 1 ? (a = (t * c - 1) * Math.pow(2, i), s += h) : (a = t * Math.pow(2, h - 1) * Math.pow(2, i), s = 0)); i >= 8; e[n + f] = 255 & a, f += p, a /= 256, i -= 8);
	for (s = s << i | a, l += i; l > 0; e[n + f] = 255 & s, f += p, s /= 256, l -= 8);
	e[n + f - p] |= 128 * g;
}
var p = {}.toString, g = Array.isArray || function(e) {
	return "[object Array]" == p.call(e);
};
function w() {
	return y.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
}
function v(e, t) {
	if (w() < t) throw new RangeError("Invalid typed array length");
	return y.TYPED_ARRAY_SUPPORT ? (e = new Uint8Array(t)).__proto__ = y.prototype : (null === e && (e = new y(t)), e.length = t), e;
}
function y(e, t, n) {
	if (!(y.TYPED_ARRAY_SUPPORT || this instanceof y)) return new y(e, t, n);
	if ("number" == typeof e) {
		if ("string" == typeof t) throw new Error("If encoding is specified then the first argument must be a string");
		return A(this, e);
	}
	return m(this, e, t, n);
}
function m(e, t, n, r) {
	if ("number" == typeof t) throw new TypeError("\"value\" argument must not be a number");
	return "undefined" != typeof ArrayBuffer && t instanceof ArrayBuffer ? function(e, t, n, r) {
		if (t.byteLength, n < 0 || t.byteLength < n) throw new RangeError("'offset' is out of bounds");
		if (t.byteLength < n + (r || 0)) throw new RangeError("'length' is out of bounds");
		t = void 0 === n && void 0 === r ? new Uint8Array(t) : void 0 === r ? new Uint8Array(t, n) : new Uint8Array(t, n, r);
		y.TYPED_ARRAY_SUPPORT ? (e = t).__proto__ = y.prototype : e = E(e, t);
		return e;
	}(e, t, n, r) : "string" == typeof t ? function(e, t, n) {
		"string" == typeof n && "" !== n || (n = "utf8");
		if (!y.isEncoding(n)) throw new TypeError("\"encoding\" must be a valid string encoding");
		var r = 0 | I(t, n);
		e = v(e, r);
		var i = e.write(t, n);
		i !== r && (e = e.slice(0, i));
		return e;
	}(e, t, n) : function(e, t) {
		if (R(t)) {
			var n = 0 | T(t.length);
			return 0 === (e = v(e, n)).length || t.copy(e, 0, 0, n), e;
		}
		if (t) {
			if ("undefined" != typeof ArrayBuffer && t.buffer instanceof ArrayBuffer || "length" in t) return "number" != typeof t.length || (r = t.length) != r ? v(e, 0) : E(e, t);
			if ("Buffer" === t.type && g(t.data)) return E(e, t.data);
		}
		var r;
		throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
	}(e, t);
}
function b(e) {
	if ("number" != typeof e) throw new TypeError("\"size\" argument must be a number");
	if (e < 0) throw new RangeError("\"size\" argument must not be negative");
}
function A(e, t) {
	if (b(t), e = v(e, t < 0 ? 0 : 0 | T(t)), !y.TYPED_ARRAY_SUPPORT) for (var n = 0; n < t; ++n) e[n] = 0;
	return e;
}
function E(e, t) {
	var n = t.length < 0 ? 0 : 0 | T(t.length);
	e = v(e, n);
	for (var r = 0; r < n; r += 1) e[r] = 255 & t[r];
	return e;
}
function T(e) {
	if (e >= w()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + w().toString(16) + " bytes");
	return 0 | e;
}
function R(e) {
	return !(null == e || !e._isBuffer);
}
function I(e, t) {
	if (R(e)) return e.length;
	if ("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(e) || e instanceof ArrayBuffer)) return e.byteLength;
	"string" != typeof e && (e = "" + e);
	var n = e.length;
	if (0 === n) return 0;
	for (var r = !1;;) switch (t) {
		case "ascii":
		case "latin1":
		case "binary": return n;
		case "utf8":
		case "utf-8":
		case void 0: return Q(e).length;
		case "ucs2":
		case "ucs-2":
		case "utf16le":
		case "utf-16le": return 2 * n;
		case "hex": return n >>> 1;
		case "base64": return Z(e).length;
		default:
			if (r) return Q(e).length;
			t = ("" + t).toLowerCase(), r = !0;
	}
}
function S(e, t, n) {
	var r = !1;
	if ((void 0 === t || t < 0) && (t = 0), t > this.length) return "";
	if ((void 0 === n || n > this.length) && (n = this.length), n <= 0) return "";
	if ((n >>>= 0) <= (t >>>= 0)) return "";
	for (e || (e = "utf8");;) switch (e) {
		case "hex": return Y(this, t, n);
		case "utf8":
		case "utf-8": return x(this, t, n);
		case "ascii": return k(this, t, n);
		case "latin1":
		case "binary": return j(this, t, n);
		case "base64": return B(this, t, n);
		case "ucs2":
		case "ucs-2":
		case "utf16le":
		case "utf-16le": return $(this, t, n);
		default:
			if (r) throw new TypeError("Unknown encoding: " + e);
			e = (e + "").toLowerCase(), r = !0;
	}
}
function _(e, t, n) {
	var r = e[t];
	e[t] = e[n], e[n] = r;
}
function P(e, t, n, r, i) {
	if (0 === e.length) return -1;
	if ("string" == typeof n ? (r = n, n = 0) : n > 2147483647 ? n = 2147483647 : n < -2147483648 && (n = -2147483648), n = +n, isNaN(n) && (n = i ? 0 : e.length - 1), n < 0 && (n = e.length + n), n >= e.length) {
		if (i) return -1;
		n = e.length - 1;
	} else if (n < 0) {
		if (!i) return -1;
		n = 0;
	}
	if ("string" == typeof t && (t = y.from(t, r)), R(t)) return 0 === t.length ? -1 : N(e, t, n, r, i);
	if ("number" == typeof t) return t &= 255, y.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf ? i ? Uint8Array.prototype.indexOf.call(e, t, n) : Uint8Array.prototype.lastIndexOf.call(e, t, n) : N(e, [t], n, r, i);
	throw new TypeError("val must be string, number or Buffer");
}
function N(e, t, n, r, i) {
	var o, s = 1, a = e.length, c = t.length;
	if (void 0 !== r && ("ucs2" === (r = String(r).toLowerCase()) || "ucs-2" === r || "utf16le" === r || "utf-16le" === r)) {
		if (e.length < 2 || t.length < 2) return -1;
		s = 2, a /= 2, c /= 2, n /= 2;
	}
	function l(e, t) {
		return 1 === s ? e[t] : e.readUInt16BE(t * s);
	}
	if (i) {
		var u = -1;
		for (o = n; o < a; o++) if (l(e, o) === l(t, -1 === u ? 0 : o - u)) {
			if (-1 === u && (u = o), o - u + 1 === c) return u * s;
		} else -1 !== u && (o -= o - u), u = -1;
	} else for (n + c > a && (n = a - c), o = n; o >= 0; o--) {
		for (var h = !0, d = 0; d < c; d++) if (l(e, o + d) !== l(t, d)) {
			h = !1;
			break;
		}
		if (h) return o;
	}
	return -1;
}
function C(e, t, n, r) {
	n = Number(n) || 0;
	var i = e.length - n;
	r ? (r = Number(r)) > i && (r = i) : r = i;
	var o = t.length;
	if (o % 2 != 0) throw new TypeError("Invalid hex string");
	r > o / 2 && (r = o / 2);
	for (var s = 0; s < r; ++s) {
		var a = parseInt(t.substr(2 * s, 2), 16);
		if (isNaN(a)) return s;
		e[n + s] = a;
	}
	return s;
}
function O(e, t, n, r) {
	return ee(Q(t, e.length - n), e, n, r);
}
function L(e, t, n, r) {
	return ee(function(e) {
		for (var t = [], n = 0; n < e.length; ++n) t.push(255 & e.charCodeAt(n));
		return t;
	}(t), e, n, r);
}
function M(e, t, n, r) {
	return L(e, t, n, r);
}
function U(e, t, n, r) {
	return ee(Z(t), e, n, r);
}
function W(e, t, n, r) {
	return ee(function(e, t) {
		for (var n, r, i, o = [], s = 0; s < e.length && !((t -= 2) < 0); ++s) r = (n = e.charCodeAt(s)) >> 8, i = n % 256, o.push(i), o.push(r);
		return o;
	}(t, e.length - n), e, n, r);
}
function B(e, t, n) {
	return 0 === t && n === e.length ? h(e) : h(e.slice(t, n));
}
function x(e, t, n) {
	n = Math.min(e.length, n);
	for (var r = [], i = t; i < n;) {
		var o, s, a, c, l = e[i], u = null, h = l > 239 ? 4 : l > 223 ? 3 : l > 191 ? 2 : 1;
		if (i + h <= n) switch (h) {
			case 1:
				l < 128 && (u = l);
				break;
			case 2:
				128 == (192 & (o = e[i + 1])) && (c = (31 & l) << 6 | 63 & o) > 127 && (u = c);
				break;
			case 3:
				o = e[i + 1], s = e[i + 2], 128 == (192 & o) && 128 == (192 & s) && (c = (15 & l) << 12 | (63 & o) << 6 | 63 & s) > 2047 && (c < 55296 || c > 57343) && (u = c);
				break;
			case 4: o = e[i + 1], s = e[i + 2], a = e[i + 3], 128 == (192 & o) && 128 == (192 & s) && 128 == (192 & a) && (c = (15 & l) << 18 | (63 & o) << 12 | (63 & s) << 6 | 63 & a) > 65535 && c < 1114112 && (u = c);
		}
		null === u ? (u = 65533, h = 1) : u > 65535 && (u -= 65536, r.push(u >>> 10 & 1023 | 55296), u = 56320 | 1023 & u), r.push(u), i += h;
	}
	return function(e) {
		var t = e.length;
		if (t <= D) return String.fromCharCode.apply(String, e);
		var n = "", r = 0;
		for (; r < t;) n += String.fromCharCode.apply(String, e.slice(r, r += D));
		return n;
	}(r);
}
y.TYPED_ARRAY_SUPPORT = void 0 === i.TYPED_ARRAY_SUPPORT || i.TYPED_ARRAY_SUPPORT, w(), y.poolSize = 8192, y._augment = function(e) {
	return e.__proto__ = y.prototype, e;
}, y.from = function(e, t, n) {
	return m(null, e, t, n);
}, y.TYPED_ARRAY_SUPPORT && (y.prototype.__proto__ = Uint8Array.prototype, y.__proto__ = Uint8Array), y.alloc = function(e, t, n) {
	return function(e, t, n, r) {
		return b(t), t <= 0 ? v(e, t) : void 0 !== n ? "string" == typeof r ? v(e, t).fill(n, r) : v(e, t).fill(n) : v(e, t);
	}(null, e, t, n);
}, y.allocUnsafe = function(e) {
	return A(null, e);
}, y.allocUnsafeSlow = function(e) {
	return A(null, e);
}, y.isBuffer = function(e) {
	return null != e && (!!e._isBuffer || te(e) || function(e) {
		return "function" == typeof e.readFloatLE && "function" == typeof e.slice && te(e.slice(0, 0));
	}(e));
}, y.compare = function(e, t) {
	if (!R(e) || !R(t)) throw new TypeError("Arguments must be Buffers");
	if (e === t) return 0;
	for (var n = e.length, r = t.length, i = 0, o = Math.min(n, r); i < o; ++i) if (e[i] !== t[i]) {
		n = e[i], r = t[i];
		break;
	}
	return n < r ? -1 : r < n ? 1 : 0;
}, y.isEncoding = function(e) {
	switch (String(e).toLowerCase()) {
		case "hex":
		case "utf8":
		case "utf-8":
		case "ascii":
		case "latin1":
		case "binary":
		case "base64":
		case "ucs2":
		case "ucs-2":
		case "utf16le":
		case "utf-16le": return !0;
		default: return !1;
	}
}, y.concat = function(e, t) {
	if (!g(e)) throw new TypeError("\"list\" argument must be an Array of Buffers");
	if (0 === e.length) return y.alloc(0);
	var n;
	if (void 0 === t) for (t = 0, n = 0; n < e.length; ++n) t += e[n].length;
	var r = y.allocUnsafe(t), i = 0;
	for (n = 0; n < e.length; ++n) {
		var o = e[n];
		if (!R(o)) throw new TypeError("\"list\" argument must be an Array of Buffers");
		o.copy(r, i), i += o.length;
	}
	return r;
}, y.byteLength = I, y.prototype._isBuffer = !0, y.prototype.swap16 = function() {
	var e = this.length;
	if (e % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
	for (var t = 0; t < e; t += 2) _(this, t, t + 1);
	return this;
}, y.prototype.swap32 = function() {
	var e = this.length;
	if (e % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
	for (var t = 0; t < e; t += 4) _(this, t, t + 3), _(this, t + 1, t + 2);
	return this;
}, y.prototype.swap64 = function() {
	var e = this.length;
	if (e % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
	for (var t = 0; t < e; t += 8) _(this, t, t + 7), _(this, t + 1, t + 6), _(this, t + 2, t + 5), _(this, t + 3, t + 4);
	return this;
}, y.prototype.toString = function() {
	var e = 0 | this.length;
	return 0 === e ? "" : 0 === arguments.length ? x(this, 0, e) : S.apply(this, arguments);
}, y.prototype.equals = function(e) {
	if (!R(e)) throw new TypeError("Argument must be a Buffer");
	return this === e || 0 === y.compare(this, e);
}, y.prototype.inspect = function() {
	var e = "";
	return this.length > 0 && (e = this.toString("hex", 0, 50).match(/.{2}/g).join(" "), this.length > 50 && (e += " ... ")), "<Buffer " + e + ">";
}, y.prototype.compare = function(e, t, n, r, i) {
	if (!R(e)) throw new TypeError("Argument must be a Buffer");
	if (void 0 === t && (t = 0), void 0 === n && (n = e ? e.length : 0), void 0 === r && (r = 0), void 0 === i && (i = this.length), t < 0 || n > e.length || r < 0 || i > this.length) throw new RangeError("out of range index");
	if (r >= i && t >= n) return 0;
	if (r >= i) return -1;
	if (t >= n) return 1;
	if (this === e) return 0;
	for (var o = (i >>>= 0) - (r >>>= 0), s = (n >>>= 0) - (t >>>= 0), a = Math.min(o, s), c = this.slice(r, i), l = e.slice(t, n), u = 0; u < a; ++u) if (c[u] !== l[u]) {
		o = c[u], s = l[u];
		break;
	}
	return o < s ? -1 : s < o ? 1 : 0;
}, y.prototype.includes = function(e, t, n) {
	return -1 !== this.indexOf(e, t, n);
}, y.prototype.indexOf = function(e, t, n) {
	return P(this, e, t, n, !0);
}, y.prototype.lastIndexOf = function(e, t, n) {
	return P(this, e, t, n, !1);
}, y.prototype.write = function(e, t, n, r) {
	if (void 0 === t) r = "utf8", n = this.length, t = 0;
	else if (void 0 === n && "string" == typeof t) r = t, n = this.length, t = 0;
	else {
		if (!isFinite(t)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
		t |= 0, isFinite(n) ? (n |= 0, void 0 === r && (r = "utf8")) : (r = n, n = void 0);
	}
	var i = this.length - t;
	if ((void 0 === n || n > i) && (n = i), e.length > 0 && (n < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");
	r || (r = "utf8");
	for (var o = !1;;) switch (r) {
		case "hex": return C(this, e, t, n);
		case "utf8":
		case "utf-8": return O(this, e, t, n);
		case "ascii": return L(this, e, t, n);
		case "latin1":
		case "binary": return M(this, e, t, n);
		case "base64": return U(this, e, t, n);
		case "ucs2":
		case "ucs-2":
		case "utf16le":
		case "utf-16le": return W(this, e, t, n);
		default:
			if (o) throw new TypeError("Unknown encoding: " + r);
			r = ("" + r).toLowerCase(), o = !0;
	}
}, y.prototype.toJSON = function() {
	return {
		type: "Buffer",
		data: Array.prototype.slice.call(this._arr || this, 0)
	};
};
var D = 4096;
function k(e, t, n) {
	var r = "";
	n = Math.min(e.length, n);
	for (var i = t; i < n; ++i) r += String.fromCharCode(127 & e[i]);
	return r;
}
function j(e, t, n) {
	var r = "";
	n = Math.min(e.length, n);
	for (var i = t; i < n; ++i) r += String.fromCharCode(e[i]);
	return r;
}
function Y(e, t, n) {
	var r = e.length;
	(!t || t < 0) && (t = 0), (!n || n < 0 || n > r) && (n = r);
	for (var i = "", o = t; o < n; ++o) i += V(e[o]);
	return i;
}
function $(e, t, n) {
	for (var r = e.slice(t, n), i = "", o = 0; o < r.length; o += 2) i += String.fromCharCode(r[o] + 256 * r[o + 1]);
	return i;
}
function q(e, t, n) {
	if (e % 1 != 0 || e < 0) throw new RangeError("offset is not uint");
	if (e + t > n) throw new RangeError("Trying to access beyond buffer length");
}
function F(e, t, n, r, i, o) {
	if (!R(e)) throw new TypeError("\"buffer\" argument must be a Buffer instance");
	if (t > i || t < o) throw new RangeError("\"value\" argument is out of bounds");
	if (n + r > e.length) throw new RangeError("Index out of range");
}
function G(e, t, n, r) {
	t < 0 && (t = 65535 + t + 1);
	for (var i = 0, o = Math.min(e.length - n, 2); i < o; ++i) e[n + i] = (t & 255 << 8 * (r ? i : 1 - i)) >>> 8 * (r ? i : 1 - i);
}
function H(e, t, n, r) {
	t < 0 && (t = 4294967295 + t + 1);
	for (var i = 0, o = Math.min(e.length - n, 4); i < o; ++i) e[n + i] = t >>> 8 * (r ? i : 3 - i) & 255;
}
function J(e, t, n, r, i, o) {
	if (n + r > e.length) throw new RangeError("Index out of range");
	if (n < 0) throw new RangeError("Index out of range");
}
function z(e, t, n, r, i) {
	return i || J(e, 0, n, 4), f(e, t, n, r, 23, 4), n + 4;
}
function K(e, t, n, r, i) {
	return i || J(e, 0, n, 8), f(e, t, n, r, 52, 8), n + 8;
}
y.prototype.slice = function(e, t) {
	var n, r = this.length;
	if ((e = ~~e) < 0 ? (e += r) < 0 && (e = 0) : e > r && (e = r), (t = void 0 === t ? r : ~~t) < 0 ? (t += r) < 0 && (t = 0) : t > r && (t = r), t < e && (t = e), y.TYPED_ARRAY_SUPPORT) (n = this.subarray(e, t)).__proto__ = y.prototype;
	else {
		var i = t - e;
		n = new y(i, void 0);
		for (var o = 0; o < i; ++o) n[o] = this[o + e];
	}
	return n;
}, y.prototype.readUIntLE = function(e, t, n) {
	e |= 0, t |= 0, n || q(e, t, this.length);
	for (var r = this[e], i = 1, o = 0; ++o < t && (i *= 256);) r += this[e + o] * i;
	return r;
}, y.prototype.readUIntBE = function(e, t, n) {
	e |= 0, t |= 0, n || q(e, t, this.length);
	for (var r = this[e + --t], i = 1; t > 0 && (i *= 256);) r += this[e + --t] * i;
	return r;
}, y.prototype.readUInt8 = function(e, t) {
	return t || q(e, 1, this.length), this[e];
}, y.prototype.readUInt16LE = function(e, t) {
	return t || q(e, 2, this.length), this[e] | this[e + 1] << 8;
}, y.prototype.readUInt16BE = function(e, t) {
	return t || q(e, 2, this.length), this[e] << 8 | this[e + 1];
}, y.prototype.readUInt32LE = function(e, t) {
	return t || q(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3];
}, y.prototype.readUInt32BE = function(e, t) {
	return t || q(e, 4, this.length), 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]);
}, y.prototype.readIntLE = function(e, t, n) {
	e |= 0, t |= 0, n || q(e, t, this.length);
	for (var r = this[e], i = 1, o = 0; ++o < t && (i *= 256);) r += this[e + o] * i;
	return r >= (i *= 128) && (r -= Math.pow(2, 8 * t)), r;
}, y.prototype.readIntBE = function(e, t, n) {
	e |= 0, t |= 0, n || q(e, t, this.length);
	for (var r = t, i = 1, o = this[e + --r]; r > 0 && (i *= 256);) o += this[e + --r] * i;
	return o >= (i *= 128) && (o -= Math.pow(2, 8 * t)), o;
}, y.prototype.readInt8 = function(e, t) {
	return t || q(e, 1, this.length), 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e];
}, y.prototype.readInt16LE = function(e, t) {
	t || q(e, 2, this.length);
	var n = this[e] | this[e + 1] << 8;
	return 32768 & n ? 4294901760 | n : n;
}, y.prototype.readInt16BE = function(e, t) {
	t || q(e, 2, this.length);
	var n = this[e + 1] | this[e] << 8;
	return 32768 & n ? 4294901760 | n : n;
}, y.prototype.readInt32LE = function(e, t) {
	return t || q(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24;
}, y.prototype.readInt32BE = function(e, t) {
	return t || q(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3];
}, y.prototype.readFloatLE = function(e, t) {
	return t || q(e, 4, this.length), d(this, e, !0, 23, 4);
}, y.prototype.readFloatBE = function(e, t) {
	return t || q(e, 4, this.length), d(this, e, !1, 23, 4);
}, y.prototype.readDoubleLE = function(e, t) {
	return t || q(e, 8, this.length), d(this, e, !0, 52, 8);
}, y.prototype.readDoubleBE = function(e, t) {
	return t || q(e, 8, this.length), d(this, e, !1, 52, 8);
}, y.prototype.writeUIntLE = function(e, t, n, r) {
	(e = +e, t |= 0, n |= 0, r) || F(this, e, t, n, Math.pow(2, 8 * n) - 1, 0);
	var i = 1, o = 0;
	for (this[t] = 255 & e; ++o < n && (i *= 256);) this[t + o] = e / i & 255;
	return t + n;
}, y.prototype.writeUIntBE = function(e, t, n, r) {
	(e = +e, t |= 0, n |= 0, r) || F(this, e, t, n, Math.pow(2, 8 * n) - 1, 0);
	var i = n - 1, o = 1;
	for (this[t + i] = 255 & e; --i >= 0 && (o *= 256);) this[t + i] = e / o & 255;
	return t + n;
}, y.prototype.writeUInt8 = function(e, t, n) {
	return e = +e, t |= 0, n || F(this, e, t, 1, 255, 0), y.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), this[t] = 255 & e, t + 1;
}, y.prototype.writeUInt16LE = function(e, t, n) {
	return e = +e, t |= 0, n || F(this, e, t, 2, 65535, 0), y.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8) : G(this, e, t, !0), t + 2;
}, y.prototype.writeUInt16BE = function(e, t, n) {
	return e = +e, t |= 0, n || F(this, e, t, 2, 65535, 0), y.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 & e) : G(this, e, t, !1), t + 2;
}, y.prototype.writeUInt32LE = function(e, t, n) {
	return e = +e, t |= 0, n || F(this, e, t, 4, 4294967295, 0), y.TYPED_ARRAY_SUPPORT ? (this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = 255 & e) : H(this, e, t, !0), t + 4;
}, y.prototype.writeUInt32BE = function(e, t, n) {
	return e = +e, t |= 0, n || F(this, e, t, 4, 4294967295, 0), y.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : H(this, e, t, !1), t + 4;
}, y.prototype.writeIntLE = function(e, t, n, r) {
	if (e = +e, t |= 0, !r) {
		var i = Math.pow(2, 8 * n - 1);
		F(this, e, t, n, i - 1, -i);
	}
	var o = 0, s = 1, a = 0;
	for (this[t] = 255 & e; ++o < n && (s *= 256);) e < 0 && 0 === a && 0 !== this[t + o - 1] && (a = 1), this[t + o] = (e / s | 0) - a & 255;
	return t + n;
}, y.prototype.writeIntBE = function(e, t, n, r) {
	if (e = +e, t |= 0, !r) {
		var i = Math.pow(2, 8 * n - 1);
		F(this, e, t, n, i - 1, -i);
	}
	var o = n - 1, s = 1, a = 0;
	for (this[t + o] = 255 & e; --o >= 0 && (s *= 256);) e < 0 && 0 === a && 0 !== this[t + o + 1] && (a = 1), this[t + o] = (e / s | 0) - a & 255;
	return t + n;
}, y.prototype.writeInt8 = function(e, t, n) {
	return e = +e, t |= 0, n || F(this, e, t, 1, 127, -128), y.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), e < 0 && (e = 255 + e + 1), this[t] = 255 & e, t + 1;
}, y.prototype.writeInt16LE = function(e, t, n) {
	return e = +e, t |= 0, n || F(this, e, t, 2, 32767, -32768), y.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8) : G(this, e, t, !0), t + 2;
}, y.prototype.writeInt16BE = function(e, t, n) {
	return e = +e, t |= 0, n || F(this, e, t, 2, 32767, -32768), y.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 & e) : G(this, e, t, !1), t + 2;
}, y.prototype.writeInt32LE = function(e, t, n) {
	return e = +e, t |= 0, n || F(this, e, t, 4, 2147483647, -2147483648), y.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24) : H(this, e, t, !0), t + 4;
}, y.prototype.writeInt32BE = function(e, t, n) {
	return e = +e, t |= 0, n || F(this, e, t, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), y.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : H(this, e, t, !1), t + 4;
}, y.prototype.writeFloatLE = function(e, t, n) {
	return z(this, e, t, !0, n);
}, y.prototype.writeFloatBE = function(e, t, n) {
	return z(this, e, t, !1, n);
}, y.prototype.writeDoubleLE = function(e, t, n) {
	return K(this, e, t, !0, n);
}, y.prototype.writeDoubleBE = function(e, t, n) {
	return K(this, e, t, !1, n);
}, y.prototype.copy = function(e, t, n, r) {
	if (n || (n = 0), r || 0 === r || (r = this.length), t >= e.length && (t = e.length), t || (t = 0), r > 0 && r < n && (r = n), r === n) return 0;
	if (0 === e.length || 0 === this.length) return 0;
	if (t < 0) throw new RangeError("targetStart out of bounds");
	if (n < 0 || n >= this.length) throw new RangeError("sourceStart out of bounds");
	if (r < 0) throw new RangeError("sourceEnd out of bounds");
	r > this.length && (r = this.length), e.length - t < r - n && (r = e.length - t + n);
	var i, o = r - n;
	if (this === e && n < t && t < r) for (i = o - 1; i >= 0; --i) e[i + t] = this[i + n];
	else if (o < 1e3 || !y.TYPED_ARRAY_SUPPORT) for (i = 0; i < o; ++i) e[i + t] = this[i + n];
	else Uint8Array.prototype.set.call(e, this.subarray(n, n + o), t);
	return o;
}, y.prototype.fill = function(e, t, n, r) {
	if ("string" == typeof e) {
		if ("string" == typeof t ? (r = t, t = 0, n = this.length) : "string" == typeof n && (r = n, n = this.length), 1 === e.length) {
			var i = e.charCodeAt(0);
			i < 256 && (e = i);
		}
		if (void 0 !== r && "string" != typeof r) throw new TypeError("encoding must be a string");
		if ("string" == typeof r && !y.isEncoding(r)) throw new TypeError("Unknown encoding: " + r);
	} else "number" == typeof e && (e &= 255);
	if (t < 0 || this.length < t || this.length < n) throw new RangeError("Out of range index");
	if (n <= t) return this;
	var o;
	if (t >>>= 0, n = void 0 === n ? this.length : n >>> 0, e || (e = 0), "number" == typeof e) for (o = t; o < n; ++o) this[o] = e;
	else {
		var s = R(e) ? e : Q(new y(e, r).toString()), a = s.length;
		for (o = 0; o < n - t; ++o) this[o + t] = s[o % a];
	}
	return this;
};
var X = /[^+\/0-9A-Za-z-_]/g;
function V(e) {
	return e < 16 ? "0" + e.toString(16) : e.toString(16);
}
function Q(e, t) {
	var n;
	t = t || Infinity;
	for (var r = e.length, i = null, o = [], s = 0; s < r; ++s) {
		if ((n = e.charCodeAt(s)) > 55295 && n < 57344) {
			if (!i) {
				if (n > 56319) {
					(t -= 3) > -1 && o.push(239, 191, 189);
					continue;
				}
				if (s + 1 === r) {
					(t -= 3) > -1 && o.push(239, 191, 189);
					continue;
				}
				i = n;
				continue;
			}
			if (n < 56320) {
				(t -= 3) > -1 && o.push(239, 191, 189), i = n;
				continue;
			}
			n = 65536 + (i - 55296 << 10 | n - 56320);
		} else i && (t -= 3) > -1 && o.push(239, 191, 189);
		if (i = null, n < 128) {
			if ((t -= 1) < 0) break;
			o.push(n);
		} else if (n < 2048) {
			if ((t -= 2) < 0) break;
			o.push(n >> 6 | 192, 63 & n | 128);
		} else if (n < 65536) {
			if ((t -= 3) < 0) break;
			o.push(n >> 12 | 224, n >> 6 & 63 | 128, 63 & n | 128);
		} else {
			if (!(n < 1114112)) throw new Error("Invalid code point");
			if ((t -= 4) < 0) break;
			o.push(n >> 18 | 240, n >> 12 & 63 | 128, n >> 6 & 63 | 128, 63 & n | 128);
		}
	}
	return o;
}
function Z(e) {
	return function(e) {
		var t, n, r, i, o, u;
		c || l();
		var h = e.length;
		if (h % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
		o = "=" === e[h - 2] ? 2 : "=" === e[h - 1] ? 1 : 0, u = new a(3 * h / 4 - o), r = o > 0 ? h - 4 : h;
		var d = 0;
		for (t = 0, n = 0; t < r; t += 4, n += 3) i = s[e.charCodeAt(t)] << 18 | s[e.charCodeAt(t + 1)] << 12 | s[e.charCodeAt(t + 2)] << 6 | s[e.charCodeAt(t + 3)], u[d++] = i >> 16 & 255, u[d++] = i >> 8 & 255, u[d++] = 255 & i;
		return 2 === o ? (i = s[e.charCodeAt(t)] << 2 | s[e.charCodeAt(t + 1)] >> 4, u[d++] = 255 & i) : 1 === o && (i = s[e.charCodeAt(t)] << 10 | s[e.charCodeAt(t + 1)] << 4 | s[e.charCodeAt(t + 2)] >> 2, u[d++] = i >> 8 & 255, u[d++] = 255 & i), u;
	}(function(e) {
		if ((e = function(e) {
			return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "");
		}(e).replace(X, "")).length < 2) return "";
		for (; e.length % 4 != 0;) e += "=";
		return e;
	}(e));
}
function ee(e, t, n, r) {
	for (var i = 0; i < r && !(i + n >= t.length || i >= e.length); ++i) t[i + n] = e[i];
	return i;
}
function te(e) {
	return !!e.constructor && "function" == typeof e.constructor.isBuffer && e.constructor.isBuffer(e);
}
function ne(e, t, n, r) {
	return new (n || (n = Promise))((function(i, o) {
		function s(e) {
			try {
				c(r.next(e));
			} catch (e) {
				o(e);
			}
		}
		function a(e) {
			try {
				c(r.throw(e));
			} catch (e) {
				o(e);
			}
		}
		function c(e) {
			var t;
			e.done ? i(e.value) : (t = e.value, t instanceof n ? t : new n((function(e) {
				e(t);
			}))).then(s, a);
		}
		c((r = r.apply(e, t || [])).next());
	}));
}
var re = class re extends Error {
	constructor(e, t, ...n) {
		super(...n), Error.captureStackTrace && Error.captureStackTrace(this, re), this.name = "PeraWalletConnectError", this.data = e, this.message = t;
	}
};
var ie = new class {
	constructor(e) {
		this.listener = void 0, this.channel = e.channel;
	}
	setupListener({ onReceiveMessage: e }) {
		this.close(), this.listener = (t) => {
			if ("object" == typeof t.data) try {
				t.data.channel === this.channel && e(t);
			} catch (e) {
				console.error(e);
			}
		}, window.addEventListener("message", this.listener);
	}
	sendMessage({ message: e, targetWindow: t, origin: n, timeout: r = 1e3 }) {
		setTimeout((() => {
			const r = {
				channel: this.channel,
				message: e
			};
			t.postMessage(r, { targetOrigin: n || "*" });
		}), r);
	}
	close() {
		this.listener && (window.removeEventListener("message", this.listener), this.listener = void 0);
	}
}({ channel: "pera-web-wallet" }), oe = 700, se = 50;
function ae() {
	const e = document.querySelector("meta[name=\"name\"]"), t = document.querySelector("meta[name=\"description\"]");
	let { title: n } = document, r = "";
	return e instanceof HTMLMetaElement && (n = e.content), t instanceof HTMLMetaElement && (r = t.content), {
		title: n,
		description: r,
		url: window.location.origin,
		favicon: ce()[0]
	};
}
function ce() {
	const e = document.getElementsByTagName("link"), t = [];
	for (let n = 0; n < e.length; n++) {
		const r = e[n], i = r.getAttribute("rel");
		if (i && i.toLowerCase().indexOf("icon") > -1) {
			const e = r.getAttribute("href");
			if (e && -1 === e.toLowerCase().indexOf("https:") && -1 === e.toLowerCase().indexOf("http:") && 0 !== e.indexOf("//")) {
				let n = `${window.location.protocol}//${window.location.host}`;
				if (0 === e.indexOf("/")) n += e;
				else {
					const t = window.location.pathname.split("/");
					t.pop();
					n += `${t.join("/")}/${e}`;
				}
				t.push(n);
			} else if (0 === (null == e ? void 0 : e.indexOf("//"))) {
				const n = window.location.protocol + e;
				t.push(n);
			} else e && t.push(e);
		}
	}
	return t;
}
function le(e) {
	return new Promise(((t, n) => {
		try {
			const r = window.open(e, "_blank");
			let i = 0;
			const o = setInterval((() => {
				if (i += 1, i === se) return clearInterval(o), void n(new re({ type: "MESSAGE_NOT_RECEIVED" }, "Couldn't open Pera Wallet, please try again."));
				r && (!0 === r.closed && (clearInterval(o), n(new re({ type: "OPERATION_CANCELLED" }, "Operation cancelled by user"))), ie.sendMessage({
					message: { type: "TAB_OPEN" },
					origin: e,
					targetWindow: r
				}));
			}), oe);
			ie.setupListener({ onReceiveMessage: (e) => {
				"TAB_OPEN_RECEIVED" === e.data.message.type && (clearInterval(o), t(r));
			} });
		} catch (e) {
			n(e);
		}
	}));
}
function ue() {
	return "undefined" != typeof navigator;
}
function he() {
	return ue() && /iPhone|iPad|iPod/i.test(navigator.userAgent);
}
function de() {
	return ue() && /iPhone|iPod|Android/i.test(navigator.userAgent);
}
function fe() {
	if (!ue()) return null;
	const { userAgent: e } = navigator;
	let t;
	return t = e.match(/DuckDuckGo/i) ? "DuckDuckGo" : e.match(/OPX/i) ? "Opera GX" : navigator.brave ? "Brave" : import_es5.default.getParser(navigator.userAgent).getBrowserName(), t;
}
var pe = "perawallet-wc://", ge = "https://perawallet.app/download/", we = [77, 88];
function ve(e) {
	return {
		ROOT: `https://${e}`,
		CONNECT: `https://${e}/connect`,
		TRANSACTION_SIGN: `https://${e}/transaction/sign`
	};
}
function ye(e = !0) {
	let t = pe;
	const n = fe();
	return e && n && (t = `${t}?browser=${encodeURIComponent(n)}`), t;
}
function me(e, t) {
	let n = ye(!1);
	he() && !n.includes("-wc") && (n = n.replace("://", "-wc://"));
	let r = `${n}wc?uri=${encodeURIComponent(e)}`;
	const i = fe();
	return ue() && /Android/i.test(navigator.userAgent) && (r = e), i && (r = `${r}&browser=${encodeURIComponent(i)}`), null != t && t.singleAccount && (r = `${r}&singleAccount=true`), null != t && t.selectedAccount && "undefined" !== t.selectedAccount && (r = `${r}&selectedAccount=${t.selectedAccount}`), r;
}
var be = "pera-wallet-connect-modal-wrapper", Ae = "pera-wallet-redirect-modal-wrapper", Ee = "pera-wallet-sign-txn-toast-wrapper", Te = "pera-wallet-sign-txn-modal-wrapper", Re = "pera-wallet-modal";
function Ie(e) {
	const t = document.createElement("div");
	return t.setAttribute("id", e), document.body.appendChild(t), t;
}
function Se() {
	Ie(Ae).innerHTML = "<pera-wallet-redirect-modal></pera-wallet-redirect-modal>";
}
function _e() {
	Ie(Ee).innerHTML = "<pera-wallet-sign-txn-toast></pera-wallet-sign-txn-toast>";
}
function Pe() {
	Ne(Ee);
}
function Ne(e) {
	const t = document.getElementById(e);
	t && t.remove();
}
var Ce = {
	WALLET: "PeraWallet.Wallet",
	WALLETCONNECT: "walletconnect"
};
function Oe() {
	return "undefined" == typeof localStorage ? void 0 : localStorage;
}
function Le(e, t) {
	var n;
	null === (n = Oe()) || void 0 === n || n.setItem(Ce.WALLET, JSON.stringify({
		type: t || "pera-wallet",
		accounts: e,
		selectedAccount: e[0]
	}));
}
function Me() {
	var e;
	const t = null === (e = Oe()) || void 0 === e ? void 0 : e.getItem(Ce.WALLET);
	return t ? JSON.parse(t) : null;
}
function Ue() {
	return new Promise(((e, t) => {
		var n, r;
		try {
			null === (n = Oe()) || void 0 === n || n.removeItem(Ce.WALLETCONNECT), null === (r = Oe()) || void 0 === r || r.removeItem(Ce.WALLET), e(void 0);
		} catch (e) {
			t(e);
		}
	}));
}
function We(e) {
	const t = e.slice();
	for (let e = t.length - 1; e > 0; e--) {
		const n = Math.floor(Math.random() * (e + 1));
		[t[e], t[n]] = [t[n], t[e]];
	}
	return t;
}
var Be = "https://wc.perawallet.app/config.json";
function xe() {
	return function(e, t = {}) {
		return fetch(e, t).then(((e) => e.json())).then(((e) => e));
	}(Be, { cache: "no-store" });
}
function De() {
	return ne(this, void 0, void 0, (function* () {
		let e = {
			bridgeURL: "",
			webWalletURL: "",
			isWebWalletAvailable: !1,
			shouldDisplayNewBadge: !1,
			shouldUseSound: !0,
			silent: !1,
			promoteMobile: !1
		};
		try {
			const t = yield xe();
			void 0 !== t.web_wallet && t.web_wallet_url && (e.isWebWalletAvailable = t.web_wallet), void 0 !== t.display_new_badge && (e.shouldDisplayNewBadge = t.display_new_badge), void 0 !== t.use_sound && (e.shouldUseSound = t.use_sound), void 0 !== t.silent && (e.silent = t.silent), void 0 !== t.promote_mobile && (e.promoteMobile = t.promote_mobile), e = Object.assign(Object.assign({}, e), {
				bridgeURL: We(t.servers || [])[0] || "",
				webWalletURL: t.web_wallet_url || ""
			});
		} catch (e) {
			console.log(e);
		}
		return e;
	}));
}
function ke(e) {
	return Uint8Array.from(window.atob(e), ((e) => e.charCodeAt(0)));
}
function je(e, t) {
	return {
		id: Date.now() * Math.pow(10, 3) + Math.floor(Math.random() * Math.pow(10, 3)),
		jsonrpc: "2.0",
		method: e,
		params: t
	};
}
function Ye({ method: e, signTxnRequestParams: t, signer: n, chainId: r, webWalletURL: i, resolve: o, reject: s }) {
	const a = ve(i);
	(function() {
		ne(this, void 0, void 0, (function* () {
			try {
				const i = yield le(a.TRANSACTION_SIGN);
				if (i) {
					let o;
					"SIGN_TXN" === e ? o = {
						type: "SIGN_TXN",
						txn: t
					} : "SIGN_DATA" === e && n && r && (o = {
						type: "SIGN_DATA",
						data: t,
						signer: n,
						chainId: r
					}), o && ie.sendMessage({
						message: o,
						origin: a.TRANSACTION_SIGN,
						targetWindow: i
					});
				}
				const c = setInterval((() => {
					!0 === (null == i ? void 0 : i.closed) && (s(new re({ type: `${e}_CANCELLED` }, "Transaction signing is cancelled by user.")), clearInterval(c));
				}), 2e3);
				ie.setupListener({ onReceiveMessage: (t) => function({ event: e, newPeraWalletTab: t, method: n, resolve: r, reject: i }) {
					switch (e.data.message.type) {
						case "SIGN_TXN_CALLBACK":
							t?.close(), r(e.data.message.signedTxns.map(((e) => ke(e.signedTxn))));
							break;
						case "SIGN_DATA_CALLBACK":
							t?.close(), r(e.data.message.signedData.map(((e) => ke(e.signedData))));
							break;
						case "SIGN_TXN_NETWORK_MISMATCH":
							i(new re({
								type: `${n}_NETWORK_MISMATCH`,
								detail: e.data.message.error
							}, e.data.message.error || "Network mismatch"));
							break;
						case "SIGN_TXN_CALLBACK_ERROR":
							t?.close(), i(new re({ type: `${n}_CANCELLED` }, e.data.message.error));
							break;
						case "SESSION_DISCONNECTED": t?.close(), Ue(), i(new re({
							type: "SESSION_DISCONNECTED",
							detail: e.data.message.error
						}, e.data.message.error));
					}
				}({
					event: t,
					newPeraWalletTab: i,
					method: e,
					resolve: o,
					reject: s
				}) });
			} catch (e) {
				s(e);
			}
		}));
	})();
}
function $e({ webWalletURL: e, chainId: t, resolve: n, reject: r }) {
	const i = ve(e);
	return function() {
		return ne(this, void 0, void 0, (function* () {
			try {
				const e = yield le(i.CONNECT);
				e && ie.sendMessage({
					message: {
						type: "CONNECT",
						data: Object.assign(Object.assign({}, ae()), { chainId: t })
					},
					origin: i.CONNECT,
					targetWindow: e
				});
				const s = setInterval((() => {
					!0 === (null == e ? void 0 : e.closed) && (r(new re({ type: "CONNECT_CANCELLED" }, "Connect is cancelled by user")), clearInterval(s), o());
				}), 2e3);
				ie.setupListener({ onReceiveMessage: (t) => function({ event: e, newPeraWalletTab: t, resolve: n, reject: r }) {
					if (n && "CONNECT_CALLBACK" === e.data.message.type) {
						const r = e.data.message.data.addresses;
						Le(r, "pera-wallet-web"), n(r), Ne(be), t?.close();
					} else "CONNECT_NETWORK_MISMATCH" === e.data.message.type && (r(new re({
						type: "CONNECT_NETWORK_MISMATCH",
						detail: e.data.message.error
					}, e.data.message.error || "Your wallet is connected to a different network to this dApp. Update your wallet to the correct network (MainNet or TestNet) to continue.")), Ne("pera-wallet-connect-modal-wrapper"), t?.close());
				}({
					event: t,
					newPeraWalletTab: e,
					resolve: n,
					reject: r
				}) });
			} catch (e) {
				o(), r(e);
			}
		}));
	};
	function o() {
		Ne(be);
	}
}
var qe = 416001, Fe = 416002, Ge = {
	clientToken: "0dw4Qu6ckPJTQY540Z0sEokH910KUWKjsf312fxNtTcVjw5UUhhlK4s4odcXIoEz",
	indexerToken: "KegWFLYQnBNVeP4oHCX64dObBk8VemzYdNqsnAOIxYQ8aqJLQTYeVDQyZNnx1PZA",
	port: 443
}, He = {
	mainnet: { algodev: Object.assign(Object.assign({}, Ge), {
		clientServer: "https://node-mainnet.chain.perawallet.app/",
		indexerServer: "https://indexer-mainnet.chain.perawallet.app/",
		chainId: qe
	}) },
	testnet: { algodev: Object.assign(Object.assign({}, Ge), {
		clientServer: "https://node-testnet.chain.perawallet.app/",
		indexerServer: "https://indexer-testnet.chain.perawallet.app/",
		chainId: Fe
	}) }
};
function Je(e, t) {
	const { mainnet: n, testnet: r } = He, i = "mainnet" === e ? n : r;
	return {
		tokens: {
			client: i[t].clientToken,
			indexer: i[t].indexerToken
		},
		server: {
			client: i[t].clientServer,
			indexer: i[t].indexerServer
		},
		port: i[t].port
	};
}
var ze = class {
	constructor({ network: e, providerType: n }) {
		const r = Je(e, n);
		this.providerType = n, this.client = new esm_default.Algodv2(r.tokens.client, r.server.client, r.port), this.indexer = new esm_default.Indexer(r.tokens.indexer, r.server.indexer, r.port);
	}
	updateClient(e, n) {
		const r = Je(e, n);
		this.providerType = n, this.client = new esm_default.Algodv2(r.tokens.client, r.server.client, r.port), this.indexer = new esm_default.Indexer(r.tokens.indexer, r.server.indexer, r.port);
	}
};
var Ke;
(function(e) {
	e[e.ParseError = -32700] = "ParseError", e[e.InvalidRequest = -32600] = "InvalidRequest", e[e.MethodNotFound = -32601] = "MethodNotFound", e[e.InvalidParams = -32602] = "InvalidParams", e[e.InternalError = -32603] = "InternalError", e[e.ServerErrorStart = -32e3] = "ServerErrorStart", e[e.ServerErrorEnd = -32099] = "ServerErrorEnd";
})(Ke || (Ke = {}));
var Xe = 0;
function Ve() {
	const e = Date.now(), t = Xe++, n = e.toString().slice(-8), r = t.toString().padStart(4, "0");
	return parseInt(`${n}${r}`, 10);
}
function Qe(e) {
	if (!e || "object" != typeof e) return !1;
	const t = e;
	return "2.0" === t.jsonrpc && ("result" in t || "error" in t) && (null === t.id || "string" == typeof t.id || "number" == typeof t.id);
}
var Ze = class Ze extends Error {
	constructor(e) {
		super(e.message), this.name = "JsonRpcError", this.code = e.code, this.data = e.data, Error.captureStackTrace && Error.captureStackTrace(this, Ze);
	}
	getMessage() {
		return `[${this.code}] ${this.message}`;
	}
};
var et = new class {
	constructor() {
		this.listeners = /* @__PURE__ */ new Map(), this.pendingRequests = /* @__PURE__ */ new Map(), this.isListening = !1;
	}
	startListening() {
		this.isListening || (window.addEventListener("message", this.handleMessage.bind(this)), this.isListening = !0);
	}
	handleMessage(e) {
		try {
			const n = "string" == typeof e.data ? JSON.parse(e.data) : e.data;
			if (!n || "object" != typeof n) return;
			if (t = n, Array.isArray(t) && t.every(((e) => Qe(e)))) return void this.handleBatchResponse(n);
			if (Qe(n)) return void this.handleJsonRpcResponse(n);
			(function(e) {
				if (!e || "object" != typeof e) return !1;
				const t = e;
				return "2.0" === t.jsonrpc && "string" == typeof t.method && !("id" in t);
			})(n) && this.handleJsonRpcNotification(n);
		} catch (e) {}
		var t;
	}
	handleBatchResponse(e) {
		e.forEach(((e) => {
			this.handleJsonRpcResponse(e);
		}));
	}
	handleJsonRpcResponse(e) {
		const { id: t } = e;
		if (null === t) return;
		const n = this.pendingRequests.get(t);
		if (n) {
			if (clearTimeout(n.timeoutHandle), this.pendingRequests.delete(t), "error" in e) {
				const t = function(e) {
					switch (e.code) {
						case Ke.ParseError: return new Ze({
							code: Ke.ParseError,
							message: "Parse error",
							data: e.data
						});
						case Ke.InvalidRequest: return new Ze({
							code: Ke.InvalidRequest,
							message: "Invalid Request",
							data: e.data
						});
						case Ke.MethodNotFound: return new Ze({
							code: Ke.MethodNotFound,
							message: e.message || "Method not found",
							data: e.data
						});
						case Ke.InvalidParams: return new Ze({
							code: Ke.InvalidParams,
							message: "Invalid params",
							data: e.data
						});
						case Ke.InternalError: return new Ze({
							code: Ke.InternalError,
							message: "Internal error",
							data: e.data
						});
						default: return e.code >= Ke.ServerErrorStart && (e.code, Ke.ServerErrorEnd), new Ze(e);
					}
				}(e.error);
				n.reject(t);
			} else if ("result" in e) try {
				const t = this.parsePayload(e.result);
				n.resolve(t);
			} catch (e) {
				n.reject(e instanceof Error ? e : /* @__PURE__ */ new Error(`Failed to parse result for method ${n.method}`));
			}
		}
	}
	handleJsonRpcNotification(e) {
		const { method: t, params: n } = e, r = this.listeners.get(t);
		if (r) {
			const e = this.parsePayload(n);
			r.forEach(((n) => {
				try {
					n(e);
				} catch (e) {
					console.error(`Error in handler for method ${t}:`, e);
				}
			}));
		}
	}
	parsePayload(e) {
		if ("string" == typeof e) try {
			const t = window.atob(e);
			return JSON.parse(t);
		} catch (t) {
			try {
				return JSON.parse(e);
			} catch (t) {
				return e;
			}
		}
		return e;
	}
	waitForResponse(e, t, n = 5e3) {
		return this.startListening(), new Promise(((r, i) => {
			const o = this.pendingRequests.get(e);
			o && (clearTimeout(o.timeoutHandle), o.reject(/* @__PURE__ */ new Error(`New request for ${t} (id: ${e}) cancelled previous request`)));
			const s = setTimeout((() => {
				this.pendingRequests.delete(e), i(/* @__PURE__ */ new Error(`Timeout waiting for response from ${t} (id: ${e})`));
			}), n);
			this.pendingRequests.set(e, {
				resolve: r,
				reject: i,
				timeoutHandle: s,
				method: t
			});
		}));
	}
	onAction(e, t) {
		this.startListening(), this.listeners.has(e) || this.listeners.set(e, /* @__PURE__ */ new Set());
		const n = this.listeners.get(e);
		return n.add(t), () => {
			n.delete(t), 0 === n.size && this.listeners.delete(e);
		};
	}
	cleanup() {
		this.pendingRequests.forEach(((e) => {
			clearTimeout(e.timeoutHandle), e.reject(/* @__PURE__ */ new Error("Message listener cleaned up"));
		})), this.pendingRequests.clear(), this.listeners.clear(), this.isListening && (window.removeEventListener("message", this.handleMessage.bind(this)), this.isListening = !1);
	}
}();
function tt(e) {
	var t;
	const n = window.peraMobileInterface, r = function() {
		var e;
		return null === (e = window.webkit) || void 0 === e ? void 0 : e.messageHandlers;
	}(), i = JSON.stringify(e);
	null != n && n.handleRequest && n.handleRequest(i), !(null === (t = null == r ? void 0 : r.handleRequest) || void 0 === t) && t.postMessage && r.handleRequest.postMessage(i);
}
function nt(e, t = 5e3, n) {
	const r = Ve(), i = et.waitForResponse(r, e, t);
	return tt(function(e, t, n) {
		const r = null != n ? n : Ve();
		return Object.assign(Object.assign({
			jsonrpc: "2.0",
			method: e
		}, void 0 !== t && { params: t }), { id: r });
	}(e, n, r)), i;
}
function rt({ isWebWalletAvailable: e, shouldDisplayNewBadge: t, shouldUseSound: n, compactMode: r, promoteMobile: i, singleAccount: o, selectedAccount: s, isInWebview: a }) {
	return {
		open: (c = {
			isWebWalletAvailable: e,
			shouldDisplayNewBadge: t,
			shouldUseSound: n,
			compactMode: r,
			promoteMobile: i,
			singleAccount: o,
			selectedAccount: s,
			isInWebview: a
		}, (e) => {
			const { isWebWalletAvailable: t, shouldDisplayNewBadge: n, shouldUseSound: r, compactMode: i, promoteMobile: o, singleAccount: s, selectedAccount: a, isInWebview: l } = c;
			if (l) {
				const t = me(e, {
					singleAccount: s,
					selectedAccount: a
				});
				window.open(t, "_blank");
			} else if (!document.getElementById("pera-wallet-connect-modal-wrapper")) {
				const c = `${e}&algorand=true`;
				Ie(be).innerHTML = `<pera-wallet-connect-modal uri="${c}" is-web-wallet-avaliable="${t}" should-display-new-badge="${n}" should-use-sound="${r}" compact-mode="${i}" promote-mobile="${o}" single-account="${s}" selected-account="${a || ""}" is-in-webview="${l || !1}"></pera-wallet-connect-modal>`;
			}
		}),
		close: () => Ne(be)
	};
	var c;
}
var it = class {
	constructor(e) {
		this._configPromise = null, this._webviewCheckPromise = null, this.bridge = (null == e ? void 0 : e.bridge) || "", this.connector = null, this.shouldShowSignTxnToast = void 0 === (null == e ? void 0 : e.shouldShowSignTxnToast) || e.shouldShowSignTxnToast, this.chainId = null == e ? void 0 : e.chainId, this.isInWebview = !1, this.compactMode = (null == e ? void 0 : e.compactMode) || !1, this.singleAccount = (null == e ? void 0 : e.singleAccount) || !1, this.algodClients = /* @__PURE__ */ new Map(), this._configPromise = De(), this._webviewCheckPromise = this.checkIsInWebview();
	}
	get platform() {
		return function() {
			const e = Me();
			let t = null;
			return "pera-wallet" === (null == e ? void 0 : e.type) ? t = "mobile" : "pera-wallet-web" === (null == e ? void 0 : e.type) && (t = "web"), t;
		}();
	}
	get isConnected() {
		var e;
		return "mobile" === this.platform ? !!this.connector : "web" === this.platform && !!(null === (e = Me()) || void 0 === e ? void 0 : e.accounts.length);
	}
	get isPeraDiscoverBrowser() {
		return this.checkIsPeraDiscoverBrowser();
	}
	checkIsInWebview() {
		return ne(this, void 0, void 0, (function* () {
			if (de()) try {
				return null !== (yield function(e = 2e3) {
					return nt("getPublicSettings", e);
				}());
			} catch (e) {
				return !1;
			}
			return !1;
		}));
	}
	connect(t) {
		return new Promise(((n, r) => ne(this, void 0, void 0, (function* () {
			var i, o, s;
			try {
				if (null === (i = this.connector) || void 0 === i ? void 0 : i.connected) try {
					yield this.connector.killSession();
				} catch (e) {}
				const { isWebWalletAvailable: a, bridgeURL: c, webWalletURL: l, shouldDisplayNewBadge: u, shouldUseSound: h, promoteMobile: d } = yield null !== (o = this._configPromise) && void 0 !== o ? o : De();
				this._configPromise = De(), this.isInWebview = yield null !== (s = this._webviewCheckPromise) && void 0 !== s ? s : this.checkIsInWebview(), this._webviewCheckPromise = this.checkIsInWebview();
				const f = $e({
					resolve: n,
					reject: r,
					webWalletURL: l,
					chainId: this.chainId,
					isCompactMode: this.compactMode
				});
				a && (window.onWebWalletConnect = f), this.connector = new WalletConnect({
					bridge: this.bridge || c || "https://bridge.walletconnect.org",
					qrcodeModal: rt({
						isWebWalletAvailable: a,
						shouldDisplayNewBadge: u,
						shouldUseSound: h,
						compactMode: this.compactMode,
						promoteMobile: d,
						singleAccount: this.singleAccount,
						selectedAccount: null == t ? void 0 : t.selectedAccount,
						isInWebview: this.isInWebview
					})
				}), yield this.connector.createSession({ chainId: this.chainId || 4160 }), function(e, t) {
					var n, r, i, o;
					const s = document.getElementById(e), a = null === (r = null === (n = null == s ? void 0 : s.querySelector(e.replace("-wrapper", ""))) || void 0 === n ? void 0 : n.shadowRoot) || void 0 === r ? void 0 : r.querySelector(`.${Re}`);
					(null === (o = null === (i = null == a ? void 0 : a.querySelector("pera-wallet-modal-header")) || void 0 === i ? void 0 : i.shadowRoot) || void 0 === o ? void 0 : o.getElementById("pera-wallet-modal-header-close-button"))?.addEventListener("click", (() => {
						t(), Ne(e);
					}));
				}(be, (() => r(new re({ type: "CONNECT_MODAL_CLOSED" }, "Connect modal is closed by user")))), this.connector.on("connect", ((e, t) => {
					var i, o;
					e && r(e), n((null === (i = this.connector) || void 0 === i ? void 0 : i.accounts) || []), Le((null === (o = this.connector) || void 0 === o ? void 0 : o.accounts) || []);
				}));
			} catch (e) {
				console.log(e), r(new re({
					type: "SESSION_CONNECT",
					detail: e
				}, e.message || "There was an error while connecting to Pera Wallet"));
			}
		}))));
	}
	reconnectSession() {
		return new Promise(((t, n) => ne(this, void 0, void 0, (function* () {
			var r, i;
			try {
				const o = Me();
				if (!o) return void t([]);
				if ("pera-wallet-web" === (null == o ? void 0 : o.type)) {
					const { isWebWalletAvailable: e } = yield De();
					e ? t(o.accounts || []) : n(new re({
						type: "SESSION_RECONNECT",
						detail: "Pera Web is not available"
					}, "Pera Web is not available"));
				}
				this.isInWebview = yield this.checkIsInWebview(), this.connector && t(this.connector.accounts || []), this.bridge = (null === (r = function() {
					var e;
					const t = null === (e = Oe()) || void 0 === e ? void 0 : e.getItem(Ce.WALLETCONNECT);
					return t ? JSON.parse(t) : null;
				}()) || void 0 === r ? void 0 : r.bridge) || "", this.bridge && (this.connector = new WalletConnect({ bridge: this.bridge }), t((null === (i = this.connector) || void 0 === i ? void 0 : i.accounts) || [])), this.isConnected || t([]);
			} catch (e) {
				yield this.disconnect(), n(new re({
					type: "SESSION_RECONNECT",
					detail: e
				}, e.message || "There was an error while reconnecting to Pera Wallet"));
			}
		}))));
	}
	disconnect() {
		var e;
		return ne(this, void 0, void 0, (function* () {
			let t;
			this.isConnected && "mobile" === this.platform && (t = null === (e = this.connector) || void 0 === e ? void 0 : e.killSession(), t?.then((() => {
				this.connector = null;
			}))), yield Ue();
		}));
	}
	verifySignature(e, r, i) {
		try {
			const { publicKey: o } = esm_default.decodeAddress(i);
			return sign_detached_verify(function(...e) {
				const t = e.reduce(((e, t) => e + t.length), 0), n = new Uint8Array(t);
				let r = 0;
				for (let t = 0; t < e.length; t++) n.set(e[t], r), r += e[t].length;
				return n;
			}(we, e), r, o);
		} catch (e) {
			return !1;
		}
	}
	signTransactionWithMobile(e) {
		return ne(this, void 0, void 0, (function* () {
			const t = je("algo_signTxn", [e]);
			try {
				try {
					const { silent: e } = yield De(), n = (yield this.connector.sendCustomRequest(t, { forcePushNotification: !e })).filter(Boolean);
					return "string" == typeof n[0] ? n.map(ke) : n.map(((e) => Uint8Array.from(e)));
				} catch (e) {
					return yield Promise.reject(new re({
						type: "SIGN_TRANSACTIONS",
						detail: e
					}, e.message || "Failed to sign transaction"));
				}
			} finally {
				Ne(Ae), Ne(Ee);
			}
		}));
	}
	signTransactionWithWeb(e, t) {
		return new Promise(((n, r) => Ye({
			signTxnRequestParams: e,
			webWalletURL: t,
			method: "SIGN_TXN",
			resolve: n,
			reject: r
		})));
	}
	signDataWithMobile({ data: e, signer: t, chainId: n }) {
		return ne(this, void 0, void 0, (function* () {
			const r = je("algo_signData", e.map(((e) => Object.assign(Object.assign({}, e), {
				signer: t,
				chainId: n
			}))));
			try {
				try {
					const { silent: e } = yield De(), t = yield this.connector.sendCustomRequest(r, { forcePushNotification: !e });
					return "string" == typeof t[0] ? t.map(ke) : t.map(((e) => Uint8Array.from(e)));
				} catch (e) {
					return yield Promise.reject(new re({
						type: "SIGN_TRANSACTIONS",
						detail: e
					}, e.message || "Failed to sign transaction"));
				}
			} finally {
				Ne(Ae), Ne(Ee);
			}
		}));
	}
	signDataWithWeb({ data: e, signer: t, chainId: n, webWalletURL: r }) {
		return new Promise(((i, o) => Ye({
			method: "SIGN_DATA",
			signTxnRequestParams: e,
			signer: t,
			chainId: n,
			webWalletURL: r,
			resolve: i,
			reject: o
		})));
	}
	checkIsPeraDiscoverBrowser() {
		return window.navigator.userAgent.includes("pera");
	}
	getAlgodClient(e) {
		if (!this.algodClients.has(e)) {
			const t = new ze({
				network: e,
				providerType: "algodev"
			});
			this.algodClients.set(e, t);
		}
		return this.algodClients.get(e);
	}
	getAccountAuthAddr(e, t) {
		return ne(this, void 0, void 0, (function* () {
			try {
				const n = function(e) {
					return e === qe || 4160 === e ? "mainnet" : e === Fe ? "testnet" : "mainnet";
				}(t), i = yield this.getAlgodClient(n).client.accountInformation(e).do();
				return i.authAddr ? String(i.authAddr) : null;
			} catch (e) {
				return null;
			}
		}));
	}
	signTransaction(e, n) {
		return ne(this, void 0, void 0, (function* () {
			if ("mobile" === this.platform && (de() && !this.isInWebview ? Se() : !de() && this.shouldShowSignTxnToast && _e(), !this.connector)) throw new Error("PeraWalletConnect was not initialized correctly.");
			const r = e.flatMap(((e) => e.map(((e) => function(e, n) {
				let r;
				n && !(e.signers || []).includes(n) && (r = []);
				const i = { txn: (o = e.txn, Buffer.from(esm_default.encodeUnsignedTransaction(o)).toString("base64")) };
				var o;
				return Array.isArray(r) && (i.signers = r), e.authAddr && (i.authAddr = e.authAddr), e.message && (i.message = e.message), e.msig && (i.msig = e.msig), i;
			}(e, n)))));
			if ("web" === this.platform) {
				const { webWalletURL: e } = yield De();
				return this.signTransactionWithWeb(r, e);
			}
			return this.signTransactionWithMobile(r);
		}));
	}
	signData(e, t, n) {
		return ne(this, void 0, void 0, (function* () {
			const r = this.chainId || 4160;
			if ("mobile" === this.platform && (de() && !this.isInWebview ? Se() : !de() && this.shouldShowSignTxnToast && _e(), !this.connector)) throw new Error("PeraWalletConnect was not initialized correctly.");
			let i;
			if ("web" === this.platform) {
				const { webWalletURL: n } = yield De();
				i = yield this.signDataWithWeb({
					data: e,
					signer: t,
					chainId: r,
					webWalletURL: n
				});
			} else {
				const n = e.map(((e) => Object.assign(Object.assign({}, e), { data: Buffer.from(e.data).toString("base64") })));
				i = yield this.signDataWithMobile({
					data: n,
					signer: t,
					chainId: r
				});
			}
			if (n) {
				const n = (yield this.getAccountAuthAddr(t, r)) || t;
				for (let t = 0; t < i.length; t++) {
					const r = i[t], o = e[t].data;
					if (!this.verifySignature(o, r, n)) throw new re({ type: "SIGN_DATA_VERIFICATION_FAILED" }, `Signature verification failed for data item at index ${t}`);
				}
			}
			return i;
		}));
	}
};
"undefined" != typeof window && (window.global = window, window.Buffer = window.Buffer || y, import("./App-c13c039a-vTB1PpsY.js"));
//#endregion
export { Re as a, de as c, it as d, me as f, Pe as i, ge as l, require_es5 as m, Ee as n, Te as o, ye as p, Ne as r, be as s, Ae as t, he as u };

//# sourceMappingURL=index-13745370-B37uz783.js.map