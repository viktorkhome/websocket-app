import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebsocketService } from 'src/app/services/websocket.service';

import { map, pipe, tap, Subscription, filter } from 'rxjs';
import { ServerData } from 'src/app/interfaces/serverData';
import { TableDataItem } from 'src/app/interfaces/tableData';
import { EventMessage } from 'src/app/interfaces/eventMessage';

@Component({
  selector: 'app-client-table',
  templateUrl: './client-table.component.html',
  styleUrls: ['./client-table.component.css']
})
export class ClientTableComponent implements OnInit, OnDestroy {
  tableData: TableDataItem[] = [];  
  subscription!: Subscription;
  subscribeEventSent: boolean = false;
  constructor(private websocketService: WebsocketService) {}

  ngOnInit() {
    this.initSubscription();
  }

  public clearTable(): void {
    this.tableData = [];
  }

  public sendSubscribeEvent(): void {
    this.subscribeEventSent = true;
    this.websocketService.subscribe({"e": 'SUBSCRIBE'});
  }

  public sendUnsubscribeEvent(): void {
    this.subscription.unsubscribe();
    this.websocketService.unsubscribe({"e": 'UNSUBSCRIBE'});
    this.initSubscription();
  }

  private initSubscription(): void {
    this.subscribeEventSent = false;
    this.subscription = this.websocketService.dataUpdates$()
    .pipe(
      filter((data: EventMessage | ServerData): data is ServerData => 'p' in data),
      map((serverData: (ServerData)) => { return { price: serverData.p.value } } ),
      tap({ error: err => console.log(err),
      complete: () => console.log('Connection Closed') }) 
    )
    .subscribe((tableData: TableDataItem) => this.loadServerData(tableData));
  }

  private loadServerData(tableDataItem: TableDataItem): void {
    this.tableData.unshift(tableDataItem);
    if(this.tableData.length === 31) {
      this.tableData.pop();
    };
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.websocketService.disconnect();
  }
}
