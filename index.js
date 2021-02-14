const {
    WAConnection,
    MessageType,
    Presence,
    Mimetype,
    GroupSettingChange
} = require('@adiwajshing/baileys')

/******BEGIN OF FILE INPUT******/
const {
    color,
    bgcolor
} = require('./lib/color')
const {
    bahasa
} = require('./src/bahasa')
const {
    negara
} = require('./src/kodenegara')
const {
    virtex
} = require('./src/virtex')
const {
    wait,
    simih,
    getBuffer,
    h2k,
    generateMessageID,
    getGroupAdmins,
    getRandom,
    banner,
    start,
    info,
    success,
    close
} = require('./lib/functions')
const {
    fetchJson
} = require('./lib/fetcher')
const {
    recognize
} = require('./lib/ocr')
/******END OF FILE INPUT******/

/******BEGIN OF NPM PACKAGE INPUT******/
const fs = require('fs')
const moment = require('moment-timezone')
const {
    exec
} = require('child_process')
const kagApi = require('@kagchi/kag-api')
const fetch = require('node-fetch')
const tiktod = require('tiktok-scraper')
const ffmpeg = require('fluent-ffmpeg')
const {
    removeBackgroundFromImageFile
} = require('remove.bg')
const imgbb = require('imgbb-uploader')
const lolis = require('lolis.life')
const loli = new lolis()
const speed = require('performance-now')
/******END OF NPM PACKAGE INPUT******/

/******BEGIN OF JSON INPUT******/
const welkom = JSON.parse(fs.readFileSync('./database/json/welkom.json'))
const nsfw = JSON.parse(fs.readFileSync('./database/json/nsfw.json'))
const samih = JSON.parse(fs.readFileSync('./database/json/simi.json'))
const user = JSON.parse(fs.readFileSync('./database/json/user.json'))
const _leveling = JSON.parse(fs.readFileSync('./database/json/leveling.json'))
const _level = JSON.parse(fs.readFileSync('./database/json/level.json'))
/******END OF JSON INPUT******/

/******BEGIN OF MENU INPUT******/
const {
    help
} = require('./src/help')
const {
    logomaker
} = require('./database/menu/logomaker')
const {
    toinmenu
} = require('./src/toinmenu')
const {
    menuadmin
} = require('./src/menuadmin')
const {
    nsfwmenu
} = require('./src/nsfwmenu')

/******LOAD OF VCARD INPUT******/
const vcard = 'BEGIN:VCARD\n' // metadata of the contact card
    +
    'VERSION:3.0\n' +
    'FN:Filipe🐊\n' // full name
    +
    'ORG:Owner Bot;\n' // the organization of the contact
    +
    'TEL;type=CELL;type=VOICE;waid=5511910725063:+55 (11) 91072-5063\n' // ID do WhatsApp + número de telefone
    +
    'END:VCARD'
/******END OF VCARD INPUT******/

prefix = '*'
blocked = []

/******BEGIN OF FUNCTIONS INPUT******/
const getLevelingXp = (userId) => {
    let position = false
    Object.keys(_level).forEach((i) => {
        if (_level[i].jid === userId) {
            position = i
        }
    })
    if (position !== false) {
        return _level[position].xp
    }
}

const getLevelingLevel = (userId) => {
    let position = false
    Object.keys(_level).forEach((i) => {
        if (_level[i].jid === userId) {
            position = i
        }
    })
    if (position !== false) {
        return _level[position].level
    }
}

const getLevelingId = (userId) => {
    let position = false
    Object.keys(_level).forEach((i) => {
        if (_level[i].jid === userId) {
            position = i
        }
    })
    if (position !== false) {
        return _level[position].jid
    }
}

const addLevelingXp = (userId, amount) => {
    let position = false
    Object.keys(_level).forEach((i) => {
        if (_level[i].jid === userId) {
            position = i
        }
    })
    if (position !== false) {
        _level[position].xp += amount
        fs.writeFileSync('./database/json/level.json', JSON.stringify(_level))
    }
}

const addLevelingLevel = (userId, amount) => {
    let position = false
    Object.keys(_level).forEach((i) => {
        if (_level[i].jid === userId) {
            position = i
        }
    })
    if (position !== false) {
        _level[position].level += amount
        fs.writeFileSync('./database/json/level.json', JSON.stringify(_level))
    }
}

const addLevelingId = (userId) => {
    const obj = {
        jid: userId,
        xp: 1,
        level: 1
    }
    _level.push(obj)
    fs.writeFileSync('./database/json/level.json', JSON.stringify(_level))
}

function kyun(seconds) {
    function pad(s) {
        return (s < 10 ? '0' : '') + s;
    }
    var hours = Math.floor(seconds / (60 * 60));
    var minutes = Math.floor(seconds % (60 * 60) / 60);
    var seconds = Math.floor(seconds % 60);

    //return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds)
    return `${pad(hours)} Jam ${pad(minutes)} Menit ${pad(seconds)} Detik`
}

/* addMetadata - Parâmetros:
 * Package: nome do pacote.
 * Author: nome do autor.
 * inputWebpFile: arquivo de imagen webp para adicionar metadata.
 * outputWebpFile: novo arquivo com metadata inserida.
 * Atenção! Não mude nada nessa function!
 * ----------------------------------------------------------------
 * Conversor exif desenvolvido por LuanRT do TheAndroidWorld.
 * Para mais informações sobre o como o mesmo funciona só entrar em contato.
 */

