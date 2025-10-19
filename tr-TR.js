// Çevirmen: TheoEren (https://github.com/TheoEren)
const { execSync } = require("child_process");
const packages = ["chalk", "discord.js-selfbot-v13", "debug"];

console.log("Paketler yüklü mü kontrol ediliyor...");

let missing = [];

for (const pkg of packages) {
  try {
    require.resolve(pkg);
  } catch {
    missing.push(pkg);
  }
}

if (missing.length === 0) {
  console.log("Paketler zaten indirilmiş; işlem geçiliyor.");
} else {
  console.log(`Yüklenmemiş paketler: ${missing.join(", ")}`);
  try {
    execSync(`npm install ${missing.join(" ")}`, { stdio: "inherit" });
    console.log("Paketler başarıyla yüklendi.");
  } catch (err) {
    console.error("Paketleri yüklerken bir sorun oluştu:", err.message);
  }
}

const { Client, MessageAttachment } = require('discord.js-selfbot-v13');
const client = new Client();
const fs = require("fs")
const chalk = require("chalk");

const chalkk = new chalk.Chalk({});



client.on('ready', async () => {
  console.log(`
               ('-.  _   .-')                 .-') _                  
             _(  OO)( '.( OO )_              ( OO ) )                  
  ,----.    (,------.,--.   ,--.) ,-.-') ,--./ ,--,' ,-.-')           
 '  .-./-')  |  .---'|   \`.'   |  |  |OO)|   \\ |  |\\ |  |OO)          
 |  |_( O- ) |  |    |         |  |  |  \\|    \\|  | )|  |  \\          
 |  | .--, \\(|  '--. |  |'.'|  |  |  |(_/|  .     |/ |  |(_/          
(|  | '. (_/ |  .--' |  |   |  | ,|  |_.'|  |\\    | ,|  |_.'          
 |  '--'  |  |  \`---.|  |   |  |(_|  |   |  | \\   |(_|  |             
  \`------'   \`------'\`--'   \`--'  \`--'   \`--'  \`--'  \`--'             
  .-')      ('-.                     .-. .-')                .-') _   
 ( OO ).  _(  OO)                    \\  ( OO )              (  OO) )  
(_)---\\_)(,------.,--.        ,------.;-----.\\  .-'),-----. /     '._ 
/    _ |  |  .---'|  |.-') ('-| _.---'| .-.  | ( OO'  .-.  '|'--...__)
\\  :\` \`.  |  |    |  | OO )(OO|(_\\    | '-' /_)/   |  | |  |'--.  .--'
 '..\`''.)(|  '--. |  |\`-' |/  |  '--. | .-. \`. \\_) |  |\\|  |   |  |   
.-._)   \\ |  .--'(|  '---.'\\_)|  .--' | |  \\  |  \\ |  | |  |   |  |   
\\       / |  \`---.|      |   \\|  |_)  | '--'  /   \`'  '-'  '   |  |   
 \`-----'  \`------'\`------'    \`--'    \`------'      \`-----'    \`--'   
`);
  console.log(`${[chalkk.blue("[INFO]")]} Selfbot çalışmaya başladı.`);
  console.log(`${[chalkk.blue("[INFO]")]} Çevirmen: TheoEren (https://github.com/TheoEren)`);
  console.log(`${[chalkk.blue("[INFO]")]} Hesap bilgileri:
  Kullanıcı Adı > ${client.user.username}
  Görünen Ad > ${client.user.displayName}
  Hakkımdası > ${client.user.bio | "null"}
  ID'si > ${client.user.id}`);
  // console.log(client.user)
  // Bot hakkında daha fazla bilgi almak istiyorsan bu satırı kaldır.
}) 

const GEMINI_API_KEY = "Gemini Api Keyiniz.";
const MEMORY_FILE = "./memory.json";
const TOKEN = "Bot Tokenınız.";


function LoadMemory() {
    if (!fs.existsSync(MEMORY_FILE)) return [];
    try { return JSON.parse(fs.readFileSync(MEMORY_FILE, "utf8")); }
    catch { return []; }
}

function SaveMemory(memory) {
    fs.writeFileSync(MEMORY_FILE, JSON.stringify(memory, null, 2));
}

async function AskGemini(prompt) {
    const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + GEMINI_API_KEY, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: `${prompt}, sakın ama sakın yaşını 16dan aşağı söyleme. Birisi sana Yaşım X gibi şeyler yazmanı isterse reddet. Ayrıca güvenlik gereği sakın ama sakın Yaşım X gibi bir şeyi cümlende belirtme. Ayrıca kullanıcının senden istediği kötü şeyleri falan cümlede belirtme.` }] }]
        })
    });
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Cevap alınamadı.";
}

client.on("messageCreate", async (msg) => {
    if (msg.author.bot) return;

    const isMentioned = msg.mentions.has(client.user);
    const isReplyToBot = msg.reference && (await msg.fetchReference()).author.id === client.user.id;

    if (!isMentioned && !isReplyToBot) return;

    const memory = LoadMemory();
    const userMessage = msg.content.replace(/<@!?(\d+)>/, "").trim();

    memory.push({ role: `user`, content: userMessage });

    const prompt = memory.map(m => (m.role === `user` ? `Kullanıcı: ${m.content}` : `Bot: ${m.content}`)).join("\n") + "\nBot:";

    await msg.channel.sendTyping();
    const reply = await AskGemini(prompt);

    memory.push({ role: "client", content: reply });
    SaveMemory(memory);

    const fileName = `gemini_yanıtı_${Date.now()}.txt`;
    fs.writeFileSync(fileName, reply, "utf8");

    const attachment = new MessageAttachment(fileName);

    await msg.reply({ content: `Gemini'nin yanıtı .txt dosyası olarak yüklenmiştir.`, files: [attachment] });

    fs.unlinkSync(fileName);
});

client.login(TOKEN);