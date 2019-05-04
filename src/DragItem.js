import React, { Component } from 'react';
import { DragSource, DropTarget } from 'react-dnd'

// ドラッグされるSourceの動作を定義する
const dragSource = DragSource("item", {
  beginDrag(props) {
    return props;
  }

}, (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  };
})

// ドロップされるTargetの動作を定義する
const dropTarget = DropTarget("item", {
  drop(dropProps, monitor) {
    dropProps.onDrop();
  },
  hover(dropProps, monitor) {
    const dragProps = monitor.getItem();
    if (dropProps.id !== dragProps.id) {
      dragProps.onHover(dragProps.id, dropProps.id);
    }
  }
}, (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  };
})

class DragItem extends Component {
  constructor(props) {
    super(props)
  }

  getItemStyles() {
    const { isDragging, isOver } = this.props;

    return {
      width: '100px' ,
      height: '100px' ,
      'backgroundColor': isOver ? 'blue' : this.props.color,
      float: 'left',
      borderRadius: '100px',
      opacity: isDragging ? 0.4 : 1,
    }
  }

  // getItemName(){
  //   const { isDragging, isOver, targetName, sourceName } = this.props;
  //   if(isOver) {
  //     return sourceName
  //   } else if (isDragging) {
  //     return targetName;
  //   } else {
  //     return this.props.name;
  //   }
  // }

  render() {
    return this.props.connectDragSource(
      this.props.connectDropTarget(
        <div style={this.getItemStyles()}>
          {this.props.name}
        </div>
      )
    )
  }
}

export default dragSource(dropTarget(DragItem));
