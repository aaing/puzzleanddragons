import React, {Component} from 'react';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend';
import DragItem from './DragItem';
import CustomDragLayer from './CustomDragLayer';

// クラス内変数
let items;
const x = 6; // 横方向要素数
const y = 5; // 縦方向要素数

class SortableList extends Component {

  constructor(props) {
    super(props);
    this.state = setItem(x, y);
  }

  // ドロップ時挙動
  onDrop = () => {
    items = this.state.items.slice();
    this.combo = calcCombo(items);
    // 0コンボなら処理をスキップ
    if(this.combo.length === 0) {
      return;
    }

    // デバッグ用ログ
    console.log('盤面');
    console.table(items);
    this.combo.forEach((combo, index) => {
      console.log(`${index + 1}combo`);
      console.log(combo);
    });

    // コンボごとにタイミングをずらして処理
    this.interval = setInterval(this.comboRecursive, 500);
  };

  // 再帰コンボ処理
  comboRecursive = () => {
    // 0コンボかすべて処理済みなら再帰を止める
    if (this.combo.length === 0) {
      clearInterval(this.interval);
      this.fall();
      this.onDrop();
    } else {
      // 消す処理
      this.combo[0].forEach(id => {
        items[id].color = 'white'
      });
      this.setState({items});
      this.combo.shift();
    }
  };

  // 落下処理
  fall() {
    let counts = []; // 列ごと消えた個数配列
    let length = items.length;
    // 消えた個数を格納
    items.forEach(function (item, index, items) {
      counts.push(items.filter(function (item2, i) {
        return item2.color === 'white' && (i - index) % 6 === 0 && i > index
      }).length);
    });
    // 最下段以外のアイテムに対し逆順で落とす処理
    // 下から処理しないとcolorが上書きされて後で取れない
    // colorTmp用意すべきかも
    for(let i = 6;i <= length;i++) {
      if(counts[length - i] !== 0) {
        items[(length - i) + 6 * counts[length - i]].color = items[length - i].color;
        items[length - i].color = 'white';
      }
    }
    this.setState({items});
  }

  // ホバー時挙動
  onHover = (toId, fromId) => {
    items = this.state.items.slice();
    const toIndex = items.findIndex(i => i.id === toId);
    const fromIndex = items.findIndex(i => i.id === fromId);
    const toItem = items[toIndex];
    const fromItem = items[fromIndex];
    items[toIndex] = fromItem;
    items[fromIndex] = toItem;
    this.setState({items})
  };

  render() {
    return (
      <div style={setStyle(6, 5)}>
        {(isAndroid() || isIOS()) && <CustomDragLayer/>}
        {
          this.state.items.map(item => {
            return (
              <DragItem
                key={item.id}
                id={item.id}
                onHover={this.onHover.bind(this)}
                onDrop={this.onDrop.bind(this)}
                name={item.name}
                color={item.color}
              />
            )
          })
        }
      </div>
    )
  }
}

/**
 * アイテム色をランダムで取得
 * @return color文字列
 */
function getColor() {
  // アイテムは max種類
  const max = 6;
  const min = 1;
  const rand = Math.floor(Math.random() * (max + 1 - min)) + min;
  let color;
  switch (rand) {
    case 1:
      color = 'red';
      break;
    case 2:
      color = 'blue';
      break;
    case 3:
      color = 'green';
      break;
    case 4:
      color = 'yellow';
      break;
    case 5:
      color = 'purple';
      break;
    default:
      color = 'pink';
      break;
  }
  return color;
}

/**
 * アイテムリスト取得
 * @param x
 * @param y
 */
function setItem(x, y) {
  let itemList = {};
  let item = [];
  for (let i = 1; i <= x * y; i++) {
    // name は現状使ってないけど後で何か利用したいかも
    item.push({id: i, name: "", color: getColor()});
  }
  itemList.items = item;
  return itemList;
}

/**
 * 盤面のスタイル取得
 * @param x
 * @param y
 * @returns {{width: string, height: string}}
 */
function setStyle(x, y) {
  return {
    // width: `${x * 100}px`,
    // height: `${y * 100}px`
    width: '90vw',
    height: '75vw'

  }
}

/**
 * コンボ計算
 * @param items
 * @returns Array[Set]
 */
function calcCombo(items) {
  let allCombo = []; // 消すアイテム
  items.forEach(item => item.checked = false); //初期化

  // 各アイテムに対して探索
  for (let i = 0; i < items.length; i++) {
    // 消えているなら探索済みとする
    if(items[i].color === 'white'){
      items[i].checked = true;
    }
    // 探索済みならスキップ
    if (items[i].checked !== true) {
      let combo = [];
      let neighbors = [];
      neighbors.push(i);
      checkRecursive(i, items, neighbors); // 隣接アイテム取得
      // 消える可能性があるなら処理
      if (neighbors.length > 2) {
        neighbors.forEach(id => {
          // 〇〇〇と3つ以上つながるか判定したい
          // 真ん中のアイテムに対して上下もしくは左右 同色に挟まれているか判定
          if (neighbors.includes(id + 1) && neighbors.includes(id - 1)) {
            combo.push(id, id + 1, id - 1)
          }
          if (neighbors.includes(id + 6) && neighbors.includes(id - 6)) {
            combo.push(id, id + 6, id - 6)
          }
        });
      }
      // あるなら追加
      if (combo.length !== 0) {
        allCombo.push(new Set(combo));
      }
      // console.log(neighbors);
    }
  }
  // console.table(check);
  return allCombo;
}

/**
 * 再帰隣接チェック
 * @param i
 * @param items
 * @param neighbors
 */
function checkRecursive(i, items, neighbors) {
  // 左方向チェック除外
  if (!(i % 6 === 0)) {
    if (items[i - 1].checked !== true && items[i].color === items[i - 1].color) {
      neighbors.push(i - 1);
      items[i - 1].checked = true;
      checkRecursive(i - 1, items, neighbors)
    }
  }
  // 右方向チェック除外
  if (!((i + 1) % 6 === 0)) {
    if (items[i + 1].checked !== true && items[i].color === items[i + 1].color) {
      neighbors.push(i + 1);
      items[i + 1].checked = true;
      checkRecursive(i + 1, items, neighbors)

    }
  }
  // 上方向チェック除外
  if (i >= 6) {
    if (items[i - 6].checked !== true && items[i].color === items[i - 6].color) {
      neighbors.push(i - 6);
      items[i - 6].checked = true;
      checkRecursive(i - 6, items, neighbors)

    }
  }
  // 下方向チェック除外
  if (i < 23) {
    if (items[i + 6].checked !== true && items[i].color === items[i + 6].color) {
      neighbors.push(i + 6);
      items[i + 6].checked = true;
      checkRecursive(i + 6, items, neighbors)
    }
  }
}

/**
 * android判定
 * @returns {boolean}
 */
function isAndroid() {
  return !!window.navigator.userAgent.match(/Android/);
}

/**
 * iOS判定
 * @returns {boolean}
 */
function isIOS() {
  return !!window.navigator.userAgent.match(/iPhone|iPad|iPod/);
}

export default DragDropContext((isAndroid() || isIOS()) ? TouchBackend : HTML5Backend)(SortableList);
