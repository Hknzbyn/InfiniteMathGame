import React from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  Dimensions,TouchableOpacity
} from 'react-native';

const { width, height } = Dimensions.get('window');

const ModalGo =(props)=>  {

  return (
      <Modal
        animationType='none'
        transparent={true}
        visible={props.modalGoVisible}
       >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={props.onPress}>
              <Text style={styles.textStyle}>Go</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    
      
  );
};



const ModalEnd = (props) => {
  return (
    <Modal animationType='none' transparent={true} visible={props.modalEndVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalEndView}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.textStyle}>
                BestScore {props.bestScore}
              </Text>
            </View>
            <Text style={styles.textStyle}>Your Score {props.score}</Text>

            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity onPress={props.onPressRetry}>
                <Text style={styles.textStyle}>Retry</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
  )
}

export  {ModalGo, ModalEnd};



const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  },
  modalView: {
    height: '100%',
    width: width,
    margin: 20,
    backgroundColor: '#35495E',
    borderRadius: 0,
    padding: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  modalEndView: {
    height: '100%',
    width: width,
    margin: 20,
    backgroundColor: '#35495E',
    borderRadius: 0,
    padding: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    height: 150,
    width: 150,
    borderRadius: 150,
    padding: 10,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#347474',
  },
  textStyle: {
    color: 'white',
    fontSize: 50,
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
