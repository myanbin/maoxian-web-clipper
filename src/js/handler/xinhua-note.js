"use strict";

import T           from '../lib/tool.js';
import Log             from '../lib/log.js';
import MxWcStorage     from '../lib/storage.js';
import SavingTool      from '../saving/saving-tool.js';

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