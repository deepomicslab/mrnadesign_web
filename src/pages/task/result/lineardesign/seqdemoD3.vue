<template>
    <div class="seqarea">
        <el-row>
            <el-col :span="5">
                <el-form :model="form">
                    <el-form-item label="mRNA Sequence">
                        <el-select v-model="form.component_type" placeholder="please select type">
                            <el-option
                                label="main regions"
                                value="Main regions"
                                @click="isShowRegion"
                            />
                            <el-option label="uORF" value="u_orf" @click="isShowUorf" />
                            <el-option
                                label="restriction_sites"
                                value="Restriction_sites"
                                @click="isShowResSites"
                            />
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="25">
                <div class="seq">
                    <div id="regionArea" v-show="showregion">
                        <el-text
                            class="UTR5"
                            type="primary"
                            :class="{ textHover: isActiveR1 }"
                            @mouseenter="hoverTextR1"
                            @mouseleave="leaveTextR1"
                        ></el-text>

                        <el-text
                            class="CDS"
                            tag="b"
                            type="danger"
                            :class="{ textHover: isActiveR2 }"
                            @mouseenter="hoverTextR2"
                            @mouseleave="leaveTextR2"
                        ></el-text>

                        <el-text
                            class="UTR3"
                            type="success"
                            :class="{ textHover: isActiveR3 }"
                            @mouseenter="hoverTextR3"
                            @mouseleave="leaveTextR3"
                        ></el-text>
                        <svg></svg>
                    </div>

                    <div class="uorfArea" v-show="showuorf" @mouseenter="getTipContentUorf">
                        <el-text>
                            <el-text class="notUORF">
                                CUAAUGCCAUGAUCCAGGUGACAUGUAGAAGCUUGGAUCAG
                            </el-text>
                            <el-tooltip placement="top" effect="light" :content="uorfTipCont[0]">
                                <el-text
                                    class="uORF1NoOverlap"
                                    type="primary"
                                    :class="{ textHover: isActive1 }"
                                    @mouseenter="hoverText1"
                                    @mouseleave="leaveText1"
                                >
                                    <el-text tag="ins" type="primary">AUG</el-text>
                                    CUGCACUUUGCGUUCG
                                </el-text>
                            </el-tooltip>
                            <el-tooltip placement="top" effect="light" :content="uorfTipCont[1]">
                                <el-text
                                    class="uORFOverlap1and2"
                                    type="danger"
                                    :class="{ textHover: isActive2 }"
                                    @mouseenter="hoverText2"
                                    @mouseleave="leaveText2"
                                >
                                    <el-text tag="ins" type="danger">AUG</el-text>
                                    UGGGAGCGUGCUUUCCACGACGGUGA
                                </el-text>
                            </el-tooltip>

                            <el-tooltip placement="top" effect="light" :content="uorfTipCont[1]">
                                <el-text
                                    class="uORFNoOverlap2"
                                    type="danger"
                                    :class="{ textHover: isActive3 }"
                                    @mouseenter="hoverText2"
                                    @mouseleave="leaveText2"
                                >
                                    CACGCUUCCCUGGAUUGGCAGCCAGACUGCCUUCCGGGUCACUGCC
                                </el-text>
                            </el-tooltip>

                            <el-tooltip placement="top" effect="light" :content="uorfTipCont[2]">
                                <el-text
                                    class="uORFOverlap2and3"
                                    type="success"
                                    tag="b"
                                    :class="{ textHover: isActive4 }"
                                    @mouseenter="hoverText4"
                                    @mouseleave="leaveText4"
                                >
                                    <el-text tag="ins" type="success">AUG</el-text>
                                    CCC
                                </el-text>
                            </el-tooltip>

                            <el-tooltip placement="top" effect="light" :content="uorfTipCont[3]">
                                <el-text
                                    class="uORFOverlap23and4"
                                    type="warning"
                                    tag="b"
                                    :class="{ textHover: isActive5 }"
                                    @mouseenter="hoverText5"
                                    @mouseleave="leaveText5"
                                >
                                    <el-text tag="ins" type="warning">AUG</el-text>
                                    CCCAUCGGCAGCAAGGAGAGGCCCACCUUCUUCGAGAUCUUCAAGACCAGGUGCAACAAGGCCGACCUGGGCCCCAUCAGCCUGAACUGA
                                </el-text>
                            </el-tooltip>
                            <el-text>
                                {{ componentsRegion[2].sequence }}
                            </el-text>
                        </el-text>
                    </div>

                    <div class="resSitesArea" v-show="showresSites">
                        <el-text v-for="resSend in resSiteSends" :key="resSend.Start">
                            <el-text>
                                {{ sequence.slice(resSend.Start, resSend.End) }}
                            </el-text>
                            <el-tooltip
                                placement="top"
                                effect="light"
                                :content="
                                    'Start: 30  Seq: ' +
                                    componentsResSites[24].sequence +
                                    '  Enzynms: AluI, AluBI'
                                "
                            >
                                <div class="line"></div>
                            </el-tooltip>
                        </el-text>
                        <el-text>
                            {{ sequence.slice(resSiteSends[54].End) }}
                        </el-text>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts" setup>
// do not use same name with ref
import { ref, reactive } from 'vue'
import * as d3 from 'd3'
// import _ from 'lodash'

// const dataFasta = ref(
//     'CUAAUGCCAUGAUCCAGGUGACAUGUAGAAGCUUGGAUCAGAUGCUGCACUUUGCGUUCGAUGUGGGAGCGUGCUUUCCACGACGGUGACACGCUUCCCUGGAUUGGCAGCCAGACUGCCUUCCGGGUCACUGCCAUGCCCAUGCCCAUCGGCAGCAAGGAGAGGCCCACCUUCUUCGAGAUCUUCAAGACCAGGUGCAACAAGGCCGACCUGGGCCCCAUCAGCCUGAACUGAAUUGAUUUU'
// )
const sequence = ref(
    'CUAAUGCCAUGAUCCAGGUGACAUGUAGAAGCUUGGAUCAGAUGCUGCACUUUGCGUUCGAUGUGGGAGCGUGCUUUCCACGACGGUGACACGCUUCCCUGGAUUGGCAGCCAGACUGCCUUCCGGGUCACUGCCAUGCCCAUGCCCAUCGGCAGCAAGGAGAGGCCCACCUUCUUCGAGAUCUUCAAGACCAGGUGCAACAAGGCCGACCUGGGCCCCAUCAGCCUGAACUGAAUUGAUUUU'
)

