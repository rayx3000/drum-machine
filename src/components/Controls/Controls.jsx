import React from 'react'
import './Controls.scss'

const Controls = () => {
  return (
    <div className='controls'>
          <div id="display">READY</div>
          <div className="volume-slider">
            <label for="volume-control">Volume</label>
            <input type="range" id="volume-control" min="0" max="1" step="0.01" value="0.3" />
          </div>
          <div className="control-section">
            <div className="control">
              <label className="select">
                <span>
                  <span>Power:</span>
                  <span id="current-power">On</span>
                </span>
                <span className="toggle-container">
                  <input type="checkbox" id="power-toggle" checked="" />
                  <span className="slider"></span>
                </span>
              </label>
            </div>
            <div className="control">
              <label className="select">
                <span>
                  <span>Bank:</span>
                  <span id="current-bank">Heater Kit</span>
                </span>
                <span className="toggle-container">
                  <input type="checkbox" id="bank-toggle" checked="" />
                  <span className="slider"></span>
                </span>
              </label>
            </div>
          </div>
    </div>
  )
}

export default Controls