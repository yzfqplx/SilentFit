package com.silent.fitnesstracker

import android.content.Intent
import android.content.res.Configuration
import android.net.Uri
import android.os.Bundle
import androidx.core.content.FileProvider
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsControllerCompat
import java.io.File

class MainActivity : TauriActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // 启用 edge-to-edge 显示
        WindowCompat.setDecorFitsSystemWindows(window, false)
        
        // 设置状态栏透明
        window.statusBarColor = android.graphics.Color.TRANSPARENT
        
        // 设置导航栏透明
        window.navigationBarColor = android.graphics.Color.TRANSPARENT
        
        // 获取 WindowInsetsController
        val windowInsetsController = WindowCompat.getInsetsController(window, window.decorView)
        
        // 根据系统主题自动调整状态栏和导航栏图标颜色
        val isLightTheme = (resources.configuration.uiMode and Configuration.UI_MODE_NIGHT_MASK) == Configuration.UI_MODE_NIGHT_NO
        
        windowInsetsController?.isAppearanceLightStatusBars = isLightTheme
        windowInsetsController?.isAppearanceLightNavigationBars = isLightTheme
        
        // 监听来自 Tauri 的分享事件
        setupShareListener()
    }
    
    private fun setupShareListener() {
        // 注册 Tauri 事件监听器
        // 注意：这需要在 WebView 加载完成后执行
        // 实际实现可能需要使用 Tauri 的插件系统
    }
    
    fun shareFile(filePath: String, title: String, text: String) {
        try {
            val file = File(filePath)
            if (!file.exists()) {
                android.util.Log.e("MainActivity", "File does not exist: $filePath")
                return
            }
            
            val uri: Uri = FileProvider.getUriForFile(
                this,
                "${applicationContext.packageName}.fileprovider",
                file
            )
            
            val shareIntent = Intent(Intent.ACTION_SEND).apply {
                type = "application/json"
                putExtra(Intent.EXTRA_STREAM, uri)
                putExtra(Intent.EXTRA_SUBJECT, title)
                putExtra(Intent.EXTRA_TEXT, text)
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            }
            
            startActivity(Intent.createChooser(shareIntent, title))
        } catch (e: Exception) {
            android.util.Log.e("MainActivity", "Error sharing file", e)
        }
    }
}