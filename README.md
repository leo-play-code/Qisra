# 正常啟動流程(重新開機時)

- <>只用來代表內容物不用輸入
1. 打開終端機(CMD)
2. cd <Qisra 的路徑>
3. 輸入以下指令開始

```jsx
python manage.py runserver <ip>:8000
```

# Change to Next User to Deploy Website

- 要先連外網將環境全部載下來 `pip install -r requirements.txt`
- cmd 輸入 `ipconfig`找IPV4 並且將之當作server
    - EX: `python manage.py runserver  <IP>:8000`
- `settings.py` 裡面的資料庫要改內容成現在的資料庫(只要改Name,Password)

# 備份設置流程

- 將pg_pass.conf 放在 APPDATA 路徑下 (APPDATA 路徑可以用`echo %APPDATA%`)
- `pg_pass.conf` 的內容有在folder 裏面
- `backup.exe` 可以不需要修改只要修改`psqlsetup.json`裡面的內容即可
- 時程設置路徑：控制台> 系統及安全> 排程 >建立工作 >命名>設定每天重複>動作放入我的exe擋並且要指定路徑到`psqlsetup.json`的folder

# Anaconda

- Save package all

```jsx
pip freeze > requirements.txt
```

- Window
    
    ```css
    conda env list
    activate <envname>
    conda deactivate
    conda create --name <envname> python=3.9
    ```
    
    - 無法create conda env
        - Firstly, you must run your terminal as administrator
        - second, you must activate Conda base env
- MacOS

```css
conda activate <envname>
conda deactivate
```

## Clone ENV to other computer Anaconda

- MacOS

```jsx
conda activate <env_name>
conda env export > environment.yml

conda env create -f environment.yml
conda activate <env_name>
```

# Virtualenv
```jsx
source name_env/bin/activate
```
- MacOS