const componentsRegion = ref([
    {
        start: '1',
        end: '135',
        length: '135',
        sequence:
            'CUAAUGCCAUGAUCCAGGUGACAUGUAGAAGCUUGGAUCAGAUGCUGCACUUUGCGUUCGAUGUGGGAGCGUGCUUUCCACGACGGUGACACGCUUCCCUGGAUUGGCAGCCAGACUGCCUUCCGGGUCACUGCC',
        component_type: 'main_regions',
        component_class1: "5' UTR",
        component_class2: '-',
        accession_number: "the 5' untranslated region",
        source: '',
        description: '',
    },
    {
        start: '136',
        end: '234',
        length: '99',
        sequence:
            'AUGCCCAUGCCCAUCGGCAGCAAGGAGAGGCCCACCUUCUUCGAGAUCUUCAAGACCAGGUGCAACAAGGCCGACCUGGGCCCCAUCAGCCUGAACUGA',
        component_type: 'main_regions',
        component_class1: 'CDS',
        component_class2: '-',
        accession_number: 'the coding region of mRNA',
        source: '',
        description: '',
    },
    {
        start: '235',
        end: '243',
        length: '9',
        sequence: 'AUUGAUUUU',
        component_type: 'main_regions',
        component_class1: "3' UTR",
        component_class2: '-',
        accession_number: "the 3' untranslated region",
        source: '',
        description: '',
    },
])

const componentsUorf = ref([
    {
        start: '42',
        end: '86',
        length: '48',
        sequence: 'AUGCUGCACUUUGCGUUCGAUGUGGGAGCGUGCUUUCCACGACGGUGA',
        component_type: 'uORF',
        component_class1: 'non-overlapping',
        component_class2: 'weak',
        accession_number: 'SEQ000000_uORF0003',
        source: 'uORF_finder',
        description: 'ORF type: non-overlapping, with weak uKozak strength',
    },
    {
        start: '61',
        end: '231',
        length: '174',
        sequence:
            'AUGUGGGAGCGUGCUUUCCACGACGGUGACACGCUUCCCUGGAUUGGCAGCCAGACUGCCUUCCGGGUCACUGCCAUGCCCAUGCCCAUCGGCAGCAAGGAGAGGCCCACCUUCUUCGAGAUCUUCAAGACCAGGUGCAACAAGGCCGACCUGGGCCCCAUCAGCCUGAACUGA',
        component_type: 'uORF',
        component_class1: 'N-terminal extension',
        component_class2: 'weak',
        accession_number: 'SEQ000000_uORF0004',
        source: 'uORF_finder',
        description: 'ORF type: N-terminal extension, with weak uKozak strength',
    },
    {
        start: '136',
        end: '231',
        length: '99',
        sequence:
            'AUGCCCAUGCCCAUCGGCAGCAAGGAGAGGCCCACCUUCUUCGAGAUCUUCAAGACCAGGUGCAACAAGGCCGACCUGGGCCCCAUCAGCCUGAACUGA',
        component_type: 'uORF',
        component_class1: 'NA',
        component_class2: 'adequate',
        accession_number: 'SEQ000000_uORF0005',
        source: 'uORF_finder',
        description: 'ORF type: NA, with adequate uKozak strength',
    },
    {
        start: '142',
        end: '231',
        length: '93',
        sequence:
            'AUGCCCAUCGGCAGCAAGGAGAGGCCCACCUUCUUCGAGAUCUUCAAGACCAGGUGCAACAAGGCCGACCUGGGCCCCAUCAGCCUGAACUGA',
        component_type: 'uORF',
        component_class1: 'other in frame ORF on CDS',
        component_class2: 'weak',
        accession_number: 'SEQ000000_uORF0006',
        source: 'uORF_finder',
        description: 'ORF type: other in frame ORF on CDS, with weak uKozak strength',
    },
])

