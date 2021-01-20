///// FUNZIONI DI UTILITA' //////////////////////////////
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const TO_RADIANS = Math.PI / 180;
function rotateAndPaintImage(context, image, angleInRad, positionX, positionY, axisX, axisY) {
    context.translate(positionX, positionY);
    context.rotate(angleInRad);
    context.drawImage(image, -axisX, -axisY);
    context.rotate(-angleInRad);
    context.translate(-positionX, -positionY);
}
///// TRUCCHI DEL MESTIERE (HACKING) ////////////////////
Audio.prototype.play = (function (play) {
    return function () {
        var audio = this,
            args = arguments,
            promise = play.apply(audio, args);
        if (promise !== undefined) {
            promise.catch(_ => {
                // Autoplay was prevented. This is optional, but add a button to start playing.
            });
        }
    };
})(Audio.prototype.play);
///////////////////////////////////////////////////////

var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

const ANIMA_TUBI = 0;
const ANIMA_SPRITE = 0;
const SUONA_SOUNDTRACK = 0;
const CAMBIA_SPRITE_E_SCENARIO_A_CASO = 0;

// SCENARI
const SCENARI = [
    "background_night.png",
    "background.png",
    "background_underwater.png",
    "background_santa.png",
    "background_cave.png",
    "background_scifi.png"
];

// SPRITE
const SPRITES = [
    "megaman.gif",
    "bird.png",
    "lama.gif",
    "pikachu_1s.gif",
    "pikachu_2s.gif",
    "pikachu_3s.gif",
    "jessica.gif",
    "marios.gif"
];

// IMMAGINI SPRITE E SCENARI
var bird = new Image();
var bg = new Image();
var fg = new Image();
var pipeNorth = new Image();
var pipeSouth = new Image();

// CARICA SCENARI e IMMAGINI
if(CAMBIA_SPRITE_E_SCENARIO_A_CASO) {
    // SPRITE
    bird.src = "images/" + SPRITES[getRandomInt(0, SPRITES.length - 1)];
    // SCENARIO SULLO SFONDO (background)
    bg.src = "images/" + SCENARI[getRandomInt(0, SCENARI.length - 1)];
} else {
    bird.src = "images/bird.png";
    // SCENARIO SULLO SFONDO (background)
    bg.src = "images/background.png";
}
// SCENARIO DAVANTI (foreground)
fg.src = "images/fg.png";

//pipeNorth.src = "images/obstacle_top.png";
//pipeSouth.src = "images/obstacle_bottom.png";
pipeNorth.src = "images/pipeNorth.png";
pipeSouth.src = "images/pipeSouth.png";


// VARIABILI DEL GIOCO
var gap = 85;
var constant;

var bX = 10;
var bY = 150;

// GRAVITA' (QUANTO RIMBALZO?)
var gravity = 1.5;

// PUNTEGGIO (SCORE)
var score = 0;

// MUSICA ED EFFETTI SONORI
var fly = new Audio();
var scor = new Audio();
var boom = new Audio();
// COLONNA SONORA (soundtrack)
var soundtrack = new Audio();
// IMPOSTA IL VOLUME in sottofondo
soundtrack.volume = 0.2;

fly.src = "sounds/fly.mp3";
scor.src = "sounds/score.mp3";
boom.src = "sounds/win.mp3";
soundtrack.src = "sounds/Eternity.mp3";

// QUANDO SI PRESE FRECCIA GIU'
document.addEventListener("keydown", SPOSTATI_IN_ALTO);

function SPOSTATI_IN_ALTO() {
    if(SUONA_SOUNDTRACK && soundtrack.paused) { // NON E' IN PAUSA
        soundtrack.play();
    }
    if (collided) { // COLPITO UN TUBO, NON FARE ALTRO (RETURN)
        return; // RITORNA
    }
    bY -= 25;
    fly.play();
}

// VERO QUANDO COLPISCI UN TUBO (speriamo di no!)
var collided = false;

// POSIZIONE DEI TUBI
var pipe = [];

pipe[0] = {
    x: cvs.width,
    y: 0
};

function DISEGNA() {

    // DISEGNA LO SCENARIO di SFONDO (background)
    ctx.drawImage(bg, 0, 0);

    for (var i = 0; i < pipe.length; i++) {

        // DISEGNA L'ANIMNAZIONE DEI TUBI CHE SI SPOSTANO
        constant = pipeNorth.height + gap;
        if (ANIMA_TUBI) {
            ctx.drawImage(pipeNorth, pipe[i].x, pipe[i].y);
            ctx.drawImage(pipeSouth, pipe[i].x, pipe[i].y + constant);
        }

        pipe[i].x--;

        if (pipe[i].x == 125) {
            pipe.push({
                x: cvs.width,
                y: Math.floor(Math.random() * pipeNorth.height) - pipeNorth.height
            });
        }

        // DISEGNA LO SCENARIO DAVANTI (frontground)
        ctx.drawImage(fg, 0, cvs.height - fg.height);

        if (ANIMA_SPRITE) {
            // SE COLPISCE IL TUBO!
            if (bX + bird.width >= pipe[i].x && bX <= pipe[i].x + pipeNorth.width && (bY <= pipe[i].y + pipeNorth.height || bY + bird.height >= pipe[i].y + constant) || bY + bird.height >= cvs.height - fg.height) {
                collided = true;
                // RUOTA LO SPRITE E DISEGNA
                rotateAndPaintImage(ctx, bird, 60 * TO_RADIANS, bX, bY, 20, 30);
                boom.play();
                // RICARICA IL GIOCO
                ctx.fillStyle = "#FFFF";
                ctx.font = "26px bold Verdana";
                ctx.fillText("HAI PERSO!", cvs.width / 2 - 69, cvs.height / 2);
                setTimeout(() => {
                    boom.pause();
                    if(SUONA_SOUNDTRACK) soundtrack.pause();
                    location.reload();
                }, 1500);
            } else if (!collided) {
                // DISEGNA LO SPRITE
                ctx.drawImage(bird, bX, bY);
            }
        }

        if (pipe[i].x == 5) {
            score++;
            scor.play();
        }
    }
    bY += gravity;

    ctx.fillStyle = "#000";
    ctx.font = "20px Verdana";
    ctx.fillText("Punti: " + score, 10, cvs.height - 20);

    requestAnimationFrame( DISEGNA );

}
DISEGNA();

























