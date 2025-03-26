/* eslint-disable camelcase */
export type codonpairType = {
    id: number
    Dinucleotide: string
    calculation_type: string
    genomic: number
    adipose_subcutaneous: number
    adipose_visceral_omentum: number
    adrenal_gland: number
    artery_aorta: number
    artery_coronary: number
    artery_tibial: number
    bladder: number
    brain_amygdala: number
    brain_anterior_cingulate_cortex_ba24: number
    brain_caudate_basal_ganglia: number
    brain_cerebellar_hemisphere: number
    brain_cerebellum: number
    brain_cortex: number
    brain_frontal_cortex_ba9: number
    brain_hippocampus: number
    brain_hypothalamus: number
    brain_nucleus_accumbens_basal_ganglia: number
    brain_putamen_basal_ganglia: number
    brain_spinal_cord_cervical_c_1: number
    brain_substantia_nigra: number
    breast_mammary_tissue: number
    cells_cultured_fibroblasts: number
    cells_ebv_transformed_lymphocytes: number
    cervix_ectocervix: number
    colon_sigmoid: number
    colon_transverse: number
    esophagus_gastroesophageal_junction: number
    esophagus_mucosa: number
    esophagus_muscularis: number
    fallopian_tube: number
    heart_atrial_appendage: number
    heart_left_ventricle: number
    kidney_cortex: number
    kidney_medulla: number
    liver: number
    lung: number
    minor_salivary_gland: number
    muscle_skeletal: number
    nerve_tibial: number
    ovary: number
    pancreas: number
    pituitary: number
    prostate: number
    skin_not_sun_exposed_suprapubic: number
    skin_sun_exposed_lower_leg: number
    small_intestine_terminal_ileum: number
    spleen: number
    stomach: number
    testis: number
    thyroid: number
    uterus: number
    vagina: number
    whole_blood: number
}

export const codonpairDict = {
    Dinucleotide: 'Dinucleotide',
    genomic: 'Genomic',
    adipose_subcutaneous: 'Adipose - Subcutaneous',
    adipose_visceral_omentum: 'Adipose - Visceral (Omentum)',
    adrenal_gland: 'Adrenal Gland',
    artery_aorta: 'Artery - Aorta',
    artery_coronary: 'Artery - Coronary',
    artery_tibial: 'Artery - Tibial',
    bladder: 'Bladder',
    brain_amygdala: 'Brain - Amygdala',
    brain_anterior_cingulate_cortex_ba24: 'Brain - Anterior cingulate cortex (BA24)',
    brain_caudate_basal_ganglia: 'Brain - Caudate (basal ganglia)',
    brain_cerebellar_hemisphere: 'Brain - Cerebellar Hemisphere',
    brain_cerebellum: 'Brain - Cerebellum',
    brain_cortex: 'Brain - Cortex',
    brain_frontal_cortex_ba9: 'Brain - Frontal Cortex (BA9)',
    brain_hippocampus: 'Brain - Hippocampus',
    brain_hypothalamus: 'Brain - Hypothalamus',
    brain_nucleus_accumbens_basal_ganglia: 'Brain - Nucleus accumbens (basal ganglia)',
    brain_putamen_basal_ganglia: 'Brain - Putamen (basal ganglia)',
    brain_spinal_cord_cervical_c_1: 'Brain - Spinal cord (cervical c-1)',
    brain_substantia_nigra: 'Brain - Substantia nigra',
    breast_mammary_tissue: 'Breast - Mammary Tissue',
    cells_cultured_fibroblasts: 'Cells - Cultured fibroblasts',
    cells_ebv_transformed_lymphocytes: 'Cells - EBV-transformed lymphocytes',
    cervix_ectocervix: 'Cervix - Ectocervix',
    cervix_endocervix: 'Cervix - Endocervix',
    colon_sigmoid: 'Colon - Sigmoid',
    colon_transverse: 'Colon - Transverse',
    esophagus_gastroesophageal_junction: 'Esophagus - Gastroesophageal Junction',
    esophagus_mucosa: 'Esophagus - Mucosa',
    esophagus_muscularis: 'Esophagus - Muscularis',
    fallopian_tube: 'Fallopian Tube',
    heart_atrial_appendage: 'Heart - Atrial Appendage',
    heart_left_ventricle: 'Heart - Left Ventricle',
    kidney_cortex: 'Kidney - Cortex',
    kidney_medulla: 'Kidney - Medulla',
    liver: 'Liver',
    lung: 'Lung',
    minor_salivary_gland: 'Minor Salivary Gland',
    muscle_skeletal: 'Muscle - Skeletal',
    nerve_tibial: 'Nerve - Tibial',
    ovary: 'Ovary',
    pancreas: 'Pancreas',
    pituitary: 'Pituitary',
    prostate: 'Prostate',
    skin_not_sun_exposed_suprapubic: 'Skin - Not Sun Exposed (Suprapubic)',
    skin_sun_exposed_lower_leg: 'Skin - Sun Exposed (Lower leg)',
    small_intestine_terminal_ileum: 'Small Intestine - Terminal Ileum',
    spleen: 'Spleen',
    stomach: 'Stomach',
    testis: 'Testis',
    thyroid: 'Thyroid',
    uterus: 'Uterus',
    vagina: 'Vagina',
    whole_blood: 'Whole Blood',
}

