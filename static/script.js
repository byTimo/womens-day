const hashName = window.location.hash;

function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function delay(time) {
    return new Promise(resolve => setTimeout(() => resolve(), time));
}

function show(element) {
    element.classList.add("visible");
    element.classList.remove("hidden");
    return delay(1000);
}

function hide(element) {
    element.classList.add("hidden");
    element.classList.remove("visible");
    return delay(1000);
}

class Replices {
    constructor() {
        this.whatIsYourName = document.querySelector("#whatIsYourName");
        this.repeat = document.querySelector("#repeat");
        this['Лапочка'] = document.querySelector("#lapochka");
        this['Красотулечка'] = document.querySelector("#krasatulechka");
        this['Котеночек'] = document.querySelector("#kitty");
        this.ofical = document.querySelector("#ofical");
        this.prepare = document.querySelector("#prepare");
        this.save1 = document.querySelector("#save1");
        this.save2 = document.querySelector("#save2");
        this.save3 = document.querySelector("#save3");
        this.wait1 = document.querySelector("#wait1");
        this.wait2 = document.querySelector("#wait2");
        this.wait0 = document.querySelector("#wait0");
    }

    play(replica) {
        return new Promise(resolve => {
            this[replica].onended = () => {
                this[replica].onended = null;
                setTimeout(() => resolve(), 1000);
            }
            this[replica].play();
        })
    }
}

const replices = new Replices();

function play(replica) {
    return replices.play(replica);
}

class Man {
    async show() {
        const img = await this.showMan();
        const name = this.getName();

        if (!name || !await this.congratulate(name)) {
            await play(`save${random(0, 3)}`)
        }
        await this.hideMan(img)
    }

    async congratulate(name) {
        try {
            const [text, _] = await Promise.all([this.createCongratulation(name), play("prepare")]);
            const [message] = await Promise.all([this.pushText(text), this.playCongratulation(name)]);
            await delay(2000);
            await this.hideText(message);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    showMan() {
        const container = document.querySelector(".container");
        const img = document.createElement('img');
        img.src = `img/man${random(0, 12)}.jpg`;;
        img.classList.add("man");
        img.classList.add("hidden");
        container.appendChild(img);
        setTimeout(() => show(img))
        return img;
    }

    async hideMan(img) {
        const container = document.querySelector(".container");
        await hide(img)
        container.removeChild(img)
    }

    async createCongratulation(name) {
        const response = await fetch(`/congratulation?name=${name}`, {
            method: "POST"
        });
        if (response.ok) {
            return await response.text();
        }
    }

    playCongratulation(name) {
        return new Promise(resolve => {
            const audio = document.createElement("audio");
            audio.src = `/congratulation?name=${name}`;
            audio.autoplay = true;
            audio.onended = () => {
                document.body.removeChild(audio);
                setTimeout(() => resolve(), 1000);
            };
            document.body.appendChild(audio);
        })
    }

    getName() {
        const hash = window.location.hash;
        if (hash) {
            const alias = atob(hash.substring(1));
            return women[alias];
        }

        return null;
    }

    async pushText(text) {
        const message = document.querySelector(".message");
        message.textContent = text;
        message.classList.add("swim");
        await show(message);
        return message;
    }

    async hideText(message) {
        await hide(message);
        message.classList.remove("swim");
        message.textContent = "";
    }
}

async function start() {
    window.playButton.onclick = null;
    hide(document.querySelector(".start"));
    const man = new Man(random(0, 5));
    await man.show();
    show(document.querySelector(".start"))
    window.playButton.onclick = start;
}

document.addEventListener("DOMContentLoaded", () => {
    window.playButton = document.querySelector(".start");
    show(window.playButton);
    window.playButton.onclick = start;
})