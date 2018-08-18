import React, { Component } from 'react';
import { DragSource } from "react-dnd";
import fire from './fire_drop.png';
import water from './water_drop.png';
import wood from './wood_drop.png';
import light from './light_drop.png';
import dark from './dark_drop.png';
import heart from './heart_drop.png';
import poison from './poison_drop.png';
import PropTypes from 'prop-types';
import { ItemTypes } from './Constants';

const knightSource = {
  beginDrag(props) {
    return {};
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

class Drop extends Component {
    render(){
        const { connectDragSource, isDragging } = this.props;
        var drop = null;
        switch(this.props.value){
            case 1:
                drop = fire;
                break;
            case 2:
                drop = water;
                break;
            case 3:
                drop = wood;
                break;
            case 4:
                drop = light;
                break;
            case 5:
                drop = dark;
                break;
            case 6:
                drop = heart;
                break;
            case 7:
                drop = poison;
                break;
            default:
                drop = ""
                break;
        }
        return connectDragSource(
//              <div style={{
//                opacity: isDragging ? 0 : 1,
//                fontSize: 25,
//                fontWeight: 'bold',
//                cursor: 'move'
//              }}>
                <img className="drop-image" src={drop} alt={drop}/>
//              </div>
        )
    }
}

Drop.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired
};

export default DragSource(ItemTypes.DROP,knightSource, collect)(Drop);