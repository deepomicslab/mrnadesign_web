export default {
    name: 'GRCh38',
    sequence: {
        type: 'ReferenceSequenceTrack',
        trackId: 'GRCh38-ReferenceSequenceTrack',
        adapter: {
            type: 'BgzipFastaAdapter',
            fastaLocation: {
                uri: 'https://mrnaapi.deepomics.org/isoformdb/jbrowser/hg38.fa.gz',
                locationType: 'UriLocation',
            },
            faiLocation: {
                uri: 'https://mrnaapi.deepomics.org/isoformdb/jbrowser/hg38.fa.gz.fai',
                locationType: 'UriLocation',
            },
            gziLocation: {
                uri: 'https://mrnaapi.deepomics.org/isoformdb/jbrowser/hg38.fa.gz.gzi',
                locationType: 'UriLocation',
            },
        },
    },
    aliases: ['hg38'],
    refNameAliases: {
        adapter: {
            type: 'RefNameAliasAdapter',
            location: {
                uri: 'https://s3.amazonaws.com/jbrowse.org/genomes/GRCh38/GRCh38.aliases.txt',
                locationType: 'UriLocation',
            },
        },
    },
}
