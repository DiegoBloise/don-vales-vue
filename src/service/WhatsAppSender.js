const { Builder, By, until } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');
const { promises } = require('fs');
const path = require('path');

const initialStartup = 'wa_web_initial_startup';
const qrCodeXPath = '/html/body/div[2]/div/div/div[2]/div[3]/div[1]/div/div/div[2]/div/canvas';
const sendButtonXPath = '/html/body/div[1]/div/div/div[2]/div[4]/div/footer/div[1]/div/span[2]/div/div[2]/div[2]/button';
const qrCodeImagePath = path.join(__dirname, 'qrcode.png');

const browser = new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new Options())
    .build();

async function setup() {
    try {
        console.log('Accessing WhatsAppWeb...');

        await browser.get('https://web.whatsapp.com/');
        await browser.wait(until.elementLocated(By.id(initialStartup)));

        console.log('Loading QR Code...');
        await browser.wait(until.elementLocated(By.xpath(qrCodeXPath)));

        await captureQRCode(browser);

        console.log('Scan the QR code to continue...');
        console.log('Loading...');
        await browser.wait(until.elementLocated(By.id('pane-side')));

        console.log('Success...');

        return true;
    } catch (error) {
        console.error('[!] Error:', error);
        await browser.quit();
        return false;
    }
}

async function captureQRCode(browser) {
    const qrCodeElement = await browser.findElement(By.xpath("//*[@id=\"app\"]/div/div[2]/div[3]/div[1]/div/div"));
    const screenshot = await qrCodeElement.takeScreenshot();

    try {
        await promises.writeFile(qrCodeImagePath, screenshot, 'base64');
        console.log('QR Code saved to:', qrCodeImagePath);
    } catch (error) {
        console.error('Failed to save QR Code:', error.message);
    }
}

async function sendMessage(phone, message) {
    try {
        console.log('Sending messages...');

        await browser.get(`https://web.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message.replace("\n", "%0A"))}`);

        await browser.wait(until.elementLocated(By.xpath(sendButtonXPath)));
        await browser.wait(until.elementIsVisible(browser.findElement(By.xpath(sendButtonXPath))));

        const sendButton = await browser.findElement(By.xpath(sendButtonXPath));
        await sendButton.click();

        await browser.sleep(2000);

        console.log('[+] Message sent to phone:', phone);
    } catch (error) {
        console.error('[!] Error:', error);
        await browser.quit();
    } finally {
        if (browser) {
            await browser.quit();
        }
    }
}

async function main() {
    if (await setup()) {
        console.log('Setup completed');
        // Exemplo de uso:
        await sendMessage('+5511982185492', 'Olá, mundo!');
    }
}

main();
