import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { EventMessage } from "../interfaces/eventMessage";
import { ServerData } from "../interfaces/serverData";


@Injectable({
    providedIn: 'root'
})
export class WebsocketService {

  private BASE_URL = "ws://localhost:3003";

  private socket$!: WebSocketSubject<EventMessage | ServerData>;

  public dataUpdates$(): Observable<EventMessage | ServerData> {
    return this.connect().asObservable();
  }

  public disconnect(): void {
    this.connect().complete();
  }

  public subscribe(event: EventMessage): void {
    this.socket$.next(event);
  }

  public unsubscribe(event: EventMessage): void {
    this.socket$.next(event);
  }

  private connect(): WebSocketSubject<EventMessage | ServerData> {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket(this.BASE_URL);
    }
    return this.socket$;
  }
}