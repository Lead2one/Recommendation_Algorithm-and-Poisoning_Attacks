import { init, updateScreen, displayResult } from './function.js';
var socket = io();



function startTraining() {
    init();
    // document.getElementById('output').innerHTML = null;
    document.getElementById('total time').innerHTML = null;
    document.getElementById('assessment').innerHTML = null;
    document.getElementById('parameter-disp').innerHTML = null;
    const dataset = document.getElementById('dataset').value;
    const model_name = document.getElementById('model_name').value;
    const maxEpoch = document.getElementById('maxEpoch').value;
    const attackCategory = document.getElementById('attackCategory').value;
    const attackModelName = document.getElementById('attackModelName').value;
    const lRate = document.getElementById('lRate').value;
    const batch_size = document.getElementById('batch_size').value;
    const seed = document.getElementById('seed').value;
    const topK = document.getElementById('topK').value;
    const n_layers = document.getElementById('n_layers').value;
    const dropoutCheckbox = document.getElementById('dropout');
    const dropout = dropoutCheckbox.checked ? true : false;
    const maliciousUserSize = document.getElementById('maliciousUserSize').value;
    const maliciousFeedbackSize = document.getElementById('maliciousFeedbackSize').value;
    const Epoch = document.getElementById('Epoch').value;
    const innerEpoch = document.getElementById('innerEpoch').value;
    const outerEpoch = document.getElementById('outerEpoch').value;
    const gradMaxLimitation = document.getElementById('gradMaxLimitation').value;
    const gradNumLimitation = document.getElementById('gradNumLimitation').value;
    const gradIterationNum = document.getElementById('gradIterationNum').value;
    const attackTargetChooseWay = document.getElementById('attackTargetChooseWay').value;
    const targetSize = document.getElementById('targetSize').value;

    socket.emit('start_training', {
        dataset,
        model_name,
        maxEpoch: parseInt(maxEpoch),
        attackCategory,
        attackModelName,
        lRate: parseFloat(lRate),
        batch_size: parseInt(batch_size),
        seed: parseInt(seed),
        topK,
        n_layers,
        dropout,
        maliciousUserSize: parseFloat(maliciousUserSize),
        maliciousFeedbackSize: parseFloat(maliciousFeedbackSize),
        Epoch: parseInt(Epoch),
        innerEpoch: parseInt(innerEpoch),
        outerEpoch: parseInt(outerEpoch),
        gradMaxLimitation: parseInt(gradMaxLimitation),
        gradNumLimitation: parseInt(gradNumLimitation),
        gradIterationNum: parseInt(gradIterationNum),
        attackTargetChooseWay,
        targetSize: parseFloat(targetSize)
    });
    console.log("start")
    displayParameters()
}

socket.on('training_update', function (data) {
    // document.getElementById('output').innerHTML += `${data.loss}<br>`;
    updateScreen(data);
});

socket.on('control', function (str) {
    switch (str) {
        case 'training_begin':
            document.getElementById('start').style.display = 'none';
            document.getElementById('pause').style.display = 'block';
            document.getElementById('pause').classList.add('rotating'); // 添加旋转类
            break;
        case 'training_end':
            document.getElementById('start').style.display = 'block';
            document.getElementById('pause').style.display = 'none';
            document.getElementById('pause').classList.remove('rotating'); // 移除旋转类
            break;
        case '// more_signal': ;
        default: ;
    }
})

socket.on('result', function (list) {
    displayResult(list);
})

socket.on('end', function (endTime) {
    document.getElementById('total time').innerHTML += `${endTime.toFixed(3)}s<br>`;
})


socket.on('botmessage', function (char) {
    // 将接收到的字符或换行标签添加到页面上
    var messageContainer = document.getElementById('assessment');
    if (char === '<br>') {
        // 创建一个新的换行元素
        var br = document.createElement("br");
        messageContainer.appendChild(br);
    } else {
        // 创建一个新的文本节点
        var textNode = document.createTextNode(char);
        messageContainer.appendChild(textNode);
    }
});

// 开始按钮
document.getElementById('start').addEventListener('click', startTraining);



document.addEventListener('DOMContentLoaded', () => {
    const attackType = document.getElementById("attackCategory");
    attackType.addEventListener("change", updateAttackModel);
});

