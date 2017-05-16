import {Injectable} from '@angular/core';

@Injectable()
export class TranslateService {
    private static _translate = {};

    constructor() {
    }

    static set(str){
        this._translate = str;
    }

    static get(str){
        if (this._translate.hasOwnProperty(str)) return this._translate[str];
        return str;
    }
}
