import './Pad.scss'

const Pad = ({ pads, activePads, disabled, onTrigger }) => (
  <div className="pad" role="group" aria-label="Drum pads">
    {pads.map(({ key, name }) => (
      <button
        className={`pad_button${activePads.includes(key) ? ' active' : ''}`}
        key={key}
        type="button"
        disabled={disabled}
        onClick={() => onTrigger(key)}
        aria-label={`${name}, keyboard ${key}`}
      >
        {key}
      </button>
    ))}
  </div>
)

export default Pad
