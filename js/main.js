(function() {
    const STORAGE_KEY_HOSPITALS = 'virtual_data_hospitals';
    const STORAGE_KEY_DEPTS = 'virtual_data_depts';
    
    const DEFAULT_HOSPITALS = {
        '天津市': [
            '天津医科大学肿瘤医院',
            '天津医科大学总医院',
            '天津市第一中心医院',
            '天津中医药大学第一附属医院',
            '天津医科大学第二医院',
            '天津市第三中心医院',
            '天津市肿瘤医院',
            '天津市人民医院',
            '天津市环湖医院',
            '天津市天津医院',
            '中国医学科学院血液病医院',
            '天津市南开医院',
            '武警特色医学中心',
            '联勤保障部队第九八三医院',
            '天津市第五中心医院',
            '天津市静海区医院',
            '天津市蓟州区人民医院',
            '天津市滨海新区中医医院'
        ]
    };
    const DEFAULT_DEPTS = ['肿瘤科', '内科', '外科', '骨科', '心血管内科', '妇产科', '儿科', '眼科', '耳鼻喉科', '皮肤科', '神经内科', '神经外科', '胸外科', '泌尿外科', '肝胆外科'];

    const SURNAMES = [
        '赵', '钱', '孙', '李', '周', '吴', '郑', '王', '冯', '陈', '褚', '卫', '蒋', '沈', '韩', '杨',
        '朱', '秦', '尤', '许', '何', '吕', '施', '张', '孔', '曹', '严', '华', '金', '魏', '陶', '姜',
        '戚', '谢', '邹', '喻', '柏', '水', '窦', '章', '云', '苏', '潘', '葛', '奚', '范', '彭', '郎',
        '鲁', '韦', '昌', '马', '苗', '凤', '花', '方', '俞', '任', '袁', '柳', '酆', '鲍', '史', '唐',
        '费', '廉', '岑', '薛', '雷', '贺', '倪', '汤', '滕', '殷', '罗', '毕', '郝', '邬', '安', '常',
        '乐', '于', '时', '傅', '皮', '卞', '齐', '康', '伍', '余', '元', '卜', '顾', '孟', '平', '黄',
        '和', '穆', '萧', '尹', '姚', '邵', '湛', '汪', '祁', '毛', '禹', '狄', '米', '贝', '明', '臧',
        '计', '伏', '成', '戴', '谈', '宋', '茅', '庞', '熊', '纪', '舒', '屈', '项', '祝', '董', '梁',
        '杜', '阮', '蓝', '闵', '席', '季', '麻', '强', '贾', '路', '娄', '危', '江', '童', '颜', '郭',
        '梅', '盛', '林', '刁', '钟', '徐', '邱', '骆', '高', '夏', '蔡', '田', '樊', '胡', '凌', '霍'
    ];

    const NAME_CHARS = [
        '伟', '芳', '娜', '敏', '静', '丽', '强', '磊', '洋', '勇', '艳', '涛', '明', '超', '秀', '霞',
        '平', '刚', '华', '飞', '玲', '云', '鑫', '军', '文', '辉', '红', '斌', '杰', '琴', '波', '浩',
        '凯', '燕', '兰', '峰', '林', '俊', '婷', '宇', '鹏', '博', '毅', '恒', '涵', '睿', '轩', '晨',
        '阳', '志', '国', '建', '海', '春', '晓', '庆', '吉', '祥', '瑞', '安', '宁', '慧', '智', '欣',
        '怡', '雪', '梅', '龙', '凤', '金', '玉', '清', '秀', '雅', '芬', '天', '星', '辰', '思', '远',
        '然', '若', '冰', '桐', '瑶', '琦', '婉', '瑜', '瑾', '皓', '昊', '晟', '煜', '烨', '烁', '霖'
    ];

    let generatedData = [];
    let hospitalData = {};
    let deptList = [];
    let selectedHospitals = new Set();
    let selectedDepts = new Set();

    function init() {
        loadFromStorage();
        renderHospitals();
        renderDepts();
        updateCounts();
        
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        document.getElementById('meetingDate').value = dateStr;
    }

    function loadFromStorage() {
        try {
            const h = localStorage.getItem(STORAGE_KEY_HOSPITALS);
            hospitalData = h ? JSON.parse(h) : JSON.parse(JSON.stringify(DEFAULT_HOSPITALS));
        } catch (e) {
            hospitalData = JSON.parse(JSON.stringify(DEFAULT_HOSPITALS));
        }
        try {
            const d = localStorage.getItem(STORAGE_KEY_DEPTS);
            deptList = d ? JSON.parse(d) : [...DEFAULT_DEPTS];
        } catch (e) {
            deptList = [...DEFAULT_DEPTS];
        }
        
        getAllHospitals().forEach(hospital => selectedHospitals.add(hospital));
        deptList.forEach(dept => selectedDepts.add(dept));
    }

    function saveHospitals() {
        try {
            localStorage.setItem(STORAGE_KEY_HOSPITALS, JSON.stringify(hospitalData));
        } catch (e) {
            showToast('存储空间不足，请清理部分医院数据', 'warning');
        }
    }

    function saveDepts() {
        try {
            localStorage.setItem(STORAGE_KEY_DEPTS, JSON.stringify(deptList));
        } catch (e) {
            showToast('存储空间不足，请清理部分科室数据', 'warning');
        }
    }

    function updateCounts() {
        const cities = Object.keys(hospitalData);
        document.getElementById('cityCount').textContent = cities.length;
        let totalHospitals = 0;
        cities.forEach(city => {
            totalHospitals += hospitalData[city].length;
        });
        document.getElementById('hospitalCount').textContent = totalHospitals;
        document.getElementById('deptCount').textContent = deptList.length;
    }

    function renderHospitals() {
        const container = document.getElementById('hospitalContainer');
        const cities = Object.keys(hospitalData);
        
        if (cities.length === 0) {
            container.innerHTML = '<span class="empty-hint">暂无城市，请添加</span>';
            return;
        }
        
        container.innerHTML = cities.map((city, cityIndex) => `
            <div class="city-group">
                <div class="city-header">
                    <span class="city-name">${escapeHTML(city)}</span>
                    <button class="btn btn-danger btn-xs" onclick="removeCity('${escapeHTML(city)}')">删除城市</button>
                </div>
                <div class="hospital-list">
                    ${hospitalData[city].map((hospital, hIndex) => `
                        <div class="hospital-item">
                            <input type="checkbox" 
                                ${selectedHospitals.has(hospital) ? 'checked' : ''} 
                                onchange="toggleHospitalSelection('${escapeHTML(hospital)}')">
                            <input type="text" class="hospital-name" 
                                value="${escapeHTML(hospital)}" 
                                onchange="updateHospitalName('${escapeHTML(city)}', ${hIndex}, this.value)"
                                onblur="updateHospitalName('${escapeHTML(city)}', ${hIndex}, this.value)">
                            <div class="item-actions">
                                <button class="btn btn-danger btn-xs" onclick="removeHospital('${escapeHTML(city)}', ${hIndex})">删除</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="add-hospital-row">
                    <input type="text" id="hospitalInput_${cityIndex}" placeholder="输入医院名称">
                    <button class="btn btn-primary btn-sm" onclick="addHospital('${escapeHTML(city)}', ${cityIndex})">➕ 添加</button>
                </div>
            </div>
        `).join('');
    }

    function renderDepts() {
        const container = document.getElementById('deptContainer');
        
        if (deptList.length === 0) {
            container.innerHTML = '<span class="empty-hint">暂无科室，请添加</span>';
            return;
        }
        
        container.innerHTML = deptList.map((dept, index) => `
            <div class="dept-item">
                <input type="checkbox" 
                    ${selectedDepts.has(dept) ? 'checked' : ''} 
                    onchange="toggleDeptSelection('${escapeHTML(dept)}')">
                <input type="text" class="dept-name" 
                    value="${escapeHTML(dept)}" 
                    onchange="updateDeptName(${index}, this.value)"
                    onblur="updateDeptName(${index}, this.value)">
                <div class="item-actions">
                    <button class="btn btn-danger btn-xs" onclick="removeDept(${index})">删除</button>
                </div>
            </div>
        `).join('');
    }

    window.toggleHospitalSelection = function(hospital) {
        if (selectedHospitals.has(hospital)) {
            selectedHospitals.delete(hospital);
        } else {
            selectedHospitals.add(hospital);
        }
    };

    window.selectAllHospitals = function() {
        getAllHospitals().forEach(hospital => selectedHospitals.add(hospital));
        renderHospitals();
        showToast('已选择所有医院', 'success');
    };

    window.deselectAllHospitals = function() {
        selectedHospitals.clear();
        renderHospitals();
        showToast('已取消选择所有医院', 'info');
    };

    window.toggleDeptSelection = function(dept) {
        if (selectedDepts.has(dept)) {
            selectedDepts.delete(dept);
        } else {
            selectedDepts.add(dept);
        }
    };

    window.selectAllDepts = function() {
        deptList.forEach(dept => selectedDepts.add(dept));
        renderDepts();
        showToast('已选择所有科室', 'success');
    };

    window.deselectAllDepts = function() {
        selectedDepts.clear();
        renderDepts();
        showToast('已取消选择所有科室', 'info');
    };

    window.addCity = function() {
        const input = document.getElementById('cityInput');
        const cityName = input.value.trim();
        if (!cityName) {
            showToast('请输入城市名称', 'warning');
            return;
        }
        if (hospitalData[cityName]) {
            showToast('该城市已存在', 'warning');
            return;
        }
        hospitalData[cityName] = [];
        saveHospitals();
        renderHospitals();
        updateCounts();
        input.value = '';
        showToast('城市添加成功', 'success');
    };

    window.removeCity = function(cityName) {
        hospitalData[cityName].forEach(hospital => {
            selectedHospitals.delete(hospital);
        });
        delete hospitalData[cityName];
        saveHospitals();
        renderHospitals();
        updateCounts();
        showToast('城市已删除', 'info');
    };

    window.addHospital = function(cityName, cityIndex) {
        const input = document.getElementById(`hospitalInput_${cityIndex}`);
        const hospitalName = input.value.trim();
        if (!hospitalName) {
            showToast('请输入医院名称', 'warning');
            return;
        }
        if (!hospitalData[cityName]) {
            hospitalData[cityName] = [];
        }
        if (hospitalData[cityName].includes(hospitalName)) {
            showToast('该医院已存在', 'warning');
            return;
        }
        hospitalData[cityName].push(hospitalName);
        selectedHospitals.add(hospitalName);
        saveHospitals();
        renderHospitals();
        updateCounts();
        input.value = '';
        showToast('医院添加成功', 'success');
    };

    window.updateHospitalName = function(cityName, index, newName) {
        newName = newName.trim();
        if (!newName) {
            renderHospitals();
            showToast('医院名称不能为空', 'warning');
            return;
        }
        const oldName = hospitalData[cityName][index];
        if (oldName === newName) return;
        
        if (hospitalData[cityName].includes(newName)) {
            renderHospitals();
            showToast('该医院已存在', 'warning');
            return;
        }
        
        hospitalData[cityName][index] = newName;
        selectedHospitals.delete(oldName);
        selectedHospitals.add(newName);
        saveHospitals();
        updateCounts();
        showToast('医院名称已更新', 'success');
    };

    window.removeHospital = function(cityName, index) {
        if (!hospitalData[cityName] || index < 0 || index >= hospitalData[cityName].length) return;
        const removedHospital = hospitalData[cityName][index];
        hospitalData[cityName].splice(index, 1);
        selectedHospitals.delete(removedHospital);
        saveHospitals();
        renderHospitals();
        updateCounts();
        showToast('医院已删除', 'info');
    };

    window.addDept = function() {
        const input = document.getElementById('deptInput');
        const deptName = input.value.trim();
        if (!deptName) {
            showToast('请输入科室名称', 'warning');
            return;
        }
        if (deptList.includes(deptName)) {
            showToast('该科室已存在', 'warning');
            return;
        }
        deptList.push(deptName);
        selectedDepts.add(deptName);
        saveDepts();
        renderDepts();
        updateCounts();
        input.value = '';
        showToast('科室添加成功', 'success');
    };

    window.updateDeptName = function(index, newName) {
        newName = newName.trim();
        if (!newName) {
            renderDepts();
            showToast('科室名称不能为空', 'warning');
            return;
        }
        const oldName = deptList[index];
        if (oldName === newName) return;
        
        if (deptList.includes(newName)) {
            renderDepts();
            showToast('该科室已存在', 'warning');
            return;
        }
        
        deptList[index] = newName;
        selectedDepts.delete(oldName);
        selectedDepts.add(newName);
        saveDepts();
        updateCounts();
        showToast('科室名称已更新', 'success');
    };

    window.removeDept = function(index) {
        if (index < 0 || index >= deptList.length) return;
        const removedDept = deptList[index];
        deptList.splice(index, 1);
        selectedDepts.delete(removedDept);
        saveDepts();
        renderDepts();
        updateCounts();
        showToast('科室已删除', 'info');
    };

    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function maskHospital(name) {
        if (!name || name.length === 0) return '****';
        const len = name.length;
        const endsWithHospital = name.endsWith('医院');
        if (endsWithHospital && len >= 4) {
            const firstChar = name.charAt(0);
            const starCount = len - 3;
            return firstChar + '*'.repeat(Math.max(0, starCount)) + '医院';
        } else if (len <= 3) {
            return name.charAt(0) + '*' + name.charAt(len - 1);
        } else {
            const firstChar = name.charAt(0);
            const lastTwo = name.slice(-2);
            const starCount = len - 3;
            return firstChar + '*'.repeat(Math.max(0, starCount)) + lastTwo;
        }
    }

    function maskDept(name) {
        if (!name || name.length === 0) return '****';
        const len = name.length;
        if (len <= 3) {
            if (len === 1) return '*' + name;
            if (len === 2) return name.charAt(0) + '*';
            return name.charAt(0) + '*' + name.charAt(len - 1);
        } else {
            const firstChar = name.charAt(0);
            const lastTwo = name.slice(-2);
            const starCount = len - 3;
            return firstChar + '*'.repeat(Math.max(0, starCount)) + lastTwo;
        }
    }

    function maskName(fullName) {
        if (!fullName || fullName.length < 2) return fullName;
        const chars = [...fullName];
        const len = chars.length;
        if (len === 2) {
            return chars[0] + '*';
        } else if (len === 3) {
            return chars[0] + '*' + chars[2];
        } else if (len >= 4) {
            const starCount = len - 2;
            return chars[0] + '*'.repeat(Math.max(1, starCount)) + chars[len - 1];
        }
        return fullName;
    }

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function randomPick(arr) {
        if (!arr || arr.length === 0) return '';
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function generateRandomName() {
        const surname = randomPick(SURNAMES);
        const isDoubleName = Math.random() < 0.6;
        if (isDoubleName) {
            const name1 = randomPick(NAME_CHARS);
            const name2 = randomPick(NAME_CHARS);
            return surname + name1 + name2;
        } else {
            const name1 = randomPick(NAME_CHARS);
            return surname + name1;
        }
    }

    function getAllHospitals() {
        const hospitals = [];
        Object.keys(hospitalData).forEach(city => {
            hospitalData[city].forEach(hospital => {
                hospitals.push(hospital);
            });
        });
        return hospitals;
    }

    function formatDateTime(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        const h = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        return `${y}-${m}-${d} ${h}:${min}`;
    }

    window.generateData = function() {
        const topic = document.getElementById('topicInput').value.trim();
        if (!topic) {
            showToast('请输入话题名称', 'warning');
            return;
        }
        const count = parseInt(document.getElementById('countInput').value);
        if (isNaN(count) || count < 1) {
            showToast('请输入有效的生成数量（至少1条）', 'warning');
            return;
        }
        if (count > 5000) {
            showToast('单次最多生成5000条数据', 'warning');
            return;
        }

        const meetingDate = document.getElementById('meetingDate').value;
        if (!meetingDate) {
            showToast('请选择会议日期', 'warning');
            return;
        }

        const meetingStartTime = document.getElementById('meetingStartTime').value;
        const meetingEndTime = document.getElementById('meetingEndTime').value;
        if (!meetingStartTime || !meetingEndTime) {
            showToast('请设置会议开始和结束时间', 'warning');
            return;
        }

        const loginOffsetStart = parseInt(document.getElementById('loginOffsetStart').value);
        const loginOffsetEnd = parseInt(document.getElementById('loginOffsetEnd').value);
        const logoutOffsetStart = parseInt(document.getElementById('logoutOffsetStart').value);
        const logoutOffsetEnd = parseInt(document.getElementById('logoutOffsetEnd').value);

        if (loginOffsetStart > loginOffsetEnd) {
            showToast('登录时间开始偏移不能大于结束偏移', 'warning');
            return;
        }
        if (logoutOffsetStart > logoutOffsetEnd) {
            showToast('登出时间开始偏移不能大于结束偏移', 'warning');
            return;
        }

        const availableHospitals = Array.from(selectedHospitals);
        const availableDepts = Array.from(selectedDepts);
        
        if (availableHospitals.length === 0) {
            showToast('请至少选择一家医院', 'warning');
            return;
        }
        if (availableDepts.length === 0) {
            showToast('请至少选择一个科室', 'warning');
            return;
        }

        generatedData = [];
        
        const [startHour, startMin] = meetingStartTime.split(':').map(Number);
        const [endHour, endMin] = meetingEndTime.split(':').map(Number);
        
        const baseMeetingStart = new Date(meetingDate);
        baseMeetingStart.setHours(startHour, startMin, 0, 0);
        
        const baseMeetingEnd = new Date(meetingDate);
        baseMeetingEnd.setHours(endHour, endMin, 0, 0);

        for (let i = 0; i < count; i++) {
            const rawHospital = randomPick(availableHospitals);
            const rawDept = randomPick(availableDepts);
            const rawName = generateRandomName();
            
            const loginMinOffset = randomInt(loginOffsetStart, loginOffsetEnd);
            const loginRandomMinutes = randomInt(0, 59);
            const loginTime = new Date(baseMeetingStart.getTime() + (loginMinOffset * 60 + loginRandomMinutes) * 1000);
            
            const logoutMinOffset = randomInt(logoutOffsetStart, logoutOffsetEnd);
            const logoutRandomMinutes = randomInt(0, 59);
            const logoutTimeBase = new Date(baseMeetingEnd.getTime() + (logoutMinOffset * 60 + logoutRandomMinutes) * 1000);
            
            let logoutTime = logoutTimeBase;
            const minDuration = 30 * 60 * 1000;
            
            if (logoutTime.getTime() - loginTime.getTime() < minDuration) {
                logoutTime = new Date(loginTime.getTime() + minDuration);
            }

            const record = {
                index: i + 1,
                topic: topic,
                source: '话题',
                loginTime: formatDateTime(loginTime),
                logoutTime: formatDateTime(logoutTime),
                rawName: rawName,
                maskedName: maskName(rawName),
                rawHospital: rawHospital,
                maskedHospital: maskHospital(rawHospital),
                rawDept: rawDept,
                maskedDept: maskDept(rawDept),
            };
            generatedData.push(record);
        }

        renderPreviewTable();
        document.getElementById('downloadBtn').disabled = false;
        document.getElementById('previewCount').textContent = `（共 ${generatedData.length} 条）`;
        document.getElementById('statsRow').style.display = 'flex';
        updateStatsRow();
        showToast(`成功生成 ${generatedData.length} 条数据`, 'success');

        document.getElementById('previewCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    function renderPreviewTable() {
        const tbody = document.getElementById('tableBody');
        if (generatedData.length === 0) {
            tbody.innerHTML =
                '<tr><td colspan="8" style="color:#a0aec0;padding:30px;">点击「生成数据」按钮预览结果</td></tr>';
            return;
        }
        tbody.innerHTML = generatedData.map(r => `
            <tr>
                <td>${r.index}</td>
                <td class="cell-path" title="${escapeHTML(r.topic)}">${escapeHTML(r.topic)}</td>
                <td>${escapeHTML(r.source)}</td>
                <td>${r.loginTime}</td>
                <td>${r.logoutTime}</td>
                <td class="cell-masked">${escapeHTML(r.maskedName)}</td>
                <td class="cell-masked" title="原始：${escapeHTML(r.rawHospital)}">${escapeHTML(r.maskedHospital)}</td>
                <td class="cell-masked" title="原始：${escapeHTML(r.rawDept)}">${escapeHTML(r.maskedDept)}</td>
            </tr>
        `).join('');
    }

    function updateStatsRow() {
        const statsRow = document.getElementById('statsRow');
        const uniqueHospitals = new Set(generatedData.map(r => r.rawHospital)).size;
        const uniqueDepts = new Set(generatedData.map(r => r.rawDept)).size;
        const uniqueNames = new Set(generatedData.map(r => r.rawName)).size;
        statsRow.innerHTML = `
            <div class="stat-item">🏥 涉及医院：<strong>${uniqueHospitals}</strong> 家</div>
            <div class="stat-item">🩺 涉及科室：<strong>${uniqueDepts}</strong> 个</div>
            <div class="stat-item">👤 唯一姓名：<strong>${uniqueNames}</strong> 个</div>
            <div class="stat-item">📊 总记录数：<strong>${generatedData.length}</strong> 条</div>
        `;
    }

    window.downloadExcel = function() {
        if (generatedData.length === 0) {
            showToast('请先生成数据', 'warning');
            return;
        }
        
        const meetingDate = document.getElementById('meetingDate').value;
        const meetingStartTime = document.getElementById('meetingStartTime').value;
        const meetingEndTime = document.getElementById('meetingEndTime').value;
        
        const formattedDate = meetingDate.replace(/-/g, '');
        const formattedStart = meetingStartTime.replace(':', '');
        const formattedEnd = meetingEndTime.replace(':', '');
        const filename = `观看数据_${formattedDate}_${formattedStart}${formattedEnd}.xlsx`;
        
        const excelData = generatedData.map(r => ({
            '序号': r.index,
            '所属话题/频道/训练营/课程/课节/自定义菜单': r.topic,
            '来源': r.source,
            '登录时间': r.loginTime,
            '登出时间': r.logoutTime,
            '姓名': r.maskedName,
            '医院': r.maskedHospital,
            '科室': r.maskedDept,
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const colWidths = [
            { wch: 6 },
            { wch: 40 },
            { wch: 8 },
            { wch: 20 },
            { wch: 20 },
            { wch: 10 },
            { wch: 20 },
            { wch: 14 },
        ];
        worksheet['!cols'] = colWidths;

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        XLSX.writeFile(workbook, filename);
        showToast('Excel文件下载成功！', 'success');
    };

    window.resetForm = function() {
        document.getElementById('topicInput').value = '';
        document.getElementById('countInput').value = '20';
        const today = new Date();
        document.getElementById('meetingDate').value = today.toISOString().split('T')[0];
        document.getElementById('meetingStartTime').value = '19:00';
        document.getElementById('meetingEndTime').value = '21:00';
        document.getElementById('loginOffsetStart').value = '-10';
        document.getElementById('loginOffsetEnd').value = '20';
        document.getElementById('logoutOffsetStart').value = '30';
        document.getElementById('logoutOffsetEnd').value = '60';
        
        generatedData = [];
        document.getElementById('tableBody').innerHTML =
            '<tr><td colspan="8" style="color:#a0aec0;padding:30px;">点击「生成数据」按钮预览结果</td></tr>';
        document.getElementById('downloadBtn').disabled = true;
        document.getElementById('previewCount').textContent = '';
        document.getElementById('statsRow').style.display = 'none';
        document.getElementById('statsRow').innerHTML = '';
        
        showToast('表单已重置（医院和科室数据保留）', 'info');
    };

    function showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 2500);
    }

    init();
    console.log('✅ 虚拟观看数据生成器已就绪');
})();
