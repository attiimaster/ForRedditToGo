import React, { Component } from 'react';
import './css/Home.css';

import ThreadBox from "../components/ThreadBox";
import SortBox from "../components/SortBox";
import LoadingScreen from "../components/LoadingScreen";

class Home extends Component {
  constructor(props) {
	super(props);
	this.state = { listing: null, loading: true, sort: { value: "Hot", top: "Hour" } };
  this.handleSort = this.handleSort.bind(this);
  }
  componentDidMount() {
    const { mySubreddits, loggedIn } = this.props;

    if (mySubreddits && loggedIn) {
      const arr = mySubreddits.map(sub => sub.data.display_name);

      fetch(`https://www.reddit.com/r/${arr.join("+")}/.json?limit=100`)
      .then(res => res.json())
      .then(data => this.setState({ listing: data, loading: false }))
      .catch(err => console.error(err))
    } else {
      this.setState({ loading: false });
    }
  }
  handleSort(e) {
    this.setState({ loading: true, sort: { value: e.target.form[0].value, top: e.target.form[1].value } });

    const { mySubreddits, loggedIn } = this.props;

    if (mySubreddits && loggedIn) {
      const arr = mySubreddits.map(sub => sub.data.display_name);

      const top = e.target.form[0].value === "top" ? `&t=${e.target.form[1].value}` : "";

      fetch(`https://www.reddit.com/r/${arr.join("+")}/${e.target.form[0].value}.json?limit=100${top}`)
      .then(res => res.json())
      .then(data => this.setState({ listing: data, loading: false }))
      .catch(err => console.error(err))
    } else {
      this.setState({ loading: false });
    }
  }

  render() {
    const { listing, loading, sort } = this.state;

    if (loading) {
      return ( <LoadingScreen /> );
    
    } else {
	    return (
	      <div className="Home">
          
          <Banner />
          
          {
            listing ? 
            <div className="container">
              <SortBox onChange={ this.handleSort } active={ sort } values={[ "Hot", "New", "Controversial", "Top" ]} />
              { listing.data.children.map((post, i) => <ThreadBox { ...post } key={i} />) }
            </div>
            :
            <Sections />
          }
    
	      </div>
	    );
    }
  }
}

export default Home;

const Banner = () => {
  return (
    <header className="home-banner">
        <div className="banner-text">
          <h1>For Reddit,To Go</h1>
        </div>
        <img alt="" src={ `${process.env.PUBLIC_URL}/images/walker.png` } />
    </header>
  );
}
const Sections = () => {
  return (
    <div className="container">
      <section className="frontpage-section">
        <h1>Listen to Reddit, while getting stuff done.</h1>
        <p>Reddit To Go is a web application intended for portable devices that leverages the <b>Text to Speech</b> features of modern browsers to read out reddit threads. For now please consider using the latest version of <b>Google Chrome</b> or <b>Mozilla Firefox</b> to ensure functionality and the best possible user experience.</p>
        <p>RedditToGo fits some subreddits more than others. Where it excels are textbased threads and comment trees. Accessing threads that share images, videos or links is possible, but for now you will have to follow the link to the original source to consume it.</p>
        <p>Features like messaging, mod features, etc are not included for now, because this is meant to be a complementary service one can use if needed.</p>
        <p>If you want to suggest or contribute a feature, feel free to contact me on my page or on github.</p> 
      </section>
  
      <section className="frontpage-section">
        <h1>How to use / main features</h1>
        <p>When reading a thread a user may use the synthesizer buttons to control the speech synthesis. Pressing <b>PLAY</b> will read the thread from beginning to end. You may skip or relisten to individual posts by using the <b>BACK</b> / <b>SKIP</b> buttons respectively. <b>STOP</b> will halt and cancel all queued messages.</p>
        <p>You may also select a <b>READMODE</b>. For now there is <b>STANDARD</b> and <b>TOP COMMENTS ONLY</b>. <b>STANDARD</b> will read the thread as is with all comments including some (or all, depending on the volume) high rated replies, while <b>TOP COMMENTS ONLY</b> only reads, well, top comments.</p>
        <p>Comments get initialized with the phrase: <i>USERNAME comments...</i> while replies get initialized with <i>USERNAME replies...</i></p>
      </section>
  
      <section className="frontpage-section">
        <h1>Contact</h1>
        <p>If you find any bugs or have suggestions please feel free to contact me on my page or on github. I built this project for myself initially, but figured some people might find it useful. I would be stoked to improve <b>For Reddit, To Go</b> for others aswell.</p>
        
        <div className="socialmedia-icons">
          <a href="https://attiimaster.github.io/go" target="_blank" rel="noopener noreferrer"><i className="fas fa-envelope"></i></a>
          <a href="https://github.com/attiimaster/ForRedditToGo" target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i></a>
        </div>
      </section>
    </div>
  );
}