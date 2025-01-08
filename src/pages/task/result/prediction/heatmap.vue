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
const Height = ref(1000)
const width = ref(1000)
const height = ref(500)
const leftMargin = ref(120)
const rightMargin = ref(100)
const topMargin = ref(0)
const bottomMargin = ref(500)
const headeroffset = ref(150)

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
        .attr('dx', '+.4em')
        .attr('dy', '+.7em')
        .attr('transform', 'rotate(0)')

    const y1 = d3
        .scaleBand()
        .range([height.value, headeroffset.value + 0])
        .domain(parameterclass.value)
        .padding(0.01)

    const y3 = d3
        .scaleBand()
        .range([height.value + 0, 0])
        .domain(parameterclass2)
        .padding(0.01)

    // Build the second Y scales and axis:
    let y1Aix = svg
        .append('g')
        .attr(
            'transform',
            'translate(' + leftMargin.value + ', 0)'
        )
        .call(d3.axisLeft(y1))
    y1Aix.select('.domain').remove()
    y1Aix.selectAll('.tick').selectAll('line').remove()
    y1Aix
        .selectAll('text')
        .style('font-size', 20)

    y1Aix
        .selectAll('textRec')
        .data(parameterclass.value)
        .enter()
        .append('rect')
        .attr('x', function (d) {
            return 0
        })
        .attr('y', function (d) {
            return y1(d.class)
        })
        .style('width', y1.bandwidth() / 2)
        .style('height', y1.bandwidth() / 2)
        .style('fill', function (d) {
            return chooseColor(d, 1)
        })

    let final = []
    for (let m = 0; m < parameterclass.value.length; m++) {
        for (let n = 0; n < demoheader.value.length; n++) {
            final.push({
                id: n + 1, // col
                class: parameterclass.value[m], // row
                value: scoring.value[demoheader.value[n]][m],
            })
        }
    }

    // Build gradient color scale
    let recColor = function (d) {
        const _values = final.map(d => d.value); // Extract values
        const largestValue = Math.max(..._values); // Find largest value
        const smallestValue = Math.min(..._values); // Find smallest value

        let color = chooseColor(d, 0)
        return d3.scaleLinear().range(['#F7F7F7', color]).domain([smallestValue, largestValue])
    }

    // gradient color rect
    let label = svg
        .append('g')
        .attr('transform', 'translate(20,' + (height.value / 2) + ')')
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
        .data(final)
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
        .style('opacity', 1)
        .on('mouseover', function (event, d) {
            svg.append('text')
                .attr('class', 'hover-text')
                .attr('x', x(d.id) + x.bandwidth() + leftMargin.value)
                .attr('y', y1(d.class) + y1.bandwidth() / 2)
                .attr('text-anchor', 'middle')
                .text(`Value: ${d.value}`);
            // svg.selectAll('.myRec').style('opacity', 0.2)
            d3.select(this).style('opacity', 1)
        })
        .on('mouseleave', function () {
            svg.selectAll('.hover-text').remove();
            // svg.selectAll('.myRec').style('opacity', 1)
        });

    // header
    let header = []
    for (let m = 0; m < demoheader.value.length; m++) {
        header.push({
            id: m + 1, // index starst from 1, according to final
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
            return 10
        })
        .attr('width', x.bandwidth() - 2)
        .attr('height', 130)
        .style('fill', '#d4d4d4')
    svg.selectAll('.arrow')
        .data(header)
        .enter()
        .append('polygon') // Using polyline for the down arrow
        .attr('class', 'uparrow')
        .attr('points', function (d) {
            const xPos = x(d.id) + leftMargin.value + x.bandwidth() / 2 + 40
            const yPos = 30
            return `${xPos - 7},${yPos} ${xPos},${yPos - 7} ${xPos + 7},${yPos}` // Up arrow points
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
            const xPos = x(d.id) + leftMargin.value + x.bandwidth() / 2 + 40
            const yPos = 35
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
            return headeroffset.value / 2 - 5
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
