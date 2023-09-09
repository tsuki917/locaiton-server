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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var express_1 = require("express");
var app = (0, express_1.default)();
var firestore_1 = require("firebase/firestore");
var firestore_2 = require("firebase/firestore");
// Import the functions you need from the SDKs you
var app_1 = require("firebase/app");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: process.env.APIKEY,
    authDomain: "locationapp-962e8.firebaseapp.com",
    projectId: "locationapp-962e8",
    storageBucket: "locationapp-962e8.appspot.com",
    messagingSenderId: "828032903544",
    appId: "1:828032903544:web:7b9dd99a018840a474c08d",
    measurementId: "G-4Y438XPSP0",
};
// Initialize Firebase
var appFire = (0, app_1.initializeApp)(firebaseConfig);
var db = (0, firestore_2.getFirestore)(appFire);
var http_1 = require("http");
// import http from "http";
var server = http_1.default.createServer(app);
var socket_io_1 = require("socket.io");
var io = new socket_io_1.Server(server, {
    cors: {
        origin: [
            "http://localhost:3000",
            "https://location-app-566a-client.vercel.app",
        ],
    },
    connectionStateRecovery: {
        // the backup duration of the sessions and the packets
        maxDisconnectionDuration: 2 * 60 * 1000,
        // whether to skip middlewares upon successful recovery
        skipMiddlewares: true,
    },
});
var PORT = 5000;
var socketidTOroomId = [];
io.on("connection", function (socket) {
    var socket_id = socket.id;
    // socket.emit('newClient',socketData_array);
    // socketData_array.push();
    socket.emit("init", socket_id);
    socket.on("init_res", function (socketData) {
        if (socketData.roomId !== undefined) {
            console.log("socketData.roomId !== undefined");
            socket.join(socketData.roomId);
            console.log(socket_id + "が" + socketData.roomId + "に入室しました");
            socketidTOroomId.push({
                path: socket_id + socketData.roomId,
                socketId: socket_id,
                roomId: socketData.roomId,
            });
            var getData = getRoomCollection(socketData);
            getData.then(function (getdata) {
                var getArrayData = getdata;
                console.log(Array.isArray(getArrayData), "getArrayData");
                io.to(socketData.roomId).emit("send_AllClientData", getArrayData);
            });
        }
        else {
            console.log("roomIdがundefined");
        }
    });
    socket.on("joinRoom", function (roomId) {
        socket.join(roomId);
    });
    socket.on("request_allClientDatas", function (socketData) {
        var getData = getRoomCollection(socketData);
        getData.then(function (getdata) {
            var getArrayData = getdata;
            console.log(Array.isArray(getArrayData), "getArrayData");
            io.to(socketData.roomId).emit("send_AllClientData", getArrayData);
        });
    });
    socket.on("changeData", function (newData) {
        if (newData.id !== "") {
            setRoomCollection(newData);
            var getData = getRoomCollection(newData);
            getData.then(function (getdata) {
                var getArrayData = getdata;
                io.to(newData.roomId).emit("send_AllClientData", getArrayData);
            });
        }
        else {
            socket.emit("init", socket_id);
            console.log("false");
        }
    });
    socket.on("disconnect", function () {
        console.log(socketidTOroomId);
        socketidTOroomId.forEach(function (data) {
            if (data.socketId === socket.id) {
                var roomId_stg = data.roomId;
                deleteClientData(socket_id, roomId_stg);
                console.log(socket_id + "が" + roomId_stg + "より退出しました");
            }
        });
    });
});
server.listen(PORT, function () {
    console.log("server running on ".concat(PORT));
});
var data1 = {
    name: "noName",
    position: { lat: 0, lng: 0 },
    id: "mongo",
    roomId: "room1",
    selfIntroduce: "よろしくお願いします！",
};
var data2 = {
    name: "noName",
    position: { lat: 0, lng: 0 },
    id: "firebase",
    roomId: "room1",
    selfIntroduce: "よろしくお願いします！",
};
var data3 = {
    name: "noName",
    position: { lat: 0, lng: 0 },
    id: "SQlite",
    roomId: "room1",
    selfIntroduce: "よろしくお願いします！",
};
/*
ClientsRooms
    roomId
        [roomId]
            [socketId]
                [Data]



*/
//クライアントデータを追加する
function setRoomCollection(socketData) {
    return __awaiter(this, void 0, void 0, function () {
        var room, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    room = (0, firestore_1.doc)(db, "ClientsRooms", "roomId", socketData.roomId, socketData.id);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, firestore_1.setDoc)(room, socketData)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    console.error("Error adding document: ", e_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
//roomIdの部屋の全てのデータを取得する
function getRoomCollection(data) {
    return __awaiter(this, void 0, void 0, function () {
        var allClientsData, q, querySnap;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    allClientsData = new Array();
                    console.log("test:" + typeof allClientsData);
                    q = (0, firestore_1.collection)(db, "ClientsRooms", "roomId", data.roomId);
                    return [4 /*yield*/, (0, firestore_1.getDocs)(q)];
                case 1:
                    querySnap = _a.sent();
                    return [4 /*yield*/, querySnap.forEach(function (ele) {
                            var domData = {
                                name: "",
                                position: { lat: 0, lng: 0 },
                                id: "",
                                roomId: "",
                                selfIntroduce: "",
                            };
                            var gotData = ele.data();
                            domData.id = gotData.id;
                            domData.name = gotData.name;
                            domData.position.lat = gotData.position.lat;
                            domData.position.lng = gotData.position.lng;
                            domData.roomId = gotData.roomId;
                            domData.selfIntroduce = gotData.selfIntroduce;
                            allClientsData.push(domData);
                        })];
                case 2:
                    _a.sent();
                    console.log("Is ClientDatas an array? server" + Array.isArray(allClientsData));
                    return [2 /*return*/, allClientsData];
            }
        });
    });
}
//dbから特定のクライアントデータを削除する
function deleteClientData(socket_id, roomId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, firestore_1.deleteDoc)((0, firestore_1.doc)(db, "ClientsRooms", "roomId", roomId, socket_id))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
