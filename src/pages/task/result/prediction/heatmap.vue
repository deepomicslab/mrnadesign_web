<template>
    <div class="h-140">
        <svg id="Viz_area" :height="Height" :width="Width"></svg>
    </div>
</template>

<script setup lang="ts">
// @ts-nocheck
/* eslint-disable */
import * as d3 from 'd3'
import axios from 'axios'

const props = defineProps<{
    taskid: string
}>()
const { taskid } = toRefs(props)

const colormap1 = [
    '#45bf43',
    '#5490F8',
    '#29cbce',
    '#DF3AD2',
    '#9dc6e7',
    '#0FF0BF',
    '#9343f0',
    '#ec364e',
    '#90ed7d',
    '#445d8f',
]
const colormap2 = [
    '#45bf43',
    '#5490F8',
    '#29cbce',
    '#DF3AD2',
    '#9dc6e7',
    '#0FF0BF',
    '#9343f0',
    '#ec364e',
    '#90ed7d',
    '#445d8f',
]

const scoring = ref()
const demoheader = ref()
const parameterclass = ref()
const process_scoring = async () => {
    const response = await axios.get('/task/result/scoringheatmap/', {
        baseURL: '/api',
        timeout: 10000,
        params: {
            taskid: taskid.value,
        },
    })
    const { data } = response
    scoring.value = data.result
    parameterclass.value = scoring.value.seq_acc
    demoheader.value = Object.keys(scoring.value).slice(1)
}

watch(scoring, () => {
    process_svg()
})

const Width = ref(1800)
const Height = ref(700)
const width = ref(1000)
const height = ref(500)
const leftMargin = ref(200)
const rightMargin = ref(100)
const topMargin = ref(0)
const bottomMargin = ref(500)
const yoffset = ref(5)

const parameterclass2 = ['Header 2', 'Header 1']

const apply_sorter = async (order, columnKey) => {
    const sorter = {
        order: order,
        columnKey: columnKey,
    }
    const response = await axios.get('/task/result/scoringheatmap/', {
        baseURL: '/api',
        timeout: 10000,
        params: {
            taskid: taskid.value,
            sorter: sorter,
        },
    })
    const { data } = response
    scoring.value = data.result
    parameterclass.value = scoring.value.seq_acc
    demoheader.value = Object.keys(scoring.value).slice(1)
}

// Different protein class has different color
const chooseColor = (d: unknown, flag: number) => {
    let idx = 0
    let color = ''
    if (flag == 1) {
        // idx = parameterclass.value.indexOf(d.id)
        idx = d.id - 1
        color = colormap1[idx]
        return color
    }
    // idx = parameterclass.value.indexOf(d.id)
    idx = d.id - 1
    color = colormap1[idx]
    return color
}

// util function
function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr('x'),
            y = text.attr('y'),
            dy = 0, //parseFloat(text.attr("dy")),
            tspan = text
                .text(null)
                .append('tspan')
                .attr('x', x)
                .attr('y', y)
                .attr('dy', dy + 'em')
        while ((word = words.pop())) {
            line.push(word)
            tspan.text(line.join(' '))
            if (tspan.node().getComputedTextLength() > width) {
                line.pop()
                tspan.text(line.join(' '))
                line = [word]
                tspan = text
                    .append('tspan')
                    .attr('x', x)
                    .attr('y', y)
                    .attr('dy', ++lineNumber * lineHeight + dy + 'em')
                    .text(word)
            }
        }
    })
}

