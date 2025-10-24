if (typeof window === 'undefined') {
    import("d3")
}

var loss_clean = [];
var loss_poisoned = [];
var epoches = 0;

const width = 400;
const height = 250;
const marginTop = 15;
const marginRight = 0;
const marginBottom = 20;
const marginLeft = 0;

var maxEpoch;


function init() {
    epoches = 0;  // 清空历史记录
    loss_clean = [];
    loss_poisoned = [];

    maxEpoch = parseInt(d3.select('#maxEpoch').property("value"));  // 使用id读取

    init_by_id("#loss-clean");
    init_by_id("#loss-poisoned");
    d3.select("#result_svg").selectAll("*").remove();
    document.getElementById('total time').innerHTML += "";
    document.getElementById("result_num").innerHTML = "";
}

function updateScreen(data) {
    epoches += 1;
    if (epoches <= maxEpoch) {  //根据函数调用计数，判断当前需要更新的图
        loss_clean.push(data.loss);
        updateScreen_by_id("#loss-clean", loss_clean);
    } else {
        loss_poisoned.push(data.loss);
        updateScreen_by_id("#loss-poisoned", loss_poisoned);
    }
}

function init_by_id(id) {
    const x = d3.scaleLinear()  // x比例尺，是一个函数。用于坐标轴上标注刻度，和将loss数值映射成坐标
        .domain([0, maxEpoch])
        .range([marginLeft, width - marginRight]);

    const y = d3.scaleLinear()  // y比例尺
        .domain([0, 1])
        .range([height - marginBottom, marginTop]);

    const svg = d3.select(id);

    svg.selectAll("*").remove();  // 先清空所有元素，然后重新绘制
    svg.attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "height: auto; display: block");

    svg.append("g")  // 绘制x轴
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0))
        .attr("style", "font-size: 12px; text-overflow: clip;")
        .call(g => g.append("text")
            .attr("x", width - marginRight) // 将文本放在x轴末端
            .attr("y", -5) // 调整y坐标，将文本移到x轴下方
            .attr("fill", "currentColor")
            .attr("text-anchor", "end") // 使用end对齐，文本靠右
            .attr("style", "font-size: 13px")
            .text(id === "#loss-clean" ? "clean epoches" : "poisoned epoches"));

    svg.append("g")  // 绘制y轴
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove())      // 隐藏y轴
        .call(g => g.selectAll(".tick line").clone()  // 添加水平虚线
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("x", 5)
            .attr("y", 15)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .attr("style", "font-size: 13px")
            .text("Loss"));

    const dot = svg.append("g")  // 点，默认不显示但需要初始化
        .attr("id", id === "#loss-clean" ? "dot1" : "dot2")
        .attr("display", "none");
    dot.append("circle")
        .attr("r", 2.5);
    dot.append("text")
        .attr("text-anchor", "middle")
        .attr("y", -8);
}

