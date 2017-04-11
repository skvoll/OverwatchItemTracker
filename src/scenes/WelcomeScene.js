"use strict";

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Image,
    Text,
} from 'react-native';
import {TabViewAnimated} from 'react-native-tab-view';

import CONFIG from './../config';
import _ from './../l10n';
import {
    Layout,
    Button,
} from './../components';
import Scene from './Scene';

export class WelcomeScene extends Scene {
    static propTypes = {
        type: React.PropTypes.oneOf(['whats-new', 'tips',]).isRequired,
    };

    static defaultProps = {};

    constructor(props, context, updater) {
        super(props, context, updater);

        if (this.navigator.getCurrentRoutes().length > 1) {
            this.hardwareBackPress = () => this.navigationPop();
        }

        let types = {
            "whats-new": {
                title: `${_('WHATS_NEW_TITLE')} ${_('IN')} ${CONFIG.VERSION}`,
                index: 0,
                routes: [{key: 'whats-new',},],
            },
            "tips": {
                title: _('TIPS'),
                index: 0,
                routes: [{key: 'tip1',}, {key: 'tip2',}, {key: 'tip3',}, {key: 'tip4',},],
            },
        };

        this.state = types[this.props.type];
    }

    onClose() {
        if (this.hardwareBackPress) {
            this.navigationPop();

            return;
        }

        this.navigator.resetTo({name: 'MainScene',});
    }

    tabRenderFooter() {
        let pager, items = [];

        this.state.routes.map((item, index) => {
            items.push(
                <View
                    key={index}
                    style={[
                        styles.pagerItem,
                        (this.state.index === index ? styles.pagerItemActive : null)
                    ]}
                />
            );
        });

        if (items.length > 0) {
            pager = (
                <View style={styles.pager}>
                    {items}
                </View>
            );
        }

        return (
            <View style={styles.footer}>
                {pager}
                <Button title={_('CLOSE')} icon="close" onPress={() => this.onClose()}/>
            </View>
        );
    }

    tabRenderScene({route}) {
        switch (route.key) {
            case 'whats-new':
                return (
                    <ScrollView contentContainerStyle={styles.tab}>
                        <Text style={styles.text}>{_('WHATS_NEW_TEXT')}</Text>
                    </ScrollView>
                );
                break;
            case 'tip1':
                return (
                    <View style={styles.tab}>
                        <Image source={require('./../assets/tips/tip1.jpg')} style={styles.tip}/>
                    </View>
                );
                break;
            case 'tip2':
                return (
                    <View style={styles.tab}>
                        <Image source={require('./../assets/tips/tip2.jpg')} style={styles.tip}/>
                    </View>
                );
                break;
            case 'tip3':
                return (
                    <View style={styles.tab}>
                        <Image source={require('./../assets/tips/tip3.jpg')} style={styles.tip}/>
                    </View>
                );
                break;
            case 'tip4':
                return (
                    <View style={styles.tab}>
                        <Image source={require('./../assets/tips/tip4.jpg')} style={styles.tip}/>
                    </View>
                );
                break;
        }
    }

    tabHandleChangeTab(index) {
        this.setState({
            index: index,
        });
    }

    render() {
        return (
            <Layout
                toolbarTitle={this.state.title}
                onToolbarIconPress={this.hardwareBackPress}
                background={CONFIG.COLORS.DARK_BLUE}
            >

                <TabViewAnimated
                    navigationState={this.state}
                    renderFooter={() => this.tabRenderFooter()}
                    renderScene={(route) => this.tabRenderScene(route)}
                    onRequestChangeTab={(index) => this.tabHandleChangeTab(index)}
                    style={styles.tabs}
                />

            </Layout>
        );
    }
}

const styles = StyleSheet.create({
    tabs: {
        flex: 1,
    },
    footer: {
        padding: 8,
    },
    pager: {
        height: 48,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pagerItem: {
        height: 8,
        width: 8,
        marginHorizontal: 4,
        borderRadius: 4,
        backgroundColor: CONFIG.COLORS.LIGHT_BLUE,
    },
    pagerItemActive: {
        height: 12,
        width: 12,
        borderRadius: 6,
    },
    tab: {
        flex: 1,
    },
    tip: {
        flex: 1,
        height: null,
        width: null,
        resizeMode: 'contain',
    },
    text: {
        margin: 16,
        fontSize: 18,
        fontFamily: 'Futura',
        color: CONFIG.COLORS.COMMON,
    },
});