// Labels of columns
// const protein_class = proteinType
// append the svg object to the body of the page
const process_svg = () => {
    // }
    // onMounted(() => {
    d3.select('#Viz_area').selectAll('*').remove()
    const svg = d3
        .select('#Viz_area')
        .append('svg')
        .attr('width', width.value + leftMargin.value + rightMargin.value + 50)
        .attr('height', height.value + topMargin.value + bottomMargin.value)
        .append('g')
        .attr('transform', `translate(${leftMargin.value},${topMargin.value})`)

    // Build X scales and axis:
    // const xdomain = [1, 2, 3, 4, 5]
    const xdomain = Array.from({ length: demoheader.value.length }, (_, index) => index + 1)
    const x = d3
        .scaleBand()
        .range([0, width.value - leftMargin.value])
        .domain(xdomain)
        // .domain(demoheader.value)
        .padding(0.001)
    let xAix = svg
        .append('g')
        .attr('transform', 'translate(' + leftMargin.value + ',' + height.value + ')')
        .call(d3.axisBottom(x))
    xAix.select('.domain').remove()
    xAix.selectAll('.tick').selectAll('line').remove()
    xAix.selectAll('text')
        .style('text-anchor', 'end')
        .style('font-size', 20)
        .attr('dx', '-.5em')
        .attr('dy', '+.7em')
        .attr('transform', 'rotate(0)')

    const y = d3
        .scaleBand()
        .range([height.value / 2 - yoffset.value, 0])
        .domain(parameterclass.value)
        .padding(0.01)

    const y1 = d3
        .scaleBand()
        .range([height.value, height.value / 2 + yoffset.value])
        .domain(parameterclass.value)
        .padding(0.01)

    const y3 = d3
        .scaleBand()
        .range([
            height.value / 2 - yoffset.value,
            height.value / 2 - yoffset.value - 4 * y1.bandwidth(),
        ])
        .domain(parameterclass2)
        .padding(0.01)

    // Build the second Y scales and axis:
    let y1Aix = svg
        .append('g')
        .attr(
            'transform',
            'translate(' + leftMargin.value + ',' + (height.value / 2 + yoffset.value) + ')'
        )
        .call(d3.axisLeft(y))
    y1Aix.select('.domain').remove()
    y1Aix.selectAll('.tick').selectAll('line').remove()
    y1Aix
        .selectAll('text')
        .attr('transform', 'translate(' + -y.bandwidth() + ',0)')
        .style('font-size', 20)

    y1Aix
        .selectAll('textRec')
        .data(parameterclass.value)
        .enter()
        .append('rect')
        .attr('x', function (d) {
            return -y.bandwidth()
        })
        .attr('y', function (d) {
            return y(d) + y.bandwidth() / 4
        })
        .style('width', y.bandwidth() / 2)
        .style('height', y.bandwidth() / 2)
        .style('fill', function (d) {
            return chooseColor(d, 1)
        })
    const tooltip = svg.append('svg').attr('height', 100).attr('width', 230).style('opacity', 0)
    tooltip
        .append('rect')
        .attr('x', 0)
        .attr('width', 210)
        .attr('height', 70)
        .style('fill', '')
        .style('opacity', 0)
    const toolText1 = tooltip
        .append('text')
        .style('fill', 'black')
        .attr('transform', `translate(10,20)`)
        .style('font-size', 20)

    // create the black box, emerge when a column is selected
    const myCol = svg
        .append('rect')
        .style('opacity', 0)
        .style('fill-opacity', 0)
        .style('height', height.value / 2)
        .style('width', x.bandwidth())
        .style('stroke', 'black')
        .style('stroke-width', '2')
    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseover = function () {
        tooltip.style('opacity', 1)
        myCol.style('opacity', 1)
    }
    const mousemove = function (
        md: { layerX: number; layerY: number },
        d: { value: any; perc: any }
    ) {
        svg.selectAll('.myRec').style('opacity', 0.2)
        d3.select(this).style('opacity', 1)
        myCol
            .attr(
                'x',
                Math.floor((md.layerX - 2.9 * leftMargin.value) / x.bandwidth()) * x.bandwidth() +
                    leftMargin.value
            )
            .attr('y', height.value / 2 - yoffset.value)

        tooltip
            .style('opacity', 1)
            .attr(
                'x',
                Math.floor((md.layerX - 2.9 * leftMargin.value) / x.bandwidth()) * x.bandwidth() +
                    leftMargin.value
            )
            .attr('y', height.value / 2 - 30)

        toolText1.text(function () {
            return `${d.value}`
        })
    }
    const mouseleave = function () {
        svg.selectAll('.myRec').style('opacity', 1)
        tooltip.style('opacity', 0)
        myCol.style('opacity', 0)
    }

    let final = []
    for (let m = 0; m < parameterclass.value.length; m++) {
        for (let n = 0; n < demoheader.value.length; n++) {
            final.push({
                id: n + 1, // col
                class: parameterclass.value[m], // row
                // value: demodata[m][n + 1],
                value: scoring.value[demoheader.value[n]][m],
            })
        }
    }

    // Build gradient color scale
    let recColor = function (d) {
        let color = chooseColor(d, 0)
        return d3.scaleLinear().range(['#F7F7F7', color]).domain([0, 100])
    }

    // gradient color rect
    let label = svg
        .append('g')
        .attr('transform', 'translate(20,' + (height.value / 2 + yoffset.value) + ')')
    const defs = label.append('defs') //append defs
    const linearGradient = defs
        .selectAll('graDef') //append <linearGradient> in defs
        .data(parameterclass.value)
        .enter()
        .append('linearGradient')
        .attr('id', function (d) {
            return 'gradient' + d
        })
    linearGradient.append('stop').attr('offset', '0%').attr('stop-color', '#F7F7F7')
    linearGradient
        .append('stop')
        .attr('offset', '100%')
        .attr('stop-color', function (d) {
            return chooseColor(d, 1)
        })

    // heatmap
    svg.selectAll('myRec')
        .data(final) //, function(d) { return d.class+':'+d.id;})
        .enter()
        .append('rect')
        .attr('class', 'myRec')
        .attr('x', function (d) {
            return x(d.id) + leftMargin.value + 1
        })
        .attr('y', function (d) {
            return y1(d.class)
        })
        .attr('width', x.bandwidth() - 2)
        .attr('height', y1.bandwidth() - 1)
        .style('fill', function (d) {
            return recColor(d)(d.value)
        })
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseleave', mouseleave)

    // header
    let header = []
    for (let m = 0; m < demoheader.value.length; m++) {
        header.push({
            id: m + 1, // index starst from 1, according to demodata
            class: 'Header 2',
            value: demoheader.value[m],
        })
    }
    svg.selectAll('myHeader')
        .data(header)
        .enter()
        .append('rect')
        .attr('class', 'myRec')
        .attr('x', function (d) {
            return x(d.id) + leftMargin.value + 1
        })
        .attr('y', function (d) {
            return y3(d.class)
        })
        .attr('width', x.bandwidth() - 2)
        .attr('height', (y.bandwidth() - 1) * 2)
        .style('fill', '#d4d4d4')
    svg.selectAll('.arrow')
        .data(header)
        .enter()
        .append('polygon') // Using polyline for the down arrow
        .attr('class', 'uparrow')
        .attr('points', function (d) {
            const xPos = x(d.id) + leftMargin.value + x.bandwidth() / 2 + 20
            const yPos = y3(d.class) + (y.bandwidth() - 1) - 5 // Position below the rectangle
            return `${xPos - 7},${yPos} ${xPos},${yPos - 7} ${xPos + 7},${yPos}` // Down arrow points
        })
        .style('stroke', 'grey') // Colour the line
        .style('stroke-width', 2) // Line width
        .style('fill', 'grey')
        .style('stroke-linejoin', 'round') // Shape the line join
        .style('cursor', 'pointer') // Change cursor to pointer for interactivity
        .on('click', function (event, d) {
            apply_sorter('descend', d.value)
        })

    svg.selectAll('.arrow')
        .data(header)
        .enter()
        .append('polygon') // Using polyline for the down arrow
        .attr('class', 'downarrow')
        .attr('points', function (d) {
            const xPos = x(d.id) + leftMargin.value + x.bandwidth() / 2 + 20
            const yPos = y3(d.class) + (y.bandwidth() - 1) + 5 // Position below the rectangle
            return `${xPos - 7},${yPos} ${xPos},${yPos + 7} ${xPos + 7},${yPos}` // Down arrow points
        })
        .style('stroke', 'grey') // Colour the line
        .style('stroke-width', 2) // Line width
        .style('fill', 'grey')
        .style('stroke-linejoin', 'round') // Shape the line join
        .style('cursor', 'pointer') // Change cursor to pointer for interactivity
        .on('click', function (event, d) {
            apply_sorter('ascend', d.value)
        })

    svg.selectAll('.headerText')
        .data(header)
        .enter()
        .append('text')
        .attr('class', 'headerText')
        .attr('x', function (d) {
            return x(d.id) + leftMargin.value + x.bandwidth() / 2 // Center the text
        })
        .attr('y', function (d) {
            return y3(d.class) + y3.bandwidth() / 3 // Position above the rectangle
        })
        .attr('text-anchor', 'middle') // Center the text
        .style('font-size', '14px')
        .style('fill', '#000') // Text color
        .text(function (d) {
            return demoheader.value[d.id - 1] // Display the 'id' from the header array
        })
        .call(wrap, x.bandwidth() - 10)
}

process_scoring()
</script>

<style lang="scss" scoped>
.arrow {
    cursor: pointer;
    font-size: 24px;
    user-select: none;
}
</style>
