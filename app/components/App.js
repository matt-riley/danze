import React, { Component } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { github } from 'react-syntax-highlighter/dist/styles'

// import DanzeImg from '../assets/BillyDanze.svg'
import HeaderImg from './HeaderImg'
import '../styles/normalize.css'
import '../styles/app.css'

export default class App extends Component {
  render() {
    return(
      <div id="wrapper">
        <header>
          <HeaderImg />
        </header>
        <section>
          <h2>About</h2>
          <AboutContent />
          <h2>How to use</h2>
          <HowContent />
          <h2>Links</h2>
          <LinksContent />
        </section>
      </div>
    )
  }
}

const AboutContent = () => (
  <div>
    <p>
      In order to assist in the creation of a new test suite for native apps and a desire to easily create a <a href="http://martinfowler.com/bliki/PageObject.html">
      Page Object Model</a> the thought crossed my mind to use a little Ruby 'magic' to do some of the labour intensive work.
    </p>
    <p>
      Starting with iOS first (because that's the most important, right? 😉) and inspired by the behaviour of parts of Rails, this is what I came up with.
    </p>
    <p>
      There is just over 60 lines of code in the file and it is far from complete but it gives a brief example of how useful Ruby can be.
    </p>
    <p>
      I was listening to <a href="https://en.wikipedia.org/wiki/M.O.P.">M.O.P.</a> when writing it, hence the name.
    </p>
    <iframe 
      width="560" 
      height="315" 
      src="https://www.youtube.com/embed/7DoqinbB2gs" 
      frameborder="0" 
      allowfullscreen
      >
    </iframe>
    <p/>
  </div>
)

const HowContent = () => (
  <div>
    <p>Place <a href="https://raw.githubusercontent.com/matt-riley/danze/master/view.rb">View.rb</a> into the directory where your page objects are going to be saved.</p>
    <p>Then for each Page/View class inherit View:</p>
    <SyntaxHighlighter language="ruby" style={ github } className="code">
      {ExampleClass}
    </SyntaxHighlighter>
    <p>This will create methods for buttons and textfields in the view (using default iOS elements but can be expanded)</p>
    <p>Not only will it create easily accessible methods for the element but it will create 'touch_button_name' and 'fill_text_field_name' methods</p>
    <p>This allows you to build your Page Object quite quickly, as an example:</p>
    <SyntaxHighlighter language="ruby" style={ github } className="code">
      {ExampleMethodsForClass}
    </SyntaxHighlighter>
  </div>
)

const LinksContent = () => (
  <div>
    <p><a href="https://github.com/matt-riley/danze">Github</a> repo for the project</p>
    <p>My <a href="https://twitter.com/mjr1878">Twitter</a></p>
  </div>
)

const ExampleClass = `
  require_relative './view'
  
  class SignIn < View
  # some methods
  end
`

const ExampleMethodsForClass = `
  require_relative './view'

  class SignIn < View
    def login(email, password)
      fill_username_text_field email
      fill_password_text_field password
      touch_login_button
    end
  end
`