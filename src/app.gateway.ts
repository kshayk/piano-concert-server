import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

interface NoteOnGateway {
  note: number;
  velocity: number;
}

@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('AppGateway');

  handleConnection(client: Socket, ...args: any[]) {
    // probably send listener count to client
    this.logger.log('Client connected to websocket');
  }

  handleDisconnect(client: Socket): any {
    // probably send listener count to client
    this.logger.log('Client disconnected from websocket');
  }

  afterInit(server: Server): any {
    this.logger.log('Gateway initialized');
  }

  @SubscribeMessage('noteOn')
  onNoteOn(client: Socket, payload: any): WsResponse<NoteOnGateway> {
    this.logger.log('Received noteOn message', payload);
    return {
      event: 'noteOn',
      data: { note: payload.note, velocity: payload.velocity },
    };
  }

  @SubscribeMessage('noteOff')
  onNoteOff(client: Socket, payload: NoteOnGateway): WsResponse<number> {
    // by returning it like this, it will only send the message to everyone that is not the sender
    return {
      event: 'noteOn',
      data: payload.note,
    };
  }
}
