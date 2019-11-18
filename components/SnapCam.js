import React from "react";
import { Text, View, StyleSheet , Button} from "react-native";
import { Camera, Permissions , ImageManipulator} from "expo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { ExpressionModal } from '../components/ExpressionModal';

export class SnapCam extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
      mathExprModalVisible: false,
      latexExpr: null
    };
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  showMathExprModal(latexExpr){
    this.setState({
      mathExprModalVisible : true,
      latexExpr: latexExpr
    });
  }

  takePicture = async function() {
    console.log("");
    let photo = await this.camera.takePictureAsync();
    let resizedPhoto = await ImageManipulator.manipulateAsync(
      photo.uri,
      [{ resize: { width: 900 } }],
      {
        compress: 0.8,
        format: "jpg",
        base64: true
      }
    );

    let response = await getLatexExpression(resizedPhoto.base64);
    let latexExpr = response.latex;
    console.log('Latex expr: ' + latexExpr);

    this.showMathExprModal(latexExpr);

  };

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={styles.cameraContainer}>
           
          <Camera
            style={styles.cameraStyle}
            type={this.state.type}
            ref={ref => {
              this.camera = ref;
            }}
          >
            <View style={styles.iconContainer}>
            <MaterialCommunityIcons
                onPress={this.takePicture.bind(this)}
                name="circle-outline"
                style={{
                  color: "white",
                  fontSize: 100
                }}
              />
            </View>
           
          </Camera>
          <ExpressionModal 
            visible={this.state.mathExprModalVisible} 
            latex={this.state.latexExpr}>
          </ExpressionModal>
        </View>
      );
    }
  }
}

async function getLatexExpression(base64) {

  var api = "https://api.mathpix.com/v3/latex";
  return await fetch(api, {
    method: "POST",
    headers:new Headers({
      "content-type" : "application/json",
      "app_id" : "sivgun_wadhwa_gmail_com",
      "app_key" : "43b6f62c4ef32c99d06d"
    }),
    body: JSON.stringify({
      "src" : "data:image/jpg;base64," + base64
    })
  }).then(
    response => {
      return response.json();
    },
    err => {
      console.log("promise rejected");
      console.log(err);
    }
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex:1
  },
  cameraStyle: {
    flex:1
  },
  iconContainer: {
    alignItems: "center",
    bottom: 0,
    position: "absolute",
    left: 0,
    right: 0
  },
  captureButton: {
    color: "white",
    fontSize: 100
  }
});


