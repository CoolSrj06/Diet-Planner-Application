import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private pendingCountSubject =
    new BehaviorSubject<number>(0);

  pendingCount$ =
    this.pendingCountSubject.asObservable();

  constructor() { }

  updatePendingCount(
    count: number
  ): void {

    this.pendingCountSubject.next(count);

  }

}
