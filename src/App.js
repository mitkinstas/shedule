import React, { Component } from 'react';
import './App.css';
import R from 'ramda';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {start: '', end: ''};
        this.handleOnMouseDown = this.handleOnMouseDown.bind(this);
        this.handleOnMouseUp = this.handleOnMouseUp.bind(this);
        this.handleOnMouseMove = this.handleOnMouseMove.bind(this);
        this.data = [];
        for (let days = 1; days <= 7; days++) {
            let day = {day: days, hours: []};
            for (let hour = 1; hour <= 24; hour++) {
                let hoursData = {day: days, hour: hour};
                day.hours.push(hoursData);
            }
            this.data.push(day);
        }
    }

    filterHours(days) {
        const max = R.max(this.state.start.hour, this.state.end.hour);
        const min = R.min(this.state.start.hour, this.state.end.hour);
        const between = function(item){
            return (item.hour >= min) && (item.hour <= max);
        };
        let h = [];
        days.forEach(item => {
            let filtered = R.filter(between, item.hours);
            h = R.concat(h, filtered);
        });
        return h;
    }

    filterDays() {
        const max = R.max(this.state.start.day, this.state.end.day);
        const min = R.min(this.state.start.day, this.state.end.day);
        const between = function(item){
            return (item.day >= min) && (item.day <= max);
        };
        let hours = this.filterHours(R.filter(between, this.data));
        this.setActiveHours(hours);
    }

    dropActiveClassFromHours() {
        this.data.forEach(item => {
            item.hours.forEach(item => {
                item.active = false;
            });
        });
    }

    setActiveHours(data) {
        //this.dropActiveClassFromHours();
        let isActiveStart = this.state.startActive || false;
        data.forEach(item => {
            item.active = !isActiveStart;
        });
        this.forceUpdate();
    }

    handleOnMouseDown(data, e) {
        if(this.isRightClick(e)) {
            return false;
        } else {
            this.setState({start: data, dragging: true, startActive: data.active});
        }
    }

    handleOnMouseUp(data, e) {
        let self = this;
        if(this.isRightClick(e)) {
            return false;
        } else {
            this.setState({end: data, dragging: false}, function(){
                self.filterDays();
            });
        }

    }

    handleOnMouseMove(data, e) {
        let self = this;
        if (this.state.dragging) {
            this.setState({end: data}, function(){
                self.filterDays();
            });
        }
    }

    isRightClick(e) {
        if (e.which) {
            return (e.which === 3);
        } else if (e.button) {
            return (e.button === 2);
        }
        return false;
    }

  render() {
    return (
        <div className="App">
            {this.data.map((item, i) => {
                return (<div key={'day' + i} className="App__day">
                    {item.hours.map((item, i) => {
                        let blockClass = "App__hour";
                        if ((i + 1) % 3 === 0) {
                            blockClass = "App__hour App__hour_white_yes";
                        }
                            if ((i + 1) === 1) {
                            blockClass = "App__hour App__hour_first_yes";
                        }
                        if (item.active) {
                            blockClass += " active";
                        }
                        return (<div
                            key={'hour' + i}
                            className={blockClass}
                            onMouseUp={this.handleOnMouseUp.bind(this, item)}
                            onMouseDown={this.handleOnMouseDown.bind(this, item)}
                            onMouseMove={this.handleOnMouseMove.bind(this, item)}
                        />);
                    })}
                </div>)
            })}
        </div>
    );
  }
}

export default App;
