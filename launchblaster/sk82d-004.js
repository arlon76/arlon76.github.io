/*=============================================================================

    sk82d-002.js
    Sk82D / SK82D
    SBR Tournament Framework Game Module

    Multiplayer arcade skateboard ramp game.

    - Z8-style timed join phase
    - Timed active phase
    - Highest score wins
    - Self-contained CSS
    - Self-contained audio synth
    - Self-contained canvas
    - Lazy-load compatible
    - SBR compatible
    - HTML extrapolator compatible

=============================================================================*/

export class Sk82D{

    /*=========================================================================
        CONSTRUCTOR
    =========================================================================*/

    constructor({

        mount,
        gameId         = null,
        playerId       = null,
        state          = {},

        width          = 500,
        height         = 700,

        challengeJoinSeconds = 30,
        gameSeconds          = 30,

        theme          = 'classic',

        onReady        = ()=>{},
        onScore        = ()=>{},
        onGameEnd      = ()=>{},
        onStateChange  = ()=>{}

    }={}){

        this.mount =
            typeof mount === 'string'
                ? document.querySelector(mount)
                : mount;

        this.gameId            = gameId;
        this.playerId          = playerId;
        this.state             = state;

        this.width             = width;
        this.height            = height;

        this.challengeJoinSeconds =
            challengeJoinSeconds;

        this.gameSeconds =
            gameSeconds;

        this.theme =
            theme;

        this.onReady       = onReady;
        this.onScore       = onScore;
        this.onGameEnd     = onGameEnd;
        this.onStateChange = onStateChange;

        this.phase =
            'join';

        this.running =
            false;

        this.paused =
            false;

        this.animationFrame =
            null;

        this.keys =
            {};

        this.lastRampTime =
            0;

        this.dashOffset =
            0;

        this.ramps =
            [];

        this.particles =
            [];

        this.phaseStartedAt =
            Date.now();

        this.injectCss();

        this.buildUi();

        this.initCanvas();

        this.initAudio();

        this.initGameState();

        this.bindInputs();
this.bindControls();
        this.onReady(this);
    }
bindControls(){

    const c = this.canvas;

    // =========================
    // Keyboard
    // =========================

    this._keydown = e=>{

        this.keys[e.key] = true;

        if(this.audioCtx?.state === 'suspended')
            this.audioCtx.resume();

        this.startMusic();
    };

    this._keyup = e=>{

        this.keys[e.key] = false;
    };

    document.addEventListener(
        'keydown',
        this._keydown
    );

    document.addEventListener(
        'keyup',
        this._keyup
    );

    // =========================
    // Touch
    // =========================

    this.touchState = {

        active : false,
        lastX  : 0
    };

    this._touchStart = e=>{

        const t = e.touches[0];

        this.touchState.active = true;
        this.touchState.lastX  = t.clientX;

        if(this.audioCtx?.state === 'suspended')
            this.audioCtx.resume();

        this.startMusic();
    };

    this._touchMove = e=>{

        if(!this.touchState.active)return;

        e.preventDefault();

        const t = e.touches[0];

        const dx =
            t.clientX -
            this.touchState.lastX;

        this.touchState.lastX =
            t.clientX;

        this.skater.speedX += dx * 0.08;

        this.skater.speedX =
            Math.max(
                -this.skater.maxSpeedX,
                Math.min(
                    this.skater.maxSpeedX,
                    this.skater.speedX
                )
            );
    };

    this._touchEnd = ()=>{

        this.touchState.active = false;
    };

    c.addEventListener(
        'touchstart',
        this._touchStart,
        { passive:false }
    );

    c.addEventListener(
        'touchmove',
        this._touchMove,
        { passive:false }
    );

    c.addEventListener(
        'touchend',
        this._touchEnd,
        { passive:false }
    );
}
    /*=========================================================================
        CSS
    =========================================================================*/

