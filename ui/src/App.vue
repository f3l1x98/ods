<template>
  <v-app id="app">
    <v-navigation-drawer v-model="drawer" clipped app>
      <v-list>
        <v-list-item v-for="item in items" :key="item.title" :to="item.route">
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app dense dark clipped-left color="primary">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer />
      <v-toolbar-title>{{ routerTitle }}</v-toolbar-title>
      <v-spacer />
      <login />
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import RouterMeta from './routerMeta';

import Login from '@/components/Login.vue';
import Router from '@/router';

@Component({
  components: {
    login: Login,
  },
})
export default class App extends Vue {
  private title = 'Open-Data-Service';

  private routerTitle = '';

  private drawer = null;

  private items = [
    { title: 'Dashboard', route: '/' },
    { title: 'Datasources', route: '/datasources' },
    { title: 'Pipelines', route: '/pipelines' },
    { title: 'About', route: '/about' },
  ];

  private created(): void {
    this.routerTitle = (Router.currentRoute.meta as RouterMeta).title ?? '';

    Router.afterEach(to => {
      this.routerTitle = (to.meta as RouterMeta).title ?? '';
    });
  }
}
</script>

<style>
html {
  overflow: auto !important;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
