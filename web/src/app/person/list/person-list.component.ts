import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TitleService } from '../../common/title.service';
import { PersonService } from '../person.service';

import { Store } from '@ngrx/store';
import * as app from '../../app.store';
import * as people from 'mh-core';

import { Person } from 'mh-core';

@Component({
    moduleId: 'mh-person',
    selector: 'mh-person-list',
    templateUrl: './person-list.component.html',
    styleUrls: ['./person-list.component.scss']
})

export class PersonListComponent implements OnInit {
    people: Array<Person>;
    people$: Observable<Person[]>;

    constructor(private personService: PersonService,
                private store: Store<app.AppState>,
                titleService: TitleService) {
        titleService.setTitle('Person List');
        this.people$ = this.store.select(app.getPeople);
    }

    ngOnInit(): void {
        /*this.personService.getPersons()
            .subscribe((people: Array<Person>) => this.people = people);*/
    }
}
