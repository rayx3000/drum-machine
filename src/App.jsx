import './App.scss'
import Controls from './components/Controls/Controls'
import Pad from './components/Pad/Pad'

function App() {

  return (
    <div class="app">
      <div class="drum-machine">
        <Pad />
        <Controls />
      </div>
    </div>
  )
}

export default App
