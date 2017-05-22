import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const imageDatas = (function(imageArr){
    for(var image of imageArr){
        image.imageURL = require('./images/' + image.fileName);
    }
    return imageArr;
})(require('./data/imageDatas.json'));

console.log(imageDatas);

class App extends Component {
    render() {
        return (
            <section className="stage">
                <section className="img-sec">
                </section>
                <nav className="controller-nav">
                    hello
                </nav>
            </section>
        );
    }
}

export default App;
