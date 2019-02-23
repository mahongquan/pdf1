import Card from './Card';
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
        <Page size="A4" style={styles.page} key={i}>
          <Card start={str_start} lian="第一联　存根联" />
          <Card start={str_start} lian="第二联　交款方收执" />
        </Page>
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
              <button onClick={this.onClick}>打印</button>
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
        <style jsx="true">
          {`
            .only_screen {
              width: 100%;
              top: 0px;
              left: 0px;
              background-color: #aaa;
            }
            .line_input {
              border: none;
              border-bottom: 1px solid #000;
            }
            @page {
              margin: 0;
            }
            body {
              margin: 0px 0px 0px 0px;
            }
            .sheet {
              margin: 0;
              overflow: hidden;
              position: relative;
              box-sizing: border-box;
              page-break-after: always;
            }

            /** Paper sizes **/
            .A3 .sheet {
              width: 297mm;
              height: 419mm;
            }
            .A3.landscape .sheet {
              width: 420mm;
              height: 296mm;
            }
            .A4 .sheet {
              width: 210mm;
              height: 296mm;
            }
            .A4.landscape .sheet {
              width: 297mm;
              height: 209mm;
            }
            .A5 .sheet {
              width: 148mm;
              height: 209mm;
            }
            .A5.landscape .sheet {
              width: 210mm;
              height: 147mm;
            }
            .letter .sheet {
              width: 216mm;
              height: 279mm;
            }
            .letter.landscape .sheet {
              width: 280mm;
              height: 215mm;
            }
            .legal .sheet {
              width: 216mm;
              height: 356mm;
            }
            .legal.landscape .sheet {
              width: 357mm;
              height: 215mm;
            }

            /** Padding area **/
            .sheet.padding-10mm {
              padding: 10mm;
            }
            .sheet.padding-15mm {
              padding: 15mm;
            }
            .sheet.padding-20mm {
              padding: 20mm;
            }
            .sheet.padding-25mm {
              padding: 25mm;
            }

            /** For screen preview **/
            @media screen {
              body {
                background: #e0e0e0;
              }
              .sheet {
                background: white;
                box-shadow: 0 0.5mm 2mm rgba(0, 0, 0, 0.3);
                margin: 5mm auto;
              }
            }

            /** Fix for Chrome issue #273306 **/
            @media print {
              .only_screen {
                display: none;
              }
              .A3.landscape {
                width: 420mm;
              }
              .A3,
              .A4.landscape {
                width: 297mm;
              }
              .A4,
              .A5.landscape {
                width: 210mm;
              }
              .A5 {
                width: 148mm;
              }
              .letter,
              .legal {
                width: 216mm;
              }
              .letter.landscape {
                width: 280mm;
              }
              .legal.landscape {
                width: 357mm;
              }
            }
          `}
        </style>
      </div>
    );
  }
}
export default A4Lian;