    injectCss(){

        if(document.getElementById('sk82d-css'))
            return;

        document.head.appendChild(

            tag.style({

                id:'sk82d-css'

            },`

                .sk82d-root{

                    position:relative;
                    width:100%;
                    height:100%;
                    overflow:hidden;
                    background:#111;
                    user-select:none;
                }

                .sk82d-canvas{

                    position:absolute;
                    inset:0;
                    width:100%;
                    height:100%;
                    display:block;
					touch-action:none;
                }

                .sk82d-hud{

                    position:absolute;
                    top:0;
                    left:0;
                    right:0;

                    height:100px;

                    display:flex;
                    align-items:center;
                    justify-content:space-between;

                    padding:20px;

                    box-sizing:border-box;

                    z-index:1000;

                    color:#fff;

                    font-family:sans-serif;

                    background:linear-gradient(
                        to bottom,
                        rgba(0,0,0,.5),
                        rgba(0,0,0,0)
                    );
                }

                .sk82d-phase{

                    font-size:20px;
                    font-weight:bold;
                }

                .sk82d-score{

                    font-size:28px;
                }

                .sk82d-timer{

                    font-size:28px;
                    color:#ffd700;
                }

            `)
        );
    }

    /*=========================================================================
        UI
    =========================================================================*/

    buildUi(){

        this.root =

            tag.div({

                className:'sk82d-root'
            },

                this.canvas =

                    tag.canvas({

                        className:'sk82d-canvas'
                    }),

                this.hud =

                    tag.div({

                        className:'sk82d-hud'
                    },

                        this.phaseEl =

                            tag.div({

                                className:'sk82d-phase'

                            },'JOIN'),

                        this.scoreEl =

                            tag.div({

                                className:'sk82d-score'

                            },'0'),

                        this.timerEl =

                            tag.div({

                                className:'sk82d-timer'

                            },'30')
                    ),

                tag.div({

                    id:'_animated_loding_div_',

                    style:`
                        position:absolute;
                        z-index:10000;
                    `
                })
            );

        this.mount.replaceChildren(
            this.root
        );
    }

    /*=========================================================================
        CANVAS
    =========================================================================*/

    initCanvas(){

        this.ctx =
            this.canvas.getContext('2d');

        this.resize();

        window.addEventListener(
            'resize',
            ()=>this.resize()
        );
    }

    resize(){

        this.canvas.width =
            this.width;

        this.canvas.height =
            this.height;
    }

    /*=========================================================================
        AUDIO
    =========================================================================*/

