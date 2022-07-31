---
title: "A Review of Probabilistic Logic: SRL - Intro"
date: 2022-07-31T22:12:48+01:00
draft: false
---


In this part, we introduce a bunch of theories combining logic and probability that emerged in the late 1990s, called Statistical Relational Learning (SRL). As the name indicates, SRL studies how to learn and exploit the statistical structure among relational data (or tabular data, a set of data in the form of a table). 

Recall that the central question in probabilistic logic is $\phi_1^{X_1},\dots,\phi_n^{X_n}|\!\!\!\approx \psi^Y$, and the key challenge is  handling dependency relationships. Most SRL theories tackle the central question by building a joint probability distribution of all propositions $Pr(\phi_1, ..., \phi_n, \psi)$, so the central question can be rephrased as calculating the marginal probability of the conclusion $\psi$:

$$
Pr(\psi) = \sum_{\phi_1 \in \{T,F\}}...\sum_{\phi_n \in \{T,F\}}Pr(\phi_1, ..., \phi_n, \psi)
$$

With this joint probability distribution, SRL can do even more, such as calculating the conditional probability of the conclusion $$\psi$$ given some premises $\phi$ are observed to be true (false) $Pr( \psi|...,\phi_i=T, \phi_j=F,...)$.

Apart from these additional probabilistic inference capabilities, SRL can provide a single value probability as the result, while GOFPL usually can only provide a probability interval of the conclusion. SRL can do so because it encodes (or aims to encode) the exact dependency relationships among probabilistic propositions, which was not done by GOFPL. To do so, SRL makes assumptions that GOFPL didn't make and asks for more inputs that GOFPL didn't need. 

As we mentioned, Most SRL theories build a joint probability distribution of all propositions $Pr(\phi_1, ..., \phi_n, \psi)$. If no more information is provided, then potentially every proposition may directly depend on all other propositions. If we represent the distribution $Pr(\phi_1, ..., \phi_n, \psi)$ as a table, there will be $2^{n+1}$ table probability entries. This is very similar to the possible world semantics introduced in Nilsson's Probabilistic Logic. 

GOFPL fully recognises these potential dependency relationships, but doesn't know exactly how they are inter-dependent, so GOFPL can only compute a probability interval. However, SRL makes the assumption that all propositions are independent, unless explicitly specified (often via logical rules or constraints). Thus, $Pr(\phi_1 \land \phi_2)=Pr(\phi_1)Pr(\phi_2)$ holds in SRL, unless it is explicitly stated that $\phi_1$ and $\phi_2$ are correlated.

To compute the single value probability, we need to know not only what propositions depend on what others, but also need to know the numerical correlation information. this kind of information is usually encoded as conditional probabilities $Pr(\phi_i|\phi_j)$, or some weights that parameterised the distribution $Pr(\phi_i|\boldsymbol{w})$. Historical sample data are required to calculate this numerical information, which is not needed for GOFPL.

Most SRL theories either extend the classical logic programming with probabilistic semantics and inference mechanisms or construct probabilistic graphical models using logical knowledge. Therefore, readers should be familiar with logic programming, especially the terminologies for Prolog programming, and get accustomed to probabilistic graphical models, particularly Bayesian Network and Markov Network.