const componentsResSites = ref([
    {
        start: '8',
        end: '11',
        length: '4',
        sequence: 'CAUG',
        component_type: 'restriction_sites',
        component_class1: 'Type I, Type II, Type III',
        component_class2: 'RENZYME00053',
        accession_number: 'REBASE',
        source: 'Found [FaeI, Hin1II, Hsp92II, NlaIII] recognization site on seq: CAUG)',
        description: '',
    },
    {
        start: '8',
        end: '11',
        length: '4',
        sequence: 'CAUG',
        component_type: 'restriction_sites',
        component_class1: 'Type II',
        component_class2: 'RENZYME00100',
        accession_number: 'REBASE',
        source: 'Found [CviAII] recognization site on seq: CAUG)',
        description: '',
    },
    {
        start: '8',
        end: '11',
        length: '4',
        sequence: 'CAUG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00246',
        accession_number: 'REBASE',
        source: 'Found [FaiI] recognization site on seq: CAUG)',
        description: '',
    },
    {
        start: '8',
        end: '11',
        length: '4',
        sequence: 'CAUG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00249',
        accession_number: 'REBASE',
        source: 'Found [FatI] recognization site on seq: CAUG)',
        description: '',
    },
    {
        start: '11',
        end: '14',
        length: '4',
        sequence: 'GAUC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00136',
        accession_number: 'REBASE',
        source: 'Found [BstKTI] recognization site on seq: GAUC)',
        description: '',
    },
    {
        start: '11',
        end: '14',
        length: '4',
        sequence: 'GAUC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00137',
        accession_number: 'REBASE',
        source: 'Found [DpnI, MalI] recognization site on seq: GAUC)',
        description: '',
    },
    {
        start: '11',
        end: '14',
        length: '4',
        sequence: 'GAUC',
        component_type: 'restriction_sites',
        component_class1: 'Type I, Type II',
        component_class2: 'RENZYME00252',
        accession_number: 'REBASE',
        source: 'Found [BfuCI, Bsp143I, BssMI, BstMBI, DpnII, Kzo9I, MboI, NdeII, Sau3AI] recognization site on seq: GAUC)',
        description: '',
    },
    {
        start: '14',
        end: '18',
        length: '5',
        sequence: 'CCAGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00075',
        accession_number: 'REBASE',
        source: 'Found [Bme1390I, BmrFI, MspR9I, ScrFI] recognization site on seq: CCAGG)',
        description: '',
    },
    {
        start: '14',
        end: '18',
        length: '5',
        sequence: 'CCAGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00079',
        accession_number: 'REBASE',
        source: 'Found [BciT130I, BseBI, BstNI, BstOI, Bst2UI, MvaI] recognization site on seq: CCAGG)',
        description: '',
    },
    {
        start: '14',
        end: '18',
        length: '5',
        sequence: 'CCAGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00250',
        accession_number: 'REBASE',
        source: 'Found [BssKI, BstSCI, StyD4I] recognization site on seq: CCAGG)',
        description: '',
    },
    {
        start: '14',
        end: '18',
        length: '5',
        sequence: 'CCAGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I, Type II',
        component_class2: 'RENZYME00251',
        accession_number: 'REBASE',
        source: 'Found [AjnI, EcoRII, Psp6I, PspGI] recognization site on seq: CCAGG)',
        description: '',
    },
    {
        start: '16',
        end: '19',
        length: '4',
        sequence: 'AGGU',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00028',
        accession_number: 'REBASE',
        source: 'Found [SetI] recognization site on seq: AGGU)',
        description: '',
    },
    {
        start: '17',
        end: '21',
        length: '5',
        sequence: 'GGUGA',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00174',
        accession_number: 'REBASE',
        source: 'Found [AsuHPI, HphI] recognization site on seq: GGUGA)',
        description: '',
    },
    {
        start: '18',
        end: '22',
        length: '5',
        sequence: 'GUGAC',
        component_type: 'restriction_sites',
        component_class1: 'Type III',
        component_class2: 'RENZYME00253',
        accession_number: 'REBASE',
        source: 'Found [MaeIII] recognization site on seq: GUGAC)',
        description: '',
    },
    {
        start: '18',
        end: '22',
        length: '5',
        sequence: 'GUGAC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00254',
        accession_number: 'REBASE',
        source: 'Found [NmuCI, Tsp45I] recognization site on seq: GUGAC)',
        description: '',
    },
    {
        start: '21',
        end: '26',
        length: '6',
        sequence: 'ACAUGU',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00035',
        accession_number: 'REBASE',
        source: 'Found [BspLU11I, PciI, PscI] recognization site on seq: ACAUGU)',
        description: '',
    },
    {
        start: '21',
        end: '26',
        length: '6',
        sequence: 'ACAUGU',
        component_type: 'restriction_sites',
        component_class1: 'Type III',
        component_class2: 'RENZYME00040',
        accession_number: 'REBASE',
        source: 'Found [AflIII] recognization site on seq: ACAUGU)',
        description: '',
    },
    {
        start: '21',
        end: '26',
        length: '6',
        sequence: 'ACAUGU',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00212',
        accession_number: 'REBASE',
        source: 'Found [BstNSI, NspI, XceI] recognization site on seq: ACAUGU)',
        description: '',
    },
    {
        start: '22',
        end: '25',
        length: '4',
        sequence: 'CAUG',
        component_type: 'restriction_sites',
        component_class1: 'Type I, Type II, Type III',
        component_class2: 'RENZYME00053',
        accession_number: 'REBASE',
        source: 'Found [FaeI, Hin1II, Hsp92II, NlaIII] recognization site on seq: CAUG)',
        description: '',
    },
    {
        start: '22',
        end: '25',
        length: '4',
        sequence: 'CAUG',
        component_type: 'restriction_sites',
        component_class1: 'Type II',
        component_class2: 'RENZYME00100',
        accession_number: 'REBASE',
        source: 'Found [CviAII] recognization site on seq: CAUG)',
        description: '',
    },
    {
        start: '22',
        end: '25',
        length: '4',
        sequence: 'CAUG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00246',
        accession_number: 'REBASE',
        source: 'Found [FaiI] recognization site on seq: CAUG)',
        description: '',
    },
    {
        start: '22',
        end: '25',
        length: '4',
        sequence: 'CAUG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00249',
        accession_number: 'REBASE',
        source: 'Found [FatI] recognization site on seq: CAUG)',
        description: '',
    },
    {
        start: '29',
        end: '34',
        length: '6',
        sequence: 'AAGCUU',
        component_type: 'restriction_sites',
        component_class1: 'Type III',
        component_class2: 'RENZYME00034',
        accession_number: 'REBASE',
        source: 'Found [HindIII] recognization site on seq: AAGCUU)',
        description: '',
    },
    {
        start: '30',
        end: '33',
        length: '4',
        sequence: 'AGCU',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00027',
        accession_number: 'REBASE',
        source: 'Found [AluI, AluBI] recognization site on seq: AGCU)',
        description: '',
    },
    {
        start: '30',
        end: '33',
        length: '4',
        sequence: 'AGCU',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00028',
        accession_number: 'REBASE',
        source: 'Found [SetI] recognization site on seq: AGCU)',
        description: '',
    },
    {
        start: '30',
        end: '33',
        length: '4',
        sequence: 'AGCU',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00214',
        accession_number: 'REBASE',
        source: 'Found [CviJI] recognization site on seq: AGCU)',
        description: '',
    },
    {
        start: '35',
        end: '39',
        length: '5',
        sequence: 'GGAUC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00161',
        accession_number: 'REBASE',
        source: 'Found [AclWI, AlwI, BspPI] recognization site on seq: GGAUC)',
        description: '',
    },
    {
        start: '36',
        end: '39',
        length: '4',
        sequence: 'GAUC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00136',
        accession_number: 'REBASE',
        source: 'Found [BstKTI] recognization site on seq: GAUC)',
        description: '',
    },
    {
        start: '36',
        end: '39',
        length: '4',
        sequence: 'GAUC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00137',
        accession_number: 'REBASE',
        source: 'Found [DpnI, MalI] recognization site on seq: GAUC)',
        description: '',
    },
    {
        start: '36',
        end: '39',
        length: '4',
        sequence: 'GAUC',
        component_type: 'restriction_sites',
        component_class1: 'Type I, Type II',
        component_class2: 'RENZYME00252',
        accession_number: 'REBASE',
        source: 'Found [BfuCI, Bsp143I, BssMI, BstMBI, DpnII, Kzo9I, MboI, NdeII, Sau3AI] recognization site on seq: GAUC)',
        description: '',
    },
    {
        start: '38',
        end: '42',
        length: '5',
        sequence: 'UCAGA',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00225',
        accession_number: 'REBASE',
        source: 'Found [Hpy188I] recognization site on seq: UCAGA)',
        description: '',
    },
    {
        start: '39',
        end: '47',
        length: '9',
        sequence: 'CAGAUGCUG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00049',
        accession_number: 'REBASE',
        source: 'Found [AlwNI, CaiI] recognization site on seq: CAGAUGCUG)',
        description: '',
    },
    {
        start: '44',
        end: '48',
        length: '5',
        sequence: 'GCUGC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00151',
        accession_number: 'REBASE',
        source: 'Found [BlsI] recognization site on seq: GCUGC)',
        description: '',
    },
    {
        start: '44',
        end: '48',
        length: '5',
        sequence: 'GCUGC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00158',
        accession_number: 'REBASE',
        source: 'Found [BisI, Fnu4HI, Fsp4HI, GluI, ItaI, SatI] recognization site on seq: GCUGC)',
        description: '',
    },
    {
        start: '44',
        end: '48',
        length: '5',
        sequence: 'GCUGC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00200',
        accession_number: 'REBASE',
        source: 'Found [ApeKI, TseI] recognization site on seq: GCUGC)',
        description: '',
    },
    {
        start: '46',
        end: '49',
        length: '4',
        sequence: 'UGCA',
        component_type: 'restriction_sites',
        component_class1: 'Type V',
        component_class2: 'RENZYME00229',
        accession_number: 'REBASE',
        source: 'Found [HpyCH4V] recognization site on seq: UGCA)',
        description: '',
    },
    {
        start: '58',
        end: '61',
        length: '4',
        sequence: 'UCGA',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00237',
        accession_number: 'REBASE',
        source: 'Found [TaqI] recognization site on seq: UCGA)',
        description: '',
    },
    {
        start: '69',
        end: '74',
        length: '6',
        sequence: 'GCGUGC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00152',
        accession_number: 'REBASE',
        source: 'Found [BstC8I, Cac8I] recognization site on seq: GCGUGC)',
        description: '',
    },
    {
        start: '79',
        end: '88',
        length: '10',
        sequence: 'CACGACGGUG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00047',
        accession_number: 'REBASE',
        source: 'Found [AleI, OliI] recognization site on seq: CACGACGGUG)',
        description: '',
    },
    {
        start: '79',
        end: '88',
        length: '10',
        sequence: 'CACGACGGUG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00054',
        accession_number: 'REBASE',
        source: 'Found [MslI, RseI, SmiMI] recognization site on seq: CACGACGGUG)',
        description: '',
    },
    {
        start: '81',
        end: '85',
        length: '5',
        sequence: 'CGACG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00083',
        accession_number: 'REBASE',
        source: 'Found [Hpy99I] recognization site on seq: CGACG)',
        description: '',
    },
    {
        start: '83',
        end: '87',
        length: '5',
        sequence: 'ACGGU',
        component_type: 'restriction_sites',
        component_class1: 'Type I, Type III',
        component_class2: 'RENZYME00021',
        accession_number: 'REBASE',
        source: 'Found [Bst4CI, HpyCH4III, TaaI] recognization site on seq: ACGGU)',
        description: '',
    },
    {
        start: '85',
        end: '89',
        length: '5',
        sequence: 'GGUGA',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00174',
        accession_number: 'REBASE',
        source: 'Found [AsuHPI, HphI] recognization site on seq: GGUGA)',
        description: '',
    },
    {
        start: '86',
        end: '90',
        length: '5',
        sequence: 'GUGAC',
        component_type: 'restriction_sites',
        component_class1: 'Type III',
        component_class2: 'RENZYME00253',
        accession_number: 'REBASE',
        source: 'Found [MaeIII] recognization site on seq: GUGAC)',
        description: '',
    },
    {
        start: '86',
        end: '90',
        length: '5',
        sequence: 'GUGAC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00254',
        accession_number: 'REBASE',
        source: 'Found [NmuCI, Tsp45I] recognization site on seq: GUGAC)',
        description: '',
    },
    {
        start: '97',
        end: '107',
        length: '11',
        sequence: 'CCCUGGAUUGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00067',
        accession_number: 'REBASE',
        source: 'Found [AfiI, Bsc4I, BseLI, BsiYI, BslI] recognization site on seq: CCCUGGAUUGG)',
        description: '',
    },
    {
        start: '97',
        end: '102',
        length: '6',
        sequence: 'CCCUGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00104',
        accession_number: 'REBASE',
        source: 'Found [BsaJI, BseDI, BssECI] recognization site on seq: CCCUGG)',
        description: '',
    },
    {
        start: '98',
        end: '102',
        length: '5',
        sequence: 'CCUGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00075',
        accession_number: 'REBASE',
        source: 'Found [Bme1390I, BmrFI, MspR9I, ScrFI] recognization site on seq: CCUGG)',
        description: '',
    },
    {
        start: '98',
        end: '102',
        length: '5',
        sequence: 'CCUGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00079',
        accession_number: 'REBASE',
        source: 'Found [BciT130I, BseBI, BstNI, BstOI, Bst2UI, MvaI] recognization site on seq: CCUGG)',
        description: '',
    },
    {
        start: '98',
        end: '102',
        length: '5',
        sequence: 'CCUGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00250',
        accession_number: 'REBASE',
        source: 'Found [BssKI, BstSCI, StyD4I] recognization site on seq: CCUGG)',
        description: '',
    },
    {
        start: '98',
        end: '102',
        length: '5',
        sequence: 'CCUGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I, Type II',
        component_class2: 'RENZYME00251',
        accession_number: 'REBASE',
        source: 'Found [AjnI, EcoRII, Psp6I, PspGI] recognization site on seq: CCUGG)',
        description: '',
    },
    {
        start: '107',
        end: '111',
        length: '5',
        sequence: 'GCAGC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00139',
        accession_number: 'REBASE',
        source: 'Found [BbvI, BseXI, BstV1I, Lsp1109I] recognization site on seq: GCAGC)',
        description: '',
    },
    {
        start: '107',
        end: '111',
        length: '5',
        sequence: 'GCAGC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00151',
        accession_number: 'REBASE',
        source: 'Found [BlsI] recognization site on seq: GCAGC)',
        description: '',
    },
    {
        start: '107',
        end: '111',
        length: '5',
        sequence: 'GCAGC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00158',
        accession_number: 'REBASE',
        source: 'Found [BisI, Fnu4HI, Fsp4HI, GluI, ItaI, SatI] recognization site on seq: GCAGC)',
        description: '',
    },
    {
        start: '107',
        end: '111',
        length: '5',
        sequence: 'GCAGC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00200',
        accession_number: 'REBASE',
        source: 'Found [ApeKI, TseI] recognization site on seq: GCAGC)',
        description: '',
    },
    {
        start: '109',
        end: '112',
        length: '4',
        sequence: 'AGCC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00214',
        accession_number: 'REBASE',
        source: 'Found [CviJI] recognization site on seq: AGCC)',
        description: '',
    },
    {
        start: '119',
        end: '123',
        length: '5',
        sequence: 'CCUUC',
        component_type: 'restriction_sites',
        component_class1: 'Type V',
        component_class2: 'RENZYME00073',
        accession_number: 'REBASE',
        source: 'Found [HpyAV] recognization site on seq: CCUUC)',
        description: '',
    },
    {
        start: '123',
        end: '127',
        length: '5',
        sequence: 'CCGGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00075',
        accession_number: 'REBASE',
        source: 'Found [Bme1390I, BmrFI, MspR9I, ScrFI] recognization site on seq: CCGGG)',
        description: '',
    },
    {
        start: '123',
        end: '127',
        length: '5',
        sequence: 'CCGGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00076',
        accession_number: 'REBASE',
        source: 'Found [AsuC2I, BcnI, BpuMI, NciI] recognization site on seq: CCGGG)',
        description: '',
    },
    {
        start: '123',
        end: '126',
        length: '4',
        sequence: 'CCGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I, Type II',
        component_class2: 'RENZYME00103',
        accession_number: 'REBASE',
        source: 'Found [BsiSI, HapII, HpaII, MspI] recognization site on seq: CCGG)',
        description: '',
    },
    {
        start: '123',
        end: '127',
        length: '5',
        sequence: 'CCGGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00250',
        accession_number: 'REBASE',
        source: 'Found [BssKI, BstSCI, StyD4I] recognization site on seq: CCGGG)',
        description: '',
    },
    {
        start: '127',
        end: '131',
        length: '5',
        sequence: 'GUCAC',
        component_type: 'restriction_sites',
        component_class1: 'Type III',
        component_class2: 'RENZYME00253',
        accession_number: 'REBASE',
        source: 'Found [MaeIII] recognization site on seq: GUCAC)',
        description: '',
    },
    {
        start: '127',
        end: '131',
        length: '5',
        sequence: 'GUCAC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00254',
        accession_number: 'REBASE',
        source: 'Found [NmuCI, Tsp45I] recognization site on seq: GUCAC)',
        description: '',
    },
    {
        start: '129',
        end: '135',
        length: '7',
        sequence: 'CACUGCC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00052',
        accession_number: 'REBASE',
        source: 'Found [TscAI, TspRI] recognization site on seq: CACUGCC)',
        description: '',
    },
    {
        start: '129',
        end: '138',
        length: '10',
        sequence: 'CACUGCCAUG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00054',
        accession_number: 'REBASE',
        source: 'Found [MslI, RseI, SmiMI] recognization site on seq: CACUGCCAUG)',
        description: '',
    },
    {
        start: '135',
        end: '138',
        length: '4',
        sequence: 'CAUG',
        component_type: 'restriction_sites',
        component_class1: 'Type I, Type II, Type III',
        component_class2: 'RENZYME00053',
        accession_number: 'REBASE',
        source: 'Found [FaeI, Hin1II, Hsp92II, NlaIII] recognization site on seq: CAUG)',
        description: '',
    },
    {
        start: '135',
        end: '138',
        length: '4',
        sequence: 'CAUG',
        component_type: 'restriction_sites',
        component_class1: 'Type II',
        component_class2: 'RENZYME00100',
        accession_number: 'REBASE',
        source: 'Found [CviAII] recognization site on seq: CAUG)',
        description: '',
    },
    {
        start: '135',
        end: '138',
        length: '4',
        sequence: 'CAUG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00246',
        accession_number: 'REBASE',
        source: 'Found [FaiI] recognization site on seq: CAUG)',
        description: '',
    },
    {
        start: '135',
        end: '138',
        length: '4',
        sequence: 'CAUG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00249',
        accession_number: 'REBASE',
        source: 'Found [FatI] recognization site on seq: CAUG)',
        description: '',
    },
    {
        start: '141',
        end: '144',
        length: '4',
        sequence: 'CAUG',
        component_type: 'restriction_sites',
        component_class1: 'Type I, Type II, Type III',
        component_class2: 'RENZYME00053',
        accession_number: 'REBASE',
        source: 'Found [FaeI, Hin1II, Hsp92II, NlaIII] recognization site on seq: CAUG)',
        description: '',
    },
    {
        start: '141',
        end: '144',
        length: '4',
        sequence: 'CAUG',
        component_type: 'restriction_sites',
        component_class1: 'Type II',
        component_class2: 'RENZYME00100',
        accession_number: 'REBASE',
        source: 'Found [CviAII] recognization site on seq: CAUG)',
        description: '',
    },
    {
        start: '141',
        end: '144',
        length: '4',
        sequence: 'CAUG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00246',
        accession_number: 'REBASE',
        source: 'Found [FaiI] recognization site on seq: CAUG)',
        description: '',
    },
    {
        start: '141',
        end: '144',
        length: '4',
        sequence: 'CAUG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00249',
        accession_number: 'REBASE',
        source: 'Found [FatI] recognization site on seq: CAUG)',
        description: '',
    },
    {
        start: '146',
        end: '150',
        length: '5',
        sequence: 'CCAUC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00059',
        accession_number: 'REBASE',
        source: 'Found [BccI] recognization site on seq: CCAUC)',
        description: '',
    },
    {
        start: '152',
        end: '156',
        length: '5',
        sequence: 'GCAGC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00139',
        accession_number: 'REBASE',
        source: 'Found [BbvI, BseXI, BstV1I, Lsp1109I] recognization site on seq: GCAGC)',
        description: '',
    },
    {
        start: '152',
        end: '156',
        length: '5',
        sequence: 'GCAGC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00151',
        accession_number: 'REBASE',
        source: 'Found [BlsI] recognization site on seq: GCAGC)',
        description: '',
    },
    {
        start: '152',
        end: '156',
        length: '5',
        sequence: 'GCAGC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00158',
        accession_number: 'REBASE',
        source: 'Found [BisI, Fnu4HI, Fsp4HI, GluI, ItaI, SatI] recognization site on seq: GCAGC)',
        description: '',
    },
    {
        start: '152',
        end: '156',
        length: '5',
        sequence: 'GCAGC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00200',
        accession_number: 'REBASE',
        source: 'Found [ApeKI, TseI] recognization site on seq: GCAGC)',
        description: '',
    },
    {
        start: '164',
        end: '167',
        length: '4',
        sequence: 'GGCC',
        component_type: 'restriction_sites',
        component_class1: 'Type I, Type III',
        component_class2: 'RENZYME00175',
        accession_number: 'REBASE',
        source: 'Found [BshFI, BsnI, BsuRI, HaeIII, PhoI] recognization site on seq: GGCC)',
        description: '',
    },
    {
        start: '164',
        end: '168',
        length: '5',
        sequence: 'GGCCC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00204',
        accession_number: 'REBASE',
        source: 'Found [AspS9I, BmgT120I, Cfr13I, PspPI, Sau96I] recognization site on seq: GGCCC)',
        description: '',
    },
    {
        start: '164',
        end: '167',
        length: '4',
        sequence: 'GGCC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00214',
        accession_number: 'REBASE',
        source: 'Found [CviJI] recognization site on seq: GGCC)',
        description: '',
    },
    {
        start: '169',
        end: '172',
        length: '4',
        sequence: 'ACCU',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00028',
        accession_number: 'REBASE',
        source: 'Found [SetI] recognization site on seq: ACCU)',
        description: '',
    },
    {
        start: '170',
        end: '174',
        length: '5',
        sequence: 'CCUUC',
        component_type: 'restriction_sites',
        component_class1: 'Type V',
        component_class2: 'RENZYME00073',
        accession_number: 'REBASE',
        source: 'Found [HpyAV] recognization site on seq: CCUUC)',
        description: '',
    },
    {
        start: '176',
        end: '181',
        length: '6',
        sequence: 'UCGAGA',
        component_type: 'restriction_sites',
        component_class1: 'Type III',
        component_class2: 'RENZYME00226',
        accession_number: 'REBASE',
        source: 'Found [Hpy188III] recognization site on seq: UCGAGA)',
        description: '',
    },
    {
        start: '176',
        end: '179',
        length: '4',
        sequence: 'UCGA',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00237',
        accession_number: 'REBASE',
        source: 'Found [TaqI] recognization site on seq: UCGA)',
        description: '',
    },
    {
        start: '179',
        end: '184',
        length: '6',
        sequence: 'AGAUCU',
        component_type: 'restriction_sites',
        component_class1: 'Type II',
        component_class2: 'RENZYME00042',
        accession_number: 'REBASE',
        source: 'Found [BglII] recognization site on seq: AGAUCU)',
        description: '',
    },
    {
        start: '179',
        end: '184',
        length: '6',
        sequence: 'AGAUCU',
        component_type: 'restriction_sites',
        component_class1: 'Type I, Type II',
        component_class2: 'RENZYME00220',
        accession_number: 'REBASE',
        source: 'Found [BstX2I, BstYI, MflI, PsuI, XhoII] recognization site on seq: AGAUCU)',
        description: '',
    },
    {
        start: '180',
        end: '183',
        length: '4',
        sequence: 'GAUC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00136',
        accession_number: 'REBASE',
        source: 'Found [BstKTI] recognization site on seq: GAUC)',
        description: '',
    },
    {
        start: '180',
        end: '183',
        length: '4',
        sequence: 'GAUC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00137',
        accession_number: 'REBASE',
        source: 'Found [DpnI, MalI] recognization site on seq: GAUC)',
        description: '',
    },
    {
        start: '180',
        end: '183',
        length: '4',
        sequence: 'GAUC',
        component_type: 'restriction_sites',
        component_class1: 'Type I, Type II',
        component_class2: 'RENZYME00252',
        accession_number: 'REBASE',
        source: 'Found [BfuCI, Bsp143I, BssMI, BstMBI, DpnII, Kzo9I, MboI, NdeII, Sau3AI] recognization site on seq: GAUC)',
        description: '',
    },
    {
        start: '185',
        end: '190',
        length: '6',
        sequence: 'UCAAGA',
        component_type: 'restriction_sites',
        component_class1: 'Type III',
        component_class2: 'RENZYME00226',
        accession_number: 'REBASE',
        source: 'Found [Hpy188III] recognization site on seq: UCAAGA)',
        description: '',
    },
    {
        start: '190',
        end: '196',
        length: '7',
        sequence: 'ACCAGGU',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00037',
        accession_number: 'REBASE',
        source: 'Found [CsiI, MabI, SexAI] recognization site on seq: ACCAGGU)',
        description: '',
    },
    {
        start: '191',
        end: '195',
        length: '5',
        sequence: 'CCAGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00075',
        accession_number: 'REBASE',
        source: 'Found [Bme1390I, BmrFI, MspR9I, ScrFI] recognization site on seq: CCAGG)',
        description: '',
    },
    {
        start: '191',
        end: '195',
        length: '5',
        sequence: 'CCAGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00079',
        accession_number: 'REBASE',
        source: 'Found [BciT130I, BseBI, BstNI, BstOI, Bst2UI, MvaI] recognization site on seq: CCAGG)',
        description: '',
    },
    {
        start: '191',
        end: '195',
        length: '5',
        sequence: 'CCAGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00250',
        accession_number: 'REBASE',
        source: 'Found [BssKI, BstSCI, StyD4I] recognization site on seq: CCAGG)',
        description: '',
    },
    {
        start: '191',
        end: '195',
        length: '5',
        sequence: 'CCAGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I, Type II',
        component_class2: 'RENZYME00251',
        accession_number: 'REBASE',
        source: 'Found [AjnI, EcoRII, Psp6I, PspGI] recognization site on seq: CCAGG)',
        description: '',
    },
    {
        start: '193',
        end: '196',
        length: '4',
        sequence: 'AGGU',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00028',
        accession_number: 'REBASE',
        source: 'Found [SetI] recognization site on seq: AGGU)',
        description: '',
    },
    {
        start: '196',
        end: '199',
        length: '4',
        sequence: 'UGCA',
        component_type: 'restriction_sites',
        component_class1: 'Type V',
        component_class2: 'RENZYME00229',
        accession_number: 'REBASE',
        source: 'Found [HpyCH4V] recognization site on seq: UGCA)',
        description: '',
    },
    {
        start: '204',
        end: '207',
        length: '4',
        sequence: 'GGCC',
        component_type: 'restriction_sites',
        component_class1: 'Type I, Type III',
        component_class2: 'RENZYME00175',
        accession_number: 'REBASE',
        source: 'Found [BshFI, BsnI, BsuRI, HaeIII, PhoI] recognization site on seq: GGCC)',
        description: '',
    },
    {
        start: '204',
        end: '207',
        length: '4',
        sequence: 'GGCC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00214',
        accession_number: 'REBASE',
        source: 'Found [CviJI] recognization site on seq: GGCC)',
        description: '',
    },
    {
        start: '209',
        end: '212',
        length: '4',
        sequence: 'ACCU',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00028',
        accession_number: 'REBASE',
        source: 'Found [SetI] recognization site on seq: ACCU)',
        description: '',
    },
    {
        start: '210',
        end: '214',
        length: '5',
        sequence: 'CCUGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00075',
        accession_number: 'REBASE',
        source: 'Found [Bme1390I, BmrFI, MspR9I, ScrFI] recognization site on seq: CCUGG)',
        description: '',
    },
    {
        start: '210',
        end: '214',
        length: '5',
        sequence: 'CCUGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00079',
        accession_number: 'REBASE',
        source: 'Found [BciT130I, BseBI, BstNI, BstOI, Bst2UI, MvaI] recognization site on seq: CCUGG)',
        description: '',
    },
    {
        start: '210',
        end: '215',
        length: '6',
        sequence: 'CCUGGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00104',
        accession_number: 'REBASE',
        source: 'Found [BsaJI, BseDI, BssECI] recognization site on seq: CCUGGG)',
        description: '',
    },
    {
        start: '210',
        end: '214',
        length: '5',
        sequence: 'CCUGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00250',
        accession_number: 'REBASE',
        source: 'Found [BssKI, BstSCI, StyD4I] recognization site on seq: CCUGG)',
        description: '',
    },
    {
        start: '210',
        end: '214',
        length: '5',
        sequence: 'CCUGG',
        component_type: 'restriction_sites',
        component_class1: 'Type I, Type II',
        component_class2: 'RENZYME00251',
        accession_number: 'REBASE',
        source: 'Found [AjnI, EcoRII, Psp6I, PspGI] recognization site on seq: CCUGG)',
        description: '',
    },
    {
        start: '213',
        end: '218',
        length: '6',
        sequence: 'GGGCCC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00160',
        accession_number: 'REBASE',
        source: 'Found [Bsp1286I, MhlI, SduI] recognization site on seq: GGGCCC)',
        description: '',
    },
    {
        start: '213',
        end: '218',
        length: '6',
        sequence: 'GGGCCC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00170',
        accession_number: 'REBASE',
        source: 'Found [ApaI] recognization site on seq: GGGCCC)',
        description: '',
    },
    {
        start: '213',
        end: '218',
        length: '6',
        sequence: 'GGGCCC',
        component_type: 'restriction_sites',
        component_class1: 'Type I, Type IV',
        component_class2: 'RENZYME00171',
        accession_number: 'REBASE',
        source: 'Found [BmiI, BspLI, NlaIV, PspN4I] recognization site on seq: GGGCCC)',
        description: '',
    },
    {
        start: '213',
        end: '218',
        length: '6',
        sequence: 'GGGCCC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00179',
        accession_number: 'REBASE',
        source: 'Found [BaeGI, Bme1580I, BseSI, BstSLI] recognization site on seq: GGGCCC)',
        description: '',
    },
    {
        start: '213',
        end: '218',
        length: '6',
        sequence: 'GGGCCC',
        component_type: 'restriction_sites',
        component_class1: 'Type I, Type II',
        component_class2: 'RENZYME00180',
        accession_number: 'REBASE',
        source: 'Found [BanII, Eco24I, EcoT38I, FriOI] recognization site on seq: GGGCCC)',
        description: '',
    },
    {
        start: '213',
        end: '218',
        length: '6',
        sequence: 'GGGCCC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00203',
        accession_number: 'REBASE',
        source: 'Found [Bsp120I, PspOMI] recognization site on seq: GGGCCC)',
        description: '',
    },
    {
        start: '213',
        end: '217',
        length: '5',
        sequence: 'GGGCC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00204',
        accession_number: 'REBASE',
        source: 'Found [AspS9I, BmgT120I, Cfr13I, PspPI, Sau96I] recognization site on seq: GGGCC)',
        description: '',
    },
    {
        start: '213',
        end: '219',
        length: '7',
        sequence: 'GGGCCCC',
        component_type: 'restriction_sites',
        component_class1: 'Type I, Type II',
        component_class2: 'RENZYME00215',
        accession_number: 'REBASE',
        source: 'Found [DraII, EcoO109I] recognization site on seq: GGGCCCC)',
        description: '',
    },
    {
        start: '214',
        end: '217',
        length: '4',
        sequence: 'GGCC',
        component_type: 'restriction_sites',
        component_class1: 'Type I, Type III',
        component_class2: 'RENZYME00175',
        accession_number: 'REBASE',
        source: 'Found [BshFI, BsnI, BsuRI, HaeIII, PhoI] recognization site on seq: GGCC)',
        description: '',
    },
    {
        start: '214',
        end: '217',
        length: '4',
        sequence: 'GGCC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00214',
        accession_number: 'REBASE',
        source: 'Found [CviJI] recognization site on seq: GGCC)',
        description: '',
    },
    {
        start: '215',
        end: '225',
        length: '11',
        sequence: 'GCCCCAUCAGC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00150',
        accession_number: 'REBASE',
        source: 'Found [BstMWI, HpyF10VI, MwoI] recognization site on seq: GCCCCAUCAGC)',
        description: '',
    },
    {
        start: '218',
        end: '222',
        length: '5',
        sequence: 'CCAUC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00059',
        accession_number: 'REBASE',
        source: 'Found [BccI] recognization site on seq: CCAUC)',
        description: '',
    },
    {
        start: '223',
        end: '226',
        length: '4',
        sequence: 'AGCC',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00214',
        accession_number: 'REBASE',
        source: 'Found [CviJI] recognization site on seq: AGCC)',
        description: '',
    },
    {
        start: '234',
        end: '237',
        length: '4',
        sequence: 'AAUU',
        component_type: 'restriction_sites',
        component_class1: 'Type I',
        component_class2: 'RENZYME00248',
        accession_number: 'REBASE',
        source: 'Found [MluCI, Sse9I, TasI, Tsp509I, TspEI] recognization site on seq: AAUU)',
        description: '',
    },
])

