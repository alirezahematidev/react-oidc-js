"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStoreUserData = void 0;
const jwt_decode_1 = __importDefault(require("jwt-decode"));
const oidc_client_ts_1 = require("oidc-client-ts");
const react_1 = require("react");
const context_1 = require("../context");
const useStoreUserData = () => {
    const { setUserData, userManager } = (0, react_1.useContext)(context_1.Context);
    return async (userData) => {
        if (!userData.access_token)
            return;
        try {
            const decodedAccessToken = (0, jwt_decode_1.default)(userData.access_token);
        }
        catch (error) {
            console.log("error", error);
        }
        const decodedAccessToken = (0, jwt_decode_1.default)(userData.access_token);
        const profile = {
            ...decodedAccessToken,
        };
        const userConfig = new oidc_client_ts_1.User({
            session_state: "",
            state: null,
            /** @todo Check for scope */
            scope: decodedAccessToken.scope.join(" "),
            id_token: decodedAccessToken.iat.toString(),
            profile,
            ...userData,
        });
        if (!userConfig) {
            return;
        }
        console.log({ userConfig });
        userManager.storeUser(userConfig);
        setUserData(userConfig);
    };
};
exports.useStoreUserData = useStoreUserData;
//# sourceMappingURL=index.js.map