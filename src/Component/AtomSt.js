import { atom } from "recoil"

// 로그인 상태값 전역에서 사용되도록 atom 변수 사용
export const stLogin = atom({
    key : "stLogin",
    default : false
})

export const userInfo = atom({
    key: 'userInfo',
    default: {
      name: ''
    },
  });