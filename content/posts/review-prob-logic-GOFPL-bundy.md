---
title: "A Review of Probabilistic Logic: GOFPL - Bundy"
date: 2022-07-31T20:44:42+01:00
draft: false
---


In the last section, we saw Nilsson proposed his probabilistic logic by assigning probabilities to possible worlds, and then assigning possible worlds to propositions. Therefore, identifying dependency relationships among propositions can be reduced to set operations of possible worlds. Nearly meanwhile, Alan Bundy leveraged the same idea to design his mechanism for probabilistic reasoning: Incidence Calculus. Here the term "incidence" is Bundy's name for the possible world. In fact, the first formal paper on  Incidence Calculus was published in 1985, even one year ahead of Nilsson's formal paper on Probabilistic Logic. 

The subtle difference between Incidence Calculus and Probabilistic Logic is that Probabilistic Logic only uses probabilities of possible worlds $Pr(w)$ as placeholders to set up a linear program, and doesn't care about the exact value of the probabilities. Incidence Calculus cares more about the exact probabilities of possible worlds. When using Incidence Calculus, we want to know how many incidences are used, what are the probabilities of each incidence, and what incidences are assigned to which propositions. With this information, we can easily work out the probabilities of a conclusion given the probabilistic premises.

### Definitions

We define $\Phi = \{\phi_1,\dots,\phi_n\}$ as all the primitive propositions (the propositions NOT containing any logical connectives like $\land, \lor, \Rightarrow, \neg$), and define $\mathcal{L}(\Phi)$ as all the propositions that can be derived from $\Phi$ (the logical closure under conjunction $\land$ and negation $\neg$). Then, we define $W = \{w_1,\dots,w_N\}$ as all the possible worlds. In the last section, we use a semantic table to show which propositions are true in which possible worlds. Here we use the incidence function $i(\phi)$to represent all the possible worlds in which the proposition $\phi$ is true:

$$
i: \mathcal{L}(\Phi) \rightarrow 2^{W}
$$

such that 

$$
\forall \phi \in \mathcal{L}(\Phi), i(\phi)=\{w|w \in W \land w \vDash \phi\}
$$

and we have the following basic relations of propositions and their possible worlds:

$$
\begin{align*}&i(\neg\phi) = W \backslash i(\phi) 
\\\\&i(\phi_1 \land \phi_2) = i(\phi_1) \cap i(\phi_2) 
\\\\&i(\phi_1 \lor \phi_2) = i(\phi_1) \cup i(\phi_2) 
\\\\&i(T) = W \\&i(F) = \emptyset\end{align*}
$$

The probability of a proposition is the sum of probabilities of its supporting incidences:

$$
Pr(\phi) = \sum_{w \in i(\phi)} Pr(w)
$$

The idea here is that we not only ask for probabilities of propositions, but also ask for the correlation information explicitly specified by the incidence function. Recall that the key challenge of probabilistic logic is handling dependency relationships. In Nilsson's Probabilistic Logic, knowing merely $Pr(\phi_1)$ and $Pr(\phi_2)$ is not sufficient to compute the exact $Pr(\phi_1 \land \phi_2)$ due to lack of dependency information. Incidence Calculus provides a mechanism, the incidence function, to encode the dependency relationships. Knowing $i(\phi_1)$ and $i(\phi_1)$ suffices to work out $i(\phi_1 \land \phi_2)$, and thus $Pr(\phi_1 \land \phi_2)$.

So far so good. The theory is elegant. Now, we consider some practical problems.

Firstly, sometimes we don't have the incidences assignment of all primitive propositions $\Phi = \{\phi_1,\dots,\phi_n\}$. What we have might just be incidences of some primitive propositions, and perhaps some composite propositions. Let's denote $\mathcal{A}$ as the set of propositions that are assigned explicitly incidence, and $\mathcal{L}(\mathcal{A})$ as all the propositions that can be derived from $\mathcal{A}$. We can easily work out the incidence, and thus the probabilities for propositions in $\mathcal{L}(\mathcal{A})$, but not for the propositions in $\mathcal{L}(\Phi) \backslash \mathcal{L}(\mathcal{A})$. What we can do is merely find out the upper bound and lower bound of them.

$$
i_*(\varphi) = \cup_{\psi \in \mathcal{L}(\mathcal{A})} \{i(\psi)|\psi \vDash \varphi\}
$$

$$
i^*(\varphi) = \cap_{\psi \in \mathcal{L}(\mathcal{A})} \{i(\psi)|\varphi \vDash \psi\}
$$

