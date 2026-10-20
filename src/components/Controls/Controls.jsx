import './Controls.scss'

const Controls = ({
  display,
  power,
  volume,
  heaterBank,
  onPowerChange,
  onVolumeChange,
  onBankChange,
}) => (
  <section className="controls" aria-label="Drum machine controls">
    <div id="display" role="status" aria-live="polite">{display}</div>

    <div className="volume-slider">
      <label htmlFor="volume-control">Volume <span>{Math.round(volume * 100)}%</span></label>
      <input
        type="range"
        id="volume-control"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(event) => onVolumeChange(Number(event.target.value))}
        aria-label="Master volume"
      />
    </div>

    <div className="control-section">
      <div className="control">
        <label className="select" htmlFor="power-toggle">
          <span className="control-label">
            <span>Power:</span>
            <span>{power ? 'On' : 'Off'}</span>
          </span>
          <span className="toggle-container">
            <input
              type="checkbox"
              id="power-toggle"
              checked={power}
              onChange={(event) => onPowerChange(event.target.checked)}
            />
            <span className="slider" />
          </span>
        </label>
      </div>

      <div className="control">
        <label className="select" htmlFor="bank-toggle">
          <span className="control-label">
            <span>Bank:</span>
            <span>{heaterBank ? 'Heater Kit' : 'Smooth Piano Kit'}</span>
          </span>
          <span className="toggle-container">
            <input
              type="checkbox"
              id="bank-toggle"
              checked={heaterBank}
              onChange={(event) => onBankChange(event.target.checked)}
              aria-label="Select drum kit"
            />
            <span className="slider" />
          </span>
        </label>
      </div>
    </div>
  </section>
)

export default Controls
