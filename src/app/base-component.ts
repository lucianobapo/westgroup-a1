import {TranslateService} from "./services/translate.service";
import {ConfigService} from "./services/config.service";
export class BaseComponent {

    constructor() {
    }

    public setTranslate(trans){
        TranslateService.set(trans);
    }

    public t(str){
        return TranslateService.get(str);
    }
    public getConfig(key): void {
        return ConfigService.get(key);
    }

    public setConfig(key){
        ConfigService.set(key);
    }
}