Within the above two definitions, $\varphi \vDash \psi$ means "whenever $\varphi$ is true $\psi$ must be true", and this means $i(\varphi) \subset i(\psi)$. Therefore, the upper bound  $i^*(\varphi)$ is the intersection of all incidence of propositions that can entail $\varphi$, and the lower bound $i_ *(\varphi)$ is the union of all incidence of propositions that can entail $\varphi$.

$$
i^*(\varphi) \subseteq i(\varphi) \subseteq i_ *(\varphi)
$$

$$
Pr^*(\varphi) \le Pr(\varphi) \le Pr_ *(\varphi)
$$

By these definitions and laws, we can compute the probabilities of all propositions in $\mathcal{L}(\Phi)$, and the time complexity is linear to the number of propositions in $\mathcal{L}(\mathcal{A})$, which is exponential to the number of propositions in $\mathcal{A}$. And the more propositions we have in $\mathcal{L}(\mathcal{A})$, the tighter bounds we can derive for propositions in $\mathcal{L}(\Phi) \backslash \mathcal{L}(\mathcal{A})$, but the more time we need to figure out the result.

**Example 2.1**

Now we are given such 3 propositions, 7 equally probable incidences, and 2 incidence assignments:

$$
\begin{align*}
& \Phi = \\{rainy, sunny, windy\\} 
\\\\& W = \\{mon, tue, wed, thu, fri, sat, sun\\} 
\\\\& Pr(mon) = Pr(tue) = \dots =Pr(sun) = \frac{1}{7} 
\\\\& i(rainy) = \\{fir, sat, sun, mon\\} 
\\\\& i(windy) = \\{mon, wed, fri\\}
\end{align*}
$$

The question is, what are the probabilities of the following 2 propositions:

$$
\begin{align*}
& \varphi_1 = \neg windy \land rainy 
\\\\& \varphi_2=(sunny \lor windy) \land \neg rainy
\end{align*}
$$

Using Incidence Calculus to compute the probabilities of a proposition, we shall first find out the incidences of that proposition, and sum up the probabilities of the incidences. For $\varphi_1$, 

$$
\begin{align*}
i(\varphi_1) &= i(\neg windy) \cap i(rainy) 
\\\\ &= W \backslash i(windy) \cap i(rainy) 
\\\\ &= \{tue, thu, sat, sun\} \cap \{thu,sat,sun,mon\} 
\\\\ &= \{sat, sun\} \\ Pr(\varphi_1) 
\\\\&= Pr(sat)+Pr(sun) = \frac{2}{7}
\end{align*}
$$

It is easy to work with $\varphi_1$, but for $\varphi_2$, things become more tricky because we don't know the exact incidence assignment of$windy$. Thus, we can only find the lower and upper bounds of $\varphi_2$. The lower bound is

$$
i_*(\varphi_2) = \cup_{\psi \in \mathcal{L}(\mathcal{A})} \\{i(\psi)|\psi \vDash \varphi_2\\}= \\{wed\\}
$$

as only $windy \land \neg rainy$ can entail $\varphi_2$, and $i(windy \land \neg rainy) = \\{wed\\}$.

The upper bound is 

$$
i^*(\varphi_2) = \cap_{\psi \in \mathcal{L}(\mathcal{A})} \\{i(\psi)|\varphi_2 \vDash \psi\\}= \\{tue, wed, thu\\} \\
$$

as only $\neg rainy$ can be entailed from $\varphi_2$, and $i(\neg rainy) = \\{tue, wed, thu\\}$

However, another practical problem comes. Our elegant approach asks for incidences of propositions $i(\phi)$, and the exact probabilities of incidences $Pr(w)$. However, in most cases, we only know the probabilities assigned directly to some propositions $Pr(\phi)$, but know neither the incidences of propositions, nor the probabilities of incidences. How can we carry on with such situations? Well, we have to assign incidences to propositions and find a probability measure that can reproduce the original probabilities. This procedure is called incidence assignment.

In Bundy's original paper, no formal algorithm is given on how to automatically derive the incidence assignment according to the probabilistic propositions. One brute-force idea is to enumerate all the possible incidence assignments and choose those that satisfy the constraints posed by the given probabilistic propositions. Or we can do some case studies and empirically come up with a reasonable incidence assignment. In subsequent studies, some algorithms based on tree search and Monte Carlo methods were proposed to automate the procedure of finding all valid incidence calculus.

In a later archival book written by Liu, an efficient algorithm was presented to solve this problem. The authors first generalized the Incidence Calculus and come up with the notion of *basic incidence assignment*. Then, it was shown that for one set of probabilistic propositions, there is one and only one basic incidence assignment. From this basic incidence assignment, we can subsume all other valid incidence assignments.


[^1]; Bundy, A. (1985). Incidence calculus: a mechanism for probabilistic reasoning. *Journal of automated reasoning*, *1*(3), 263-283.

