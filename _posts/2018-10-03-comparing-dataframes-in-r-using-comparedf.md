---
layout: post
category : R
tagline: "Introducing compareDF"
tags : [R, data.frames, package, compare]
---
{% include JB/setup %}

**NOTE: This is a repost of an article that was first published in 2016**

# Introduction

Every so often while doing data analysis, I have come across a situation where I have
two datasets, which have the same structure but with small differences in the actual
data between the two. For example:

* Variation of a dataset across different time periods for the same grouping
* Variation of values for different algorithms, etc.

In the above cases, I want to easily identify what has changed across the two data.frames,
how much has changed, and also hopefully to get a quick summary of the extent of change. There are
packages like the `compare` package on R, which have focused more on the structure of
the data frame and lesser on the data itself. I was not able to easily identify and
isolate what has changed in the data itself. So I decided to write one for myself. That is
what `compareDF` package is all about.

# Usage

The package has a single function, `compare_df`. It takes in two data frames, and one or
more grouping variables and does a comparison between the the two. In addition you can
specify columns to ignore, decide how many rows of changes to be displayed in the case
of the HTML output, and decide what tolerance you want to provide to detect change.

# Basic Example

Let's take the example of a teacher who wants to compare the marks and grades of students across
two years, 2010 and 2011. The data is stored in tabular format.


```r
load("../../compareDF/data/results_2010.rda")
load("../../compareDF/data/results_2011.rda")
print(results_2010)
```

```
##    Division Student Maths Physics Chem Discipline PE Art
## 1         A   Isaac    90      84   91          B  B  34
## 2         A  Akshay    85      92   91          B  B  36
## 3         A Vishwas    93      93   92          A  B  21
## 4         A   Rohit    95      92   71          C  B  37
## 5         A    Venu    99      92   82          A  E  78
## 6         A  Ananth    99      81   91          B  A  24
## 7         B    Jojy    67      92   81          B  A  27
## 8         B   Bulla    84      73   81          C  A  68
## 9         B   Katti    90      95   99          C  B  49
## 10        B Dhakkan    78      96   71          C  C  39
## 11        B   Macho    90      82   81         A+  D  30
## 12        B  Mugger    95      71   94          A  C  26
```

```r
print(results_2011)
```

```
##    Division Student Maths Physics Chem Discipline PE Art
## 1         A   Isaac    90      84   91          A  B  34
## 2         A  Akshay    85      92   91          A  B  36
## 3         A Vishwas    82      93   92          B  B  21
## 4         A   Rohit    94      92   71          D  B  37
## 5         A    Venu   100      92   82          A  E  78
## 6         A  Ananth    78      81   91          B  A  24
## 7         B    Jojy    99      92   81          B  A  27
## 8         B   Bulla    97      73   81          C  A  68
## 9         B   Katti    78      95   99          C  B  49
## 10        B   Rohit    79      96   71          C  C  39
## 11        B   Macho    90      82   81         A+  D  30
## 12        B  Vikram    99      79   98          A  B  99
## 13        B DIkChik    91      71   84          E  C  99
```

The data shows the performance of students in two divisions, A and B for two years. Some subjects
like _Maths, Physics, Chemistry and Art_ are given scores while others like _Discipline and PE_ are
given grades.

It is possible that there are students of the same name in two divisions, for example, there is
a _Rohit_ in both the divisions in 2011.

It is also possible that some students have dropped out, or added new across the two years.
Eg: - _Mugger and Dhakkan_ dropped out while _Vikram and Dikchik_ where added in the Division B

The package allows a user to quickly identify these changes.

## Basic Comparison
Now let's compare the performance of the students across the years. The grouping variables are the
_Student_ column. We will ignore the _Division_ column and assume that the student names are unique
across divisions. In this sub-example, if a student appears in two divisions, he/she has studied in both
of them.


```r
library(compareDF)
ctable_student = compare_df(results_2011, results_2010, c("Student"))
```

```
## Creating comparison table...
```

```
## Loading required namespace: htmlTable
```

```
## Creating HTML table for first 100 rows
```

```r
ctable_student$comparison_df
```

