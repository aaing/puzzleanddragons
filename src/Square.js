import React, { Component } from 'react';
import PropTypes from 'prop-types';


export default class Square extends Component {
    static propTypes = {
        black: PropTypes.bool
    };

    render(){
        const { black } = this.props;
        const fill = black ? '#3f1f0d' : '#873d14';
        const stroke = black ? '#873d14' : '#3f1f0d';

        return (
             <div style={{
                  backgroundColor: fill,
                       color: stroke,
                       width: '100%',
                       height: '100%'
                     }}>
                       {this.props.children}
                     </div>
        );
    }
}