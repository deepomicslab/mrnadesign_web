export const analysisTypeOptions = [
    {
        value: 'Linear Design',
        label: 'Linear Design',
    },
    {
        value: 'Prediction',
        label: 'Prediction',
    },
    {
        value: 'Safety',
        label: 'Safety',
    },
    {
        value: 'Sequence Align',
        label: 'Sequence Align',
    },
    {
        value: 'Antigen Screening',
        label: 'Antigen Screening',
    },
    {
        value: 'TSA',
        label: 'TSA',
    },
    {
        value: 'TCRanno',
        label: 'TCRanno',
    },
    {
        value: 'TCR Alpha-Beta Chain Pairing',
        label: 'TCR Alpha-Beta Chain Pairing',
    },
]

export const taskStatusOptions = [
    {
        label: 'Success',
        value: 'Success',
    },
    {
        label: 'Failed',
        value: 'Failed',
    },
    {
        label: 'Running',
        value: 'Running',
    },
    {
        label: 'Created',
        value: 'Created',
    },
]

export const codonUsageOptions = [
    {
        value: 'human',
        label: 'human',
    },
    {
        value: 'yeast',
        label: 'yeast',
    },
]

export const targetSpeciesOptions = [
    {
        value: 'Homo sapiens',
        label: 'Homo sapiens',
    },
    {
        value: 'Mus musculus',
        label: 'Mus musculus',
    },
]

export const utr5MRLBaseModifyOptions = [
    {
        value: 'unmod',
        label: 'unmod',
    },
    {
        value: 'm1pseudo',
        label: 'm1pseudo',
    },
]

export const utr5MRLTrimStrategyOptions = [
    {
        value: 'sliding_window',
        label: 'sliding_window',
    },
    {
        value: 'trim',
        label: 'trim',
    },
]

export const toxicityModelOptions = [
    {
        value: 'ML Model',
        label: 'ML Model',
    },
    {
        value: 'HybridModel',
        label: 'HybridModel',
    },
]

export const allergencityModelOptions = [
    {
        value: 'AAC based RF',
        label: 'AAC based RF',
    },
    {
        value: 'HybridModel',
        label: 'HybridModel',
    },
]

export const tsaRmatsAstypeOptions = [
    {
        value: 'A3S',
        label: 'A3S',
    },
    {
        value: 'A5S',
        label: 'A5S',
    },
    {
        value: 'MXE',
        label: 'MXE',
    },
    {
        value: 'RI',
        label: 'RI',
    },
    {
        value: 'SE',
        label: 'SE',
    },
]

export const tsaSampleOptions = [
    {
        value: 'HGSC1',
        label: 'HGSC1',
    },
    {
        value: 'HGSC2',
        label: 'HGSC2',
    },
    {
        value: 'HGSC3',
        label: 'HGSC3',
    },
    {
        value: 'HGSC4',
        label: 'HGSC4',
    },
    {
        value: 'HGSC5',
        label: 'HGSC5',
    },
    {
        value: 'HGSC6',
        label: 'HGSC6',
    },
    {
        value: 'OV606',
        label: 'OV606',
    },
    {
        value: 'OV633',
        label: 'OV633',
    },
    {
        value: 'OV642',
        label: 'OV642',
    },
    {
        value: 'MEL1',
        label: 'MEL1',
    },
    {
        value: 'MEL2',
        label: 'MEL2',
    },
    {
        value: 'MEL3',
        label: 'MEL3',
    },
    {
        value: 'MEL15',
        label: 'MEL15',
    },
    {
        value: 'GBM7',
        label: 'GBM7',
    },
]

export const tsaMutationTypeOptions = [
    {
        value: 'control',
        label: 'control',
    },
    {
        value: 'rna_edit',
        label: 'rna_edit',
    },
    {
        value: 'indel',
        label: 'indel',
    },
    {
        value: 'snp',
        label: 'snp',
    },
    {
        value: 'fusion',
        label: 'fusion',
    },
    {
        value: 'rmats',
        label: 'rmats',
    },
    {
        value: 'spe',
        label: 'spe',
    },
]

export const tcrannoDatabaseOptions = [
    {
        value: 'IEDB',
        label: 'IEDB',
    },
    {
        value: 'DB_FULL',
        label: 'DB_FULL',
    },
]

export const tcrannoFrequencyColOptions = [
    // put frequency at the 2nd column
    {
        value: 'frequency',
        label: 'frequency',
    },
    // put count at the 2nd column
    {
        value: 'count',
        label: 'count',
    },
    {
        value: 'none',
        label: 'none',
    },
]

export const tcrannoAnnoTypeOptions = [
    {
        value: 'all',
        label: 'all',
    },
    {
        value: 'tcr2ept',
        label: 'tcr2ept',
    },
    {
        value: 'tcr2ag',
        label: 'tcr2ag',
    },
    {
        value: 'tcr2org',
        label: 'tcr2org',
    },
]
export const tcrannoAnalysisTypeOptions = [
    {
        value: 'qual_quant',
        label: 'qualitative and quantitative',
    },
    {
        value: 'qual',
        label: 'qualitative',
    },
]
