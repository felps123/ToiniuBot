// load packages & other dependencies

/* ~ Bigby Wolf WhatsApp bot
 * Developed by LuanRT and Maicon ©TheAndroidWorldYT.
 * Contact: bigbywolf@blogdosmanos.dnsabr.com
 * Warning: This is a closed-source project, do not distribute!
 * Atenção: Projeto de código fechado, não distribua sem autorização!
 * This project is intended to be used by English speakers, so if you're looking for a translation please do it yourself.
 * Este projeto é destinado ao público estrangeiro, então várias coisas estão em inglês.
 * Não terá tradução para português/espanhol, então caso você não fale inglês favor traduzir os strings.
 */
const qrcode = require("qrcode-terminal");
const axios = require("axios");
const process = require('process');
const download = require('download');
const dl = require("./lib/downloadImage.js");
const moment = require("moment");
const cheerio = require("cheerio");
const cryptoRandomString = require('crypto-random-string');
const imageToBase64 = require('image-to-base64');
const menu = require("./menu.js");
const wiki = require('wikipedia');
const ytdl = require('ytdl-core');
const youtube = require('scrape-youtube').default;
const fs = require("fs");
const ffmpeg = require('ffmpeg');
const fffmpeg = require('fluent-ffmpeg');
const sf = require('seconds-formater');
const stht = require("seconds-to-human-time");
const speed = require('performance-now');
const tts = require('./lib/gtts.js')('en');
const TinyURL = require("tinyurl");
const JishoApi = require('unofficial-jisho-api');
const translate = require("@khalyomede/translate");
const musicInfo = require("music-info");
const lyricsParse = require('lyrics-parse');
const prettyMilliseconds = require('pretty-ms');
const gis = require("g-i-s");
const googleIt = require('./utils/google.js');
const getServerResponseTime = require('get-server-response-time');
const GrandArray = require("grand-array");
const htmlToText = require('html-to-text');
const imdb = require('imdb');
const nameToImdb = require("name-to-imdb");
const numFormat = require('@dwdarm/num-format');
const redditimage = require("reddit-image-fetcher");
const smartestchatbot = require('smartestchatbot');
const bigbyApi = 'https://cuboid-spark-fiction.glitch.me';
const aiConversationUsers = [];
const showdp = [];

var sendByeMsg = true;
var bannedUsers = null;
var batterylevel = null;
var isBigbyOnline = null;
var continueOnline = null;
var pauseLinkDetection = false;

const {
    exec
} = require('child_process');
const {
    getGroupAdmins,
} = require('./lib/functions');
const {
    fetchJson,
    fetchText
} = require('./lib/fetcher');
const {
    ris, 
    uploadToimgbb, 
    makeMeme
} = require('./utils/imgutils.js');

const {
    ToadScheduler,
    SimpleIntervalJob,
    AsyncTask
} = require('toad-scheduler');

const {
    WAConnection,
    MessageType,
    Presence,
    MessageOptions,
    Mimetype,
    WALocationMessage,
    WA_MESSAGE_STUB_TYPES,
    GroupSettingChange,
    ReconnectMode,
    ProxyAgent,
    waChatKey,
} = require("@adiwajshing/baileys");

function foreach(arr, func) {
    for (var i in arr) {
        func(i, arr[i]);
    }
}

function between(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1) + min
    );
}

const addMetadata = (packname, author, inputWebpFile, outputWebpFile) => {
    return new Promise((resolve, reject) => {
        const stickerpackid = "com.luanrt.bigbywolf 15745273889";
        const googlelink = "https://play.google.com/store/apps/details?id=com.telltalegames.fables100";
        const applelink = "https://apps.apple.com/us/app/the-wolf-among-us/id716238885";
        const json = {
            "sticker-pack-id": stickerpackid,
            "sticker-pack-name": packname,
            "sticker-pack-publisher": author,
            "android-app-store-link": googlelink,
            "ios-app-store-link": applelink
        };

        let exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
        let jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8');
        let exif = Buffer.concat([exifAttr, jsonBuffer]);

        exif.writeUIntLE(jsonBuffer.length, 14, 4);

        let name = Math.random().toString(36).substring(7);

        fs.writeFile(`./${name}.exif`, exif, (err) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                try {
                    require('child_process').execSync(`webpmux -set exif ${name}.exif ${inputWebpFile} -o ${outputWebpFile}`);
                    resolve(`./${outputWebpFile}`);
                    fs.unlinkSync(`${name}.exif`);
                } catch (error) {
                    console.log('[ERROR] '+error);
                }
            }
        });
    });
};