    initAudio(){

        this.audioCtx =
            new (
                window.AudioContext
                ||
                window.webkitAudioContext
            )();

        this.musicIntervals = {};
    }

playTransitionBlip(){

    const osc =
        this.audioCtx.createOscillator();

    const gain =
        this.audioCtx.createGain();

    osc.type='triangle';

    osc.frequency
        .setValueAtTime(
            660,
            this.audioCtx.currentTime
        );

    osc.frequency
        .linearRampToValueAtTime(
            990,
            this.audioCtx.currentTime+0.12
        );

    gain.gain
        .setValueAtTime(
            0.03,
            this.audioCtx.currentTime
        );

    gain.gain
        .exponentialRampToValueAtTime(
            0.001,
            this.audioCtx.currentTime+0.14
        );

    osc.connect(gain)
        .connect(this.audioCtx.destination);

    osc.start();

    osc.stop(
        this.audioCtx.currentTime+0.15
    );
}
    startMusic(){

        if(this.musicIntervals.melody)
            return;

        const melodyNotes =
            [220,0,330,0,440,0,392,0,330,0,220];

const melodyB =
[
    262,
    330,
    392,
    523,
    392,
    330,
    262,
    196
];
const melodyC =
[
    330,
    392,
    523,
    659,
    523,
    392,
    330,
    262,
    196,
    262
];
        const fastNotes =
            [880,988,1046,988,880,784,880,988];

        const tempo =
            180;

        const intervalLength =
            (60/tempo)*1000;

        let melodyIndex = 0;
        let fastIndex   = 0;
let currentMelody =
    melodyNotes;
        this.musicIntervals.melody =

            setInterval(()=>{

                const note =
                    // melodyNotes[
                    currentMelody[
                        melodyIndex++
                        %
                        // melodyNotes.length
                        currentMelody.length
                    ];
if(
    melodyIndex %
    (
        currentMelody.length * 4
    ) === 0
){

    currentMelody =
        currentMelody === melodyNotes  
        ? melodyB
        : currentMelody === melodyB  
        ? melodyC
        : melodyNotes;
	this.playTransitionBlip();
}
if(
    melodyIndex %
    currentMelody.length
    ===
    currentMelody.length-1
){

  //  this.playTransitionBlip(); // end of the melody rather than end of pattern of it
	
}

                if(!note)
                    return;

                const osc =
                    this.audioCtx.createOscillator();

                const gain =
                    this.audioCtx.createGain();

                osc.type =
					currentMelody===melodyC
					? 'sawtooth'
					: 'square';
					
                osc.frequency.setValueAtTime(
                    note,
                    this.audioCtx.currentTime
                );

                gain.gain.setValueAtTime(
                        currentMelody===melodyC
							? 0.07
							: 0.05,
                    this.audioCtx.currentTime
                );

                gain.gain.exponentialRampToValueAtTime(
                    0.001,
                    this.audioCtx.currentTime + .25
                );

                osc.connect(gain)
                   .connect(this.audioCtx.destination);

                osc.start();

                osc.stop(
                    this.audioCtx.currentTime + .3
                );

            },intervalLength);

        this.musicIntervals.fast =

            setInterval(()=>{

                const note =
                    fastNotes[
                        fastIndex++
                        %
                        fastNotes.length
                    ];

                const osc =
                    this.audioCtx.createOscillator();

                const gain =
                    this.audioCtx.createGain();

                osc.type =
                    'triangle';

                osc.frequency.setValueAtTime(
                    note,
                    this.audioCtx.currentTime
                );

                gain.gain.setValueAtTime(
                    0.03,
                    this.audioCtx.currentTime
                );

                gain.gain.exponentialRampToValueAtTime(
                    0.001,
                    this.audioCtx.currentTime + .1
                );

                osc.connect(gain)
                   .connect(this.audioCtx.destination);

                osc.start();

                osc.stop(
                    this.audioCtx.currentTime + .12
                );

            },intervalLength/2);
    const harmonyNotes =
[
    440,
    494,
    523,
    494
];
 this.musicIntervals.harmony =
    setInterval(()=>{

        const note =
            harmonyNotes[
                fastIndex%
                harmonyNotes.length
            ];

        const osc =
            this.audioCtx.createOscillator();

        const gain =
            this.audioCtx.createGain();

        osc.type='square';

        osc.frequency
            .setValueAtTime(
                note,
                this.audioCtx.currentTime
            );

        gain.gain
            .setValueAtTime(
                0.018,
                this.audioCtx.currentTime
            );

        gain.gain
            .exponentialRampToValueAtTime(
                0.001,
                this.audioCtx.currentTime+0.18
            );

        osc.connect(gain)
            .connect(this.audioCtx.destination);

        osc.start();

        osc.stop(
            this.audioCtx.currentTime+0.2
        );

    },intervalLength);
	



	}
    playHopSound(){

        const osc =
            this.audioCtx.createOscillator();

        const gain =
            this.audioCtx.createGain();

        osc.type =
            'sawtooth';

        osc.frequency.setValueAtTime(
            600,
            this.audioCtx.currentTime
        );

        osc.frequency.linearRampToValueAtTime(
            1200,
            this.audioCtx.currentTime + .15
        );

        gain.gain.setValueAtTime(
            .1,
            this.audioCtx.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            .001,
            this.audioCtx.currentTime + .15
        );

        osc.connect(gain)
           .connect(this.audioCtx.destination);

        osc.start();

        osc.stop(
            this.audioCtx.currentTime + .2
        );
    }

    /*=========================================================================
        GAME STATE
    =========================================================================*/

