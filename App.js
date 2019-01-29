import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  LayoutAnimation,
  Animated,
  Easing,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  UIManager
} from "react-native";

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);


export default class App extends Component {
  constructor(props) {
    super(props);
    this.animatedValue1 = new Animated.Value(0);
    this.state = {
      filter: [],
      lastData: [],
      fadeIn: new Animated.Value(0),
      loading: false,
      changeColor: false,
      swip: false
    };
  }

  componentDidMount() {
    this.fetchData();
    this.fadeIn();
    this.animate();
  }

  animate() {
    this.animatedValue1.setValue(0);
    const createAnimation = function(value, duration, easing, delay = 0) {
      return Animated.timing(value, {
        toValue: 1,
        duration,
        easing,
        delay
      });
    };
    Animated.parallel([
      createAnimation(this.animatedValue1, 2000, Easing.ease)
    ]).start();
  }

  fadeIn = () => {
    Animated.timing(this.state.fadeIn, {
      toValue: 1,
      duration: 2000
    }).start();
  };

  fetchData = () => {
    let lastData = this.state.lastData;
    fetch("https://randomuser.me/api?results=15")
      .then(response => response.json())
      .then(data => {
        this.setState(
          { lastData: [...lastData, ...data.results], loading: true },
          () => this.setState({ filter: this.state.lastData })
        );
      });
  };

  handleEnd = () =>
    this.setState(fresh => ({ page: fresh.page + 1 }), () => this.fetchData());

  searchFilterFunction = text => {
    let result = this.state.lastData.filter(item =>
      `${item.name.first.toUpperCase()} ${item.name.last.toUpperCase()}`.includes(
        text.toUpperCase()
      )
    );
    this.setState({
      filter: result
    });
  };

  changeColor = () => {
    this.setState({ changeColor: !this.state.changeColor });
  };

  swip = () => {
    this.setState({ swip: !this.state.swip });
  };

