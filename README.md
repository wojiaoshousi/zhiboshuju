# 虚拟观看数据生成器

一个用于生成脱敏虚拟观看数据的Web应用，支持自定义医院和科室管理，以及Excel导出功能。

## 功能特性

- 🏥 **医院管理**：按城市分组管理医院信息，支持添加/删除城市和医院
- 🩺 **科室管理**：灵活的科室配置，支持添加/删除科室
- ⏰ **时间配置**：会议日期、开始/结束时间，登录/登出时间偏移
- 📊 **数据生成**：生成符合要求的虚拟观看数据，包含脱敏处理
- 📥 **Excel导出**：一键导出脱敏后的Excel文件
- 💾 **数据持久化**：医院和科室数据自动保存，刷新不丢失

## 技术栈

- **前端**：HTML5, CSS3, JavaScript (ES6+)
- **后端**：Node.js + Express
- **Excel处理**：SheetJS (xlsx)
- **数据存储**：JSON文件（服务器端）+ LocalStorage（浏览器端）

## 项目结构

```
虚拟观看数据/
├── web/                      # 前端文件
│   ├── index.html           # 主页面
│   ├── css/
│   │   └── style.css        # 样式文件
│   ├── js/
│   │   └── main.js          # 前端逻辑
│   └── data/                # 前端数据目录
├── data/                    # 服务器数据目录（自动创建）
├── server.js                # Express服务器
├── package.json             # 项目依赖
└── README.md                # 项目说明
```

## 快速开始

### 1. 环境要求

- Node.js 14.0 或更高版本

### 2. 安装依赖

```bash
npm install
```

### 3. 启动服务

```bash
npm start
```

### 4. 访问应用

打开浏览器访问：`http://localhost:3000`

## 使用说明

### 数据生成配置

1. **话题名称**：输入会议或话题的标题
2. **生成数量**：设置需要生成的数据条数（1-5000）
3. **会议日期**：选择会议的具体日期
4. **会议时间**：设置会议的开始和结束时间
5. **时间偏移**：
   - 登录时间偏移：相对于会议开始时间的偏移（分钟）
   - 登出时间偏移：相对于会议结束时间的偏移（分钟）

### 医院管理

1. **添加城市**：在输入框中输入城市名称，点击"添加城市"
2. **添加医院**：在对应城市下输入医院名称，点击"➕ 添加"
3. **删除**：点击医院或城市旁的删除按钮移除

### 科室管理

1. **添加科室**：输入科室名称，点击"➕ 添加"
2. **删除科室**：点击科室标签旁的"×"删除

### 数据生成与导出

1. 配置完成后，点击"🚀 生成数据"
2. 在右侧预览区域查看生成的数据
3. 点击"📥 下载Excel"导出文件

## 脱敏规则

### 姓名脱敏
- 2字姓名：保留首字，第二字用*代替（如：张三 → 张*）
- 3字姓名：保留首尾字，中间用*代替（如：李思源 → 李*源）

### 医院脱敏
- 保留第一个字和最后"医院"二字，中间用*代替
- 示例：天津市医科大学肿瘤医院 → 天****医院

### 科室脱敏
- 保留第一个字和最后两个字，中间用*代替
- 示例：心血管内科 → 心**内科

## 部署指南

### 本地部署

1. 确保已安装 Node.js
2. 克隆或下载项目
3. 安装依赖：`npm install`
4. 启动服务：`npm start`
5. 访问：`http://localhost:3000`

### 服务器部署

#### 使用 PM2 (推荐)

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start server.js --name virtual-data-generator

# 设置开机自启
pm2 startup
pm2 save

# 查看状态
pm2 status
```

#### 使用 Nginx 反向代理

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 环境变量

- `PORT`：服务端口（默认：3000）

## 数据存储

### 浏览器端
- 使用 LocalStorage 存储医院和科室数据
- 数据键名：`virtual_data_hospitals`、`virtual_data_depts`

### 服务器端
- 使用 JSON 文件存储数据
- 存储位置：`data/app-data.json`

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 更新日志

### v1.0.0
- 初始版本发布
- 支持医院和科室管理
- 支持数据生成和Excel导出
- 完整的脱敏功能实现

## 许可证

MIT License

## 联系方式

如有问题或建议，请提交 Issue。