function updateScreen_by_id(id, data) {
    const x = d3.scaleLinear()
        .domain([0, maxEpoch])
        .range([marginLeft, width - marginRight]);
    const y = d3.scaleLinear()
        .domain([0, 1])
        .range([height - marginBottom, marginTop]);

    var points = data.map((value, i) => [x(i + 1), y(value), value]);  // loss => [x坐标, y坐标, loss]

    const svg = d3.select(id);

    svg.select(id === "#loss-clean" ? "#line1" : "#line2")  // 更新折线
        .remove();
    const path = svg.append("g")
        .attr("id", id === "#loss-clean" ? "line1" : "line2")
        .attr("fill", "none")
        .attr("stroke-width", 1.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .selectAll("path")
        .data([points])  // 自动使用 [x坐标, y坐标, loss] 中的 [x坐标, y坐标]
        .join("path")
        .style("mix-blend-mode", "multiply")
        .attr("d", d3.line())
        .attr("stroke", "blue");

    const dot = svg.select(id === "#loss-clean" ? "#dot1" : "#dot2")

    svg.on("pointerenter", pointerentered)  // 更新监听器，用于显示距离光标水平最近的点
        .on("pointermove", pointermoved)
        .on("pointerleave", pointerleft)
        .on("touchstart", event => event.preventDefault());

    function pointermoved(event) {
        const [xm, ym] = d3.pointer(event);               // xm：光标的x坐标
        const i = d3.leastIndex(points, ([x, y]) => Math.abs(x - xm));
        const [x, y, value] = points[i];                  // 获取对应点的[x坐标, y坐标, loss]
        dot.attr("transform", `translate(${x},${y})`);
        dot.select("text").text(value.toFixed(9));
    }

    function pointerentered() {
        dot.attr("display", null);
    }

    function pointerleft() {
        path.style("mix-blend-mode", "multiply").style("stroke", null);
        dot.attr("display", "none");
        svg.node().value = null;
        svg.dispatch("input", { bubbles: true });
    }
}

function displayResult(list) {
    // console.log(list);
    const width = 600;
    const height = 300;
    const marginTop = 5;
    const marginRight = 0;
    const marginBottom = 35;
    const marginLeft = 40;

    const svg = d3.select("#result_svg")
    svg.attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "height: auto; display: block");
    const x = d3.scaleBand()
        .domain(d3.range(list[0].length))       // list[0].length = 4
        .range([marginLeft, width - marginRight])
        .padding(0.4);                          // 每个x刻度划分的宽度 - padding = 供给填充bar的宽度; padding越大，间距越大，bar宽度越小

    const y = d3.scaleLinear()
        .domain([0, 1])
        .range([height - marginBottom, marginTop]);

    const group = svg.selectAll(".bar-group")
        .data(list[0])
        .enter()
        .append("g")
        .attr("class", "bar-group")
        .attr("transform", (d, i) => `translate(${x(i)}, 0)`);

    const barWidth = x.bandwidth() / 2;         // d3库默认设定一个bar的位置填充一个bar，但这里要填充蓝色和红色两个bar
    group.append("rect")                        // 蓝色条
        .attr("x", 0)
        .attr("y", d => y(d))
        .attr("width", barWidth)
        .attr("height", d => height - marginBottom - y(d))
        .attr("fill", "#1e55ff");

    group.append("rect")                        // 红色条
        .attr("x", barWidth)
        .attr("y", (d, i) => y(list[1][i]))
        .attr("width", barWidth)
        .attr("height", (d, i) => height - marginBottom - y(list[1][i]))
        .attr("fill", "red");

    group.append("text")
        .attr("x", barWidth / 2)
        .attr("y", d => y(d) - 5)
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .attr("font-size", "10px")
        .text(d => `${(d * 100).toFixed(2)}%`);

    group.append("text")
        .attr("x", barWidth + barWidth / 2)
        .attr("y", (d, i) => y(list[1][i]) - 5)
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .attr("font-size", "10px")
        .text((d, i) => `${(list[1][i] * 100).toFixed(2)}%`);

    const indicators = ["Hit Ratio", "Precision", "Recall", "NDCG"];    // x轴刻度
    const xAxis = d3.axisBottom(x).tickFormat((d, i) => `${indicators[i]}`);
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(xAxis)
        .selectAll("text")
        .style("font-size", "12px");

    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1))

    // 图例的起始位置
    const legendX = (width - marginRight - marginLeft) - 20;
    const legendY = marginTop + 10;
    const legendSpacing = 20;

    // 添加图例矩形
    svg.append("rect")
        .attr("x", legendX)
        .attr("y", legendY)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", "#1e55ff");

    svg.append("rect")
        .attr("x", legendX)
        .attr("y", legendY + legendSpacing)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", "red");

    // 添加图例文本
    svg.append("text")
        .attr("x", legendX + 15)
        .attr("y", legendY + 10)
        .attr("text-anchor", "start")
        .attr("fill", "black")
        .attr("font-size", "12px")
        .text("投毒前");

    svg.append("text")
        .attr("x", legendX + 15)
        .attr("y", legendY + 10 + legendSpacing)
        .attr("text-anchor", "start")
        .attr("fill", "black")
        .attr("font-size", "12px")
        .text("投毒后");
    let resultText = "投毒前：<br>";
    list[0].forEach((value, index) => {
        resultText += `${indicators[index]}: ${value.toFixed(5)}<br>`;
    });
    resultText += "<br>投毒后：<br>";
    list[1].forEach((value, index) => {
        resultText += `${indicators[index]}: ${value.toFixed(5)}<br>`;
    });

    document.getElementById("result_num").innerHTML = resultText;
}

export { init };
export { updateScreen };
export { displayResult };