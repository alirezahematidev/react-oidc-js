/// <reference types="react" />
import { User, UserManager } from "oidc-client-ts";
export declare const Context: import("react").Context<{
    userManager: UserManager;
    userData: User | null;
    setUserData: React.Dispatch<React.SetStateAction<User | null>>;
    removeUser: () => Promise<void>;
}>;
//# sourceMappingURL=context.d.ts.map