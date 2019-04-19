# packageのインストール

インストールされたpackage一覧取得
```bash
adb shell pm list package
```

packageのインストール
```bash
adb install [apk_file_path]
```

packageのアンインストール
```bash
adb uninstall [package_name]
```

# デバイスの接続

接続の確認
```bash
adb devices
```

ip addressの検索
```bash
adb shell ifconfig wlan0
```
※Oculus GoのWi-Fiデバイスはwlan0のため

Wi-Fi越しの接続
```bash
adb tcpip 5555
adb connect [android_ip_address]
```

Wi-Fi越しの接続解除
```bash
adb disconnect
```
