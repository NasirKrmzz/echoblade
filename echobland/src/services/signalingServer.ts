import { io, Socket } from 'socket.io-client';

class SignalingServer {
  private socket: Socket | null = null;
  private roomId: string | null = null;
  private onRoomCreatedCallback: ((roomId: string) => void) | null = null;
  private onRoomJoinedCallback: (() => void) | null = null;
  private onRoomErrorCallback: ((error: string) => void) | null = null;

  constructor() {
    this.socket = io('http://localhost:3001');
    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to signaling server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from signaling server');
    });

    this.socket.on('roomError', (error: string) => {
      if (this.onRoomErrorCallback) {
        this.onRoomErrorCallback(error);
      }
    });
  }

  public createRoom(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject('Socket not initialized');
        return;
      }
      
      this.socket.emit('createRoom');
      
      // Tek seferlik dinleyici
      this.socket.once('roomCreated', (roomId: string) => {
        this.roomId = roomId;
        resolve(roomId);
      });
      
      // Hata durumu
      this.onRoomErrorCallback = (error) => {
        reject(error);
      };
    });
  }

  public joinRoom(roomId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject('Socket not initialized');
        return;
      }
      
      this.socket.emit('joinRoom', roomId);
      
      // Tek seferlik dinleyici
      this.socket.once('roomJoined', () => {
        this.roomId = roomId;
        resolve();
      });
      
      // Hata durumu
      this.onRoomErrorCallback = (error) => {
        reject(error);
      };
    });
  }

  public sendOffer(offer: RTCSessionDescriptionInit) {
    if (!this.socket || !this.roomId) return;
    this.socket.emit('offer', { roomId: this.roomId, offer });
  }

  public sendAnswer(answer: RTCSessionDescriptionInit) {
    if (!this.socket || !this.roomId) return;
    this.socket.emit('answer', { roomId: this.roomId, answer });
  }

  public sendIceCandidate(candidate: RTCIceCandidate) {
    if (!this.socket || !this.roomId) return;
    this.socket.emit('iceCandidate', { roomId: this.roomId, candidate });
  }

  public onOffer(callback: (offer: RTCSessionDescriptionInit) => void) {
    if (!this.socket) return;
    this.socket.on('offer', callback);
  }

  public onAnswer(callback: (answer: RTCSessionDescriptionInit) => void) {
    if (!this.socket) return;
    this.socket.on('answer', callback);
  }

  public onIceCandidate(callback: (candidate: RTCIceCandidate) => void) {
    if (!this.socket) return;
    this.socket.on('iceCandidate', callback);
  }

  public onNewPeer(callback: (peerId: string) => void) {
    if (!this.socket) return;
    this.socket.on('newPeer', callback);
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const signalingServer = new SignalingServer(); 