```
##    Student chng_type Division Maths Physics Chem Discipline PE Art
## 1   Akshay         +        A    85      92   91          A  B  36
## 2   Akshay         -        A    85      92   91          B  B  36
## 3   Ananth         +        A    78      81   91          B  A  24
## 4   Ananth         -        A    99      81   91          B  A  24
## 5    Bulla         +        B    97      73   81          C  A  68
## 6    Bulla         -        B    84      73   81          C  A  68
## 7  Dhakkan         -        B    78      96   71          C  C  39
## 8    Isaac         +        A    90      84   91          A  B  34
## 9    Isaac         -        A    90      84   91          B  B  34
## 10    Jojy         +        B    99      92   81          B  A  27
## 11    Jojy         -        B    67      92   81          B  A  27
## 12   Katti         +        B    78      95   99          C  B  49
## 13   Katti         -        B    90      95   99          C  B  49
## 14  Mugger         -        B    95      71   94          A  C  26
## 15   Rohit         +        A    94      92   71          D  B  37
## 16   Rohit         +        B    79      96   71          C  C  39
## 17   Rohit         -        A    95      92   71          C  B  37
## 18    Venu         +        A   100      92   82          A  E  78
## 19    Venu         -        A    99      92   82          A  E  78
## 20 Vishwas         +        A    82      93   92          B  B  21
## 21 Vishwas         -        A    93      93   92          A  B  21
## 22 DIkChik         +        B    91      71   84          E  C  99
## 23  Vikram         +        B    99      79   98          A  B  99
```

By default, no columns are excluded from the comparison, so any of the tuple of grouping
variables which are different across the two data frames are shown in the comparison table.
The `comparison_df` table shows all the rows for which at least one record has changed. Conversely, if
nothing has changed across the two tables, the rows are not displayed. If a new record has been
introduced or a record has been removed, those are displayed as well.

For example, _Akshay, Division A_ has had the exact same scores but has two different grades for _Discipline_ across
the two years so that row is included.

However, _Macho, Division B_ has had the exact same scores in both the years for all subjects, so his data is not
shown in the comparison table.

## HTML Output
While the comparison table can be quickly summarized in various forms for futher analysis, it is
very difficult to  process visually. The `html_output` provides a way to represent this is a way that is easier
for the numan eye to read. NOTE: You need to install the `htmlTable` package for the HTML comparison to work.
_For the purpose of the readme I am attaching the html as a png because github markdown doesn't retain styles._


```r
print(ctable_student$html_output)
```

