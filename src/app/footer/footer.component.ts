import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "../base-component";

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})
export class FooterComponent extends BaseComponent implements OnInit {

    constructor() {
        super();
    }

    ngOnInit() {
    }
}
