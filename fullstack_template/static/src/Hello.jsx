import React from "react";
import { Grid, Row, Col } from "react-bootstrap";
import Button from "@material-ui/core/Button";

var $ = require('jquery');
var whichdata = 0;
const url = "http://10.65.4.143:180";

export default class Hello extends React.Component {

  constructor(props) {
    super(props);
    this.state = {greeting: 'Hello ' + this.props.name,
                  clock: "00:00",
                  posts: [],
                  single: [],
                  multi: [],
                  loading: true,
                  error: null
                  };

    // This binding is necessary to make `this` work in the callback
    this.cmdClear = this.cmdClear.bind(this);
    this.getSingle = this.getSingle.bind(this);
    this.getMulti = this.getMulti.bind(this);
  }

  personaliseGreeting(greeting) {
    this.setState({greeting: "Counter: " + greeting + ' ' + this.props.name + '!'});
  }

  cmdClear() {
    const single = {};
    const multi = {};
    this.setState({single});
    this.setState({multi});
  }

  getPythonHello() {
    //$.get(window.location.href + 'hello', (data) => {
    //var mybody = {"device": "CAMERA", "status" : "OFF"};
    var mybody = { device:'CAMERA', status:'OFF', test:"123" };
    const urlString = url + "/fakedata";
    $.post(urlString, JSON.stringify(mybody), (data) => {
      const posts = JSON.parse(data);
      this.setState({posts});
      //this.personaliseGreeting(x);
    });
  }

  async getSingle() {
    const urlString = url + "/APIsingle"
    $.get(urlString, (data) => { 
      const single = JSON.parse(data);
      this.setState({single});
    });
  }

  async getMulti() {
    const urlString = url + "/APImulti"
    $.get(urlString, (data) => { 
      const multi = JSON.parse(data);
      this.setState({multi});
    });
  }
  

  timer(){
    var d = new Date();

    this.setState({ clock: d.getHours() + ":" + d.getSeconds() });
    if(whichdata === 0){
        this.getSingle();
        whichdata = 1;
    }
    else{
        this.getMulti();
        whichdata = 0;
    }
  }
      
  componentDidMount(){
    this.intervalID = setInterval(this.timer.bind(this), 500);
  }
    
  componentWillUnmount(){
    clearInterval(this.intervalID);
  }

    
  renderLoading() {
    return <div>Loading...</div>;
  }

  renderError() {
    return (
      <div>
        Something went wrong: {this.state.error.message}
      </div>
    );
  }
    renderPosts() {
        // Using destructuring to extract the 'error' and 'posts'
        // keys from state. This saves having to write "this.state.X" everwhere.
        const { single } = this.state;
        var rows = [];
        for(var key in single){
            if(single.hasOwnProperty(key)){
                var out = key + " " + single[key];
                rows.push(out);
            }
        }  
        return (
            <div style={{height:'600', borderRadius:'30px', background:'black', color:'white', overflow:'scroll'}}>{rows.map(row => <p> {row} </p>)}</div>
        );
      }

      renderSingles() {
        // Using destructuring to extract the 'error' and 'posts'
        // keys from state. This saves having to write "this.state.X" everwhere.
        const { multi } = this.state;
        var rows = [];
        for(var key in multi){
            if(multi.hasOwnProperty(key)){
                var out = key + " " + multi[key];
                rows.push(out);
            }
        }  
        return (
            <div style={{height:'600', borderRadius:'30px', background:'black', color:'white',  overflow:'scroll'}}>{rows.map(row => <p> {row} </p>)}</div>
        );
      }

      handleData(data) {
        const posts = JSON.parse(data);
        this.setState({posts});
      }

    render () {
        return (
            <Grid>
                <Row>
                    <Col md={12} mdOffset={10}>
                        <h2>{ "TIME: " + this.state.clock}</h2>
                        <div>
                        <Button variant="contained" color="primary" onClick={this.cmdClear}>
                        Clear
                        </Button>
                        <Button  variant="contained" color="primary" onClick={this.getSingle}>
                        Single Level
                        </Button>
                        <Button  variant="contained" color="primary" onClick={this.getMulti}>
                        Multi Level
                        </Button>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md={6} mdOffset={5}>
                        {this.renderPosts()}
                    </Col>
                    <Col md={6} mdOffset={5}>
                        {this.renderSingles()}
                    </Col>
                </Row>

            </Grid>
        );
    }
}
