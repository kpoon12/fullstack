import React from "react";
import { Grid, Row, Col, Table, ProgressBar} from "react-bootstrap";
import Button from '@material-ui/core/Button';

var $ = require('jquery');

export default class Schedule extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {greeting: 'Hello ' + this.props.name};

        // This binding is necessary to make `this` work in the callback
        this.getPythonHello = this.getPythonHello.bind(this);
    }

    personaliseGreeting(greeting) {
        this.setState({greeting: greeting + ' ' + this.props.name + '!'});
    }

    getPythonHello() {
        $.get(window.location.href + 'hello', (data) => {
            console.log(data);
            this.personaliseGreeting(data);
        });
    }

    render () {
        return (
            <Grid>
                <Row>
                <Col md={12} mdOffset={5}>
                <Table striped bordered condensed hover>
                    <thead>
                        <tr>
                        <th>Name</th>
                        <th>Diameter</th>
                        <th>Wall</th>
                        <th>Material</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td>Johno</td>
                        <td>0.5</td>
                        <td>0.048</td>
                        <td>SS</td>
                        </tr>
                    </tbody>
                    </Table>
                </Col>

                </Row>
                <div>
                    <Button variant="contained" color="primary" >START</Button>
                    <Button variant="contained" color="primary" >STOP</Button>
                    <Button variant="contained" color="primary" >SEQ STOP</Button>
                    <Button variant="contained" color="primary" >PURGE</Button>
                    <Button variant="contained" color="primary" >LAMP</Button>
                    <Button variant="contained" color="primary" >ADV</Button>
                    <Button variant="contained" color="primary" >DeADV</Button>
                </div>
            </Grid>
        );
    }
}
