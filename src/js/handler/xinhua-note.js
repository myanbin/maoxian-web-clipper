"use strict";

import T           from '../lib/tool.js';
import Log             from '../lib/log.js';
import MxWcStorage     from '../lib/storage.js';
import SavingTool      from '../saving/saving-tool.js';

import axios from 'axios';

let Global = null;

const ClippingHandler_XinhuaNote = {
  name: 'XinhuaNote',

  init: global => {
    // 接受全局对象
    Global = global;
  },

  getInfo: callback => {
    // 初始化、检查状态、声明配置
    callback({
      ready: true,
      supportFormats: ['html', 'md']
    });
  },

  saveClipping: async (clipping, feedback) => {
    // 保存剪裁任务的入口
    Log.debug('clipping via XinhuaNote', clipping);
    Log.debug('Fetcher', Global.Fetcher);

    SavingTool.startSaving(clipping, feedback, { mode: 'completeWhenAllTaskFinished' });

    var config = {
      method: 'get',
      url: 'https://pd.xinhua-news.cn/zzlb/api/app/acts/2/rounds/3/paper',
      headers: { 
        'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo3NjMsIm5hbWUiOiLpqazoibPlvawiLCJjZWxsbnVtYmVyIjpudWxsfSwiaXNzIjoicGQueGluaHVhLW5ld3MuY24iLCJleHAiOjE2MDMxODUwOTksImlhdCI6MTYwMjU4MDI5OX0.Gxjdsp-GeYJi-DX0bjDBfLnrWjbvONlWjinohohY0wg', 
        'Cookie': 'connect.sid=s%3Ak_piX_RszagYUDuYKzDz4iAjRBHs2deI.9Exgok%2BYE4c1qvGH9WLY1aIhMH5loB0M6GgP4jmVGDE'
      }
    };
    
    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });

    T.each(clipping.tasks, (task) => {
      // TODO: handle task
      SavingTool.taskCompleted(task.filename);
    });
  },

  handleClippingResult: it => {
    // 返回剪裁结果
    // TODO: no results
    it.url = "";
    return it;
  }
}

export default ClippingHandler_XinhuaNote;