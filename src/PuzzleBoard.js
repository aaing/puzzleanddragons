import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Drop from './Drop'
import Square from './Square'
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

class PuzzleBoard extends Component {
  static propTypes = {
    knightPosition: PropTypes.arrayOf(
      PropTypes.number.isRequired
    ).isRequired
  };

  renderSquare(i){
    const dropNum = Math.floor( Math.random() * 6 + 1);
    const x = i % 6;
    const y = Math.floor(i / 6);
    const black = (x + y) % 2 === 1;
    console.log(x+","+y)

    const [knightX, knightY] = this.props.knightPosition;
    const piece =  <Drop value={dropNum} />;

    return (
      <div key={i}
           style={{ width: '16.6%', height: '20%' }}>
        <Square black={black}>
          {piece}
        </Square>
      </div>
    );
  }

  render() {
      const squares = [];
      for (let i = 0; i < 30; i++) {
        squares.push(this.renderSquare(i));
      }
    return (
    <div className="main" style={{
               display: 'flex',
               flexWrap: 'wrap'
             }}>
               {squares}
             </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(PuzzleBoard);