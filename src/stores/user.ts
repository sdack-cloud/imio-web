import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export const useUserStore = defineStore('user', () => {
  // 状态
  const user = ref<User | null>(null)
  const isLoggedIn = ref(false)
  const loading = ref(false)

  // 计算属性
  const userName = computed(() => user.value?.name || '未登录')
  const userEmail = computed(() => user.value?.email || '')
  const userAvatar = computed(() => user.value?.avatar || 'https://i.loli.net/2017/08/21/599a521472424.jpg')

  const groupObj = ""; // 请求好友传参

  // 动作
  const logout = () => {
    user.value = null
    isLoggedIn.value = false
  }

  const updateProfile = (profileData: Partial<User>) => {
    if (user.value) {
      user.value = { ...user.value, ...profileData }
    }
  }

  const clearProfile = () => {
    if (user.value) {
      user.value = { id:'',name:"",email:'',avatar:'' }
    }
  }

  return {
    // 状态
    user,
    isLoggedIn,
    loading,
    // 计算属性
    userName,
    userEmail,
    userAvatar,

    groupObj,
    // 动作
    logout,
    updateProfile,
    clearProfile
  }
})