export const CodonpairDictReversed = {
    Genomic: 'genomic',
    'Adipose - Subcutaneous': 'adipose_subcutaneous',
    'Adipose - Visceral (Omentum)': 'adipose_visceral_omentum',
    'Adrenal Gland': 'adrenal_gland',
    'Artery - Aorta': 'artery_aorta',
    'Artery - Coronary': 'artery_coronary',
    'Artery - Tibial': 'artery_tibial',
    Bladder: 'bladder',
    'Brain - Amygdala': 'brain_amygdala',
    'Brain - Anterior cingulate cortex (BA24)': 'brain_anterior_cingulate_cortex_ba24',
    'Brain - Caudate (basal ganglia)': 'brain_caudate_basal_ganglia',
    'Brain - Cerebellar Hemisphere': 'brain_cerebellar_hemisphere',
    'Brain - Cerebellum': 'brain_cerebellum',
    'Brain - Cortex': 'brain_cortex',
    'Brain - Frontal Cortex (BA9)': 'brain_frontal_cortex_ba9',
    'Brain - Hippocampus': 'brain_hippocampus',
    'Brain - Hypothalamus': 'brain_hypothalamus',
    'Brain - Nucleus accumbens (basal ganglia)': 'brain_nucleus_accumbens_basal_ganglia',
    'Brain - Putamen (basal ganglia)': 'brain_putamen_basal_ganglia',
    'Brain - Spinal cord (cervical c-1)': 'brain_spinal_cord_cervical_c_1',
    'Brain - Substantia nigra': 'brain_substantia_nigra',
    'Breast - Mammary Tissue': 'breast_mammary_tissue',
    'Cells - Cultured fibroblasts': 'cells_cultured_fibroblasts',
    'Cells - EBV-transformed lymphocytes': 'cells_ebv_transformed_lymphocytes',
    'Cervix - Ectocervix': 'cervix_ectocervix',
    'Cervix - Endocervix': 'cervix_endocervix',
    'Colon - Sigmoid': 'colon_sigmoid',
    'Colon - Transverse': 'colon_transverse',
    'Esophagus - Gastroesophageal Junction': 'esophagus_gastroesophageal_junction',
    'Esophagus - Mucosa': 'esophagus_mucosa',
    'Esophagus - Muscularis': 'esophagus_muscularis',
    'Fallopian Tube': 'fallopian_tube',
    'Heart - Atrial Appendage': 'heart_atrial_appendage',
    'Heart - Left Ventricle': 'heart_left_ventricle',
    'Kidney - Cortex': 'kidney_cortex',
    'Kidney - Medulla': 'kidney_medulla',
    Liver: 'liver',
    Lung: 'lung',
    'Minor Salivary Gland': 'minor_salivary_gland',
    'Muscle - Skeletal': 'muscle_skeletal',
    'Nerve - Tibial': 'nerve_tibial',
    Ovary: 'ovary',
    Pancreas: 'pancreas',
    Pituitary: 'pituitary',
    Prostate: 'prostate',
    'Skin - Not Sun Exposed (Suprapubic)': 'skin_not_sun_exposed_suprapubic',
    'Skin - Sun Exposed (Lower leg)': 'skin_sun_exposed_lower_leg',
    'Small Intestine - Terminal Ileum': 'small_intestine_terminal_ileum',
    Spleen: 'spleen',
    Stomach: 'stomach',
    Testis: 'testis',
    Thyroid: 'thyroid',
    Uterus: 'uterus',
    Vagina: 'vagina',
    'Whole Blood': 'whole_blood',
    Dinucleotide: 'Dinucleotide',
}
