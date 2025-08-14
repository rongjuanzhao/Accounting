import { useEffect, useRef } from 'react';
import './SankeyDiagram.css';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import * as d3 from 'd3';
const SankeyDiagram = ({ width = 1000, height = 500, data }) => {
    const svgRef = useRef();
    // 定义数据
    const transformData = (assetsData) => {
        // 确保所有值都有默认值0
        assetsData = assetsData || {};
        const {
            currentDeposit = 0,
            alipay = 0,
            wechat = 0,
            car = 0,
            house = 0,
            fixedDeposit = 0,
            stocks = 0,
            loans = 0
        } = assetsData;

        const values = {
            v1: Math.max(0.01, currentDeposit + alipay + wechat),
            v2: Math.max(0.01, car + house),
            v3: Math.max(0.01, fixedDeposit + stocks),
            v4: Math.max(0.01, loans)
        };

        return {
            nodes: [
                { id: 0, name: "总资产", category: "total" },
                { id: 1, name: "流动资金", category: "liquid" },
                { id: 2, name: "固定资产", category: "fixed" },
                { id: 3, name: "投资理财", category: "investment" },
                { id: 4, name: "应收款项", category: "receivable" },
                { id: 5, name: "银行活期", category: "detail" },
                { id: 6, name: "支付宝", category: "detail" },
                { id: 7, name: "微信", category: "detail" },
                { id: 8, name: "车辆价值", category: "detail" },
                { id: 9, name: "房产价值", category: "detail" },
                { id: 10, name: "定期存款", category: "detail" },
                { id: 11, name: "股票基金", category: "detail" },
                { id: 12, name: "他人借款", category: "detail" }
            ],
            links: [
                { source: 0, target: 1, value: values.v1 },
                { source: 0, target: 2, value: values.v2 },
                { source: 0, target: 3, value: values.v3 },
                { source: 0, target: 4, value: values.v4 },
                { source: 1, target: 5, value: assetsData.currentDeposit },
                { source: 1, target: 6, value: assetsData.alipay },
                { source: 1, target: 7, value: assetsData.wechat },
                { source: 2, target: 8, value: assetsData.car },
                { source: 2, target: 9, value: assetsData.house },
                { source: 3, target: 10, value: assetsData.fixedDeposit },
                { source: 3, target: 11, value: assetsData.stocks },
                { source: 4, target: 12, value: assetsData.loans }
            ]
        };
    };

    const sankeyGeneratorRef = useRef();
    const tooltipRef = useRef();

    useEffect(() => {
        if (!svgRef.current || !data) return;
        
          // 清理之前的SVG
    d3.select(svgRef.current).selectAll("svg").remove();
    
        // 添加数据校验
        const sankeyData = transformData(data);
        if (!sankeyData.nodes || !sankeyData.links) {
            console.error('Invalid sankey data');
            return;
        }
        
        drawSankey(sankeyData);
    }, [data]);


    const drawSankey = (sankeyData) => {  // 添加参数
        // 设置图表尺寸
        const margin = { top: 20, right: 150, bottom: 20, left: 150 };
        const width = svgRef.current.clientWidth - margin.left - margin.right;
        const height = svgRef.current.clientHeight - margin.top - margin.bottom;

        // 创建SVG容器
        const svg = d3.select(svgRef.current) // 
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // 创建tooltip
        const tooltip = d3.select(tooltipRef.current);

        // 创建sankey图
        const sankeyGenerator = sankey()
            .nodeWidth(25)
            .nodePadding(40)
            .extent([[0, 0], [width, height]]);
        sankeyGeneratorRef.current = sankeyGenerator;

     
        // 转换数据为d3-sankey格式
        const { nodes, links } = sankeyGenerator({
            nodes: sankeyData.nodes.map(d => Object.assign({}, d)),
            links: sankeyData.links.map(d => Object.assign({}, d))
        });

        // 设置节点颜色
        const nodeColor = d => {
            const colors = {
                "income": "#6baed6",      // 蓝色系
                "total_income": "#6baed6", // 蓝色系
                "expenses": "#e6955c",     // 橙色系
                "savings": "#7bc77e",      // 绿色系
                "expense_detail": "#e6955c"// 橙色系
            };
            return colors[d.category] || "#999";
        };

        // 创建连接
        const link = svg.append("g")
            .selectAll(".link")
            .data(links)
            .enter()
            .append("path")
            .attr("class", "link")
            .attr("d", sankeyLinkHorizontal())
            .attr("stroke", d => {
                // 为不同的连接设置不同的颜色
                if (d.source.category === "income" && d.target.category === "total_income") {
                    return "#a4c8e5";  // 浅蓝色
                } else if (d.source.category === "total_income" && d.target.category === "expenses") {
                    return "#f0c8a0";  // 浅橙色
                } else if (d.source.category === "total_income" && d.target.category === "savings") {
                    return "#c6e2c6";  // 浅绿色
                } else {
                    return "#f0c8a0";  // 浅橙色
                }
            })
            .attr("stroke-width", d => Math.max(1, d.width))
            .on("mouseover", function (event, d) {
                d3.select(this)
                    .attr("stroke-opacity", 0.8);
                tooltip.style("opacity", 1)
                    .html(`<strong>流量:</strong> ${d.value.toFixed(2)}%`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 10) + "px");
            })
            .on("mouseout", function () {
                d3.select(this)
                    .attr("stroke-opacity", 0.5);
                tooltip.style("opacity", 0);
            });

        // 创建节点
        const node = svg.append("g")
            .selectAll(".node")
            .data(nodes)
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", d => `translate(${d.x0},${d.y0})`)
            .on("mouseover", function (event, d) {
                // 高亮相关连接
                link.style("stroke-opacity", l =>
                    l.source.id === d.id || l.target.id === d.id ? 0.8 : 0.1
                );

                let tooltipText = `<strong>${d.name}</strong>`;
                if (d.value) {
                    tooltipText += `<br>比例: ${d.value}%`;
                }

                tooltip.style("opacity", 1)
                    .html(tooltipText)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 10) + "px");
            })
            .on("mouseout", function () {
                link.style("stroke-opacity", 0.5);
                tooltip.style("opacity", 0);
            });

        // 添加节点矩形
        node.append("rect")
            .attr("height", d => d.y1 - d.y0)
            .attr("width", d => d.x1 - d.x0)
            .attr("fill", nodeColor);

        // 添加节点标签
        // 修改节点标签部分
        node.append("text")
            .attr("x", d => {
                if (d.category === "income") return -8;
                if (d.category === "expense_detail") return d.x1 - d.x0 + 8;
                return (d.x1 - d.x0) / 2;
            })
            .attr("y", d => (d.y1 - d.y0) / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", d => {
                if (d.category === "income") return "end";
                if (d.category === "expense_detail") return "start";
                return "middle";
            })
            .text(d => {
                // 只显示名称和数值，不显示百分比
                if (d.value) {
                    return `${d.name} ${d.value}`;
                }
                return d.name;
            })
            .attr("fill", "#333");
        
        // 修改中间节点的百分比标签
        node.filter(d => d.category === "total_income" || d.category === "expenses" || d.category === "savings")
            .append("text")
            .attr("x", d => (d.x1 - d.x0) / 2)
            .attr("y", d => (d.y1 - d.y0) / 2 + 20)
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em")
            .attr("font-size", "12px")
            .text(d => {
                // 计算此节点的总流入值
                const totalValue = sankeyData.links.reduce((sum, l) => {
                    if (l.target === d.id) {
                        return sum + l.value;
                    }
                    return sum;
                }, 0);
                
                if (totalValue > 0) {
                    return `${totalValue}`; // 只显示数值，不显示百分号
                }
                return '';
            });

       // 响应式调整
        function resizeSankey() {
            const sankeyGenerator = sankeyGeneratorRef.current;
            const newWidth = svgRef.current.clientWidth - margin.left - margin.right;
            const newHeight = svgRef.current.clientHeight - margin.top - margin.bottom;
        
            d3.select(svgRef.current).select("svg")
                .attr("width", newWidth + margin.left + margin.right)
                .attr("height", newHeight + margin.top + margin.bottom);
        
            sankeyGenerator.extent([[0, 0], [newWidth, newHeight]]);
        
            const { nodes: newNodes, links: newLinks } = sankeyGenerator({
                nodes: sankeyData.nodes.map(d => Object.assign({}, d)),
                links: sankeyData.links.map(d => Object.assign({}, d))
            });
        
            // 更新连接
            svg.selectAll(".link")
                .data(newLinks)
                .attr("d", sankeyLinkHorizontal())
                .attr("stroke-width", d => Math.max(1, d.width));
        
            // 更新节点位置
            svg.selectAll(".node")
                .data(newNodes)
                .attr("transform", d => `translate(${d.x0},${d.y0})`)
                .select("rect")
                .attr("height", d => d.y1 - d.y0)
                .attr("width", d => d.x1 - d.x0);
        
            // 更新文本位置   
            svg.selectAll(".node text")
                .data(newNodes)
                .attr("x", d => {
                    if (d.category === "income") return -8;
                    if (d.category === "expense_detail") return d.x1 - d.x0 + 8;
                    return (d.x1 - d.x0) / 2;
                })
                .attr("y", d => (d.y1 - d.y0) / 2);
        }

        // 添加窗口大小变化监听器
        window.addEventListener('resize', resizeSankey);
    }


    return (
        <div className="container">
            <div
                className="sankey-diagram"
                ref={svgRef}
                style={{ width: `${width}px`, height: `${height}px` }}
            />
            <div className="tooltip" ref={tooltipRef}></div>
        </div>
    );

};

export default SankeyDiagram;