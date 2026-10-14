import React from 'react'
import './Pad.scss'

const Pad = () => {
  return (
    <div class="pad">
      <button className="pad_button" id="pad-button" type="button">Q</button>
      <button className="pad_button" id="pad-button" type="button">W</button>
      <button className="pad_button" id="pad-button" type="button">E</button>
      <button className="pad_button" id="pad-button" type="button">A</button>
      <button className="pad_button" id="pad-button" type="button">S</button>
      <button className="pad_button" id="pad-button" type="button">D</button>
      <button className="pad_button" id="pad-button" type="button">Z</button>
      <button className="pad_button" id="pad-button" type="button">X</button>
      <button className="pad_button" id="pad-button" type="button">C</button>
    </div>
  )
}

export default Pad