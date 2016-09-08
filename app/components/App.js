import React, { Component } from 'react'

import DanzeImg from '../assets/BillyDanze.svg'
import '../styles/normalize.css'
import '../styles/app.css'

export default class App extends Component {
  render() {
    return(
      <div id="wrapper">
        <header>
          <img src={DanzeImg} />
          <div className="title">
            <h1>Danze</h1>
          </div>
        </header>
        <section>
          <h2>About</h2>
          <p>As part of automated testing we tend to adopt a page object model</p>
        </section>
      </div>
    )
  }
}