const resSiteSends = ref([
    {
        Start: 0,
        End: 7,
    },
    {
        Start: 7,
        End: 10,
    },
    {
        Start: 10,
        End: 13,
    },
    {
        Start: 13,
        End: 15,
    },
    {
        Start: 15,
        End: 16,
    },
    {
        Start: 16,
        End: 17,
    },
    {
        Start: 17,
        End: 20,
    },
    {
        Start: 20,
        End: 21,
    },
    {
        Start: 21,
        End: 28,
    },
    {
        Start: 28,
        End: 29,
    },
    {
        Start: 29,
        End: 34,
    },
    {
        Start: 34,
        End: 35,
    },
    {
        Start: 35,
        End: 37,
    },
    {
        Start: 37,
        End: 38,
    },
    {
        Start: 38,
        End: 43,
    },
    {
        Start: 43,
        End: 45,
    },
    {
        Start: 45,
        End: 57,
    },
    {
        Start: 57,
        End: 68,
    },
    {
        Start: 68,
        End: 78,
    },
    {
        Start: 78,
        End: 80,
    },
    {
        Start: 80,
        End: 82,
    },
    {
        Start: 82,
        End: 84,
    },
    {
        Start: 84,
        End: 85,
    },
    {
        Start: 85,
        End: 96,
    },
    {
        Start: 96,
        End: 97,
    },
    {
        Start: 97,
        End: 106,
    },
    {
        Start: 106,
        End: 108,
    },
    {
        Start: 108,
        End: 118,
    },
    {
        Start: 118,
        End: 122,
    },
    {
        Start: 122,
        End: 126,
    },
    {
        Start: 126,
        End: 128,
    },
    {
        Start: 128,
        End: 134,
    },
    {
        Start: 134,
        End: 140,
    },
    {
        Start: 140,
        End: 145,
    },
    {
        Start: 145,
        End: 151,
    },
    {
        Start: 151,
        End: 163,
    },
    {
        Start: 163,
        End: 168,
    },
    {
        Start: 168,
        End: 169,
    },
    {
        Start: 169,
        End: 175,
    },
    {
        Start: 175,
        End: 178,
    },
    {
        Start: 178,
        End: 179,
    },
    {
        Start: 179,
        End: 184,
    },
    {
        Start: 184,
        End: 189,
    },
    {
        Start: 189,
        End: 190,
    },
    {
        Start: 190,
        End: 192,
    },
    {
        Start: 192,
        End: 195,
    },
    {
        Start: 195,
        End: 203,
    },
    {
        Start: 203,
        End: 208,
    },
    {
        Start: 208,
        End: 209,
    },
    {
        Start: 209,
        End: 212,
    },
    {
        Start: 212,
        End: 213,
    },
    {
        Start: 213,
        End: 214,
    },
    {
        Start: 214,
        End: 217,
    },
    {
        Start: 217,
        End: 222,
    },
    {
        Start: 222,
        End: 233,
    },
])