function addMetadata(packname, author, inputWebpFile, outputWebpFile) {
    //Nome do pacote, id, e autor
    const stickerpackid = "com.theandroidworld.bigbywolf xxxxxxxx-xxxx-hayz-dwdf-rxxxxxxxxxxx"
    const json = {
        "sticker-pack-id": stickerpackid,
        "sticker-pack-name": packname,
        "sticker-pack-publisher": author,
    }

    // Adiciona metadata ao arquivo exif
    const littleEndian = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00])
    const bytes = [0x00, 0x00, 0x16, 0x00, 0x00, 0x00]

    let len = JSON.stringify(json).length
    let last

    if (len > 256) {
        len = len - 256
        bytes.unshift(0x01)
    } else {
        bytes.unshift(0x00)
    }

    if (len < 16) {
        last = len.toString(16)
        last = "0" + len
    } else {
        last = len.toString(16)
    }

    // Depois salvamos o arquivo no disco do servidor.
    const buf2 = Buffer.from(last, "hex")
    const buf3 = Buffer.from(bytes)
    const buf4 = Buffer.from(JSON.stringify(json))

    const buffer = Buffer.concat([littleEndian, buf2, buf3, buf4])

    let name = Math.random().toString(36).substring(7)

    fs.writeFile(`./${name}.exif`, buffer, (err) => {
        if (err) {
            console.log(err)
        } else {
            require('child_process').execSync(`webpmux -set exif ${name}.exif ${inputWebpFile} -o ${outputWebpFile}`);
            fs.unlinkSync(`${name}.exif`);
        }
    });
    return `./${outputWebpFile}`;
}