    initGameState(){

        this.ROAD_WIDTH =
            this.width * .4;

        this.EDGE_WIDTH =
            (this.width - this.ROAD_WIDTH)/2;

        this.RAMP_WIDTH  = 60;
        this.RAMP_HEIGHT = 120;

        this.skater = {

            x:
                this.width/2,

            y:
                this.height*.8,

            speedX:0,

            maxSpeedX:5,

            angle:-75,

            score:0,

            hopY:0,

            hopTime:Math.PI,
			
			launchFxFrames:0
        };
    }

    /*=========================================================================
        INPUT
    =========================================================================*/

    bindInputs(){

        window.addEventListener(

            'keydown',

            e=>{

                this.keys[e.key] = true;

                if(
                    this.audioCtx.state === 'suspended'
                ){
                    this.audioCtx.resume();
                }

                this.startMusic();
            }
        );

        window.addEventListener(

            'keyup',

            e=>{

                this.keys[e.key] = false;
            }
        );
    }

    /*=========================================================================
        GAME LOOP
    =========================================================================*/

    start(){

        if(this.running)
            return;

        this.running = true;

        this.phaseStartedAt =
            Date.now();

        this.loop();
    }

    stop(){

        this.running = false;

        cancelAnimationFrame(
            this.animationFrame
        );
    }

    loop(){

        if(!this.running)
            return;

        this.update();

        this.draw();

        this.animationFrame =

            requestAnimationFrame(
                ()=>this.loop()
            );
    }

    /*=========================================================================
        UPDATE
    =========================================================================*/

    update(){

        this.updatePhase();

        if(this.phase !== 'active')
            return;

        this.updateMovement();

        this.updateRamps();

        this.updateParticles();

        this.updateHop();

        this.dashOffset += 4;
    }

    updatePhase(){

        const elapsed =

            (
                Date.now()
                -
                this.phaseStartedAt
            ) / 1000;

        if(this.phase === 'join'){

            const remain =

                Math.max(
                    0,
                    Math.ceil(
                        this.challengeJoinSeconds
                        -
                        elapsed
                    )
                );

            this.phaseEl.textContent =
                'JOIN';

            this.timerEl.textContent =
                remain;

            if(remain <= 0){

                this.phase =
                    'active';

                this.phaseStartedAt =
                    Date.now();
            }
        }

        else if(this.phase === 'active'){

            const remain =

                Math.max(
                    0,
                    Math.ceil(
                        this.gameSeconds
                        -
                        elapsed
                    )
                );

            this.phaseEl.textContent =
                'SKATE';

            this.timerEl.textContent =
                remain;

            if(remain <= 0){

                this.phase =
                    'end';

                this.stop();

                this.onGameEnd({

                    score:
                        this.skater.score
                });
            }
        }
    }

