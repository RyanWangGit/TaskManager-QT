import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {createStore, applyMiddleware, Middleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { Tabs } from 'antd';
import { RocketOutlined, SwitcherOutlined } from "@ant-design/icons";
import styles from './index.module.css';
import ProcessTab from './components/process-tab';
import PerformanceTab from "./components/performance-tab";
import reducer from './reducers';
import { requestCPUCurrentSpeed, requestCPUInfo, requestCPULoad } from "./actions/cpu";
import { requestMemoryInfo, requestMemoryLoad } from "./actions/memory";
import { requestProcessInfo } from "./actions/process";
import { requestDiskLoad } from "./actions/disk";
import { requestGeneralInfo } from "./actions/general";

let middleware: Array<Middleware> = [thunkMiddleware];

if (process.env.NODE_ENV !== 'production') {
  const loggerMiddleware = createLogger();
  middleware.push(loggerMiddleware);
}


const store = createStore(
  reducer,
  applyMiddleware(...middleware)
);

const requestStaticInfo = () => {
  store.dispatch(requestCPUInfo());
  store.dispatch(requestMemoryInfo());
};

const requestDynamicInfo = () => {
  store.dispatch(requestGeneralInfo());
  store.dispatch(requestProcessInfo());
  store.dispatch(requestCPULoad());
  store.dispatch(requestCPUCurrentSpeed());
  store.dispatch(requestMemoryLoad());
  store.dispatch(requestDiskLoad());
};

// first dispatch the actions to request static information (only once)
requestStaticInfo();
requestDynamicInfo();

// periodically request dynamic information about process / cpu / memory / disk load etc.
setInterval(requestDynamicInfo, 1000);


const TaskManager = () => {
  return (
    <Tabs
      className={styles.tabs}
      tabBarStyle={{margin: 0}}
      defaultActiveKey="1"
      size="small"
    >
      <Tabs.TabPane
        className={styles.tabPanes}
        tab={
          <div>
            <SwitcherOutlined />Processes
          </div>
        }
        key="1">
        <ProcessTab />
      </Tabs.TabPane>
      <Tabs.TabPane
        className={styles.tabPanes}
        tab={
          <div>
            <RocketOutlined />Performance
          </div>
        }
        key="2">
        <PerformanceTab />
      </Tabs.TabPane>
    </Tabs>
  );
};

let rootElement = document.getElementById('root');

rootElement!.className += ' ' + styles.root;

ReactDOM.render(
  <Provider store={store}>
    <TaskManager />
  </Provider>,
  rootElement
);
