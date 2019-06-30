import React from 'react';
import './style.css';
import download from 'downloadjs';
import UPNG from 'upng-js';
import gifshot from 'gifshot';
import StartPage from '../StartPage/StartPage';
import Canvas from '../Canvas/Canvas';
import Tools from '../Tools/Tools';
import Preview from '../Preview/Preview';
import Frames from '../Frames/Frames';
import Header from '../Header/Header';
import Settings from '../Settings/Settings';
import { createFrame, createFrameCopy, createFramesCopy, resize, createStateCopy, saveToGoogleDrive, saveAsPiskel, uploadProject } from './utils';

export default class Piskel extends React.Component {
  constructor(props) {
    super(props);
    this.targetsToSwap = {
      firstTarget: null,
      secondTarget: null,
    };
    this.state = {
      projectIsStarted: false,
      canvasSize: 32,
      frames: [createFrame(32)],
      stateHistory: [],
      currentFrame: 0,
      framesToSaveAsGif: [],
      framesToSaveAsApng: [],
      animationSpeed: null,
      colors: {
        main: '#000000',
        extra: '#8080ff',
      },
      tools: {
        Pen: { value: false, shortcut: 'Q' },
        Mirror: { value: false, shortcut: 'W' },
        Bucket: { value: false, shortcut: 'E' },
        Eraser: { value: false, shortcut: 'R' },
        Brush: { value: false, shortcut: 'T' },
        Stroke: { value: false, shortcut: 'Y' },
        Rectangle: { value: false, shortcut: 'A' },
        Circle: { value: false, shortcut: 'S' },
        Move: { value: false, shortcut: 'D' },
        ColorPicker: { value: false, shortcut: 'F' },
        Lighten: { value: false, shortcut: 'G' },
        Dithering: { value: false, shortcut: 'H' },
        VerticalReverse: { value: false, shortcut: 'C' },
        HorizontalReverse: { value: false, shortcut: 'X' },
      },
    };
  }

  componentDidMount() {
    document.addEventListener('keypress', (e) => {
      if (e.keyCode === 26 && e.ctrlKey && this.state.stateHistory.length) this.stepBack();
    });
    if (localStorage.getItem('state')) this.setState({ ...JSON.parse(localStorage.getItem('state')) });
  }

  startProject() {
    this.setState({ projectIsStarted: true });
  }

  setFramesToSave(framesToSaveAsGif, framesToSaveAsApng, animationSpeed) {
    this.setState({ framesToSaveAsGif, framesToSaveAsApng, animationSpeed });
  }

  saveAsGif() {
    gifshot.createGIF({
      images: this.state.framesToSaveAsGif,
      interval: 1 / this.state.animationSpeed,
      gifWidth: 384,
      gifHeight: 384,
    }, (obj) => {
      if (!obj.error) download(obj.image, 'newGif.gif', 'gif');
    });
  }

  saveToLocalStorage() {
    localStorage.clear();
    localStorage.setItem('state', JSON.stringify(this.state));
  }

  saveAsApng() {
    const imageData = UPNG.encode(this.state.framesToSaveAsApng, 384, 384, 0, new Array(this.state.framesToSaveAsApng.length).fill(1000 / this.state.animationSpeed));
    download(imageData, 'newAPNG.apng', 'apng');
  }

  saveAsPiskel() {
    download(saveAsPiskel(1 / this.state.animationSpeed, 384, this.state.framesToSaveAsGif.length, this.state.framesToSaveAsGif), 'newPiskel.piskel', 'piskel');
  }

  saveAsRss() {
    download(JSON.stringify(createStateCopy(this.state, this.state.frames)), 'project.rss', 'rss');
  }

  saveToGoogleDrive() {
    saveToGoogleDrive(UPNG.encode(this.state.framesToSaveAsApng, 384, 384, 0, new Array(this.state.framesToSaveAsApng.length).fill(1000 / this.state.animationSpeed)));
  }

  importRssFile() {
    const updateState = data => this.setState({ ...JSON.parse(data), stateHistory: [] });
    uploadProject(updateState);
  }

  stepBack() {
    const step = this.state.stateHistory.pop();
    const { speed, canvasSize, frames, currentFrame, colors, tools } = step;
    this.setState({ speed, canvasSize, frames, currentFrame, colors, tools });
  }

  saveCurrentState() {
    const stateCopy = createStateCopy(this.state, this.state.frames);
    const stateHistory = createFramesCopy(this.state.stateHistory);
    if (stateHistory.length > 5) stateHistory.shift();
    stateHistory.push(stateCopy);
    return stateHistory;
  }

  resize(canvasSize) {
    let frames = createFramesCopy(this.state.frames);
    const stateHistory = this.saveCurrentState();
    frames = resize(frames, this.state.canvasSize, canvasSize);
    this.setState({ frames, canvasSize, stateHistory });
  }

  updateFrames(frame) {
    const { currentFrame } = this.state
    if (JSON.stringify(this.state.frames[currentFrame]) === JSON.stringify(frame)) return false;
    const frames = createFramesCopy(this.state.frames);
    const stateHistory = this.saveCurrentState();
    frames[currentFrame] = frame;
    this.setState({ frames, stateHistory });
  }

