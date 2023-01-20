import express, { Request, Response, application } from "express"
import Sender, { Button } from "./sender"
import { Message } from "venom-bot"
import axios from "axios";
import endpoint from './endpoints.config';
import { send } from "process";

const senders = new Map<string, Sender>()

process.on('SIGINT', () => {
    senders.forEach((sender:Sender) => {
        sender.close()
    });
});

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.get("/:session/stat", (req: Request, res: Response) => {
    const session = req.params.session
    if(senders.get(session)===undefined){
        senders.set(
            session,
            new Sender(
                session, 
                async (message: Message) => {
                    
                    //console.log(message)
                    
                    if (message.type !== "chat" && message.type !== "buttons_response") return;
                    if (!message.to.match(/^[0-9]{12,13}@c\.us$/)) return;
                    if (message.chatId !== message.from) return;
    
                    try{
                    axios.post(
                        `${endpoint.ApiBaseUrl}Message/?sender=${session}`,
                        message,
                        {
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                        },
                        },
                    ).catch(err => console.error(err));
                    } catch(err){
                        console.error(err);
                    }
                }
            )
        );
        senders.get(session)?.open()
    }
    
    const sender = senders.get(session) as Sender
    return res.send({
        connected: sender.isConnected,
        qr: sender.qrCode
    })
})


app.post("/:session/startTyping", async (req: Request, res: Response) =>{    
    const { number } = req.body
    const session = req.params.session
    const sender = senders.get(session) as Sender
    try{
        await sender.startTyping(number)
        .then(()=>{
            return res.status(200).json()
        })
        .catch((err) => {
            console.log("error", err)
            res.status(500).json({status: "error", message: err})
        })
    } catch(err){
        sender.close()
        sender.open()
    }
})


app.post("/:session/stopTyping", async (req: Request, res: Response) =>{
    const { number } = req.body
    const session = req.params.session
    const sender = senders.get(session) as Sender
    try{
        await sender.stopTyping(number)
        .then(()=>{
            return res.status(200).json()
        })
        .catch((err) => {
            console.log("error", err)
            res.status(500).json({status: "error", message: err})
        })
    } catch(err){
        sender.close()
        sender.open()
    }
})


app.post("/:session/sendSeen", async (req: Request, res: Response) =>{
    const { number } = req.body
    const session = req.params.session
    const sender = senders.get(session) as Sender
    try{
        await sender.sendSeen(number)
        .then(()=>{
            return res.status(200).json()
        })
        .catch((err) => {
            console.log("error", err)
            res.status(500).json({status: "error", message: err})
        })
    } catch(err){
        sender.close()
        sender.open()
    }
})

app.post("/:session/sendText", async (req: Request, res: Response) =>{
    const { number, message } = req.body
    const session = req.params.session
    const sender = senders.get(session) as Sender
    try{
        await sender.sendText(number, message)
        .then((data: Object)=>{
            return res.status(200).json(data)
        })
        .catch((err) => {
            console.log("error", err)
            res.status(500).json({status: "error", message: err})
        })
    } catch(err){
        sender.close()
        sender.open()
    }
})

app.post("/:session/sendButtons", async (req: Request, res: Response) =>{
    const { number, title, buttons, subtitle } = req.body
    const session = req.params.session
    const sender = senders.get(session) as Sender
    try{
        await sender.sendButtons(number, title, buttons, subtitle)
        .then((data: Object)=>{
            return res.status(200).json(data)
        })
        .catch((err) => {
            console.log("error", err)
            res.status(500).json({status: "error", message: err})
        })
    } catch(err){
        sender.close()
        sender.open()
    }
})

app.post("/:session/sendLocation", async (req: Request, res: Response) =>{
    const { number, latitude, longitude, title } = req.body
    const session = req.params.session
    const sender = senders.get(session) as Sender
    try{
        await sender.sendLocation(number, latitude, longitude, title)
        .then(()=>{
            return res.status(200).json()
        })
        .catch((err) => {
            console.log("error", err)
            res.status(500).json({status: "error", message: err})
        })
    } catch(err){
        sender.close()
        sender.open()
    }
})

app.listen(5000, () => {
    console.log("Server started")
})