import React, {PropTypes} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import NavigationViewContainer from './navigation/NavigationViewContainer';
import AppRouter from './AppRouter';
import * as snapshotUtil from '../utils/snapshot';
import * as SessionStateActions from '../modules/session/SessionState';
import store from '../redux/store';
import DeveloperMenu from '../components/DeveloperMenu';

const AppView = React.createClass({
  propTypes: {
    isReady: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired
  },
  componentDidMount() {
    snapshotUtil.resetSnapshot()
      .then(snapshot => {
        const {dispatch} = this.props;

        // TODO: Removed for the time being as to not cause hickups during initial release
        // Should fix in the future to allow saving of state between app sessions.
        // if (snapshot) {
        //   dispatch(SessionStateActions.resetSessionStateFromSnapshot(snapshot));
        // } else {
        //   dispatch(SessionStateActions.initializeSessionState());
        // }

        dispatch(SessionStateActions.initializeSessionState());

        store.subscribe(() => {
          snapshotUtil.saveSnapshot(store.getState());
        });
      });
  },

  render() {
    if (!this.props.isReady) {
      return (
        <View>
          <ActivityIndicator style={styles.centered}/>
        </View>
      );
    }

    return (
      <View style={{flex: 1}}>
        <NavigationViewContainer router={AppRouter} />
        {__DEV__ && <DeveloperMenu />}
      </View>
    );
  }
});

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignSelf: 'center'
  }
});

export default AppView;
