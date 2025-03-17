export const datasetsOption = {
    title: {
        text: 'TAntigen sequence length',
        left: 'center',
    },
    tooltip: {},
    toolbox: {
        itemSize: 20,
        iconStyle: {
            borderColor: '#34498e',
        },
        feature: {
            dataView: { readOnly: true },
            magicType: { type: ['line', 'bar'] },
            restore: {},
            saveAsImage: {},
        },
    },
    xAxis: {
        data: ['0-1000', '1000-2000', '2000-3000', '>3000'],
        axisLabel: {
            interval: 0,
            fontSize: 16,
        },
    },
    yAxis: {},
    series: [
        {
            name: '# of sequences',
            type: 'bar',
            data: [3269, 972, 36, 14],
        },
    ],
}
export const QualityOption = {
    title: {
        text: 'TAntigen sequence length',
        left: 'center',
    },
    tooltip: {},
    toolbox: {
        itemSize: 20,
        iconStyle: {
            borderColor: '#34498e',
        },
        feature: {
            dataView: { readOnly: true },
            magicType: { type: ['line', 'bar'] },
            restore: {},
            saveAsImage: {},
        },
    },
    xAxis: {
        data: ['0-1000', '1000-2000', '2000-3000', '>3000'],
        axisLabel: {
            interval: 0,
            fontSize: 16,
        },
    },
    yAxis: {},
    series: [
        {
            name: '# of sequences',
            type: 'bar',
            data: [3269, 972, 36, 14],
        },
    ],
}

export const Hostnumber = {
    title: {
        text: 'Antigen sequence length',
        left: 'center',
    },
    tooltip: {},
    toolbox: {
        itemSize: 20,
        iconStyle: {
            borderColor: '#34498e',
        },
        feature: {
            dataView: { readOnly: true },
            magicType: { type: ['line', 'bar'] },
            restore: {},
            saveAsImage: {},
        },
    },
    xAxis: {
        data: ['0-1000', '1000-2000', '2000-3000', '>3000'],
        axisLabel: {
            interval: 0,
            rotate: 0,
            fontSize: 14,
        },
    },
    yAxis: {},
    series: [
        {
            name: 'Phages',
            type: 'bar',
            data: [368, 25, 3, 5],
        },
    ],
}

export const datasetspieOption = {
    title: {
        text: 'Data Source Distribution',
        left: 'center',
    },
    toolbox: {
        itemSize: 20,
        iconStyle: {
            borderColor: '#34498e',
        },
        feature: {
            dataView: { readOnly: true },
            saveAsImage: {},
        },
    },
    tooltip: {
        trigger: 'item',
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        textStyle: {
            fontSize: 5,
        },
    },
    series: [
        {
            name: '# of Antigens',
            type: 'pie',
            data: [
                { value: 6, name: 'Bacillus anthracis' },
                { value: 72, name: 'Mycobacterium tuberculosis' },
                { value: 10, name: 'Vibrio cholerae ' },
                { value: 48, name: 'Mycobacterium leprae' },
                { value: 24, name: 'Mycobacterium bovis' },
                { value: 19, name: 'Helicobacter pylori' },
                { value: 6, name: 'Streptococcus pneumoniae' },
                { value: 5, name: 'Pseudomonas aeruginosa' },
                { value: 6, name: 'Yersinia pestis' },
                { value: 4, name: 'Treponema pallidum' },
                { value: 3, name: 'Neisseria meningitidis' },
                { value: 27, name: 'Anaplasma marginale' },
                { value: 4, name: 'Boophilus microplus (Cattle tick)' },
                { value: 1, name: 'Bordetella pertussis' },
                { value: 8, name: 'Borrelia burgdorferi (Lyme disease spirochete)' },
                { value: 18, name: 'Brucella abortus' },
                { value: 5, name: 'Brucella melitensis' },
                { value: 22, name: 'Candida albicans (Yeast)' },
                { value: 7, name: 'Chlamydia trachomatis' },
                { value: 9, name: 'Clostridium perfringens' },
                { value: 1, name: 'Clostridium tetani' },
                { value: 6, name: 'Coccidioides immitis' },
                { value: 3, name: 'Coccidioides posadasii' },
                { value: 1, name: 'Echinococcus granulosus' },
                { value: 13, name: 'Haemophilus influenzae' },
                { value: 3, name: 'Klebsiella pneumoniae' },
                { value: 6, name: 'Legionella pneumophila' },
                { value: 6, name: 'Listeria monocytogenes' },
                { value: 2, name: 'Mycobacterium avium' },
                { value: 5, name: 'Neisseria meningitidis serogroup B' },
                { value: 4, name: 'Plasmodium chabaudi' },
                { value: 41, name: 'Plasmodium falciparum (isolate Camp / Malaysia)' },
                { value: 4, name: 'Plasmodium knowlesi' },
                { value: 1, name: 'Plasmodium yoelii yoelii' },
                { value: 3, name: 'Salmonella typhimurium' },
                { value: 13, name: 'Staphylococcus aureus' },
                { value: 6, name: 'Streptococcus agalactiae (GBS)' },
                { value: 1, name: 'Staphylococcus epidermidis' },
                { value: 1, name: 'Streptococcus pneumoniae (strain ATCC BAA-255 / R6)' },
                { value: 6, name: 'Streptococcus pyogenes (GAS)' },
                { value: 4, name: 'Yersinia pestis KIM' },
                { value: 9, name: 'Vaccinia virus (strain Dairen I) (VACV)' },
                { value: 7, name: 'Shigella flexneri' },
                { value: 8, name: 'Human papillomavirus' },
                { value: 3, name: 'Hepatitis C virus genotype 1a (isolate 1) (HCV)' },
                { value: 3, name: 'Human parvovirus B19' },
                { value: 41, name: 'Influenza A virus (strain A/NT/60/1968 H3N2)' },
            ],
            label: {
                fontSize: 5,
            },
        },
    ],
}
