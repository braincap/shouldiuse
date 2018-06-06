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

class App extends Component {
  state = {
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
    if (this.state.phraseOne.length < 3 || this.state.phraseTwo.length < 3) {
      Alert.error('Please enter longer phrases in both boxes for comparison', {
        position: 'bottom',
        effect: 'jelly',
        timeout: 3000
      });
      return;
    }

    let res;
    try {
      res = await axios.get(
        `/api/search_phrases/?phraseOne=${this.state.phraseOne}&phraseTwo=${
          this.state.phraseTwo
        }`
      );
      const { phraseOne, phraseTwo } = res.data;
      this.setState({
        phraseOneResults: phraseOne,
        phraseTwoResults: phraseTwo,
        winner:
          Object.values(phraseOne).reduce(
            (sum, currentValue) => sum + currentValue
          ) >
          Object.values(phraseTwo).reduce(
            (sum, currentValue) => sum + currentValue
          )
            ? 'phraseOne'
            : 'phraseTwo'
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
                  this.state.winner === 'phraseOne' ? 'winner' : 'loser'
                }`}
                value={this.state.phraseOne}
                onChange={e =>
                  this.setState({
                    phraseOne: e.target.value.toLocaleLowerCase(),
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
                  this.state.winner === 'phraseTwo' ? 'winner' : 'loser'
                }`}
                value={this.state.phraseTwo}
                onChange={e =>
                  this.setState({
                    phraseTwo: e.target.value.toLocaleLowerCase(),
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
                {/* <img src={Button} alt="Button" /> */}
                <h1>></h1>
              </button>
            }
          </form>
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

/*
<ul
              className={`result-number ${
                this.state.winner === 'phraseOne' ? 'winner' : 'loser'
              }`}
            >
              {Object.values(this.state.phraseOneResults).map(
                (value, index) => (
                  <li key={Object.keys(this.state.phraseOneResults)[index]}>
                    <h4>{value.toLocaleString()}</h4>
                  </li>
                )
              )}
            </ul>
            <ul className="result-title">
              {Object.keys(this.state.phraseOneResults).map(value => (
                <li key={value}>
                  <h4>{value}</h4>
                </li>
              ))}
            </ul>
            <ul
              className={`result-number ${
                this.state.winner === 'phraseTwo' ? 'winner' : 'loser'
              }`}
            >
              {Object.values(this.state.phraseTwoResults).map(
                (value, index) => (
                  <li key={Object.keys(this.state.phraseTwoResults)[index]}>
                    <h4>{value.toLocaleString()}</h4>
                  </li>
                )
              )}
            </ul>
*/