    updateMovement(){

        if(this.keys['ArrowLeft'])
            this.skater.speedX -= .2;

        if(this.keys['ArrowRight'])
            this.skater.speedX += .2;

        this.skater.speedX *= .95;

        this.skater.speedX =

            Math.max(
                -this.skater.maxSpeedX,

                Math.min(
                    this.skater.maxSpeedX,
                    this.skater.speedX
                )
            );

        this.skater.x +=
            this.skater.speedX;

        const minX =
            this.EDGE_WIDTH + 20;

        const maxX =
            this.width
            -
            this.EDGE_WIDTH
            -
            20;

        this.skater.x =

            Math.max(
                minX,

                Math.min(
                    maxX,
                    this.skater.x
                )
            );

        this.skater.angle =
            -75 + (this.skater.speedX * 10);
			if(this.skater.launchFxFrames>0)
    this.skater.launchFxFrames--;
    }

updateRamps(){

    if(
        Date.now()
        -
        this.lastRampTime
        >
        1000 + Math.random()*2000
    ){

        this.ramps.push({

            x:
                this.EDGE_WIDTH
                +
                Math.random()
                *
                (
                    this.ROAD_WIDTH
                    -
                    this.RAMP_WIDTH
                ),

            y:-this.RAMP_HEIGHT,

            hit:false,

            glow:0
        });

        this.lastRampTime =
            Date.now();
    }

    const prevX =
        this.skater.x - this.skater.speedX;

    for(const ramp of this.ramps){

        ramp.y += 4;

        if(ramp.glow > 0)
            ramp.glow--;

        const rampTop =
            ramp.y;

        const rampBottom =
            ramp.y + this.RAMP_HEIGHT;

        const rampLeft =
            ramp.x;

        const rampRight =
            ramp.x + this.RAMP_WIDTH;

        const skaterY =
            this.skater.y;

        // =========================================================
        // SIDE COLLISION
        // =========================================================

        const verticallyInsideRamp =

            skaterY > rampTop
            &&
            skaterY < rampBottom;

        if(verticallyInsideRamp){

            // entering from left side

            if(

                prevX < rampLeft
                &&
                this.skater.x >= rampLeft
            ){

                this.skater.x =
                    rampLeft - 1;

                this.skater.speedX =
                    0;
            }

            // entering from right side

            if(

                prevX > rampRight
                &&
                this.skater.x <= rampRight
            ){

                this.skater.x =
                    rampRight + 1;

                this.skater.speedX =
                    0;
            }
        }

        // =========================================================
        // BACK-EDGE LAUNCH
        // =========================================================

        const skaterInsideRampWidth =

            this.skater.x >= rampLeft
            &&
            this.skater.x <= rampRight;

        const nearBackEdge =

            skaterY >= rampTop - 6
            &&
            skaterY <= rampTop + 6;

        if(

            !ramp.hit
            &&
            skaterInsideRampWidth
            &&
            nearBackEdge
        ){

            ramp.hit = true;

            ramp.glow = 18;

            this.skater.score += 10;
this.skater.launchFxFrames = 6;
            this.scoreEl.textContent =
                this.skater.score;

            this.skater.hopTime = 0;

            this.playHopSound();

            this.spawnParticles(
                this.skater.x,
                this.skater.y
            );

            this.onScore({

                score:
                    this.skater.score,

                delta:10
            });
        }
    }

    this.ramps =

        this.ramps.filter(

            r=>r.y < this.height + this.RAMP_HEIGHT
        );
}
    updateHop(){

        if(this.skater.hopTime < Math.PI){

            this.skater.hopY =

                Math.sin(
                    this.skater.hopTime
                ) * 15;

            this.skater.hopTime += .15;
        }

        else{

            this.skater.hopY = 0;
        }
    }

    updateParticles(){

        this.particles.forEach(p=>{

            p.y += p.vy;

            p.alpha -= .03;
        });

        this.particles =

            this.particles.filter(
                p=>p.alpha > 0
            );
    }

    spawnParticles(x,y){

        for(let i=0;i<10;i++){

            this.particles.push({

                x:
                    x + (Math.random()-.5)*20,

                y:
                    y + (Math.random()-.5)*10,

                vy:
                    1 + Math.random()*2,

                alpha:1,

                radius:
                    2 + Math.random()*3
            });
        }
    }

    /*=========================================================================
        DRAW
    =========================================================================*/

    draw(){

        const ctx =
            this.ctx;

        ctx.clearRect(
            0,
            0,
            this.width,
            this.height
        );

        this.drawGrass();

        this.drawRoad();

        this.drawLane();

        this.drawRamps();

        this.drawParticles();

        this.drawSkater();
    }

    drawGrass(){

        this.ctx.fillStyle =
            '#00cc66';

        this.ctx.fillRect(
            0,
            0,
            this.EDGE_WIDTH,
            this.height
        );

        this.ctx.fillRect(
            this.width - this.EDGE_WIDTH,
            0,
            this.EDGE_WIDTH,
            this.height
        );
    }

    drawRoad(){

        this.ctx.fillStyle =
            '#666';

        this.ctx.fillRect(

            this.EDGE_WIDTH,
            0,
            this.ROAD_WIDTH,
            this.height
        );
    }

