"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuth = exports.createUserManagerContext = void 0;
const oidc_client_ts_1 = require("oidc-client-ts");
const react_1 = __importStar(require("react"));
const context_1 = require("./context");
const helpers_1 = require("./helpers");
const createUserManagerContext = (userManagerSettings) => {
    let refreshing = null;
    const userManager = new oidc_client_ts_1.UserManager(userManagerSettings);
    let _handleAccessTokenExpired;
    const handleAccessTokenExpired = () => _handleAccessTokenExpired();
    const Provider = ({ children }) => {
        const [userData, setUserData] = (0, react_1.useState)(null);
        const removeUser = (0, react_1.useCallback)(async () => {
            await userManager.removeUser();
            setUserData(null);
        }, []);
        const storeUserDatas = (0, helpers_1.useStoreUserData)();
        _handleAccessTokenExpired = async () => {
            if (refreshing || !userManagerSettings.onRefresh) {
                return Promise.resolve(refreshing);
            }
            refreshing = new Promise(async (resolve, reject) => {
                try {
                    const user = await userManager.getUser();
                    if (!user?.refresh_token) {
                        await removeUser();
                        throw new Error("");
                    }
                    const res = await userManagerSettings.onRefresh(user);
                    await storeUserDatas(res);
                    refreshing = null;
                    resolve(res);
                }
                catch (err) {
                    console.error("handleAccessTokenExpired", err);
                    removeUser();
                    refreshing = null;
                    reject(err);
                }
            });
            return refreshing;
        };
        (0, react_1.useEffect)(() => {
            userManager.getUser().then((user) => {
                setUserData(user);
            });
        }, [userManager]);
        (0, react_1.useEffect)(() => {
            userManager.events.addAccessTokenExpired(handleAccessTokenExpired);
            return () => {
                userManager.events.removeAccessTokenExpired(handleAccessTokenExpired);
            };
        }, []);
        const value = (0, react_1.useMemo)(() => ({
            userManager,
            userData,
            setUserData,
            removeUser,
        }), [userManager, userData, setUserData, removeUser]);
        return react_1.default.createElement(context_1.Context.Provider, { value: value }, children);
    };
    return {
        Provider,
        userManager,
        handleAccessTokenExpired,
    };
};
exports.createUserManagerContext = createUserManagerContext;
const useAuth = () => {
    const { userManager, userData, removeUser } = (0, react_1.useContext)(context_1.Context);
    const setUser = (0, helpers_1.useStoreUserData)();
    return {
        userManager,
        userData,
        removeUser,
        setUser,
    };
};
exports.useAuth = useAuth;
//# sourceMappingURL=index.js.map