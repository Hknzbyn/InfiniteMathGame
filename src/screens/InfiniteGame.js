import React, { Component } from 'react';
import {
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ModalGo, ModalEnd } from '../components/Modals';

import { SafeAreaView } from 'react-native-safe-area-context';

import * as Progress from 'react-native-progress';

import { Ionicons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default class RandomNumber extends Component {
  constructor() {
    super();
    this.state = {
      // This is a default value...
      firstnumber: '',
      secondnumber: '',
      truecorrect: '',
      answer: 0,
      score: 0,
      bestscore: '',
      optypes: ['addition', 'subtraction', 'multiplication', 'division'],
      optype: '',
      options: [
        (option0 = 1),
        (option1 = 2),
        (option2 = 3),
        (option3 = 4),
        (option4 = 5),
        (option5 = 6),
        (option6 = 7),
        (option7 = 8),
      ],
      corrects: [
        (correct0 = 0),
        (correct1 = 1),
        (correct2 = 2),
        (correct3 = 3),
      ],
      opIcon: '',
      counter: 10,
      timer: null,
      addSec: false,
      animation: new Animated.Value(0),
      modalGoVisible: true,
      modalEndVisible: false,
    };
  }
  componentDidUpdate = (prevState, prevProps) => {
    if (prevState.modalGoVisible === false) {
      console.log('DidUpdate...');
    }
  };
  componentDidMount = () => {
    this.getBestScore();
    this.newQue();
  };

  componentWillUnmount() {
    clearInterval(this.state.timer);
  };

  setmodalGoVisible = (visible) => {
    this.setState({ modalGoVisible: visible });
    if (visible == false) {
      this.StartAnimation('start');
      this.startTimer();
    }
  };

  //En iyi score u kontrol eden fonksiyon
  checkBestScore = async () => {
    const { score, bestscore } = this.state;

    if (score < bestscore || score == bestscore) {
      this.setState({ bestscore: bestscore });
    } else {
      await AsyncStorage.setItem('bestScore', `${score}`);
      this.setState({ bestscore: score });
    }
  };

  //Yanlış cevap verildiği zaman çağırılan fonksiyon
  OpenEndModal = async (visible) => {
    
    this.setState({ modalEndVisible: !visible });
    this.checkBestScore();
  };

  //Zamana süre ekleyen fonksiyon
  addTenSec = () => {
    this.StartAnimation('addTime');
  };

  //Zamanlayıcı Başlatan fonks
  startTimer = () => {
    let timer = setInterval(this.manageTimer, 1000);
    this.setState({ timer });
  };

  //Zamanlayıcı durduran fonks
  stopTimer = () => {
    clearInterval(this.state.timer);
    this.setState({ timer: null });
  };

  //Zamanlayıcıyı ayarlayan fonksiyon
  manageTimer = () => {
    var states = this.state;
    const { score, counter } = this.state;

    if (counter === 0) {
      this.OpenEndModal();
      clearInterval(this.state.timer);
    } else if (counter > 100) {
      this.setState({
        counter: 100,
      });
    } else {
      this.setState({
        counter: counter - 1,
      });
    }
  };

  // Daha önce çözülen en iyi sonucu alan fonksiyon
  getBestScore = async () => {
    let bestScore = await AsyncStorage.getItem('bestScore');
    console.log('Best:', parseInt(bestScore));
    if (!bestScore) {
      this.setState({
        bestscore: 0,
      });
    } else {
      this.setState({ bestscore: bestScore });
    }
  };


  //Yeni Soru getiren ve state de ki değerleri default hale getiren fonksiyon
  tryAgain = () => {
  this.setState({modalEndVisible:false})

    const { bestscore } = this.state;

    this.setState({
      firstnumber: '',
      secondnumber: '',
      truecorrect: '',
      answer: 0,
      score: 0,
      bestscore: bestscore,
      optypes: ['addition', 'subtraction', 'multiplication', 'division'],
      optype: '',
      options: [
        (option0 = 1),
        (option1 = 2),
        (option2 = 3),
        (option3 = 4),
        (option4 = 5),
        (option5 = 6),
        (option6 = 7),
        (option7 = 8),
      ],
      corrects: [
        (correct0 = 0),
        (correct1 = 1),
        (correct2 = 2),
        (correct3 = 3),
      ],
      opIcon: '',
      timeranim: 10000,
      counter: 10,
      timer: null,
      addSec: false,
      animation: new Animated.Value(0),
    });
    this.newQue();
    this.StartAnimation('start');
    this.startTimer();
  };

  startGame = () => {
    setTimeout(() => {
      this.getBestScore();
      this.newQue();
      this.StartAnimation('start');
      this.startTimer();
    }, 0);
  };

  //Sorunun cevabını kontrol eden fonksiyon
  answerCheck = () => {
    const { truecorrect, answer, score, counter } = this.state;
    if (answer === truecorrect) {
      this.setState({
        score: score + 100,
      });
      this.newQue();
      this.addTenSec();
    } else {
      this.OpenEndModal();
      this.stopTimer();

      this.setState({
        score: 0,
      });
    }
  };

  //Yeni soru getiren fonksiyon
  newQue = async () => {
    await this.getRandomNumbers();
    await this.regulator();
    await this.results();
    await this.mixerOptions();
    await this.mixerCorrects();
    this.setState({ answer: '' });
  };

  //result fonksiyonu 1 kere çalıştığında setState doğru olmadığı için 2 defa result fonk. çalıştıran fonksiyon
  results = async () => {
    await this.getResult();
    this.getResult();
  };

  //İşlem Tipine göre işlem ikonunu opIcan a setState eden fonksiyon
  showOpType = () => {
    const { optype, opIcon } = this.state;
    let a = '';

    if (optype === 'addition') {
      a = <Ionicons name='add' size={40} color='white' />;
      this.setState({
        opIcon: a,
      });
    } else if (optype === 'subtraction') {
      a = <Fontisto name='minus-a' size={40} color='white' />;
      this.setState({
        opIcon: a,
      });
    } else if (optype === 'multiplication') {
      a = <Foundation name='x' size={40} color='white' />;
      this.setState({
        opIcon: a,
      });
    } else if (optype === 'division') {
      a = <MaterialCommunityIcons name='division' size={40} color='white' />;
      this.setState({
        opIcon: a,
      });
    }
  };

  getRandomNumbers = async () => {
    await this.getOpType();
    await this.easyRandomNumberone();
    await this.easyRandomNumbertwo();
    this.numberRegulator();
    this.showOpType();
  };

  /* -------------------------------------------------------------------------------------------*/

  //Seçeneklerin yerlerini karıştıran fonksiyon
  mixerCorrects = () => {
    const { truecorrect } = this.state;
    let { corrects } = this.state;

    for (let i = corrects.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i+1));
      const temp = corrects[i];
      corrects[i] = corrects[j];
      corrects[j] = temp;

      this.setState({
        corrects0: corrects[j],
        correct1: corrects[j + 3],
        correct2: corrects[j + 2],
        correct3: corrects[j + 1],
      });
    }
  };

  //Şıkları karıştıran ve seçeneklere rastgele atanan değerleri setstate eden fonksiyon
  mixerOptions = () => {
    const { corrects, truecorrect } = this.state;
    let { options } = this.state;
    let a = [];

    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = options[i];
      options[i] = options[j];
      options[j] = temp;

      this.setState({
        option0: options[j],
        option1: options[j + 1],
        option2: options[j + 2],
        option3: options[j + 3],
        option4: options[j + 4],
        option5: options[j + 5],
        option6: options[j + 6],
        option7: options[j + 7],
      });
      // console.log('option0:' + options[j + 1]);
      // console.log('option1:' + options[j + 2]);
      // console.log('option2:' + options[j + 3]);
      // console.log('option3:' + options[j + 4]);
      // console.log('option4:' + options[j + 5]);
      // console.log('option5:' + options[j + 6]);
      // console.log('option6:' + options[j + 7]);
      // console.log('option7:' + options[j]);
    }

    a[3] = truecorrect;
    a[1] = options[1];
    a[2] = options[2];
    a[0] = options[0];

    this.setState({
      corrects: a,
    });
  };

  //İşlem tipine göre doğru ve  muhtemel  sonuçları belirleyen fonksiyon
  getResult = async () => {
    const { optype, firstnumber, secondnumber } = this.state;
    let { options } = this.state;
    let a = [];

    if (optype === 'addition') {
      a[0] = firstnumber + secondnumber + 1;
      a[1] = firstnumber + secondnumber - 1;
      a[2] = firstnumber + secondnumber + 2;
      a[3] = firstnumber + secondnumber - 2;
      a[4] = firstnumber + secondnumber + 10;
      a[5] = firstnumber + secondnumber - 10;

      this.setState({
        truecorrect: firstnumber + secondnumber,
        options: a,
      });
    } else if (optype === 'subtraction') {
      (a[0] = firstnumber - secondnumber + 1),
        (a[1] = firstnumber - secondnumber - 1),
        (a[2] = firstnumber - secondnumber + 2),
        (a[3] = firstnumber - secondnumber - 2),
        this.setState({
          truecorrect: firstnumber - secondnumber,
          options: a,
        });
    } else if (optype === 'multiplication') {
      (a[0] = firstnumber * secondnumber + firstnumber),
        (a[1] = firstnumber * secondnumber + secondnumber),
        (a[2] = firstnumber * secondnumber - firstnumber),
        (a[3] = firstnumber * secondnumber - secondnumber),
        (a[4] = secondnumber * firstnumber + 10),
        (a[5] = secondnumber * firstnumber - 10),
        this.setState({
          truecorrect: firstnumber * secondnumber,
          options: a,
        });
    } else if (optype === 'division') {
      (a[0] = firstnumber / secondnumber + 1),
        (a[1] = firstnumber / secondnumber - 1),
        (a[2] = firstnumber / secondnumber + 2),
        (a[3] = firstnumber / secondnumber + 3),
        this.setState({
          truecorrect: firstnumber / secondnumber,
          options: a,
        });
    }
  };

  //Sayıların durumunu işlem tipine göre düzenleyen fonksiyon
  regulator = () => {
    const { optype, firstnumber, secondnumber } = this.state;

    if (optype === 'addition') {
      this.setState({
        firstnumber: firstnumber,
        secondnumber: secondnumber,
      });
    } else if (optype === 'subtraction') {
      if (firstnumber === 0 || secondnumber === 0) {
        this.getRandomNumbers();
      } else if (firstnumber === secondnumber) {
        this.getRandomNumbers();
      } else {
        this.setState({
          firstnumber: firstnumber,
          secondnumber: secondnumber,
        });
      }
    } else if (optype === 'multiplication') {
      if (firstnumber >= 15 && secondnumber >= 12) {
        this.setState({
          firstnumber: firstnumber,
          secondnumber: secondnumber - 10,
        });
      } else if (firstnumber >= 15 && secondnumber <= 10) {
        this.setState({
          firstnumber: firstnumber,
          secondnumber: secondnumber,
        });
      }
    } else if (optype === 'division') {
      //Daha sonra tekrar bak..Division olduğu zaman regulator 2. kere çalıştığında no1=no2 oluyor????
      const mod = firstnumber % secondnumber;
      if (firstnumber == secondnumber) {
        this.setState({
          firstnumber: firstnumber + secondnumber * 3,
          secondnumber: secondnumber,
        });
      } else if (mod >= 0) {
        this.setState({
          firstnumber: firstnumber + (secondnumber - mod),
          secondnumber: secondnumber,
        });
      } else if (mod === 0) {
        this.setState({
          firstnumber: firstnumber,
          secondnumber: secondnumber,
        });
      }
    }
  };

  //İşlem tipini rastgele seçen fonksiyon
  getOpType = () => {
    const { optypes } = this.state;
    var randomOpType = optypes[Math.floor(Math.random() * optypes.length)];
    this.setState({ optype: randomOpType });
  };

  //İlk sayıyı büyük yapan fonksiyon
  numberRegulator = () => {
    const { firstnumber, secondnumber } = this.state;
    if (firstnumber === 0 || firstnumber === 0) {
      this.setState({
        firstnumber: firstnumber + 2,
        secondnumber: secondnumber + 2,
      });
    } else if (firstnumber < secondnumber) {
      this.setState({
        firstnumber: secondnumber,
        secondnumber: firstnumber,
      });
    } else {
      this.setState({
        firstnumber: firstnumber,
        secondnumber: secondnumber,
      });
    }
  };

  //İkinci sayıyı rastgele bulan fonksiyon
  easyRandomNumbertwo = () => {
    var randomNumber2 = Math.floor(Math.random() * 25) + 2;
    this.setState({ secondnumber: randomNumber2 });
  };

  //İlk sayıyı rastgele bulan fonksiyon
  easyRandomNumberone = () => {
    var randomNumber1 = Math.floor(Math.random() * 25) + 2;
    this.setState({ firstnumber: randomNumber1 });
  };

  //Basılan şıkkı state içindeki answer a aktaran fonksiyon
  answerOnClick = async (answerText) => {
    const { answer } = this.state;
    let a = 0;
    a = answerText;
    await this.setState({
      answer: a,
    });
    this.answerCheck();
  };

  //Cevapların olduğu kutular //ToDo "actions"
  correctBox(text) {
    return (
      <TouchableOpacity
        onPress={() => this.answerOnClick(text)}
        style={styles.correctBox}>
        <Text style={{ fontSize: 40, color: 'white', textAlign: 'center' }}>
          {text}
        </Text>
      </TouchableOpacity>
    );
  }

  StartAnimation(timeType) {
    if (timeType === 'start') {
      console.log('if1');
      const { addSec, counter } = this.state;
      this.state.animation.setValue(0);

      Animated.timing(this.state.animation, {
        useNativeDriver: false,
        duration: this.state.counter * 1000,
        toValue: 1,
      }).start(({ finished }) => {
        this.setState((state) => ({ addSec: false }));
      });
    } else {
      console.log('else2');

      const { counter } = this.state;
      this.setState((state) => ({ counter: counter + 3, addSec: true }));
      this.state.animation.setValue(0);
      Animated.timing(this.state.animation, {
        useNativeDriver: false,
        duration: this.state.counter * 1000,
        toValue: 1,
      }).start(({ finished }) => {
        Animated.timing(this.state.animation, {
          useNativeDriver: false,
          duration: this.state.counter * 1000,
          toValue: 0,
        }).start;
        this.setState((state) => ({ addSec: false }));
      });
    }
  }
  render() {
    const {
      questionArea,
      answerArea,
      NumberTextArea,
      headerArea,
      timerArea,
      centeredView,
      containerview,
      
    } = styles;
    const { modalGoVisible, modalEndVisible } = this.state;
    const progressInterpolate = this.state.animation.interpolate({
      inputRange: [0, 1, 2],
      outputRange: ['100%', '0%', '+30%'],
      extrapolate: 'clamp',
    });

    const progressStyle = {
      width: progressInterpolate,
      bottom: 0,
    };

    return (
      <View style={containerview}>
        <View style={headerArea}>
          <Text style={{ fontSize: 20, color: 'white' }}>
            BESTSCORE--{this.state.bestscore}
          </Text>
          <Text style={{ fontSize: 20, color: 'white' }}>
            SCORE--{this.state.score}
          </Text>
        </View>

        <View style={timerArea}>
          <TouchableWithoutFeedback
            onPress={() => this.StartAnimation('start')}>
            <View style={styles.myBox}>
              <Text style={styles.ProgressText}>{this.state.counter}</Text>

              <Animated.View
                style={[styles.progress, progressStyle]}></Animated.View>
            </View>
          </TouchableWithoutFeedback>
        </View>

        <View style={questionArea}>
          <Text style={NumberTextArea}>{this.state.firstnumber}</Text>
          <Text>{this.state.opIcon}</Text>
          <Text style={NumberTextArea}>{this.state.secondnumber}</Text>
        </View>

        <View style={answerArea}>
          {this.correctBox(this.state.corrects[0])}
          {this.correctBox(this.state.corrects[1])}
          {this.correctBox(this.state.corrects[2])}
          {this.correctBox(this.state.corrects[3])}
        </View>

        <View style={centeredView}>
          <ModalGo
            modalGoVisible={modalGoVisible}
            onPress={() => this.setmodalGoVisible(!modalGoVisible)}
          />

          <ModalEnd
            modalEndVisible={modalEndVisible}
            bestScore={this.state.bestscore}
            score={this.state.score}
            onPressRetry={() => this.tryAgain()}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerview: {
    flex: 1,
    width: width,
    height: height,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#42B883',
  },
  headerArea: {
    height: height * 0.1,
    width: width,
    backgroundColor: '#35495E',
  },
  timerArea: {
    height: height * 0.1,
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  //Soruların içinde gösterildiği view
  questionArea: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: height * 0.4,
    width: width,
    //backgroundColor: 'blue',
  },

  //Cevapların verildiği alan
  answerArea: {
    height: height * 0.24,
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    margin: 10,
    padding: 10,
    //backgroundColor: 'red',
  },

  //Cevap kutuları
  correctBox: {
    borderWidth: 1,
    backgroundColor: '#35495E',
    justifyContent: 'center',
    alignItems: 'center',
    height: 90,
    width: 90,
    marginLeft: 7,
    marginRight: 7,
    shadowOpacity: 0.9,
    elevation: 5,
    shadowColor: 'white',
    borderRadius: 30,

    shadowOffset: {
      width: 2,
      height: 2,
    },
  },

  NumberTextArea: {
    textAlign: 'center',
    fontSize: 60,
    color: 'white',
    fontWeight: '600',
  },

  myBox: {
    width: '100%',
    height: 40,
    padding: 5,
    borderColor: '#FFFF',
    borderWidth: 5,
    borderRadius: 30,
    justifyContent: 'center',
  },
  progress: {
    width: '100%',
    height: 30,
    borderRadius: 30,
    backgroundColor: '#FF7E67',
    alignSelf: 'center',
  },
  ProgressText: {
    fontSize: 25,
    color: 'white',
    position: 'absolute',
    zIndex: 1,
    alignSelf: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  },
});