  render() {
    const scaleText = this.animatedValue1.interpolate({
      inputRange: [0, 1],
      outputRange: [0.5, 1]
    });

    let { fadeIn } = this.state;
    return (
      <View style={styles.container}>
        {/* <Animated.Text
          style={
            {
              ...this.props.style,
              opacity: this.fadeIn,
            }
          }
        /> */}

        <Animated.View style={styles.container}>
          <Animated.View
            style={this.state.swip ? styles.headerUp : styles.header}
          >
            <Animated.View style={{ alignItems: "center" }}>
              <Animated.Text
                style={{
                  fontWeight: "bold",
                  fontSize: 20,
                  color: "black",
                  opacity: this.state.fadeIn
                }}
              >
                Good evening Lara
              </Animated.Text>
              <Animated.Text
                style={{
                  fontSize: 18,
                  color: "black",
                  opacity: this.state.fadeIn
                }}
              >
                Evening is actually a time for soul searching You can sit alone
                and watch the sky, Of all your dreams and aspirations so high,
                Making a promise from a day to come, Evening is the best time!
                Good evening! Read more at
              </Animated.Text>
            </Animated.View>
          </Animated.View>

          <Animated.View style={{ transform: [{ scale: scaleText }] }}>
            <View style={this.state.swip ? styles.searchUp : styles.search}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image source={require("./picture/search.png")} />
                <TextInput
                  style={{ color: "black", marginLeft: 20 }}
                  placeholder={"Search by names and numbers"}
                  onChangeText={this.searchFilterFunction.bind(this)}
                />
              </View>
            </View>
          </Animated.View>
          <View style={this.state.swip ? styles.mainUp : styles.main}>
            <View>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 18,
                  color: "black",
                  paddingLeft: 20,
                  paddingTop: 10
                }}
              >
                Becommended Books
              </Text>
            </View>
            <View
              style={!this.state.changeColor ? styles.container : styles.change}
            >
              <FlatList
                pagingEnabled
                data={this.state.filter}
                horizontal={true}
                keyExtractor={item => item.email}
                onEndReached={() => this.handleEnd()}
                onEndReachedComponent={() =>
                  this.state.loading ? null : <ActivityIndicator size="large" />
                }
                refreshing={this.state.refreshing}
                // ItemSeparatorComponent={this.separator}
                renderItem={({ item }) => (
                  <View style={styles.box}>
                    <TouchableHighlight
                      underlayColor="rgba(0,0,0,0.3)"
                      onPress={() => {
                        Alert.alert(item.email);
                      }}
                    >
                      <View>
                        <View>
                          <Image
                            source={{ uri: item.picture.large }}
                            style={{ height: 190, width: 170 }}
                          />
                        </View>
                        <View
                          style={{
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <Text
                            style={{
                              fontWeight: "bold",
                              fontSize: 18,
                              color: "black"
                            }}
                          >
                            {item.name.first}
                          </Text>
                          <Text style={{ fontSize: 16, color: "black" }}>
                            {item.name.last}
                          </Text>
                        </View>
                      </View>
                    </TouchableHighlight>
                  </View>
                )}
              />
            </View>
          </View>
          {this.state.swip ? 
           <View style={styles.footerUp}>
                    <View style={{alignItems:'center',justifyContent:'center',marginTop:90}}>
              <Text style={{ fontWeight: "bold",fontSize: 32,color: "black",paddingLeft: 20,paddingVertical:30}}>
              Filter
              </Text>
              <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',paddingRight: 30,}}>
              <Text style={{color:'black',fontSize:16,paddingLeft:10}}>BookName :</Text>
              <View style={styles.filterd}>
                <TextInput 
                  style={{ color: "black",alignItems:'center'}}
                  placeholder={"Search"}
                  onChangeText={this.searchFilterFunction.bind(this)}
                />
              </View>
              </View>
              <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
              <Text style={{color:'black',fontSize:16}}>Author :</Text>
              <View style={styles.filterd}>
              <TextInput 
                  style={{ color: "black",alignItems:'center'}}
                  placeholder={"Search"}
                  onChangeText={this.searchFilterFunction.bind(this)}
                />
              </View>
              </View>
              <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
              <Text style={{color:'black',fontSize:16}}>Price :</Text>
              <View style={styles.filterd}>
              <TextInput 
                  style={{ color: "black",alignItems:'center'}}
                  placeholder={"Search"}
                  onChangeText={this.searchFilterFunction.bind(this)}
                />
              </View>
              </View>
            </View>
            <View style={{ flexDirection: "row",marginTop:180}}>
             <TouchableOpacity onPress={this.swip}>
               <Image source={require("./picture/library.png")} />
             </TouchableOpacity>
             <TouchableOpacity onPress={this.changeColor.bind(this)}>
               <Image
                 source={require("./picture/explorer.png")}
                 style={{ marginHorizontal: 90 }}
               />
             </TouchableOpacity>
             <TouchableOpacity onPress={this.swip}>
               <Image source={require("./picture/setting.png")} />
             </TouchableOpacity>
           </View>
         </View>
         :

                               
          <View style={styles.footer}>
           <View style={{ flexDirection: "row",}}>
             <TouchableOpacity onPress={this.swip}>
               <Image source={require("./picture/library.png")} />
             </TouchableOpacity>
             <TouchableOpacity onPress={this.changeColor.bind(this)}>
               <Image
                 source={require("./picture/explorer.png")}
                 style={{ marginHorizontal: 90 }}
               />
             </TouchableOpacity>
             <TouchableOpacity onPress={this.swip}>
               <Image source={require("./picture/setting.png")} />
             </TouchableOpacity>
           </View>
   
          </View>
          }
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  containerUp: {
    flex: 0,
    display:'none'
  },
  header: {
    height: 230,
    backgroundColor: "white",
    justifyContent: "center",
    marginHorizontal: 10
  },
  headerUp: {
    height: 0,
    display: 'none',
  },
  search: {
    height: 50,
    backgroundColor: "white",
    marginHorizontal: 25,
    borderWidth: 0.5,
    alignItems: "center"
  },
  searchUp: {
    height: 0,
    display: 'none',
  },
  main: {
    flex: 3,
    backgroundColor: "white"
  },
  mainUp: {
    display: 'none',
  },
  footer: {
    height: 50,
    backgroundColor: "#f7f7e9",
    justifyContent: "center",
    alignItems: "center"
  },
  footerUp: {
    
    flex:1,
    backgroundColor: "rgba( 212, 172, 13 ,0.8)",
    justifyContent: "center",
    alignItems: "center",
    // borderRadius: 30,
    // alignSelf: 'flex-start',
  },
  box: {
    backgroundColor: "white",
    height: 250,
    width: 170,
    marginVertical: 15,
    marginHorizontal: 30,
    alignItems: "center"
    // paddingTop: 10
    // marginLeft: 20,
  },
  boxUp: {
    height: 0,
    display:'none'
  },
  change: {
    flex: 1,
    backgroundColor: "rgba( 212, 172, 13 ,0.8)"
  },
  filterd : {
    backgroundColor: "white",
    height:50,
    width: 230,
    borderRadius:30,
    marginVertical: 15,
    marginHorizontal: 30,
    alignItems: "center",
    borderWidth:1,
    
    // paddingTop: 10
    // marginLeft: 20,
  },

});
