import React from 'react'
import './Controls.scss'

const Controls = () => {
  return (
    <div className='controls'>
          <div id="display">READY</div>
          <div class="volume-slider">
            <label for="volume-control">Volume</label>
            <input type="range" id="volume-control" min="0" max="1" step="0.01" value="0.3" />
          </div>
          <div class="control-section">
            <div class="control">
            <label class="select">
              <span>
                <span>Power:</span>
                <span id="current-power">On</span>
              </span>
              <span class="toggle-container">
                <input type="checkbox" id="power-toggle" checked="" />
                <span class="slider"></span>
              </span>
            </label>
          </div>
          <div class="control">
            <label class="select">
              <span>
                <span>Bank:</span>
                <span id="current-bank">Heater Kit</span>
              </span>
              <span class="toggle-container">
                <input type="checkbox" id="bank-toggle" checked="" />
                <span class="slider"></span>
              </span>
            </label>
          </div>
          </div>
    </div>
  )
}

export default Controls