import { Component } from '@angular/core';

@Component({
    selector: 'app-charity-selection',
    templateUrl: './charity-selection.component.html',
    styleUrls: ['./charity-selection.component.css']
})

export class CharitySelectionComponent {

    private charities = new Array<string>();

    constructor() {
    }
}
