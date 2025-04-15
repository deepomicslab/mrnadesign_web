<!-- # Linear Design

# Prediction

# Safety

# Sequence Align

# Antigen Screening -->

# TSA

**Tumor-specific antigens (TSAs) identification**

Pipeline from [TSApipe](https://github.com/lilab-qw/TSApipe), **Identification of TSA candidates** of which deployed in the platform. Test data from [HGSC3](https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE131880).

Users should provide following inputs and reference files to run the analysis. Or they can also try our provided sample **HGSC3** case with the mutation type **spe**, which runs around 33min. Below is an example file structures. Users should provide the corresponding references and name them as expected.

```txt
- input 
    - upload/HGSC-spe.txt
- output
    - output/control-jf-csv/spe/HSGC3.control.jf.csv
    - output/HGSC3.spe*
    - output/HGSC3*
- references
    - tsa_data/spe-assembly.fasta-input/HGSC3.assembly.fasta
    - tsa_data/trim.24.jf-input/control.trim.24.jf
    - tsa_data/trim.24.jf-input/HGSC3.trim.24.jf
    - resources/control-fasta-csv/HSGC3.control.fasta.csv
    - resources/HLA/HGSC3.hlaI.txt
    - resources/control_control_reformat_70char.fasta
```