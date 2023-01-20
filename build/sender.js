"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
var libphonenumber_js_1 = __importStar(require("libphonenumber-js"));
var venom_bot_1 = require("venom-bot");
var Button = /** @class */ (function () {
    function Button() {
    }
    return Button;
}());
exports.Button = Button;
var Sender = /** @class */ (function () {
    function Sender(session, OnMessage) {
        this.session = session;
        this.onMessage = OnMessage;
    }
    Object.defineProperty(Sender.prototype, "isConnected", {
        get: function () {
            return this.connected;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sender.prototype, "qrCode", {
        get: function () {
            return this.qr;
        },
        enumerable: false,
        configurable: true
    });
    Sender.prototype.open = function () {
        this.initialize();
    };
    Sender.prototype.close = function () {
        this.client.close();
    };
    Sender.prototype.checkAndFormatPhone = function (to) {
        /// 556792784000@c.us
        var _a, _b;
        var phoneNumber = (_b = (_a = (0, libphonenumber_js_1.default)(to, "BR")) === null || _a === void 0 ? void 0 : _a.format("E.164")) === null || _b === void 0 ? void 0 : _b.replace("+", "");
        phoneNumber = phoneNumber.replace(/^(55[0-9]{2})([^2-4]{1}[0-9]{7})$/, "$19$2");
        phoneNumber = phoneNumber.includes("@c.us")
            ? phoneNumber
            : "".concat(phoneNumber, "@c.us");
        if (!(0, libphonenumber_js_1.isValidPhoneNumber)(phoneNumber.replace("@c.us", ""), "BR")) {
            throw new Error("N\u00FAmero de telefone n\u00E3o v\u00E1lido para no Brasil ".concat(phoneNumber));
        }
        return phoneNumber;
    };
    Sender.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var qr, status, start, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        qr = function (base64Qrimg, asciiQR, attempt, urlCode) {
                            console.log(asciiQR); // Optional to log the QR in the terminal
                            var matches = base64Qrimg.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                            if ((matches === null || matches === void 0 ? void 0 : matches.length) !== 3) {
                                return new Error('Invalid input string');
                            }
                            _this.qr = base64Qrimg;
                            var imageBuffer = {
                                type: matches[1],
                                data: Buffer.from(matches[2], 'base64')
                            };
                            require('fs').writeFile('out.png', imageBuffer['data'], 'binary', function (err) {
                                if (err != null) {
                                    console.log(err);
                                }
                            });
                        };
                        status = function (statusGet, session) {
                            //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken
                            _this.connected = ["isLogged", "qrReadSuccess", "chatsAvailable"].includes(statusGet);
                        };
                        start = function (OnMessage) { return __awaiter(_this, void 0, void 0, function () {
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        console.log('client start');
                                        // DISCONNECTED
                                        // SYNCING
                                        // RESUMING
                                        // CONNECTED
                                        return [4 /*yield*/, this.client.onStreamChange(function (state) {
                                                console.log('State Connection Stream: ' + state);
                                                if (state === 'CONNECTED') {
                                                    _this.connected = true;
                                                }
                                            })];
                                    case 1:
                                        // DISCONNECTED
                                        // SYNCING
                                        // RESUMING
                                        // CONNECTED
                                        _a.sent();
                                        console.log('inject client onAnyMessage');
                                        return [4 /*yield*/, this.client.onAnyMessage(function (message) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                                return [2 /*return*/, this.connected = true];
                                            }); }); })];
                                    case 2:
                                        _a.sent();
                                        console.log('inject client onMessage');
                                        return [4 /*yield*/, this.client.onMessage(function (message) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, OnMessage(message)];
                                                    case 1: return [2 /*return*/, _a.sent()];
                                                }
                                            }); }); })];
                                    case 3:
                                        _a.sent();
                                        console.log('send test msg');
                                        return [4 /*yield*/, this.sendText("5567992784000@c.us", "WS ok!")];
                                    case 4:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); };
                        _a = this;
                        return [4 /*yield*/, (0, venom_bot_1.create)({
                                session: this.session,
                                catchQR: qr,
                                statusFind: undefined,
                                debug: true,
                                disableSpins: true,
                                disableWelcome: true,
                                autoClose: 120000,
                                logQR: false,
                            })];
                    case 1:
                        _a.client = _b.sent();
                        return [4 /*yield*/, start(this.onMessage)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Sender.prototype.startTyping = function (to) {
        return __awaiter(this, void 0, void 0, function () {
            var phoneNumber;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        phoneNumber = this.checkAndFormatPhone(to);
                        return [4 /*yield*/, this.client.startTyping(phoneNumber)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Sender.prototype.stopTyping = function (to) {
        return __awaiter(this, void 0, void 0, function () {
            var phoneNumber;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        phoneNumber = this.checkAndFormatPhone(to);
                        return [4 /*yield*/, this.client.stopTyping(phoneNumber)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Sender.prototype.sendSeen = function (to) {
        return __awaiter(this, void 0, void 0, function () {
            var phoneNumber;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        phoneNumber = this.checkAndFormatPhone(to);
                        return [4 /*yield*/, this.client.sendSeen(phoneNumber)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Sender.prototype.sendText = function (to, body) {
        return __awaiter(this, void 0, void 0, function () {
            var phoneNumber;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        phoneNumber = this.checkAndFormatPhone(to);
                        return [4 /*yield*/, this.client.sendText(phoneNumber, body)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Sender.prototype.sendLocation = function (to, latitude, longitude, title) {
        return __awaiter(this, void 0, void 0, function () {
            var phoneNumber;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        phoneNumber = this.checkAndFormatPhone(to);
                        return [4 /*yield*/, this.client.sendLocation(phoneNumber, latitude, longitude, title)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Sender.prototype.sendButtons = function (to, title, buttons, subtitle) {
        return __awaiter(this, void 0, void 0, function () {
            var phoneNumber;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        phoneNumber = this.checkAndFormatPhone(to);
                        return [4 /*yield*/, this.client.sendButtons(phoneNumber, title, buttons, subtitle)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return Sender;
}());
exports.default = Sender;
