---
title: "A Review of Probabilistic Logic: SRL - MLN"
date: 2022-07-31T22:17:26+01:00
draft: false
---


Markov Logic Network[^1] (MLN) allows users to write down a set of first-order formulas, and assign weights to every formula. These weighted formulas then serve as a set of templates to automatically construct a Markov Network, on which probabilistic inference can be performed.

Since MLN works on first-order logic, concepts including constants, variables, predicates, functions, literals, formulas, and sentences come back. Readers can go back to Bachuss' Lp for a refresh. 

Traditional logical formulas can be regarded as hard constraints, such that only the worlds fully satisfying these hard constraints are possible, while those violating any of the constraints are totally impossible. The basic idea of MLN is to soften these logical constraints so that the worlds violating these constraints are just less possible, not totally impossible. The weights assigned to these formulas indicate how soft (or how hard) these constraints are. The lower the weights, the softer the constraints. If the weight of formula is positive infinity, then this formula becomes a hard constraint, because any world violating such a constraint will be totally impossible. Below are some examples of weighted formulas:

![Example of MLN formulas](/images/MLN-formulas.png)

Note that weighted formulas are merely templates. To construct a Markov Network, we need to replace the variables in the formulas with constants, i.e., ground the formulas. Take the following 3 formulas for example.

|Formula|Weight|
|:----|:----|
|$\neg Sm(x) \lor Ca(x)$|1.5|
|$\neg Fr(x, y) \lor Sm(x) \lor \neg Sm(y)$|1.1|
|$\neg Fr(x, y) \lor \neg Sm(x) \lor  Sm(y)$|1.1|

Ground them with constants $A$ and $B$, standing for two person Anna and Bob, yielding the below sentences:

|Sentence|Weight|
|:----|:----|
|$\neg Sm(A) \lor Ca(A)$|1.5|
|$\neg Sm(B) \lor Ca(B)$|1.5|
|$\neg Fr(A, B) \lor Sm(A) \lor \neg Sm(B)$|1.1|
|$\neg Fr(B, A) \lor Sm(B) \lor \neg Sm(A)$|1.1|
|$\neg Fr(A, A) \lor Sm(A) \lor \neg Sm(A)$|1.1|
|$\neg Fr(B, B) \lor Sm(B) \lor \neg Sm(B)$|1.1|
|$\neg Fr(A, B) \lor \neg Sm(A) \lor  Sm(B)$|1.1|
|$\neg Fr(B, A) \lor \neg Sm(B) \lor  Sm(A)$|1.1|
|$\neg Fr(A, A) \lor \neg Sm(A) \lor  Sm(A)$|1.1|
|$\neg Fr(B, B) \lor \neg Sm(B) \lor  Sm(A)$|1.1|

Extracting the atoms that appear in the sentences as nodes, and drawing edges between two atoms if they co-occur in the same sentences, yields the following graph structure. Each node is a random variable that takes only 0 or 1. Each edge indicates that the two connected random variables are directly inter-dependent.

![Example MLN fragment](/images/MLN-excerpt.png)

After grounding, we have a set of weighted sentences (formulas without variables). These weighted sentences constitute a Markov Network. We define the probability distribution of the constructed Markov Network as 

$$
Pr(\boldsymbol{X}=\boldsymbol{x}) = \frac{1}{Z}\exp \Big( \sum_{i}w_i n_i(\boldsymbol{x}) \Big)
$$

where $Z =\sum_{\boldsymbol{x} \in \boldsymbol{X}} \exp \Big( \sum_{i}w_i n_i(\boldsymbol{x}) \Big)$ is just a normalising constant, $\boldsymbol{x}$ represents a possible world, $w_i$ represents the weight of the $i$th formula, and $n_i(\boldsymbol{x})$ represents the number of true sentences generated after grounding the $i$th formula. For example, if in a certain possible world $\boldsymbol{x}$, $Sm(A), Sm(A), Ca(A)$ are true while $Ca(B)$ is false, then the grounding formula $F_i = \neg Sm(x) \lor Ca(x)$ yields two sentences: $\neg Sm(A) \lor Ca(A)$, which is true, and $\neg Sm(B) \lor Ca(B)$, which is false. For this formula $F_i$, the number of true groundings is 1 $n_i(\boldsymbol{x})=1$.

From the perspective of machine learning, we can consider that every logical formula defines a feature for a possible world. The linear combination $\Big( \sum_{i}w_i n_i(\boldsymbol{x}) \Big)$ combines the feature values, and the outer part $P(\boldsymbol{X}=\boldsymbol{x}) = \frac{1}{Z}\exp \Big( . \Big)$ transforms the combined feature values to be probabilities of a possible world.

How do we use this probability distribution to tackle the central question $\phi_1^{p_1},\dots,\phi_n^{p_n}|\!\!\!\approx \psi^?$ Since the MLN defines a probability distribution over possible worlds, we can tackle the central question following the idea of Nilsson's Probabilistic Logic. That is, identify all the possible worlds in which $\psi$ is true, then sum up the probabilities of these possible worlds: $Pr(\psi)=\sum_{\{\boldsymbol{x} |\boldsymbol{x} \vDash\psi \}}Pr(\boldsymbol{X}=\boldsymbol{x})$. 

In detail, if all the premises are already sentences, and assigned a single-value probability, then we can directly treat these premises $\phi_i$ as the formulas $F_i$ in MLN, and convert the probabilities into weights $w_i=ln(\frac{p_i}{1-p_i})$. If the premises are formulas containing variables, then we can first ground them into sentences, and convert the probabilities into weights. Note that we can only convert the probabilities into weights when each variable appears only in one formula. If variables are shared among multiple formulas, we lose this one-to-one mapping, and we had to learn the weights from training data. The required training data are in the form of 

|Atom|Label|
|:----|:----|
|Sm(A)|T|
|Sm(B)|T|
|Ca(A)|T|
|Ca(B)|F|
|......|......|

The table above constitutes one observation of a possible world, i.e., one truth assignment to all the atoms. We can compute the weights by means of Maximum Likelihood Estimation, that is, to find the optimal weights that make the distribution output the maximum likelihood for the observations. By the definition of the probability distribution, the weights can be computed with training data via the equation below:

$$
\frac{\partial\ ln Pr(\boldsymbol{X}=\boldsymbol{x})}{\partial w_i} = n_i(\boldsymbol{x}) - \sum_{\boldsymbol{x'}} Pr(\boldsymbol{X}=\boldsymbol{x'})n_i(\boldsymbol{x'})
$$

In this section, we very briefly outline the Markov Logic Network, mainly its definition and how to use it to tackle the central question. We mentioned one way to learn the weights of an MLN given some training data. However, MLN is an extensively studied formalism. We did not cover the many properties of MLN in this section. What's more, researchers proposed much more efficient probabilistic inferences and weight learning algorithms that scale up and speed up the MLN to large problems. Interested readers should refer to the original paper and subsequent publications.

[^1]: Richardson, M., & Domingos, P. (2006). Markov logic networks. *Machine learning*, *62*(1), 107-136.
