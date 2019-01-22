import React, { Component } from 'react';
import './css/Frontpage.css';

import ThreadBox from "../components/ThreadBox";
import ErrorBox from "../components/ErrorBox";
import SortBox from "../components/SortBox";
import LoadingScreen from "../components/LoadingScreen";

import history from "../helpers/history";
      
const uri =  process.env.NODE_ENV === "production" ? "/ForRedditToGo" : "/x";

class Frontpage extends Component {
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
      fetch(`https://www.reddit.com/.json?limit=100`)
      .then(res => res.json())
      .then(data => this.setState({ listing: data, loading: false }))
      .catch(err => console.error(err))
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
    
    } else if (listing) {
	    return (
	      <div className="Frontpage">

          <div className="container">
          
            <header className="SubTitle">
              <h2>Frontpage</h2>
            </header>

            <SortBox onChange={ this.handleSort } active={ sort } values={[ "Hot", "New", "Controversial", "Top" ]} />
            { listing.data.children.map((post, i) => <ThreadBox { ...post } key={i} />) }
          
          </div>
	      </div>
	    );
    } else {
      return ( <ErrorBox /> );
    }
  }
}

export default Frontpage;