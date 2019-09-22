import React from "react";
import { Stage, Layer, Arc, Circle, Text } from "react-konva";
import Validators from "./Validators";
import {withRouter} from 'react-router-dom'
import NomBottombar from './NomBottombar'

class NominatorApp extends React.Component {
  constructor() {
    super();
    this.latestBlockAuthor = undefined;
    this.state = {
      validators: [],
      nominator: [],
      controllerId: "",
      valbacked: [],
      totalbonded: 0,
      nominatorvalue: {
        controllerId:0
      },
      showValidatorAddress:false,
      isloading: true
    };
    this.ismounted = true;
  }
  componentDidMount() {
    // console.log("nom",this.props)
    this.start()
    // this.createApi()
  }

   start() {
    let arr1 = [];
    let bonded = 0;

    this.props.valtotalinfo.forEach( (ele) => {
      ele.valinfo.stakers.others.forEach( (nom) => {
        if (nom.who === this.props.match.params.nominatorAddress) {
          arr1.push(ele);
          bonded += nom.value / Math.pow(10, 15);
        }
      });
    });

    let nominatorvalue = ""
    this.props.nominatorinfo.forEach( (ele) => {
      if(ele.accountId === this.props.match.params.nominatorAddress)
      {
        nominatorvalue = ele.controllerId
      }
    })

    // console.log("Done",nominatorvalue);
    // console.log(arr1);
    if(this.ismounted){
    this.setState({
      valbacked: arr1,
      totalbonded: bonded,
      controllerId: nominatorvalue
    },() => {
      this.setState({isloading:false})
    });
  }
  }

  componentWillUnmount(){
    this.ismounted = false;
  }

  handleOnMouseOver = () => {
    this.setState({showValidatorAddress: true})
  }
  handleOnMouseOut = () => {
    this.setState({showValidatorAddress: false})
  }


  BackbtnhandleOnMouseOver = () => {
    document.body.style.cursor = "pointer";
  }
  BackbtnhandleOnMouseOut = () => {
    document.body.style.cursor = "default";
  }

  handleClick = () => {
    document.body.style.cursor = "default";
    this.props.history.push({
      pathname:"/",
      state:{totalinfo:this.props.totalinfo,
      valinfo:this.props.valinfo,
    }
  })
}


  render() {
    
    // console.log("nomvalue",this.state.nominatorvalue)
    let nominatorname =
      "Nominator Address: " +   this.props.match.params.nominatorAddress.toString().slice(0,8) + "......" + this.props.match.params.nominatorAddress.toString().slice(-8);
    let stashname =
      this.state.controllerId.toString().slice(0, 8) +
      "......" +
      this.state.controllerId.toString().slice(-8);
    let controllername = "controller: " + stashname;
    let bondvalue =
      "bonded: " + this.state.totalbonded.toString().slice(0, 5) + " DOT";

      let valtext = this.props.match.params.nominatorAddress.toString().slice(0,8) + "......" + this.props.match.params.nominatorAddress.toString().slice(-8)

    let arr = this.state.valbacked;
    const width = window.innerWidth;
    const height = window.innerHeight;
    // console.log("valstate",this.state.showValidatorAddress)
    return this.state.isloading ? (
      <React.Fragment>
        <div className="lds-ripple">
          <div></div>
          <div></div>
        </div>
        {/* <div className="lds-text" style={{ left: "42%" }}>
          Fetching Validators.....
        </div> */}
      </React.Fragment>
    ) : (
      <React.Fragment>
        <div className="back-arrow" onClick={this.handleClick} onMouseOver={this.BackbtnhandleOnMouseOver} onMouseOut={this.BackbtnhandleOnMouseOut}>
         &#8592;
        </div>
        <div className="valheading">
          <h2>{nominatorname}</h2>
        </div>
        <Stage width={width} height={height}>
          <Layer>
            <Validators
              allvals={arr}
              rect_x={width / 2}
              circ_x={width / 2 - 200}
              circ_y={height / 2}
              totalinfo={this.props.valtotalinfo}
              // valinfo={this.props.valinfo}
              history={this.props.history}
            />
            <Arc
              x={width - 2}
              y={height / 2}
              innerRadius={height / 2 - 25}
              outerRadius={height / 2 - 24}
              rotation={90}
              angle={180}
              stroke="#97A1BF"
              strokeWidth={4}
            />

            <Circle
              x={width / 2 - 200}
              y={height / 2}
              radius={7}
              fill="white"
              onMouseOver={this.handleOnMouseOver}
              onMouseOut={this.handleOnMouseOut}
            />
            
             {this.state.showValidatorAddress && 
      <Text text={valtext} 
        x={width/2-200} 
        y={height/2-18} 
        fill="#FFFFFF" />   }
          </Layer>
        </Stage>
        <div className="nombottombar">
          <NomBottombar controllername={controllername} bondvalue={bondvalue} />
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(NominatorApp);
