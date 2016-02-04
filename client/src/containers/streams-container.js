import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getActivePerformances } from '../actions';
import { Link } from 'react-router';

import GridList from '../../node_modules/material-ui/lib/grid-list/grid-list';
import GridTile from '../../node_modules/material-ui/lib/grid-list/grid-tile';
import StarBorder from '../../node_modules/material-ui/lib/svg-icons/toggle/star-border';
import IconButton from '../../node_modules/material-ui/lib/icon-button';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: 800,
    height: 600,
    overflowY: 'auto',
    marginBottom: 24,
  },
};

export class StreamsContainer extends Component {
  constructor(props){
    super(props)
  }

  componentWillMount(){
    this.props.getActivePerformances()
  }

  render () {
    console.log(this.props.presentActiveStreams, 'in render');
    if (this.props.presentActiveStreams && this.props.presentActiveStreams.length) {
      return(
        <div style={ styles.root }>
          <GridList cellHeight={ 180 } style={ styles.gridList }>
            { this.renderEvents() }
          </GridList>
        </div>
      )
    } else {
      return (
        <div>
          <div>Welcome!</div>
          <img src='../../public/img/crowd.jpg' width='800' height='600' />
        </div>
      )
    }
  }

  renderEvents () {
    // return <div>Result</div>
    return this.props.presentActiveStreams.map((performance)=> {
      return (

        <Link to={`activeStream/${performance.room}`}>
          <GridTile
          key={performance.id}

          title={performance.title}
          subtitle={<span>by <b>{performance.room}</b></span>}
          actionIcon={<IconButton><StarBorder color="white"/></IconButton>}
          >
            <img src='../../public/img/crowd.jpg' />
          </GridTile>
        </Link>
      )
    })
  }
}

function mapStateToProps(state){
  return {
    presentActiveStreams : state.data.data.activeStreams
  }
}

const mapDispatchToProps = {
  getActivePerformances
};

export default connect(mapStateToProps,mapDispatchToProps)(StreamsContainer)