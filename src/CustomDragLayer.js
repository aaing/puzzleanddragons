import * as React from 'react'
import { DragLayer } from 'react-dnd'

function getStyle() {
  return {
    position: 'fixed',
    pointerEvents: 'none',
    top: 0,
    left: 0,
    width: '15vw',
    height: '15vw',
  }
}

function collect(monitor) {
  return {
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  }
}

class CustomDragLayer extends React.Component {
  getItemStyles(currentOffset, color) {
    if (!currentOffset) {
      return {
        display: 'block',
        width: '15vw',
        height: '15vw',
      }
    }

    // move position
    const x = currentOffset.x
    const y = currentOffset.y
    const transform = `translate(${x}px, ${y}px) scale(1)`

    return {
      WebkitTransform: transform,
      transform: transform,
      width: '15vw',
      height: '15vw',
      borderRadius: '15vw',
      backgroundColor: color
    }
  }

  render() {
    const { item, itemType, isDragging, currentOffset } = this.props

    if (!isDragging) {
      return null
    }

    // render
    if (itemType === 'item') {
      return (
        <div style={getStyle()}>
          <div style={this.getItemStyles(currentOffset, item.color)}>
            {item.name}
          </div>
        </div>
      )
    }
    return null;
  }
}

export default DragLayer(collect)(CustomDragLayer)
