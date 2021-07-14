import { useState, useEffect } from 'react';
import './App.css';

function Outputs(props) {
  const items = props.options.map(o => <option value={o.id}>{o.name}</option>);
  return (<select value={props.value}>{items}</select>)
}

function Channels(props) {
  const items = Array(16).fill().map((_, i) => <option value={i}>{i}</option>);
  return (<select value={props.value} onChange={e => props.onSelect(e.target.value)}>{items}</select>)
}

function App() {
  const [outputs, setOutputs] = useState([]);
  const [output, setOutput] = useState(null);
  const [channel, setChannel] = useState(0);
  useEffect(() => {
    navigator.requestMIDIAccess({sysex: true})
      .then((midiAccess) => {
        setOutputs(_ => Array.from(midiAccess.outputs.values()));
      })
      .catch((err) => { console.log(err) })
  }, []);

  const outputOptions = outputs.map(({ id, name }) => ({ id, name }));
  const outputId = output && output.id

  useEffect(() => {
    if (0 < outputs.length) {
      setOutput(_ => outputs[outputs.length - 1])
    }
  }, [outputs]);

  const play = (note, delay = 0) => (e) => {
    if (output) {
      const now = window.performance.now();
      console.log({now, note})
      output.send([0x90 + channel, note, 0x7f], now + delay);
      output.send([0x80 + channel, note, 0x00], now + delay + 1000);
    }
  }

  return (
    <div className="App">
      <div className="App-keyboard">
        <button onClick={play(0x45)}>C</button>
        <button onClick={play(0x47)}>D</button>
        <button onClick={play(0x48)}>D+</button>
        <button onClick={play(0x49)}>E</button>
        <button onClick={play(0x4a)}>F</button>
        <button onClick={play(0x4c)}>G</button>
        <button onClick={play(0x4e)}>A</button>
      </div>
      <div className="App-controls">
        <Outputs options={outputOptions} value={outputId} />
        <Channels value={channel} onSelect={(c) => setChannel(_ => Number.parseInt(c))} />
      </div>
    </div>
  );
}

export default App;
