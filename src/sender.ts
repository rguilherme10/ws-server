import parsePhoneNumber, { isValidPhoneNumber, PhoneNumber } from "libphonenumber-js"
import { create, Whatsapp, Message, SocketState, StatusFind, CreateOptions } from "venom-bot"

export class Button { buttonText: { displayText: string } }

class Sender {
  private client: Whatsapp
  private connected: boolean
  private qr: string
  private session: string
  private onMessage: (message: Message) => Promise<void>

  get isConnected(): boolean{
    return this.connected
  }

  get qrCode(): string{
    return this.qr
  }

  constructor(session: string, OnMessage: (message: Message) => Promise<void>) {
    this.session = session
    this.onMessage = OnMessage
  }

  public open()
  {
    this.initialize()
  }

  public close() {
      this.client.close();
  }

  private checkAndFormatPhone(to: string){
    
    /// 556792784000@c.us

    let phoneNumber = parsePhoneNumber(to, "BR")
      ?.format("E.164")
      ?.replace("+", "") as string

    phoneNumber = phoneNumber.replace(/^(55[0-9]{2})([^2-4]{1}[0-9]{7})$/,"$19$2")

    phoneNumber = phoneNumber.includes("@c.us")
      ? phoneNumber
      : `${phoneNumber}@c.us`

    if (!isValidPhoneNumber(phoneNumber.replace("@c.us",""), "BR")) {
      throw new Error(`Número de telefone não válido para no Brasil ${phoneNumber}`)
    }

    return phoneNumber
  }

  private async initialize() {
    const qr = (base64Qrimg: string, asciiQR: string, attempt: number, urlCode?: string) => {
      console.log(asciiQR); // Optional to log the QR in the terminal
      var matches = base64Qrimg.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)

      if (matches?.length !== 3) {
        return new Error('Invalid input string');
      }

      this.qr = base64Qrimg;

      var imageBuffer = {

        type: matches[1],
        data: Buffer.from(matches[2], 'base64')
      };
      require('fs').writeFile(
        'out.png',
        imageBuffer['data'],
        'binary',
        function (err: Error) {
          if (err != null) {
            console.log(err);
          }
        }
      );
    }

    const status = (statusGet: string, session: string) => {
      //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken
      this.connected = ["isLogged", "qrReadSuccess", "chatsAvailable"].includes(statusGet)
    }

    const start = async(OnMessage: (message: Message) => Promise<void> ) => {

      console.log('client start');
      // DISCONNECTED
      // SYNCING
      // RESUMING
      // CONNECTED
      await this.client.onStreamChange((state) => {
        console.log('State Connection Stream: ' + state);
        if (state === 'CONNECTED'){
          this.connected = true;
        }
      });
      
      console.log('inject client onAnyMessage');
      await this.client.onAnyMessage(async(message) => this.connected = true)

      console.log('inject client onMessage');
      await this.client.onMessage(async(message) => await OnMessage(message))

      console.log('send test msg');
      await this.sendText("5567992784000@c.us", "WS ok!")
    }
    
    this.client = await create({
      session: this.session, 
      catchQR: qr, 
      statusFind: undefined, 
      debug: true, 
      disableSpins:true, 
      disableWelcome:true,
      autoClose:120000,
      logQR: false,
    })

    await start(this.onMessage)
  }

  public async startTyping(to : string){
    let phoneNumber = this.checkAndFormatPhone(to)
    await this.client.startTyping(phoneNumber);
  }
  
  public async stopTyping(to : string){
    let phoneNumber = this.checkAndFormatPhone(to)
    await this.client.stopTyping(phoneNumber);
  }
  
  public async sendSeen(to : string){
    let phoneNumber = this.checkAndFormatPhone(to)
    await this.client.sendSeen(phoneNumber);
  }

  public async sendText(to: string, body: string): Promise<Object> {
    let phoneNumber = this.checkAndFormatPhone(to)

    return await this.client.sendText(phoneNumber, body);
  }

  public async sendLocation(to: string, latitude: string, longitude: string, title: string): Promise<void> {
    let phoneNumber = this.checkAndFormatPhone(to)

    await this.client.sendLocation(phoneNumber, latitude, longitude, title);
  }

  public async sendButtons(to: string, title: string, buttons: Button[], subtitle: string): Promise<Object> {
    let phoneNumber = this.checkAndFormatPhone(to)

    return await this.client.sendButtons(phoneNumber, title, buttons, subtitle);
  }
}

export default Sender