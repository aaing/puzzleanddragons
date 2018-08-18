import React, { Component } from 'react';
import './App.css';
import illumina from './illumina.png';
import fenrir from './fenrir.png';
import PuzzleBoard from './PuzzleBoard'

class App extends Component {
  render() {
    return (
      <div className="App">

          <header className="header">
            <img className="header_image_left" src={illumina}/>
            <div className="title">
                <h1>パズルシミュレーション</h1>
            </div>
            <img className="header_image_right" src={fenrir}/>
          </header>

           <div className="left-sub">
             <h2>リンク</h2>
             <a href="7x6.html">7x6</a>
           </div>

           <PuzzleBoard knightPosition={[0, 0]}/>

           <div className="right-sub">
                <div className="selected_drop">
                    <h2>ドロップ選択</h2>
                </div>
           </div>
      </div>
    );
  }
}

export default App;