<table class='gmisc_table' style='border-collapse: collapse; margin-top: 1em; margin-bottom: 1em;' >
<thead>
<tr>
<th style='border-bottom: 1px solid grey; border-top: 2px solid grey; text-align: center;'>Student</th>
<th style='border-bottom: 1px solid grey; border-top: 2px solid grey; text-align: center;'>chng_type</th>
<th style='border-bottom: 1px solid grey; border-top: 2px solid grey; text-align: center;'>Division</th>
<th style='border-bottom: 1px solid grey; border-top: 2px solid grey; text-align: center;'>Maths</th>
<th style='border-bottom: 1px solid grey; border-top: 2px solid grey; text-align: center;'>Physics</th>
<th style='border-bottom: 1px solid grey; border-top: 2px solid grey; text-align: center;'>Chem</th>
<th style='border-bottom: 1px solid grey; border-top: 2px solid grey; text-align: center;'>Discipline</th>
<th style='border-bottom: 1px solid grey; border-top: 2px solid grey; text-align: center;'>PE</th>
<th style='border-bottom: 1px solid grey; border-top: 2px solid grey; text-align: center;'>Art</th>
</tr>
</thead>
<tbody>
<tr style='background-color: #ffffff;'>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>Akshay</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>+</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>85</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>92</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>91</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>36</td>
</tr>
<tr style='background-color: #ffffff;'>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>Akshay</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>-</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>85</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>92</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>91</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>36</td>
</tr>
<tr style='background-color: #dedede;'>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>Ananth</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>+</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>A</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>78</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>81</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>91</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>24</td>
</tr>
<tr style='background-color: #dedede;'>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>Ananth</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>-</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>A</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>99</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>81</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>91</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>24</td>
</tr>
<tr style='background-color: #ffffff;'>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>Bulla</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>+</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>97</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>73</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>81</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>C</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>68</td>
</tr>
<tr style='background-color: #ffffff;'>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>Bulla</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>-</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>84</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>73</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>81</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>C</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>68</td>
</tr>
<tr style='background-color: #dedede;'>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>Dhakkan</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>-</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>B</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>78</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>96</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>71</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>C</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>C</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>39</td>
</tr>
<tr style='background-color: #ffffff;'>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>Isaac</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>+</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>90</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>84</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>91</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>34</td>
</tr>
<tr style='background-color: #ffffff;'>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>Isaac</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>-</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>90</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>84</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>91</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>34</td>
</tr>
<tr style='background-color: #dedede;'>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>Jojy</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>+</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>B</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>99</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>92</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>81</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>27</td>
</tr>
<tr style='background-color: #dedede;'>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>Jojy</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>-</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>B</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>67</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>92</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>81</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>27</td>
</tr>
<tr style='background-color: #ffffff;'>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>Katti</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>+</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>78</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>95</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>99</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>C</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>49</td>
</tr>
<tr style='background-color: #ffffff;'>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>Katti</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>-</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>90</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>95</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>99</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>C</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>49</td>
</tr>
<tr style='background-color: #dedede;'>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>Mugger</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>-</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>B</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>95</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>71</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>94</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>A</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>C</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>26</td>
</tr>
<tr style='background-color: #ffffff;'>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>Rohit</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>+</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>A</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>94</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>92</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>71</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>D</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>37</td>
</tr>
<tr style='background-color: #ffffff;'>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>Rohit</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>+</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>79</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>96</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>71</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>C</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>C</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>39</td>
</tr>
<tr style='background-color: #ffffff;'>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>Rohit</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>-</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>A</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>95</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>92</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>71</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>C</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>37</td>
</tr>
<tr style='background-color: #dedede;'>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>Venu</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>+</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>A</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>100</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>92</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>82</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>E</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>78</td>
</tr>
<tr style='background-color: #dedede;'>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>Venu</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>-</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>A</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>99</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>92</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>82</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>E</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>78</td>
</tr>
<tr style='background-color: #ffffff;'>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>Vishwas</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>+</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>A</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>82</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>93</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>92</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>21</td>
</tr>
<tr style='background-color: #ffffff;'>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>Vishwas</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>-</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>A</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>93</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>93</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>92</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>21</td>
</tr>
<tr style='background-color: #dedede;'>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>DIkChik</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>+</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>B</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>91</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>71</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>84</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>E</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>C</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>99</td>
</tr>
<tr style='background-color: #ffffff;'>
<td style='padding: .2em; color: green; background-color: #ffffff; border-bottom: 2px solid grey; text-align: center;'>Vikram</td>
<td style='padding: .2em; color: green; background-color: #ffffff; border-bottom: 2px solid grey; text-align: center;'>+</td>
<td style='padding: .2em; color: green; background-color: #ffffff; border-bottom: 2px solid grey; text-align: center;'>B</td>
<td style='padding: .2em; color: green; background-color: #ffffff; border-bottom: 2px solid grey; text-align: center;'>99</td>
<td style='padding: .2em; color: green; background-color: #ffffff; border-bottom: 2px solid grey; text-align: center;'>79</td>
<td style='padding: .2em; color: green; background-color: #ffffff; border-bottom: 2px solid grey; text-align: center;'>98</td>
<td style='padding: .2em; color: green; background-color: #ffffff; border-bottom: 2px solid grey; text-align: center;'>A</td>
<td style='padding: .2em; color: green; background-color: #ffffff; border-bottom: 2px solid grey; text-align: center;'>B</td>
<td style='padding: .2em; color: green; background-color: #ffffff; border-bottom: 2px solid grey; text-align: center;'>99</td>
</tr>
</tbody>
</table>

Now it is very easy to see recognize what has changed. A single cell is colored
if it has changed across the two datasets. The value of the cell in the older dataset
is colored red and the value of the cell in the newer dataset is colored green. Cells
that haven't changed across the two datasets are colored grey.

If a new row was introduced, the Row group names (and all the other columns for that row as well )
are colored in Green. Similarly, a row group name (and the other columns in that row) are
colored red if a row was removed.