function updateAttackModel() {
    const attackType = document.getElementById("attackCategory").value;
    const attackModelName = document.getElementById("attackModelName");

    // 清空之前的选项
    attackModelName.innerHTML = "";

    // 根据攻击类型添加相应的选项
    if (attackType === "Black") {
        const blackOptions = [
            { value: "BandwagonAttack", text: "BandwagonAttack" },
            { value: "GSPAttack", text: "GSPAttack" },
            { value: "GTA", text: "GTA" },
            { value: "NoneAttack", text: "NoneAttack" },
            { value: "PoisonRec", text: "PoisonRec" },
            { value: "RandomAttack", text: "RandomAttack" },
            { value: "RLAttack", text: "RLAttack" }
        ];
        blackOptions.forEach(optionData => {
            const option = document.createElement("option");
            option.value = optionData.value;
            option.text = optionData.text;
            attackModelName.add(option);
        });
    } else if (attackType === "Gray") {
        const grayOptions = [
            { value: "A_ra", text: "A_ra" },
            { value: "AUSH", text: "AUSH" },
            { value: "FedRecAttack", text: "FedRecAttack" },
            { value: "GOAT", text: "GOAT" },
            { value: "LegUP", text: "LegUP" }
        ];
        grayOptions.forEach(optionData => {
            const option = document.createElement("option");
            option.value = optionData.value;
            option.text = optionData.text;
            attackModelName.add(option);
        });
    } else if (attackType === "White") {
        const whiteOptions = [
            { value: "BiLevelAttackBatch", text: "BiLevelAttackBatch" },
            { value: "BiLevelAttackByBatchInject", text: "BiLevelAttackByBatchInject" },
            { value: "CLeaR", text: "CLeaR" },
            { value: "DLAttack", text: "DLAttack" },
            { value: "PGA", text: "PGA" },
            { value: "PipAttack", text: "PipAttack" }
        ];
        whiteOptions.forEach(optionData => {
            const option = document.createElement("option");
            option.value = optionData.value;
            option.text = optionData.text;
            attackModelName.add(option);
        });
    }
}

function displayParameters() {
    const dataset = document.getElementById('dataset').value;
    const model_name = document.getElementById('model_name').value;
    const maxEpoch = document.getElementById('maxEpoch').value;
    const attackCategory = document.getElementById('attackCategory').value;
    const attackModelName = document.getElementById('attackModelName').value;
    const lRate = document.getElementById('lRate').value;
    const batch_size = document.getElementById('batch_size').value;
    const seed = document.getElementById('seed').value;
    const topK = document.getElementById('topK').value;
    const n_layers = document.getElementById('n_layers').value;
    const dropoutCheckbox = document.getElementById('dropout');
    const dropout = dropoutCheckbox.checked ? true : false;
    const maliciousUserSize = document.getElementById('maliciousUserSize').value;
    const maliciousFeedbackSize = document.getElementById('maliciousFeedbackSize').value;
    const Epoch = document.getElementById('Epoch').value;
    const innerEpoch = document.getElementById('innerEpoch').value;
    const outerEpoch = document.getElementById('outerEpoch').value;
    const gradMaxLimitation = document.getElementById('gradMaxLimitation').value;
    const gradNumLimitation = document.getElementById('gradNumLimitation').value;
    const gradIterationNum = document.getElementById('gradIterationNum').value;
    const attackTargetChooseWay = document.getElementById('attackTargetChooseWay').value;
    const targetSize = document.getElementById('targetSize').value;
    // 创建一个字符串来保存所有参数
    let parametersString = '<ul>';

    // 添加每个参数到字符串
    parametersString += `<li>Dataset: ${dataset}</li>`;
    parametersString += `<li>Model Name: ${model_name}</li>`;
    parametersString += `<li>Max Epoch: ${maxEpoch}</li>`;
    parametersString += `<li>Attack Category: ${attackCategory}</li>`;
    parametersString += `<li>Attack Model Name: ${attackModelName}</li>`;
    parametersString += `<li>Learning Rate: ${lRate}</li>`;
    parametersString += `<li>Batch Size: ${batch_size}</li>`;
    parametersString += `<li>Seed: ${seed}</li>`;
    parametersString += `<li>Top K: ${topK}</li>`;
    parametersString += `<li>Number of Layers: ${n_layers}</li>`;
    parametersString += `<li>Dropout: ${dropout}</li>`;
    parametersString += `<li>Malicious User Size: ${maliciousUserSize}</li>`;
    parametersString += `<li>Malicious Feedback Size: ${maliciousFeedbackSize}</li>`;
    parametersString += `<li>Epoch: ${Epoch}</li>`;
    parametersString += `<li>Inner Epoch: ${innerEpoch}</li>`;
    parametersString += `<li>Outer Epoch: ${outerEpoch}</li>`;
    parametersString += `<li>Gradient Max Limitation: ${gradMaxLimitation}</li>`;
    parametersString += `<li>Gradient Num Limitation: ${gradNumLimitation}</li>`;
    parametersString += `<li>Gradient Iteration Num: ${gradIterationNum}</li>`;
    parametersString += `<li>Attack Target Choose Way: ${attackTargetChooseWay}</li>`;
    parametersString += `<li>Target Size: ${targetSize}</li>`;

    // 关闭列表标签
    parametersString += '</ul>';

    // 将参数字符串插入到parameter-disp元素中
    document.getElementById('parameter-disp').innerHTML = parametersString;
}