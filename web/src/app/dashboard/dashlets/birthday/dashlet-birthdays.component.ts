import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';

import { Person } from '../../../person/person';
import { DashletEditDialogComponent } from './dashlet-birthdays-edit.dialog';

import { NoteCreateDialogComponent } from '../../../note/dialogs/note-create.dialog';

@Component({
    selector: 'mh-dashlet-birthdays',
    templateUrl: './dashlet-birthdays.component.html',
    styleUrls: ['./dashlet-birthdays.component.scss']
})
export class DashletBirthdaysComponent implements OnChanges {

    private now: Date = new Date();
    private rangeDate: Date;

    @Input() people: Array<Person>;
    peopleBdRange: Array<Person>;
    peopleBdToday: Array<Person>;

    range: number = 7;
    dialogRef: MdDialogRef<any>;

    constructor(private _dialog: MdDialog) {
        this.rangeDate = new Date(this.now);
        this.rangeDate.setDate(this.rangeDate.getDate() + this.range);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['people']) {
            this.filter();
        }
    }

    filter(): void {
        if (this.people) {
            this.rangeDate.setDate(new Date(this.now).getDate() + this.range);
            this.peopleBdRange = this.people.filter((p: Person) => {
                let bday: Date = p.birthday;
                if (!p.birthday) {
                    return false;
                }
                bday.setFullYear(this.now.getFullYear());
                return bday > this.now && bday < this.rangeDate;
            });
            this.peopleBdRange.sort((p1: Person, p2: Person) => {
                let left: number = Number(p1.birthday);
                let right: number = Number(p2.birthday);
                return left - right;
            });
            // Filter for today's birthdays
            this.peopleBdToday = this.people.filter((p: Person) => {
                let bday: Date = p.birthday;
                if (!p.birthday) {
                    return false;
                }
                bday.setFullYear(this.now.getFullYear());
                return bday.toLocaleDateString() === this.now.toLocaleDateString();
            });
            // Sort it, closest date on top
            this.peopleBdToday.sort((p1: Person, p2: Person) => {
                let left: number = Number(p1.birthday);
                let right: number = Number(p2.birthday);
                return left - right;
            });
        }
    }

    settingsDlg(): void {
        let config: MdDialogConfig = new MdDialogConfig();
        config.data = {
            range: this.range
        };
        this.dialogRef = this._dialog.open(DashletEditDialogComponent, config);
        this.dialogRef.afterClosed().subscribe((result: string) => {
            let range: number = +result;
            if (range && range !== this.range) {
                this.range = range;
                this.filter();
            }
            this.dialogRef = undefined;
        });
    }

    interactionsDlg(person: Person): void {
        let config: MdDialogConfig = new MdDialogConfig();
        config.data = {
            person: person
        };

        this.dialogRef = this._dialog.open(NoteCreateDialogComponent, config);
        this.dialogRef.afterClosed().subscribe((result: any) => {
            if (result instanceof Person) {
                // do something
            }
            this.dialogRef = undefined;
        });
    }

    // could become a pipe, in case momentjs does not work with AOT
    birthdayIn(birthday: string): number  {
        let bDay: Date = new Date(birthday);
        bDay.setFullYear(this.now.getFullYear());
        let interval: number = Math.floor(bDay.getTime() - this.now.getTime()) / 1000;
        let days: number = Math.ceil(interval / 86400);
        return days;
    }
}