For Example, _Akshay_, _Ananth_ and _Bulla_ has had changes in
scores, which are in _Discipline_, _Maths_, and _Maths_ respectively.
_Dhakkan_ and _Mugger_ have dropped out of the dataset from 2010 and the all the columns for the rows are shown
in red, which _DikChik_ and _Vikram_ have joined new in the data set and all the columns for the rows are in green.

The same data is represented in tabular form (for further analysis, if necessary) in the
`comparison_table_diff` object


```r
ctable_student$comparison_table_diff
```

```
##    Student chng_type Division Maths Physics Chem Discipline PE Art
## 1        .         +        .     .       .    .          +  .   .
## 2        .         -        .     .       .    .          -  .   .
## 3        .         +        .     +       .    .          .  .   .
## 4        .         -        .     -       .    .          .  .   .
## 5        .         +        .     +       .    .          .  .   .
## 6        .         -        .     -       .    .          .  .   .
## 7        -         -        -     -       -    -          -  -   -
## 8        .         +        .     .       .    .          +  .   .
## 9        .         -        .     .       .    .          -  .   .
## 10       .         +        .     +       .    .          .  .   .
## 11       .         -        .     -       .    .          .  .   .
## 12       .         +        .     +       .    .          .  .   .
## 13       .         -        .     -       .    .          .  .   .
## 14       -         -        -     -       -    -          -  -   -
## 15       .         +        +     +       +    .          +  +   +
## 16       .         +        +     +       +    .          +  +   +
## 17       .         -        -     -       -    .          -  -   -
## 18       .         +        .     +       .    .          .  .   .
## 19       .         -        .     -       .    .          .  .   .
## 20       .         +        .     +       .    .          +  .   .
## 21       .         -        .     -       .    .          -  .   .
## 22       +         +        +     +       +    +          +  +   +
## 23       +         +        +     +       +    +          +  +   +
```

## Change Count and Summary
You can get an details of what has changed for each group using
the `change_count` object in the output. A summary
of the same is provided in the `change_summary` object.


```r
ctable_student$change_count
```

```
## Source: local data frame [13 x 4]
##
##    Student changes additions removals
##     (fctr)   (dbl)     (dbl)    (dbl)
## 1   Akshay       1         0        0
## 2   Ananth       1         0        0
## 3    Bulla       1         0        0
## 4  Dhakkan       0         1        0
## 5    Isaac       1         0        0
## 6     Jojy       1         0        0
## 7    Katti       1         0        0
## 8   Mugger       0         1        0
## 9    Rohit       1         0        1
## 10    Venu       1         0        0
## 11 Vishwas       1         0        0
## 12 DIkChik       0         0        1
## 13  Vikram       0         0        1
```


```r
ctable_student$change_summary
```

```
##   old_obs   new_obs   changes additions  removals
##        12        13         9         2         3
```

## Grouping Multiple Columns

We can also group_multiple columns into the grouping variable


```r
ctable_student_div = compare_df(results_2011, results_2010, c("Division", "Student"))
```

```
## Grouping grouping columns
```

```
## Creating comparison table...
```

```
## Creating HTML table for first 100 rows
```

```r
ctable_student_div$html_output
```