const form = reactive({
    component_type: '',
})

const showregion = ref(false)
const showuorf = ref(false)
const showresSites = ref(false)

function isShowRegion() {
    showregion.value = true
    showuorf.value = false
    showresSites.value = false
}
function isShowUorf() {
    showregion.value = false
    showuorf.value = true
    showresSites.value = false
}
function isShowResSites() {
    showregion.value = false
    showuorf.value = false
    showresSites.value = true
}

const regionList = ref(['a', 'a', 'a'])
regionList.value[0] = componentsRegion.value[0].sequence
regionList.value[1] = componentsRegion.value[1].sequence
regionList.value[2] = componentsRegion.value[2].sequence
console.log(regionList)

const regionSvg = d3.select('#regionArea')
regionSvg
    .selectAll('svg')
    .data(regionList.value)
    .enter()
    .text(function (d, i) {
        return d + i
    })

// const regionTipCont = ref([' ', ' ', ' '])
const uorfTipCont = ref([' ', ' ', ' ', ' '])
// function getTipContent() {
//     regionTipCont.value[0] =
//         `region:\xa0${componentsRegion.value[0].component_class1}\xa0` +
//         `start:` +
//         `\xa0${componentsRegion.value[0].start}\xa0` +
//         `end:` +
//         `\xa0${componentsRegion.value[0].end}\xa0` +
//         `length:` +
//         `\xa0${componentsRegion.value[0].length}`

