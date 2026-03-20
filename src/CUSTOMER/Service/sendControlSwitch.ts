import $http from '@/CUSTOMER/axios';
import { ElMessage } from 'element-plus';
import handleError from '@/CUSTOMER/axios/error';

const PATH = '/api/Location/WritePlc';

type req = {
  /** 現地端代碼 */
  code: string;
  /** 欲啟動的點位 */
  openTags: string | string[];
  /** 全部的點位 */
  allTags: string[];
  /** 橡皮壩復歸的規則 */
  isRubber?: boolean;
};

type TypeResponse = {
  Tag: '672-1';
  Status: boolean;
  Message: '';
  OperationLog: '一級警戒水位警報ON/OFF設定成功';
  UpdateTime: '2024-08-07T18:47:21.49208+08:00';
}[];

/** 調整開關，此開關能接受無數長度的項目 */
export default async (req: req) => {
  const { code, openTags, allTags } = req;
  if (!code) return ElMessage.error('沒有現地端代碼，請聯絡系統管理員');
  const API = `${PATH}/${code}`;

  const openTagsArray = (Array.isArray(openTags) ? openTags : [openTags]).filter((str) => str);

  const offValues = (allTags || [])
    .filter((str) => !openTagsArray.includes(str))
    .map((Tag) => ({ Tag, Value: false }));

  const preBody = [...openTagsArray.map((Tag) => ({ Tag, Value: false })), ...offValues];
  const postBody = [...openTagsArray.map((Tag) => ({ Tag, Value: true }))];
  /** 單一開關的關閉 */
  if (postBody.length === 0) postBody.push(...preBody);

  try {
    /** 操作單一開關時，不會進行預先關閉 */
    if ((allTags || []).length > 1) {
      /** isRevert: boolean 是否是復歸 當為 false 時 會寫入 log */
      const isReverted = preBody.map((o) => ({ ...o, isRevert: true }));
      const getter = await $http.put(API, isReverted);
      const res = getter.data as TypeResponse;
      handleControllerError(res);
      await delay();
    }

    /** 復歸訊號 false */
    const isReverted = postBody.map((o) => ({ ...o, isRevert: false }));
    const getter = await $http.put(API, isReverted);
    /** 橡皮壩特殊復歸 */
    if (req.isRubber) {
      await delay(15000);
      $http.put(
        API,
        postBody.map((o) => ({ ...o, Value: false }))
      );
    }

    const res = getter.data as TypeResponse;
    handleControllerError(res);
  } catch (error: any) {
    if (typeof error !== 'string') {
      handleError(error);
    }
    throw error;
  }
};

function delay(n?: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, n || 500);
  });
}

function handleControllerError(res: TypeResponse) {
  if (res.some((r) => r.Status !== true)) {
    throw res
      .filter((r) => r.Status !== true)
      .map((o) => o.Message || o.OperationLog)
      .filter((o) => o)
      .join('\n');
  }
}