async function start() {
    // Opens connection with WhatsApp.
    const conn = new WAConnection();
    conn.logger.level = 'warn';
    conn.on('qr', qr => {
        qrcode.generate(qr, {
            small: true
        });
        console.log(`[ ${moment().format("HH:mm:ss")} ] Scan the QR code with WhatsApp!`);
    });
    
    conn.on('connecting', () => {
        console.log('[INFO] Connecting to WhatsApp..');
    });
    
    conn.on('connection-validated', (user) => {
        console.log('[INFO] Connection has been successfully validated.');
    });
    
    conn.on('contacts-received', () => {
        console.log('[INFO] Bigby has ' + Object.keys(conn.contacts).length + ' contacts');
    });
    
    conn.on('open', () => {
        console.log('[INFO] Connection successfully established!');
    });
    
    conn.on('credentials-updated', () => {
        console.log(`[INFO] Credentials updated!`);
        const authInfo = conn.base64EncodedAuthInfo(); // get all the auth info we need to restore this session
        fs.writeFileSync('./session.json', JSON.stringify(authInfo, null, '\t')); // save this info to a file
    });

    fs.existsSync('./session.json') && conn.loadAuthInfo('./session.json');
    conn.connect();
    
    // Checks phone's battery percentage.
    conn.on('CB:action,,battery', json => {
        const batteryLevelStr = json[2][0][1].value;
        batterylevel = parseInt(batteryLevelStr);
        console.log('[INFO] Battery level: ' + batterylevel);
    });
    
    // Listens for incoming calls
    conn.on('CB:action,,call', async json => {
        const callerId = json[2][0][1].from;
        console.log(`[WARN] ${callerId.split('@')[0]} is calling Bigby!`);
        conn.updatePresence(callerId, Presence.available);
        conn.updatePresence(callerId, Presence.composing);
        setTimeout(async () => {
            conn.sendMessage(callerId, '*Hey you, do not call me!*\nNobody\'s gonna answer and you might end up getting blocked and permanently banned from using Bigby.', MessageType.text);
            conn.updatePresence(callerId, Presence.unavailable);
        }, 400);
    });

    // Checks Bigby's database for the first time.
    if (bannedUsers === null) {
        bannedUsers = await fetchJson(`${bigbyApi}/getBannedUsers`, {
            method: 'get'
        });
        bannedIds = [];
        for (var i = 0; i < bannedUsers.length; i++) {
            const id = JSON.stringify(bannedUsers[i].id).replace(/"/g, "");
            bannedIds.push(id);
        }
    }

    // Checks database every 5 minutes 
    function checkDatabase() {
        const scheduler = new ToadScheduler();
        const dbCheckTask = new AsyncTask(
            'DbCheck',
            () => {
                console.log("[INFO] Checking database.");
                return fetchJson(`${bigbyApi}/getBannedUsers`, {
                    method: 'get'
                }).then((result) => {
                    bannedUsers = result;
                    bannedIds = [];
                    for (var i = 0; i < result.length; i++) {
                        const id = JSON.stringify(result[i].id).replace(/"/g, "");
                        bannedIds.push(id);
                    }
                    console.log('[INFO] Total de Numeros Banidos: ' + result.length);
                    console.log('[INFO] Cron-job executado com sucesso.');
                }).catch((err) => {
                    console.log(`[ERROR] Something went wrong while checking the database.\n${err}`)
                });
            });
        const dbCheckJob = new SimpleIntervalJob({
            seconds: 300,
        }, dbCheckTask);
        scheduler.addSimpleIntervalJob(dbCheckJob);
    }

    conn.on('group-participants-update', async (p) => {
        try {
            mdata = await conn.groupMetadata(p.jid);
            console.log(`[INFO] ${p.action} -> ${p.participants[0].split('@')[0]} in ${mdata.subject}`);
            
            switch (p.action) {
                case 'add':
                    num = p.participants[0];
                    if (num == conn.user.jid) {
                        const msg = 'Saalve seus loko, esse é o\n*[𝐁𝚶𝐓]⏤͟͟͞͞ 𝑭𝒊𝒍𝒊𝒑͢𝒆🐊ᴼ̶ᴿ̶ᴵ̶ᴳ̶ᴵ̶ᴺ̶ᴬ̶ᴸ̶*\n\nDigite !menu para acessar os comandos\n\n*Ativo:* 24HRs\n*Versão:* 2.0.1';
                        const bigbyIsHereGif = fs.readFileSync('./mp4/bigby_is_here.mp4');
                        conn.sendMessage(mdata.id, bigbyIsHereGif, MessageType.video, {
                            mimetype: Mimetype.gif,
                            caption: msg
                        });
                    } else {
                        try {
                            dp = await conn.getProfilePicture(`${p.participants[0].split('@')[0]}@c.us`)
                        } catch {
                            dp = './nodp.png';
                        }
                        if(showdp.includes(p.jid)) {
                        imageToBase64(dp).then(
                            (response) => {
                                var buf = Buffer.from(response, 'base64');
                                const randomWelcomeMsgs = ['', 'Fala ae o Zé Ruela', 'iae Parça', 'Saalve', 'Fala ae Champs' ]
                                const msg = `${randomWelcomeMsgs[between(1, 4)]} @${num.split('@')[0]}\nBem vindo ao Grupo *${mdata.subject}*\n\n*Leia a Descrição!*`;
                                conn.sendMessage(mdata.id, buf, MessageType.image, {
                                    caption: msg,
                                    contextInfo: {
                                        "mentionedJid": [num],
                                    }
                                });
                            });
                        } else {
                            const randomWelcomeMsgs = ['', 'Fala ae Mano', 'iae Parça', 'Saalve', 'Fala ae Champs' ]
                            const msg = `${randomWelcomeMsgs[between(1, 4)]} @${num.split('@')[0]}\nBem vindo ao Grupo *${mdata.subject}*\n\n*Leia a Descrição!*`;
                            conn.sendMessage(mdata.id, msg, MessageType.text, {
                                    contextInfo: {
                                        "mentionedJid": [num],
                                    }
                                });
                        }
                    }
                    break;
                case 'remove':
                    num = p.participants[0];
                    const randomByeMsgs = ['', 'Mais um FRACO saiu ! :', 'Já foi tarde👋', 'Aos poucos a gente vai separando os FRACOS dos FORTES ,Flw👋' ]
                    if (sendByeMsg) {
                        try {
                            dp = await conn.getProfilePicture(`${p.participants[0].split('@')[0]}@c.us`)
                        } catch {
                            dp = './nodp.png';
                        }
                        if(showdp.includes(p.jid)) {
                        imageToBase64(dp).then(
                            (response) => {
                                var buf = Buffer.from(response, 'base64');
                                conn.sendMessage(mdata.id, buf, MessageType.image, {
                                    caption: `${randomByeMsgs[between(1, 3)]} @${num.split('@')[0]}`,
                                    contextInfo: {
                                        "mentionedJid": [num]
                                    }
                                });
                            });
                        } else {
                            conn.sendMessage(mdata.id, `${randomByeMsgs[between(1, 3)]} @${num.split('@')[0]}`, MessageType.text, {
                                    contextInfo: {
                                        "mentionedJid": [num]
                                    }
                                });
                        }
                    } else {
                        const crowdControljpg = fs.readFileSync('./mp4/bigby_crowd_control.jpg');
                        conn.sendMessage(mdata.id, crowdControljpg, MessageType.image, {
                            mimetype: Mimetype.jpg
                        });
                        sendByeMsg = true;
                    }
                    break;
                case 'promote':
                    num = p.participants[0];
                    console.log(`User @${num.split('@')[0]} has been promoted in ${mdata.subject}`);
                    break;
                case 'demote':
                    num = p.participants[0];
                    console.log(`User @${num.split('@')[0]} has been demoted in ${mdata.subject}`);
                    break;
                default:
                    console.log(`[INFO] Unknown action: ${p.action}`);
            }
        } catch (e) {
            console.log(e);
        }
    });

    conn.on('message-new', async (m) => {
        try {
            if (!m.message) return;
            if (m.key && m.key.remoteJid == 'status@broadcast') return;
            if (m.key.fromMe) return;

            const prefix = "!";

            let id = m.key.remoteJid;

            const messageContent = JSON.stringify(m.message);
            const messageType = Object.keys(m.message)[0];
            const isQuotedSticker = messageType === 'extendedTextMessage' && messageContent.includes('stickerMessage');
            const isQuotedImage = messageType === 'extendedTextMessage' && messageContent.includes('imageMessage') || messageContent.includes('stickerMessage');
            const isQuotedMedia = messageType === 'extendedTextMessage' && messageContent.includes('imageMessage') || messageContent.includes('videoMessage') || messageContent.includes('stickerMessage');

            let imageMessage = m.message.imageMessage;
            let videoMessage = m.message.videoMessage;
            
            const bigbyAdmins = ['5511910725063@s.whatsapp.net', '5516988149274@s.whatsapp.net', '5511989524077@s.whatsapp.net', '558188660049@s.whatsapp.net'];
            const bigbyNumber = conn.user.jid;

            const isGroup = id.endsWith('@g.us');
            const groupMd = isGroup ? await conn.groupMetadata(id) : '';
            const groupJid = isGroup ? groupMd.jid : '';
            const groupSubject = isGroup ? groupMd.subject : 'private';
            const groupMembers = isGroup ? groupMd.participants : '';
            const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : '';
            
            const sender = isGroup ? m.participant : m.key.remoteJid;
            
            const isGroupAdmin = groupAdmins.includes(sender) || false;
            const isBigbyGroupAdmin = groupAdmins.includes(bigbyNumber) || false;
            const isBigbyAdmin = bigbyAdmins.includes(sender);

            const jisho = new JishoApi();
            const randomMsgs = ['', '[❗] Iae Membro comum, Você não é ADM!',' [❗] Como assim vc quer remover alguem? vc não é ADM KK',' [❗] Comando apenas para ADMS parcerão', '[❗] KKK Membro Comum não pode usar este comando'];

            const reply = (text) => {
                conn.sendMessage(id, text, MessageType.text, {
                    quoted: m
                });
            }
            
            const replyWithMention = (text, membersJid) => {
                conn.sendMessage(id, text.trim(), MessageType.extendedText, {
                    quoted: m,
                    contextInfo: {
                        "mentionedJid": membersJid
                    }
                });
            }
            
            const isUrl = (url) => {
                return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'));
            }

            const isItSpam = (text) => {
                if (isUrl(text)) {
                    if (!pauseLinkDetection) {
                        console.log(`[WARN] Link detected in ${text} FROM ${sender.split('@')[0]}`);
                        if (!isGroup) {
                            console.log('[INFO] Not from a group.');
                        } else if (text.includes('https://chat.whatsapp.com/')) {
                            if (isGroupAdmin) return console.log('[INFO] Link from admin, so it\'s ok.');
                            if (!isBigbyGroupAdmin) return console.log('[INFO] I\'m not a group admin.');
                            pauseLinkDetection = true;
                            setTimeout(() => {
                                conn.groupRemove(id, [sender]).then((response) => {
                                    console.log(`[DEBUG] ${JSON.stringify(response)}`);
                                    sendByeMsg = false;
                                    pauseLinkDetection = false;
                                });
                            }, 200);
                        }
                    } else {
                        console.log('[INFO] Link detection paused!');
                    }
                }
            }

            const updateBigbysPresenceToOnline = () => {
                conn.updatePresence(id, Presence.available)
                if (isBigbyOnline === null || isBigbyOnline === false) {
                    setTimeout(async () => {
                        if (continueOnline) {
                            conn.updatePresence(id, Presence.available)
                            continueOnline = false;
                            isBigbyOnline = false;
                            updateBigbysPresenceToOnline(); // let's call it again just to make sure it's safe for Bigby to go offline
                        } else {
                            conn.updatePresence(id, Presence.unavailable) // well, now Bigby can go offline
                            isBigbyOnline = false;
                        }
                    }, 1000 * 15);
                    isBigbyOnline = true;
                } else {
                    continueOnline = true; // Bigby will continue online as long as someone is using him
                }
            }

            const updateBigbysPresenceToComposing = () => {
                updateBigbysPresenceToOnline();
                conn.updatePresence(id, Presence.composing) // tell them we're composing
            }

            const sendAsSticker = (media) => {
                const emptyWebpFile = `${cryptoRandomString(10)}.webp`;
                const tempOutputWebpFile = `${cryptoRandomString(10)}.webp`;

                exec(`ffmpeg -i ${media} -vcodec libwebp -filter:v fps=fps=13 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${emptyWebpFile}`, (error, stdout, stderr) => {
                    addMetadata('@𝑭𝒊𝒍𝒊𝒑͢𝒆🐊ᴼ̶ᴿ̶ᴵ̶ᴳ̶ᴵ̶ᴺ̶ᴬ̶ᴸ̶', '+55 (11) 91072-5063', emptyWebpFile, tempOutputWebpFile).then((result) => {
                        let buffer = fs.readFileSync(result);
                        conn.sendMessage(id, buffer, MessageType.sticker, {
                            quoted: m
                        });
                        fs.unlinkSync(media);
                        fs.unlinkSync(emptyWebpFile);
                        fs.unlinkSync(result);
                    }).catch((err) => {
                        console.log(`[INFO] Something went wrong while processing the sticker | logcat:\n${err}`);
                    });
                });
            }

            const text =
                (messageType == 'conversation') ?
                m.message.conversation :
                (messageType == 'imageMessage') ?
                m.message.imageMessage.caption :
                (messageType == 'videoMessage') ?
                m.message.videoMessage.caption :
                (messageType == 'extendedTextMessage') ?
                JSON.parse(JSON.stringify(m).replace('quotedM', 'm')).message.extendedTextMessage.text : '';

            const isCmd = text.startsWith(prefix);
            const cmd = text.slice(1).trim().split(/ +/).shift().toLowerCase();
            const cmdArgs = text.slice(cmd.length + 2);
            const cmdArgsAvailable = (text.slice(1).trim().split(/ +/)[1] == null) ? false : true;
            
            var formattedNum = null;
            var unformattedNum = null;
            var lang = 0;

            conn.chatRead(id);

            isItSpam(text);

            if (text.includes('Hello')) {
                updateBigbysPresenceToComposing();
                setTimeout(async () => {
                    const randomSentences = ['', 'Yo, what\'s up.', 'Hello, how are you?', 'How\'s it going?', 'Hi there!', 'Yo, what\'s been up?'];
                    reply(randomSentences[between(1, 5)]);
                }, 700);
            }

            if (aiConversationUsers.includes(sender)) {
                smartestchatbot.chat({
                    message: text,
                    name: "Filipe",
                    owner: "𝑭𝒊𝒍𝒊𝒑𝒆🐊ᴼᴿᴵᴳᴵᴺᴬᴸ",
                    user: sender
                }).then(aireply => {
                    const dt = aireply.length;
                    const composingTime = dt > 50 ? 6000 : dt * 100 + 100;
                    updateBigbysPresenceToComposing();
                    setTimeout(async () => {
                        reply(aireply);
                    }, composingTime);
                }).catch(err => {
                    conn.updatePresence(id, Presence.paused);
                });
            }

            if (isCmd && bannedIds.includes(sender)) return reply('[❗] Você está banido(a) de usar o BOT do 𝑭𝒊𝒍𝒊𝒑𝒆🐊ᴼ̶ᴿ̶ᴵ̶ᴳ̶ᴵ̶ᴺ̶ᴬ̶ᴸ̶');
            if (!isCmd) return console.log(`[MESSAGE] -> ${text} FROM ${sender.split("@s.whatsapp.net")[0]} IN ${groupSubject}`);
            console.log(`[CMD] -> !${cmd} [ARGS] -> ${cmdArgs} FROM ${sender.split("@s.whatsapp.net")[0]} IN ${groupSubject}`);

            switch (cmd) {
                /* System & Others */
                case 'menu':
                case 'regras':
                    updateBigbysPresenceToComposing();
                    setTimeout(async () => {
                        switch (cmd) {
                            case 'regras':
                                conn.sendMessage(id, menu.regras, MessageType.text, {
                                    quoted: m
                                });
                                break;
                            case 'menu':
                                conn.sendMessage(id, menu.menu, MessageType.text, {
                                    quoted: m
                                });
                                break;
                            default:
                        }
                    }, 700);
                    break;
                case 'bv':
                    if (!isGroupAdmin) reply('Somente administradores do grupo podem usar este comando.');
                    if (!isGroup) reply('Este comando só pode ser usado em grupos.');
                    if (cmdArgs.includes('sim')) {
                        if (!showdp.includes(id)) {
                            GrandArray.add(showdp, id);
                            reply(`Boas vindas personalizado ativado para o grupo ${groupSubject}`);
                        } else {
                            reply('Esta função já está ativa neste grupo.');
                        }
                    } else if (cmdArgs.includes('não')) {
                        if (showdp.includes(id)) {
                            for (var i = 0; i < showdp.length; i++) {
                                if (showdp[i] == id) {
                                    GrandArray.remove(showdp, i);
                                    reply(`Boas vindas personalizado desativado para o grupo ${groupSubject}`);
                                }
                            }
                        } else {
                            reply('Esta função já está ativa neste grupo.');
                        }
                    }
                    break;
                case 'showuserdpjids':
                    reply(JSON.stringify(showdp));
                    break;
                case 'bannedusers':
                    updateBigbysPresenceToOnline();
                    var bannedUsersList = "*Numeros Banidos de usar o BOT:*\n\n";
                    bannedUsersJids = [];
                    for (var i = 0; i < bannedUsers.length; i++) {
                        const id = JSON.stringify(bannedUsers[i].id).replace(/"/g, "");
                        const reason = JSON.stringify(bannedUsers[i].reason).replace(/"/g, "");

                        bannedUsersJids.push(id);

                        bannedUsersList += `*[${i}] Name: @${id.split("@s.whatsapp.net")[0]}*\n*Reason: _${reason}_*\n\n`
                    }
                    replyWithMention(bannedUsersList, bannedUsersJids);
                    break;
                case 'bannedjids':
                    reply(JSON.stringify(bannedIds));
                    break;
                case 'sysstatus':
                    updateBigbysPresenceToComposing();
                    const timestamp1 = speed();
                    const latensi1 = speed() - timestamp1;
                    getServerResponseTime(bigbyApi)
                        .then(responseTime => {
                            const sysinfo =
                                `*~ Ativo a: _${stht(process.uptime())}_*\n` +
                                `*~ Tempo de resposta: _${latensi1.toFixed(4)}ms_*\n` +
                                `*~ Ping: _${prettyMilliseconds(responseTime)}_*\n\n` +

                                `*Grupos: _${conn.chats.length}_*\n` +
                                `*Contatos: _${Object.keys(conn.contacts).length}_*\n` +
                                `*Nivel da Bateria: _${batterylevel}%_*`;
                            reply(sysinfo);
                        })
                    break;
                case 'ping':
                    updateBigbysPresenceToComposing();
                    const timestamp = speed();
                    const latensi = speed() - timestamp;
                    getServerResponseTime(bigbyApi)
                        .then(responseTime => {
                            conn.sendMessage(id, `ping! _em ${latensi.toFixed(4)}ms_\n 𝑭𝒊𝒍𝒊𝒑𝒆🐊ᴼᴿᴵᴳᴵᴺᴬᴸ Rest API: ${prettyMilliseconds(responseTime)}`, MessageType.text, {
                                quoted: m
                            });
                        })
                    break;
                case 'walink':
                    updateBigbysPresenceToComposing();
                    formattedNum = cmdArgs;
                    unformattedNum = `${formattedNum.replace('+', '').replace('-', '').replace('(', '').replace(')', '').replace(/\s+/g, '').trim()}`
                    reply(`https://wa.me/${unformattedNum}`);
                    break;
                case 'check':
                    updateBigbysPresenceToComposing();
                    formattedNum = cmdArgs;
                    unformattedNum = `${formattedNum.replace('+', '').replace('-', '').replace('(', '').replace(')', '').replace(/\s+/g, '').trim()}@s.whatsapp.net`
                    const exists = await conn.isOnWhatsApp(unformattedNum);
                    conn.sendMessage(id, `${formattedNum} ${exists ? "existe" : "não existe"} on WhatsApp.`, MessageType.text)
                    break;
                case 'talk':
                    for (var i = 0; i < aiConversationUsers.length; i++) {
                        if (sender == aiConversationUsers[i]) {
                            return reply('Você já fez isso.\nTo end the conversation say *_!end._*');
                        }
                    }
                    updateBigbysPresenceToComposing();
                    aiConversationUsers.push(sender);
                    console.log(aiConversationUsers);
                    reply('*WARNING!*\nBigby will try to reply to every message you send! Use _!end_ to end the conversation.\n\n_Ps. This feature is still in beta phase._');
                    break;
                case 'end':
                    for (var i = 0; i < aiConversationUsers.length; i++) {
                        if (sender == aiConversationUsers[i]) {
                            GrandArray.remove(aiConversationUsers, i);
                        }
                    }
                    break;
                case 'bigbydp':
                    if (!isBigbyAdmin) return reply('Apenas o dono 𝑭𝒊𝒍𝒊𝒑𝒆🐊ᴼᴿᴵᴳᴵᴺᴬᴸ e Associados podem usar este comando.');
                    switch (messageType) {
                        case 'extendedTextMessage':
                            updateBigbysPresenceToOnline();
                            em = JSON.parse(JSON.stringify(m).replace('quotedM', 'm'));
                            media = await conn.downloadAndSaveMediaMessage(em.message.extendedTextMessage.contextInfo);
                            newDp = fs.readFileSync(media);
                            conn.updateProfilePicture(bigbyNumber, newDp).then((response) => {
                                fs.unlinkSync(media);
                            });
                            break;
                        case 'imageMessage':
                            updateBigbysPresenceToOnline();
                            media = await conn.downloadAndSaveMediaMessage(m);
                            newDp = fs.readFileSync(media);
                            conn.updateProfilePicture(bigbyNumber, newDp).then((response) => {
                                fs.unlinkSync(media);
                            });
                            break;
                        default:
                    }
                    
                    break;
                case 'ban':
                    if (messageType == 'extendedTextMessage') {
                        em = JSON.parse(JSON.stringify(m).replace('quotedM', 'm'));
                        if (!isGroup) return reply('Este comando só pode ser usado em grupos.');
                        if (!bigbyAdmins.includes(sender)) return reply('[❗] Apenas o dono 𝑭𝒊𝒍𝒊𝒑𝒆🐊ᴼ̶ᴿ̶ᴵ̶ᴳ̶ᴵ̶ᴺ̶ᴬ̶ᴸ̶ e associados podem usar este comando!');

                        updateBigbysPresenceToComposing();

                        const targetMember = em.message.extendedTextMessage.contextInfo.participant;
                        const reason = text.slice(5);
                        const banProfile = {
                            jid: targetMember,
                            reason: reason
                        };

                        if (bannedIds.includes(banProfile.jid)) return reply("Este usuário já foi banido.");
                        if (bigbyAdmins.includes(targetMember)) return reply("Respeita meus ADMS.");
                        if (targetMember.includes(bigbyNumber)) return reply("Tá usando droga??");
                        if (reason == "") return reply("Você tem que fornecer mais informações.\n*!ban _<Motivo>_*");

                        bannedUsers = await fetchJson(`${bigbyApi}/banUser`, {
                            method: "POST",
                            body: JSON.stringify(banProfile),
                            headers: {
                                "Content-Type": "application/json"
                            }
                        });

                        bannedIds = [];

                        for (var i = 0; i < bannedUsers.length; i++) {
                            const id = JSON.stringify(bannedUsers[i].id).replace(/"/g, "");
                            bannedIds.push(id);
                        }

                        const banMsg = `𝑭𝒊𝒍𝒊𝒑𝒆🐊ᴼ̶ᴿ̶ᴵ̶ᴳ̶ᴵ̶ᴺ̶ᴬ̶ᴸ̶ Proibiu: @${targetMember.split("@s.whatsapp.net")[0]} de usar o BOT.`;
                        replyWithMention(banMsg, [targetMember]);
                    } else {
                        reply('[❗] Apenas o Brabo 𝑭𝒊𝒍𝒊𝒑𝒆🐊ᴼ̶ᴿ̶ᴵ̶ᴳ̶ᴵ̶ᴺ̶ᴬ̶ᴸ̶ e associados podem banir alguem de usar o BOT.');
                    }
                    break;
                case 'unban':
                    if (messageType == 'extendedTextMessage') {
                        em = JSON.parse(JSON.stringify(m).replace('quotedM', 'm'));
                        if (!isGroup) return reply('[❗] Este comando só pode ser usado em grupos.');
                        if (!bigbyAdmins.includes(sender)) return reply('[❗] Apenas o Brabo 𝑭𝒊𝒍𝒊𝒑𝒆🐊ᴼ̶ᴿ̶ᴵ̶ᴳ̶ᴵ̶ᴺ̶ᴬ̶ᴸ̶ e Associados podem usar este comando.');

                        const targetMember1 = em.message.extendedTextMessage.contextInfo.participant;
                        const unbanProfile = {
                            jid: targetMember1
                        };

                        updateBigbysPresenceToComposing();

                        if (bigbyAdmins.includes(targetMember1)) return reply('A brisa do cara');
                        if (targetMember1.includes(bigbyNumber)) return reply('??');
                        if (!bannedIds.includes(unbanProfile.jid)) return reply('Este usuário não foi banido.');

                        bannedUsers = await fetchJson(`${bigbyApi}/unbanUser`, {
                            method: "POST",
                            body: JSON.stringify(unbanProfile),
                            headers: {
                                "Content-Type": "application/json"
                            }
                        });

                        bannedIds = [];

                        for (var i = 0; i < bannedUsers.length; i++) {
                            const id = JSON.stringify(bannedUsers[i].id).replace(/"/g, "");
                            bannedIds.push(id);
                        }

                        const banMsg = `Usuario @${targetMember1.split("@s.whatsapp.net")[0]} foi Desbanido.`;
                        replyWithMention(banMsg, [targetMember1]);
                    } else {
                        reply('Você deve citar a mensagem da pessoa que deseja cancelar.');
                    }
                    break;
                case 'report':
                    if (messageType == 'extendedTextMessage') {
                        em = JSON.parse(JSON.stringify(m).replace('quotedM', 'm'));
                        var reportedUser = em.message.extendedTextMessage.contextInfo.participant;
                        var reporter = em.participant;
                        var reason = cmdArgs;
                        ids = [reportedUser, reporter];
                        const quotedMessage = em.message.extendedTextMessage.contextInfo.message.conversation;

                        updateBigbysPresenceToComposing();
                        if (bigbyAdmins.includes(reportedUser)) return reply('Você não pode denunciar os ADMS do 𝑭𝒊𝒍𝒊𝒑𝒆🐊ᴼᴿᴵᴳᴵᴺᴬᴸ.');

                        reportTxt =
                            "*Usage report by " + reporter.replace(/@s.whatsapp.net/, '') + "*\n\n" +
                            "*- Reported user: " + reportedUser.replace(/@s.whatsapp.net/, '') + "*\n" +
                            "*- Quoted message: " + `“${quotedMessage}”` + "*\n" +
                            "*- Reason: " + `“${reason}”*` + "\n";

                        conn.sendMessage(bigbyAdmins[0], reportTxt, MessageType.text);

                        reportTxt = `*User @${reportedUser.split("@s.whatsapp.net")[0]} has been successfully reported to Bigby's developer.*\n\n*[REPORTED BY]:* @${reporter.split("@s.whatsapp.net")[0]}\n*[REASON]:* “${reason}”\n\n*WARNING!*\nIf you send false reports you will be the one getting banned.`;
                        replyWithMention(reportTxt, ids)
                    } else {
                        reply('To report someone you must quote their message and provide a valid reason.');
                    }
                    break;
                case 'delete':
                    if (messageType == 'extendedTextMessage') {
                        updateBigbysPresenceToOnline();
                        em = JSON.parse(JSON.stringify(m).replace('quotedM', 'm'));
                        const dRandomMsgs = ['', '[❗] Você não é ADM parça', '[❗] Você não é ADM ,então n vou deletar nada', '[❗] Fala ae Membro comum kkk, você não é ADM!', '[❗] Vaza irmão, você não é ADM!'];
                        const deleteMsg = () => {
                            conn.deleteMessage(id, {
                                id: em.message.extendedTextMessage.contextInfo.stanzaId,
                                remoteJid: id,
                                fromMe: true
                            })
                        }
                        if (isGroup) {
                            if (!isGroupAdmin) return reply(dRandomMsgs[between(1, 4)]);
                            if (!bigbyNumber.includes(em.message.extendedTextMessage.contextInfo.participant)) return reply("Não consigo apagar esta mensagem");
                            deleteMsg();
                        } else {
                            if (!bigbyNumber.includes(em.message.extendedTextMessage.contextInfo.participant)) return reply("Eu apago apenas as minhas mensagens'.");
                            deleteMsg();
                        }
                    } else {
                        updateBigbysPresenceToComposing();
                        reply('Você se esqueceu de citar a mensagem que deseja excluir.');
                    }
                    break;

                    /* Groups */
                case 'adc':
                    if (!isGroup) return reply('Este comando só pode ser usado em grupos.');
                    if (!isGroupAdmin) return reply(randomMsgs[between(1, 1)]);
                    if (!isBigbyGroupAdmin) return reply("Para usar este Comando, dê ADM ao Bot :(");

                    updateBigbysPresenceToOnline();

                    if (messageType == 'extendedTextMessage') {
                        em = JSON.parse(JSON.stringify(m).replace('quotedM', 'm'));
                        if (em.message.extendedTextMessage === undefined || em.message.extendedTextMessage === null) {
                            reply('Wtf?');
                        } else {
                            mentioned = em.message.extendedTextMessage.contextInfo.mentionedJid
                            if (mentioned === undefined || mentioned === null) {
                                const member = em.message.extendedTextMessage.contextInfo.participant;
                                if (member.includes(bigbyNumber)) return reply('Eu já estou nesse grupo, como assim vc quer q eu me adicione');
                                try {
                                    const response = await conn.groupAdd(id, [member]);
                                } catch (err) {
                                    console.log('Error: ', err)
                                    conn.sendMessage("Não consegui adicionar esta pessoa por causa de suas configurações de privacidade.")
                                }
                            }
                        }
                    } else {
                        unformattedNum = text.slice(5);
                        const num = `${unformattedNum.replace('+', '').replace('-', '').replace('(', '').replace(')', '').replace(/\s+/g, '').trim()}@s.whatsapp.net`

                        const existsOnWa = await conn.isOnWhatsApp(num);

                        if (existsOnWa) {
                            try {
                                const response = await conn.groupAdd(id, [num]);
                            } catch (err) {
                                console.log('Error: ', err)
                                updateBigbysPresenceToComposing();
                                conn.sendMessage("Não consegui adicionar esta pessoa por causa de suas configurações de privacidade.")
                            }
                        } else {
                            updateBigbysPresenceToComposing();
                            reply('Não consegui adicionar esse número porque ele não está no WhatsApp.');
                        }
                    }
                    break;
                case 'banir':
                    if (!isGroup) return reply('Este comando só pode ser usado em grupos.');
                    if (!isGroupAdmin) return reply(randomMsgs[between(1, 5)]);
                    if (!isBigbyGroupAdmin) return reply("Para usar este comando, dê ADM ao Bot :(");

                    if (messageType == 'extendedTextMessage') {
                        updateBigbysPresenceToOnline();
                        em = JSON.parse(JSON.stringify(m).replace('quotedM', 'm'));
                        if (em.message.extendedTextMessage === undefined || em.message.extendedTextMessage === null) {
                            reply('Você quer que eu não remova nada?')
                        } else {
                            mentioned = em.message.extendedTextMessage.contextInfo.mentionedJid
                            if (mentioned === undefined || mentioned === null) {
                                const member = em.message.extendedTextMessage.contextInfo.participant;
                                if (member.includes(bigbyNumber)) return reply('Você quer q eu me remova? kk.');
                                conn.groupRemove(id, [member]);
                            } else if (mentioned.length > 1) {
                                updateBigbysPresenceToComposing();
                                reply("[❗] Não é possível remover mais de uma pessoa ao mesmo tempo.");
                            } else {
                                conn.groupRemove(id, mentioned);
                            }
                        }
                    } else {
                        updateBigbysPresenceToComposing();
                        reply('Marque a mensagem da pessoa que deseja banir.');
                    }
                    break;
                case 'promote':
                    if (!isGroup) return reply('[❗] Este comando só pode ser usado em grupos.');
                    if (!isGroupAdmin) return reply(randomMsgs[between(1, 5)]);
                    if (!isBigbyGroupAdmin) return reply("[❗] *Iae Membro comum kkk, você não é ADM para usar esse comando :(");

                    if (messageType == 'extendedTextMessage') {
                        updateBigbysPresenceToOnline();
                        em = JSON.parse(JSON.stringify(m).replace('quotedM', 'm'));
                        if (em.message.extendedTextMessage === undefined || em.message.extendedTextMessage === null) {
                            reply('??');
                        } else {
                            mentioned = em.message.extendedTextMessage.contextInfo.mentionedJid;
                            if (mentioned === undefined || mentioned === null) {
                                const member = em.message.extendedTextMessage.contextInfo.participant;
                                if (member.includes(bigbyNumber)) return reply('Ehh??');
                                const response = await conn.groupMakeAdmin(id, [member]);
                                console.log(response);
                            } else if (mentioned.length > 1) {
                                updateBigbysPresenceToComposing();
                                reply('[❗] Não é possível promover mais de uma pessoa ao mesmo tempo.');
                            } else {
                                const response = await conn.groupMakeAdmin(id, mentioned);
                                console.log(response);
                            }
                        }
                    } else {
                        updateBigbysPresenceToComposing();
                        reply('Para promover alguém, você deve marcá-lo ou citar sua mensagem.');
                    }
                    break;
                case 'demote':
                    if (!isGroup) return reply('[❗] Este comando só pode ser usado em grupos.');
                    if (!isGroupAdmin) return reply(randomMsgs[between(1, 5)]);
                    if (!isBigbyGroupAdmin) return reply("[❗] Para usar este comando, dê ADM ao Bot :(");

                    if (messageType == 'extendedTextMessage') {
                        updateBigbysPresenceToOnline();
                        em = JSON.parse(JSON.stringify(m).replace('quotedM', 'm'));
                        if (em.message.extendedTextMessage === undefined || em.message.extendedTextMessage === null) {
                            reply('Que?');
                        } else {
                            mentioned = em.message.extendedTextMessage.contextInfo.mentionedJid;
                            if (mentioned === undefined || mentioned === null) {
                                const member = em.message.extendedTextMessage.contextInfo.participant;
                                if (member.includes(bigbyNumber)) return reply('Ehh??');
                                const response = await conn.groupDemoteAdmin(id, [member]);
                                console.log(response);
                            } else if (mentioned.length > 1) {
                                updateBigbysPresenceToComposing();
                                reply('Não é possível rebaixar mais de uma pessoa ao mesmo tempo.');
                            } else {
                                const response = await conn.groupDemoteAdmin(id, mentioned);
                                console.log(response);
                            }
                        }
                    } else {
                        updateBigbysPresenceToComposing();
                        reply('Para rebaixar alguém, você deve marcá-lo ou citar sua mensagem.');
                    }
                    break;
                case 'gpset':
                    if (!isGroup) return reply('Este comando só pode ser usado em grupos.');
                    if (!isGroupAdmin) return reply(randomMsgs[between(1, 5)]);
                    if (!isBigbyGroupAdmin) return reply('[❗] Para usar este comando, dê ADM ao Bot :(');

                    updateBigbysPresenceToOnline();

                    const gsArgs = cmdArgs.split(' ');
                    if (gsArgs.length < 2) return reply('?');

                    switch (gsArgs[0]) {
                        case 'ms':
                            switch (gsArgs[1]) {
                                case 'abrir':
                                    conn.groupSettingChange(id, GroupSettingChange.messageSend, false);
                                    break;
                                case 'fechar':
                                    conn.groupSettingChange(id, GroupSettingChange.messageSend, true);
                                    break;
                            }
                            break;
                        case 'dc':
                            const gd = text.slice(cmd.length + 5);
                            conn.groupUpdateDescription(id, gd);
                            break;
                        case 'tt':
                            const tt = text.slice(cmd.length + 5);
                            conn.groupUpdateSubject(id, tt);
                            break;
                    }
                    break;
                case 'tagall':
                    updateBigbysPresenceToComposing();
                    if (!isGroup) return reply('Este comando só pode ser usado em grupos.');
                    if (!isGroupAdmin) return reply('[❗] Iae Membro comum KKK, você não é Adm para usar este comando');
                    membersJids = [];
                    tags = cmdArgs + '\n';
                    for (let mb of groupMembers) {
                        tags += `@${mb.jid.split('@')[0]}\n`
                        membersJids.push(mb.jid);
                    }
                    replyWithMention(tags, membersJids);
                    break;
                case 'listadmins':
                    updateBigbysPresenceToComposing();
                    if (!isGroup) return reply('Este não é um grupo.');
                    quantity = 0;
                    tags = `Os ADMS que você Respeita: ${groupAdmins.length}\n`;
                    for (let adm of groupAdmins) {
                        quantity += 1;
                        tags += `[${quantity.toString()}] @${adm.split('@')[0]}\n`;
                    }
                    replyWithMention(tags, groupAdmins);
                    break;
                case 'linkgp':
                    updateBigbysPresenceToComposing();
                    if (!isGroup) return reply("[❗] Este comando só pode ser usado em grupos.");
                    if (!isBigbyGroupAdmin) return reply("[❗] Para usar este Comando, dê ADM ao Bot :(");
                    invitecode = await conn.groupInviteCode(id);
                    reply(`https://chat.whatsapp.com/${invitecode}`);
                    break;
                case 'vaza':
                    updateBigbysPresenceToComposing();
                    if (!isGroup) return reply('Apenas em grupos');
                    if (!isGroupAdmin) return reply(randomMsgs[between(1, 5)]);
                    setTimeout(() => {
                        conn.groupLeave(id);
                    }, 2000);
                    setTimeout(() => {
                        conn.sendMessage(id, 'Até mais seus Zé Ruela.\nFlw🐊✌️', MessageType.text);
                    }, 0);
                    break;

                /* Stickers */
                case 'fig':
                case 'sticker':
                    switch (messageType) {
                        case 'extendedTextMessage':
                            if (!isQuotedMedia) return reply('Não, só funciona se você citar uma imagem, vídeo, gif ou outro adesivo.');
                            em = JSON.parse(JSON.stringify(m).replace('quotedM', 'm'));
                            updateBigbysPresenceToComposing();
                            switch (cmd) {
                                case 'sticker':
                                    reply('Criando... ▬▬▬▬▭ 𝟫𝟤%.\n*(Rlx que o Processamento aqui é Full Bala)* ');
                                    break;
                                case 'fig':
                                    reply('Criando... ▬▬▬▬▭ 𝟫𝟤%');
                                    break;
                                default:
                            }
                            media = await conn.downloadAndSaveMediaMessage(em.message.extendedTextMessage.contextInfo);
                            sendAsSticker(media);
                            break;
                        case 'imageMessage':
                            updateBigbysPresenceToComposing();
                            switch (cmd) {
                                case 'sticker':
                                    reply("Criando... ▬▬▬▬▭ 𝟫𝟤%.");
                                    break;
                                case 'fig':
                                    reply('Criando... ▬▬▬▬▭ 𝟫𝟤%.');
                                    break;
                                default:
                            }
                            media = await conn.downloadAndSaveMediaMessage(m);
                            sendAsSticker(media);
                            break;
                        case 'videoMessage':
                            updateBigbysPresenceToComposing();
                            switch (cmd) {
                                case 'sticker':
                                    if (m.message.videoMessage.seconds >= 11) return reply('Olha o tamanho desse gif/video ,quer fazer um sticker filme krlh? kkkk\n(Corte o video e tente novamente)');
                                    reply("Criando... ▬▬▬▬▭ 𝟫𝟤%.\n*(Rlx que o Processamento aqui é Full Bala)* ");
                                    break;
                                case 'fig':
                                    if (m.message.videoMessage.seconds >= 11) return reply('Este video/gif é muito longo.');
                                    reply('Criando... ▬▬▬▬▭ 𝟫𝟤%.\n*(Rlx que o Processamento aqui é Full Bala)*');
                                    break;
                                default:
                            }
                            media = await conn.downloadAndSaveMediaMessage(m);
                            sendAsSticker(media);
                            break;
                    }
                    break;
                case 'memesticker':
                    switch (messageType) {
                        case 'extendedTextMessage':
                            if (!isQuotedImage) return reply('Você tem que citar uma imagem ou um adesivo.');
                            if (!cmdArgsAvailable) return reply('Eu acho que você esqueceu algo.');
                            em = JSON.parse(JSON.stringify(m).replace('quotedM', 'm'));
                            updateBigbysPresenceToComposing();
                            reply('Criando... ▬▬▬▬▭ 𝟫𝟤%.\n*(Rlx que o processamento aqui é Full Bala)* ');
                            
                            top_text = (cmdArgs.split(',')[0] == null) ? '' : cmdArgs.split(',')[0];
                            bottom_text = (cmdArgs.split(',')[1] == null) ? '' : cmdArgs.split(',')[1];
                            
                            media = await conn.downloadAndSaveMediaMessage(em.message.extendedTextMessage.contextInfo);
                            tempPngFile = `temp/${cryptoRandomString(10)}.png`;
                            
                            updateBigbysPresenceToOnline();
                            
                            exec(`ffmpeg -i ${media} ${tempPngFile}`, (error, stdout, stderr) => {
                                try {
                                    makeMeme(tempPngFile, top_text, bottom_text)
                                    .then((results) => {
                                        sendAsSticker(results);
                                        fs.unlinkSync(tempPngFile);
                                    }).catch((err) => {
                                        console.log('[INFO] Algo deu errado!\n'+err);
                                    });
                                } catch (err) {
                                    conn.sendMessage(id, 'Oh merda, algo deu errado!', MessageType.text);
                                }
                            });
                            break;
                        case 'imageMessage':
                            if (!cmdArgsAvailable) return reply('Eu acho que você esqueceu algo.');
                            updateBigbysPresenceToComposing();
                            reply('Criando... ▬▬▬▬▭ 𝟫𝟤%.\n*(Rlx que o processamento aqui é Full Bala)* ');
                            
                            top_text = (cmdArgs.split(',')[0] == null) ? '' : cmdArgs.split(',')[0];
                            bottom_text = (cmdArgs.split(',')[1] == null) ? '' : cmdArgs.split(',')[1];
                            
                            media = await conn.downloadAndSaveMediaMessage(m);
                            try {
                                makeMeme(`./${media}`, top_text, bottom_text)
                                .then((results) => {
                                    sendAsSticker(results);
                                    fs.unlinkSync(tempPngFile);
                                }).catch((err) => {
                                        console.log('[INFO] Algo deu errado!\n'+err);
                                });
                            } catch (err) {
                                conn.sendMessage(id, 'Algo deu errado!', MessageType.text);
                            }
                            break;
                        default:
                            reply('Só posso fazer isso com imagens.');
                    }
                    break;
                case 'toimg':
                    if (!isQuotedSticker) return reply('Você tem que citar um adesivo.');
                    em = JSON.parse(JSON.stringify(m).replace('quotedM', 'm'));
                    media = await conn.downloadAndSaveMediaMessage(em.message.extendedTextMessage.contextInfo);
                    tempPngFile = `temp/${cryptoRandomString(10)}.png`
                    updateBigbysPresenceToOnline();

                    exec(`ffmpeg -i ${media} ${tempPngFile}`, (error, stdout, stderr) => {
                        try {
                            let buffer = fs.readFileSync(tempPngFile);
                            conn.sendMessage(id, buffer, MessageType.image, {
                                quoted: m,
                                caption: 'Sticker convertido em imagem com sucesso.'
                            });
                            fs.unlinkSync(tempPngFile);
                        } catch (err) {
                            conn.sendMessage(id, '[❗] Não funciona com Stickers Animados', MessageType.text)
                        }
                    })
                    break;

                /* Entertainment & Education */
                case 'wiki':
                    var wikiSearchQuery = cmdArgs;
                    updateBigbysPresenceToComposing();

                    (async () => {
                        try {
                            const page = await wiki.page(wikiSearchQuery);
                            const summary = await page.summary();

                            conn.sendMessage(id,
                                `*- Title:*\n${JSON.stringify(page.title).replace(/"/g, "")}\n\n*- Descrição:*\n-> _${JSON.stringify(summary.description).replace(/"/g, "")}_\n\n${JSON.stringify(summary.extract).replace(/\\/g, "").replace(/"/g, "")}\n\n*- URL:*\n${JSON.stringify(page.fullurl).replace(/"/g, "")}`, MessageType.text, {
                                    quoted: m
                                })

                            const images = await page.images({
                                redirect: true,
                                limit: 5
                            });
                            var imageLink = JSON.stringify(images[0].url).replace(/"/, "").replace(/"/, "");
                        } catch (error) {
                            conn.sendMessage(id, 'Ops! algo deu errado ,Tente pesquisar por outra coisa', MessageType.text);
                        }
                    })();
                    break;
                case 'gg':
                  //  return reply('This command is briefly unavailable for scheduled maintenance.');
                    const searchQuery = text.replace(/!gg /, '');
                    updateBigbysPresenceToComposing();

                    if (searchQuery.length < 1) return reply('O que? Acho que você esqueceu de algo!');
                    googleIt(searchQuery)
                    .then((results) => {
                        reply(
                            '*- Título:* ' + '\n' +results[0].title + '\n\n' +
                            '*- Info:* ' + '\n' + results[0].description + '\n\n' +
                            '*- Link:* ' + '\n' + results[0].url);
                        reply(
                            '*- Título:* ' + '\n' + results[1].title + '\n\n' +
                            '*- Info:* ' + '\n' + results[1].description + '\n\n' +
                            '*- Link:* ' + '\n' + results[1].url);
                    }).catch((err) => {
                        console.log('[❗] Algo deu errado ao buscar no Google.\n'+err);
                    });
                    break;
                case 'gis':
                    const imgSearchQuery = text.slice(5);
                    const imgSearchQueryLowercase = imgSearchQuery.toLowerCase();
                    const gisRandomMsgs = ['', 'Procurando! 🐊', 'Espera ae mano', 'Blz parça, vamos ver se consigo encontrar isso! ;) ', 'Calma ae irmãozin.'];

                    updateBigbysPresenceToComposing();

                    if (
                        imgSearchQueryLowercase.includes('gay') || imgSearchQueryLowercase.includes('dick') ||
                        imgSearchQueryLowercase.includes('vagina') || imgSearchQueryLowercase.includes('porn') ||
                        imgSearchQueryLowercase.includes('pica') || imgSearchQueryLowercase.includes('pau') ||
                        imgSearchQueryLowercase.includes('ass') || imgSearchQueryLowercase.includes('pnis') ||
                        imgSearchQueryLowercase.includes('cock') || imgSearchQueryLowercase.includes('bts') ||
                        imgSearchQueryLowercase.includes('penis') || imgSearchQueryLowercase.includes('kontol') ||
                        imgSearchQueryLowercase.includes('memek') || imgSearchQueryLowercase.includes('peen') ||
                        imgSearchQueryLowercase.includes('shlong') || imgSearchQueryLowercase.includes('boobs') ||
                        imgSearchQueryLowercase.includes('pussy') || imgSearchQueryLowercase.includes('boob') ||
                        imgSearchQueryLowercase.includes('nudes') || imgSearchQueryLowercase.includes('butts') ||
                        imgSearchQueryLowercase.includes('butt') || imgSearchQueryLowercase.includes('sexy') ||
                        imgSearchQueryLowercase.includes('cunt') || imgSearchQueryLowercase.includes('b00b') ||
                        imgSearchQueryLowercase.includes('buceta') || imgSearchQueryLowercase.includes('whore'))
                        return reply('Ala kkkk para de ser punheteiro seu cabaço');

                    reply(gisRandomMsgs[between(1, 4)]);

                    console.log(`Google Image Search query: ${imgSearchQuery}`);

                    gis(imgSearchQuery, processResults);

                    function processResults(error, results) {
                        if (error) return reply('Hmm, something went wrong! Maybe you should try searching for something else?');
                        
                        if (JSON.stringify(results[0].url).includes('pornhub')) return reply('Porno aqui não KRL.');
                        if (JSON.stringify(results[1].url).includes('pornhub')) return reply('Sem pornografia aqui truta.');
                        if (JSON.stringify(results[0].url).includes('porn')) return reply('Irmão se liberte ,punheta é uma fraude.');
                        if (JSON.stringify(results[1].url).includes('porn')) return reply('Ala kkk vai procurar uma mulher seu Punhetero desgraçado.');
                        if (JSON.stringify(results[0].url).includes('xvideo')) return reply('Quer porno vai pro Google.');
                        if (JSON.stringify(results[1].url).includes('xvideo')) return reply('Irmão pare de ser um fracassado.');
                        
                        for(var i = 0; i < 2; i++) {
                            imageToBase64(results[i].url).then(
                                (response) => {
                                    var buf = Buffer.from(response, 'base64');
                                    const options = {
                                        mimetype: Mimetype.jpg,
                                        caption: '*' + imgSearchQuery + '*',
                                        quoted: m
                                    }
                                    conn.sendMessage(id, buf, MessageType.image, options)
                                }).catch(err => {
                                    reply('Não foi possível baixar algumas imagens.');
                                });
                            try {
                                console.log(`[INFO] - IMG URL: ${results[i].url}`);
                            } catch(e) {
                                console.log(e);
                            }
                        } 
                    }
                    break;
                case 'imglinks':
                    const imgLinksSearchQuery = cmdArgs;
                    const randomMsgs1 = ['', 'Procurando', 'Iae Tiu? Virou festa agora? Vou começar a cobrar.', '⏳ Aguarde ⏳...', 'Blz mano, só um segundo.'];

                    updateBigbysPresenceToComposing();
                    reply(randomMsgs1[between(1, 4)]);

                    gis(imgLinksSearchQuery, processImgLinksResults);

                    function processImgLinksResults(error, results) {
                        if (error) {
                            reply('Algo deu errado! Talvez você deva tentar pesquisar por outra coisa?');
                        } else {
                            for (var i = 0; i < 3; i++) {
                                reply(JSON.stringify(results[i].url).replace(/"/, '').replace(/"/, ''));
                            }
                        }
                    }
                    break;
                case 'ytsearch':
                    updateBigbysPresenceToComposing();

                    youtube.search(cmdArgs).then(results => {
                        const duration = sf.convert(results.videos[0].duration).format();
                        const ytresults =
                            "*Title:*\n" + results.videos[0].title + "\n\n" +
                            "*Description:*\n" + results.videos[0].description + "\n\n" +
                            "*Views:* " + numFormat(results.videos[0].views) + "\n" +
                            "*Duration:* " + duration + '\n' +
                            "*Uploaded:* " + results.videos[0].uploaded + "\n" +
                            "*Channel:* " + results.videos[0].channel.name + "\n\n" +
                            "*Channel Link:*\n" + results.videos[0].channel.link + "\n" +
                            "*Video Link:*\n" + results.videos[0].link;

                        imageToBase64(results.videos[0].thumbnail).then(
                            (response) => {
                                var buf = Buffer.from(response, 'base64');
                                const options = {
                                    mimetype: Mimetype.jpg,
                                    caption: ytresults,
                                    quoted: m
                                }
                                conn.sendMessage(id, buf, MessageType.image, options)
                            });
                    }).catch(err => {
                        reply('Something went wrong :(');
                    });
                    break;
                case 'translate':
                    if (messageType == 'extendedTextMessage') {
                        em = JSON.parse(JSON.stringify(m).replace('quotedM', 'm'));
                        const translationQuery = em.message.extendedTextMessage.contextInfo.message.conversation;
                        const translationData = text.replace(/!translate/, '').replace(/ /, '');
                        const fromLang = translationData.slice(0, 2);
                        const toLang = translationData.slice(-2);

                        updateBigbysPresenceToComposing();

                        console.log('[----translating----]\n' + 'Text: ' + translationQuery + '\n' + 'From: ' + fromLang + '\n' + 'To: ' + toLang)

                        const main = async () => {
                            const translation = await translate(translationQuery, {
                                from: fromLang,
                                to: toLang
                            });
                            reply(translation);
                        };
                        main();
                    } else {
                        const translationQuery = text.slice(0, -6).replace(/!translate/, '').replace(/ /, '');
                        const fromLang = text.slice(-5, -3);
                        const toLang = text.slice(-2);

                        updateBigbysPresenceToComposing();

                        console.log(`[----translating----]\n Text: ${translationQuery}\nFrom: ${fromLang}\nTo: ${toLang}`)

                        const main = async () => {
                            const translation = await translate(translationQuery, {
                                from: fromLang,
                                to: toLang
                            });
                            reply(translation);
                        };
                        main();
                    }
                    break;
                case 'kanji':
                    const kanjiQuery = text.split(' ');

                    updateBigbysPresenceToComposing();

                    jisho.searchForKanji(kanjiQuery[1]).then(result => {
                        if (result.found) {
                            //kunyomi
                            var kunarray = result.kunyomi;
                            var kun = '';

                            kunarray.forEach(function(entry) {
                                kun += entry + ', ';
                            });

                            //parts
                            var partsarray = result.parts;
                            var parts = '';

                            partsarray.forEach(function(entry) {
                                parts += entry + ', ';
                            });

                            //kunyomi examples
                            var kunex = result.kunyomiExamples[0] ? result.kunyomiExamples[0] : {
                                example: 'not found',
                                meaning: 'not found',
                                reading: 'not found'
                            };
                            var kex =
                                '- Example: ' + kunex.example + '\n' +
                                '- Reading: ' + kunex.reading + '\n' +
                                '- Meaning: ' + kunex.meaning;

                            //radical
                            var radical = result.radical;
                            var rdc =
                                '- Symbol: ' + radical.symbol + '\n' +
                                '- Forms: ' + radical.forms + '\n' +
                                '- Meaning: ' + radical.meaning;

                            conn.sendMessage(
                                id, {
                                    url: result.strokeOrderGifUri
                                },
                                MessageType.video, {
                                    mimetype: Mimetype.gif,
                                    caption: '*Taught in:* ' + result.taughtIn + '\n' +
                                        '*JLPT Level:* ' + result.jlptLevel + '\n\n' +
                                        '*Newspaper frequency rank:* ' + `_${result.newspaperFrequencyRank}_` + '\n' +
                                        '*Stroke count:* ' + `_${result.strokeCount}_` + '\n' +
                                        '*Meaning:* ' + `${result.meaning}` + '\n\n' +
                                        '*Kunyomi:* ' + kun + '\n' +
                                        '*Kunyomi example:* \n' + `${kex}` + '\n\n' +
                                        '*Radical:* \n' + `${rdc}` + '\n\n' +
                                        '*Parts:* \n' + parts + '\n\n' +
                                        '*Stroke order diagram:* \n' + result.strokeOrderDiagramUri + '\n\n' +
                                        '*Stroke order SVG:* \n' + result.strokeOrderSvgUri + '\n\n' +
                                        '*Stroke order GIF:* \n' + result.strokeOrderGifUri + '\n\n' +
                                        '*Jisho:* \n' + result.uri
                                });
                        } else {
                            conn.sendMessage(id, 'Sorry, I could not find this kanji.', MessageType.text, {
                                quoted: m
                            });
                        }
                    });
                    break;
                case 'webtotext':
                    fetchText(cmdArgs, {
                        method: 'get'
                    }).then((result) => {
                        var htmlText = htmlToText.fromString(result, {
                            noLinkBrackets: true,
                            hideLinkHrefIfSameAsText: true,
                            //     linkHrefBaseUrl: cmdArgs,
                            ignoreHref: true,
                            format: {
                                heading: function(elem, fn, options) {
                                    var h = fn(elem.children, options);
                                    return '\n' + h.toUpperCase() + '\n';
                                }
                            }
                        });
                        reply(htmlText);
                    });
                    break;           
                case 'imdb':
                    var genre = '';
                    updateBigbysPresenceToComposing();
                    nameToImdb(cmdArgs, function(err, res, inf) {
                        console.log(res);
                        imdb(res, function(err, data) {
                            if (err)
                                console.log(err.stack);
                            if (data)
                                for (var i = 0; i < data.genre.length; i++) {
                                    genre += data.genre[i] + " ";
                                }

                            if (data.poster == 'N/A') return reply(`*Título:* ${data.title}\n*Ano:* ${data.year}\n*Classificação:* ${data.contentRating}\n*Duração:* ${data.runtime}\n*Avaliação:* ${data.rating}\n\n*Descrição :* ${data.description}`);
                            imageToBase64(data.poster).then((response) => {
                                var buf = Buffer.from(response, 'base64');
                                const options = {
                                    mimetype: Mimetype.jpg,
                                    caption: `*Title:* ${data.title}\n*Year:* ${data.year}\n*Content Rating:* ${data.contentRating}\n*Duration:* ${data.runtime}\n*Rating:* ${data.rating}\n*Genre:* ${genre}\n*Director:* ${data.director}\n\n*Description :* ${data.description}`,
                                    quoted: m
                                }
                                conn.sendMessage(id, buf, MessageType.image, options);
                            });
                        });
                    });
                    break;
                case 'memes':
                case 'meme':
                    updateBigbysPresenceToOnline();
                    await redditimage.fetch({
                        type: "meme",
                        total: 2,
                        addSubreddit: ["memes", "funny"],
                        removeSubreddit: ["dankmemes"],
                    }).then((result) => {
                        const title = result[0].title;
                        const postlink = result[0].postLink;
                        const image = result[0].image;

                        const data =
                            `${title}\n*Post:* ${postlink}`;

                        imageToBase64(image.replace(/"/, '').replace(/"/, '')).then(
                            (response) => {
                                var buf = Buffer.from(response, 'base64');
                                const options = {
                                    mimetype: Mimetype.jpg,
                                    caption: data,
                                    quoted: m
                                }
                                conn.sendMessage(id, buf, MessageType.image, options)
                            });
                    });
                    break;
                case 'dankmemes':
                case 'dankmeme':
                    updateBigbysPresenceToOnline();
                    await redditimage.fetch({
                        type: "meme",
                        total: 2,
                        addSubreddit: ["dankmemes", "funny"],
                    }).then((result) => {
                        const title = result[0].title;
                        const postlink = result[0].postLink;
                        const image = result[0].image;

                        const data = `${title}\n*Post:* ${postlink}`;

                        imageToBase64(image.replace(/"/, '').replace(/"/, '')).then(
                            (response) => {
                                var buf = Buffer.from(response, 'base64');
                                const options = {
                                    mimetype: Mimetype.jpg,
                                    caption: data,
                                    quoted: m
                                }
                                conn.sendMessage(id, buf, MessageType.image, options)
                            });
                    });
                    break;

                    /* Media & Others */
                case 'download':
                    var imgUrl = text.slice(10);
                    updateBigbysPresenceToComposing();
                    reply('Baixando imagem...');
                    imageToBase64(imgUrl).then(
                        (response) => {
                            var buf = Buffer.from(response, 'base64'); // Ta-da	
                            const options = {
                                mimetype: Mimetype.jpg,
                                caption: 'Aqui está!'
                            }
                            conn.sendMessage(id, buf, MessageType.image, options)
                        }).catch(err => {
                            reply('Hmm Algo deu errado ,Talvez o link que você forneceu seja inválido.');
                        });
                    break;
                case 'baixarmp4':
                case 'mp4':
                    updateBigbysPresenceToComposing();
                    switch (cmd) {
                        case 'mp4':
                            lang = 0;
                            break;
                        case 'baixarmp4':
                            lang = 1;
                            break;
                        default:
                    }
                    
                    if (isUrl(cmdArgs)) {
                        if (!cmdArgs.includes('youtu')) return reply('O que?? Apenas links do YouTube são permitidos!');
                    }
                    
                    youtube.search(cmdArgs).then(results => {
                        var title = results.videos[0].title;
                        var duration = results.videos[0].duration;
                        var link = results.videos[0].link;

                        if (duration >= 1400) return (lang == 0) ? reply('Quer baixar Filme vai pro Torrent KKKK\n*(Não funciona com videos maiores que 16 minutos.)* ') : reply('Quer baixar Filme vai pro Torrent KKKK\n*(Não funciona com videos maiores que 16 minutos.)* ');

                        var tempMp4File = `mp4/${cryptoRandomString(10)}.mp4`

                        video = ytdl(link);
                        video.pipe(fs.createWriteStream(tempMp4File));
                        
                        switch (lang) {
                            case 0:
                                conn.sendMessage(id, `BAIXANDO ${title} do YouTube..`, MessageType.text, {
                                    quoted: m
                                });
                                break;
                            case 1:
                                conn.sendMessage(id, `Baixando ${title} do YouTube..`, MessageType.text, {
                                    quoted: m
                                });
                                break;
                            default:
                        }
                        
                        video.on('end', () => {
                            updateBigbysPresenceToOnline();

                            const buffer = fs.readFileSync(tempMp4File);
                            const options = {
                                mimetype: Mimetype.mp4,
                                caption: title
                            }

                            conn.sendMessage(id, buffer, MessageType.video, options);
                            fs.unlinkSync(tempMp4File);
                        });
                        
                        video.on('error', error => {
                            console.log(`[ERROR] Could not download video:\n${error}`);
                            reply((lang == 0) ? 'O bot tá zuado, tente novamente mais tarde.' : 'Aconteceu algo de errado, por favor tente novamente mais tarde.');
                        });
                    });
                    break;
                case 'baixarmp3':
                case 'mp3':
                    updateBigbysPresenceToComposing();
                    switch (cmd) {
                        case 'mp4':
                            lang = 0;
                            break;
                        case 'baixarmp3':
                            lang = 1;
                            break;
                        default:
                    }
                    
                    if (isUrl(cmdArgs)) {
                        if (!cmdArgs.includes('youtu')) return reply('[❗] Apenas links do YouTube são permitidos!');
                    }
                    
                    youtube.search(cmdArgs).then(results => {
                        var title = results.videos[0].title;
                        var duration = results.videos[0].duration;
                        var link = results.videos[0].link;

                        if (duration >= 1400) return (lang == 0) ? reply('[❗] Áudios com mais de 16 minutos não são permitidos.') : reply('[❗] Áudios com mais de 16 minutos não são permitidos.');

                        var tempMp4File = `mp4/${cryptoRandomString(10)}.mp4`
                        var tempOggFile = `mp3/${cryptoRandomString(10)}.ogg`

                        video = ytdl(link, {
                            filter: 'audioonly',
                            quality: 'highestaudio'
                        });

                        video.pipe(fs.createWriteStream(tempMp4File));

                        if (lang == 0) {
                            conn.sendMessage(id, `Baixando ${title} do YouTube..`, MessageType.text, {
                                quoted: m
                            });
                        } else if (lang == 1) {
                            conn.sendMessage(id, `Baixando ${title} do YouTube..`, MessageType.text, {
                                quoted: m
                            });
                        }

                        video.on('end', () => {
                            updateBigbysPresenceToComposing();
                            if (lang == 0) {
                                conn.sendMessage(id, '*Enviando arquivo de áudio* 🏄🔥☂️🐊', MessageType.text, {
                                    quoted: m
                                });
                            } else if (lang == 1) {
                                conn.sendMessage(id, '*Enviando arquivo de áudio* 🏄🔥☂️🐊', MessageType.text, {
                                    quoted: m
                                });
                            }

                            try {
                                exec(`ffmpeg -i ${tempMp4File} -vn -ar 44100 -ac 2 -b:a 192k -f ipod ${tempOggFile} -y`, (error, stdout, stder) => {
                                    let buffer = fs.readFileSync(tempOggFile);
                                    const options = {
                                        mimetype: Mimetype.mp4Audio,
                                        quoted: m,
                                        ptt: false
                                    };
                                    conn.sendMessage(id, buffer, MessageType.audio, options);

                                    fs.unlinkSync(tempMp4File);
                                    fs.unlinkSync(tempOggFile);
                                });
                            } catch (e) {
                                console.log(e.code);
                                console.log(e.msg);

                                updateBigbysPresenceToComposing();
                                setTimeout(async () => {
                                    reply('Something went wrong :/');
                                }, 500);
                            }
                        });
                        
                        video.on('error', error => {
                            console.log(`[ERROR] Could not download video`);
                            reply((lang == 0) ? 'Something went wrong, try again later.' : 'Aconteceu algo de errado, por favor tente novamente mais tarde.');
                        });
                    });
                    break;
                case 'vn':
                    const ttsText = text.slice(0, -3).replace(/!vn/, '').replace(/ /, '');
                    const ttsLang = text.slice(-2).replace(/\s+/g, '').trim();

                    const tts = require('./lib/gtts.js')(ttsLang)

                    updateBigbysPresenceToOnline();
                    conn.updatePresence(id, Presence.recording)

                    console.log('TTS: \n' + 'Text: ' + ttsText + '\n' + 'Lang: ' + ttsLang)

                    af0 = `${cryptoRandomString(10)}.mp3`
                    af1 = `${cryptoRandomString(10)}.ogg`

                    tts.save(af0, ttsText, function() {
                        exec(`ffmpeg -i ${af0} -ar 48000 -vn -c:a libopus ${af1}`, (error, stdout, stder) => {
                            let res = fs.readFileSync(af1)
                            conn.sendMessage(id, res, MessageType.audio, {
                                ptt: true,
                                quoted: m
                            })
                            fs.unlinkSync(af1)
                            fs.unlinkSync(af0)
                        });
                    });
                    break;
                case 'vcpt':
                    const ttspt = require('./lib/gtts.js')('pt-br')

                    updateBigbysPresenceToOnline();
                    conn.updatePresence(id, Presence.recording)

                    af0 = `${cryptoRandomString(10)}.mp3`
                    af1 = `${cryptoRandomString(10)}.ogg`

                    ttspt.save(af0, cmdArgs, function() {
                        exec(`ffmpeg -i ${af0} -ar 48000 -vn -c:a libopus ${af1}`, (error, stdout, stder) => {
                            let res = fs.readFileSync(af1)
                            conn.sendMessage(id, res, MessageType.audio, {
                                ptt: true,
                                quoted: m
                            })
                            fs.unlinkSync(af1)
                            fs.unlinkSync(af0)
                        });
                    });
                    break;
                case 'lyrics':
                    const lyricsQuery = cmdArgs.split(',');
                    console.log(lyricsQuery);
                    
                    const lyricstitle = lyricsQuery[0];
                    const lyricsartist = lyricsQuery[1];

                    updateBigbysPresenceToComposing();

                    musicInfo.searchLyrics({
                        title: lyricstitle,
                        artist: lyricsartist
                    }).then(searchResults => {
                        reply(searchResults.lyrics);
                    }).catch(err => {
                        reply('Letras não encontradas :(');
                    });
                    break;
                case 'songinfo':
                    const songdata = cmdArgs.split(',');
                    const songtitle = songdata[0];
                    const songartist = songdata[1];
                    const songalbum = songdata[2];

                    console.log(songdata);

                    updateBigbysPresenceToComposing();

                    musicInfo.searchSong({
                            title: songtitle,
                            artist: songartist,
                            album: songalbum
                        }, 1000)
                        .then(result => {
                            const explicit = result.explicit ? 'sim' : 'não';
                            const artworkUrl = result.artwork;

                            const msgText =
                                'INFORMAÇÕES DA MUSICA:' + '\n\n' +
                                '*Nome da música:* ' + result.title + '\n' +
                                '*Artista:* ' + result.artist + '\n' +
                                '*Album:* ' + result.album + '\n' +
                                '*Disco:* ' + result.discNumber + '\n' +
                                '*Track:* ' + result.trackNumber + '\n' +
                                '*Explicito:* ' + explicit + '\n' +
                                '*Lançamento:* ' + result.releaseDate + '\n' +
                                '*Genero:* ' + result.genre + '\n' +
                                '*Duração:* ' + prettyMilliseconds(result.lengthMilliSec, {
                                    colonNotation: true
                                }).slice(0, -2) + '\n';

                            imageToBase64(artworkUrl).then(
                                (response) => {
                                    var buf = Buffer.from(response, 'base64');
                                    const options = {
                                        mimetype: Mimetype.jpg,
                                        caption: msgText,
                                        quoted: m
                                    }
                                    conn.sendMessage(id, buf, MessageType.image, options)
                                }).catch(err => {
                                    console('[❗] Não foi possível baixar a arte.');
                                });
                        }).catch(err => {
                            reply('[❗] Não consegui encontrar nada sobre esta música.');
                        });
                    break;
                case 'albuminfo':
                    const albumdata = cmdArgs.split(',');
                    const albumname = albumdata[0];
                    const albumartist = albumdata[1];

                    console.log(albumdata);

                    updateBigbysPresenceToComposing();

                    musicInfo.searchAlbum({
                            name: albumname,
                            artist: albumartist
                        }, 1000)
                        .then(result => {
                            const explicit = result.explicit ? 'sim' : 'não';
                            const artworkUrl = result.artwork;

                            const msgText =
                                'INFORMACÕES DO ALBUM:' + '\n\n' +
                                '*Nome:* ' + result.name + '\n' +
                                '*Artista:* ' + result.artist + '\n' +
                                '*Tracks:* ' + result.trackCount + '\n' +
                                '*Explicito:* ' + explicit + '\n' +
                                '*Classificação:* ' + result.contentAdvisoryRating + '\n' +
                                '*Data de lançamento:* ' + result.releaseDate + '\n' +
                                '*Genero:* ' + result.genre;

                            imageToBase64(artworkUrl).then(
                                (response) => {
                                    var buf = Buffer.from(response, 'base64');
                                    const options = {
                                        mimetype: Mimetype.jpg,
                                        caption: msgText,
                                        quoted: m
                                    }
                                    conn.sendMessage(id, buf, MessageType.image, options)
                                });
                        }).catch(err => {
                            reply('[❗] Não consegui encontrar nada sobre este álbum.');
                        });
                    break;

                    /* Utilities */
                case 'encurta':
                case 'shorten':
                    updateBigbysPresenceToComposing();
                    TinyURL.shorten(cmdArgs.replace(/\s+/g, '').trim(), function(res, err) {
                        if (err) {
                            if (text.includes('!shorten')) return reply('Algo deu errado.🤔');
                            if (text.includes('!encurta')) return reply('Aconteceu algo errado.🤔');
                        } else {
                            reply(`${res}`);
                        }
                    });
                    break;

                    /* Others */
                case 'bts':
                    updateBigbysPresenceToComposing();
                    setTimeout(async () => {
                        reply(
                            '*B* unch of\n' +
                            '*T* ranssexual\n' +
                            '*S* ingers');
                    }, 700);
                    break;
                case 'bloody':
                    updateBigbysPresenceToOnline();
                    conn.updatePresence(id, Presence.recording);

                    const buffer = fs.readFileSync('mp3/fuckyoubloody.mp3');
                    conn.sendMessage(id, buffer, MessageType.audio, {
                        mimetype: Mimetype.mp4Audio,
                        ptt: true,
                        quoted: m
                    });
                    break;
                default:
                    console.log(`[WARN] Unknown command ${cmd} from ${sender.split('@')[0]}`);
            }
        } catch (e) {
            console.log('Error :' + e)
        }
    })
    checkDatabase();
}
start();
