// 这么写的目的 既可以去 前端接口调用  也可以websocket的使用

import {KLineData} from '../models/chartData';

// 服务层函数，用于获取 K线图数据
export const getKLineChartData = async () => {
  try {
    const items = await KLineData.find();
    console.log(items, '图表数据');
    return items;
  } catch (error) {
    console.error('Error fetching K line chart data:', error);
    throw error; // 抛出错误，让调用者处理
  }
}