<table class='gmisc_table' style='border-collapse: collapse; margin-top: 1em; margin-bottom: 1em;' >
<thead>
<tr>
<th style='border-bottom: 1px solid grey; border-top: 2px solid grey; text-align: center;'>grp</th>
<th style='border-bottom: 1px solid grey; border-top: 2px solid grey; text-align: center;'>chng_type</th>
<th style='border-bottom: 1px solid grey; border-top: 2px solid grey; text-align: center;'>Division</th>
<th style='border-bottom: 1px solid grey; border-top: 2px solid grey; text-align: center;'>Student</th>
<th style='border-bottom: 1px solid grey; border-top: 2px solid grey; text-align: center;'>Maths</th>
<th style='border-bottom: 1px solid grey; border-top: 2px solid grey; text-align: center;'>Physics</th>
<th style='border-bottom: 1px solid grey; border-top: 2px solid grey; text-align: center;'>Chem</th>
<th style='border-bottom: 1px solid grey; border-top: 2px solid grey; text-align: center;'>Discipline</th>
<th style='border-bottom: 1px solid grey; border-top: 2px solid grey; text-align: center;'>PE</th>
<th style='border-bottom: 1px solid grey; border-top: 2px solid grey; text-align: center;'>Art</th>
</tr>
</thead>
<tbody>
<tr style='background-color: #ffffff;'>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>1</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>+</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>Akshay</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>85</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>92</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>91</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>36</td>
</tr>
<tr style='background-color: #ffffff;'>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>1</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>-</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>Akshay</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>85</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>92</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>91</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>36</td>
</tr>
<tr style='background-color: #dedede;'>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>2</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>+</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>Ananth</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>78</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>81</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>91</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>24</td>
</tr>
<tr style='background-color: #dedede;'>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>2</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>-</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>Ananth</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>99</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>81</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>91</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>24</td>
</tr>
<tr style='background-color: #ffffff;'>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>3</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>+</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>Isaac</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>90</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>84</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>91</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>34</td>
</tr>
<tr style='background-color: #ffffff;'>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>3</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>-</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>Isaac</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>90</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>84</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>91</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>34</td>
</tr>
<tr style='background-color: #dedede;'>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>4</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>+</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>Rohit</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>94</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>92</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>71</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>D</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>37</td>
</tr>
<tr style='background-color: #dedede;'>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>4</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>-</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>Rohit</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>95</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>92</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>71</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>C</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>37</td>
</tr>
<tr style='background-color: #ffffff;'>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>5</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>+</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>Venu</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>100</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>92</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>82</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>E</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>78</td>
</tr>
<tr style='background-color: #ffffff;'>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>5</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>-</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>Venu</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>99</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>92</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>82</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>E</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>78</td>
</tr>
<tr style='background-color: #dedede;'>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>6</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>+</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>Vishwas</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>82</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>93</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>92</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>21</td>
</tr>
<tr style='background-color: #dedede;'>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>6</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>-</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>Vishwas</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>93</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>93</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>92</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>21</td>
</tr>
<tr style='background-color: #ffffff;'>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>7</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>+</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>Bulla</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>97</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>73</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>81</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>C</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>68</td>
</tr>
<tr style='background-color: #ffffff;'>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>7</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>-</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>Bulla</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>84</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>73</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>81</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>C</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>68</td>
</tr>
<tr style='background-color: #dedede;'>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>8</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>+</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>B</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>DIkChik</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>91</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>71</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>84</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>E</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>C</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>99</td>
</tr>
<tr style='background-color: #ffffff;'>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>9</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>+</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>Jojy</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>99</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>92</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>81</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>27</td>
</tr>
<tr style='background-color: #ffffff;'>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>9</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>-</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>Jojy</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>67</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>92</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>81</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>27</td>
</tr>
<tr style='background-color: #dedede;'>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>10</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>+</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>Katti</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>78</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>95</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>99</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>C</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>49</td>
</tr>
<tr style='background-color: #dedede;'>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>10</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>-</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>Katti</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>90</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>95</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>99</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>C</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>49</td>
</tr>
<tr style='background-color: #ffffff;'>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>12</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>+</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>Rohit</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>79</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>96</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>71</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>C</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>C</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>39</td>
</tr>
<tr style='background-color: #dedede;'>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>13</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>+</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>B</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>Vikram</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>99</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>79</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>98</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>A</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>B</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>99</td>
</tr>
<tr style='background-color: #ffffff;'>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>14</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>-</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>Dhakkan</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>78</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>96</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>71</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>C</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>C</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>39</td>
</tr>
<tr style='background-color: #dedede;'>
<td style='padding: .2em; color: red; background-color: #dedede; border-bottom: 2px solid grey; text-align: center;'>15</td>
<td style='padding: .2em; color: red; background-color: #dedede; border-bottom: 2px solid grey; text-align: center;'>-</td>
<td style='padding: .2em; color: red; background-color: #dedede; border-bottom: 2px solid grey; text-align: center;'>B</td>
<td style='padding: .2em; color: red; background-color: #dedede; border-bottom: 2px solid grey; text-align: center;'>Mugger</td>
<td style='padding: .2em; color: red; background-color: #dedede; border-bottom: 2px solid grey; text-align: center;'>95</td>
<td style='padding: .2em; color: red; background-color: #dedede; border-bottom: 2px solid grey; text-align: center;'>71</td>
<td style='padding: .2em; color: red; background-color: #dedede; border-bottom: 2px solid grey; text-align: center;'>94</td>
<td style='padding: .2em; color: red; background-color: #dedede; border-bottom: 2px solid grey; text-align: center;'>A</td>
<td style='padding: .2em; color: red; background-color: #dedede; border-bottom: 2px solid grey; text-align: center;'>C</td>
<td style='padding: .2em; color: red; background-color: #dedede; border-bottom: 2px solid grey; text-align: center;'>26</td>
</tr>
</tbody>
</table>

