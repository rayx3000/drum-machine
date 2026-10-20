import { useCallback, useEffect, useRef, useState } from 'react'
import './App.scss'
import Controls from './components/Controls/Controls'
import Pad from './components/Pad/Pad'

const DRUM_PADS = [
  { key: 'Q', name: 'Kick', type: 'kick' },
  { key: 'W', name: 'Snare', type: 'snare' },
  { key: 'E', name: 'Closed Hat', type: 'hat' },
  { key: 'A', name: 'Clap', type: 'clap' },
  { key: 'S', name: 'Low Tom', type: 'tom', pitch: 105 },
  { key: 'D', name: 'Open Hat', type: 'openHat' },
  { key: 'Z', name: 'Mid Tom', type: 'tom', pitch: 155 },
  { key: 'X', name: 'Rim', type: 'rim' },
  { key: 'C', name: 'High Tom', type: 'tom', pitch: 220 },
]

const BANKS = {
  heater: {
    label: 'Heater Kit',
    kick: { start: 155, end: 43, decay: 0.52, level: 0.9 },
    snare: { tone: 185, noise: 0.28, decay: 0.22, level: 0.65, filter: 1700 },
    hat: { decay: 0.055, level: 0.28, filter: 8500 },
    openHat: { decay: 0.38, level: 0.32, filter: 7200 },
    clap: { decay: 0.24, level: 0.42, filter: 1450 },
    tom: { decay: 0.34, level: 0.58 },
    rim: { pitch: 620, decay: 0.11, level: 0.48 },
  },
  smooth: {
    label: 'Smooth Piano Kit',
    kick: { start: 112, end: 52, decay: 0.68, level: 0.78 },
    snare: { tone: 245, noise: 0.18, decay: 0.3, level: 0.53, filter: 1100 },
    hat: { decay: 0.085, level: 0.2, filter: 10200 },
    openHat: { decay: 0.48, level: 0.24, filter: 9000 },
    clap: { decay: 0.31, level: 0.3, filter: 2100 },
    tom: { decay: 0.48, level: 0.48 },
    rim: { pitch: 880, decay: 0.16, level: 0.36 },
  },
}

function createNoiseBuffer(audioContext, duration) {
  const frameCount = Math.ceil(audioContext.sampleRate * duration)
  const buffer = audioContext.createBuffer(1, frameCount, audioContext.sampleRate)
  const data = buffer.getChannelData(0)

  for (let index = 0; index < frameCount; index += 1) {
    data[index] = Math.random() * 2 - 1
  }

  return buffer
}

function playNoise(audioContext, output, { duration, level, filter, bursts = 1 }) {
  const now = audioContext.currentTime
  const source = audioContext.createBufferSource()
  const tone = audioContext.createBiquadFilter()
  const envelope = audioContext.createGain()

  source.buffer = createNoiseBuffer(audioContext, duration)
  tone.type = 'highpass'
  tone.frequency.setValueAtTime(filter, now)
  tone.connect(envelope)
  envelope.connect(output)

  if (bursts === 1) {
    envelope.gain.setValueAtTime(level, now)
    envelope.gain.exponentialRampToValueAtTime(0.001, now + duration)
  } else {
    envelope.gain.setValueAtTime(0.001, now)
    for (let burst = 0; burst < bursts; burst += 1) {
      const start = now + burst * 0.035
      envelope.gain.setValueAtTime(0.001, start)
      envelope.gain.linearRampToValueAtTime(level, start + 0.006)
      envelope.gain.exponentialRampToValueAtTime(0.001, start + 0.03)
    }
    envelope.gain.setValueAtTime(0.001, now + duration)
  }

  source.connect(tone)
  source.start(now)
  source.stop(now + duration)
}

