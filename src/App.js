import React, { Component } from 'react';
import './App.css';

let buffer = [];

const AudioContext = new (window.AudioContext || window.webkitAudioContext);

const URL = 'http://airspectrum.cdnstream1.com:8024/1302_192';
// const URL = '/test.mp3';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRecording: false,
      isPlaying: false,
    };

    this.audio = null;
    this.mediaStream = null;
    this.recorder = null;
  }

  componentDidMount() {
    this.audio = new Audio();
    this.audio.crossOrigin = 'Anonymous';
    this.audio.src = URL;

    this.mediaStream = this.audio.captureStream();
    this.recorder = new MediaRecorder(this.mediaStream);

    this.recorder.ondataavailable = function(e) {
      buffer.push(e.data);
    }

    this.recorder.onstop = (e) => {
      this.audio.pause();

      var blob = new Blob(buffer, { 'type' : 'audio/ogg; codecs=opus' });
      buffer = [];

      console.log(blob);
      const recordedAudio = new Audio();
      recordedAudio.src = window.URL.createObjectURL(blob);
      recordedAudio.loop = true;
      recordedAudio.play();
    }
  }

  toggleRecord = () => {
    this.setState({
      isRecording: !this.state.isRecording,
    }, () => {
      if (this.state.isRecording) {
        this.recorder.start();
      } else {
        this.recorder.stop();
      }
    });
  }

  togglePlay = () => {
    const { isPlaying } = this.state;
    isPlaying ? this.audio.pause() : this.audio.play();
    this.setState({
      isPlaying: !isPlaying,
    });
  }

  render() {
    const { isPlaying, isRecording } = this.state;

    return (
      <div className="App">
        <button onClick={this.togglePlay}>
          {isPlaying ? 'Stop' : 'Play'}
        </button>
        <button onClick={this.toggleRecord}>
          {isRecording ? 'Stop' : 'Record'}
        </button>
      </div>
    );
  }
}

export default App;
