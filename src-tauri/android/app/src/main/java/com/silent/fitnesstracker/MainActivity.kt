package com.silent.fitnesstracker

import android.content.Intent
import android.content.res.Configuration
import android.net.Uri
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.webkit.JavascriptInterface
import android.webkit.WebView
import androidx.core.content.FileProvider
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsControllerCompat
import java.io.File

class MainActivity : TauriActivity() {
    private var windowInsetsController: WindowInsetsControllerCompat? = null
    private val TAG = "MainActivity"
    private var isJsInterfaceRegistered = false
    private val handler = Handler(Looper.getMainLooper())
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        Log.d(TAG, "onCreate called")
        
        // 启用 edge-to-edge 显示
        WindowCompat.setDecorFitsSystemWindows(window, false)
        
        // 设置状态栏透明
        window.statusBarColor = android.graphics.Color.TRANSPARENT
        
        // 设置导航栏透明
        window.navigationBarColor = android.graphics.Color.TRANSPARENT
        
        // 获取 WindowInsetsController
        windowInsetsController = WindowCompat.getInsetsController(window, window.decorView)
        
        // 根据系统主题自动调整状态栏和导航栏图标颜色
        val isLightTheme = (resources.configuration.uiMode and Configuration.UI_MODE_NIGHT_MASK) == Configuration.UI_MODE_NIGHT_NO
        
        windowInsetsController?.isAppearanceLightStatusBars = isLightTheme
        windowInsetsController?.isAppearanceLightNavigationBars = isLightTheme
        
        Log.d(TAG, "Initial theme: ${if (isLightTheme) "light" else "dark"}")
    }
    
    override fun onResume() {
        super.onResume()
        
        // 延迟注册 JavaScript 接口，确保 WebView 已创建
        if (!isJsInterfaceRegistered) {
            registerJsInterface()
        }
    }
    
    private fun registerJsInterface(retryCount: Int = 0) {
        handler.postDelayed({
            try {
                val webView = getWebView()
                if (webView != null) {
                    // 启用 JavaScript
                    webView.settings.javaScriptEnabled = true
                    
                    // 添加状态栏 JavaScript 接口
                    webView.addJavascriptInterface(StatusBarBridge(), "AndroidStatusBar")
                    
                    // 添加分享 JavaScript 接口
                    webView.addJavascriptInterface(ShareBridge(), "AndroidShare")
                    
                    // 监听 share-file 事件
                    webView.evaluateJavascript("""
                        (function() {
                            if (window.__TAURI__) {
                                window.__TAURI__.event.listen('share-file', function(event) {
                                    var payload = event.payload;
                                    if (window.AndroidShare) {
                                        window.AndroidShare.shareFile(
                                            payload.filePath,
                                            payload.title,
                                            payload.text
                                        );
                                    }
                                });
                            }
                        })();
                    """, null)
                    
                    isJsInterfaceRegistered = true
                    Log.d(TAG, "✅ JavaScript interfaces registered successfully")
                } else {
                    Log.w(TAG, "WebView not found, attempt ${retryCount + 1}")
                    // 如果还没找到 WebView，继续重试（最多 10 次）
                    if (retryCount < 10) {
                        registerJsInterface(retryCount + 1)
                    } else {
                        Log.e(TAG, "❌ Failed to register JavaScript interface after 10 attempts")
                    }
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error registering JavaScript interface", e)
                // 出错时也重试
                if (retryCount < 10) {
                    registerJsInterface(retryCount + 1)
                }
            }
        }, 200) // 延迟 200ms
    }
    
    // 获取 Tauri 的 WebView
    private fun getWebView(): WebView? {
        return try {
            // 尝试多种方式查找 WebView
            
            // 方法 1: 通过 ID 查找
            val webViewId = resources.getIdentifier("tauri_webview", "id", packageName)
            if (webViewId != 0) {
                val webView = findViewById<WebView>(webViewId)
                if (webView != null) {
                    Log.d(TAG, "Found WebView by ID")
                    return webView
                }
            }
            
            // 方法 2: 遍历视图层次结构
            val webView = findWebViewInHierarchy(window.decorView)
            if (webView != null) {
                Log.d(TAG, "Found WebView by hierarchy search")
                return webView
            }
            
            Log.w(TAG, "WebView not found")
            null
        } catch (e: Exception) {
            Log.e(TAG, "Error getting WebView", e)
            null
        }
    }
    
    private fun findWebViewInHierarchy(view: android.view.View): WebView? {
        if (view is WebView) {
            return view
        }
        if (view is android.view.ViewGroup) {
            for (i in 0 until view.childCount) {
                val child = view.getChildAt(i)
                val webView = findWebViewInHierarchy(child)
                if (webView != null) {
                    return webView
                }
            }
        }
        return null
    }
    
    // JavaScript 接口类
    inner class StatusBarBridge {
        @JavascriptInterface
        fun setStyle(isDark: Boolean) {
            Log.d(TAG, "🎨 setStyle called with isDark: $isDark")
            runOnUiThread {
                try {
                    // isDark = true 表示深色主题，需要浅色状态栏内容
                    // isAppearanceLightStatusBars = true 表示深色内容（用于浅色背景）
                    // isAppearanceLightStatusBars = false 表示浅色内容（用于深色背景）
                    windowInsetsController?.isAppearanceLightStatusBars = !isDark
                    windowInsetsController?.isAppearanceLightNavigationBars = !isDark
                    Log.d(TAG, "✅ Status bar style updated: ${if (isDark) "light content (dark theme)" else "dark content (light theme)"}")
                } catch (e: Exception) {
                    Log.e(TAG, "❌ Error setting status bar style", e)
                }
            }
        }
    }
    
    // 分享接口类
    inner class ShareBridge {
        @JavascriptInterface
        fun shareFile(filePath: String, title: String, text: String) {
            Log.d(TAG, "📤 shareFile called with path: $filePath")
            runOnUiThread {
                try {
                    val file = File(filePath)
                    if (!file.exists()) {
                        Log.e(TAG, "❌ File does not exist: $filePath")
                        return@runOnUiThread
                    }
                    
                    val uri: Uri = FileProvider.getUriForFile(
                        this@MainActivity,
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
                    Log.d(TAG, "✅ Share dialog opened successfully")
                } catch (e: Exception) {
                    Log.e(TAG, "❌ Error sharing file", e)
                }
            }
        }
    }
    
    // 保留旧的 shareFile 方法以保持兼容性
    fun shareFile(filePath: String, title: String, text: String) {
        ShareBridge().shareFile(filePath, title, text)
    }
}
