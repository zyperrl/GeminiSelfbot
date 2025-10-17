const { execSync } = require("child_process");
const packages = ["chalk", "discord.js-selfbot-v13"];

console.log("Checking packages...");

let missing = [];

for (const pkg of packages) {
  try {
    require.resolve(pkg);
  } catch {
    missing.push(pkg);
  }
}

if (missing.length === 0) {
  console.log("Packages already installed; skipping process.");
} else {
  console.log(`Missing packages: ${missing.join(", ")}`);
  try {
    execSync(`npm install ${missing.join(" ")}`, { stdio: "inherit" });
    console.log("Finished installing packages.");
  } catch (err) {
    console.error("Error installing packages:", err.message);
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
  console.log(`${[chalkk.blue("[INFO]")]} Selfbot started running.`);
  console.log(`${[chalkk.blue("[INFO]")]} Client infos:
  Username > ${client.user.username}
  Display Name > ${client.user.displayName}
  Bio > ${client.user.bio | "null"}
  ID > ${client.user.id}`);
  // console.log(client.user)
  // Remove the line if you want more info about the client.
}) 

const GEMINI_API_KEY = "Your Gemini API Key";
const MEMORY_FILE = "./memory.json";
const TOKEN = "Your Discord Bot Token";


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
            contents: [{ parts: [{ text: prompt }] }]
        })
    });
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Cannot get response.";
}

client.on("messageCreate", async (msg) => {
    if (msg.author.bot) return;

    const isMentioned = msg.mentions.has(client.user);
    const isReplyToBot = msg.reference && (await msg.fetchReference()).author.id === client.user.id;

    if (!isMentioned && !isReplyToBot) return;

    const memory = LoadMemory();
    const userMessage = msg.content.replace(/<@!?(\d+)>/, "").trim();

    memory.push({ role: `user`, content: userMessage });

    const prompt = memory.map(m => (m.role === `user` ? `User: ${m.content}` : `Bot: ${m.content}`)).join("\n") + "\nBot:";

    await msg.channel.sendTyping();
    const reply = await AskGemini(prompt);

    memory.push({ role: "client", content: reply });
    SaveMemory(memory);

    const fileName = `gemini_response_${Date.now()}.txt`;
    fs.writeFileSync(fileName, reply, "utf8");

    const attachment = new MessageAttachment(fileName);

    try {
     await msg.reply({ content: `The content uploaded as a .txt file.`, files: [attachment] });
    } catch(e) {
      await msg.reply(`Error > ${e}`)
    }

    fs.unlinkSync(fileName);
});

client.login(TOKEN)
