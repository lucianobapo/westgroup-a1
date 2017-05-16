import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "../base-component";

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent extends BaseComponent implements OnInit {

    constructor() {
        super();
    }

    ngOnInit() {
    }
}
