"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var sender_1 = __importDefault(require("./sender"));
var axios_1 = __importDefault(require("axios"));
var endpoints_config_1 = __importDefault(require("./endpoints.config"));
var senders = new Map();
process.on('SIGINT', function () {
    senders.forEach(function (sender) {
        sender.close();
    });
});
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.get("/:session/stat", function (req, res) {
    var _a;
    var session = req.params.session;
    if (senders.get(session) === undefined) {
        senders.set(session, new sender_1.default(session, function (message) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                //console.log(message)
                if (message.type !== "chat" && message.type !== "buttons_response")
                    return [2 /*return*/];
                if (!message.to.match(/^[0-9]{12,13}@c\.us$/))
                    return [2 /*return*/];
                if (message.chatId !== message.from)
                    return [2 /*return*/];
                try {
                    axios_1.default.post("".concat(endpoints_config_1.default.ApiBaseUrl, "Message/?sender=").concat(session), message, {
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                        },
                    }).catch(function (err) { return console.error(err); });
                }
                catch (err) {
                    console.error(err);
                }
                return [2 /*return*/];
            });
        }); }));
        (_a = senders.get(session)) === null || _a === void 0 ? void 0 : _a.open();
    }
    var sender = senders.get(session);
    return res.send({
        connected: sender.isConnected,
        qr: sender.qrCode
    });
});
app.post("/:session/startTyping", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var number, session, sender, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                number = req.body.number;
                session = req.params.session;
                sender = senders.get(session);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, sender.startTyping(number)
                        .then(function () {
                        return res.status(200).json();
                    })
                        .catch(function (err) {
                        console.log("error", err);
                        res.status(500).json({ status: "error", message: err });
                    })];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                sender.close();
                sender.open();
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.post("/:session/stopTyping", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var number, session, sender, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                number = req.body.number;
                session = req.params.session;
                sender = senders.get(session);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, sender.stopTyping(number)
                        .then(function () {
                        return res.status(200).json();
                    })
                        .catch(function (err) {
                        console.log("error", err);
                        res.status(500).json({ status: "error", message: err });
                    })];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                sender.close();
                sender.open();
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.post("/:session/sendSeen", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var number, session, sender, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                number = req.body.number;
                session = req.params.session;
                sender = senders.get(session);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, sender.sendSeen(number)
                        .then(function () {
                        return res.status(200).json();
                    })
                        .catch(function (err) {
                        console.log("error", err);
                        res.status(500).json({ status: "error", message: err });
                    })];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_3 = _a.sent();
                sender.close();
                sender.open();
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.post("/:session/sendText", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, number, message, session, sender, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, number = _a.number, message = _a.message;
                session = req.params.session;
                sender = senders.get(session);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, sender.sendText(number, message)
                        .then(function (data) {
                        return res.status(200).json(data);
                    })
                        .catch(function (err) {
                        console.log("error", err);
                        res.status(500).json({ status: "error", message: err });
                    })];
            case 2:
                _b.sent();
                return [3 /*break*/, 4];
            case 3:
                err_4 = _b.sent();
                sender.close();
                sender.open();
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.post("/:session/sendButtons", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, number, title, buttons, subtitle, session, sender, err_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, number = _a.number, title = _a.title, buttons = _a.buttons, subtitle = _a.subtitle;
                session = req.params.session;
                sender = senders.get(session);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, sender.sendButtons(number, title, buttons, subtitle)
                        .then(function (data) {
                        return res.status(200).json(data);
                    })
                        .catch(function (err) {
                        console.log("error", err);
                        res.status(500).json({ status: "error", message: err });
                    })];
            case 2:
                _b.sent();
                return [3 /*break*/, 4];
            case 3:
                err_5 = _b.sent();
                sender.close();
                sender.open();
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.post("/:session/sendLocation", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, number, latitude, longitude, title, session, sender, err_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, number = _a.number, latitude = _a.latitude, longitude = _a.longitude, title = _a.title;
                session = req.params.session;
                sender = senders.get(session);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, sender.sendLocation(number, latitude, longitude, title)
                        .then(function () {
                        return res.status(200).json();
                    })
                        .catch(function (err) {
                        console.log("error", err);
                        res.status(500).json({ status: "error", message: err });
                    })];
            case 2:
                _b.sent();
                return [3 /*break*/, 4];
            case 3:
                err_6 = _b.sent();
                sender.close();
                sender.open();
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.listen(5000, function () {
    console.log("Server started");
});
