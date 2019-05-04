import * as React from 'react'
import { DragLayer } from 'react-dnd'

function getStyle() {
  return {
    position: 'fixed',
    pointerEvents: 'none',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
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
        width: '100px',
        height: '100px',
      }
    }

    // move position
    const x = currentOffset.x
    const y = currentOffset.y
    const transform = `translate(${x}px, ${y}px) scale(1.05)`

    return {
      WebkitTransform: transform,
      transform: transform,
      width: '100px',
      height: '100px',
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
