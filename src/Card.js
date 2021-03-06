import React , { Fragment }from 'react';
import { Font,Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
Font.register({
  family: 'SimHei',
  src: '/SimHei.ttf',
});
const styles = StyleSheet.create({
  text: {
    fontFamily: 'SimHei',
  },
});
export default class A4Lian extends React.Component {
  render() {
    return (
      <View style={{top:"10cm"}}>
          <Text>&emsp;&emsp;&emsp;No&emsp;{this.props.start}
          </Text>
          <Text  style={styles.text}>
            （不作报销凭证）
          </Text>
            <Text style={styles.text}>今收到</Text>
            <Text style={styles.text}>交&emsp;来</Text>
            <Text style={styles.text}>人民币（大写）</Text>
            <Text style={styles.text}>￥</Text>
            <Text style={styles.text}>收款单位</Text>
            <Text style={{ margin: '0 0 0 38mm' }}>收款人</Text>
            <Text style={styles.text}>(公章)</Text>
            <Text style={styles.text}>(签章)</Text>
            <Text style={styles.text}>&emsp;&emsp;&emsp;年&emsp;月&emsp;日</Text>
        <Text style={styles.text}>
          {this.props.lian}
        </Text>
      </View>
    );
  }
}
