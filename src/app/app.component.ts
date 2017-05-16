import {Component} from '@angular/core';
import {DataService} from "./services/data.service";
import {BaseComponent} from "./base-component";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent extends BaseComponent {
    constructor(protected dataService: DataService) {
        super();
        this.dataService.httpGet('config/erpnetSaas')
            .map(response=>{
                return response.json().data;
            })
            .subscribe(response=>{
                this.setConfig(response);
            });

        this.dataService.httpGet('lang/pt_BR/erpnetSaas')
            .map(response=>{
                return response.json().data;
            })
            .subscribe(response=>{
                this.setTranslate(response);
            });
    }
}
