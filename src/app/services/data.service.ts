import {Injectable, EventEmitter} from '@angular/core';
import {Http, RequestOptions, Headers} from "@angular/http";
import {ConfigService} from "./config.service";
import {BehaviorSubject} from "rxjs";

@Injectable()
export class DataService {
    getDataEvent: EventEmitter<any> = new EventEmitter();

    constructor(protected http: Http,
                protected configService: ConfigService) {
    }

    httpGet(resource){
        let headers = new Headers();
        headers.append('Accept', 'application/x.erpnet.v1+json');
        let options = new RequestOptions({headers : headers});
        // this.showLoading();
        // this.connectivityMonitorService.setOnline();
        return this.http.get(this.configService.resourceUrl+'/erpnet-api/'+resource, options);
    }

    httpPost(resource, body, method='post'){
        let headers = new Headers();
        headers.append('Accept', 'application/x.erpnet.v1+json');
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({headers : headers});
        // this.showLoading();
        // this.connectivityMonitorService.setOnline();
        return this.http[method](this.configService.resourceUrl+'/erpnet-api/'+resource, body, options);
    }
}
