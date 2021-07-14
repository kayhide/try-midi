import { useState, useEffect } from 'react';

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
    <div className="w-full h-screen flex flex-col bg-gray-200">
      <div className="flex-grow flex items-center justify-center space-x-2">
        <div>
          <button className="px-4 py-2 border border-gray-400 rounded" onClick={play(0x45)}>C</button>
          <button className="px-4 py-2 border border-gray-400 rounded" onClick={play(0x47)}>D</button>
          <button className="px-4 py-2 border border-gray-400 rounded" onClick={play(0x48)}>D+</button>
          <button className="px-4 py-2 border border-gray-400 rounded" onClick={play(0x49)}>E</button>
          <button className="px-4 py-2 border border-gray-400 rounded" onClick={play(0x4a)}>F</button>
          <button className="px-4 py-2 border border-gray-400 rounded" onClick={play(0x4c)}>G</button>
          <button className="px-4 py-2 border border-gray-400 rounded" onClick={play(0x4e)}>A</button>
          <button className="px-4 py-2 border border-gray-400 rounded" onClick={play(0x50)}>B</button>
          <button className="px-4 py-2 border border-gray-400 rounded" onClick={play(0x51)}>C</button>
        </div>
      </div>
      <div className="flex-none flex justify-center">
        <div className="m-2 p-4 border border-gray-400 rounded shadow space-x-4">
          <Outputs options={outputOptions} value={outputId} />
          <Channels value={channel} onSelect={(c) => setChannel(_ => Number.parseInt(c))} />
        </div>
      </div>
    </div>
  );
}

export default App;