//     regionTipCont.value[1] =
//         `region:\xa0${componentsRegion.value[1].component_class1}\xa0` +
//         `start:` +
//         `\xa0${componentsRegion.value[1].start}\xa0` +
//         `end:` +
//         `\xa0${componentsRegion.value[1].end}\xa0` +
//         `length:` +
//         `\xa0${componentsRegion.value[1].length}`

//     regionTipCont.value[2] =
//         `region:\xa0${componentsRegion.value[2].component_class1}\xa0` +
//         `start:` +
//         `\xa0${componentsRegion.value[2].start}\xa0` +
//         `end:` +
//         `\xa0${componentsRegion.value[2].end}\xa0` +
//         `length:` +
//         `\xa0${componentsRegion.value[2].length}`
// }

function getTipContentUorf() {
    uorfTipCont.value[0] =
        `start:` +
        `\xa0${componentsUorf.value[0].start}\xa0` +
        `end:` +
        `\xa0${componentsUorf.value[0].end}\xa0` +
        `length:` +
        `\xa0${componentsUorf.value[0].length}\xa0` +
        `type:` +
        `\xa0${componentsUorf.value[0].component_class1},\xa0${componentsUorf.value[0].component_class2}`

    uorfTipCont.value[1] =
        `start:` +
        `\xa0${componentsUorf.value[1].start}\xa0` +
        `end:` +
        `\xa0${componentsUorf.value[1].end}\xa0` +
        `length:` +
        `\xa0${componentsUorf.value[1].length}\xa0` +
        `type:` +
        `\xa0${componentsUorf.value[1].component_class1},\xa0${componentsUorf.value[1].component_class2}`

    uorfTipCont.value[2] =
        `start:` +
        `\xa0${componentsUorf.value[2].start}\xa0` +
        `end:` +
        `\xa0${componentsUorf.value[2].end}\xa0` +
        `length:` +
        `\xa0${componentsUorf.value[2].length}\xa0` +
        `type:` +
        `\xa0${componentsUorf.value[2].component_class1},\xa0${componentsUorf.value[2].component_class2}`

    uorfTipCont.value[3] =
        `start:` +
        `\xa0${componentsUorf.value[3].start}\xa0` +
        `end:` +
        `\xa0${componentsUorf.value[3].end}\xa0` +
        `length:` +
        `\xa0${componentsUorf.value[3].length}\xa0` +
        `type:` +
        `\xa0${componentsUorf.value[3].component_class1},\xa0${componentsUorf.value[3].component_class2}`
}

