"use strict";

import React, {Component} from 'react';
import {
    StyleSheet,
    StatusBar,
    View,
} from 'react-native';
import {
    NavigationActions,
} from 'react-navigation';

import CONFIG from './config';
import Navigator from './screens/Navigator';

export default class Application extends Component {
    static propTypes = {};

    static defaultProps = {};

    navigation;

    constructor(props, context, updater) {
        super(props, context, updater);

        this.state = {
            currentRoute: null,
        };
    }

    navigate(route, params = {}) {
        if (this.state.currentRoute === route) {
            return;
        }

        this.setState({
            currentRoute: route,
        }, () => {
            this.navigation.dispatch(NavigationActions.navigate({routeName: route, params: params,}))
        });
    }

    reset(route, params = {}) {
        if (this.state.currentRoute === route) {
            return;
        }

        this.setState({
            currentRoute: route,
        }, () => {
            this.navigation.dispatch(NavigationActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({routeName: route, params: params,})
                ]
            }));
        });
    }

    back() {
        this.setState({
            currentRoute: this.navigation.state.routeName,
        }, () => {
            this.navigation.dispatch(NavigationActions.back())
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    hidden={__DEV__}
                    translucent={true}
                    backgroundColor="transparent"
                    barStyle="light-content"
                />
                <Navigator
                    ref={component => this.navigation = component}
                    screenProps={{application: this,}}
                    onNavigationStateChange={null}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: CONFIG.COLORS.DARK_BLUE,
    },
});