  setCurrentFrame(frame) {
    const stateHistory = this.saveCurrentState();
    const currentFrame = this.state.frames.indexOf(frame);
    this.setState({ currentFrame, stateHistory });
  }

  addFrame() {
    let { canvasSize, currentFrame } = this.state;
    const frames = createFramesCopy(this.state.frames);
    const stateHistory = this.saveCurrentState();
    frames.push(createFrame(canvasSize));
    currentFrame += 1;
    this.setState({ frames, currentFrame, stateHistory });
  }

  deleteFrame(frame) {
    let { canvasSize, currentFrame } = this.state;
    const frames = createFramesCopy(this.state.frames);
    const stateHistory = this.saveCurrentState();
    if (frames.length === 1) {
      this.setState({ frames: [createFrame(canvasSize)], stateHistory });
    } else {
      const index = this.state.frames.indexOf(frame);
      if (currentFrame !== 0) currentFrame -= 1;
      frames.splice(index, 1);
      this.setState({ frames, currentFrame });
    }
  }

  cloneFrame(frame) {
    const frames = createFramesCopy(this.state.frames);
    const stateHistory = this.saveCurrentState();
    let { currentFrame } = this.state;
    currentFrame += 1;
    frames.splice(this.state.frames.indexOf(frame), 0, createFrameCopy(frame));
    this.setState({ frames, currentFrame, stateHistory });
  }

  setColor(value, isMain) {
    const { colors } = this.state;
    const stateHistory = this.saveCurrentState();
    if (isMain) {
      this.setState({
        stateHistory,
        colors: {
          main: value,
          extra: colors.extra,
        },
      });
    } else {
      this.setState({
        stateHistory,
        colors: {
          main: colors.main,
          extra: value,
        },
      });
    }
  }

  swapColors() {
    const { colors } = this.state;
    const stateHistory = this.saveCurrentState();
    this.setState({ colors: { main: colors.extra, extra: colors.main }, stateHistory });
  }

  setTools(tool) {
    const tools = Object.assign({}, this.state.tools);
    tools[tool].value = !tools[tool].value;
    for (const key in tools) {
      if (key !== tool) {
        tools[key].value = false;
      }
    }
    this.setState({
      tools,
    });
  }

  updateShortcuts(value) {
    this.setState({ tools: value });
  }

  setTargetToSwap(frame, first) {
    const { targetsToSwap } = this;
    if (first) targetsToSwap.firstTarget = frame;
    else targetsToSwap.secondTarget = frame;
  }

  swapFrames() {
    const { targetsToSwap } = this;
    if (!targetsToSwap.secondTarget || targetsToSwap.firstTarget === targetsToSwap.secondTarget) return;
    const stateHistory = this.saveCurrentState();
    const frames = createFramesCopy(this.state.frames);
    frames.splice(this.state.frames.indexOf(targetsToSwap.firstTarget), 1, targetsToSwap.secondTarget);
    frames.splice(this.state.frames.indexOf(targetsToSwap.secondTarget), 1, targetsToSwap.firstTarget);
    this.setState({ frames, stateHistory });
  }

  render() {
    return (
      <div>
        <Header />
        {!this.state.projectIsStarted && <StartPage startProject={() => this.startProject()} />}
        {this.state.projectIsStarted && (
          <div className="container">
            <Tools
              tools={this.state.tools}
              setTools={tool => this.setTools(tool)}
              setColor={(value, isMain) => this.setColor(value, isMain)}
              swapColors={() => this.swapColors()}
              colors={this.state.colors}
              updateShortcuts={value => this.updateShortcuts(value)}
            />
            <Frames
              currentFrame={this.state.currentFrame}
              canvasSize={this.state.canvasSize}
              frames={this.state.frames}
              addFrame={() => this.addFrame()}
              deleteFrame={frame => this.deleteFrame(frame)}
              cloneFrame={frame => this.cloneFrame(frame)}
              setCurrentFrame={frame => this.setCurrentFrame(frame)}
              setTargetToSwap={(frame, first) => this.setTargetToSwap(frame, first)}
              swapFrames={() => this.swapFrames()}
            />
            <Canvas
              frames={createFramesCopy(this.state.frames)}
              setMousePosition={value => this.setMousePosition(value)}
              canvasSize={this.state.canvasSize}
              tools={this.state.tools}
              colors={this.state.colors}
              updateFrames={frame => this.updateFrames(frame)}
              frame={createFrameCopy(this.state.frames[this.state.currentFrame])}
              setColor={(value, isMain) => this.setColor(value, isMain)}
            />
            <Preview
              frames={this.state.frames}
              canvasSize={this.state.canvasSize}
              setFramesToSave={(gif, png, speed) => this.setFramesToSave(gif, png, speed)}
            />
            <Settings
              saveAsApng={() => this.saveAsApng()}
              saveAsGif={() => this.saveAsGif()}
              saveToGoogleDrive={() => this.saveToGoogleDrive()}
              saveToLocalStorage={() => this.saveToLocalStorage()}
              saveAsPiskel={() => this.saveAsPiskel()}
              resize={canvasSize => this.resize(canvasSize)}
              canvasSize={this.state.canvasSize}
              saveAsRss={() => this.saveAsRss()}
              importRssFile={() => this.importRssFile()}
            />
          </div>
        )}
      </div>
    );
  }
}
