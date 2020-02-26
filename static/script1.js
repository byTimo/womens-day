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

const saveTexts = {
    "save0": "От всего сердца поздравляю тебя с международным женским днём! Пусть всё вокруг играет яркими красками и пусть дни будут светлыми и безоблачными! Всегда подавай пример окружающим и не бойся никаких преград! Будь всегда счастливой, жизнерадостной и лучшей на свете!",
    "save1": "Прими мои самые искренние поздравления с 8-м марта! Пусть любой твой день будет радостным и пусть всё вокруг играет яркими красками! Будь всегда разумной, рассудительной и целеустремлённой! Желаю тебе поменьше грустить и никогда не унывать!",
    "save2": "От всего сердца поздравляю тебя с международным женским днём! Пусть весенние лучи, пробиваясь сквозь облака, укажут тебе путь к счастью и пусть всегда будет возможность заниматься любимыми делами! Желаю тебе радости, веселья и чтобы вокруг были хорошие люди!",
    "save3": "Искренне поздравляю тебя с международным женским днём! Всегда оставайся столь же неотразимой, как и сегодня! Будь всегда щедрой, неотразимой и нежной! Желаю тебе хороших событий, а также множества интересных и радостных встреч!",
    "save4": "Прими мои самые искренние поздравления с 8-м марта! Желаю тебе хороших впечатлений, а также успеха во всех сферах жизни! Пусть во всех твоих делах помогает ангел-хранитель! Всегда оставайся привлекательной и жизнерадостной красавицей!",
    "save5": "Поздравляю тебя с праздником прекрасной половины человечества! Желаю тебе заниматься только тем, что приносит радость! Всегда оставайся такой же милой, нежной, юной! Будь всегда щедрой, жизнерадостной и здоровой!",
    "save6": "Сердечно поздравляю тебя с международным женским днём! Пусть во всех твоих делах помогает ангел-хранитель, пусть любые начинания сопровождаются удачей и пусть судьба будет благосклонна к тебе и балует приятными сюрпризами! Будь всегда счастливой, полной оптимизма и непревзойдённой!",
    "save7": "Прими мои самые искренние поздравления с 8-м марта! Пусть во всех твоих делах помогает ангел-хранитель и пусть твоя красота делает мир лучше и удивительнее! Желаю тебе творческих свершений, а также достижения новых вершин!",
    "save8": "Прими мои самые искренние поздравления с 8-м марта! Сбереги на всю жизнь свою красоту и молодость! Желаю тебе достатка во всём, а также непрерывного праздника в душе! Будь всегда ласковой, счастливой и нежной!",
    "save9": "Сердечно поздравляю тебя с международным женским днём! Желаю тебе тепла, бодрости, веселья и процветания! Пусть жизнь играет лишь по твоим правилам, пусть дни будут светлыми и безоблачными и пусть тебе везёт во всех делах!"
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
        this.save0 = document.querySelector("#save0");
        this.save1 = document.querySelector("#save1");
        this.save2 = document.querySelector("#save2");
        this.save3 = document.querySelector("#save3");
        this.save4 = document.querySelector("#save4");
        this.save5 = document.querySelector("#save5");
        this.save6 = document.querySelector("#save6");
        this.save7 = document.querySelector("#save7");
        this.save8 = document.querySelector("#save8");
        this.save9 = document.querySelector("#save9");
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
            await this.playSave()
        }
        await this.hideMan(img)
    }

    async congratulate(name) {
        try {
            const [text, _] = await Promise.all([this.createCongratulation(name), play("prepare")]);
            const [message] = await Promise.all([this.pushText(text), this.playCongratulation(text)]);
            await delay(2000);
            await this.hideText(message);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async playSave() {
        const saveId = `save${random(0, 10)}`;
        const text = saveTexts[saveId];
        const [message] = await Promise.all([this.pushText(text), play(saveId)]);
        await this.hideText(message);
    }

    async showMan() {
        const container = document.querySelector(".container");
        const img = document.createElement('img');
        img.src = `img/man${random(0, 12)}.jpg`;;
        img.classList.add("man");
        img.classList.add("hidden");
        container.appendChild(img);
        await delay(10);
        await show(img)
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

    playCongratulation(text) {
        return new Promise(resolve => {
            const audio = document.createElement("audio");
            audio.src = `/congratulation?text=${text}`;
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