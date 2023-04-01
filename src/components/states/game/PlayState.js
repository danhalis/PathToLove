import State from "../../../lib/State.js";
import Vector from "../../../lib/Vector.js";
import Heart from "../../entities/Heart.js";
import LittleHeart from "../../entities/LittleHeart.js";
import LockedHeart from "../../entities/LockedHeart.js";
import { audioContext, backGroundMusic, CANVAS_HEIGHT, CANVAS_WIDTH, context, GROUND_LEVEL, STANDARD_CANVAS_WIDTH, stateMachine, timer } from "globals.js";
import Flower from "../../objects/Flower.js";
import Lock from "../../objects/Lock.js";
import SoundWaves from "../../objects/SoundWaves.js";
import HealthProgressBar from "../../user-interface/HealthProgressBar.js";
import EndingState from "./EndingState.js";
import GameOverState from "./GameOverState.js";

export default class PlayState extends State {

    static NAME = "play-state";

    static SCORE_FONT_SIZE = CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 40);

    constructor() {
        super();

        this.name = PlayState.NAME;
    }

    enter(params) {
        this.stone = params.stone;
        this.player = params.player;
        this.crush = params.crush;
        this.heart = params.heart;

        this.playerIsInScreen = true;
        this.tweenPlayerOutOfScreenAsync();

        this.lockedHeart = new LockedHeart(
            new Vector(LockedHeart.RENDER_WIDTH, LockedHeart.RENDER_HEIGHT),
            new Vector(CANVAS_WIDTH - LockedHeart.RENDER_WIDTH - 20, (CANVAS_HEIGHT - LockedHeart.RENDER_HEIGHT) / 2),
            this.heart
        );

        this.lockedHeart.setConstraintBox(
            new Vector(0, 0),
            new Vector(CANVAS_WIDTH + LockedHeart.RENDER_WIDTH, CANVAS_HEIGHT)
        );

        this.heart.setTargetToShoot(this.lockedHeart);

        this.playerHpBar = new HealthProgressBar(
            CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 20),
            CANVAS_HEIGHT / (STANDARD_CANVAS_WIDTH / 20),
            HealthProgressBar.RENDER_WIDTH,
            HealthProgressBar.RENDER_HEIGHT,
            Heart.MAX_HP,
            Heart.MAX_HP
        );

        this.lockDurabilityBar = new HealthProgressBar(
            CANVAS_WIDTH - HealthProgressBar.RENDER_WIDTH - CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 20),
            CANVAS_HEIGHT / (STANDARD_CANVAS_WIDTH / 20),
            HealthProgressBar.RENDER_WIDTH,
            HealthProgressBar.RENDER_HEIGHT,
            Lock.MAX_HP,
            Lock.MAX_HP
        );

        this.heart.setOnTakingDamage(() => {
            this.playerHpBar.updateBar(this.heart.health);
        });

        this.lockedHeart.setOnTakingDamage(() => {
            this.score.x += 10;
            this.lockDurabilityBar.updateBar(this.lockedHeart.getLockHealth());
        });

        this.soundwaves = new SoundWaves(audioContext, backGroundMusic);

        this.soundwaves.start();

        this.didHideLockedHeart = false;

        this.score = new Vector(0, 0);
    }

    async tweenPlayerOutOfScreenAsync() {
        let distanceBetweenStoneAndFlower = this.player.flower.getDistanceTo(this.stone, false);
        let distanceBetweenPlayerAndFlower = this.player.flower.getDistanceTo(this.player, false);

        timer.tweenAsync(this.player.flower.position, ["x"], [-Flower.RENDER_WIDTH], 5);
        timer.tweenAsync(this.player.position, ["x"], [-Flower.RENDER_WIDTH - distanceBetweenPlayerAndFlower], 5);
        await timer.tweenAsync(this.stone.position, ["x"], [-Flower.RENDER_WIDTH - distanceBetweenStoneAndFlower], 5);
        
        this.playerIsInScreen = false;
        this.stone = null;
        this.player.despawnFlower();
        this.player.hide();
    }

    update(dt) {

        this.score.add(new Vector(100, 0), dt);

        if (this.playerIsInScreen) {
            this.player.update(dt);
            this.stone.update(dt);
        }

        if (this.soundwaves.didCollideWithEntity(this.heart)) {
            this.heart.takeDamage(this.soundwaves.damage);
        }

        this.soundwaves.update();
        this.lockedHeart.update(dt);
        this.heart.update(dt);

        if (this.lockedHeart.lock && this.lockedHeart.getLockHealth() == 0) {
            this.lockedHeart.breakLock();
        }
        else if (!this.lockedHeart.isLocked) {
            this.moveLockedHeartOffScreen();
        }

        if (this.heart.health == 0) {
            stateMachine.change(
                GameOverState.NAME,
                {
                    score: this.score.x,
                    message: "Sadly, you failed too soon. You can try again!"
                }
            );
        }
        else if (this.soundwaves.getAudioDuration() - this.soundwaves.getAudioCurrentTime() <= 10) {
            
            if (!this.didHideLockedHeart) {
                this.moveLockedHeartOffScreen();
                return;
            }

            this.crush.appear();

            stateMachine.change(
                EndingState.NAME,
                {
                    player: this.player,
                    crush: this.crush,
                    heart: this.heart,
                    didUnlockHeart: !this.lockedHeart.isLocked,
                    score: this.score,
                    soundwaves: this.soundwaves
                }
            );
        }
    }

    render() {
        this.renderGround();

        if (this.playerIsInScreen) {
            this.player.render();
            this.stone.render();
        }

        this.soundwaves.render();
        this.lockedHeart.render();
        this.heart.render();

        this.playerHpBar.render();
        this.lockDurabilityBar.render();

        context.save();
		context.font = `${PlayState.SCORE_FONT_SIZE}px Joystix`;
		context.textBaseline = 'middle';
		context.textAlign = 'left';
        context.fillText(Math.floor(this.score.x), this.playerHpBar.position.x, this.playerHpBar.position.y + CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 50));
        context.restore();
    }

    renderGround() {
        context.save();
        context.lineWidth = CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 5);
        context.fillStyle = 'rgb(164, 164, 164)';
        context.strokeRect(0, GROUND_LEVEL - CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 3), CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_LEVEL);
        context.fillRect(0, GROUND_LEVEL - CANVAS_WIDTH / (STANDARD_CANVAS_WIDTH / 3), CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_LEVEL);
        context.fillStyle = 'black';
        context.restore;
    }

    moveLockedHeartOffScreen() {
        if (this.didHideLockedHeart) return;

        this.lockedHeart.stayStill();
        this.lockedHeart.stopAttacking();

        if (this.lockedHeart.position.x < CANVAS_WIDTH + LittleHeart.RENDER_WIDTH) {
            this.lockedHeart.moveRight();
        }
        else {
            this.didHideLockedHeart = true;
            this.lockedHeart.stopMoving();
            this.lockedHeart.paralyze();
            this.lockedHeart.hide();
        }
    }
}