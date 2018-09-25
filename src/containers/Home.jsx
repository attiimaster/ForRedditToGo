import React, { Component } from 'react';
import './css/Home.css';

class Home extends Component {
  constructor(props) {
	super(props);
	this.state = {};
  }
  componentDidMount() {}

  render() {
    const { encoded } = this.state;
	  return (
	    	<div className="Home">
  
          <header className="home-banner">
              <div className="banner-text">
                <h1>For Reddit, To Go</h1>
                <h3>Listen to Reddit while doing stuff.</h3>
              </div>
          </header>

          <div className="container">
            <section className="frontpage-section">
              <h1>💡 Quick explanation</h1>
              <p>Listen to Reddit, while walking, cooking or whatever. Reddit To Go is a web application intended for portable devices that leverages the <b>Text to Speech</b> Feature of modern browsers to read out reddit threads. For now please consider using <b>Google Chrome</b> or <b>Mozilla Firefox</b> to ensure the best possible user experience.</p>
              <p><b>Please note:</b> This is not a substitute for browsing reddit. Although threads with links, images and videos can be accessed, it's main focus are textbased threads.</p>
              <p>Features like messaging, mod features, etc are not included for now because I do not want to create another reddit client, but a complementary web service one can use if needed.</p>
              <p>If you want to suggest or contribute a feature, feel free to contact me here or on github.</p> 
            </section>
      
            <section className="frontpage-section">
              <h1>👀 Demo</h1>
              <p>When reading a thread a user may use the synthesizer buttons to control the speech synthesis. Pressing <b>PLAY</b> will read the thread from beginning to end. You may skip or relisten to individual posts by using the <b>BACK</b> / <b>SKIP</b> buttons respectively. <b>STOP</b> will halt and cancel all queued messages.</p>
              <p>You may also select a <b>READMODE</b>. For now there is <b>STANDARD</b> and <b>TOP COMMENTS ONLY</b>. <b>STANDARD</b> will read the thread as is with all comments including some (or all, depending on the volume) high rated replies, while <b>TOP COMMENTS ONLY</b> only reads, well, top comments.</p>
              <p>Comments get initialized with the phrase: <i>USERNAME comments...</i> while replies get initialized with <i>USERNAME replies...</i></p>
            </section>
      
            <section className="frontpage-section">
              <h1>💪 Major advantages</h1>
              <p>Free up your eyes to do something else!</p>
              <p>It is quick and easy.</p>
            </section>
      
            <section className="frontpage-section">
              <h1>📣 Contact</h1>
              <p>If you find any bugs or have suggestions please feel free to contact me. I built this project for myself to use, but if people find it useful I would be stoked to improve it.</p>
              
              <form className="contact-form">
                <input type="text" placeholder="Enter name" />
                <input type="text" placeholder="Enter email" />
                <textarea placeholder="Enter your message" />
                <input type="submit" />
              </form>
            </section>
          </div>
  
	    	</div>
	  );
  }
}

export default Home;