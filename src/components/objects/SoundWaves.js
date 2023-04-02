import Vector from "../../lib/Vector.ts";
import { context, CANVAS_HEIGHT, CANVAS_WIDTH, DEBUG } from "globals";
import FrequencyBar from "./FrequencyBar.js";

export default class SoundWaves {

    static NUMBER_OF_BARS = 15;

    static DAMAGE = 30;

    constructor(audioContext, audio) {

        this.damage = SoundWaves.DAMAGE;

        this.bars = [];

        this.audio = audio;

        this.audio.onplay = () => {  
            audioContext.resume();
        }
        
        this.soundAnalyzer = audioContext.createAnalyser();

        // set buffer size
        this.soundAnalyzer.fftSize = 512;
        
        // convert audio element into a media element source
        let soundSource = audioContext.createMediaElementSource(this.audio);
        
        // connect sound source to sound analyser
        soundSource.connect(this.soundAnalyzer);
        
        // audioContext.destination is default output device
        soundSource.connect(audioContext.destination);

        // get frequency data from the audio
        this.uint8AudioData = new Uint8Array(this.soundAnalyzer.frequencyBinCount);
    }

    start() {
        this.audio.play();
    }

    getAudioDuration() {
        return this.audio.duration;
    }

    getAudioCurrentTime() {
        return this.audio.currentTime;
    }

    update() {
        this.soundAnalyzer.getByteFrequencyData(this.uint8AudioData);
    }
    
    render() {
        this.draw([...this.uint8AudioData]);
    }

    draw(audioData) {
        
        context.save();
        context.globalCompositeOperation = "darken";

        // take mid-frequencies
        const numberOfBars = 15;
        audioData = audioData.splice(audioData.length / 4 + 2, numberOfBars);
        
        let maxFrequency = Math.max(...audioData);
        let barWidth = (CANVAS_WIDTH / audioData.length);
        let barHeight;
        let nextBarX = 0;
        let rightCloseToMaxFrequency = 0;
    
        for (let i = 0; i < audioData.length; i++) {

            // if this frequency is right close to the highest frequency
            if (rightCloseToMaxFrequency > 0) {
                // boost this frequency
                audioData[i] *= 1.5;
                rightCloseToMaxFrequency--;
            }
            
            // boost the previous 3 frequencies (to the left)
            if (audioData[i + 3] == maxFrequency || 
                audioData[i + 2] == maxFrequency || 
                audioData[i + 1] == maxFrequency) {
                audioData[i] *= 2;
            }
    
            // boost the highest frequency
            if (audioData[i] == maxFrequency) {
                audioData[i] *= 1.5;

                // boost the next 3 frequencies (to the right)
                rightCloseToMaxFrequency = 3;
            }
    
            barHeight = (audioData[i] * 2) / 1.8;
    
            // if bars array is not fully populated yet
            if (this.bars.length < numberOfBars) {
                this.bars.push(new FrequencyBar(
                    new Vector(barWidth, barHeight),
                    new Vector(nextBarX, CANVAS_HEIGHT - barHeight)
                ));
            }
            // if bars array is already fully populated
            else {
                this.bars[i].position.x = nextBarX;
                this.bars[i].setHeight(barHeight);
                this.bars[i].setY(CANVAS_HEIGHT - barHeight);
            }

            this.bars[i].renderObject();
            if (DEBUG) this.bars[i].renderHitboxes();

            nextBarX += barWidth;
        }

        context.restore();
    }

    didCollideWithEntity(entity) {
        for (const bar of this.bars) {
            if (bar.didCollideWithEntity(entity)) {
                return true;
            }
        }

        return false;
    }
}