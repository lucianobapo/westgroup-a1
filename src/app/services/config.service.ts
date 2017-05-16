import {Injectable} from '@angular/core';

@Injectable()
export class ConfigService {

    private _resourceUrl;
    private static _config = {};

    constructor() {
    }

    get resourceUrl(): string {
        this._resourceUrl = 'https://westgroup.ilhanet.com';
        // this._resourceUrl = 'https://westgroup.localhost.com';
        return this._resourceUrl;
    }

    static get(key: any) {
        if (this._config.hasOwnProperty(key)) return this._config[key];
        return key;
    }

    static set(key: any) {
        this._config = key;
    }
}