async function starts() {
    const client = new WAConnection()
    client.logger.level = 'warn'
    console.log(banner.string)
    client.on('qr', () => {
        console.log(color('[', 'white'), color('!', 'red'), color(']', 'white'), color(' escanear o codigo qr acima '))
    })

    fs.existsSync('./Nazwa.json') && client.loadAuthInfo('./Nazwa.json')
    client.on('connecting', () => {
        start('2', 'Connecting...')
    })
    client.on('open', () => {
        success('2', 'Connected')
    })
    await client.connect({
        timeoutMs: 30 * 1000
    })
    fs.writeFileSync('./Nazwa.json', JSON.stringify(client.base64EncodedAuthInfo(), null, '\t'))

    client.on('group-participants-update', async (anu) => {
        if (!welkom.includes(anu.jid)) return
        try {
            const mdata = await client.groupMetadata(anu.jid)
            console.log(anu)
            if (anu.action == 'add') {
                num = anu.participants[0]
                try {
                    ppimg = await client.getProfilePicture(`${anu.participants[0].split('@')[0]}@c.us`)
                } catch {
                    ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
                }
                teks = `Salveee @${num.split('@')[0]}\nBem vindo ao grupo *${mdata.subject}*`
                let buff = await getBuffer(ppimg)
                client.sendMessage(mdata.id, buff, MessageType.image, {
                    caption: teks,
                    contextInfo: {
                        "mentionedJid": [num]
                    }
                })
            } else if (anu.action == 'remove') {
                num = anu.participants[0]
                try {
                    ppimg = await client.getProfilePicture(`${num.split('@')[0]}@c.us`)
                } catch {
                    ppimg = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
                }
                teks = `Saiu mais um FRACO @${num.split('@')[0]}👋`
                let buff = await getBuffer(ppimg)
                client.sendMessage(mdata.id, buff, MessageType.image, {
                    caption: teks,
                    contextInfo: {
                        "mentionedJid": [num]
                    }
                })
            }
        } catch (e) {
            console.log('Error : %s', color(e, 'red'))
        }
    })

    client.on('CB:Blocklist', json => {
        if (blocked.length > 2) return
        for (let i of json[1].blocklist) {
            blocked.push(i.replace('c.us', 's.whatsapp.net'))
        }
    })

    client.on('chat-update', async (mek) => {
        try {
            if (!mek.hasNewMessage) return
            mek = JSON.parse(JSON.stringify(mek)).messages[0]
            if (!mek.message) return
            if (mek.key && mek.key.remoteJid == 'status@broadcast') return
            if (mek.key.fromMe) return
            global.prefix
            global.blocked
            const content = JSON.stringify(mek.message)
            const from = mek.key.remoteJid
            const type = Object.keys(mek.message)[0]
            const {
                text,
                extendedText,
                contact,
                location,
                liveLocation,
                image,
                video,
                sticker,
                document,
                audio,
                product
            } = MessageType
            const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
            const date = moment.tz('Asia/Jakarta').format('DD,MM,YY')
            body = (type === 'conversation' && mek.message.conversation.startsWith(prefix)) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption.startsWith(prefix) ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption.startsWith(prefix) ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text.startsWith(prefix) ? mek.message.extendedTextMessage.text : ''
            budy = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : ''
            const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
            const args = body.trim().split(/ +/).slice(1)
            const isCmd = body.startsWith(prefix)

            mess = {
                wait: 'Aguarde... ▬▬▬▬▭ 𝟫𝟢%.                *(caso não obtenha ,tente novamente)* ',
                success: '✔️ Sucesso ✔️',
                levelon: '❬ ✔ ❭ *habilitar Level*',
                leveloff: ' ❬ X ❭  *desabilitar Level*',
                levelnoton: '❬ X ❭ *level não ativo*',
                levelnol: '*Pqp kskst level* 0 ',
                error: {
                    stick: '[❗] Falha, ocorreu um erro ao converter a imagem em um adesivo ❌',
                    Iv: '❌ Link inválido ❌'
                },
                only: {
                    group: '[❗] Este comando só pode ser usado em grupos!',
                    ownerG: '[❗] Este comando só pode ser usado pelo grupo proprietário!',
                    ownerB: '[❗] Apenas o Dono 𝑭𝒊𝒍𝒊𝒑𝒆🐊ᴼᴿᴵᴳᴵᴺᴬᴸ⁩ pode usar esse comando!',
                    admin: '[❗] *Iae membro comum KKK* Você não é ADM pra usar esse comando!',
                    Badmin: '[❗] Para usar esse comando dê ADM ao Bot',
                    daftarB: `── 「REGISTRE-SE」 ──\nIae mano \nVocê não está registrado, para se registrar digite \n\nComando : ${prefix}daftar nome|idade\nExemplo : ${prefix}daftar Filipe|18`,
                }
            }
            const apakah = ['Ya', 'Tidak']
            const bisakah = ['Bisa', 'Tidak Bisa']
            const kapankah = ['Hari Lagi', 'Minggu Lagi', 'Bulan Lagi', 'Tahun Lagi']
            const botNumber = client.user.jid
            const ownerNumber = ["5511910725063@s.whatsapp.net"] // replace this with your number
            const nomorOwner = [ownerNumber]
            const isGroup = from.endsWith('@g.us')
            const totalchat = await client.chats.all()
            const sender = isGroup ? mek.participant : mek.key.remoteJid
            const groupMetadata = isGroup ? await client.groupMetadata(from) : ''
            const groupName = isGroup ? groupMetadata.subject : ''
            const groupId = isGroup ? groupMetadata.jid : ''
            const groupMembers = isGroup ? groupMetadata.participants : ''
            const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
            const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
            const isGroupAdmins = groupAdmins.includes(sender) || false
            const isWelkom = isGroup ? welkom.includes(from) : false
            const isNsfw = isGroup ? nsfw.includes(from) : false
            const isSimi = isGroup ? samih.includes(from) : false
            const isOwner = ownerNumber.includes(sender)
            const isUser = user.includes(sender)
            const isLevelingOn = isGroup ? _leveling.includes(groupId) : false
            const NomerOwner = '5511910725063@s.whatsapp.net'
            /******ApiKey Input******/
            const BarBarKey = 'YOUR_APIKEY'
            /******End of ApiKey Input******/

            const isUrl = (url) => {
                return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
            }
            const reply = (teks) => {
                client.sendMessage(from, teks, text, {
                    quoted: mek
                })
            }
            const sendMess = (hehe, teks) => {
                client.sendMessage(hehe, teks, text)
            }
            const mentions = (teks, memberr, id) => {
                (id == null || id == undefined || id == false) ? client.sendMessage(from, teks.trim(), extendedText, {
                    contextInfo: {
                        "mentionedJid": memberr
                    }
                }): client.sendMessage(from, teks.trim(), extendedText, {
                    quoted: mek,
                    contextInfo: {
                        "mentionedJid": memberr
                    }
                })
            }

            /* sendAsSticker - Parâmetros:
             * Media: arquivo a ser convertido com novos metadados para figurinha
             * tempFile: arquivo temporário criado logo após a adição de metadados,
             * ele será automaticamente deletado assim que o sticker for enviado.
             * --------------------------------------------------------------------
             * Conversor exif desenvolvido por LuanRT do TheAndroidWorld.
             * Para mais informações sobre o como o mesmo funciona só entrar em contato 
             * E-mail: contato@blogdosmanos.dnsabr.com
             * E-mail Secundário: luanandmaiconchannel@gmail.com
             */
            const sendAsSticker = (media, tempFile) => {
                // Criamos um arquivo temporário pra guardar os metadados.
                tempWebpFile1 = `${Math.floor(Math.random() * 10000)}.webp`;

                // Depois convertemos para formato webp com o ffmpeg e a biblioteca libwebp.
                exec(`ffmpeg -i ${media} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${tempFile}`, (error, stdout, stderr) => {
                    try {
                        /* 
                         * Ai depois de tudo isso chamamos a nossa function addMetadata para adicionar os 
                         * metadados a figurinha!
                         */
                        const webpWithMetadata = addMetadata('𝑭𝒊𝒍𝒊𝒑𝒆🐊ᴼᴿᴵᴳᴵᴺᴬᴸ', '+55 (11) 91072-5063', tempFile, tempWebpFile1);

                        /*
                         * Com isso adicionamos um timer de 6 milisegundos para dar tempo de tudo ser processado!
                         */
                        setTimeout(async () => {
                            let buffer = fs.readFileSync(webpWithMetadata);
                            client.sendMessage(from, buffer, MessageType.sticker, {
                                quoted: mek
                            });

                            /*
                             * Agora que tudo já foi convertido e a figurinha já foi enviada
                             * apagamos todos os arquivos temporários.
                             */
                            fs.unlinkSync(webpWithMetadata);
                            fs.unlinkSync(tempFile);
                        }, 600);
                    } catch (err) {
                        // Caso algo dê errado né.
                        console.log(`Erro: ${err}`);
                    }
                });
            }

            //function leveling
            if (isGroup && isLevelingOn) {
                const currentLevel = getLevelingLevel(sender)
                const checkId = getLevelingId(sender)
                try {
                    if (currentLevel === undefined && checkId === undefined) addLevelingId(sender)
                    const amountXp = Math.floor(Math.random() * 10) + 500
                    const requiredXp = 5000 * (Math.pow(2, currentLevel) - 1)
                    const getLevel = getLevelingLevel(sender)
                    addLevelingXp(sender, amountXp)
                    if (requiredXp <= getLevelingXp(sender)) {
                        addLevelingLevel(sender, 1)
                        await reply(`*「 LEVEL UP 」*\n\n➸ *Nome*: ${sender}\n➸ *XP*: ${getLevelingXp(sender)}\n➸ *Level*: ${getLevel} -> ${getLevelingLevel(sender)}\n\nParabéns!! 🎉🎉`)
                    }
                } catch (err) {
                    console.error(err)
                }
            }

            colors = ['red', 'white', 'black', 'blue', 'yellow', 'green']
            const isMedia = (type === 'imageMessage' || type === 'videoMessage')
            const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
            const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
            const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
            if (!isGroup && isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
            if (!isGroup && !isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
            if (isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
            if (!isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))

            /******END OF FUNCTIONS INPUT******/
            switch (command) {
                case 'help':
                case 'menu':
                    client.sendMessage(from, help(prefix), text)
                    break
                case 'timer':
                    if (args[1] == "detik") {
                        var timer = args[0] + "000"
                    } else if (args[1] == "menit") {
                        var timer = args[0] + "0000"
                    } else if (args[1] == "jam") {
                        var timer = args[0] + "00000"
                    } else {
                        return reply("*pilih:*\ndetik\nmenit\njam")
                    }
                    setTimeout(() => {
                        reply("Waktu habis")
                    }, timer)
                    break
                case 'bahasa':
                    client.sendMessage(from, bahasa(prefix, sender), text, {
                        quoted: mek
                    })
                    break
                case 'toinmenu':
                    client.sendMessage(from, toinmenu(prefix, sender), text, {
                        quoted: mek
                    })
                    break
                case 'menuadmin':
                    client.sendMessage(from, menuadmin(prefix, sender), text, {
                        quoted: mek
                    })
                    break
                case 'nsfwmenu':
                    client.sendMessage(from, nsfwmenu(prefix, sender), text, {
                        quoted: mek
                    })
                    break
                case 'virtex':
                    client.sendMessage(from, virtex(prefix, sender), text, {
                        quoted: mek
                    })
                    break
                case 'kodenegara':
                    client.sendMessage(from, negara(prefix, sender), text, {
                        quoted: mek
                    })
                    break
                case 'demote':
                    if (!isGroup) return reply(mess.only.group)
                    if (!isGroupAdmins) return reply(mess.only.admin)
                    if (!isBotGroupAdmins) return reply(mess.only.Badmin)
                    if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('𝐓𝐚𝐠 𝐭𝐚𝐫𝐠𝐞𝐭 𝐲𝐚𝐧𝐠 𝐦𝐚𝐮 𝐝𝐢 𝐭𝐮𝐫𝐮𝐧𝐤𝐚𝐧 𝐚𝐝𝐦𝐢𝐧')
                    mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
                    if (mentioned.length > 1) {
                        teks = ''
                        for (let _ of mentioned) {
                            teks += `Pedido recebido, removido da posição de administrador :\n`
                            teks += `@_.split('@')[0]`
                        }
                        mentions(teks, mentioned, true)
                        client.groupDemoteAdmin(from, mentioned)
                    } else {
                        mentions(`Pedido recebido, removido da posição de administrador @${mentioned[0].split('@')[0]}\n*${groupMetadata.subject}*_`, mentioned, true)
                        client.groupDemoteAdmin(from, mentioned)
                    }
                    break
                case 'randomhentai':
                    gatauda = body.slice(6)
                    if (!isUser) return reply(mess.only.daftarB)
                    reply(mess.wait)
                    anu = await fetchJson(`https://tobz-api.herokuapp.com/api/hentai?apikey=BotWeA`, {
                        method: 'get'
                    })
                    buffer = await getBuffer(anu.result)
                    client.sendMessage(from, buffer, image, {
                        quoted: mek
                    })
                    break
                case 'loli':
                    gatauda = body.slice(6)
                    if (!isUser) return reply(mess.only.daftarB)
                    reply(mess.wait)
                    anu = await fetchJson(`https://tobz-api.herokuapp.com/api/randomloli?apikey=BotWeA`, {
                        method: 'get'
                    })
                    buffer = await getBuffer(anu.result)
                    client.sendMessage(from, buffer, image, {
                        quoted: mek
                    })
                    break
                case 'promote':
                    client.updatePresence(from, Presence.composing)
                    if (!isUser) return reply(mess.only.daftarB)
                    if (!isGroup) return reply(mess.only.group)
                    if (!isGroupAdmins) return reply(mess.only.admin)
                    if (!isBotGroupAdmins) return reply(mess.only.Badmin)
                    if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('A tag alvo que você deseja promover!')
                    mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
                    if (mentioned.length > 1) {
                        teks = 'Pedido recebido, adicionando posição como administrador :\n'
                        for (let _ of mentioned) {
                            teks += `@${_.split('@')[0]}\n`
                        }
                        mentions(teks, mentioned, true)
                        client.groupMakeAdmin(from, mentioned)
                    } else {
                        mentions(`Pedido recebido, adicionando posição como administrador : @${mentioned[0].split('@')[0]}`, mentioned, true)
                        client.groupMakeAdmin(from, mentioned)
                    }
                    break
                case 'wa.me':
                case 'wame':
                    client.updatePresence(from, Presence.composing)
                    options = {
                        text: `「 *SELF WHATSAPP* 」\n\n_Solicitado por_ : *@${sender.split("@s.whatsapp.net")[0]}\n\nSeu link Whatsapp : *https://wa.me/${sender.split("@s.whatsapp.net")[0]}*\n*Or ( / )*\n*https://api.whatsapp.com/send?phone=${sender.split("@")[0]}*`,
                        contextInfo: {
                            mentionedJid: [sender]
                        }
                    }
                    client.sendMessage(from, options, text, {
                        quoted: mek
                    })
                    break
                    if (data.error) return reply(data.error)
                    reply(data.result)
                    break
                case 'quotes':
                    client.updatePresence(from, Presence.composing)
                    if (!isUser) return reply(mess.only.daftarB)
                    data = await fetchJson(`http://mhankbarbars.herokuapp.com/api/randomquotes`)
                    ez = `*➸ Author :* ${data.author}\n*➸ Quotes :* ${data.quotes}`
                    reply(ez)
                    break
                case '3dtext':
                    data = await await getBuffer(`https://docs-jojo.herokuapp.com/api/text3d?text=${body.slice(8)}`)
                    if (!isUser) return reply(mess.only.daftarB)
                    client.sendMessage(from, data, image, {
                        quoted: mek,
                        caption: body.slice(8)
                    })
                    break
                case 'fml':
                    data = await fetchJson(`https://docs-jojo.herokuapp.com/api/fml`)
                    if (!isUser) return reply(mess.only.daftarB)
                    hasil = data.result.fml
                    reply(hasil)
                    break
                case 'owner':
                case 'creator':
                    client.sendMessage(from, {
                        displayname: "Jeff",
                        vcard: vcard
                    }, MessageType.contact, {
                        quoted: mek
                    })
                    client.sendMessage(from, 'Aqui está o número do meu dono, salve depois', MessageType.text, {
                        quoted: mek
                    })
                    break
                case 'hidetag':
                    client.updatePresence(from, Presence.composing)
                    if (!isUser) return reply(mess.only.daftarB)
                    if (!isGroup) return reply(mess.only.group)
                    teks = body.slice(9)
                    group = await client.groupMetadata(from);
                    member = group['participants']
                    jids = [];
                    member.map(async adm => {
                        jids.push(adm.id.replace('c.us', 's.whatsapp.net'));
                    })
                    options = {
                        text: teks,
                        contextInfo: {
                            mentionedJid: jids
                        },
                        quoted: mek
                    }
                    await client.sendMessage(from, options, text)
                    break
                case 'tiktokstalk':
                    try {
                        if (args.length < 1) return client.sendMessage(from, 'Nome? ', text, {
                            quoted: mek
                        })
                        if (!isUser) return reply(mess.only.daftarB)
                        let {
                            user,
                            stats
                        } = await tiktod.getUserProfileInfo(args[0])
                        reply(mess.wait)
                        teks = `*ID* : ${user.id}\n*Nome do usuário* : ${user.uniqueId}\n*Apelido* : ${user.nickname}\n*Followers* : ${stats.followerCount}\n*Followings* : ${stats.followingCount}\n*Posts* : ${stats.videoCount}\n*Luv* : ${stats.heart}\n`
                        buffer = await getBuffer(user.avatarLarger)
                        client.sendMessage(from, buffer, image, {
                            quoted: mek,
                            caption: teks
                        })
                    } catch (e) {
                        console.log(`Error :`, color(e, 'red'))
                        reply('username tidak valid')
                    }
                    break
                case 'snowwrite':
                    var gh = body.slice(11)
                    var gbl7 = gh.split("|")[0];
                    var gbl8 = gh.split("|")[1];
                    if (args.length < 1) return reply(`Enviar pedidos ${prefix}snowwrite texto1|texto2, exemplo ${prefix}snowwrite Filipe|BOT`)
                    if (!isUser) return reply(mess.only.daftarB)
                    reply(mess.wait)
                    anu = await fetchJson(`https://zeksapi.herokuapp.com/api/snowwrite?text1=${gbl7}&text2=${gbl8}&apikey=apivinz`, {
                        method: 'get'
                    })
                    buffer = await getBuffer(anu.result)
                    client.sendMessage(from, buffer, image, {
                        quoted: mek
                    })
                    break
                case 'marvellogo':
                    var gh = body.slice(12)
                    if (args.length < 1) return reply(`Enviar pedidos ${prefix}marvellogo texto, por exemplo ${prefix}marvellogo Filipe BOT`)
                    if (!isUser) return reply(mess.only.daftarB)
                    reply(mess.wait)
                    anu = await fetchJson(`https://tobz-api.herokuapp.com/api/textpro?theme=snow&text=${gh}&apikey=BotWeA`, {
                        method: 'get'
                    })
                    buffer = await getBuffer(anu.result)
                    client.sendMessage(from, buffer, image, {
                        quoted: mek
                    })
                    break

                case 'artinama':
                    client.updatePresence(from, Presence.composing)
                    if (!isUser) return reply(mess.only.daftarB)
                    data = await fetchJson(`https://arugaz.my.id/api/artinama?nama=${body.slice(10)}`)
                    reply(data.result)
                    break
                case 'infonomor':
                    client.updatePresence(from, Presence.composing)
                    if (!isUser) return reply(mess.only.daftarB)
                    if (args.length < 1) return reply(`Insira numeros\nExemplo : ${prefix}infonomor 556299663...`)
                    data = await fetchJson(`https://docs-jojo.herokuapp.com/api/infonomor?no=${body.slice(11)}`)
                    if (data.error) return reply(data.error)
                    if (data.result) return reply(data.result)
                    hasil = `╠➥ internasional : ${data.international}\n╠➥ nomor : ${data.nomor}\n╠➥ operator : ${data.op}`
                    reply(hasil)
                    break
                case 'spamcall':
                    client.updatePresence(from, Presence.composing)
                    if (!isUser) return reply(mess.only.daftarB)
                    if (args.length < 1) return reply(`Insira numeros\nExemplo : ${prefix}spamcall 556299663...`)
                    data = await fetchJson(`https://arugaz.my.id/api/spamcall?no=${body.slice(10)}`)
                    if (data.msg) return reply(data.msg)
                    hasil = data.logs
                    reply(hasil)
                    break
                case 'map':
                    data = await fetchJson(`https://mnazria.herokuapp.com/api/maps?search=${body.slice(5)}`)
                    if (!isUser) return reply(mess.only.daftarB)
                    hasil = await getBuffer(data.gambar)
                    client.sendMessage(from, hasil, image, {
                        quoted: mek,
                        caption: `Hasil Dari *${body.slice(5)}*`
                    })
                    break
                case 'covidcountry':
                    client.updatePresence(from, Presence.composing)
                    if (!isUser) return reply(mess.only.daftarB)
                    data = await fetchJson(`https://arugaz.my.id/api/corona?country=${body.slice(7)}`)
                    if (data.result) reply(data.result)
                    hasil = `Negara : ${data.result.country}\n\nActive : ${data.result.active}\ncasesPerOneMillion : ${data.result.casesPerOneMillion}\ncritical : ${data.result.critical}\ndeathsPerOneMillion : ${data.result.deathsPerOneMillion}\nrecovered : ${data.result.recovered}\ntestPerOneMillion : ${data.result.testPerOneMillion}\ntodayCases : ${data.result.todayCases}\ntodayDeath : ${data.result.todayDeath}\ntotalCases : ${data.result.totalCases}\ntotalTest : ${data.result.totalTest}`
                    reply(hasil)
                    break
                case 'wiki':
                    if (args.length < 1) return reply('digite palavras-chave')
                    tels = body.slice(6)
                    if (!isUser) return reply(mess.only.daftarB)
                    anu = await fetchJson(`https://tobz-api.herokuapp.com/api/wiki?q=${tels}&apikey=BotWeA`, {
                        method: 'get'
                    })
                    reply(anu.result)
                    break
                case 'wikien':
                    if (args.length < 1) return reply('digite palavras-chave')
                    tels = body.slice(8)
                    if (!isUser) return reply(mess.only.daftarB)
                    anu = await fetchJson(`https://arugaz.my.id/api/wikien?q=${tels}`, {
                        method: 'get'
                    })
                    reply(anu.result)
                    break
                case 'ytmp3':
                    if (args.length < 1) return reply('Onde está o url, hum?')
                    if (!isUrl(args[0]) && !args[0].includes('youtu')) return reply(mess.error.Iv)
                    anu = await fetchJson(`https://mhankbarbar.tech/api/yta?url=${args[0]}&apiKey=${BarBarKey}`, {
                        method: 'get'
                    })
                    if (anu.error) return reply(anu.error)
                    teks = `❏ *Title* : ${anu.title}\n❏ *Filesize* : ${anu.filesize}\n\nTunggu Bentar Ya Kak, Audionya Lagi Di Kirim...`
                    thumb = await getBuffer(anu.thumb)
                    client.sendMessage(from, thumb, image, {
                        quoted: mek,
                        caption: teks
                    })
                    buffer = await getBuffer(anu.result)
                    client.sendMessage(from, buffer, audio, {
                        mimetype: 'audio/mp4',
                        filename: `${anu.title}.mp3`,
                        quoted: mek
                    })
                    break
                case 'ytmp4':
                    if (args.length < 1) return reply('Onde está o url, hum?')
                    if (!isUrl(args[0]) && !args[0].includes('youtu')) return reply(mess.error.Iv)
                    anu = await fetchJson(`https://st4rz.herokuapp.com/api/ytv2?url=${args[0]}`, {
                        method: 'get'
                    })
                    if (anu.error) return reply(anu.error)
                    teks = `*❏ Title* : ${anu.title}\n\n*VIDEO SEDANG DIKIRIMKAN, JANGAN SPAM YA SAYANG*`
                    thumb = await getBuffer(anu.thumb)
                    client.sendMessage(from, thumb, image, {
                        quoted: mek,
                        caption: teks
                    })
                    buffer = await getBuffer(anu.result)
                    client.sendMessage(from, buffer, video, {
                        mimetype: 'video/mp4',
                        filename: `${anu.title}.mp4`,
                        quoted: mek
                    })
                    break
                case 'trendtwit':
                    client.updatePresence(from, Presence.composing)
                    if (!isUser) return reply(mess.only.daftarB)
                    data = await fetchJson(`https://docs-jojo.herokuapp.com/api/trendingtwitter`, {
                        method: 'get'
                    })
                    teks = '=================\n'
                    for (let i of data.result) {
                        teks += `*Hastag* : ${i.hastag}\n*link* : ${i.link}\n*rank* : ${i.rank}\n*Tweet* : ${i.tweet}\n=================\n`
                    }
                    reply(teks.trim())
                    break
                case 'testime':
                    setTimeout(() => {
                        client.sendMessage(from, 'Waktu habis:v', text) // ur cods
                    }, 10000) // 1000 = 1s,
                    setTimeout(() => {
                        client.sendMessage(from, '5 Detik lagi', text) // ur cods
                    }, 5000) // 1000 = 1s,
                    setTimeout(() => {
                        client.sendMessage(from, '10 Detik lagi', text) // ur cods
                    }, 0) // 1000 = 1s,
                    break
                case 'semoji':
                    if (args.length < 1) return reply('Emoji?')
                    if (!isUser) return reply(mess.only.daftarB)
                    ranp = getRandom('.png')
                    rano = getRandom('.webp')
                    teks = body.slice(8).trim()
                    anu = await fetchJson(`https://mhankbarbars.herokuapp.com/api/emoji2png?emoji=${teks}&apikey=${BarBarKey}`, {
                        method: 'get'
                    })
                    if (anu.error) return reply(anu.error)
                    exec(`wget ${anu.result} -O ${ranp} && ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${rano}`, (err) => {
                        fs.unlinkSync(ranp)
                        if (err) return reply(mess.error.stick)
                        buffer = fs.readFileSync(rano)
                        client.sendMessage(from, buffer, sticker)
                        fs.unlinkSync(rano)
                    })
                    break
                case 'nulis':
                case 'tulis':
                    if (args.length < 1) return reply('Eu disse para você escrever, eeeeeeeeeh?')
                    if (!isUser) return reply(mess.only.daftarB)
                    teks = body.slice(7)
                    reply(mess.wait)
                    anu = await fetchJson(`https://tobz-api.herokuapp.com/api/nulis?text=${teks}&apikey=BotWeA`, {
                        method: 'get'
                    })
                    if (anu.error) return reply(anu.error)
                    buff = await getBuffer(anu.result)
                    client.sendMessage(from, buff, image, {
                        quoted: mek,
                        caption: mess.success
                    })
                    break
                case 'kbbi':
                    client.updatePresence(from, Presence.composing)
                    if (args.length < 1) return reply(`Digite as perguntas\Exemploh : ${prefix}kbbi oi`)
                    tels = body.slice(6)
                    data = await fetchJson(`https://tobz-api.herokuapp.com/api/kbbi?kata=${tels}&apikey=BotWeA`)
                    if (data.error) return reply(data.error)
                    hasil = `${data.result}`
                    reply(hasil)
                    break
                case 'joox':
                    tels = body.slice(6)
                    data = await fetchJson(`https://tobz-api.herokuapp.com/api/joox?q=${tels}&apikey=BotWeA`, {
                        method: 'get'
                    })
                    if (!isUser) return reply(mess.only.daftarB)
                    if (data.error) return reply(data.error)
                    infomp3 = `*Lagu Ditemukan!!!*\nJudul : ${data.result.judul}\nAlbum : ${data.result.album}\nDipublikasi : ${data.result.dipublikasi}`
                    buffer = await getBuffer(data.result.thumb)
                    lagu = await getBuffer(data.result.mp3)
                    client.sendMessage(from, buffer, image, {
                        quoted: mek,
                        caption: infomp3
                    })
                    client.sendMessage(from, lagu, audio, {
                        mimetype: 'audio/mp4',
                        filename: `${data.result.title}.mp3`,
                        quoted: mek
                    })
                    break
                case 'info':
                    me = client.user
                    uptime = process.uptime()
                    teks = `*Nama bot* : ${me.name}\n*Número do bot* : @${me.jid.split('@')[0]}\n*Prefix* : ${prefix}\n*Contato de bloqueio total* : ${blocked.length}\n*O bot está ativo em* : ${kyun(uptime)}\n*Bate Papo Total* : ${totalchat.length}`
                    buffer = await getBuffer(me.imgUrl)
                    client.sendMessage(from, buffer, image, {
                        caption: teks,
                        contextInfo: {
                            mentionedJid: [me.jid]
                        }
                    })
                    break
                case 'blocklist':
                    teks = 'This is list of blocked number :\n'
                    for (let block of blocked) {
                        teks += `~> @${block.split('@')[0]}\n`
                    }
                    teks += `Total : ${blocked.length}`
                    client.sendMessage(from, teks.trim(), extendedText, {
                        quoted: mek,
                        contextInfo: {
                            "mentionedJid": blocked
                        }
                    })
                    break
                case 'chatlist':
                    client.updatePresence(from, Presence.composing)
                    teks = 'This is list of chat number :\n'
                    for (let all of totalchat) {
                        teks += `~> @${all}\n`
                    }
                    teks += `Total : ${totalchat.length}`
                    client.sendMessage(from, teks.trim(), extendedText, {
                        quoted: mek,
                        contextInfo: {
                            "mentionedJid": totalchat
                        }
                    })
                    break
                case 'animecry':
                    ranp = getRandom('.gif')
                    rano = getRandom('.webp')
                    anu = await fetchJson('https://tobz-api.herokuapp.com/api/cry&apikey=BotWeA', {
                        method: 'get'
                    })
                    if (!isUser) return reply(mess.only.daftarB)
                    if (anu.error) return reply(anu.error)
                    exec(`wget ${anu.result} -O ${ranp} && ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=15 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${rano}`, (err) => {
                        fs.unlinkSync(ranp)
                        if (err) return reply(mess.error.stick)
                        buffer = fs.readFileSync(rano)
                        client.sendMessage(from, buffer, sticker, {
                            quoted: mek
                        })
                        fs.unlinkSync(rano)
                    })
                    break
                case 'neonime':
                    client.updatePresence(from, Presence.composing)
                    data = await fetchJson(`https://docs-jojo.herokuapp.com/api/neonime_lastest`, {
                        method: 'get'
                    })
                    if (!isUser) return reply(mess.only.daftarB)
                    teks = '################\n'
                    for (let i of data.result) {
                        teks += `*Title* : ${i.judul}\n*link* : ${i.link}\n*rilis* : ${i.rilis}\n###############\n`
                    }
                    reply(teks.trim())
                    break
                case 'bpink':

                    if (args.length < 1) return reply(`Texto de entrada \nExemplo : ${prefix}Caliph Bot`)
                    data = await getBuffer(`https://docs-jojo.herokuapp.com/api/blackpink?text=${body.slice(7)}`)
                    if (!iUser) return reply(mess.only.daftarB)
                    client.sendMessage(from, data, image, {
                        quoted: mek,
                        caption: body.slice(7)
                    })
                    break
                case 'tts':
                    client.updatePresence(from, Presence.recording)
                    if (args.length < 1) return client.sendMessage(from, 'Qual é o código da linguagem?', text, {
                        quoted: mek
                    })
                    if (!isUser) return reply(mess.only.daftarB)
                    const gtts = require('./lib/gtts')(args[0])
                    if (args.length < 2) return client.sendMessage(from, 'Cadê o texto', text, {
                        quoted: mek
                    })
                    dtt = body.slice(8)
                    ranm = getRandom('.mp3')
                    rano = getRandom('.ogg')
                    dtt.length > 600 ?
                        reply('Textnya kebanyakan om') :
                        gtts.save(ranm, dtt, function() {
                            exec(`ffmpeg -i ${ranm} -ar 48000 -vn -c:a libopus ${rano}`, (err) => {
                                fs.unlinkSync(ranm)
                                buff = fs.readFileSync(rano)
                                if (err) return reply('Gagal om:(')
                                client.sendMessage(from, buff, audio, {
                                    quoted: mek,
                                    ptt: true
                                })
                                fs.unlinkSync(rano)
                            })
                        })
                    break
                case 'listadmins':
                case 'adminlist':
                    client.updatePresence(from, Presence.composing)
                    if (!isUser) return reply(mess.only.daftarB)
                    if (!isGroup) return reply(mess.only.group)
                    teks = `Lista admin do grupo*${groupMetadata.subject}*\nTotal : ${groupAdmins.length}\n\n`
                    no = 0
                    for (let admon of groupAdmins) {
                        no += 1
                        teks += `[${no.toString()}] @${admon.split('@')[0]}\n`
                    }
                    mentions(teks, groupAdmins, true)
                    break
                case 'pokemon':
                    client.updatePresence(from, Presence.composing)
                    data = await fetchJson(`https://api.fdci.se/rep.php?gambar=pokemon`, {
                        method: 'get'
                    })
                    if (!isUser) return reply(mess.only.daftarB)
                    reply(mess.wait)
                    n = JSON.parse(JSON.stringify(data));
                    nimek = n[Math.floor(Math.random() * n.length)];
                    pok = await getBuffer(nimek)
                    client.sendMessage(from, pok, image, {
                        quoted: mek
                    })
                    break
                case 'images':
                    tels = body.slice(11)
                    client.updatePresence(from, Presence.composing)
                    data = await fetchJson(`https://api.fdci.se/rep.php?gambar=${tels}`, {
                        method: 'get'
                    })
                    if (!isUser) return reply(mess.only.daftarB)
                    reply(mess.wait)
                    n = JSON.parse(JSON.stringify(data));
                    nimek = n[Math.floor(Math.random() * n.length)];
                    pok = await getBuffer(nimek)
                    client.sendMessage(from, pok, image, {
                        quoted: mek,
                        caption: `*PINTEREST*\n\*Hasil Pencarian* : *${tels}*`
                    })
                    break
                case 'setprefix':
                    client.updatePresence(from, Presence.composing)
                    if (args.length < 1) return
                    if (!isOwner) return reply(mess.only.ownerB)
                    prefix = args[0]
                    reply(`O prefix foi alterado com sucesso para : ${prefix}`)
