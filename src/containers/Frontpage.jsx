import React, { Component } from 'react';
import './css/Frontpage.css';

import ThreadBox from "../components/ThreadBox";
import ErrorBox from "../components/ErrorBox";
import SortBox from "../components/SortBox";
import LoadingScreen from "../components/LoadingScreen";

import { fetchFrontpage } from "../services/user.service.js";
// import history from "../helpers/history";
      
// const uri =  process.env.NODE_ENV === "production" ? "/ForRedditToGo" : "/x";

class Frontpage extends Component {
  constructor(props) {
	super(props);
	this.state = { listing: null, loading: true, sort: { value: "Hot", top: "Hour" } };
  this.handleSort = this.handleSort.bind(this);
  }
  componentDidMount() {
    const { mySubreddits, loggedIn } = this.props;

    fetchFrontpage(mySubreddits)
    .then(data => this.setState({ listing: data, loading: false }))
    .catch(err => console.error(err))
  }
  
  handleSort(e) {
    const { mySubreddits, loggedIn } = this.props;
    const sort = { value: e.target.form[0].value, top: e.target.form[1].value };
    
    this.setState({ loading: true, sort });

    fetchFrontpage(mySubreddits, sort)
    .then(data => this.setState({ listing: data, loading: false }))
    .catch(err => console.error(err))
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