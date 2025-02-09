/**
 * 指定ミリ秒だけ処理を停止するスリープ関数
 * @param {number} ms - ミリ秒
 * @returns {Promise<void>}
 */
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
