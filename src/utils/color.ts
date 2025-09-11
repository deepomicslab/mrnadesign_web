export const transcripthubSourceColor = (param: any) => {
    if (param === 'StringTie') {
        return 'info'
    }
    if (param === 'AGAT') {
        return 'warning'
    }
    return 'normal'
}

export const transcripthubFeatureColor = (param: any) => {
    if (param === 'gene') {
        return 'info'
    }
    if (param === 'transcript') {
        return 'warning'
    }
    if (param === 'exon') {
        return 'success'
    }
    if (param === 'five_prime_UTR' || param === 'three_prime_UTR') {
        return 'error'
    }
    if (param === 'CDS') {
        return 'warning'
    }
    return 'normal'
}