const isActiveR1 = ref(false)
function hoverTextR1() {
    isActiveR1.value = true
}
function leaveTextR1() {
    isActiveR1.value = false
}

const isActiveR2 = ref(false)
function hoverTextR2() {
    isActiveR2.value = true
}
function leaveTextR2() {
    isActiveR2.value = false
}

const isActiveR3 = ref(false)
function hoverTextR3() {
    isActiveR3.value = true
}
function leaveTextR3() {
    isActiveR3.value = false
}

const isActive1 = ref(false)
const isActive2 = ref(false)
const isActive3 = ref(false)
const isActive4 = ref(false)
const isActive5 = ref(false)

function hoverText1() {
    isActive1.value = true
    isActive2.value = true
}
function leaveText1() {
    isActive1.value = false
    isActive2.value = false
}
function hoverText2() {
    isActive2.value = true
    isActive3.value = true
    isActive4.value = true
    isActive5.value = true
}
function leaveText2() {
    isActive2.value = false
    isActive3.value = false
    isActive4.value = true
    isActive5.value = true
}

function hoverText4() {
    isActive4.value = true
    isActive4.value = true
}
function leaveText4() {
    isActive4.value = false
    isActive4.value = false
}
function hoverText5() {
    isActive5.value = true
}
function leaveText5() {
    isActive5.value = false
}
</script>

<style scoped>
.seqarea {
    width: 1290px;
    height: 400px;
}

.el-row {
    margin-top: 50px;
}

.seq {
    width: 600px;
    height: 200px;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    margin-top: 5px;
    margin-left: 5px;
    margin-right: 5px;
}

.tooltip {
    width: 150px;
    height: 50px;
    margin-left: 300px;
    background-color: aliceblue;
    padding: 5px;
    border: 1px solid var(--el-border-color);
}

.textHover {
    transform: scale(1.2, 1.2);
    transition: 0.3s;
    background-color: rgb(203, 200, 200);
}
</style>

<style lang="scss">
.el-row {
    margin-top: 20px;
    margin-left: 20px;
}
.line {
    position: absolute;
    margin-top: 4px;
    margin-right: 2px;
    width: 2px;
    height: 12px;
    background: red;
    vertical-align: bottom;
    display: inline-block;
}
</style>
