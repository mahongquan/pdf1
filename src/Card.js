import React , { Fragment }from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

export default class A4Lian extends React.Component {
  render() {
    return (
      <View>
          <Text>hello北京科技大学预收款凭条&emsp;&emsp;&emsp;No&emsp;{this.props.start}
          </Text>
          <Text>
            （不作报销凭证）
          </Text>
            <Text>今收到</Text>
            <Text>交&emsp;来</Text>
            <Text>人民币（大写）</Text>
            <Text>￥</Text>
            <Text>收款单位</Text>
            <Text style={{ margin: '0 0 0 38mm' }}>收款人</Text>
            <Text>(公章)</Text>
            <Text>(签章)</Text>
            <Text>&emsp;&emsp;&emsp;年&emsp;月&emsp;日</Text>
        <Text>
          {this.props.lian}
        </Text>
      </View>
    );
  }
}
