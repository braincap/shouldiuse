import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';
import Alert from 'react-s-alert';
import Logo from './logo.svg';
import WikipediaLogo from './assets/wiki.png';
import GuardianLogo from './assets/guardian.png';
import NYTLogo from './assets/nyt.png';
import ReactGA from 'react-ga';
import 'babel-polyfill';

class App extends Component {
  state = {
    info: localStorage.getItem('info') || 'show',
    logos: [WikipediaLogo, NYTLogo, GuardianLogo],
    phraseOne: '',
    phraseTwo: '',
    phraseOneResults: {
      wikipedia: null,
      nyt: null,
      guardian: null
    },
    phraseTwoResults: {
      wikipedia: null,
      nyt: null,
      guardian: null
    },
    winner: null,
    phraseOnePlaceHolder: [
      'peak interest',
      'deep seeded',
      'adverse effects',
      'defuse the situation'
    ],
    phraseTwoPlaceHolder: [
      'pique interest',
      'deep seated',
      'adverse affects',
      'diffuse the situation'
    ]
  };

  componentDidMount = () => {
    ReactGA.initialize('UA-120514726-1');
    ReactGA.pageview(window.location.pathname);
    localStorage.setItem('info', this.state.info);
    this.placeHolderShifter();
  };

  placeHolderShifter = () => {
    setTimeout(() => {
      let tempArrayOne = this.state.phraseOnePlaceHolder;
      let tempArrayTwo = this.state.phraseTwoPlaceHolder;
      tempArrayOne.push(tempArrayOne.shift());
      tempArrayTwo.push(tempArrayTwo.shift());
      this.setState({
        phraseOnePlaceHolder: tempArrayOne,
        phraseTwoPlaceHolder: tempArrayTwo
      });
      this.placeHolderShifter();
    }, 3000);
  };

  handleOnSubmit = async e => {
    e.preventDefault();
    localStorage.setItem('info', 'hide');
    this.setState({ info: 'hide' });
    if (this.state.phraseOne.length < 3 || this.state.phraseTwo.length < 3) {
      Alert.error('Please enter longer phrases in both boxes for comparison', {
        position: 'bottom',
        effect: 'jelly',
        timeout: 3000
      });
      return;
    }
    ReactGA.event({
      category: 'Form',
      action: 'Submitted the form',
      gaOptions: {
        phraseOne: this.state.phraseOne,
        phraseTwo: this.state.phraseTwo
      }
    });

    let res;
    try {
      res = await axios.get(
        `/api/search_phrases/?phraseOne=${this.state.phraseOne.trim()}&phraseTwo=${this.state.phraseTwo.trim()}`
      );
      const { phraseOne, phraseTwo } = res.data;
      const phraseOneTotals = Object.values(phraseOne).reduce(
        (sum, currentValue) => sum + currentValue
      );
      const phraseTwoTotals = Object.values(phraseTwo).reduce(
        (sum, currentValue) => sum + currentValue
      );
      this.setState({
        phraseOneResults: phraseOne,
        phraseTwoResults: phraseTwo,
        winner:
          phraseOneTotals > phraseTwoTotals
            ? 'phraseOne'
            : phraseOneTotals < phraseTwoTotals
              ? 'phraseTwo'
              : 'equal'
      });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <div className="App">
        <div className="circle">
          <img className="logo" src={Logo} alt="shouldiuse" />
          <form onSubmit={this.handleOnSubmit}>
            <div className="inputs">
              <input
                autoFocus
                type="text"
                id="phraseOne"
                placeholder={this.state.phraseOnePlaceHolder[0]}
                className={`phraseBox ${
                  this.state.winner === 'phraseOne'
                    ? 'winner'
                    : this.state.winner === 'phraseTwo'
                      ? 'loser'
                      : ''
                }`}
                value={this.state.phraseOne}
                onChange={e =>
                  this.setState({
                    phraseOne: e.target.value
                      .toLocaleLowerCase()
                      .replace(/["]+/g, ''),
                    winner: false,
                    phraseOneResults: {
                      wikipedia: null,
                      nyt: null,
                      guardian: null
                    },
                    phraseTwoResults: {
                      wikipedia: null,
                      nyt: null,
                      guardian: null
                    }
                  })
                }
              />
              <h1 className="or">or</h1>
              <input
                type="text"
                id="phraseTwo"
                placeholder={this.state.phraseTwoPlaceHolder[0]}
                className={`phraseBox ${
                  this.state.winner === 'phraseTwo'
                    ? 'winner'
                    : this.state.winner === 'phraseOne'
                      ? 'loser'
                      : ''
                }`}
                value={this.state.phraseTwo}
                onChange={e =>
                  this.setState({
                    phraseTwo: e.target.value
                      .toLocaleLowerCase()
                      .replace(/["]+/g, ''),
                    winner: false,
                    phraseOneResults: {
                      wikipedia: null,
                      nyt: null,
                      guardian: null
                    },
                    phraseTwoResults: {
                      wikipedia: null,
                      nyt: null,
                      guardian: null
                    }
                  })
                }
              />
            </div>
            {
              <button
                type="submit"
                onClick={this.handleOnSubmit}
                className="submit-button"
              >
                <h1>></h1>
              </button>
            }
          </form>
          <div
            className={`info-box ${
              Object.values(this.state.phraseOneResults)[0] === null &&
              this.state.info === 'show'
                ? 'show'
                : 'hide'
            }`}
          >
            <button
              className="close"
              onClick={() => {
                localStorage.setItem('info', 'hide');
                this.setState({ info: 'hide' });
              }}
            >
              x
            </button>
            <p>
              Ever been confused if you should use "deep seeded" or "deep
              seated"? Find out most used phrase among major publications. We'll
              help you search most used phrase in <strong>Wikipedia</strong>,{' '}
              <strong>New York Times</strong> and <strong>The Guardian</strong>!
            </p>
          </div>
          <ul
            className={`results ${
              Object.values(this.state.phraseOneResults)[0] === null
                ? 'no-results'
                : ''
            }`}
          >
            {Object.keys(this.state.phraseOneResults).map((value, index) => (
              <li key={index} className={`result-item ${value}`}>
                <ul>
                  <li
                    className={`numbers phrase-one ${
                      this.state.winner === 'phraseOne' ? 'winner' : 'loser'
                    }`}
                  >
                    <h2>
                      {!this.state.winner
                        ? 0
                        : this.state.phraseOneResults[value].toLocaleString()}
                    </h2>
                  </li>
                  <li className="source-logo">
                    <img src={this.state.logos[index]} alt={value} />
                  </li>
                  <li
                    className={`numbers phrase-two ${
                      this.state.winner === 'phraseTwo' ? 'winner' : 'loser'
                    }`}
                  >
                    <h2>
                      {!this.state.winner
                        ? 0
                        : this.state.phraseTwoResults[value].toLocaleString()}
                    </h2>
                  </li>
                </ul>
                <hr />
              </li>
            ))}
          </ul>
        </div>
        <Alert stack={{ limit: 3 }} />
      </div>
    );
  }
}

export default App;
