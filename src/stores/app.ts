import { defineStore } from 'pinia'
import { ref , reactive} from 'vue'

export const useAppStore = defineStore('app', () => {
  // 状态
  const theme = ref<'light' | 'dark'>('light')
  const sidebarCollapsed = ref(false)
  const pageTitle = ref('View UI Plus Admin')
  const loading = ref(false)
  const linkStatus = ref('') // 客户端连接状态
  const homeIdx = ref(0) // 首页下标
  const windowMedia = reactive({
    innerHeight: '100%',
    innerWidth:'100%'
  })
  // 动作
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    // 这里可以添加主题切换的逻辑
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  const setPageTitle = (title: string) => {
    pageTitle.value = title
    document.title = title
  }

  const setLoading = (status: boolean) => {
    loading.value = status
  }

  return {
    // 状态
    theme,
    sidebarCollapsed,
    pageTitle,
    loading,
    windowMedia,
    linkStatus,
    homeIdx,
    // 动作
    toggleTheme,
    toggleSidebar,
    setPageTitle,
    setLoading
  }
})
