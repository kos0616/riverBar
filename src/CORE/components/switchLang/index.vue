<template>
  <el-dropdown trigger="click">
    <span>
      <i class="fa-solid fa-language"></i>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="$bus.emit('changeLang', 'zh_TW')">繁體</el-dropdown-item>
        <el-dropdown-item @click="$bus.emit('changeLang', 'zh_CN')">簡体</el-dropdown-item>
        <el-dropdown-item @click="$bus.emit('changeLang', 'EN')">English</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
