var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { WebPlugin } from '@capacitor/core';
// @ts-ignore
import config from '../../../../../capacitor.config.json';
export class GoogleAuthWeb extends WebPlugin {
    constructor() {
        super({
            name: 'GoogleAuth',
            platforms: ['web']
        });
        this.initialize();
    }
    initialize() {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.defer = true;
        script.async = true;
        script.onload = this.platformJsLoaded;
        script.src = 'https://apis.google.com/js/platform.js';
        head.appendChild(script);
    }
    platformJsLoaded() {
        gapi.load('auth2', () => __awaiter(this, void 0, void 0, function* () {
            const clientConfig = {
                client_id: document.getElementsByName('google-signin-client_id')[0].content
            };
            if (config.plugins.GoogleAuth != null && config.plugins.GoogleAuth.scopes != null) {
                clientConfig.scope = config.plugins.GoogleAuth.scopes.join(' ');
            }
            gapi.auth2.init(clientConfig);
        }));
    }
    signIn() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const user = {};
                    var needsOfflineAccess = false;
                    try {
                        needsOfflineAccess = config.plugins.GoogleAuth.serverClientId != null;
                    }
                    catch (_a) {
                    }
                    if (needsOfflineAccess) {
                        const offlineAccessResponse = yield gapi.auth2.getAuthInstance().grantOfflineAccess();
                        user.serverAuthCode = offlineAccessResponse.code;
                    }
                    else {
                        yield gapi.auth2.getAuthInstance().signIn();
                    }
                    const googleUser = gapi.auth2.getAuthInstance().currentUser.get();
                    if (needsOfflineAccess) {
                        // HACK: AuthResponse is null if we don't do this when using grantOfflineAccess
                        yield googleUser.reloadAuthResponse();
                    }
                    const authResponse = googleUser.getAuthResponse(true);
                    const profile = googleUser.getBasicProfile();
                    user.email = profile.getEmail();
                    user.familyName = profile.getFamilyName();
                    user.givenName = profile.getGivenName();
                    user.id = profile.getId();
                    user.imageUrl = profile.getImageUrl();
                    user.name = profile.getName();
                    user.authentication = {
                        accessToken: authResponse.access_token,
                        idToken: authResponse.id_token
                    };
                    resolve(user);
                }
                catch (error) {
                    reject(error);
                }
            }));
        });
    }
    signOut() {
        return __awaiter(this, void 0, void 0, function* () {
            return gapi.auth2.getAuthInstance().signOut();
        });
    }
}
const GoogleAuth = new GoogleAuthWeb();
export { GoogleAuth };
import { registerWebPlugin } from '@capacitor/core';
registerWebPlugin(GoogleAuth);
//# sourceMappingURL=web.js.map