Now _Rohits_ in each individual division are considered as belonging to separate
groups and compared accordingly. All the other summaries also change appropriately.

## Excluding certain Columns

You can ignore certain columns using the *exclude* parameter. The fields that have to be
excluded can be given as a character vector. (This is a convenience function to deal with
the case where some columns are not included)

## Limiting HTML size

For dataframes which have a large amount of differences in them, generating HTML might take
a long time and crash your system. So the maximum diff size for the HTML (and for the HTML
visualization only) is capped at 100 by default. If you want to see more difference, you can change
the `limit_html` parameter appropriately. NOTE: This is only of the HTML output which is used for visual
checking. The main comparison data frame and the summaries ALWAYS include data from all the rows.


## Tolerance

It is possible that you'd like numbers very close to each other to be ignored. For example,
if the marks of a student vary by less that 5% across the years, it could be due to random
error and not any real performance indictaor. In such a case, you would want to give a tolerance
parameter. For this case, giving a tolerance of `0.05` would ignore all the changes that are
less than 5% apart from the lower value.


```r
ctable_student_div = compare_df(results_2011, results_2010, c("Division", "Student"), tolerance = 0.05)
```

```
## Grouping grouping columns
```

```
## Creating comparison table...
```

```
## Creating HTML table for first 100 rows
```

```r
ctable_student_div$html_output
```

