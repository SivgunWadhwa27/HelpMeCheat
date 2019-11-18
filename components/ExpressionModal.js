import React from "react";
import { Text, View, StyleSheet, TouchableHighlight, Modal , WebView} from "react-native";
import MathJax from 'react-native-mathjax';
import Katex from 'react-native-katex';

const styles = StyleSheet.create({
    katex: {
      flex: 1,
    },
    modal:{
        flex:1
    }
  });
  
  const inlineStyle =`
  html, body {
    display: flex;
    background-color: #fafafa;
    justify-content: center;
    align-items: center;
    height: 100%;
    margin: 0;
    padding: 0;
  }
  .katex {
    font-size: 4em;
    margin: 0;
    display: flex;
  }
  `;
  

export class ExpressionModal extends React.Component {
    constructor(props) {
        super(props);
    }

    showExpressionModal(visible) {
        this.setState({ visible: visible });
    }

    render() {
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={this.props.visible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                }}>
                <View style={styles.modal}>
                <Katex
                    expression={this.props.latex}
                    style={styles.katex}
                    inlineStyle={inlineStyle}
                    displayMode={false}
                    throwOnError={false}
                    errorColor="#f00"
                    macros={{}}
                    colorIsTextColor={false}
                    onLoad={()=> this.setState({ loaded: true })}
                    onError={() => console.error('Error')}
                />
                </View>
            </Modal>
        );
    }
}




