function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
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

var recognition = new webkitSpeechRecognition();
recognition.lang = "ru-RU";
recognition.continuous = true;
recognition.onstart = function () {
    document.querySelector("#micro").src = "/img/audio.svg"
}

recognition.onend = function () {
    document.querySelector("#micro").src = "/img/mute.svg"
}

function listen(timeout) {
    recognition.start();
    return new Promise(resolve => {
        const a = setTimeout(() => {
            recognition.stop();
            resolve(null);
        }, timeout)
        recognition.onresult = (event) => {
            clearTimeout(a);
            recognition.stop();
            const text = event.results[0][0].transcript.split(' ')[0];
            console.log(text);
            resolve(text);
        }
    })
}

const allowNames = [
    "Кристина",
    "Лена",
    "Наташа",
    "Даша",
    "Таня",
]

const alias = ["Лапочка", "Красотулечка", "Котеночек"];

class Man {
    constructor() {
        this.manSrc = `img/man${random(0, 12)}.jpg`;
        this.alias = alias[random(0, 3)];
    }

    async show() {
        this.showMan();
        const name = await this.getName();
        try {
            const [text, _] = await Promise.all([this.createCongratulation(name), play("prepare")]);
            this.typeMessage(text);
            await this.playCongratulation(name);
        } catch {
            await play(`save${random(0, 3)}`)
        }
    }

    showMan() {
        const mans = document.querySelector(".mans");
        const img = document.createElement('img');
        img.src = this.manSrc;
        img.classList.add("man");
        mans.appendChild(img);
        setTimeout(() => img.classList.add("visible"), 10);
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

    async getName() {
        await play("whatIsYourName")
        let name = null;
        let tryCount = 0;
        while (name == null && tryCount < 3) {
            const words = await listen(5000);
            if (!words) {
                await play(`wait${random(0, 3)}`)
                continue;
            }

            const findedName = allowNames.find(x => x === words);

            if (findedName) {
                name = findedName;
                break;
            }

            tryCount += 1;

            if (tryCount === 3) {
                break;
            }

            if (words.length > 10) {
                await play("ofical");
            } else {
                await play("repeat");
            }
        }

        if (name) {
            return name;
        }
        await play(this.alias);
        return this.alias;
    }

    typeMessage(text) {
        const container = document.querySelector(".messageContainer");
        if (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        const message = document.createElement("div");
        message.classList.add("message");
        message.textContent = text;
        container.appendChild(message);
    }
}

async function start() {
    document.querySelector(".start").classList.remove("visible");
    const man = new Man(random(0, 5));
    man.show();
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".start").classList.add("visible");
})