<table class='gmisc_table' style='border-collapse: collapse; margin-top: 1em; margin-bottom: 1em;' >
<thead>
<tr>
<th style='border-bottom: 1px solid grey; border-top: 2px solid grey; text-align: center;'>grp</th>
<th style='border-bottom: 1px solid grey; border-top: 2px solid grey; text-align: center;'>chng_type</th>
<th style='border-bottom: 1px solid grey; border-top: 2px solid grey; text-align: center;'>Division</th>
<th style='border-bottom: 1px solid grey; border-top: 2px solid grey; text-align: center;'>Student</th>
<th style='border-bottom: 1px solid grey; border-top: 2px solid grey; text-align: center;'>Maths</th>
<th style='border-bottom: 1px solid grey; border-top: 2px solid grey; text-align: center;'>Physics</th>
<th style='border-bottom: 1px solid grey; border-top: 2px solid grey; text-align: center;'>Chem</th>
<th style='border-bottom: 1px solid grey; border-top: 2px solid grey; text-align: center;'>Discipline</th>
<th style='border-bottom: 1px solid grey; border-top: 2px solid grey; text-align: center;'>PE</th>
<th style='border-bottom: 1px solid grey; border-top: 2px solid grey; text-align: center;'>Art</th>
</tr>
</thead>
<tbody>
<tr style='background-color: #ffffff;'>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>1</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>+</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>Akshay</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>85</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>92</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>91</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>36</td>
</tr>
<tr style='background-color: #ffffff;'>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>1</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>-</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>Akshay</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>85</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>92</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>91</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>36</td>
</tr>
<tr style='background-color: #dedede;'>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>2</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>+</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>Ananth</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>78</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>81</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>91</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>24</td>
</tr>
<tr style='background-color: #dedede;'>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>2</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>-</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>Ananth</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>99</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>81</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>91</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>24</td>
</tr>
<tr style='background-color: #ffffff;'>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>3</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>+</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>Isaac</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>90</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>84</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>91</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>34</td>
</tr>
<tr style='background-color: #ffffff;'>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>3</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>-</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>Isaac</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>90</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>84</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>91</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>34</td>
</tr>
<tr style='background-color: #dedede;'>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>4</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>+</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>Rohit</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>94</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>92</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>71</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>D</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>37</td>
</tr>
<tr style='background-color: #dedede;'>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>4</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>-</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>Rohit</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>95</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>92</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>71</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>C</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>37</td>
</tr>
<tr style='background-color: #ffffff;'>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>6</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>+</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>Vishwas</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>82</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>93</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>92</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>21</td>
</tr>
<tr style='background-color: #ffffff;'>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>6</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>-</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>Vishwas</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>93</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>93</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>92</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>21</td>
</tr>
<tr style='background-color: #dedede;'>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>7</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>+</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>Bulla</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>97</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>73</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>81</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>C</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>68</td>
</tr>
<tr style='background-color: #dedede;'>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>7</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>-</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>Bulla</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>84</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>73</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>81</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>C</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>68</td>
</tr>
<tr style='background-color: #ffffff;'>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>8</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>+</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>DIkChik</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>91</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>71</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>84</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>E</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>C</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>99</td>
</tr>
<tr style='background-color: #dedede;'>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>9</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>+</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>Jojy</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>99</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>92</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>81</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>27</td>
</tr>
<tr style='background-color: #dedede;'>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>9</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>-</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>Jojy</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>67</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>92</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>81</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>A</td>
<td style='padding: .2em; color: grey; background-color: #dedede; text-align: center;'>27</td>
</tr>
<tr style='background-color: #ffffff;'>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>10</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>+</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>Katti</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>78</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>95</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>99</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>C</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>49</td>
</tr>
<tr style='background-color: #ffffff;'>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>10</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>-</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>Katti</td>
<td style='padding: .2em; color: red; background-color: #ffffff; text-align: center;'>90</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>95</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>99</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>C</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: grey; background-color: #ffffff; text-align: center;'>49</td>
</tr>
<tr style='background-color: #dedede;'>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>12</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>+</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>B</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>Rohit</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>79</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>96</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>71</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>C</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>C</td>
<td style='padding: .2em; color: green; background-color: #dedede; text-align: center;'>39</td>
</tr>
<tr style='background-color: #ffffff;'>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>13</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>+</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>Vikram</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>99</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>79</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>98</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>A</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>B</td>
<td style='padding: .2em; color: green; background-color: #ffffff; text-align: center;'>99</td>
</tr>
<tr style='background-color: #dedede;'>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>14</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>-</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>B</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>Dhakkan</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>78</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>96</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>71</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>C</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>C</td>
<td style='padding: .2em; color: red; background-color: #dedede; text-align: center;'>39</td>
</tr>
<tr style='background-color: #ffffff;'>
<td style='padding: .2em; color: red; background-color: #ffffff; border-bottom: 2px solid grey; text-align: center;'>15</td>
<td style='padding: .2em; color: red; background-color: #ffffff; border-bottom: 2px solid grey; text-align: center;'>-</td>
<td style='padding: .2em; color: red; background-color: #ffffff; border-bottom: 2px solid grey; text-align: center;'>B</td>
<td style='padding: .2em; color: red; background-color: #ffffff; border-bottom: 2px solid grey; text-align: center;'>Mugger</td>
<td style='padding: .2em; color: red; background-color: #ffffff; border-bottom: 2px solid grey; text-align: center;'>95</td>
<td style='padding: .2em; color: red; background-color: #ffffff; border-bottom: 2px solid grey; text-align: center;'>71</td>
<td style='padding: .2em; color: red; background-color: #ffffff; border-bottom: 2px solid grey; text-align: center;'>94</td>
<td style='padding: .2em; color: red; background-color: #ffffff; border-bottom: 2px solid grey; text-align: center;'>A</td>
<td style='padding: .2em; color: red; background-color: #ffffff; border-bottom: 2px solid grey; text-align: center;'>C</td>
<td style='padding: .2em; color: red; background-color: #ffffff; border-bottom: 2px solid grey; text-align: center;'>26</td>
</tr>
</tbody>
</table>

_Venu from division A_ who had a score change from 100 to 99 is no longer present in the
diff calculation or in the output

Naturally, tolerance has no meaning for non-numeric values.

## Acknowledgements

I'd like to thank System Insights Inc. for all the things that I have learned while working
there which I have used one way or the other in this package. Special thanks to Nitin for
proofreading the doc and making sure everything made sense.

_A version of this blog has been published as the README for the [package](https://github.com/alexsanjoseph/compareDF)._