function playDrum(audioContext, output, pad, bank) {
  const now = audioContext.currentTime

  if (pad.type === 'kick') {
    const oscillator = audioContext.createOscillator()
    const envelope = audioContext.createGain()
    const sound = bank.kick

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(sound.start, now)
    oscillator.frequency.exponentialRampToValueAtTime(sound.end, now + sound.decay)
    envelope.gain.setValueAtTime(sound.level, now)
    envelope.gain.exponentialRampToValueAtTime(0.001, now + sound.decay)
    oscillator.connect(envelope)
    envelope.connect(output)
    oscillator.start(now)
    oscillator.stop(now + sound.decay)
    return
  }

  if (pad.type === 'snare') {
    const sound = bank.snare
    const body = audioContext.createOscillator()
    const bodyEnvelope = audioContext.createGain()
    body.type = 'triangle'
    body.frequency.setValueAtTime(sound.tone, now)
    bodyEnvelope.gain.setValueAtTime(sound.level * 0.45, now)
    bodyEnvelope.gain.exponentialRampToValueAtTime(0.001, now + sound.decay * 0.7)
    body.connect(bodyEnvelope)
    bodyEnvelope.connect(output)
    body.start(now)
    body.stop(now + sound.decay * 0.7)
    playNoise(audioContext, output, {
      duration: sound.decay,
      level: sound.noise,
      filter: sound.filter,
    })
    return
  }

  if (pad.type === 'hat' || pad.type === 'openHat') {
    const sound = bank[pad.type]
    playNoise(audioContext, output, {
      duration: sound.decay,
      level: sound.level,
      filter: sound.filter,
    })
    return
  }

  if (pad.type === 'clap') {
    const sound = bank.clap
    playNoise(audioContext, output, {
      duration: sound.decay,
      level: sound.level,
      filter: sound.filter,
      bursts: 4,
    })
    return
  }

  const sound = bank[pad.type]
  const oscillator = audioContext.createOscillator()
  const envelope = audioContext.createGain()
  const pitch = pad.type === 'rim' ? sound.pitch : pad.pitch

  oscillator.type = pad.type === 'rim' ? 'triangle' : 'sine'
  oscillator.frequency.setValueAtTime(pitch, now)
  oscillator.frequency.exponentialRampToValueAtTime(pitch * 0.45, now + sound.decay)
  envelope.gain.setValueAtTime(sound.level, now)
  envelope.gain.exponentialRampToValueAtTime(0.001, now + sound.decay)
  oscillator.connect(envelope)
  envelope.connect(output)
  oscillator.start(now)
  oscillator.stop(now + sound.decay)
}

function App() {
  const audioContextRef = useRef(null)
  const activeTimeoutsRef = useRef(new Map())
  const [power, setPower] = useState(true)
  const [heaterBank, setHeaterBank] = useState(true)
  const [volume, setVolume] = useState(0.3)
  const [display, setDisplay] = useState('READY')
  const [activePads, setActivePads] = useState([])

  const triggerPad = useCallback((key) => {
    if (!power) return

    const pad = DRUM_PADS.find((item) => item.key === key)
    if (!pad) return

    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (AudioContextClass) {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContextClass()
      }

      const audioContext = audioContextRef.current
      if (audioContext.state === 'suspended') audioContext.resume()

      const output = audioContext.createGain()
      output.gain.setValueAtTime(volume, audioContext.currentTime)
      output.connect(audioContext.destination)
      playDrum(audioContext, output, pad, heaterBank ? BANKS.heater : BANKS.smooth)
    }

    setDisplay(pad.name.toUpperCase())
    setActivePads((currentPads) => currentPads.includes(key) ? currentPads : [...currentPads, key])

    const previousTimeout = activeTimeoutsRef.current.get(key)
    if (previousTimeout) window.clearTimeout(previousTimeout)
    const timeout = window.setTimeout(() => {
      setActivePads((currentPads) => currentPads.filter((activeKey) => activeKey !== key))
      activeTimeoutsRef.current.delete(key)
    }, 140)
    activeTimeoutsRef.current.set(key, timeout)
  }, [heaterBank, power, volume])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.repeat || event.altKey || event.ctrlKey || event.metaKey) return
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) return

      const key = event.key.toUpperCase()
      if (DRUM_PADS.some((pad) => pad.key === key)) {
        event.preventDefault()
        triggerPad(key)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [triggerPad])

  useEffect(() => () => {
    activeTimeoutsRef.current.forEach((timeout) => window.clearTimeout(timeout))
    audioContextRef.current?.close()
  }, [])

  const handlePowerChange = (isOn) => {
    setPower(isOn)
    setDisplay(isOn ? 'READY' : 'POWER OFF')
    if (!isOn) setActivePads([])
  }

  const handleBankChange = (isHeaterBank) => {
    setHeaterBank(isHeaterBank)
    setDisplay(isHeaterBank ? BANKS.heater.label.toUpperCase() : BANKS.smooth.label.toUpperCase())
  }

  return (
    <div className="app">
      <div className="drum-machine">
        <Pad pads={DRUM_PADS} activePads={activePads} disabled={!power} onTrigger={triggerPad} />
        <Controls
          display={display}
          power={power}
          volume={volume}
          heaterBank={heaterBank}
          onPowerChange={handlePowerChange}
          onVolumeChange={setVolume}
          onBankChange={handleBankChange}
        />
      </div>
    </div>
  )
}

export default App
