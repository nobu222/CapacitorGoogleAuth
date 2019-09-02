import { WebPlugin } from '@capacitor/core';
import { GoogleAuthPlugin } from './definitions';
export declare class GoogleAuthWeb extends WebPlugin implements GoogleAuthPlugin {
    constructor();
    initialize(): void;
    platformJsLoaded(): void;
    signIn(): Promise<any>;
    signOut(): Promise<any>;
}
declare const GoogleAuth: GoogleAuthWeb;
export { GoogleAuth };