    drawLane(){

        this.ctx.strokeStyle =
            'yellow';

        this.ctx.lineWidth = 6;

        this.ctx.setLineDash([30,20]);

        this.ctx.lineDashOffset =
            -this.dashOffset;

        this.ctx.beginPath();

        this.ctx.moveTo(
            this.width/2,
            0
        );

        this.ctx.lineTo(
            this.width/2,
            this.height
        );

        this.ctx.stroke();

        this.ctx.setLineDash([]);
    }

drawRamps(){

    for(const ramp of this.ramps){

        const glowAlpha =
            ramp.glow / 18;

        // glow

        if(glowAlpha > 0){

            this.ctx.fillStyle =
                `rgba(255,220,120,${glowAlpha * .5})`;

            this.ctx.fillRect(

                ramp.x - 6,
                ramp.y - 6,

                this.RAMP_WIDTH + 12,
                this.RAMP_HEIGHT + 12
            );
        }

        // ramp body

        const grad =
            this.ctx.createLinearGradient(

                0,
                ramp.y + this.RAMP_HEIGHT,

                0,
                ramp.y
            );

        grad.addColorStop(
            0,
            '#d2a679'
        );

        grad.addColorStop(
            .3,
            '#a66b3d'
        );

        grad.addColorStop(
            1,
            '#5c3317'
        );

        this.ctx.fillStyle =
            grad;

        this.ctx.fillRect(

            ramp.x,
            ramp.y,

            this.RAMP_WIDTH,
            this.RAMP_HEIGHT
        );

        // highlight edge

        this.ctx.fillStyle =
            'rgba(255,255,255,1)'; // the 1 alpha controls the skater's transparency believe it or not 

        this.ctx.fillRect(

            ramp.x,
            ramp.y,

            this.RAMP_WIDTH,
            3
        );
    }
}
    drawParticles(){

        for(const p of this.particles){

            this.ctx.fillStyle =

                // `rgba(255,255,255,${p.alpha})`;
                `rgba(255,255,255,1)`; // that was for transparent particles but it makes the skater clear - wrong

            this.ctx.beginPath();

            this.ctx.arc(

                p.x,
                p.y - this.skater.hopY,

                p.radius,

                0,
                Math.PI*2
            );

            this.ctx.fill();
        }
    }

    drawSkater(){

        this.ctx.save();

        this.ctx.translate(

            this.skater.x,

            this.skater.y
            -
            this.skater.hopY
        );

        this.ctx.rotate(

            this.skater.angle
            *
            Math.PI
            /
            180
        );
/* -----------------------------------------
   normalize aspect ratio
----------------------------------------- */

const SKATER_SCALE = 1.35;

this.ctx.scale(
    SKATER_SCALE,
    SKATER_SCALE *1.52
);

/* -----------------------------------------
   OPTIONAL launch blur
----------------------------------------- */

this.ctx.filter =
    this.skater.launchFxFrames > 0
        ? 'blur(2.25px)'
        : 'none';
		
        this.ctx.font =
            '40px sans-serif';

        this.ctx.textAlign =
            'center';

        this.ctx.textBaseline =
            'middle';

        this.ctx.fillText(
            '🛹',
            0,
            0
        );

        this.ctx.fillText(
            '😎',
            -15,
            -15
        );

        this.ctx.restore();
		this.ctx.filter = 'none';
    }

    /*=========================================================================
        CLEANUP
    =========================================================================*/

    destroy(){

        this.stop();

        Object.values(
            this.musicIntervals
        ).forEach(clearInterval);

        this.mount.innerHTML = '';
		
		    document.removeEventListener(
        'keydown',
        this._keydown
    );

    document.removeEventListener(
        'keyup',
        this._keyup
    );

    this.canvas.removeEventListener(
        'touchstart',
        this._touchStart
    );

    this.canvas.removeEventListener(
        'touchmove',
        this._touchMove
    );

    this.canvas.removeEventListener(
        'touchend',
        this._touchEnd
    );
	
    }
}