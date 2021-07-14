import { useState, useEffect } from "react";

function Outputs(props) {
  const items = props.options.map((o) => (
    <option value={o.id}>{o.name}</option>
  ));
  return <select value={props.value}>{items}</select>;
}

function Channels(props) {
  const items = Array(16)
    .fill()
    .map((_, i) => <option value={i}>{i}</option>);
  return (
    <select
      value={props.value}
      onChange={(e) => props.onSelect(e.target.value)}
    >
      {items}
    </select>
  );
}

function KeyWhite(props) {
  return (
    <button
      className="px-6 py-16 border border-gray-400 rounded bg-gray-100"
      onClick={(_) => props.onPlay(props.note)}
    >
      {props.text}
    </button>
  );
}

function KeyBlack(props) {
  return (
    <button
      className="w-8 h-36 px-3 py-16 border border-gray-400 rounded bg-gray-700"
      onClick={(_) => props.onPlay(props.note)}
    >
      {props.text}
    </button>
  );
}

function Keyboard(props) {
  const base = props.base;
  const play = (note) => (_) => props.onPlay(note);
  return (
    <div className="relative w-96 h-60">
      <div className="absolute inset-0 grid grid-cols-7 justify-items-stretch">
        <KeyWhite text="" note={base + 0} onPlay={props.onPlay} />
        <KeyWhite text="" note={base + 2} onPlay={props.onPlay} />
        <KeyWhite text="" note={base + 4} onPlay={props.onPlay} />
        <KeyWhite text="" note={base + 5} onPlay={props.onPlay} />
        <KeyWhite text="" note={base + 7} onPlay={props.onPlay} />
        <KeyWhite text="" note={base + 9} onPlay={props.onPlay} />
        <KeyWhite text="" note={base + 11} onPlay={props.onPlay} />
      </div>
      <div className="absolute inset-x-0 px-8 grid grid-cols-6 justify-items-center">
        <KeyBlack text="" note={base + 1} onPlay={props.onPlay} />
        <KeyBlack text="" note={base + 3} onPlay={props.onPlay} />
        <div />
        <KeyBlack text="" note={base + 6} onPlay={props.onPlay} />
        <KeyBlack text="" note={base + 8} onPlay={props.onPlay} />
        <KeyBlack text="" note={base + 10} onPlay={props.onPlay} />
      </div>
    </div>
  );
}

function App() {
  const [outputs, setOutputs] = useState([]);
  const [output, setOutput] = useState(null);
  const [channel, setChannel] = useState(0);
  useEffect(() => {
    navigator
      .requestMIDIAccess({ sysex: true })
      .then((midiAccess) => {
        setOutputs((_) => Array.from(midiAccess.outputs.values()));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const outputOptions = outputs.map(({ id, name }) => ({ id, name }));
  const outputId = output && output.id;

  useEffect(() => {
    if (0 < outputs.length) {
      setOutput((_) => outputs[outputs.length - 1]);
    }
  }, [outputs]);

  const play = (note, delay = 0) => {
    if (output) {
      const now = window.performance.now();
      console.log({ now, note });
      output.send([0x90 + channel, note, 0x7f], now + delay);
      output.send([0x80 + channel, note, 0x00], now + delay + 1000);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-gray-200">
      <div className="flex-grow flex items-center justify-center">
        <Keyboard base={0x39} onPlay={play} />
        <Keyboard base={0x45} onPlay={play} />
        <Keyboard base={0x51} onPlay={play} />
        <Keyboard base={0x5d} onPlay={play} />
      </div>
      <div className="flex-none flex justify-center">
        <div className="m-2 p-4 border border-gray-400 rounded shadow space-x-4">
          <Outputs options={outputOptions} value={outputId} />
          <Channels
            value={channel}
            onSelect={(c) => setChannel((_) => Number.parseInt(c))}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
