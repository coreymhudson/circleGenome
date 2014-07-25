circleGenome
============

This is a small javascript library, used to print circular genomes, using a .gff file.

**It is designed to have the following API:<br>**
```javascript
features_to_plot = ['tRNA', 'CDS', 'rRNA'];
genome_length = 159662;
genome_name = 'Carsonella ruddii PV';
gff_file = "NC_008512.gff";
features_JSON = readGFF(gff_file);
plotGenome(genome_name, genome_length, features_to_plot, features_JSON);
```

**This will produce the following output:**

![alt tag](https://github.com/coreymhudson/circleGenome/blob/master/carsonella_example.png)
