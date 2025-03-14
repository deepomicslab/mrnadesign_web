const tracks = [
    {
        type: 'FeatureTrack',
        trackId: 'GCA_000001405.15_GRCh38_full_analysis_set.refseq_annotation.sorted.gff',
        name: 'NCBI RefSeq Genes',
        adapter: {
            type: 'Gff3TabixAdapter',
            gffGzLocation: {
                uri: 'https://s3.amazonaws.com/jbrowse.org/genomes/GRCh38/ncbi_refseq/GCA_000001405.15_GRCh38_full_analysis_set.refseq_annotation.sorted.gff.gz',
                locationType: 'UriLocation',
            },
            index: {
                location: {
                    uri: 'https://s3.amazonaws.com/jbrowse.org/genomes/GRCh38/ncbi_refseq/GCA_000001405.15_GRCh38_full_analysis_set.refseq_annotation.sorted.gff.gz.tbi',
                    locationType: 'UriLocation',
                },
                indexType: 'TBI',
            },
        },
        category: ['Genes'],
        assemblyNames: ['GRCh38'],
        renderer: {
            type: 'SvgFeatureRenderer',
        },
    },
    {
        type: 'FeatureTrack',
        trackId: 'gencode.v46.annotation.sorted.gff3',
        name: 'GENCODE Reference',
        adapter: {
            type: 'Gff3TabixAdapter',
            gffGzLocation: {
                uri: 'https://mrnaapi.deepomics.org/isoformdb/jbrowser/gencode.v46.annotation.sorted.gff3.gz',
                locationType: 'UriLocation',
            },
            index: {
                location: {
                    uri: 'https://mrnaapi.deepomics.org/isoformdb/jbrowser/gencode.v46.annotation.sorted.gff3.gz.tbi',
                    locationType: 'UriLocation',
                },
                indexType: 'TBI',
            },
        },
        category: ['Genes'],
        assemblyNames: ['GRCh38'],
        renderer: {
            type: 'SvgFeatureRenderer',
        },
    },
]

export default tracks
