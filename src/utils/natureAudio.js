/**
 * @fileoverview Ambient Web Audio nature sound synthesizer for WorldScene.
 * Generates gentle wind breeze and soft woodland sound effects using
 * pure browser Web Audio API — zero external audio assets required.
 */

let audioCtx = null
let masterGain = null
let noiseNode = null
let chirpInterval = null

export function isAudioRunning() {
  return audioCtx && audioCtx.state === 'running'
}

export function startNatureSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return false

    if (!audioCtx) {
      audioCtx = new AudioContext()
    } else if (audioCtx.state === 'suspended') {
      audioCtx.resume()
    }

    if (masterGain) return true

    // Master volume
    masterGain = audioCtx.createGain()
    masterGain.gain.setValueAtTime(0.01, audioCtx.currentTime)
    masterGain.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 2)
    masterGain.connect(audioCtx.destination)

    // Synthesize gentle wind/breeze with filtered noise
    const bufferSize = audioCtx.sampleRate * 2
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate)
    const output = noiseBuffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1
    }

    noiseNode = audioCtx.createBufferSource()
    noiseNode.buffer = noiseBuffer
    noiseNode.loop = true

    // Bandpass filter for wind whisper
    const filter = audioCtx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(380, audioCtx.currentTime)
    filter.Q.setValueAtTime(2.5, audioCtx.currentTime)

    // LFO to slowly modulate wind frequency
    const lfo = audioCtx.createOscillator()
    const lfoGain = audioCtx.createGain()
    lfo.frequency.setValueAtTime(0.2, audioCtx.currentTime)
    lfoGain.gain.setValueAtTime(140, audioCtx.currentTime)
    lfo.connect(lfoGain)
    lfoGain.connect(filter.frequency)
    lfo.start()

    noiseNode.connect(filter)
    filter.connect(masterGain)
    noiseNode.start()

    // Gentle bird chirp synthesizer triggered every 4-8 seconds
    const playChirp = () => {
      if (!audioCtx || !masterGain || audioCtx.state !== 'running') return
      try {
        const osc = audioCtx.createOscillator()
        const chirpGain = audioCtx.createGain()
        osc.type = 'sine'

        const now = audioCtx.currentTime
        const baseFreq = 2400 + Math.random() * 800
        osc.frequency.setValueAtTime(baseFreq, now)
        osc.frequency.exponentialRampToValueAtTime(baseFreq + 600, now + 0.08)
        osc.frequency.exponentialRampToValueAtTime(baseFreq - 300, now + 0.18)

        chirpGain.gain.setValueAtTime(0.001, now)
        chirpGain.gain.linearRampToValueAtTime(0.04, now + 0.05)
        chirpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22)

        osc.connect(chirpGain)
        chirpGain.connect(masterGain)

        osc.start(now)
        osc.stop(now + 0.25)
      } catch {
        // Safe chirp ignore
      }
    }

    chirpInterval = setInterval(playChirp, 5000)
    return true
  } catch {
    return false
  }
}

export function stopNatureSound() {
  try {
    if (chirpInterval) {
      clearInterval(chirpInterval)
      chirpInterval = null
    }

    if (masterGain && audioCtx) {
      masterGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5)
      setTimeout(() => {
        try {
          if (noiseNode) {
            noiseNode.stop()
            noiseNode.disconnect()
            noiseNode = null
          }
          if (masterGain) {
            masterGain.disconnect()
            masterGain = null
          }
        } catch {
          // ignore
        }
      }, 500)
    }
  } catch {
    // ignore
  }
}

