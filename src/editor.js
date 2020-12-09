import Card2 from './Card2';
import { PDFViewer } from '@react-pdf/renderer';
import React, { Fragment } from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
let sprintf = require('sprintf-js').sprintf;
let _ = require('lodash');
let fs, path, ipcRenderer;
if (window.require) {
  fs = window.require('fs');
  path = window.require('path');
  ipcRenderer = window.require('electron').ipcRenderer; //
}
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});
class A4Lian extends React.Component {
  constructor() {
    super();
    if (window.require) {
      this.initpath = window
        .require('electron')
        .ipcRenderer.sendSync('getpath');
    }
    let cfg = this.getconfig();
    if (!cfg.start) cfg.start = 1;
    if (!cfg.num) cfg.num = 1;
    if (!cfg.year) {
      let d = new Date();
      let y = d.getFullYear();
      cfg.year = y - 2000;
    }
    this.state = cfg;
    if (ipcRenderer) {
      ipcRenderer.on('request_close', () => {
        this.saveconfig(this.state);
        ipcRenderer.send('close');
      });
    }
  }
  getconfig = () => {
    if (window.require) {
      try {
        const configName = 'config.json';
        let configPath = path.join(this.initpath, configName);
        let data = fs.readFileSync(configPath, { enconding: 'utf-8' });
        return JSON.parse(data);
      } catch (e) {
        return {};
      }
    } else {
      let todos = localStorage.getItem('a4_print');
      let initialState = {};
      if (todos) {
        try {
          initialState = JSON.parse(todos);
        } catch (SyntaxError) {
          initialState = {};
        }
      }
      return initialState;
    }
  };
  componentWillUnmount = () => {
    this.saveconfig();
  };

  saveconfig = data => {
    if (window.require) {
      const configName = 'config.json';
      let configPath = path.join(this.initpath, configName);
      fs.writeFileSync(configPath, JSON.stringify(data));
    } else {
      localStorage.setItem('a4_print', JSON.stringify(data));
    }
  };
  onClick = () => {
    if (ipcRenderer) {
      ipcRenderer.send('print', {});
    }
  };
  onChange = event => {
    let start = parseInt(event.target.value, 10);
    if (_.isNaN(start)) {
      start = 0;
    }
    this.setState({ start: start }, () => {
      if (!window.require) {
        localStorage.setItem('a4_print', JSON.stringify(this.state));
      }
    });
  };
  onChange_num = event => {
    let start = parseInt(event.target.value, 10);
    if (_.isNaN(start)) {
      start = 0;
    }
    this.setState({ num: start }, () => {
      if (!window.require) {
        localStorage.setItem('a4_print', JSON.stringify(this.state));
      }
    });
  };
  onChange_year = event => {
    let start = parseInt(event.target.value, 10);
    if (_.isNaN(start)) {
      start = 0;
    }
    this.setState({ year: start }, () => {
      if (!window.require) {
        localStorage.setItem('a4_print', JSON.stringify(this.state));
      }
    });
  };
  render() {
    let start = this.state.start;
    let pages = [];
    for (var i = 0; i < this.state.num; i++) {
      let str_start = sprintf('%04d%04d', this.state.year, start);
      pages.push(
          <Card2 key={i} start={str_start}/>
      );
      start += 1;
    }
    return (
      <div style={{ position: 'relative' }}>
        <div className="only_screen">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <label>起始号码</label>
              <input value={this.state.start} onChange={this.onChange} />
              <label>页数</label>
              <input value={this.state.num} onChange={this.onChange_num} />
            </div>
            <div>
              <label>year</label>
              <input value={this.state.year} onChange={this.onChange_year} />
            </div>
          </div>
        </div>
        <PDFViewer style={{ width: '100vw', height: '100vh' }}>
          <Document>{pages}</Document>
        </PDFViewer>
      </div>
    );
  }
}
export default A4Lian;
