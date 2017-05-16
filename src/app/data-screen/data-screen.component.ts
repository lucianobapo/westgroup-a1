import {Component, OnInit} from '@angular/core';
import {DataService} from "../services/data.service";
import 'rxjs/add/operator/map';
import {BaseComponent} from "../base-component";

@Component({
    selector: 'app-data-screen',
    templateUrl: './data-screen.component.html',
    styleUrls: ['./data-screen.component.css']
})
export class DataScreenComponent extends BaseComponent implements OnInit {

    public tabs = [];
    public modalColumns = [];
    public modalTitle = '';
    public modalTab;
    public data = [];
    public pagination = {};
    public pages = [];

    constructor(protected dataService: DataService) {
        super();
        this.dataService.getDataEvent.subscribe(data => {
            this.data = data.data;
            this.pagination = data.pagination;
            this.processPages(this.pagination);

        });
    }

    ngOnInit() {
        this.dataService.httpGet('config/erpnetSaas')
            .map(response=>{
                return response.json().data;
            })
            .subscribe(response=>{
                Object.keys(response).forEach(item=>{
                    if(response[item].hasOwnProperty('apiUrl')){
                        let tab = response[item];
                        tab.itemModel = '';
                        this.tabs.push(tab);
                    }
                });
            });


    }

    changeTab(tab): void {
        this.data = [];
        let sufix='';
        if (this.pagination.hasOwnProperty('current_page')) sufix='?page='+this.pagination['current_page'];
        this.pagination = {};
        this.dataService.httpGet(tab.apiUrl+sufix)
            .map(response=>{
                return response.json();
            })
            .subscribe(response=>{
                this.dataService.getDataEvent.emit(response);
            });
    }

    changePage(tab, page): void {
        this.data = [];
        this.pagination = {};
        this.dataService.httpGet(tab.apiUrl+'?page='+page)
            .map(response=>{
                return response.json();
            })
            .subscribe(response=>{
                this.dataService.getDataEvent.emit(response);
            });
    }

    nextPage(tab, page): void {
        this.changePage(tab, parseInt(page)+1);
    }

    saveItem(tab){
        let input={};
        let sufix='';
        let method='post';
        Object.keys(this.modalColumns).forEach(key=>{
            if(this.modalColumns[key].name=='id') {
                method='patch';
                sufix='/'+this.modalColumns[key].itemModel;
            }
            input[this.modalColumns[key].name]=(this.modalColumns[key].itemModel);
        });
        input['mandante'] = this.getConfig('defaultMandante');

        this.dataService.httpPost(tab.apiUrl+sufix, input, method)
            .map(response=>{
                return response.json().data;
            })
            .subscribe(response=>{
                this.changeTab(tab);
            });
    }

    removeItem(tab, item){
        let input={};
        let method='delete';

        this.dataService.httpPost(tab.apiUrl+'/'+item.id, input, method)
            .map(response=>{
                return response.json().data;
            })
            .subscribe(response=>{
                this.changeTab(tab);
            });
    }

    openCreateModal(tab){
        this.modalTab = tab;
        this.modalTitle = this.t('Create New Data');
        this.modalColumns = [];
        Object.keys(tab.columns).forEach(key=>{
            if (tab.columns[key].name!='id'){
                this.modalColumns.push(tab.columns[key]);
            }
        });
        Object.keys(this.modalColumns).forEach(key=>{
            this.modalColumns[key].itemModel = '';
        });
    }

    openEditModal(tab, item){
        this.modalTab = tab;
        this.modalTitle = this.t('Edit Data');
        this.modalColumns = tab.columns;
        Object.keys(this.modalColumns).forEach(key=>{
            this.modalColumns[key].itemModel = item[this.modalColumns[key].name];
        });
    }

    private processPages(pagination: any) {
        this.pages = [];
        let offset = 3;
        for (let page = parseInt(pagination.current_page)-offset;
             page <= parseInt(pagination.current_page)+offset; page++) {
            if (page>0 && page<=pagination.last_page) this.pages.push(page);
        }
    }
}
