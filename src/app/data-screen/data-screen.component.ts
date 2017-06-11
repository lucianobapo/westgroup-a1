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
        this.dataService.httpGet('config/erpnetMigrates')
            .map(response=>{
                return response.json().data;
            })
            .subscribe(response=>{
                if(response.hasOwnProperty('tables')){
                    Object.keys(response.tables).forEach(item=>{
                        let tab = response.tables[item];
                        if(!tab.hasOwnProperty('key')) tab.key = item;
                        if(!tab.hasOwnProperty('icon')) tab.icon = 'fa fa-fw fa-file';
                        if(!tab.hasOwnProperty('routeLinkName')) tab.routeLinkName = item.charAt(0).toUpperCase()+item.substr(1);
                        if(!tab.hasOwnProperty('routePrefix')) tab.routePrefix = item;
                        tab.itemModel = '';
                        // this.tabs[item] = tab;
                        if(!tab.hasOwnProperty('tabDisplay')) this.tabs.push(tab);
                        if(tab.hasOwnProperty('tabDisplay') && tab.tabDisplay) this.tabs.push(tab);
                        // if(response[item].hasOwnProperty('apiUrl')){
                        //
                        // }
                    });
                }
                // console.log(this.tabs);

            });


    }

    changeTab(tab, resetPage=false): void {
        this.data = [];
        let sufix='';
        if (!resetPage && this.pagination.hasOwnProperty('current_page')) sufix='?page='+this.pagination['current_page'];
        this.pagination = {};
        this.dataService.httpGet(tab.routePrefix+sufix)
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
        this.dataService.httpGet(tab.routePrefix+'?page='+page)
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

        this.dataService.httpPost(tab.routePrefix+sufix, input, method)
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

        this.dataService.httpPost(tab.routePrefix+'/'+item.id, input, method)
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
        let columns = this.getTabFields(tab);
        columns.forEach(column=>{
            if(!(column.hasOwnProperty('key') && column.key=='id') && column!='id')
                this.populateModalColumns(column);
        });
    }

    openEditModal(tab, item){
        this.modalTab = tab;
        this.modalTitle = this.t('Edit Data');
        this.modalColumns = [];

        let columns = this.getTabFields(tab);
        columns.forEach(column=>{
            this.populateModalColumns(column, item);
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

    hasColumn(column, item){
        let aux = this.columnData(column, item);
        // console.log((aux.constructor == String));
        return aux && (aux.constructor == String) && aux.length>0;
    }

    columnData(column, item):string{
        // console.log(column.constructor);
        if(column.constructor == Object){
            if(column.hasOwnProperty('key')) return item[column.key];
        }

        if(column.constructor == String) return item[column];
        return 'err';
    }

    columnDisplayName(column):string{
        // console.log(column.constructor);
        if(column.constructor == Object){
            // console.log(column);
            if(column.hasOwnProperty('displayName')) return this.t(column.displayName);
            if(column.hasOwnProperty('key')) return this.t(column.key.charAt(0).toUpperCase()+column.key.substr(1));
        }

        if(column.constructor == String) return this.t(column.charAt(0).toUpperCase()+column.substr(1));
        return 'err';
    }

    hasData(){
        return this.data.length>0;
    }

    getItemsData(){
        if(!this.hasData()) return [];
        if(this.data.constructor == Array) return this.data;
        // console.log(this.data.constructor);
        // return this.data;
        return [];
    }

    getTabFields(tab):any[]{
        if(tab.hasOwnProperty('fields') && tab.fields.constructor == Array) {
            // console.log(tab.fields);
            return tab.fields;
        }
        if(tab.hasOwnProperty('fields') && tab.fields.constructor == Object) {
            // console.log(tab.fields);
            let fields = [];
            Object.keys(tab.fields).forEach(item=>{
                if (tab.fields[item].constructor == String) {
                    let obj = {key: tab.fields[item]};
                    fields.push(obj);
                }
                if (tab.fields[item].constructor == Object) {
                    let obj = tab.fields[item];
                    obj.key=item;
                    fields.push(obj);
                }
                // console.log(tab.fields[item].constructor);
                // fields.push(tab.fields[item]);
            });
            // console.log(fields);
            return fields;
        }
        // console.log(tab.fields);
        // console.log(this.data.constructor);
        // return this.data;
        return [];
    }

    private populateModalColumns(column: any, item=null) {
        let obj;

        if(column.constructor == String) {
            obj = {
                name: column,
                displayName: column.charAt(0).toUpperCase() + column.substr(1),
                itemModel: '',
                formInputType: 'text',
            };
            if (item) obj.itemModel = item[column];
        }

        if(column.constructor == Object){
            obj = column;

            if(!obj.hasOwnProperty('name')) obj.name = column.key;

            if(!obj.hasOwnProperty('displayName'))
                obj.displayName = column.key.charAt(0).toUpperCase()+column.key.substr(1);

            if(!obj.hasOwnProperty('formInputType'))
                obj.formInputType = 'text';

            obj.itemModel = '';
            if (item) obj.itemModel = item[column.key];
        }

        this.modalColumns.push(obj);
    }
}

