import React from "react";
import Hello from "./Hello";
import Pro from "./Progress";


import HeaderBackgroundImage from './images/AMI.jpg';
import { PageHeader } from "react-bootstrap";

require('./css/fullstack.css');




export default class App extends React.Component {

    addHeaderImg() {
        let headerBg = new Image();
        headerBg.src = HeaderBackgroundImage;
    }

    render () {
        return (
            <PageHeader>
                <div className='header-contents'>
                    {/* {this.addHeaderImg()} */}
                    <Pro color="secondary"/>
                    <div>M317</div>
                    <Pro color="secondary"/>
                    <Hello name='M317' />
                </div>
            </PageHeader>
        );
    }
}
