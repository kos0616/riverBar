import $http from '@/CUSTOMER/axios';
import { ElMessage } from 'element-plus';
import handleError from '@/CUSTOMER/axios/error';

const PATH = '/api/Location/WritePlc';

type req = {
  /** 現地端代碼 */
  code?: string;
  /** 欲編輯的點位 */
  Tags: { Tag: string; Value: string | number }[];
};

type TypeResponse = {
  Tag: '672-1';
  Status: boolean;
  Message: '';
  OperationLog: '一級警戒水位警報ON/OFF設定成功';
  UpdateTime: '2024-08-07T18:47:21.49208+08:00';
}[];

/** 調整點位的值 */
export default async (req: req) => {
  const { code, Tags } = req;
  const API = `${PATH}/${code}`;
  if (!code) return ElMessage.error('沒有現地端代碼，請聯絡系統管理員');

  try {
    /** 復歸訊號 false */
    const isReverted = Tags.map((o) => ({ ...o, Value: checkValue(o.Value), isRevert: false }));
    const getter = await $http.put(API, isReverted);
    const res = getter.data as TypeResponse;
    if (res.some((r) => r.Status !== true)) {
      throw res
        .filter((r) => r.Status !== true)
        .map((o) => o.Message || o.OperationLog)
        .filter((o) => o)
        .join('\n');
    }
  } catch (error: any) {
    if (typeof error !== 'string') {
      handleError(error);
    }
    throw error;
  }
};

function checkValue(Value: string | number) {
  if (typeof Value === 'number') return Value;
  const parsed = parseFloat(Value);
  return isNaN(parsed) ? Value : parsed;
}
