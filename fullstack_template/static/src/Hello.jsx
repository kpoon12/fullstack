import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import Button from "@material-ui/core/Button";
import axios from "axios";

var $ = require('jquery');

export default class Hello extends React.Component {
    constructor(props) {
        super(props);
        this.state = {greeting: 'Hello ' + this.props.name,
                      clock: "00:00",
                      posts: [],
                      loading: true,
                      error: null
                     };

        // This binding is necessary to make `this` work in the callback
        this.getPythonHello = this.getPythonHello.bind(this);
        this.getSTPythonHello = this.getSTPythonHello.bind(this);
    }

    personaliseGreeting(greeting) {
        this.setState({greeting: "Counter: " + greeting + ' ' + this.props.name + '!'});
    }

    getPythonHello() {
        $.get(window.location.href + 'hello', (data) => {
            //console.log(data);
            const posts = JSON.parse(data);
            this.setState({
                posts
              });
            //this.personaliseGreeting(x);

        });
    }

    async getSTPythonHello() {
        axios.get('http://10.65.4.128:5000/hello')
        .then(res =>{
            const posts = JSON.parsea(res.data);
            this.setState({posts});
            //this.personaliseGreeting(posts.aString);
        })
        .catch(err => {
            // Something went wrong. Save the error in state and re-render.
            alert(err);
        });
    }


    timer(){
        var d = new Date();
        this.state.clock = d.getHours() + ":" + d.getSeconds(); 
        this.setState({ clock: this.state.clock });
        //this.getPythonHello();
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
        const { posts } = this.state;
        var rows = [];
        var values = [];
        for(var key in posts){
            if(posts.hasOwnProperty(key)){
                var out = key + " " + posts[key];
                rows.push(out);
            }
        }  
        return (
            <div>{rows.map(row => <div> {row} </div>)}</div>
        );
      }

    render () {
        return (
            <Grid>
                <Row>
                    <Col md={12} mdOffset={5}>
                        <h1>{this.state.greeting}</h1>
                        <hr/>
                        <h2>{ "TIME: " + this.state.clock}</h2>
                        {this.renderPosts()}
                    </Col>
                </Row>
                <Row>
                    <Col md={12} mdOffset={5}>
                        <div>
                        <Button  variant="contained" color="primary" onClick={this.getPythonHello}>
                        Say Hello!
                        </Button>
                        <Button  variant="contained" color="primary" onClick={this.getSTPythonHello}>
                        ST Hello!
                        </Button>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md={12} mdOffset={5}>
                        <div>
                      </div>
                    </Col>
                </Row>
            </Grid>
        );
    }
}
